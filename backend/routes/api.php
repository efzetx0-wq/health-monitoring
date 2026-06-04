<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Kode pengaman baru agar tidak eror di terminal/CLI Railway
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HealthProfileController;
use App\Http\Controllers\Api\PhysicalActivityController;
use App\Http\Controllers\Api\FoodDiaryController;
use App\Http\Controllers\Api\SleepTrackingController;
use App\Http\Controllers\Api\VitalSignController;
use App\Http\Controllers\Api\DailyTargetController;
use App\Http\Controllers\Api\ReminderController;
use App\Http\Controllers\Api\HealthReportController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\MedicalController;
use App\Http\Controllers\Api\GoogleFitController;

// --- RUTE PUBLIK (Bisa diakses tanpa login) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);

// Di dalam file routes/api.php milik Laravel
// Ganti baris GoogleFit sebelumnya menjadi tiga baris ini:
// GANTI TIGA BARIS GOOGLE FIT LAMA ANDA MENJADI SEPERTI INI:
Route::get('/fit-kesehatan/auth', [GoogleFitController::class, 'auth']);
Route::get('/google-fit/callback', [GoogleFitController::class, 'callback']); // Tetap biarkan ini
Route::get('/google-fit/sync', [GoogleFitController::class, 'sync']);

// --- RUTE TERPROTEKSI (Wajib membawa Token Bearer) ---
Route::middleware('auth:sanctum')->group(function () {

    // Rute bawaan user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Autentikasi keluar
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profil Kesehatan
    Route::post('/health-profile', [HealthProfileController::class, 'store']);
    Route::get('/health-profile', [HealthProfileController::class, 'show']);

    // Aktivitas Fisik (CRUD Lengkap)
    Route::apiResource('physical-activities', PhysicalActivityController::class);

    // Jurnal Makanan
    Route::get('/food-diaries', [FoodDiaryController::class, 'index']);
    Route::post('/food-diaries', [FoodDiaryController::class, 'store']);
    Route::delete('/food-diaries/{id}', [FoodDiaryController::class, 'destroy']);
    
    // Pelacakan Tidur (DIUBAH: Sekarang aman di dalam middleware auth)
    Route::apiResource('sleep-trackings', SleepTrackingController::class);

    Route::apiResource('vital-signs', VitalSignController::class);

    Route::apiResource('daily-targets',DailyTargetController::class);

    Route::get('daily-progress',[DailyTargetController::class, 'progress']);

    Route::apiResource('reminders', ReminderController::class);

    Route::get('generate-weekly-report',[HealthReportController::class,'generateWeeklyReport']);
    
    Route::get('health-reports',[HealthReportController::class,'index']);

    Route::delete('health-reports/{id}',[HealthReportController::class,'destroy']);

    Route::get('/medical/patients', [MedicalController::class, 'patients']);

    Route::get(
    '/admin/users',
    [AdminUserController::class, 'index']
    );

    Route::put(
        '/admin/users/{id}/role',
        [AdminUserController::class, 'updateRole']
    );

    Route::delete(
        '/admin/users/{id}',
        [AdminUserController::class, 'destroy']
    );

    Route::get(
    '/medical/patient/{id}',
    [MedicalController::class,
    'patientDetail']
    );
    
    
});

