/**
 * StatusEffectSystem - Centralized status effect management
 *
 * Handles all status effects: burn, slow, freeze, stun, poison
 * Consolidates logic from ProjectileManager and other systems
 */

import { COMBAT_CONSTANTS, CombatHelpers } from '../../data/constants/CombatConstants';

export interface IStatusTarget extends Phaser.GameObjects.GameObject {
    // Common properties
    active: boolean;
    x: number;
    y: number;

    // Status flags
    burning?: boolean;
    slowed?: boolean;
    frozen?: boolean;
    stunned?: boolean;
    poisoned?: boolean;

    // Properties for effects
    moveSpeed?: number;
    anims?: Phaser.GameObjects.Components.Animation;
    poisonTimer?: Phaser.Time.TimerEvent;

    // Rendering
    setTint(color: number): this;
    clearTint(): this;
}

export interface IBurnConfig {
    damage: number;
    duration: number;
}

export interface ISlowConfig {
    amount: number;
    duration: number;
}

export interface IFreezeConfig {
    duration: number;
}

export interface IStunConfig {
    duration: number;
}

export interface IPoisonConfig {
    damagePerTick: number;
    totalDuration?: number;
    tickCount?: number;
    untilDeath?: boolean;
}

/**
 * Centralized status effect system
 */
export class StatusEffectSystem {
    constructor(private scene: Phaser.Scene) {}

    /**
     * Apply burn effect to target
     */
    applyBurn(target: IStatusTarget, config: IBurnConfig): void {
        if (target.burning) return; // Already burning

        target.burning = true;
        target.setTint(0xff6600);

        this.scene.time.delayedCall(config.duration, () => {
            if (target && target.active) {
                target.burning = false;
                target.clearTint();

                // Apply damage at end of burn
                this.scene.events.emit('enemyDamaged', {
                    enemy: target,
                    damage: config.damage,
                    element: 'fire',
                    isDot: true
                });
            }
        });
    }

    /**
     * Apply slow effect to target
     */
    applySlow(target: IStatusTarget, config: ISlowConfig): void {
        if (target.slowed || !target.moveSpeed) return; // Already slowed or no moveSpeed

        target.slowed = true;
        const originalSpeed = target.moveSpeed;
        target.moveSpeed *= config.amount;
        target.setTint(0x6666ff);

        this.scene.time.delayedCall(config.duration, () => {
            if (target && target.active) {
                target.slowed = false;
                target.moveSpeed = originalSpeed;
                target.clearTint();
            }
        });
    }

    /**
     * Apply freeze effect to target (also stuns)
     */
    applyFreeze(target: IStatusTarget, config: IFreezeConfig): void {
        if (target.frozen) return; // Already frozen

        target.frozen = true;
        target.stunned = true; // Freeze also stuns
        target.setTint(0xaaffff);

        // Pause animation if available
        if (target.anims) {
            target.anims.pause();
        }

        this.scene.time.delayedCall(config.duration, () => {
            if (target && target.active) {
                target.frozen = false;
                target.stunned = false;
                target.clearTint();

                // Resume animation
                if (target.anims) {
                    target.anims.resume();
                }
            }
        });
    }

    /**
     * Apply stun effect to target
     */
    applyStun(target: IStatusTarget, config: IStunConfig): void {
        if (target.stunned) return; // Already stunned

        target.stunned = true;
        target.setTint(0x666666);

        this.scene.time.delayedCall(config.duration, () => {
            if (target && target.active) {
                target.stunned = false;
                target.clearTint();
            }
        });
    }

    /**
     * Apply poison effect to target (ticking damage)
     */
    applyPoison(target: IStatusTarget, config: IPoisonConfig): void {
        if (target.poisoned) return; // Already poisoned

        if (config.untilDeath) {
            this.applyPoisonUntilDeath(target, config.damagePerTick);
        } else {
            this.applyPoisonTimed(target, config);
        }
    }

    /**
     * Apply poison that ticks until enemy dies
     */
    private applyPoisonUntilDeath(target: IStatusTarget, damagePerTick: number): void {
        target.poisoned = true;
        target.setTint(0x00ff00);

        const poisonTimer = this.scene.time.addEvent({
            delay: COMBAT_CONSTANTS.POISON_TICK_INTERVAL,
            callback: () => {
                if (target && target.active) {
                    this.scene.events.emit('enemyDamaged', {
                        enemy: target,
                        damage: damagePerTick,
                        element: 'poison',
                        isDot: true
                    });
                } else {
                    // Target no longer exists, stop poison
                    poisonTimer.remove();
                }
            },
            loop: true
        });

        // Store timer reference for cleanup
        target.poisonTimer = poisonTimer;
    }

    /**
     * Apply poison with fixed duration and tick count
     */
    private applyPoisonTimed(target: IStatusTarget, config: IPoisonConfig): void {
        if (!config.totalDuration || !config.tickCount) {
            console.warn('Timed poison requires totalDuration and tickCount');
            return;
        }

        target.poisoned = true;
        target.setTint(0x00ff00);

        const damagePerTick = config.damagePerTick / config.tickCount;
        const tickInterval = config.totalDuration / config.tickCount;

        for (let i = 1; i <= config.tickCount; i++) {
            this.scene.time.delayedCall(tickInterval * i, () => {
                if (target && target.active) {
                    this.scene.events.emit('enemyDamaged', {
                        enemy: target,
                        damage: damagePerTick,
                        element: 'poison',
                        isDot: true
                    });

                    // Clear effect on last tick
                    if (i === config.tickCount) {
                        target.poisoned = false;
                        target.clearTint();
                    }
                }
            });
        }
    }

    /**
     * Remove all effects from target
     */
    clearAllEffects(target: IStatusTarget): void {
        target.burning = false;
        target.slowed = false;
        target.frozen = false;
        target.stunned = false;
        target.poisoned = false;
        target.clearTint();

        // Stop poison timer if exists
        if (target.poisonTimer) {
            target.poisonTimer.remove();
            target.poisonTimer = undefined;
        }

        // Resume animation if paused
        if (target.anims && target.anims.isPaused) {
            target.anims.resume();
        }
    }

    /**
     * Check if target has any status effects
     */
    hasAnyEffect(target: IStatusTarget): boolean {
        return !!(
            target.burning ||
            target.slowed ||
            target.frozen ||
            target.stunned ||
            target.poisoned
        );
    }

    /**
     * Get all active effects on target
     */
    getActiveEffects(target: IStatusTarget): string[] {
        const effects: string[] = [];
        if (target.burning) effects.push('burning');
        if (target.slowed) effects.push('slowed');
        if (target.frozen) effects.push('frozen');
        if (target.stunned) effects.push('stunned');
        if (target.poisoned) effects.push('poisoned');
        return effects;
    }

    /**
     * Cleanup - remove all timers
     */
    shutdown(): void {
        // TimerEvents will be cleaned up by Phaser scene shutdown
        // but we should clear references
    }
}
