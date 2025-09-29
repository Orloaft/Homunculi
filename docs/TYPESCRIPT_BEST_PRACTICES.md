# TypeScript Best Practices for Game Development

## 🎮 Why TypeScript for Game Development?

1. **Type Safety**: Catch errors at compile-time instead of runtime
2. **Better IDE Support**: IntelliSense, auto-completion, and refactoring tools
3. **Self-Documenting Code**: Types serve as inline documentation
4. **Refactoring Confidence**: Type system ensures changes don't break existing code
5. **Team Collaboration**: Clearer interfaces and contracts between modules

## 📚 Core Principles for Game TypeScript

### 1. Strong Typing Over Any

```typescript
// ❌ Bad
let player: any = { health: 100 };

// ✅ Good
interface Player {
  health: number;
  maxHealth: number;
  position: Vector2;
  velocity: Vector2;
}

let player: Player = {
  health: 100,
  maxHealth: 100,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 }
};
```

### 2. Use Enums for Game States

```typescript
// ✅ Good - Type-safe state management
enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over'
}

enum EnemyState {
  IDLE = 'idle',
  PURSUING = 'pursuing',
  ATTACKING = 'attacking',
  DYING = 'dying',
  DEAD = 'dead'
}
```

### 3. Leverage Union Types for Variants

```typescript
// ✅ Good - Exhaustive type checking
type Element = 
  | { type: 'fire'; damage: number; burnDuration: number }
  | { type: 'water'; damage: number; slowEffect: number }
  | { type: 'lightning'; damage: number; chainCount: number }
  | { type: 'earth'; damage: number; stunDuration: number };

function castSpell(element: Element) {
  switch (element.type) {
    case 'fire':
      // TypeScript knows element.burnDuration exists
      applyBurn(element.burnDuration);
      break;
    case 'water':
      applySlow(element.slowEffect);
      break;
    // TypeScript ensures all cases are handled
  }
}
```

### 4. Generic Types for Reusable Systems

```typescript
// ✅ Good - Reusable object pool
class ObjectPool<T extends IPoolable> {
  private pool: T[] = [];
  
  constructor(
    private factory: () => T,
    private reset: (item: T) => void,
    private maxSize: number = 100
  ) {}
  
  get(): T {
    return this.pool.pop() || this.factory();
  }
  
  release(item: T): void {
    if (this.pool.length < this.maxSize) {
      this.reset(item);
      this.pool.push(item);
    }
  }
}
```

### 5. Interface Segregation for Components

```typescript
// ✅ Good - Small, focused interfaces
interface IMovable {
  position: Vector2;
  velocity: Vector2;
  move(delta: number): void;
}

interface IDamageable {
  health: number;
  maxHealth: number;
  takeDamage(amount: number): void;
}

interface ICollidable {
  bounds: Rectangle;
  onCollision(other: ICollidable): void;
}

// Compose entities from interfaces
class Enemy implements IMovable, IDamageable, ICollidable {
  // Implementation...
}
```

## 🏗️ Architecture Patterns

### 1. Entity-Component-System (ECS) Pattern

```typescript
// Component base
abstract class Component {
  abstract readonly type: string;
}

// Specific components
class PositionComponent extends Component {
  readonly type = 'position';
  constructor(public x: number, public y: number) { super(); }
}

class HealthComponent extends Component {
  readonly type = 'health';
  constructor(public current: number, public max: number) { super(); }
}

// Entity
class Entity {
  private components = new Map<string, Component>();
  
  addComponent(component: Component): void {
    this.components.set(component.type, component);
  }
  
  getComponent<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T;
  }
}

// System
abstract class System {
  abstract update(entities: Entity[], deltaTime: number): void;
}

class MovementSystem extends System {
  update(entities: Entity[], deltaTime: number): void {
    entities.forEach(entity => {
      const position = entity.getComponent<PositionComponent>('position');
      const velocity = entity.getComponent<VelocityComponent>('velocity');
      
      if (position && velocity) {
        position.x += velocity.x * deltaTime;
        position.y += velocity.y * deltaTime;
      }
    });
  }
}
```

### 2. State Machine Pattern

```typescript
interface State<T> {
  enter(context: T): void;
  update(context: T, deltaTime: number): void;
  exit(context: T): void;
}

class StateMachine<T> {
  private currentState?: State<T>;
  
  constructor(private context: T) {}
  
  changeState(newState: State<T>): void {
    this.currentState?.exit(this.context);
    this.currentState = newState;
    this.currentState.enter(this.context);
  }
  
  update(deltaTime: number): void {
    this.currentState?.update(this.context, deltaTime);
  }
}

// Boss state example
class IdleState implements State<Boss> {
  enter(boss: Boss): void {
    boss.playAnimation('idle');
  }
  
  update(boss: Boss, deltaTime: number): void {
    if (boss.playerInRange()) {
      boss.stateMachine.changeState(new AttackState());
    }
  }
  
  exit(boss: Boss): void {
    boss.stopAnimation();
  }
}
```

### 3. Observer Pattern for Events

```typescript
type EventCallback<T = any> = (data: T) => void;

class EventEmitter {
  private events = new Map<string, Set<EventCallback>>();
  
  on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }
  
  off<T>(event: string, callback: EventCallback<T>): void {
    this.events.get(event)?.delete(callback);
  }
  
  emit<T>(event: string, data: T): void {
    this.events.get(event)?.forEach(callback => callback(data));
  }
}

// Type-safe events
interface GameEvents {
  'player:damage': { amount: number; source: Entity };
  'enemy:spawn': { enemy: Enemy; position: Vector2 };
  'level:complete': { score: number; time: number };
}

class TypedEventEmitter<T extends Record<string, any>> {
  private emitter = new EventEmitter();
  
  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    this.emitter.on(event as string, callback);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.emitter.emit(event as string, data);
  }
}
```

## 🎯 Phaser-Specific TypeScript Patterns

### 1. Typed Scenes

```typescript
interface SceneData {
  stage: string;
  playerCharacter: string;
  difficulty: number;
}

class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private score: number = 0;
  
  constructor() {
    super({ key: 'GameScene' });
  }
  
  init(data: SceneData): void {
    // TypeScript knows the structure of data
    console.log(`Starting stage: ${data.stage}`);
  }
  
  create(): void {
    this.player = new Player(this, 400, 300);
    this.enemies = this.add.group({
      classType: Enemy,
      runChildUpdate: true
    });
  }
  
  update(time: number, delta: number): void {
    // Type-safe update
  }
}
```

### 2. Custom Game Objects

```typescript
class Player extends Phaser.GameObjects.Sprite {
  private health: number = 100;
  private speed: number = 200;
  
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number
  ) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setupAnimations();
    this.setupInputs();
  }
  
  private setupAnimations(): void {
    // Animation setup
  }
  
  private setupInputs(): void {
    // Input handling
  }
  
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) {
      this.die();
    }
  }
  
  private die(): void {
    this.emit('player:died');
    this.destroy();
  }
}
```

### 3. Type Guards for Runtime Checks

```typescript
// Type guard functions
function isEnemy(obj: any): obj is Enemy {
  return obj && obj.type === 'enemy' && typeof obj.takeDamage === 'function';
}

function isBoss(obj: any): obj is Boss {
  return obj && obj.type === 'boss' && obj.phases !== undefined;
}

// Usage in collision detection
this.physics.add.collider(
  this.player.projectiles,
  this.enemies,
  (projectile, target) => {
    if (isEnemy(target)) {
      target.takeDamage(projectile.damage);
      
      if (isBoss(target)) {
        // Special boss logic
        target.checkPhaseTransition();
      }
    }
  }
);
```

## 🧪 Testing Patterns

### 1. Mockable Services

```typescript
interface IAudioService {
  playSound(key: string, volume?: number): void;
  playMusic(key: string, loop?: boolean): void;
  stopMusic(): void;
}

class AudioService implements IAudioService {
  constructor(private scene: Phaser.Scene) {}
  
  playSound(key: string, volume: number = 1): void {
    this.scene.sound.play(key, { volume });
  }
  
  playMusic(key: string, loop: boolean = true): void {
    this.scene.sound.play(key, { loop, volume: 0.5 });
  }
  
  stopMusic(): void {
    this.scene.sound.stopAll();
  }
}

// Mock for testing
class MockAudioService implements IAudioService {
  playSound(key: string, volume?: number): void {
    console.log(`Mock: Playing sound ${key}`);
  }
  
  playMusic(key: string, loop?: boolean): void {
    console.log(`Mock: Playing music ${key}`);
  }
  
  stopMusic(): void {
    console.log('Mock: Stopping music');
  }
}
```

### 2. Dependency Injection

```typescript
class ServiceContainer {
  private services = new Map<string, any>();
  
  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }
  
  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service as T;
  }
}

// Usage
const container = new ServiceContainer();
container.register('audio', new AudioService(scene));
container.register('input', new InputService(scene));

// In game objects
class Player {
  private audio: IAudioService;
  
  constructor(private container: ServiceContainer) {
    this.audio = container.get<IAudioService>('audio');
  }
  
  jump(): void {
    this.audio.playSound('jump');
    // Jump logic
  }
}
```

## 📁 Project Structure

```
src/
├── types/              # Type definitions
│   ├── game.d.ts       # Game-specific types
│   ├── phaser.d.ts     # Phaser extensions
│   └── assets.d.ts     # Asset types
├── core/               # Core game systems
│   ├── Engine.ts
│   ├── ServiceContainer.ts
│   └── EventBus.ts
├── entities/           # Game entities
│   ├── Player.ts
│   ├── Enemy.ts
│   └── Boss.ts
├── components/         # ECS components
│   ├── Health.ts
│   ├── Movement.ts
│   └── Combat.ts
├── systems/            # Game systems
│   ├── PhysicsSystem.ts
│   ├── CombatSystem.ts
│   └── SpellSystem.ts
├── scenes/             # Phaser scenes
│   ├── LoadingScene.ts
│   ├── GameScene.ts
│   └── MenuScene.ts
├── utils/              # Utility functions
│   ├── math.ts
│   ├── collision.ts
│   └── pool.ts
└── main.ts             # Entry point
```

## 🚀 Build Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/core/*"],
      "@entities/*": ["src/entities/*"],
      "@scenes/*": ["src/scenes/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🔍 Common Pitfalls to Avoid

1. **Don't use `any` as an escape hatch** - Use `unknown` and type guards instead
2. **Avoid mutation where possible** - Use immutable patterns for state
3. **Don't ignore compiler warnings** - They often indicate real issues
4. **Avoid circular dependencies** - Use dependency injection
5. **Don't over-engineer** - Start simple, refactor as needed

## 📈 Performance Considerations

1. **Use const enums for better performance**
```typescript
const enum Direction {
  UP, DOWN, LEFT, RIGHT
}
// Compiles to inline numbers, no runtime overhead
```

2. **Leverage type inference to reduce bundle size**
```typescript
// Let TypeScript infer when possible
const player = new Player(); // Type is inferred
```

3. **Use discriminated unions for polymorphism without classes**
```typescript
type Shape = 
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };
// More efficient than class hierarchies
```