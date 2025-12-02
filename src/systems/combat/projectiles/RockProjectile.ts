/**
 * RockProjectile - Rock element projectile handler
 * Creates slow, heavy projectiles that stun enemies
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig, IProjectile } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS, CombatHelpers } from '../../../data/constants/CombatConstants';

export class RockProjectile extends ProjectileBase {
    fire(config: IProjectileConfig): void {
        const { origin, target, elements } = config;
        const angle = this.calculateAngle(origin, target);
        const linkedCount = this.getLinkedCount(elements);

        // Create rock projectile (using earth sprite with tint)
        const scale = CombatHelpers.getRockScale(linkedCount);
        const rock = this.createSprite(origin.x, origin.y, 'earth-spell', scale) as IProjectile;
        rock.setTint(0x8B7355); // Rocky brown color

        // Slower projectile (heavy)
        this.setVelocityAtAngle(rock, angle, COMBAT_CONSTANTS.PROJECTILE_SPEED_SLOW);

        // Set properties
        rock.element = 'rock';
        rock.damage = CombatHelpers.getRockDamage(linkedCount);
        rock.stunDuration = CombatHelpers.getStunDuration(linkedCount);
    }
}
