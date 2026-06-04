<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SleepTracking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SleepTrackingController extends Controller
{
    public function index()
    {
        $sleep = SleepTracking::where('user_id', Auth::id())->latest()->get();
        return response()->json($sleep);
    }

    public function store(Request $request)
    {
        // 1. Tambahkan validasi agar request kosong tidak bikin server crash
        $validator = Validator::make($request->all(), [
            'sleep_time' => 'required',
            'wake_time' => 'required',
            'sleep_quality' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // 2. Gunakan parse() alih-alih createFromFormat() agar Carbon otomatis pintar 
            // membaca format waktu baik yang pakai detik (09:09:00) maupun tidak (09:09).
            $sleepTime = Carbon::parse($request->sleep_time);
            $wakeTime = Carbon::parse($request->wake_time);

            // Jika bangun lebih kecil dari jam tidur berarti melewati tengah malam
            if ($wakeTime->lessThan($sleepTime)) {
                $wakeTime->addDay();
            }

            $duration = $sleepTime->diffInMinutes($wakeTime) / 60;

            // 3. Simpan dengan format standar database (H:i:s)
            $sleep = SleepTracking::create([
                'user_id' => Auth::id(),
                'sleep_time' => $sleepTime->format('H:i:s'),
                'wake_time' => $wakeTime->format('H:i:s'),
                'sleep_duration' => round($duration, 2),
                'sleep_quality' => strtolower($request->sleep_quality), // disamakan jadi huruf kecil
                'notes' => $request->notes,
            ]);

            return response()->json([
                'message' => 'Data tidur berhasil disimpan',
                'data' => $sleep
            ], 201);

        } catch (\Exception $e) {
            // Jika ada error lain, backend tidak akan mengembalikan kode 500 kosong, melainkan pesan ini
            return response()->json([
                'message' => 'Gagal memproses data tidur',
                'error' => $e->getMessage()
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
            'sleep_time' => 'required',
            'wake_time' => 'required',
            'sleep_quality' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Menggunakan Carbon::parse() agar aman dari crash format
            $sleepTime = Carbon::parse($request->sleep_time);
            $wakeTime = Carbon::parse($request->wake_time);

            if ($wakeTime->lessThan($sleepTime)) {
                $wakeTime->addDay();
            }

            $duration = $sleepTime->diffInMinutes($wakeTime) / 60;

            $sleep->update([
                'sleep_time' => $sleepTime->format('H:i:s'),
                'wake_time' => $wakeTime->format('H:i:s'),
                'sleep_duration' => round($duration, 2),
                'sleep_quality' => strtolower($request->sleep_quality),
                'notes' => $request->notes,
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