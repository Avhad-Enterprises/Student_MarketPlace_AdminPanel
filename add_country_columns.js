const { Client } = require('pg');

const client = new Client({
  host: 'avhad-enterprises.tailb5282e.ts.net',
  user: 'defender',
  password: 'plFESt*B42R8Swl',
  database: 'student_marketplace',
  port: 30432,
  ssl: false
});

async function addColumns() {
  try {
    await client.connect();
    console.log('Connected to database');

    const sql = `
      ALTER TABLE countries 
      ADD COLUMN IF NOT EXISTS tuition_fees_min NUMERIC,
      ADD COLUMN IF NOT EXISTS tuition_fees_max NUMERIC,
      ADD COLUMN IF NOT EXISTS monthly_living_expenses NUMERIC,
      ADD COLUMN IF NOT EXISTS accommodation_min NUMERIC,
      ADD COLUMN IF NOT EXISTS accommodation_max NUMERIC,
      ADD COLUMN IF NOT EXISTS food_monthly NUMERIC,
      ADD COLUMN IF NOT EXISTS transport_monthly NUMERIC,
      ADD COLUMN IF NOT EXISTS health_insurance_annual NUMERIC,
      
      ADD COLUMN IF NOT EXISTS education_overview TEXT,
      ADD COLUMN IF NOT EXISTS major_intakes TEXT,
      ADD COLUMN IF NOT EXISTS avg_degree_duration VARCHAR(255),
      ADD COLUMN IF NOT EXISTS credit_system_info TEXT,
      ADD COLUMN IF NOT EXISTS top_unis_summary TEXT,
      
      ADD COLUMN IF NOT EXISTS visa_process_info TEXT,
      ADD COLUMN IF NOT EXISTS visa_fee NUMERIC,
      ADD COLUMN IF NOT EXISTS permit_validity VARCHAR(255),
      ADD COLUMN IF NOT EXISTS psw_duration VARCHAR(255),
      ADD COLUMN IF NOT EXISTS psw_conditions TEXT,
      ADD COLUMN IF NOT EXISTS part_time_work_hours INTEGER,
      ADD COLUMN IF NOT EXISTS spouse_work_allowed BOOLEAN DEFAULT FALSE,
      
      ADD COLUMN IF NOT EXISTS job_market_info TEXT,
      ADD COLUMN IF NOT EXISTS key_industries TEXT,
      ADD COLUMN IF NOT EXISTS pr_pathway_info TEXT,
      ADD COLUMN IF NOT EXISTS settlement_options TEXT,
      
      ADD COLUMN IF NOT EXISTS ai_context_summary TEXT,
      ADD COLUMN IF NOT EXISTS decision_pros_cons TEXT,
      ADD COLUMN IF NOT EXISTS key_attractions TEXT,
      ADD COLUMN IF NOT EXISTS potential_challenges TEXT,
      
      ADD COLUMN IF NOT EXISTS marketplace_notes TEXT,
      ADD COLUMN IF NOT EXISTS partner_summary TEXT,
      
      ADD COLUMN IF NOT EXISTS hero_image VARCHAR(255),
      ADD COLUMN IF NOT EXISTS flag_icon VARCHAR(255),
      ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
      ADD COLUMN IF NOT EXISTS meta_description TEXT,
      ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
    `;

    await client.query(sql);
    console.log('Country expansion columns added successfully');

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

addColumns();
