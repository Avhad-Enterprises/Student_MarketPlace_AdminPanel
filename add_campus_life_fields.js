const fs = require('fs');
const content = 'exports.up = async function(knex) {\n' +
'  const exists = await knex.schema.hasTable("universities");\n' +
'  if (exists) {\n' +
'    const columnsToUpdate = [\n' +
'      { name: "varsity_sports_count", type: "integer" },\n' +
'      { name: "on_campus_living_percentage", type: "decimal", precision: 5, scale: 2 },\n' +
'      { name: "countries_represented", type: "integer" }\n' +
'    ];\n\n' +
'    for (const col of columnsToUpdate) {\n' +
'      const hasCol = await knex.schema.hasColumn("universities", col.name);\n' +
'      if (!hasCol) {\n' +
'        await knex.schema.table("universities", table => {\n' +
'          if (col.type === "integer") table.integer(col.name);\n' +
'          else if (col.type === "decimal") table.decimal(col.name, col.precision, col.scale);\n' +
'        });\n' +
'      }\n' +
'    }\n' +
'  }\n' +
'};\n\n' +
'exports.down = function(knex) { return Promise.resolve(); };\n';

const targetPath = 'c:\\\\Projects\\\\student-marketplace-backend-v2\\\\migrations\\\\20260327210000_add_campus_life_fields_to_univ.js';
fs.writeFileSync(targetPath, content);
console.log('Migration created');
