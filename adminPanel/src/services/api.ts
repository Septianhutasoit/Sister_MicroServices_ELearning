import axios from "axios";

const API = axios.create({
    // Ganti dengan IP Gateway API kamu
    baseURL: "http://172.27.65:3000/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;