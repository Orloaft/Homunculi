const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const fail = (message) => {
  throw new Error(message);
};

const packageJson = readJson('package.json');
const build = packageJson.build || {};
const files = Array.isArray(build.files) ? build.files : [];
const requiredPackageEntries = [
  'index.html',
  'package.json',
  'icon.png',
  'hitboxes.json',
  'loop-assets.json',
  'used-assets.json',
  'assets/**/*',
  'sfx/**/*',
  'gamecartridge/**/*',
  'scripts/**/*',
  'build/**/*',
  'src/**/*.js'
];

requiredPackageEntries.forEach((entry) => {
  if (!files.includes(entry)) {
    fail(`electron-builder files is missing ${entry}`);
  }
});

if (packageJson.main !== 'scripts/main.js') {
  fail(`package main should be scripts/main.js, found ${packageJson.main}`);
}
if (!exists(packageJson.main)) {
  fail(`Electron main entry does not exist: ${packageJson.main}`);
}

const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const localScriptSources = Array.from(indexHtml.matchAll(/<script\s+[^>]*src="([^"]+)"/g))
  .map(match => match[1])
  .filter(src => !/^https?:\/\//i.test(src))
  .map(src => src.split('?')[0]);

localScriptSources.forEach((src) => {
  if (!exists(src)) {
    fail(`index.html references missing script ${src}`);
  }
});

[
  'gamecartridge/Box+Cartridge-export.png',
  'gamecartridge/Box+Cartridge.obj',
  'scripts/phaser.min.js',
  'scripts/game.js',
  'src/systems/SaveManager.js',
  'src/scenes/SaveSlotScene.js',
  'build/systems/AchievementManager.js'
].forEach((asset) => {
  if (!exists(asset)) {
    fail(`Required packaged runtime asset is missing: ${asset}`);
  }
});

console.log('[package-audit] package config covers first-run runtime files');
