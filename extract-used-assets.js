const fs = require('fs');
const path = require('path');

// Read game.js
const gameCode = fs.readFileSync('scripts/game.js', 'utf8');

// Extract all asset paths from load calls
const assetPaths = new Set();

// Match various load patterns
const patterns = [
    /this\.load\.\w+\([^,]+,\s*['"]([^'"]+)['"]/g,
    /load\.\w+\([^,]+,\s*['"]([^'"]+)['"]/g,
    /setTexture\(['"]([^'"]+)['"]/g,
];

patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(gameCode)) !== null) {
        const assetPath = match[1];
        if (assetPath.startsWith('assets/') || assetPath.startsWith('sfx/')) {
            assetPaths.add(assetPath);
        }
    }
});

// Also check for sfx files
const sfxPattern = /sound\(['"]([^'"]+)['"]/g;
let match;
while ((match = sfxPattern.exec(gameCode)) !== null) {
    assetPaths.add(match[1]);
}

// Output the list
console.log(JSON.stringify(Array.from(assetPaths).sort(), null, 2));
console.error(`\nFound ${assetPaths.size} unique asset references`);
