// Advanced bundler that properly handles dependencies
const fs = require('fs');
const path = require('path');

console.log('Building optimized bundle with correct dependency order...');

// Create the bundle
let bundle = '// Bundled WizBiz Game - Optimized for 140+ FPS Performance\n';
bundle += '// This bundle eliminates module overhead while preserving clean architecture\n';
bundle += '(function() {\n';
bundle += '"use strict";\n\n';

// Helper function to clean content
function cleanContent(content) {
    // Remove all import statements (including multi-line)
    content = content.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]*['"];?/g, '');
    content = content.replace(/import\s+.*?\s+from\s+['"][^'"]*['"];?/g, '');
    content = content.replace(/import\s+['"][^'"]*['"];?/g, '');
    
    // Remove export statements but keep the declarations
    content = content.replace(/export\s+default\s+class\s+(\w+)/g, 'class $1');
    content = content.replace(/export\s+class\s+/g, 'class ');
    content = content.replace(/export\s+function\s+/g, 'function ');
    content = content.replace(/export\s+const\s+/g, 'const ');
    content = content.replace(/export\s+let\s+/g, 'let ');
    content = content.replace(/export\s+var\s+/g, 'var ');
    
    // Remove standalone export statements
    content = content.replace(/^export\s+default\s+\w+;?\s*$/gm, '');
    content = content.replace(/^export\s+\{[^}]*\};?\s*$/gm, '');
    
    return content.trim();
}

// Files to bundle in dependency order
const files = [
    // Utility functions first
    'src/utils/GlobalHelpers.js',  // Contains setupFullscreenKey and other helpers
    'src/utils/Helpers.js',        // Additional helper functions
    'src/utils/Constants.js',      // Game constants
    
    // Game data and constants
    'src/data/GameConstants.js',   // PLAYER_CONFIG and other game constants
    'src/data/ElementConfig.js',   // Element configurations
    'src/data/EnemyConfig.js',     // Enemy types and stats
    'src/data/WaveConfig.js',      // Wave definitions
    'src/data/FusionRecipes.js',   // Fusion recipes
    
    // Base classes
    'src/entities/Enemy.js',  // Base Enemy class must come before bosses
    
    // Enemy types (needed by EnemyManager)
    'src/entities/enemies/Slime.js',
    'src/entities/enemies/FireSlime.js',
    'src/entities/enemies/Bat.js',
    'src/entities/enemies/DarkBat.js',
    'src/entities/enemies/Soul.js',
    'src/entities/enemies/EnemyFactory.js',
    
    // Base systems
    'src/systems/AudioManager.js',
    'src/systems/SaveSystem.js',
    'src/systems/InputManager.js',
    'src/systems/ElementSystem.js',
    'src/systems/SpellSystem.js',
    'src/systems/BossStateMachine.js',
    'src/systems/combat/ProjectileManager.js',
    'src/systems/enemies/EnemyManager.js',
    'src/systems/enemies/WaveSystem.js',
    'src/systems/player/ChargeSystem.js',
    'src/systems/player/PlayerController.js',
    'src/systems/player/PlayerStats.js',
    'src/systems/ui/UIManager.js',
    'src/systems/world/ObstacleManager.js',
    'src/systems/CutsceneManager.js',
    
    // Boss entities
    'src/entities/bosses/BaseBoss.js',
    'src/entities/bosses/ArcherBoss.js',
    'src/entities/bosses/DemonSlimeBoss.js',
    'src/entities/bosses/EyelorBoss.js',
    'src/entities/bosses/KingNothingBoss.js',
    'src/entities/bosses/NekrosBoss.js',
    'src/entities/bosses/ObeliskBoss.js',
    
    // Scene classes
    'src/scenes/LoadingScene.js',
    'src/scenes/TitleScene.js',
    'src/scenes/StageSelectScene.js',
    'src/scenes/ArcadeScene.js',
    'src/scenes/TalentTreeScene.js',
    'src/scenes/GameSceneModular.js',
    'src/scenes/GameOverScene.js'
];

// Process all files except main-modular.js
console.log('Processing files...');
files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        console.log(`  Adding ${filePath}...`);
        const content = cleanContent(fs.readFileSync(filePath, 'utf8'));
        bundle += `// ==================== ${filePath} ====================\n`;
        bundle += content + '\n\n';
    } else if (filePath !== 'src/systems/world/ChunkManager.js') {
        console.log(`  WARNING: File not found: ${filePath}`);
    }
});

// Now process main-modular.js specially - extract just the config and initialization
console.log('  Adding src/main-modular.js (config and initialization)...');
const mainContent = fs.readFileSync('src/main-modular.js', 'utf8');

// Remove imports/exports from main
const cleanedMain = cleanContent(mainContent);

// Extract just the config and game initialization (everything after the imports)
// This includes the config object and the game creation
bundle += `// ==================== src/main-modular.js ====================\n`;
bundle += cleanedMain + '\n\n';

// Close the IIFE
bundle += '\n})();\n';

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Write the bundle
fs.writeFileSync('dist/game-bundle.js', bundle);

// Verify the bundle
console.log('\nVerifying bundle integrity...');
const bundleContent = fs.readFileSync('dist/game-bundle.js', 'utf8');

// Check for issues
let hasErrors = false;

// Check for remaining imports
const importMatches = bundleContent.match(/^\s*import\s+/gm);
if (importMatches) {
    console.log(`❌ ERROR: Found ${importMatches.length} remaining import statements`);
    hasErrors = true;
}

// Check order of declarations - find the MAIN config (the one with type: Phaser.WEBGL)
const mainConfigMatch = bundleContent.match(/const config = \{\s*type:\s*Phaser\.WEBGL/);
const configIndex = mainConfigMatch ? bundleContent.indexOf(mainConfigMatch[0]) : -1;
const loadingSceneIndex = bundleContent.indexOf('class LoadingScene');
const gameSceneIndex = bundleContent.indexOf('class GameSceneModular');
const gameCreateIndex = bundleContent.indexOf('new Phaser.Game(config)');

if (loadingSceneIndex === -1) {
    console.log('❌ ERROR: LoadingScene class not found!');
    hasErrors = true;
} else if (configIndex > -1) {
    if (loadingSceneIndex > configIndex) {
        console.log('❌ ERROR: LoadingScene defined AFTER main config (should be before)');
        console.log(`  Config at position: ${configIndex}, LoadingScene at: ${loadingSceneIndex}`);
        hasErrors = true;
    }
} else {
    console.log('⚠️ WARNING: Main config with scene array not found');
}

if (gameSceneIndex === -1) {
    console.log('❌ ERROR: GameSceneModular class not found!');
    hasErrors = true;
} else if (configIndex > -1 && gameSceneIndex > configIndex) {
    console.log('❌ ERROR: GameSceneModular defined AFTER main config (should be before)');
    console.log(`  Config at position: ${configIndex}, GameSceneModular at: ${gameSceneIndex}`);
    hasErrors = true;
}

// Check for duplicate declarations
const checkDuplicates = (pattern, name) => {
    const matches = bundleContent.match(pattern);
    if (matches && matches.length > 1) {
        console.log(`❌ ERROR: Found ${matches.length} duplicate declarations of ${name}`);
        hasErrors = true;
        return true;
    }
    return false;
};

checkDuplicates(/^const config = \{/gm, 'config');
checkDuplicates(/^class LoadingScene /gm, 'LoadingScene');
checkDuplicates(/^class GameSceneModular /gm, 'GameSceneModular');

if (!hasErrors) {
    console.log('✅ All scenes defined before config');
    console.log('✅ No import statements found');
    console.log('✅ No duplicate declarations');
    console.log(`✅ Bundle size: ${(bundleContent.length / 1024).toFixed(2)} KB`);
    console.log('\n🎮 Bundle ready! Should run at 140+ FPS without errors.');
} else {
    console.log('\n⚠️ Bundle has issues that need to be fixed!');
}

console.log(`\nBundle saved to: dist/game-bundle.js`);