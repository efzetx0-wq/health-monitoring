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
        // 1. TAMBAHKAN VALIDASI: Supaya data wajib terisi dan food_id benar-benar ada di tabel foods
        $request->validate([
            'food_id' => 'required',
            'quantity' => 'required|numeric|min:0.1',
            'consumed_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $food = Food::findOrFail($request->food_id);

        $totalCalories = $food->calories * $request->quantity;

        // 2. Simpan ke database
        $diary = FoodDiary::create([
            'user_id' => Auth::id(),
            'food_id' => $request->food_id,
            'quantity' => $request->quantity,
            'total_calories' => $totalCalories,
            'consumed_at' => $request->consumed_at,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Food diary berhasil ditambahkan',
            'data' => $diary
        ], 201); // Gunakan status 201 untuk penambahan data sukses
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

