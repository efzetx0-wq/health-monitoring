// UBAH DISINI: Import instance api bentukan Anda sendiri, bukan axios murni
import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET PROFILE
export const getHealthProfile = async () => {
  // Menggunakan 'api.get' agar otomatis mengarah ke base URL yang benar
  const response = await api.get("/health-profile", getAuthConfig());
  return response.data;
};

// SAVE PROFILE
export const saveHealthProfile = async (data) => {
  // Menggunakan 'api.post' agar aman dan membawa token yang valid
  const response = await api.post("/health-profile", data, getAuthConfig());
  return response.data;
};