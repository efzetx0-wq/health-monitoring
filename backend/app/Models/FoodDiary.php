<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodDiary extends Model
{
    protected $fillable = [
        'user_id',
        'food_id',
        'quantity',
        'total_calories',
        'consumed_at',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}