import axios from 'axios';

const API = axios.create({
    // Gunakan IP Laptop 1 yang SAMA
    baseURL: "http://10.248.14.79",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;