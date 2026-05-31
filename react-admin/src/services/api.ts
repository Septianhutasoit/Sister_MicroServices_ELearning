import axios from "axios";

export const LAPTOP1_IP = "10.206.80.189";
export const LAPTOP2_IP = "10.206.80.228";

const getGatewayUrl = () => {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === LAPTOP2_IP) {
            return `http://${hostname}:8080`;
        }
    }
    return `http://${LAPTOP1_IP}:8080`;
};

const GATEWAY_URL = getGatewayUrl();

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