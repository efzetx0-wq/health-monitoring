<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VitalSign;
use Illuminate\Support\Facades\Auth;

class VitalSignController extends Controller
{
    public function index()
    {
        $vitalSigns = VitalSign::where(
            'user_id',
            Auth::id()
        )->latest()->get();

        return response()->json($vitalSigns);
    }

    public function store(Request $request)
    {
        $vital = VitalSign::create([
            'user_id' => Auth::id(),
            'systolic_pressure' => $request->systolic_pressure,
            'diastolic_pressure' => $request->diastolic_pressure,
            'blood_sugar' => $request->blood_sugar,
            'heart_rate' => $request->heart_rate,
            'body_temperature' => $request->body_temperature,
            'weight' => $request->weight,
            'recorded_at' => $request->recorded_at,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Vital sign berhasil disimpan',
            'data' => $vital
        ]);
    }

    public function show($id)
    {
        $vital = VitalSign::findOrFail($id);

        return response()->json($vital);
    }

    public function update(Request $request, $id)
    {
        $vital = VitalSign::findOrFail($id);

        $vital->update([
            'systolic_pressure' => $request->systolic_pressure,
            'diastolic_pressure' => $request->diastolic_pressure,
            'blood_sugar' => $request->blood_sugar,
            'heart_rate' => $request->heart_rate,
            'body_temperature' => $request->body_temperature,
            'weight' => $request->weight,
            'recorded_at' => $request->recorded_at,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Vital sign berhasil diupdate',
            'data' => $vital
        ]);
    }

    public function destroy($id)
    {
        $vital = VitalSign::findOrFail($id);

        $vital->delete();

        return response()->json([
            'message' => 'Vital sign berhasil dihapus'
        ]);
    }
}