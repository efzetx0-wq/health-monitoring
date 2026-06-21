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
    public function index()
    {
        $diaries = FoodDiary::where('user_id', Auth::id())->latest()->get();
        return response()->json($diaries);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input Frontend
        $request->validate([
            'food_name'   => 'required|string',
            'portion'     => 'required|string',
            'consumed_at' => 'required', 
            'notes'       => 'nullable|string'
        ]);

        $food = $request->food_name;
        $portion = $request->portion;

        // 2. Rapikan Tanggal untuk MySQL
        $rawDate = $request->consumed_at;
        $cleanDateTime = str_replace('T', ' ', $rawDate); 
        if (strlen($cleanDateTime) == 16) {
            $cleanDateTime .= ':00';
        }

        $apiKey = env('GROQ_API_KEY');
        
        // Nilai Cadangan Absolut jika Groq benar-benar mati konyol
        $calories = 250; 
        $recommendation = "Imbangi makanan Anda dengan air putih dan serat secukupnya.";

        // 3. Eksekusi Groq AI dengan Pengaman Berlapis
        if ($apiKey) {
            try {
                $prompt = "Kamu adalah ahli gizi digital. Seseorang makan: {$food} dengan porsi: {$portion}.\n" .
                          "Berikan estimasi total kalorinya (hanya angka bulat saja) diikuti tanda pagar (#) lalu sambung dengan 1 kalimat saran kesehatan singkat bahasa Indonesia.\n\n" .
                          "CONTOH FORMAT JAWABAN (JANGAN MENULIS KATA LAIN, LANGSUNG SEPERTI INI):\n" .
                          "350#Saran kesehatan singkat di sini.";

                $response = Http::withoutVerifying()->withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type'  => 'application/json',
                ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'       => 'llama3-8b-8192',
                    'messages'    => [['role' => 'user', 'content' => $prompt]],
                    'temperature' => 0.1, // Dikecilkan ke 0.1 agar AI sangat kaku & patuh format
                ]);

                if ($response->successful()) {
                    $rawContent = trim($response->json()['choices'][0]['message']['content'] ?? '');
                    
                    // Bersihkan kotoran teks markdown yang sering merusak struktur kode
                    $rawContent = str_replace(['```json', '```', 'json', '"', "'"], '', $rawContent);
                    $rawContent = trim($rawContent);

                    // ==========================================
                    // SANG PENGAMAN UTAMA (DETEKSI NYATA)
                    // ==========================================
                    if (strpos($rawContent, '#') !== false) {
                        $parts = explode('#', $rawContent);
                        
                        // Ekstrak angka kalori secara paksa
                        preg_match('/\d+/', $parts[0], $matches);
                        if (!empty($matches)) {
                            $calories = intval($matches[0]);
                        }
                        
                        // Ekstrak saran kesehatan
                        if (isset($parts[1]) && trim($parts[1]) != '') {
                            $recommendation = trim($parts[1]);
                        }
                    } 
                    // JIKA AI MBALELO (Tidak pakai tanda pagar tapi ngasih teks bebas)
                    else {
                        // Cari angka apa saja di dalam teks buatan AI untuk dijadikan Kalori
                        if (preg_match('/\d+/', $rawContent, $matches)) {
                            $calories = intval($matches[0]);
                            // Jadikan seluruh teks dari AI sebagai rekomendasi
                            $recommendation = $rawContent; 
                        }
                    }
                    // ==========================================

                } else {
                    Log::error('Groq Gagal: ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::error('Eror Jaringan Groq: ' . $e->getMessage());
            }
        }

        // 4. Simpan Hasilnya ke Database
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
            Log::error('Database Error: ' . $dbError->getMessage());
            return response()->json([
                'message'       => 'Gagal menyimpan ke database.',
                'error_details' => $dbError->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $diary = FoodDiary::where('user_id', Auth::id())->find($id);
        if (!$diary) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        $diary->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}