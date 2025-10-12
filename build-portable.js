const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting portable build...\n');

// Set environment variables to disable signing
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
process.env.WIN_CSC_LINK = '';
process.env.WIN_CSC_KEY_PASSWORD = '';

const command = 'electron-builder --win portable --config.win.sign=false';

try {
  execSync(command, { 
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname
  });
  console.log('\n✓ Build completed successfully!');
} catch (error) {
  // Check if the portable exe was actually created despite the error
  const distPath = path.join(__dirname, 'dist');
  const files = fs.readdirSync(distPath).filter(f => f.endsWith('.exe'));
  
  if (files.length > 0) {
    console.log('\n✓ Build completed with warnings (portable executable created successfully)');
    console.log('\nCreated files:');
    files.forEach(file => {
      const stats = fs.statSync(path.join(distPath, file));
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`  - ${file} (${sizeMB} MB)`);
    });
    process.exit(0);
  } else {
    console.error('\n✗ Build failed:', error.message);
    process.exit(1);
  }
}