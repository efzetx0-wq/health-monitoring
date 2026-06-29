import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MedicalLayout from "../layouts/MedicalLayout";
import { Users, User, Mail, Shield, ChevronRight } from "lucide-react";

export default function MedicalPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/medical/patients");
      setPatients(response.data);
    } catch (error) {
      console.log("Gagal memuat data pasien:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedicalLayout>
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER TITLE */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-white">
            <Users className="text-cyan-400" size={28} />
            Patients Directory
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Daftar keseluruhan pasien aktif yang terdaftar di dalam sistem konsultasi medis.
          </p>
        </div>

        {/* CONTAINER UTAMA (Dark Blue Theme) */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
          {loading ? (
            <div className="text-center py-12 text-gray-500 animate-pulse text-sm">
              Memuat data pasien...
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center gap-2">
              <Users size={40} className="text-gray-700" />
              <p className="text-sm sm:text-base font-semibold">No patients found</p>
              <p className="text-xs text-gray-500">Belum ada pasien yang terdaftar di panel Anda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="
                    bg-[#0f172a] 
                    border 
                    border-gray-800/60 
                    rounded-2xl 
                    p-4 
                    flex 
                    flex-col 
                    sm:flex-row 
                    sm:items-center 
                    sm:justify-between 
                    gap-4
                    hover:border-cyan-500/30 
                    transition-all 
                    duration-200
                  "
                >
                  {/* INFORMASI PASIEN */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="bg-[#111827] p-3 rounded-xl text-cyan-400 shrink-0 border border-gray-800">
                      <User size={20} />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h2 className="text-base font-bold text-white truncate">
                        {patient.name}
                      </h2>
                      
                      <div className="flex flex-col gap-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5 truncate">
                          <Mail size={13} className="text-gray-500 shrink-0" />
                          {patient.email}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-cyan-500">
                          <Shield size={13} className="shrink-0" />
                          Role: {patient.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION TOMBOL DETAIL */}
                  <div className="mt-2 sm:mt-0 shrink-0">
                    <button
                      onClick={() => navigate(`/medical-patient/${patient.id}`)}
                      className="
                        w-full 
                        sm:w-auto 
                        bg-linear-to-br 
                        from-cyan-500 
                        to-blue-600 
                        hover:from-cyan-600 
                        hover:to-blue-700 
                        text-white 
                        text-xs 
                        font-bold 
                        px-4 
                        py-2.5 
                        rounded-xl 
                        transition-all 
                        flex 
                        items-center 
                        justify-center 
                        gap-1 
                        shadow-md
                        cursor-pointer
                        active:scale-95
                      "
                    >
                      View Detail
                      <ChevronRight size={14} />
                    </button>
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