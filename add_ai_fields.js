const fs = require('fs');
const content = `exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const newCols = [
      { name: "prestige_level", type: "string" },
      { name: "tags", type: "text" }
    ];
    for (const col of newCols) {
      const hasCol = await knex.schema.hasColumn("universities", col.name);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          if (col.type === "string") table.string(col.name);
          else table.text(col.name);
        });
      }
    }
  }
};
exports.down = function(knex) { return Promise.resolve(); };
`;
fs.writeFileSync(
  'c:\\Projects\\student-marketplace-backend-v2\\migrations\\20260327240000_add_ai_fields_to_univ.js',
  content
);
console.log('Migration created');
