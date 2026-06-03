import {
  useEffect,
  useState
} from "react";

import MainLayout
from "../layouts/MainLayout";

import {
  generateWeeklyReport
} from "../services/reportService";

import jsPDF
from "jspdf";

export default function ReportPage() {

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadReport();

  }, []);

  const loadReport = async () => {

    try {

      const data =
        await generateWeeklyReport();

      setReport(data.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const exportPDF = () => {

    const doc =
      new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Weekly Health Report",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text(
      `Average Sleep: ${report.average_sleep} h`,
      20,
      50
    );

    doc.text(
      `Average Calories Burned: ${report.average_calories_burned}`,
      20,
      65
    );

    doc.text(
      `Average Steps: ${report.average_steps}`,
      20,
      80
    );

    doc.text(
      `BMI Status: ${report.bmi_status}`,
      20,
      95
    );

    doc.text(
      "AI Health Insight:",
      20,
      120
    );

    doc.text(
      report.health_insight,
      20,
      135
    );

    doc.save(
      "weekly-health-report.pdf"
    );
  };

  if (loading) {

    return (

      <MainLayout>

        <div className="p-6">

          Loading...

        </div>

      </MainLayout>
    );
  }

  return (

    <MainLayout>

      <div className="p-6">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">

            Weekly Health Report

          </h1>

          <button
            onClick={exportPDF}
            className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600"
          >

            Export PDF

          </button>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Avg Sleep

            </h2>

            <p className="text-3xl font-bold mt-2">

              {report.average_sleep} h

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Avg Calories

            </h2>

            <p className="text-3xl font-bold mt-2">

              {
                report.average_calories_burned
              }

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              Avg Steps

            </h2>

            <p className="text-3xl font-bold mt-2">

              {report.average_steps}

            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">

              BMI Status

            </h2>

            <p className="text-3xl font-bold mt-2">

              {report.bmi_status}

            </p>

          </div>

        </div>

        {/* AI Insight */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-4">

            AI Health Insight

          </h2>

          <div className="bg-blue-100 text-blue-700 p-5 rounded-xl">

            {report.health_insight}

          </div>

        </div>

      </div>

    </MainLayout>
  )
}