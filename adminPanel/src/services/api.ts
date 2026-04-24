import axios from "axios";

const API = axios.create({
    // Ganti dengan IP Gateway API kamu
    baseURL: "http://192.168.1.10",
});

// Otomatis tempelkan token JWT kalau admin sudah login
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;