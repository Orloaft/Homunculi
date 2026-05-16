const fs = require('fs');
const path = require('path');

// Load the list of used assets
const usedAssets = JSON.parse(fs.readFileSync('used-assets.json', 'utf8'));

// Create clean build directory
const buildDir = 'wizbiz-itch-clean';
if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir);

// Copy essential game files
const essentialFiles = [
    'index.html',
    'scripts/game.js',
    'scripts/phaser.min.js',
    'scripts/hitbox-config.js',
    'scripts/hitbox-config.json',
    'scripts/boss_system.js',
    'scripts/electron-fixes.js',
    'scripts/ChunkManager.js',
    'scripts/SpatialHashGrid.js',
    'scripts/LODSystem.js',
    'scripts/ObstacleManager.js',
    'scripts/InfiniteGameScene.js',
    'scripts/autoplay.js',
    'src/systems/SaveManager.js',
    'build/systems/AchievementManager.js',
    'src/scenes/SaveSlotScene.js',
    'src/ui/AchievementNotification.js',
    'gamecartridge/Box+Cartridge-export.png',
    'gamecartridge/Box+Cartridge.obj'
];

console.log('Copying essential files...');
essentialFiles.forEach(file => {
    const dest = path.join(buildDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, dest);
        console.log('  OK ' + file);
    } else {
        console.warn('  MISSING ' + file);
    }
});

// Copy only used assets
console.log('\nCopying referenced assets...');
let copiedCount = 0;
let missingCount = 0;
const missing = [];

usedAssets.forEach(assetPath => {
    // Try both the original path and URL-decoded path
    const decodedPath = decodeURIComponent(assetPath);
    let sourcePath = assetPath;
    
    if (!fs.existsSync(sourcePath)) {
        sourcePath = decodedPath;
    }
    
    if (fs.existsSync(sourcePath)) {
        const dest = path.join(buildDir, assetPath);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(sourcePath, dest);
        copiedCount++;
        if (copiedCount % 50 === 0) {
            console.log('  Copied ' + copiedCount + ' of ' + usedAssets.length);
        }
    } else {
        missing.push(assetPath);
        missingCount++;
    }
});

console.log('\nBuild complete!');
console.log('  Scripts: ' + essentialFiles.length + ' files');
console.log('  Assets copied: ' + copiedCount + ' files');
console.log('  Assets missing: ' + missingCount + ' files');
console.log('  Total in build: ' + (copiedCount + essentialFiles.length) + ' files');

if (missing.length > 0 && missing.length < 10) {
    console.log('\nMissing files:');
    missing.forEach(f => console.log('  ' + f));
}
