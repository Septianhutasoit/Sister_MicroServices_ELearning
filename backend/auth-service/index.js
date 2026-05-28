const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001; // Sesuai dengan konfigurasi Nginx gateway (port 3001)
const JWT_SECRET = "secretkey123";
const USERS_FILE = path.join(__dirname, "users.json");

// Konfigurasi Database PostgreSQL Terdistribusi
const dbConfigs = [
    {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "10.206.80.189",
        database: process.env.DB_NAME || "exam_db",
        password: process.env.DB_PASSWORD || "postgres",
        port: parseInt(process.env.DB_PORT || "5432"),
    },
    {
        user: "postgres",
        host: "localhost",
        database: "exam_db",
        password: "postgres",
        port: 5433, // Local Replicated Slave
    },
    {
        user: "user",
        host: "localhost",
        database: "exam_db",
        password: "password",
        port: 5432, // Local postgres container
    }
];

let pool = null;
let useDatabase = false;
let isReadOnly = false;

// Fungsi inisialisasi database
async function initDb() {
    for (const config of dbConfigs) {
        try {
            console.log(`Mencoba terhubung ke PostgreSQL (${config.host}:${config.port})...`);
            const tempPool = new Pool(config);
            const client = await tempPool.connect();
            console.log(`Koneksi ke PostgreSQL (${config.host}:${config.port}) berhasil!`);
            client.release();
            
            pool = tempPool;
            useDatabase = true;
            if (config.port === 5433) {
                isReadOnly = true;
                console.log("Koneksi berjalan dalam mode READ-ONLY (Slave Local).");
            } else {
                isReadOnly = false;
            }
            break;
        } catch (err) {
            console.warn(`Gagal terhubung ke (${config.host}:${config.port}):`, err.message);
        }
    }

    if (!useDatabase) {
        console.warn("Gagal terhubung ke semua database PostgreSQL. Menggunakan fallback local JSON file (users.json).");
        // Inisialisasi file JSON lokal jika belum ada
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
        }
    }
}

initDb();

// Helper untuk membaca user dari JSON
function readLocalUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf8");
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Helper untuk menulis user ke JSON
function writeLocalUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// TEST API
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Auth Service Running",
        storage: useDatabase ? "PostgreSQL Database" : "Local JSON File"
    });
});

// REGISTER API
app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    const userRole = role || "student";

    if (!name || !email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Nama, email, dan password wajib diisi."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (useDatabase) {
            // Cek apakah email sudah terdaftar
            const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (checkUser.rows.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Email sudah terdaftar."
                });
            }

            if (isReadOnly) {
                return res.status(403).json({
                    status: "error",
                    message: "Database dalam mode Standby (Read-Only). Pendaftaran dinonaktifkan sementara."
                });
            }

            // Simpan user baru ke database (tanpa kolom role karena tabel master tidak memilikinya)
            await pool.query(
                "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
                [name, email, hashedPassword]
            );
        } else {
            // Fallback JSON
            const users = readLocalUsers();
            if (users.find(u => u.email === email)) {
                return res.status(400).json({
                    status: "error",
                    message: "Email sudah terdaftar."
                });
            }

            users.push({
                id: Date.now(),
                name,
                email,
                password: hashedPassword,
                role: userRole
            });
            writeLocalUsers(users);
        }

        res.status(201).json({
            status: "success",
            message: "Pendaftaran berhasil!"
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server saat mendaftar."
        });
    }
});

// LOGIN API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email dan password wajib diisi."
        });
    }

    // Bypass admin default
    if (email === "admin@gmail.com" && password === "123") {
        const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
        return res.json({
            status: "success",
            data: {
                token,
                user: {
                    name: "Administrator",
                    email: "admin@gmail.com",
                    role: "admin"
                }
            }
        });
    }

    try {
        let user = null;

        if (useDatabase) {
            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (result.rows.length > 0) {
                user = result.rows[0];
            }
        } else {
            const users = readLocalUsers();
            user = users.find(u => u.email === email);
        }

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Email atau password salah."
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: "error",
                message: "Email atau password salah."
            });
        }

        // Generate JWT Token
        const userRole = user.role || 'student';
        const token = jwt.sign({ id: user.id, email: user.email, role: userRole }, JWT_SECRET, { expiresIn: "1d" });

        res.json({
            status: "success",
            data: {
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    role: userRole
                }
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server saat login."
        });
    }
});

// GET SEMUA USERS (untuk Admin Panel)
app.get("/users", async (req, res) => {
    try {
        let users = [];
        if (useDatabase) {
            const result = await pool.query(
                "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC"
            );
            users = result.rows.map(u => ({ ...u, role: "student" }));
        } else {
            const rawUsers = readLocalUsers();
            users = rawUsers.map(({ password, ...u }) => u);
        }
        res.json({ status: "success", data: users });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ status: "error", message: "Gagal mengambil data pengguna." });
    }
});

// GET COUNT USERS (untuk KPI Dashboard)
app.get("/users/count", async (req, res) => {
    try {
        let count = 0;
        if (useDatabase) {
            const result = await pool.query("SELECT COUNT(*) FROM users");
            count = parseInt(result.rows[0].count);
        } else {
            const rawUsers = readLocalUsers();
            count = rawUsers.filter(u => u.role === 'student').length;
        }
        res.json({ status: "success", count });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Gagal menghitung pengguna." });
    }
});

// DELETE USER (untuk Admin Panel)
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (useDatabase) {
            if (isReadOnly) {
                return res.status(403).json({
                    status: "error",
                    message: "Database dalam mode Standby (Read-Only). Penghapusan dinonaktifkan."
                });
            }
            const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ status: "error", message: "User tidak ditemukan." });
            }
        } else {
            let users = readLocalUsers();
            const idx = users.findIndex(u => String(u.id) === String(id));
            if (idx === -1) return res.status(404).json({ status: "error", message: "User tidak ditemukan." });
            users.splice(idx, 1);
            writeLocalUsers(users);
        }
        res.json({ status: "success", message: "User berhasil dihapus." });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ status: "error", message: "Gagal menghapus user." });
    }
});

// GET SEMUA HASIL UJIAN SISWA (untuk Admin Panel)
app.get("/exams/results", async (req, res) => {
    try {
        let results = [];
        if (useDatabase) {
            const queryResult = await pool.query(`
                SELECT 
                    ea.id, 
                    COALESCE(u.name, 'Siswa Portal') as student_name, 
                    ea.user_id as student_email, 
                    COALESCE(e.title, 'Ujian Belajar') as course, 
                    ea.score, 
                    ea.passed, 
                    ea.submitted_at
                FROM exam_attempts ea
                LEFT JOIN users u ON ea.user_id = u.email
                LEFT JOIN exams e ON ea.exam_id = e.id
                ORDER BY ea.submitted_at DESC
            `);
            results = queryResult.rows.map(row => ({
                id: row.id,
                name: row.student_name,
                email: row.student_email,
                course: row.course,
                correctAnswers: Math.round((row.score / 100) * 5),
                score: row.score,
                passed: row.passed,
                submittedAt: row.submitted_at
            }));
        } else {
            results = [
                { id: 1, name: "Budi Santoso", email: "budi@student.edu.ai", course: "Microservices Architecture", correctAnswers: 5, score: 100, passed: true },
                { id: 2, name: "Siti Aminah", email: "siti.a@student.edu.ai", course: "Dasar Docker & Container", correctAnswers: 4, score: 80, passed: true },
                { id: 3, name: "Alex Wijaya", email: "alexw@student.edu.ai", course: "UI/UX Design Fundamental", correctAnswers: 2, score: 40, passed: false },
                { id: 4, name: "Nisa Fauziah", email: "nisafz@student.edu.ai", course: "Microservices Architecture", correctAnswers: 5, score: 100, passed: true },
                { id: 5, name: "Reza Rahadian", email: "reza@student.edu.ai", course: "Dasar Docker & Container", correctAnswers: 3, score: 60, passed: true },
            ];
        }
        res.json({ status: "success", data: results });
    } catch (error) {
        console.error("Get Exam Results Error:", error);
        res.status(500).json({ status: "error", message: "Gagal mengambil data hasil ujian." });
    }
});

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});