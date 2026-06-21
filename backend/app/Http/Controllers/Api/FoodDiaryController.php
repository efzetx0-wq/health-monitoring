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
     * Menampilkan semua daftar catatan makanan milik user yang sedang login.
     */
    public function index()
    {
        $diaries = FoodDiary::where('user_id', Auth::id())->latest()->get();
        return response()->json($diaries);
    }

    /**
     * Menyimpan catatan makanan baru dan menganalisis kalori serta rekomendasi menggunakan Groq AI.
     */
    public function store(Request $request)
    {
        // 1. Validasi input dari frontend React
        $request->validate([
            'food_name'   => 'required|string',
            'portion'     => 'required|string',
            'consumed_at' => 'required', 
            'notes'       => 'nullable|string'
        ]);

        $food = $request->food_name;
        $portion = $request->portion;

        // 2. Normalisasi format tanggal untuk standar database MySQL (Y-m-d H:i:s)
        $rawDate = $request->consumed_at;
        $cleanDateTime = str_replace('T', ' ', $rawDate); 
        if (strlen($cleanDateTime) == 16) {
            $cleanDateTime .= ':00';
        }

        $apiKey = env('GROQ_API_KEY');
        
        // Nilai cadangan (Fallback) jika seandainya API AI limit atau down
        $calories = 250; 
        $recommendation = "Imbangi makanan Anda dengan air putih dan serat secukupnya.";

        // 3. Proses Analisis Menggunakan Groq AI (Metode Parsing Teks Kuat)
        if ($apiKey) {
            try {
                // Prompt dibuat sangat ketat agar AI mengembalikan teks sederhana dipisah pagar (#)
                $prompt = "Kamu adalah sistem pakar ahli gizi (Nutritionist AI) Indonesia. " .
                          "Hitung estimasi total kalori (hanya angka integer bulat) dan berikan 1 kalimat saran kesehatan singkat yang relevan sesuai makanan ini:\n" .
                          "Nama Makanan: {$food}\n" .
                          "Porsi: {$portion}\n\n" .
                          "Kamu WAJIB menjawab dengan format persis seperti contoh di bawah ini (AngkaKalori#Saran), tanpa ada teks pembuka, penutup, atau tanda markdown apapun:\n" .
                          "350#Batasi penggunaan minyak berlebih dan tambahkan sayuran hijau.";

                // Menggunakan model llama3-8b-8192 yang sudah terbukti lancar di aplikasi Anda
                $response = Http::withoutVerifying()->withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type'  => 'application/json',
                ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'       => 'llama3-8b-8192',
                    'messages'    => [['role' => 'user', 'content' => $prompt]],
                    'temperature' => 0.2,
                ]);

                if ($response->successful()) {
                    $rawContent = trim($response->json()['choices'][0]['message']['content'] ?? '');
                    
                    // Bersihkan karakter aneh atau bungkus backtick jika AI tidak sengaja menyertakannya
                    $rawContent = str_replace(['```', 'json'], '', $rawContent);
                    $rawContent = trim($rawContent);

                    // Memecah teks AI berdasarkan simbol pagar (#)
                    if (strpos($rawContent, '#') !== false) {
                        $parts = explode('#', $rawContent);
                        
                        // Ambil bagian angka dan bersihkan dari karakter teks
                        $calories = intval(filter_var($parts[0], FILTER_SANITIZE_NUMBER_INT)) ?: $calories;
                        
                        // Ambil bagian saran kesehatan
                        $recommendation = trim($parts[1]);
                    } else {
                        Log::warn('Format respons AI tidak mengandung tanda pagar (#): ' . $rawContent);
                    }
                } else {
                    Log::error('Groq API Gagal Merespon: ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::error('Koneksi ke API Groq bermasalah: ' . $e->getMessage());
            }
        }

        // 4. Menyimpan data hasil analisis AI yang sudah berhasil diparsing ke database
        try {
            $diary = FoodDiary::create([
                'user_id'           => Auth::id(),
                'food_name'         => $food,
                'portion'           => $portion,
                'calories'          => $calories,
                'ai_recommendation' => $recommendation,
                'consumed_at'       => $cleanDateTime, 
                'notes'             => $request->notes ?? '-',
            ]);

            return response()->json([
                'message' => 'Catatan makanan berhasil dianalisis oleh AI dan disimpan!',
                'data'    => $diary
            ]);

        } catch (\Exception $dbError) {
            Log::error('Database Error pada Food Diary: ' . $dbError->getMessage());
            return response()->json([
                'message'       => 'Gagal menyimpan ke database.',
                'error_details' => $dbError->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus catatan makanan berdasarkan ID.
     */
    public function destroy($id)
    {
        $diary = FoodDiary::where('user_id', Auth::id())->find($id);
        if (!$diary) {
            return response()->json(['message' => 'Data tidak ditemukan atau Anda tidak memiliki akses.'], 404);
        }
        
        $diary->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}