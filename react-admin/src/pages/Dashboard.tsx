import { Box, Typography, Paper, Avatar, Divider, Chip } from "@mui/material";
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
        <Box sx={{ width: '100%', pb: 4, overflow: 'hidden' }}>

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box sx={{ width: 4, height: 28, bgcolor: '#008A5E', borderRadius: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -0.5 }}>
                        Ringkasan Platform
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#64748b', pl: '20px' }}>
                    Pantau aktivitas E-Learning dan status Microservices Anda hari ini.
                </Typography>
            </Box>

            {/* ── 1. KPI CARDS ───────────────────────────────────────────── */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 3,
                mb: 3,
                width: '100%',
            }}>
                <KpiCard
                    title="Total Siswa Aktif"
                    value="1,248"
                    trend="+12% bulan ini"
                    icon={<PeopleAltRounded sx={{ fontSize: 28 }} />}
                    color="#3B82F6"
                    bgColor="#EFF6FF"
                />
                <KpiCard
                    title="Materi Kursus"
                    value="42"
                    trend="+3 kursus baru"
                    icon={<MenuBookRounded sx={{ fontSize: 28 }} />}
                    color="#008A5E"
                    bgColor="#EAF5F1"
                />
                <KpiCard
                    title="Ujian Diselesaikan"
                    value="3,892"
                    trend="Akurasi kelulusan 85%"
                    icon={<EmojiEventsRounded sx={{ fontSize: 28 }} />}
                    color="#F59E0B"
                    bgColor="#FEF3C7"
                />
            </Box>

            {/* ── 2. BOTTOM ROW ──────────────────────────────────────────── */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '5fr 7fr',
                gap: 3,
                width: '100%',
                alignItems: 'stretch',
            }}>

                {/* KIRI: Sistem Terdistribusi */}
                <Paper elevation={0} sx={{
                    p: 3.5,
                    borderRadius: 4,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fff',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 16 }}>
                            Sistem Terdistribusi
                        </Typography>
                        <Chip
                            icon={<CheckCircleRounded sx={{ fontSize: '16px !important' }} />}
                            label="Semua Normal"
                            size="small"
                            sx={{
                                fontWeight: 800,
                                bgcolor: '#DCFCE7',
                                color: '#16A34A',
                                fontSize: 11,
                                '& .MuiChip-icon': { color: '#16A34A' }
                            }}
                        />
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                        <ServiceStatus name="API Gateway (Nginx)" type="Load Balancer" isOnline={true} port=":80" />
                        <ServiceStatus name="Auth & User Service" type="PostgreSQL + Redis" isOnline={true} port=":3001" />
                        <ServiceStatus name="Course Service" type="MongoDB" isOnline={true} port=":3002" />
                        <ServiceStatus name="Notification Service" type="RabbitMQ Node" isOnline={true} port=":3007" />
                    </Box>
                </Paper>

                {/* KANAN: Pendaftaran Kursus Terbaru */}
                <Paper elevation={0} sx={{
                    p: 3.5,
                    borderRadius: 4,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fff',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 16 }}>
                            Pendaftaran Kursus Terbaru
                        </Typography>
                        <Typography sx={{
                            color: '#008A5E', fontWeight: 800, cursor: 'pointer', fontSize: 13,
                            '&:hover': { textDecoration: 'underline' }
                        }}>
                            Lihat Semua
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                        <ActivityItem name="Budi Santoso" email="budi@student.edu.ai" course="Mastering Node.js & Microservices" time="Baru saja" />
                        <ActivityItem name="Siti Aminah" email="siti.a@student.edu.ai" course="Flutter for Enterprise" time="10 menit lalu" />
                        <ActivityItem name="Alex Wijaya" email="alexw@student.edu.ai" course="Dasar Docker & Container" time="1 jam lalu" />
                        <ActivityItem name="Nisa Fauziah" email="nisafz@student.edu.ai" course="UI/UX Design Fundamental" time="3 jam lalu" />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

// ── KPI Card ──────────────────────────────────────────────────────────────
function KpiCard({ title, value, trend, icon, color, bgColor }: any) {
    return (
        <Paper elevation={0} sx={{
            p: 3.5,
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            bgcolor: '#fff',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.25s ease',
            '&:hover': {
                boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)',
                transform: 'translateY(-2px)',
                borderColor: color + '40',
            }
        }}>
            {/* Ikon besar transparan pojok kanan */}
            <Box sx={{
                position: 'absolute', top: -10, right: -10,
                opacity: 0.06, color: color, transform: 'scale(4)',
                pointerEvents: 'none',
            }}>
                {icon}
            </Box>

            {/* Ikon + Label */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: bgColor, color: color, width: 52, height: 52, borderRadius: 3 }}>
                    {icon}
                </Avatar>
                <Typography sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 12 }}>
                    {title}
                </Typography>
            </Box>

            {/* Angka */}
            <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: 36, lineHeight: 1, mb: 1.5, position: 'relative', zIndex: 1 }}>
                {value}
            </Typography>

            {/* Trend */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981', position: 'relative', zIndex: 1 }}>
                <TrendingUpRounded sx={{ fontSize: 18 }} />
                <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{trend}</Typography>
            </Box>
        </Paper>
    );
}

// ── Service Status Row ────────────────────────────────────────────────────
function ServiceStatus({ name, type, isOnline, port }: any) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            p: 1.5, borderRadius: 3,
            border: '1px solid transparent',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: isOnline ? '#DCFCE7' : '#FEE2E2', width: 40, height: 40, borderRadius: 2.5 }}>
                    <StorageRounded sx={{ color: isOnline ? '#16A34A' : '#EF4444', fontSize: 20 }} />
                </Avatar>
                <Box>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{name}</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, mt: 0.3 }}>{type}</Typography>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3, justifyContent: 'flex-end' }}>
                    <Box sx={{
                        width: 7, height: 7, borderRadius: '50%',
                        bgcolor: isOnline ? '#10B981' : '#EF4444',
                        boxShadow: isOnline ? '0 0 6px #10B981' : 'none'
                    }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: isOnline ? '#10B981' : '#EF4444' }}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
                    Port {port}
                </Typography>
            </Box>
        </Box>
    );
}

// ── Activity Item Row ─────────────────────────────────────────────────────
function ActivityItem({ name, email, course, time }: any) {
    const colors = ['#008A5E', '#3B82F6', '#F59E0B', '#8B5CF6'];
    const colorIndex = name.charCodeAt(0) % colors.length;

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            p: 1.5, borderRadius: 3,
            border: '1px solid transparent',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }
        }}>
            <Avatar sx={{
                bgcolor: colors[colorIndex] + '20',
                color: colors[colorIndex],
                fontWeight: 900, fontSize: 15,
                width: 40, height: 40, borderRadius: 2.5,
                border: `1.5px solid ${colors[colorIndex]}30`,
            }}>
                {name.charAt(0)}
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }} noWrap>
                    {name}
                </Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, mt: 0.3 }} noWrap>
                    {email}
                </Typography>
            </Box>

            <Box sx={{ textAlign: 'right', flexShrink: 0, maxWidth: 160 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#008A5E' }} noWrap>
                    {course}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', mt: 0.3, fontWeight: 600 }}>
                    {time}
                </Typography>
            </Box>
        </Box>
    );
}