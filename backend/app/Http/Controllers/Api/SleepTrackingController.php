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
    // 1. Validasi input standar
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
        // 2. Bersihkan string waktu dari frontend (buang detik :00 jika ada)
        // Kita hanya mengambil 5 karakter awal (contoh: "09:09:00" menjadi "09:09")
        $cleanSleep = substr($request->sleep_time, 0, 5);
        $cleanWake = substr($request->wake_time, 0, 5);

        // 3. Biarkan Carbon membaca format jam:menit secara aman
        $sleepTime = Carbon::createFromFormat('H:i', $cleanSleep);
        $wakeTime = Carbon::createFromFormat('H:i', $cleanWake);

        // Jika waktu bangun melewati tengah malam
        if ($wakeTime->lessThan($sleepTime)) {
            $wakeTime->addDay();
        }

        // 4. Hitung durasi secara akurat di backend
        $duration = $sleepTime->diffInMinutes($wakeTime) / 60;

        // 5. Simpan ke database dengan memaksakan format standar database yang paling aman
        $sleep = SleepTracking::create([
            'user_id'        => Auth::id(),
            // Jika kolom di database Anda bertipe DATETIME, gunakan ->format('Y-m-d H:i:s')
            // Jika kolom di database Anda bertipe TIME, gunakan ->format('H:i:s')
            // Di bawah ini kita buat fleksibel untuk mendukung tipe DATETIME database Anda:
            'sleep_time'     => $sleepTime->format('Y-m-d H:i:s'),
            'wake_time'      => $wakeTime->format('Y-m-d H:i:s'),
            'sleep_duration' => round($duration, 2),
            'sleep_quality'  => strtolower(trim($request->sleep_quality)), // hapus spasi tak terlihat
            'notes'          => $request->notes,
        ]);

        return response()->json([
            'message' => 'Data tidur berhasil disimpan',
            'data' => $sleep
        ], 201);

    } catch (\Exception $e) {
        // JIKA TETAP ERROR, KITA BONGKAR ERORNYA DI SINI
        return response()->json([
            'message' => 'Terjadi kesalahan pada database server',
            'error_pasti' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
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