/**
 * IceProjectile - Ice element projectile handler
 * Creates ice shards that freeze enemies, with multi-shot for linked charges
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig, IProjectile } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS, CombatHelpers } from '../../../data/constants/CombatConstants';

export class IceProjectile extends ProjectileBase {
    fire(config: IProjectileConfig): void {
        const { origin, target, elements } = config;
        const angle = this.calculateAngle(origin, target);
        const linkedCount = this.getLinkedCount(elements);

        // Create main ice shard
        const ice = this.createSprite(origin.x, origin.y, 'water-spell', 0.8) as IProjectile;
        ice.setTint(0xaaffff); // Icy blue tint
        ice.play('water-spell-anim');

        // Set velocity
        this.setVelocityAtAngle(ice, angle, COMBAT_CONSTANTS.PROJECTILE_SPEED_ICE);

        // Set properties
        ice.element = 'ice';
        ice.damage = 1;
        ice.freezeDuration = CombatHelpers.getFreezeDuration(linkedCount);

        // Multi-shot for linked charges
        if (linkedCount > 1) {
            const extraShots = Math.min(linkedCount - 1, COMBAT_CONSTANTS.ICE_MAX_EXTRA_SHOTS);
            const spreadAngle = COMBAT_CONSTANTS.ICE_SPREAD_ANGLE;

            for (let i = 1; i <= extraShots; i++) {
                const extraIce = this.createSprite(origin.x, origin.y, 'water-spell', 0.6) as IProjectile;
                extraIce.setTint(0xaaffff);
                extraIce.play('water-spell-anim');

                // Spread shots in alternating directions
                const newAngle = angle + (i % 2 === 0 ? spreadAngle : -spreadAngle) * Math.ceil(i / 2);
                this.setVelocityAtAngle(extraIce, newAngle, COMBAT_CONSTANTS.PROJECTILE_SPEED_ICE);

                extraIce.element = 'ice';
                extraIce.damage = 0.5;
                extraIce.freezeDuration = ice.freezeDuration;
            }
        }
    }
}
