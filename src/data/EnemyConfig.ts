/**
 * Enemy type definitions and stats
 * Defines all enemy types, their base stats, and scaling functions
 */

import type { ElementKey } from './ElementConfig';

export type EnemyType =
    | 'tree' | 'slime' | 'golem' | 'bat' | 'mushroom'
    | 'fireworm' | 'summoner' | 'soul' | 'bloboid' | 'darkeye';

export type EnemySpecial =
    | 'splits' | 'hurt_animation' | 'flying' | 'summons_minions'
    | 'ranged_attack' | 'level_up_boss';

export type GolemVariant = 'orange' | 'blue';

export interface IEnemyData {
    readonly name: string;
    readonly health: number;
    readonly speed: number;
    readonly xpValue: number;
    readonly damage: number;
    readonly sprite?: string;
    readonly animation?: string;
    readonly scale: number;
    readonly special?: EnemySpecial;
    readonly element?: ElementKey;
    readonly variants?: readonly GolemVariant[];
    readonly flipX?: boolean;
    readonly noStagger?: boolean;

    // Summoner properties
    readonly summonCooldown?: number;

    // Ranged attack properties
    readonly attackRange?: number;
    readonly attackCooldown?: number;
}

export const ENEMY_TYPES: Readonly<Record<EnemyType, IEnemyData>> = {
    tree: {
        name: 'Tree',
        health: 2,
        speed: 50,
        xpValue: 10,
        damage: 1,
        sprite: 'enemy-walk',
        animation: 'enemy-walk-anim',
        scale: 1.0
    },
    slime: {
        name: 'Slime',
        health: 1,
        speed: 30,
        xpValue: 5,
        damage: 1,
        sprite: 'slime-idle-0',
        animation: 'slime-idle',
        scale: 1.0,
        special: 'splits'
    },
    golem: {
        name: 'Golem',
        health: 8,
        speed: 30,
        xpValue: 20,
        damage: 2,
        scale: 1.0,
        variants: ['orange', 'blue'],
        special: 'hurt_animation'
    },
    bat: {
        name: 'Bat',
        health: 1,
        speed: 100,
        xpValue: 8,
        damage: 1,
        sprite: 'bat-fly-1',
        animation: 'bat-flying',
        scale: 0.8,
        special: 'flying'
    },
    mushroom: {
        name: 'Mushroom',
        health: 2,
        speed: 80,
        xpValue: 12,
        damage: 1,
        sprite: 'mushroom-walk-1',
        animation: 'mushroom-walking',
        scale: 1.0
    },
    fireworm: {
        name: 'Fire Worm',
        health: 3,
        speed: 60,
        xpValue: 15,
        damage: 1,
        sprite: 'fireworm-walk-1',
        animation: 'fireworm-walking',
        scale: 1.0,
        element: 'fire'
    },
    summoner: {
        name: 'Summoner',
        health: 5,
        speed: 20,
        xpValue: 25,
        damage: 1,
        sprite: 'summoner-idle',
        animation: 'summoner-idle-anim',
        scale: 1.0,
        special: 'summons_minions',
        summonCooldown: 5000
    },
    soul: {
        name: 'Lost Soul',
        health: 2,
        speed: 40,
        xpValue: 12,
        damage: 1,
        sprite: 'soul-idle-1',
        animation: 'soul-idle',
        scale: 1.0,
        special: 'ranged_attack',
        attackRange: 250,
        attackCooldown: 2000
    },
    bloboid: {
        name: 'Bloboid',
        health: 4,
        speed: 45,
        xpValue: 18,
        damage: 1,
        sprite: 'bloboid-walk-1',
        animation: 'bloboid-walking',
        scale: 1.0,
        flipX: true
    },
    darkeye: {
        name: 'Dark Eye',
        health: 150, // Base health, multiplied by 10 in game
        speed: 25,
        xpValue: 100,
        damage: 3,
        sprite: 'darkeye-walk-1',
        animation: 'darkeye-walking',
        scale: 1.0,
        flipX: true,
        element: 'dark',
        special: 'level_up_boss',
        noStagger: true
    }
} as const;

export type DifficultyTier = 'early' | 'medium' | 'hard' | 'nightmare';

export interface ISpawnWeights {
    readonly [key: string]: number;
}

export const SPAWN_WEIGHTS: Readonly<Record<DifficultyTier, ISpawnWeights>> = {
    early: {
        tree: 70,
        slime: 30
    },
    medium: {
        tree: 30,
        slime: 20,
        bat: 20,
        mushroom: 15,
        golem: 15
    },
    hard: {
        tree: 10,
        slime: 10,
        bat: 15,
        mushroom: 15,
        golem: 20,
        fireworm: 10,
        summoner: 10,
        soul: 5,
        bloboid: 5
    },
    nightmare: {
        golem: 25,
        fireworm: 20,
        summoner: 20,
        soul: 15,
        bloboid: 15,
        bat: 5
    }
} as const;

/**
 * Get enemy stats with level scaling
 */
export function getEnemyStats(type: EnemyType, playerLevel: number = 1): IEnemyData {
    const baseStats = { ...ENEMY_TYPES[type] };

    // Scale health and damage based on player level
    const healthMultiplier = 1 + (playerLevel - 1) * 0.1;
    const damageMultiplier = 1 + (playerLevel - 1) * 0.05;

    baseStats.health = Math.floor(baseStats.health * healthMultiplier);
    baseStats.damage = Math.floor(baseStats.damage * damageMultiplier);

    // Special scaling for dark eye
    if (type === 'darkeye') {
        baseStats.health = Math.floor((15 + playerLevel * 3) * 10);
        baseStats.scale = 1.0 + playerLevel * 0.05;
    }

    return baseStats;
}

/**
 * Helper to get spawn weights for a difficulty tier
 */
export function getSpawnWeights(difficulty: DifficultyTier): ISpawnWeights {
    return SPAWN_WEIGHTS[difficulty];
}

/**
 * Helper to check if enemy has a special ability
 */
export function hasSpecialAbility(type: EnemyType, ability: EnemySpecial): boolean {
    return ENEMY_TYPES[type].special === ability;
}
