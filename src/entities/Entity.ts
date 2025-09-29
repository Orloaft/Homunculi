/**
 * Base Entity class for all game objects
 */

import { Vector2 } from '@/types/game.types';
import { EventBus } from '@/core/EventBus';
import { v4 as uuidv4 } from 'uuid';

export interface EntityConfig {
  id?: string;
  type: string;
  position?: Vector2;
  velocity?: Vector2;
  active?: boolean;
  tags?: string[];
}

export abstract class Entity {
  public readonly id: string;
  public readonly type: string;
  public position: Vector2;
  public velocity: Vector2;
  public active: boolean;
  public tags: Set<string>;
  
  protected components: Map<string, any> = new Map();
  protected eventBus: EventBus;
  protected scene?: Phaser.Scene;
  
  constructor(config: EntityConfig, eventBus: EventBus, scene?: Phaser.Scene) {
    this.id = config.id || uuidv4();
    this.type = config.type;
    this.position = config.position || { x: 0, y: 0 };
    this.velocity = config.velocity || { x: 0, y: 0 };
    this.active = config.active !== undefined ? config.active : true;
    this.tags = new Set(config.tags || []);
    this.eventBus = eventBus;
    this.scene = scene;
  }
  
  /**
   * Initialize entity (called after construction)
   */
  abstract init(): void;
  
  /**
   * Update entity (called each frame)
   */
  abstract update(deltaTime: number): void;
  
  /**
   * Render entity (if needed)
   */
  abstract render(): void;
  
  /**
   * Destroy entity and cleanup
   */
  destroy(): void {
    this.active = false;
    this.components.clear();
    this.tags.clear();
    this.onDestroy();
  }
  
  /**
   * Called when entity is destroyed
   */
  protected abstract onDestroy(): void;
  
  /**
   * Add a component to this entity
   */
  addComponent<T>(name: string, component: T): void {
    this.components.set(name, component);
  }
  
  /**
   * Get a component from this entity
   */
  getComponent<T>(name: string): T | undefined {
    return this.components.get(name) as T;
  }
  
  /**
   * Check if entity has a component
   */
  hasComponent(name: string): boolean {
    return this.components.has(name);
  }
  
  /**
   * Remove a component from this entity
   */
  removeComponent(name: string): void {
    this.components.delete(name);
  }
  
  /**
   * Add a tag to this entity
   */
  addTag(tag: string): void {
    this.tags.add(tag);
  }
  
  /**
   * Remove a tag from this entity
   */
  removeTag(tag: string): void {
    this.tags.delete(tag);
  }
  
  /**
   * Check if entity has a tag
   */
  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }
  
  /**
   * Get distance to another entity
   */
  distanceTo(other: Entity): number {
    const dx = other.position.x - this.position.x;
    const dy = other.position.y - this.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Get direction vector to another entity
   */
  directionTo(other: Entity): Vector2 {
    const dx = other.position.x - this.position.x;
    const dy = other.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) {
      return { x: 0, y: 0 };
    }
    
    return {
      x: dx / distance,
      y: dy / distance
    };
  }
  
  /**
   * Move entity by velocity
   */
  move(deltaTime: number): void {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }
  
  /**
   * Set entity position
   */
  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }
  
  /**
   * Set entity velocity
   */
  setVelocity(x: number, y: number): void {
    this.velocity.x = x;
    this.velocity.y = y;
  }
  
  /**
   * Clone this entity
   */
  abstract clone(): Entity;
  
  /**
   * Serialize entity to JSON
   */
  toJSON(): any {
    return {
      id: this.id,
      type: this.type,
      position: { ...this.position },
      velocity: { ...this.velocity },
      active: this.active,
      tags: Array.from(this.tags)
    };
  }
  
  /**
   * Create entity from JSON
   */
  static fromJSON(data: any, eventBus: EventBus, scene?: Phaser.Scene): Entity {
    throw new Error('fromJSON must be implemented by subclass');
  }
}