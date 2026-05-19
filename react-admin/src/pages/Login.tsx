import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api"; // Memastikan mengarah ke IP Laptop 1
import {
    Box, Button, TextField, Typography, InputAdornment, IconButton,
    CircularProgress, alpha, useTheme, CssBaseline, Alert, Fade,
    Paper, Divider, Chip,
} from "@mui/material";
import {
    Email, Lock, Visibility, VisibilityOff, School,
    Security, AutoAwesome, ArrowForward, CheckCircle,
    People, Assignment, TrendingUp,
} from "@mui/icons-material";

export default function Login() {
    const theme = useTheme();
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
            // 1. Request ke API Gateway Laptop 1
            // Pastikan baseURL di services/api.ts sudah menggunakan IP Laptop 1 (ex: 172.27.80.144)
            const res = await authAPI.post("/auth/login", { email, password });

            // 2. Destructuring Data (Sesuai standar respon Microservices)
            const { token, user } = res.data.data;

            // 3. PROTEKSI ROLE: Cek apakah user adalah admin
            if (user.role !== 'admin') {
                setError("Akses Ditolak! Anda mencoba masuk ke Portal Admin dengan akun Siswa.");
                setIsLoading(false);
                return;
            }

            // 4. Simpan Kredensial ke LocalStorage
            localStorage.setItem("token", token);
            localStorage.setItem("admin_name", user.name);
            localStorage.setItem("admin_role", user.role);
            localStorage.setItem("admin_email", user.email);

            // 5. Redirect ke Dashboard Admin
            navigate("/dashboard");

        } catch (err: any) {
            console.error("Login Error:", err);

            // Mengambil pesan error asli dari backend
            const serverMessage = err.response?.data?.message || "Gagal terhubung ke Laptop 1. Pastikan server aktif.";
            setError(serverMessage);

            // --- Demo Fallback (Hapus jika sudah fix konek ke Laptop 1) ---
            if (email === "admin@example.com" && password === "admin123") {
                localStorage.setItem("token", "dummy_admin_token");
                localStorage.setItem("admin_name", "Admin Demo");
                navigate("/dashboard");
                return;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { icon: People, value: "12K+", label: "Total Siswa", color: "#008A5E" },
        { icon: School, value: "48", label: "Kursus Aktif", color: "#2BAE82" },
        { icon: Assignment, value: "92%", label: "Tingkat Kelulusan", color: "#00A86B" },
        { icon: TrendingUp, value: "24/7", label: "System Uptime", color: "#3B82F6" },
    ];

    return (
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", overflow: "hidden", bgcolor: "#F8FAFC" }}>
            <CssBaseline />
            <Box sx={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: `radial-gradient(${theme.palette.primary.main} 2px, transparent 2px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />

            {/* ── KIRI: BRANDING (ADMIN PANEL STYLE) ── */}
            <Box sx={{
                width: { xs: "0%", lg: "50%" }, display: { xs: "none", lg: "flex" },
                flexDirection: "column", justifyContent: "center", alignItems: "center",
                background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`, // Warna admin lebih gelap & profesional
                color: "white", position: "relative", overflow: "hidden",
            }}>
                <Box sx={{ position: "absolute", top: "-20%", right: "-20%", width: "80%", height: "80%", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)" }} />

                <Box sx={{ maxWidth: 520, zIndex: 1, textAlign: "center", px: 4 }}>
                    <Fade in timeout={1000}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                            <Box sx={{ bgcolor: "#10b981", color: "white", p: 1.5, borderRadius: 2 }}>
                                <Security sx={{ fontSize: 32 }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900 }}>EduAdmin</Typography>
                        </Box>
                    </Fade>

                    <Fade in timeout={1200}>
                        <Box>
                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: "2.8rem", color: "white" }}>
                                Management <span style={{ color: "#10b981" }}>Portal</span>
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 400, mb: 5, opacity: .7, lineHeight: 1.6 }}>
                                Dashboard eksklusif untuk mengelola konten pembelajaran, memantau siswa, dan konfigurasi microservices.
                            </Typography>
                        </Box>
                    </Fade>

                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 2, mb: 5 }}>
                        {stats.map((stat, i) => (
                            <Paper key={i} elevation={0} sx={{ p: 2, bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#10b981" }}>{stat.value}</Typography>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{stat.label}</Typography>
                            </Paper>
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
                        <Chip label="Node.js Gateway" size="small" sx={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }} />
                        <Chip label="PostgreSQL DB" size="small" sx={{ color: "white", border: "1px solid rgba(255,255,255,0.2)" }} />
                        <Chip label="Admin Verified" size="small" sx={{ color: "#10b981", border: "1px solid #10b981" }} />
                    </Box>
                </Box>
            </Box>

            {/* ── KANAN: FORM ── */}
            <Box sx={{ width: { xs: "100%", lg: "50%" }, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#FFFFFF" }}>
                <Box sx={{ width: "100%", maxWidth: 420, px: 4 }}>
                    <Fade in timeout={800}>
                        <Box>
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 1 }}>
                                    Login Administrator
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Akses khusus untuk manajemen sistem EduLearn
                                </Typography>
                            </Box> {/* 👈 Tadi di sini tertulis </div>, sekarang sudah diperbaiki jadi </Box> */}

                            {error && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                            )}

                            <form onSubmit={handleLogin}>
                                <TextField
                                    fullWidth label="Email Admin"
                                    type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required margin="normal"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                                />
                                <TextField
                                    fullWidth label="Kata Sandi"
                                    type={showPassword ? "text" : "password"}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required margin="normal"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                                        </InputAdornment>,
                                    }}
                                />

                                <Button
                                    type="submit" fullWidth variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        mt: 4, py: 1.8, borderRadius: 2, fontWeight: 800,
                                        bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" }
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Masuk ke Dashboard Admin"}
                                </Button>

                                <Divider sx={{ my: 4 }}><Typography variant="caption" color="text.secondary">KREDENSIAL AKSES</Typography></Divider>

                                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box>
                                            <Typography variant="caption" display="block">ID: <strong>admin@del.ac.id</strong></Typography>
                                            <Typography variant="caption" display="block">PASS: <strong>admin123</strong></Typography>
                                        </Box>
                                        <Security sx={{ color: "#cbd5e1" }} />
                                    </Box>
                                </Paper>

                                <Box sx={{ textAlign: "center", mt: 4 }}>
                                    <Link href="/" style={{ textDecoration: "none" }}>
                                        <Typography variant="body2" sx={{ color: "text.secondary", "&:hover": { color: "#10b981" } }}>
                                            ← Kembali ke Portal Utama
                                        </Typography>
                                    </Link>
                                </Box>
                            </form>
                        </Box>
                    </Fade>
                </Box>
            </Box>
        </Box>
    );
}