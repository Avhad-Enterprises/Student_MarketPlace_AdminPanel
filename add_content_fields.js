const fs = require('fs');
const content = 'exports.up = async function(knex) {\n' +
'  const exists = await knex.schema.hasTable("universities");\n' +
'  if (exists) {\n' +
'    const newCols = [\n' +
'      "overview", "academic_programs_content", "admissions_content",\n' +
'      "financial_aid_content", "campus_life_content", "career_outcomes_content", "research_content"\n' +
'    ];\n' +
'    for (const col of newCols) {\n' +
'      const hasCol = await knex.schema.hasColumn("universities", col);\n' +
'      if (!hasCol) {\n' +
'        await knex.schema.table("universities", table => {\n' +
'          table.text(col);\n' +
'        });\n' +
'      }\n' +
'    }\n' +
'  }\n' +
'};\n\n' +
'exports.down = function(knex) { return Promise.resolve(); };\n';

const targetPath = 'c:\\\\Projects\\\\student-marketplace-backend-v2\\\\migrations\\\\20260327220000_add_content_fields_to_univ.js';
fs.writeFileSync(targetPath, content);
console.log('Migration created');
