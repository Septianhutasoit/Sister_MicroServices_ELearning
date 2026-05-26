import { useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, LinearProgress,
    Grid, Avatar, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { CheckCircle, Cancel, Timeline, EmojiEvents } from "@mui/icons-material";

// --- DATA DUMMY (Nanti didapat dari Exam Service -> PostgreSQL) ---
// Asumsi: Max soal 5. Tiap soal benar = 20 poin. Total 100.
const studentResults = [
    { id: 1, name: "Budi Santoso", email: "budi@student.edu.ai", course: "Microservices Architecture", correctAnswers: 5, score: 100 },
    { id: 2, name: "Siti Aminah", email: "siti.a@student.edu.ai", course: "Dasar Docker & Container", correctAnswers: 4, score: 80 },
    { id: 3, name: "Alex Wijaya", email: "alexw@student.edu.ai", course: "UI/UX Design Fundamental", correctAnswers: 2, score: 40 },
    { id: 4, name: "Nisa Fauziah", email: "nisafz@student.edu.ai", course: "Microservices Architecture", correctAnswers: 5, score: 100 },
    { id: 5, name: "Reza Rahadian", email: "reza@student.edu.ai", course: "Dasar Docker & Container", correctAnswers: 3, score: 60 },
];

export default function Quiz() {
    const [filterCourse, setFilterCourse] = useState("Semua Kursus");

    // Filter data berdasarkan dropdown (Simulasi filter API)
    const filteredResults = filterCourse === "Semua Kursus"
        ? studentResults
        : studentResults.filter(s => s.course === filterCourse);

    // Kalkulasi Analitik Singkat
    const totalExams = filteredResults.length;
    const passedExams = filteredResults.filter(s => s.score >= 60).length; // KKM = 60 (Min 3 benar)
    const passPercentage = totalExams === 0 ? 0 : Math.round((passedExams / totalExams) * 100);

    return (
        <Box sx={{ pb: 4 }}>
            {/* --- HEADER --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: -0.5 }}>
                        Data Ujian & Nilai
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Pantau hasil evaluasi siswa (Maksimal 5 Soal / 100 Poin).
                    </Typography>
                </Box>

                {/* Filter Dropdown */}
                <FormControl sx={{ minWidth: 220 }} size="small">
                    <InputLabel>Filter Kursus</InputLabel>
                    <Select
                        value={filterCourse}
                        label="Filter Kursus"
                        onChange={(e) => setFilterCourse(e.target.value)}
                        sx={{ bgcolor: 'white', borderRadius: 2 }}
                    >
                        <MenuItem value="Semua Kursus">Semua Kursus</MenuItem>
                        <MenuItem value="Microservices Architecture">Microservices Architecture</MenuItem>
                        <MenuItem value="Dasar Docker & Container">Dasar Docker & Container</MenuItem>
                        <MenuItem value="UI/UX Design Fundamental">UI/UX Design Fundamental</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* --- STATISTIK KELULUSAN (KPI) --- */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar sx={{ bgcolor: '#EFF6FF', color: '#3B82F6', width: 56, height: 56, borderRadius: 3 }}><Timeline fontSize="large" /></Avatar>
                        <Box>
                            <Typography sx={{ color: '#64748b', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>Total Mengikuti</Typography>
                            <Typography sx={{ color: '#1e293b', fontWeight: 900, fontSize: 28 }}>{totalExams} <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Siswa</span></Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar sx={{ bgcolor: '#DCFCE7', color: '#16A34A', width: 56, height: 56, borderRadius: 3 }}><CheckCircle fontSize="large" /></Avatar>
                        <Box>
                            <Typography sx={{ color: '#64748b', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>Siswa Lulus (KKM 60)</Typography>
                            <Typography sx={{ color: '#1e293b', fontWeight: 900, fontSize: 28 }}>{passedExams} <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Siswa</span></Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 3, background: 'linear-gradient(135deg, #008A5E 0%, #004D40 100%)', color: 'white' }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FCD34D', width: 56, height: 56, borderRadius: 3 }}><EmojiEvents fontSize="large" /></Avatar>
                        <Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>Persentase Kelulusan</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: 28 }}>{passPercentage}%</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* --- TABEL HASIL UJIAN SISWA --- */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Nama Siswa</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Ujian Kursus</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Jawaban Benar</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', width: '25%' }}>Skor (Persentase)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredResults.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#94a3b8' }}>Tidak ada data ujian untuk kursus ini.</TableCell>
                            </TableRow>
                        )}
                        {filteredResults.map((student) => {
                            const isPassed = student.score >= 60; // Lulus jika 3 benar (60 poin)

                            return (
                                <TableRow key={student.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{student.name}</Typography>
                                        <Typography sx={{ fontSize: 12, color: '#64748b' }}>{student.email}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>{student.course}</TableCell>

                                    {/* Kolom Jawaban Benar (Dari 5 Soal) */}
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>
                                            {student.correctAnswers} <span style={{ fontWeight: 500, color: '#94a3b8' }}>/ 5 Soal</span>
                                        </Typography>
                                    </TableCell>

                                    {/* Kolom Visualisasi Skor (Progress Bar) */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={student.score}
                                                    sx={{
                                                        height: 8, borderRadius: 5,
                                                        bgcolor: '#f1f5f9',
                                                        '& .MuiLinearProgress-bar': { bgcolor: student.score >= 80 ? '#10B981' : student.score >= 60 ? '#F59E0B' : '#EF4444' }
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ minWidth: 35 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>{student.score}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Kolom Status Kelulusan */}
                                    <TableCell align="right">
                                        <Chip
                                            icon={isPassed ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                                            label={isPassed ? "LULUS" : "GAGAL"}
                                            color={isPassed ? "success" : "error"}
                                            size="small"
                                            sx={{ fontWeight: 'bold', borderRadius: 2 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    );
}