import axios from "axios";

const API = axios.create({
    // Ganti dengan IP Gateway API kamu
    baseURL: "http://192.168.1.10",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;