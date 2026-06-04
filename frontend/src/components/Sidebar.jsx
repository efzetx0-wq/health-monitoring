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
      name: "Profile",
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
      name: "Vitals",
      path: "/vital-signs",
      icon: <FaNotesMedical />
    },
    {
      name: "Food",
      path: "/food-diary",
      icon: <FaUtensils />
    },
    {
      name: "Targets",
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
    <>
      {/* ========================================================= */}
      {/* 1. TAMPILAN LAPTOP / DESKTOP (AKAN HIDDEN OTOMATIS DI HP) */}
      {/* ========================================================= */}
      <div className="
        hidden
        md:flex
        w-72
        min-h-screen
        bg-white
        text-gray-800
        shadow-2xl
        p-6
        border-r
        border-gray-100
        flex-col
        justify-between
        fixed
        left-0
        top-0
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
              from-sky-400
              to-blue-500
              text-white
              p-3
              rounded-2xl
              shadow-md
            ">

              <HeartPulse size={28} />

            </div>

            <div>

              <h1 className="
                text-2xl
                font-extrabold
                tracking-wide
                text-gray-900
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

          {/* MENU DESKTOP */}
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
                  hover:from-sky-400
                  hover:to-blue-500
                  hover:text-white
                  hover:shadow-lg
                  hover:shadow-blue-100

                  ${
                    location.pathname === menu.path
                      ? "bg-linear-to-br from-sky-400 to-blue-500 text-white shadow-md shadow-blue-100"
                      : "bg-gray-50 text-gray-600"
                  }
                `}
              >

                <div className={`
                  text-xl
                  group-hover:rotate-6
                  transition
                  ${
                    location.pathname === menu.path
                      ? "text-white"
                      : "text-blue-500 group-hover:text-white"
                  }
                `}>

                  {menu.icon}

                </div>

                <span className="font-medium tracking-wide">
                  {menu.name}
                </span>

              </Link>

            ))}

          </nav>

        </div>

        {/* BOTTOM DESKTOP */}
        <div>

          <div className="
            bg-gray-50
            p-5
            rounded-2xl
            border
            border-gray-100
            mb-5
          ">

            <p className="
              text-sm
              text-gray-500
              mb-2
            ">
              Health Monitoring Platform
            </p>

            <div className="
              w-full
              bg-gray-200
              h-2
              rounded-full
              overflow-hidden
            ">

              <div className="
                h-full
                w-3/4
                bg-linear-to-br
                from-sky-400
                to-blue-500
                rounded-full
                animate-pulse
              "></div>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="
              group
              w-full
              flex
              items-center
              justify-center
              gap-3
              bg-gray-50
              text-red-500
              hover:bg-linear-to-br
              hover:from-red-500
              hover:to-red-600
              hover:text-white
              p-4
              rounded-2xl
              font-semibold
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-lg
              hover:shadow-red-100
            "
          >

            <FaSignOutAlt className="text-lg group-hover:rotate-12 transition" />

            <span>Logout</span>

          </button>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. TAMPILAN MOBILE BOTTOM NAV (AKAN HIDDEN DI LAPTOP)       */}
      {/* ========================================================= */}
      <div className="
        block
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-white
        border-t
        border-gray-100
        shadow-[0_-4px_20px_rgba(0,0,0,0.05)]
        px-2
        py-2
      ">

        {/* MENU HORIZONTAL YANG BISA DI-SCROLL MENYAMPING */}
        <nav className="
          flex
          items-center
          gap-1
          overflow-x-auto
          scrollbar-none
          w-full
          justify-between
        ">

          {menus.map((menu, index) => (

            <Link
              key={index}
              to={menu.path}
              className={`
                flex
                flex-col
                items-center
                justify-center
                gap-1
                py-2
                px-3
                rounded-xl
                min-w-72px
                flex-shrink-
                transition-all
                duration-200

                ${
                  location.pathname === menu.path
                    ? "bg-blue-50 text-blue-600 font-semibold scale-105"
                    : "text-gray-500 text-xs"
                }
              `}
            >

              {/* ICON MOBILE */}
              <div className={`
                text-lg
                ${location.pathname === menu.path ? "text-blue-600" : "text-gray-400"}
              `}>
                {menu.icon}
              </div>

              {/* TEXT MOBILE */}
              <span className="text-[10px] tracking-tight">
                {menu.name}
              </span>

            </Link>

          ))}

          {/* TOMBOL LOGOUT KHUSUS DI MOBILE BAR */}
          <button
            onClick={handleLogout}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              py-2
              px-3
              rounded-xl
              min-w-72px
              flex-shrink-
              text-red-400
            "
          >

            <FaSignOutAlt className="text-lg" />

            <span className="text-[10px] tracking-tight">Logout</span>

          </button>

        </nav>

      </div>
    </>
  );
}