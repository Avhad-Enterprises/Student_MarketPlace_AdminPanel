const knex = require('knex');
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

async function checkKycColumns() {
  try {
    const info = await db('system_settings').columnInfo();
    const columns = Object.keys(info);
    console.log('Columns in system_settings:', columns.filter(c => c.includes('kyc')));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

checkKycColumns();
