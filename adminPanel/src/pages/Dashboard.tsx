import { Box, Typography, Grid, Paper, Avatar, Divider, Chip } from "@mui/material";
import {
    PeopleAltRounded,
    MenuBookRounded,
    EmojiEventsRounded,
    StorageRounded,
    CheckCircleRounded,
    TrendingUpRounded
} from "@mui/icons-material";

export default function Dashboard() {
    return (
        // Tambahkan width 100% agar meregang penuh
        <Box sx={{ width: '100%', pb: 4 }}>

            {/* --- HEADER DASHBOARD --- */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: -0.5 }}>
                    Ringkasan Platform
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Pantau aktivitas E-Learning dan status Microservices Anda hari ini.
                </Typography>
            </Box>

            {/* --- 1. STATISTIK UTAMA (KPI CARDS) --- */}
            {/* Tambahkan width 100% pada Grid Container */}
            <Grid container spacing={3} sx={{ mb: 4, width: '100%', m: 0 }}>
                <Grid item xs={12} md={4} sx={{ pl: '0 !important' }}> {/* Hilangkan padding kiri bawaan MUI */}
                    <KpiCard
                        title="Total Siswa Aktif"
                        value="1,248"
                        trend="+12% bulan ini"
                        icon={<PeopleAltRounded sx={{ fontSize: 32 }} />}
                        color="#3B82F6"
                        bgColor="#EFF6FF"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KpiCard
                        title="Materi Kursus"
                        value="42"
                        trend="+3 kursus baru"
                        icon={<MenuBookRounded sx={{ fontSize: 32 }} />}
                        color="#008A5E"
                        bgColor="#EAF5F1"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KpiCard
                        title="Ujian Diselesaikan"
                        value="3,892"
                        trend="Akurasi kelulusan 85%"
                        icon={<EmojiEventsRounded sx={{ fontSize: 32 }} />}
                        color="#F59E0B"
                        bgColor="#FEF3C7"
                    />
                </Grid>
            </Grid>

            {/* --- 2. KONTEN BAWAH (STATUS & AKTIVITAS) --- */}
            <Grid container spacing={3} sx={{ width: '100%', m: 0, alignItems: 'stretch' }}>

                {/* KIRI: STATUS MICROSERVICES */}
                <Grid item xs={12} md={5} sx={{ pl: '0 !important' }}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                Sistem Terdistribusi
                            </Typography>
                            <Chip icon={<CheckCircleRounded />} label="Semua Normal" color="success" size="small" sx={{ fontWeight: 'bold', bgcolor: '#DCFCE7', color: '#16A34A', '& .MuiChip-icon': { color: '#16A34A' } }} />
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, justifyContent: 'center' }}>
                            <ServiceStatus name="API Gateway (Nginx)" type="Load Balancer" isOnline={true} port=":80" />
                            <ServiceStatus name="Auth & User Service" type="PostgreSQL + Redis" isOnline={true} port=":3001" />
                            <ServiceStatus name="Course Service" type="MongoDB" isOnline={true} port=":3002" />
                            <ServiceStatus name="Notification Service" type="RabbitMQ Node" isOnline={true} port=":3007" />
                        </Box>
                    </Paper>
                </Grid>

                {/* KANAN: AKTIVITAS TERBARU */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                Pendaftaran Kursus Terbaru
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#008A5E', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                Lihat Semua
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1, justifyContent: 'center' }}>
                            <ActivityItem name="Budi Santoso" email="budi@student.edu.ai" course="Mastering Node.js & Microservices" time="Baru saja" />
                            <ActivityItem name="Siti Aminah" email="siti.a@student.edu.ai" course="Flutter for Enterprise" time="10 menit lalu" />
                            <ActivityItem name="Alex Wijaya" email="alexw@student.edu.ai" course="Dasar Docker & Container" time="1 jam lalu" />
                            <ActivityItem name="Nisa Fauziah" email="nisafz@student.edu.ai" course="UI/UX Design Fundamental" time="3 jam lalu" />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// =========================================================================
// WIDGET HELPERS (Untuk merapikan kode di atas)
// =========================================================================

// Widget untuk Kartu Statistik (KPI)
function KpiCard({ title, value, trend, icon, color, bgColor }: any) {
    return (
        <Paper elevation={0} sx={{
            p: 3.5,
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' }
        }}>
            {/* Background Icon (Transparan di pojok kanan atas) - DI PERBAIKI */}
            <Box sx={{ position: 'absolute', top: -15, right: -15, opacity: 0.05, color: color, transform: 'scale(3.5)' }}>
                {icon}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: bgColor, color: color, width: 56, height: 56, borderRadius: 3 }}>
                    {icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 1, position: 'relative', zIndex: 1 }}>
                {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981', position: 'relative', zIndex: 1 }}>
                <TrendingUpRounded fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 800, fontSize: 13 }}>
                    {trend}
                </Typography>
            </Box>
        </Paper>
    );
}

// Widget untuk List Status Microservices
function ServiceStatus({ name, type, isOnline, port }: any) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 3, border: '1px solid transparent', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc', border: '1px solid #f1f5f9' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ bgcolor: isOnline ? '#DCFCE7' : '#FEE2E2', width: 42, height: 42, borderRadius: 2.5 }}>
                    <StorageRounded sx={{ color: isOnline ? '#16A34A' : '#EF4444', fontSize: 22 }} />
                </Avatar>
                <Box>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 15 }}>{name}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: 12, fontWeight: 600, mt: 0.5 }}>{type}</Typography>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, justifyContent: 'flex-end' }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isOnline ? '#10B981' : '#EF4444', boxShadow: isOnline ? '0 0 8px #10B981' : 'none' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: isOnline ? '#10B981' : '#EF4444' }}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>Port {port}</Typography>
            </Box>
        </Box>
    );
}

// Widget untuk List Aktivitas Siswa
function ActivityItem({ name, email, course, time }: any) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 1.5, borderRadius: 3, border: '1px solid transparent', transition: 'all 0.2s', '&:hover': { bgcolor: '#f8fafc', border: '1px solid #f1f5f9' } }}>
            <Avatar sx={{ bgcolor: 'linear-gradient(135deg, #008A5E 0%, #004D40 100%)', color: 'white', fontWeight: '900', width: 42, height: 42, borderRadius: 2.5 }}>
                {name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 15 }} noWrap>{name}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: 13, fontWeight: 500, mt: 0.5 }} noWrap>{email}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#008A5E' }} noWrap>{course}</Typography>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', mt: 0.5, fontWeight: 600 }}>{time}</Typography>
            </Box>
        </Box>
    );
}