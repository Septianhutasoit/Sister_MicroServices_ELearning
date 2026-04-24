import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon,
    ListItemText, Box, CssBaseline, Avatar
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, School, People, Settings, Logout
} from '@mui/icons-material';

const drawerWidth = 260;

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Courses', icon: <School />, path: '/courses' },
        { text: 'Users', icon: <People />, path: '/users' },
        { text: 'Settings', icon: <Settings />, path: '/settings' },
    ];

    const drawer = (
        <Box>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant="h6" noWrap component="div">
                    📚 EduLearn Admin
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                                '& .MuiListItemIcon-root': { color: 'white' }
                            }
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ position: 'absolute', bottom: 20, width: '100%' }}>
                <ListItem button component={Link} to="/login">
                    <ListItemIcon><Logout /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard'}
                    </Typography>
                    <IconButton color="inherit">
                        <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}