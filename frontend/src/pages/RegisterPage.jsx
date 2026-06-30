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
    <div className="min-h-screen flex items-center justify-center bg-[#FFFEEF] text-black font-sans p-4 sm:p-6">
      <div className="w-full max-w-md my-4">
        
        {/* CARD CONTAINER - NEO BRUTALISM */}
        <div className="bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          
          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl font-black text-center tracking-tight uppercase mb-2">
            Create Account
          </h1>

          {/* BADGE SUBTITLE */}
          <div className="flex justify-center mt-3 mb-8">
            <span className="bg-yellow-300 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
               Join Health Monitoring System 
            </span>
          </div>

          {/* STEP 1: REGISTRATION FORM */}
          {step === 1 && (
            <form onSubmit={register} className="space-y-6">
              
              {/* NAME */}
              <div>
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider block mb-2">
                  Full Name
                </label>
                <div className="flex items-center border-3 border-black px-4 py-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-0.5 focus-within:translate-y-0.5 focus-within:shadow-none transition-all">
                  <User className="text-black shrink-0" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full outline-none ml-3 bg-transparent font-bold text-sm"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <div className="flex items-center border-3 border-black px-4 py-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-0.5 focus-within:translate-y-0.5 focus-within:shadow-none transition-all">
                  <Mail className="text-black shrink-0" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full outline-none ml-3 bg-transparent font-bold text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-xs sm:text-sm font-black uppercase tracking-wider block mb-2">
                  Password
                </label>
                <div className="flex items-center border-3 border-black px-4 py-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-0.5 focus-within:translate-y-0.5 focus-within:shadow-none transition-all">
                  <Lock className="text-black shrink-0" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="w-full outline-none ml-3 bg-transparent font-bold text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  {/* BUTTON MATA */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-black hover:text-blue-600 focus:outline-none ml-2 shrink-0 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white border-4 border-black py-3.5 font-black text-base sm:text-lg uppercase tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-8"
              >
                Register Now
              </button>

            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <div className="text-center">
              
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                Verify OTP
              </h2>
              
              <p className="font-bold text-gray-600 mb-8 text-sm sm:text-base">
                Enter the 6-digit code sent to your email
              </p>

              {/* OTP GRID CONTAINER - NEO BRUTALISM CODES */}
              <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto mb-8">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength="1"
                    value={v}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    className="w-full aspect-square text-center border-3 border-black text-xl sm:text-2xl font-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:bg-yellow-100 focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none outline-none p-0"
                  />
                ))}
              </div>

              {/* VERIFY BUTTON */}
              <button
                onClick={verifyOtp}
                className="w-full bg-green-400 hover:bg-green-500 text-black border-4 border-black py-3.5 font-black text-base sm:text-lg uppercase tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                Verify OTP
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}