import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  FaHome,
  FaHeartbeat,
  FaRunning,
  FaMoon,
  FaChartBar,
  FaNotesMedical,
  FaUtensils,
  FaBullseye,
  FaBell,
  FaSignOutAlt,
  FaRobot,
  FaUserMd 
} from "react-icons/fa";

import {
  HeartPulse
} from "lucide-react";

export default function Sidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  const menus = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />
    },

    {
      name: "Profile Kesehatan",
      path: "/health-profile",
      icon: <FaHeartbeat />
    },

    {
      name: "Aktivitas",
      path: "/activities",
      icon: <FaRunning />
    },

    {
      name: "Tidur",
      path: "/sleep",
      icon: <FaMoon />
    },

    {
      name: "Laporan",
      path: "/reports",
      icon: <FaChartBar />
    },

    {
      name: "Tanda-Tanda Vital",
      path: "/vital-signs",
      icon: <FaNotesMedical />
    },

    {
      name: "Makanan",
      path: "/food-diary",
      icon: <FaUtensils />
    },

    {
      name: "Target Harian",
      path: "/daily-targets",
      icon: <FaBullseye />
    },

    {
      name: "Notifikasi",
      path: "/reminders",
      icon: <FaBell />
    },

    {
      name: "Konsultasi",
      path: "/doctors",
      icon: <FaUserMd />
    },

    {
      name: "AI Kesehatan",
      path: "/chat-ai",
      icon: <FaRobot />
    },

    {
      name: "Logout",
      logout: true,
      icon: <FaSignOutAlt />
    }

  ];

  return (

      <div
      className="
        w-full
        md:w-72

        h-screen
        overflow-y-auto

        bg-white

        text-gray-800

        shadow-xl

        p-6

        border-r
        border-gray-200

        flex
        flex-col
      "
    >

      {/* LOGO */}
      <div
        className="
          flex
          items-center
          gap-4
          mb-10
        "
      >

        <div
          className="
            bg-blue-600

            p-3

            rounded-2xl

            shadow-lg
          "
        >

          <HeartPulse
            size={28}
            color="white"
          />

        </div>

        <div>

          <h1
            className="
              text-2xl
              font-extrabold
              tracking-wide
            "
          >

            Health App

          </h1>

          <p
            className="
              text-gray-500
              text-sm
            "
          >

            Monitoring System

          </p>

        </div>

      </div>

      {/* MENU */}
      <nav
        className="
          flex
          flex-col
          gap-3
        "
      >

        {menus.map((menu, index) => (

          menu.logout ? (

            <button
              key={index}
              onClick={handleLogout}
              className="
                group

                flex
                items-center
                gap-4

                p-4

                rounded-2xl

                bg-gray-50

                text-gray-700

                hover:bg-red-500
                hover:text-white

                transition-all
                duration-300

                w-full
              "
            >

              <div
                className="
                  text-xl
                  transition
                "
              >

                {menu.icon}

              </div>

              <span
                className="
                  font-medium
                  tracking-wide
                "
              >

                {menu.name}

              </span>

            </button>

          ) : (

            <Link
              key={index}
              to={menu.path}
              className={`
                group

                flex
                items-center
                gap-4

                p-4

                rounded-2xl

                transition-all
                duration-300

                hover:bg-blue-50
                hover:text-blue-600

                ${
                  location.pathname ===
                  menu.path

                    ? "bg-blue-600 text-white shadow-lg"

                    : "bg-gray-50 text-gray-700"
                }
              `}
            >

              <div
                className="
                  text-xl
                  transition
                "
              >

                {menu.icon}

              </div>

              <span
                className="
                  font-medium
                  tracking-wide
                "
              >

                {menu.name}

              </span>

            </Link>

          )

        ))}

      </nav>

      {/* INFO CARD */}
      <div
        className="
          mt-8

          bg-gray-50

          p-5

          rounded-2xl

          border
          border-gray-200
        "
      >

        <p
          className="
            text-sm
            text-gray-500
            mb-2
          "
        >

          Health Monitoring Platform

        </p>

        <div
          className="
            w-full

            bg-gray-200

            h-2

            rounded-full

            overflow-hidden
          "
        >

          <div
            className="
              h-full
              w-3/4

              bg-blue-500

              rounded-full

              animate-pulse
            "
          ></div>

        </div>

      </div>

    </div>
  );
}