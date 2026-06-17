<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyTarget extends Model
{
    
    protected $fillable = [
        'user_id',
        'step_target',
        'calorie_target',
        'sleep_target',
        'target_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}