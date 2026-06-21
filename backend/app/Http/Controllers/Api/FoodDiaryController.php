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
        // Mengambil data diary makanan berdasarkan user_id secara realtime dan diurutkan dari yang terbaru
        $diaries = FoodDiary::where('user_id', Auth::id())->latest()->get();
        return response()->json($diaries);
    }

    /**
     * Menyimpan catatan makanan baru dan menganalisis kalori serta rekomendasi menggunakan Groq AI.
     */
    public function store(Request $request)
    {
        // 1. Validasi input dari frontend (menyesuaikan dengan parameter consumed_at)
        $request->validate([
            'food_name'   => 'required|string',
            'portion'     => 'required|string',
            'consumed_at' => 'required', 
            'notes'       => 'nullable|string'
        ]);

        $food = $request->food_name;
        $portion = $request->portion;

        // 2. Mengamankan format datetime agar sesuai dengan standar database MySQL (Y-m-d H:i:s)
        $rawDate = $request->consumed_at;
        $cleanDateTime = str_replace('T', ' ', $rawDate); 
        if (strlen($cleanDateTime) == 16) {
            $cleanDateTime .= ':00';
        }

        $apiKey = env('GROQ_API_KEY');
        
        // Nilai fallback default jika integrasi API AI mengalami kendala
        $calories = 250; 
        $recommendation = "Imbangi makanan Anda dengan air putih dan serat secukupnya.";

        // 3. Proses Analisis Menggunakan Groq AI (Llama 3)
        if ($apiKey) {
            try {
                // Prompt yang ketat agar AI mengembalikan format JSON murni tanpa hiasan markdown
                $prompt = "Kamu adalah sistem pakar ahli gizi (Nutritionist AI) yang akurat. " .
                          "Tugasmu adalah menganalisis makanan berikut:\n" .
                          "Nama Makanan: {$food}\n" .
                          "Porsi: {$portion}\n\n" .
                          "Hitung estimasi total kalori dalam bentuk angka bulat (integer). " .
                          "Berikan 1 kalimat saran kesehatan singkat, spesifik, dan relevan sesuai jenis makanan tersebut dalam bahasa Indonesia.\n\n" .
                          "Kamu WAJIB mengembalikan jawaban hanya dalam format JSON mentah berikut tanpa teks pembuka, tanpa penjelasan, dan tanpa bungkus markdown:\n" .
                          "{\n" .
                          "  \"calories\": 350,\n" .
                          "  \"recommendation\": \"Saran spesifik sesuai makanan di sini.\"\n" .
                          "}";

                // Memanggil API Groq
                $response = Http::withoutVerifying()->withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type'  => 'application/json',
                ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'       => 'llama3-8b-8192',
                    'messages'    => [['role' => 'user', 'content' => $prompt]],
                    'temperature' => 0.2, // Nilai rendah agar hasil AI lebih konsisten dan tidak berhalusinasi format
                ]);

                if ($response->successful()) {
                    $rawContent = $response->json()['choices'][0]['message']['content'] ?? '';
                    
                    // Membersihkan format markdown (seperti ```json ... ```) yang sering kali disisipkan oleh Llama
                    $cleanContent = trim(str_replace(['```json', '```'], '', $rawContent));
                    
                    $aiResult = json_decode($cleanContent, true);
                    
                    // Jika proses decode JSON berhasil, simpan datanya ke variabel utama
                    if (json_last_error() === JSON_ERROR_NONE && $aiResult) {
                        $calories = isset($aiResult['calories']) ? intval($aiResult['calories']) : $calories;
                        $recommendation = $aiResult['recommendation'] ?? $recommendation;
                    } else {
                        Log::error('Gagal melakukan decode JSON dari Groq. Raw data asli dari AI: ' . $rawContent);
                    }
                } else {
                    Log::error('Groq API Error: ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::error('Koneksi ke API Groq bermasalah: ' . $e->getMessage());
            }
        }

        // 4. Menyimpan data hasil analisis AI ke dalam database lokal
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