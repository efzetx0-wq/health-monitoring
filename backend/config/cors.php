<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout'],
    
    // Kita izinkan semua method (GET, POST, OPTIONS, dll)
    'allowed_methods' => ['*'],
    
    // WAJIB: Gunakan '*' atau daftarkan domain Vercel Anda secara spesifik
    'allowed_origins' => ['*'], 

    'allowed_origins_patterns' => [],
    
    // Kita izinkan semua header bawaan browser dan axios
    'allowed_headers' => ['*'],

    'exposed_headers' => [],
    
    'max_age' => 0,
    
    // WAJIB TRUE karena di frontend kita pakai withCredentials: true
    'supports_credentials' => true,
];