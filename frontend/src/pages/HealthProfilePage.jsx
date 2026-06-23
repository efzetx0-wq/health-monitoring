import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  getHealthProfile,
  saveHealthProfile
} from "../services/healthProfileService";

export default function HealthProfilePage() {

  const [formData, setFormData] =
    useState({

      age: "",

      gender: "",

      height: "",

      weight: "",

      bmi: ""
    });

  const [message, setMessage] =
    useState("");

  // LOAD PROFILE
  useEffect(() => {

    loadProfile();

  }, []);

  // GET PROFILE FROM DATABASE
  const loadProfile = async () => {

    try {

      const data =
        await getHealthProfile();

      console.log(data);

      if (data) {

        setFormData({

          age:
            data.age || "",

          gender:
            data.gender || "",

          height:
            data.height || "",

          weight:
            data.weight || "",

          bmi:
            data.bmi || ""
        });
      }

    } catch (error) {

      console.log(error);
    }
  };

  // AUTO BMI
  const calculateBMI = (
    height,
    weight
  ) => {

    if (!height || !weight)
      return "";

    const heightMeter =
      height / 100;

    const bmi =
      weight /
      (heightMeter * heightMeter);

    return bmi.toFixed(2);
  };

  // HANDLE INPUT
  const handleChange = (e) => {

    const { name, value } =
      e.target;

    const updatedData = {

      ...formData,

      [name]: value
    };

    // AUTO BMI
    if (
      name === "height" ||
      name === "weight"
    ) {

      updatedData.bmi =
        calculateBMI(

          name === "height"
            ? value
            : updatedData.height,

          name === "weight"
            ? value
            : updatedData.weight
        );
    }

    setFormData(updatedData);
  };

  // SAVE PROFILE
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await saveHealthProfile(
        formData
      );

      window.dispatchEvent(
      new Event("dashboard-update")
    );

      setMessage(
        "Profile berhasil disimpan"
      );

      // RELOAD DATA
      loadProfile();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <MainLayout>

      <div className="
        p-6
        max-w-4xl
        mx-auto
      ">

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">

          {/* TITLE */}
          <h1 className="
            text-3xl
            font-bold
            mb-2
          ">

            Health Profile

          </h1>

          <p className="
            text-gray-500
            mb-6
          ">

            Manage your health information

          </p>

          {/* SUCCESS MESSAGE */}
          {message && (

            <div className="
              bg-green-100
              text-green-700
              p-3
              rounded-lg
              mb-4
            ">

              {message}

            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            "
          >

            {/* AGE */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">

                Age

              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-xl
                "
              />

            </div>

            {/* GENDER */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">

                Gender

              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-xl
                "
              >

                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

              </select>

            </div>

            {/* HEIGHT */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">

                Height (cm)

              </label>

              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-xl
                "
              />

            </div>

            {/* WEIGHT */}
            <div>

              <label className="
                block
                mb-2
                font-medium
              ">

                Weight (kg)

              </label>

              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-xl
                "
              />

            </div>

            {/* BMI */}
            <div className="
              md:col-span-2
            ">

              <label className="
                block
                mb-2
                font-medium
              ">

                BMI

              </label>

              <input
                type="text"
                value={formData.bmi}
                readOnly
                className="
                  w-full
                  border
                  p-3
                  rounded-xl
                  bg-gray-100
                "
              />

            </div>

            {/* BUTTON */}
            <div className="
              md:col-span-2
            ">

              <button
                className="
                  w-full
                  bg-blue-600
                  text-white
                  p-3
                  rounded-xl
                  font-medium
                  hover:bg-blue-700
                  transition
                "
              >

                Save Profile

              </button>

            </div>

          </form>

          {/* SAVED PROFILE */}
          <div className="
            mt-10
            border-t
            pt-6
          ">

            <h2 className="
              text-2xl
              font-bold
              mb-4
            ">

              Saved Profile

            </h2>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            ">

              {/* AGE */}
              <div className="
                bg-gray-50
                p-4
                rounded-xl
              ">

                <p className="
                  text-gray-500
                ">

                  Age

                </p>

                <p className="
                  font-bold
                  text-lg
                ">

                  {formData.age || "-"}

                </p>

              </div>

              {/* GENDER */}
              <div className="
                bg-gray-50
                p-4
                rounded-xl
              ">

                <p className="
                  text-gray-500
                ">

                  Gender

                </p>

                <p className="
                  font-bold
                  text-lg
                ">

                  {formData.gender || "-"}

                </p>

              </div>

              {/* HEIGHT */}
              <div className="
                bg-gray-50
                p-4
                rounded-xl
              ">

                <p className="
                  text-gray-500
                ">

                  Height

                </p>

                <p className="
                  font-bold
                  text-lg
                ">

                  {formData.height || "-"} cm

                </p>

              </div>

              {/* WEIGHT */}
              <div className="
                bg-gray-50
                p-4
                rounded-xl
              ">

                <p className="
                  text-gray-500
                ">

                  Weight

                </p>

                <p className="
                  font-bold
                  text-lg
                ">

                  {formData.weight || "-"} kg

                </p>

              </div>

              {/* BMI */}
              <div className="
                bg-gray-50
                p-4
                rounded-xl
                md:col-span-2
              ">

                <p className="
                  text-gray-500
                ">

                  BMI

                </p>

                <p className="
                  font-bold
                  text-lg
                ">

                  {formData.bmi || "-"}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  )
}