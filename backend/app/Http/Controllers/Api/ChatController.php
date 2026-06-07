<?php


namespace App\Http\Controllers\Api;

// Tambahkan ini agar Laravel bisa mengenali Controller utama
use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
{
    $request->validate([
        'message' => 'required|string',
    ]);

    $userMessage = $request->input('message');
    $apiKey = env('GROQ_API_KEY');

    try {
        // 1. TAMBAHKAN withoutVerifying() untuk bypass SSL di Railway
        $response = Http::withoutVerifying()->withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.1-8b-instant',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Anda adalah asisten AI kesehatan profesional untuk aplikasi Health App Monitoring System. Berikan jawaban yang ramah, informatif, singkat, dan berfokus pada kesehatan.'
                ],
                [
                    'role' => 'user',
                    'content' => $userMessage
                ]
            ],
            'temperature' => 0.7,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $reply = $data['choices'][0]['message']['content'];
            return response()->json(['reply' => $reply]);
        }

        // 2. UBAH BAGIAN INI: Mengembalikan error asli dari Groq agar gampang didebug
        return response()->json([
            'error' => 'Groq API Error',
            'details' => $response->json() // Ini akan memunculkan alasan asli dari Groq
        ], $response->status());

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function getDashboardInsight(Request $request)
{
    // Ambil data yang dikirim oleh Frontend
    $steps = $request->input('steps', 0);
    $calories = $request->input('calories', 0);
    $avgSleep = $request->input('averageSleep', 0);
    $bmi = $request->input('bmi', 0);

    $apiKey = env('GROQ_API_KEY');

    // Susun prompt berbasis data user agar AI memberikan analisis akurat
    $prompt = "Berikan 3 poin rekomendasi kesehatan singkat, padat, dan solutif berdasarkan data pasien hari ini:\n";
    $prompt .= "- Langkah kaki: $steps steps\n";
    $prompt .= "- Kalori terbakar: $calories kcal\n";
    $prompt .= "- Rata-rata tidur: $avgSleep jam\n";
    $prompt .= "- Nilai BMI: $bmi\n\n";
    $prompt .= "Aturan: Berikan respon langsung berupa JSON array string seperti ini tanpa basa-basi: [\"Saran 1\", \"Saran 2\", \"Saran 3\"]. Pastikan bahasanya ramah dan memotivasi.";

    try {
        $response = Http::withoutVerifying()->withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.1-8b-instant', 
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Anda adalah sistem analisis medis otomatis tingkat tinggi yang hanya merespon dalam format JSON Array murni.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.3, // Temperatur rendah agar format JSON konsisten aman
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $rawReply = $data['choices'][0]['message']['content'];
            
            // Konversi teks JSON string dari AI menjadi array PHP asli
            $insights = json_decode($rawReply, true);

            // Jika AI gagal mengembalikan format array yang valid, pakai fallback standar
            if (!is_array($insights)) {
                $insights = ["Tetap jaga hidrasi tubuh dengan minum air putih yang cukup hari ini."];
            }

            return response()->json(['insights' => $insights]);
        }

        return response()->json(['error' => 'Gagal mengambil rekomendasi AI'], 500);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}