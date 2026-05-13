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

import { Box, Typography, Button, Container, Grid, useTheme, CssBaseline, keyframes, alpha } from "@mui/material";
import { School, ArrowForward, AutoAwesome, Speed, Security, Storage, Language, Code } from "@mui/icons-material";

// --- ANIMASI CSS (Tanpa Library Tambahan) ---
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

// =====================================================================
// LANDING PAGE MODERN, ENTERPRISE, & MICROSERVICES-THEMED
// =====================================================================
const LandingPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC', overflow: 'hidden', position: 'relative' }}>
      <CssBaseline />

      {/* --- BACKGROUND PATTERN (Modern Dot Grid) --- */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.4,
        backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      {/* --- HEADER NAVBAR --- */}
      <Box sx={{ 
        width: '100%', py: 2.5, px: { xs: 3, md: 8 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.3)',
        position: 'fixed', top: 0, zIndex: 50 
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ bgcolor: '#008A5E', color: 'white', p: 1, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,138,94,0.3)' }}>
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
            Admin Panel
          </Button>
        </Link>
      </Box>

      {/* --- HERO SECTION --- */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pt: { xs: 14, md: 10 }, zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">

          {/* SISI KIRI: KONTEN TEKS */}
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' }, zIndex: 2 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: 10, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <AutoAwesome sx={{ fontSize: 16, color: '#F59E0B' }} />
              <Typography sx={{ color: '#475569', fontWeight: 700, fontSize: 12, letterSpacing: 0.5 }}>
                SISTEM TERDISTRIBUSI v2.0
              </Typography>
            </Box>

            <Typography variant="h1" sx={{ fontWeight: 900, color: '#0F172A', lineHeight: 1.1, mb: 2, letterSpacing: -1.5, fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.2rem' } }}>
              Pusat Kendali <br />
              <span style={{ 
                background: 'linear-gradient(to right, #008A5E, #3B82F6)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
              }}>
                Microservices
              </span>
            </Typography>

            <Typography variant="h6" sx={{ color: '#64748B', fontWeight: 500, mb: 5, lineHeight: 1.6, maxWidth: 540, mx: { xs: 'auto', md: 0 }, fontSize: { xs: '1rem', md: '1.1rem' } }}>
              Kelola ekosistem E-Learning Anda dari satu tempat. Didukung oleh arsitektur <strong style={{ color: '#0F172A' }}>Polyglot Database</strong> dan <strong style={{ color: '#0F172A' }}>RabbitMQ</strong> untuk performa maksimal.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  endIcon={<ArrowForward />}
                  sx={{ 
                    bgcolor: '#008A5E', px: 4, py: 1.8, borderRadius: 3, fontSize: 15, fontWeight: 800, textTransform: 'none',
                    boxShadow: '0 10px 20px -5px rgba(0,138,94,0.4)',
                    '&:hover': { bgcolor: '#006E4D', transform: 'translateY(-2px)', boxShadow: '0 15px 25px -5px rgba(0,138,94,0.5)' },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Masuk Administrator
                </Button>
              </Link>
            </Box>

            {/* Tech Stack Indicator */}
            <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' }, mt: 6, opacity: 0.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Storage sx={{ color: '#336791' }}/> <Typography variant="caption" fontWeight={700}>PostgreSQL</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Storage sx={{ color: '#4DB33D' }}/> <Typography variant="caption" fontWeight={700}>MongoDB</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Code sx={{ color: '#FF6600' }}/> <Typography variant="caption" fontWeight={700}>RabbitMQ</Typography></Box>
            </Box>
          </Grid>

          {/* SISI KANAN: ILUSTRASI MICROSERVICES (ANIMATED) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', height: 600 }}>
            
            {/* Lingkaran Dekoratif Utama */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,138,94,0.1) 0%, rgba(248,250,252,0) 70%)', zIndex: 0 }} />

            {/* Dashboard Mockup (Center) */}
            <Box sx={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
              width: 320, height: 200, bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)',
              borderRadius: 4, border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', zIndex: 2, p: 2,
              animation: `${float} 6s ease-in-out infinite` 
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ width: 100, height: 12, bgcolor: '#E2E8F0', borderRadius: 4 }} />
                <Box sx={{ width: 30, height: 12, bgcolor: '#008A5E', borderRadius: 4 }} />
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={4}><Box sx={{ height: 60, bgcolor: '#F1F5F9', borderRadius: 2 }} /></Grid>
                <Grid item xs={4}><Box sx={{ height: 60, bgcolor: '#F1F5F9', borderRadius: 2 }} /></Grid>
                <Grid item xs={4}><Box sx={{ height: 60, bgcolor: '#F1F5F9', borderRadius: 2 }} /></Grid>
                <Grid item xs={12}><Box sx={{ height: 50, bgcolor: '#F1F5F9', borderRadius: 2, mt: 1 }} /></Grid>
              </Grid>
            </Box>

            {/* Node 1: Auth Service (Kiri Atas) */}
            <Box sx={{ 
              position: 'absolute', top: '15%', left: '10%', width: 140, p: 1.5,
              bgcolor: 'white', borderRadius: 3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
              zIndex: 3, animation: `${float} 5s ease-in-out infinite 1s`, border: '1px solid #F1F5F9'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: '#FFF1F2', borderRadius: 2, color: '#E11D48' }}><Security fontSize="small"/></Box>
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#0F172A' }}>Auth Service</Typography>
                  <Typography sx={{ fontSize: 8, color: '#10B981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', animation: `${pulseGlow} 2s infinite` }}></span> Active
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Node 2: Course Service (Kanan Atas) */}
            <Box sx={{ 
              position: 'absolute', top: '25%', right: '5%', width: 140, p: 1.5,
              bgcolor: 'white', borderRadius: 3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
              zIndex: 3, animation: `${float} 7s ease-in-out infinite 0.5s`, border: '1px solid #F1F5F9'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: '#F0FDF4', borderRadius: 2, color: '#16A34A' }}><School fontSize="small"/></Box>
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#0F172A' }}>Course Service</Typography>
                  <Typography sx={{ fontSize: 8, color: '#64748B' }}>MongoDB</Typography>
                </Box>
              </Box>
            </Box>

            {/* Node 3: API Gateway (Bawah Tengah) */}
            <Box sx={{ 
              position: 'absolute', bottom: '15%', left: '30%', width: 160, p: 1.5,
              bgcolor: '#0F172A', borderRadius: 3, boxShadow: '0 15px 30px -5px rgba(15,23,42,0.3)',
              zIndex: 4, animation: `${float} 6s ease-in-out infinite 2s`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, color: '#38BDF8' }}><Language fontSize="small"/></Box>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'white' }}>API Gateway</Typography>
                  <Typography sx={{ fontSize: 9, color: '#94A3B8' }}>Nginx Load Balancer</Typography>
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/users" element={<Users />} />
          <Route path="/exams" element={<Quiz />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<div className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100"><h1 className="text-2xl font-extrabold text-slate-800">Pengaturan Sistem</h1><div className="w-12 h-1 bg-[#008A5E] rounded-full mt-3 mb-6"></div></div>} />
        </Route>

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