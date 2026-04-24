export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    price?: number; // Opsional
}

export interface AuthResponse {
    token: string;
    user: User;
}