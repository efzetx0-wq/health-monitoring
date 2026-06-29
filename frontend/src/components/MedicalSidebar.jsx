import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileHeart,
  HeartPulse,
  LogOut,
  MessageSquare,
  Menu,
  X
} from "lucide-react";

export default function MedicalSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State untuk mengontrol buka/tutup sidebar di perangkat mobile
  const [isOpen, setIsOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // MENU
  const menuItems = [
    {
      name: "Dashboard",
      path: "/medical-dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      name: "Patients",
      path: "/medical-patients",
      icon: <Users size={20} />
    },
    {
      name: "Consultations",
      path: "/medical-chats",
      icon: <MessageSquare size={20} />
    },
    {
      name: "Health Reports",
      path: "/medical-reports",
      icon: <FileHeart size={20} />
    }
  ];

  return (
    <>
      {/* TOMBOL HAMBURGER (Hanya muncul di Mobile/Tablet < md) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[#020617] text-white border border-gray-800 rounded-2xl shadow-xl hover:text-cyan-400 transition-all cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* BACKDROP/OVERLAY (Latar belakang gelap klik-untuk-tutup di mobile) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300"
        />
      )}

      {/* COMPONENT SIDEBAR */}
      <div className={`
        fixed md:sticky top-0 left-0 z-40
        w-72
        h-screen
        min-h-screen

        bg-[#020617]
        border-r
        border-gray-800

        text-white
        p-6

        shadow-2xl
        
        /* Logika Responsif Transisi Slide-in */
        transition-transform
        duration-300
        ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* LOGO (Diberi padding-left tambahan di mobile agar tidak tertimpa tombol close jika sejajar) */}
        <div className="
          flex
          items-center
          gap-4
          mb-12
          pl-12 md:pl-0
        ">

          <div className="
            bg-linear-to-br
            from-cyan-500
            to-blue-600

            p-3
            rounded-2xl

            shadow-lg
          ">
            <HeartPulse size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold">Medical Panel</h1>
            <p className="text-gray-400 text-sm">Healthcare System</p>
          </div>

        </div>

        {/* MENU */}
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Otomatis tutup sidebar di mobile setelah menu diklik
              className={`
                flex
                items-center
                gap-4

                px-5
                py-4

                rounded-2xl

                transition-all
                duration-300

                ${
                  location.pathname === item.path
                  ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "hover:bg-[#111827] text-gray-300 hover:text-cyan-400 hover:translate-x-1"
                }
              `}
            >
              {item.icon}
              <span className="font-medium text-[15px]">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-4

              px-5
              py-4

              rounded-2xl
              bg-[#111827]
              text-gray-300

              hover:bg-linear-to-br
              hover:from-cyan-500
              hover:to-blue-600
              hover:text-white

              hover:scale-[1.03]
              active:scale-95

              transition-all
              duration-300
              shadow-lg
              cursor-pointer
            "
          >
            <LogOut size={20} />
            <span className="font-medium text-[15px]">Logout</span>
          </button>
        </div>

      </div>
    </>
  );
}