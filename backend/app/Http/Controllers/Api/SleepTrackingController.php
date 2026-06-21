<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SleepTracking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SleepTrackingController extends Controller
{
    public function index()
    {
        $sleep = SleepTracking::where('user_id', Auth::id())->latest('sleep_date')->get();
        return response()->json($sleep);
    }

    public function store(Request $request)
    {
        // Validasi input awal (Kualitas dikosongkan karena diisi otomatis oleh AI Groq)
        $validator = Validator::make($request->all(), [
            'sleep_date'    => 'required|date_format:Y-m-d',
            'sleep_time'    => 'required',
            'wake_time'     => 'required',
            'notes'         => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $cleanSleep = substr($request->sleep_time, 0, 5);
            $cleanWake = substr($request->wake_time, 0, 5);

            $sleepTime = Carbon::createFromFormat('Y-m-d H:i', $request->sleep_date . ' ' . $cleanSleep);
            $wakeTime = Carbon::createFromFormat('Y-m-d H:i', $request->sleep_date . ' ' . $cleanWake);

            if ($wakeTime->lessThan($sleepTime)) {
                $wakeTime->addDay();
            }

            $duration = $sleepTime->diffInMinutes($wakeTime) / 60;
            $durationRound = round($duration, 2);

            // Pengaturan Cadangan jika AI offline (Sesuai batasan ENUM database Anda)
            $aiQuality = 'good';
            if ($durationRound < 6.5) { $aiQuality = 'poor'; }
            elseif ($durationRound > 8.5) { $aiQuality = 'fair'; }

            $aiRecommendation = "Durasi tidur terpantau standar. Jaga kenyamanan temperatur ruangan Anda.";

            // --- EKSEKUSI GROQ AI (MODEL CHATBOT: llama-3.1-8b-instant) ---
            $apiKey = config('app.groq_api_key') ?? env('GROQ_API_KEY');
            if ($apiKey) {
                try {
                    $prompt = "Kamu adalah spesialis kesehatan tidur klinis (Somnologist AI). Seseorang tidur dengan total durasi: {$durationRound} jam.\n" .
                              "1. Tentukan kualitas tidur berdasarkan durasi tersebut. WAJIB PILIH SALAH SATU kode ini saja (tulis persis huruf kecil):\n" .
                              "   - Pilih 'poor' jika tidur sangat kurang (di bawah 6.5 jam).\n" .
                              "   - Pilih 'good' atau 'excellent' jika tidur sangat ideal (7 sampai 8 jam).\n" .
                              "   - Pilih 'fair' jika tidur berlebihan (di atas 8.5 jam).\n\n" .
                              "2. Berikan 1 kalimat saran kesehatan/evaluasi medis singkat mengapa durasi tersebut baik/kurang baik dalam Bahasa Indonesia.\n\n" .
                              "CONTOH JAWABAN (LANGSUNG FORMAT INI TANPA BASA-BASI):\n" .
                              "fair#Durasi tidur Anda {$durationRound} jam termasuk berlebihan. Tidur terlalu lama dapat mengacaukan ritme sirkadian dan memicu hipersomnia yang membuat tubuh lemas.";

                    $response = Http::withoutVerifying()->withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type'  => 'application/json',
                    ])->post('https://api.groq.com/openai/v1/chat/completions', [
                        'model'       => 'llama-3.1-8b-instant', // Model yang sama dengan chatbot
                        'messages'    => [['role' => 'user', 'content' => $prompt]],
                        'temperature' => 0.1,
                    ]);

                    if ($response->successful()) {
                        $rawContent = trim($response->json()['choices'][0]['message']['content'] ?? '');
                        $rawContent = str_replace(['```json', '```', 'json', '"', "'"], '', $rawContent);
                        $rawContent = trim($rawContent);

                        if (strpos($rawContent, '#') !== false) {
                            $parts = explode('#', $rawContent);
                            
                            $extractedQuality = strtolower(trim($parts[0]));
                            if (in_array($extractedQuality, ['poor', 'fair', 'good', 'excellent'])) {
                                $aiQuality = $extractedQuality;
                            }
                            
                            if (isset($parts[1]) && trim($parts[1]) != '') {
                                $aiRecommendation = trim($parts[1]);
                            }
                        }
                    }
                } catch (\Exception $e) {
                    Log::error('Sleep AI Network Error: ' . $e->getMessage());
                }
            }

            // Gabungkan notes kustom user dengan insight AI
            $userNotes = $request->notes ?? '-';
            $finalNotes = $userNotes . " [AI]: " . $aiRecommendation;

            // Simpan ke database MySQL Railway
            $sleep = SleepTracking::create([
                'user_id'        => Auth::id(),
                'sleep_date'     => $request->sleep_date,
                'sleep_time'     => $sleepTime->format('H:i:s'),
                'wake_time'      => $wakeTime->format('H:i:s'),
                'sleep_duration' => $durationRound,
                'sleep_quality'  => $aiQuality, 
                'notes'          => $finalNotes,
            ]);

            return response()->json([
                'message' => 'Data tidur berhasil disimpan',
                'data' => $sleep
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan pada database server',
                'error_pasti' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $sleep = SleepTracking::findOrFail($id);
        return response()->json($sleep);
    }

    public function update(Request $request, $id)
    {
        $sleep = SleepTracking::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'sleep_date'    => 'required|date_format:Y-m-d',
            'sleep_time'    => 'required',
            'wake_time'     => 'required',
            'notes'         => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $cleanSleep = substr($request->sleep_time, 0, 5);
            $cleanWake = substr($request->wake_time, 0, 5);

            $sleepTime = Carbon::createFromFormat('Y-m-d H:i', $request->sleep_date . ' ' . $cleanSleep);
            $wakeTime = Carbon::createFromFormat('Y-m-d H:i', $request->sleep_date . ' ' . $cleanWake);

            if ($wakeTime->lessThan($sleepTime)) {
                $wakeTime->addDay();
            }

            $duration = $sleepTime->diffInMinutes($wakeTime) / 60;
            $durationRound = round($duration, 2);

            $aiQuality = 'good';
            if ($durationRound < 6.5) { $aiQuality = 'poor'; }
            elseif ($durationRound > 8.5) { $aiQuality = 'fair'; }

            $aiRecommendation = "Pola tidur diupdate. Jaga konsistensi waktu istirahat Anda.";

            $apiKey = config('app.groq_api_key') ?? env('GROQ_API_KEY');
            if ($apiKey) {
                try {
                    $prompt = "Kamu adalah spesialis kesehatan tidur klinis. Seseorang tidur dengan total durasi: {$durationRound} jam.\n" .
                              "1. Tentukan kualitas tidur, WAJIB KODE INI: poor / fair / good / excellent\n" .
                              "2. Berikan 1 kalimat saran kesehatan singkat Bahasa Indonesia.\n\n" .
                              "CONTOH JAWABAN:\ngood#Durasi tidur ideal.";

                    $response = Http::withoutVerifying()->withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type'  => 'application/json',
                    ])->post('https://api.groq.com/openai/v1/chat/completions', [
                        'model'       => 'llama-3.1-8b-instant',
                        'messages'    => [['role' => 'user', 'content' => $prompt]],
                        'temperature' => 0.1,
                    ]);

                    if ($response->successful()) {
                        $rawContent = trim($response->json()['choices'][0]['message']['content'] ?? '');
                        if (strpos($rawContent, '#') !== false) {
                            $parts = explode('#', $rawContent);
                            $extractedQuality = strtolower(trim($parts[0]));
                            if (in_array($extractedQuality, ['poor', 'fair', 'good', 'excellent'])) {
                                $aiQuality = $extractedQuality;
                            }
                            if (isset($parts[1]) && trim($parts[1]) != '') {
                                $aiRecommendation = trim($parts[1]);
                            }
                        }
                    }
                } catch (\Exception $e) { Log::error($e->getMessage()); }
            }

            $userNotes = $request->notes ?? '-';
            $finalNotes = $userNotes . " [AI]: " . $aiRecommendation;

            $sleep->update([
                'sleep_date'     => $request->sleep_date,
                'sleep_time'     => $sleepTime->format('H:i:s'),
                'wake_time'      => $wakeTime->format('H:i:s'),
                'sleep_duration' => $durationRound,
                'sleep_quality'  => $aiQuality,
                'notes'          => $finalNotes,
            ]);

            return response()->json([
                'message' => 'Data tidur berhasil diupdate',
                'data' => $sleep
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengupdate data tidur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $sleep = SleepTracking::findOrFail($id);
        $sleep->delete();

        return response()->json([
            'message' => 'Data tidur berhasil dihapus'
        ]);
    }
}