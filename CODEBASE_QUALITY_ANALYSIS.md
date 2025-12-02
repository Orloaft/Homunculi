# WizBiz Codebase Quality Analysis & TypeScript Migration Plan

**Date:** 2025-12-02
**Analyzed Files:** 49 source files (42 JS + 7 TS)
**Total Analyzed Lines:** ~80,000+ LOC

---

## Executive Summary

The WizBiz codebase is a Phaser 3 game with a **partial TypeScript migration** already underway. While the foundation shows good architectural decisions (EventBus, ServiceContainer, Entity system), the implementation has significant areas for improvement. This analysis identifies **critical anti-patterns, architectural weaknesses, and provides a comprehensive TypeScript migration strategy** aligned with Phaser 3 best practices.

### Key Findings

✅ **Strengths:**
- Well-organized directory structure
- TypeScript foundation started (EventBus, ServiceContainer, Entity base class)
- Comprehensive type definitions (game.types.ts)
- Configuration-driven design (ElementConfig, EnemyConfig, CharacterConfig)

⚠️ **Critical Issues:**
- **Massive monolithic files** (ProjectileManager: 30k lines, GameScene: 20k lines, SaveSlotScene: 24k lines)
- **Mixed JavaScript/TypeScript** codebase needs completion
- **Phaser 3 anti-patterns** throughout
- **Underutilized modern architecture** (EventBus, Component system)
- **No type safety** in 86% of codebase

---

## Detailed Phaser 3 Anti-Patterns & Issues

### 1. CRITICAL: Global Game Instance Exposure

**Location:** `src/main.js:31`

```javascript
// Anti-pattern: Exposing game to global scope
window.game = game;
```

**Issues:**
- Breaks encapsulation
- Enables tight coupling
- Makes testing difficult
- Not TypeScript-friendly

**Best Practice Solution:**
```typescript
// Use dependency injection or module exports
export const getGame = (): Phaser.Game => game;

// Or use ServiceContainer
getContainer().register('Game', () => game);
```

---

### 2. CRITICAL: Monolithic Scene Files

**Locations:**
- `src/scenes/GameScene.js`: **20,990 lines**
- `src/scenes/SaveSlotScene.js`: **24,547 lines**
- `src/systems/combat/ProjectileManager.js`: **30,012 lines**

**Issues:**
- Violates Single Responsibility Principle
- Difficult to maintain and test
- Poor code reusability
- Merge conflicts
- Slow IDE performance

**Best Practice Solution:**

Extract into focused modules:

```
GameScene (main orchestrator: ~200-500 lines)
├── GameSceneInit.ts (initialization logic)
├── GameScenePhysics.ts (collision setup)
├── GameSceneUI.ts (UI creation)
├── GameSceneWorld.ts (world creation)
└── GameSceneUpdates.ts (update loop coordination)
```

**Phaser 3 Best Practice:**
- Scenes should be **orchestrators**, not implementers
- Business logic belongs in **Systems**
- Use **Phaser.Events.EventEmitter** for decoupling
- Maximum ~500-1000 lines per scene

---

### 3. Manual Animation State Checking

**Location:** `src/systems/player/PlayerController.js:40-43`

```javascript
// Anti-pattern: Manual animation checking
if (this.wizard.anims && !this.wizard.anims.isPlaying ||
    this.wizard.anims.currentAnim.key !== 'wizard-idle-loop') {
    this.wizard.play('wizard-idle-loop');
}
```

**Issues:**
- Verbose and error-prone
- Doesn't use Phaser's event system
- Repeated across multiple files

**Best Practice Solution:**
```typescript
// Use Phaser's animation events
sprite.on('animationcomplete', (anim) => {
    if (anim.key === 'wizard-idle-full') {
        sprite.play('wizard-idle-loop');
    }
});

// Or use anims.chain for sequential animations
sprite.anims.chain(['wizard-idle-full', 'wizard-idle-loop']);
```

---

### 4. Animation Creation in Multiple Locations

**Locations:**
- `src/scenes/GameScene.js:110-138` (wizard animations)
- `src/entities/PlayerFactory.js:57-97` (wizard animations)
- `src/systems/enemies/EnemyManager.js:30-79` (enemy animations)
- `src/systems/combat/ProjectileManager.js:25-62` (projectile animations)

**Issues:**
- Duplicate animation definitions
- Risk of inconsistencies
- Hard to maintain
- Phaser already has mechanisms to prevent re-creation

**Best Practice Solution:**
```typescript
// Centralized animation registry
export class AnimationRegistry {
    private static created = new Set<string>();

    static createOnce(
        scene: Phaser.Scene,
        key: string,
        config: Phaser.Types.Animations.Animation
    ): void {
        if (!scene.anims.exists(key)) {
            scene.anims.create({ key, ...config });
            this.created.add(key);
        }
    }

    static registerAllAnimations(scene: Phaser.Scene): void {
        // Create ALL animations once in LoadingScene
        this.createPlayerAnimations(scene);
        this.createEnemyAnimations(scene);
        this.createProjectileAnimations(scene);
    }
}

// In LoadingScene.create()
AnimationRegistry.registerAllAnimations(this);
```

**Phaser 3 Best Practice:**
- Create ALL animations in **LoadingScene.create()**
- Animations are **global** across scenes in Phaser 3
- Use `scene.anims.exists(key)` check only when necessary

---

### 5. Direct Scene Property Access (Tight Coupling)

**Location:** Throughout codebase

```javascript
// Anti-pattern: Systems directly accessing scene properties
export class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group(); // Tight coupling
    }

    update(time, delta) {
        const wizard = this.scene.wizard; // Direct property access
    }
}
```

**Issues:**
- Tight coupling to scene structure
- Breaks when scene refactors
- Hard to test
- Not using dependency injection

**Best Practice Solution:**
```typescript
// Use dependency injection and interfaces
interface ITarget {
    x: number;
    y: number;
    active: boolean;
}

interface IPhysicsWorld {
    createGroup(): Phaser.Physics.Arcade.Group;
}

export class EnemyManager {
    private enemies: Phaser.Physics.Arcade.Group;
    private target: ITarget | null = null;

    constructor(
        private scene: Phaser.Scene,
        private physics: IPhysicsWorld
    ) {
        this.enemies = physics.createGroup();
    }

    setTarget(target: ITarget): void {
        this.target = target;
    }

    update(time: number, delta: number): void {
        if (!this.target) return;
        // Use this.target instead of this.scene.wizard
    }
}
```

---

### 6. Not Using Phaser's Container for UI Grouping

**Location:** `src/scenes/GameScene.js:313-341` (chest UI)

```javascript
// Anti-pattern: Manually managing UI element arrays
const buttons = [];
const bg = this.add.rectangle(...);
buttons.push(bg);
// ... manual cleanup
buttons.forEach(b => b.destroy());
```

**Issues:**
- Manual lifecycle management
- Easy to leak memory
- No automatic depth sorting

**Best Practice Solution:**
```typescript
// Use Phaser.GameObjects.Container
class ChestUI {
    private container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.container = scene.add.container(x, y);
        this.container.setScrollFactor(0);
        this.container.setDepth(200);

        // Add all UI elements to container
        const bg = scene.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
        this.container.add(bg);

        // ... add other elements
    }

    destroy(): void {
        // One call destroys everything
        this.container.destroy();
    }
}
```

**Phaser 3 Best Practice:**
- Use **Container** for UI panels
- Use **setScrollFactor(0)** for UI
- Container handles depth sorting automatically

---

### 7. Incorrect Event Listener Cleanup

**Location:** Multiple managers

```javascript
// Anti-pattern: No cleanup on scene shutdown
setupEventListeners() {
    this.scene.events.on('levelUp', (data) => {
        // Handler never removed
    });
}
```

**Issues:**
- Memory leaks
- Duplicate handlers on scene restart
- Phaser scenes can be reused

**Best Practice Solution:**
```typescript
export class UIManager {
    private listeners: Array<{ event: string; handler: Function }> = [];

    setupEventListeners(): void {
        const handler = (data: any) => { /* ... */ };
        this.scene.events.on('levelUp', handler);
        this.listeners.push({ event: 'levelUp', handler });
    }

    shutdown(): void {
        // Remove all listeners
        this.listeners.forEach(({ event, handler }) => {
            this.scene.events.off(event, handler);
        });
        this.listeners = [];
    }
}

// In scene
class GameScene extends Phaser.Scene {
    shutdown(): void {
        this.uiManager.shutdown();
        this.enemyManager.shutdown();
        // ... cleanup all managers
    }
}
```

**Phaser 3 Best Practice:**
- Always implement **shutdown()** or **destroy()** in managers
- Remove event listeners in shutdown
- Use **scene.events.once()** for one-time events
- Phaser provides lifecycle: **init → create → update → shutdown → destroy**

---

### 8. Manual Tween Cleanup Issues

**Location:** `src/systems/combat/ProjectileManager.js:397-406`

```javascript
// Anti-pattern: Tween without cleanup tracking
this.tweens.add({
    targets: pickup,
    y: y - 10,
    duration: 1000,
    yoyo: true,
    repeat: -1, // Infinite repeat
    ease: 'Sine.easeInOut'
});
// When pickup.destroy() is called, tween may still be running
```

**Issues:**
- Tweens continue after target destruction
- Memory leaks
- Console errors

**Best Practice Solution:**
```typescript
// Store tween reference and clean up
export class PickupManager {
    private pickupTweens = new Map<Phaser.GameObjects.GameObject, Phaser.Tweens.Tween>();

    createPickup(x: number, y: number): Phaser.GameObjects.Sprite {
        const pickup = this.scene.add.sprite(x, y, 'pickup');

        const tween = this.scene.tweens.add({
            targets: pickup,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.pickupTweens.delete(pickup);
            }
        });

        this.pickupTweens.set(pickup, tween);
        return pickup;
    }

    destroyPickup(pickup: Phaser.GameObjects.Sprite): void {
        const tween = this.pickupTweens.get(pickup);
        if (tween) {
            tween.stop();
            this.pickupTweens.delete(pickup);
        }
        pickup.destroy();
    }
}
```

**Phaser 3 Best Practice:**
- Store tween references
- Stop tweens before destroying targets
- Use `scene.tweens.killTweensOf(target)` for cleanup

---

### 9. Not Using Phaser's Group Update Callbacks

**Location:** `src/systems/enemies/EnemyManager.js:423-434`

```javascript
// Anti-pattern: Manual iteration in update
update(time, delta) {
    this.enemies.children.entries.forEach(enemy => {
        if (!enemy.active) return;
        this.updateEnemyAI(enemy, wizard, time);
    });
}
```

**Best Practice Solution:**
```typescript
// Use Phaser Group's built-in callback
export class EnemyManager {
    constructor(scene: Phaser.Scene) {
        this.enemies = scene.physics.add.group({
            runChildUpdate: true // Enable automatic update calls
        });
    }
}

// In enemy class
export class Enemy extends Phaser.Physics.Arcade.Sprite {
    update(time: number, delta: number): void {
        // Phaser calls this automatically if runChildUpdate: true
        this.updateAI(time, delta);
    }
}
```

**Phaser 3 Best Practice:**
- Use `runChildUpdate: true` for groups
- Implement `update()` in game objects
- Reduces boilerplate in managers

---

### 10. Physics Pause/Resume Without State Tracking

**Location:** `src/scenes/GameScene.js:527-536`

```javascript
// Anti-pattern: No state tracking for pause
togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
        this.physics.pause();
    } else {
        this.physics.resume();
    }
}
```

**Issues:**
- Can get out of sync if physics paused elsewhere
- Multiple pause sources cause issues

**Best Practice Solution:**
```typescript
export class PauseManager {
    private pauseSources = new Set<string>();

    constructor(private scene: Phaser.Scene) {}

    pause(source: string): void {
        this.pauseSources.add(source);
        if (this.pauseSources.size === 1) {
            this.scene.physics.pause();
            this.scene.scene.pause();
        }
    }

    resume(source: string): void {
        this.pauseSources.delete(source);
        if (this.pauseSources.size === 0) {
            this.scene.physics.resume();
            this.scene.scene.resume();
        }
    }

    isPaused(): boolean {
        return this.pauseSources.size > 0;
    }
}
```

---

## Code Organization Issues

### 1. Magic Numbers Throughout Code

**Locations:** Everywhere

```javascript
// Anti-pattern: Magic numbers
const x = this.wizard.x + Phaser.Math.Between(-100, 100);
flame.setScale(2);
const speed = COMBAT_CONFIG.projectileSpeed * 1.2;
```

**Solution:**
```typescript
// Create typed constants
export const SPAWN_CONFIG = {
    CHEST_SPAWN_OFFSET_MIN: -100,
    CHEST_SPAWN_OFFSET_MAX: 100,
    LINKED_FIRE_SCALE: 2,
    ARCANE_SPEED_MULTIPLIER: 1.2
} as const;

// Usage
const x = this.wizard.x + Phaser.Math.Between(
    SPAWN_CONFIG.CHEST_SPAWN_OFFSET_MIN,
    SPAWN_CONFIG.CHEST_SPAWN_OFFSET_MAX
);
```

---

### 2. Inconsistent Error Handling

**Location:** Throughout

```javascript
// Inconsistent patterns
if (!config) {
    console.error(`Unknown character key: ${characterKey}`);
    characterKey = 'wizard';
}

// vs
if (!enemies) return;

// vs
const enemies = this.scene.enemyManager?.getAllEnemies() || [];
```

**Solution:**
```typescript
// Standardized error handling
export class ErrorHandler {
    static handleMissingConfig<T>(
        key: string,
        configMap: Map<string, T>,
        fallback: T
    ): T {
        if (!configMap.has(key)) {
            console.warn(`Missing config for key: ${key}, using fallback`);
            return fallback;
        }
        return configMap.get(key)!;
    }
}
```

---

### 3. Duplicate Code Patterns

**Element application logic duplicated across:**
- ProjectileManager.applyElementEffect()
- DamageSystem
- Enemy status effect handling

**Solution:**
```typescript
// Centralized status effect system
export class StatusEffectSystem {
    applyBurn(target: IStatusTarget, config: IBurnConfig): void {
        // One implementation used everywhere
    }

    applySlow(target: IStatusTarget, config: ISlowConfig): void {
        // ...
    }
}
```

---

### 4. No Separation of Data and Logic

**Location:** Configuration files mixed with logic

```javascript
// src/data/EnemyConfig.js has both data AND functions
export function getEnemyStats(type, level) {
    // Logic in data file
}

export const ENEMY_TYPES = {
    // Data
};
```

**Solution:**
```typescript
// src/data/EnemyData.ts (pure data)
export const ENEMY_BASE_STATS = {
    slime: { health: 10, speed: 50, damage: 1 }
} as const;

// src/systems/EnemyStatCalculator.ts (logic)
export class EnemyStatCalculator {
    static getScaledStats(
        type: EnemyType,
        level: number
    ): EnemyStats {
        // Pure calculation function
    }
}
```

---

### 5. Component System Defined But Not Used

**Location:** `src/entities/Entity.ts` defines component system

```typescript
// Defined but not utilized
class Entity {
    private components = new Map<string, any>();

    addComponent(name: string, component: any): void {
        this.components.set(name, component);
    }
}
```

**Currently:**
Properties added directly to sprites:
```javascript
enemy.health = 100;
enemy.moveSpeed = 50;
enemy.burning = true;
```

**Should Be:**
```typescript
// Create typed components
interface HealthComponent {
    current: number;
    max: number;
}

interface MovementComponent {
    speed: number;
    acceleration: number;
}

interface StatusComponent {
    burning: boolean;
    frozen: boolean;
    poisoned: boolean;
}

// Use the component system
enemy.addComponent<HealthComponent>('health', {
    current: 100,
    max: 100
});

const health = enemy.getComponent<HealthComponent>('health');
health.current -= damage;
```

---

## TypeScript-Specific Issues

### 1. Implicit Any Types

```javascript
// No type safety
fireProjectile(origin, target, elements) {
    // What types are these?
}
```

**Solution:**
```typescript
interface IProjectileOrigin {
    x: number;
    y: number;
}

interface IProjectileTarget {
    x: number;
    y: number;
}

fireProjectile(
    origin: IProjectileOrigin,
    target: IProjectileTarget,
    elements: ElementType[]
): void {
    // Full type safety
}
```

---

### 2. Not Using Phaser TypeScript Definitions

```javascript
// Missing Phaser types
constructor(scene) {
    this.scene = scene;
}
```

**Solution:**
```typescript
constructor(private scene: Phaser.Scene) {
    // TypeScript knows all Phaser.Scene methods
    this.scene.add // Auto-complete works!
}
```

---

### 3. No Interface Definitions for Game Objects

```javascript
// Sprite properties added dynamically
const enemy = this.physics.add.sprite(x, y, 'enemy');
enemy.health = 100; // TypeScript doesn't know about this
enemy.moveSpeed = 50;
```

**Solution:**
```typescript
interface IEnemy extends Phaser.Physics.Arcade.Sprite {
    enemyType: EnemyType;
    health: number;
    maxHealth: number;
    moveSpeed: number;
    damage: number;
    xpValue: number;
}

// Type-safe creation
function createEnemy(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: EnemyType
): IEnemy {
    const enemy = scene.physics.add.sprite(x, y, 'enemy') as IEnemy;
    enemy.enemyType = type;
    enemy.health = 100;
    return enemy;
}
```

---

## Architectural Weaknesses

### 1. EventBus Defined But Underutilized

**Current State:**
- EventBus.ts exists with full type safety
- Only used in 2-3 places
- Most code uses `scene.events` directly

**Solution:**
Use EventBus consistently across the entire app:

```typescript
// Define all game events in one place
interface GameEvents {
    'enemy:spawn': { type: EnemyType; x: number; y: number };
    'enemy:death': { enemy: IEnemy; killer: IPlayer };
    'player:damage': { amount: number; source: string };
    'level:up': { level: number; shouldSpawnDarkEye: boolean };
}

// Systems listen to events
export class EnemyManager {
    constructor(eventBus: EventBus<GameEvents>) {
        eventBus.on('enemy:spawn', (data) => {
            this.spawnEnemy(data.type, data.x, data.y);
        });
    }
}

// Other systems emit events
export class DamageSystem {
    killEnemy(enemy: IEnemy, killer: IPlayer): void {
        getEventBus().emit('enemy:death', { enemy, killer });
    }
}
```

---

### 2. ServiceContainer Not Fully Utilized

**Current State:**
- ServiceContainer.ts exists
- Only used for EventBus and SpellSystem
- Most systems created directly with `new`

**Solution:**
Register ALL systems in container:

```typescript
// In main.ts
export function initializeServices(scene: Phaser.Scene): void {
    const container = getContainer();

    // Register core services
    container.register('EventBus', () => new EventBus());
    container.register('Config', () => new ConfigManager());

    // Register systems (lazy-loaded singletons)
    container.register('EnemyManager', () => new EnemyManager(
        scene,
        container.get('EventBus')
    ));

    container.register('ProjectileManager', () => new ProjectileManager(
        scene,
        container.get('EventBus')
    ));

    // ... all other systems
}

// Usage in scenes
export class GameScene extends Phaser.Scene {
    private enemyManager!: EnemyManager;

    create(): void {
        this.enemyManager = getContainer().get<EnemyManager>('EnemyManager');
    }
}
```

---

### 3. No Clear System Lifecycle Management

**Current Issue:**
Systems initialized ad-hoc in scene.create():

```javascript
create() {
    this.inputManager = new InputManager(this);
    this.playerController = new PlayerController(this, this.wizard);
    this.enemyManager = new EnemyManager(this);
    // ... 10+ managers
}
```

**Solution:**
Implement SystemManager:

```typescript
export class SystemManager {
    private systems: Array<ISystem> = [];

    register(system: ISystem): void {
        this.systems.push(system);
    }

    init(): void {
        this.systems.forEach(s => s.init?.());
    }

    update(time: number, delta: number): void {
        this.systems.forEach(s => s.update?.(time, delta));
    }

    shutdown(): void {
        this.systems.forEach(s => s.shutdown?.());
    }
}

interface ISystem {
    init?(): void;
    update?(time: number, delta: number): void;
    shutdown?(): void;
}
```

---

## Performance Concerns

### 1. Array Iteration in Update Loops

```javascript
// Called 60 times per second
update(time, delta) {
    this.enemies.children.entries.forEach(enemy => {
        // Allocates iterator every frame
    });
}
```

**Solution:**
```typescript
// Cache the array
update(time: number, delta: number): void {
    const enemies = this.enemies.getChildren() as IEnemy[];
    const count = enemies.length;

    for (let i = 0; i < count; i++) {
        const enemy = enemies[i];
        if (!enemy.active) continue;
        this.updateEnemy(enemy, time, delta);
    }
}
```

---

### 2. Object Creation in Hot Paths

```javascript
// Creating new objects every frame
this.scene.events.emit('enemyDamaged', {
    enemy: enemy,
    damage: damage,
    element: 'fire'
});
```

**Solution:**
```typescript
// Reuse event objects
class DamageEvent {
    enemy: IEnemy | null = null;
    damage: number = 0;
    element: string = '';

    reset(enemy: IEnemy, damage: number, element: string): this {
        this.enemy = enemy;
        this.damage = damage;
        this.element = element;
        return this;
    }
}

// Pool event objects
const damageEventPool = new DamageEvent[10];
```

---

### 3. No Object Pooling for Projectiles

**Current:** `new Sprite()` for every projectile
**Should:** Use Phaser's Group pooling

```typescript
this.projectiles = scene.physics.add.group({
    classType: Projectile,
    maxSize: 100,
    runChildUpdate: true,
    createCallback: (projectile) => {
        projectile.setActive(false);
        projectile.setVisible(false);
    }
});

// Get from pool
const projectile = this.projectiles.get(x, y, texture);
```

---

## TypeScript Migration Plan

### Phase 1: Core Infrastructure (Week 1-2)
**Priority:** CRITICAL
**Effort:** Medium

**Files to Convert:**
1. ✅ `src/core/EventBus.ts` (DONE)
2. ✅ `src/core/ServiceContainer.ts` (DONE)
3. ✅ `src/entities/Entity.ts` (DONE)
4. ✅ `src/types/game.types.ts` (DONE)
5. `src/main.js` → `src/main.ts`
6. `src/config/GameConfig.js` → `src/config/GameConfig.ts`

**Benefits:**
- Type-safe foundation
- Better IDE support
- Catches errors early

---

### Phase 2: Data Layer (Week 2-3)
**Priority:** HIGH
**Effort:** Low

**Files to Convert:**
1. `src/data/GameConstants.js` → `GameConstants.ts`
2. `src/data/ElementConfig.js` → `ElementConfig.ts`
3. `src/data/EnemyConfig.js` → `EnemyConfig.ts`
4. `src/data/CharacterConfig.js` → `CharacterConfig.ts`
5. `src/data/WaveConfig.js` → `WaveConfig.ts`
6. `src/data/FusionRecipes.js` → `FusionRecipes.ts`

**Strategy:**
- Convert to `const` assertions for compile-time type safety
- Extract calculation functions to separate services
- Create interfaces for all config objects

```typescript
// Example conversion
export const PLAYER_CONFIG = {
    startingHealth: 3,
    maxHealth: 5,
    moveSpeed: 160
} as const;

export type PlayerConfig = typeof PLAYER_CONFIG;
```

---

### Phase 3: System Layer (Week 3-5)
**Priority:** HIGH
**Effort:** High

**Files to Convert (in order):**

1. **Utilities:**
   - `src/utils/InputManager.js` → `InputManager.ts`

2. **Player Systems:**
   - `src/systems/player/PlayerController.js` → `PlayerController.ts`
   - `src/systems/player/PlayerStats.js` → `PlayerStats.ts`
   - `src/systems/player/ChargeSystem.js` → `ChargeSystem.ts`

3. **Combat Systems:**
   - `src/systems/combat/DamageSystem.js` → `DamageSystem.ts`
   - ⚠️ `src/systems/combat/ProjectileManager.js` → Split + Convert (see below)

4. **Enemy Systems:**
   - `src/systems/enemies/WaveSystem.js` → `WaveSystem.ts`
   - `src/systems/enemies/EnemyManager.js` → `EnemyManager.ts`

5. **UI Systems:**
   - `src/systems/ui/UIManager.js` → `UIManager.ts`

6. **Other Systems:**
   - `src/systems/SaveManager.js` → `SaveManager.ts`
   - `src/systems/AchievementManager.js` → `AchievementManager.ts`
   - ✅ `src/systems/SpellSystem.js` → `SpellSystem.ts` (DONE)

**Special Handling: ProjectileManager (30k lines)**

Must be split BEFORE conversion:

```
src/systems/combat/
├── ProjectileManager.ts (300 lines - orchestrator)
├── projectiles/
│   ├── FireProjectile.ts
│   ├── WaterProjectile.ts
│   ├── EarthProjectile.ts
│   ├── AirProjectile.ts
│   ├── ArcaneProjectile.ts
│   ├── LightningProjectile.ts
│   ├── IceProjectile.ts
│   └── PoisonProjectile.ts
├── effects/
│   ├── BurnEffect.ts
│   ├── SlowEffect.ts
│   ├── FreezeEffect.ts
│   ├── StunEffect.ts
│   └── PoisonEffect.ts
└── ProjectileFactory.ts
```

---

### Phase 4: Entity Layer (Week 5-6)
**Priority:** MEDIUM
**Effort:** Medium

**Files to Convert:**
1. `src/entities/PlayerFactory.js` → `PlayerFactory.ts`
2. `src/entities/BossFactory.js` → `BossFactory.ts`
3. `src/entities/BaseBoss.js` → `BaseBoss.ts`
4. All boss implementations:
   - `src/entities/bosses/*.js` → `*.ts`

---

### Phase 5: Scene Layer (Week 6-8)
**Priority:** MEDIUM
**Effort:** Very High

**Files to Convert (in order):**

1. `src/scenes/LoadingScene.js` → `LoadingScene.ts` (easiest)
2. `src/scenes/TransitionScene.js` → `TransitionScene.ts`
3. `src/scenes/TitleScene.js` → `TitleScene.ts`
4. `src/scenes/GameOverScene.js` → `GameOverScene.ts`
5. ⚠️ `src/scenes/GameScene.js` → Split + Convert
6. ⚠️ `src/scenes/SaveSlotScene.js` → Split + Convert

**GameScene Refactoring Plan:**

Split 20,990 lines into:

```
src/scenes/game/
├── GameScene.ts (200 lines - orchestrator)
├── GameSceneConfig.ts (configuration)
├── systems/
│   ├── GameWorldSystem.ts (world creation)
│   ├── GamePhysicsSystem.ts (collision setup)
│   ├── GameUISystem.ts (UI initialization)
│   └── GameSequenceSystem.ts (countdown, start)
├── factories/
│   ├── WorldFactory.ts
│   ├── BarrierFactory.ts
│   └── PickupFactory.ts
└── handlers/
    ├── LevelUpHandler.ts
    ├── DeathHandler.ts
    └── DropHandler.ts
```

---

### Phase 6: UI Components (Week 8-9)
**Priority:** LOW
**Effort:** Low

**Files to Convert:**
1. `src/ui/AchievementNotification.js` → `AchievementNotification.ts`
2. Create new UI components:
   - `src/ui/ChestSelectionUI.ts`
   - `src/ui/PauseMenu.ts`
   - `src/ui/HealthBar.ts`
   - `src/ui/ChargeDisplay.ts`

---

## Implementation Best Practices

### 1. Use Strict TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": false,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

### 2. Define Clear Interfaces

```typescript
// src/types/entities.types.ts
export interface IGameObject {
    x: number;
    y: number;
    active: boolean;
    destroy(): void;
}

export interface IDamageable extends IGameObject {
    health: number;
    maxHealth: number;
    takeDamage(amount: number): void;
}

export interface IEnemy extends IDamageable {
    enemyType: EnemyType;
    moveSpeed: number;
    damage: number;
    xpValue: number;
}

export interface IPlayer extends IDamageable {
    characterKey: CharacterKey;
    isP2: boolean;
    stats: PlayerStats;
}
```

---

### 3. Use Enums for Constants

```typescript
// Instead of string literals
export enum ElementType {
    Fire = 'fire',
    Water = 'water',
    Earth = 'earth',
    Air = 'air',
    Lightning = 'lightning',
    Arcane = 'arcane'
}

// Type-safe usage
function fireProjectile(element: ElementType): void {
    switch (element) {
        case ElementType.Fire:
            // TypeScript ensures all cases covered
            break;
        // ...
    }
}
```

---

### 4. Leverage Union Types

```typescript
export type GameState =
    | 'LOADING'
    | 'MENU'
    | 'PLAYING'
    | 'PAUSED'
    | 'GAME_OVER'
    | 'VICTORY'
    | 'CUTSCENE';

// Type-safe state machine
class GameStateMachine {
    private state: GameState = 'LOADING';

    setState(newState: GameState): void {
        // Only accepts valid states
        this.state = newState;
    }
}
```

---

### 5. Use Generics for Reusable Systems

```typescript
export class ObjectPool<T extends Phaser.GameObjects.GameObject> {
    private pool: T[] = [];

    constructor(
        private scene: Phaser.Scene,
        private classType: new (...args: any[]) => T,
        private maxSize: number
    ) {}

    get(...args: any[]): T {
        let obj = this.pool.pop();
        if (!obj) {
            obj = new this.classType(this.scene, ...args);
        }
        return obj;
    }

    release(obj: T): void {
        obj.setActive(false);
        obj.setVisible(false);
        if (this.pool.length < this.maxSize) {
            this.pool.push(obj);
        } else {
            obj.destroy();
        }
    }
}

// Usage
const projectilePool = new ObjectPool(
    this.scene,
    Projectile,
    100
);
```

---

## Refactoring Strategy

### Step 1: Extract Large Files

Before converting to TypeScript, split monolithic files:

**Priority Order:**
1. ProjectileManager.js (30k lines) → 8-10 files
2. SaveSlotScene.js (24k lines) → 5-7 files
3. GameScene.js (20k lines) → 5-7 files

**Example: ProjectileManager Extraction**

Create base class:
```typescript
// ProjectileBase.ts
export abstract class ProjectileBase {
    abstract fire(
        origin: IProjectileOrigin,
        target: IProjectileTarget,
        group: ElementType[]
    ): Phaser.GameObjects.GameObject;

    protected createSprite(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string
    ): Phaser.Physics.Arcade.Sprite {
        return scene.physics.add.sprite(x, y, texture);
    }
}
```

Individual projectiles:
```typescript
// FireProjectile.ts
export class FireProjectile extends ProjectileBase {
    fire(origin, target, group) {
        // Only fire-specific logic
    }
}

// WaterProjectile.ts
export class WaterProjectile extends ProjectileBase {
    fire(origin, target, group) {
        // Only water-specific logic
    }
}
```

ProjectileManager becomes factory:
```typescript
export class ProjectileManager {
    private handlers: Map<ElementType, ProjectileBase>;

    constructor(scene: Phaser.Scene) {
        this.handlers = new Map([
            [ElementType.Fire, new FireProjectile(scene)],
            [ElementType.Water, new WaterProjectile(scene)],
            // ...
        ]);
    }

    fireProjectile(origin, target, elements): void {
        const primaryElement = elements[0];
        const handler = this.handlers.get(primaryElement);
        handler?.fire(origin, target, elements);
    }
}
```

---

### Step 2: Introduce Interfaces

Before converting files, define interfaces:

```typescript
// src/types/systems.types.ts
export interface ISystem {
    init?(): void;
    update?(time: number, delta: number): void;
    shutdown?(): void;
}

export interface IProjectileManager extends ISystem {
    fireProjectile(
        origin: IProjectileOrigin,
        target: IProjectileTarget,
        elements: ElementType[]
    ): void;
    clearAll(): void;
}

export interface IEnemyManager extends ISystem {
    spawnEnemy(type: EnemyType, x: number, y: number): IEnemy;
    getAllEnemies(): IEnemy[];
    getEnemyCount(): number;
}
```

---

### Step 3: Convert File-by-File

**Conversion Checklist for Each File:**

- [ ] Create `.ts` file alongside `.js`
- [ ] Add explicit types to all parameters
- [ ] Add explicit return types to all functions
- [ ] Replace `any` with proper types
- [ ] Add interfaces for complex objects
- [ ] Use `private`/`public`/`protected` modifiers
- [ ] Replace loose comparisons (`==`) with strict (`===`)
- [ ] Add nullability annotations (`Type | null`)
- [ ] Fix all TypeScript errors
- [ ] Update all imports to use new `.ts` file
- [ ] Delete old `.js` file
- [ ] Run `npm run build` to verify
- [ ] Run game and test functionality
- [ ] Commit changes

---

### Step 4: Add Unit Tests

For each converted system, add tests:

```typescript
// src/tests/PlayerController.test.ts
import { PlayerController } from '../systems/player/PlayerController';
import { createMockScene } from './mocks/MockScene';

describe('PlayerController', () => {
    let controller: PlayerController;
    let mockScene: Phaser.Scene;
    let mockPlayer: any;

    beforeEach(() => {
        mockScene = createMockScene();
        mockPlayer = createMockPlayer();
        controller = new PlayerController(mockScene, mockPlayer);
    });

    it('should move player based on input', () => {
        const mockInput = { x: 1, y: 0 };
        controller.update(mockInput);
        expect(mockPlayer.setVelocity).toHaveBeenCalledWith(160, 0);
    });
});
```

---

## Recommended Folder Structure (Final State)

```
src/
├── core/
│   ├── EventBus.ts
│   ├── ServiceContainer.ts
│   ├── SystemManager.ts
│   └── ObjectPool.ts
│
├── types/
│   ├── game.types.ts
│   ├── entities.types.ts
│   ├── systems.types.ts
│   ├── events.types.ts
│   └── config.types.ts
│
├── config/
│   ├── GameConfig.ts
│   ├── PhysicsConfig.ts
│   └── AnimationRegistry.ts
│
├── data/
│   ├── constants/
│   │   ├── GameConstants.ts
│   │   ├── CombatConstants.ts
│   │   └── UIConstants.ts
│   ├── configs/
│   │   ├── ElementConfig.ts
│   │   ├── EnemyConfig.ts
│   │   ├── CharacterConfig.ts
│   │   └── WaveConfig.ts
│   └── recipes/
│       └── FusionRecipes.ts
│
├── entities/
│   ├── Entity.ts (base class)
│   ├── Player.ts
│   ├── Enemy.ts
│   ├── Projectile.ts
│   ├── factories/
│   │   ├── PlayerFactory.ts
│   │   ├── EnemyFactory.ts
│   │   ├── ProjectileFactory.ts
│   │   └── BossFactory.ts
│   └── bosses/
│       ├── BaseBoss.ts
│       ├── ObeliskBoss.ts
│       ├── ArcherBoss.ts
│       └── ... (other bosses)
│
├── systems/
│   ├── core/
│   │   ├── PauseManager.ts
│   │   ├── SaveManager.ts
│   │   └── AchievementManager.ts
│   ├── player/
│   │   ├── PlayerController.ts
│   │   ├── PlayerStats.ts
│   │   └── ChargeSystem.ts
│   ├── combat/
│   │   ├── DamageSystem.ts
│   │   ├── ProjectileManager.ts
│   │   ├── StatusEffectSystem.ts
│   │   ├── projectiles/
│   │   │   ├── ProjectileBase.ts
│   │   │   ├── FireProjectile.ts
│   │   │   ├── WaterProjectile.ts
│   │   │   └── ... (other projectiles)
│   │   └── effects/
│   │       ├── BurnEffect.ts
│   │       ├── SlowEffect.ts
│   │       └── ... (other effects)
│   ├── enemies/
│   │   ├── EnemyManager.ts
│   │   ├── EnemyAI.ts
│   │   └── WaveSystem.ts
│   └── ui/
│       └── UIManager.ts
│
├── ui/
│   ├── components/
│   │   ├── AchievementNotification.ts
│   │   ├── ChestSelectionUI.ts
│   │   ├── PauseMenu.ts
│   │   ├── HealthBar.ts
│   │   └── ChargeDisplay.ts
│   └── layouts/
│       ├── GameHUD.ts
│       └── MenuLayout.ts
│
├── scenes/
│   ├── LoadingScene.ts
│   ├── TitleScene.ts
│   ├── GameOverScene.ts
│   ├── TransitionScene.ts
│   ├── SaveSlotScene.ts
│   └── game/
│       ├── GameScene.ts
│       ├── GameSceneConfig.ts
│       ├── systems/
│       │   ├── GameWorldSystem.ts
│       │   ├── GamePhysicsSystem.ts
│       │   └── GameUISystem.ts
│       └── handlers/
│           ├── LevelUpHandler.ts
│           └── DeathHandler.ts
│
├── utils/
│   ├── InputManager.ts
│   ├── MathUtils.ts
│   ├── ErrorHandler.ts
│   └── DebugManager.ts
│
├── tests/
│   ├── setup.ts
│   ├── mocks/
│   │   ├── MockScene.ts
│   │   └── MockGameObject.ts
│   ├── systems/
│   │   ├── PlayerController.test.ts
│   │   ├── DamageSystem.test.ts
│   │   └── SpellSystem.test.ts
│   └── entities/
│       └── Entity.test.ts
│
└── main.ts
```

---

## Quick Wins (Implement First)

### 1. Create AnimationRegistry (2 hours)
Consolidate all animation creation

### 2. Extract Magic Numbers (4 hours)
Move all hard-coded values to typed constants

### 3. Add Error Handling Service (3 hours)
Standardize error handling

### 4. Implement Pause Manager (2 hours)
Fix pause state tracking

### 5. Add Tween Cleanup (3 hours)
Prevent tween memory leaks

### 6. Create Status Effect System (6 hours)
Centralize burn/slow/freeze/poison logic

---

## Estimated Effort

| Phase | Duration | Files | Lines to Convert |
|-------|----------|-------|------------------|
| Phase 1: Core | 2 weeks | 6 | ~1,000 |
| Phase 2: Data | 1 week | 6 | ~2,000 |
| Phase 3: Systems | 2 weeks | 15 | ~15,000 |
| Phase 4: Entities | 1 week | 10 | ~3,000 |
| Phase 5: Scenes | 2 weeks | 6 | ~50,000 |
| Phase 6: UI | 1 week | 5 | ~1,000 |
| **Total** | **9 weeks** | **48 files** | **~72,000 LOC** |

**Note:** This assumes:
- 1 developer full-time
- Includes refactoring of large files
- Includes unit testing
- Includes documentation

---

## Success Metrics

### Code Quality
- [ ] 100% TypeScript (0 .js files in src/)
- [ ] 0 `any` types (except where truly necessary)
- [ ] 0 TypeScript errors with strict mode
- [ ] All files under 1000 lines
- [ ] 80%+ test coverage

### Performance
- [ ] Consistent 60 FPS
- [ ] No memory leaks
- [ ] Fast load times (<3 seconds)

### Developer Experience
- [ ] Full IDE autocomplete
- [ ] Type errors caught at compile-time
- [ ] Easy to add new features
- [ ] Clear separation of concerns

---

## Conclusion

The WizBiz codebase has a **solid foundation** but needs significant refactoring to align with **Phaser 3 best practices** and **TypeScript standards**. The migration will result in:

✅ **Better Code Quality:** Type safety, clear interfaces, separation of concerns
✅ **Easier Maintenance:** Smaller files, clear responsibilities, consistent patterns
✅ **Better Performance:** Object pooling, optimized update loops
✅ **Better Developer Experience:** IDE support, compile-time error catching

The 9-week migration plan is ambitious but achievable with consistent effort. **Start with Quick Wins** to see immediate benefits, then proceed phase-by-phase.

---

**Next Steps:**
1. Review this analysis
2. Prioritize which improvements are most critical
3. Start with Quick Wins
4. Begin Phase 1 of TypeScript migration
5. Set up unit testing infrastructure
6. Implement continuous integration for type checking

Good luck with the migration! 🚀
