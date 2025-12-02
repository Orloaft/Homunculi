/**
 * WaterProjectile - Water element projectile handler
 * Creates water projectiles that slow enemies and create healing orbs
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig, IProjectile } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS, CombatHelpers } from '../../../data/constants/CombatConstants';

export class WaterProjectile extends ProjectileBase {
    fire(config: IProjectileConfig): void {
        const { origin, target, elements } = config;
        const angle = this.calculateAngle(origin, target);
        const linkedCount = this.getLinkedCount(elements);

        // Create water projectile
        const water = this.createSprite(origin.x, origin.y, 'water-spell') as IProjectile;
        water.play('water-spell-anim');

        // Set velocity
        this.setVelocityAtAngle(water, angle, COMBAT_CONSTANTS.PROJECTILE_SPEED);

        // Set properties
        water.element = 'water';
        water.damage = 1;
        water.slowAmount = COMBAT_CONSTANTS.WATER_SLOW_AMOUNT;
        water.slowDuration = COMBAT_CONSTANTS.SLOW_DURATION;

        // Scale for linked charges
        if (linkedCount > 1) {
            const scale = CombatHelpers.getWaterScale(linkedCount);
            water.setScale(scale);
            water.damage = linkedCount;
        }

        // Water creates healing orbs on hit
        water.createWaterOrb = true;
    }
}
