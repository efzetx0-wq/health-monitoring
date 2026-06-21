<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodDiary;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class FoodDiaryController extends Controller
{
    public function index()
    {
        $diaries = FoodDiary::where('user_id', Auth::id())->latest()->get();
        return response()->json($diaries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'food_name' => 'required|string',
            'portion' => 'required|string',
            'log_date' => 'required|date',
        ]);

        $food = $request->food_name;
        $portion = $request->portion;

        // --- PROSES AI GROQ ---
        $apiKey = env('GROQ_API_KEY');
        
        // Buat prompt agar AI mengembalikan format JSON yang kaku/pasti
        $prompt = "Bertindaklah sebagai ahli gizi digital terpercaya. Seseorang memakan makanan berikut:\n" .
                  "Nama Makanan: {$food}\n" .
                  "Porsi: {$portion}\n\n" .
                  "Hitung estimasi total kalorinya (hanya angka integer) dan berikan 1 kalimat saran/rekomendasi singkat berbahasa Indonesia agar makanan ini menjadi lebih sehat atau alternatif pengganti yang mirip namun lebih bernutrisi.\n\n" .
                  "Anda WAJIB merespon dalam format JSON mentah seperti ini tanpa teks pembuka/penutup apapun:\n" .
                  "{\n" .
                  "  \"calories\": 350,\n" .
                  "  \"recommendation\": \"Saran dari AI disini...\"\n" .
                  "}";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama3-8b-8192', // Model super cepat milik Groq
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.2, // Nilai rendah agar AI konsisten patuh pada format JSON
            ]);

            if ($response->successful()) {
                $aiResult = json_decode($response->json()['choices'][0]['message']['content'], true);
                
                // Ambil data hasil parsing AI (jika gagal, berikan nilai default)
                $calories = $aiResult['calories'] ?? 200; 
                $recommendation = $aiResult['recommendation'] ?? 'Tetap jaga porsi makan dan imbangi dengan sayuran.';
            } else {
                $calories = 250; // fallback jika API limit / error
                $recommendation = 'Gagal terhubung ke AI. Cobalah mengonsumsi lebih banyak serat.';
            }
        } catch (\Exception $e) {
            $calories = 250;
            $recommendation = 'Fitur AI sedang sibuk. Tetap batasi makanan berminyak.';
        }
        // --- END PROSES AI ---

        // Simpan ke Database
        $diary = FoodDiary::create([
            'user_id' => Auth::id(),
            'food_name' => $food,
            'portion' => $portion,
            'calories' => $calories,
            'ai_recommendation' => $recommendation,
            'log_date' => $request->log_date,
        ]);

        return response()->json([
            'message' => 'Catatan makanan berhasil dianalisis oleh AI dan disimpan!',
            'data' => $diary
        ]);
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