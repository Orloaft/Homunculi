/**
 * Damage calculation and application system
 * Handles damage calculation, elemental interactions, and visual effects
 */

import { COMBAT_CONFIG } from '../../data/GameConstants';
import type { ElementKey } from '../../data/ElementConfig';

/**
 * Enemy damage event data
 */
export interface IEnemyDamageData {
    readonly enemy: IEnemy;
    readonly damage: number;
    readonly element?: ElementKey;
    readonly isDot?: boolean;
}

/**
 * Projectile hit event data
 */
export interface IProjectileHitData {
    readonly projectile: Phaser.Physics.Arcade.Sprite;
    readonly enemy: IEnemy;
}

/**
 * Damage source (for knockback)
 */
export interface IDamageSource {
    readonly x: number;
    readonly y: number;
}

/**
 * Enemy sprite interface (duck typing for compatibility with game objects)
 */
export interface IEnemy extends Phaser.Physics.Arcade.Sprite {
    health: number;
    active: boolean;
    isDying?: boolean;
    enemyType?: string;
    element?: ElementKey;
    vulnerabilityMultiplier?: number;
    golemColor?: string;
    burning?: boolean;
    frozen?: boolean;
    poisoned?: boolean;
    stunned?: boolean;
    poisonTimer?: Phaser.Time.TimerEvent | null;
    anims: Phaser.Animations.AnimationState;
}

/**
 * Element color mapping for visual effects
 */
const ELEMENT_COLORS: Readonly<Partial<Record<ElementKey, number>>> = {
    fire: 0xff6600,
    water: 0x0066ff,
    earth: 0x663300,
    air: 0xccccff,
    ice: 0x66ffff,
    lightning: 0xffff66,
    poison: 0x00ff00,
    arcane: 0xff00ff,
    light: 0xffffcc,
    dark: 0x660066
} as const;

/**
 * Element color mapping for damage text
 */
const DAMAGE_TEXT_COLORS: Readonly<Partial<Record<ElementKey, string>>> = {
    fire: '#ff6600',
    water: '#0099ff',
    earth: '#996633',
    air: '#ccccff',
    ice: '#66ffff',
    lightning: '#ffff66',
    poison: '#00ff00',
    arcane: '#ff00ff',
    light: '#ffffcc',
    dark: '#990099'
} as const;

/**
 * Scene interface with optional properties
 */
interface IDamageScene extends Phaser.Scene {
    playerStats?: {
        recordDamageDealt(amount: number): void;
    };
    projectileManager?: {
        handleProjectileHit(projectile: any, enemy: any): void;
    };
    wizard?: Phaser.Physics.Arcade.Sprite;
    playerController?: {
        takeDamage(amount: number): void;
    };
}

/**
 * Damage calculation and application system
 */
export class DamageSystem {
    private scene: IDamageScene;

    constructor(scene: IDamageScene) {
        this.scene = scene;
        this.setupEventListeners();
    }

    /**
     * Set up event listeners for damage events
     */
    private setupEventListeners(): void {
        // Listen for damage events
        this.scene.events.on('enemyDamaged', (data: IEnemyDamageData) => {
            this.handleEnemyDamage(data.enemy, data.damage, data.element, data.isDot);
        });

        // Listen for projectile hits
        this.scene.events.on('projectileHit', (data: IProjectileHitData) => {
            this.handleProjectileHit(data.projectile, data.enemy);
        });
    }

    /**
     * Handle damage application to an enemy
     *
     * @param enemy - The enemy to damage
     * @param damage - Base damage amount
     * @param element - Attacking element (optional)
     * @param isDot - Whether this is damage over time
     */
    public handleEnemyDamage(
        enemy: IEnemy,
        damage: number,
        element?: ElementKey,
        isDot: boolean = false
    ): void {
        if (!enemy || !enemy.active || enemy.isDying) return;

        // Apply elemental resistances/weaknesses
        const finalDamage = this.calculateElementalDamage(damage, element, enemy);

        // Apply damage
        enemy.health -= finalDamage;

        // Show damage number
        this.showDamageNumber(enemy.x, enemy.y - 20, finalDamage, element, isDot);

        // Visual feedback
        if (!isDot) {
            this.applyHitEffect(enemy, element);
        }

        // Play hurt animation if applicable
        if (enemy.enemyType === 'golem' && enemy.health > 0 && !enemy.isDying) {
            this.playGolemHurtAnimation(enemy);
        }

        // Track damage dealt
        this.scene.playerStats?.recordDamageDealt(finalDamage);

        // Check for death
        if (enemy.health <= 0) {
            this.handleEnemyDeath(enemy);
        }
    }

    /**
     * Calculate final damage with elemental interactions
     *
     * @param baseDamage - Base damage before modifiers
     * @param attackElement - Attacking element
     * @param enemy - Target enemy
     * @returns Final damage after modifiers
     */
    private calculateElementalDamage(
        baseDamage: number,
        attackElement: ElementKey | undefined,
        enemy: IEnemy
    ): number {
        let multiplier = 1;

        // Elemental interactions
        if (attackElement && enemy.element) {
            // Fire vs Ice: 2x damage
            if (attackElement === 'fire' && enemy.element === 'ice') {
                multiplier = 2;
            }
            // Ice vs Fire: 2x damage
            else if (attackElement === 'ice' && enemy.element === 'fire') {
                multiplier = 2;
            }
            // Water vs Fire: 1.5x damage
            else if (attackElement === 'water' && enemy.element === 'fire') {
                multiplier = 1.5;
            }
            // Earth vs Lightning: 0.5x damage (resistance)
            else if (attackElement === 'earth' && enemy.element === 'lightning') {
                multiplier = 0.5;
            }
            // Light vs Dark: 2x damage
            else if (attackElement === 'light' && enemy.element === 'dark') {
                multiplier = 2;
            }
            // Dark vs Light: 2x damage
            else if (attackElement === 'dark' && enemy.element === 'light') {
                multiplier = 2;
            }
        }

        // Apply vulnerability multiplier (e.g., boss takes 200% damage during certain states)
        if (enemy.vulnerabilityMultiplier) {
            multiplier *= enemy.vulnerabilityMultiplier;
        }

        return baseDamage * multiplier;
    }

    /**
     * Apply visual hit effect to enemy
     *
     * @param enemy - The enemy to apply effect to
     * @param element - Element for color tint
     */
    private applyHitEffect(enemy: IEnemy, element?: ElementKey): void {
        // Flash color based on element
        let tintColor = 0xff0000; // Default red

        if (element && ELEMENT_COLORS[element]) {
            tintColor = ELEMENT_COLORS[element]!;
        }

        enemy.setTint(tintColor);

        // Clear tint after short delay
        this.scene.time.delayedCall(100, () => {
            if (enemy.active && !enemy.burning && !enemy.frozen && !enemy.poisoned && !enemy.stunned) {
                enemy.clearTint();
            }
        });
    }

    /**
     * Play golem hurt animation
     *
     * @param enemy - The golem enemy
     */
    private playGolemHurtAnimation(enemy: IEnemy): void {
        const currentAnim = enemy.anims.currentAnim;
        enemy.play(`golem-${enemy.golemColor}-hurt`);

        enemy.once('animationcomplete', () => {
            if (enemy.active && !enemy.isDying) {
                enemy.play(`golem-${enemy.golemColor}-walk`);
            }
        });
    }

    /**
     * Handle enemy death
     *
     * @param enemy - The enemy that died
     */
    private handleEnemyDeath(enemy: IEnemy): void {
        if (enemy.isDying) return;

        enemy.isDying = true;
        enemy.setVelocity(0, 0);

        // Play death animation if available
        if (enemy.enemyType === 'golem') {
            enemy.play(`golem-${enemy.golemColor}-die`);
            enemy.once('animationcomplete', () => {
                this.completeEnemyDeath(enemy);
            });
        } else if (enemy.enemyType === 'slime') {
            enemy.play('slime-die');
            enemy.once('animationcomplete', () => {
                this.completeEnemyDeath(enemy);
            });
        } else {
            // No death animation, die immediately
            this.completeEnemyDeath(enemy);
        }
    }

    /**
     * Complete enemy death and cleanup
     *
     * @param enemy - The enemy to destroy
     */
    private completeEnemyDeath(enemy: IEnemy): void {
        // Clean up any active poison timer
        if (enemy.poisonTimer) {
            enemy.poisonTimer.remove();
            enemy.poisonTimer = null;
        }

        // Emit death event
        this.scene.events.emit('enemyKilled', enemy);

        // Destroy enemy
        enemy.destroy();
    }

    /**
     * Show floating damage number
     *
     * @param x - X position
     * @param y - Y position
     * @param damage - Damage amount to display
     * @param element - Element for color
     * @param isDot - Whether this is DoT damage
     */
    private showDamageNumber(
        x: number,
        y: number,
        damage: number,
        element?: ElementKey,
        isDot: boolean = false
    ): void {
        // Round damage for display
        const displayDamage = Math.round(damage);

        // Choose color based on element or damage type
        let color = '#ffff00'; // Default yellow

        if (isDot) {
            color = '#ff9900'; // Orange for DoT
        } else if (element && DAMAGE_TEXT_COLORS[element]) {
            color = DAMAGE_TEXT_COLORS[element]!;
        }

        const damageText = this.scene.add.text(x, y, displayDamage.toString(), {
            fontSize: isDot ? '20px' : '24px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });

        damageText.setOrigin(0.5);
        damageText.setDepth(150);

        // Animate
        this.scene.tweens.add({
            targets: damageText,
            y: y - 50,
            alpha: 0,
            scale: isDot ? 0.8 : 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }

    /**
     * Handle projectile hitting enemy
     *
     * @param projectile - The projectile that hit
     * @param enemy - The enemy that was hit
     */
    public handleProjectileHit(projectile: Phaser.Physics.Arcade.Sprite, enemy: IEnemy): void {
        // Delegate to projectile manager
        this.scene.projectileManager?.handleProjectileHit(projectile, enemy);
    }

    /**
     * Apply damage to player
     *
     * @param amount - Damage amount
     * @param source - Damage source for knockback
     */
    public damagePlayer(amount: number, source?: IDamageSource): void {
        if (!this.scene.wizard || !this.scene.wizard.active) return;

        // Apply damage through player controller
        this.scene.playerController?.takeDamage(amount);

        // Visual feedback
        this.scene.wizard.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (this.scene.wizard!.active) {
                this.scene.wizard!.clearTint();
            }
        });

        // Knockback from source
        if (source && source.x !== undefined && source.y !== undefined) {
            const angle = Math.atan2(
                this.scene.wizard.y - source.y,
                this.scene.wizard.x - source.x
            );

            const knockback = 300;
            this.scene.wizard.setVelocity(Math.cos(angle) * knockback, Math.sin(angle) * knockback);
        }
    }
}
