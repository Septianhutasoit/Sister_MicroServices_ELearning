import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import type { AuthResponse } from "../types";
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    CircularProgress,
    Grid,
    alpha,
    useTheme,
    CssBaseline,
    GlobalStyles,
} from "@mui/material";
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    School,
    Dashboard as DashboardIcon,
    Security,
} from "@mui/icons-material";

export default function Login() {
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await API.post<{ data: AuthResponse }>("/auth/admin/login", {
                email,
                password,
            });
            localStorage.setItem("token", res.data.data.token);
            navigate("/dashboard");
        } catch (error) {
            if (email === "admin@example.com" && password === "admin123") {
                localStorage.setItem("token", "dummy_token_123");
                navigate("/dashboard");
                return;
            }
            alert("Login gagal. Periksa email/password atau pastikan backend berjalan.");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset margin/padding global secara maksimal
    const globalStyles = {
        html: { height: "100%", margin: 0, padding: 0, overflow: "hidden" },
        body: { height: "100%", margin: 0, padding: 0, overflow: "hidden" },
        "#root": { height: "100%", margin: 0, padding: 0, overflow: "hidden" },
    };

    return (
        <>
            <CssBaseline />
            <GlobalStyles styles={globalStyles} />
            <Box
                sx={{
                    height: "100dvh",
                    width: "100dvw",
                    display: "flex",
                    overflow: "hidden",
                    position: "fixed",
                    top: 0,
                    left: 0,
                }}
            >
                <Grid container sx={{ height: "100%", width: "100%", m: 0, p: 0 }}>
                    {/* Kiri - Branding (sembunyikan di mobile) */}
                    <Grid
                        item={true} // ✅ eksplisit boolean, hilangkan warning
                        xs={12}
                        md={6}
                        sx={{
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0056b3 100%)`,
                            color: "white",
                            height: "100%",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `
                                    radial-gradient(circle at 20% 40%, rgba(255,255,255,0.15) 2px, transparent 2px),
                                    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: "40px 40px, 30px 30px",
                            }}
                        />
                        <Box sx={{ maxWidth: 480, zIndex: 1, textAlign: "center", px: 4 }}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    borderRadius: 2,
                                    p: 1.5,
                                    mb: 3,
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                <School sx={{ fontSize: 40, mr: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                    EduLearn<span style={{ fontWeight: 400 }}>.AI</span>
                                </Typography>
                            </Box>
                            <Typography
                                variant="h3"
                                sx={{ fontWeight: 700, mb: 2, fontSize: { md: "2.5rem", lg: "3rem" } }}
                            >
                                Kelola Pembelajaran
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, opacity: 0.9 }}>
                                Platform administrasi lengkap untuk kursus, siswa, dan materi belajar.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mt: 4 }}>
                                <Box sx={{ textAlign: "center" }}>
                                    <DashboardIcon sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="body2">Dashboard Analitik</Typography>
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Security sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="body2">Akses Aman</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Kanan - Form Login */}
                    <Grid
                        item={true}
                        xs={12}
                        md={6}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            bgcolor: "background.paper",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 460,
                                px: 4,
                                py: 4,
                                mx: 2,
                                borderRadius: 4,
                                bgcolor: alpha(theme.palette.background.paper, 0.85),
                                backdropFilter: "blur(10px)",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                        >
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    Selamat Datang Kembali
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Masukkan kredensial administrator Anda
                                </Typography>
                            </Box>

                            <form onSubmit={handleLogin}>
                                <TextField
                                    fullWidth
                                    label="Alamat Email"
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    margin="normal"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color="action" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Kata Sandi"
                                    variant="outlined"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    margin="normal"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        boxShadow: "0 8px 16px rgba(0,138,94,0.15)",
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, #00a86b)`,
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                            background: `linear-gradient(90deg, #006e4d, ${theme.palette.primary.dark})`,
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Masuk ke Dashboard"}
                                </Button>

                                <Typography variant="caption" color="text.secondary" align="center" sx={{ display: "block", mt: 3 }}>
                                    Gunakan <strong>admin@example.com</strong> / <strong>admin123</strong> untuk demo (dummy)
                                </Typography>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}