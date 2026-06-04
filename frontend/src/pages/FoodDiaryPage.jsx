import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  getFoodDiaries,
  createFoodDiary,
  deleteFoodDiary
} from "../services/foodDiaryService";

export default function FoodDiaryPage() {

  const [foods, setFoods] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({

      food_id: "",

      quantity: "",

      total_calories: "",

      consumed_at: "",

      notes: ""
    });

  // DATABASE MAKANAN
  const foodDatabase = [

    {
      id: 1,
      food_name: "Nasi Goreng",
      calories: 267
    },

    {
      id: 2,
      food_name: "Mie Goreng",
      calories: 350
    },

    {
      id: 3,
      food_name: "Sate Ayam",
      calories: 216
    },

    {
      id: 4,
      food_name: "Bakso",
      calories: 180
    },

    {
      id: 5,
      food_name: "Rendang",
      calories: 468
    },

    {
      id: 6,
      food_name: "Gado-Gado",
      calories: 295
    },

    {
      id: 7,
      food_name: "Soto Ayam",
      calories: 150
    },

    {
      id: 8,
      food_name: "Ayam Goreng",
      calories: 260
    }
  ];

  useEffect(() => {

    loadFoods();

  }, []);

  // LOAD DATA
  const loadFoods = async () => {

    try {

      const data =
        await getFoodDiaries();

      setFoods(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.log(error);
    }
  };

  // HANDLE INPUT
  const handleChange = (e) => {

    const { name, value } =
      e.target;

    const updatedData = {
      ...formData,
      [name]: value
    };

    // AUTO CALORIES
    if (name === "food_id") {

      const selectedFood =
        foodDatabase.find(
          (food) =>
            food.id == value
        );

      if (selectedFood) {

        updatedData.total_calories =
          selectedFood.calories;
      }
    }

    setFormData(updatedData);
  };

  // SAVE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createFoodDiary(
        formData
      );

      setMessage(
        "Food diary berhasil disimpan"
      );

      // RESET FORM
      setFormData({

        food_id: "",

        quantity: "",

        total_calories: "",

        consumed_at: "",

        notes: ""
      });

      // REFRESH DATA
      setTimeout(() => {

        loadFoods();

      }, 300);

    } catch (error) {

      console.log(error);

      alert(
        "Gagal menyimpan food diary"
      );
    }
  };

  // DELETE
  const handleDelete = async (id) => {

    try {

      await deleteFoodDiary(id);

      loadFoods();

    } catch (error) {

      console.log(error);
    }
  };

  // TOTAL CALORIES
  const totalCalories =
    foods.reduce(
      (total, item) =>
        total +
        Number(
          item.total_calories || 0
        ),
      0
    );

  return (

    <MainLayout>

      {/* MODIFIKASI: Mengubah padding agar ramah mobile dan memberi jarak pb-24 di bawah */}
      <div className="p-4 sm:p-6 pb-24 md:pb-6">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Food Diary
        </h1>

        {/* SUMMARY */}
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
              Total Calories
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {totalCalories} <span className="text-sm font-normal text-gray-400">kcal</span>
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
              Total Meals
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {foods.length}
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
            Add Food
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

            {/* FOOD */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Pilih Makanan</label>
              <select
                name="food_id"
                value={formData.food_id}
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
              >

                <option value="">
                  Select Food
                </option>

                {foodDatabase.map((food) => (

                  <option
                    key={food.id}
                    value={food.id}
                  >
                    {food.food_name}
                  </option>

                ))}

              </select>
            </div>

            {/* QUANTITY */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Jumlah (Porsi)</label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
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

            {/* CALORIES */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Total Kalori (Otomatis)</label>
              <input
                type="text"
                name="total_calories"
                value={formData.total_calories ? `${formData.total_calories} kcal` : ""}
                placeholder="Auto calculated"
                readOnly
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

            {/* DATE */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Waktu Konsumsi</label>
              <input
                type="datetime-local"
                name="consumed_at"
                value={formData.consumed_at}
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

            {/* NOTES */}
            <div className="sm:col-span-2 flex flex-col">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Catatan Tambahan</label>
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
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
              Save Food Diary
            </button>

          </form>

        </div>

        {/* HISTORY CONTAINER */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">History</h2>

        {/* =============================================================== */}
        {/* 1. SEGMEN MOBILE LIST CARD (Hanya Muncul di Layar HP)           */}
        {/* =============================================================== */}
        <div className="block sm:hidden space-y-4">
          {foods.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-6 rounded-2xl shadow border border-gray-100">
              No food diary found
            </p>
          ) : (
            foods.map((food) => (
              <div key={food.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">
                      {food.food?.food_name || "Makanan Eksternal"}
                    </h3>
                    <span className="text-xs text-gray-400">{food.consumed_at}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Porsi / Jumlah</p>
                    <p className="text-sm font-semibold text-gray-700">{food.quantity} Porsi</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Asupan Energi</p>
                    <p className="text-sm font-bold text-blue-600">{food.total_calories} kcal</p>
                  </div>
                </div>

                {food.notes && (
                  <div className="text-xs text-gray-500 border-t border-gray-50 pt-2 mt-1">
                    <span className="font-semibold text-gray-700">Notes:</span> {food.notes}
                  </div>
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
                  Food
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Calories
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Date
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

              {foods.length === 0 && (

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
                    No food diary found
                  </td>

                </tr>
              )}

              {foods.map((food) => (

                <tr
                  key={food.id}
                  className="
                    border-t
                    border-gray-100
                    hover:bg-gray-50/50
                    transition-colors
                  "
                >

                  <td className="p-4 text-sm font-medium text-gray-800">
                    {food.food?.food_name}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {food.quantity}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {food.total_calories} kcal
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {food.consumed_at}
                  </td>

                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                    {food.notes || "-"}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          food.id
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