import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { generateWeeklyReport } from "../services/reportService";
import jsPDF from "jspdf";


import { FaRegFilePdf, FaRobot, FaMoon, FaSun } from "react-icons/fa";

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await generateWeeklyReport();
      setReport(data.data);
    } catch (error) {
      console.log("Error loading weekly report:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // Judul Dokumen PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Weekly Health Report", 14, 25);

    // Garis Batas Atas
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 32, 196, 32);

    // Isi Data Statistik
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Rata-rata Tidur        : ${report.average_sleep} jam`, 14, 45);
    doc.text(`Rata-rata Kalori       : ${report.average_calories_burned} kcal`, 14, 55);
    doc.text(`Rata-rata Langkah      : ${Number(report.average_steps).toLocaleString('id-ID')} steps`, 14, 65);
    doc.text(`Status Jaringan BMI    : ${report.bmi_status}`, 14, 75);

    // Garis Batas Tengah
    doc.line(14, 85, 196, 85);

    // Judul Analisis AI
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AI Health Insight Analysis:", 14, 95);

    // SOLUSI BUG BUNGKUS TEKS PARAGRAF DI PDF
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // splitTextToSize otomatis memotong teks panjang agar pas dengan lebar kertas A4 (lebar 170)
    const splitInsight = doc.splitTextToSize(report.health_insight, 170);
    doc.text(splitInsight, 14, 105);

    doc.save("weekly-health-report.pdf");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-500 animate-pulse font-medium">
            Generating Weekly Report Data...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Weekly Health Report
          </h1>
          <button
            onClick={exportPDF}
            className="w-full sm:w-auto bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 font-medium transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <FaRegFilePdf />
            Export PDF
          </button>
        </div>

        {/* 1. STATS CARDS GRID (SANGAT RESPONSIF DI HP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg Sleep</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {report.average_sleep} <span className="text-xs font-normal text-gray-400">hours</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg Calories</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {Number(report.average_calories_burned).toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">kcal</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg Steps</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {Number(report.average_steps).toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">steps</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium">BMI Status</h2>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {report.bmi_status}
            </p>
          </div>

        </div>

        {/* 2. AI HEALTH INSIGHT COMPONENT */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-blue-500"><FaRobot /></span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              AI Weekly Health Insight
            </h2>
          </div>
          <div className="bg-blue-50/70 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 p-4 sm:p-5 rounded-xl text-sm sm:text-base leading-relaxed border border-blue-100/50 dark:border-blue-900/20">
            ✨ {report.health_insight}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}