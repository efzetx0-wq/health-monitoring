import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  HeartPulse, 
  Search, 
  UserRound, 
  ArrowRight, 
  LayoutDashboard, 
  FileHeart, 
  LogOut,
  Menu,
  X
} from "lucide-react";

// =========================================================================
// MOCKUP LAYOUT UTAMA (Dibuat inline agar 100% Lolos Kompilasi)
// =========================================================================
function MockMainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Consultation", icon: <HeartPulse size={20} />, path: "/doctors" },
    { name: "Health Reports", icon: <FileHeart size={20} />, path: "/reports" },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#020617] border-r border-gray-800 p-5 shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#06b6d4] p-2.5 rounded-xl shadow-md">
            <HeartPulse size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg">Health App</h1>
            <p className="text-xs text-gray-400">User Panel</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-left cursor-pointer ${
                item.path === "/doctors" 
                  ? "bg-[#06b6d4] text-white shadow-lg" 
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-cyan-400"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-900/50 hover:bg-red-950/30 hover:text-red-400 text-gray-400 transition-all duration-200 text-sm font-medium mt-auto cursor-pointer border border-gray-800/50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <aside className="w-64 h-full bg-[#020617] p-5 flex flex-col border-r border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#06b6d4] p-2 rounded-xl">
                  <HeartPulse size={20} />
                </div>
                <span className="font-bold text-base">Health App</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-800 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-left ${
                    item.path === "/doctors" ? "bg-[#06b6d4] text-white" : "text-gray-300"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </nav>

            <button onClick={() => navigate("/login")} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-900 text-gray-400 text-sm font-medium">
              <LogOut size={18} />
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-[#020617] border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-300">
            <Menu size={20} />
          </button>
          <span className="font-bold text-sm text-cyan-400">Health Portal</span>
          <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400 text-xs font-bold">U</div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0b0f19]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const doctorsData = [
    { id: 1, name: "dr. Andi Suhendra Sp.PD", specialty: "Spesialis Penyakit Dalam", email: "dr.andi@healthapp.com", status: "Online" },
    { id: 2, name: "dr. Riska Amelia Sp.A", specialty: "Spesialis Anak", email: "dr.riska@healthapp.com", status: "Online" },
    { id: 3, name: "dr. Budi Santoso Sp.JP", specialty: "Spesialis Jantung", email: "dr.budi@healthapp.com", status: "Offline" }
  ];

  const filteredDoctors = doctorsData.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MockMainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Konsultasi Medis</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Pilih tenaga medis profesional yang siap melayani keluhan kesehatan Anda.</p>
        </div>

        {/* Kolom Pencarian */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cari nama dokter atau spesialisasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-gray-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
          />
        </div>

        {/* Grid List Dokter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-[#111827] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition-all duration-300 group shadow-md"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-900 rounded-xl text-cyan-400 border border-gray-800">
                    <UserRound size={24} />
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                    doc.status === "Online" 
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" 
                      : "bg-gray-900 border-gray-800 text-gray-500"
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors text-base line-clamp-1">{doc.name}</h3>
                <p className="text-xs text-cyan-400 font-medium mt-0.5">{doc.specialty}</p>
                <p className="text-xs text-gray-500 mt-2 truncate">{doc.email}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800/60">
                <Link
                  to={`/doctor-chat/${doc.id}`}
                  className="w-full bg-gray-900 hover:bg-[#06b6d4] text-gray-300 hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  Mulai Konsultasi
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-[#111827] rounded-2xl border border-gray-800">
            <p className="text-sm text-gray-500">Dokter atau spesialisasi yang Anda cari tidak ditemukan.</p>
          </div>
        )}
      </div>
    </MockMainLayout>
  );
}