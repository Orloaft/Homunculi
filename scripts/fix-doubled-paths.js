const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing doubled asset paths...\n');

// Files to fix
const filesToFix = [
    path.join(__dirname, 'game.js'),
    path.join(__dirname, 'InfiniteGameScene.js'),
    path.join(__dirname, 'UltraOptimizedGameScene.js'),
    path.join(__dirname, 'boss_system.js'),
    path.join(__dirname, '..', 'src', 'scenes', 'GameScene.js'),
    path.join(__dirname, '..', 'src', 'scenes', 'LoadingScene.js'),
    path.join(__dirname, '..', 'src', 'data', 'EnemyConfig.js')
];

let totalFixes = 0;

filesToFix.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixes = 0;
    
    // Fix doubled paths - these patterns got duplicated
    const doubledPatterns = [
        ['assets/effects/assets/effects/', 'assets/effects/'],
        ['assets/enemies/assets/enemies/', 'assets/enemies/'],
        ['assets/bosses/assets/bosses/', 'assets/bosses/'],
        ['assets/sprites/assets/sprites/', 'assets/sprites/'],
        ['assets/images/assets/images/', 'assets/images/'],
        ['assets/audio/assets/audio/', 'assets/audio/'],
        ['assets/ui/assets/ui/', 'assets/ui/'],
        ['assets/TopDownFantasy_Forest_v1/assets/TopDownFantasy_Forest_v1/', 'assets/TopDownFantasy_Forest_v1/'],
        ['assets/Slime/assets/Slime/', 'assets/Slime/'],
        ['assets/Golem_1/assets/Golem_1/', 'assets/Golem_1/'],
        ['assets/Butterfly/assets/Butterfly/', 'assets/Butterfly/'],
        ['assets/Obelisk_demo/assets/Obelisk_demo/', 'assets/Obelisk_demo/'],
        ['assets/cutscenestuff/assets/cutscenestuff/', 'assets/cutscenestuff/'],
        ['assets/fireworm/assets/fireworm/', 'assets/fireworm/'],
        ['assets/newenemies/assets/newenemies/', 'assets/newenemies/']
    ];
    
    doubledPatterns.forEach(([pattern, replacement]) => {
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
            fixes += matches.length;
            content = content.replace(regex, replacement);
            console.log(`  Fixed ${matches.length} instances of: ${pattern}`);
        }
    });
    
    // Also fix any paths that still have 'spells/' or 'elementanimations/' without the assets prefix
    const missingPrefixPatterns = [
        ["'elementanimations/", "'assets/effects/elementanimations/"],
        ['"elementanimations/', '"assets/effects/elementanimations/'],
        ["'spells/", "'assets/effects/spells/"],
        ['"spells/', '"assets/effects/spells/'],
    ];
    
    missingPrefixPatterns.forEach(([pattern, replacement]) => {
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
            fixes += matches.length;
            content = content.replace(regex, replacement);
            console.log(`  Added prefix for ${matches.length} instances of: ${pattern}`);
        }
    });
    
    if (fixes > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed ${fixes} paths in ${path.basename(filePath)}`);
        totalFixes += fixes;
    } else {
        console.log(`✓ No doubled paths found in ${path.basename(filePath)}`);
    }
});

console.log(`\n🎉 Fixed ${totalFixes} total doubled paths!`);
console.log('\nNow checking for files with spaces in their names...\n');

// Find and list files with spaces that might need renaming
const findFilesWithSpaces = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
            findFilesWithSpaces(filePath, fileList);
        } else if (stat.isFile() && file.includes(' ')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
};

const assetsDir = path.join(__dirname, '..', 'assets');
const filesWithSpaces = findFilesWithSpaces(assetsDir);

if (filesWithSpaces.length > 0) {
    console.log('⚠️  Found files with spaces in names:');
    filesWithSpaces.forEach(file => {
        const relativePath = path.relative(path.join(__dirname, '..'), file);
        console.log(`  - ${relativePath}`);
    });
    console.log('\nThese files may cause loading issues. Consider renaming them to use underscores or hyphens instead of spaces.');
} else {
    console.log('✅ No files with spaces found in assets directory.');
}