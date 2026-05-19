import axios from 'axios';

// Gunakan 'export' agar bisa dibaca oleh file lain
export const authAPI = axios.create({
    // Sesuaikan dengan IP Laptop 1 (Backend)
    baseURL: 'http://10.248.14.79:3001',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Menambahkan token ke header secara otomatis
authAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});