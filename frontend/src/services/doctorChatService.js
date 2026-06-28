import api from "../api/axios";

const getAuthConfig = (data = null) => {
  const token = localStorage.getItem("token");
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // JIKA DATA ADALAH FORMDATA (KIRIM FILE), HAPUS ATAU SESUAIKAN HEADERS
  if (data instanceof FormData) {
    // Lebih aman membiarkan browser menentukan Content-Type secara otomatis 
    // agar boundary multi-part file tidak rusak/hilang.
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
};

export const getChatMessages = async (partnerId) => {
  const response = await api.get(`/doctor-consultation/messages/${partnerId}`, getAuthConfig());
  return response.data;
};

export const sendChatMessage = async (data) => {
  // Oper parameter 'data' ke getAuthConfig agar tipenya bisa dicek (FormData / Object biasa)
  const response = await api.post("/doctor-consultation/send", data, getAuthConfig(data));
  return response.data;
};