/**
 * ArcaneProjectile - Arcane element projectile handler
 * Creates arcane bolts that explode on impact when linked
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig, IProjectile } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS } from '../../../data/constants/CombatConstants';

export class ArcaneProjectile extends ProjectileBase {
    fire(config: IProjectileConfig): void {
        const { origin, target, elements } = config;
        const angle = this.calculateAngle(origin, target);
        const linkedCount = this.getLinkedCount(elements);

        // Create arcane projectile
        const projectile = this.createSprite(origin.x, origin.y, 'arcane-spell', 0.5) as IProjectile;
        projectile.play('arcane-spell-anim');

        // Fast projectile
        this.setVelocityAtAngle(projectile, angle, COMBAT_CONSTANTS.PROJECTILE_SPEED_ARCANE);

        // Set properties
        projectile.element = 'arcane';
        projectile.damage = 1;

        // Linked charges make it explosive
        if (linkedCount >= 2) {
            projectile.isExplosive = true;
            projectile.setScale(0.8);
            projectile.damage = 2;
        }
    }
}
