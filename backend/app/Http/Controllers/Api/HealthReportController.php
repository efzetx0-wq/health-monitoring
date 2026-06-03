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

class HealthReportController extends Controller
{
    public function generateWeeklyReport()
    {
        $userId = Auth::id();

        $start = Carbon::now()->startOfWeek();

        $end = Carbon::now()->endOfWeek();

        $averageSleep = SleepTracking::where(
            'user_id',
            $userId
        )
        ->whereBetween(
            'created_at',
            [$start, $end]
        )
        ->avg('sleep_duration');

        $averageCalories = PhysicalActivity::where(
            'user_id',
            $userId
        )
        ->whereBetween(
            'created_at',
            [$start, $end]
        )
        ->avg('calories_burned');

        $averageSteps = PhysicalActivity::where(
            'user_id',
            $userId
        )
        ->whereBetween(
            'created_at',
            [$start, $end]
        )
        ->avg('steps');

        $profile = HealthProfile::where(
            'user_id',
            $userId
        )->first();

        // Handle jika profile belum ada
        $bmi = $profile?->bmi ?? 0;

        $bmiStatus =
            $this->getBMIStatus($bmi);

        $insight =
            $this->generateInsight(
                $averageSleep ?? 0,
                $averageSteps ?? 0,
                $bmi
            );

  $report = HealthReport::updateOrCreate(

    [

        'user_id' => $userId,

        'report_period_start' => $start,

        'report_period_end' => $end,

    ],

    [

        'average_sleep' =>
            round($averageSleep, 2),

        'average_calories_burned' =>
            round($averageCalories, 2),

        'average_steps' =>
            round($averageSteps),

        'bmi_status' =>
            $bmiStatus,

        'health_insight' =>
            $insight,

        'generated_at' =>
            now(),
    ]
);

        return response()->json([

            'message' =>
                'Laporan mingguan berhasil dibuat',

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

    private function generateInsight(
        $sleep,
        $steps,
        $bmi
    ) {

        $insight = '';

        if ($sleep < 7) {

            $insight .=
            'Kualitas tidur kurang. ';
        }

        if ($steps < 5000) {

            $insight .=
            'Aktivitas fisik masih rendah. ';
        }

        if ($bmi >= 25) {

            $insight .=
            'BMI melebihi batas normal.';
        }

        if ($insight == '') {

            $insight =
            'Kondisi kesehatan cukup baik.';
        }

        return $insight;
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