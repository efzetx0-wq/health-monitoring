import api from "../api/axios";

// Fungsi pembantu untuk mengambil token secara realtime
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getSleepTrackings = async () => {
  // Menambahkan header token saat mengambil data harian
  const response = await api.get("/sleep-trackings", getAuthConfig());
  return response.data;
};

export const createSleepTracking = async (data) => {
  // Ambil token untuk keamanan
  const token = localStorage.getItem("token");

  // KITA AMANKAN DATA DI SINI SEBELUM MENYENTUH BACKEND
  const cleanedData = {
    ...data,
    // 1. Paksa durasi menjadi angka murni
    sleep_duration: data.sleep_duration ? parseFloat(data.sleep_duration) : 0,
    
    // 2. PAKSA KUALITAS MENJADI HURUF KECIL MURNI (.toLowerCase())
    // Ini akan mengubah "EXCELLENT" dari web menjadi "excellent" yang ramah database
    sleep_quality: data.sleep_quality ? data.sleep_quality.toLowerCase() : "good",
  };

  const response = await api.post(
    "/sleep-trackings",
    cleanedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};