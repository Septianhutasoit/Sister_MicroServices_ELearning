import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    //API Gateway (Laptop 1) — ganti IP sesuai laptop masing-masing teman
    baseURL: "http://172.27.65.26",
});

API.interceptors.request.use((req) => {
    const token = Cookies.get("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;

