import { useState, useEffect } from "react";
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, IconButton,
    Radio, RadioGroup, FormControlLabel, FormControl, Chip,
    CircularProgress
} from "@mui/material";
import { Add, Delete, MenuBook, Quiz } from "@mui/icons-material";
import { COURSE_API } from "../services/api";

// --- TIPE DATA UNTUK MICROSERVICES ---
interface Material {
    title: string;
    content: string;
}

interface ExamQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number; // Index array (0, 1, 2, atau 3)
}

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    category?: string;
    totalChapters: number;
    materials?: any[];
    exams?: any[];
}

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // State untuk membuka/menutup form modal
    const [openDialog, setOpenDialog] = useState(false);

    // State Data Form
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDesc, setCourseDesc] = useState("");
    const [instructor, setInstructor] = useState("");

    // State Dinamis untuk Materi & Ujian
    const [materials, setMaterials] = useState<Material[]>([]);
    const [exams, setExams] = useState<ExamQuestion[]>([]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await COURSE_API.get("/");
            const data = res.data?.data || res.data || [];
            setCourses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Gagal memuat daftar kursus:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kursus ini?")) {
            try {
                await COURSE_API.delete(`/${id}`);
                alert("Kursus berhasil dihapus!");
                fetchCourses();
            } catch (err) {
                console.error("Gagal menghapus kursus:", err);
                alert("Gagal menghapus kursus.");
            }
        }
    };

    // --- FUNGSI DYNAMIC MATERI ---
    const addMaterial = () => {
        setMaterials([...materials, { title: "", content: "" }]);
    };
    const updateMaterial = (index: number, field: keyof Material, value: string) => {
        const newMaterials = [...materials];
        newMaterials[index][field] = value;
        setMaterials(newMaterials);
    };
    const removeMaterial = (index: number) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    // --- FUNGSI DYNAMIC UJIAN ---
    const addExamQuestion = () => {
        setExams([...exams, { question: "", options: ["", "", "", ""], correctAnswerIndex: 0 }]);
    };
    const updateExamQuestion = (index: number, value: string) => {
        const newExams = [...exams];
        newExams[index].question = value;
        setExams(newExams);
    };
    const updateExamOption = (qIndex: number, optIndex: number, value: string) => {
        const newExams = [...exams];
        newExams[qIndex].options[optIndex] = value;
        setExams(newExams);
    };
    const setCorrectAnswer = (qIndex: number, optIndex: number) => {
        const newExams = [...exams];
        newExams[qIndex].correctAnswerIndex = optIndex;
        setExams(newExams);
    };
    const removeExamQuestion = (index: number) => {
        setExams(exams.filter((_, i) => i !== index));
    };

    // --- FUNGSI SIMPAN KE BACKEND ---
    const handleSubmit = async () => {
        const payload = {
            title: courseTitle,
            description: courseDesc,
            instructor: instructor,
            category: "Teknik",
            totalChapters: materials.length || 5,
            materials: materials.map(m => ({ title: m.title, theory: m.content, duration: "10 menit" })),
            exams: exams
        };

        try {
            await COURSE_API.post("/", payload);
            alert("Kursus berhasil disimpan dan dipublikasikan!");
            fetchCourses();
            handleCloseDialog();
        } catch (err) {
            console.error("Gagal menyimpan kursus:", err);
            alert("Gagal menyimpan kursus.");
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        // Reset form
        setCourseTitle(""); setCourseDesc(""); setInstructor("");
        setMaterials([]); setExams([]);
    };

    return (
        <Box sx={{ pb: 4, height: '100%' }}>
            {/* --- HEADER --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: -0.5 }}>
                        Manajemen Kursus
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Kelola materi teks dan buat soal ujian untuk siswa.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ bgcolor: '#008A5E', fontWeight: 'bold', textTransform: 'none', borderRadius: 2, px: 3, py: 1.5, '&:hover': { bgcolor: '#006E4D' } }}
                >
                    Tambah Kursus Baru
                </Button>
            </Box>

            {/* --- TABEL DATA KURSUS (DUMMY) --- */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Judul Kursus</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Instruktur</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Konten</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress size={24} sx={{ my: 2 }} />
                                </TableCell>
                            </TableRow>
                        ) : courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Belum ada kursus.
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course) => (
                                <TableRow key={course._id} hover>
                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        {course.title}
                                    </TableCell>
                                    <TableCell>{course.instructor}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip icon={<MenuBook fontSize="small" />} label={`${course.materials?.length || course.totalChapters || 0} Materi`} size="small" color="primary" variant="outlined" />
                                            <Chip icon={<Quiz fontSize="small" />} label={`${course.exams?.length || 0} Soal Ujian`} size="small" color="warning" variant="outlined" />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error" onClick={() => handleDelete(course._id)}><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ========================================================= */}
            {/* MODAL / DIALOG FORM TAMBAH KURSUS & UJIAN                 */}
            {/* ========================================================= */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 4 } } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', borderBottom: '1px solid #e2e8f0', pb: 2 }}>
                    Buat Kursus Baru
                </DialogTitle>
                <DialogContent sx={{ p: 4, bgcolor: '#F8FAFC' }}>

                    {/* 1. INFORMASI DASAR */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#008A5E' }}>1. Informasi Dasar</Typography>
                        <TextField fullWidth label="Judul Kursus" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Nama Instruktur" value={instructor} onChange={(e) => setInstructor(e.target.value)} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Deskripsi Singkat" multiline rows={2} value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />
                    </Paper>

                    {/* 2. MATERI PEMBELAJARAN (TEKS DINAMIS) */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#008A5E' }}>2. Materi (Teks)</Typography>
                            <Button startIcon={<Add />} variant="outlined" size="small" onClick={addMaterial}>Tambah Bab</Button>
                        </Box>

                        {materials.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Belum ada materi. Klik tambah bab.</Typography>}

                        {materials.map((mat, index) => (
                            <Box key={index} sx={{ mb: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: 2, position: 'relative' }}>
                                <IconButton color="error" size="small" onClick={() => removeMaterial(index)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <Delete fontSize="small" />
                                </IconButton>
                                <Typography sx={{ fontWeight: 600, mb: 1 }}>Bab {index + 1}</Typography>
                                <TextField fullWidth label="Judul Bab" size="small" value={mat.title} onChange={(e) => updateMaterial(index, 'title', e.target.value)} sx={{ mb: 2, bgcolor: 'white' }} />
                                <TextField fullWidth label="Isi Materi (Teks Panjang)" multiline rows={4} value={mat.content} onChange={(e) => updateMaterial(index, 'content', e.target.value)} sx={{ bgcolor: 'white' }} />
                            </Box>
                        ))}
                    </Paper>

                    {/* 3. SOAL UJIAN (DINAMIS DENGAN KUNCI JAWABAN) */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#008A5E' }}>3. Soal Ujian (Pilihan Ganda)</Typography>
                            <Button startIcon={<Add />} variant="outlined" size="small" color="warning" onClick={addExamQuestion}>Tambah Soal</Button>
                        </Box>

                        {exams.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Belum ada soal. Klik tambah soal.</Typography>}

                        {exams.map((exam, qIndex) => (
                            <Box key={qIndex} sx={{ mb: 3, p: 2, bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2, position: 'relative' }}>
                                <IconButton color="error" size="small" onClick={() => removeExamQuestion(qIndex)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <Delete fontSize="small" />
                                </IconButton>
                                <Typography sx={{ fontWeight: 700, mb: 1, color: '#d97706' }}>Soal {qIndex + 1}</Typography>
                                <TextField fullWidth label="Pertanyaan" size="small" value={exam.question} onChange={(e) => updateExamQuestion(qIndex, e.target.value)} sx={{ mb: 2, bgcolor: 'white' }} />

                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Pilihan Jawaban (Pilih radio button untuk kunci jawaban yang benar):</Typography>
                                <FormControl component="fieldset" fullWidth>
                                    <RadioGroup value={exam.correctAnswerIndex} onChange={(e) => setCorrectAnswer(qIndex, parseInt(e.target.value))}>
                                        {[0, 1, 2, 3].map((optIndex) => (
                                            <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <FormControlLabel value={optIndex} control={<Radio color="success" />} label="" sx={{ m: 0 }} />
                                                <TextField
                                                    fullWidth size="small" placeholder={`Opsi ${String.fromCharCode(65 + optIndex)}`} // Mengubah 0,1,2,3 jadi A,B,C,D
                                                    value={exam.options[optIndex]} onChange={(e) => updateExamOption(qIndex, optIndex, e.target.value)}
                                                    sx={{ bgcolor: 'white' }}
                                                />
                                            </Box>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        ))}
                    </Paper>

                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
                    <Button onClick={handleCloseDialog} color="inherit" sx={{ fontWeight: 'bold' }}>Batal</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#008A5E', fontWeight: 'bold', px: 4 }}>
                        Simpan & Publikasikan
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}