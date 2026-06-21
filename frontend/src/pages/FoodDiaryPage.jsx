import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../services/axiosInstance";

export default function FoodDiaryPage() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    food_name: "",
    portion: "",
    log_date: ""
  });

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      const response = await axiosInstance.get("/food-diaries");
      setDiaries(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Gagal memuat diary makanan", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axiosInstance.post("/food-diaries", formData);
      setMessage(response.data.message);
      setFormData({ food_name: "", portion: "", log_date: "" });
      loadDiaries();
    } catch (error) {
      console.log(error);
      setMessage("Terjadi kesalahan saat menganalisis makanan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/food-diaries/${id}`);
      loadDiaries();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Food Diary AI</h1>

        {/* FORM INPUT BEBAS */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Catat Apa Yang Kamu Makan</h2>
          
          {message && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl mb-4 text-sm font-medium border border-blue-100">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block px-1">Nama Makanan (Ketik Bebas)</label>
              <input
                type="text"
                name="food_name"
                required
                placeholder="Contoh: Nasi Goreng Gila, Sate Ayam, Boba Milk Tea"
                value={formData.food_name}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block px-1">Porsi / Takaran (Ketik Bebas)</label>
              <input
                type="text"
                name="portion"
                required
                placeholder="Contoh: 1 piring penuh, 5 tusuk, 1 gelas sedang"
                value={formData.portion}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block px-1">Tanggal Makan</label>
              <input
                type="date"
                name="log_date"
                required
                value={formData.log_date}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <button
              disabled={loading}
              className={`w-full p-3 rounded-xl text-white font-semibold text-sm sm:text-base shadow-md transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
              }`}
            >
              {loading ? "🔄 AI Sedang Menghitung Kalori..." : "Hitung Kalori & Simpan via AI"}
            </button>
          </form>
        </div>

        {/* LIST RIWAYAT MAKANAN */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">Riwayat Makan & Rekomendasi Sehat</h2>
        
        <div className="space-y-4">
          {diaries.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-8 rounded-2xl shadow border border-gray-100">Belum ada makanan yang dicatat hari ini.</p>
          ) : (
            diaries.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow border border-gray-100 space-y-3">
                <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">{item.log_date}</span>
                    <h3 className="text-base font-bold text-gray-800 capitalize">{item.food_name}</h3>
                    <span className="text-xs text-gray-500">Porsi: {item.portion}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-xl text-xs border border-amber-100">
                      🔥 {item.calories} Kcal
                    </span>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">
                      Hapus
                    </button>
                  </div>
                </div>

                {/* KOTAK REKOMENDASI AI */}
                <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block mb-0.5">REKOMENDASI AI KESEHATAN:</span>
                    <p className="text-xs text-emerald-900 leading-relaxed italic">"{item.ai_recommendation}"</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}