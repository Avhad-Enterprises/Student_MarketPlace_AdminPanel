const { execSync } = require('child_process');
const path = require('path');

const backendDir = 'c:\\Projects\\student-marketplace-backend-v2';

try {
    console.log('Running RBAC Migration in backend...');
    const knexBin = path.join(backendDir, 'node_modules', '.bin', 'knex.cmd');
    // Use the backend's knex and knexfile
    const command = `"${knexBin}" migrate:latest --knexfile knexfile.js`;
    console.log(`Executing: ${command}`);
    
    const output = execSync(command, { 
        cwd: backendDir,
        env: { ...process.env, NODE_ENV: 'development' }
    });
    console.log('Migration successful!');
    console.log(output.toString());
} catch (error) {
    console.error('Migration failed!');
    if (error.stdout) console.log('STDOUT:', error.stdout.toString());
    if (error.stderr) console.error('STDERR:', error.stderr.toString());
    console.error('ERROR MESSAGE:', error.message);
    process.exit(1);
}
