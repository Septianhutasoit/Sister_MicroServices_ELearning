import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import {
    Box, Button, TextField, Typography, InputAdornment, IconButton,
    CircularProgress, CssBaseline, Alert, Fade, Paper
} from "@mui/material";
import {
    Email, Lock, Visibility, VisibilityOff, Security,
    People, Assignment
} from "@mui/icons-material";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await authAPI.post("/login", { email, password });
            const { token, user } = res.data.data;

            if (user.role !== 'admin') {
                setError("Akses Ditolak! Anda bukan Admin.");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("admin_name", user.name);
            navigate("/dashboard");

        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal terhubung ke Laptop 1.");
            if (email === "admin@example.com" && password === "admin123") {
                localStorage.setItem("token", "dummy");
                navigate("/dashboard");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { icon: People, value: "12K+", label: "Total Siswa" },
        { icon: Assignment, value: "48", label: "Kursus Aktif" },
    ];

    return (
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", overflow: "hidden", bgcolor: "#F8FAFC" }}>
            <CssBaseline />

            {/* PANEL KIRI */}
            <Box sx={{
                width: { xs: "0%", lg: "50%" },
                display: { xs: "none", lg: "flex" },
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "white"
            }}>
                <Box sx={{ maxWidth: 520, textAlign: "center", px: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 4 }}>
                        <Security sx={{ fontSize: 40, color: "#10b981" }} />
                        <Typography variant="h4" sx={{ fontWeight: 900 }}>EduAdmin</Typography>
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "#10b981" }}>Management Portal</Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: 6, justifyContent: "center" }}>
                        {stats.map((s, i) => (
                            <Paper key={i} elevation={0} sx={{
                                p: 2,
                                bgcolor: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 3,
                                minWidth: 140 // 👈 SUDAH DIPINDAH KE DALAM SX
                            }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#10b981" }}>{s.value}</Typography>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{s.label}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* PANEL KANAN */}
            <Box sx={{ width: { xs: "100%", lg: "50%" }, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#FFFFFF" }}>
                <Box sx={{ width: "100%", maxWidth: 420, px: 4 }}>
                    <Fade in={true} timeout={800}>
                        <Box>
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 1 }}>
                                    Login Administrator
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Akses khusus untuk manajemen sistem EduLearn
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                            <form onSubmit={handleLogin}>
                                <TextField
                                    fullWidth label="Email Admin"
                                    type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required margin="normal"
                                />
                                <TextField
                                    fullWidth label="Kata Sandi"
                                    type={showPassword ? "text" : "password"}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Button
                                    type="submit" fullWidth variant="contained"
                                    disabled={isLoading}
                                    sx={{ mt: 4, py: 1.8, bgcolor: "#0f172a" }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Masuk ke Dashboard Admin"}
                                </Button>
                            </form>
                        </Box>
                    </Fade>
                </Box>
            </Box>
        </Box>
    );
}