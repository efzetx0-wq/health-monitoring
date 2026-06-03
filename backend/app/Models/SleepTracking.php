<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SleepTracking extends Model
{
    protected $fillable = [
        'user_id',
        'sleep_time',
        'wake_time',
        'sleep_duration',
        'sleep_quality',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}