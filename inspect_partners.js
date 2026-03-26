const { Client } = require('pg');
const client = new Client({
  host: 'avhad-enterprises.tailb5282e.ts.net',
  user: 'defender',
  password: 'plFESt*B42R8Swl',
  database: 'student_marketplace',
  port: 30432,
  ssl: false
});

async function inspectTable() {
  try {
    await client.connect();
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'partners' ORDER BY column_name");
    res.rows.forEach(r => console.log(r.column_name));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

inspectTable();
