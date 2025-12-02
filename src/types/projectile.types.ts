/**
 * Projectile system type definitions
 */

export type ElementType =
    | 'fire'
    | 'water'
    | 'earth'
    | 'air'
    | 'arcane'
    | 'lightning'
    | 'ice'
    | 'poison'
    | 'rock';

export interface IProjectileOrigin {
    x: number;
    y: number;
    active?: boolean;
}

export interface IProjectileTarget {
    x: number;
    y: number;
}

export interface IProjectileConfig {
    origin: IProjectileOrigin;
    target: IProjectileTarget;
    elements: ElementType[];
}

export interface IProjectile extends Phaser.Physics.Arcade.Sprite {
    element: ElementType;
    damage: number;
    linkedCount?: number;

    // Special properties
    isExplosive?: boolean;
    isStationary?: boolean;
    isPiercing?: boolean;
    followTarget?: IProjectileOrigin;
    offsetY?: number;

    // Fire
    burnDamage?: number;
    burnDuration?: number;
    createFirePool?: boolean;

    // Water
    slowAmount?: number;
    slowDuration?: number;
    createWaterOrb?: boolean;

    // Ice
    freezeDuration?: number;

    // Rock
    stunDuration?: number;

    // Poison
    isPoisonField?: boolean;
    poisonDamage?: number;

    // Lightning
    chainCount?: number;

    // Tracking hit enemies (used by both poison and lightning)
    hitEnemies?: any[];

    // Earth
    pushForce?: number;
    duration?: number;
    size?: number;
}

export interface IProjectileHandler {
    /**
     * Create and fire a projectile
     */
    fire(config: IProjectileConfig): void;

    /**
     * Handle cleanup if needed
     */
    shutdown?(): void;
}

export interface ISpecialEffect {
    x: number;
    y: number;
    radius?: number;
    duration?: number;
}
