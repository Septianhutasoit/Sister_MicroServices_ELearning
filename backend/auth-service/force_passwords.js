const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: '10.206.80.189',
    database: 'exam_db',
    password: 'postgres',
    port: 5432,
});

async function resetPasswords() {
    try {
        console.log('Connecting to database to reset passwords...');
        const hashedPassword = await bcrypt.hash('student123', 10);
        
        const res = await pool.query('SELECT id, email FROM users');
        console.log(`Updating passwords for ${res.rows.length} users to 'student123'...`);
        
        for (const user of res.rows) {
            await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
            console.log(`Password updated for: ${user.email}`);
        }
        console.log('All passwords successfully reset to student123!');
    } catch (e) {
        console.error('Error resetting passwords:', e);
    } finally {
        await pool.end();
    }
}

resetPasswords();
