/**
 * AirProjectile - Air element projectile handler
 * Creates a burst of air that knocks back enemies
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS, CombatHelpers } from '../../../data/constants/CombatConstants';

export class AirProjectile extends ProjectileBase {
    fire(config: IProjectileConfig): void {
        const { origin, elements } = config;
        const linkedCount = this.getLinkedCount(elements);

        // Calculate radius based on linked charges
        const radius = CombatHelpers.getAirBurstRadius(linkedCount);

        // Create visual effect
        const airBurst = this.scene.add.circle(origin.x, origin.y, radius, 0xaaaaff, 0.3);
        airBurst.setDepth(5);

        this.scene.tweens.add({
            targets: airBurst,
            scale: { from: 0, to: 1 },
            alpha: { from: 0.5, to: 0 },
            duration: 500,
            onComplete: () => airBurst.destroy()
        });

        // Apply knockback to nearby enemies
        const enemies = (this.scene as any).enemyManager?.getAllEnemies() || [];
        const radiusSquared = radius * radius;

        enemies.forEach((enemy: any) => {
            if (!enemy.active) return;

            const dx = enemy.x - origin.x;
            const dy = enemy.y - origin.y;
            const distSquared = dx * dx + dy * dy;

            if (distSquared < radiusSquared) {
                const dist = Math.sqrt(distSquared);
                const force = CombatHelpers.getAirKnockbackForce(dist, radius, linkedCount);

                enemy.setVelocity(
                    (dx / dist) * force,
                    (dy / dist) * force
                );

                // Small damage
                this.scene.events.emit('enemyDamaged', {
                    enemy: enemy,
                    damage: COMBAT_CONSTANTS.AIR_DAMAGE_PER_GROUP * linkedCount,
                    element: 'air'
                });
            }
        });
    }
}
