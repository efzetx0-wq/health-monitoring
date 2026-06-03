<?php

namespace App\Services;

use GuzzleHttp\Client;

class OneSignalService
{
    public function sendNotification($data)
    {
        $client = new \GuzzleHttp\Client();

        $response = $client->post('https://onesignal.com', [
            'headers' => [
                // MASUKKAN REST API KEY LANGSUNG DI SINI
                'Authorization' => 'Basic os_v2_app_5fig7pcunrcqpdsp3acfsknl7wuwjvl2qlvubjewjujys4gyxntlv24omzkm64mpko74j66rr75ahimxpzoereah3wt2ci7tvvhgoba',
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ],
            'json' => [
                // MASUKKAN APP ID LANGSUNG DI SINI
                'app_id'   => 'e9506fbc-546c-4507-8e4f-d8045929abfd',
                'headings' => ['en' => $data['title']], 
                'contents' => ['en' => $data['message']], 
                'included_segments' => ['Total Subscriptions'], 
            ],
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
