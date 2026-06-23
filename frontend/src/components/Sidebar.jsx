import {
  useEffect,
  useState
} from "react";

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
  FaUserMd,
  FaBars,
  FaTimes
} from "react-icons/fa";

import {
  HeartPulse
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk buka/tutup menu di mobile
  const [isOpen, setIsOpen] = useState(false);
  
  // State untuk auto-hide navbar mobile saat scroll
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Efek pendeteksi arah scroll (Hanya bekerja di tampilan mobile)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) { // Khusus mobile
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
          setIsVisible(false); // Scroll ke bawah = Sembunyikan
        } else {
          setIsVisible(true);  // Scroll ke atas = Munculkan
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Tutup menu otomatis setiap kali berpindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Profile Kesehatan", path: "/health-profile", icon: <FaHeartbeat /> },
    { name: "Aktivitas", path: "/activities", icon: <FaRunning /> },
    { name: "Tidur", path: "/sleep", icon: <FaMoon /> },
    { name: "Laporan", path: "/reports", icon: <FaChartBar /> },
    { name: "Tanda-Tanda Vital", path: "/vital-signs", icon: <FaNotesMedical /> },
    { name: "Makanan", path: "/food-diary", icon: <FaUtensils /> },
    { name: "Target Harian", path: "/daily-targets", icon: <FaBullseye /> },
    { name: "Notifikasi", path: "/reminders", icon: <FaBell /> },
    { name: "Konsultasi", path: "/doctors", icon: <FaUserMd /> },
    { name: "AI Kesehatan", path: "/chat-ai", icon: <FaRobot /> },
    { name: "Logout", logout: true, icon: <FaSignOutAlt /> }
  ];

  return (
    <>
      {/* HEADER MOBILE (Otomatis Hilang/Muncul saat Scroll) */}
      <div
        className={`
          fixed
          top-0
          left-0
          right-0
          h-16
          bg-white
          border-b
          border-gray-200
          flex
          items-center
          justify-between
          px-6
          z-50
          md:hidden
          transition-transform
          duration-300
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="flex items-center gap-2">
          <HeartPulse size={24} className="text-blue-600" />
          <span className="font-extrabold text-lg tracking-wide">Health App</span>
        </div>

        {/* TOMBOL GARIS TIGA (Transparan, Tanpa Warna Latar Belakang) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            text-gray-700
            hover:text-blue-600
            text-2xl
            p-2
            focus:outline-none
            transition-colors
          "
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* CONTAINER SIDEBAR (Desktop: Menetap, Mobile: Slide-in Drawer) */}
      <div
        className={`
          fixed
          md:sticky
          top-0
          left-0
          z-40

          w-72
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

          transition-transform
          duration-300
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${window.innerWidth < 768 ? "pt-20" : "pt-6"}
        `}
      >
        {/* LOGO DESKTOP */}
        <div className="hidden md:flex items-center gap-4 mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
            <HeartPulse size={28} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">Health App</h1>
            <p className="text-gray-500 text-sm">Monitoring System</p>
          </div>
        </div>

        {/* MENU NAVIGASI */}
        <nav className="flex flex-col gap-3">
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
                <div className="text-xl transition">{menu.icon}</div>
                <span className="font-medium tracking-wide">{menu.name}</span>
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
                    location.pathname === menu.path
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-50 text-gray-700"
                  }
                `}
              >
                <div className="text-xl transition">{menu.icon}</div>
                <span className="font-medium tracking-wide">{menu.name}</span>
              </Link>
            )
          ))}
        </nav>

        {/* INFO CARD */}
        <div className="mt-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Health Monitoring Platform</p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* OVERLAY BACKGROUND (Untuk menutup menu jika area luar diklik di HP) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        />
      )}
    </>
  );
}