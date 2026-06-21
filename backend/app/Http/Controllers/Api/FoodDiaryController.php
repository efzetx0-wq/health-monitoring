<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodDiary;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FoodDiaryController extends Controller
{
    /**
     * Menampilkan semua riwayat makanan milik user yang sedang login.
     */
    public function index()
    {
        // Mengambil data mentah tanpa relasi table foods lama
        $diaries = FoodDiary::where('user_id', Auth::id())
            ->latest()
            ->get();
            
        return response()->json($diaries);
    }

    /**
     * Menerima input teks bebas, meminta hitungan kalori ke Groq AI, dan menyimpan ke DB.
     */
    public function store(Request $request)
    {
        // 1. Validasi input yang dikirim oleh React baru
        $request->validate([
            'food_name'   => 'required|string',
            'portion'     => 'required|string',
            'consumed_at' => 'required', // Menerima input datetime-local dari frontend
            'notes'       => 'nullable|string'
        ]);

        $food = $request->food_name;
        $portion = $request->portion;

        // 2. Normalisasi format tanggal agar disukai oleh kolom Datetime MySQL
        // Mengubah "2026-06-21T13:00" menjadi "2026-06-21 13:00:00"
        $rawDate = $request->consumed_at;
        $cleanDateTime = str_replace('T', ' ', $rawDate); 
        if (strlen($cleanDateTime) == 16) {
            $cleanDateTime .= ':00'; // Menambahkan detik jika belum ada
        }

        // 3. Konfigurasi Awal Hubungan ke Groq AI
        $apiKey = env('GROQ_API_KEY');
        
        // Nilai cadangan (Fallback) jika seandainya API Groq limit/down/salah API Key
        $calories = 250;
        $recommendation = "Tetap batasi minyak berlebih dan imbangi makanan Anda dengan air putih serta serat secukupnya.";

        if ($apiKey) {
            try {
                $prompt = "Bertindaklah sebagai ahli gizi digital terpercaya. Seseorang memakan makanan berikut:\n" .
                          "Nama Makanan: {$food}\n" .
                          "Porsi: {$portion}\n\n" .
                          "Hitung estimasi total kalorinya (hanya angka integer) dan berikan 1 kalimat saran/rekomendasi singkat berbahasa Indonesia agar makanan ini menjadi lebih sehat atau alternatif pengganti yang mirip namun lebih bernutrisi.\n\n" .
                          "Anda WAJIB merespon dalam format JSON mentah seperti ini tanpa teks pembuka/penutup/pembungkus markdown markdown apapun:\n" .
                          "{\n" .
                          "  \"calories\": 350,\n" .
                          "  \"recommendation\": \"Saran dari AI disini...\"\n" .
                          "}";

                // Mengirim request ke API Groq menggunakan model tercepat (Llama3)
                $response = Http::withoutVerifying()->withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type'  => 'application/json',
                ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'       => 'llama3-8b-8192',
                    'messages'    => [
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.2, // Nilai rendah agar AI patuh pada format JSON
                ]);

                if ($response->successful()) {
                    $content = $response->json()['choices'][0]['message']['content'] ?? '';
                    
                    // Bersihkan tanda backtick markdown jika AI tidak sengaja menyertakannya
                    $content = trim(str_replace(['```json', '```'], '', $content));
                    
                    $aiResult = json_decode($content, true);
                    
                    if (isset($aiResult['calories'])) {
                        $calories = intval($aiResult['calories']);
                    }
                    if (isset($aiResult['recommendation'])) {
                        $recommendation = $aiResult['recommendation'];
                    }
                } else {
                    Log::error('Groq API Gagal Merespon: ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::error('Koneksi Groq Bermasalah: ' . $e->getMessage());
            }
        }

        // 4. Menyimpan data ke database melalui Model dengan kolom yang sudah sinkron
        try {
            $diary = FoodDiary::create([
                'user_id'           => Auth::id(),
                'food_name'         => $food,
                'portion'           => $portion,
                'calories'          => $calories,
                'ai_recommendation' => $recommendation,
                'consumed_at'       => $cleanDateTime, // Menggunakan penamaan kolom asli database Anda
                'notes'             => $request->notes ?? '-',
            ]);

            return response()->json([
                'message' => 'Catatan makanan berhasil dianalisis oleh AI dan disimpan!',
                'data'    => $diary
            ]);

        } catch (\Exception $dbError) {
            Log::error('Database Error pada Food Diary: ' . $dbError->getMessage());
            
            // Melempar detail eror MySQL asli ke React agar mudah dibaca di Inspect Element Network
            return response()->json([
                'message'       => 'Gagal menyimpan data ke database. Silakan periksa kolom database Anda.',
                'error_detail'  => $dbError->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus riwayat makanan berdasarkan ID.
     */
    public function destroy($id)
    {
        $diary = FoodDiary::where('user_id', Auth::id())->find($id);
        
        if (!$diary) {
            return response()->json(['message' => 'Data tidak ditemukan atau bukan milik Anda.'], 404);
        }
        
        $diary->delete();
        return response()->json(['message' => 'Data riwayat makanan berhasil dihapus.']);
    }
}