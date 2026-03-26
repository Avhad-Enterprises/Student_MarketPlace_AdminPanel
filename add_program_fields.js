const fs = require('fs');
const content = 'exports.up = async function(knex) {\n' +
'  const exists = await knex.schema.hasTable("universities");\n' +
'  if (exists) {\n' +
'    const columnsToUpdate = [\n' +
'      { name: "undergraduate_duration", type: "decimal", precision: 5, scale: 2 },\n' +
'      { name: "undergraduate_credits", type: "decimal", precision: 8, scale: 2 },\n' +
'      { name: "graduate_duration", type: "decimal", precision: 5, scale: 2 },\n' +
'      { name: "graduate_programs", type: "jsonb" }\n' +
'    ];\n\n' +
'    for (const col of columnsToUpdate) {\n' +
'      const hasCol = await knex.schema.hasColumn("universities", col.name);\n' +
'      if (!hasCol) {\n' +
'        await knex.schema.table("universities", table => {\n' +
'          if (col.type === "decimal") table.decimal(col.name, col.precision, col.scale);\n' +
'          else if (col.type === "jsonb") table.jsonb(col.name).defaultTo("[]");\n' +
'        });\n' +
'      }\n' +
'    }\n' +
'  }\n' +
'};\n\n' +
'exports.down = function(knex) { return Promise.resolve(); };\n';

const targetPath = 'c:\\\\Projects\\\\student-marketplace-backend-v2\\\\migrations\\\\20260327200000_add_program_fields_to_univ.js';
fs.writeFileSync(targetPath, content);
console.log('Migration created');
