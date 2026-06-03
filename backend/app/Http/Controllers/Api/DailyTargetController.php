<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DailyTarget;
use App\Models\PhysicalActivity;
use App\Models\SleepTracking;
use Illuminate\Support\Facades\Auth;

class DailyTargetController extends Controller
{
    public function index()
    {
        $targets = DailyTarget::where(
            'user_id',
            Auth::id()
        )->latest()->get();

        return response()->json($targets);
    }

    public function store(Request $request)
    {
        $target = DailyTarget::create([
            'user_id' => Auth::id(),
            'step_target' => $request->step_target,
            'calorie_target' => $request->calorie_target,
            'sleep_target' => $request->sleep_target,
            'water_target' => $request->water_target,
            'target_date' => $request->target_date,
        ]);

        return response()->json([
            'message' => 'Target harian berhasil dibuat',
            'data' => $target
        ]);
    }

    public function destroy($id)
{
    $target = DailyTarget::where(
        'user_id',
        Auth::id()
    )->find($id);

    if (!$target) {

        return response()->json([
            'message' => 'Data tidak ditemukan'
        ], 404);
    }

    $target->delete();

    return response()->json([
        'message' => 'Data berhasil dihapus'
    ]);
}

    public function progress()
    {
        $today = now()->toDateString();

        $target = DailyTarget::where(
            'user_id',
            Auth::id()
        )->where('target_date', $today)
         ->first();

        if (!$target) {
            return response()->json([
                'message' => 'Target hari ini belum dibuat'
            ]);
        }

        $steps = PhysicalActivity::where(
            'user_id',
            Auth::id()
        )->whereDate('activity_date', $today)
         ->sum('steps');

        $calories = PhysicalActivity::where(
            'user_id',
            Auth::id()
        )->whereDate('activity_date', $today)
         ->sum('calories_burned');

        $sleep = SleepTracking::where(
            'user_id',
            Auth::id()
        )->whereDate('created_at', $today)
         ->sum('sleep_duration');

        return response()->json([

            'step_progress' => round(
                ($steps / $target->step_target) * 100,
                2
            ),

            'calorie_progress' => round(
                ($calories / $target->calorie_target) * 100,
                2
            ),

            'sleep_progress' => round(
                ($sleep / $target->sleep_target) * 100,
                2
            ),

            'steps_today' => $steps,
            'calories_today' => $calories,
            'sleep_today' => $sleep,

            'target' => $target
        ]);
    }
}

