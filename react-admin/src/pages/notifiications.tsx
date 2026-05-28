// adminPanel/src/pages/Notifications.tsx
import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, CardContent, List, ListItem, ListItemText,
    ListItemAvatar, Avatar, Chip, Tabs, Tab, Badge, Button, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress, Snackbar, Alert, IconButton, Tooltip,
} from '@mui/material';
import {
    Notifications as BellIcon,
    Send as SendIcon,
    Refresh as RefreshIcon,
    CheckCircle as CheckIcon,
    NotificationsNone as EmptyIcon,
    Campaign as BroadcastIcon,
    PersonPin as PersonIcon,
    AccessTime as TimeIcon,
} from '@mui/icons-material';
import { NOTIF_API } from '../services/api';

interface Notification {
    id: number;
    user_id: string;
    message: string;
    status: 'unread' | 'read';
    created_at: string;
}

export default function Notifications() {
    const [tabValue, setTabValue] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // State dialog kirim notifikasi
    const [openDialog, setOpenDialog] = useState(false);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [targetUser, setTargetUser] = useState('');
    const [sending, setSending] = useState(false);

    // State snackbar
    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success',
    });

    const fetchNotifications = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await NOTIF_API.get('/notifications');
            let list: Notification[] = [];
            if (Array.isArray(res.data)) list = res.data;
            else if (res.data?.value) list = res.data.value;
            else if (res.data?.data) list = res.data.data;

            // Sync dengan localStorage read state
            const readRaw = localStorage.getItem('admin_read_notif_ids');
            const readIds = readRaw ? JSON.parse(readRaw) : [];
            const mappedList = list.map(n => ({
                ...n,
                status: readIds.includes(n.id) ? 'read' : (n.status as 'read' | 'unread')
            }));

            setNotifications(mappedList);
        } catch (err) {
            console.warn('[Admin Notif] Gagal fetch:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => fetchNotifications(true), 20000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleMarkAllRead = async () => {
        const readRaw = localStorage.getItem('admin_read_notif_ids');
        const readIds = readRaw ? JSON.parse(readRaw) : [];
        const newReadIds = Array.from(new Set([...readIds, ...notifications.map(n => n.id)]));
        localStorage.setItem('admin_read_notif_ids', JSON.stringify(newReadIds));

        setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
        setSnack({ open: true, message: 'Semua notifikasi ditandai telah dibaca.', severity: 'success' });
    };

    const handleSendBroadcast = async () => {
        if (!broadcastMsg.trim()) return;
        setSending(true);
        try {
            // POST ke notif service Laptop 1 (gateway 10.206.80.189:8080)
            await NOTIF_API.post('/notifications', {
                user_id: targetUser.trim() || 'all',
                message: broadcastMsg.trim(),
            });
            setSnack({ open: true, message: 'Notifikasi berhasil dikirim!', severity: 'success' });
            setOpenDialog(false);
            setBroadcastMsg('');
            setTargetUser('');
            setTimeout(() => fetchNotifications(true), 1500);
        } catch (err: any) {
            // Jika endpoint POST belum ada di Laptop 1, tampilkan pesan informatif
            const msg = err?.response?.data?.message || 'Endpoint POST /notifications belum didukung oleh Laptop 1. Hubungi pemilik notification-service.';
            setSnack({ open: true, message: msg, severity: 'error' });
        } finally {
            setSending(false);
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    const filtered =
        tabValue === 0 ? notifications :
        tabValue === 1 ? notifications.filter(n => n.status === 'unread') :
        notifications.filter(n => n.status === 'read');

    return (
        <Box sx={{ p: 3 }}>
            {/* ── HEADER ─────────────────────────────────────── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box sx={{ width: 4, height: 28, bgcolor: '#008A5E', borderRadius: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: -0.5 }}>
                            Notifikasi Sistem
                        </Typography>
                        {unreadCount > 0 && (
                            <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 800 } }} />
                        )}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b', pl: '20px' }}>
                        Notifikasi real-time dari Notification Service (Laptop 1 · 10.206.80.189)
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Tooltip title="Refresh">
                        <IconButton
                            onClick={() => fetchNotifications(true)}
                            disabled={refreshing}
                            sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}
                        >
                            <RefreshIcon sx={{ fontSize: 20, color: '#64748b', animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                        </IconButton>
                    </Tooltip>

                    {unreadCount > 0 && (
                        <Button
                            variant="outlined"
                            startIcon={<CheckIcon />}
                            onClick={handleMarkAllRead}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: '#008A5E', color: '#008A5E', '&:hover': { bgcolor: '#EAF5F1' } }}
                        >
                            Tandai Semua Dibaca
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        startIcon={<BroadcastIcon />}
                        onClick={() => setOpenDialog(true)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: '#008A5E', '&:hover': { bgcolor: '#006E4D' }, boxShadow: '0 4px 12px rgba(0,138,94,0.3)' }}
                    >
                        Kirim Notifikasi
                    </Button>
                </Box>
            </Box>

            {/* ── STATS ROW ───────────────────────────────────── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                {[
                    { label: 'Total Notifikasi', value: notifications.length, color: '#3B82F6', bg: '#EFF6FF' },
                    { label: 'Belum Dibaca', value: unreadCount, color: '#EF4444', bg: '#FEF2F2' },
                    { label: 'Sudah Dibaca', value: notifications.length - unreadCount, color: '#008A5E', bg: '#EAF5F1' },
                ].map(stat => (
                    <Card key={stat.label} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2.5 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                            {stat.label}
                        </Typography>
                        <Typography sx={{ fontSize: 32, fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                            {loading ? '...' : stat.value}
                        </Typography>
                    </Card>
                ))}
            </Box>

            {/* ── NOTIF LIST CARD ─────────────────────────────── */}
            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, v) => setTabValue(v)}
                        sx={{ px: 3, borderBottom: '1px solid #f1f5f9' }}
                    >
                        <Tab label={`Semua (${notifications.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                        <Tab label={`Belum Dibaca (${unreadCount})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                        <Tab label={`Sudah Dibaca`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                    </Tabs>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
                            <CircularProgress size={28} sx={{ color: '#008A5E' }} />
                            <Typography sx={{ color: '#64748b', fontWeight: 600 }}>Memuat dari Laptop 1...</Typography>
                        </Box>
                    ) : filtered.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
                            <EmptyIcon sx={{ fontSize: 56, color: '#e2e8f0' }} />
                            <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                {tabValue === 1 ? 'Semua notifikasi sudah dibaca.' : 'Tidak ada notifikasi.'}
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {filtered.map((notif, idx) => (
                                <Box key={notif.id}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            px: 3, py: 2,
                                            bgcolor: notif.status === 'unread' ? '#F0FDF8' : 'transparent',
                                            transition: 'background 0.2s',
                                            '&:hover': { bgcolor: '#f8fafc' },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: notif.status === 'unread' ? '#D1FAE5' : '#F1F5F9', width: 44, height: 44, borderRadius: 2.5 }}>
                                                <BellIcon sx={{ color: notif.status === 'unread' ? '#008A5E' : '#94a3b8', fontSize: 20 }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>
                                                        {notif.message}
                                                    </Typography>
                                                    {notif.status === 'unread' && (
                                                        <Chip label="Baru" size="small" sx={{ bgcolor: '#008A5E', color: 'white', fontWeight: 800, height: 18, fontSize: 10 }} />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <PersonIcon sx={{ fontSize: 13, color: '#94a3b8' }} />
                                                        <Typography sx={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                                                            {notif.user_id}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <TimeIcon sx={{ fontSize: 13, color: '#94a3b8' }} />
                                                        <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
                                                            {new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {idx < filtered.length - 1 && <Divider sx={{ mx: 3 }} />}
                                </Box>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* ── DIALOG KIRIM NOTIFIKASI ─────────────────────── */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <BroadcastIcon sx={{ color: '#008A5E' }} />
                        Kirim Notifikasi
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
                        Kirim pesan notifikasi ke siswa tertentu atau semua pengguna platform.
                    </Typography>
                    <TextField
                        label="Target User ID / Email"
                        placeholder="Contoh: student@edu.ai  (kosongkan untuk broadcast semua)"
                        fullWidth
                        value={targetUser}
                        onChange={e => setTargetUser(e.target.value)}
                        sx={{ mb: 2 }}
                        size="small"
                    />
                    <TextField
                        label="Pesan Notifikasi *"
                        placeholder="Tulis pesan notifikasi yang akan dikirim..."
                        fullWidth
                        multiline
                        rows={4}
                        value={broadcastMsg}
                        onChange={e => setBroadcastMsg(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: '#64748b' }}>
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={sending ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <SendIcon />}
                        onClick={handleSendBroadcast}
                        disabled={!broadcastMsg.trim() || sending}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: '#008A5E', '&:hover': { bgcolor: '#006E4D' } }}
                    >
                        {sending ? 'Mengirim...' : 'Kirim Sekarang'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── SNACKBAR ────────────────────────────────────── */}
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}