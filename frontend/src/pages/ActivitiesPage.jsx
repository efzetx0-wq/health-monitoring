import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  getActivities,
  createActivity,
  deleteActivity
} from "../services/activityService";

// IMPORT TAMBAHAN: Import axios untuk menembak endpoint sync Google Fit ke Laravel
import axios from "axios";

export default function ActivitiesPage() {

  const [activities, setActivities] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({

      activity_type: "",

      duration_minutes: "",

      calories_burned: "",

      steps: "",

      activity_date: "",

      notes: ""
    });

  // STATE TAMBAHAN: Untuk indikator loading saat tombol sinkronisasi Google Fit ditekan
  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {

    loadActivities();

  }, []);

  const loadActivities = async () => {

    try {

      const data =
        await getActivities();

      setActivities(data);

    } catch (error) {

      console.log(error);
    }
  };

  // FUNGSI TAMBAHAN: Mengambil data dari Google Fit secara otomatis dan memasukkannya ke form input
  const handleGoogleFitSync = async () => {
    setSyncLoading(true);
    setMessage("");
    try {
      // Gunakan URL Cloudflare Tunnel Laravel Anda yang sedang aktif saat ini
      const response = await axios.get("https://trycloudflare.com", {
        withCredentials: true // Menjaga session cookie login Laravel
      });

      // Mengisi form input secara otomatis berdasarkan data yang didapat dari Google Fit
      setFormData({
        ...formData,
        activity_type: "Jalan Kaki (Google Fit)",
        steps: response.data.steps,
        calories_burned: response.data.calories,
        activity_date: new Date().toISOString().split('T')[0], // Mengisi otomatis tanggal hari ini (YYYY-MM-DD)
        duration_minutes: formData.duration_minutes || "30" // Default durasi opsional jika kosong
      });

      setMessage("Data Google Fit berhasil disinkronkan ke formulir!");
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil data. Pastikan akun Google Fit sudah terhubung di menu /google-fit");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
      e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      console.log(formData);

      await createActivity(
        formData
      );

      setMessage(
        "Aktivitas berhasil ditambahkan"
      );

      setFormData({

        activity_type: "",

        duration_minutes: "",

        calories_burned: "",

        steps: "",

        activity_date: "",

        notes: ""
      });

      loadActivities();

    } catch (error) {

      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    try {

      await deleteActivity(id);

      loadActivities();

    } catch (error) {

      console.log(error);
    }
  };

  const totalSteps =
    activities.reduce(
      (total, item) =>
      total + Number(item.steps || 0),
      0
    );

  const totalCalories =
    activities.reduce(
      (total, item) =>
      total +
      Number(item.calories_burned || 0),
      0
    );

  return (

    <MainLayout>

      {/* MODIFIKASI: Padding disesuaikan p-4 di HP dan p-6 di Laptop agar pas di layar sempit */}
      <div className="p-4 sm:p-6 pb-24 md:pb-6">

        {/* PERBAIKAN: Tombol sync diganti dari hijau (bg-green-600) ke biru (bg-blue-600) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Activities
          </h1>
          <button
            onClick={handleGoogleFitSync}
            disabled={syncLoading}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold text-sm sm:text-base text-center"
          >
            {syncLoading ? "Menyinkronkan..." : "🔄 Tarik Data Google Fit"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">

            <h2 className="text-gray-500 text-sm sm:text-base font-medium">
              Total Steps
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {totalSteps.toLocaleString()}
            </p>

          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">

            <h2 className="text-gray-500 text-sm sm:text-base font-medium">
              Total Calories Burned
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {totalCalories.toLocaleString()} kcal
            </p>

          </div>

        </div>

        {/* Form */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">

          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            Add Activity
          </h2>

          {message && (

            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm font-medium">

              {message}

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="activity_type"
              placeholder="Activity Type"
              value={formData.activity_type}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              name="duration_minutes"
              placeholder="Duration (minutes)"
              value={formData.duration_minutes}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              name="calories_burned"
              placeholder="Calories Burned"
              value={formData.calories_burned}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              name="steps"
              placeholder="Steps"
              value={formData.steps}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="date"
              name="activity_date"
              value={formData.activity_date}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 sm:col-span-2"
              rows="3"
            />

            <button
              className="bg-blue-600 text-white p-3 rounded-xl sm:col-span-2 hover:bg-blue-700 transition font-semibold text-sm sm:text-base shadow-md shadow-blue-100"
            >
              Save Activity
            </button>

          </form>

        </div>

        {/* Activity List Container */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">History</h2>
        
        {/* =============================================================== */}
        {/* 1. SEGMEN MOBILE LIST CARD (Hanya Muncul di Layar HP / Tersembunyi di Desktop) */}
        {/* =============================================================== */}
        <div className="block sm:hidden space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-6 rounded-2xl shadow">Belum ada data aktivitas.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{activity.activity_type}</h3>
                    <p className="text-xs text-gray-400">{activity.activity_date}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl mt-1 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">Duration</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{activity.duration_minutes} min</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">Calories</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{activity.calories_burned} kcal</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">Steps</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{activity.steps || 0}</p>
                  </div>
                </div>
                
                {activity.notes && (
                  <div className="text-xs text-gray-500 border-t border-gray-50 pt-2 mt-1">
                    <span className="font-semibold text-gray-700">Notes:</span> {activity.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* =============================================================== */}
        {/* 2. SEGMEN LAPTOP/DESKTOP TABLE (Hanya Muncul di Komputer / Tersembunyi di HP) */}
        {/* =============================================================== */}
        <div className="hidden sm:block bg-white rounded-2xl shadow overflow-hidden border border-gray-100">

          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-100">

              <tr>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Activity
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Duration
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Calories
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Steps
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Notes
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {activities.map((activity) => (

                <tr
                  key={activity.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >

                  <td className="p-4 text-sm font-medium text-gray-800">

                    {activity.activity_type}

                  </td>

                  <td className="p-4 text-sm text-gray-600">

                    {activity.duration_minutes} min

                  </td>

                  <td className="p-4 text-sm text-gray-600">

                    {activity.calories_burned}

                  </td>

                  <td className="p-4 text-sm text-gray-600">

                    {activity.steps}

                  </td>

                  <td className="p-4 text-sm text-gray-600">

                    {activity.activity_date}

                  </td>

                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">

                    {activity.notes || "-"}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          activity.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-600 transition"
                    >

                      Delete

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  )
}