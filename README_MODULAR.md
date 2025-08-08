# Wizard Survivor - Modular Architecture

## Overview

The game has been refactored from a single 9,000+ line file into a modular architecture with clear separation of concerns. This makes the code more maintainable, testable, and scalable.

## New File Structure

```
src/
├── main.js                    # Entry point
├── scenes/                    # Game scenes
│   ├── LoadingScene.js       # Asset loading
│   ├── TitleScene.js         # Main menu
│   ├── GameScene.js          # Core gameplay
│   └── GameOverScene.js      # End screen
├── systems/                   # Core game systems
│   ├── combat/               # Combat mechanics
│   │   ├── ProjectileManager.js
│   │   └── DamageSystem.js
│   ├── enemies/              # Enemy management
│   │   ├── EnemyManager.js
│   │   └── WaveSystem.js
│   ├── player/               # Player systems
│   │   ├── PlayerController.js
│   │   ├── PlayerStats.js
│   │   └── ChargeSystem.js
│   └── ui/                   # User interface
│       └── UIManager.js
├── data/                     # Configuration data
│   ├── GameConstants.js      # Global constants
│   ├── ElementConfig.js      # Element definitions
│   ├── FusionRecipes.js      # Element combinations
│   ├── EnemyConfig.js        # Enemy definitions
│   └── WaveConfig.js         # Wave progression
└── utils/                    # Utility classes
    └── InputManager.js       # Input handling
```

## Key Improvements

### 1. **Separation of Concerns**
Each system handles a specific aspect of the game:
- `PlayerController` - Only handles player movement and animations
- `ChargeSystem` - Manages element charges and linking
- `EnemyManager` - Spawns and updates enemies
- `ProjectileManager` - Handles all projectiles and their effects

### 2. **Event-Driven Architecture**
Systems communicate through events rather than direct coupling:
```javascript
// Enemy system emits damage event
this.scene.events.emit('enemyDamaged', { enemy, damage });

// Damage system listens and handles it
this.scene.events.on('enemyDamaged', (data) => {
    this.handleEnemyDamage(data.enemy, data.damage);
});
```

### 3. **Configuration-Driven**
All game data is externalized:
- Element properties in `ElementConfig.js`
- Enemy stats in `EnemyConfig.js`
- Game constants in `GameConstants.js`

### 4. **Reusable Components**
Systems can be easily reused in other projects or scenes.

## Running the Modular Version

1. Open `index_modular.html` in a web browser
2. The game will load using ES6 modules
3. All functionality should work identically to the original

## Migration Status

### ✅ Completed
- Core data modules (elements, enemies, waves, constants)
- Player systems (controller, stats, charges)
- Enemy systems (manager, waves)
- Combat systems (projectiles, damage)
- All game scenes
- Basic UI system
- Input management

### 🚧 Still Needed
- Chest/Reward UI system
- Pause menu system
- Spellbook UI
- Elements discovery UI
- Save/Load system
- Audio manager
- Particle effects system

## Benefits

1. **Easier Debugging** - Issues are isolated to specific modules
2. **Better Performance** - Can optimize individual systems
3. **Team Collaboration** - Multiple developers can work on different systems
4. **Unit Testing** - Each module can be tested independently
5. **Code Reuse** - Systems can be used in other projects

## Next Steps

1. Complete remaining UI systems
2. Add unit tests for each module
3. Implement save/load functionality
4. Add audio management
5. Create development documentation

## Development Tips

- Always use events for cross-system communication
- Keep systems focused on a single responsibility
- Use the data modules for all configuration
- Test each system independently before integration
- Document public methods and events

## Troubleshooting

If you encounter issues:

1. Check browser console for module loading errors
2. Ensure all import paths are correct
3. Verify Phaser is loaded before game modules
4. Check for circular dependencies
5. Make sure all events are properly cleaned up

## Contributing

When adding new features:

1. Determine which system should handle it
2. If needed, create a new system
3. Use events for communication
4. Add configuration to data modules
5. Update this documentation

The modular architecture makes the game much more maintainable and sets a solid foundation for future development!