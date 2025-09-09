const fs = require('fs');
const path = require('path');

console.log('🔧 Starting comprehensive path fix...\n');

// Read game.js and fix all paths
const gameJsPath = path.join(__dirname, 'game.js');
let gameContent = fs.readFileSync(gameJsPath, 'utf8');

// Count replacements
let replacementCount = 0;

// Function to perform replacement and count
function replaceAndCount(content, pattern, replacement) {
    const regex = new RegExp(pattern, 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
        replacementCount += count;
        console.log(`  Replacing ${count} instances of: ${pattern.substring(0, 50)}...`);
    }
    return content.replace(regex, replacement);
}

console.log('📝 Fixing paths in game.js...');

// Fix paths that are still pointing to root directories
const pathFixes = [
    // Assets that were moved to assets/images
    ["'grass.PNG'", "'assets/images/grass.PNG'"],
    ["'stone.png'", "'assets/images/stone.png'"],
    ["'lava.png'", "'assets/images/lava.png'"],
    ["'desert.png'", "'assets/images/desert.png'"],
    ["'foliage.png'", "'assets/images/foliage.png'"],
    ["'chargeslot.png'", "'assets/images/chargeslot.png'"],
    ["'meditate.png'", "'assets/images/meditate.png'"],
    ["'elementsekect.png'", "'assets/images/elementsekect.png'"],
    ["'holdflask.png'", "'assets/images/holdflask.png'"],
    ["'wave.png'", "'assets/images/wave.png'"],
    ["'sand.png'", "'assets/images/sand.png'"],
    ["'gravity.png'", "'assets/images/gravity.png'"],
    ["'star.png'", "'assets/images/star.png'"],
    ["'life.png'", "'assets/images/life.png'"],
    ["'time.png'", "'assets/images/time.png'"],
    ["'moon.png'", "'assets/images/moon.png'"],
    ["'sun.png'", "'assets/images/sun.png'"],
    ["'metal.png'", "'assets/images/metal.png'"],
    ["'smoke.png'", "'assets/images/smoke.png'"],
    ["'mud.png'", "'assets/images/mud.png'"],
    ["'earth.png'", "'assets/images/earth.png'"],
    ["'zodiac.png'", "'assets/images/zodiac.png'"],
    ["'holy.png'", "'assets/images/holy.png'"],
    ["'philostone.png'", "'assets/images/philostone.png'"],
    ["'elements.png'", "'assets/images/elements.png'"],
    ["'elements2.PNG'", "'assets/images/elements2.PNG'"],
    ["'elements3.PNG'", "'assets/images/elements3.PNG'"],
    ["'elements4.png'", "'assets/images/elements4.png'"],
    ["'Bat-IdleFly9frames.png'", "'assets/images/Bat-IdleFly9frames.png'"],
    ["'obeliskBoss.png'", "'assets/images/obeliskBoss.png'"],
    ["'laser.png'", "'assets/images/laser.png'"],
    ["'arm_projectile_glowing.png'", "'assets/images/arm_projectile_glowing.png'"],
    ["'firebreath.png'", "'assets/images/firebreath.png'"],
    ["'voidkin15frames.png'", "'assets/images/voidkin15frames.png'"],
    ["'Chests5frames.PNG'", "'assets/images/Chests5frames.PNG'"],
    ["'Chestsopen5frames.PNG'", "'assets/images/Chestsopen5frames.PNG'"],
    ["'upgradeicons10x6.PNG'", "'assets/images/upgradeicons10x6.PNG'"],
    ["'Kawaii choco muffin.png'", "'assets/images/Kawaii choco muffin.png'"],
    ["'butterflyjar.PNG'", "'assets/images/butterflyjar.PNG'"],
    
    // Folders that need path updates
    ["'TopDownFantasy_Forest_v1/", "'assets/TopDownFantasy_Forest_v1/"],
    ["'Slime/", "'assets/Slime/"],
    ["'impclub/", "'assets/enemies/impclub/"],
    ["'impaxe/", "'assets/enemies/impaxe/"],
    ["'demonslime/", "'assets/bosses/demonslime/"],
    ["'Golem_1/", "'assets/Golem_1/"],
    ["'Butterfly/", "'assets/Butterfly/"],
    ["'Obelisk_demo/", "'assets/Obelisk_demo/"],
    ["'Nekros/", "'assets/bosses/Nekros/"],
    ["'Eyelor/", "'assets/bosses/Eyelor/"],
    ["'cutscenestuff/", "'assets/cutscenestuff/"],
    ["'bateye/", "'assets/enemies/bateye/"],
    ["'fireworm/", "'assets/fireworm/"],
    ["'newenemies/", "'assets/newenemies/"],
    ["'elementanimations/", "'assets/effects/elementanimations/"],
    ["'spells/", "'assets/effects/spells/"],
    
    // Audio files
    ["\"Ludum Dare 32 03'9graveland\\).ogg\"", "\"assets/audio/Ludum Dare 32 03'9graveland).ogg\""],
    
    // Fix script loading
    ["'HitboxEditor.js'", "'scripts/HitboxEditor.js'"],
    ["'hitbox-config.js'", "'scripts/hitbox-config.js'"],
];

// Apply all fixes
pathFixes.forEach(([pattern, replacement]) => {
    gameContent = replaceAndCount(gameContent, pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), replacement);
});

// Fix paths with forward slashes that don't have quotes around them
gameContent = gameContent.replace(/(\w+)\/(\w+)/g, (match, folder, file) => {
    // Check if this looks like a folder path that should be updated
    const foldersToUpdate = ['elementanimations', 'spells', 'impclub', 'impaxe', 'bateye', 'fireworm', 
                             'newenemies', 'Butterfly', 'Slime', 'Golem_1', 'Nekros', 'Eyelor',
                             'cutscenestuff', 'demonslime', 'Obelisk_demo'];
    
    if (foldersToUpdate.includes(folder)) {
        const mapping = {
            'elementanimations': 'assets/effects/elementanimations',
            'spells': 'assets/effects/spells',
            'impclub': 'assets/enemies/impclub',
            'impaxe': 'assets/enemies/impaxe',
            'bateye': 'assets/enemies/bateye',
            'fireworm': 'assets/fireworm',
            'newenemies': 'assets/newenemies',
            'Butterfly': 'assets/Butterfly',
            'Slime': 'assets/Slime',
            'Golem_1': 'assets/Golem_1',
            'Nekros': 'assets/bosses/Nekros',
            'Eyelor': 'assets/bosses/Eyelor',
            'cutscenestuff': 'assets/cutscenestuff',
            'demonslime': 'assets/bosses/demonslime',
            'Obelisk_demo': 'assets/Obelisk_demo'
        };
        
        if (mapping[folder]) {
            replacementCount++;
            return `${mapping[folder]}/${file}`;
        }
    }
    return match;
});

// Save the updated game.js
fs.writeFileSync(gameJsPath, gameContent);
console.log(`✅ Updated game.js with ${replacementCount} path fixes\n`);

// Also update other JS files that might have paths
const otherFiles = [
    'InfiniteGameScene.js',
    'UltraOptimizedGameScene.js',
    'boss_system.js',
    '../src/scenes/GameScene.js',
    '../src/scenes/LoadingScene.js',
    '../src/data/EnemyConfig.js'
];

otherFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let fileReplacements = 0;
        
        // Apply same fixes
        pathFixes.forEach(([pattern, replacement]) => {
            const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const matches = content.match(regex);
            if (matches) {
                fileReplacements += matches.length;
                content = content.replace(regex, replacement);
            }
        });
        
        if (fileReplacements > 0) {
            fs.writeFileSync(fullPath, content);
            console.log(`✅ Updated ${filePath} with ${fileReplacements} path fixes`);
        }
    }
});

console.log('\n🎉 Path fix complete!');
console.log(`Total replacements: ${replacementCount}`);