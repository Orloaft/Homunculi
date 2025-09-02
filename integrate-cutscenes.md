# Boss Cutscene Integration Guide

## How to integrate the enhanced boss cutscenes into game.js

### Step 1: Add the BossCutsceneSystem class to game.js

Copy the entire BossCutsceneSystem class from `BossCutscenes.js` and paste it at the beginning of game.js (after the scene classes but before the config).

### Step 2: Initialize the cutscene system in GameScene

In the `create()` method of GameScene, add:

```javascript
// Initialize boss cutscene system
this.bossCutsceneSystem = new BossCutsceneSystem(this);
```

### Step 3: Replace the existing startBossCutscene function

Replace the current `startBossCutscene()` function (around line 32761) with:

```javascript
startBossCutscene() {
    // Determine boss type based on stage
    let bossType;
    if (this.stage === 'cave') {
        bossType = 'archer';
    } else if (this.stage === 'lava') {
        bossType = 'demonslime';
    } else if (this.stage === 'sand') {
        bossType = 'eyelor';
    } else if (this.stage === 'grave') {
        bossType = 'nekros';
    } else {
        bossType = 'obelisk'; // Default for forest
    }
    
    // Play enhanced cutscene
    this.bossCutsceneSystem.playBossCutscene(bossType, () => {
        // Spawn the boss after cutscene
        this.spawnBossForStage();
    });
}

spawnBossForStage() {
    // Move the boss spawning logic here from the original startBossCutscene
    if (this.stage === 'cave') {
        this.spawnArcherBoss(400, 200);
    } else if (this.stage === 'lava') {
        this.spawnDemonSlimeBoss(400, 200);
    } else if (this.stage === 'sand') {
        this.spawnEyelorBoss(400, 200);
    } else if (this.stage === 'grave') {
        this.spawnNekrosBoss(400, 200);
    } else {
        this.spawnObeliskBoss(400, 200);
    }
}
```

### Step 4: Add King Nothing cutscene support

For the King Nothing boss (if it exists), add cutscene trigger when spawning:

```javascript
spawnKingNothingBoss(x, y) {
    // Play cutscene first
    this.bossCutsceneSystem.playBossCutscene('kingnothingboss', () => {
        // Then spawn the boss
        // ... existing spawn code ...
    });
}
```

## Features of the Enhanced Cutscenes

Each boss now has a unique, thematic cutscene:

1. **Obelisk**: Ancient seal breaking with red lightning
2. **Nekros**: Purple fog with soul particles and death whispers
3. **Eyelor**: Giant eye opening in the desert
4. **Demon Slime**: Emerging from lava with bubbles
5. **Archer**: Purple mystical theme with arrow rain
6. **King Nothing**: Void expansion with floating crown

### Cutscene Features:
- Smooth transitions and animations
- Thematic visual effects for each boss
- Skip functionality (press SPACE)
- Proper game state management
- No interference with game systems

### Testing:
1. Load the game
2. Play until boss spawn time (60 seconds or stage end)
3. Cutscene should play automatically
4. Press SPACE to skip if needed
5. Boss should spawn after cutscene

## Optional: Add more visual/audio polish

You can enhance the cutscenes further by:
- Adding boss-specific sound effects
- Adding more particle effects
- Creating custom boss entrance animations
- Adding voice lines or dramatic music changes