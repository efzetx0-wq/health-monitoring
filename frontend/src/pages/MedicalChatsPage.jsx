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

  // POLLING UTAMA UNTUK DOKTER: Mengambil pesan dari pasien terpilih setiap 3 detik
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
    const interval = setInterval(fetchMessages, 3000); // Polling 3 detik

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
    setMessages([]); // Kosongkan sementara sampai polling data dari DB masuk
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      await sendChatMessage({
        receiver_id: selectedPatient.id,
        message: inputText
      });
      setInputText("");
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
    try {
      await sendChatMessage({
        receiver_id: selectedPatient.id,
        message: isImage ? `📷 Mengirim Foto: ${file.name}` : `📄 Mengirim Dokumen: ${file.name}`,
        file_url: URL.createObjectURL(file),
        is_image: isImage
      });
    } catch (err) {
      console.log(err);
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
    <div className="flex bg-[#0f172a] min-h-screen text-white overflow-hidden">
      
      <div className={`${showChatOnMobile ? "hidden md:block" : "block"}`}>
        <MedicalSidebar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden">
        
        <div className={`w-full md:w-80 border-r border-gray-850 bg-[#111827] flex flex-col h-full ${showChatOnMobile ? "hidden md:flex" : "flex"}`}>
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="text-cyan-400" size={20} />
              Patient Chats
            </h2>
            <p className="text-xs text-gray-400 mt-1">Select a patient to start consultation</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="text-center py-8 text-gray-500 animate-pulse text-sm">Loading active patients...</div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No active consultations.</div>
            ) : (
              patients.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p, true)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 text-left ${
                    selectedPatient?.id === p.id 
                      ? "bg-linear-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white" 
                      : "hover:bg-[#1f2937]/50 text-gray-400 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="bg-[#1f2937] p-2.5 rounded-xl text-cyan-400">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{p.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col h-full bg-[#0f172a] ${showChatOnMobile ? "flex" : "hidden md:flex"}`}>
          {selectedPatient ? (
            <>
              <div className="p-4 bg-[#111827] border-b border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowChatOnMobile(false)} className="md:hidden p-2 hover:bg-gray-800 rounded-xl text-gray-400 transition-all cursor-pointer mr-1">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base">{selectedPatient.name}</h2>
                    <p className="text-xs text-cyan-400 flex items-center gap-1.5 mt-0.5">
                      <Activity size={12} className="animate-pulse" /> Active Session
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/20">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl shadow-sm text-sm ${
                      msg.sender === "doctor"
                        ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white rounded-tr-none"
                        : "bg-[#111827] text-gray-200 border border-gray-800 rounded-tl-none"
                    }`}>
                      <p className="leading-relaxed wrap-break-word">{msg.text}</p>
                      {msg.fileUrl && msg.isImage && <img src={msg.fileUrl} alt="Medis" className="mt-2 rounded-lg max-h-48 object-cover border border-white/10" />}
                      {msg.fileUrl && !msg.isImage && <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="block mt-2 text-xs font-semibold underline text-cyan-300 hover:text-white">Buka Lampiran Medis</a>}
                      {msg.linkUrl && <a href={msg.linkUrl} target="_blank" rel="noreferrer" className="block mt-1 font-bold underline text-amber-300 hover:text-amber-200 break-all">{msg.linkUrl}</a>}
                      <span className={`block text-[10px] mt-1.5 text-right ${msg.sender === "doctor" ? "text-cyan-200" : "text-gray-500"}`}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 bg-[#111827] border-t border-gray-800 relative">
                {showAttachMenu && (
                  <div className="absolute bottom-16 left-4 bg-[#1f2937] border border-gray-800 rounded-2xl p-1.5 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 shadow-xl">
                    <button type="button" onClick={handleAttachmentClick} className="flex items-center gap-2.5 text-xs font-medium text-gray-200 hover:bg-gray-800 px-4 py-2.5 rounded-xl cursor-pointer text-left w-full">
                      <ImageIcon size={14} className="text-cyan-400" /> Upload Foto
                    </button>
                    <button type="button" onClick={handleLinkInsert} className="flex items-center gap-2.5 text-xs font-medium text-gray-200 hover:bg-gray-800 px-4 py-2.5 rounded-xl cursor-pointer text-left w-full">
                      <FileText size={14} className="text-amber-400" /> Kirim Link Rujukan
                    </button>
                  </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} className={`p-3 rounded-xl transition-all cursor-pointer text-[#9ca3af] ${showAttachMenu ? "bg-gray-800 text-white rotate-45" : "bg-[#1f2937] hover:bg-gray-800"}`}>
                    <Paperclip size={18} />
                  </button>
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={`Ketik balasan ke ${selectedPatient.name}...`} className="flex-1 bg-[#0f172a] border border-gray-800 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-cyan-500" />
                  <button type="submit" disabled={!inputText.trim()} className="bg-linear-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-800 disabled:to-gray-800 text-white disabled:text-gray-600 p-3 rounded-xl transition-all cursor-pointer">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <MessageSquare size={48} className="text-gray-700 mb-3 animate-pulse" />
              <p className="text-base font-semibold">No Patient Selected</p>
              <p className="text-xs mt-1">Please select a patient from the list to start answering consultation</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}