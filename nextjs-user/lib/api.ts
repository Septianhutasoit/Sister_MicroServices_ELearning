import axios from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL = "/api/gateway";

const API = axios.create({
    baseURL: "http://10.206.80.189:8080", // Gunakan IP Laptop 1 & port Gateway 8080
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

// Interceptor untuk menangani error respons secara global (misal 401 Unauthorized)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika backend mengembalikan 401 (Unauthorized / Token Kedaluwarsa)
        if (error.response && error.response.status === 401) {
            console.warn("Sesi berakhir atau tidak valid (401). Mengarahkan ke halaman login...");

            if (typeof window !== "undefined") {
                // Hapus kredensial saja, simpan progress belajar lokal
                ['token', 'role', 'user_role', 'name', 'email'].forEach(k => localStorage.removeItem(k));
                ['token', 'role', 'name', 'email'].forEach(k => Cookies.remove(k, { path: '/' }));

                // Redirect ke login
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export const AUTH_API = axios.create({
    baseURL: `${API_BASE_URL}/api/auth`,
});

export default API;