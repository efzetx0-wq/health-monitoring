<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Panggil FoodSeeder untuk mengisi database makanan Indonesia
        $this->call([
            FoodSeeder::class,
        ]);

        // 2. Kode asli Anda untuk membuat role aplikasi
        Role::create(['name' => 'user']);
        Role::create(['name' => 'medical']);
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'guest']);
    }
}
