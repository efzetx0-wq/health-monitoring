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
        
        // KOREKSI: Gunakan rtrim() agar URL sinkron 100%
        $baseUrl = rtrim(env('APP_URL'), '/');
        $client->setRedirectUri($baseUrl . '/api/google-fit/callback');

        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        // KOREKSI AMAN: Ambil ID User dari parameter state yang dikembalikan oleh Google
        $userId = $request->state ?? Auth::id() ?? 'guest';
        
        // Simpan token ke cache berdasarkan ID user sesungguhnya
        Cache::put('google_token_' . $userId, $token, 3600);

        // REDIRECT BALIK KE FRONTEND VERCEL SETELAH SELESAI KONEKSI GOOGLE
        $frontendUrl = rtrim(env('CORS_ALLOWED_ORIGINS'), '/');
        return redirect($frontendUrl . '/dashboard?status=google-connected');
    }

    public function sync()
    {
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Ambil token dari Cache menggunakan ID User autentikasi Sanctum
        $token = Cache::get('google_token_' . $userId);

        if (!$token) {
            return response()->json([
                'message' => 'Google Fit belum terkoneksi atau token kedaluwarsa. Pastikan akun Google Fit sudah terhubung di menu /google-fit.'
            ], 401);
        }

        $client = new \Google\Client();
        $client->setAccessToken($token);

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
                    'user_id' => $userId,
                    'date'    => now()->toDateString(),
                ],
                [
                    'steps'    => $steps,
                    'calories' => $calories,
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