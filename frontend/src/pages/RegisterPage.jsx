import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function RegisterPage() {

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      toast.success("OTP terkirim ke email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Register gagal");
    }
  };

  const verifyOtp = async () => {
    try {
      await api.post("/verify-otp", {
        email,
        otp: otp.join(""),
      });

      toast.success("Verifikasi berhasil");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-6 sm:p-8">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Join Health Monitoring System
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={register} className="space-y-4">

            {/* NAME */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Register
            </button>

          </form>
        )}

        {/* STEP 2 OTP */}
        {step === 2 && (
          <div className="text-center">

            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Verify OTP
            </h2>

            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Enter OTP sent to your email
            </p>

            {/* PERUBAHAN UTAMA: 
                Menggunakan `grid grid-cols-6` dan `w-full` agar kotak OTP otomatis 
                menyusut dengan pas mengikuti lebar HP sekecil apa pun.
            */}
            <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto mb-6">
              {otp.map((v, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={v}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-full aspect-square text-center border rounded-xl text-lg sm:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 p-0"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Verify OTP
            </button>

          </div>
        )}

      </div>
    </div>
  );
}