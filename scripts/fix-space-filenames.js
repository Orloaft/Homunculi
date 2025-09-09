const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing file references with spaces in game code...\n');

// Files to update
const filesToFix = [
    path.join(__dirname, 'game.js'),
    path.join(__dirname, 'InfiniteGameScene.js'),
    path.join(__dirname, 'UltraOptimizedGameScene.js'),
    path.join(__dirname, 'boss_system.js'),
    path.join(__dirname, '..', 'src', 'scenes', 'GameScene.js'),
    path.join(__dirname, '..', 'src', 'scenes', 'LoadingScene.js'),
    path.join(__dirname, '..', 'src', 'data', 'EnemyConfig.js')
];

// Map of file references that have spaces (need to match exact strings in code)
const spaceFileReplacements = [
    // Smoke VFX files - these are commonly referenced
    ["'Smoke VFX A", "'Smoke%20VFX%20A"],
    ['"Smoke VFX A', '"Smoke%20VFX%20A'],
    ["'Smoke VFX B", "'Smoke%20VFX%20B"],
    ['"Smoke VFX B', '"Smoke%20VFX%20B'],
    ["'Smoke VFX C", "'Smoke%20VFX%20C"],
    ['"Smoke VFX C', '"Smoke%20VFX%20C'],
    
    // Water animations
    ["'Water Spike", "'Water%20Spike"],
    ['"Water Spike', '"Water%20Spike'],
    ["'Water Splash", "'Water%20Splash"],
    ['"Water Splash', '"Water%20Splash'],
    ["'Water StartUp", "'Water%20StartUp"],
    ['"Water StartUp', '"Water%20StartUp'],
    ["'Water Blast", "'Water%20Blast"],
    ['"Water Blast', '"Water%20Blast'],
    ["'WaterBall - ", "'WaterBall%20-%20"],
    ['"WaterBall - ', '"WaterBall%20-%20'],
    
    // Ice VFX
    ["'Ice VFX", "'Ice%20VFX"],
    ['"Ice VFX', '"Ice%20VFX'],
    ["'VFX 1 ", "'VFX%201%20"],
    ['"VFX 1 ', '"VFX%201%20'],
    
    // Acid VFX
    ["'Acid VFX", "'Acid%20VFX"],
    ['"Acid VFX', '"Acid%20VFX'],
    
    // Dark VFX
    ["'Dark VFX", "'Dark%20VFX"],
    ['"Dark VFX', '"Dark%20VFX'],
    
    // Holy VFX
    ["'Holy VFX", "'Holy%20VFX"],
    ['"Holy VFX', '"Holy%20VFX'],
    
    // Wood VFX
    ["'Wood VFX", "'Wood%20VFX"],
    ['"Wood VFX', '"Wood%20VFX'],
    
    // Thunder effects
    ["'Thunder hit", "'Thunder%20hit"],
    ['"Thunder hit', '"Thunder%20hit'],
    ["'Thunder splash", "'Thunder%20splash"],
    ['"Thunder splash', '"Thunder%20splash'],
    ["'Thunder projectile", "'Thunder%20projectile"],
    ['"Thunder projectile', '"Thunder%20projectile'],
    ["'Thunderstrike wo", "'Thunderstrike%20wo"],
    ['"Thunderstrike wo', '"Thunderstrike%20wo'],
    
    // Boss sprites
    ["'Eye Beast", "'Eye%20Beast"],
    ['"Eye Beast', '"Eye%20Beast'],
    ["'Void Ball", "'Void%20Ball"],
    ['"Void Ball', '"Void%20Ball'],
    ["'Projectile Destroyed", "'Projectile%20Destroyed"],
    ['"Projectile Destroyed', '"Projectile%20Destroyed'],
    
    // Enemy sprites
    ["'blob minion", "'blob%20minion"],
    ['"blob minion', '"blob%20minion'],
    ["'sorcerer attack_Animation 1_", "'sorcerer%20attack_Animation%201_"],
    ['"sorcerer attack_Animation 1_', '"sorcerer%20attack_Animation%201_'],
    ["'The Summoner", "'The%20Summoner"],
    ['"The Summoner', '"The%20Summoner'],
    ["'lost soul idle ", "'lost%20soul%20idle%20"],
    ['"lost soul idle ', '"lost%20soul%20idle%20'],
    
    // Audio files
    ["'Ludum Dare", "'Ludum%20Dare"],
    ['"Ludum Dare', '"Ludum%20Dare'],
    
    // Other common space patterns
    ["'Kawaii choco muffin", "'Kawaii%20choco%20muffin"],
    ['"Kawaii choco muffin', '"Kawaii%20choco%20muffin'],
];

let totalFixes = 0;

filesToFix.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixes = 0;
    
    spaceFileReplacements.forEach(([pattern, replacement]) => {
        // Create regex that will match the pattern
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
            fixes += matches.length;
            content = content.replace(regex, replacement);
        }
    });
    
    // Also fix generic patterns for file paths with spaces
    // Match patterns like: 'folder/File Name.png' -> 'folder/File%20Name.png'
    const pathPattern = /(['"])(assets\/[^'"]*?\s+[^'"]*?)(['"])/g;
    const pathMatches = content.match(pathPattern);
    if (pathMatches) {
        content = content.replace(pathPattern, (match, q1, path, q2) => {
            const fixedPath = path.replace(/ /g, '%20');
            if (fixedPath !== path) {
                fixes++;
                return q1 + fixedPath + q2;
            }
            return match;
        });
    }
    
    if (fixes > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed ${fixes} space references in ${path.basename(filePath)}`);
        totalFixes += fixes;
    } else {
        console.log(`✓ No space issues found in ${path.basename(filePath)}`);
    }
});

console.log(`\n🎉 Fixed ${totalFixes} total file references with spaces!`);
console.log('\nNote: Files with spaces in their names are URL-encoded with %20 for proper loading.');