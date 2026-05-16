const fs = require('fs');

// List of asset paths that are loaded in loops (manually extracted)
const loopLoadedAssets = [];

// Flamethrower frames (120 frames)
for (let i = 0; i < 120; i++) {
    loopLoadedAssets.push(`assets/effects/spells/firespell/1_${i}.png`);
}

// Smoke cloud animation frames (9 frames)
for (let i = 1; i <= 9; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/smokecloud1/Smoke%20VFX%20A${i}.png`);
}

// Chaos missile frames (3 levels, 30 frames each)
for (let level = 1; level <= 3; level++) {
    for (let i = 1; i <= 30; i++) {
        loopLoadedAssets.push(`assets/images/chaosmissle/${level}/${i}.png`);
    }
}

// Slime sprites
for (let i = 1; i <= 4; i++) {
    loopLoadedAssets.push(`assets/Slime/Individual Sprites/slime-idle-${i}.png`);
    loopLoadedAssets.push(`assets/Slime/Individual Sprites/slime-die-${i}.png`);
}

// Club Imp sprites
for (let i = 1; i <= 6; i++) {
    loopLoadedAssets.push(`assets/enemies/impclub/walk_${i}.png`);
}
for (let i = 1; i <= 5; i++) {
    loopLoadedAssets.push(`assets/enemies/impclub/fall_back_${i}.png`);
    loopLoadedAssets.push(`assets/enemies/impclub/stand_up_${i}.png`);
}

// Axe Imp sprites
for (let i = 1; i <= 6; i++) {
    loopLoadedAssets.push(`assets/enemies/impaxe/walk_${i}.png`);
}
for (let i = 1; i <= 4; i++) {
    loopLoadedAssets.push(`assets/enemies/impaxe/fall_back_${i}.png`);
}
for (let i = 1; i <= 5; i++) {
    loopLoadedAssets.push(`assets/enemies/impaxe/stand_up_${i}.png`);
}

// Demon Slime boss sprites
for (let i = 1; i <= 6; i++) {
    loopLoadedAssets.push(`assets/bosses/demonslime/boss_demon_slime_FREE_v1.0/boss_demon_slime_FREE_v1.0/individual sprites/01_demon_idle/demon_idle_${i}.png`);
}
for (let i = 1; i <= 12; i++) {
    loopLoadedAssets.push(`assets/bosses/demonslime/boss_demon_slime_FREE_v1.0/boss_demon_slime_FREE_v1.0/individual sprites/02_demon_walk/demon_walk_${i}.png`);
}
for (let i = 1; i <= 15; i++) {
    loopLoadedAssets.push(`assets/bosses/demonslime/boss_demon_slime_FREE_v1.0/boss_demon_slime_FREE_v1.0/individual sprites/03_demon_cleave/demon_cleave_${i}.png`);
}
for (let i = 1; i <= 22; i++) {
    loopLoadedAssets.push(`assets/bosses/demonslime/boss_demon_slime_FREE_v1.0/boss_demon_slime_FREE_v1.0/individual sprites/05_demon_death/demon_death_${i}.png`);
}

// Holy projectile animations
for (let i = 1; i <= 2; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/holymissle/Holy%20VFX%2001%20Initial${i}.png`);
}
for (let i = 1; i <= 8; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/holymissle/Holy%20VFX%2001%20Repeatable${i}.png`);
}
for (let i = 1; i <= 7; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/holymissle/Holy%20VFX%2001%20Impact${i}.png`);
}

// Ice spike projectile animations
for (let i = 1; i <= 3; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/icespikemissle/VFX%201%20Start${i}.png`);
}
for (let i = 1; i <= 10; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/icespikemissle/VFX%201%20Repeatable${i}.png`);
}
for (let i = 1; i <= 8; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/icespikemissle/VFX%201%20Hit${i}.png`);
}

// Crystal spell frames
for (let i = 1; i <= 11; i++) {
    loopLoadedAssets.push(`assets/effects/spells/crystalframe${i}.PNG`);
}

// Ghost missile death animation
for (let i = 1; i <= 16; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/ghostmissle/Dark VFX 2 (48x64)${i}.png`);
}

// Death missile hex animation
for (let i = 1; i <= 17; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/deathmissle/Dark VFX 1 (40x32)${i}.png`);
}

// Smoke cloud 2 animation
for (let i = 1; i <= 12; i++) {
    loopLoadedAssets.push(`assets/effects/elementanimations/smokecloud2/Smoke VFX B${i}.png`);
}

// Air spell frames
for (let i = 1; i <= 7; i++) {
    loopLoadedAssets.push(`assets/effects/spells/air${i}.png`);
}

// Bladekeeper frames
for (let i = 1; i <= 8; i++) {
    loopLoadedAssets.push(`assets/enemies/castlelandfoes/bladekeeper/02_run_${i}.png`);
}

// Nekros boss sprites
for (let i = 1; i <= 6; i++) {
    loopLoadedAssets.push(`assets/bosses/Nekros/walk/walk_${i}.png`);
    loopLoadedAssets.push(`assets/bosses/Nekros/fly/fly_${i}.png`);
}
for (let i = 1; i <= 7; i++) {
    loopLoadedAssets.push(`assets/bosses/Nekros/1atk/1atk_${i}.png`);
}
for (let i = 1; i <= 9; i++) {
    loopLoadedAssets.push(`assets/bosses/Nekros/2atk/2atk_${i}.png`);
}
for (let i = 1; i <= 11; i++) {
    loopLoadedAssets.push(`assets/bosses/Nekros/death/death_${i}.png`);
}
for (let i = 1; i <= 5; i++) {
    loopLoadedAssets.push(`assets/bosses/Nekros/hurt/hurt_${i}.png`);
}

// Frost Guardian boss sprites
for (let i = 1; i <= 10; i++) {
    loopLoadedAssets.push(`assets/frostguardian/walk/walk_${i}.png`);
}
for (let i = 1; i <= 6; i++) {
    loopLoadedAssets.push(`assets/frostguardian/idle/idle_${i}.png`);
}
for (let i = 1; i <= 14; i++) {
    loopLoadedAssets.push(`assets/frostguardian/1_atk/1_atk_${i}.png`);
}
for (let i = 1; i <= 7; i++) {
    loopLoadedAssets.push(`assets/frostguardian/take_hit/take_hit_${i}.png`);
}
for (let i = 1; i <= 16; i++) {
    loopLoadedAssets.push(`assets/frostguardian/death/death_${i}.png`);
}

// Eyelor boss sprites
for (let i = 1; i <= 13; i++) {
    loopLoadedAssets.push(`assets/bosses/Eyelor/Attack/Eye%20Beast%20Attack${i}.png`);
    loopLoadedAssets.push(`assets/bosses/Eyelor/Movement/Eye%20Beast%20Moving${i}.png`);
}
for (let i = 1; i <= 15; i++) {
    loopLoadedAssets.push(`assets/bosses/Eyelor/Death/Eye%20Beast%20Death${i}.png`);
}
for (let i = 1; i <= 3; i++) {
    loopLoadedAssets.push(`assets/bosses/Eyelor/Void%20Ball%20Projectilep/Void%20Ball%20Projectile${i}.png`);
    loopLoadedAssets.push(`assets/bosses/Eyelor/Void%20Ball%20Projectilep/Projectile%20Destroyed${i}.png`);
}

console.log(JSON.stringify(loopLoadedAssets, null, 2));
console.error(`\nFound ${loopLoadedAssets.length} loop-loaded assets`);
