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
        // 1. Validasi Input Frontend
        $request->validate([
            'food_name'   => 'required|string',
            'portion'     => 'required|string',
            'consumed_at' => 'required', 
            'notes'       => 'nullable|string'
        ]);

        $food = $request->food_name;
        $portion = $request->portion;

        // 2. Format Tanggal untuk standar database MySQL (Y-m-d H:i:s)
        $rawDate = $request->consumed_at;
        $cleanDateTime = str_replace('T', ' ', $rawDate); 
        if (strlen($cleanDateTime) == 16) {
            $cleanDateTime .= ':00';
        }

        $apiKey = config('app.groq_api_key') ?? env('GROQ_API_KEY');
        
        // Proteksi awal jika API Key mendadak hilang
        if (!$apiKey) {
            return response()->json([
                'message' => 'Gagal mendeteksi GROQ_API_KEY di server Railway Anda!',
                'tips' => 'Pastikan nama variabel di Railway adalah GROQ_API_KEY.'
            ], 500);
        }

        // Nilai Cadangan (Fallback) awal
        $calories = 250; 
        $recommendation = "Imbangi makanan Anda dengan air putih dan serat secukupnya.";

        // 3. Proses Analisis Menggunakan Groq AI (Model Llama 3.1 Instant)
        try {
            $prompt = "Kamu adalah ahli gizi digital. Seseorang makan: {$food} dengan porsi: {$portion}.\n" .
                      "Berikan estimasi total kalorinya (hanya angka bulat saja) diikuti tanda pagar (#) lalu sambung dengan 1 kalimat saran kesehatan singkat bahasa Indonesia.\n\n" .
                      "CONTOH JAWABAN:\n350#Saran kesehatan singkat di sini.";

            $response = Http::withoutVerifying()->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model'       => 'llama-3.1-8b-instant', // Disamakan dengan model chatbot Anda
                'messages'    => [['role' => 'user', 'content' => $prompt]],
                'temperature' => 0.1,
            ]);

            if ($response->successful()) {
                $rawContent = trim($response->json()['choices'][0]['message']['content'] ?? '');
                
                // Membersihkan sisa-sisa format markdown yang tidak sengaja terbawa
                $rawContent = str_replace(['```json', '```', 'json', '"', "'"], '', $rawContent);
                $rawContent = trim($rawContent);

                // Ekstraksi teks menggunakan pembatas pagar (#)
                if (strpos($rawContent, '#') !== false) {
                    $parts = explode('#', $rawContent);
                    
                    // Ambil angka kalori secara paksa
                    preg_match('/\d+/', $parts[0], $matches);
                    if (!empty($matches)) { 
                        $calories = intval($matches[0]); 
                    }
                    
                    // Ambil kalimat saran
                    if (isset($parts[1]) && trim($parts[1]) != '') { 
                        $recommendation = trim($parts[1]); 
                    }
                } else {
                    // Cadangan jika AI menulis teks lepas tanpa pagar
                    if (preg_match('/\d+/', $rawContent, $matches)) {
                        $calories = intval($matches[0]);
                        $recommendation = $rawContent; 
                    }
                }
            } else {
                // 💡 PERBAIKAN: Menggunakan 'else' yang benar agar tidak memicu syntax error PHP
                return response()->json([
                    'message' => 'API Groq menolak request backend Anda!',
                    'error_details' => $response->json() ?? $response->body()
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Koneksi jaringan backend ke Groq terputus!',
                'error_details' => $e->getMessage()
            ], 500);
        }

        // 4. Menyimpan data hasil analisis ke database lokal
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
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        $diary->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}