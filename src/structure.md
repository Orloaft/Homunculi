# Proposed Game Structure

## Directory Structure
```
src/
├── scenes/
│   ├── LoadingScene.js
│   ├── TitleScene.js
│   ├── GameScene.js
│   └── GameOverScene.js
├── systems/
│   ├── combat/
│   │   ├── ProjectileManager.js
│   │   ├── DamageSystem.js
│   │   └── ElementEffects.js
│   ├── enemies/
│   │   ├── EnemyManager.js
│   │   ├── EnemyTypes.js
│   │   ├── WaveSystem.js
│   │   └── EnemyFactory.js
│   ├── player/
│   │   ├── PlayerController.js
│   │   ├── PlayerStats.js
│   │   └── ChargeSystem.js
│   └── ui/
│       ├── UIManager.js
│       ├── ChargeUI.js
│       ├── PauseMenu.js
│       ├── ChestUI.js
│       ├── SpellbookUI.js
│       └── ElementsMenu.js
├── data/
│   ├── ElementConfig.js
│   ├── EnemyConfig.js
│   ├── WaveConfig.js
│   └── FusionRecipes.js
├── utils/
│   ├── InputManager.js
│   ├── SaveSystem.js
│   └── GameConstants.js
└── main.js

## Module Responsibilities

### Scenes
- **LoadingScene**: Asset loading and progress display
- **TitleScene**: Main menu and game start
- **GameScene**: Core gameplay orchestration
- **GameOverScene**: End game stats and restart

### Systems

#### Combat System
- **ProjectileManager**: Handle all projectile creation, movement, collision
- **DamageSystem**: Calculate and apply damage, handle resistances
- **ElementEffects**: Special effects for each element type

#### Enemy System  
- **EnemyManager**: Track and update all enemies
- **EnemyTypes**: Define behavior for each enemy type
- **WaveSystem**: Handle wave progression and spawning
- **EnemyFactory**: Create enemies with proper stats

#### Player System
- **PlayerController**: Handle movement and input
- **PlayerStats**: Track health, XP, level
- **ChargeSystem**: Manage element charges and linking

#### UI System
- **UIManager**: Coordinate all UI elements
- **ChargeUI**: Display and update charge slots
- **PauseMenu**: Charge management interface
- **ChestUI**: Level-up reward selection
- **SpellbookUI**: Display discovered spells
- **ElementsMenu**: Track element discoveries

### Data
- **ElementConfig**: All element definitions and properties
- **EnemyConfig**: Enemy stats and behaviors
- **WaveConfig**: Wave definitions and timing
- **FusionRecipes**: Element combination rules

### Utils
- **InputManager**: Unified keyboard/gamepad handling
- **SaveSystem**: Save/load game progress
- **GameConstants**: Shared constants and settings

## Benefits of This Structure
1. **Separation of Concerns**: Each module has a single responsibility
2. **Easier Testing**: Individual systems can be tested in isolation
3. **Better Collaboration**: Multiple developers can work on different systems
4. **Improved Maintainability**: Bugs are easier to locate and fix
5. **Reusability**: Systems can be reused in other projects
6. **Performance**: Easier to optimize individual systems