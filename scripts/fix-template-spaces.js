const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing template literal paths with spaces...\n');

// Files to fix
const filesToFix = [
    path.join(__dirname, 'game.js'),
    path.join(__dirname, 'InfiniteGameScene.js'),
    path.join(__dirname, 'UltraOptimizedGameScene.js'),
    path.join(__dirname, 'boss_system.js')
];

// Specific template literal patterns that need fixing
const templatePatterns = [
    // Smoke clouds
    ['`assets/effects/elementanimations/smokecloud1/Smoke VFX A${i}.png`', 
     '`assets/effects/elementanimations/smokecloud1/Smoke%20VFX%20A${i}.png`'],
    ['`assets/effects/elementanimations/smokecloud2/Smoke VFX B${i}.png`',
     '`assets/effects/elementanimations/smokecloud2/Smoke%20VFX%20B${i}.png`'],
    ['`assets/effects/elementanimations/smokecloud3/Smoke VFX C${i}.png`',
     '`assets/effects/elementanimations/smokecloud3/Smoke%20VFX%20C${i}.png`'],
     
    // Ice VFX
    ['`assets/effects/elementanimations/icegroundspike/Ice VFX 2 Active${i}.png`',
     '`assets/effects/elementanimations/icegroundspike/Ice%20VFX%202%20Active${i}.png`'],
    ['`assets/effects/elementanimations/icegroundspike/Ice VFX 2 Start${i}.png`',
     '`assets/effects/elementanimations/icegroundspike/Ice%20VFX%202%20Start${i}.png`'],
    ['`assets/effects/elementanimations/icegroundspike/Ice VFX 2 Ending${i}.png`',
     '`assets/effects/elementanimations/icegroundspike/Ice%20VFX%202%20Ending${i}.png`'],
    ['`assets/effects/elementanimations/icespikemissle/VFX 1 Hit${i}.png`',
     '`assets/effects/elementanimations/icespikemissle/VFX%201%20Hit${i}.png`'],
    ['`assets/effects/elementanimations/icespikemissle/VFX 1 Repeatable${i}.png`',
     '`assets/effects/elementanimations/icespikemissle/VFX%201%20Repeatable${i}.png`'],
    ['`assets/effects/elementanimations/icespikemissle/VFX 1 Start${i}.png`',
     '`assets/effects/elementanimations/icespikemissle/VFX%201%20Start${i}.png`'],
     
    // Acid VFX
    ['`assets/effects/elementanimations/acidsplash/Acid VFX 01 Hit${i}.png`',
     '`assets/effects/elementanimations/acidsplash/Acid%20VFX%2001%20Hit${i}.png`'],
    ['`assets/effects/elementanimations/acidsplash/Acid VFX 01 Repeatable${i}.png`',
     '`assets/effects/elementanimations/acidsplash/Acid%20VFX%2001%20Repeatable${i}.png`'],
    ['`assets/effects/elementanimations/acidmissle/Acid VFX 02Repeatable${i}.png`',
     '`assets/effects/elementanimations/acidmissle/Acid%20VFX%2002Repeatable${i}.png`'],
    ['`assets/effects/elementanimations/acidmissle/Acid VFX 02 Ending${i}.png`',
     '`assets/effects/elementanimations/acidmissle/Acid%20VFX%2002%20Ending${i}.png`'],
     
    // Dark VFX
    ['`assets/effects/elementanimations/deathmissle/Dark VFX 1 (40x32)${i}.png`',
     '`assets/effects/elementanimations/deathmissle/Dark%20VFX%201%20(40x32)${i}.png`'],
    ['`assets/effects/elementanimations/ghostmissle/Dark VFX 2 (48x64)${i}.png`',
     '`assets/effects/elementanimations/ghostmissle/Dark%20VFX%202%20(48x64)${i}.png`'],
     
    // Holy VFX
    ['`assets/effects/elementanimations/holymissle/Holy VFX 01 Impact${i}.png`',
     '`assets/effects/elementanimations/holymissle/Holy%20VFX%2001%20Impact${i}.png`'],
    ['`assets/effects/elementanimations/holymissle/Holy VFX 01 Initial${i}.png`',
     '`assets/effects/elementanimations/holymissle/Holy%20VFX%2001%20Initial${i}.png`'],
    ['`assets/effects/elementanimations/holymissle/Holy VFX 01 Repeatable${i}.png`',
     '`assets/effects/elementanimations/holymissle/Holy%20VFX%2001%20Repeatable${i}.png`'],
    ['`assets/effects/elementanimations/holypillar/Holy VFX 02 ${i}.png`',
     '`assets/effects/elementanimations/holypillar/Holy%20VFX%2002%20${i}.png`'],
     
    // Wood VFX
    ['`assets/effects/elementanimations/woodmissle/Wood VFX 01 Hit${i}.png`',
     '`assets/effects/elementanimations/woodmissle/Wood%20VFX%2001%20Hit${i}.png`'],
    ['`assets/effects/elementanimations/woodmissle/Wood VFX 01 Repeatable${i}.png`',
     '`assets/effects/elementanimations/woodmissle/Wood%20VFX%2001%20Repeatable${i}.png`'],
    ['`assets/effects/elementanimations/woodstickslap/Wood VFX 02 ${i}.png`',
     '`assets/effects/elementanimations/woodstickslap/Wood%20VFX%2002%20${i}.png`'],
     
    // Eye Beast
    ['`assets/bosses/Eyelor/Attack/Eye Beast Attack${i}.png`',
     '`assets/bosses/Eyelor/Attack/Eye%20Beast%20Attack${i}.png`'],
    ['`assets/bosses/Eyelor/Death/Eye Beast Death${i}.png`',
     '`assets/bosses/Eyelor/Death/Eye%20Beast%20Death${i}.png`'],
    ['`assets/bosses/Eyelor/Movement/Eye Beast Moving${i}.png`',
     '`assets/bosses/Eyelor/Movement/Eye%20Beast%20Moving${i}.png`'],
    ['`assets/bosses/Eyelor/Void Ball Projectilep/Void Ball Projectile${i}.png`',
     '`assets/bosses/Eyelor/Void%20Ball%20Projectilep/Void%20Ball%20Projectile${i}.png`'],
    ['`assets/bosses/Eyelor/Void Ball Projectilep/Projectile Destroyed${i}.png`',
     '`assets/bosses/Eyelor/Void%20Ball%20Projectilep/Projectile%20Destroyed${i}.png`'],
     
    // Newenemies
    ['`assets/newenemies/sorcerer villain/sorcerer attack_Animation 1_${i}.png`',
     '`assets/newenemies/sorcerer%20villain/sorcerer%20attack_Animation%201_${i}.png`'],
    ['`assets/newenemies/bat/bat fly_${i}.png`',
     '`assets/newenemies/bat/bat%20fly_${i}.png`'],
    ['`assets/newenemies/mushy/mushroom walk_${i}.png`',
     '`assets/newenemies/mushy/mushroom%20walk_${i}.png`'],
    ['`assets/newenemies/fireworm/fire worm walk_${i}.png`',
     '`assets/newenemies/fireworm/fire%20worm%20walk_${i}.png`'],
    ['`assets/newenemies/lostsoul/lost soul idle ${String(i).padStart(2, \'0\')}.png`',
     '`assets/newenemies/lostsoul/lost%20soul%20idle%20${String(i).padStart(2, \'0\')}.png`'],
    ['`assets/newenemies/blob/blob minion walk ${String(i).padStart(2, \'0\')}.png`',
     '`assets/newenemies/blob/blob%20minion%20walk%20${String(i).padStart(2, \'0\')}.png`']
];

let totalFixes = 0;

filesToFix.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixes = 0;
    
    templatePatterns.forEach(([pattern, replacement]) => {
        // Escape special regex characters but keep template literal syntax
        const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedPattern, 'g');
        const matches = content.match(regex);
        if (matches) {
            fixes += matches.length;
            content = content.replace(regex, replacement);
            console.log(`  Fixed: ${pattern.substring(0, 60)}...`);
        }
    });
    
    if (fixes > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed ${fixes} template paths in ${path.basename(filePath)}`);
        totalFixes += fixes;
    } else {
        console.log(`✓ No template space issues in ${path.basename(filePath)}`);
    }
});

console.log(`\n🎉 Fixed ${totalFixes} total template literal paths with spaces!`);