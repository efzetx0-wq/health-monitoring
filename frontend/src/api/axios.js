import axios from "axios";

const api = axios.create({
  baseURL: "https://health-monitoring-production.up.railway.app/api",
  withCredentials: true, // <--- WAJIB DITAMBAHKAN AGAR COOKIE SANCTUM BISA LEWAT LINTAS DOMAIN
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;