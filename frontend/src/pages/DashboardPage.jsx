import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  getDailyProgress,
  getHealthProfile,
  getActivities,
  getSleepData
} from "../services/dashboardService";

import {
  getReminders
} from "../services/reminderService";

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

  const [progress, setProgress] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [activities, setActivities] =
    useState([]);

  const [sleepData, setSleepData] =
    useState([]);

  const [reminders, setReminders] =
    useState([]);

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    try {

      const progressData =
        await getDailyProgress();

      const profileData =
        await getHealthProfile();

      const activityData =
        await getActivities();

      const sleep =
        await getSleepData();

      const reminderData =
        await getReminders();

      setProgress(progressData);

      setProfile(profileData);

      setActivities(activityData);

      setSleepData(sleep);

      setReminders(reminderData);

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

  const healthInsights = [];

  if (totalSteps < 5000) {

    healthInsights.push({

      type: "warning",

      message:
        "Your physical activity is low. Try walking more today."
    });

  } else {

    healthInsights.push({

      type: "good",

      message:
        "Great job staying active today."
    });
  }

  if (averageSleep < 7) {

    healthInsights.push({

      type: "warning",

      message:
        "Your sleep duration is below recommended levels."
    });

  } else {

    healthInsights.push({

      type: "good",

      message:
        "Your sleep duration looks healthy."
    });
  }

  if (profile?.bmi > 25) {

    healthInsights.push({

      type: "warning",

      message:
        "Your BMI indicates overweight. Maintain healthy habits."
    });
  }

  if (
    profile?.bmi >= 18 &&
    profile?.bmi <= 25
  ) {

    healthInsights.push({

      type: "good",

      message:
        "Your BMI is in a healthy range."
    });
  }

  return (

    <MainLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">

          Health Dashboard

        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 dark:text-gray-300">

              Steps Today

            </h2>

            <p className="text-3xl font-bold mt-2">

              {progress?.steps_today || 0}

            </p>

          </div>

          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 dark:text-gray-300">

              Calories Burned

            </h2>

            <p className="text-3xl font-bold mt-2">

              {progress?.calories_today || 0}

            </p>

          </div>

          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 dark:text-gray-300">

              Sleep Duration

            </h2>

            <p className="text-3xl font-bold mt-2">

              {progress?.sleep_today || 0} h

            </p>

          </div>

          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500 dark:text-gray-300">

              BMI

            </h2>

            <p className="text-3xl font-bold mt-2">

              {profile?.bmi || 0}

            </p>

          </div>

        </div>

        {/* AI Health Insight */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-bold mb-6">

            AI Health Insights

          </h2>

          <div className="space-y-4">

            {healthInsights.map(
              (insight, index) => (

              <div
                key={index}
                className={`p-4 rounded-xl ${
                  insight.type === "warning"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >

                {insight.message}

              </div>

            ))}

          </div>

        </div>

        {/* Reminder Widget */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-bold mb-4">

            Active Reminders

          </h2>

          {reminders.filter(
            (item) => item.is_active
          ).length === 0 ? (

            <p className="text-gray-500 dark:text-gray-300">

              No active reminders

            </p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {reminders
                .filter(
                  (item) =>
                  item.is_active
                )
                .map((reminder) => (

                  <div
                    key={reminder.id}
                    className="border dark:border-gray-700 rounded-xl p-4"
                  >

                    <h3 className="font-bold text-lg">

                      {
                        reminder.reminder_type
                      }

                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mt-2">

                      {reminder.message}

                    </p>

                    <p className="text-blue-600 mt-3">

                      {
                        reminder.reminder_time
                      }

                    </p>

                  </div>

              ))}

            </div>

          )}

        </div>

        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-bold mb-4">

            Activity Trend

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={activities}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="activity_date" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="steps"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Calories Chart */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-bold mb-4">

            Calories Statistics

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={activities}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="activity_date" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar dataKey="calories_burned" />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Sleep Chart */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-bold mb-4">

            Sleep Trend

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <AreaChart data={sleepData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="created_at" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Area
                type="monotone"
                dataKey="sleep_duration"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </MainLayout>
  )
}