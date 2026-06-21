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

            // LOGIKA CADANGAN (FALLBACK) JIKA API GROQ DOWN
            $aiQuality = 'good';
            if ($durationRound < 7.0) { 
                $aiQuality = 'poor'; 
            } elseif ($durationRound > 8.0) { 
                $aiQuality = 'fair'; 
            } else {
                $aiQuality = 'excellent';
            }

            $aiRecommendation = "Durasi tidur terpantau dalam batas normal sebesar {$durationRound} jam. Jaga ritme sirkadian Anda.";

            // --- PROSES SMART AI GROQ (PERBAIKAN STRUKTUR MESSAGES) ---
            $apiKey = config('app.groq_api_key') ?? env('GROQ_API_KEY');
            if ($apiKey) {
                try {
                    $systemInstruction = "Kamu adalah Somnologist AI (Spesialis Medis Kesehatan Tidur Klinis).\n" .
                                         "Tugasmu menerima input data durasi tidur (dalam jam) lalu mengembalikan respons dengan format ketat: KODE_KUALITAS#ANALISIS_MEDIS_DAN_SARAN\n\n" .
                                         "ATURAN DETERMINASI KUALITAS:\n" .
                                         "- Jika durasi < 7.0 jam, gunakan KODE: poor (Jelaskan efek buruk/dampak medis kurang tidur bagi organ tubuh/imun dan berikan saran solusi).\n" .
                                         "- Jika durasi 7.0 hingga 8.0 jam, gunakan KODE: excellent atau good (Jelaskan dampak positif regenerasi sel dan saran mempertahankan pola).\n" .
                                         "- Jika durasi > 8.0 jam, gunakan KODE: fair (Jelaskan dampak medis oversleeping seperti sakit kepala/lemas dan saran alarm/aktivitas).\n\n" .
                                         "PENTING: Jangan berikan kata pembuka, penutup, markdown, atau teks instruksi apa pun. Langsung berikan hasil akhir berupa 'kode#kalimat_analisis'.";

                    $response = Http::withoutVerifying()->withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type'  => 'application/json',
                    ])->post('https://api.groq.com/openai/v1/chat/completions', [
                        'model'       => 'llama-3.1-8b-instant',
                        'messages'    => [
                            ['role' => 'system', 'content' => $systemInstruction],
                            // Few-Shot Examples agar AI paham variasi durasi
                            ['role' => 'user', 'content' => "Input Durasi: 5.5 jam"],
                            ['role' => 'assistant', 'content' => "poor#Tidur selama 5.5 jam kurang dari standar klinis, berisiko menyebabkan penurunan sistem imun, gangguan konsentrasi, serta mengacaukan hormon pengatur rasa lapar (ghrelin). Disarankan untuk memajukan jam tidur malam ini dan menjauhi gadget sebelum tidur."],
                            ['role' => 'user', 'content' => "Input Durasi: 9.2 jam"],
                            ['role' => 'assistant', 'content' => "fair#Durasi tidur 9.2 jam tergolong berlebihan (oversleeping) yang dapat memicu sakit kepala akibat gangguan neurotransmiter serta membuat tubuh terasa lemas sepanjang hari. Disarankan untuk memasang alarm di pagi hari dan berolahraga ringan setelah bangun."],
                            // Real input user saat ini
                            ['role' => 'user', 'content' => "Input Durasi: {$durationRound} jam"]
                        ],
                        'temperature' => 0.2,
                    ]);

                    if ($response->successful()) {
                        $rawContent = trim($response->json()['choices'][0]['message']['content'] ?? '');
                        $rawContent = str_replace(['```json', '
```', 'json', '"', "'"], '', $rawContent);
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

            $userNotes = $request->notes ?? '-';
            $finalNotes = $userNotes . " [AI]: " . $aiRecommendation;

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
            if ($durationRound < 7.0) { 
                $aiQuality = 'poor'; 
            } elseif ($durationRound > 8.0) { 
                $aiQuality = 'fair'; 
            } else {
                $aiQuality = 'excellent';
            }

            $aiRecommendation = "Pola tidur diupdate dengan durasi {$durationRound} jam. Jaga konsistensi waktu istirahat Anda.";

            $apiKey = config('app.groq_api_key') ?? env('GROQ_API_KEY');
            if ($apiKey) {
                try {
                    $systemInstruction = "Kamu adalah Somnologist AI. Berikan respons analisis medis tidur secara dinamis sesuai durasi yang diinput dengan format ketat: KODE_KUALITAS#ANALISIS_MEDIS_DAN_SARAN";

                    $response = Http::withoutVerifying()->withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type'  => 'application/json',
                    ])->post('https://api.groq.com/openai/v1/chat/completions', [
                        'model'       => 'llama-3.1-8b-instant',
                        'messages'    => [
                            ['role' => 'system', 'content' => $systemInstruction],
                            ['role' => 'user', 'content' => "Input Durasi: 6.0 jam"],
                            ['role' => 'assistant', 'content' => "poor#Tidur 6 jam menyebabkan metabolisme tubuh melambat dan memicu kelelahan kognitif. Disarankan tidur 30 menit lebih awal."],
                            ['role' => 'user', 'content' => "Input Durasi: 7.5 jam"],
                            ['role' => 'assistant', 'content' => "excellent#Durasi 7.5 jam sangat baik untuk konsolidasi memori dan kestabilan emosi. Pertahankan pola sirkadian ini."],
                            ['role' => 'user', 'content' => "Input Durasi: {$durationRound} jam"]
                        ],
                        'temperature' => 0.2,
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