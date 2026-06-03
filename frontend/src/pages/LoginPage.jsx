import {
  useState
} from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import {
  HeartPulse,
  Mail,
  LockKeyhole
} from "lucide-react";

export default function LoginPage() {

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin =
    async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response =
        await login(
          email,
          password
        );

      const user =
        response.user;

      // ADMIN
      if (
        user.role === "admin"
      ) {

        navigate(
          "/admin-dashboard"
        );

        return;
      }

      // MEDICAL
      if (
        user.role === "medical"
      ) {

        navigate(
          "/medical-dashboard"
        );

        return;
      }

      // USER
      if (
        user.role === "user"
      ) {

        navigate(
          "/dashboard"
        );

        return;
      }

      navigate("/");

    } catch (err) {

      setError(
        "Email atau password salah"
      );
    }
  };

  return (

    <div className="
      min-h-screen
      bg-linear-to-br
      from-blue-50
      via-white
      to-blue-100
      flex
      items-center
      justify-center
      p-6
    ">

      <div className="
        w-full
        max-w-md
      ">

        {/* BACK BUTTON */}
        <Link
          to="/"
          className="
            inline-flex
            items-center
            text-blue-600
            font-medium
            mb-6
            hover:underline
          "
        >

          ← Back to Home

        </Link>

        {/* CARD */}
        <div className="
          bg-white/80
          backdrop-blur-md
          border
          border-white/20
          shadow-2xl
          rounded-3xl
          p-10
        ">

          {/* LOGO */}
          <div className="
            flex
            justify-center
            mb-6
          ">

            <div className="
              bg-blue-600
              p-4
              rounded-2xl
              text-white
              shadow-lg
            ">

              <HeartPulse size={40} />

            </div>

          </div>

          {/* TITLE */}
          <h1 className="
            text-4xl
            font-extrabold
            text-center
            text-gray-800
          ">

            Welcome Back

          </h1>

          <p className="
            text-center
            text-gray-500
            mt-3
            mb-8
          ">

            Login to your health account

          </p>

          {/* ERROR */}
          {error && (

            <div className="
              bg-red-100
              text-red-600
              p-4
              rounded-xl
              mb-6
              text-sm
            ">

              {error}

            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="
              space-y-6
            "
          >

            {/* EMAIL */}
            <div>

              <label className="
                text-sm
                font-medium
                text-gray-700
              ">

                Email Address

              </label>

              <div className="
                mt-2
                flex
                items-center
                border
                rounded-2xl
                px-4
                py-3
                bg-white
              ">

                <Mail
                  size={20}
                  className="
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    w-full
                    outline-none
                    ml-3
                    bg-transparent
                  "
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <label className="
                text-sm
                font-medium
                text-gray-700
              ">

                Password

              </label>

              <div className="
                mt-2
                flex
                items-center
                border
                rounded-2xl
                px-4
                py-3
                bg-white
              ">

                <LockKeyhole
                  size={20}
                  className="
                    text-gray-400
                  "
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="
                    w-full
                    outline-none
                    ml-3
                    bg-transparent
                  "
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-4
                rounded-2xl
                font-semibold
                text-lg
                transition
                shadow-lg
              "
            >

              Login

            </button>

          </form>

          {/* FOOTER */}
          <p className="
            text-center
            text-gray-500
            mt-8
          ">

            Health Monitoring System

          </p>

        </div>

      </div>

    </div>
  );
}