import { useEffect, useState } from "react";
import api from "../api/axios";
import MedicalLayout from "../layouts/MedicalLayout";
import { FileText, Trash2, Activity, Moon, Footprints } from "lucide-react";

export default function MedicalReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/health-reports");
      setReports(response.data);
    } catch (error) {
      console.log("Gagal memuat laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI HAPUS LAPORAN
  const handleDeleteReport = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus laporan kesehatan ini?");
    if (!confirmDelete) return;

    try {
      // Sesuaikan endpoint delete ini dengan routing di Laravel Backend Anda
      await api.delete(`/health-reports/${id}`);
      
      // Filter state lokal agar data yang dihapus langsung hilang dari UI tanpa reload
      setReports(reports.filter((report) => report.id !== id));
      alert("Laporan berhasil dihapus.");
    } catch (error) {
      console.log("Gagal menghapus laporan:", error);
      alert("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  return (
    <MedicalLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER JUDUL */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-white">
            <FileText className="text-cyan-400" size={28} />
            Health Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manajemen dan pemantauan rangkuman data kesehatan berkala pasien.
          </p>
        </div>

        {/* CONTAINER UTAMA (Dark Mode Style) */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
          {loading ? (
            <div className="text-center py-12 text-gray-500 animate-pulse text-sm">
              Memuat daftar laporan kesehatan...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center gap-2">
              <FileText size={40} className="text-gray-600" />
              <p className="text-sm sm:text-base font-semibold">No reports found</p>
              <p className="text-xs text-gray-500">Belum ada riwayat laporan kesehatan yang masuk.</p>
            </div>
          ) : (
            // Menggunakan Grid: 1 kolom di HP, 2 kolom di Tablet, 3 kolom di Desktop
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-[#0f172a] border border-gray-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 shadow-md group relative"
                >
                  <div>
                    {/* BAGIAN ATAS KARTU LAPORAN */}
                    <div className="flex justify-between items-start border-b border-gray-800 pb-3 mb-4">
                      <div>
                        <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                          Report #{report.id}
                        </h2>
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          {report.created_at ? new Date(report.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "Berkala"}
                        </span>
                      </div>
                      
                      {/* TOMBOL HAPUS (TRASH BUTTON) */}
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title="Hapus Laporan"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* DETAIL DATA INDIKATOR KESEHATAN */}
                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between bg-[#111827]/60 p-2.5 rounded-xl border border-gray-800/50">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Moon size={14} className="text-indigo-400" /> Rata-rata Tidur
                        </span>
                        <span className="font-semibold text-white">{report.average_sleep} Jam</span>
                      </div>

                      <div className="flex items-center justify-between bg-[#111827]/60 p-2.5 rounded-xl border border-gray-800/50">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Footprints size={14} className="text-emerald-400" /> Rata-rata Langkah
                        </span>
                        <span className="font-semibold text-white">{report.average_steps} Langkah</span>
                      </div>

                      <div className="flex items-center justify-between bg-[#111827]/60 p-2.5 rounded-xl border border-gray-800/50">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Activity size={14} className="text-amber-400" /> Status BMI
                        </span>
                        <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                          report.bmi_status?.toLowerCase() === "normal" 
                            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {report.bmi_status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MedicalLayout>
  );
}