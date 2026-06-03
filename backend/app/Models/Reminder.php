<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $fillable = [
        'user_id',
        'reminder_type',
        'message',
        'reminder_time',
        'is_active'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}