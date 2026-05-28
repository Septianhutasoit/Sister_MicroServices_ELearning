// adminPanel/src/pages/users.tsx - Terhubung ke auth-service API nyata
import { useState, useEffect, useCallback } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Avatar,
    IconButton, Tooltip, TextField, InputAdornment, Button,
    CircularProgress, Snackbar, Alert, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Divider
} from "@mui/material";
import { Search, Delete, PersonAddAlt1, Refresh, VerifiedUser } from "@mui/icons-material";
import { AUTH_API } from "../services/api";

interface User {
    id: number | string;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog konfirmasi hapus
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    const [deleting, setDeleting] = useState(false);

    // Snackbar
    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success',
    });

    const fetchUsers = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await AUTH_API.get('/users');
            const data: User[] = res.data?.data || res.data || [];
            setUsers(data);
        } catch (err) {
            console.warn('[Admin Users] Gagal fetch dari auth-service:', err);
            setSnack({ open: true, message: 'Gagal memuat data siswa dari server.', severity: 'error' });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleDelete = async () => {
        if (!deleteDialog.user) return;
        setDeleting(true);
        try {
            await AUTH_API.delete(`/users/${deleteDialog.user.id}`);
            setSnack({ open: true, message: `User ${deleteDialog.user.name} berhasil dihapus.`, severity: 'success' });
            setDeleteDialog({ open: false, user: null });
            fetchUsers(true);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Gagal menghapus user.';
            setSnack({ open: true, message: msg, severity: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const studentCount = users.filter(u => u.role === 'student').length;
    const adminCount = users.filter(u => u.role === 'admin').length;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';
    const colors = ['#008A5E', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];
    const getColor = (name: string) => colors[(name?.charCodeAt(0) || 0) % colors.length];

    return (
        <Box sx={{ pb: 4 }}>
            {/* ── HEADER ─────────────────────────────────────────────── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box sx={{ width: 4, height: 28, bgcolor: '#008A5E', borderRadius: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: -0.5 }}>
                            Manajemen Siswa
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#64748b', pl: '20px' }}>
                        Data real dari Auth Service · PostgreSQL ({users.length} pengguna terdaftar)
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Tooltip title="Refresh data">
                        <IconButton
                            onClick={() => fetchUsers(true)}
                            disabled={refreshing}
                            sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}
                        >
                            <Refresh sx={{ fontSize: 20, color: '#64748b' }} />
                        </IconButton>
                    </Tooltip>
                    <TextField
                        size="small"
                        placeholder="Cari nama atau email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 }, minWidth: 220 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<PersonAddAlt1 />}
                        href="/register"
                        sx={{ bgcolor: '#008A5E', fontWeight: 'bold', textTransform: 'none', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,138,94,0.2)', '&:hover': { bgcolor: '#006E4D' } }}
                    >
                        Tambah Siswa
                    </Button>
                </Box>
            </Box>

            {/* ── STAT CARDS ─────────────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                {[
                    { label: 'Total Pengguna', value: users.length, color: '#3B82F6', bg: '#EFF6FF' },
                    { label: 'Siswa Aktif', value: studentCount, color: '#008A5E', bg: '#EAF5F1' },
                    { label: 'Admin', value: adminCount, color: '#F59E0B', bg: '#FEF3C7' },
                ].map(stat => (
                    <Paper key={stat.label} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                            {stat.label}
                        </Typography>
                        <Typography sx={{ fontSize: 32, fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                            {loading ? '...' : stat.value}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            {/* ── TABEL SISWA ─────────────────────────────────────────── */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', width: '5%' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', width: '35%' }}>Profil Pengguna</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Tanggal Daftar</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>Tindakan</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={32} sx={{ color: '#008A5E' }} />
                                    <Typography sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>Memuat dari auth-service...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {searchTerm ? 'Tidak ada pengguna yang cocok.' : 'Belum ada pengguna terdaftar.'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.map((user, idx) => (
                            <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ fontWeight: 700, color: '#94a3b8', fontSize: 13 }}>
                                    {idx + 1}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: getColor(user.name) + '20', color: getColor(user.name), fontWeight: 'bold', width: 40, height: 40, borderRadius: 2.5, border: `1.5px solid ${getColor(user.name)}30` }}>
                                            {getInitial(user.name)}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{user.name}</Typography>
                                            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{user.email}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={<VerifiedUser sx={{ fontSize: '14px !important' }} />}
                                        label={user.role === 'admin' ? 'Admin' : 'Siswa'}
                                        size="small"
                                        sx={{
                                            fontWeight: 700, borderRadius: 1.5,
                                            bgcolor: user.role === 'admin' ? '#FEF3C7' : '#DCFCE7',
                                            color: user.role === 'admin' ? '#D97706' : '#16A34A',
                                            '& .MuiChip-icon': { color: 'inherit' }
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: 14 }}>
                                    {formatDate(user.created_at)}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Hapus Permanen">
                                        <IconButton
                                            onClick={() => setDeleteDialog({ open: true, user })}
                                            sx={{ color: '#EF4444', bgcolor: '#FEE2E2', '&:hover': { bgcolor: '#FECACA' } }}
                                            size="small"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ── DIALOG KONFIRMASI HAPUS ──────────────────────────── */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })} PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#1e293b' }}>Konfirmasi Hapus User</DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin ingin menghapus akun <strong>{deleteDialog.user?.name}</strong> ({deleteDialog.user?.email}) secara permanen? Tindakan ini tidak dapat dibatalkan.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setDeleteDialog({ open: false, user: null })} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b', borderRadius: 2 }}>
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleDelete}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Delete />}
                        sx={{ bgcolor: '#EF4444', textTransform: 'none', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: '#DC2626' } }}
                    >
                        {deleting ? 'Menghapus...' : 'Hapus Permanen'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── SNACKBAR ────────────────────────────────────────── */}
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}