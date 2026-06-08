import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";
// Membersihkan import ikon yang tidak digunakan lagi (UserRound diganti ke ShieldAlert/UserRound sesuai kebutuhan)
import { ShieldPlus, Mail, UserRound } from "lucide-react";

export default function AdminMedicalPage() {
  const [medicalUsers, setMedicalUsers] = useState([]);

  useEffect(() => {
    fetchMedicalUsers();
  }, []);

  const fetchMedicalUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      // Memfilter user yang hanya memiliki role 'medical'
      const filtered = response.data.filter((user) => user.role === "medical");
      setMedicalUsers(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#0f172a] text-white p-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-lg">
            <ShieldPlus size={30} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">Medical Staff</h1>
            <p className="text-gray-400 mt-1">Manage and monitor all registered medical users</p>
          </div>
        </div>

        {/* CARD CONTAINER */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl p-6">
          {medicalUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No medical staff found</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {medicalUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#0f172a] border border-gray-800 hover:border-cyan-500 hover:shadow-cyan-500/10 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* TOP ACCENTS */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl">
                        <UserRound size={28} />
                      </div>
                      <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold">
                        Medical Staff
                      </span>
                    </div>

                    {/* NAME */}
                    <h2 className="text-2xl font-bold mb-3">{user.name}</h2>

                    {/* EMAIL */}
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <Mail size={18} />
                      <p>{user.email}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}