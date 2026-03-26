const { Client } = require('pg');
const client = new Client({
  host: 'avhad-enterprises.tailb5282e.ts.net',
  user: 'defender',
  password: 'plFESt*B42R8Swl',
  database: 'student_marketplace',
  port: 30432,
  ssl: false
});

async function getStudentServices() {
  try {
    await client.connect();
    const res = await client.query("SELECT * FROM student_services LIMIT 10");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

getStudentServices();
