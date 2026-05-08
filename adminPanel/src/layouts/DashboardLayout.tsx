import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function DashboardLayout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Nanti di sini tambahkan Navbar/Sidebar */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}