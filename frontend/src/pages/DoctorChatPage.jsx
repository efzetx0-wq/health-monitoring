import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import { getChatMessages, sendChatMessage } from "../services/doctorChatService";
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
    name: "Memuat Nama Dokter...",
    email: "..."
  });

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

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

  useEffect(() => {
    if (!doctorId) return;

    const fetchMessages = async () => {
      try {
        const data = await getChatMessages(doctorId);
        const mapped = data.map(msg => ({
          id: msg.id,
          sender: msg.sender_id === parseInt(doctorId) ? "doctor" : "user",
          text: msg.message,
          fileUrl: msg.file_url,
          isImage: msg.is_image,
          linkUrl: msg.link_url,
          time: new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        }));
        setMessages(mapped);
      } catch (err) {
        console.log("Error fetch messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [doctorId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputFocus = () => {
    setShowMenu(false);
    setTimeout(() => {
      scrollToBottom();
    }, 150);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      await sendChatMessage({
        receiver_id: doctorId,
        message: inputText
      });
      setInputText("");
      setShowMenu(false);
    } catch (err) {
      console.log("Gagal mengirim:", err);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
    setShowMenu(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    
    // Menggunakan FormData agar berkas fisik asli dikirim ke server/backend
    const formData = new FormData();
    formData.append("receiver_id", doctorId);
    formData.append("is_image", isImage ? 1 : 0);
    formData.append("file", file); // Sesuaikan key 'file' dengan nama field di backend API Anda
    formData.append("message", isImage ? "Mengirim Foto" : `Mengirim Dokumen: ${file.name}`);

    try {
      await sendChatMessage(formData);
      e.target.value = ""; // Reset input file
    } catch (err) {
      console.log("Gagal mengunggah berkas:", err);
    }
  };

  const handleLinkInsert = async () => {
    const url = prompt("Masukkan URL/Link dokumen medis Anda (Google Drive/Dropbox):");
    if (!url) return;

    try {
      await sendChatMessage({
        receiver_id: doctorId,
        message: `🔗 Tautan Dokumen Medis: `,
        link_url: url
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100dvh-76px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto p-2 sm:p-4 overflow-hidden bg-gray-50 text-gray-800">
        
        {/* HEADER CHAT */}
        <div className="bg-blue-600 p-3.5 rounded-t-2xl shadow-md border border-blue-700 flex items-center gap-3 shrink-0">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-700 rounded-xl text-blue-100 hover:text-white transition-all cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="relative bg-white/20 p-2.5 rounded-full text-white">
            <UserRound size={20} />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-600"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white text-sm sm:text-base leading-tight truncate">{doctorInfo.name}</h1>
            <p className="text-[10px] sm:text-xs text-blue-100 font-medium mt-0.5 truncate">{doctorInfo.email} • Online</p>
          </div>
        </div>

        {/* AREA CHAT BUBBLE */}
        <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4 border-x border-gray-200">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl shadow-xs text-sm ${
                msg.sender === "user" 
                  ? "bg-blue-500 text-white rounded-tr-none" 
                  : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
              }`}>
                <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">{msg.text}</p>
                
                {/* RENDER GAMBAR + TOMBOL UNDUH TERSEMBUNYI (CLEAN VIEW) */}
                  {msg.fileUrl && msg.isImage && (
                    <div className="mt-2 overflow-hidden rounded-lg border border-gray-300 max-h-64 relative group cursor-pointer">
                      {/* Foto bersih tanpa halangan */}
                      <img src={msg.fileUrl} alt="Medis" className="w-full h-full object-cover max-h-64" />
                      
                      {/* Tombol Unduh hanya muncul saat di-Hover (group-hover) */}
                      <a 
                        href={msg.fileUrl} 
                        download 
                        target="_blank" 
                        rel="noreferrer" 
                        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                      >
                        📥 Unduh Foto
                      </a>
                    </div>
                  )}
          
                {msg.fileUrl && !msg.isImage && (
                  <div className="mt-2">
                    <a 
                      href={msg.fileUrl} 
                      download 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`inline-flex items-center gap-1.5 font-bold underline text-xs ${msg.sender === "user" ? "text-blue-100 hover:text-white" : "text-blue-600 hover:text-blue-800"}`}
                    >
                      📄 Unduh Lampiran Berkas
                    </a>
                  </div>
                )}
                
                {msg.linkUrl && (
                  <a href={msg.linkUrl} target="_blank" rel="noreferrer" className={`block mt-1 font-bold underline break-all ${msg.sender === "user" ? "text-yellow-200" : "text-blue-600"}`}>
                    {msg.linkUrl}
                  </a>
                )}
                
                <span className={`block text-[9px] mt-1.5 text-right ${msg.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT BAR BAWAH */}
        <div className="bg-gray-50 p-3 rounded-b-2xl border-x border-b border-gray-200 relative shrink-0">
          {showMenu && (
            <div className="absolute bottom-16 left-4 bg-white shadow-xl border border-gray-200 rounded-2xl p-1.5 flex flex-col gap-0.5 z-50">
              <button type="button" onClick={handleAttachmentClick} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-2.5 rounded-xl cursor-pointer w-full text-left">
                <span className="text-blue-500"><ImageIcon size={16} /></span> Upload Foto / File
              </button>
              <button type="button" onClick={handleLinkInsert} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-2.5 rounded-xl cursor-pointer w-full text-left">
                <span className="text-blue-600"><FileText size={16} /></span> Kirim Link Dokumen
              </button>
            </div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => setShowMenu(!showMenu)} 
              className={`p-3 rounded-xl transition-all cursor-pointer ${showMenu ? "bg-gray-200 text-gray-700 rotate-45" : "bg-white text-gray-400 hover:text-gray-600 border border-gray-200 shadow-xs"}`}
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              onFocus={handleInputFocus} 
              placeholder="Tulis pesan keluhan kesehatan Anda..." 
              className="flex-1 bg-white border border-gray-200 text-gray-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-xs" 
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()} 
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 p-3 rounded-xl transition-all cursor-pointer shrink-0 shadow-md disabled:shadow-none"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </MainLayout>
  );
}