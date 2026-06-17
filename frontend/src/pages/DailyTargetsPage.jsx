import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  getDailyTargets,
  createDailyTarget,
  deleteDailyTarget
} from "../services/dailyTargetService";

export default function DailyTargetsPage() {

  const [targets, setTargets] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({
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
      const data =
        await getDailyTargets();
      setTargets(data);
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
      console.log(formData);
      await createDailyTarget(formData);

      setMessage(
        "Daily target berhasil disimpan"
      );

      setFormData({
        step_target: "",
        calorie_target: "",
        sleep_target: "",
        target_date: ""
      });

      loadTargets();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      await deleteDailyTarget(id);
      loadTargets();
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
    }
  };

  const calculateProgress = (
    current,
    target
  ) => {
    if (!target) return 0;
    return Math.min(
      Number(((current / target) * 100).toFixed(0)),
      100
    );
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Daily Targets
        </h1>

        {/* Form */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            Set Daily Target
          </h2>

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-sm font-medium">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Target Steps */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Step Target</label>
              <input
                type="number"
                name="step_target"
                placeholder="e.g. 10000"
                value={formData.step_target}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            {/* Target Calories */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Calorie Target (kcal)</label>
              <input
                type="number"
                name="calorie_target"
                placeholder="e.g. 2000"
                value={formData.calorie_target}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            {/* Target Sleep */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Sleep Target (hours)</label>
              <input
                type="number"
                step="0.1"
                name="sleep_target"
                placeholder="e.g. 8"
                value={formData.sleep_target}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            {/* Target Date */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Target Date</label>
              <input
                type="date"
                name="target_date"
                value={formData.target_date}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <button
              className="bg-blue-600 text-white p-3 rounded-xl sm:col-span-2 hover:bg-blue-700 transition font-semibold text-sm sm:text-base shadow-md shadow-blue-100"
            >
              Save Daily Target
            </button>
          </form>
        </div>

        {/* History Container Title */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">Active Targets & Progress</h2>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {targets.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-8 rounded-2xl shadow border border-gray-100">
              Belum ada target harian yang diatur.
            </p>
          ) : (
            targets.map((target) => {
              const stepProgress = calculateProgress(target.step_target, target.step_target);
              const calorieProgress = calculateProgress(target.calorie_target, target.calorie_target);
              const sleepProgress = calculateProgress(target.sleep_target, target.sleep_target);

              return (
                <div
                  key={target.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-100 flex flex-col justify-between gap-4"
                >
                  {/* Bagian Atas Kartu: Tanggal Target & Tombol Delete */}
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">TARGET DATE</span>
                      <span className="text-sm font-bold text-gray-700">{target.target_date || "Hari Ini"}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(target.id)}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Bagian Tengah Kartu: Bar Indikator Progres */}
                  <div className="space-y-4">
                    {/* Steps */}
                    <div>
                      <div className="flex justify-between mb-1.5 text-xs sm:text-sm">
                        <span className="font-semibold text-gray-700">Steps Goal</span>
                        <span className="font-bold text-blue-600">{target.step_target?.toLocaleString()} steps ({stepProgress}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stepProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Calories */}
                    <div>
                      <div className="flex justify-between mb-1.5 text-xs sm:text-sm">
                        <span className="font-semibold text-gray-700">Calories Burn Goal</span>
                        <span className="font-bold text-emerald-600">{target.calorie_target?.toLocaleString()} kcal ({calorieProgress}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${calorieProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Sleep */}
                    <div>
                      <div className="flex justify-between mb-1.5 text-xs sm:text-sm">
                        <span className="font-semibold text-gray-700">Sleep Duration Goal</span>
                        <span className="font-bold text-purple-600">{target.sleep_target} Hours ({sleepProgress}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${sleepProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}