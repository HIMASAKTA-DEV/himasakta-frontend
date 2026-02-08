import axios from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add response interceptor for better error handling if needed
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can log errors or handle them globally here
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);
