/**
 * fix_enrollments.js - Fix enrollment userId di MongoDB dari angka ke email
 * Jalankan dari: backend/course-service/
 */
const mongoose = require('mongoose');
const { Pool } = require('pg');

// Koneksi ke PostgreSQL untuk mapping id → email
const pgConfig = {
    user: 'postgres',
    host: '10.206.80.189',
    database: 'exam_db',
    password: 'postgres',
    port: 5432,
};

const MONGO_URI = 'mongodb://admin:admin123@10.206.80.189:27018,10.206.80.228:27018,10.206.80.79:27018/lms?authSource=admin&replicaSet=rs0';

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

async function main() {
    console.log('Menghubungkan ke MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Terhubung ke MongoDB!\n');

    // Ambil mapping id → email dari PostgreSQL
    const pool = new Pool(pgConfig);
    const userRes = await pool.query('SELECT id, email FROM users ORDER BY id');
    const idToEmail = {};
    userRes.rows.forEach(u => { idToEmail[String(u.id)] = u.email; });
    console.log('Mapping ID → Email dari PostgreSQL:', idToEmail);
    await pool.end();

    // Cari enrollment dengan userId yang bukan format email
    const allEnrollments = await Enrollment.find({});
    console.log(`\nTotal enrollment di MongoDB: ${allEnrollments.length}`);

    let fixed = 0, deleted = 0;
    for (const enroll of allEnrollments) {
        // Jika userId bukan email (tidak ada @)
        if (!enroll.userId.includes('@')) {
            const correctEmail = idToEmail[enroll.userId];
            if (correctEmail) {
                // Cek apakah enrollment dengan email ini sudah ada
                const existing = await Enrollment.findOne({
                    userId: correctEmail,
                    courseId: enroll.courseId,
                    _id: { $ne: enroll._id }
                });
                if (existing) {
                    // Sudah ada duplikat, hapus yang angka
                    await Enrollment.findByIdAndDelete(enroll._id);
                    console.log(`  🗑️  Hapus duplikat enrollment ${enroll._id} (userId: "${enroll.userId}" sudah ada sebagai "${correctEmail}")`);
                    deleted++;
                } else {
                    // Update ke email
                    await Enrollment.findByIdAndUpdate(enroll._id, { userId: correctEmail });
                    console.log(`  ✅ Fix enrollment ${enroll._id}: "${enroll.userId}" → "${correctEmail}"`);
                    fixed++;
                }
            } else {
                // ID tidak ditemukan di PostgreSQL, hapus
                await Enrollment.findByIdAndDelete(enroll._id);
                console.log(`  🗑️  Hapus enrollment orphan ${enroll._id} (userId: "${enroll.userId}" tidak ditemukan)`);
                deleted++;
            }
        }
    }

    console.log(`\n✅ Selesai! Fixed: ${fixed}, Deleted: ${deleted}`);

    // Ringkasan akhir
    console.log('\n=== RINGKASAN ENROLLMENT PER USER ===');
    const final = await Enrollment.find({});
    const byUser = {};
    final.forEach(e => {
        if (!byUser[e.userId]) byUser[e.userId] = [];
        byUser[e.userId].push(`${e.courseId} (${e.completionPercent || 0}%)`);
    });
    Object.entries(byUser).forEach(([email, courses]) => {
        console.log(`\n  👤 ${email} - ${courses.length} kursus:`);
        courses.forEach(c => console.log(`     - ${c}`));
    });

    await mongoose.disconnect();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
