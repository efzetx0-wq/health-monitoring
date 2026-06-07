<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class DoctorChatController extends Controller
{
    // Mengambil seluruh riwayat chat antara User Aktif dengan lawan bicaranya
    public function getMessages($partnerId)
    {
        $userId = Auth::id();

        $messages = Message::where(function($query) use ($userId, $partnerId) {
            $query->where('sender_id', $userId)->where('receiver_id', $partnerId);
        })->orWhere(function($query) use ($userId, $partnerId) {
            $query->where('sender_id', $partnerId)->where('receiver_id', $userId);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        return response()->json($messages);
    }

    // Menyimpan pesan baru ke database
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'nullable|string',
            'file_url' => 'nullable|string',
            'is_image' => 'nullable|boolean',
            'link_url' => 'nullable|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'file_url' => $request->file_url,
            'is_image' => $request->is_image ?? false,
            'link_url' => $request->link_url,
        ]);

        return response()->json($message);
    }
}