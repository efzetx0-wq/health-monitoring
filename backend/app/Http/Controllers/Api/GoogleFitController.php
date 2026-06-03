<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// IMPORT: Panggil facade Auth untuk mendapatkan ID user yang sedang login
use Illuminate\Support\Facades\Auth;
// IMPORT SELESAI: Memanggil Model PhysicalActivity milik Anda
use App\Models\PhysicalActivity;

class GoogleFitController extends Controller
{
        public function auth()
    {
        $client = new \Google\Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        
        // PAKSA REDIRECT URI MENGGUNAKAN LOCALHOST AGAR COCOK DENGAN SETELAN GOOGLE
        $client->setRedirectUri('http://localhost:8000/api/google-fit/callback');

        // LANGKAH KRUSIAL: Paksa kosongkan semua scope bawaan agar link salah "https://googleapis.com" terbuang total
        $client->setScopes([]); 

        // Masukkan scope resmi Google Fit yang utuh ke dalam fungsi addScope
        $client->addScope("https://googleapis.com");

        return redirect($client->createAuthUrl());
    }


    public function callback(Request $request)
    {
        $client = new \Google\Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        
        // PAKSA REDIRECT URI MENGGUNAKAN LOCALHOST AGAR COCOK DENGAN SETELAN GOOGLE
        $client->setRedirectUri('http://localhost:8000/api/google-fit/callback');

        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        session(['google_token' => $token]);

        return response()->json([
            'message' => 'Google Fit connected'
        ]);
    }

    public function sync()
    {
        $token = session('google_token');

        if (!$token) {
            return response()->json([
                'message' => 'Google Fit belum terkoneksi'
            ], 401);
        }

        $client = new \Google\Client();
        $client->setAccessToken($token);

        // Memanggil objek Fitness secara absolut untuk menghilangkan garis merah
        $fitness = new \Google\Service\Fitness($client);

        $endTime = now()->timestamp * 1000;
        $startTime = now()->startOfDay()->timestamp * 1000;

        // Memanggil objek AggregateRequest secara absolut untuk menghilangkan garis merah
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

        // TAMBAHAN OTOMATISASI: Menyimpan data otomatis ke tabel PhysicalActivity Anda
        if (Auth::check()) {
            PhysicalActivity::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'date'    => now()->toDateString(), // Format database: YYYY-MM-DD
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
