<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http; // KITA TAMBAHKAN INI UNTUK TEMBAK API
use Carbon\Carbon;

class AuthController extends Controller
{
    // REGISTER (MENGGUNAKAN JALUR WEB GOOGLE APPS SCRIPT - ANTI BLOKIR)
    public function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // GENERATE OTP
        $otp = rand(100000, 999999);

        try {
            // Bungkus dengan Database Transaction agar aman
            $user = \Illuminate\Support\Facades\DB::transaction(function () use ($request, $otp) {
                return User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                    'role' => 'user',
                    'otp' => $otp,
                    'otp_expired_at' => Carbon::now()->addMinutes(5),
                    'is_verified' => false
                ]);
            });

            // MEMBUAT TAMPILAN EMAIL HTML SEDERHANA
            $htmlBody = "
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;'>
                    <h2 style='color: #4A5568;'>Verifikasi Kode OTP</h2>
                    <p>Halo <b>" . $user->name . "</b>,</p>
                    <p>Terima kasih telah mendaftar di Aplikasi Health Monitoring. Berikut adalah kode OTP Anda untuk memverifikasi akun:</p>
                    <div style='background: #EDF2F7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2B6CB0; margin: 20px 0;'>
                        " . $otp . "
                    </div>
                    <p style='font-size: 12px; color: #718096;'>Kode ini hanya berlaku selama 5 menit. Jangan sebarkan kode ini kepada siapa pun.</p>
                </div>
            ";

            // TEMBAK URL GOOGLE APPS SCRIPT VIA JALUR WEB (HTTP POST)
            $response = Http::post(env('GOOGLE_SCRIPT_URL'), [
                'to' => $user->email,
                'subject' => 'Verification OTP - Health Monitoring',
                'body' => $htmlBody
            ]);

            // Cek jika Google Script merespons eror
            if ($response->failed()) {
                throw new \Exception('Jembatan Google Script gagal merespons.');
            }

            return response()->json([
                'message' => 'OTP telah dikirim ke email kamu via Google API',
                'email' => $user->email
            ], 200);

        } catch (\Exception $e) {
            // Jika jalur web gagal atau ada kendala, batalkan pembuatan akun di DB
            \Log::error('GOOGLE WEB API EROR: ' . $e->getMessage());

            return response()->json([
                'message' => 'Gagal mengirim kode OTP. Silakan coba beberapa saat lagi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // VERIFY OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if (trim((string)$user->otp) !== trim((string)$request->otp)) {
            return response()->json([
                'message' => 'OTP salah'
            ], 400);
        }

        if (Carbon::now()->greaterThan($user->otp_expired_at)) {
            return response()->json([
                'message' => 'OTP sudah expired'
            ], 400);
        }

        $user->is_verified = true;
        $user->otp = null;
        $user->otp_expired_at = null;
        $user->save();

        return response()->json([
            'message' => 'Akun berhasil diverifikasi'
        ]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'password' => 'required'
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Akun belum diverifikasi OTP'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user
        ]);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}