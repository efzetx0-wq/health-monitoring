import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getSleepTrackings, createSleepTracking, deleteSleepTracking } from "../services/sleepService";

export default function SleepPage() {
  const [sleepData, setSleepData] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [formData, setFormData] = useState({
    sleep_date: "", 
    sleep_time: "",
    wake_time: "",
    sleep_quality: "",
    sleep_duration: "",
    notes: ""
  });

  useEffect(() => {
    loadSleepData();
  }, []);

  // LOAD DATA
  const loadSleepData = async () => {
    try {
      const data = await getSleepTrackings();
      setSleepData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  // KALKULASI DURASI FORM FORMAT JAM & MENIT
  const calculateDurationText = (sleepTime, wakeTime) => {
    if (!sleepTime || !wakeTime) return "";
    const start = new Date(`2026-01-01 ${sleepTime}`);
    const end = new Date(`2026-01-01 ${wakeTime}`);
    
    let diffMs = end - start;
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000;
    }
    
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) return `${hours} jam`;
    return `${hours} jam ${minutes} menit`;
  };

  // Helper untuk mengubah angka desimal database (misal 7.5) menjadi teks "7 jam 30 menit"
  const formatDecimalToText = (decimalValue) => {
    const num = parseFloat(decimalValue);
    if (isNaN(num) || num === 0) return "-";
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);
    if (minutes === 0) return `${hours} jam`;
    return `${hours} jam ${minutes} menit`;
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };

    if (name === "sleep_time" || name === "wake_time") {
      updatedData.sleep_duration = calculateDurationText(
        name === "sleep_time" ? value : updatedData.sleep_time,
        name === "wake_time" ? value : updatedData.wake_time
      );
      updatedData.sleep_quality = "Menghitung via AI...";
    }

    setFormData(updatedData);
  };

  // SAVE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAi(true);
    setMessage("");

    try {
      const payload = {
        sleep_date: formData.sleep_date,
        sleep_time: formData.sleep_time,
        wake_time: formData.wake_time,
        notes: formData.notes
      };

      await createSleepTracking(payload);

      window.dispatchEvent(new Event("dashboard-update"));
      setMessage("Data tidur berhasil dianalisis AI dan disimpan!");

      setFormData({
        sleep_date: "",
        sleep_time: "",
        wake_time: "",
        sleep_quality: "",
        sleep_duration: "",
        notes: ""
      });

      await loadSleepData();
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan atau menganalisis data tidur.");
    } finally {
      setLoadingAi(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteSleepTracking(id);
      loadSleepData();
    } catch (error) {
      console.log(error);
    }
  };

  // 💡 PERBAIKAN: Menghitung rata-rata tidur lalu langsung mengubah desimalnya ke format "X jam Y menit"
  const getAverageSleepText = () => {
    if (sleepData.length === 0) return "0 jam";
    
    // Hitung total jam desimal dari semua trackings
    const totalDecimalHours = sleepData.reduce((total, item) => total + Number(item.sleep_duration || 0), 0);
    const averageDecimal = totalDecimalHours / sleepData.length;
    
    // Konversi hasil rata-rata desimal ke Jam dan Menit
    return formatDecimalToText(averageDecimal);
  };

  // LOGIKA TERJEMAHAN KUALITAS MEDIS INDONESIA
  const getIndonesianQuality = (quality) => {
    switch (quality?.toLowerCase()) {
      case "excellent": 
        return { teks: "Sangat Baik", kelas: "bg-emerald-50 text-emerald-600" };
      case "good": 
        return { teks: "Baik", kelas: "bg-blue-50 text-blue-600" };
      case "fair": 
        return { teks: "Berlebihan", kelas: "bg-purple-50 text-purple-600" };
      case "poor": 
        return { teks: "Buruk", kelas: "bg-rose-50 text-rose-600" };
      default: 
        return { teks: "Mengukur...", kelas: "bg-gray-50 text-gray-600" };
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Sleep Tracking AI</h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white text-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-50">
            <h2 className="text-gray-500 text-sm sm:text-base font-medium">Average Sleep</h2>
            {/* 💡 SEKARANG MENAMPILKAN FORMAT JAM & MENIT (Contoh: "7 jam 30 menit") */}
            <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">{getAverageSleepText()}</p>
          </div>

          <div className="bg-white text-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-50">
            <h2 className="text-gray-500 text-sm sm:text-base font-medium">Total Records</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">{sleepData.length}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white text-gray-800 p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Add Sleep Record</h2>
          {message && <div className="bg-blue-50 text-blue-700 p-3 rounded-xl mb-4 text-sm font-medium border border-blue-100">{message}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* INPUT TANGGAL */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-600">Sleep Date</label>
              <input
                type="date"
                name="sleep_date"
                required
                value={formData.sleep_date}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* SLEEP TIME */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Sleep Time</label>
              <input
                type="time"
                name="sleep_time"
                required
                value={formData.sleep_time}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* WAKE TIME */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Wake Time</label>
              <input
                type="time"
                name="wake_time"
                required
                value={formData.wake_time}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* QUALITY (DIHITUNG AI) */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Sleep Quality</label>
              <input
                type="text"
                value={formData.sleep_time && formData.wake_time ? "Otomatis Ditentukan AI" : ""}
                readOnly
                placeholder="Auto calculated by AI"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm text-gray-400 font-semibold focus:outline-none"
              />
            </div>

            {/* DURATION TEXT */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Sleep Duration</label>
              <input
                type="text"
                value={formData.sleep_duration || ""}
                readOnly
                placeholder="Auto calculated"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm text-gray-400 font-semibold focus:outline-none"
              />
            </div>

            {/* NOTES */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-600">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Optional notes"
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* BUTTON BIRU */}
            <button 
              disabled={loadingAi}
              className={`text-white p-3 rounded-xl sm:col-span-2 font-semibold text-sm sm:text-base shadow-md transition ${
                loadingAi ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-50"
              }`}
            >
              {loadingAi ? "🔄 AI Sedang Menganalisis Kualitas Tidur..." : "Save Sleep Data & AI Analysis"}
            </button>
          </form>
        </div>

        {/* HISTORY CONTAINER */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">History & AI Analysis</h2>

        {/* 1. SEGMEN MOBILE LIST CARD */}
        <div className="block sm:hidden space-y-4">
          {sleepData.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-6 rounded-2xl shadow border border-gray-100">
              No sleep data found
            </p>
          ) : (
            sleepData.map((item) => {
              const qualityInfo = getIndonesianQuality(item.sleep_quality);
              return (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                        {item.sleep_date}
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium">Sleep Time</p>
                          <p className="text-sm font-semibold text-gray-700">{item.sleep_time}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium">Wake Time</p>
                          <p className="text-sm font-semibold text-gray-700">{item.wake_time}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="flex gap-2 items-center border-t border-b border-gray-50 py-2">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {formatDecimalToText(item.sleep_duration)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${qualityInfo.kelas}`}>
                      {qualityInfo.teks}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Notes:</span>{" "}
                    {item.notes && item.notes.includes(" [AI]: ") ? item.notes.split(" [AI]: ")[0] : item.notes}
                  </p>

                  <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl text-xs text-blue-900 leading-relaxed italic">
                    <span className="font-bold text-blue-800 block not-italic mb-1">💡 ANALISIS SPESIALIS AI:</span>
                    "{item.notes && item.notes.includes(" [AI]: ") ? item.notes.split(" [AI]: ")[1] : "Pola tidur normal."}"
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. SEGMEN LAPTOP/DESKTOP TABLE */}
        <div className="hidden sm:block bg-white text-gray-800 rounded-2xl shadow overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Sleep Time</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Wake Time</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Duration</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Quality AI</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Notes</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">AI Medical Insight</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {sleepData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-400 text-sm">
                    No sleep data found
                  </td>
                </tr>
              ) : (
                sleepData.map((item) => {
                  const qualityInfo = getIndonesianQuality(item.sleep_quality);
                  return (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm font-bold text-gray-900">{item.sleep_date}</td>
                      <td className="p-4 text-sm font-medium text-gray-800">{item.sleep_time}</td>
                      <td className="p-4 text-sm text-gray-600">{item.wake_time}</td>
                      <td className="p-4 text-sm font-bold text-gray-700">{formatDecimalToText(item.sleep_duration)}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${qualityInfo.kelas}`}>
                          {qualityInfo.teks}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 max-w-40 truncate" title={item.notes}>
                        {item.notes && item.notes.includes(" [AI]: ") ? item.notes.split(" [AI]: ")[0] : item.notes || "-"}
                      </td>
                      <td className="p-4 text-xs italic text-blue-800 bg-blue-50/20 max-w-40 truncate" title={item.notes && item.notes.includes(" [AI]: ") ? item.notes.split(" [AI]: ")[1] : ""}>
                        {item.notes && item.notes.includes(" [AI]: ") ? item.notes.split(" [AI]: ")[1] : "Pola tidur normal."}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1.5 rounded-xl text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}