import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";

// Import halaman-halaman Admin Panel
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/courses";
import Users from "./pages/users";
import Quiz from "./pages/quiz";
import Notifications from "./pages/notifiications";
import Settings from "./pages/settings";
import Register from "./pages/register";

import { Box, Typography, Button, Container, Grid, useTheme, CssBaseline, keyframes } from "@mui/material";
import { School, ArrowForward, AutoAwesome, Speed, Security, Storage, Language, Code } from "@mui/icons-material";

// --- ANIMASI CSS ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 138, 94, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(0, 138, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 138, 94, 0); }
`;


const LandingPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC', overflow: 'hidden', position: 'relative' }}>
      <CssBaseline />

      {/* --- BACKGROUND PATTERN --- */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.5,
        backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
        backgroundSize: '30px 30px'
      }} />

      {/* --- HEADER NAVBAR --- */}
      <Box sx={{
        width: '100%', py: 2, px: { xs: 3, md: 8 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.4)',
        position: 'fixed', top: 0, zIndex: 50
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ bgcolor: '#008A5E', color: 'white', p: 0.8, borderRadius: 2, boxShadow: '0 4px 10px rgba(0,138,94,0.3)' }}>
            <School fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0F172A', letterSpacing: -0.5 }}>
            EduLearn<span style={{ color: '#008A5E', fontWeight: 400 }}>.AI</span>
          </Typography>
        </Box>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" sx={{
            borderRadius: 10, textTransform: 'none', fontWeight: 700, px: 3,
            borderColor: '#008A5E', color: '#008A5E',
            '&:hover': { borderWidth: 1, bgcolor: '#EAF5F1' }
          }}>
            Admin Login
          </Button>
        </Link>
      </Box>

      {/* --- HERO SECTION --- */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pt: { xs: 12, md: 8 }, zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">

          {/* SISI KIRI: TEKS & TOMBOL CTA */}
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' }, zIndex: 2 }}>

            {/* Badge Kecil */}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: 10, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <AutoAwesome sx={{ fontSize: 16, color: '#F59E0B' }} />
              <Typography sx={{ color: '#475569', fontWeight: 800, fontSize: 12, letterSpacing: 0.5 }}>
                SISTEM TERDISTRIBUSI v2.0
              </Typography>
            </Box>

            {/* Judul Utama (Sesuai Permintaan) */}
            <Typography variant="h1" sx={{ fontWeight: 900, color: '#0F172A', lineHeight: 1.1, mb: 2, letterSpacing: -1.5, fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' } }}>
              EduLearn<span style={{ color: '#008A5E' }}>.AI</span>
            </Typography>

            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1E293B', mb: 3, fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Platform Belajar <br sx={{ display: { xs: 'none', md: 'block' } }} />
              <span style={{ background: 'linear-gradient(to right, #008A5E, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Microservices
              </span>
            </Typography>

            {/* Deskripsi */}
            <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500, mb: 5, lineHeight: 1.7, maxWidth: 500, mx: { xs: 'auto', md: 0 }, fontSize: '1.1rem' }}>
              Pusat kendali administrator untuk mengelola kursus, siswa, dan evaluasi dengan aman, cepat, dan mudah diskalakan.
            </Typography>

            {/* Tombol Utama (Sesuai Permintaan) */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: '#008A5E', px: { xs: 4, md: 5 }, py: 1.8, borderRadius: 3, fontSize: 16, fontWeight: 800, textTransform: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,138,94,0.4)',
                    '&:hover': { bgcolor: '#006E4D', transform: 'translateY(-3px)', boxShadow: '0 15px 30px -5px rgba(0,138,94,0.5)' },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Masuk sebagai Admin
                </Button>
              </Link>
            </Box>

            {/* Tech Stack Indicator */}
            <Box sx={{ display: 'flex', gap: 4, justifyContent: { xs: 'center', md: 'flex-start' }, mt: 6, opacity: 0.7 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Speed sx={{ color: '#0F172A' }} /> <Typography variant="caption" fontWeight={700}>Kinerja Tinggi</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Security sx={{ color: '#008A5E' }} /> <Typography variant="caption" fontWeight={700}>Aman & Terenkripsi</Typography></Box>
            </Box>
          </Grid>

          {/* SISI KANAN: ILUSTRASI MICROSERVICES (ANIMATED) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', height: 600 }}>

            {/* Lingkaran Dekoratif */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,138,94,0.08) 0%, rgba(248,250,252,0) 70%)', zIndex: 0 }} />

            {/* Dashboard Mockup (Tengah) */}
            <Box sx={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 320, height: 220, bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)',
              borderRadius: 4, border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', zIndex: 2, p: 2.5,
              animation: `${float} 6s ease-in-out infinite`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                <Box sx={{ width: 120, height: 14, bgcolor: '#E2E8F0', borderRadius: 4 }} />
                <Box sx={{ width: 40, height: 14, bgcolor: '#008A5E', borderRadius: 4 }} />
              </Box>
              <Grid container spacing={1.5}>
                <Grid item xs={4}><Box sx={{ height: 65, bgcolor: '#F1F5F9', borderRadius: 2 }} /></Grid>
                <Grid item xs={4}><Box sx={{ height: 65, bgcolor: '#F1F5F9', borderRadius: 2 }} /></Grid>
                <Grid item xs={4}><Box sx={{ height: 65, bgcolor: '#F1F5F9', borderRadius: 2 }} /></Grid>
                <Grid item xs={12}><Box sx={{ height: 50, bgcolor: '#F1F5F9', borderRadius: 2, mt: 1 }} /></Grid>
              </Grid>
            </Box>

            {/* Node 1: Auth Service */}
            <Box sx={{
              position: 'absolute', top: '12%', left: '8%', width: 150, p: 1.5,
              bgcolor: 'white', borderRadius: 3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
              zIndex: 3, animation: `${float} 5s ease-in-out infinite 1s`, border: '1px solid #F1F5F9'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: '#FFF1F2', borderRadius: 2, color: '#E11D48' }}><Security fontSize="small" /></Box>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>Auth Service</Typography>
                  <Typography sx={{ fontSize: 9, color: '#10B981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', animation: `${pulseGlow} 2s infinite` }}></span> Active
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Node 2: Course Service */}
            <Box sx={{
              position: 'absolute', top: '22%', right: '2%', width: 150, p: 1.5,
              bgcolor: 'white', borderRadius: 3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
              zIndex: 3, animation: `${float} 7s ease-in-out infinite 0.5s`, border: '1px solid #F1F5F9'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: '#F0FDF4', borderRadius: 2, color: '#16A34A' }}><School fontSize="small" /></Box>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>Course Service</Typography>
                  <Typography sx={{ fontSize: 9, color: '#64748B' }}><Storage sx={{ fontSize: 10, verticalAlign: 'middle', mr: 0.5 }} />MongoDB</Typography>
                </Box>
              </Box>
            </Box>

            {/* Node 3: API Gateway */}
            <Box sx={{
              position: 'absolute', bottom: '12%', left: '28%', width: 170, p: 1.5,
              bgcolor: '#0F172A', borderRadius: 3, boxShadow: '0 20px 30px -5px rgba(15,23,42,0.4)',
              zIndex: 4, animation: `${float} 6s ease-in-out infinite 2s`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, color: '#38BDF8' }}><Language fontSize="small" /></Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'white' }}>API Gateway</Typography>
                  <Typography sx={{ fontSize: 10, color: '#94A3B8' }}><Code sx={{ fontSize: 10, verticalAlign: 'middle', mr: 0.5 }} />Nginx Proxy</Typography>
                </Box>
              </Box>
            </Box>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};


// =====================================================================
// MAIN APP ROUTER
// =====================================================================
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 1. RUTE PUBLIK */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. RUTE LOGIN KHUSUS ADMIN */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* 👈 RUTE BARU UNTUK REGISTER */}

        {/* 3. RUTE ADMIN PANEL (Dibungkus Layout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/users" element={<Users />} />
          <Route path="/exams" element={<Quiz />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} /> {/* 👈 BUG DIPERBAIKI: Menggunakan <Settings /> */}
        </Route>

        {/* 4. RUTE FALLBACK (404 Not Found) */}
        <Route path="*" element={
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#F4F7F6' }}>
            <Typography sx={{ fontSize: '8rem', fontWeight: 900, color: '#008A5E', opacity: 0.1, lineHeight: 1 }}>404</Typography>
            <Typography sx={{ color: '#475569', mt: 2, fontWeight: 700, fontSize: '1.2rem' }}>Halaman tidak ditemukan.</Typography>
            <Link to="/" style={{ textDecoration: 'none', marginTop: '24px' }}>
              <Button variant="outlined" sx={{ borderRadius: 10, borderColor: '#008A5E', color: '#008A5E', fontWeight: 700, px: 4, py: 1.5, '&:hover': { bgcolor: '#EAF5F1' } }}>
                Kembali ke Beranda
              </Button>
            </Link>
          </Box>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;