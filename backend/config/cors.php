'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

'allowed_origins' => [
    'https://health-monitoring-peach.vercel.app', // WAJIB masukkan domain Vercel Anda di sini
],

'allowed_origins_patterns' => [],

'allowed_headers' => ['*'],

'exposed_headers' => [],

'max_age' => 0,

'supports_credentials' => true, // WAJIB di-set true agar cookie/token bisa lewat