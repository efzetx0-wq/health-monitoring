<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\User;

class MedicalController extends Controller
{
    // LIST PATIENTS
    public function patients()
    {
        return User::where(
            'role',
            'user'
        )->get();
    }

    // DETAIL PATIENT
 public function patientDetail($id)
    {
        $patient = User::with([
            'healthProfile',
            'physicalActivities',
            'sleepTrackings',
            'vitalSigns',
            'healthReports'
        ])->findOrFail($id);

        return response()->json(
            $patient
        );
    }
}