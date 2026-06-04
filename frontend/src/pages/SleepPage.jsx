import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  getSleepTrackings,
  createSleepTracking,
  deleteSleepTracking
} from "../services/sleepService";

export default function SleepPage() {

  const [sleepData, setSleepData] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({

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

      const data =
        await getSleepTrackings();

      setSleepData(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.log(error);
    }
  };

  // CALCULATE DURATION
  const calculateDuration = (
    sleepTime,
    wakeTime
  ) => {

    if (!sleepTime || !wakeTime)
      return "";

    const start =
      new Date(
        `2026-01-01 ${sleepTime}`
      );

    const end =
      new Date(
        `2026-01-01 ${wakeTime}`
      );

    let diff =
      (end - start) /
      (1000 * 60 * 60);

    if (diff < 0) {

      diff += 24;
    }

    return diff.toFixed(1);
  };

  // AUTO QUALITY
  const calculateQuality = (
    duration
  ) => {

    const hours =
      parseFloat(duration);

    if (!hours) {

      return "";
    }

    // < 5 jam
    if (hours < 5) {

      return "poor";
    }

    // 5 - 6 jam
    if (hours < 7) {

      return "fair";
    }

    // 7 - 8 jam
    if (hours < 9) {

      return "good";
    }

    // > 8 jam
    return "excellent";
  };

  // HANDLE INPUT
  const handleChange = (e) => {

    const { name, value } =
      e.target;

    const updatedData = {
      ...formData,
      [name]: value
    };

    if (
      name === "sleep_time" ||
      name === "wake_time"
    ) {

      updatedData.sleep_duration =
        calculateDuration(
          name === "sleep_time"
            ? value
            : updatedData.sleep_time,

          name === "wake_time"
            ? value
            : updatedData.wake_time
        );

      updatedData.sleep_quality =
        calculateQuality(
          updatedData.sleep_duration
        );
    }

    setFormData(updatedData);
  };

  // SAVE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createSleepTracking(
        formData
      );

      setMessage(
        "Data tidur berhasil disimpan"
      );

      // RESET FORM
      setFormData({

        sleep_time: "",

        wake_time: "",

        sleep_quality: "",

        sleep_duration: "",

        notes: ""
      });

      // REFRESH DATA
      await loadSleepData();

    } catch (error) {

      console.log(error);
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

  // AVERAGE
  const averageSleep =
    sleepData.length > 0
      ? (
          sleepData.reduce(
            (total, item) =>
              total +
              Number(
                item.sleep_duration || 0
              ),
            0
          ) / sleepData.length
        ).toFixed(1)
      : 0;

  // Fungsi pembantu warna label kualitas
  const getQualityBadgeColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case "excellent": return "bg-emerald-50 text-emerald-600";
      case "good": return "bg-blue-50 text-blue-600";
      case "fair": return "bg-amber-50 text-amber-600";
      case "poor": return "bg-rose-50 text-rose-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (

    <MainLayout>

      {/* MODIFIKASI: Mengubah padding agar ramah mobile dan memberi jarak di bawah dari bottom navbar */}
      <div className="p-4 sm:p-6 pb-24 md:pb-6">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Sleep Tracking
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">

          <div className="
            bg-white
            text-gray-800
            p-5
            sm:p-6
            rounded-2xl
            shadow
            border
            border-gray-50
          ">

            <h2 className="text-gray-500 text-sm sm:text-base font-medium">
              Average Sleep
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {averageSleep} Hours
            </p>

          </div>

          <div className="
            bg-white
            text-gray-800
            p-5
            sm:p-6
            rounded-2xl
            shadow
            border
            border-gray-50
          ">

            <h2 className="text-gray-500 text-sm sm:text-base font-medium">
              Total Records
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {sleepData.length}
            </p>

          </div>

        </div>

        {/* FORM */}
        <div className="
          bg-white
          text-gray-800
          p-5
          sm:p-6
          rounded-2xl
          shadow
          mb-8
          border
          border-gray-50
        ">

          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            Add Sleep Record
          </h2>

          {message && (

            <div className="
              bg-green-100
              text-green-700
              p-3
              rounded-xl
              mb-4
              text-sm
              font-medium
            ">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            "
          >

            {/* SLEEP TIME */}
            <div>

              <label className="block mb-2 text-sm font-medium text-gray-600">
                Sleep Time
              </label>

              <input
                type="time"
                name="sleep_time"
                value={formData.sleep_time}
                onChange={handleChange}
                className="
                  w-full
                  bg-white
                  border
                  border-gray-200
                  p-3
                  rounded-xl
                  text-sm
                  text-gray-800
                  focus:outline-none
                  focus:border-blue-500
                "
              />

            </div>

            {/* WAKE TIME */}
            <div>

              <label className="block mb-2 text-sm font-medium text-gray-600">
                Wake Time
              </label>

              <input
                type="time"
                name="wake_time"
                value={formData.wake_time}
                onChange={handleChange}
                className="
                  w-full
                  bg-white
                  border
                  border-gray-200
                  p-3
                  rounded-xl
                  text-sm
                  text-gray-800
                  focus:outline-none
                  focus:border-blue-500
                "
              />

            </div>

            {/* QUALITY */}
            <div>

              <label className="block mb-2 text-sm font-medium text-gray-600">
                Sleep Quality
              </label>

              <input
                type="text"
                value={formData.sleep_quality ? formData.sleep_quality.toUpperCase() : ""}
                readOnly
                placeholder="Auto calculated"
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  p-3
                  rounded-xl
                  text-sm
                  text-gray-500
                  font-semibold
                  focus:outline-none
                "
              />

            </div>

            {/* DURATION */}
            <div>

              <label className="block mb-2 text-sm font-medium text-gray-600">
                Sleep Duration
              </label>

              <input
                type="text"
                value={formData.sleep_duration ? `${formData.sleep_duration} Hours` : ""}
                readOnly
                placeholder="Auto calculated"
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  p-3
                  rounded-xl
                  text-sm
                  text-gray-500
                  font-semibold
                  focus:outline-none
                "
              />

            </div>

            {/* NOTES */}
            <div className="sm:col-span-2">

              <label className="block mb-2 text-sm font-medium text-gray-600">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Optional notes"
                className="
                  w-full
                  bg-white
                  border
                  border-gray-200
                  p-3
                  rounded-xl
                  text-sm
                  text-gray-800
                  focus:outline-none
                  focus:border-blue-500
                "
              />

            </div>

            {/* BUTTON */}
            <button
              className="
                bg-blue-600
                hover:bg-blue-700
                transition
                text-white
                p-3
                rounded-xl
                sm:col-span-2
                font-semibold
                text-sm
                sm:text-base
                shadow-md
                shadow-blue-100
              "
            >
              Save Sleep Data
            </button>

          </form>

        </div>

        {/* HISTORY CONTAINER */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">History</h2>

        {/* =============================================================== */}
        {/* 1. SEGMEN MOBILE LIST CARD (Hanya Muncul di Layar HP)           */}
        {/* =============================================================== */}
        <div className="block sm:hidden space-y-4">
          {sleepData.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-6 rounded-2xl shadow border border-gray-100">
              No sleep data found
            </p>
          ) : (
            sleepData.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
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
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex gap-2 items-center border-t border-b border-gray-50 py-2">
                  <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                    {item.sleep_duration} h
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getQualityBadgeColor(item.sleep_quality)}`}>
                    {item.sleep_quality ? item.sleep_quality.charAt(0).toUpperCase() + item.sleep_quality.slice(1) : "-"}
                  </span>
                </div>

                {item.notes && (
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Notes:</span> {item.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* =============================================================== */}
        {/* 2. SEGMEN LAPTOP/DESKTOP TABLE (Hanya Muncul di Komputer)        */}
        {/* =============================================================== */}
        <div className="
          hidden
          sm:block
          bg-white
          text-gray-800
          rounded-2xl
          shadow
          overflow-hidden
          border
          border-gray-100
        ">

          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-100">

              <tr>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Sleep Time
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Wake Time
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Duration
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Quality
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

              {sleepData.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      p-6
                      text-center
                      text-gray-400
                      text-sm
                    "
                  >
                    No sleep data found
                  </td>

                </tr>
              )}

              {sleepData.map((item) => (

                <tr
                  key={item.id}
                  className="
                    border-t
                    border-gray-100
                    hover:bg-gray-50/50
                    transition-colors
                  "
                >

                  <td className="p-4 text-sm font-medium text-gray-800">
                    {item.sleep_time}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.wake_time}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.sleep_duration} h
                  </td>

                  <td className="p-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getQualityBadgeColor(item.sleep_quality)}`}>
                      {item.sleep_quality ? item.sleep_quality.charAt(0).toUpperCase() + item.sleep_quality.slice(1) : "-"}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                    {item.notes || "-"}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        transition
                        text-white
                        px-3
                        py-1.5
                        rounded-xl
                        text-xs
                        font-semibold
                      "
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