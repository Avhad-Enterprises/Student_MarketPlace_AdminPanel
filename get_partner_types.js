const { Client } = require('pg');
const client = new Client({
  host: 'avhad-enterprises.tailb5282e.ts.net',
  user: 'defender',
  password: 'plFESt*B42R8Swl',
  database: 'student_marketplace',
  port: 30432,
  ssl: false
});

async function getPartnerTypes() {
  try {
    await client.connect();
    const res = await client.query("SELECT DISTINCT partner_type FROM partners");
    console.log(res.rows.map(r => r.partner_type));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

getPartnerTypes();
