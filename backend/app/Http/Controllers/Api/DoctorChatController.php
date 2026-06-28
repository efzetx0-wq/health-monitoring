<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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

    // Menyimpan pesan baru ke database (Sudah Diperbaiki untuk Upload File Fisik)
    public function sendMessage(Request $request)
    {
        // 1. Validasi Inputan dari Frontend
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message'     => 'nullable|string',
            'file'        => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx,doc|max:10240', // Maksimal berkas 10MB
            'link_url'    => 'nullable|string',
        ]);

        $fileUrl = null;
        $isImage = false;

        // 2. Cek Jika Ada File Fisik yang Diunggah Lewat FormData
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Simpan file ke direktori 'public/chats' di storage Laravel
            $path = $file->store('chats', 'public');
            
            // Konversi path menjadi URL absolut yang bisa diakses publik oleh React
            $fileUrl = asset('storage/' . $path);

            // Periksa secara dinamis apakah berkas merupakan gambar
            if (str_contains($file->getMimeType(), 'image')) {
                $isImage = true;
            }
        }

        // 3. Simpan Seluruh Informasi ke Tabel Messages
        $message = Message::create([
            'sender_id'   => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message'     => $request->message,
            'file_url'    => $fileUrl, // Menyimpan link gambar/file hasil upload
            'is_image'    => $isImage,  // Bernilai true jika gambar, false jika PDF/dokumen
            'link_url'    => $request->link_url,
        ]);

        return response()->json($message, 201);
    }
}