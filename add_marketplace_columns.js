const { Client } = require('pg');

const client = new Client({
  host: 'avhad-enterprises.tailb5282e.ts.net',
  user: 'defender',
  password: 'plFESt*B42R8Swl',
  database: 'student_marketplace',
  port: 30432,
  ssl: false
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to database.');

    const sql = `
      ALTER TABLE countries 
      ADD COLUMN IF NOT EXISTS visa_providers JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS loan_providers JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS housing_providers JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS insurance_providers JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS forex_providers JSONB DEFAULT '[]';
    `;

    await client.query(sql);
    console.log('Migration completed successfully: Added marketplace columns to countries table.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
