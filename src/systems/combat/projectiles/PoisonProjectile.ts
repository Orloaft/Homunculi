/**
 * PoisonProjectile - Poison element projectile handler
 * Creates a stationary poison field at target location
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig, IProjectile } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS } from '../../../data/constants/CombatConstants';

export class PoisonProjectile extends ProjectileBase {
    fire(config: IProjectileConfig): void {
        const { target, elements } = config;

        // Create poison field at target location (not at origin!)
        const poison = this.createSprite(target.x, target.y, 'poison-spell') as IProjectile;

        // Stay on first frame (don't animate)
        poison.setFrame(0);

        // Stationary (no velocity)
        poison.setVelocity(0, 0);

        // Set properties
        poison.element = 'poison';
        poison.isPoisonField = true;
        poison.isStationary = true; // Won't be destroyed on hit
        poison.damage = 0; // No initial damage, only poison effect
        poison.poisonDamage = 1; // Damage per tick
        poison.linkedCount = this.getLinkedCount(elements);
        poison.hitEnemies = []; // Track enemies already poisoned

        // Remove after duration
        this.scene.time.delayedCall(COMBAT_CONSTANTS.POISON_FIELD_DURATION, () => {
            poison.destroy();
        });
    }
}
