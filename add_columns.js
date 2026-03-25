const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: 'avhad-enterprises.tailb5282e.ts.net',
    user: 'defender',
    password: 'plFESt*B42R8Swl',
    database: 'student_marketplace',
    port: 30432,
    ssl: false,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    const fieldsToAdd = [
      'highest_qualification VARCHAR(255)',
      'field_of_study VARCHAR(255)',
      'current_institution VARCHAR(255)',
      'graduation_year VARCHAR(255)',
      'gpa VARCHAR(255)',
      'first_touch_date TIMESTAMP',
      'conversion_path_summary TEXT',
      'preferred_course_level VARCHAR(255)',
      'budget_range VARCHAR(255)',
      'intake_preference VARCHAR(255)',
      'test_scores VARCHAR(255)'
    ];

    for (const field of fieldsToAdd) {
      const fieldName = field.split(' ')[0];
      try {
        await client.query(`ALTER TABLE students ADD COLUMN ${field};`);
        console.log(`Added column ${fieldName} to students table.`);
      } catch (err) {
        if (err.code === '42701') { // column already exists
          console.log(`Column ${fieldName} already exists.`);
        } else {
          console.error(`Error adding column ${fieldName}:`, err.message);
        }
      }
    }

    console.log('Finished updating students table schema.');
  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    await client.end();
  }
}

run();
