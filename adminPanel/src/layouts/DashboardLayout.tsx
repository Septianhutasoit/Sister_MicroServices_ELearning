import { Outlet, useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function DashboardLayout() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#F4F7F6' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: '#333' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, color: '#008A5E' }}>E-Learn.AI</Typography>
                    <Button color="inherit" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                <Outlet /> {/* Halaman (Dashboard, Siswa, dll) muncul di sini */}
            </Box>
        </Box>
    );
}