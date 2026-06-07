import {
  useEffect
} from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import {
  initOneSignal
} from "./services/oneSignal";

import React from 'react';
// IMPORT BARU: Mengimpor komponen GoogleFitSync yang sudah Anda buat sebelumnya
import GoogleFitSync from './components/GoogleFitSync'; 

import GuestPage
from "./pages/GuestPage";

import LoginPage
from "./pages/LoginPage";

import RegisterPage
from "./pages/RegisterPage";

import DashboardPage
from "./pages/DashboardPage";

import ProtectedRoute
from "./routes/ProtectedRoute";

import HealthProfilePage
from "./pages/HealthProfilePage";

import ActivitiesPage
from "./pages/ActivitiesPage";

import SleepPage
from "./pages/SleepPage";

import ReportsPage
from "./pages/ReportsPage";

import VitalSignsPage
from "./pages/VitalSignsPage";

import FoodDiaryPage
from "./pages/FoodDiaryPage";

import DailyTargetsPage
from "./pages/DailyTargetsPage";

import ReminderPage
from "./pages/ReminderPage";

import AiChatPage 
from "./pages/AiChatPage";

import AdminDashboardPage
from "./pages/AdminDashboardPage";

import AdminRoute
from "./routes/AdminRoute";

import AdminUsersPage
from "./pages/AdminUsersPage";

import AdminMedicalPage
from "./pages/AdminMedicalPage";

import MedicalRoute
from "./routes/MedicalRoute";

import MedicalDashboardPage
from "./pages/MedicalDashboardPage";

import MedicalPatientsPage
from "./pages/MedicalPatientsPage";

import MedicalPatientDetailPage
from "./pages/MedicalPatientDetailPage";

import MedicalReportsPage
from "./pages/MedicalReportsPage";

export default function App() {

    useEffect(() => {

    initOneSignal();

  }, []);

  return (

    <Routes>

      {/* GUEST */}
      <Route
        path="/"
        element={<GuestPage />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />
     
      {/* USER */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>

            <DashboardPage />

          </ProtectedRoute>
        }
      />

      {/* ROUTE TAMBAHAN BARU: Halaman khusus untuk menguji coba koneksi dan sinkronisasi Google Fit */}
      <Route
        path="/google-fit"
        element={
          <ProtectedRoute>

            <GoogleFitSync />

          </ProtectedRoute>
        }
      />

      <Route
        path="/health-profile"
        element={
          <ProtectedRoute>

            <HealthProfilePage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/activities"
        element={
          <ProtectedRoute>

            <ActivitiesPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/sleep"
        element={
          <ProtectedRoute>

            <SleepPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/chat-ai"
        element={
          <ProtectedRoute>

            <AiChatPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>

            <ReportsPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/vital-signs"
        element={
          <ProtectedRoute>

            <VitalSignsPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/food-diary"
        element={
          <ProtectedRoute>

            <FoodDiaryPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/daily-targets"
        element={
          <ProtectedRoute>

            <DailyTargetsPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>

            <ReminderPage />

          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>

            <AdminDashboardPage />

          </AdminRoute>
        }
      />

      <Route
        path="/admin-users"
        element={
          <AdminRoute>

            <AdminUsersPage />

          </AdminRoute>
        }
      />

      <Route
        path="/admin-medical"
        element={
          <AdminRoute>

            <AdminMedicalPage />

          </AdminRoute>
        }
      />

      {/* MEDICAL */}
      <Route
        path="/medical-dashboard"
        element={
          <MedicalRoute>

            <MedicalDashboardPage />

          </MedicalRoute>
        }
      />

      <Route
        path="/medical-patients"
        element={
          <MedicalRoute>

            <MedicalPatientsPage />

          </MedicalRoute>
        }
      />

      <Route
        path="/medical-patient/:id"
        element={
          <MedicalRoute>

            <MedicalPatientDetailPage />

          </MedicalRoute>
        }
      />

      <Route
        path="/medical-reports"
        element={
          <MedicalRoute>

            <MedicalReportsPage />

          </MedicalRoute>
        }
      />

    </Routes>
  )
}
