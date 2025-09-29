# WizBiz TypeScript Modular Architecture

## 📁 Project Structure

```
src/
├── main.ts                 # Entry point
├── Game.ts                 # Main game class
├── index.html              # HTML template
│
├── types/                  # TypeScript type definitions
│   ├── game.types.ts       # Core game types
│   ├── phaser.d.ts         # Phaser extensions
│   └── assets.d.ts         # Asset type declarations
│
├── core/                   # Core engine systems
│   ├── ServiceContainer.ts # Dependency injection
│   ├── EventBus.ts         # Global event system
│   ├── GameConfig.ts       # Configuration management
│   ├── AssetLoader.ts      # Asset management
│   └── SaveManager.ts      # Save/load system
│
├── entities/               # Game entities
│   ├── Entity.ts           # Base entity class
│   ├── player/
│   │   ├── Player.ts       # Player base class
│   │   ├── Wizard.ts       # Wizard character
│   │   ├── Orb.ts          # Orb character
│   │   └── Blip.ts         # Blip character
│   ├── enemies/
│   │   ├── Enemy.ts        # Enemy base class
│   │   ├── forest/         # Forest enemies
│   │   ├── cave/           # Cave enemies
│   │   └── desert/         # Desert enemies
│   └── bosses/
│       ├── Boss.ts         # Boss base class
│       ├── ObeliskBoss.ts
│       ├── ArcherBoss.ts
│       └── DemonSlimeBoss.ts
│
├── components/             # ECS Components
│   ├── Component.ts        # Base component
│   ├── Transform.ts        # Position & rotation
│   ├── Health.ts           # Health system
│   ├── Movement.ts         # Movement physics
│   ├── Combat.ts           # Combat stats
│   ├── AI.ts               # AI behavior
│   └── Render.ts           # Rendering component
│
├── systems/                # Game systems
│   ├── System.ts           # Base system class
│   ├── PhysicsSystem.ts    # Physics & collision
│   ├── CombatSystem.ts     # Damage calculation
│   ├── SpellSystem.ts      # Spell casting
│   ├── ElementSystem.ts    # Element fusion
│   ├── WaveSystem.ts       # Enemy waves
│   ├── LootSystem.ts       # Item drops
│   ├── ParticleSystem.ts   # Visual effects
│   └── AudioSystem.ts      # Sound management
│
├── scenes/                 # Phaser scenes
│   ├── BaseScene.ts        # Base scene class
│   ├── BootScene.ts        # Initial boot
│   ├── PreloadScene.ts     # Asset loading
│   ├── TitleScene.ts       # Main menu
│   ├── StageSelectScene.ts # Stage selection
│   ├── GameScene.ts        # Main gameplay
│   ├── PauseScene.ts       # Pause menu
│   ├── GameOverScene.ts    # Game over
│   └── TalentTreeScene.ts  # Talent tree
│
├── ui/                     # UI Components
│   ├── UIManager.ts        # UI controller
│   ├── HealthBar.ts        # Health display
│   ├── ExperienceBar.ts    # XP display
│   ├── ChargeSlots.ts      # Element slots
│   ├── ScoreDisplay.ts     # Score counter
│   ├── WaveAnnouncer.ts    # Wave notifications
│   ├── DamageNumbers.ts    # Floating damage
│   └── Minimap.ts          # Minimap display
│
├── utils/                  # Utility functions
│   ├── MathUtils.ts        # Math helpers
│   ├── VectorUtils.ts      # Vector operations
│   ├── CollisionUtils.ts   # Collision detection
│   ├── ObjectPool.ts       # Object pooling
│   ├── Tween.ts            # Animation helpers
│   └── Debug.ts            # Debug utilities
│
├── config/                 # Configuration files
│   ├── GameConstants.ts    # Game constants
│   ├── ElementData.ts      # Element definitions
│   ├── EnemyData.ts        # Enemy configurations
│   ├── StageData.ts        # Stage definitions
│   └── AssetManifest.ts    # Asset listings
│
└── tests/                  # Test files
    ├── entities/
    ├── systems/
    └── utils/
```

## 🏗️ Refactoring Strategy

### Phase 1: Foundation (Week 1)
1. Set up build system and TypeScript configuration ✅
2. Create type definitions ✅
3. Implement core systems (ServiceContainer, EventBus)
4. Create base classes (Entity, Component, System)

### Phase 2: Entity System (Week 2)
1. Refactor Player classes
2. Refactor Enemy classes
3. Refactor Boss classes
4. Implement ECS architecture

### Phase 3: Game Systems (Week 3)
1. Extract SpellSystem from main game file
2. Extract CombatSystem
3. Extract WaveSystem
4. Extract ElementSystem

### Phase 4: Scene Management (Week 4)
1. Refactor scene classes
2. Implement proper scene transitions
3. Extract UI components
4. Create UIManager

### Phase 5: Testing & Optimization (Week 5)
1. Write unit tests for critical systems
2. Performance profiling
3. Memory leak detection
4. Bundle optimization

## 🔄 Migration Path

### Step 1: Create Parallel Structure
- Keep existing JS files working
- Build TS modules alongside
- Use adapter pattern for integration

### Step 2: Gradual Migration
```typescript
// Adapter example for existing JS code
export class LegacyAdapter {
  private legacyGame: any;
  
  constructor(legacyGame: any) {
    this.legacyGame = legacyGame;
  }
  
  getPlayer(): Player {
    return new Player({
      health: this.legacyGame.wizard.health,
      position: {
        x: this.legacyGame.wizard.x,
        y: this.legacyGame.wizard.y
      }
    });
  }
}
```

### Step 3: Module Extraction Pattern
```typescript
// Before: Everything in game.js
class GameScene {
  spellSystem: any;
  
  castSpell() {
    // 500 lines of spell logic
  }
}

// After: Modular system
import { SpellSystem } from '@systems/SpellSystem';

class GameScene {
  private spellSystem: SpellSystem;
  
  constructor() {
    this.spellSystem = new SpellSystem(this.eventBus);
  }
  
  castSpell(element: ElementType) {
    this.spellSystem.cast(element, this.player);
  }
}
```

## 🎯 Key Refactoring Goals

### 1. Single Responsibility
Each class should have one clear purpose:
```typescript
// ❌ Bad: Mixed responsibilities
class Player {
  health: number;
  score: number;
  
  move() { }
  takeDamage() { }
  saveGame() { }  // Should be in SaveManager
  playSound() { }  // Should be in AudioSystem
}

// ✅ Good: Single responsibility
class Player {
  health: number;
  
  move() { }
  takeDamage() { }
}
```

### 2. Dependency Injection
```typescript
// ❌ Bad: Hard dependencies
class Enemy {
  constructor() {
    this.audio = new AudioSystem();  // Hard to test
    this.particles = new ParticleSystem();  // Tight coupling
  }
}

// ✅ Good: Dependency injection
class Enemy {
  constructor(
    private audio: IAudioSystem,
    private particles: IParticleSystem
  ) {}
}
```

### 3. Interface-Based Design
```typescript
interface IWeapon {
  damage: number;
  fireRate: number;
  fire(target: Vector2): void;
}

class Fireball implements IWeapon {
  damage = 10;
  fireRate = 1;
  
  fire(target: Vector2): void {
    // Implementation
  }
}

class Lightning implements IWeapon {
  damage = 15;
  fireRate = 0.5;
  
  fire(target: Vector2): void {
    // Implementation
  }
}
```

### 4. Event-Driven Architecture
```typescript
// Event definitions
interface GameEvents {
  'player:levelup': { level: number; stats: PlayerStats };
  'enemy:killed': { enemy: Enemy; killer: Entity };
  'wave:complete': { wave: number; score: number };
}

// Usage
this.eventBus.emit('player:levelup', {
  level: 5,
  stats: updatedStats
});

this.eventBus.on('enemy:killed', (data) => {
  this.score += data.enemy.scoreValue;
  this.spawnLoot(data.enemy.position);
});
```

## 🧪 Testing Strategy

### Unit Testing Structure
```typescript
// Player.test.ts
describe('Player', () => {
  let player: Player;
  let mockAudio: jest.Mocked<IAudioSystem>;
  
  beforeEach(() => {
    mockAudio = createMockAudioSystem();
    player = new Player({ audio: mockAudio });
  });
  
  describe('takeDamage', () => {
    it('should reduce health by damage amount', () => {
      player.health = 100;
      player.takeDamage(20);
      expect(player.health).toBe(80);
    });
    
    it('should not reduce health below 0', () => {
      player.health = 10;
      player.takeDamage(20);
      expect(player.health).toBe(0);
    });
    
    it('should emit death event when health reaches 0', () => {
      const deathSpy = jest.fn();
      player.on('death', deathSpy);
      player.health = 1;
      player.takeDamage(1);
      expect(deathSpy).toHaveBeenCalled();
    });
  });
});
```

### Integration Testing
```typescript
// SpellSystem.integration.test.ts
describe('SpellSystem Integration', () => {
  let game: Game;
  
  beforeEach(() => {
    game = new Game({ headless: true });
  });
  
  it('should handle element fusion correctly', () => {
    const spell = game.spellSystem.fuseElements(
      ElementType.FIRE,
      ElementType.WATER
    );
    expect(spell.type).toBe(ElementType.STEAM);
  });
});
```

## 🚀 Performance Considerations

### Object Pooling
```typescript
class ProjectilePool extends ObjectPool<Projectile> {
  constructor() {
    super(
      () => new Projectile(),
      (projectile) => projectile.reset(),
      1000  // Max pool size
    );
  }
  
  fire(from: Vector2, to: Vector2, damage: number): Projectile {
    const projectile = this.get();
    projectile.setup(from, to, damage);
    return projectile;
  }
}
```

### System Optimization
```typescript
class PhysicsSystem extends System {
  private spatialHash: SpatialHashGrid;
  
  update(entities: Entity[], delta: number): void {
    // Use spatial hashing for collision detection
    this.spatialHash.clear();
    
    for (const entity of entities) {
      this.spatialHash.insert(entity);
    }
    
    // Only check nearby entities
    for (const entity of entities) {
      const nearby = this.spatialHash.getNearby(entity);
      this.checkCollisions(entity, nearby);
    }
  }
}
```

## 📝 Code Quality Checklist

- [ ] All functions have explicit return types
- [ ] No use of `any` type
- [ ] Interfaces for all public APIs
- [ ] Unit tests for critical paths
- [ ] JSDoc comments for public methods
- [ ] No circular dependencies
- [ ] Consistent error handling
- [ ] Performance profiling done
- [ ] Memory leaks checked
- [ ] Bundle size optimized