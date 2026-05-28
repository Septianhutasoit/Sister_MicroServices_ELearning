import axios from "axios";

// ── Auth Service (lokal Laptop 2 port 3001) ───────────────────────────
export const AUTH_API = axios.create({
    baseURL: "http://localhost:3001",
    headers: { "Content-Type": "application/json" },
});

// ── Notification Service (Laptop 1 via gateway port 8080) ─────────────
export const NOTIF_API = axios.create({
    baseURL: "http://10.206.80.189:8080",
    headers: { "Content-Type": "application/json" },
});

// ── Course Service (lokal Laptop 2 port 3002) ─────────────────────────
export const COURSE_API = axios.create({
    baseURL: "http://localhost:3002",
    headers: { "Content-Type": "application/json" },
});

// ── Default API (backward compat, arah ke auth-service lokal) ─────────
const API = axios.create({
    baseURL: "http://localhost:3001",
    headers: { "Content-Type": "application/json" },
});

// Interceptor: sertakan token JWT ke semua instance
[API, AUTH_API, NOTIF_API, COURSE_API].forEach(instance => {
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );
});

export default API;