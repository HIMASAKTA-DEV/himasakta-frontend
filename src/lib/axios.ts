import axios from "axios";

export const baseURL = `${process.env.NEXT_PUBLIC_API_URL || "https://himasakta-backend.vercel.app"}/api/v1`;

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error logging
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
