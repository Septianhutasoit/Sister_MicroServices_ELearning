import { useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Avatar,
    IconButton, Tooltip, TextField, InputAdornment, Button
} from "@mui/material";
import { Search, Edit, Block, Delete, PersonAddAlt1 } from "@mui/icons-material";

// --- DATA DUMMY (Nanti didapat dari Auth & User Service -> PostgreSQL) ---
const mockUsers = [
    { id: "U001", name: "Budi Santoso", email: "budi@student.edu.ai", joinDate: "12 Ags 2024", status: "Active" },
    { id: "U002", name: "Siti Aminah", email: "siti.a@student.edu.ai", joinDate: "14 Ags 2024", status: "Active" },
    { id: "U003", name: "Alex Wijaya", email: "alexw@student.edu.ai", joinDate: "15 Ags 2024", status: "Active" },
    { id: "U004", name: "Nisa Fauziah", email: "nisafz@student.edu.ai", joinDate: "20 Ags 2024", status: "Suspended" },
    { id: "U005", name: "Reza Rahadian", email: "reza@student.edu.ai", joinDate: "22 Ags 2024", status: "Active" },
];

export default function Users() {
    const [searchTerm, setSearchTerm] = useState("");

    // Fitur Live Search (Mencari siswa berdasarkan nama atau email)
    const filteredUsers = mockUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ pb: 4 }}>
            {/* --- HEADER --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: -0.5 }}>
                        Manajemen Siswa
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Kelola data siswa yang terdaftar dari aplikasi mobile.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Kolom Pencarian Cepat */}
                    <TextField
                        size="small"
                        placeholder="Cari siswa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                    {/* Tombol Tambah Siswa Manual (Opsional) */}
                    <Button
                        variant="contained"
                        startIcon={<PersonAddAlt1 />}
                        sx={{ bgcolor: '#008A5E', fontWeight: 'bold', textTransform: 'none', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,138,94,0.2)', '&:hover': { bgcolor: '#006E4D' } }}
                    >
                        Tambah Siswa
                    </Button>
                </Box>
            </Box>

            {/* --- TABEL DATA SISWA --- */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', width: '8%' }}>ID Siswa</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', width: '35%' }}>Profil Siswa</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Tanggal Daftar</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Status Akun</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>Tindakan</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Tidak ada siswa yang ditemukan.</Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                {/* ID Siswa */}
                                <TableCell sx={{ fontWeight: 700, color: '#94a3b8', fontSize: 13 }}>
                                    #{user.id}
                                </TableCell>

                                {/* Profil (Avatar + Nama + Email) */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#EAF5F1', color: '#008A5E', fontWeight: 'bold' }}>
                                            {user.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{user.name}</Typography>
                                            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{user.email}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                {/* Tanggal Daftar */}
                                <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: 14 }}>
                                    {user.joinDate}
                                </TableCell>

                                {/* Status Akun */}
                                <TableCell>
                                    <Chip
                                        label={user.status === "Active" ? "Aktif" : "Dibekukan"}
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRadius: 1.5,
                                            bgcolor: user.status === "Active" ? '#DCFCE7' : '#FEE2E2',
                                            color: user.status === "Active" ? '#16A34A' : '#EF4444',
                                        }}
                                    />
                                </TableCell>

                                {/* Tombol Tindakan */}
                                <TableCell align="right">
                                    <Tooltip title="Edit Data">
                                        <IconButton sx={{ color: '#3B82F6', bgcolor: '#EFF6FF', mr: 1, '&:hover': { bgcolor: '#DBEAFE' } }} size="small">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title={user.status === "Active" ? "Bekukan Akun" : "Aktifkan Akun"}>
                                        <IconButton sx={{ color: '#F59E0B', bgcolor: '#FEF3C7', mr: 1, '&:hover': { bgcolor: '#FDE68A' } }} size="small">
                                            <Block fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Hapus Permanen">
                                        <IconButton sx={{ color: '#EF4444', bgcolor: '#FEE2E2', '&:hover': { bgcolor: '#FECACA' } }} size="small">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}