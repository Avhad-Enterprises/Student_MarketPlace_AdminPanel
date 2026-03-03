const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
    host: 'mmv-phase2-rds.c7o2kkcw83e3.ap-south-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'MMVPhase2_2026',
    database: 'StudenMarketPlace',
    ssl: { rejectUnauthorized: false }
});

async function verifyHash() {
    try {
        const email = 'test.user@example.com';
        const passwordToTest = 'password';

        console.log('Connecting to database...');
        await client.connect();

        const res = await client.query('SELECT password_hash, account_status FROM users WHERE email = $1', [email]);
        if (res.rows.length > 0) {
            const { password_hash, account_status } = res.rows[0];
            console.log('Hash from DB:', password_hash);
            console.log('Account Status:', account_status);
            const match = await bcrypt.compare(passwordToTest, password_hash);
            console.log(`Does "${passwordToTest}" match the hash? ${match}`);
        } else {
            console.log(`User ${email} not found.`);
        }
    } catch (err) {
        console.error('Database error:', err.message);
    } finally {
        await client.end();
    }
}

verifyHash();
