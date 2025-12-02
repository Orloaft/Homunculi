/**
 * ProjectileBase - Abstract base class for all projectile handlers
 */

import { IProjectileHandler, IProjectileConfig, ElementType } from '../../../types/projectile.types';

export abstract class ProjectileBase implements IProjectileHandler {
    protected scene: Phaser.Scene;
    protected projectileGroup: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene, projectileGroup: Phaser.Physics.Arcade.Group) {
        this.scene = scene;
        this.projectileGroup = projectileGroup;
    }

    /**
     * Abstract method - must be implemented by subclasses
     */
    abstract fire(config: IProjectileConfig): void;

    /**
     * Create a basic sprite projectile
     */
    protected createSprite(
        x: number,
        y: number,
        texture: string,
        scale: number = 1
    ): Phaser.Physics.Arcade.Sprite {
        const sprite = this.scene.physics.add.sprite(x, y, texture);
        sprite.setScale(scale);
        this.projectileGroup.add(sprite);
        return sprite;
    }

    /**
     * Create a circle projectile (for elements without sprites)
     */
    protected createCircle(
        x: number,
        y: number,
        radius: number,
        color: number
    ): Phaser.Physics.Arcade.Sprite {
        const circle = this.scene.add.circle(x, y, radius, color) as any;
        this.scene.physics.add.existing(circle);
        this.projectileGroup.add(circle);
        return circle as Phaser.Physics.Arcade.Sprite;
    }

    /**
     * Create a rectangle projectile
     */
    protected createRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        color: number
    ): Phaser.Physics.Arcade.Sprite {
        const rect = this.scene.add.rectangle(x, y, width, height, color) as any;
        this.scene.physics.add.existing(rect);
        this.projectileGroup.add(rect);
        return rect as Phaser.Physics.Arcade.Sprite;
    }

    /**
     * Calculate angle from origin to target
     */
    protected calculateAngle(
        origin: { x: number; y: number },
        target: { x: number; y: number }
    ): number {
        return Math.atan2(target.y - origin.y, target.x - origin.x);
    }

    /**
     * Set projectile velocity at angle
     */
    protected setVelocityAtAngle(
        sprite: Phaser.Physics.Arcade.Sprite,
        angle: number,
        speed: number
    ): void {
        sprite.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }

    /**
     * Get primary element from group
     */
    protected getPrimaryElement(elements: ElementType[]): ElementType {
        return elements[0];
    }

    /**
     * Get linked count (number of same element)
     */
    protected getLinkedCount(elements: ElementType[]): number {
        return elements.length;
    }

    /**
     * Check if all elements in group are the same
     */
    protected isDoubleLinked(elements: ElementType[]): boolean {
        return elements.length === 2 && elements.every(e => e === elements[0]);
    }

    /**
     * Optional cleanup
     */
    shutdown(): void {
        // Override if needed
    }
}
