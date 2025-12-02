/**
 * FireProjectile - Fire element projectile handler
 * Creates a flame that follows the caster and burns enemies
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig, IProjectile } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS } from '../../../data/constants/CombatConstants';

export class FireProjectile extends ProjectileBase {
    private activeFlames: Map<number, IProjectile> = new Map();

    fire(config: IProjectileConfig): void {
        const { origin, elements } = config;

        // Check if flame already exists for this caster
        // Using 0 as key for single player, could use player ID for multiplayer
        if (this.activeFlames.has(0) && this.activeFlames.get(0)?.active) {
            return;
        }

        // Create flame attached to caster
        const flame = this.createSprite(
            origin.x,
            origin.y - COMBAT_CONSTANTS.FIRE_FLAME_OFFSET_Y,
            'fire-spell'
        ) as IProjectile;

        flame.play('fire-spell-anim');

        // Scale based on linked charges (double fire = 2x scale)
        const isDoubleScale = this.isDoubleLinked(elements);
        if (isDoubleScale) {
            flame.setScale(COMBAT_CONSTANTS.LINKED_FIRE_SCALE);
        }

        // Set properties
        flame.element = 'fire';
        flame.damage = COMBAT_CONSTANTS.FIRE_DAMAGE_OVER_TIME / 2; // 0.5 initial damage
        flame.burnDamage = COMBAT_CONSTANTS.FIRE_DAMAGE_OVER_TIME;
        flame.burnDuration = COMBAT_CONSTANTS.FIRE_BURN_DURATION;
        flame.linkedCount = this.getLinkedCount(elements);
        flame.isStationary = true;
        flame.followTarget = origin; // Follow the caster
        flame.offsetY = COMBAT_CONSTANTS.FIRE_FLAME_OFFSET_Y;

        // Set collision size
        const collisionSize = isDoubleScale
            ? COMBAT_CONSTANTS.FIRE_FLAME_COLLISION_DOUBLE
            : COMBAT_CONSTANTS.FIRE_FLAME_COLLISION_NORMAL;
        flame.body!.setSize(collisionSize, collisionSize);

        // Store reference
        this.activeFlames.set(0, flame);

        // Auto-destroy after duration
        this.scene.time.delayedCall(COMBAT_CONSTANTS.FIRE_FLAME_DURATION, () => {
            if (flame && flame.active) {
                flame.destroy();
                this.activeFlames.delete(0);
            }
        });
    }

    /**
     * Update flame positions to follow casters
     */
    update(): void {
        this.activeFlames.forEach(flame => {
            if (flame.followTarget && flame.followTarget.active) {
                flame.x = flame.followTarget.x;
                flame.y = flame.followTarget.y + (flame.offsetY || 0);
            }
        });
    }

    shutdown(): void {
        this.activeFlames.forEach(flame => {
            if (flame.active) flame.destroy();
        });
        this.activeFlames.clear();
    }
}
