const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: '10.206.80.189',
    database: 'exam_db',
    password: 'postgres',
    port: 5432,
});

// Password resmi tiap akun sesuai data asli sistem
const USER_PASSWORDS = {
    'jessica@edu.ai':  'jeje123',
    'john@edu.ai':     'john123',
    'sarah@edu.ai':    'sarah123',
    'amos@edu.ai':     'amos123',
    'student@edu.ai':  'student123',
};

async function main() {
    console.log('=== SINKRONISASI PASSWORD SEMUA USER ===\n');
    try {
        for (const [email, password] of Object.entries(USER_PASSWORDS)) {
            const hash = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email',
                [hash, email]
            );
            if (result.rows.length > 0) {
                const user = result.rows[0];
                console.log(`✅ ${user.name} (${email}) → password: ${password}`);
            } else {
                console.log(`⚠️  User tidak ditemukan: ${email}`);
            }
        }
        console.log('\n✅ Semua password berhasil diset!');
        console.log('\nAkun yang tersedia:');
        Object.entries(USER_PASSWORDS).forEach(([e, p]) => console.log(`  ${e} / ${p}`));
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await pool.end();
    }
}

main();
