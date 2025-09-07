// DEPRECATED - Use run-editor.js instead
console.log(`
╔════════════════════════════════════════════╗
║              DEPRECATED FILE                ║
╠════════════════════════════════════════════╣
║  This file is deprecated.                  ║
║  Please use run-editor.js instead:         ║
║                                            ║
║  node sprite-editor/run-editor.js          ║
║                                            ║
║  Or use the convenience scripts:           ║
║  - Windows: run-sprite-editor.bat          ║
║  - Linux/Mac: ./run-sprite-editor.sh       ║
╚════════════════════════════════════════════╝
`);

// Auto-redirect to the new server
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting the new server...\n');
const newServer = spawn('node', [path.join(__dirname, 'run-editor.js')], {
    stdio: 'inherit'
});

newServer.on('error', (err) => {
    console.error('Failed to start new server:', err);
});

newServer.on('exit', (code) => {
    process.exit(code);
});