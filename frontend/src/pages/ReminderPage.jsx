import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";


import {
  getReminders,
  createReminder,
  deleteReminder,
  updateReminder
} from "../services/reminderService";

export default function ReminderPage() {

  const [reminders, setReminders] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({

      reminder_type: "",

      message: "",

      reminder_time: ""
    });

  useEffect(() => {

    loadReminders();

  }, []);

  const loadReminders = async () => {

    try {

      const data =
        await getReminders();

      setReminders(data);

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

    const response =
      await createReminder(
        formData
      );

    console.log(response);

    setMessage(
      "Reminder berhasil dibuat"
    );

    setFormData({

      reminder_type: "",

      message: "",

      reminder_time: ""
    });

    await loadReminders();

  } catch (error) {

    console.log(
      error.response?.data
    );

    alert(
      JSON.stringify(
        error.response?.data
      )
    );
  }
};

const handleDelete = async (id) => {

  try {

    await deleteReminder(id);

    await loadReminders();

    setMessage(
      "Reminder berhasil dihapus"
    );

  } catch (error) {

    console.log(
      error.response?.data
    );
  }
};

  // TOGGLE ON/OFF REMINDER
  const toggleReminder =
    async (
      id,
      currentStatus
    ) => {

      try {

        await updateReminder(
          id,
          {
            is_active:
              !currentStatus
          }
        );

        loadReminders();

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <MainLayout>

      {/* REMINDER CHECKER */}

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">

          Reminder System

        </h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Total Reminder

            </h2>

            <p className="text-3xl font-bold mt-2">

              {reminders.length}

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Active Reminder

            </h2>

            <p className="text-3xl font-bold mt-2">

              {
                reminders.filter(
                  (item) =>
                  item.is_active
                ).length
              }

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Inactive Reminder

            </h2>

            <p className="text-3xl font-bold mt-2">

              {
                reminders.filter(
                  (item) =>
                  !item.is_active
                ).length
              }

            </p>

          </div>

        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">

            Create Reminder

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

            {/* TYPE */}
                      <select
            name="reminder_type"
            value={formData.reminder_type}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >

            <option value="">
              Select Type
            </option>

            <option value="drink_water">
              Drink Water
            </option>

            <option value="exercise">
              Exercise
            </option>

            <option value="sleep">
              Sleep
            </option>

            <option value="eat">
              Eat
            </option>

          </select>
            {/* TIME */}
            <input
              type="time"
              name="reminder_time"
              value={
                formData.reminder_time
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            {/* MESSAGE */}
            <textarea
              name="message"
              placeholder="Reminder Message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className="border p-3 rounded-lg md:col-span-2"
            />

            <button
              className="bg-blue-600 text-white p-3 rounded-lg md:col-span-2 hover:bg-blue-700"
            >

              Save Reminder

            </button>

          </form>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">

                  Type

                </th>

                <th className="p-4 text-left">

                  Message

                </th>

                <th className="p-4 text-left">

                  Time

                </th>

                <th className="p-4 text-left">

                  Status

                </th>

                <th className="p-4 text-left">

                  Action

                </th>

              </tr>

            </thead>

            <tbody>

              {reminders.map((reminder) => (

                <tr
                  key={reminder.id}
                  className="border-t"
                >

                  <td className="p-4">

                {reminder.reminder_type ===
                "drink_water"
                  ? "Drink Water"
                  : reminder.reminder_type ===
                    "exercise"
                  ? "Exercise"
                  : reminder.reminder_type ===
                    "sleep"
                  ? "Sleep"
                  : reminder.reminder_type ===
                    "eat"
                  ? "Eat"
                  : reminder.reminder_type}

              </td>

                  <td className="p-4">

                    {reminder.message}

                  </td>

                  <td className="p-4">

                    {reminder.reminder_time}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        toggleReminder(
                          reminder.id,
                          reminder.is_active
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-white ${
                        reminder.is_active
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >

                      {reminder.is_active
                        ? "ON"
                        : "OFF"}

                    </button>

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          reminder.id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
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