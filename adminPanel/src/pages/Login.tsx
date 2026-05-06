import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import type { AuthResponse } from "../types";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await API.post<{ data: AuthResponse }>("/auth/admin/login", { email, password });
            localStorage.setItem("token", res.data.data.token);
            alert("Login Berhasil!");
            navigate("/dashboard");
        } catch (error) {
            alert("Login Gagal, periksa email/password");
        }
    };

    return (
        <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>Login Admin Panel</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#008A5E", color: "white", border: "none", cursor: "pointer" }}>
                    Login
                </button>
            </form>
        </div>
    );
}