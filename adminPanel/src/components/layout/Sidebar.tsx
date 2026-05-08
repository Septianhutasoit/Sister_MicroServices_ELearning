import { Link, useLocation } from 'react-router-dom'
import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Divider } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NotificationsIcon from '@mui/icons-material/Notifications'
import QuizIcon from '@mui/icons-material/Quiz'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'

const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { text: 'Notifications', path: '/notifications', icon: <NotificationsIcon sx={{ fontSize: 20 }} /> },
    { text: 'Quiz', path: '/quiz', icon: <QuizIcon sx={{ fontSize: 20 }} /> },
    { text: 'Tambah Materi', path: '/courses', icon: <LibraryAddIcon sx={{ fontSize: 20 }} /> },
    { text: 'Users', path: '/users', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
    { text: 'Settings', path: '/settings', icon: <SettingsIcon sx={{ fontSize: 20 }} /> },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'white',
                borderRight: '1px solid #eef2f6',
            }}
        >
            {/* LOGO + BRANDING */}
            <Box
                sx={{
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    px: 3,
                    borderBottom: '1px solid #f1f5f9',
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#0f172a',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: 18,
                        color: '#10b981',
                        mr: 1.5,
                        flexShrink: 0,
                    }}
                >
                    <HistoryEduIcon fontSize="small" sx={{ color: '#10b981' }} />
                </Box>
                <Box sx={{ fontWeight: 800, fontSize: 18, color: '#0f172a', lineHeight: 1 }}>
                    Sejarah<span style={{ color: '#059669' }}>Tekno</span>
                </Box>
            </Box>

            {/* BADGE INFO */}
            <Box sx={{ px: 2.5, pt: 2.5 }}>
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
                            fontSize: 11,
                            fontWeight: 800,
                            color: '#059669',    
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                        }}
                    >
                        E-Learning Platform
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#6ee7b7', mt: 0.5 }}>
                        Kelola sejarah teknologi
                    </Typography>
                </Box>
            </Box>

            {/* MENU LABEL */}
            <Box sx={{ px: 3, pt: 3, pb: 1 }}>
                <Typography
                    sx={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: '#cbd5e1',
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                    }}
                >
                    Main Menu
                </Typography>
            </Box>

            {/* MENU LIST */}
            <List sx={{ px: 2, flexGrow: 1, pt: 0, pb: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                    return (
                        <ListItem
                            key={item.text}
                            component={Link}
                            to={item.path}
                            onClick={onClose}
                            sx={{
                                mb: 0.5,
                                borderRadius: '12px',
                                px: 1.5,
                                py: 1,
                                transition: 'all 0.15s',
                                bgcolor: isActive ? '#059669' : 'transparent',
                                color: isActive ? 'white' : '#64748b',
                                boxShadow: isActive ? '0 4px 12px rgba(5,150,105,0.25)' : 'none',
                                '&:hover': {
                                    bgcolor: isActive ? '#047857' : '#f8fafc',
                                    color: isActive ? 'white' : '#0f172a',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 36,
                                    color: isActive ? 'rgba(255,255,255,0.85)' : '#94a3b8',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: 13.5,
                                    fontWeight: isActive ? 700 : 500,
                                }}
                            />
                        </ListItem>
                    )
                })}
            </List>

            {/* USER CARD */}
            <Box sx={{ mx: 2, mb: 2, mt: 'auto' }}>
                <Box
                    sx={{
                        bgcolor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '12px',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: '#0f172a',
                            width: 34,
                            height: 34,
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#10b981',
                        }}
                    >
                        AD
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Admin</Typography>
                        <Typography sx={{ fontSize: 10, color: '#059669', fontWeight: 700, mt: 0.4 }}>
                            SUPER ADMIN
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* LOGOUT BUTTON */}
            <Box sx={{ px: 2, pb: 3 }}>
                <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        px: 1.5,
                        py: 1,
                        color: '#94a3b8',
                        '&:hover': {
                            bgcolor: '#fff1f2',
                            color: '#ef4444',
                            '& .MuiListItemIcon-root': { color: '#ef4444' },
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: '#94a3b8' }}>
                        <LogoutIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600 }} />
                </ListItem>
            </Box>
        </Box>
    )
}