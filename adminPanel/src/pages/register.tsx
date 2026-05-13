import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Box, Button, TextField, Typography, Container, Paper, CircularProgress, Alert } from "@mui/material";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Tembak ke API Gateway (Laptop 1)
            await API.post("/auth/register", { email, password });
            alert("Registrasi berhasil! Silakan login.");
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal melakukan registrasi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} mb={3}>Daftar Admin</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleRegister}>
                    <TextField fullWidth label="Email" margin="normal" required onChange={(e) => setEmail(e.target.value)} />
                    <TextField fullWidth label="Password" type="password" margin="normal" required onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, bgcolor: "#008A5E" }} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : "Daftarkan Akun"}
                    </Button>
                </form>
                <Typography mt={2}>Sudah punya akun? <Link to="/login" style={{ color: "#008A5E" }}>Login</Link></Typography>
            </Paper>
        </Container>
    );
}