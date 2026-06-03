<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PhysicalActivity;
use Illuminate\Support\Facades\Auth; 

class PhysicalActivityController extends Controller
{
    public function index()
    {
        // Mengambil aktivitas hanya milik user yang sedang login
        $activities = PhysicalActivity::where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($activities);
    }

    public function store(Request $request)
    {
        // 1. Validasi data input dari user
        $validated = $request->validate([
            'activity_type' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'steps' => 'nullable|integer|min:0',
            'calories_burned' => 'nullable|integer|min:0',
            'activity_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // 2. Tambahkan user_id otomatis ke dalam data yang sudah divalidasi
        $validated['user_id'] = Auth::id();

        // 3. Simpan data ke database
        $activity = PhysicalActivity::create($validated);

        return response()->json([
            'message' => 'Aktivitas berhasil disimpan',
            'data' => $activity
        ], 201) ; // Status 201: Created
    }

    public function show($id)
    {
        // Keamanan: Pastikan data yang dicari adalah milik user yang login
        $activity = PhysicalActivity::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json($activity);
    }

    public function update(Request $request, $id)
    {
        // Keamanan: Pastikan data yang mau diupdate adalah milik user yang login
        $activity = PhysicalActivity::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Validasi data input
        $validated = $request->validate([
            'activity_type' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'steps' => 'nullable|integer|min:0',
            'calories_burned' => 'nullable|integer|min:0',
            'activity_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Update data menggunakan hasil validasi
        $activity->update($validated);

        return response()->json([
            'message' => 'Aktivitas berhasil diupdate',
            'data' => $activity
        ]);
    }

    public function destroy($id)
    {
        // Keamanan: Pastikan data yang mau dihapus adalah milik user yang login
        $activity = PhysicalActivity::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $activity->delete();

        return response()->json([
            'message' => 'Aktivitas berhasil dihapus'
        ]);
    }
}
