import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getHealthProfile,
  getActivities,
  getSleepData
} from "../services/dashboardService";
import { getReminders } from "../services/reminderService";
// IMPORT BARU: Mengimpor service AI insight
import { getAiDashboardInsight } from "../services/chatService"; 

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
  
  // STATE BARU: Untuk menyimpan rekomendasi AI dan status loading
  const [aiInsights, setAiInsights] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    loadDashboard();

    const handleUpdate = () => {
      loadDashboard();
    };

    window.addEventListener("dashboard-update", handleUpdate);

    return () => {
      window.removeEventListener("dashboard-update", handleUpdate);
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const profileData = await getHealthProfile();
      const activityData = await getActivities();
      const sleep = await getSleepData();
      const reminderData = await getReminders();

      setProfile(profileData);
      setActivities(Array.isArray(activityData) ? activityData : []);
      setSleepData(Array.isArray(sleep) ? sleep : []);
      setReminders(Array.isArray(reminderData) ? reminderData : []);

      // PROSES TRIGGER AI INSIGHT
      // Hitung variabel penunjang sebelum dikirim ke AI
      const steps = calculateStepsToday(activityData);
      const calories = calculateCaloriesToday(activityData);
      const averageSleep = calculateAverageSleep(sleep);
      const bmi = profileData?.bmi ? Number(profileData.bmi).toFixed(1) : 0;

      // Panggil fungsi AI
      fetchAiInsight(steps, calories, averageSleep, bmi);

    } catch (error) {
      console.log("Error loading dashboard data:", error);
    }
  };

  // Helper untuk hitung steps today (dipecah agar bisa dibaca fungsi utama)
  const calculateStepsToday = (data) => {
    if (!Array.isArray(data) || data.length === 0) return 0;
    const todayStr = new Date().toISOString().substring(0, 10);
    let todayData = data.find(item => item.activity_date?.substring(0, 10) === todayStr);
    if (!todayData) {
      todayData = [...data].sort((a, b) => new Date(b.activity_date || b.created_at) - new Date(a.activity_date || a.created_at))[0];
    }
    return todayData ? Number(todayData.steps || 0) : 0;
  };

  // Helper untuk hitung kalori burned today
  const calculateCaloriesToday = (data) => {
    if (!Array.isArray(data) || data.length === 0) return 0;
    const todayStr = new Date().toISOString().substring(0, 10);
    let todayData = data.find(item => item.activity_date?.substring(0, 10) === todayStr);
    if (!todayData) {
      todayData = [...data].sort((a, b) => new Date(b.activity_date || b.created_at) - new Date(a.activity_date || a.created_at))[0];
    }
    return todayData ? Number(todayData.calories_burned || 0) : 0;
  };

  // Helper untuk rata-rata tidur
  const calculateAverageSleep = (data) => {
    if (!Array.isArray(data) || data.length === 0) return "0.0";
    return (data.reduce((total, item) => total + Number(item.sleep_duration || 0), 0) / data.length).toFixed(1);
  };

  // FUNGSI UTAMA: Mengambil rekomendasi dari Groq AI
  const fetchAiInsight = async (steps, calories, averageSleep, bmi) => {
    setLoadingAi(true);
    try {
      const response = await getAiDashboardInsight({
        steps,
        calories,
        averageSleep,
        bmi
      });
      setAiInsights(response.insights || []);
    } catch (err) {
      console.log("Gagal memuat AI Insights:", err);
      setAiInsights(["Gagal memuat rekomendasi kesehatan otomatis. Pastikan koneksi aman."]);
    } finally {
      setLoadingAi(false);
    }
  };

  const stepsToday = calculateStepsToday(activities);
  const caloriesToday = calculateCaloriesToday(activities);
  const averageSleep = calculateAverageSleep(sleepData);

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Health Dashboard
        </h1>

        {/* ========================================== */}
        {/* 1. STATS CARDS                             */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* KARTU STEPS TODAY */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Steps Today
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {stepsToday.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">steps</span>
            </p>
          </div>

          {/* KARTU CALORIES BURNED */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Calories Burned
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {caloriesToday.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">kcal</span>
            </p>
          </div>

          {/* KARTU AVERAGE SLEEP */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Average Sleep
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {averageSleep} <span className="text-xs font-normal text-gray-400">hours</span>
            </p>
          </div>

          {/* KARTU BMI STATUS */}
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
        {/* 2. AI HEALTH INSIGHTS (KINI DINAMIS!)      */}
        {/* ========================================== */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              AI Real-time Health Insights 🤖
            </h2>
          </div>

          {loadingAi ? (
            /* Efek Shimmer Loading Animasi */
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl text-sm font-medium bg-blue-50/70 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30"
                >
                  ✨ {insight}
                </div>
              ))}
            </div>
          )}
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
        {/* 4. CHARTS TRENDS SECTION                   */}
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