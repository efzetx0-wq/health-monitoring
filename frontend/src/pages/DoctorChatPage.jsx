import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import { 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Send, 
  UserRound, 
  ArrowLeft 
} from "lucide-react";

export default function DoctorChatPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Loading Specialist Name...",
    email: "..."
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "doctor",
      text: "Halo! Saya staf medis dari Health App. Ada keluhan atau data kesehatan harian yang ingin Anda konsultasikan hari ini?",
      time: "10:00",
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mengambil info dokter terpilih secara dinamis
  useEffect(() => {
    if (doctorId) {
      api.get(`/admin/users`)
        .then((response) => {
          const foundDoctor = response.data.find(u => u.id === parseInt(doctorId));
          if (foundDoctor) {
            setDoctorInfo({
              name: foundDoctor.name,
              email: foundDoctor.email
            });
          }
        })
        .catch(err => console.log("Gagal memuat data dokter:", err));
    }
  }, [doctorId]);

  // Gulir layar otomatis ke pesan terbawah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fungsi Mengirim Pesan Teks
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setShowMenu(false);
  };

  // Trigger pilihan lampiran media/file
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
    setShowMenu(false);
  };

  // Membaca file gambar/dokumen dari input file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    
    const newAttachmentMessage = {
      id: messages.length + 1,
      sender: "user",
      text: isImage ? `📷 Mengirim Foto: ${file.name}` : `📄 Mengirim Dokumen: ${file.name}`,
      fileUrl: URL.createObjectURL(file),
      isImage: isImage,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newAttachmentMessage]);
  };

  // Memasukkan dokumen link (Google Drive, Dropbox, dsb.)
  const handleLinkInsert = () => {
    const url = prompt("Masukkan URL/Link dokumen medis Anda (misal: Google Drive/Dropbox):");
    if (!url) return;

    const newLinkMessage = {
      id: messages.length + 1,
      sender: "user",
      text: `🔗 Tautan Dokumen Medis: `,
      linkUrl: url,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newLinkMessage]);
    setShowMenu(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto p-3 sm:p-4 pb-24 md:pb-4">
        
        {/* ========================================== */}
        {/* 1. HEADER CHAT DOKTER                      */}
        {/* ========================================== */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-t-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all cursor-pointer mr-1"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
            <UserRound size={24} />
            <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></span>
          </div>
          
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg leading-tight">
              {doctorInfo.name}
            </h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              {doctorInfo.email} • Aktif Berkonsultasi
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. CHAT BUBBLES SCROLL CONTAINER           */}
        {/* ========================================== */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-950/20 space-y-4 border-x border-gray-100 dark:border-gray-700/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl shadow-sm text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700"
                }`}
              >
                <p className="leading-relaxed wrap-break-word">{msg.text}</p>

                {/* Preview Foto */}
                {msg.fileUrl && msg.isImage && (
                  <img src={msg.fileUrl} alt="Upload medis" className="mt-2 rounded-lg max-h-48 object-cover border border-white/20" />
                )}

                {/* Preview Dokumen */}
                {msg.fileUrl && !msg.isImage && (
                  <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="block mt-2 text-xs font-semibold underline text-blue-200 hover:text-white">
                    Buka Lampiran File
                  </a>
                )}

                {/* Preview URL Link */}
                {msg.linkUrl && (
                  <a href={msg.linkUrl} target="_blank" rel="noreferrer" className="block mt-1 font-bold underline text-yellow-200 hover:text-yellow-100 break-all">
                    {msg.linkUrl}
                  </a>
                )}

                <span className={`block text-[10px] mt-1.5 text-right ${msg.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* ========================================== */}
        {/* 3. ATTACHMENT MENU & INPUT BAR             */}
        {/* ========================================== */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-b-2xl border border-gray-100 dark:border-gray-700 relative">
          
          {/* POPUP TOMBOL (+) */}
          {showMenu && (
            <div className="absolute bottom-16 left-4 bg-white dark:bg-gray-700 shadow-xl border border-gray-100 dark:border-gray-600 rounded-2xl p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                type="button"
                onClick={handleAttachmentClick}
                className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600/50 px-4 py-2.5 rounded-xl text-left cursor-pointer w-full"
              >
                <span className="text-blue-500"><ImageIcon size={16} /></span> Upload Foto
              </button>
              <button
                type="button"
                onClick={handleLinkInsert}
                className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600/50 px-4 py-2.5 rounded-xl text-left cursor-pointer w-full"
              >
                <span className="text-orange-500"><FileText size={16} /></span> Kirim Link Dokumen
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,application/msword"
          />

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className={`p-3 rounded-xl transition-all text-base cursor-pointer ${
                showMenu 
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rotate-45" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200"
              }`}
            >
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Tulis pesan ke ${doctorInfo.name}...`}
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-400 p-3 rounded-xl transition-all text-sm cursor-pointer"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </MainLayout>
  );
}