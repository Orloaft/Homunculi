/**
 * Combat-related constants extracted from throughout the codebase
 * All magic numbers related to combat, damage, projectiles, and effects
 */

export const COMBAT_CONSTANTS = {
    // Base damage values
    BASE_DAMAGE: 2,
    EXPLOSIVE_DAMAGE: 4,
    FIRE_DAMAGE_OVER_TIME: 1,

    // Knockback forces
    KNOCKBACK_FORCE: 300,
    EXPLOSIVE_KNOCKBACK: 500,
    EARTH_PUSH_FORCE: 200,
    AIR_KNOCKBACK_BASE: 500,

    // Projectile speeds
    PROJECTILE_SPEED: 300,
    PROJECTILE_SPEED_FAST: 600, // Lightning (2x)
    PROJECTILE_SPEED_SLOW: 210, // Rock (0.7x)
    PROJECTILE_SPEED_ARCANE: 360, // Arcane (1.2x)
    PROJECTILE_SPEED_ICE: 270, // Ice (0.9x)

    // Durations (ms)
    AUTO_SHOOT_INTERVAL: 2000,
    FIRE_BURN_DURATION: 1000,
    SLOW_DURATION: 2000,
    STUN_DURATION_BASE: 500,
    STUN_DURATION_PER_LINK: 500,
    FREEZE_DURATION_BASE: 1000,
    FREEZE_DURATION_PER_LINK: 500,
    POISON_FIELD_DURATION: 10000,
    FIRE_POOL_DURATION: 3000,
    EARTH_ZONE_BASE_DURATION: 5000,
    EARTH_ZONE_DURATION_PER_LINK: 2000,
    FIRE_FLAME_DURATION: 3000,

    // Effect application rates
    FIRE_POOL_DAMAGE_INTERVAL: 500,
    POISON_TICK_INTERVAL: 2000,

    // Slow amounts (multipliers)
    WATER_SLOW_AMOUNT: 0.5,

    // Scale values
    LINKED_FIRE_SCALE: 2,
    WATER_SCALE_BASE: 1,
    WATER_SCALE_PER_LINK: 0.3,
    ROCK_SCALE_BASE: 0.8,
    ROCK_SCALE_PER_LINK: 0.2,

    // Size/radius values
    FIRE_POOL_RADIUS_BASE: 40,
    FIRE_POOL_RADIUS_PER_LINK: 20,
    EARTH_ZONE_SIZE_BASE: 100,
    EARTH_ZONE_SIZE_PER_LINK: 30,
    AIR_BURST_RADIUS_BASE: 150,
    AIR_BURST_RADIUS_PER_LINK: 50,
    EXPLOSION_RADIUS_BASE: 100,
    LIGHTNING_CHAIN_RANGE: 200,

    // Collision sizes
    FIRE_FLAME_COLLISION_NORMAL: 20,
    FIRE_FLAME_COLLISION_DOUBLE: 40,

    // Offsets
    FIRE_FLAME_OFFSET_Y: -20,

    // Damage multipliers
    ROCK_DAMAGE_MULTIPLIER: 1.5,
    AIR_DAMAGE_PER_GROUP: 0.5,
    EARTH_ZONE_DAMAGE: 0.5,

    // Spread angles
    ICE_SPREAD_ANGLE: 0.2,

    // Limits
    ICE_MAX_EXTRA_SHOTS: 3,
} as const;

export type CombatConstants = typeof COMBAT_CONSTANTS;

// Helper functions for calculated values
export const CombatHelpers = {
    /**
     * Calculate stun duration based on linked charges
     */
    getStunDuration(linkedCount: number): number {
        return COMBAT_CONSTANTS.STUN_DURATION_BASE +
               (linkedCount - 1) * COMBAT_CONSTANTS.STUN_DURATION_PER_LINK;
    },

    /**
     * Calculate freeze duration based on linked charges
     */
    getFreezeDuration(linkedCount: number): number {
        return COMBAT_CONSTANTS.FREEZE_DURATION_BASE +
               (linkedCount - 1) * COMBAT_CONSTANTS.FREEZE_DURATION_PER_LINK;
    },

    /**
     * Calculate earth zone duration based on linked charges
     */
    getEarthZoneDuration(linkedCount: number): number {
        return COMBAT_CONSTANTS.EARTH_ZONE_BASE_DURATION +
               (linkedCount - 1) * COMBAT_CONSTANTS.EARTH_ZONE_DURATION_PER_LINK;
    },

    /**
     * Calculate fire pool radius based on linked charges
     */
    getFirePoolRadius(linkedCount: number): number {
        return COMBAT_CONSTANTS.FIRE_POOL_RADIUS_BASE +
               (linkedCount - 1) * COMBAT_CONSTANTS.FIRE_POOL_RADIUS_PER_LINK;
    },

    /**
     * Calculate earth zone size based on linked charges
     */
    getEarthZoneSize(linkedCount: number): number {
        return COMBAT_CONSTANTS.EARTH_ZONE_SIZE_BASE +
               (linkedCount - 1) * COMBAT_CONSTANTS.EARTH_ZONE_SIZE_PER_LINK;
    },

    /**
     * Calculate air burst radius based on linked charges
     */
    getAirBurstRadius(linkedCount: number): number {
        return COMBAT_CONSTANTS.AIR_BURST_RADIUS_BASE +
               (linkedCount - 1) * COMBAT_CONSTANTS.AIR_BURST_RADIUS_PER_LINK;
    },

    /**
     * Calculate water projectile scale based on linked charges
     */
    getWaterScale(linkedCount: number): number {
        return COMBAT_CONSTANTS.WATER_SCALE_BASE +
               (linkedCount - 1) * COMBAT_CONSTANTS.WATER_SCALE_PER_LINK;
    },

    /**
     * Calculate rock projectile scale based on linked charges
     */
    getRockScale(linkedCount: number): number {
        return COMBAT_CONSTANTS.ROCK_SCALE_BASE +
               linkedCount * COMBAT_CONSTANTS.ROCK_SCALE_PER_LINK;
    },

    /**
     * Calculate rock damage based on linked charges
     */
    getRockDamage(linkedCount: number): number {
        return COMBAT_CONSTANTS.ROCK_DAMAGE_MULTIPLIER * linkedCount;
    },

    /**
     * Calculate air knockback force based on distance and groups
     */
    getAirKnockbackForce(distance: number, radius: number, groupCount: number): number {
        return (1 - distance / radius) * COMBAT_CONSTANTS.AIR_KNOCKBACK_BASE * groupCount;
    },
};
