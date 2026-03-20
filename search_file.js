const fs = require('fs');
const file = 'c:\\Projects\\student_marketplace_frontend\\src\\app\\components\\common\\ImportDialog.tsx';
const content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('Column Mapping') || line.includes('Source Column') || line.includes('System Field')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
