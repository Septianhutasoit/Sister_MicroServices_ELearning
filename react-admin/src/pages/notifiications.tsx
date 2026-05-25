// adminPanel/src/pages/Notifications.tsx
import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Tabs,
    Tab,
    Badge,
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Quiz as QuizIcon,
    AssignmentTurnedIn as AssignmentIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';

interface Notification {
    id: string;
    type: 'new_user' | 'quiz_submitted' | 'course_completed';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

const dummyNotifications: Notification[] = [
    {
        id: '1',
        type: 'new_user',
        title: 'User baru mendaftar',
        message: 'Ahmad Fauzi telah bergabung sebagai mahasiswa.',
        timestamp: '2025-04-09T08:00:00',
        read: false,
    },
    {
        id: '2',
        type: 'quiz_submitted',
        title: 'Quiz selesai',
        message: 'Siti Nurhaliza menyelesaikan quiz "Sejarah Komputer" dengan nilai 85.',
        timestamp: '2025-04-08T14:30:00',
        read: true,
    },
    {
        id: '3',
        type: 'course_completed',
        title: 'Kursus selesai',
        message: 'Budi Santoso menyelesaikan kursus "Perkembangan Internet".',
        timestamp: '2025-04-07T10:15:00',
        read: false,
    },
    {
        id: '4',
        type: 'new_user',
        title: 'User baru mendaftar',
        message: 'Dewi Sartika telah bergabung.',
        timestamp: '2025-04-06T09:20:00',
        read: true,
    },
];

const getIcon = (type: string) => {
    switch (type) {
        case 'new_user':
            return <PersonAddIcon sx={{ color: '#059669' }} />;
        case 'quiz_submitted':
            return <QuizIcon sx={{ color: '#EAB308' }} />;
        case 'course_completed':
            return <AssignmentIcon sx={{ color: '#3B82F6' }} />;
        default:
            return <CheckIcon sx={{ color: '#059669' }} />;
    }
};

export default function Notifications() {
    const [tabValue, setTabValue] = useState(0);
    const [notifications, setNotifications] = useState(dummyNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const filtered =
        tabValue === 0
            ? notifications
            : tabValue === 1
                ? notifications.filter((n) => !n.read)
                : notifications.filter((n) => n.read);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Notifikasi
                </Typography>
                {unreadCount > 0 && (
                    <Chip
                        label={`Tandai semua telah dibaca`}
                        onClick={handleMarkAllRead}
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                    />
                )}
            </Box>

            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #eef2f6' }}>
                <CardContent>
                    <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
                        <Tab label={`Semua (${notifications.length})`} />
                        <Tab label={`Belum dibaca (${unreadCount})`} />
                        <Tab label={`Sudah dibaca`} />
                    </Tabs>

                    <List>
                        {filtered.length === 0 && (
                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                Tidak ada notifikasi.
                            </Typography>
                        )}
                        {filtered.map((notif) => (
                            <ListItem
                                key={notif.id}
                                alignItems="flex-start"
                                sx={{
                                    bgcolor: notif.read ? 'transparent' : '#F0FDF4',
                                    borderRadius: 2,
                                    mb: 1,
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleMarkAsRead(notif.id)}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#E5E7EB' }}>{getIcon(notif.type)}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={notif.title}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                {notif.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(notif.timestamp).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                                {!notif.read && (
                                    <Badge color="primary" variant="dot" />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
}