const pg = require('pg');
const bcrypt = require('bcrypt');

async function resetPassword() {
    const client = new pg.Client({
        host: 'evenrmanagedb.c7yui4i62vbu.ap-south-1.rds.amazonaws.com',
        user: 'postgres',
        password: 'avhaddb123',
        database: 'student_marketplace',
        port: 5432,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await client.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, 'admin@example.com']);
        console.log('Password updated successfully for admin@example.com');
    } catch (err) {
        console.error('Error updating password:', err);
    } finally {
        await client.end();
    }
}

resetPassword();
