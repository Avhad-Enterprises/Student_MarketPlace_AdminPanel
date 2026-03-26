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
    console.log('Connected to database');

    const sql = `
      ALTER TABLE countries 
      ADD COLUMN IF NOT EXISTS capital_city VARCHAR(255),
      ADD COLUMN IF NOT EXISTS official_languages TEXT,
      ADD COLUMN IF NOT EXISTS climate TEXT,
      ADD COLUMN IF NOT EXISTS safety_rating NUMERIC(3, 2);
    `;

    await client.query(sql);
    console.log('Successfully added basic info columns to countries table');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

migrate();
