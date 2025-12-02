# Phaser 3 + TypeScript Best Practices Quick Reference

A quick reference card for converting WizBiz code to TypeScript with Phaser 3 best practices.

---

## Scene Patterns

### Basic Scene Structure
```typescript
export class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private enemies!: Phaser.Physics.Arcade.Group;

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: GameSceneData): void {
        // Initialize with passed data
        this.stage = data.stage;
    }

    create(): void {
        // Setup game objects
        this.createWorld();
        this.setupPhysics();
        this.setupInput();
    }

    update(time: number, delta: number): void {
        // Game loop
        this.updatePlayer(time, delta);
    }

    shutdown(): void {
        // Cleanup
        this.events.off('customEvent');
    }
}
```

---

### Scene Data Passing
```typescript
// Define scene data type
interface GameSceneData {
    stage: StageType;
    character: CharacterType;
    difficulty: number;
}

// From another scene
this.scene.start('GameScene', {
    stage: 'forest',
    character: 'wizard',
    difficulty: 1
} as GameSceneData);

// In GameScene
init(data: GameSceneData): void {
    this.stage = data.stage;
}
```

---

## Physics & Collisions

### Type-Safe Colliders
```typescript
// Instead of
this.physics.add.overlap(playerGroup, enemyGroup, callback);

// Do this
this.physics.add.overlap(
    this.player,
    this.enemies,
    this.handlePlayerEnemyCollision,
    undefined,
    this
);

private handlePlayerEnemyCollision(
    player: Phaser.GameObjects.GameObject,
    enemy: Phaser.GameObjects.GameObject
): void {
    const playerSprite = player as IPlayer;
    const enemySprite = enemy as IEnemy;
    // Now you have types!
}
```

---

### Physics Groups with Types
```typescript
interface IEnemy extends Phaser.Physics.Arcade.Sprite {
    enemyType: EnemyType;
    health: number;
    moveSpeed: number;
}

// Create group
this.enemies = this.physics.add.group({
    classType: Enemy,
    runChildUpdate: true,
    maxSize: 50
});

// Get with type
const enemy = this.enemies.get(x, y, 'enemy') as IEnemy;
enemy.health = 100; // Type-safe!

// Iterate with type
this.enemies.getChildren().forEach((enemy: IEnemy) => {
    enemy.health -= 10;
});
```

---

## Animation Best Practices

### Centralized Animation Registry
```typescript
export class AnimationRegistry {
    private static registered = new Set<string>();

    static create(
        scene: Phaser.Scene,
        key: string,
        config: Phaser.Types.Animations.Animation
    ): void {
        if (scene.anims.exists(key)) return;

        scene.anims.create({ key, ...config });
        this.registered.add(key);
    }

    static registerAll(scene: Phaser.Scene): void {
        // Call once in LoadingScene
        this.registerPlayerAnimations(scene);
        this.registerEnemyAnimations(scene);
    }

    private static registerPlayerAnimations(scene: Phaser.Scene): void {
        this.create(scene, 'wizard-idle', {
            frames: scene.anims.generateFrameNumbers('wizard-idle', {
                start: 0,
                end: 19
            }),
            frameRate: 10,
            repeat: -1
        });
    }
}

// In LoadingScene.create()
AnimationRegistry.registerAll(this);
```

---

### Animation Chaining
```typescript
// Instead of manual state management
sprite.on('animationcomplete', (anim) => {
    if (anim.key === 'attack') {
        sprite.play('idle');
    }
});

// Use chain
sprite.anims.chain(['attack', 'idle']);
```

---

### Animation Events
```typescript
sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
    console.log('Animation complete:', anim.key);
});

sprite.on(Phaser.Animations.Events.ANIMATION_START, (anim) => {
    console.log('Animation started:', anim.key);
});

// Type-safe version
sprite.on(
    Phaser.Animations.Events.ANIMATION_COMPLETE + '-wizard-death',
    () => {
        // Only fires for wizard-death animation
    }
);
```

---

## Input Management

### Keyboard Input
```typescript
export class InputManager {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: Map<string, Phaser.Input.Keyboard.Key>;

    constructor(scene: Phaser.Scene) {
        this.cursors = scene.input.keyboard!.createCursorKeys();

        this.keys = new Map([
            ['space', scene.input.keyboard!.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )],
            ['esc', scene.input.keyboard!.addKey(
                Phaser.Input.Keyboard.KeyCodes.ESC
            )]
        ]);
    }

    isKeyJustDown(key: string): boolean {
        const keyObj = this.keys.get(key);
        return keyObj ? Phaser.Input.Keyboard.JustDown(keyObj) : false;
    }

    getMovement(): { x: number; y: number } {
        return {
            x: this.cursors.left.isDown ? -1 : this.cursors.right.isDown ? 1 : 0,
            y: this.cursors.up.isDown ? -1 : this.cursors.down.isDown ? 1 : 0
        };
    }
}
```

---

### Gamepad Support
```typescript
export class GamepadManager {
    private pad: Phaser.Input.Gamepad.Gamepad | null = null;

    constructor(private scene: Phaser.Scene) {
        scene.input.gamepad?.once('connected', (pad) => {
            this.pad = pad;
        });
    }

    getMovement(): { x: number; y: number } {
        if (!this.pad) return { x: 0, y: 0 };

        const leftStick = this.pad.leftStick;
        return {
            x: Math.abs(leftStick.x) > 0.1 ? leftStick.x : 0,
            y: Math.abs(leftStick.y) > 0.1 ? leftStick.y : 0
        };
    }

    isButtonJustPressed(button: number): boolean {
        if (!this.pad) return false;
        const btn = this.pad.buttons[button];
        return btn ? btn.pressed && btn.duration < 100 : false;
    }
}
```

---

## UI & Containers

### Type-Safe Container
```typescript
export class HealthBar extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle;
    private fill: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y);

        this.background = scene.add.rectangle(0, 0, width, height, 0x000000);
        this.fill = scene.add.rectangle(-width/2, 0, width, height, 0xff0000);
        this.text = scene.add.text(0, 0, '100/100', { fontSize: '16px' });

        this.fill.setOrigin(0, 0.5);
        this.text.setOrigin(0.5);

        this.add([this.background, this.fill, this.text]);
        scene.add.existing(this);

        this.setScrollFactor(0);
        this.setDepth(100);
    }

    updateHealth(current: number, max: number): void {
        const percent = Math.max(0, current / max);
        this.fill.scaleX = percent;
        this.text.setText(`${current}/${max}`);
    }
}

// Usage
const healthBar = new HealthBar(this, 100, 50, 200, 20);
healthBar.updateHealth(75, 100);
```

---

### Modal Dialog Pattern
```typescript
export class ModalDialog extends Phaser.GameObjects.Container {
    private overlay: Phaser.GameObjects.Rectangle;
    private panel: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, config: ModalConfig) {
        super(scene, 0, 0);

        // Full screen overlay
        this.overlay = scene.add.rectangle(
            scene.scale.width / 2,
            scene.scale.height / 2,
            scene.scale.width,
            scene.scale.height,
            0x000000,
            0.7
        );
        this.overlay.setInteractive();

        // Modal panel
        this.panel = this.createPanel(config);

        this.add([this.overlay, this.panel]);
        scene.add.existing(this);

        this.setScrollFactor(0);
        this.setDepth(1000);
    }

    show(): void {
        this.setVisible(true);
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            duration: 200
        });
    }

    hide(): void {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            onComplete: () => this.destroy()
        });
    }
}
```

---

## Event System

### Type-Safe Event Bus
```typescript
// Define all events
interface GameEvents {
    'player:spawn': { player: IPlayer; x: number; y: number };
    'enemy:death': { enemy: IEnemy; killer: IPlayer };
    'level:up': { level: number };
}

export class TypedEventBus {
    private emitter = new Phaser.Events.EventEmitter();

    on<K extends keyof GameEvents>(
        event: K,
        handler: (data: GameEvents[K]) => void,
        context?: any
    ): void {
        this.emitter.on(event, handler, context);
    }

    emit<K extends keyof GameEvents>(
        event: K,
        data: GameEvents[K]
    ): void {
        this.emitter.emit(event, data);
    }

    off<K extends keyof GameEvents>(
        event: K,
        handler: (data: GameEvents[K]) => void,
        context?: any
    ): void {
        this.emitter.off(event, handler, context);
    }
}

// Usage
const eventBus = new TypedEventBus();

eventBus.on('player:spawn', (data) => {
    // data is typed as { player: IPlayer; x: number; y: number }
    console.log(data.player, data.x, data.y);
});

eventBus.emit('player:spawn', {
    player: myPlayer,
    x: 100,
    y: 200
});
```

---

### Scene Event Cleanup
```typescript
export class MySystem {
    private eventHandlers: Array<{
        event: string;
        handler: Function;
    }> = [];

    constructor(private scene: Phaser.Scene) {
        this.setupEvents();
    }

    private setupEvents(): void {
        const handler1 = (data: any) => this.handleLevelUp(data);
        const handler2 = (data: any) => this.handleEnemyDeath(data);

        this.scene.events.on('levelUp', handler1);
        this.scene.events.on('enemyDeath', handler2);

        this.eventHandlers.push(
            { event: 'levelUp', handler: handler1 },
            { event: 'enemyDeath', handler: handler2 }
        );
    }

    shutdown(): void {
        this.eventHandlers.forEach(({ event, handler }) => {
            this.scene.events.off(event, handler as any);
        });
        this.eventHandlers = [];
    }
}
```

---

## Tweens & Timers

### Tween Manager with Cleanup
```typescript
export class TweenManager {
    private tweens = new Map<
        Phaser.GameObjects.GameObject,
        Phaser.Tweens.Tween[]
    >();

    constructor(private scene: Phaser.Scene) {}

    add(
        target: Phaser.GameObjects.GameObject,
        config: Phaser.Types.Tweens.TweenBuilderConfig
    ): Phaser.Tweens.Tween {
        const tween = this.scene.tweens.add({
            ...config,
            targets: target,
            onComplete: () => {
                this.remove(target, tween);
                config.onComplete?.();
            }
        });

        if (!this.tweens.has(target)) {
            this.tweens.set(target, []);
        }
        this.tweens.get(target)!.push(tween);

        return tween;
    }

    remove(
        target: Phaser.GameObjects.GameObject,
        tween: Phaser.Tweens.Tween
    ): void {
        const tweens = this.tweens.get(target);
        if (tweens) {
            const index = tweens.indexOf(tween);
            if (index > -1) {
                tweens.splice(index, 1);
            }
        }
    }

    killTarget(target: Phaser.GameObjects.GameObject): void {
        const tweens = this.tweens.get(target);
        if (tweens) {
            tweens.forEach(t => t.stop());
            this.tweens.delete(target);
        }
    }

    killAll(): void {
        this.tweens.forEach((tweens) => {
            tweens.forEach(t => t.stop());
        });
        this.tweens.clear();
    }
}

// Usage
const tweenManager = new TweenManager(this);

const sprite = this.add.sprite(100, 100, 'sprite');
tweenManager.add(sprite, {
    x: 200,
    y: 200,
    duration: 1000
});

// When destroying sprite
tweenManager.killTarget(sprite);
sprite.destroy();
```

---

### Timer Management
```typescript
export class TimerManager {
    private timers: Phaser.Time.TimerEvent[] = [];

    constructor(private scene: Phaser.Scene) {}

    addEvent(config: Phaser.Types.Time.TimerEventConfig): Phaser.Time.TimerEvent {
        const timer = this.scene.time.addEvent(config);
        this.timers.push(timer);
        return timer;
    }

    delayedCall(
        delay: number,
        callback: () => void,
        callbackScope?: any
    ): Phaser.Time.TimerEvent {
        const timer = this.scene.time.delayedCall(delay, callback, [], callbackScope);
        this.timers.push(timer);
        return timer;
    }

    shutdown(): void {
        this.timers.forEach(timer => {
            if (timer) {
                timer.remove();
            }
        });
        this.timers = [];
    }
}
```

---

## Object Pooling

### Generic Object Pool
```typescript
export class ObjectPool<T extends Phaser.GameObjects.GameObject> {
    private pool: T[] = [];
    private activeObjects = new Set<T>();

    constructor(
        private scene: Phaser.Scene,
        private classType: new (...args: any[]) => T,
        private maxSize: number = 100
    ) {}

    get(...args: any[]): T {
        let obj = this.pool.pop();

        if (!obj) {
            obj = new this.classType(this.scene, ...args);
        }

        obj.setActive(true);
        obj.setVisible(true);
        this.activeObjects.add(obj);

        return obj;
    }

    release(obj: T): void {
        obj.setActive(false);
        obj.setVisible(false);
        this.activeObjects.delete(obj);

        if (this.pool.length < this.maxSize) {
            this.pool.push(obj);
        } else {
            obj.destroy();
        }
    }

    releaseAll(): void {
        this.activeObjects.forEach(obj => this.release(obj));
    }

    clear(): void {
        this.releaseAll();
        this.pool.forEach(obj => obj.destroy());
        this.pool = [];
    }

    getActiveCount(): number {
        return this.activeObjects.size;
    }
}

// Usage
const projectilePool = new ObjectPool(
    this,
    Projectile,
    100
);

// Get from pool
const projectile = projectilePool.get(x, y, texture);

// Return to pool
projectilePool.release(projectile);
```

---

### Phaser Group Pooling
```typescript
// Built-in pooling with groups
this.projectiles = this.physics.add.group({
    classType: Projectile,
    maxSize: 100,
    runChildUpdate: true,
    createCallback: (projectile) => {
        projectile.setActive(false);
        projectile.setVisible(false);
    }
});

// Get from pool (creates if needed)
const projectile = this.projectiles.get(x, y, texture);
if (projectile) {
    projectile.setActive(true);
    projectile.setVisible(true);
    projectile.fire(target);
}

// Return to pool
projectile.setActive(false);
projectile.setVisible(false);
```

---

## System Architecture

### Base System Interface
```typescript
export interface ISystem {
    init?(): void;
    preUpdate?(time: number, delta: number): void;
    update?(time: number, delta: number): void;
    postUpdate?(time: number, delta: number): void;
    shutdown?(): void;
    destroy?(): void;
}
```

---

### System Manager
```typescript
export class SystemManager {
    private systems: ISystem[] = [];

    register(system: ISystem): void {
        this.systems.push(system);
    }

    init(): void {
        this.systems.forEach(s => s.init?.());
    }

    update(time: number, delta: number): void {
        this.systems.forEach(s => {
            s.preUpdate?.(time, delta);
        });
        this.systems.forEach(s => {
            s.update?.(time, delta);
        });
        this.systems.forEach(s => {
            s.postUpdate?.(time, delta);
        });
    }

    shutdown(): void {
        this.systems.forEach(s => s.shutdown?.());
    }

    destroy(): void {
        this.systems.forEach(s => s.destroy?.());
        this.systems = [];
    }
}

// Usage in scene
export class GameScene extends Phaser.Scene {
    private systemManager!: SystemManager;

    create(): void {
        this.systemManager = new SystemManager();
        this.systemManager.register(new PlayerSystem(this));
        this.systemManager.register(new EnemySystem(this));
        this.systemManager.register(new CombatSystem(this));
        this.systemManager.init();
    }

    update(time: number, delta: number): void {
        this.systemManager.update(time, delta);
    }

    shutdown(): void {
        this.systemManager.shutdown();
    }
}
```

---

## Common TypeScript Utilities

### Type Guards
```typescript
function isEnemy(obj: any): obj is IEnemy {
    return obj && typeof obj.health === 'number' && obj.enemyType !== undefined;
}

function isPlayer(obj: any): obj is IPlayer {
    return obj && typeof obj.health === 'number' && obj.characterKey !== undefined;
}

// Usage
if (isEnemy(gameObject)) {
    // TypeScript knows it's IEnemy
    gameObject.health -= 10;
}
```

---

### Readonly Config
```typescript
export const CONFIG = {
    PLAYER: {
        SPEED: 160,
        HEALTH: 100
    },
    ENEMY: {
        SPAWN_RATE: 2000,
        MAX_COUNT: 50
    }
} as const;

type Config = typeof CONFIG;
// Can't modify CONFIG.PLAYER.SPEED at runtime
```

---

### Const Enums (Zero Runtime Cost)
```typescript
const enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}

// Compiles to just numbers
const dir = Direction.Up; // becomes: const dir = 0;
```

---

### Utility Types
```typescript
// Partial - make all properties optional
type PartialConfig = Partial<GameConfig>;

// Required - make all properties required
type RequiredConfig = Required<PartialConfig>;

// Pick - select specific properties
type PlayerPosition = Pick<IPlayer, 'x' | 'y'>;

// Omit - exclude specific properties
type PlayerWithoutSprite = Omit<IPlayer, 'texture' | 'frame'>;

// Record - create object type
type EnemyMap = Record<EnemyType, EnemyConfig>;
```

---

## Performance Patterns

### Avoid Allocations in Update Loop
```typescript
// ❌ Bad - creates new object every frame
update() {
    this.move({ x: 1, y: 0 });
}

// ✅ Good - reuse object
private moveVector = { x: 0, y: 0 };

update() {
    this.moveVector.x = 1;
    this.moveVector.y = 0;
    this.move(this.moveVector);
}
```

---

### Cache Array Length
```typescript
// ❌ Bad - accesses length every iteration
for (let i = 0; i < this.enemies.length; i++) {
    // ...
}

// ✅ Good - cache length
const count = this.enemies.length;
for (let i = 0; i < count; i++) {
    // ...
}
```

---

### Use For-Loops Instead of ForEach
```typescript
// ❌ Slower - creates iterator
this.enemies.forEach(enemy => {
    enemy.update();
});

// ✅ Faster - traditional for loop
const enemies = this.enemies.getChildren() as IEnemy[];
const count = enemies.length;
for (let i = 0; i < count; i++) {
    enemies[i].update();
}
```

---

## Testing Patterns

### Mock Scene
```typescript
export function createMockScene(): Phaser.Scene {
    return {
        add: {
            sprite: jest.fn(),
            text: jest.fn(),
            container: jest.fn()
        },
        physics: {
            add: {
                sprite: jest.fn(),
                group: jest.fn()
            }
        },
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn()
        }
    } as any as Phaser.Scene;
}
```

---

### System Tests
```typescript
describe('DamageSystem', () => {
    let system: DamageSystem;
    let mockScene: Phaser.Scene;

    beforeEach(() => {
        mockScene = createMockScene();
        system = new DamageSystem(mockScene);
    });

    it('should apply damage to enemy', () => {
        const enemy = createMockEnemy({ health: 100 });
        system.damageEnemy(enemy, 25);
        expect(enemy.health).toBe(75);
    });

    it('should emit death event when health reaches 0', () => {
        const enemy = createMockEnemy({ health: 10 });
        system.damageEnemy(enemy, 15);
        expect(mockScene.events.emit).toHaveBeenCalledWith(
            'enemyDeath',
            expect.objectContaining({ enemy })
        );
    });
});
```

---

## Common Mistakes to Avoid

### ❌ Modifying Phaser Types
```typescript
// Don't do this
declare module 'phaser' {
    interface Sprite {
        customProperty: number;
    }
}
```

### ✅ Create Interfaces Instead
```typescript
interface ICustomSprite extends Phaser.GameObjects.Sprite {
    customProperty: number;
}
```

---

### ❌ Using Any
```typescript
function process(data: any) { // ❌
    return data.value;
}
```

### ✅ Use Proper Types
```typescript
interface IData {
    value: number;
}

function process(data: IData): number { // ✅
    return data.value;
}
```

---

### ❌ Not Cleaning Up
```typescript
create() {
    this.scene.events.on('update', this.handler); // ❌ Never removed
}
```

### ✅ Always Cleanup
```typescript
create() {
    this.scene.events.on('update', this.handler, this);
}

shutdown() { // ✅
    this.scene.events.off('update', this.handler, this);
}
```

---

## Resources

- **Phaser 3 Docs:** https://photonstorm.github.io/phaser3-docs/
- **Phaser 3 Examples:** https://phaser.io/examples
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Phaser 3 TypeScript Template:** https://github.com/photonstorm/phaser3-typescript-project-template

---

**Remember:**
- Type everything
- No `any`
- Cleanup in shutdown()
- Use interfaces for sprites
- Pool objects
- Centralize animations
- Test as you go

Happy coding! 🎮
