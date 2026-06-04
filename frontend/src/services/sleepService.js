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
  // PERBAIKAN: Paksa sleep_duration menjadi ANGKA MURNI (bukan string dengan tanda kutip)
  const cleanedData = {
    ...data,
    sleep_duration: data.sleep_duration ? parseFloat(data.sleep_duration) : 0,
  };

  // Kirim data yang sudah bersih beserta token autentikasinya
  const response = await api.post(
    "/sleep-trackings",
    cleanedData,
    getAuthConfig()
  );

  return response.data;
};

export const deleteSleepTracking = async (id) => {
  // Menambahkan header token saat menghapus data harian
  const response = await api.delete(
    `/sleep-trackings/${id}`,
    getAuthConfig()
  );

  return response.data;
};