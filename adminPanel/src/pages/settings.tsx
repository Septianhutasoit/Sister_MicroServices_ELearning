import { Box, Typography, Paper, Grid, TextField, Button, Switch, FormControlLabel, Divider } from "@mui/material";
import { Save, CloudSync } from "@mui/icons-material";

export default function Settings() {
    return (
        <Box sx={{ pb: 4, height: '100%' }}>
            {/* HEADER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: -0.5 }}>
                        Pengaturan Sistem
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Konfigurasi koneksi Microservices dan manajemen profil admin.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    sx={{ bgcolor: '#008A5E', fontWeight: 'bold', textTransform: 'none', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#006E4D' } }}
                >
                    Simpan Perubahan
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* KIRI: PENGATURAN PROFIL */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>Profil Administrator</Typography>
                        <TextField fullWidth label="Nama Lengkap" defaultValue="Admin Utama" sx={{ mb: 3 }} />
                        <TextField fullWidth label="Alamat Email" defaultValue="admin@edulearn.ai" sx={{ mb: 3 }} />
                        <TextField fullWidth label="Password Baru" type="password" placeholder="Biarkan kosong jika tidak ingin mengubah" sx={{ mb: 3 }} />
                    </Paper>
                </Grid>

                {/* KANAN: KONFIGURASI MICROSERVICES */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <CloudSync sx={{ color: '#008A5E' }} />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Koneksi API Gateway</Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="URL Gateway Utama (Laptop 1)"
                            defaultValue="http://172.27.65.26/api"
                            helperText="Pastikan IP ini sama dengan yang ada di Flutter Mobile."
                            sx={{ mb: 4 }}
                        />

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>Fitur Sistem</Typography>
                        <FormControlLabel control={<Switch defaultChecked color="success" />} label="Aktifkan Notifikasi RabbitMQ" sx={{ display: 'block', mb: 1 }} />
                        <FormControlLabel control={<Switch defaultChecked color="success" />} label="Izinkan Pendaftaran Siswa Baru" sx={{ display: 'block', mb: 1 }} />
                        <FormControlLabel control={<Switch color="error" />} label="Mode Pemeliharaan (Maintenance)" sx={{ display: 'block' }} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}