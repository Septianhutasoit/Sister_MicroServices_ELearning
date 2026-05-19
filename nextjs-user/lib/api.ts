import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    // Gunakan IP Laptop 1
    baseURL: "http://10.248.14.79",
});

API.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;