<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\HealthReport;
use App\Models\SleepTracking;
use App\Models\PhysicalActivity;
use App\Models\HealthProfile;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http; 

class HealthReportController extends Controller
{
    public function generateWeeklyReport()
    {
        $userId = Auth::id();

        $start = Carbon::now()->startOfWeek();
        $end = Carbon::now()->endOfWeek();

        $averageSleep = SleepTracking::where('user_id', $userId)
            ->whereBetween('created_at', [$start, $end])
            ->avg('sleep_duration');

        $averageCalories = PhysicalActivity::where('user_id', $userId)
            ->whereBetween('created_at', [$start, $end])
            ->avg('calories_burned');

        $averageSteps = PhysicalActivity::where('user_id', $userId)
            ->whereBetween('created_at', [$start, $end])
            ->avg('steps');

        $profile = HealthProfile::where('user_id', $userId)->first();

        // Handle jika profile belum ada
        $bmi = $profile?->bmi ?? 0;
        $bmiStatus = $this->getBMIStatus($bmi);

        // MODIFIKASI: Mengirimkan semua data kalkulasi rata-rata ke fungsi Groq AI
        $insight = $this->generateInsight(
            $averageSleep ?? 0,
            $averageCalories ?? 0,
            $averageSteps ?? 0,
            $bmiStatus
        );

        $report = HealthReport::updateOrCreate(
            [
                'user_id' => $userId,
                'report_period_start' => $start,
                'report_period_end' => $end,
            ],
            [
                'average_sleep' => round($averageSleep, 2),
                'average_calories_burned' => round($averageCalories, 2),
                'average_steps' => round($averageSteps),
                'bmi_status' => $bmiStatus,
                'health_insight' => $insight,
                'generated_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Laporan mingguan berhasil dibuat',
            'data' => $report
        ]);
    }

    public function index()
    {
        return response()->json(
            HealthReport::latest()->get()
        );
    }

    private function getBMIStatus($bmi)
    {
        if ($bmi < 18.5) {
            return 'Underweight';
        }
        if ($bmi < 25) {
            return 'Normal';
        }
        if ($bmi < 30) {
            return 'Overweight';
        }
        return 'Obese';
    }

    /**
     // MODIFIKASI TOTAL: Fungsi ini sekarang mengambil saran kesehatan dari Groq AI
     */
    private function generateInsight($sleep, $calories, $steps, $bmiStatus)
    {
        $apiKey = env('GROQ_API_KEY');

        // Menyusun instruksi data mingguan untuk dibaca oleh Groq AI
        $prompt = "Berikan analisis evaluasi kesehatan mingguan singkat (maksimal 3 kalimat) untuk pasien berdasarkan data rata-rata minggu ini:\n";
        $prompt .= "- Rata-rata Tidur: " . round($sleep, 1) . " jam/malam\n";
        $prompt .= "- Rata-rata Kalori Terbakar: " . round($calories) . " kcal\n";
        $prompt .= "- Rata-rata Langkah Kaki: " . round($steps) . " steps/hari\n";
        $prompt .= "- Status BMI Pasien: $bmiStatus\n\n";
        $prompt .= "Aturan: Berikan kesimpulan langsung berupa teks paragraf motivatif dan saran medis yang ramah tanpa teks pembuka seperti 'Baik, berikut analisis...'.";

        try {
            // Tembak server Groq API menggunakan model gratisan Anda yang aktif
            $response = Http::withoutVerifying()->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.1-8b-instant', 
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Anda adalah dokter pendamping digital profesional untuk Health App.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.5,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['choices'][0]['message']['content'];
            }

            // Fallback teks jika token Groq AI Anda habis/limit mendadak
            return "Aktivitas mingguan Anda cukup konsisten. Pertahankan pola makan sehat, hidrasi tubuh yang cukup, dan usahakan berolahraga secara teratur untuk menjaga kebugaran.";

        } catch (\Exception $e) {
            // Fallback teks jika koneksi internet server bermasalah
            return "Gagal memuat analisis AI otomatis. Tetap jaga kesehatan dan tingkatkan aktivitas fisik Anda secara bertahap.";
        }
    }

    public function destroy($id)
    {
        $report = HealthReport::find($id);

        if (!$report) {
            return response()->json([
                'message' => 'Report tidak ditemukan'
            ], 404);
        }

        $report->delete();

        return response()->json([
            'message' => 'Report berhasil dihapus'
        ]);
    }
}