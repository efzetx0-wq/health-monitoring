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
  FaSignOutAlt
} from "react-icons/fa";

import {
  HeartPulse
} from "lucide-react";

export default function Sidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  // LOGOUT
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
      name: "Health Profile",
      path: "/health-profile",
      icon: <FaHeartbeat />
    },

    {
      name: "Activities",
      path: "/activities",
      icon: <FaRunning />
    },

    {
      name: "Sleep",
      path: "/sleep",
      icon: <FaMoon />
    },

    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartBar />
    },

    {
      name: "Vital Signs",
      path: "/vital-signs",
      icon: <FaNotesMedical />
    },

    {
      name: "Food Diary",
      path: "/food-diary",
      icon: <FaUtensils />
    },

    {
      name: "Daily Targets",
      path: "/daily-targets",
      icon: <FaBullseye />
    },

    {
      name: "Reminders",
      path: "/reminders",
      icon: <FaBell />
    }
  ];

  return (

    <div className="
      w-72
      min-h-screen
      bg-[#0f172a]
      text-white
      shadow-2xl
      p-6
      border-r
      border-gray-800
      flex
      flex-col
      justify-between
    ">

      <div>

        {/* LOGO */}
        <div className="
          flex
          items-center
          gap-4
          mb-12
        ">

          <div className="
            bg-linear-to-br
            from-cyan-400
            to-blue-500
            p-3
            rounded-2xl
            shadow-lg
          ">

            <HeartPulse size={28} />

          </div>

          <div>

            <h1 className="
              text-2xl
              font-extrabold
              tracking-wide
            ">

              Health App

            </h1>

            <p className="
              text-gray-400
              text-sm
            ">

              Monitoring System

            </p>

          </div>

        </div>

        {/* MENU */}
        <nav className="
          flex
          flex-col
          gap-3
        ">

          {menus.map((menu, index) => (

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
                hover:scale-105
                hover:bg-linear-to-br
                hover:from-cyan-500
                hover:to-blue-600
                hover:shadow-xl

                ${
                  location.pathname === menu.path
                    ? "bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg"
                    : "bg-[#111827]"
                }
              `}
            >

              {/* ICON */}
              <div className="
                text-xl
                group-hover:rotate-6
                transition
              ">

                {menu.icon}

              </div>

              {/* TEXT */}
              <span className="
                font-medium
                tracking-wide
              ">

                {menu.name}

              </span>

            </Link>

          ))}

        </nav>

      </div>

      {/* BOTTOM */}
      <div>

        {/* FOOTER */}
        <div className="
          bg-[#111827]
          p-5
          rounded-2xl
          border
          border-gray-800
          mb-5
        ">

          <p className="
            text-sm
            text-gray-400
            mb-2
          ">

            Health Monitoring Platform

          </p>

          <div className="
            w-full
            bg-gray-700
            h-2
            rounded-full
            overflow-hidden
          ">

            <div className="
              h-full
              w-3/4
              bg-linear-to-br
              from-cyan-400
              to-blue-500
              rounded-full
              animate-pulse
            "></div>

          </div>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="
            group
            w-full
            flex
            items-center
            justify-center
            gap-3

            bg-[#111827]

            hover:bg-linear-to-br
            hover:from-cyan-500
            hover:to-blue-600

            p-4
            rounded-2xl

            font-semibold

            transition-all
            duration-300

            hover:scale-105
            hover:shadow-xl
          "
        >

          {/* ICON */}
          <FaSignOutAlt
            className="
              text-lg
              group-hover:rotate-12
              transition
            "
          />

          <span>

            Logout

          </span>

        </button>
      </div>

    </div>
  )
}