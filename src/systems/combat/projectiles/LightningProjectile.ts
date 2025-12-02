/**
 * LightningProjectile - Lightning element projectile handler
 * Creates fast lightning bolts that chain between enemies
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig, IProjectile } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS } from '../../../data/constants/CombatConstants';

export class LightningProjectile extends ProjectileBase {
    fire(config: IProjectileConfig): void {
        const { origin, target, elements } = config;
        const angle = this.calculateAngle(origin, target);
        const linkedCount = this.getLinkedCount(elements);

        // Create lightning bolt
        const lightning = this.createRectangle(origin.x, origin.y, 30, 5, 0xffff44) as IProjectile;
        lightning.rotation = angle;

        // Very fast projectile
        this.setVelocityAtAngle(lightning, angle, COMBAT_CONSTANTS.PROJECTILE_SPEED_FAST);

        // Set properties
        lightning.element = 'lightning';
        lightning.damage = 1;
        lightning.chainCount = linkedCount; // Can chain to this many targets
        lightning.hitEnemies = []; // Track hit enemies

        // Visual pulsing effect
        this.scene.tweens.add({
            targets: lightning,
            alpha: { from: 1, to: 0.5 },
            yoyo: true,
            duration: 50,
            repeat: -1
        });
    }

    /**
     * Handle lightning chain effect (called from ProjectileManager)
     */
    handleChain(projectile: IProjectile, hitEnemy: any): void {
        if (!projectile.chainCount || !projectile.hitEnemies) return;

        projectile.hitEnemies.push(hitEnemy);

        // Find next target
        const enemies = (this.scene as any).enemyManager?.getAllEnemies() || [];
        let nearestEnemy: any = null;
        let minDistance: number = COMBAT_CONSTANTS.LIGHTNING_CHAIN_RANGE;

        enemies.forEach((enemy: any) => {
            if (enemy.active && !projectile.hitEnemies!.includes(enemy)) {
                const dist = Phaser.Math.Distance.Between(
                    hitEnemy.x, hitEnemy.y,
                    enemy.x, enemy.y
                );
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestEnemy = enemy;
                }
            }
        });

        if (nearestEnemy) {
            // Redirect projectile to new target
            projectile.chainCount!--;
            const angle = Math.atan2(
                nearestEnemy.y - projectile.y,
                nearestEnemy.x - projectile.x
            );

            (projectile.body as Phaser.Physics.Arcade.Body).setVelocity(
                Math.cos(angle) * COMBAT_CONSTANTS.PROJECTILE_SPEED_FAST,
                Math.sin(angle) * COMBAT_CONSTANTS.PROJECTILE_SPEED_FAST
            );

            // Visual chain effect
            const chain = this.scene.add.line(
                0, 0,
                hitEnemy.x, hitEnemy.y,
                nearestEnemy.x, nearestEnemy.y,
                0xffff44,
                0.8
            );
            chain.setLineWidth(3);

            this.scene.tweens.add({
                targets: chain,
                alpha: 0,
                duration: 200,
                onComplete: () => chain.destroy()
            });
        } else {
            // No more targets, destroy projectile
            projectile.destroy();
        }
    }
}
