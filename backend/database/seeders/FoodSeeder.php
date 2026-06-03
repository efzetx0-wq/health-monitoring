<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Food;

class FoodSeeder extends Seeder
{
    public function run(): void
    {
        // Data tiruan makanan Indonesia beserta perkiraan kalorinya
        $foods = [
            [
                'food_name' => 'Nasi Goreng Ayam',
                'calories' => 350.00,
                'protein' => 12.00,
                'carbohydrates' => 45.00,
                'fat' => 11.00,
                'serving_size' => '1 porsi'
            ],
            [
                'food_name' => 'Sate Ayam (5 Tusuk)',
                'calories' => 225.00,
                'protein' => 18.00,
                'carbohydrates' => 5.00,
                'fat' => 13.00,
                'serving_size' => '1 porsi'
            ],
            [
                'food_name' => 'Gado-Gado',
                'calories' => 295.00,
                'protein' => 10.00,
                'carbohydrates' => 32.00,
                'fat' => 14.00,
                'serving_size' => '1 porsi'
            ],
            [
                'food_name' => 'Bakso Sapi Semangkok',
                'calories' => 325.00,
                'protein' => 15.00,
                'carbohydrates' => 28.00,
                'fat' => 12.00,
                'serving_size' => '1 porsi'
            ]
        ];

        foreach ($foods as $food) {
            Food::create($food);
        }
    }
}
