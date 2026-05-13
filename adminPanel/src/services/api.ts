import axios from "axios";

const API = axios.create({
    // WAJIB: IP Laptop 1 (Temanmu)
    baseURL: "http://172.27.65.26",
});

// Tambahkan interceptor agar token selalu dikirim
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default API;