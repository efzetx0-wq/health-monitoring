<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VitalSign extends Model
{
    protected $fillable = [
        'user_id',
        'systolic_pressure',
        'diastolic_pressure',
        'blood_sugar',
        'heart_rate',
        'body_temperature',
        'weight',
        'recorded_at',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}