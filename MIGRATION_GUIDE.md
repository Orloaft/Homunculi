# Migration Guide: Refactoring game.js

This guide will help you migrate from the monolithic `game.js` to the new modular structure.

## Overview

The refactoring splits `game.js` into multiple modules organized by functionality:
- **Scenes**: Game states (Loading, Title, Game, GameOver)
- **Systems**: Core game mechanics (Combat, Enemies, Player, UI)
- **Data**: Configuration and constants
- **Utils**: Shared utilities

## Step-by-Step Migration

### 1. Setup New File Structure

First, create the directory structure:
```bash
mkdir -p src/scenes
mkdir -p src/systems/combat
mkdir -p src/systems/enemies
mkdir -p src/systems/player
mkdir -p src/systems/ui
mkdir -p src/data
mkdir -p src/utils
```

### 2. Extract Data Modules (✅ Completed)

Already created:
- `src/data/GameConstants.js` - Game-wide constants
- `src/data/ElementConfig.js` - Element definitions
- `src/data/FusionRecipes.js` - Fusion combinations
- `src/data/EnemyConfig.js` - Enemy types and stats
- `src/data/WaveConfig.js` - Wave definitions

### 3. Extract Utility Modules (✅ Partially Completed)

Already created:
- `src/utils/InputManager.js` - Unified input handling

Still needed:
- `src/utils/SaveSystem.js` - Save/load functionality

### 4. Extract Player Systems (✅ Partially Completed)

Already created:
- `src/systems/player/PlayerController.js` - Movement and control
- `src/systems/player/PlayerStats.js` - Health, XP, level
- `src/systems/player/ChargeSystem.js` - Element charge management

### 5. Extract Scene Classes

The LoadingScene has been extracted as an example. For the remaining scenes:

#### TitleScene (Lines 190-330)
```javascript
// src/scenes/TitleScene.js
import { GAME_CONFIG } from '../data/GameConstants.js';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }
    
    create() {
        // Extract title screen logic from game.js lines 190-330
    }
}
```

#### GameOverScene (Lines 332-449)
```javascript
// src/scenes/GameOverScene.js
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        // Receive game stats from GameScene
        this.stats = data;
    }
    
    create() {
        // Extract game over logic from game.js lines 332-449
    }
}
```

### 6. Refactor GameScene

The GameScene is the most complex. Break it down into systems:

```javascript
// src/scenes/GameScene.js
import { InputManager } from '../utils/InputManager.js';
import { PlayerController } from '../systems/player/PlayerController.js';
import { PlayerStats } from '../systems/player/PlayerStats.js';
import { ChargeSystem } from '../systems/player/ChargeSystem.js';
import { EnemyManager } from '../systems/enemies/EnemyManager.js';
import { ProjectileManager } from '../systems/combat/ProjectileManager.js';
import { UIManager } from '../systems/ui/UIManager.js';
import { WaveSystem } from '../systems/enemies/WaveSystem.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // Initialize systems
        this.inputManager = new InputManager(this);
        this.playerStats = new PlayerStats(this);
        this.chargeSystem = new ChargeSystem(this);
        
        // Create wizard sprite
        this.wizard = this.physics.add.sprite(400, 300, 'wizard-idle');
        this.playerController = new PlayerController(this, this.wizard);
        
        // Initialize other systems
        this.enemyManager = new EnemyManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.uiManager = new UIManager(this);
        this.waveSystem = new WaveSystem(this);
        
        // Setup collisions
        this.setupCollisions();
    }
    
    update(time, delta) {
        // Update input first
        this.inputManager.update();
        
        // Update systems
        this.playerController.update(this.inputManager);
        this.enemyManager.update(time, delta);
        this.projectileManager.update(time, delta);
        this.waveSystem.update(time, delta);
        this.chargeSystem.updateCooldowns(delta);
        
        // Handle auto-shooting
        if (this.chargeSystem.shouldAutoFire(time)) {
            this.projectileManager.autoFire(this.wizard, this.chargeSystem);
            this.chargeSystem.updateAutoFireTime(time);
        }
    }
}
```

### 7. Create System Managers

#### EnemyManager
```javascript
// src/systems/enemies/EnemyManager.js
export class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
        this.setupEventListeners();
    }
    
    update(time, delta) {
        // Update all enemies
        this.enemies.children.entries.forEach(enemy => {
            this.updateEnemy(enemy, time, delta);
        });
    }
    
    spawnEnemy(type, x, y) {
        // Create enemy based on type
        // Extract from spawnEnemy function in game.js
    }
}
```

#### ProjectileManager
```javascript
// src/systems/combat/ProjectileManager.js
export class ProjectileManager {
    constructor(scene) {
        this.scene = scene;
        this.projectiles = scene.physics.add.group();
    }
    
    fireProjectile(origin, direction, elements) {
        // Handle projectile creation based on elements
        // Extract from fireProjectile function in game.js
    }
}
```

### 8. Update index.html

Replace the script tag to use the new modular structure:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Wizard Survivor</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
</head>
<body>
    <div id="game-container"></div>
    <script type="module" src="src/main.js"></script>
</body>
</html>
```

### 9. Testing Strategy

1. **Test each module independently** before integration
2. **Start with data modules** - they have no dependencies
3. **Test player systems** with a minimal scene
4. **Add enemy systems** one at a time
5. **Integrate UI systems** last

### 10. Benefits After Migration

- **Easier debugging**: Issues are isolated to specific modules
- **Better performance**: Can optimize individual systems
- **Team collaboration**: Multiple developers can work on different systems
- **Code reuse**: Systems can be used in other projects
- **Easier testing**: Unit tests for individual modules
- **Better organization**: Clear separation of concerns

## Common Pitfalls to Avoid

1. **Circular dependencies**: Use events for communication between systems
2. **Missing imports**: Ensure all dependencies are properly imported
3. **Scope issues**: Use arrow functions or bind methods when needed
4. **Event cleanup**: Remove event listeners when scenes shutdown

## Next Steps

1. Continue extracting enemy types into `EnemyTypes.js`
2. Create `ProjectileFactory.js` for different projectile types
3. Implement `UIManager.js` to coordinate all UI elements
4. Add save/load functionality in `SaveSystem.js`
5. Create unit tests for each module