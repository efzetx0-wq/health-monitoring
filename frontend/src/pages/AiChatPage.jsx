import { useState, useRef, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { sendChatMessage } from "../services/chatService";

export default function AiChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Halo! Saya AI Health Assistant. Ada yang bisa saya bantu seputar kesehatan atau aktivitas Anda hari ini?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll ke pesan paling bawah setiap kali ada chat baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput(""); // Kosongkan input field langsung
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const data = await sendChatMessage(userText);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Maaf, koneksi ke AI sedang terganggu. Coba lagi nanti." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6 max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Health Chatbot</h1>
          <p className="text-sm text-gray-500">Konsultasikan pola hidup, olahraga, atau diet Anda secara langsung.</p>
        </div>

        {/* Chat Box Container */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Bubble Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 text-gray-400 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan sesuatu tentang kesehatan..."
              disabled={loading}
              className="flex-1 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-300"
            >
              Kirim
            </button>
          </form>

        </div>
      </div>
    </MainLayout>
  );
}