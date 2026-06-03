import {
  Link
} from "react-router-dom";

import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Moon,
  ChartColumn,
  Bell
} from "lucide-react";

export default function GuestPage() {

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
          px-6
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
              text-2xl
              font-bold
              text-gray-800
            ">

              Health Monitoring

            </h1>

          </div>

          {/* MENU */}
          <div className="
            hidden
            md:flex
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

          {/* AUTH BUTTON */}
          <div className="
            flex
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
                px-6
                py-3
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
                px-6
                py-3
                rounded-xl
                transition
                shadow-lg
                font-medium
              "
            >

              Sign Up

            </Link>

          </div>

        </div>

      </nav>

      {/* HERO */}
      <section
        id="home"
        className="
          pt-40
          pb-28
          px-6
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
            ">

              Smart Healthcare Platform

            </div>

            <h1 className="
              text-5xl
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
              mt-8
              text-lg
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
              mt-10
            ">

              <Link
                to="/register"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-8
                  py-4
                  rounded-2xl
                  text-lg
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
                  px-8
                  py-4
                  rounded-2xl
                  text-lg
                  font-semibold
                  transition
                "
              >

                Learn More

              </a>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative">

            <div className="
              bg-white
              rounded-3xl
              shadow-2xl
              p-8
              border
            ">

              <div className="
                grid
                grid-cols-2
                gap-6
              ">

                <div className="
                  bg-blue-50
                  p-6
                  rounded-2xl
                ">

                  <Activity
                    className="
                      text-blue-600
                      mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-lg
                  ">

                    Activity

                  </h3>

                  <p className="
                    text-gray-600
                    mt-2
                  ">

                    Daily health tracking

                  </p>

                </div>

                <div className="
                  bg-green-50
                  p-6
                  rounded-2xl
                ">

                  <Moon
                    className="
                      text-green-600
                      mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-lg
                  ">

                    Sleep

                  </h3>

                  <p className="
                    text-gray-600
                    mt-2
                  ">

                    Monitor sleep quality

                  </p>

                </div>

                <div className="
                  bg-purple-50
                  p-6
                  rounded-2xl
                ">

                  <ChartColumn
                    className="
                      text-purple-600
                      mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-lg
                  ">

                    Reports

                  </h3>

                  <p className="
                    text-gray-600
                    mt-2
                  ">

                    Smart health analytics

                  </p>

                </div>

                <div className="
                  bg-red-50
                  p-6
                  rounded-2xl
                ">

                  <Bell
                    className="
                      text-red-600
                      mb-4
                    "
                    size={40}
                  />

                  <h3 className="
                    font-bold
                    text-lg
                  ">

                    Reminder

                  </h3>

                  <p className="
                    text-gray-600
                    mt-2
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
          py-24
          px-6
        "
      >

        <div className="
          max-w-7xl
          mx-auto
        ">

          <div className="
            text-center
            mb-16
          ">

            <h2 className="
              text-4xl
              font-bold
              text-gray-800
            ">

              Powerful Features

            </h2>

            <p className="
              text-gray-600
              mt-4
              text-lg
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
            gap-8
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
                  p-8
                  shadow-lg
                  hover:-translate-y-2
                  transition
                "
              >

                <div className="
                  text-blue-600
                  mb-6
                ">

                  {item.icon}

                </div>

                <h3 className="
                  text-2xl
                  font-bold
                  mb-4
                ">

                  {item.title}

                </h3>

                <p className="
                  text-gray-600
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
          py-24
          bg-blue-600
          text-white
        "
      >

        <div className="
          max-w-6xl
          mx-auto
          px-6
          grid
          grid-cols-1
          md:grid-cols-3
          gap-12
          text-center
        ">

          <div>

            <h2 className="
              text-5xl
              font-extrabold
            ">

              10K+

            </h2>

            <p className="
              mt-4
              text-xl
            ">

              Active Users

            </p>

          </div>

          <div>

            <h2 className="
              text-5xl
              font-extrabold
            ">

              500+

            </h2>

            <p className="
              mt-4
              text-xl
            ">

              Health Reports

            </p>

          </div>

          <div>

            <h2 className="
              text-5xl
              font-extrabold
            ">

              24/7

            </h2>

            <p className="
              mt-4
              text-xl
            ">

              Monitoring Support

            </p>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="
        py-24
        px-6
      ">

        <div className="
          max-w-5xl
          mx-auto
          bg-white
          rounded-3xl
          shadow-2xl
          p-12
          text-center
        ">

          <h2 className="
            text-4xl
            font-bold
            text-gray-800
          ">

            Start Monitoring Your Health Today

          </h2>

          <p className="
            mt-6
            text-lg
            text-gray-600
          ">

            Join the modern healthcare platform
            and improve your health lifestyle.

          </p>

          <Link
            to="/register"
            className="
              inline-block
              mt-10
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-10
              py-4
              rounded-2xl
              text-lg
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
          px-6
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
              mt-2
            ">

              Smart Healthcare Monitoring System

            </p>

          </div>

          <p className="
            text-gray-400
          ">

            © 2026 Health Monitoring.
            All rights reserved.

          </p>

        </div>

      </footer>

    </div>
  );
}