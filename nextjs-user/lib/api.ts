import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    // ❌ SALAH: "http://10.248.14.79.3001"
    // ✅ BENAR: Menggunakan titik dua (:) sebelum port 3001
    baseURL: "http://172.27.80.154",
});

API.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;