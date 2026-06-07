import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getChatMessages = async (partnerId) => {
  const response = await api.get(`/doctor-consultation/messages/${partnerId}`, getAuthConfig());
  return response.data;
};

export const sendChatMessage = async (data) => {
  const response = await api.post("/doctor-consultation/send", data, getAuthConfig());
  return response.data;
};