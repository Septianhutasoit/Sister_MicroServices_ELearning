/**
 * sync_all.js - Script sinkronisasi lengkap
 * 
 * Masalah yang diperbaiki:
 * 1. Password user di PostgreSQL diset ke nilai yang diketahui
 * 2. Enrollment di MongoDB yang menggunakan userId angka ("1") difix ke email
 */
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const pool = new Pool({
    user: 'postgres',
    host: '10.206.80.189',
    database: 'exam_db',
    password: 'postgres',
    port: 5432,
});

const MONGO_URI = 'mongodb://admin:admin123@10.206.80.189:27018,10.206.80.228:27018,10.206.80.79:27018/lms?authSource=admin&replicaSet=rs0';

// Password yang BENAR untuk setiap user (sesuai data asli sistem)
const USER_PASSWORDS = {
    'jessica@edu.ai':  'jeje123',
    'john@edu.ai':     'john123',
    'sarah@edu.ai':    'sarah123',
    'amos@edu.ai':     'amos123',
    'student@edu.ai':  'student123',
};

const enrollmentSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    status: String,
    completedChapters: Number,
    completionPercent: Number,
    progress: Number,
    enrolledAt: Date,
}, { timestamps: true });
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

async function syncPasswords() {
    console.log('\n=== [1] SINKRONISASI PASSWORD POSTGRESQL ===');
    try {
        const res = await pool.query('SELECT id, name, email FROM users ORDER BY id');
        console.log(`Ditemukan ${res.rows.length} user di database.`);
        
        for (const user of res.rows) {
            const password = USER_PASSWORDS[user.email] || 'student123';
            const hashed = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user.id]);
            console.log(`  ✅ ${user.email} → password diset ke: ${password}`);
        }
        console.log('Password PostgreSQL berhasil disinkronisasi!\n');
    } catch (e) {
        console.error('Error sinkronisasi password:', e.message);
    }
}

async function fixEnrollmentUserIds() {
    console.log('=== [2] FIX ENROLLMENT USERID DI MONGODB ===');
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Terhubung ke MongoDB.');

        // Cari semua enrollment yang userId-nya adalah angka (bukan email)
        const badEnrollments = await Enrollment.find({
            userId: { $not: /.*@.*/ } // userId yang BUKAN format email
        });

        if (badEnrollments.length === 0) {
            console.log('  ✅ Tidak ada enrollment dengan userId yang salah format.');
        } else {
            // Map dari angka ID ke email berdasarkan data PostgreSQL
            const userRes = await pool.query('SELECT id, email FROM users ORDER BY id');
            const idToEmail = {};
            userRes.rows.forEach(u => { idToEmail[String(u.id)] = u.email; });

            console.log(`Ditemukan ${badEnrollments.length} enrollment dengan userId angka. Memperbaiki...`);
            for (const enroll of badEnrollments) {
                const correctEmail = idToEmail[enroll.userId];
                if (correctEmail) {
                    await Enrollment.findByIdAndUpdate(enroll._id, { userId: correctEmail });
                    console.log(`  ✅ Fixed enrollment ${enroll._id}: userId "${enroll.userId}" → "${correctEmail}"`);
                } else {
                    console.log(`  ⚠️  Enrollment ${enroll._id}: userId "${enroll.userId}" tidak ditemukan di DB, dihapus.`);
                    await Enrollment.findByIdAndDelete(enroll._id);
                }
            }
        }

        // Tampilkan ringkasan enrollment per user
        console.log('\n=== RINGKASAN ENROLLMENT PER USER ===');
        const allEnrollments = await Enrollment.find({});
        const byUser = {};
        allEnrollments.forEach(e => {
            if (!byUser[e.userId]) byUser[e.userId] = 0;
            byUser[e.userId]++;
        });
        Object.entries(byUser).forEach(([email, count]) => {
            console.log(`  ${email}: ${count} kursus terdaftar`);
        });

        await mongoose.disconnect();
        console.log('\nSinkronisasi MongoDB selesai!');
    } catch (e) {
        console.error('Error fix enrollment:', e.message);
    }
}

async function main() {
    await syncPasswords();
    await fixEnrollmentUserIds();
    await pool.end();
    console.log('\n✅ SEMUA SINKRONISASI SELESAI!');
    console.log('=================================');
    console.log('Akun yang tersedia:');
    Object.entries(USER_PASSWORDS).forEach(([email, pw]) => {
        console.log(`  ${email} / ${pw}`);
    });
}

main().catch(console.error);
