<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DailyTarget;
use App\Models\PhysicalActivity;
use App\Models\SleepTracking;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DailyTargetController extends Controller
{
    public function index()
    {
        $targets = DailyTarget::where('user_id', Auth::id())->latest('target_date')->get();

        // Mapping data target untuk menyertakan riwayat 7 hari ke belakang
        $customTargets = $targets->map(function ($target) {
            $endDate = Carbon::parse($target->target_date);
            
            $sevenDaysHistory = [];
            $achievedDaysCount = 0; // Menghitung berapa target yang tercapai dalam 7 hari

            // Looping mundur 7 hari (0 = hari H, 1 = H-1, dst)
            for ($i = 6; $i >= 0; $i--) {
                $currentDate = $endDate->copy()->subDays($i);
                $dateString = $currentDate->toDateString();

                // Ambil data aktivitas riil pada tanggal tersebut
                $steps = PhysicalActivity::where('user_id', Auth::id())->whereDate('activity_date', $dateString)->sum('steps');
                $calories = PhysicalActivity::where('user_id', Auth::id())->whereDate('activity_date', $dateString)->sum('calories_burned');
                $sleep = SleepTracking::where('user_id', Auth::id())->whereDate('sleep_date', $dateString)->sum('sleep_duration');

                // Hitung persentase masing-masing
                $stepProgress = $target->step_target > 0 ? round(($steps / $target->step_target) * 100) : 0;
                $calorieProgress = $target->calorie_target > 0 ? round(($calories / $target->calorie_target) * 100) : 0;
                $sleepProgress = $target->sleep_target > 0 ? round(($sleep / $target->sleep_target) * 100) : 0;

                // Cek apakah hari ini sukses mencapai SEMUA GOAL (Step, Kalori, & Tidur >= 100%)
                $isAchieved = ($stepProgress >= 100 && $calorieProgress >= 100 && $sleepProgress >= 100);
                if ($isAchieved) {
                    $achievedDaysCount++;
                }

                // Array nama hari Indonesia
                $hariIndonesia = [
                    'Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa',
                    'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu'
                ];
                $dayName = $hariIndonesia[$currentDate->format('l')];

                $sevenDaysHistory[] = [
                    'hari' => $dayName,
                    'tanggal_formatted' => $currentDate->format('d M Y'),
                    'steps_real' => $steps,
                    'calories_real' => $calories,
                    'sleep_real' => $sleep,
                    'step_percentage' => min($stepProgress, 100),
                    'calorie_percentage' => min($calorieProgress, 100),
                    'sleep_percentage' => min($sleepProgress, 100),
                ];
            }

            // Dapatkan nama hari untuk tanggal Target utama
            $hariTarget = [
                'Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa',
                'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu'
            ][$endDate->format('l')];

            return [
                'id' => $target->id,
                'target_date' => $target->target_date,
                'hari_target' => $hariTarget,
                'step_target' => $target->step_target,
                'calorie_target' => $target->calorie_target,
                'sleep_target' => $target->sleep_target,
                'achieved_streak' => $achievedDaysCount, // Jumlah hari yang targetnya tembus 100%
                'history_7_days' => $sevenDaysHistory
            ];
        });

        return response()->json($customTargets);
    }

    public function store(Request $request)
    {
        $target = DailyTarget::create([
            'user_id' => Auth::id(),
            'step_target' => $request->step_target,
            'calorie_target' => $request->calorie_target,
            'sleep_target' => $request->sleep_target,
            'target_date' => $request->target_date,
        ]);

        return response()->json([
            'message' => 'Target harian berhasil dibuat',
            'data' => $target
        ]);
    }

    public function destroy($id)
    {
        $target = DailyTarget::where('user_id', Auth::id())->find($id);
        if (!$target) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        $target->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}