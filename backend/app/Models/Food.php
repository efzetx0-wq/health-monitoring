<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    protected $table = 'foods';

    protected $fillable = [
        'food_name',
        'calories',
        'protein',
        'carbohydrates',
        'fat',
        'serving_size'
    ];

    public function foodDiaries()
    {
        return $this->hasMany(FoodDiary::class);
    }
}
