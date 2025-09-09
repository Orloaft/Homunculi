const fs = require('fs');
const path = require('path');

console.log('🔧 Running comprehensive fix for ALL doubled paths...\n');

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
    const originalContent = content;
    let fixes = 0;
    
    // More aggressive pattern to catch ALL doubled asset paths
    // This will match any occurrence of assets/X/assets/X/ and replace with assets/X/
    const doubledPattern = /assets\/([^\/]+)\/assets\/\1\//g;
    
    let match;
    while ((match = doubledPattern.exec(originalContent)) !== null) {
        fixes++;
    }
    
    if (fixes > 0) {
        content = content.replace(doubledPattern, 'assets/$1/');
        console.log(`  Found ${fixes} instances of pattern: assets/X/assets/X/`);
    }
    
    // Also look for specific doubled patterns that might not match the above
    const specificPatterns = [
        // Any doubled assets/effects path
        [/assets\/effects\/assets\/effects\//g, 'assets/effects/'],
        // Any doubled assets/enemies path  
        [/assets\/enemies\/assets\/enemies\//g, 'assets/enemies/'],
        // Any doubled assets/bosses path
        [/assets\/bosses\/assets\/bosses\//g, 'assets/bosses/'],
        // Any doubled assets/sprites path
        [/assets\/sprites\/assets\/sprites\//g, 'assets/sprites/'],
        // Any doubled assets/images path
        [/assets\/images\/assets\/images\//g, 'assets/images/'],
        // Any doubled assets/audio path
        [/assets\/audio\/assets\/audio\//g, 'assets/audio/'],
        // Any doubled assets/ui path
        [/assets\/ui\/assets\/ui\//g, 'assets/ui/']
    ];
    
    specificPatterns.forEach(([pattern, replacement]) => {
        const matches = content.match(pattern);
        if (matches) {
            fixes += matches.length;
            content = content.replace(pattern, replacement);
            console.log(`  Fixed ${matches.length} instances of: ${pattern.source}`);
        }
    });
    
    // Also fix paths that are missing the assets prefix for certain folders
    const missingAssetPatterns = [
        // castlelandfoes without assets prefix
        [/(['"])castlelandfoes\//g, '$1assets/enemies/castlelandfoes/'],
        // arcadeoverlay files without assets prefix
        [/(['"])arcadeoverlay\.png(['"])/g, '$1assets/images/arcadeoverlay.png$2'],
        [/(['"])arcadeoverlay-export\.png(['"])/g, '$1assets/images/arcadeoverlay-export.png$2']
    ];
    
    missingAssetPatterns.forEach(([pattern, replacement]) => {
        const matches = content.match(pattern);
        if (matches) {
            fixes += matches.length;
            content = content.replace(pattern, replacement);
            console.log(`  Added assets prefix for ${matches.length} instances`);
        }
    });
    
    if (fixes > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed ${fixes} paths in ${path.basename(filePath)}\n`);
        totalFixes += fixes;
    } else {
        console.log(`✓ No issues found in ${path.basename(filePath)}\n`);
    }
});

console.log(`🎉 Fixed ${totalFixes} total path issues!`);

// Now let's scan for any remaining doubled paths to verify
console.log('\n🔍 Scanning for any remaining doubled paths...\n');

filesToFix.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const doubledPattern = /assets\/\w+\/assets\/\w+\//g;
    const matches = content.match(doubledPattern);
    
    if (matches) {
        console.log(`⚠️  Still found doubled paths in ${path.basename(filePath)}:`);
        const unique = [...new Set(matches)];
        unique.forEach(match => {
            console.log(`    - ${match}`);
        });
    }
});

console.log('\n✅ Path fix complete!');