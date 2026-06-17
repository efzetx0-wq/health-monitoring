import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDailyTargets, createDailyTarget, deleteDailyTarget } from "../services/dailyTargetService";

export default function DailyTargetsPage() {
  const [targets, setTargets] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    step_target: "",
    calorie_target: "",
    sleep_target: "",
    target_date: ""
  });

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      const data = await getDailyTargets();
      setTargets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDailyTarget(formData);
      setMessage("Daily target berhasil disimpan");
      setFormData({ step_target: "", calorie_target: "", sleep_target: "", target_date: "" });
      loadTargets();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDailyTarget(id);
      loadTargets();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Daily Targets</h1>

        {/* FORM INPUT TARGET */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Set Daily Target</h2>
          {message && <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-sm font-medium">{message}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Step Target</label>
              <input type="number" name="step_target" required placeholder="e.g. 10000" value={formData.step_target} onChange={handleChange} className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Calorie Target (kcal)</label>
              <input type="number" name="calorie_target" required placeholder="e.g. 2000" value={formData.calorie_target} onChange={handleChange} className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Sleep Target (hours)</label>
              <input type="number" step="0.1" name="sleep_target" required placeholder="e.g. 8" value={formData.sleep_target} onChange={handleChange} className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Target Date</label>
              <input type="date" name="target_date" required value={formData.target_date} onChange={handleChange} className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full" />
            </div>
            <button className="bg-blue-600 text-white p-3 rounded-xl sm:col-span-2 hover:bg-blue-700 transition font-semibold text-sm sm:text-base shadow-md shadow-blue-100">
              Save Daily Target
            </button>
          </form>
        </div>

        {/* LIST PROGRESS 7 HARI TERAKHIR */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">Active Targets & 7 Days Evaluation</h2>

        <div className="space-y-6">
          {targets.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-8 rounded-2xl shadow border border-gray-100">Belum ada target harian yang diatur.</p>
          ) : (
            targets.map((target) => (
              <div key={target.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-100 space-y-4">
                
                {/* HEAD CARD */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block">TARGET UTAMA</span>
                    <h3 className="text-base font-bold text-gray-800">
                      {target.hari_target}, {target.target_date}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Target Set: <span className="font-semibold text-blue-600">{target.step_target?.toLocaleString()} Steps</span> | <span className="font-semibold text-emerald-600">{target.calorie_target} kcal</span> | <span className="font-semibold text-purple-600">{target.sleep_target} h</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => handleDelete(target.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition">
                      Delete
                    </button>
                    {/* INFO BERAPA HARI TARGET TERCAPAI */}
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-indigo-100">
                      🎯 {target.achieved_streak} dari 7 Hari Tercapai
                    </span>
                  </div>
                </div>

                {/* GRID 7 HARI TERAKHIR (RESPONSIF - DI HP AKAN MENJADI LIST KE BAWAH) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {target.history_7_days?.map((day, idx) => (
                    <div key={idx} className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                        <span className="font-bold text-xs text-gray-700">{day.hari}, {day.tanggal_formatted}</span>
                        {day.step_percentage >= 100 && day.calorie_percentage >= 100 && day.sleep_percentage >= 100 ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">100% Goal! 🔥</span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">In Progress</span>
                        )}
                      </div>

                      {/* BARS PROGRESS */}
                      <div className="space-y-2">
                        {/* Steps */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="text-gray-500">Langkah: <b className="text-gray-700">{day.steps_real.toLocaleString()}</b></span>
                            <span className="font-bold text-blue-600">{day.step_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${day.step_percentage}%` }} />
                          </div>
                        </div>

                        {/* Calories */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="text-gray-500">Kalori: <b className="text-gray-700">{day.calories_real} kcal</b></span>
                            <span className="font-bold text-emerald-600">{day.calorie_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${day.calorie_percentage}%` }} />
                          </div>
                        </div>

                        {/* Sleep */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span className="text-gray-500">Tidur: <b className="text-gray-700">{day.sleep_real} jam</b></span>
                            <span className="font-bold text-purple-600">{day.sleep_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${day.sleep_percentage}%` }} />
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}