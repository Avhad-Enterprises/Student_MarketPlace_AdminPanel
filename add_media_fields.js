const fs = require('fs');
const content = `exports.up = async function(knex) {
  const exists = await knex.schema.hasTable("universities");
  if (exists) {
    const newCols = ["university_logo", "university_banner"];
    for (const col of newCols) {
      const hasCol = await knex.schema.hasColumn("universities", col);
      if (!hasCol) {
        await knex.schema.table("universities", table => {
          table.text(col);
        });
      }
    }
  }
};
exports.down = function(knex) { return Promise.resolve(); };
`;

fs.writeFileSync(
  'c:\\Projects\\student-marketplace-backend-v2\\migrations\\20260327230000_add_media_fields_to_univ.js',
  content
);
console.log('Migration created');
