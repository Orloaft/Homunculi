/**
 * Central export point for all game constants
 * Import from here instead of individual files
 */

export * from './CombatConstants';
export * from './SpawnConstants';
export * from './UIConstants';

// Re-export GameConstants (now TypeScript!)
export { GAME_CONFIG, PLAYER_CONFIG, COMBAT_CONFIG, LEVEL_CONFIG, UI_CONFIG, ENEMY_SPAWN_CONFIG } from '../GameConstants';
