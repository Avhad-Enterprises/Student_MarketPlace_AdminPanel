const { execSync } = require('child_process');
try {
    console.log('Running Campus Life Migration...');
    execSync('npx knex migrate:up 20260327210000_add_campus_life_fields_to_univ.js', { 
        cwd: 'c:\\Projects\\student-marketplace-backend-v2',
        stdio: 'inherit'
    });
} catch (error) {
    console.warn('Migration step failed:', error.message);
}
