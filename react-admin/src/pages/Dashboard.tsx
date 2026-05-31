// adminPanel/src/pages/Dashboard.tsx — KPI real dari API + service health check
import { useState, useEffect } from "react";
import { Box, Typography, Paper, Avatar, Divider, Chip, CircularProgress } from "@mui/material";
import {
    PeopleAltRounded, MenuBookRounded, EmojiEventsRounded,
    StorageRounded, CheckCircleRounded, TrendingUpRounded,
    ErrorRounded, NotificationsActiveRounded,
} from "@mui/icons-material";
import { AUTH_API, NOTIF_API, COURSE_API, LAPTOP1_IP } from "../services/api";

interface ServiceHealth {
    name: string;
    type: string;
    port: string;
    host: string;
    online: boolean | null; // null = checking
}

interface RecentEnrollment {
    _id: string;
    user_email: string;
    course_title: string;
    enrolled_at: string;
}

export default function Dashboard() {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [courseCount, setCourseCount] = useState<number | null>(null);
    const [notifCount, setNotifCount] = useState<number | null>(null);
    const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
    const [services, setServices] = useState<ServiceHealth[]>([
        { name: 'API Gateway (Nginx)', type: 'Load Balancer', port: ':8080', host: LAPTOP1_IP, online: null },
        { name: 'Auth & User Service', type: 'PostgreSQL + Redis', port: ':3001', host: LAPTOP1_IP, online: null },
        { name: 'Course Service', type: 'MongoDB', port: ':3002', host: LAPTOP1_IP, online: null },
        { name: 'Notification Service', type: 'Express + PostgreSQL', port: ':8080', host: LAPTOP1_IP, online: null },
    ]);

    useEffect(() => {
        // ── Fetch jumlah siswa dari auth-service ──────────
        AUTH_API.get('/users/count')
            .then(res => setUserCount(res.data?.count ?? null))
            .catch(() => setUserCount(null));

        // ── Fetch jumlah kursus dari course-service ───────
        COURSE_API.get('/')
            .then(res => {
                const data = res.data?.data || res.data || [];
                setCourseCount(Array.isArray(data) ? data.length : null);
            })
            .catch(() => setCourseCount(null));

        // ── Fetch jumlah notifikasi dari Laptop 1 ─────────
        NOTIF_API.get('/')
            .then(res => {
                const list = res.data?.value || res.data?.data || res.data || [];
                setNotifCount(Array.isArray(list) ? list.length : null);
            })
            .catch(() => setNotifCount(null));

        // ── Fetch recent enrollments dari course-service ──
        COURSE_API.get('/enrollments')
            .then(res => {
                const data = res.data?.data || res.data || [];
                setRecentEnrollments(Array.isArray(data) ? data.slice(0, 4) : []);
            })
            .catch(() => setRecentEnrollments([]));

        // ── Health check semua service ────────────────────
        const checkService = async (idx: number, url: string, requireOk = false) => {
            try {
                const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(3000) });
                const isOnline = requireOk ? res.ok : true;
                setServices(prev => prev.map((s, i) => i === idx ? { ...s, online: isOnline } : s));
            } catch {
                setServices(prev => prev.map((s, i) => i === idx ? { ...s, online: false } : s));
            }
        };

        checkService(0, `http://${LAPTOP1_IP}:8080/auth/`, false);
        checkService(1, `http://${LAPTOP1_IP}:8080/auth/`, true);
        checkService(2, `http://${LAPTOP1_IP}:8080/courses/`, true);
        checkService(3, `http://${LAPTOP1_IP}:8080/notifications/`, true);
    }, []);

    const allOnline = services.every(s => s.online === true);
    const someOffline = services.some(s => s.online === false);
    const systemStatus = allOnline ? 'Semua Normal' : someOffline ? 'Ada Masalah' : 'Memeriksa...';
    const systemColor = allOnline ? '#16A34A' : someOffline ? '#EF4444' : '#F59E0B';
    const systemBg = allOnline ? '#DCFCE7' : someOffline ? '#FEE2E2' : '#FEF3C7';

    return (
        <Box sx={{ width: '100%', pb: 4, overflow: 'hidden' }}>

            {/* ── HEADER ───────────────────────────────────────────── */}
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

            {/* ── KPI CARDS ────────────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 3, width: '100%' }}>
                <KpiCard
                    title="Total Siswa Aktif"
                    value={userCount}
                    trend="dari auth-service"
                    icon={<PeopleAltRounded sx={{ fontSize: 28 }} />}
                    color="#3B82F6" bgColor="#EFF6FF"
                />
                <KpiCard
                    title="Materi Kursus"
                    value={courseCount}
                    trend="dari course-service"
                    icon={<MenuBookRounded sx={{ fontSize: 28 }} />}
                    color="#008A5E" bgColor="#EAF5F1"
                />
                <KpiCard
                    title="Total Notifikasi"
                    value={notifCount}
                    trend="dari notification-service"
                    icon={<NotificationsActiveRounded sx={{ fontSize: 28 }} />}
                    color="#F59E0B" bgColor="#FEF3C7"
                />
            </Box>

            {/* ── BOTTOM ROW ───────────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 3, width: '100%', alignItems: 'stretch' }}>

                {/* KIRI: Sistem Terdistribusi (live health check) */}
                <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 16 }}>
                            Sistem Terdistribusi
                        </Typography>
                        <Chip
                            icon={someOffline ? <ErrorRounded sx={{ fontSize: '16px !important' }} /> : <CheckCircleRounded sx={{ fontSize: '16px !important' }} />}
                            label={systemStatus}
                            size="small"
                            sx={{ fontWeight: 800, bgcolor: systemBg, color: systemColor, fontSize: 11, '& .MuiChip-icon': { color: systemColor } }}
                        />
                    </Box>
                    <Divider sx={{ mb: 2.5 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                        {services.map(svc => (
                            <ServiceStatus key={svc.name} name={svc.name} type={svc.type} isOnline={svc.online} port={svc.port} />
                        ))}
                    </Box>
                </Paper>

                {/* KANAN: Pendaftaran Kursus Terbaru */}
                <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 16 }}>
                            Pendaftaran Kursus Terbaru
                        </Typography>
                        <Typography
                            component="a"
                            href="/users"
                            sx={{ color: '#008A5E', fontWeight: 800, cursor: 'pointer', fontSize: 13, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Lihat Semua
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2.5 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                        {recentEnrollments.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, color: '#94a3b8', flexDirection: 'column', gap: 1 }}>
                                <EmojiEventsRounded sx={{ fontSize: 40, opacity: 0.3 }} />
                                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Memuat data enrollment...</Typography>
                            </Box>
                        ) : (
                            recentEnrollments.map(e => (
                                <ActivityItem
                                    key={e._id}
                                    email={e.user_email}
                                    course={e.course_title}
                                    time={new Date(e.enrolled_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                />
                            ))
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

// ── KPI Card ──────────────────────────────────────────────────────────
function KpiCard({ title, value, trend, icon, color, bgColor }: any) {
    return (
        <Paper elevation={0} sx={{
            p: 3.5, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff',
            position: 'relative', overflow: 'hidden', transition: 'all 0.25s ease',
            '&:hover': { boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)', transform: 'translateY(-2px)', borderColor: color + '40' }
        }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.06, color: color, transform: 'scale(4)', pointerEvents: 'none' }}>
                {icon}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: bgColor, color: color, width: 52, height: 52, borderRadius: 3 }}>{icon}</Avatar>
                <Typography sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 12 }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {value === null ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CircularProgress size={20} sx={{ color }} />
                        <Typography sx={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>Memuat...</Typography>
                    </Box>
                ) : (
                    <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: 36, lineHeight: 1, mb: 1.5 }}>
                        {value.toLocaleString('id-ID')}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981' }}>
                    <TrendingUpRounded sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{trend}</Typography>
                </Box>
            </Box>
        </Paper>
    );
}

// ── Service Status Row ─────────────────────────────────────────────────
function ServiceStatus({ name, type, isOnline, port }: { name: string; type: string; isOnline: boolean | null; port: string }) {
    const isChecking = isOnline === null;
    const dotColor = isChecking ? '#F59E0B' : isOnline ? '#10B981' : '#EF4444';
    const label = isChecking ? 'Memeriksa...' : isOnline ? 'Online' : 'Offline';

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            p: 1.5, borderRadius: 3, border: '1px solid transparent', transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: isOnline === null ? '#FEF3C7' : isOnline ? '#DCFCE7' : '#FEE2E2', width: 40, height: 40, borderRadius: 2.5 }}>
                    <StorageRounded sx={{ color: isOnline === null ? '#D97706' : isOnline ? '#16A34A' : '#EF4444', fontSize: 20 }} />
                </Avatar>
                <Box>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{name}</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, mt: 0.3 }}>{type}</Typography>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3, justifyContent: 'flex-end' }}>
                    {isChecking ? (
                        <CircularProgress size={8} sx={{ color: dotColor }} />
                    ) : (
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: dotColor, boxShadow: isOnline ? `0 0 6px ${dotColor}` : 'none' }} />
                    )}
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: dotColor }}>{label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>Port {port}</Typography>
            </Box>
        </Box>
    );
}

// ── Activity Item Row ─────────────────────────────────────────────────
function ActivityItem({ email, course, time }: { email: string; course: string; time: string }) {
    const colors = ['#008A5E', '#3B82F6', '#F59E0B', '#8B5CF6'];
    const colorIndex = (email?.charCodeAt(0) || 0) % colors.length;
    const initial = email ? email.charAt(0).toUpperCase() : '?';

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            p: 1.5, borderRadius: 3, border: '1px solid transparent', transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }
        }}>
            <Avatar sx={{ bgcolor: colors[colorIndex] + '20', color: colors[colorIndex], fontWeight: 900, fontSize: 15, width: 40, height: 40, borderRadius: 2.5, border: `1.5px solid ${colors[colorIndex]}30` }}>
                {initial}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }} noWrap>{email}</Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, mt: 0.3 }} noWrap>{course}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{time}</Typography>
            </Box>
        </Box>
    );
}