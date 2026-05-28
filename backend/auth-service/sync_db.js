const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: '10.206.80.189',
    database: 'exam_db',
    password: 'postgres',
    port: 5432,
});

async function runSync() {
    try {
        console.log('Connecting to PostgreSQL database to sync users...');
        const res = await pool.query('SELECT * FROM users');
        const users = res.rows;
        
        console.log(`Found ${users.length} users in database.`);
        for (const user of users) {
            const isHashed = user.password && user.password.startsWith('$2');
            if (!isHashed) {
                const plainPassword = user.password || 'password123';
                const hashedPassword = await bcrypt.hash(plainPassword, 10);
                console.log(`Hashing password for user: ${user.email}`);
                await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
            }
        }

        // Check if amos@edu.ai exists, if not, create it
        const amosCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['amos@edu.ai']);
        if (amosCheck.rows.length === 0) {
            console.log('User amos@edu.ai not found. Creating entry...');
            const hash = await bcrypt.hash('password123', 10);
            await pool.query(
                'INSERT INTO users (name, email, password, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
                ['Amos', 'amos@edu.ai', hash]
            );
            console.log('User amos@edu.ai successfully registered.');
        }

        // Check if student@edu.ai exists, if not, create it
        const studentCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['student@edu.ai']);
        if (studentCheck.rows.length === 0) {
            console.log('User student@edu.ai not found. Creating entry...');
            const hash = await bcrypt.hash('password123', 10);
            await pool.query(
                'INSERT INTO users (name, email, password, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
                ['Siswa Portal', 'student@edu.ai', hash]
            );
            console.log('User student@edu.ai successfully registered.');
        }

        console.log('Synchronization complete!');
    } catch (err) {
        console.error('Error during synchronization:', err);
    } finally {
        await pool.end();
    }
}

runSync();
