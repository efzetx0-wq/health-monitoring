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

      {/* MODIFIKASI: Padding disesuaikan p-4 di HP dan pb-24 agar tidak tertutup bottom navigation bar */}
      <div className="p-4 sm:p-6 pb-24 md:pb-6">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Vital Signs
        </h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">

            <h2 className="text-gray-500 text-sm sm:text-base font-medium">
              Total Records
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {vitalSigns.length}
            </p>

          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">

            <h2 className="text-gray-500 text-sm sm:text-base font-medium">
              Average Heart Rate
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {averageHeartRate} <span className="text-sm font-normal text-gray-400">bpm</span>
            </p>

          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow border border-gray-50">

            <h2 className="text-gray-500 text-sm sm:text-base font-medium">
              Latest Weight
            </h2>

            <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900">
              {vitalSigns[0]?.weight || 0} <span className="text-sm font-normal text-gray-400">kg</span>
            </p>

          </div>

        </div>

        {/* Form */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow mb-8 border border-gray-50">

          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            Add Vital Sign
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

            <input
              type="number"
              name="systolic_pressure"
              placeholder=""Tekanan Sistolik (contoh: 120)""
              value={formData.systolic_pressure}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              name="diastolic_pressure"
              placeholder="Diastolic Pressure (e.g. 80)"
              value={formData.diastolic_pressure}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              name="blood_sugar"
              placeholder="Blood Sugar (mg/dL)"
              value={formData.blood_sugar}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              name="heart_rate"
              placeholder="Heart Rate (bpm)"
              value={formData.heart_rate}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              step="0.1"
              name="body_temperature"
              placeholder="Body Temperature (°C)"
              value={formData.body_temperature}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              step="0.1"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            />

            <div className="flex flex-col sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400 mb-1 px-1">Recorded At Date & Time</label>
              <input
                type="datetime-local"
                name="recorded_at"
                value={formData.recorded_at}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            <textarea
              name="notes"
              placeholder="Notes / Keterangan Tambahan"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 sm:col-span-2"
            />

            <button
              className="bg-blue-600 text-white p-3 rounded-xl sm:col-span-2 hover:bg-blue-700 transition font-semibold text-sm sm:text-base shadow-md shadow-blue-100"
            >
              Save Vital Sign
            </button>

          </form>

        </div>

        {/* History Container */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 px-1">History</h2>

        {/* =============================================================== */}
        {/* 1. SEGMEN MOBILE LIST CARD (Hanya Muncul di Layar HP)           */}
        {/* =============================================================== */}
        <div className="block sm:hidden space-y-4">
          {vitalSigns.length === 0 ? (
            <p className="text-gray-400 text-center text-sm bg-white py-6 rounded-2xl shadow border border-gray-100">
              Belum ada data vital signs.
            </p>
          ) : (
            vitalSigns.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium block">RECORDED DATE</span>
                    <span className="text-xs font-semibold text-gray-700">{item.recorded_at}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded-xl text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 py-1">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Tensi Darah</p>
                    <p className="text-sm font-bold text-gray-800">{item.systolic_pressure}/{item.diastolic_pressure} <span className="text-[10px] font-normal text-gray-400">mmHg</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Gula Darah</p>
                    <p className="text-sm font-bold text-gray-800">{item.blood_sugar || "-"} <span className="text-[10px] font-normal text-gray-400">mg/dL</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Heart Rate</p>
                    <p className="text-sm font-bold text-gray-800">{item.heart_rate || "-"} <span className="text-[10px] font-normal text-gray-400">bpm</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Suhu & Berat</p>
                    <p className="text-sm font-bold text-gray-800">{item.body_temperature}°C / {item.weight}kg</p>
                  </div>
                </div>

                {item.notes && (
                  <div className="text-xs text-gray-500 border-t border-gray-50 pt-2 mt-1">
                    <span className="font-semibold text-gray-700">Keterangan:</span> {item.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* =============================================================== */}
        {/* 2. SEGMEN LAPTOP/DESKTOP TABLE (Hanya Muncul di Komputer)        */}
        {/* =============================================================== */}
        <div className="hidden sm:block bg-white rounded-2xl shadow overflow-hidden border border-gray-100">

          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-100">

              <tr>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Blood Pressure
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Sugar
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Heart Rate
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Temperature
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Weight
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

              {vitalSigns.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                >

                  <td className="p-4 text-sm font-medium text-gray-800">
                    {item.systolic_pressure}/{item.diastolic_pressure}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.blood_sugar} mg/dL
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.heart_rate} bpm
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.body_temperature}°C
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.weight} kg
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.recorded_at}
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
                      className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-600 transition"
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