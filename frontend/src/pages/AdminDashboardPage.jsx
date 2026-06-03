import {
  useEffect,
  useState
} from "react";

import api from "../api/axios";

import AdminLayout
from "../layouts/AdminLayout";

import {
  Users,
  ShieldPlus,
  Activity
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function AdminDashboardPage() {

  const [users, setUsers] =
    useState([]);

  const [medicalStaff, setMedicalStaff] =
    useState([]);

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard =
    async () => {

    try {

      // USERS
      const userResponse =
        await api.get(
          "/admin/users"
        );

      const allUsers =
        userResponse.data;

      setUsers(allUsers);

      // MEDICAL STAFF
      const medical =
        allUsers.filter(
          (user) =>
            user.role ===
            "medical"
        );

      setMedicalStaff(medical);

    } catch (error) {

      console.log(error);
    }
  };

  // CHART DATA
  const chartData = [

    {
      name: "Users",
      total: users.length
    },

    {
      name: "Medical",
      total: medicalStaff.length
    }
  ];

  return (

    <AdminLayout>

      <div className="
        min-h-screen
        bg-[#0f172a]
        text-white
        p-6
      ">

        {/* TITLE */}
        <div className="
          mb-10
        ">

          <h1 className="
            text-4xl
            font-extrabold
            mb-2
          ">

            Admin Dashboard

          </h1>

          <p className="
            text-gray-400
          ">

            Health Monitoring Management System

          </p>

        </div>

        {/* STATS */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-10
        ">

          {/* USERS */}
          <div className="
            bg-[#111827]
            border
            border-gray-800
            rounded-3xl
            p-6
            shadow-xl
            hover:scale-105
            transition-all
            duration-300
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-gray-400
                  mb-2
                ">

                  Total Users

                </p>

                <h2 className="
                  text-5xl
                  font-extrabold
                ">

                  {users.length}

                </h2>

              </div>

              <div className="
                bg-cyan-500/20
                p-4
                rounded-2xl
              ">

                <Users
                  size={40}
                  className="
                    text-cyan-400
                  "
                />

              </div>

            </div>

          </div>

          {/* MEDICAL */}
          <div className="
            bg-[#111827]
            border
            border-gray-800
            rounded-3xl
            p-6
            shadow-xl
            hover:scale-105
            transition-all
            duration-300
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-gray-400
                  mb-2
                ">

                  Medical Staff

                </p>

                <h2 className="
                  text-5xl
                  font-extrabold
                ">

                  {medicalStaff.length}

                </h2>

              </div>

              <div className="
                bg-blue-500/20
                p-4
                rounded-2xl
              ">

                <ShieldPlus
                  size={40}
                  className="
                    text-blue-400
                  "
                />

              </div>

            </div>

          </div>

        </div>

        {/* CHART */}
        <div className="
          bg-[#111827]
          border
          border-gray-800
          rounded-3xl
          p-6
          shadow-xl
          mb-10
        ">

          <div className="
            flex
            items-center
            gap-3
            mb-6
          ">

            <Activity
              className="
                text-cyan-400
              "
            />

            <h2 className="
              text-2xl
              font-bold
            ">

              System Analytics

            </h2>

          </div>

          <div className="
              h-96
            ">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={chartData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />

                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                />

                <YAxis
                  stroke="#9CA3AF"
                />

                <Tooltip />

                <Bar
                  dataKey="total"
                  radius={[12, 12, 0, 0]}
                  fill="#06b6d4"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}