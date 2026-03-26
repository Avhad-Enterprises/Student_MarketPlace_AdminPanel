const fs = require('fs');
const path = require('path');

const content = 'exports.up = async function(knex) {\n' +
'  const exists = await knex.schema.hasTable("universities");\n' +
'  if (!exists) {\n' +
'    return knex.schema.createTable("universities", function(table) {\n' +
'      table.increments("id").primary();\n' +
'      table.string("name").notNullable();\n' +
'      table.string("country");\n' +
'      table.string("city");\n' +
'      table.string("logo_url");\n' +
'      table.string("website");\n' +
'      table.string("status").defaultTo("active");\n' +
'      table.timestamps(true, true);\n' +
'    });\n' +
'  }\n\n' +
'  const columns = [\n' +
'    { name: "world_ranking", type: "integer" },\n' +
'    { name: "global_score", type: "float" },\n' +
'    { name: "location_type", type: "string" },\n' +
'    { name: "campus_size", type: "string" },\n' +
'    { name: "established_year", type: "integer" },\n' +
'    { name: "university_type", type: "string" },\n' +
'    { name: "acceptance_rate", type: "float" },\n' +
'    { name: "application_deadline_fall", type: "string" },\n' +
'    { name: "application_deadline_spring", type: "string" },\n' +
'    { name: "application_fee", type: "decimal", precision: 10, scale: 2 },\n' +
'    { name: "min_gpa", type: "float" },\n' +
'    { name: "min_ielts", type: "float" },\n' +
'    { name: "min_toefl", type: "integer" },\n' +
'    { name: "total_students", type: "integer" },\n' +
'    { name: "international_students", type: "integer" },\n' +
'    { name: "international_ratio", type: "float" },\n' +
'    { name: "gender_ratio", type: "string" },\n' +
'    { name: "tuition_fees_min", type: "decimal", precision: 12, scale: 2 },\n' +
'    { name: "tuition_fees_max", type: "decimal", precision: 12, scale: 2 },\n' +
'    { name: "living_cost_min", type: "decimal", precision: 10, scale: 2 },\n' +
'    { name: "living_cost_max", type: "decimal", precision: 10, scale: 2 },\n' +
'    { name: "financial_aid_available", type: "boolean", default: false },\n' +
'    { name: "scholarships_info", type: "text" },\n' +
'    { name: "research_rating", type: "string" },\n' +
'    { name: "graduate_outcome_rate", type: "float" },\n' +
'    { name: "top_recruiters", type: "jsonb" },\n' +
'    { name: "career_services", type: "text" },\n' +
'    { name: "degree_levels", type: "jsonb" },\n' +
'    { name: "credit_system", type: "string" },\n' +
'    { name: "internship_available", type: "boolean", default: false },\n' +
'    { name: "industry_partners", type: "jsonb" },\n' +
'    { name: "campus_facilities", type: "jsonb" },\n' +
'    { name: "student_orgs_count", type: "integer" },\n' +
'    { name: "housing_available", type: "boolean", default: false },\n' +
'    { name: "housing_types", type: "text" },\n' +
'    { name: "description", type: "text" },\n' +
'    { name: "key_facts", type: "jsonb" },\n' +
'    { name: "pros", type: "jsonb" },\n' +
'    { name: "cons", type: "jsonb" },\n' +
'    { name: "hero_image", type: "string" },\n' +
'    { name: "video_tour_url", type: "string" },\n' +
'    { name: "gallery_images", type: "jsonb" },\n' +
'    { name: "ai_context_summary", type: "text" },\n' +
'    { name: "key_selling_points", type: "jsonb" },\n' +
'    { name: "roi_rating", type: "string" },\n' +
'    { name: "slug", type: "string" },\n' +
'    { name: "application_status", type: "string", default: "open" },\n' +
'    { name: "visible", type: "boolean", default: true },\n' +
'    { name: "admin_notes", type: "text" },\n' +
'    { name: "country_id", type: "integer" }\n' +
'  ];\n\n' +
'  for (const col of columns) {\n' +
'    const hasCol = await knex.schema.hasColumn("universities", col.name);\n' +
'    if (!hasCol) {\n' +
'      await knex.schema.table("universities", table => {\n' +
'        let colDef;\n' +
'        if (col.type === "string") colDef = table.string(col.name);\n' +
'        else if (col.type === "integer") colDef = table.integer(col.name);\n' +
'        else if (col.type === "float") colDef = table.float(col.name);\n' +
'        else if (col.type === "decimal") colDef = table.decimal(col.name, col.precision, col.scale);\n' +
'        else if (col.type === "boolean") colDef = table.boolean(col.name);\n' +
'        else if (col.type === "text") colDef = table.text(col.name);\n' +
'        else if (col.type === "jsonb") colDef = table.jsonb(col.name);\n' +
'        if (col.default !== undefined) colDef.defaultTo(col.default);\n' +
'      });\n' +
'    }\n' +
'  }\n' +
'};\n\n' +
'exports.down = function(knex) { return Promise.resolve(); };\n';

const targetPath = 'c:\\\\Projects\\\\student-marketplace-backend-v2\\\\migrations\\\\20260327140000_expand_universities.js';
fs.writeFileSync(targetPath, content);
console.log('Done');
