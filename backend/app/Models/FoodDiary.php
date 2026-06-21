<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodDiary extends Model
{
    protected $fillable = [
        'user_id',
        'food_name',
        'portion',
        'calories',
        'ai_recommendation',
        'log_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}