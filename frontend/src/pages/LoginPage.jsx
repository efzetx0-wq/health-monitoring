import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeartPulse, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // State untuk fitur mata (lihat/sembunyi password)
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(email, password);
      const user = response.user;

      // ADMIN
      if (user.role === "admin") {
        navigate("/admin-dashboard");
        return;
      }

      // MEDICAL
      if (user.role === "medical") {
        navigate("/medical-dashboard");
        return;
      }

      // USER
      if (user.role === "user") {
        navigate("/dashboard");
        return;
      }

      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEEF] text-black font-sans flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md my-4">
        
        {/* BACK BUTTON - NEO BRUTALISM STYLE */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 border-3 border-black bg-white text-black font-black uppercase text-xs sm:text-sm px-4 py-2 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          ← Back to Home
        </Link>

        {/* CARD CONTAINER - NEO BRUTALISM */}
        <div className="bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 text-white p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <HeartPulse size={36} />
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl font-black text-center tracking-tight uppercase">
            Welcome Back
          </h1>

          {/* BADGE SUBTITLE */}
          <div className="flex justify-center mt-3 mb-8">
            <span className="bg-yellow-300 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🔒 Health Account Authentication
            </span>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-red-200 text-black border-3 border-black p-4 font-bold mb-6 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* EMAIL ROW */}
            <div>
              <label className="text-xs sm:text-sm font-black uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <div className="flex items-center border-3 border-black px-4 py-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-0.5 focus-within:translate-y-0.5 focus-within:shadow-none transition-all">
                <Mail size={20} className="text-black shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full outline-none ml-3 bg-transparent font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD ROW WITH EYE TOGGLE */}
            <div>
              <label className="text-xs sm:text-sm font-black uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="flex items-center border-3 border-black px-4 py-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-0.5 focus-within:translate-y-0.5 focus-within:shadow-none transition-all">
                <LockKeyhole size={20} className="text-black shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full outline-none ml-3 bg-transparent font-bold text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white border-4 border-black py-3.5 font-black text-base sm:text-lg uppercase tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-8"
            >
              Sign In ✦
            </button>

          </form>

          {/* FOOTER */}
          <div className="text-center mt-8 border-t-2 border-black pt-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">
              Health Monitoring System
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}