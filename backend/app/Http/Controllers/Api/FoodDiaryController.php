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
    // 1. Validasi input
    $request->validate([
        'food_name'   => 'required|string',
        'portion'     => 'required|string',
        'consumed_at' => 'required', 
        'notes'       => 'nullable|string'
    ]);

    $food = $request->food_name;
    $portion = $request->portion;

    // 2. Format tanggal untuk MySQL
    $rawDate = $request->consumed_at;
    $cleanDateTime = str_replace('T', ' ', $rawDate); 
    if (strlen($cleanDateTime) == 16) {
        $cleanDateTime .= ':00';
    }

    $apiKey = env('GROQ_API_KEY');
    
    // Nilai fallback awal jika AI error
    $calories = 250; 
    $recommendation = "Imbangi makanan Anda dengan air putih dan serat secukupnya.";

    // 3. Proses Analisis Menggunakan Groq AI + JSON Mode
    if ($apiKey) {
        try {
            // Prompt disederhanakan karena formatnya sudah dikunci oleh sistem JSON Mode
            $prompt = "Kamu adalah sistem pakar ahli gizi (Nutritionist AI). Analisis makanan ini:\n" .
                      "Nama Makanan: {$food}\n" .
                      "Porsi: {$portion}\n\n" .
                      "Hitung estimasi total kalori dalam bentuk angka bulat (integer) dengan nama key \"calories\". " .
                      "Berikan 1 kalimat saran kesehatan singkat spesifik sesuai makanan tersebut dalam bahasa Indonesia dengan nama key \"recommendation\".\n\n" .
                      "Format output WAJIB JSON seperti ini: {\"calories\": 350, \"recommendation\": \"Saran disini\"}";

            // Memanggil API Groq dengan menyuntikkan response_format json_object
            $response = Http::withoutVerifying()->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model'           => 'llama3-8b-8192',
                'messages'        => [['role' => 'user', 'content' => $prompt]],
                'temperature'     => 0.2,
                'response_format' => ['type' => 'json_object'] // 💡 INI KUNCINYA! Memaksa Groq mengembalikan JSON murni tanpa basa-basi
            ]);

            if ($response->successful()) {
                $rawContent = $response->json()['choices'][0]['message']['content'] ?? '';
                
                // Decode langsung tanpa perlu bersih-bersih str_replace karena dijamin 100% JSON bersih
                $aiResult = json_decode($rawContent, true);
                
                if (json_last_error() === JSON_ERROR_NONE && $aiResult) {
                    $calories = isset($aiResult['calories']) ? intval($aiResult['calories']) : $calories;
                    $recommendation = $aiResult['recommendation'] ?? $recommendation;
                } else {
                    Log::error('JSON gagal di-decode meskipun pakai JSON Mode. Konten: ' . $rawContent);
                }
            } else {
                Log::error('Groq API Error pada Food Diary: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Koneksi ke API Groq bermasalah di Food Diary: ' . $e->getMessage());
        }
    }

    // 4. Menyimpan data ke database
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