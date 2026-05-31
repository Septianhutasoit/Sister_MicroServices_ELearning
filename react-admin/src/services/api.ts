import axios from "axios";

// ── IP Backend (Laptop 1 = Server Utama) ──────────────────────────────
export const LAPTOP1_IP = "10.206.80.189";
const GATEWAY_URL = `http://${LAPTOP1_IP}:8080`;

// ── Auth Service (via Nginx gateway Laptop 1 → auth-service:3001) ─────
// baseURL = gateway root, endpoint login = /auth/login
export const AUTH_API = axios.create({
    baseURL: `${GATEWAY_URL}/auth`,
    headers: { "Content-Type": "application/json" },
});

// ── Notification Service (via Nginx gateway Laptop 1) ─────────────────
export const NOTIF_API = axios.create({
    baseURL: `${GATEWAY_URL}/notifications`,
    headers: { "Content-Type": "application/json" },
});

// ── Course Service (via Nginx gateway Laptop 1 → course-service:3002) ─
export const COURSE_API = axios.create({
    baseURL: `${GATEWAY_URL}/courses`,
    headers: { "Content-Type": "application/json" },
});

// ── Default API (same as AUTH_API, backward compat) ───────────────────
const API = axios.create({
    baseURL: GATEWAY_URL,
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