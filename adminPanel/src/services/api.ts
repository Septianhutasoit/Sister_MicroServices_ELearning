import axios from "axios";

const API = axios.create({
    // Ganti IP ini dengan IP Laptop 1 (Gateway) sesuai yang ada di Flutter-mu
    baseURL: "http://172.27.65.26/api",
});

// Otomatis menempelkan token jika Admin sudah login
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;