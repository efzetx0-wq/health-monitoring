<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Models\User;

use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Mail;

use App\Mail\SendOtpMail;

use Carbon\Carbon;

class AuthController extends Controller
{
    // REGISTER (WITH OTP)
    // REGISTER (WITH OTP) - SUDAH DIPERBAIKI DENGAN TRANSAKSI & LOG
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
            // Bungkus proses penyimpanan agar bisa dibatalkan jika email diblokir server
            $user = \Illuminate\Support\Facades\DB::transaction(function () use ($request, $otp) {
                return User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),

                    // IMPORTANT DEFAULT ROLE
                    'role' => 'user',

                    // OTP FIELDS
                    'otp' => $otp,
                    'otp_expired_at' => Carbon::now()->addMinutes(5),
                    'is_verified' => false
                ]);
            });

            // SEND EMAIL OTP
            Mail::to($user->email)->send(
                new SendOtpMail($otp)
            );

            return response()->json([
                'message' => 'OTP telah dikirim ke email kamu',
                'email' => $user->email
            ], 200);

        } catch (\Exception $e) {
            // JIKA EMAIL TIMEOUT/GAGAL, DATA USER DI DATABASE OTOMATIS DIHAPUS KEMBALI
            
            // Tulis alasan eror aslinya ke dalam Deploy Logs Railway
            \Log::error('SMTP GOOGLE MENGALAMI EROR KARENA: ' . $e->getMessage());

            return response()->json([
                'message' => 'Gagal mengirim kode OTP karena masalah jaringan server. Akun batal dibuat.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // VERIFY OTP (NEW)
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

        // CHECK VERIFICATION
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