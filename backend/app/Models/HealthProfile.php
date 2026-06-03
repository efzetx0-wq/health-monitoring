<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthProfile extends Model
{
        protected $fillable = [
        'user_id',
        'age',
        'gender',
        'height',
        'weight',
        'bmi'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function patientDetail($id)
{
    $profile =
    HealthProfile::where(
        'user_id',
        $id
    )
    ->with('user')
    ->first();

    $activities =
    \App\Models\PhysicalActivity::where(
        'user_id',
        $id
    )->latest()->get();

    $sleep =
    \App\Models\SleepTracking::where(
        'user_id',
        $id
    )->latest()->get();

    return response()->json([

        'user' =>
        $profile->user,

        'bmi' =>
        $profile->bmi,

        'height' =>
        $profile->height,

        'weight' =>
        $profile->weight,

        'activities' =>
        $activities,

        'sleep' =>
        $sleep
    ]);
}
}