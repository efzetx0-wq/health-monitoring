<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PhysicalActivity;
// IMPORT SELESAI: Panggil Cache untuk menggantikan Session yang sering hilang di lintas domain
use Illuminate\Support\Facades\Cache; 

class GoogleFitController extends Controller
{
    public function auth()
    {
        $client = new \Google\Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        
        // DINAMIS: Menggunakan APP_URL dari Railway (Otomatis berubah jadi https://health-monitoring... di server)
        $client->setRedirectUri(env('APP_URL') . '/api/google-fit/callback');

        $client->setScopes([]); 
        $client->addScope("https://www.googleapis.com/auth/fitness.activity.read"); // Scope resmi membaca langkah kaki

        return redirect($client->createAuthUrl());
    }

    public function callback(Request $request)
    {
        $client = new \Google\Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        
        // DINAMIS: Samakan dengan fungsi auth
        $client->setRedirectUri(env('APP_URL') . '/api/google-fit/callback');

        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        // AMAN: Simpan token menggunakan Cache berbasis database Railway selama 1 jam, gunakan ID user sebagai pembeda
        if (Auth::check()) {
            Cache::put('google_token_' . Auth::id(), $token, 3600);
        } else {
            // Backup jika diakses sebelum login web selesai
            Cache::put('google_token_guest', $token, 3600);
        }

        // REDIRECT BALIK KE FRONTEND VERCEL SETELAH SELESAI KONEKSI GOOGLE
        return redirect(env('CORS_ALLOWED_ORIGINS') . '/dashboard?status=google-connected');
    }

    public function sync()
    {
        // Ambil token dari Cache, bukan dari Session
        $userId = Auth::id() ?? 'guest';
        $token = Cache::get('google_token_' . $userId);

        if (!$token) {
            return response()->json([
                'message' => 'Google Fit belum terkoneksi atau token kedaluwarsa'
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

        if (Auth::check()) {
            PhysicalActivity::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'date'    => now()->toDateString(),
                ],
                [
                    'steps'    => $steps,
                    'calories' => $calories,
                ]
            );
        }

        return response()->json([
            'steps' => $steps,
            'calories' => $calories,
            'message' => 'Data otomatis tersimpan ke database!'
        ]);
    }
}