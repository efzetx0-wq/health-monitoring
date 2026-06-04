import { useState } from "react";
import {
  Link
} from "react-router-dom";

import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Moon,
  ChartColumn,
  Bell,
  Menu,
  X
} from "lucide-react";

export default function GuestPage() {
  // State untuk membuka/tutup menu navigasi di mobile tanpa mengubah menu desktop
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (

    <div className="
      min-h-screen
      bg-linear-to-br
      from-blue-50
      via-white
      to-blue-100
    ">

      {/* NAVBAR */}
      <nav className="
        fixed
        top-0
        left-0
        right-0
        z-50
        bg-white/80
        backdrop-blur-md
        shadow-sm
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-4
          flex
          items-center
          justify-between
        ">

          {/* LOGO */}
          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              bg-blue-600
              text-white
              p-2
              rounded-xl
            ">

              <HeartPulse size={24} />

            </div>

            <h1 className="
              text-xl
              sm:text-2xl
              font-bold
              text-gray-800
            ">

              Health Monitoring

            </h1>

          </div>

          {/* MENU DESKTOP */}
          <div className="
            hidden
            lg:flex
            items-center
            gap-8
            text-gray-600
            font-medium
          ">

            <a
              href="#home"
              className="hover:text-blue-600 transition"
            >

              Home

            </a>

            <a
              href="#features"
              className="hover:text-blue-600 transition"
            >

              Features

            </a>

            <a
              href="#statistics"
              className="hover:text-blue-600 transition"
            >

              Statistics

            </a>

            <a
              href="#footer"
              className="hover:text-blue-600 transition"
            >

              Contact

            </a>

          </div>

          {/* AUTH BUTTON DESKTOP */}
          <div className="
            hidden
            sm:flex
            items-center
            gap-4
          ">

            <Link
              to="/login"
              className="
                border
                border-blue-600
                text-blue-600
                hover:bg-blue-50
                px-4
                lg:px-6
                py-2.5
                lg:py-3
                rounded-xl
                transition
                font-medium
              "
            >

              Login

            </Link>

            <Link
              to="/register"
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-4
                lg:px-6
                py-2.5
                lg:py-3
                rounded-xl
                transition
                shadow-lg
                font-medium
              "
            >

              Sign Up

            </Link>

          </div>

          {/* TOMBOL MENU KHUSUS MOBILE (MUNCUL DI LAYAR KECIL) */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMenuTerbuka(!menuTerbuka)}
              className="text-gray-600 focus:outline-none p-1"
            >
              {menuTerbuka ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>

        {/* DRAWER MENU MOBILE (MUNCUL SAAT TOMBOL MENU DI-KLIK PADA HP) */}
        {menuTerbuka && (
          <div className="sm:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-4 shadow-xl">
            <div className="flex flex-col gap-4 text-gray-600 font-medium">
              <a href="#home" onClick={() => setMenuTerbuka(false)} className="hover:text-blue-600 transition">Home</a>
              <a href="#features" onClick={() => setMenuTerbuka(false)} className="hover:text-blue-600 transition">Features</a>
              <a href="#statistics" onClick={() => setMenuTerbuka(false)} className="hover:text-blue-600 transition">Statistics</a>
              <a href="#footer" onClick={() => setMenuTerbuka(false)} className="hover:text-blue-600 transition">Contact</a>
            </div>
            <hr className="border-gray-100my-2" />
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setMenuTerbuka(false)} className="border border-blue-600 text-blue-600 text-center py-2.5 rounded-xl font-medium">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuTerbuka(false)} className="bg-blue-600 text-white text-center py-2.5 rounded-xl font-medium shadow-lg">
                Sign Up
              </Link>
            </div>
          </div>
        )}

      </nav>

      {/* HERO */}
      <section
        id="home"
        className="
          pt-32
          md:pt-40
          pb-16
          md:pb-28
          px-4
          md:px-6
        "
      >

        <div className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-12
          items-center
        ">

          {/* LEFT */}
          <div>

            <div className="
              inline-block
              bg-blue-100
              text-blue-700
              px-4
              py-2
              rounded-full
              font-medium
              mb-6
              text-sm
              md:text-base
            ">

              Smart Healthcare Platform

            </div>

            <h1 className="
              text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
              font-extrabold
              text-gray-800
              leading-tight
            ">

              Monitor Your Health

              <span className="text-blue-600">

                {" "}Anywhere{" "}

              </span>

              Anytime

            </h1>

            <p className="
              mt-4
              md:mt-8
              text-base
              md:text-lg
              text-gray-600
              leading-relaxed
              max-w-2xl
            ">

              Track your activities,
              monitor sleep,
              manage health reports,
              and connect with medical staff
              using one integrated healthcare system.

            </p>

            <div className="
              flex
              flex-wrap
              gap-4
              mt-6
              md:mt-10
            ">

              <Link
                to="/register"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-6
                  md:px-8
                  py-3
                  md:py-4
                  rounded-2xl
                  text-base
                  md:text-lg
                  font-semibold
                  transition
                  shadow-xl
                "
              >

                Get Started

              </Link>

              <a
                href="#features"
                className="
                  bg-white
                  border
                  border-gray-300
                  hover:border-blue-500
                  px-6
                  md:px-8
                  py-3
                  md:py-4
                  rounded-2xl
                  text-base
                  md:text-lg
                  font-semibold
                  transition
                "
              >

                Learn More

              </a>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative w-full max-w-md mx-auto lg:max-w-none">

            <div className="
              bg-white
              rounded-3xl
              shadow-2xl
              p-5
              md:p-8
              border
            ">

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
                md:gap-6
              ">

                <div className="
                  bg-blue-50
                  p-5
                  md:p-6
                  rounded-2xl
                ">

                  <Activity
                    className="
                      text-blue-600
                      mb-3
                      md:mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-base
                    md:text-lg
                  ">

                    Activity

                  </h3>

                  <p className="
                    text-gray-600
                    text-sm
                    md:text-base
                    mt-1
                    md:mt-2
                  ">

                    Daily health tracking

                  </p>

                </div>

                <div className="
                  bg-green-50
                  p-5
                  md:p-6
                  rounded-2xl
                ">

                  <Moon
                    className="
                      text-green-600
                      mb-3
                      md:mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-base
                    md:text-lg
                  ">

                    Sleep

                  </h3>

                  <p className="
                    text-gray-600
                    text-sm
                    md:text-base
                    mt-1
                    md:mt-2
                  ">

                    Monitor sleep quality

                  </p>

                </div>

                <div className="
                  bg-purple-50
                  p-5
                  md:p-6
                  rounded-2xl
                ">

                  <ChartColumn
                    className="
                      text-purple-600
                      mb-3
                      md:mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-base
                    md:text-lg
                  ">

                    Reports

                  </h3>

                  <p className="
                    text-gray-600
                    text-sm
                    md:text-base
                    mt-1
                    md:mt-2
                  ">

                    Smart health analytics

                  </p>

                </div>

                <div className="
                  bg-red-50
                  p-5
                  md:p-6
                  rounded-2xl
                ">

                  <Bell
                    className="
                      text-red-600
                      mb-3
                      md:mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-base
                    md:text-lg
                  ">

                    Reminder

                  </h3>

                  <p className="
                    text-gray-600
                    text-sm
                    md:text-base
                    mt-1
                    md:mt-2
                  ">

                    Health notifications

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="
          py-16
          md:py-24
          px-4
          md:px-6
        "
      >

        <div className="
          max-w-7xl
          mx-auto
        ">

          <div className="
            text-center
            mb-12
            md:mb-16
          ">

            <h2 className="
              text-3xl
              md:text-4xl
              font-bold
              text-gray-800
            ">

              Powerful Features

            </h2>

            <p className="
              text-gray-600
              mt-3
              md:mt-4
              text-base
              md:text-lg
            ">

              Everything you need
              for better healthcare monitoring

            </p>

          </div>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
            md:gap-8
          ">

            {[
              {
                icon: <Activity size={40} />,
                title: "Activity Monitoring",
                desc: "Track steps, calories, and workouts."
              },
              {
                icon: <Moon size={40} />,
                title: "Sleep Tracking",
                desc: "Monitor sleep duration and quality."
              },
              {
                icon: <ShieldCheck size={40} />,
                title: "Medical Monitoring",
                desc: "Medical staff can monitor patients."
              }
            ].map((item, index) => (

              <div
                key={index}
                className="
                  bg-white
                  rounded-3xl
                  p-6
                  md:p-8
                  shadow-lg
                  hover:-translate-y-2
                  transition
                "
              >

                <div className="
                  text-blue-600
                  mb-4
                  md:mb-6
                ">

                  {item.icon}

                </div>

                <h3 className="
                  text-xl
                  md:text-2xl
                  font-bold
                  mb-3
                  md:mb-4
                ">

                  {item.title}

                </h3>

                <p className="
                  text-gray-600
                  text-sm
                  md:text-base
                  leading-relaxed
                ">

                  {item.desc}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* STATISTICS */}
      <section
        id="statistics"
        className="
          py-16
          md:py-24
          bg-blue-600
          text-white
        "
      >

        <div className="
          max-w-6xl
          mx-auto
          px-4
          md:px-6
          grid
          grid-cols-1
          md:grid-cols-3
          gap-10
          md:gap-12
          text-center
        ">

          <div>

            <h2 className="
              text-4xl
              md:text-5xl
              font-extrabold
            ">

              10K+

            </h2>

            <p className="
              mt-2
              md:mt-4
              text-lg
              md:text-xl
            ">

              Active Users

            </p>

          </div>

          <div>

            <h2 className="
              text-4xl
              md:text-5xl
              font-extrabold
            ">

              500+

            </h2>

            <p className="
              mt-2
              md:mt-4
              text-lg
              md:text-xl
            ">

              Health Reports

            </p>

          </div>

          <div>

            <h2 className="
              text-4xl
              md:text-5xl
              font-extrabold
            ">

              24/7

            </h2>

            <p className="
              mt-2
              md:mt-4
              text-lg
              md:text-xl
            ">

              Monitoring Support

            </p>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="
        py-16
        md:py-24
        px-4
        md:px-6
      ">

        <div className="
          max-w-5xl
          mx-auto
          bg-white
          rounded-3xl
          shadow-2xl
          p-6
          md:p-12
          text-center
          border
        ">

          <h2 className="
            text-2xl
            md:text-4xl
            font-bold
            text-gray-800
          ">

            Start Monitoring Your Health Today

          </h2>

          <p className="
            mt-4
            md:mt-6
            text-base
            md:text-lg
            text-gray-600
          ">

            Join the modern healthcare platform
            and improve your health lifestyle.

          </p>

          <Link
            to="/register"
            className="
              inline-block
              mt-8
              md:mt-10
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-8
              md:px-10
              py-3
              md:py-4
              rounded-2xl
              text-base
              md:text-lg
              font-semibold
              transition
              shadow-xl
            "
          >

            Get Started

          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer
        id="footer"
        className="
          bg-gray-900
          text-white
          py-10
          px-4
          md:px-6
        "
      >

        <div className="
          max-w-7xl
          mx-auto
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-6
          text-center
          md:text-left
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
            ">

              Health Monitoring

            </h2>

            <p className="
              text-gray-400
              text-sm
              mt-2
            ">

              Smart Healthcare Monitoring System

            </p>

          </div>

          <p className="
            text-gray-400
            text-sm
          ">

            © 2026 Health Monitoring.
            All rights reserved.

          </p>

        </div>

      </footer>

    </div>
  );
}