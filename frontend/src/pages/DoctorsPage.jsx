import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { UserRound, Mail, MessageSquare, HeartPulse } from "lucide-react";

export default function DoctorsPage() {
  const [medicalUsers, setMedicalUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicalUsers();
  }, []);

  const fetchMedicalUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      const filtered = response.data.filter((user) => user.role === "medical");
      setMedicalUsers(filtered);
    } catch (error) {
      console.log("Gagal memuat staf medis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultation = (doctorId) => {
    // Navigasikan user biasa ke halaman chat dokter bersangkutan
    navigate(`/doctor-chat/${doctorId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-500 animate-pulse font-medium">
            Loading Medical Specialists...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 pb-24 md:pb-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 p-3.5 rounded-2xl shadow-md text-white">
            <HeartPulse size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Medical Consultations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select an available specialist to start your private consultation
            </p>
          </div>
        </div>

        {/* CONTAINER KARTU DOKTER */}
        {medicalUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-12 text-center text-gray-500 shadow-sm">
            Tidak ada dokter atau staf medis yang tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {medicalUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 rounded-3xl p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 p-3.5 rounded-2xl">
                      <UserRound size={24} />
                    </div>
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
                      Active Specialist
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.name}
                  </h2>

                  <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 text-sm mb-6">
                    <Mail size={16} />
                    <p className="truncate">{user.email}</p>
                  </div>
                </div>

                {/* TOMBOL CHAT */}
                <div className="border-t border-gray-50 dark:border-gray-700/50 pt-4">
                  <button
                    onClick={() => handleConsultation(user.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm shadow-blue-100 dark:shadow-none cursor-pointer text-sm sm:text-base"
                  >
                    <MessageSquare size={16} />
                    Consult Now
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
}