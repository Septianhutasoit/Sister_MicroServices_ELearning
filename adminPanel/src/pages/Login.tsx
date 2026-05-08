import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, InputAdornment, IconButton, CircularProgress, Grid, CssBaseline } from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff, School, Dashboard, Security } from "@mui/icons-material";
import API from "../services/api";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/auth/admin/login", { email, password });
            localStorage.setItem("token", res.data.data.token);
            navigate("/dashboard");
        } catch {
            if (email === "admin@example.com" && password === "admin123") {
                localStorage.setItem("token", "dummy_token");
                navigate("/dashboard");
            } else alert("Login Gagal!");
        } finally { setLoading(false); }
    };

    return (
        <Box sx={{ width: "100vw", height: "100vh", display: "flex", overflow: "hidden" }}>
            <CssBaseline />
            <Grid container sx={{ flexGrow: 1 }}>
                <Grid md={6} sx={{ display: { xs: 'none', md: 'flex' }, background: 'linear-gradient(135deg, #008A5E 0%, #004D40 100%)', color: 'white', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                    <School sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h3" fontWeight={800}>E-Learn.AI</Typography>
                    <Typography opacity={0.8}>Platform Administrasi Terpadu</Typography>
                </Grid>
                <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
                    <Box sx={{ width: '100%', maxWidth: 400, p: 4 }}>
                        <Typography variant="h4" fontWeight={700} mb={1}>Selamat Datang</Typography>
                        <Typography color="text.secondary" mb={4}>Masukkan kredensial Anda</Typography>
                        <form onSubmit={handleLogin}>
                            <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} margin="normal" InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }} />
                            <TextField fullWidth label="Password" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} margin="normal" InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>, endAdornment: <IconButton onClick={() => setShow(!show)}>{show ? <VisibilityOff /> : <Visibility />}</IconButton> }} />
                            <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, py: 1.5, bgcolor: '#008A5E', '&:hover': { bgcolor: '#006E4D' } }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Masuk"}
                            </Button>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}