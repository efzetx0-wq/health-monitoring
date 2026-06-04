import { useState } from "react";
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
  FaBars 
} from "react-icons/fa";

import {
  HeartPulse
} from "lucide-react";

export default function Sidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  // State untuk mengontrol buka/tutup menu di HP
  const [isOpen, setIsOpen] = useState(false);

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
    },
    {
      name: "Logout",
      logout: true,
      icon: <FaSignOutAlt />
    }
  ];

  return (
    <>
      {/* TOMBOL BURGER HP: Terpisah di bar atas agar TIDAK MENIMPA FONT */}
      <div className="md:hidden w-full bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl">
            <HeartPulse size={20} color="white" />
          </div>
          <span className="font-bold text-gray-800">Health App</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-700 focus:outline-none"
        >
          <FaBars size={22} />
        </button>
      </div>

      {/* BACKGROUND GELAP (BACKDROP) DI HP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* CONTAINER SIDEBAR UTAMA */}
      <div
        className={`
          w-[60vw]
          min-w-240px
          md:w-280px
          h-screen
          overflow-y-auto
          bg-white
          text-gray-800
          shadow-xl md:shadow-none
          p-6
          border-r
          border-gray-200
          flex
          flex-col
          fixed md:sticky top-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        {/* LOGO & TOMBOL X (Sudah difix bersih tanpa komentar merusak) */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <HeartPulse size={28} color="white" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-wide">
                Health App
              </h1>
              <p className="text-gray-500 text-sm">
                Monitoring System
              </p>
            </div>
          </div>

          {/* Tombol X hitam murni, polos, tanpa warna background, tanpa efek hover */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-900 text-2xl font-light focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-3">
          {menus.map((menu, index) => (
            menu.logout ? (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  bg-gray-50
                  text-gray-700
                  hover:bg-blue-50
                  hover:text-blue-600
                  transition-all
                  duration-300
                  w-full
                "
              >
                <div className="text-xl transition">
                  {menu.icon}
                </div>
                <span className="font-medium tracking-wide">
                  {menu.name}
                </span>
              </button>
            ) : (
              <Link
                key={index}
                to={menu.path}
                onClick={() => setIsOpen(false)}
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
                    location.pathname === menu.path
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-50 text-gray-700"
                  }
                `}
              >
                <div className="text-xl transition">
                  {menu.icon}
                </div>
                <span className="font-medium tracking-wide">
                  {menu.name}
                </span>
              </Link>
            )
          ))}
        </nav>

        {/* INFO CARD */}
        <div className="mt-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Health Monitoring Platform
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

      </div>
    </>
  );
}