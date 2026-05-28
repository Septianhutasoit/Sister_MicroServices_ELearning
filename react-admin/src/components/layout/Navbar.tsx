// adminPanel/src/components/layout/Navbar.tsx — Badge notifikasi real dari API
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box, IconButton, InputBase,
    Avatar, Menu, MenuItem, Divider, Badge, Popover, Typography,
    List, ListItem, ListItemText, ListItemAvatar, Button, CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { NOTIF_API } from '../../services/api';

// Map path → label halaman
const PAGE_LABELS: Record<string, string> = {
    '/dashboard': 'Dashboard Utama',
    '/users': 'Manajemen Siswa',
    '/courses': 'Kelola Kursus',
    '/exams': 'Data Ujian & Nilai',
    '/notifications': 'Riwayat Notifikasi',
    '/settings': 'Pengaturan Sistem',
};

interface Notification {
    id: number;
    user_id: string;
    message: string;
    status: 'unread' | 'read';
    created_at: string;
}

export default function Navbar({ onMenuClick, onLogout }: { onMenuClick?: () => void, onLogout?: () => void }) {
    const location = useLocation();
    const navigate = useNavigate();

    const pageLabel = Object.entries(PAGE_LABELS).find(([key]) =>
        location.pathname.startsWith(key)
    )?.[1] || 'Dashboard';

    // Profile dropdown
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const profileOpen = Boolean(anchorEl);

    // Notification popover
    const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
    const notifOpen = Boolean(notifAnchorEl);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notifLoading, setNotifLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        setNotifLoading(true);
        try {
            const res = await NOTIF_API.get('/notifications');
            let list: Notification[] = [];
            if (Array.isArray(res.data)) list = res.data;
            else if (res.data?.value) list = res.data.value;
            else if (res.data?.data) list = res.data.data;
            setNotifications(list);
            setUnreadCount(list.filter(n => n.status === 'unread').length);
        } catch {
            // Gagal fetch, biarkan badge 0
        } finally {
            setNotifLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    };

    const recentNotifs = notifications.slice(0, 5);

    return (
        <Box sx={{
            height: 80,
            bgcolor: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center',
            px: 4, gap: 2,
            flexShrink: 0,
            position: 'sticky', top: 0, zIndex: 100,
        }}>

            {/* Mobile hamburger */}
            <IconButton
                onClick={onMenuClick}
                sx={{ display: { md: 'none' }, bgcolor: '#f8fafc', borderRadius: '10px', p: 1 }}
            >
                <MenuIcon sx={{ fontSize: 22, color: '#64748b' }} />
            </IconButton>

            {/* ── Judul Halaman Dinamis ─────────────────────────── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <Box sx={{ width: 5, height: 24, bgcolor: '#008A5E', borderRadius: 4 }} />
                <Box sx={{ fontWeight: 900, fontSize: 18, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {pageLabel}
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* ── Search Bar ──────────────────────────────────── */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center', gap: 1,
                bgcolor: '#f8fafc', border: '1px solid transparent',
                px: 2, py: 1, borderRadius: '100px',
                transition: 'all 0.2s',
                '&:hover': { border: '1px solid #e2e8f0' },
            }}>
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                <InputBase placeholder="Cari materi atau siswa..." sx={{ fontSize: 14, color: '#334155', width: 220, fontWeight: 500 }} />
            </Box>

            {/* ── Tombol Notifikasi dengan Popover ──────────────── */}
            <IconButton
                onClick={(e) => { setNotifAnchorEl(e.currentTarget); fetchNotifications(); }}
                sx={{
                    bgcolor: '#F0FDF8', border: '1px solid #BBF7D0',
                    borderRadius: '14px', p: 1.2, ml: 2,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#DCFCE7' },
                }}
            >
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 18, height: 18, fontWeight: 'bold' } }}>
                    <NotificationsIcon sx={{ fontSize: 22, color: '#008A5E' }} />
                </Badge>
            </IconButton>

            {/* Popover Notifikasi */}
            <Popover
                open={notifOpen}
                anchorEl={notifAnchorEl}
                onClose={() => setNotifAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: 360, mt: 1.5 } }}
            >
                <Box sx={{ px: 2.5, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: 15 }}>
                        Notifikasi
                        {unreadCount > 0 && (
                            <Box component="span" sx={{ ml: 1, px: 1, py: 0.2, bgcolor: '#EF4444', color: 'white', borderRadius: 5, fontSize: 11, fontWeight: 900 }}>
                                {unreadCount} baru
                            </Box>
                        )}
                    </Typography>
                    <Button size="small" onClick={() => { setNotifAnchorEl(null); navigate('/notifications'); }} sx={{ textTransform: 'none', fontWeight: 700, color: '#008A5E', fontSize: 12 }}>
                        Lihat Semua
                    </Button>
                </Box>

                {notifLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} sx={{ color: '#008A5E' }} />
                    </Box>
                ) : recentNotifs.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 1 }}>
                        <NotificationsNoneIcon sx={{ fontSize: 40, color: '#e2e8f0' }} />
                        <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>Tidak ada notifikasi</Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {recentNotifs.map((n, idx) => (
                            <Box key={n.id}>
                                <ListItem alignItems="flex-start" sx={{ px: 2.5, py: 1.5, bgcolor: n.status === 'unread' ? '#F0FDF8' : 'transparent', '&:hover': { bgcolor: '#f8fafc' } }}>
                                    <ListItemAvatar sx={{ minWidth: 40 }}>
                                        <Avatar sx={{ width: 34, height: 34, bgcolor: n.status === 'unread' ? '#D1FAE5' : '#F1F5F9', borderRadius: 2 }}>
                                            <NotificationsNoneIcon sx={{ fontSize: 16, color: n.status === 'unread' ? '#008A5E' : '#94a3b8' }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
                                                {n.message}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 11, color: '#94a3b8' }} />
                                                <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>
                                                    {new Date(n.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                                </Typography>
                                                <Typography sx={{ fontSize: 11, color: '#64748b', ml: 1 }}>• {n.user_id}</Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {idx < recentNotifs.length - 1 && <Divider sx={{ mx: 2.5 }} />}
                            </Box>
                        ))}
                    </List>
                )}
            </Popover>

            {/* ── Profil Admin ─────────────────────────────────── */}
            <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    pl: 3, ml: 1, borderLeft: '2px solid #f1f5f9',
                    cursor: 'pointer',
                    '&:hover .dropdown-icon': { color: '#008A5E' }
                }}
            >
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#008A5E', fontSize: 14, fontWeight: 800, color: 'white', boxShadow: '0 2px 8px rgba(0, 138, 94, 0.3)' }}>
                    AD
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box sx={{ fontSize: 14, fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>Admin Utama</Box>
                    <Box sx={{ fontSize: 10, color: '#008A5E', fontWeight: 800, mt: 0.2, letterSpacing: 0.5 }}>SUPER ADMIN</Box>
                </Box>
                <KeyboardArrowDownIcon className="dropdown-icon" sx={{ fontSize: 20, color: '#94a3b8', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'all 0.2s' }} />
            </Box>

            {/* Dropdown Menu Profil */}
            <Menu
                anchorEl={anchorEl}
                open={profileOpen}
                onClose={() => setAnchorEl(null)}
                slotProps={{ paper: { sx: { mt: 2, width: 240, borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', overflow: 'hidden' } } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ bgcolor: '#f8fafc', px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(0,138,94,0.15)', fontSize: 13, fontWeight: 800, color: '#008A5E' }}>AD</Avatar>
                    <Box>
                        <Box sx={{ fontSize: 14, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>Admin Utama</Box>
                        <Box sx={{ fontSize: 11, color: '#64748b', mt: 0.5, fontWeight: 500 }}>admin@edulearn.ai</Box>
                    </Box>
                </Box>
                <Box sx={{ p: 1 }}>
                    <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }} sx={{ borderRadius: '10px', fontSize: 14, fontWeight: 600, gap: 1.5, color: '#475569', py: 1.2 }}>
                        <SettingsIcon sx={{ fontSize: 18, color: '#008A5E' }} /> Pengaturan Sistem
                    </MenuItem>
                    <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />
                    <MenuItem onClick={() => { setAnchorEl(null); handleLogout(); }} sx={{ borderRadius: '10px', fontSize: 14, fontWeight: 700, gap: 1.5, color: '#ef4444', py: 1.2, '&:hover': { bgcolor: '#fef2f2' } }}>
                        <LogoutIcon sx={{ fontSize: 18 }} /> Keluar Akun
                    </MenuItem>
                </Box>
            </Menu>
        </Box>
    );
}