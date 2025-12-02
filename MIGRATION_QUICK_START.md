# TypeScript Migration Quick Start Guide

This is a condensed action plan based on the comprehensive analysis. Use this for day-to-day migration work.

---

## Current Status

- **42 JavaScript files** to convert
- **7 TypeScript files** already converted (16% complete)
- **~72,000 lines** of code to migrate

---

## Quick Wins (Do These First!)

These provide immediate value with minimal effort:

### 1. Animation Registry (2 hours)
**File:** `src/core/AnimationRegistry.ts`

```typescript
export class AnimationRegistry {
    static registerAll(scene: Phaser.Scene): void {
        this.registerPlayerAnimations(scene);
        this.registerEnemyAnimations(scene);
        this.registerProjectileAnimations(scene);
    }

    private static registerPlayerAnimations(scene: Phaser.Scene): void {
        if (!scene.anims.exists('wizard-idle-loop')) {
            // Create all player animations
        }
    }
}

// In LoadingScene.create()
AnimationRegistry.registerAll(this);
```

**Impact:** Eliminates duplicate animation creation across 5+ files

---

### 2. Extract Magic Numbers (4 hours)
**File:** `src/data/constants/GameConstants.ts`

Add all hard-coded values:
- Spawn distances
- Scale multipliers
- Duration values
- Damage multipliers
- Speed modifiers

**Impact:** Makes balance tweaks easier, improves code readability

---

### 3. Tween Cleanup Manager (3 hours)
**File:** `src/core/TweenManager.ts`

```typescript
export class TweenManager {
    private tweens = new Map<Phaser.GameObjects.GameObject, Phaser.Tweens.Tween[]>();

    add(target: Phaser.GameObjects.GameObject, tween: Phaser.Tweens.Tween): void {
        if (!this.tweens.has(target)) {
            this.tweens.set(target, []);
        }
        this.tweens.get(target)!.push(tween);
    }

    destroyTarget(target: Phaser.GameObjects.GameObject): void {
        const tweens = this.tweens.get(target);
        if (tweens) {
            tweens.forEach(t => t.stop());
            this.tweens.delete(target);
        }
        target.destroy();
    }
}
```

**Impact:** Fixes memory leaks, prevents console errors

---

### 4. Status Effect System (6 hours)
**File:** `src/systems/combat/StatusEffectSystem.ts`

Centralize burn/slow/freeze/poison/stun logic (currently duplicated in 3 places)

**Impact:** DRY principle, easier to balance, consistent behavior

---

### 5. Pause Manager (2 hours)
**File:** `src/systems/core/PauseManager.ts`

Fix pause/resume state tracking issues

**Impact:** Prevents physics getting out of sync

---

## Migration Order

### Week 1-2: Core Foundation
```
✅ src/core/EventBus.ts (DONE)
✅ src/core/ServiceContainer.ts (DONE)
✅ src/entities/Entity.ts (DONE)
✅ src/types/game.types.ts (DONE)
□ src/main.js → main.ts
□ src/config/GameConfig.js → GameConfig.ts
```

### Week 2-3: Data Layer
```
□ src/data/GameConstants.js → GameConstants.ts
□ src/data/ElementConfig.js → ElementConfig.ts
□ src/data/EnemyConfig.js → EnemyConfig.ts
□ src/data/CharacterConfig.js → CharacterConfig.ts
□ src/data/WaveConfig.js → WaveConfig.ts
□ src/data/FusionRecipes.js → FusionRecipes.ts
```

### Week 3-5: Systems
```
□ src/utils/InputManager.js → InputManager.ts
□ src/systems/player/PlayerController.js → PlayerController.ts
□ src/systems/player/PlayerStats.js → PlayerStats.ts
□ src/systems/player/ChargeSystem.js → ChargeSystem.ts
□ src/systems/combat/DamageSystem.js → DamageSystem.ts
□ src/systems/enemies/WaveSystem.js → WaveSystem.ts
□ src/systems/enemies/EnemyManager.js → EnemyManager.ts
□ src/systems/ui/UIManager.js → UIManager.ts

⚠️ SPECIAL: ProjectileManager (30k lines) - SPLIT FIRST
```

### Week 5-6: Entities
```
□ src/entities/PlayerFactory.js → PlayerFactory.ts
□ src/entities/BossFactory.js → BossFactory.ts
□ src/entities/BaseBoss.js → BaseBoss.ts
□ src/entities/bosses/*.js → *.ts (6 files)
```

### Week 6-8: Scenes
```
□ src/scenes/LoadingScene.js → LoadingScene.ts
□ src/scenes/TransitionScene.js → TransitionScene.ts
□ src/scenes/TitleScene.js → TitleScene.ts
□ src/scenes/GameOverScene.js → GameOverScene.ts

⚠️ SPECIAL: GameScene (20k lines) - SPLIT FIRST
⚠️ SPECIAL: SaveSlotScene (24k lines) - SPLIT FIRST
```

---

## File Conversion Checklist

For each `.js` → `.ts` conversion:

- [ ] Create `.ts` file
- [ ] Add `import type` for Phaser types
- [ ] Add explicit parameter types
- [ ] Add explicit return types
- [ ] Replace `any` with proper types
- [ ] Add `private`/`public` modifiers
- [ ] Fix all TypeScript errors
- [ ] Update imports in other files
- [ ] Test functionality
- [ ] Delete `.js` file
- [ ] Commit

---

## Critical Anti-Patterns to Fix

### 1. Global Game Instance
**Current:**
```javascript
window.game = game; // ❌
```

**Fix:**
```typescript
export const getGame = () => game; // ✅
```

---

### 2. Manual Animation Checks
**Current:**
```javascript
if (this.wizard.anims && !this.wizard.anims.isPlaying) {
    this.wizard.play('idle');
}
```

**Fix:**
```typescript
sprite.anims.chain(['attack', 'idle']);
// or
sprite.on('animationcomplete', () => sprite.play('idle'));
```

---

### 3. Direct Scene Property Access
**Current:**
```javascript
const wizard = this.scene.wizard; // ❌
```

**Fix:**
```typescript
interface ITarget { x: number; y: number; }
setTarget(target: ITarget): void { // ✅
    this.target = target;
}
```

---

### 4. No Event Cleanup
**Current:**
```javascript
this.scene.events.on('levelUp', handler); // ❌ Never removed
```

**Fix:**
```typescript
shutdown(): void { // ✅
    this.scene.events.off('levelUp', this.handler);
}
```

---

### 5. Manual UI Management
**Current:**
```javascript
const buttons = [];
buttons.forEach(b => b.destroy()); // ❌
```

**Fix:**
```typescript
const container = scene.add.container(); // ✅
container.destroy(); // Destroys all children
```

---

## Files That Need Splitting

### ProjectileManager.js (30,012 lines)

**Before Migration:**
Split into:
```
ProjectileManager.ts (300 lines)
├── projectiles/
│   ├── FireProjectile.ts
│   ├── WaterProjectile.ts
│   ├── EarthProjectile.ts
│   ├── AirProjectile.ts
│   ├── ArcaneProjectile.ts
│   └── ... (8 total)
├── effects/
│   ├── BurnEffect.ts
│   ├── SlowEffect.ts
│   └── ... (5 total)
└── ProjectileFactory.ts
```

---

### GameScene.js (20,990 lines)

**Before Migration:**
Split into:
```
GameScene.ts (200 lines - orchestrator)
├── systems/
│   ├── GameWorldSystem.ts
│   ├── GamePhysicsSystem.ts
│   └── GameUISystem.ts
├── factories/
│   ├── WorldFactory.ts
│   └── PickupFactory.ts
└── handlers/
    ├── LevelUpHandler.ts
    └── DeathHandler.ts
```

---

### SaveSlotScene.js (24,547 lines)

**Before Migration:**
Split into:
```
SaveSlotScene.ts (300 lines)
├── SaveSlotUI.ts
├── SaveSlotData.ts
└── SaveSlotManager.ts
```

---

## Common TypeScript Patterns

### 1. Interface for Sprites
```typescript
interface IEnemy extends Phaser.Physics.Arcade.Sprite {
    enemyType: EnemyType;
    health: number;
    maxHealth: number;
    moveSpeed: number;
}
```

### 2. Const Assertions
```typescript
export const CONSTANTS = {
    SPEED: 100,
    HEALTH: 50
} as const;

type Constants = typeof CONSTANTS;
```

### 3. Enums for String Constants
```typescript
export enum ElementType {
    Fire = 'fire',
    Water = 'water',
    Earth = 'earth'
}
```

### 4. Generic Object Pools
```typescript
class ObjectPool<T extends Phaser.GameObjects.GameObject> {
    constructor(
        private scene: Phaser.Scene,
        private classType: new (...args: any[]) => T
    ) {}
}
```

### 5. Event Type Safety
```typescript
interface GameEvents {
    'player:damage': { amount: number };
    'enemy:spawn': { type: EnemyType; x: number; y: number };
}

eventBus.on<GameEvents, 'player:damage'>('player:damage', (data) => {
    // data.amount is typed!
});
```

---

## Testing Strategy

For each converted file, add tests:

```typescript
// PlayerController.test.ts
describe('PlayerController', () => {
    let controller: PlayerController;

    beforeEach(() => {
        controller = new PlayerController(mockScene, mockPlayer);
    });

    it('should move player on input', () => {
        controller.update({ x: 1, y: 0 });
        expect(mockPlayer.setVelocity).toHaveBeenCalledWith(160, 0);
    });
});
```

---

## Build & Verify

After each conversion:

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Build the project
npm run build

# Run the game
npm start

# Run tests
npm test
```

---

## Daily Workflow

1. **Pick a file** from migration order
2. **Check if splitting needed** (>1000 lines)
3. **Create `.ts` version** with types
4. **Fix all errors**
5. **Update imports**
6. **Test in browser**
7. **Delete `.js` file**
8. **Commit with message:** `refactor: convert [filename] to TypeScript`
9. **Repeat**

---

## Progress Tracking

Update this as you go:

**Phase 1 (Core):** ██████░░░░ 60% (6/10 files)
**Phase 2 (Data):** ░░░░░░░░░░ 0% (0/6 files)
**Phase 3 (Systems):** ██░░░░░░░░ 20% (3/15 files)
**Phase 4 (Entities):** ░░░░░░░░░░ 0% (0/10 files)
**Phase 5 (Scenes):** ░░░░░░░░░░ 0% (0/6 files)

**Overall:** ████░░░░░░ 19% (9/49 files)

---

## When You Get Stuck

1. Check CODEBASE_QUALITY_ANALYSIS.md for detailed examples
2. Look at already-converted files (EventBus.ts, ServiceContainer.ts)
3. Check Phaser 3 TypeScript examples: https://phaser.io/examples
4. TypeScript handbook: https://www.typescriptlang.org/docs/

---

## Success Criteria

**Code Quality:**
- [ ] No .js files in src/
- [ ] No `any` types (except unavoidable)
- [ ] All files <1000 lines
- [ ] 0 TypeScript strict errors

**Performance:**
- [ ] 60 FPS maintained
- [ ] No memory leaks
- [ ] Fast load times

**Developer Experience:**
- [ ] Full IDE autocomplete
- [ ] Clear error messages
- [ ] Easy to add features

---

Good luck! 🚀
