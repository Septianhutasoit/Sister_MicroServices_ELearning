import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// Menu disesuaikan dengan arsitektur Microservices E-Learning
const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { text: 'Data Siswa', path: '/users', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
    { text: 'Kelola Kursus', path: '/courses', icon: <SchoolIcon sx={{ fontSize: 20 }} /> },
    { text: 'Data Ujian', path: '/exams', icon: <AssignmentIcon sx={{ fontSize: 20 }} /> },
    { text: 'Notifikasi (Event)', path: '/notifications', icon: <NotificationsActiveIcon sx={{ fontSize: 20 }} /> },
    { text: 'Pengaturan', path: '/settings', icon: <SettingsIcon sx={{ fontSize: 20 }} /> },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Arahkan kembali ke halaman Login
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: '#ffffff',
                borderRight: '1px solid #f1f5f9',
            }}
        >
            {/* --- LOGO & BRANDING --- */}
            <Box
                sx={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    px: 3,
                    borderBottom: '1px solid #f8fafc',
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#008A5E',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: 20,
                        color: 'white',
                        mr: 1.5,
                        boxShadow: '0 4px 10px rgba(0, 138, 94, 0.3)',
                    }}
                >
                    E
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: 20, color: '#1e293b', letterSpacing: -0.5 }}>
                    EduLearn<span style={{ color: '#008A5E', fontWeight: 400 }}>.AI</span>
                </Typography>
            </Box>

            {/* --- BADGE INFO --- */}
            <Box sx={{ px: 2.5, pt: 3 }}>
                <Box
                    sx={{
                        bgcolor: '#F0FDF8',
                        border: '1px solid #BBF7D0',
                        borderRadius: '12px',
                        px: 2,
                        py: 1.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: '#008A5E',
                            letterSpacing: 1.2,
                            textTransform: 'uppercase',
                        }}
                    >
                        IT DEL MICROSERVICES
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#059669', mt: 0.5, fontWeight: 500 }}>
                        Admin System Panel
                    </Typography>
                </Box>
            </Box>

            {/* --- MENU LABEL --- */}
            <Box sx={{ px: 3, pt: 4, pb: 1 }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#94a3b8',
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                    }}
                >
                    Menu Utama
                </Typography>
            </Box>

            {/* --- MENU LIST --- */}
            <List sx={{ px: 2, flexGrow: 1, pt: 0, pb: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <ListItem
                            key={item.text}
                            component={Link}
                            to={item.path}
                            onClick={onClose}
                            sx={{
                                mb: 0.5,
                                borderRadius: '12px',
                                px: 2,
                                py: 1.2,
                                transition: 'all 0.2s',
                                bgcolor: isActive ? '#008A5E' : 'transparent',
                                color: isActive ? 'white' : '#64748b',
                                boxShadow: isActive ? '0 4px 12px rgba(0, 138, 94, 0.25)' : 'none',
                                '&:hover': {
                                    bgcolor: isActive ? '#007A53' : '#f8fafc',
                                    color: isActive ? 'white' : '#0f172a',
                                    '& .MuiListItemIcon-root': { color: isActive ? 'white' : '#008A5E' },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: isActive ? 'rgba(255,255,255,0.9)' : '#94a3b8',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: isActive ? 700 : 500,
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>

            {/* --- LOGOUT BUTTON --- */}
            <Box sx={{ px: 2, pb: 3, mt: 2 }}>
                <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        px: 2,
                        py: 1.5,
                        color: '#64748b',
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: '#fef2f2',
                            color: '#ef4444',
                            '& .MuiListItemIcon-root': { color: '#ef4444' },
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: '#94a3b8' }}>
                        <LogoutIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="Keluar Aplikasi" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
                </ListItem>
            </Box>
        </Box>
    );
}