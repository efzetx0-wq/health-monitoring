import api from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendChatMessage = async (message) => {
  const response = await api.post("/chat-ai", { message }, getAuthConfig());
  return response.data; // Mengembalikan { reply: "..." }
};