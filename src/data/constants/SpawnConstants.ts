/**
 * Spawn-related constants
 * All magic numbers related to enemy/pickup/chest spawning
 */

export const SPAWN_CONSTANTS = {
    // Enemy spawn distances
    ENEMY_SPAWN_DISTANCE_MIN: 400,
    ENEMY_SPAWN_DISTANCE_MAX: 600,
    ENEMY_SPAWN_DELAY_MIN: 500,
    ENEMY_SPAWN_DELAY_MAX: 2000,

    // Chest/pickup spawn offsets
    CHEST_SPAWN_OFFSET_MIN: -100,
    CHEST_SPAWN_OFFSET_MAX: 100,

    // Dark Eye (level up boss) spawn
    DARK_EYE_SPAWN_DISTANCE: 300,

    // Summoner minion spawn
    SUMMONER_MINION_COUNT: 3,
    SUMMONER_MINION_SPAWN_DISTANCE: 100,

    // Slime split
    SLIME_SPLIT_COUNT: 2,
    SLIME_SPLIT_DISTANCE: 30,
    SLIME_MINI_SCALE: 0.5,
    SLIME_MINI_HEALTH: 1,
    SLIME_MINI_XP: 2,

    // Decoration counts
    TREE_COUNT: 50,
    TREE_SPAWN_PADDING: 100,
    TREE_SCALE_MIN: 0.8,
    TREE_SCALE_MAX: 1.2,
    TREE_ALPHA: 0.8,

    // Barrier thickness
    WORLD_BARRIER_THICKNESS: 50,

    // Co-op player 2 offset
    P2_SPAWN_OFFSET_X: 100,
    P2_SPAWN_OFFSET_Y: 0,
} as const;

export type SpawnConstants = typeof SPAWN_CONSTANTS;
