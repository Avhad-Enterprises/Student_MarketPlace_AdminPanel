const { Client } = require('pg');

const client = new Client({
    host: 'avhad-enterprises.tailb5282e.ts.net',
    port: 30432,
    user: 'defender',
    password: 'plFESt*B42R8Swl',
    database: 'student_marketplace',
    ssl: false
});

async function checkRBAC() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        
        console.log('\n--- Roles Table ---');
        const rolesRes = await client.query('SELECT id, name, description FROM roles');
        console.table(rolesRes.rows);

        console.log('\n--- Users with Roles ---');
        const usersRes = await client.query(`
            SELECT u.email, u.full_name, r.name as role_name 
            FROM users u 
            LEFT JOIN roles r ON u.role_id = r.id 
            LIMIT 10
        `);
        console.table(usersRes.rows);

    } catch (err) {
        console.error('Database error:', err.message);
    } finally {
        await client.end();
    }
}

checkRBAC();
