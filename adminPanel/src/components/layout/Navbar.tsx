import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
    Box, IconButton, InputBase,
    Avatar, Menu, MenuItem, Divider, Badge
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import StorageIcon from '@mui/icons-material/Storage'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'

// Map path → label halaman
const PAGE_LABELS = {
    '/dashboard': 'Dashboard',
    '/reservations': 'Reservations',
    '/patients': 'Daftar Pasien',
    '/doctors': 'Manajemen Dokter',
    '/schedules': 'Manajemen Jadwal',
    '/knowledge': 'AI Knowledge',
    '/services': 'Layanan Klinik',
    '/settings': 'Pengaturan',
}

export default function Navbar({ onMenuClick, onLogout, pathname }) {
    const location = useLocation()
    const currentPath = pathname || location.pathname
    const pageLabel = Object.entries(PAGE_LABELS).find(([key]) =>
        currentPath.startsWith(key)
    )?.[1] || 'Dashboard'

    const [anchorEl, setAnchorEl] = useState(null)
    const profileOpen = Boolean(anchorEl)

    return (
        <Box sx={{
            height: 72,
            bgcolor: 'white',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center',
            px: 3, gap: 2,
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
                <MenuIcon sx={{ fontSize: 20, color: '#64748b' }} />
            </IconButton>

            {/* ── Page Title ─────────────────────────────────────── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                <Box sx={{
                    width: 4, height: 22, bgcolor: '#059669',
                    borderRadius: 4,
                }} />
                <Box sx={{
                    fontWeight: 900, fontSize: 15,
                    color: '#0f172a', textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }}>
                    {pageLabel}
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* ── Search ─────────────────────────────────────────── */}
            <Box sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center', gap: 1,
                bgcolor: '#F0FDF8', border: '1px solid #BBF7D0',
                px: 2, py: 0.8, borderRadius: '12px',
            }}>
                <SearchIcon sx={{ color: '#059669', fontSize: 18 }} />
                <InputBase
                    placeholder="Global search..."
                    sx={{ fontSize: 13, color: '#334155', width: 160 }}
                />
            </Box>

            {/* ── Sync AI Button ─────────────────────────────────── */}
            <Box
                component="button"
                sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center', gap: 1,
                    bgcolor: '#059669', color: 'white',
                    border: 'none', cursor: 'pointer',
                    px: 2.5, py: 1, borderRadius: '12px',
                    fontSize: 12, fontWeight: 800,
                    letterSpacing: 0.5,
                    boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#047857' },
                }}
            >
                <StorageIcon sx={{ fontSize: 16 }} />
                SYNC AI
            </Box>

            {/* ── Notifications ──────────────────────────────────── */}
            <IconButton sx={{
                bgcolor: '#F0FDF8',
                border: '1px solid #BBF7D0',
                borderRadius: '12px', p: 1,
                '&:hover': { bgcolor: '#DCFCE7' },
            }}>
                <Badge badgeContent={3} color="error" sx={{
                    '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 }
                }}>
                    <NotificationsIcon sx={{ fontSize: 20, color: '#059669' }} />
                </Badge>
            </IconButton>

            {/* ── Admin Profile ──────────────────────────────────── */}
            <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    pl: 2, borderLeft: '1px solid #f1f5f9',
                    cursor: 'pointer',
                }}
            >
                <Avatar sx={{
                    width: 36, height: 36,
                    bgcolor: '#0A1C14',
                    fontSize: 12, fontWeight: 800,
                    color: '#10b981',
                }}>AD</Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                        ADMIN
                    </Box>
                    <Box sx={{ fontSize: 10, color: '#059669', fontWeight: 700, mt: 0.4 }}>
                        SUPER ADMIN
                    </Box>
                </Box>
                <KeyboardArrowDownIcon sx={{
                    fontSize: 18, color: '#94a3b8',
                    transform: profileOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                }} />
            </Box>

            {/* ── Profile Dropdown ───────────────────────────────── */}
            <Menu
                anchorEl={anchorEl}
                open={profileOpen}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    sx: {
                        mt: 1.5, width: 200,
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                        overflow: 'hidden',
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Header dropdown */}
                <Box sx={{
                    bgcolor: '#0A1C14', px: 2, py: 2,
                    display: 'flex', alignItems: 'center', gap: 1.5,
                }}>
                    <Avatar sx={{
                        width: 34, height: 34,
                        bgcolor: 'rgba(16,185,129,0.2)',
                        fontSize: 12, fontWeight: 800, color: '#10b981',
                    }}>AD</Avatar>
                    <Box>
                        <Box sx={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1 }}>
                            Admin
                        </Box>
                        <Box sx={{ fontSize: 10, color: '#10b981', mt: 0.4 }}>
                            admin@klinik.ai
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ p: 0.75 }}>
                    <MenuItem
                        onClick={() => setAnchorEl(null)}
                        sx={{ borderRadius: '10px', fontSize: 13, fontWeight: 500, gap: 1.5, color: '#475569' }}
                    >
                        <SettingsIcon sx={{ fontSize: 17, color: '#059669' }} />
                        Pengaturan
                    </MenuItem>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem
                        onClick={() => { setAnchorEl(null); onLogout() }}
                        sx={{
                            borderRadius: '10px', fontSize: 13, fontWeight: 600,
                            gap: 1.5, color: '#ef4444',
                            '&:hover': { bgcolor: '#fff1f2' },
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 17 }} />
                        Logout
                    </MenuItem>
                </Box>
            </Menu>
        </Box>
    )
}