<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PhysicalActivity;
use Illuminate\Support\Facades\Cache; 

class GoogleFitController extends Controller
{
    public function auth()
    {
        $client = new \Google\Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        
        // KOREKSI: Gunakan rtrim() untuk memastikan tidak terjadi double slash '//api'
        $baseUrl = rtrim(env('APP_URL'), '/');
        $client->setRedirectUri($baseUrl . '/api/google-fit/callback');

        $client->setScopes([]); 
        $client->addScope("https://www.googleapis.com/auth/fitness.activity.read"); 

        // KOREKSI AMAN: Masukkan ID User yang sedang aktif ke parameter State Google 
        // agar tidak hilang saat proses callback lintas domain
        if (Auth::check()) {
            $client->setState(Auth::id());
        }

        return redirect($client->createAuthUrl());
    }

    public function callback(Request $request)
    {
        $client = new \Google\Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        
        $baseUrl = rtrim(env('APP_URL'), '/');
        $client->setRedirectUri($baseUrl . '/api/google-fit/callback');

        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        // KUNCI PERBAIKAN 1: Ambil ID User dari state Google, atau dari Auth jika tersedia
        $userId = $request->state ?? Auth::id();
        
        if ($userId) {
            // Simpan token di cache selama 24 jam penuh agar tidak cepat kedaluwarsa
            Cache::put('google_token_' . $userId, $token, 86400);
        } else {
            // Cadangan darurat jika dua-duanya tidak terbaca
            Cache::put('google_token_latest_guest', $token, 3600);
        }

        // REDIRECT BALIK KE FRONTEND VERCEL
        $frontendUrl = rtrim(env('CORS_ALLOWED_ORIGINS'), '/');
        return redirect($frontendUrl . '/dashboard?status=google-connected');
    }

    public function sync()
    {
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json(['message' => 'Sesi login web Anda habis. Silakan relogin ke aplikasi.'], 401);
        }

        // KUNCI PERBAIKAN 2: Cari di cache berdasarkan ID user Anda, jika tidak ketemu coba ambil cadangan guest
        $token = Cache::get('google_token_' . $userId) ?? Cache::get('google_token_latest_guest');

        if (!$token) {
            return response()->json([
                'message' => 'Google Fit belum terkoneksi atau token kedaluwarsa. Silakan klik ulang tombol Hubungkan Akun Google.'
            ], 401);
        }

        $client = new \Google\Client();
        $client->setAccessToken($token);

        // KUNCI PERBAIKAN 3: Jika token dari Google sudah expired, segarkan otomatis
        if ($client->isAccessTokenExpired()) {
            if (isset($token['refresh_token'])) {
                $newToken = $client->fetchAccessTokenWithRefreshToken($token['refresh_token']);
                Cache::put('google_token_' . $userId, $newToken, 86400);
                $client->setAccessToken($newToken);
            }
        }

        $fitness = new \Google\Service\Fitness($client);

        $endTime = now()->timestamp * 1000;
        $startTime = now()->startOfDay()->timestamp * 1000;

        $body = new \Google\Service\Fitness\AggregateRequest([
            'aggregateBy' => [
                [
                    'dataTypeName' => 'com.google.step_count.delta'
                ]
            ],
            'bucketByTime' => [
                'durationMillis' => 86400000
            ],
            'startTimeMillis' => $startTime,
            'endTimeMillis' => $endTime
        ]);

        try {
            $data = $fitness->users_dataset->aggregate('me', $body);
            $steps = 0;

            foreach ($data->getBucket() as $bucket) {
                foreach ($bucket->getDataset() as $dataset) {
                    foreach ($dataset->getPoint() as $point) {
                        foreach ($point->getValue() as $value) {
                            $steps += $value->getIntVal();
                        }
                    }
                }
            }

            $calories = round($steps * 0.04, 2);

            // Simpan atau perbarui data ke tabel physical_activities Anda
           PhysicalActivity::updateOrCreate(
    [
        'user_id'       => $userId,
        'activity_date' => now()->toDateString(),
    ],
    [
        // 1. Mengisi activity_type (Wajib)
        'activity_type'    => 'Jalan Kaki (Google Fit)', 
        
        // 2. Mengisi duration_minutes (Wajib - kita beri default 30 menit atau sesuaikan keinginan Anda)
        'duration_minutes' => 30, 
        
        // 3. Mengisi steps (Sudah aman karena di DB ada default = 0, tapi tetap kita masukkan datanya)
        'steps'            => $steps,
        
        // 4. Mengisi calories_burned (Wajib)
        'calories_burned'  => $calories,
        
        // 5. Notes (Opsional, karena di DB bernilai Null = YES)
        'notes'            => 'Disinkronkan otomatis via Google Fit API',
    ]
);
            return response()->json([
                'success' => true,
                'steps' => $steps,
                'calories' => $calories,
                'message' => 'Data otomatis tersimpan ke database!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data dari Google API: ' . $e->getMessage()
            ], 500);
        }
    }
}