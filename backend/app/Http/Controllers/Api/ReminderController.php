<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reminder;
use Illuminate\Support\Facades\Auth; 
use App\Services\OneSignalService;

class ReminderController extends Controller
{
    public function index()
    {
        $reminders = Reminder::where(
            'user_id',
             Auth::id()
        )->latest()->get();

        return response()->json($reminders);
    }

    public function store(Request $request, OneSignalService $oneSignal)
    {
        $request->validate([
            'reminder_type' => 'required',
            'message' => 'required',
            'reminder_time' => 'required'
        ]);

        $reminder = Reminder::create([
            'user_id' => Auth::id(),
            'reminder_type' => $request->reminder_type,
            'message' => $request->message,
            'reminder_time' => $request->reminder_time,
            'is_active' => true
        ]);

        // PERBAIKAN: Kirim data dalam bentuk array agar sesuai dengan service
        $oneSignal->sendNotification([
            'title' => 'Reminder Baru',
            'message' => $request->message
        ]);

        return response()->json([
            'message' => 'Reminder berhasil dibuat',
            'data' => $reminder
        ]);
    }

    public function update(Request $request, $id)
    {
        $reminder = Reminder::findOrFail($id);

        $reminder->update(
            $request->only([
                'reminder_type',
                'message',
                'reminder_time',
                'is_active'
            ])
        );

        return response()->json([
            'message' => 'Reminder berhasil diupdate',
            'data' => $reminder
        ]);
    }

    public function destroy($id)
    {
        $reminder = Reminder::where(
            'user_id',
            Auth::id()
        )->findOrFail($id);

        $reminder->delete();

        return response()->json([
            'message' => 'Reminder berhasil dihapus'
        ]);
    }
}
