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

      <div className="p-6">

        {/* PERBAIKAN: Menambahkan layout flex agar Tombol Sync berada rapi di sebelah Judul */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">
            Activities
          </h1>
          <button
            onClick={handleGoogleFitSync}
            disabled={syncLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition disabled:bg-gray-400 font-semibold"
          >
            {syncLoading ? "Menyinkronkan..." : "🔄 Tarik Data Google Fit"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Total Steps

            </h2>

            <p className="text-3xl font-bold mt-2">

              {totalSteps}

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Total Calories Burned

            </h2>

            <p className="text-3xl font-bold mt-2">

              {totalCalories} kcal

            </p>

          </div>

        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">

            Add Activity

          </h2>

          {message && (

            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">

              {message}

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="activity_type"
              placeholder="Activity Type"
              value={formData.activity_type}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="duration_minutes"
              placeholder="Duration (minutes)"
              value={formData.duration_minutes}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="calories_burned"
              placeholder="Calories Burned"
              value={formData.calories_burned}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="steps"
              placeholder="Steps"
              value={formData.steps}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              name="activity_date"
              value={formData.activity_date}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="border p-3 rounded-lg md:col-span-2"
              rows="3"
            />

            <button
              className="bg-blue-600 text-white p-3 rounded-lg md:col-span-2 hover:bg-blue-700"
            >

              Save Activity

            </button>

          </form>

        </div>

        {/* Activity Table */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Activity
                </th>

                <th className="p-4 text-left">
                  Duration
                </th>

                <th className="p-4 text-left">
                  Calories
                </th>

                <th className="p-4 text-left">
                  Steps
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Notes
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {activities.map((activity) => (

                <tr
                  key={activity.id}
                  className="border-t"
                >

                  <td className="p-4">

                    {activity.activity_type}

                  </td>

                  <td className="p-4">

                    {activity.duration_minutes} min

                  </td>

                  <td className="p-4">

                    {activity.calories_burned}

                  </td>

                  <td className="p-4">

                    {activity.steps}

                  </td>

                  <td className="p-4">

                    {activity.activity_date}

                  </td>

                  <td className="p-4">

                    {activity.notes}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          activity.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
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
