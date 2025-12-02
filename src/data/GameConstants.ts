/**
 * Game-wide constants and configuration
 * Core game settings used throughout the codebase
 */

export const GAME_CONFIG = {
    width: 800,
    height: 600,
    worldWidth: 4000,
    worldHeight: 2160,
    tileSize: 16
} as const;

export const PLAYER_CONFIG = {
    startingHealth: 3,
    maxHealth: 5,
    moveSpeed: 160,
    startingCharges: 4,
    maxCharges: 7
} as const;

export const COMBAT_CONFIG = {
    baseDamage: 2,
    explosiveDamage: 4,
    knockbackForce: 300,
    explosiveKnockback: 500,
    projectileSpeed: 300,
    autoShootInterval: 2000,
    fireDamageOverTime: 1,
    fireBurnDuration: 1000
} as const;

export const LEVEL_CONFIG = {
    baseXPRequired: 100,
    xpMultiplier: 1.5,
    darkEyeFrequency: 3 // Spawn dark eye every 3 levels
} as const;

export const UI_CONFIG = {
    chargeUIStartX: 50,
    chargeUIStartY: 550,
    chargeIconSize: 30,
    chargeSpacing: 40,
    pauseMenuWidth: 600,
    pauseMenuHeight: 500
} as const;

export const ENEMY_SPAWN_CONFIG = {
    spawnDistance: 400,
    maxSpawnDistance: 600,
    spawnDelayMin: 500,
    spawnDelayMax: 2000
} as const;

// Type exports for use elsewhere
export type GameConfig = typeof GAME_CONFIG;
export type PlayerConfig = typeof PLAYER_CONFIG;
export type CombatConfig = typeof COMBAT_CONFIG;
export type LevelConfig = typeof LEVEL_CONFIG;
export type UIConfig = typeof UI_CONFIG;
export type EnemySpawnConfig = typeof ENEMY_SPAWN_CONFIG;
