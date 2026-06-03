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

    water_target: "",

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
      [e.target.name]:
      e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      console.log(formData);
      await createDailyTarget(
        formData
      );

      setMessage(
        "Daily target berhasil disimpan"
      );

      setFormData({

        target_steps: "",

        target_calories: "",

        target_sleep_hours: "",

        current_steps: "",

        current_calories: "",

        current_sleep_hours: ""
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

    console.log(
      error.response?.data
    );
  }
};

  const calculateProgress = (
    current,
    target
  ) => {

    if (!target) return 0;

    return Math.min(
      ((current / target) * 100)
      .toFixed(0),
      100
    );
  };

  return (

    <MainLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">

          Daily Targets

        </h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">

            Set Daily Target

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

            {/* Target Steps */}
            <input
              type="number"
              name="step_target"
              placeholder="Step Target"
              value={formData.step_target}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            {/* Target Calories */}
            <input
              type="number"
              name="calorie_target"
              placeholder="Calorie Target"
              value={formData.calorie_target}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            {/* Target Sleep */}
            <input
              type="number"
              step="0.1"
              name="sleep_target"
              placeholder="Sleep Target"
              value={formData.sleep_target}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="water_target"
              placeholder="Water Target"
              value={formData.water_target}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              name="target_date"
              value={formData.target_date}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button
              className="bg-blue-600 text-white p-3 rounded-lg md:col-span-2 hover:bg-blue-700"
            >

              Save Daily Target

            </button>

          </form>

        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 gap-6">

          {targets.map((target) => {

            const stepProgress =
              calculateProgress(
                target.step_target,
                target.step_target
              );

            const calorieProgress =
              calculateProgress(
                target.calorie_target,
                target.calorie_target
              );

            const sleepProgress =
              calculateProgress(
                target.sleep_target,
                target.sleep_target
              );

            return (

              <div
                key={target.id}
                className="bg-white p-6 rounded-2xl shadow"
              >

                {/* Steps */}
                <div className="mb-6">

                  <div className="flex justify-between mb-2">

                    <span className="font-medium">

                      Steps

                    </span>

                    <span>

                      {stepProgress}%

                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{
                        width:
                        `${stepProgress}%`
                      }}
                    />

                  </div>

                </div>

                {/* Calories */}
                <div className="mb-6">

                  <div className="flex justify-between mb-2">

                    <span className="font-medium">

                      Calories

                    </span>

                    <span>

                      {calorieProgress}%

                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{
                        width:
                        `${calorieProgress}%`
                      }}
                    />

                  </div>

                </div>

                {/* Sleep */}
                <div className="mb-6">

                  <div className="flex justify-between mb-2">

                    <span className="font-medium">

                      Sleep

                    </span>

                    <span>

                      {sleepProgress}%

                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                      className="bg-purple-500 h-4 rounded-full"
                      style={{
                        width:
                        `${sleepProgress}%`
                      }}
                    />

                  </div>

                </div>

                {/* Delete */}
                <button
                  onClick={() =>
                    handleDelete(
                      target.id
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >

                  Delete

                </button>

              </div>
            )
          })}

        </div>

      </div>

    </MainLayout>
  )
}