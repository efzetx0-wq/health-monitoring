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
    // 1. Kita sesuaikan validasi agar menerima total_calories langsung dari React
    $request->validate([
        'food_id' => 'required|numeric', // Kita matikan fungsi 'exists:foods,id' agar tidak terkunci database kosong
        'quantity' => 'required|numeric|min:0.1',
        'consumed_at' => 'required',
        'notes' => 'nullable|string',
    ]);

    try {
        // 2. Ambil total_calories dari request frontend. 
        // Bersihkan string " kcal" jika terbawa dari input form React
        $cleanCalories = (float) str_replace(' kcal', '', $request->total_calories);
        
        // Hitung total kalori berdasarkan porsi yang diinput
        $finalCalories = $cleanCalories * (float) $request->quantity;

        // 3. Simpan langsung ke database diary
        $diary = FoodDiary::create([
            'user_id' => Auth::id(),
            'food_id' => $request->food_id,
            'quantity' => $request->quantity,
            'total_calories' => $finalCalories,
            'consumed_at' => \Carbon\Carbon::parse($request->consumed_at)->format('Y-m-d H:i:s'),
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Food diary berhasil ditambahkan',
            'data' => $diary
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Gagal menyimpan data makanan',
            'error' => $e->getMessage()
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

