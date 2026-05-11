import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, IconButton, InputBase,
    Avatar, Menu, MenuItem, Divider, Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// Map path → label halaman (Disesuaikan dengan E-Learning)
const PAGE_LABELS: Record<string, string> = {
    '/dashboard': 'Dashboard Utama',
    '/users': 'Manajemen Siswa',
    '/courses': 'Kelola Kursus',
    '/exams': 'Data Ujian & Nilai',
    '/notifications': 'Riwayat Notifikasi',
    '/settings': 'Pengaturan Sistem',
};

export default function Navbar({ onMenuClick, onLogout }: { onMenuClick?: () => void, onLogout?: () => void }) {
    const location = useLocation();

    // Cari judul halaman berdasarkan URL saat ini
    const pageLabel = Object.entries(PAGE_LABELS).find(([key]) =>
        location.pathname.startsWith(key)
    )?.[1] || 'Dashboard';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const profileOpen = Boolean(anchorEl);

    // Fungsi internal untuk logout jika onLogout tidak dikirim dari luar
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    };

    return (
        <Box sx={{
            height: 80, // Tinggi disamakan dengan header Sidebar
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
                sx={{
                    display: { md: 'none' },
                    bgcolor: '#f8fafc', borderRadius: '10px',
                    p: 1,
                }}
            >
                <MenuIcon sx={{ fontSize: 22, color: '#64748b' }} />
            </IconButton>

            {/* ── Judul Halaman Dinamis ─────────────────────────────────────── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <Box sx={{
                    width: 5, height: 24, bgcolor: '#008A5E',
                    borderRadius: 4,
                }} />
                <Box sx={{
                    fontWeight: 900, fontSize: 18,
                    color: '#1e293b', textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }}>
                    {pageLabel}
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* ── Search Bar Modern ─────────────────────────────────────────── */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center', gap: 1,
                bgcolor: '#f8fafc', border: '1px solid transparent',
                px: 2, py: 1, borderRadius: '100px',
                transition: 'all 0.2s',
                '&:hover': { border: '1px solid #e2e8f0' },
            }}>
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                <InputBase
                    placeholder="Cari materi atau siswa..."
                    sx={{ fontSize: 14, color: '#334155', width: 220, fontWeight: 500 }}
                />
            </Box>

            {/* ── Tombol Notifikasi ──────────────────────────────────── */}
            <IconButton sx={{
                bgcolor: '#F0FDF8',
                border: '1px solid #BBF7D0',
                borderRadius: '14px', p: 1.2, ml: 2,
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#DCFCE7' },
            }}>
                <Badge badgeContent={2} color="error" sx={{
                    '& .MuiBadge-badge': { fontSize: 10, minWidth: 18, height: 18, fontWeight: 'bold' }
                }}>
                    <NotificationsIcon sx={{ fontSize: 22, color: '#008A5E' }} />
                </Badge>
            </IconButton>

            {/* ── Profil Admin (Dropdown Trigger) ──────────────────────────────────── */}
            <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    pl: 3, ml: 1, borderLeft: '2px solid #f1f5f9',
                    cursor: 'pointer',
                    '&:hover .dropdown-icon': { color: '#008A5E' }
                }}
            >
                <Avatar sx={{
                    width: 40, height: 40,
                    bgcolor: 'linear-gradient(135deg, #008A5E 0%, #004D40 100%)',
                    fontSize: 14, fontWeight: 800,
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0, 138, 94, 0.3)'
                }}>AD</Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box sx={{ fontSize: 14, fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
                        Admin Utama
                    </Box>
                    <Box sx={{ fontSize: 10, color: '#008A5E', fontWeight: 800, mt: 0.2, letterSpacing: 0.5 }}>
                        SUPER ADMIN
                    </Box>
                </Box>
                <KeyboardArrowDownIcon className="dropdown-icon" sx={{
                    fontSize: 20, color: '#94a3b8',
                    transform: profileOpen ? 'rotate(180deg)' : 'none',
                    transition: 'all 0.2s',
                }} />
            </Box>

            {/* ── Dropdown Menu Profil ───────────────────────────────── */}
            <Menu
                anchorEl={anchorEl}
                open={profileOpen}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    sx: {
                        mt: 2, width: 240,
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{
                    bgcolor: '#f8fafc', px: 2.5, py: 2,
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    borderBottom: '1px solid #f1f5f9'
                }}>
                    <Avatar sx={{
                        width: 36, height: 36,
                        bgcolor: 'rgba(0,138,94,0.15)',
                        fontSize: 13, fontWeight: 800, color: '#008A5E',
                    }}>AD</Avatar>
                    <Box>
                        <Box sx={{ fontSize: 14, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                            Admin Utama
                        </Box>
                        <Box sx={{ fontSize: 11, color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                            admin@edulearn.ai
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ p: 1 }}>
                    <MenuItem
                        onClick={() => { setAnchorEl(null); /* Navigate to settings */ }}
                        sx={{ borderRadius: '10px', fontSize: 14, fontWeight: 600, gap: 1.5, color: '#475569', py: 1.2 }}
                    >
                        <SettingsIcon sx={{ fontSize: 18, color: '#008A5E' }} />
                        Pengaturan Sistem
                    </MenuItem>

                    <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

                    <MenuItem
                        onClick={() => { setAnchorEl(null); handleLogout(); }}
                        sx={{
                            borderRadius: '10px', fontSize: 14, fontWeight: 700,
                            gap: 1.5, color: '#ef4444', py: 1.2,
                            '&:hover': { bgcolor: '#fef2f2' },
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 18 }} />
                        Keluar Akun
                    </MenuItem>
                </Box>
            </Menu>
        </Box>
    );
}