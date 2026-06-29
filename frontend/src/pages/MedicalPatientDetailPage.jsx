import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import MedicalLayout from "../layouts/MedicalLayout";
import { 
  User, 
  Activity, 
  Flame, 
  Moon, 
  Footprints, 
  Scale, 
  Ruler, 
  Heart, 
  ArrowLeft,
  FileText
} from "lucide-react";

export default function MedicalPatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/medical/patient/${id}`);
      setPatient(response.data);
    } catch (error) {
      console.log("Gagal memuat detail pasien:", error);
    } finally {
      setLoading(false);
    }
  };

  // TAMPILAN LOADING (DARK THEME)
  if (loading) {
    return (
      <MedicalLayout>
        <div className="flex items-center justify-center min-h-[50vh] text-gray-400 animate-pulse text-sm">
          Memuat data profil detail pasien...
        </div>
      </MedicalLayout>
    );
  }

  // TAMPILAN JIKA DATA TIDAK DITEMUKAN (DARK THEME)
  if (!patient) {
    return (
      <MedicalLayout>
        <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center gap-3">
          <User size={48} className="text-gray-700" />
          <p className="text-base font-semibold">Patient not found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="text-xs text-cyan-400 underline hover:text-cyan-300"
          >
            Kembali ke halaman sebelumnya
          </button>
        </div>
      </MedicalLayout>
    );
  }

  return (
    <MedicalLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        
        {/* HEADER DAN TOMBOL KEMBALI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2.5 bg-[#111827] hover:bg-gray-800 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Patient Clinical Detail</h1>
              <p className="text-xs text-gray-400 mt-0.5">Rekam medis dan log aktivitas fisik terpusat.</p>
            </div>
          </div>
        </div>

        {/* 1. DATA INFORMASI DASAR (BASIC INFO) */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="bg-cyan-500/10 p-4 rounded-2xl text-cyan-400 border border-cyan-500/20 shrink-0">
            <User size={32} />
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-xl font-bold text-white truncate">{patient.name}</h2>
            <p className="text-sm text-gray-400 truncate">Email: {patient.email}</p>
            <span className="inline-block bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-500/20">
              Role: {patient.role}
            </span>
          </div>
        </div>

        {/* 2. DATA PROFIL KESEHATAN (HEALTH PROFILE) */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2.5">
            <Heart size={18} className="text-red-400" />
            Health Profile
          </h2>

          {patient.health_profile ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0f172a] p-3.5 rounded-xl border border-gray-800 flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
                <span className="text-xs text-gray-400 flex items-center gap-1.5"><Ruler size={14} className="text-cyan-400" /> Height</span>
                <span className="font-bold text-white text-sm sm:text-base">{patient.health_profile.height} cm</span>
              </div>
              <div className="bg-[#0f172a] p-3.5 rounded-xl border border-gray-800 flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
                <span className="text-xs text-gray-400 flex items-center gap-1.5"><Scale size={14} className="text-emerald-400" /> Weight</span>
                <span className="font-bold text-white text-sm sm:text-base">{patient.health_profile.weight} kg</span>
              </div>
              <div className="bg-[#0f172a] p-3.5 rounded-xl border border-gray-800 flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
                <span className="text-xs text-gray-400 flex items-center gap-1.5"><Activity size={14} className="text-amber-400" /> BMI Score</span>
                <span className="font-bold text-white text-sm sm:text-base bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">{patient.health_profile.bmi}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 bg-[#0f172a] p-4 rounded-xl border border-gray-800 text-center">Pasien belum melengkapi data profil kesehatan.</p>
          )}
        </div>

        {/* 3. MONITORING AKTIVITAS FISIK (PHYSICAL ACTIVITIES) */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2.5">
            <Footprints size={18} className="text-emerald-400" />
            Physical Activities Logs
          </h2>

          {!patient.physical_activities || patient.physical_activities.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 bg-[#0f172a] p-4 rounded-xl border border-gray-800 text-center">Belum ada catatan aktivitas fisik terdeteksi.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patient.physical_activities.map((activity) => (
                <div key={activity.id} className="bg-[#0f172a] border border-gray-800/80 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5">
                    <span className="text-[10px] font-mono text-gray-500">LOG ID #{activity.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><Footprints size={13} className="text-cyan-400" /> Total Steps:</span>
                    <span className="font-bold text-white">{activity.steps}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5"><Flame size={13} className="text-orange-400" /> Calories Burned:</span>
                    <span className="font-bold text-white">{activity.calories_burned} kCal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. HISTORI LAPORAN KESEHATAN (HEALTH REPORTS) */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2.5">
            <FileText size={18} className="text-cyan-400" />
            Generated Health Reports
          </h2>

          {!patient.health_reports || patient.health_reports.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 bg-[#0f172a] p-4 rounded-xl border border-gray-800 text-center">Belum ada dokumen laporan kesehatan ringkas yang diekstrak.</p>
          ) : (
            <div className="space-y-3">
              {patient.health_reports.map((report) => (
                <div key={report.id} className="bg-[#0f172a] border border-gray-800/80 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 items-center">
                  <div className="border-b sm:border-b-0 sm:border-r border-gray-800 pb-2 sm:pb-0">
                    <span className="text-xs font-bold text-white block">Report #{report.id}</span>
                    <span className="text-[10px] text-gray-500">Medical Summary</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-400 sm:col-span-2">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Moon size={12} className="text-indigo-400" /> Sleep Duration:</span>
                      <span className="font-semibold text-white">{report.average_sleep} Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Footprints size={12} className="text-emerald-400" /> Steps Avg:</span>
                      <span className="font-semibold text-white">{report.average_steps}</span>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span>BMI Classification:</span>
                      <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">{report.bmi_status}</span>
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