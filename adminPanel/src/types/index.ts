export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
}