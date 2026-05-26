import axios from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL = "http://172.30.59.189:8080";

export const API = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor untuk menyertakan Token Authorization secara otomatis ke semua request
API.interceptors.request.use(
    (config) => {
        // Ambil token dari Cookies atau LocalStorage
        const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const AUTH_API = axios.create({
    baseURL: `${API_BASE_URL}/api/auth`, 
});

export default API;