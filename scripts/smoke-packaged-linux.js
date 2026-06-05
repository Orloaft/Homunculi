const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const timeoutMs = 90_000;

const fail = (message) => {
  console.error(`[package-smoke] ${message}`);
  process.exit(1);
};

if (process.platform !== 'linux') {
  fail(`Linux package smoke must run on linux, found ${process.platform}`);
}

if (!fs.existsSync(distDir)) {
  fail('dist directory does not exist; run npm run build-linux first');
}

const appImages = fs.readdirSync(distDir)
  .filter(file => file.endsWith('.AppImage'))
  .map(file => ({
    file,
    path: path.join(distDir, file),
    mtimeMs: fs.statSync(path.join(distDir, file)).mtimeMs
  }))
  .sort((a, b) => b.mtimeMs - a.mtimeMs);

if (appImages.length === 0) {
  fail('No AppImage found in dist; run npm run build-linux first');
}

const appImage = appImages[0];
const child = spawn(appImage.path, ['--no-sandbox', '--disable-gpu'], {
  cwd: root,
  env: {
    ...process.env,
    HOMUNCULI_FIRST_RUN_SMOKE: '1'
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';
const append = (chunk) => {
  const text = chunk.toString();
  output += text;
  process.stdout.write(text);
};

child.stdout.on('data', append);
child.stderr.on('data', append);

const timer = setTimeout(() => {
  child.kill('SIGTERM');
  fail(`Timed out after ${timeoutMs}ms launching ${path.relative(root, appImage.path)}`);
}, timeoutMs);

child.on('error', (error) => {
  clearTimeout(timer);
  fail(`Could not launch ${path.relative(root, appImage.path)}: ${error.message}`);
});

child.on('exit', (code, signal) => {
  clearTimeout(timer);
  if (code !== 0) {
    fail(`${path.relative(root, appImage.path)} exited with ${signal || code}`);
  }

  if (!output.includes('[smoke] first-run verified')) {
    fail(`${path.relative(root, appImage.path)} exited without first-run smoke proof`);
  }

  console.log(`[package-smoke] Linux AppImage first-run smoke passed: ${path.relative(root, appImage.path)}`);
});
