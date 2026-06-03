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

  return (

    <MainLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6 text-white">

          Sleep Tracking

        </h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="
            bg-gray-900
            text-white
            p-6
            rounded-2xl
            shadow
          ">

            <h2 className="text-gray-400">

              Average Sleep

            </h2>

            <p className="text-3xl font-bold mt-2">

              {averageSleep} Hours

            </p>

          </div>

          <div className="
            bg-gray-900
            text-white
            p-6
            rounded-2xl
            shadow
          ">

            <h2 className="text-gray-400">

              Total Records

            </h2>

            <p className="text-3xl font-bold mt-2">

              {sleepData.length}

            </p>

          </div>

        </div>

        {/* FORM */}
        <div className="
          bg-gray-900
          text-white
          p-6
          rounded-2xl
          shadow
          mb-8
        ">

          <h2 className="text-2xl font-bold mb-4">

            Add Sleep Record

          </h2>

          {message && (

            <div className="
              bg-green-500/20
              text-green-300
              p-3
              rounded-lg
              mb-4
            ">

              {message}

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >

            {/* SLEEP TIME */}
            <div>

              <label className="block mb-2">

                Sleep Time

              </label>

              <input
                type="time"
                name="sleep_time"
                value={formData.sleep_time}
                onChange={handleChange}
                className="
                  w-full
                  bg-gray-800
                  border
                  border-gray-700
                  p-3
                  rounded-lg
                  text-white
                "
              />

            </div>

            {/* WAKE TIME */}
            <div>

              <label className="block mb-2">

                Wake Time

              </label>

              <input
                type="time"
                name="wake_time"
                value={formData.wake_time}
                onChange={handleChange}
                className="
                  w-full
                  bg-gray-800
                  border
                  border-gray-700
                  p-3
                  rounded-lg
                  text-white
                "
              />

            </div>

            {/* QUALITY */}
            <div>

              <label className="block mb-2">

                Sleep Quality

              </label>

              <input
                type="text"
                value={formData.sleep_quality}
                readOnly
                className="
                  w-full
                  bg-gray-700
                  border
                  border-gray-600
                  p-3
                  rounded-lg
                  text-white
                "
              />

            </div>

            {/* DURATION */}
            <div>

              <label className="block mb-2">

                Sleep Duration

              </label>

              <input
                type="text"
                value={
                  formData.sleep_duration
                }
                readOnly
                className="
                  w-full
                  bg-gray-700
                  border
                  border-gray-600
                  p-3
                  rounded-lg
                  text-white
                "
              />

            </div>

            {/* NOTES */}
            <div className="md:col-span-2">

              <label className="block mb-2">

                Notes

              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="
                  w-full
                  bg-gray-800
                  border
                  border-gray-700
                  p-3
                  rounded-lg
                  text-white
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
                rounded-lg
                md:col-span-2
              "
            >

              Save Sleep Data

            </button>

          </form>

        </div>

        {/* TABLE */}
        <div className="
          bg-gray-900
          text-white
          rounded-2xl
          shadow
          overflow-x-auto
        ">

          <table className="w-full">

            <thead className="bg-gray-800">

              <tr>

                <th className="p-4 text-left">

                  Sleep Time

                </th>

                <th className="p-4 text-left">

                  Wake Time

                </th>

                <th className="p-4 text-left">

                  Duration

                </th>

                <th className="p-4 text-left">

                  Quality

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

              {sleepData.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      p-6
                      text-center
                      text-gray-400
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
                    border-gray-700
                  "
                >

                  <td className="p-4">

                    {item.sleep_time}

                  </td>

                  <td className="p-4">

                    {item.wake_time}

                  </td>

                  <td className="p-4">

                    {item.sleep_duration} h

                  </td>

                  <td className="p-4">

                    {item.sleep_quality.charAt(0).toUpperCase() + item.sleep_quality.slice(1)}

                  </td>

                  <td className="p-4">

                    {item.notes}

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
                        py-1
                        rounded-lg
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