import { Box, Typography, Grid, Paper, Avatar, Divider, Chip, useTheme, alpha, LinearProgress } from "@mui/material";
import {
    PeopleAltRounded,
    MenuBookRounded,
    EmojiEventsRounded,
    StorageRounded,
    CheckCircleRounded,
    TrendingUpRounded,
    AccessTimeRounded,
    SchoolRounded,
    AssignmentRounded,
    Router,
    Database,
    CloudQueue,
    Security,
} from "@mui/icons-material";

export default function Dashboard() {
    const theme = useTheme();

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#F8FAFC', p: 3 }}>
            {/* --- HEADER DASHBOARD --- */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: -0.5 }}>
                    Dashboard Utama
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Pantau aktivitas E-Learning dan status Microservices Anda hari ini.
                </Typography>
            </Box>

            {/* --- STATISTIK UTAMA (4 KPI CARDS) --- */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="TOTAL SISWA AKTIF"
                        value="1,248"
                        trend="+12%"
                        trendText="bulan ini"
                        icon={<PeopleAltRounded sx={{ fontSize: 28 }} />}
                        color="#3B82F6"
                        bgColor="#EFF6FF"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="MATERI KURSUS"
                        value="42"
                        trend="+3"
                        trendText="kursus baru"
                        icon={<MenuBookRounded sx={{ fontSize: 28 }} />}
                        color="#008A5E"
                        bgColor="#EAF5F1"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="UJIAN DISELESAIKAN"
                        value="3,892"
                        trend="85%"
                        trendText="kelulusan"
                        icon={<EmojiEventsRounded sx={{ fontSize: 28 }} />}
                        color="#F59E0B"
                        bgColor="#FEF3C7"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="TINGKAT KEPUASAN"
                        value="94%"
                        trend="+5%"
                        trendText="dari bulan lalu"
                        icon={<TrendingUpRounded sx={{ fontSize: 28 }} />}
                        color="#8B5CF6"
                        bgColor="#F3E8FF"
                    />
                </Grid>
            </Grid>

            {/* --- KONTEN UTAMA (2 KOLOM SEIMBANG) --- */}
            <Grid container spacing={3}>
                {/* KIRI: STATUS MICROSERVICES */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                        bgcolor: 'background.paper'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StorageRounded sx={{ color: '#008A5E' }} />
                                Sistem Terdistribusi
                            </Typography>
                            <Chip
                                icon={<CheckCircleRounded sx={{ fontSize: 16 }} />}
                                label="Semua Normal"
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    bgcolor: alpha('#008A5E', 0.1),
                                    color: '#008A5E',
                                    '& .MuiChip-icon': { color: '#008A5E' }
                                }}
                            />
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <ServiceStatus
                                name="API Gateway"
                                type="Nginx Load Balancer"
                                isOnline={true}
                                port=":80"
                                icon={<Router />}
                            />
                            <ServiceStatus
                                name="Auth & User Service"
                                type="PostgreSQL + Redis"
                                isOnline={true}
                                port=":3001"
                                icon={<Security />}
                            />
                            <ServiceStatus
                                name="Course Service"
                                type="MongoDB"
                                isOnline={true}
                                port=":3002"
                                icon={<Database />}
                            />
                            <ServiceStatus
                                name="Quiz Service"
                                type="PostgreSQL"
                                isOnline={true}
                                port=":3003"
                                icon={<AssignmentRounded />}
                            />
                            <ServiceStatus
                                name="Notification Service"
                                type="RabbitMQ + Node.js"
                                isOnline={true}
                                port=":3007"
                                icon={<CloudQueue />}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* KANAN: PENDAFTARAN KURSUS TERBARU */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                        bgcolor: 'background.paper'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTimeRounded sx={{ color: '#008A5E' }} />
                                Pendaftaran Kursus Terbaru
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#008A5E',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline', color: '#006E4D' }
                                }}
                            >
                                Lihat Semua →
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <ActivityItem
                                name="Budi Santoso"
                                email="budi@student.edu.ai"
                                course="Mastering Node.js & Microservices"
                                time="Baru saja"
                                avatarColor="#3B82F6"
                            />
                            <ActivityItem
                                name="Siti Aminah"
                                email="siti.a@student.edu.ai"
                                course="Flutter for Enterprise"
                                time="10 menit lalu"
                                avatarColor="#008A5E"
                            />
                            <ActivityItem
                                name="Alex Wijaya"
                                email="alexw@student.edu.ai"
                                course="Dasar Docker & Container"
                                time="1 jam lalu"
                                avatarColor="#F59E0B"
                            />
                            <ActivityItem
                                name="Nisa Fauziah"
                                email="nisafz@student.edu.ai"
                                course="UI/UX Design Fundamental"
                                time="2 jam lalu"
                                avatarColor="#8B5CF6"
                            />
                            <ActivityItem
                                name="Rizki Pratama"
                                email="rizkip@student.edu.ai"
                                course="React.js Mastery"
                                time="3 jam lalu"
                                avatarColor="#10B981"
                            />
                            <ActivityItem
                                name="Dewi Anggraeni"
                                email="dewi@student.edu.ai"
                                course="Backend Development with Node.js"
                                time="5 jam lalu"
                                avatarColor="#DC2626"
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* BOTTOM: STATISTIK KURSUS PER BULAN - FULL WIDTH */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        bgcolor: 'background.paper'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUpRounded sx={{ color: '#008A5E' }} />
                                Statistik Pendaftaran Kursus (6 Bulan Terakhir)
                            </Typography>
                            <Chip
                                label="Tahun 2024"
                                size="small"
                                sx={{ fontWeight: 600, bgcolor: alpha('#008A5E', 0.1), color: '#008A5E' }}
                            />
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ width: '100%', overflowX: 'auto' }}>
                            <Box sx={{ minWidth: 600 }}>
                                <MonthlyStats />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* BOTTOM RIGHT: KURSUS POPULER */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                        bgcolor: 'background.paper'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolRounded sx={{ color: '#008A5E' }} />
                                Kursus Paling Populer
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#008A5E',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Kelola Kursus →
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {popularCourses.map((course, index) => (
                                <PopularCourseItem key={index} {...course} />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* BOTTOM LEFT: AKTIVITAS SISTEM */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                        bgcolor: 'background.paper'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StorageRounded sx={{ color: '#008A5E' }} />
                                Status Database & Storage
                            </Typography>
                            <Chip
                                label="Live"
                                size="small"
                                sx={{ fontWeight: 600, bgcolor: alpha('#10B981', 0.1), color: '#10B981' }}
                            />
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <DatabaseStatus
                                name="PostgreSQL (User Data)"
                                usage={65}
                                status="healthy"
                                size="2.4 GB / 3.7 GB"
                            />
                            <DatabaseStatus
                                name="MongoDB (Course Content)"
                                usage={82}
                                status="warning"
                                size="4.1 GB / 5.0 GB"
                            />
                            <DatabaseStatus
                                name="Redis Cache"
                                usage={45}
                                status="healthy"
                                size="450 MB / 1.0 GB"
                            />
                            <DatabaseStatus
                                name="File Storage (Media)"
                                usage={58}
                                status="healthy"
                                size="5.8 GB / 10 GB"
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// =========================================================================
// WIDGET COMPONENTS
// =========================================================================

// Kartu Statistik KPI
function KpiCard({ title, value, trend, trendText, icon, color, bgColor }: any) {
    return (
        <Paper elevation={0} sx={{
            p: 2.5,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            transition: 'all 0.3s ease',
            height: '100%',
            '&:hover': {
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                transform: 'translateY(-2px)',
                borderColor: color,
            }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', letterSpacing: 0.5, display: 'block', mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                        {value}
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: bgColor, color: color, width: 48, height: 48, borderRadius: 2 }}>
                    {icon}
                </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <TrendingUpRounded sx={{ fontSize: 14, color: '#10B981' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10B981' }}>
                    {trend}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', ml: 0.5 }}>
                    {trendText}
                </Typography>
            </Box>
        </Paper>
    );
}

// Status Microservices
function ServiceStatus({ name, type, isOnline, port, icon }: any) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc' }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: isOnline ? alpha('#008A5E', 0.1) : alpha('#EF4444', 0.1), width: 40, height: 40, borderRadius: 2 }}>
                    {icon}
                </Avatar>
                <Box>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{name}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: 11, fontWeight: 500, mt: 0.5 }}>{type}</Typography>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Chip
                    label={isOnline ? 'Online' : 'Offline'}
                    size="small"
                    sx={{
                        bgcolor: isOnline ? alpha('#008A5E', 0.1) : alpha('#EF4444', 0.1),
                        color: isOnline ? '#008A5E' : '#EF4444',
                        fontWeight: 600,
                        fontSize: 11,
                        height: 24,
                        mb: 0.5,
                    }}
                />
                <Typography sx={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{port}</Typography>
            </Box>
        </Box>
    );
}

// Aktivitas Pendaftaran
function ActivityItem({ name, email, course, time, avatarColor }: any) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc' }
        }}>
            <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40, borderRadius: 2 }}>
                {name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }} noWrap>
                    {name}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: 12, mt: 0.5 }} noWrap>
                    {email}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', maxWidth: '40%' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#008A5E' }} noWrap>
                    {course}
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#94a3b8', mt: 0.5 }}>
                    {time}
                </Typography>
            </Box>
        </Box>
    );
}

// Kursus Populer Item
function PopularCourseItem({ title, students, rating, progress, color }: any) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc' }
        }}>
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>
                        {title}
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: color }}>
                        {progress}%
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#e2e8f0',
                        mb: 1,
                        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 }
                    }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleAltRounded sx={{ fontSize: 12, color: '#94a3b8' }} />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {students} siswa
                    </Typography>
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Rating: {rating}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

// Database Status
function DatabaseStatus({ name, usage, status, size }: any) {
    const statusColor = status === 'healthy' ? '#10B981' : '#F59E0B';
    const statusBg = status === 'healthy' ? alpha('#10B981', 0.1) : alpha('#F59E0B', 0.1);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
                    {name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#64748b' }}>
                    {size}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={usage}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#e2e8f0',
                    mb: 0.5,
                    '& .MuiLinearProgress-bar': { bgcolor: statusColor, borderRadius: 3 }
                }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Used {usage}%
                </Typography>
                <Chip
                    label={status === 'healthy' ? 'Healthy' : 'Warning'}
                    size="small"
                    sx={{ bgcolor: statusBg, color: statusColor, fontSize: 10, height: 20, fontWeight: 600 }}
                />
            </Box>
        </Box>
    );
}

// Statistik Bulanan
function MonthlyStats() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    const data = [45, 52, 68, 84, 95, 112];
    const maxValue = Math.max(...data);

    return (
        <Box>
            <Grid container spacing={2}>
                {months.map((month, index) => (
                    <Grid item xs={2} key={index}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                                {month}
                            </Typography>
                            <Box
                                sx={{
                                    height: 120,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    mb: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: `${(data[index] / maxValue) * 100}%`,
                                        bgcolor: '#008A5E',
                                        borderRadius: 2,
                                        transition: 'height 0.3s ease',
                                        '&:hover': {
                                            bgcolor: '#006E4D',
                                            transform: 'scaleX(1.05)',
                                        }
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                {data[index]}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Jumlah Pendaftar Baru per Bulan
                </Typography>
            </Box>
        </Box>
    );
}

// Data untuk kursus populer
const popularCourses = [
    { title: "React.js Mastery", students: 1234, rating: 4.8, progress: 75, color: "#3B82F6" },
    { title: "UI/UX Design Principles", students: 892, rating: 4.9, progress: 62, color: "#008A5E" },
    { title: "Backend Development", students: 567, rating: 4.7, progress: 45, color: "#F59E0B" },
    { title: "Flutter Mobile Apps", students: 734, rating: 4.6, progress: 60, color: "#8B5CF6" },
];