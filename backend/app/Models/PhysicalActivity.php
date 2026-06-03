<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhysicalActivity extends Model
{
    use HasFactory;

    // Daftarkan semua kolom yang boleh diisi massal
    protected $fillable = [
        'user_id',
        'activity_type',
        'duration_minutes',
        'steps',
        'calories_burned',
        'activity_date',
        'notes',
    ];
}
