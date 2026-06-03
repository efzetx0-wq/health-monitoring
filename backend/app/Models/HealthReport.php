<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthReport extends Model
{
    protected $fillable = [
        'user_id',
        'report_period_start',
        'report_period_end',
        'average_sleep',
        'average_calories_burned',
        'average_steps',
        'bmi_status',
        'health_insight',
        'generated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}