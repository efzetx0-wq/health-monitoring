import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getFoodDiaries, createFoodDiary, deleteFoodDiary } from "../services/foodDiaryService";

export default function FoodDiaryPage() {
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false); // State loading saat Groq AI bekerja

  const [formData, setFormData] = useState({
    food_name: "", // Mengganti food_id menjadi teks bebas
    portion: "",   // Mengganti quantity menjadi porsi teks bebas
    consumed_at: "",
    notes: ""
  });

  useEffect(() => {
    loadFoods();
  }, []);

  // LOAD DATA
  const loadFoods = async () => {
    try {
      const data = await getFoodDiaries();
      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // SAVE VIA AI GROQ BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAi(true);
    setMessage("");

    try {
      const payload = {
        food_name: formData.food_name,
        portion: formData.portion,
        log_date: formData.consumed_at.split("T")[0] || new Date().toISOString().split("T")[0], // Fallback format tanggal YYYY-MM-DD
        notes: formData.notes
      };

      await createFoodDiary(payload);
      setMessage("Makanan berhasil dianalisis AI dan disimpan!");

      setFormData({
        food_name: "",
        portion: "",
        consumed_at: "",
        notes: ""
      });

      setTimeout(() => {
        loadFoods();
      }, 300);

    } catch (error) {
      console.log(error);
      alert("Gagal menganalisis atau menyimpan food diary");
    } finally {
      setLoadingAi(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteFoodDiary(id);
      loadFoods();
    } catch (error) {
      console.log(error);
    }
  };

  // TOTAL CALORIES KOLEKTIF
  const totalCalories = foods.reduce(
    (total, item) => total + Number(item.calories || 0),
    0
  );

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Food Diary AI</h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white text-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-50">
            <h2 className="text-gray-500 text-sm sm:text-base font-medium">Total Calories</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {totalCalories} <span className="text-sm font-normal text-gray-400">kcal</span>
            </p>
          </div>

          <div className="bg-white text-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-50">
            <h2 className="text-gray-500 text-sm sm:text-base font-medium">Total Meals</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">{foods.length}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white text-gray-800 p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Add Food with AI Analysis</h2>

          {message && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl mb-4 text-sm font-medium border border-blue-100">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FOOD NAME TEXT INPUT */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Nama Makanan (Ketik Bebas)</label>
              <input
                type="text"
                name="food_name"
                required
                placeholder="Contoh: Nasi Goreng Gila, Sate Kambing, Mie Instan"
                value={formData.food_name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* PORTION TEXT INPUT */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Jumlah / Porsi (Ketik Bebas)</label>
              <input
                type="text"
                name="portion"
                required
                placeholder="Contoh: 1 piring penuh, 5 tusuk, 1 mangkok kecil"
                value={formData.portion}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* CALORIES (AUTO BY AI INDICATOR) */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Total Kalori</label>
              <input
                type="text"
                readOnly
                placeholder="Dihitung Otomatis oleh Groq AI setelah disave"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm text-gray-400 font-medium focus:outline-none"
              />
            </div>

            {/* DATE */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Waktu Konsumsi</label>
              <input
                type="datetime-local"
                name="consumed_at"
                required
                value={formData.consumed_at}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* NOTES */}
            <div className="sm:col-span-2 flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Catatan Tambahan</label>
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loadingAi}
              className={`text-white p-3 rounded-xl sm:col-span-2 font-semibold text-sm sm:text-base shadow-md transition ${
                loadingAi ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-50"
              }`}
            >
              {loadingAi ? "🔄 Groq AI Sedang Menganalisis & Menghitung Kalori..." : "Hitung Kalori & Simpan via AI"}
            </button>
          </form>
        </div>

        {/* HISTORY CONTAINER */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">History & AI Recommendations</h2>

        {/* 1. SEGMEN MOBILE LIST CARD */}
        <div className="block sm:hidden space-y-4">
          {foods.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-6 rounded-2xl shadow border border-gray-100">
              No food diary found
            </p>
          ) : (
            foods.map((food) => (
              <div key={food.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base capitalize">{food.food_name}</h3>
                    <span className="text-xs text-gray-400">{food.log_date || food.created_at}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Porsi / Jumlah</p>
                    <p className="text-sm font-semibold text-gray-700">{food.portion}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Asupan Energi</p>
                    <p className="text-sm font-bold text-emerald-600">{food.calories} kcal</p>
                  </div>
                </div>

                {/* REKOMENDASI AI MOBILE */}
                <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl text-xs text-emerald-900 leading-relaxed italic">
                  <span className="font-bold text-emerald-800 block not-italic mb-1">💡 REKOMENDASI SEHAT AI:</span>
                  "{food.ai_recommendation || "Tetap batasi minyak berlebih dan imbangi dengan olahraga teratur."}"
                </div>

                {food.notes && (
                  <div className="text-xs text-gray-500 border-t border-gray-50 pt-2">
                    <span className="font-semibold text-gray-700">Notes:</span> {food.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 2. SEGMEN LAPTOP/DESKTOP TABLE */}
        <div className="hidden sm:block bg-white text-gray-800 rounded-2xl shadow overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Food</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Portion</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Calories</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">AI Recommendation</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400 text-sm">No food diary found</td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-gray-800 capitalize">{food.food_name}</td>
                    <td className="p-4 text-sm text-gray-600">{food.portion}</td>
                    <td className="p-4 text-sm font-bold text-emerald-600">{food.calories} kcal</td>
                    <td className="p-4 text-xs text-emerald-800 max-w-sm italic bg-emerald-50/20">
                      {food.ai_recommendation || "Imbangi makanan dengan tambahan serat murni."}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1.5 rounded-xl text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </MainLayout>
  );
}