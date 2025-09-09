const fs = require('fs');
const path = require('path');

// Path mappings
const pathMappings = {
    // Images in root -> assets/images
    "'art1.png'": "'assets/images/art1.png'",
    "'magustitle.png'": "'assets/images/magustitle.png'",
    "'gameover.png'": "'assets/images/gameover.png'",
    "'titlewords.PNG'": "'assets/images/titlewords.PNG'",
    "'fighttitle.png'": "'assets/images/fighttitle.png'",
    "'loading.png'": "'assets/images/loading.png'",
    "'arcademachine.png'": "'assets/images/arcademachine.png'",
    "'skycastle.png'": "'assets/images/skycastle.png'",
    "'icon.png'": "'assets/images/icon.png'",
    "'essence.png'": "'assets/images/essence.png'",
    "'xpgem.PNG'": "'assets/images/xpgem.PNG'",
    "'tombstone.png'": "'assets/images/tombstone.png'",
    "'weakspotrune.png'": "'assets/images/weakspotrune.png'",
    "'graveobstacle.png'": "'assets/images/graveobstacle.png'",
    "'skullfloor.png'": "'assets/images/skullfloor.png'",
    "'cactus.png'": "'assets/images/cactus.png'",
    "'cactuse.png'": "'assets/images/cactuse.png'",
    
    // Sprite folders
    "'wizmove/": "'assets/sprites/wizmove/",
    "'homunculicharacters/": "'assets/sprites/homunculicharacters/",
    
    // Enemy folders
    "'forestlandfoes/": "'assets/enemies/forestlandfoes/",
    "'cavelandfoes/": "'assets/enemies/cavelandfoes/",
    "'desertlandfoes/": "'assets/enemies/desertlandfoes/",
    "'castlelandfoes/": "'assets/enemies/castlelandfoes/",
    "'mushroom/": "'assets/enemies/mushroom/",
    "'tree/": "'assets/enemies/tree/",
    "'skeleton/": "'assets/enemies/skeleton/",
    "'kobold/": "'assets/enemies/kobold/",
    "'impaxe/": "'assets/enemies/impaxe/",
    "'impclub/": "'assets/enemies/impclub/",
    
    // Boss folders
    "'archerboss/": "'assets/bosses/archerboss/",
    "'demonslime/": "'assets/bosses/demonslime/",
    "'flyingdemon/": "'assets/bosses/flyingdemon/",
    "'scythewraith/": "'assets/bosses/scythewraith/",
    "'Eyelor/": "'assets/bosses/Eyelor/",
    "'Nekros/": "'assets/bosses/Nekros/",
    
    // UI folders
    "'planets/": "'assets/ui/planets/",
    "'islands/": "'assets/ui/islands/",
    "'stagetitles/": "'assets/ui/stagetitles/",
    "'buttonart/": "'assets/ui/buttonart/",
    
    // Effects folders
    "'orbs/": "'assets/effects/orbs/",
    "'spells/": "'assets/effects/spells/",
    "'elementanimations/": "'assets/effects/elementanimations/",
    
    // Obstacle folders
    "'dungeongates/": "'assets/obstacles/dungeongates/",
    "'castleobstacles/": "'assets/obstacles/castleobstacles/",
    "'cave/": "'assets/obstacles/cave/",
    
    // Audio files
    "'bgm2.mp3'": "'assets/audio/bgm2.mp3'",
    "'homonculibgm.mp3'": "'assets/audio/homonculibgm.mp3'",
    "'.ogg'": "'.ogg'", // Will handle separately
    "'.wav'": "'.wav'", // Will handle separately
};

// Files to update
const filesToUpdate = [
    'scripts/game.js',
    'scripts/SpriteConfig.js',
    'scripts/hitbox-config.js',
    'scripts/BossCutscenes.js',
    'scripts/boss_system.js',
    'scripts/InfiniteGameScene.js',
    'scripts/UltraOptimizedGameScene.js',
    'src/scenes/GameScene.js',
    'src/scenes/LoadingScene.js',
    'src/scenes/StageSelectScene.js',
    'src/scenes/TitleScene.js',
    'src/data/EnemyConfig.js',
    'src/data/CharacterConfig.js',
    'sprite-editor/enemy-sprite-editor.html',
    'sprite-editor/sprite-config-verified.js',
    'sprite-editor/sprite-config-correct.js'
];

// Process audio files specially
function updateAudioPaths(content) {
    // Update specific audio files
    const audioFiles = [
        'Battle-Dawn_intro(castlelandintro).ogg',
        'Battle-Dawn_loop(castlelandloop).ogg',
        'Battle-Vampire(castlebossloop).mp3',
        'Clement Panchout _ MW FUP _ Chaotic Boss(demonslime).wav',
        'DavidKBD - Pink Bloom Pack - 01 - Pink Bloom(caveland).ogg',
        'DavidKBD - Pink Bloom Pack - 02 - Portal to Underworld(bossloop5).ogg',
        'DavidKBD - Pink Bloom Pack - 05 - Western Cyberhorse(castleland).ogg',
        'DavidKBD - Pink Bloom Pack - 07 - The Hidden One(spireland).ogg',
        'Ludum Dare 28 03(title).ogg',
        'Ludum Dare 32 03\'9graveland).ogg',
        'Retro_ Spooky Soundscape_ The Whispering Shadows Dungeon _Clement Panchout 2016(lavaland).wav',
        'Sketchbook 2024-02-07(bossloop2).ogg',
        'Sketchbook 2024-02-28_01(openingcutscene).ogg',
        'Sketchbook 2024-05-01_02(arcade).ogg',
        'Sketchbook 2024-06-19(desertland).ogg',
        'Sketchbook 2024-07-04(credits).ogg',
        'Sketchbook 2024-08-07(forestland).ogg',
        'Sketchbook 2024-09-04_IN(bossloop3pt1).ogg',
        'Sketchbook 2024-09-04_LOOP(bossloop3pt2).ogg',
        'Sketchbook 2024-12-05(bossloop4).ogg',
        'VGMA Challenge 08(stageselect).ogg'
    ];
    
    audioFiles.forEach(file => {
        const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`'${escaped}'`, 'g');
        content = content.replace(regex, `'assets/audio/${file}'`);
    });
    
    return content;
}

// Update paths in each file
filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    // Apply path mappings
    Object.entries(pathMappings).forEach(([oldPath, newPath]) => {
        const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, newPath);
    });
    
    // Update audio paths
    content = updateAudioPaths(content);
    
    // Save if changed
    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Updated: ${filePath}`);
    } else {
        console.log(`⏭️  No changes: ${filePath}`);
    }
});

console.log('\n🎉 Path update complete!');