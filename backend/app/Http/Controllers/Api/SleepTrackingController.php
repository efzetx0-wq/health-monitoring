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

            // Logika Fallback
            $aiQuality = 'good';
            if ($durationRound < 7.0) { 
                $aiQuality = 'poor'; 
            } elseif ($durationRound > 8.0) { 
                $aiQuality = 'fair'; 
            } else {
                $aiQuality = 'excellent';
            }

            $aiRecommendation = "Durasi tidur terpantau dalam batas normal. Jaga ritme sirkadian Anda.";

            // --- PROSES SMART AI GROQ (PROMPT MEDIS DETIL & STRUKTUR SARAN) ---
            $apiKey = config('app.groq_api_key') ?? env('GROQ_API_KEY');
            if ($apiKey) {
                try {
                    $prompt = "Kamu adalah spesialis kesehatan tidur klinis (Somnologist AI). Seseorang memiliki durasi tidur: {$durationRound} jam.\n\n" .
                              "Tugasmu menentukan kode kualitas tidur dengan ATURAN MEDIS KETAT berikut:\n" .
                              "1. Jika durasi DI BAWAH 7 jam (< 7.0), kualitas BURUK. Maka WAJIB gunakan kode: poor\n" .
                              "2. Jika durasi ANTARA 7 SAMPAI 8 jam (7.0 - 8.0), kualitas IDEAL/BAIK. Maka WAJIB gunakan kode: excellent atau good\n" .
                              "3. Jika durasi DI ATAS 8 jam (> 8.0), kualitas BERLEBIHAN. Maka WAJIB gunakan kode: fair\n\n" .
                              "Ketentuan menulis isi teks setelah tanda pagar (#):\n" .
                              "- Jelaskan secara spesifik apa DAMPAK MEDIS / EFEK BURUKNYA terhadap tubuh (apa yang ditimbulkan/menyebabkan apa) jika tidur kurang (<7 jam) atau berlebihan (>8 jam).\n" .
                              "- Jika durasinya ideal (7-8 jam), jelaskan efek positifnya bagi tubuh.\n" .
                              "- Berikan SARAN tindakan nyata di akhir kalimat.\n\n" .
                              "FORMAT RESPONS HARUS SEPERTI INI (Tanpa kata pengantar, langsung kode#isitekssaran):\n" .
                              "kode_kualitas#Penjelasan dampak medis serta saran langsung.\n\n" .
                              "CONTOH RESPONS JIKA KURANG DARI 7 JAM:\n" .
                              "poor#Tidur kurang dari 7 jam menyebabkan penurunan imunitas, gangguan konsentrasi, serta meningkatkan risiko obesitas karena hormon lapar terganggu. Disarankan untuk menjadwalkan tidur lebih awal malam ini dan hindari kafein 6 jam sebelum tidur.\n\n" .
                              "CONTOH RESPONS JIKA LEBIH DARI 8 JAM:\n" .
                              "fair#Tidur lebih dari 8 jam berlebihan dan berisiko menyebabkan gangguan metabolisme, memicu sakit kepala (oversleeping), serta badan terasa lemas akibat gangguan siklus sirkadian. Disarankan pasang alarm di pagi hari dan batasi waktu tidur siang maksimal 20 menit agar ritme kembali normal.\n\n" .
                              "CONTOH RESPONS JIKA RENTANG 7-8 JAM:\n" .
                              "excellent#Durasi tidur 7-8 jam sangat ideal dan terbukti mengoptimalkan regenerasi sel, menjaga kesehatan jantung, serta meningkatkan daya ingat. Pertahankan konsistensi jam tidur dan bangun ini setiap hari termasuk di akhir pekan.";

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

            $aiRecommendation = "Pola tidur diupdate. Jaga konsistensi waktu istirahat Anda.";

            $apiKey = config('app.groq_api_key') ?? env('GROQ_API_KEY');
            if ($apiKey) {
                try {
                    $prompt = "Kamu adalah spesialis kesehatan tidur klinis. Seseorang memiliki durasi tidur: {$durationRound} jam.\n" .
                              "Tugasmu menentukan kualitas tidur dengan ATURAN MEDIS KETAT berikut:\n" .
                              "1. Jika durasi DI BAWAH 7 jam (< 7.0), kualitas BURUK (poor)\n" .
                              "2. Jika durasi ANTARA 7 SAMPAI 8 jam (7.0 - 8.0), kualitas IDEAL (good / excellent)\n" .
                              "3. Jika durasi DI ATAS 8 jam (> 8.0), kualitas BERLEBIHAN (fair)\n\n" .
                              "Jelaskan dampak medisnya bagi tubuh (menyebabkan apa) serta berikan saran konkret.\n\n" .
                              "FORMAT RESPONS HARUS SEPERTI INI:\nkode_kualitas#Teks dampak medis dan saran langsung.";

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