import { useEffect, useState } from "react";
import api from "../api/axios";
import MedicalLayout from "../layouts/MedicalLayout";
import { Users, FileText, LayoutDashboard, User, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MedicalDashboardPage() {
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // PATIENTS
      const patientResponse = await api.get("/medical/patients");
      setPatients(patientResponse.data);

      // REPORTS
      const reportResponse = await api.get("/health-reports");
      setReports(reportResponse.data);
    } catch (error) {
      console.log("Gagal memuat data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedicalLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-white">
            <LayoutDashboard className="text-cyan-400" size={28} />
            Medical Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Selamat datang kembali di panel kendali sistem layanan kesehatan.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse text-sm">
            Sinkronisasi metrik data dashboard...
          </div>
        ) : (
          <>
            {/* STATS COUNTER GRIDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              
              {/* TOTAL PATIENT CARD */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl flex items-center justify-between group hover:border-cyan-500/30 transition-all duration-300">
                <div className="space-y-2">
                  <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Total Active Patients
                  </h2>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white">
                    {patients.length}
                  </p>
                </div>
                <div className="bg-cyan-500/10 p-4 rounded-2xl text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
                  <Users size={24} />
                </div>
              </div>

              {/* TOTAL REPORTS CARD */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300">
                <div className="space-y-2">
                  <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Health Reports Collected
                  </h2>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white">
                    {reports.length}
                  </p>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                  <FileText size={24} />
                </div>
              </div>

            </div>

            {/* RECENT PATIENTS PANEL */}
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-cyan-400" />
                  Recent Patients Registration
                </h2>
                <Link 
                  to="/medical-patients" 
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
                >
                  See All <ArrowUpRight size={14} />
                </Link>
              </div>

              {patients.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs sm:text-sm">
                  No patients found inside database.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Kita ambil maksimal 3 atau 4 pasien terbaru saja untuk estetika dashboard */}
                  {patients.slice(0, 4).map((patient) => (
                    <div
                      key={patient.id}
                      className="bg-[#0f172a] border border-gray-800/60 rounded-xl p-3.5 flex items-center justify-between gap-4 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-[#111827] p-2.5 rounded-xl text-gray-400 border border-gray-800 shrink-0">
                          <User size={16} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-100 truncate">
                            {patient.name}
                          </h3>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                      
                      <Link
                        to={`/medical-patient/${patient.id}`}
                        className="text-[11px] font-bold text-gray-400 hover:text-white bg-[#111827] hover:bg-gray-800 border border-gray-800 px-3 py-1.5 rounded-lg transition-all shrink-0"
                      >
                        Profile
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </MedicalLayout>
  );
}