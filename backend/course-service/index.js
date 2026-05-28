const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load environment variables dari file .env jika ada
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey123';

app.use(cors());
app.use(express.json());

// ── Koneksi ke MongoDB Replica Set (lms database) ──────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin123@10.80.72.189:27018,10.80.72.228:27018,10.80.72.79:27018/lms?authSource=admin&replicaSet=rs0';

console.log('Menghubungkan ke MongoDB:', MONGO_URI);

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // Batas waktu timeout 5 detik agar tidak menggantung jika node mati
})
    .then(() => console.log('Course Service: Terhubung ke Kluster MongoDB Replica Set (lms)'))
    .catch(err => {
        console.warn('Course Service: Gagal terhubung ke Replica Set, mencoba fallback ke MongoDB lokal:', err.message);
        // Fallback ke MongoDB lokal jika replica set offline
        mongoose.connect('mongodb://admin:admin123@localhost:27017/lms?authSource=admin')
            .then(() => console.log('Course Service: Terhubung ke MongoDB Lokal (Fallback)'))
            .catch(errLokal => console.error('Course Service: Semua koneksi database gagal!', errLokal.message));
    });

// ── Schema Kursus (Courses) ───────────────────────────────────────────────
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructor: String,
    category: String,
    imageUrl: String,
    rating: { type: Number, default: 4.8 },
    students: { type: Number, default: 0 },
    totalChapters: { type: Number, default: 5 },
    createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

// ── Schema Pendaftaran (Enrollments) ─────────────────────────────────────
const enrollmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completedChapters: { type: Number, default: 0 },
    completionPercent: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// ── Middleware Autentikasi JWT Token ──────────────────────────────────────
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ status: 'error', message: 'Token autentikasi diperlukan.' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ status: 'error', message: 'Sesi kedaluwarsa atau token tidak valid.' });
        req.user = decoded; // decoded = { id, email, ... }
        next();
    });
}

// ── Data awal jika MongoDB kosong ───────────────────────────────────────
const seedData = [
    { title: 'Mastering Docker & Microservices', description: 'Pelajari arsitektur terdistribusi modern menggunakan Docker dan Kubernetes.', instructor: 'Budi Santoso', category: 'DevOps', rating: 4.9, students: 1240, totalChapters: 12, imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&auto=format&fit=crop' },
    { title: 'UI/UX Design Fundamental', description: 'Kuasai desain antarmuka profesional menggunakan Figma dan prinsip UX.', instructor: 'Sarah J.', category: 'Desain', rating: 4.8, students: 3420, totalChapters: 8, imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop' },
    { title: 'Fundamental React & Next.js', description: 'Pemrograman Frontend modern dengan React 18 dan Next.js App Router.', instructor: 'Alex W.', category: 'Frontend', rating: 4.7, students: 890, totalChapters: 15, imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop' },
    { title: 'Python untuk Data Science', description: 'Analisis data dan machine learning menggunakan Python, Pandas, dan Scikit-learn.', instructor: 'Diana R.', category: 'Data Science', rating: 4.9, students: 2100, totalChapters: 20, imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop' },
    { title: 'Node.js & Express API Development', description: 'Bangun REST API scalable menggunakan Node.js, Express, dan PostgreSQL.', instructor: 'Kevin H.', category: 'Backend', rating: 4.8, students: 1560, totalChapters: 18, imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop' },
];

// ── Root health check ───────────────────────────────────────────────────
app.get('/', async (req, res) => {
    res.json({ status: 'success', message: 'Course & Enrollment Service Running', port: PORT });
});

// ── GET semua kursus ────────────────────────────────────────────────────
app.get('/courses', async (req, res) => {
    try {
        let courses = await Course.find();

        // Jika MongoDB kosong, isi dengan seed data
        if (courses.length === 0) {
            courses = await Course.insertMany(seedData);
            console.log('Course Service: Seed data berhasil ditambahkan ke MongoDB');
        }

        res.json({ status: 'success', data: courses });
    } catch (err) {
        console.warn('Course Service: Gagal dari MongoDB, pakai static data:', err.message);
        res.json({ status: 'success', data: seedData.map((c, i) => ({ ...c, _id: String(i + 1) })) });
    }
});

// ── GET kursus by ID ────────────────────────────────────────────────────
app.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ status: 'error', message: 'Kursus tidak ditemukan.' });
        res.json({ status: 'success', data: course });
    } catch (err) {
        const course = seedData.find((_, i) => String(i + 1) === req.params.id);
        if (!course) return res.status(404).json({ status: 'error', message: 'Kursus tidak ditemukan.' });
        res.json({ status: 'success', data: { ...course, _id: req.params.id } });
    }
});

// ── GET enrollment user aktif (/enrollments/me) ──────────────────────────
app.get('/enrollments/me', authenticateToken, async (req, res) => {
    try {
        const userId = String(req.user.id);
        const enrollments = await Enrollment.find({ userId });
        
        const result = [];
        for (const enroll of enrollments) {
            const course = await Course.findById(enroll.courseId);
            if (course) {
                result.push({
                    _id: enroll._id,
                    userId: enroll.userId,
                    courseId: enroll.courseId,
                    completedChapters: enroll.completedChapters,
                    completionPercent: enroll.completionPercent,
                    progress: enroll.progress,
                    course: {
                        id: course._id,
                        title: course.title,
                        category: course.category,
                        imageUrl: course.imageUrl,
                        totalChapters: course.totalChapters
                    }
                });
            }
        }
        
        res.json({ status: 'success', data: result });
    } catch (err) {
        console.error('Gagal mengambil data pendaftaran:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ── POST daftar kursus baru (/enroll) ──────────────────────────────────
app.post('/enroll', authenticateToken, async (req, res) => {
    try {
        const userId = String(req.user.id);
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ status: 'error', message: 'courseId diperlukan' });
        }

        let enrollment = await Enrollment.findOne({ userId, courseId });
        if (enrollment) {
            return res.status(400).json({ status: 'error', message: 'Anda sudah terdaftar di kursus ini.' });
        }

        enrollment = new Enrollment({
            userId,
            courseId,
            completedChapters: 0,
            completionPercent: 0,
            progress: 0
        });

        await enrollment.save();

        // Naikkan jumlah pendaftar di data kursus
        await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });

        res.status(201).json({ status: 'success', message: 'Berhasil mendaftar kursus!', data: enrollment });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ── PUT/PATCH Update Progress Kelas ──────────────────────────────────────
async function updateProgressHandler(req, res) {
    try {
        const userId = String(req.user.id);
        const courseId = req.params.courseId || req.body.courseId;
        const { completedChapters, completionPercent, progress } = req.body;

        if (!courseId) {
            return res.status(400).json({ status: 'error', message: 'courseId diperlukan' });
        }

        let enrollment = await Enrollment.findOne({ userId, courseId });
        if (!enrollment) {
            enrollment = new Enrollment({
                userId,
                courseId,
                completedChapters: completedChapters || 0,
                completionPercent: completionPercent || progress || 0,
                progress: progress || completionPercent || 0
            });
        } else {
            if (completedChapters !== undefined) enrollment.completedChapters = completedChapters;
            if (completionPercent !== undefined) {
                enrollment.completionPercent = completionPercent;
                enrollment.progress = completionPercent;
            }
            if (progress !== undefined) {
                enrollment.progress = progress;
                enrollment.completionPercent = progress;
            }
        }

        await enrollment.save();
        res.json({ status: 'success', message: 'Progress pembelajaran diperbarui.', data: enrollment });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

app.put('/enroll/:courseId', authenticateToken, updateProgressHandler);
app.patch('/enroll/:courseId', authenticateToken, updateProgressHandler);
app.post('/enroll/progress', authenticateToken, updateProgressHandler);
app.put('/enroll/progress/:courseId', authenticateToken, updateProgressHandler);

app.listen(PORT, () => {
    console.log(`Course & Enrollment Service berjalan di port ${PORT}`);
});
