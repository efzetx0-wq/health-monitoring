<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reminder;
use Illuminate\Support\Facades\Auth; 
use App\Services\OneSignalService;
use Carbon\Carbon;

class ReminderController extends Controller
{
    public function index()
    {
        $reminders = Reminder::where('user_id', Auth::id())->latest()->get();
        return response()->json($reminders);
    }

    public function store(Request $request, OneSignalService $oneSignal)
    {
        $request->validate([
            'reminder_type' => 'required',
            'message' => 'required',
            'reminder_time' => 'required' // Format dari React: "HH:MM" (contoh: "17:00")
        ]);

        $reminder = Reminder::create([
            'user_id' => Auth::id(),
            'reminder_type' => $request->reminder_type,
            'message' => $request->message,
            'reminder_time' => $request->reminder_time,
            'is_active' => true
        ]);

        // KONTROL WAKTU: Gabungkan tanggal hari ini dengan jam pilihan user
        $targetTime = Carbon::parse(Carbon::today()->toDateString() . ' ' . $request->reminder_time);

        // Jika jam yang dimasukkan sudah lewat untuk hari ini, jadwalkan otomatis untuk besok
        if ($targetTime->isPast()) {
            $targetTime->addDay();
        }

        // Kirim data ke OneSignal Service dengan waktu tunda (send_after)
        $oneSignal->sendNotification([
            'title' => $this->getReminderTitle($request->reminder_type),
            'message' => $request->message,
            'send_after' => $targetTime->toIso8601String(), // Waktu format ISO 8601
            'user_id' => Auth::id() // Diperlukan untuk menargetkan ID spesifik
        ]);

        return response()->json([
            'message' => 'Reminder berhasil dibuat dan dijadwalkan',
            'data' => $reminder
        ]);
    }

    public function update(Request $request, $id)
    {
        $reminder = Reminder::findOrFail($id);
        $reminder->update($request->only(['reminder_type', 'message', 'reminder_time', 'is_active']));

        return response()->json([
            'message' => 'Reminder berhasil diupdate',
            'data' => $reminder
        ]);
    }

    public function destroy($id)
    {
        $reminder = Reminder::where('user_id', Auth::id())->findOrFail($id);
        $reminder->delete();

        return response()->json([
            'message' => 'Reminder berhasil dihapus'
        ]);
    }

    // Helper judul notifikasi interaktif
    private function getReminderTitle($type)
    {
        switch ($type) {
            case 'drink_water': return '💧 Waktunya Minum Air!';
            case 'exercise': return '💪 Yuk Olahraga!';
            case 'sleep': return '😴 Waktunya Istirahat Tidur';
            case 'eat': return '🍽️ Waktunya Makan';
            default: return '⏰ Pengingat Kesehatan';
        }
    }
}