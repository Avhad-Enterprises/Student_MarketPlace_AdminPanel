const { Client } = require('pg');

const config = {
    host: 'mmv-phase2-rds.c7o2kkcw83e3.ap-south-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'MMVPhase2_2026',
    database: 'StudenMarketPlace',
    ssl: { rejectUnauthorized: false }
};

async function testConnection() {
    const client = new Client(config);
    try {
        await client.connect();
        console.log('SUCCESS: Connected to RDS');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
    } catch (err) {
        console.error('FAILURE: Could not connect to RDS', err);
    } finally {
        await client.end();
    }
}

testConnection();
