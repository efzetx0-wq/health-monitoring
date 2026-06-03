<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'otp',
    'otp_expired_at',
    'is_verified'
];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function healthProfile()
{
    return $this->hasOne(HealthProfile::class);
}

    public function physicalActivities()
{
    return $this->hasMany(PhysicalActivity::class);
}

    public function foodDiaries()
{
    return $this->hasMany(FoodDiary::class);
}

    public function sleepTrackings()
{
    return $this->hasMany(SleepTracking::class);
}

    public function vitalSigns()
{
    return $this->hasMany(VitalSign::class);
}

    public function dailyTargets()
{
    return $this->hasMany(DailyTarget::class);
}

    public function reminders()
{
    return $this->hasMany(Reminder::class);
}

    public function notifications()
{
    return $this->hasMany(Notification::class);
}

    public function healthReports()
{
    return $this->hasMany(HealthReport::class);
}
}

