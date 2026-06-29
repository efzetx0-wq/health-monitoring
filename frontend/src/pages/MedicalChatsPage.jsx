import { useState, useEffect, useRef } from "react";
import MedicalSidebar from "../components/MedicalSidebar";
import api from "../api/axios";
import { getChatMessages, sendChatMessage } from "../services/doctorChatService";
import { 
  User, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  MessageSquare,
  Activity,
  ArrowLeft
} from "lucide-react";

export default function MedicalChatsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchActivePatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;

    const fetchMessages = async () => {
      try {
        const data = await getChatMessages(selectedPatient.id);
        const mapped = data.map(msg => ({
          id: msg.id,
          sender: msg.sender_id === selectedPatient.id ? "user" : "doctor",
          text: msg.message,
          fileUrl: msg.file_url,
          isImage: msg.is_image,
          linkUrl: msg.link_url,
          time: new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        }));
        setMessages(mapped);
      } catch (err) {
        console.log("Error fetch patient chat:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [selectedPatient]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchActivePatients = async () => {
    try {
      const response = await api.get("/admin/users");
      const filteredPatients = response.data.filter(u => u.role === "user");
      setPatients(filteredPatients);
      
      if (filteredPatients.length > 0 && window.innerWidth >= 768) {
        handleSelectPatient(filteredPatients[0], false);
      }
    } catch (error) {
      console.log("Gagal memuat pasien:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient, triggerMobileView = true) => {
    setSelectedPatient(patient);
    if (triggerMobileView) {
      setShowChatOnMobile(true);
    }
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      await sendChatMessage({
        receiver_id: selectedPatient.id,
        message: inputText
      });
      setInputText(""); // Perbaikan: inputText("") diubah menjadi setInputText("") agar state ter-clear
      setShowAttachMenu(false);
    } catch (err) {
      console.log("Error sending doctor reply:", err);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
    setShowAttachMenu(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    
    const formData = new FormData();
    formData.append("receiver_id", selectedPatient.id);
    formData.append("is_image", isImage ? 1 : 0);
    formData.append("file", file);
    formData.append("message", isImage ? "Mengirim Foto" : `Mengirim Dokumen: ${file.name}`);

    try {
      await sendChatMessage(formData);
      e.target.value = "";
    } catch (err) {
      console.log("Gagal mengunggah berkas medis:", err);
    }
  };

  const handleLinkInsert = async () => {
    const url = prompt("Masukkan URL/Link rujukan resep atau dokumen medis:");
    if (!url) return;

    try {
      await sendChatMessage({
        receiver_id: selectedPatient.id,
        message: `🔗 Tautan Rujukan Medis: `,
        link_url: url
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex bg-[#0f172a] h-screen min-h-screen text-white overflow-hidden w-full relative">
      
      {/* SIDEBAR NAVIGATION */}
      <div className={`${showChatOnMobile ? "hidden md:block" : "block"} shrink-0`}>
        <MedicalSidebar />
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex h-full overflow-hidden w-full relative">
        
        {/* PANEL DAFTAR PASIEN */}
        <div className={`
          w-full md:w-80 border-r border-gray-800 bg-[#111827] flex flex-col h-full shrink-0
          ${showChatOnMobile ? "hidden md:flex" : "flex"}
        `}>
          {/* Header daftar pasien diberi padding-left tambahan khusus mobile agar tidak tertimpa tombol burger sidebar */}
          <div className="p-5 pt-20 md:pt-5 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="text-cyan-400" size={20} />
              Patient Chats
            </h2>
            <p className="text-xs text-gray-400 mt-1">Select a patient to start consultation</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 generic-scrollbar">
            {loading ? (
              <div className="text-center py-8 text-gray-500 animate-pulse text-sm">Loading active patients...</div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No active consultations.</div>
            ) : (
              patients.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p, true)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 text-left cursor-pointer ${
                    selectedPatient?.id === p.id 
                      ? "bg-linear-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white" 
                      : "hover:bg-[#1f2937]/50 text-gray-400 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="bg-[#1f2937] p-2.5 rounded-xl text-cyan-400 shrink-0">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate text-white">{p.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{p.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RUANG UTAMA PERCAKAPAN */}
        <div className={`flex-1 flex flex-col h-full bg-[#0f172a] relative ${showChatOnMobile ? "flex" : "hidden md:flex"}`}>
          {selectedPatient ? (
            <>
              {/* HEADER CHAT BOX */}
              <div className="p-4 pt-18 md:pt-4 bg-[#111827] border-b border-gray-800/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setShowChatOnMobile(false)} 
                    className="md:hidden p-2 bg-[#1f2937] hover:bg-gray-800 rounded-xl text-gray-400 transition-all cursor-pointer mr-1"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400 shrink-0">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm sm:text-base text-white truncate">{selectedPatient.name}</h2>
                    <p className="text-[11px] text-cyan-400 flex items-center gap-1 mt-0.5">
                      <Activity size={10} className="animate-pulse" /> Active Session
                    </p>
                  </div>
                </div>
              </div>

              {/* AREA PESAN CHAT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/20 generic-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl shadow-md text-sm ${
                      msg.sender === "doctor"
                        ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white rounded-tr-none"
                        : "bg-[#111827] text-gray-200 border border-gray-800 rounded-tl-none"
                    }`}>
                      <p 
                        className="leading-relaxed whitespace-pre-wrap text-left" 
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                      >
                        {msg.text}
                      </p>
                      
                      {msg.fileUrl && msg.isImage && (
                        <div className="mt-2 rounded-xl max-h-60 overflow-hidden relative group border border-white/10 cursor-pointer">
                          <img src={msg.fileUrl} alt="Medis" className="w-full h-full object-cover max-h-60" />
                          <a 
                            href={msg.fileUrl} 
                            download 
                            target="_blank" 
                            rel="noreferrer" 
                            className="absolute bottom-2 right-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                          >
                           Unduh Foto
                          </a>
                        </div>
                      )}
                      
                      {msg.fileUrl && !msg.isImage && (
                        <div className="mt-2 bg-[#0f172a]/80 p-2.5 rounded-xl border border-gray-800/60">
                          <a 
                            href={msg.fileUrl} 
                            download 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1.5 font-bold text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                             Unduh Lampiran Medis
                          </a>
                        </div>
                      )}
                      
                      {msg.linkUrl && (
                        <a href={msg.linkUrl} target="_blank" rel="noreferrer" className="block mt-2 font-bold text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 p-2 rounded-xl hover:bg-amber-500/20 transition-all break-all">
                          {msg.linkUrl}
                        </a>
                      )}
                      <span className={`block text-[9px] mt-2 text-right ${msg.sender === "doctor" ? "text-cyan-200" : "text-gray-500"}`}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* BAR INPUT CHAT */}
              <div className="p-3 bg-[#111827] border-t border-gray-800 relative shrink-0">
                {showAttachMenu && (
                  <div className="absolute bottom-18 left-3 bg-[#1f2937] border border-gray-800 rounded-2xl p-1.5 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 shadow-2xl w-48">
                    <button type="button" onClick={handleAttachmentClick} className="flex items-center gap-2.5 text-xs font-semibold text-gray-200 hover:bg-gray-800 px-3 py-2.5 rounded-xl cursor-pointer text-left w-full transition-colors">
                      <ImageIcon size={14} className="text-cyan-400" /> Upload Foto / File
                    </button>
                    <button type="button" onClick={handleLinkInsert} className="flex items-center gap-2.5 text-xs font-semibold text-gray-200 hover:bg-gray-800 px-3 py-2.5 rounded-xl cursor-pointer text-left w-full transition-colors">
                      <FileText size={14} className="text-amber-400" /> Kirim Link Rujukan
                    </button>
                  </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} className={`p-3 rounded-xl transition-all cursor-pointer text-[#9ca3af] ${showAttachMenu ? "bg-gray-800 text-white rotate-45" : "bg-[#1f2937] hover:bg-gray-800"}`}>
                    <Paperclip size={18} />
                  </button>
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ketik balasan..." className="flex-1 bg-[#0f172a] border border-gray-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500" />
                  <button type="submit" disabled={!inputText.trim()} className="bg-linear-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-800 disabled:to-gray-800 text-white disabled:text-gray-600 p-3 rounded-xl transition-all cursor-pointer">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500 pt-20">
              <MessageSquare size={44} className="text-gray-800 mb-3 animate-pulse" />
              <p className="text-sm font-bold text-gray-400">No Patient Selected</p>
              <p className="text-xs mt-1 text-gray-500">Please select a patient from the list to start answering consultation</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}