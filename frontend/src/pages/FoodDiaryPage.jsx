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

      <div className="p-6">

        <h1 className="
          text-3xl
          font-bold
          mb-6
          text-white
        ">

          Food Diary

        </h1>

        {/* SUMMARY */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-8
        ">

          <div className="
            bg-gray-900
            text-white
            p-6
            rounded-2xl
            shadow
          ">

            <h2 className="text-gray-400">

              Total Calories

            </h2>

            <p className="
              text-3xl
              font-bold
              mt-2
            ">

              {totalCalories} kcal

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

              Total Meals

            </h2>

            <p className="
              text-3xl
              font-bold
              mt-2
            ">

              {foods.length}

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

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">

            Add Food

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

            {/* FOOD */}
            <select
              name="food_id"
              value={formData.food_id}
              onChange={handleChange}
              className="
                bg-gray-800
                border
                border-gray-700
                p-3
                rounded-lg
                text-white
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

            {/* QUANTITY */}
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="
                bg-gray-800
                border
                border-gray-700
                p-3
                rounded-lg
                text-white
              "
            />

            {/* CALORIES */}
            <input
              type="number"
              name="total_calories"
              value={
                formData.total_calories
              }
              readOnly
              className="
                bg-gray-700
                border
                border-gray-600
                p-3
                rounded-lg
                text-white
              "
            />

            {/* DATE */}
            <input
              type="datetime-local"
              name="consumed_at"
              value={formData.consumed_at}
              onChange={handleChange}
              className="
                bg-gray-800
                border
                border-gray-700
                p-3
                rounded-lg
                text-white
              "
            />

            {/* NOTES */}
            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="
                bg-gray-800
                border
                border-gray-700
                p-3
                rounded-lg
                text-white
                md:col-span-2
              "
            />

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

              Save Food Diary

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

                  Food

                </th>

                <th className="p-4 text-left">

                  Quantity

                </th>

                <th className="p-4 text-left">

                  Calories

                </th>

                <th className="p-4 text-left">

                  Date

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

              {foods.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      p-6
                      text-center
                      text-gray-400
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
                    border-gray-700
                  "
                >

                  <td className="p-4">

                    {food.food?.food_name}

                  </td>

                  <td className="p-4">

                    {food.quantity}

                  </td>

                  <td className="p-4">

                    {food.total_calories} kcal

                  </td>

                  <td className="p-4">

                    {food.consumed_at}

                  </td>

                  <td className="p-4">

                    {food.notes}

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