import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import  API  from "../services/api";
import {
    Box, Button, TextField, Typography, InputAdornment, IconButton,
    CircularProgress, alpha, useTheme, CssBaseline, Alert, Fade, Paper, Chip,
} from "@mui/material";
import {
    Email, Lock, Visibility, VisibilityOff, School,
    Person, ArrowForward, CheckCircle,
} from "@mui/icons-material";

export default function Register() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const passwordMatch = password === confirm && confirm.length > 0;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordMatch) { setError("Password dan konfirmasi tidak cocok."); return; }
        setIsLoading(true);
        setError("");
        try {
            await API.post("/auth/admin/register", { name, email, password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1800);
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal melakukan registrasi. Coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", overflow: "hidden", bgcolor: "#F8FAFC" }}>
            <CssBaseline />
            <Box sx={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: `radial-gradient(${theme.palette.primary.main} 2px, transparent 2px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />

            {/* ── KIRI: BRANDING ── */}
            <Box sx={{
                width: { xs: "0%", lg: "50%" }, display: { xs: "none", lg: "flex" },
                flexDirection: "column", justifyContent: "center", alignItems: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #006E4D 50%, #004D35 100%)`,
                color: "white", position: "relative", overflow: "hidden",
            }}>
                <Box sx={{ position: "absolute", top: "-20%", right: "-20%", width: "80%", height: "80%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)", animation: "pulse 8s ease-in-out infinite", "@keyframes pulse": { "0%,100%": { transform: "scale(1)", opacity: .5 }, "50%": { transform: "scale(1.1)", opacity: .8 } } }} />
                <Box sx={{ position: "absolute", bottom: "-20%", left: "-20%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", animation: "pulse 10s ease-in-out infinite reverse" }} />

                <Box sx={{ maxWidth: 480, zIndex: 1, textAlign: "center", px: 4 }}>
                    <Fade in timeout={800}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 5 }}>
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.5, bgcolor: alpha(theme.palette.common.white, .15), backdropFilter: "blur(10px)", borderRadius: 3, p: 2, border: `1px solid ${alpha(theme.palette.common.white, .2)}` }}>
                                <Box sx={{ bgcolor: "white", color: theme.palette.primary.main, p: 1.5, borderRadius: 2 }}><School sx={{ fontSize: 32 }} /></Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -.5 }}>EduLearn</Typography>
                            </Box>
                        </Box>
                    </Fade>

                    <Fade in timeout={1000}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2, background: `linear-gradient(135deg, #FFFFFF 0%, ${alpha("#FFFFFF", .8)} 100%)`, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                                Bergabung Sebagai<br />Administrator
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 400, mb: 5, opacity: .85, lineHeight: 1.7 }}>
                                Buat akun admin untuk mulai mengelola platform e-learning Anda.
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Steps */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
                        {[
                            "Isi data akun dengan lengkap",
                            "Verifikasi melalui email Anda",
                            "Akses dashboard admin penuh",
                        ].map((step, i) => (
                            <Fade in timeout={1200 + i * 150} key={i}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, bgcolor: alpha(theme.palette.common.white, .1), backdropFilter: "blur(10px)", p: 2, borderRadius: 2, border: `1px solid ${alpha(theme.palette.common.white, .12)}` }}>
                                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: alpha(theme.palette.common.white, .2), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{i + 1}</Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: 14, fontWeight: 500, opacity: .9 }}>{step}</Typography>
                                </Box>
                            </Fade>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* ── KANAN: FORM REGISTER ── */}
            <Box sx={{ width: { xs: "100%", lg: "50%" }, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#FFFFFF", position: "relative", overflow: "auto", py: { xs: 4, sm: 6 } }}>
                <Box sx={{ width: "100%", maxWidth: 460, px: { xs: 3, sm: 4, md: 6 } }}>
                    <Fade in timeout={600}>
                        <Box>
                            {/* Mobile logo */}
                            <Box sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center", justifyContent: "center", gap: 1.5, mb: 4 }}>
                                <Box sx={{ bgcolor: theme.palette.primary.main, color: "white", p: 1, borderRadius: 2 }}><School fontSize="small" /></Box>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>EduLearn<span style={{ color: theme.palette.primary.main, fontWeight: 400 }}>.AI</span></Typography>
                            </Box>

                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                                    Buat Akun Admin
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Daftarkan diri Anda sebagai administrator
                                </Typography>
                            </Box>

                            {/* Success */}
                            {success && (
                                <Fade in>
                                    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, .06), border: `1px solid ${alpha(theme.palette.primary.main, .2)}`, textAlign: "center" }}>
                                        <CheckCircle sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                                        <Typography fontWeight={700} color="primary">Registrasi Berhasil!</Typography>
                                        <Typography variant="body2" color="text.secondary">Mengalihkan ke halaman login…</Typography>
                                    </Paper>
                                </Fade>
                            )}

                            {/* Error */}
                            {error && (
                                <Fade in>
                                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError("")}>{error}</Alert>
                                </Fade>
                            )}

                            <form onSubmit={handleRegister}>
                                {/* Nama */}
                                <TextField fullWidth label="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required margin="normal"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "text.secondary" }} /></InputAdornment> }}
                                    sx={{ mb: 1, "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: theme.palette.primary.main }, "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, borderWidth: 2 } } }}
                                />
                                {/* Email */}
                                <TextField fullWidth label="Alamat Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required margin="normal"
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "text.secondary" }} /></InputAdornment> }}
                                    sx={{ mb: 1, "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: theme.palette.primary.main }, "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, borderWidth: 2 } } }}
                                />
                                {/* Password */}
                                <TextField fullWidth label="Kata Sandi" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required margin="normal"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.secondary" }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                                    }}
                                    sx={{ mb: 1, "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: theme.palette.primary.main }, "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, borderWidth: 2 } } }}
                                />
                                {/* Konfirmasi */}
                                <TextField fullWidth label="Konfirmasi Kata Sandi" type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required margin="normal"
                                    error={confirm.length > 0 && !passwordMatch}
                                    helperText={confirm.length > 0 && !passwordMatch ? "Password tidak cocok" : ""}
                                    color={passwordMatch ? "success" : "primary"}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Lock sx={{ color: confirm.length > 0 ? (passwordMatch ? "success.main" : "error.main") : "text.secondary" }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">{showConfirm ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                                    }}
                                    sx={{ mb: 3, "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: theme.palette.primary.main }, "&.Mui-focused fieldset": { borderWidth: 2 } } }}
                                />

                                <Button type="submit" fullWidth variant="contained" disabled={isLoading || success} sx={{ py: 1.5, fontSize: "1rem", fontWeight: 700, textTransform: "none", borderRadius: 2, background: `linear-gradient(90deg, ${theme.palette.primary.main}, #00A86B)`, boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, .25)}`, transition: "all .3s", "&:hover": { background: `linear-gradient(90deg, #006E4D, ${theme.palette.primary.main})`, transform: "translateY(-2px)", boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, .35)}` } }}>
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : <><span>Daftarkan Akun</span><ArrowForward sx={{ ml: 1, fontSize: 18 }} /></>}
                                </Button>

                                {/* Service info */}
                                <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, .04), borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, .1)}` }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="caption" color="text.secondary">Terhubung ke <strong style={{ color: theme.palette.primary.main }}>Auth Service</strong></Typography>
                                        <Chip label="Microservice" size="small" sx={{ bgcolor: theme.palette.primary.main, color: "white", fontWeight: 600, fontSize: 10 }} />
                                    </Box>
                                </Paper>

                                <Box sx={{ textAlign: "center", mt: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Sudah punya akun?{" "}
                                        <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 700, textDecoration: "none" }}>
                                            Masuk Sekarang
                                        </Link>
                                    </Typography>
                                </Box>
                            </form>
                        </Box>
                    </Fade>
                </Box>
            </Box>
        </Box>
    );
}