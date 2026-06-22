<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class OneSignalService
{
    public function sendNotification($data)
    {
        $client = new Client();
        $url = 'https://onesignal.com/api/v1/notifications';

        $payload = [
            'app_id'   => 'e9506fbc-546c-4507-8e4f-d8045929abfd',
            'headings' => ['en' => $data['title']], 
            'contents' => ['en' => $data['message']], 
            
            // Mengatur penundaan alarm sesuai jam target
            'send_after' => $data['send_after'] ?? null,
            
            // TARGETING PRIVAT: Hanya kirim ke user pemilik ID ini (Bukan seluruh subs)
            'include_aliases' => [
                'external_id' => [strval($data['user_id'])]
            ],
            'target_channel' => 'push'
        ];

        try {
            $response = $client->post($url, [
                'headers' => [
                    'Authorization' => 'Basic os_v2_app_5fig7pcunrcqpdsp3acfsknl7wuwjvl2qlvubjewjujys4gyxntlv24omzkm64mpko74j66rr75ahimxpzoereah3wt2ci7tvvhgoba',
                    'Content-Type'  => 'application/json',
                    'Accept'        => 'application/json',
                ],
                'json' => $payload,
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('OneSignal Push Error: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }
}