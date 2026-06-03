<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SleepTracking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class SleepTrackingController extends Controller
{
    public function index()
    {
        $sleep = SleepTracking::where(
            'user_id',
            Auth::id()
        )->latest()->get();

        return response()->json($sleep);
    }

    public function store(Request $request)
    {
        $sleepTime = Carbon::createFromFormat(
            'H:i',
            $request->sleep_time
        );

        $wakeTime = Carbon::createFromFormat(
            'H:i',
            $request->wake_time
        );

        // Jika bangun lebih kecil dari jam tidur
        // berarti tidur melewati tengah malam
        if ($wakeTime->lessThan($sleepTime)) {

            $wakeTime->addDay();
        }

        $duration =
            $sleepTime->diffInMinutes(
                $wakeTime
            ) / 60;

        $sleep = SleepTracking::create([

            'user_id' =>
                Auth::id(),

            'sleep_time' =>
                $request->sleep_time,

            'wake_time' =>
                $request->wake_time,

            'sleep_duration' =>
                round($duration, 2),

            'sleep_quality' =>
                $request->sleep_quality,

            'notes' =>
                $request->notes,
        ]);

        return response()->json([

            'message' =>
                'Data tidur berhasil disimpan',

            'data' => $sleep
        ]);
    }

    public function show($id)
    {
        $sleep =
            SleepTracking::findOrFail($id);

        return response()->json($sleep);
    }

    public function update(
        Request $request,
        $id
    ) {

        $sleep =
            SleepTracking::findOrFail($id);

        $sleepTime = Carbon::createFromFormat(
            'H:i',
            $request->sleep_time
        );

        $wakeTime = Carbon::createFromFormat(
            'H:i',
            $request->wake_time
        );

        // Jika bangun lebih kecil dari jam tidur
        // berarti tidur melewati tengah malam
        if ($wakeTime->lessThan($sleepTime)) {

            $wakeTime->addDay();
        }

        $duration =
            $sleepTime->diffInMinutes(
                $wakeTime
            ) / 60;

        $sleep->update([

            'sleep_time' =>
                $request->sleep_time,

            'wake_time' =>
                $request->wake_time,

            'sleep_duration' =>
                round($duration, 2),

            'sleep_quality' =>
                $request->sleep_quality,

            'notes' =>
                $request->notes,
        ]);

        return response()->json([

            'message' =>
                'Data tidur berhasil diupdate',

            'data' => $sleep
        ]);
    }

    public function destroy($id)
    {
        $sleep =
            SleepTracking::findOrFail($id);

        $sleep->delete();

        return response()->json([

            'message' =>
                'Data tidur berhasil dihapus'
        ]);
    }
}