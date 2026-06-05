import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getHealthProfile,
  getActivities,
  getSleepData
} from "../services/dashboardService";
import { getReminders } from "../services/reminderService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // 1. Ambil data asli dari masing-masing fitur yang sudah Anda simpan
      const profileData = await getHealthProfile();
      const activityData = await getActivities();
      const sleep = await getSleepData();
      const reminderData = await getReminders();

      setProfile(profileData);
      setActivities(Array.isArray(activityData) ? activityData : []);
      setSleepData(Array.isArray(sleep) ? sleep : []);
      setReminders(Array.isArray(reminderData) ? reminderData : []);
    } catch (error) {
      console.log("Error loading dashboard data:", error);
    }
  };

  // ==========================================
  // AMBIL DATA AKTIVITAS HARI INI (DARI FITUR ACTIVITIES)
  // ==========================================
  
  // Mendapatkan tanggal hari ini berdasarkan zona waktu lokal PC/HP (Format: YYYY-MM-DD)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  // Cari data aktivitas yang tanggalnya cocok dengan hari ini
  const activityToday = activities.find((item) => {
    if (!item.activity_date) return false;
    // Memotong string jika database mengirim format "YYYY-MM-DD HH:mm:ss" menjadi "YYYY-MM-DD" saja
    return item.activity_date.substring(0, 10) === todayString;
  }) || activities[activities.length - 1] || activities[0]; // Cadangan: ambil data entri terakhir jika tanggal tidak cocok

  // Masukkan data langkah kaki dan kalori yang terbakar hari ini ke dalam variabel kartu
  const stepsToday = activityToday ? Number(activityToday.steps || 0) : 0;
  const caloriesToday = activityToday ? Number(activityToday.calories_burned || 0) : 0;

  // ==========================================
  // HITUNG RATA-RATA TIDUR (DARI FITUR SLEEP)
  // ==========================================
  const averageSleep = sleepData.length > 0
    ? (
        sleepData.reduce((total, item) => total + Number(item.sleep_duration || 0), 0) / 
        sleepData.length
      ).toFixed(1)
    : "0.0";

  // ==========================================
  // LOGIKA AI HEALTH INSIGHTS
  // ==========================================
  const healthInsights = [];

  if (stepsToday < 5000) {
    healthInsights.push({
      type: "warning",
      message: "Your physical activity is low. Try walking more today."
    });
  } else {
    healthInsights.push({
      type: "good",
      message: "Great job staying active today."
    });
  }

  if (Number(averageSleep) < 7) {
    healthInsights.push({
      type: "warning",
      message: "Your sleep duration is below recommended levels."
    });
  } else {
    healthInsights.push({
      type: "good",
      message: "Your sleep duration looks healthy."
    });
  }

  if (profile?.bmi > 25) {
    healthInsights.push({
      type: "warning",
      message: "Your BMI indicates overweight. Maintain healthy habits."
    });
  }

  if (profile?.bmi >= 18 && profile?.bmi <= 25) {
    healthInsights.push({
      type: "good",
      message: "Your BMI is in a healthy range."
    });
  }

  return (
    <MainLayout>
      {/* Kontainer responsif untuk smartphone (pb-24 mengamankan area tombol bawah HP) */}
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Health Dashboard
        </h1>

        {/* ========================================== */}
        {/* 1. STATS CARDS (DATA REAL TIME FITUR ANDA) */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* KARTU LANGKAH KAKI (FITUR ACTIVITIES) */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Steps Today
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {stepsToday.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">steps</span>
            </p>
          </div>

          {/* KARTU KALORI TERBAKAR (FITUR ACTIVITIES) */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Calories Burned
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {caloriesToday.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">kcal</span>
            </p>
          </div>

          {/* KARTU AVERAGE SLEEP (FITUR SLEEP) */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Average Sleep
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {averageSleep} <span className="text-xs font-normal text-gray-400">hours</span>
            </p>
          </div>

          {/* KARTU BMI STATUS (FITUR HEALTH PROFILE) */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              BMI Status
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {profile?.bmi ? Number(profile.bmi).toFixed(1) : "0.0"}
            </p>
          </div>

        </div>

        {/* ========================================== */}
        {/* 2. AI HEALTH INSIGHTS                      */}
        {/* ========================================== */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
            AI Health Insights
          </h2>
          <div className="space-y-3">
            {healthInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-3.5 rounded-xl text-sm font-medium ${
                  insight.type === "warning"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                }`}
              >
                {insight.message}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* 3. ACTIVE REMINDERS                        */}
        {/* ========================================== */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Active Reminders
          </h2>
          {reminders.filter((item) => item.is_active).length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No active reminders
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders
                .filter((item) => item.is_active)
                .map((reminder) => (
                  <div
                    key={reminder.id}
                    className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/50"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      {reminder.reminder_type}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {reminder.message}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-3">
                      {reminder.reminder_time}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* 4. CHARTS TRENDS SECTION (TAILWIND v4 SAFE)*/}
        {/* ========================================== */}
        <div className="space-y-8">
          
          {/* ACTIVITY CHART */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Activity Trend
            </h2>
            <div className="w-full overflow-x-auto">
              <div className="w-full h-72 sm:h-80" style={{ minWidth: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activities} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="activity_date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* CALORIES CHART */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Calories Statistics
            </h2>
            <div className="w-full overflow-x-auto">
              <div className="w-full h-72 sm:h-80" style={{ minWidth: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activities} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="activity_date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="calories_burned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SLEEP CHART */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Sleep Trend
            </h2>
            <div className="w-full overflow-x-auto">
              <div className="w-full h-72 sm:h-80" style={{ minWidth: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="created_at" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="sleep_duration" stroke="#8b5cf6" fill="#c084fc" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}