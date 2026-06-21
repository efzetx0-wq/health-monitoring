<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodDiary extends Model
{
    // SESUAIKAN DENGAN KOLOM ASLI DI DATABASE JANGAN SAMPAI BEDA NAMA
    protected $fillable = [
        'user_id',
        'food_name',
        'portion',
        'calories',
        'ai_recommendation',
        'consumed_at', // 💡 Harus 'consumed_at' sesuai migration lama Anda, bukan 'log_date'
        'notes'        // 💡 Tambahkan ini agar catatan tambahan bisa disimpan ke database
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}