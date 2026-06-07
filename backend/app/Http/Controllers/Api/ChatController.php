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
            // Menembak API Groq
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama3-8b-8192',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Anda adalah asisten AI kesehatan profesional untuk aplikasi Health App Monitoring System. Berikan jawaban yang ramah, informatif, singkat, dan berfokus pada kesehatan, olahraga, gizi, dan pola tidur.'
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

            return response()->json(['error' => 'Gagal mendapatkan respon dari Groq AI'], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}