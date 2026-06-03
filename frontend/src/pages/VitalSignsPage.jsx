import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  getVitalSigns,
  createVitalSign,
  deleteVitalSign
} from "../services/vitalSignService";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function VitalSignsPage() {

  const [vitalSigns, setVitalSigns] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({

      systolic_pressure: "",

      diastolic_pressure: "",

      blood_sugar: "",

      heart_rate: "",

      body_temperature: "",

      weight: "",

      recorded_at: "",

      notes: ""
    });

  useEffect(() => {

    loadVitalSigns();

  }, []);

  const loadVitalSigns = async () => {

    try {

      const data =
        await getVitalSigns();

      setVitalSigns(data);

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

      await createVitalSign(
        formData
      );

      setMessage(
        "Vital sign berhasil disimpan"
      );

      setFormData({

        systolic_pressure: "",

        diastolic_pressure: "",

        blood_sugar: "",

        heart_rate: "",

        body_temperature: "",

        weight: "",

        recorded_at: "",

        notes: ""
      });

      loadVitalSigns();

    } catch (error) {

      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    try {

      await deleteVitalSign(id);

      loadVitalSigns();

    } catch (error) {

      console.log(error);
    }
  };

  const averageHeartRate =
    vitalSigns.length > 0
      ? (
          vitalSigns.reduce(
            (total, item) =>
            total +
            Number(
              item.heart_rate || 0
            ),
            0
          ) / vitalSigns.length
        ).toFixed(0)
      : 0;

  return (

    <MainLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">

          Vital Signs

        </h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Total Records

            </h2>

            <p className="text-3xl font-bold mt-2">

              {vitalSigns.length}

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Average Heart Rate

            </h2>

            <p className="text-3xl font-bold mt-2">

              {averageHeartRate} bpm

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Latest Weight

            </h2>

            <p className="text-3xl font-bold mt-2">

              {
                vitalSigns[0]?.weight || 0
              } kg

            </p>

          </div>

        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">

            Add Vital Sign

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

            <input
              type="number"
              name="systolic_pressure"
              placeholder="Systolic Pressure"
              value={
                formData.systolic_pressure
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="diastolic_pressure"
              placeholder="Diastolic Pressure"
              value={
                formData.diastolic_pressure
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="blood_sugar"
              placeholder="Blood Sugar"
              value={
                formData.blood_sugar
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="heart_rate"
              placeholder="Heart Rate"
              value={
                formData.heart_rate
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              step="0.1"
              name="body_temperature"
              placeholder="Body Temperature"
              value={
                formData.body_temperature
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              step="0.1"
              name="weight"
              placeholder="Weight"
              value={
                formData.weight
              }
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="datetime-local"
              name="recorded_at"
              value={
                formData.recorded_at
              }
              onChange={handleChange}
              className="border p-3 rounded-lg md:col-span-2"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="border p-3 rounded-lg md:col-span-2"
            />

            <button
              className="bg-blue-600 text-white p-3 rounded-lg md:col-span-2 hover:bg-blue-700"
            >

              Save Vital Sign

            </button>

          </form>

        </div>

        {/* Blood Pressure Chart */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">

            Blood Pressure Trend

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={vitalSigns}>

              <XAxis
                dataKey="recorded_at"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="systolic_pressure"
              />

              <Line
                type="monotone"
                dataKey="diastolic_pressure"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Blood Pressure
                </th>

                <th className="p-4 text-left">
                  Sugar
                </th>

                <th className="p-4 text-left">
                  Heart Rate
                </th>

                <th className="p-4 text-left">
                  Temperature
                </th>

                <th className="p-4 text-left">
                  Weight
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {vitalSigns.map((item) => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-4">

                    {item.systolic_pressure}
                    /
                    {item.diastolic_pressure}

                  </td>

                  <td className="p-4">

                    {item.blood_sugar}

                  </td>

                  <td className="p-4">

                    {item.heart_rate}

                  </td>

                  <td className="p-4">

                    {item.body_temperature}°C

                  </td>

                  <td className="p-4">

                    {item.weight} kg

                  </td>

                  <td className="p-4">

                    {item.recorded_at}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
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