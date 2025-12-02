/**
 * EarthProjectile - Earth element projectile handler
 * Creates a protective barrier that pushes enemies away
 */

import { ProjectileBase } from './ProjectileBase';
import { IProjectileConfig } from '../../../types/projectile.types';
import { COMBAT_CONSTANTS, CombatHelpers } from '../../../data/constants/CombatConstants';

export class EarthProjectile extends ProjectileBase {
    private earthZones: Phaser.GameObjects.Rectangle[] = [];

    fire(config: IProjectileConfig): void {
        const { origin, elements } = config;
        const linkedCount = this.getLinkedCount(elements);

        // Calculate size based on linked charges
        const size = CombatHelpers.getEarthZoneSize(linkedCount);
        const duration = CombatHelpers.getEarthZoneDuration(linkedCount);

        // Create earth barrier zone
        const earthZone = this.scene.add.rectangle(
            origin.x,
            origin.y,
            size,
            size,
            0x8B4513, // Brown
            0.5
        );
        earthZone.setStrokeStyle(3, 0x654321);

        // Add physics
        this.scene.physics.add.existing(earthZone, true);

        // Store properties as custom data
        (earthZone as any).element = 'earth';
        (earthZone as any).damage = COMBAT_CONSTANTS.EARTH_ZONE_DAMAGE;
        (earthZone as any).pushForce = COMBAT_CONSTANTS.EARTH_PUSH_FORCE;
        (earthZone as any).duration = duration;
        (earthZone as any).followTarget = origin; // Follow the caster
        (earthZone as any).size = size;

        this.earthZones.push(earthZone);

        // Auto-destroy after duration
        this.scene.time.delayedCall(duration, () => {
            earthZone.destroy();
            const index = this.earthZones.indexOf(earthZone);
            if (index > -1) {
                this.earthZones.splice(index, 1);
            }
        });
    }

    /**
     * Update earth zones to follow casters and push enemies
     */
    update(): void {
        const enemies = (this.scene as any).enemyManager?.getAllEnemies() || [];

        this.earthZones.forEach(zone => {
            const zoneData = zone as any;

            // Update position if following target
            if (zoneData.followTarget && zoneData.followTarget.active) {
                zone.x = zoneData.followTarget.x;
                zone.y = zoneData.followTarget.y;

                // Update physics body position
                if ((zone as any).body) {
                    (zone as any).body.x = zone.x - zoneData.size / 2;
                    (zone as any).body.y = zone.y - zoneData.size / 2;
                }
            }

            // Push enemies away
            enemies.forEach((enemy: any) => {
                if (!enemy.active || enemy.noStagger) return;

                if (Phaser.Geom.Rectangle.Contains(zone.getBounds(), enemy.x, enemy.y)) {
                    // Calculate push direction
                    const angle = Math.atan2(
                        enemy.y - zone.y,
                        enemy.x - zone.x
                    );

                    enemy.setVelocity(
                        Math.cos(angle) * zoneData.pushForce,
                        Math.sin(angle) * zoneData.pushForce
                    );

                    // Small damage
                    this.scene.events.emit('enemyDamaged', {
                        enemy: enemy,
                        damage: zoneData.damage,
                        element: 'earth'
                    });
                }
            });
        });
    }

    shutdown(): void {
        this.earthZones.forEach(zone => {
            if (zone.active) zone.destroy();
        });
        this.earthZones = [];
    }
}
