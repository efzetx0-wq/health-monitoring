import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getReminders,
  createReminder,
  deleteReminder,
  updateReminder
} from "../services/reminderService";

export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState("");
  const [audioContextUnlocked, setAudioContextUnlocked] = useState(false);
  const [formData, setFormData] = useState({
    reminder_type: "",
    message: "",
    reminder_time: ""
  });

  useEffect(() => {
    loadReminders();
    mintaIzinNotifikasi();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await getReminders();
      setReminders(data);
    } catch (error) {
      console.log(error);
    }
  };

  // 1. MEMINTA IZIN NOTIFIKASI SISTEM HP (PENTING UNTUK ONESIGNAL & WEB)
  const mintaIzinNotifikasi = () => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  };

  // 2. FUNGSI AUDIO PEMANCING GERBANG SUARA HP
  const bunyikanSuaraPancingan = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = 1000; 
      
      gain.gain.setValueAtTime(0.01, ctx.currentTime); // Suara sangat kecil hanya untuk pancingan sistem
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio unlock error:", e);
    }
  };

  const aktifkanAudioHP = () => {
    if (!audioContextUnlocked) {
      bunyikanSuaraPancingan();
      setAudioContextUnlocked(true);
    }
  };

  const handleChange = (e) => {
    aktifkanAudioHP(); 
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    aktifkanAudioHP(); 
    try {
      await createReminder(formData);
      setMessage("Reminder berhasil dibuat dan dijadwalkan oleh sistem!");
      setFormData({ reminder_type: "", message: "", reminder_time: "" });
      await loadReminders();
    } catch (error) {
      console.log(error.response?.data);
      alert(JSON.stringify(error.response?.data));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
      await loadReminders();
      setMessage("Reminder berhasil dihapus");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const toggleReminder = async (id, currentStatus) => {
    aktifkanAudioHP(); 
    try {
      await updateReminder(id, { is_active: !currentStatus });
      loadReminders();
    } catch (error) {
      console.log(error);
    }
  };

  const getReminderTypeText = (type) => {
    switch (type) {
      case "drink_water": return "Drink Water";
      case "exercise": return "Exercise";
      case "sleep": return "Sleep";
      case "eat": return "Eat";
      default: return type;
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6" onClick={aktifkanAudioHP}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Reminder System</h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">
            <h2 className="text-gray-500 text-sm sm:text-base font-medium">Total Reminder</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">{reminders.length}</p>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">
            <h2 className="text-gray-500 text-sm sm:text-base font-medium">Active Reminder</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-600">{reminders.filter((item) => item.is_active).length}</p>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">
            <h2 className="text-gray-500 text-sm sm:text-base font-medium">Inactive Reminder</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-400">{reminders.filter((item) => !item.is_active).length}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Create Reminder</h2>
          {message && <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-sm font-medium">{message}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Reminder Type</label>
              <select name="reminder_type" value={formData.reminder_type} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500">
                <option value="">Select Type</option>
                <option value="drink_water">Drink Water</option>
                <option value="exercise">Exercise</option>
                <option value="sleep">Sleep</option>
                <option value="eat">Eat</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Reminder Time</label>
              <input type="time" name="reminder_time" value={formData.reminder_time} onChange={handleChange} className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500" />
            </div>

            <div className="sm:col-span-2 flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Reminder Message</label>
              <textarea name="message" placeholder="Tulis pesan pengingat Anda disini..." value={formData.message} onChange={handleChange} rows="2" className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500" />
            </div>

            <button className="bg-blue-600 text-white p-3 rounded-xl sm:col-span-2 hover:bg-blue-700 transition font-semibold text-sm sm:text-base shadow-md shadow-blue-100 cursor-pointer">
              Save Reminder
            </button>
          </form>
        </div>

        {/* HISTORY CONTAINER */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">Schedules</h2>

        {/* 1. SEGMEN MOBILE LIST CARD (Sangat Fleksibel di HP) */}
        <div className="block sm:hidden space-y-4">
          {reminders.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-6 rounded-2xl shadow border border-gray-100">Belum ada jadwal reminder yang dibuat.</p>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{getReminderTypeText(reminder.reminder_type)}</h3>
                    <p className="text-sm font-bold text-blue-600 mt-0.5">⏰ {reminder.reminder_time}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => toggleReminder(reminder.id, reminder.is_active)} className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all ${reminder.is_active ? "bg-emerald-500 shadow-sm shadow-emerald-100" : "bg-gray-400"}`}>
                      {reminder.is_active ? "ON" : "OFF"}
                    </button>
                    <button onClick={() => handleDelete(reminder.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold transition">Delete</button>
                  </div>
                </div>
                {reminder.message && <p className="text-xs text-gray-500 pt-1"><span className="font-semibold text-gray-700">Pesan:</span> {reminder.message}</p>}
              </div>
            ))
          )}
        </div>

        {/* 2. SEGMEN LAPTOP/DESKTOP TABLE */}
        <div className="hidden sm:block bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Message</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Time</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {reminders.length === 0 && (
                <tr><td colSpan="5" className="p-6 text-center text-gray-400 text-sm">Belum ada data reminder found</td></tr>
              )}
              {reminders.map((reminder) => (
                <tr key={reminder.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-800">{getReminderTypeText(reminder.reminder_type)}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{reminder.message || "-"}</td>
                  <td className="p-4 text-sm text-gray-600">{reminder.reminder_time}</td>
                  <td className="p-4">
                    <button onClick={() => toggleReminder(reminder.id, reminder.is_active)} className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all ${reminder.is_active ? "bg-emerald-500 shadow-md shadow-emerald-100" : "bg-gray-400"}`}>
                      {reminder.is_active ? "ON" : "OFF"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(reminder.id)} className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-600 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}