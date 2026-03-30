const { Client } = require('pg');

const client = new Client({
  host: 'avhad-enterprises.tailb5282e.ts.net',
  user: 'defender',
  password: 'plFESt*B42R8Swl',
  database: 'student_marketplace',
  port: 30432,
  ssl: false
});

async function checkSchema() {
  try {
    await client.connect();
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'students'
      ORDER BY ordinal_position;
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.error('Error connecting to DB:', err);
  } finally {
    await client.end();
  }
}

checkSchema();
