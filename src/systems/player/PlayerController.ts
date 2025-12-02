/**
 * Player controller for movement and animations
 * Handles input processing, movement, and animation updates
 */

import { PLAYER_CONFIG } from '../../data/GameConstants';

/**
 * Movement direction vector
 */
export interface IMovementInput {
    readonly x: number;
    readonly y: number;
}

/**
 * Position coordinates
 */
export interface IPosition {
    readonly x: number;
    readonly y: number;
}

/**
 * Direction strings for player facing
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Input manager interface (duck typing for compatibility)
 */
interface IInputManager {
    getMovement(): IMovementInput;
}

/**
 * Player sprite interface (Phaser sprite with additional properties)
 */
interface IPlayerSprite extends Phaser.Physics.Arcade.Sprite {
    active: boolean;
    anims: Phaser.Animations.AnimationState;
}

/**
 * Player controller manages movement and animations
 */
export class PlayerController {
    private scene: Phaser.Scene;
    private wizard: IPlayerSprite;
    private moveSpeed: number;
    private lastDirection: Direction;
    private isMoving: boolean;
    private isDead: boolean;

    constructor(scene: Phaser.Scene, wizard: IPlayerSprite) {
        this.scene = scene;
        this.wizard = wizard;
        this.moveSpeed = PLAYER_CONFIG.moveSpeed;
        this.lastDirection = 'down';
        this.isMoving = false;
        this.isDead = false;
    }

    /**
     * Update player movement and animations
     *
     * @param inputManager - Input manager providing movement data
     */
    public update(inputManager: IInputManager): void {
        if (this.isDead || !this.wizard.active) return;

        // Get movement input
        const movement = inputManager.getMovement();
        this.isMoving = movement.x !== 0 || movement.y !== 0;

        // Apply movement
        if (this.isMoving) {
            this.wizard.setVelocity(
                movement.x * this.moveSpeed,
                movement.y * this.moveSpeed
            );

            // Update animation direction
            this.updateAnimation(movement);

            // Store last direction
            if (Math.abs(movement.x) > Math.abs(movement.y)) {
                this.lastDirection = movement.x > 0 ? 'right' : 'left';
            } else if (movement.y !== 0) {
                this.lastDirection = movement.y > 0 ? 'down' : 'up';
            }
        } else {
            this.wizard.setVelocity(0, 0);

            // Play idle animation
            if (
                this.wizard.anims &&
                (!this.wizard.anims.isPlaying || this.wizard.anims.currentAnim.key !== 'wizard-idle-loop')
            ) {
                this.wizard.play('wizard-idle-loop');
            }
        }

        // Update wizard flip based on direction
        if (this.lastDirection === 'left') {
            this.wizard.setFlipX(true);
        } else if (this.lastDirection === 'right') {
            this.wizard.setFlipX(false);
        }
    }

    /**
     * Update player animation based on movement
     *
     * @param movement - Current movement vector
     */
    private updateAnimation(movement: IMovementInput): void {
        // Determine animation based on movement direction
        const animKey = 'wizard-fly';

        if (
            this.wizard.anims &&
            (!this.wizard.anims.isPlaying || this.wizard.anims.currentAnim.key === 'wizard-idle-loop')
        ) {
            this.wizard.play(animKey);
        }
    }

    /**
     * Apply damage to the player
     *
     * @param amount - Amount of damage to take (default: 1)
     */
    public takeDamage(amount: number = 1): void {
        if (this.isDead) return;

        // Emit damage event for other systems to handle
        this.scene.events.emit('playerDamaged', amount);
    }

    /**
     * Handle player death
     */
    public die(): void {
        if (this.isDead) return;

        this.isDead = true;
        this.wizard.setVelocity(0, 0);

        // Play death animation
        this.wizard.play('wizard-death');

        // Emit death event
        this.scene.events.emit('playerDied');
    }

    /**
     * Respawn the player
     */
    public respawn(): void {
        this.isDead = false;

        // Play respawn animation
        this.wizard.play('wizard-idle-full');
        this.wizard.once('animationcomplete', () => {
            this.wizard.play('wizard-idle-loop');
        });
    }

    /**
     * Get current player position
     *
     * @returns Position object with x and y coordinates
     */
    public getPosition(): IPosition {
        return {
            x: this.wizard.x,
            y: this.wizard.y
        };
    }

    /**
     * Get current facing direction
     *
     * @returns Current direction string
     */
    public getDirection(): Direction {
        return this.lastDirection;
    }

    /**
     * Set player position
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     */
    public setPosition(x: number, y: number): void {
        this.wizard.setPosition(x, y);
    }

    /**
     * Get angle to a target position
     *
     * @param targetX - Target X coordinate
     * @param targetY - Target Y coordinate
     * @returns Angle in radians
     */
    public getAngleTo(targetX: number, targetY: number): number {
        return Math.atan2(targetY - this.wizard.y, targetX - this.wizard.x);
    }

    /**
     * Check if player is currently moving
     *
     * @returns True if moving
     */
    public getIsMoving(): boolean {
        return this.isMoving;
    }

    /**
     * Check if player is dead
     *
     * @returns True if dead
     */
    public getIsDead(): boolean {
        return this.isDead;
    }
}
