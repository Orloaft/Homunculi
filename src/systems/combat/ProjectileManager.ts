/**
 * ProjectileManager (Refactored) - Lightweight orchestrator for projectile handlers
 *
 * This replaces the 30k line monolithic ProjectileManager with a clean,
 * modular system that delegates to specialized handlers.
 *
 * Responsibilities:
 * - Manage projectile group
 * - Route projectile creation to appropriate handlers
 * - Handle projectile-enemy collisions
 * - Apply status effects via StatusEffectSystem
 * - Manage special effects (explosions, fire pools, water orbs)
 */

import { ElementType, IProjectileConfig } from '../../types/projectile.types';
import { StatusEffectSystem } from './StatusEffectSystem';
import { COMBAT_CONSTANTS } from '../../data/constants/CombatConstants';

// Import all projectile handlers
import { FireProjectile } from './projectiles/FireProjectile';
import { WaterProjectile } from './projectiles/WaterProjectile';
import { EarthProjectile } from './projectiles/EarthProjectile';
import { AirProjectile } from './projectiles/AirProjectile';
import { LightningProjectile } from './projectiles/LightningProjectile';
import { IceProjectile } from './projectiles/IceProjectile';
import { ArcaneProjectile } from './projectiles/ArcaneProjectile';
import { PoisonProjectile } from './projectiles/PoisonProjectile';
import { RockProjectile } from './projectiles/RockProjectile';

export class ProjectileManagerNew {
    private scene: Phaser.Scene;
    private projectiles: Phaser.Physics.Arcade.Group;
    private statusEffectSystem: StatusEffectSystem;

    // Projectile handlers
    private handlers: Map<ElementType, any>;

    // Special handlers (need update loops)
    private fireHandler: FireProjectile;
    private earthHandler: EarthProjectile;
    private lightningHandler: LightningProjectile;

    // Special projectile tracking
    private waterOrbs: Phaser.GameObjects.Sprite[] = [];
    private firePools: Array<{ sprite: Phaser.GameObjects.Arc; lastDamageTime: number }> = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Create projectile group
        this.projectiles = scene.physics.add.group();

        // Create status effect system
        this.statusEffectSystem = new StatusEffectSystem(scene);

        // Initialize handlers
        this.fireHandler = new FireProjectile(scene, this.projectiles);
        this.earthHandler = new EarthProjectile(scene, this.projectiles);
        this.lightningHandler = new LightningProjectile(scene, this.projectiles);

        this.handlers = new Map([
            ['fire', this.fireHandler],
            ['water', new WaterProjectile(scene, this.projectiles)],
            ['earth', this.earthHandler],
            ['air', new AirProjectile(scene, this.projectiles)],
            ['lightning', this.lightningHandler],
            ['ice', new IceProjectile(scene, this.projectiles)],
            ['arcane', new ArcaneProjectile(scene, this.projectiles)],
            ['poison', new PoisonProjectile(scene, this.projectiles)],
            ['rock', new RockProjectile(scene, this.projectiles)]
        ]);

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Listen for projectile creation requests
        this.scene.events.on('fireProjectile', (data: any) => {
            this.fireProjectile(data.origin, data.target, data.elements);
        });

        // Listen for explosion requests
        this.scene.events.on('createExplosion', (data: any) => {
            this.createExplosion(data.x, data.y, data.radius);
        });
    }

    /**
     * Fire a projectile based on element type
     */
    fireProjectile(origin: any, target: any, elements: ElementType[]): void {
        if (!elements || elements.length === 0) return;

        const primaryElement = elements[0];
        const handler = this.handlers.get(primaryElement);

        if (handler) {
            handler.fire({ origin, target, elements });
        } else {
            // Fallback for unknown elements
            this.fireBasicProjectile(origin, target, primaryElement, elements);
        }
    }

    /**
     * Fallback for elements without custom handlers
     */
    private fireBasicProjectile(
        origin: any,
        target: any,
        element: ElementType,
        group: ElementType[]
    ): void {
        const angle = Math.atan2(target.y - origin.y, target.x - origin.x);

        // Create simple colored circle
        const projectile = this.scene.add.circle(origin.x, origin.y, 5, 0xffffff);
        this.scene.physics.add.existing(projectile);

        // Set velocity
        const speed = COMBAT_CONSTANTS.PROJECTILE_SPEED;
        (projectile.body as Phaser.Physics.Arcade.Body).setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Set properties
        (projectile as any).element = element;
        (projectile as any).damage = group.length;

        this.projectiles.add(projectile);
    }

    /**
     * Handle projectile hitting an enemy
     */
    handleProjectileHit(projectile: any, enemy: any): void {
        // Special handling for poison field
        if (projectile.isPoisonField) {
            if (projectile.hitEnemies.includes(enemy)) return; // Already hit
            projectile.hitEnemies.push(enemy);

            // Apply poison effect
            if (!enemy.poisoned) {
                this.statusEffectSystem.applyPoison(enemy, {
                    damagePerTick: projectile.poisonDamage,
                    untilDeath: true
                });
            }
            return; // Don't destroy poison field
        }

        // Calculate damage
        const baseDamage = projectile.isExplosive
            ? COMBAT_CONSTANTS.EXPLOSIVE_DAMAGE
            : COMBAT_CONSTANTS.BASE_DAMAGE;
        const damage = baseDamage * (projectile.damage || 1);

        // Emit damage event
        this.scene.events.emit('enemyDamaged', {
            enemy: enemy,
            damage: damage,
            element: projectile.element,
            projectile: projectile
        });

        // Apply element effects
        this.applyElementEffect(projectile, enemy);

        // Handle special behaviors
        if (projectile.isExplosive) {
            this.createExplosion(projectile.x, projectile.y);
        }

        if (projectile.createFirePool) {
            this.createFirePool(projectile.x, projectile.y, projectile.linkedCount || 1);
        }

        if (projectile.createWaterOrb && Math.random() < 0.3) {
            this.createWaterOrb(enemy.x, enemy.y);
        }

        // Handle lightning chain
        if (projectile.chainCount && projectile.chainCount > 0) {
            this.lightningHandler.handleChain(projectile, enemy);
            return; // Don't destroy yet
        }

        // Destroy projectile (unless stationary or piercing)
        if (!projectile.isStationary && !projectile.isPiercing) {
            projectile.destroy();
        }
    }

    /**
     * Apply status effects based on projectile element
     */
    private applyElementEffect(projectile: any, enemy: any): void {
        switch (projectile.element) {
            case 'fire':
                if (projectile.burnDamage && !enemy.burning) {
                    this.statusEffectSystem.applyBurn(enemy, {
                        damage: projectile.burnDamage,
                        duration: projectile.burnDuration
                    });
                }
                break;

            case 'water':
                if (projectile.slowAmount && !enemy.slowed) {
                    this.statusEffectSystem.applySlow(enemy, {
                        amount: projectile.slowAmount,
                        duration: projectile.slowDuration
                    });
                }
                break;

            case 'ice':
                if (projectile.freezeDuration && !enemy.frozen) {
                    this.statusEffectSystem.applyFreeze(enemy, {
                        duration: projectile.freezeDuration
                    });
                }
                break;

            case 'rock':
                if (projectile.stunDuration && !enemy.stunned) {
                    this.statusEffectSystem.applyStun(enemy, {
                        duration: projectile.stunDuration
                    });
                }
                break;
        }
    }

    /**
     * Create explosion effect
     */
    createExplosion(x: number, y: number, radius: number = COMBAT_CONSTANTS.EXPLOSION_RADIUS_BASE): void {
        // Visual effect
        const explosion = this.scene.add.circle(x, y, radius, 0xff6600, 0.8);
        explosion.setDepth(10);

        this.scene.tweens.add({
            targets: explosion,
            scale: { from: 0, to: 1 },
            alpha: { from: 1, to: 0 },
            duration: 300,
            onComplete: () => explosion.destroy()
        });

        // Damage nearby enemies
        const enemies = (this.scene as any).enemyManager?.getAllEnemies() || [];
        const radiusSquared = radius * radius;

        enemies.forEach((enemy: any) => {
            if (!enemy.active) return;

            const dx = enemy.x - x;
            const dy = enemy.y - y;
            const distSquared = dx * dx + dy * dy;

            if (distSquared < radiusSquared) {
                const damage = COMBAT_CONSTANTS.EXPLOSIVE_DAMAGE;
                const dist = Math.sqrt(distSquared);
                const force = COMBAT_CONSTANTS.EXPLOSIVE_KNOCKBACK;

                // Knockback
                enemy.setVelocity(
                    (dx / dist) * force,
                    (dy / dist) * force
                );

                // Damage
                this.scene.events.emit('enemyDamaged', {
                    enemy: enemy,
                    damage: damage,
                    element: 'explosive'
                });
            }
        });
    }

    /**
     * Create fire pool (burning area on ground)
     */
    createFirePool(x: number, y: number, linkedCount: number = 1): void {
        const radius = COMBAT_CONSTANTS.FIRE_POOL_RADIUS_BASE +
                       (linkedCount - 1) * COMBAT_CONSTANTS.FIRE_POOL_RADIUS_PER_LINK;

        const firePool = this.scene.add.circle(x, y, radius, 0xff4400, 0.5);
        firePool.setDepth(1);
        this.scene.physics.add.existing(firePool, true);

        this.firePools.push({
            sprite: firePool,
            lastDamageTime: 0
        });

        // Auto-destroy and explode
        this.scene.time.delayedCall(COMBAT_CONSTANTS.FIRE_POOL_DURATION, () => {
            this.createExplosion(firePool.x, firePool.y, radius);
            firePool.destroy();

            const index = this.firePools.findIndex(p => p.sprite === firePool);
            if (index > -1) {
                this.firePools.splice(index, 1);
            }
        });
    }

    /**
     * Create water healing orb
     */
    createWaterOrb(x: number, y: number): void {
        const orb = this.scene.physics.add.sprite(x, y, 'water-spell');
        orb.setScale(0.5);
        orb.setTint(0x4444ff);
        orb.play('water-spell-anim');

        // Float animation
        this.scene.tweens.add({
            targets: orb,
            y: y - 20,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Properties
        (orb as any).healAmount = 1;
        (orb as any).isPickup = true;

        this.waterOrbs.push(orb);

        // Auto-destroy after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            orb.destroy();
            const index = this.waterOrbs.indexOf(orb);
            if (index > -1) {
                this.waterOrbs.splice(index, 1);
            }
        });
    }

    /**
     * Update loop
     */
    update(time: number, delta: number): void {
        // Update projectiles
        this.projectiles.children.entries.forEach((projectile: any) => {
            // Update position for projectiles that follow targets
            if (projectile.followTarget && projectile.followTarget.active) {
                projectile.x = projectile.followTarget.x;
                projectile.y = projectile.followTarget.y + (projectile.offsetY || 0);
            }

            // Remove if out of bounds (but not stationary projectiles)
            if (!projectile.isStationary) {
                const bounds = this.scene.physics.world.bounds;
                if (
                    projectile.x < -50 || projectile.x > bounds.width + 50 ||
                    projectile.y < -50 || projectile.y > bounds.height + 50
                ) {
                    projectile.destroy();
                }
            }
        });

        // Update fire pools
        this.updateFirePools(time);

        // Update special handlers that need update loops
        this.fireHandler.update();
        this.earthHandler.update();
    }

    /**
     * Update fire pools to damage enemies
     */
    private updateFirePools(time: number): void {
        const enemies = (this.scene as any).enemyManager?.getAllEnemies() || [];

        this.firePools.forEach(pool => {
            if (time - pool.lastDamageTime > COMBAT_CONSTANTS.FIRE_POOL_DAMAGE_INTERVAL) {
                enemies.forEach((enemy: any) => {
                    if (!enemy.active) return;

                    const dist = Phaser.Math.Distance.Between(
                        pool.sprite.x, pool.sprite.y,
                        enemy.x, enemy.y
                    );

                    if (dist < pool.sprite.radius) {
                        this.scene.events.emit('enemyDamaged', {
                            enemy: enemy,
                            damage: COMBAT_CONSTANTS.FIRE_DAMAGE_OVER_TIME,
                            element: 'fire'
                        });
                    }
                });

                pool.lastDamageTime = time;
            }
        });
    }

    /**
     * Clear all projectiles and effects
     */
    clearAll(): void {
        this.projectiles.clear(true, true);

        // Clear water orbs
        this.waterOrbs.forEach(orb => orb.destroy());
        this.waterOrbs = [];

        // Clear fire pools
        this.firePools.forEach(pool => pool.sprite.destroy());
        this.firePools = [];

        // Clear handlers
        this.fireHandler.shutdown();
        this.earthHandler.shutdown();
    }

    /**
     * Shutdown and cleanup
     */
    shutdown(): void {
        this.clearAll();
        this.scene.events.off('fireProjectile');
        this.scene.events.off('createExplosion');
        this.statusEffectSystem.shutdown();
    }

    /**
     * Get projectiles group (for collision detection)
     */
    getProjectiles(): Phaser.Physics.Arcade.Group {
        return this.projectiles;
    }

    /**
     * Get water orbs (for collision detection)
     */
    getWaterOrbs(): Phaser.GameObjects.Sprite[] {
        return this.waterOrbs;
    }
}
