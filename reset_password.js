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

async function resetPasswords() {
    try {
        const users = [
            { email: 'test.student@example.com', password: 'password' },
            { email: 'test.user@example.com', password: 'password' }
        ];

        console.log('Connecting to database...');
        await client.connect();

        for (const user of users) {
            console.log(`Generating hash for "${user.password}"...`);
            const hashedPassword = await bcrypt.hash(user.password, 10);

            console.log(`Updating password for ${user.email}...`);
            const res = await client.query(
                'UPDATE users SET password_hash = $1, account_status = $2 WHERE email = $3 RETURNING id',
                [hashedPassword, 'active', user.email]
            );

            if (res.rowCount > 0) {
                console.log(`Successfully updated password for ${user.email}.`);
            } else {
                console.log(`User ${user.email} not found.`);
            }
        }
    } catch (err) {
        console.error('Database error:', err.message);
    } finally {
        await client.end();
    }
}

resetPasswords();
