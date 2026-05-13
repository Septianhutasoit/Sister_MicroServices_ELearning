import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    alpha,
    useTheme,
    CssBaseline,
    Alert,
    Fade,
    Paper,
    Divider,
    Chip,
} from "@mui/material";
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    School,
    Dashboard as DashboardIcon,
    Security,
    AutoAwesome,
    ArrowForward,
    CheckCircle,
    People,
    Assignment,
    TrendingUp,
} from "@mui/icons-material";

export default function Login() {
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await API.post<{ data: AuthResponse }>("/auth/admin/login", {
                email,
                password,
            });
            localStorage.setItem("token", res.data.data.token);
            navigate("/dashboard");
        } catch (error) {
            // Bypass khusus untuk testing jika Backend/CORS masih error
            if (email === "admin@example.com" && password === "admin123") {
                localStorage.setItem("token", "dummy_token_123");
                navigate("/dashboard");
                return;
            }
            setError("Email atau password salah. Silakan coba kembali.");
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { icon: People, value: "10K+", label: "Pengguna Aktif", color: "#008A5E" },
        { icon: School, value: "500+", label: "Kursus Tersedia", color: "#2BAE82" },
        { icon: Assignment, value: "95%", label: "Kepuasan", color: "#00A86B" },
        { icon: TrendingUp, value: "150%", label: "Pertumbuhan", color: "#3B82F6" },
    ];

    return (
        <Box sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            overflow: "hidden",
            bgcolor: "#F8FAFC",
        }}>
            <CssBaseline />

            {/* Background Pattern */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.03,
                    backgroundImage: `radial-gradient(${theme.palette.primary.main} 2px, transparent 2px)`,
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                }}
            />

            {/* --- SISI KIRI (BRANDING - 50% LEBAR) --- */}
            <Box
                sx={{
                    width: { xs: "0%", lg: "50%" },
                    display: { xs: "none", lg: "flex" },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #006E4D 50%, #004D35 100%)`,
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Animated Background Elements */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "-20%",
                        right: "-20%",
                        width: "80%",
                        height: "80%",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                        animation: "pulse 8s ease-in-out infinite",
                        "@keyframes pulse": {
                            "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
                            "50%": { transform: "scale(1.1)", opacity: 0.8 },
                        },
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "-20%",
                        left: "-20%",
                        width: "70%",
                        height: "70%",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                        animation: "pulse 10s ease-in-out infinite reverse",
                    }}
                />

                <Box sx={{ maxWidth: 520, zIndex: 1, textAlign: "center", px: 4 }}>
                    {/* Logo with Animation */}
                    <Fade in timeout={1000}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    bgcolor: alpha(theme.palette.common.white, 0.15),
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 3,
                                    p: 2,
                                    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: "white",
                                        color: theme.palette.primary.main,
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <School sx={{ fontSize: 32 }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                                    EduLearn
                                    <span style={{ fontWeight: 400, opacity: 0.9 }}></span>
                                </Typography>
                            </Box>
                        </Box>
                    </Fade>

                    {/* Main Title */}
                    <Fade in timeout={1200}>
                        <Box>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { lg: "2.8rem", xl: "3.5rem" },
                                    lineHeight: 1.2,
                                    background: `linear-gradient(135deg, #FFFFFF 0%, ${alpha("#FFFFFF", 0.8)} 100%)`,
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                }}
                            >
                                Platform E-Learning
                                <br />
                                Terintegrasi
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 400,
                                    mb: 5,
                                    opacity: 0.9,
                                    lineHeight: 1.6,
                                    fontSize: "1.1rem",
                                }}
                            >
                                Kelola kursus, siswa, dan materi pembelajaran Anda dalam satu dashboard modern dengan teknologi terkini.
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Stats Section */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mb: 5 }}>
                        {stats.map((stat, index) => (
                            <Fade in timeout={1400 + index * 100} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        bgcolor: alpha(theme.palette.common.white, 0.1),
                                        backdropFilter: "blur(10px)",
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
                                        transition: "transform 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            bgcolor: alpha(theme.palette.common.white, 0.15),
                                        },
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
                                        <stat.icon sx={{ fontSize: 28, color: alpha("#FFFFFF", 0.9) }} />
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: "1.5rem" }}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Fade>
                        ))}
                    </Box>

                    {/* Features List */}
                    <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
                        <Chip
                            icon={<CheckCircle sx={{ fontSize: 16 }} />}
                            label="Microservices Architecture"
                            sx={{
                                bgcolor: alpha(theme.palette.common.white, 0.1),
                                color: "white",
                                "& .MuiChip-icon": { color: alpha("#FFFFFF", 0.8) },
                            }}
                        />
                        <Chip
                            icon={<Security sx={{ fontSize: 16 }} />}
                            label="Enterprise Security"
                            sx={{
                                bgcolor: alpha(theme.palette.common.white, 0.1),
                                color: "white",
                                "& .MuiChip-icon": { color: alpha("#FFFFFF", 0.8) },
                            }}
                        />
                        <Chip
                            icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                            label="AI-Powered Analytics"
                            sx={{
                                bgcolor: alpha(theme.palette.common.white, 0.1),
                                color: "white",
                                "& .MuiChip-icon": { color: alpha("#FFFFFF", 0.8) },
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* --- SISI KANAN (FORM LOGIN - 50% LEBAR) --- */}
            <Box
                sx={{
                    width: { xs: "100%", lg: "50%" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#FFFFFF",
                    position: "relative",
                    overflow: "auto",
                    py: { xs: 4, sm: 6 },
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 460, px: { xs: 3, sm: 4, md: 6 } }}>
                    <Fade in timeout={800}>
                        <Box>
                            {/* Mobile Logo (Only visible on mobile) */}
                            <Box
                                sx={{
                                    display: { xs: "flex", lg: "none" },
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1.5,
                                    mb: 4,
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: "white",
                                        p: 1,
                                        borderRadius: 2,
                                    }}
                                >
                                    <School fontSize="small" />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    EduLearn
                                    <span style={{ color: theme.palette.primary.main, fontWeight: 400 }}>.AI</span>
                                </Typography>
                            </Box>

                            {/* Welcome Section */}
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 1,
                                        background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        color: "transparent",
                                    }}
                                >
                                    Selamat Datang Kembali
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Masukkan kredensial Anda untuk mengakses dashboard
                                </Typography>
                            </Box>

                            {/* Error Alert */}
                            {error && (
                                <Fade in>
                                    <Alert
                                        severity="error"
                                        sx={{ mb: 3, borderRadius: 2 }}
                                        onClose={() => setError("")}
                                    >
                                        {error}
                                    </Alert>
                                </Fade>
                            )}

                            {/* Login Form */}
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
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email sx={{ color: isFocused ? theme.palette.primary.main : "text.secondary" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 2,
                                        "& .MuiOutlinedInput-root": {
                                            transition: "all 0.3s ease",
                                            "&:hover fieldset": {
                                                borderColor: theme.palette.primary.main,
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: theme.palette.primary.main,
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: "text.secondary" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: "text.secondary" }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 3,
                                        "& .MuiOutlinedInput-root": {
                                            transition: "all 0.3s ease",
                                            "&:hover fieldset": {
                                                borderColor: theme.palette.primary.main,
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: theme.palette.primary.main,
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, #00A86B)`,
                                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: `linear-gradient(90deg, #006E4D, ${theme.palette.primary.main})`,
                                            transform: "translateY(-2px)",
                                            boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                                        },
                                        "&:active": {
                                            transform: "translateY(0)",
                                        },
                                    }}
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        <>
                                            Masuk ke Dashboard
                                            <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
                                        </>
                                    )}
                                </Button>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        DEMO CREDENTIALS
                                    </Typography>
                                </Divider>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Email: <strong style={{ color: theme.palette.primary.main }}>admin@example.com</strong>
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Password: <strong style={{ color: theme.palette.primary.main }}>admin123</strong>
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label="Demo Mode"
                                            size="small"
                                            sx={{
                                                bgcolor: theme.palette.primary.main,
                                                color: "white",
                                                fontWeight: 600,
                                            }}
                                        />
                                    </Box>
                                </Paper>

                                <Box sx={{ textAlign: "center", mt: 3 }}>
                                    <Link to="/" style={{ textDecoration: "none" }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: theme.palette.primary.main,
                                                "&:hover": { textDecoration: "underline" },
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            ← Kembali ke Beranda
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