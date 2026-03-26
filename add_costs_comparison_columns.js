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
      ADD COLUMN IF NOT EXISTS living_cost_min NUMERIC,
      ADD COLUMN IF NOT EXISTS living_cost_max NUMERIC,
      ADD COLUMN IF NOT EXISTS total_cost_min NUMERIC,
      ADD COLUMN IF NOT EXISTS total_cost_max NUMERIC,
      ADD COLUMN IF NOT EXISTS health_insurance_min NUMERIC,
      ADD COLUMN IF NOT EXISTS health_insurance_max NUMERIC;
    `;

    await client.query(sql);
    console.log('Successfully added costs comparison columns to countries table');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

migrate();
