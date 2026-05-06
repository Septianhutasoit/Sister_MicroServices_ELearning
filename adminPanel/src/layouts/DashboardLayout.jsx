import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon,
    ListItemText, Box, CssBaseline, Avatar, InputBase
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, School, People, Settings, Logout,
    Assignment, NotificationsActive, Search, Notifications
} from '@mui/icons-material';

const drawerWidth = 280; // Diperlebar sedikit agar lebih elegan

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Mapping Menu Sesuai Microservices Backend
    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Data Siswa', icon: <People />, path: '/users' },
        { text: 'Kelola Kursus', icon: <School />, path: '/courses' },
        { text: 'Data Ujian', icon: <Assignment />, path: '/exams' },
        { text: 'Notifikasi', icon: <NotificationsActive />, path: '/notifications' },
        { text: 'Pengaturan', icon: <Settings />, path: '/settings' },
    ];

    // --- BAGIAN SIDEBAR (KIRI) ---
    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* LOGO AREA */}
            <Toolbar sx={{ height: 80, display: 'flex', alignItems: 'center', px: 3, borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ bgcolor: '#008A5E', color: 'white', p: 1, borderRadius: 2, mr: 2, fontWeight: 'bold' }}>
                    E
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#333' }}>
                    E-Learning<span style={{ color: '#008A5E' }}>.AI</span>
                </Typography>
            </Toolbar>

            {/* INFO BADGE */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ bgcolor: '#EAF5F1', p: 1.5, borderRadius: 2, border: '1px solid #BCE3D5' }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 'bold', color: '#008A5E', letterSpacing: 1 }}>
                        IT DEL MICROSERVICES
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
                        Admin System Panel
                    </Typography>
                </Box>
            </Box>

            {/* MENU LIST */}
            <List sx={{ px: 2, flexGrow: 1 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 'bold', color: '#aaa', mb: 1, ml: 2, letterSpacing: 1 }}>
                    MENU UTAMA
                </Typography>
                {menuItems.map((item) => {
                    const isSelected = location.pathname.includes(item.path);
                    return (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                            selected={isSelected}
                            sx={{
                                mb: 1,
                                borderRadius: '12px', // Menu melengkung seperti gambar
                                transition: 'all 0.2s',
                                color: isSelected ? 'white' : '#555',
                                '&.Mui-selected': {
                                    backgroundColor: '#008A5E',
                                    boxShadow: '0 4px 12px rgba(0, 138, 94, 0.3)', // Efek bayangan hijau
                                    '&:hover': { backgroundColor: '#00754e' },
                                    '& .MuiListItemIcon-root': { color: 'white' }
                                },
                                '&:hover:not(.Mui-selected)': {
                                    backgroundColor: '#f5f5f5',
                                    color: '#008A5E',
                                    '& .MuiListItemIcon-root': { color: '#008A5E' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'white' : '#888' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontSize: 14, fontWeight: isSelected ? 600 : 500 }}
                            />
                        </ListItem>
                    );
                })}
            </List>

            {/* LOGOUT BUTTON */}
            <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0' }}>
                <ListItem
                    button
                    component={Link}
                    to="/"
                    sx={{ borderRadius: '12px', color: '#666', '&:hover': { bgcolor: '#ffebee', color: '#d32f2f', '& .MuiListItemIcon-root': { color: '#d32f2f' } } }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}><Logout /></ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', bgcolor: '#F4F7F6', minHeight: '100vh' }}> {/* Background abu-abu bersih */}
            <CssBaseline />

            {/* --- HEADER (ATAS) --- */}
            <AppBar
                position="fixed"
                elevation={0} // Hilangkan bayangan bawaan MUI
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white', // Header warna putih
                    borderBottom: '1px solid #f0f0f0',
                    color: '#333'
                }}
            >
                <Toolbar sx={{ height: 80 }}>
                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>

                    {/* Judul Halaman Dinamis */}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                        <span style={{ borderLeft: '4px solid #008A5E', paddingLeft: '12px' }}>
                            {menuItems.find(i => location.pathname.includes(i.path))?.text || 'Dashboard'}
                        </span>
                    </Typography>

                    {/* Menu Kanan Header (Search, Notif, Profile) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', bgcolor: '#f5f5f5', px: 2, py: 0.5, borderRadius: '20px' }}>
                            <Search sx={{ color: '#888', mr: 1, fontSize: 20 }} />
                            <InputBase placeholder="Global search..." sx={{ fontSize: 14 }} />
                        </Box>

                        <IconButton>
                            <Notifications sx={{ color: '#666' }} />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 2, borderLeft: '1px solid #ddd' }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#008A5E', fontWeight: 'bold' }}>AD</Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 'bold', lineHeight: 1 }}>Admin Utama</Typography>
                                <Typography sx={{ fontSize: 10, color: '#008A5E', fontWeight: 'bold', mt: 0.5 }}>SUPER ADMIN</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* --- DRAWER (RESPONSIVE) --- */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none' } }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none' } }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* --- KONTEN UTAMA --- */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar sx={{ height: 20 }} /> {/* Spacer agar tidak tertutup header */}
                <Outlet />
            </Box>
        </Box>
    );
}