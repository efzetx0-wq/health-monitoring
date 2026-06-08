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
    name: "Loading Specialist Name...",
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
    const interval = setInterval(fetchMessages, 3000); // Polling 3 detik

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
    try {
      await sendChatMessage({
        receiver_id: doctorId,
        message: isImage ? `📷 Mengirim Foto: ${file.name}` : `📄 Mengirim Dokumen: ${file.name}`,
        file_url: URL.createObjectURL(file),
        is_image: isImage
      });
    } catch (err) {
      console.log(err);
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
      {/* h-[calc(100dvh-56px)] membuat tinggi chat presisi mengikuti sisa layar saat keyboard HP naik */}
      <div className="flex flex-col h-[calc(100dvh-76px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto p-2 sm:p-4 overflow-hidden">
        
        {/* HEADER CHAT */}
        <div className="bg-[#111827] p-3.5 rounded-t-2xl shadow-lg border border-gray-800 flex items-center gap-3 shrink-0">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="relative bg-cyan-500/20 p-2.5 rounded-full text-cyan-400">
            <UserRound size={20} />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#111827]"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white text-sm sm:text-base leading-tight truncate">{doctorInfo.name}</h1>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-medium mt-0.5 truncate">{doctorInfo.email} • Aktif</p>
          </div>
        </div>

        {/* AREA CHAT BUBBLE */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0a0f1d] space-y-4 border-x border-gray-800/60">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl shadow-md text-sm ${
                msg.sender === "user" 
                  ? "bg-cyan-600 text-white rounded-tr-none" 
                  : "bg-[#111827] text-gray-200 rounded-tl-none border border-gray-800"
              }`}>
                <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">{msg.text}</p>
                {msg.fileUrl && msg.isImage && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-white/10 max-h-48">
                    <img src={msg.fileUrl} alt="Medis" className="w-full h-full object-cover" />
                  </div>
                )}
                {msg.fileUrl && !msg.isImage && (
                  <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="block mt-2 text-xs font-semibold underline text-cyan-300">Buka Lampiran Berkas</a>
                )}
                {msg.linkUrl && (
                  <a href={msg.linkUrl} target="_blank" rel="noreferrer" className="block mt-1 font-bold underline text-amber-300 break-all">{msg.linkUrl}</a>
                )}
                <span className={`block text-[9px] mt-1.5 text-right ${msg.sender === "user" ? "text-cyan-100" : "text-gray-500"}`}>{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT BAR BAWAH */}
        <div className="bg-[#111827] p-3 rounded-b-2xl border-x border-b border-gray-800 relative shrink-0">
          {showMenu && (
            <div className="absolute bottom-16 left-4 bg-[#1e293b] shadow-xl border border-gray-800 rounded-2xl p-1.5 flex flex-col gap-0.5 z-50">
              <button type="button" onClick={handleAttachmentClick} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-200 hover:bg-gray-800 px-4 py-2.5 rounded-xl cursor-pointer w-full text-left">
                <span className="text-cyan-400"><ImageIcon size={16} /></span> Upload Foto
              </button>
              <button type="button" onClick={handleLinkInsert} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-200 hover:bg-gray-800 px-4 py-2.5 rounded-xl cursor-pointer w-full text-left">
                <span className="text-amber-400"><FileText size={16} /></span> Kirim Link Dokumen
              </button>
            </div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,application/msword" />

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => setShowMenu(!showMenu)} 
              className={`p-3 rounded-xl transition-all cursor-pointer ${showMenu ? "bg-gray-800 text-white rotate-45" : "bg-gray-900 text-gray-400 hover:text-white"}`}
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              onFocus={handleInputFocus} 
              placeholder="Tulis pesan keluhan kesehatan Anda..." 
              className="flex-1 bg-gray-950 border border-gray-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors" 
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()} 
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-900 text-white disabled:text-gray-600 p-3 rounded-xl transition-all cursor-pointer shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </MainLayout>
  );
}