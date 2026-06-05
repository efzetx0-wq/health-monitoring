<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodDiary;
use App\Models\Food;
use Illuminate\Support\Facades\Auth; 

class FoodDiaryController extends Controller
{
    public function index()
    {
        $diaries = FoodDiary::with('food')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($diaries);
    }

   public function store(Request $request)
{
    $request->validate([
        'food_id' => 'required',
        'quantity' => 'required|numeric|min:0.1',
        'consumed_at' => 'required',
        'notes' => 'nullable|string',
    ]);

    try {
        // 1. BERSIHKAN HURUF 'T' DARI TANGGAL REACT
        // Mengubah "2026-06-05T21:09" menjadi "2026-06-05 21:09:00" yang ramah SQL
        $cleanDateTime = str_replace('T', ' ', $request->consumed_at);
        $finalDateTime = \Carbon\Carbon::parse($cleanDateTime)->format('Y-m-d H:i:s');

        // 2. AMBIL KALORI ASLI DAN HITUNG TOTALNYA
        $baseCalories = (float) $request->total_calories;
        $totalCalories = $baseCalories * (float) $request->quantity;

        // 3. SIMPAN KE DATABASE DENGAN TRY-CATCH AMAN
        $diary = FoodDiary::create([
            'user_id' => Auth::id(),
            
            // TIPS ANTI-CRASH: Jika database Railway Anda menolak angka 1 karena tabel foods kosong,
            // kita bisa memaksa menyimpan ID 1 secara mentah atau set null jika diizinkan.
            // Di sini kita masukkan sesuai kiriman React Anda:
            'food_id' => $request->food_id,
            
            'quantity' => $request->quantity,
            'total_calories' => $totalCalories,
            'consumed_at' => $finalDateTime,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Food diary berhasil ditambahkan',
            'data' => $diary
        ], 201);

    } catch (\Exception $e) {
        // JIKA DATABASE RAILWAY TETAP MENOLAK, KITA BONGKAR ALASANNYA DI SINI
        return response()->json([
            'message' => 'Database Railway Menolak Menyimpan!',
            'Penyebab_Error_Asli' => $e->getMessage(),
            'Solusi_Lanjutan' => 'Jika tertulis "Foreign Key Constraint", Anda wajib mengisi tabel foods atau mengubah kolom food_id di migration menjadi nullable()'
        ], 500);
    }
}
    public function destroy($id)
{
    $foodDiary = FoodDiary::findOrFail($id);

    $foodDiary->delete();

    return response()->json([
        'message' => 'Food diary berhasil dihapus'
    ]);
}
}

