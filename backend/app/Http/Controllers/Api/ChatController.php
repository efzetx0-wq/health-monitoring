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
}