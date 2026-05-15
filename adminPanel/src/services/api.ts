import axios from "axios";

// ================================================================
// KONFIGURASI MICROSERVICES
// Ganti IP sesuai laptop masing-masing teman
// ================================================================
export const SERVICES = {
    auth: "http://172.27.65.26:3001",   // Laptop 1 – Auth Service
    course: "http://172.27.65.26:3002",   // Laptop 2 – Course Service
    user: "http://172.27.65.26:3003",   // Laptop 3 – User Service
    quiz: "http://172.27.65.26:3004",   // Laptop 4 – Quiz Service
    notif: "http://172.27.65.26:3005",   // Laptop 5 – Notification Service
};

// ================================================================
// HELPER: buat instance axios per service
// ================================================================
function createInstance(baseURL: string) {
    const instance = axios.create({ baseURL });

    instance.interceptors.request.use((req) => {
        const token = localStorage.getItem("token");
        if (token) req.headers.Authorization = `Bearer ${token}`;
        return req;
    });

    instance.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            return Promise.reject(err);
        }
    );

    return instance;
}

// ================================================================
// INSTANCE PER SERVICE — pakai sesuai kebutuhan
// ================================================================
export const authAPI = createInstance(SERVICES.auth);
export const courseAPI = createInstance(SERVICES.course);
export const userAPI = createInstance(SERVICES.user);
export const quizAPI = createInstance(SERVICES.quiz);
export const notifAPI = createInstance(SERVICES.notif);

// Default export (auth) — backward compatible dengan kode lama
export default authAPI;