const { Client } = require('pg');

const client = new Client({
    host: 'mmv-phase2-rds.c7o2kkcw83e3.ap-south-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'MMVPhase2_2026',
    database: 'StudenMarketPlace',
    ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected. Querying users...');
        const res = await client.query('SELECT email, password_hash, account_status, user_type FROM users');
        console.log('Users found:', res.rows.length);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Database error:', err.message);
    } finally {
        await client.end();
    }
}

checkUsers();
