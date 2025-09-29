/**
 * Core Game Type Definitions
 * Comprehensive types for the WizBiz game
 */

// ============================================
// Core Data Types
// ============================================

export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

// ============================================
// Game State Management
// ============================================

export enum GameState {
  LOADING = 'loading',
  MENU = 'menu',
  STAGE_SELECT = 'stage_select',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
  VICTORY = 'victory',
  CUTSCENE = 'cutscene'
}

export enum Stage {
  FOREST = 'forestland',
  CAVE = 'caveland',
  DESERT = 'desertland',
  LAVA = 'lavaland',
  GRAVE = 'graveland',
  CASTLE = 'castleland',
  SPIRE = 'spireland',
  SNOW = 'snowland',
  SWAMP = 'swampland',
  OCEAN = 'oceanland',
  VOID = 'voidland',
  ARCADE = 'arcadeland',
  NEXUS = 'nexus'
}

// ============================================
// Player Types
// ============================================

export enum CharacterType {
  WIZARD = 'wizard',
  ORB = 'orb',
  BLIP = 'blip',
  GRIM = 'grim'
}

export interface CharacterConfig {
  type: CharacterType;
  name: string;
  health: number;
  maxHealth: number;
  speed: number;
  chargeSlots: number;
  abilities: string[];
  unlocked: boolean;
}

export interface PlayerStats {
  level: number;
  experience: number;
  score: number;
  survivalTime: number;
  enemiesKilled: number;
  bossesDefeated: number;
  elementsUnlocked: string[];
  talentsUnlocked: string[];
}

// ============================================
// Element System Types
// ============================================

export enum ElementType {
  // Primary Elements
  FIRE = 'fire',
  WATER = 'water',
  EARTH = 'earth',
  AIR = 'air',
  LIGHTNING = 'lightning',
  ARCANE = 'arcane',
  
  // Tier 2 Fusions
  STEAM = 'steam',
  LAVA = 'lava',
  MUD = 'mud',
  ICE = 'ice',
  STORM = 'storm',
  NATURE = 'nature',
  POISON = 'poison',
  
  // Tier 3 Fusions
  VOLCANO = 'volcano',
  METEOR = 'meteor',
  CRYSTAL = 'crystal',
  DEATH = 'death',
  TEMPEST = 'tempest',
  VORTEX = 'vortex',
  TORNADO = 'tornado',
  
  // Special Elements
  CHAOS = 'chaos',
  LASER = 'laser',
  VENOM = 'venom',
  PHILOSOPHER = 'philosopher',
  
  // Chess Pieces (Passive)
  PAWN = 'pawn',
  ROOK = 'rook',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  QUEEN = 'queen',
  KING = 'king',
  JOKER = 'joker',
  
  // Advanced Elements
  TIME = 'time',
  GRAVITY = 'gravity',
  STAR = 'star',
  MOON = 'moon',
  SUN = 'sun',
  ZODIAC = 'zodiac',
  HOLY = 'holy',
  VOID = 'void',
  METAL = 'metal',
  SAND = 'sand',
  SMOKE = 'smoke',
  WAVE = 'wave',
  LIFE = 'life'
}

export interface ElementConfig {
  type: ElementType;
  name: string;
  damage: number;
  fireRate: number;
  projectileSpeed: number;
  projectileSize: number;
  piercing: boolean;
  area: boolean;
  areaRadius?: number;
  chain?: number;
  effects?: ElementEffect[];
  tier: number;
  fusion?: [ElementType, ElementType];
  passive?: boolean;
  color: number;
  description: string;
}

export interface ElementEffect {
  type: 'burn' | 'freeze' | 'slow' | 'poison' | 'stun' | 'heal' | 'shield';
  duration: number;
  value: number;
  chance: number;
}

export interface SpellCast {
  element: ElementType;
  position: Vector2;
  direction: Vector2;
  damage: number;
  caster: Entity;
  timestamp: number;
}

// ============================================
// Enemy Types
// ============================================

export enum EnemyType {
  // Forest Enemies
  TREE = 'tree',
  MUSHROOM = 'mushroom',
  GIANT_FLY = 'giantfly',
  SQUIRREL = 'squirrel',
  RED_PANDA = 'redpanda',
  SPIDER = 'spider',
  HEDGEHOG = 'hedgehog',
  
  // Cave Enemies
  BRAIN_MOLE = 'brainmole',
  INTELLECT_DEVOURER = 'intellectdevourer',
  CAVE_GHOUL = 'caveghoul',
  
  // Desert Enemies
  ARMADILLO = 'armadillo',
  COBRA = 'cobra',
  CACTUS = 'cactus',
  
  // Common Enemies
  SLIME = 'slime',
  SKELETON = 'skeleton',
  IMP = 'imp',
  KOBOLD = 'kobold',
  BAT = 'bat',
  
  // Castle Enemies
  KNIGHT = 'knight',
  ROGUE = 'rogue',
  SOLDIER = 'soldier',
  SQUIRE = 'squire'
}

export interface EnemyConfig {
  type: EnemyType;
  name: string;
  health: number;
  damage: number;
  speed: number;
  experience: number;
  score: number;
  attackRange: number;
  attackSpeed: number;
  ai: EnemyAI;
  drops: LootTable;
}

export enum EnemyAI {
  MELEE = 'melee',
  RANGED = 'ranged',
  FLYING = 'flying',
  STATIONARY = 'stationary',
  CHARGER = 'charger',
  SUMMONER = 'summoner'
}

export interface LootTable {
  experience: number;
  orbs?: {
    element: ElementType;
    chance: number;
  }[];
  items?: {
    type: string;
    chance: number;
  }[];
}

// ============================================
// Boss Types
// ============================================

export enum BossType {
  OBELISK = 'obelisk',
  ARCHER = 'archer',
  DEMON_SLIME = 'demon_slime',
  FLYING_DEMON = 'flying_demon',
  NEKROS = 'nekros',
  EYELOR = 'eyelor',
  KING_NOTHING = 'king_nothing',
  SCYTHE_WRAITH = 'scythe_wraith'
}

export interface BossConfig extends EnemyConfig {
  bossType: BossType;
  phases: BossPhase[];
  intro?: string;
  defeat?: string;
  music?: string;
}

export interface BossPhase {
  healthThreshold: number;
  attacks: BossAttack[];
  speed: number;
  defense: number;
  enrage?: boolean;
}

export interface BossAttack {
  name: string;
  damage: number;
  pattern: AttackPattern;
  cooldown: number;
  telegraph: number;
  duration: number;
}

export enum AttackPattern {
  SINGLE_TARGET = 'single_target',
  AOE_CIRCLE = 'aoe_circle',
  CONE = 'cone',
  LINE = 'line',
  BARRAGE = 'barrage',
  SPIRAL = 'spiral',
  CROSS = 'cross',
  RANDOM = 'random',
  HOMING = 'homing'
}

// ============================================
// Entity System
// ============================================

export interface Entity {
  id: string;
  type: 'player' | 'enemy' | 'boss' | 'projectile' | 'pickup' | 'obstacle';
  position: Vector2;
  velocity: Vector2;
  health?: number;
  maxHealth?: number;
  sprite?: Phaser.GameObjects.Sprite;
  body?: Phaser.Physics.Arcade.Body;
  active: boolean;
  components: Map<string, Component>;
}

export interface Component {
  type: string;
  update?(delta: number): void;
}

// ============================================
// Wave System
// ============================================

export interface WaveDefinition {
  waveNumber: number;
  enemies: WaveEnemy[];
  duration: number;
  spawnRate: number;
  boss?: BossType;
  rewards?: WaveReward[];
}

export interface WaveEnemy {
  type: EnemyType;
  count: number;
  delay: number;
  position?: 'random' | 'circle' | 'line' | 'corners';
}

export interface WaveReward {
  type: 'element' | 'talent' | 'health' | 'charge_slot';
  value: string | number;
}

// ============================================
// Talent System
// ============================================

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: Vector2;
  requirements: string[];
  effects: TalentEffect[];
  cost: number;
  maxLevel: number;
}

export interface TalentEffect {
  stat: string;
  modifier: 'add' | 'multiply' | 'set';
  value: number;
}

// ============================================
// UI Types
// ============================================

export interface UIConfig {
  healthBar: {
    position: Vector2;
    size: Vector2;
    colors: {
      background: number;
      health: number;
      damage: number;
    };
  };
  experienceBar: {
    position: Vector2;
    size: Vector2;
    color: number;
  };
  chargeSlots: {
    position: Vector2;
    spacing: number;
    size: number;
  };
  score: {
    position: Vector2;
    style: Phaser.Types.GameObjects.Text.TextStyle;
  };
}

// ============================================
// Scene Data Types
// ============================================

export interface SceneTransitionData {
  from: string;
  to: string;
  data?: any;
  transition?: 'fade' | 'slide' | 'zoom';
  duration?: number;
}

export interface GameSceneData {
  stage: Stage;
  playerNumber: 1 | 2;
  p1Character: CharacterType;
  p2Character?: CharacterType;
  difficulty?: 'easy' | 'normal' | 'hard' | 'nightmare';
  modifiers?: string[];
}

// ============================================
// Input Types
// ============================================

export interface InputState {
  keys: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    shift: boolean;
    tab: boolean;
    escape: boolean;
  };
  mouse: {
    position: Vector2;
    leftButton: boolean;
    rightButton: boolean;
  };
  gamepad?: {
    connected: boolean;
    leftStick: Vector2;
    rightStick: Vector2;
    buttons: boolean[];
  };
}

// ============================================
// Performance Types
// ============================================

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  updateTime: number;
  renderTime: number;
  entityCount: number;
  particleCount: number;
  memoryUsage: number;
}

// ============================================
// Save System Types
// ============================================

export interface SaveData {
  version: string;
  timestamp: number;
  playerStats: PlayerStats;
  unlockedCharacters: CharacterType[];
  unlockedElements: ElementType[];
  unlockedTalents: string[];
  completedStages: Stage[];
  highScores: Record<Stage, number>;
  settings: GameSettings;
}

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  fullscreen: boolean;
  vsync: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  shadows: boolean;
}

// ============================================
// Collision Types
// ============================================

export interface CollisionData {
  entity1: Entity;
  entity2: Entity;
  overlap: Rectangle;
  normal: Vector2;
  penetration: number;
}

export interface HitboxConfig {
  offset: Vector2;
  size: Vector2;
  shape: 'rectangle' | 'circle';
  trigger: boolean;
}

// ============================================
// Audio Types
// ============================================

export interface AudioConfig {
  key: string;
  volume: number;
  loop: boolean;
  delay?: number;
  rate?: number;
  detune?: number;
  pan?: number;
}

// ============================================
// Network Types (for future multiplayer)
// ============================================

export interface NetworkMessage {
  type: string;
  payload: any;
  timestamp: number;
  sender: string;
}

export interface PlayerNetworkState {
  id: string;
  position: Vector2;
  velocity: Vector2;
  health: number;
  action?: string;
  timestamp: number;
}