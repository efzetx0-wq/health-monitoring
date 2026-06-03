<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Models\HealthProfile;

use Illuminate\Support\Facades\Auth;

class HealthProfileController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET PROFILE
    |--------------------------------------------------------------------------
    */

    public function show()
    {
        $profile = HealthProfile::where(
            'user_id',
            Auth::id()
        )->first();

        // JIKA BELUM ADA PROFILE
        if (!$profile) {

            return response()->json(
                null,
                200
            );
        }

        return response()->json(
            $profile,
            200
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE / UPDATE PROFILE
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ) {

        $request->validate([

            'age' =>
                'required|numeric',

            'gender' =>
                'required',

            'height' =>
                'required|numeric',

            'weight' =>
                'required|numeric'
        ]);

        // BMI AUTO
        $heightMeter =
            $request->height / 100;

        $bmi =
            $request->weight /
            ($heightMeter * $heightMeter);

        // SAVE / UPDATE
        $profile =
            HealthProfile::updateOrCreate(

                [
                    'user_id' =>
                        Auth::id()
                ],

                [
                    'age' =>
                        $request->age,

                    'gender' =>
                        $request->gender,

                    'height' =>
                        $request->height,

                    'weight' =>
                        $request->weight,

                    'bmi' =>
                        round($bmi, 1)
                ]
            );

        return response()->json([

            'message' =>
                'Profile berhasil disimpan',

            'data' =>
                $profile
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE PROFILE
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $profile =
            HealthProfile::find($id);

        if (!$profile) {

            return response()->json([

                'message' =>
                    'Data tidak ditemukan'

            ], 404);
        }

        $profile->delete();

        return response()->json([

            'message' =>
                'Profile berhasil dihapus'

        ], 200);
    }
}