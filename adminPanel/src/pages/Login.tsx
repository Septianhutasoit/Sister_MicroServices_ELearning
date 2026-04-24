import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthResponse } from "../types";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
            
            const res = await API.post<{ data: AuthResponse }>("/auth/admin/login", { email, password });

            localStorage.setItem("token", res.data.data.token);
            alert("Login Berhasil!");
            navigate("/dashboard"); 
        } catch (error) {
            alert("Login Gagal, periksa email/password");
        }
    };

    return (
        <div style={{ padding: "50px" }}>
            <h2>Login Admin Panel</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}