const knex = require('knex');
const path = require('path');
require('dotenv').config({ path: 'c:/Projects/student-marketplace-backend-v2/.env' });

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }
});

async function checkUsers() {
    try {
        console.log('Connecting to database...');
        const users = await db('users').select('email', 'id').limit(5);
        console.log('Found users:', users);
    } catch (error) {
        console.error('Database error:', error.message);
    } finally {
        await db.destroy();
    }
}

checkUsers();
