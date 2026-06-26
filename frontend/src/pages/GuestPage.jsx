import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Moon,
  ChartColumn,
  Bell,
  FaFacebook,
  FaInstagram,
  FaEnvelope
} from "lucide-react"; // Pastikan lucide-react Anda mendukung icon medsos ini atau gunakan komponen SVG bawaan di bawah

export default function GuestPage() {
  // 1. STATE UNTUK AUTO-HIDE NAVBAR
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 2. STATE UNTUK CAROUSEL OTOMATIS (5 FOTO PROMOSI)
  const [currentSlide, setCurrentSlide] = useState(0);
  const promoImages = [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80", // Yoga/Meditation
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", // Fitness/Gym
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80", // Healthy Food
    "https://images.unsplash.com/photo-1511688868355-7216ee869d42?auto=format&fit=crop&w=800&q=80", // Health Checkup
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"  // Running/Cardio
  ];

  // LOGIKA AUTO SLIDE CAROUSEL (Bergeser setiap 3 detik)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === promoImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(slideInterval);
  }, []);

  // LOGIKA DETEKSI ARAH SCROLL NAVBAR
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // DATA BERITA KESEHATAN
  const healthNews = [
    {
      title: "Pentingnya Menjaga Pola Tidur 8 Jam untuk Imunitas",
      category: "Tips Kesehatan",
      desc: "Riset terbaru menunjukkan tidur cukup secara konsisten memperkuat sel T pelindung tubuh dari serangan virus merugikan.",
      date: "26 Juni 2026"
    },
    {
      title: "5 Makanan Tinggi Serat yang Baik untuk Jantung Anda",
      category: "Nutrisi",
      desc: "Mengonsumsi gandum, buah beri, dan alpukat terbukti secara klinis mampu menekan kadar kolesterol jahat (LDL).",
      date: "24 Juni 2026"
    },
    {
      title: "Olahraga Kardio Ringan: Berapa Durasi Ideal per Hari?",
      category: "Kebugaran",
      desc: "Hanya dengan berjalan cepat 20-30 menit sehari, Anda dapat memotong risiko serangan kardiovaskular hingga 40%.",
      date: "20 Juni 2026"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFEEF] text-black font-sans selection:bg-blue-500 selection:text-white pb-12">
      
      {/* NAVBAR STYLE: NEO-BRUTALISM */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50
        bg-white border-b-4 border-black
        transition-transform duration-300
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
      `}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full">
            
            {/* LOGO NEO-BRUTALISM */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <HeartPulse size={24} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter">
                HEALTH.APP
              </h1>
            </div>

            {/* MENU TEKS UTAMA (Desktop) */}
            <div className="hidden sm:flex items-center gap-6 font-black text-sm uppercase tracking-wider sm:ml-12 sm:mr-auto">
              <a href="#home" className="hover:text-blue-600 transition border-b-2 border-transparent hover:border-black">Home</a>
              <a href="#features" className="hover:text-blue-600 transition border-b-2 border-transparent hover:border-black">Features</a>
              <a href="#news" className="hover:text-blue-600 transition border-b-2 border-transparent hover:border-black">News</a>
              <a href="#statistics" className="hover:text-blue-600 transition border-b-2 border-transparent hover:border-black">Statistics</a>
              <a href="#footer" className="hover:text-blue-600 transition border-b-2 border-transparent hover:border-black">Contact</a>
            </div>

            {/* TOMBOL LAYOUT AUTH NEO-BRUTALISM */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="border-3 border-black bg-white text-black hover:bg-gray-100 px-4 py-2 font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                Login
              </Link>
              <Link to="/register" className="border-3 border-black bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                Sign Up
              </Link>
            </div>
          </div>

          {/* MENU TEKS (Mobile Version bawah logo) */}
          <div className="flex sm:hidden items-center justify-center gap-4 font-black text-xs uppercase overflow-x-auto py-1 w-full border-t-2 border-black mt-1">
            <a href="#home" className="hover:text-blue-600">Home</a>
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#news" className="hover:text-blue-600">News</a>
            <a href="#statistics" className="hover:text-blue-600">Statistics</a>
            <a href="#footer" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION DENGAN CAROUSEL PROMOSI KESEHATAN */}
      <section id="home" className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* SISI KIRI: TEKS HERO */}
          <div>
            <div className="inline-block bg-yellow-300 text-black border-2 border-black px-4 py-1.5 font-black uppercase text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
              ✦ SMART HEALTH MONITORING PLATFORM
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-none uppercase">
              Monitor Your Health <br />
              <span className="bg-blue-500 text-white px-2 inline-block border-2 border-black my-1">ANYWHERE</span> <br />
              Anytime.
            </h1>
            <p className="mt-6 text-lg font-bold text-gray-700 leading-relaxed max-w-xl border-l-4 border-black pl-4">
              Track your activities, monitor sleep, manage medical reports, and connect with medical staff using one highly optimized, robust modern system.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/register" className="bg-blue-500 text-white border-4 border-black px-8 py-4 font-black text-lg uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Get Started Now
              </Link>
            </div>
          </div>

          {/* SISI KANAN: BANNER PROMOSI AUTOMATIC CAROUSEL */}
          <div className="w-full">
            <div className="bg-white border-4 border-black rounded-none p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="text-xs font-black uppercase tracking-wider mb-2 bg-gray-100 p-2 border-2 border-black inline-block">
                📸 LIVE PROMOTIONAL FEED ({currentSlide + 1}/5)
              </div>
              
              {/* SLIDE CANVAS IMAGE */}
              <div className="relative h-64 sm:h-80 w-full border-4 border-black overflow-hidden bg-gray-300">
                <img 
                  src={promoImages[currentSlide]} 
                  alt="Promosi Kesehatan" 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 font-bold text-xs uppercase tracking-wide border-t-2 border-black">
                  Layanan Kesehatan Digital Terintegrasi Berbasis Web Modern
                </div>
              </div>

              {/* MANUAL INDIKATOR BUTTONS */}
              <div className="flex justify-center gap-2 mt-4">
                {promoImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-4 h-4 border-2 border-black transition-all ${currentSlide === idx ? "bg-blue-500 scale-110" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION (NEO-BRUTALISM GRID) */}
      <section id="features" className="py-20 border-t-4 border-black bg-blue-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight bg-white inline-block border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Core Features
            </h2>
            <p className="text-lg font-bold mt-4 text-gray-700">Everything you need for clean medical monitoring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Activity size={32} />, title: "Activity Tracker", desc: "Track full steps, calories, and routines.", bg: "bg-yellow-200" },
              { icon: <Moon size={32} />, title: "Sleep Analyzer", desc: "Monitor precision circadian duration and quality parameters.", bg: "bg-green-200" },
              { icon: <ShieldCheck size={32} />, title: "Medical Supervision", desc: "Allows active medical personnel to real-time track records.", bg: "bg-purple-200" }
            ].map((item, index) => (
              <div key={index} className={`${item.bg} border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                <div className="bg-white p-3 border-2 border-black inline-block mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">{item.title}</h3>
                <p className="font-bold text-gray-700 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BERITA KESEHATAN SECTION (BARU) */}
      <section id="news" className="py-20 border-t-4 border-black bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight bg-yellow-300 inline-block border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Latest Health News
            </h2>
            <p className="text-lg font-bold mt-4 text-gray-700">Informasi medis dan edukasi tips kesehatan terpercaya harian.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthNews.map((news, index) => (
              <div key={index} className="bg-[#FFFEEF] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                <div>
                  <span className="bg-blue-500 text-white font-black text-xs uppercase px-2 py-1 border-2 border-black inline-block mb-3">
                    {news.category}
                  </span>
                  <h3 className="text-xl font-black uppercase hover:text-blue-600 transition duration-200 mb-2">
                    {news.title}
                  </h3>
                  <p className="font-semibold text-gray-600 text-sm leading-relaxed mb-4">
                    {news.desc}
                  </p>
                </div>
                <div className="border-t-2 border-black pt-3 text-xs font-black text-gray-500 uppercase tracking-wider">
                  🗓️ Published: {news.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION (NEO-BRUTALISM BANNER) */}
      <section id="statistics" className="py-16 border-t-4 border-black border-b-4 bg-blue-500 text-white px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white text-black border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]">
            <h2 className="text-5xl font-black tracking-tight">10K+</h2>
            <p className="mt-2 text-sm uppercase tracking-widest font-black text-gray-600">Active Users Registered</p>
          </div>
          <div className="bg-white text-black border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]">
            <h2 className="text-5xl font-black tracking-tight">500+</h2>
            <p className="mt-2 text-sm uppercase tracking-widest font-black text-gray-600">Daily Medical Logs Generated</p>
          </div>
          <div className="bg-white text-black border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]">
            <h2 className="text-5xl font-black tracking-tight">24/7</h2>
            <p className="mt-2 text-sm uppercase tracking-widest font-black text-gray-600">Real-Time Sync Infrastructure</p>
          </div>
        </div>
      </section>

      {/* CONTACT & FOOTER SECTION */}
      <footer id="footer" className="bg-white border-t-2 border-black pt-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b-4 border-black">
          
          {/* FOOTER LOGO */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tighter uppercase">HEALTH.APP</h2>
            <p className="text-gray-600 font-bold text-sm mt-1">Smart Healthcare Monitoring Ecosystem</p>
          </div>

          {/* SOSIAL MEDIA HUB (CONTACT DESIGN) */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h3 className="text-sm font-black uppercase tracking-wider bg-yellow-300 px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Connect With Us
            </h3>
            <div className="flex gap-4">
              {/* FACEBOOK */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-white text-black border-3 border-black p-3 hover:bg-blue-500 hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.85z"/>
                </svg>
              </a>

              {/* INSTAGRAM */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-white text-black border-3 border-black p-3 hover:bg-pink-500 hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>

              {/* GMAIL */}
              <a 
                href="mailto:yourbrand@gmail.com" 
                className="bg-white text-black border-3 border-black p-3 hover:bg-red-500 hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="text-center py-6 text-sm font-black uppercase tracking-wide text-gray-500">
          © 2026 HEALTH MONITORING SYSTEM. ALL RIGHTS RESERVED.
        </div>
      </footer>

    </div>
  );
}