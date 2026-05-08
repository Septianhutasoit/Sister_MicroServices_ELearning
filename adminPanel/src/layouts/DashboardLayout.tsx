import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

const drawerWidth = 260

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#EDF5F2' }}>

            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                border: 'none',
                                boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
                            }
                        }}
                    >
                        <Sidebar onClose={() => setMobileOpen(false)} />
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                border: 'none',
                                borderRight: '1px solid #f1f5f9',
                            }
                        }}
                        open
                    >
                        <Sidebar />
                    </Drawer>
                )}
            </Box>

            {/* ── MAIN CONTENT ────────────────────────────────────────── */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minWidth: 0,
            }}>
                {/* Header */}
                <Navbar
                    onMenuClick={() => setMobileOpen(true)}
                    onLogout={handleLogout}
                    pathname={location.pathname}
                />

                {/* Page Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        p: 3,
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}