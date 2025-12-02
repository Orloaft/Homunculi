/**
 * Player statistics and progression system
 * Manages health, XP, leveling, and gameplay statistics
 */

import { PLAYER_CONFIG, LEVEL_CONFIG } from '../../data/GameConstants';
import type { ElementKey } from '../../data/ElementConfig';

/**
 * Health change event data
 */
export interface IHealthChangeData {
    readonly current: number;
    readonly max: number;
}

/**
 * XP change event data
 */
export interface IXPChangeData {
    readonly current: number;
    readonly toNext: number;
    readonly level: number;
}

/**
 * Level up event data
 */
export interface ILevelUpData {
    readonly level: number;
    readonly shouldSpawnDarkEye: boolean;
}

/**
 * Enemy kill event data
 */
export interface IEnemyKillData {
    readonly xpValue?: number;
}

/**
 * Player statistics summary
 */
export interface IPlayerStats {
    readonly level: number;
    readonly health: number;
    readonly maxHealth: number;
    readonly xp: number;
    readonly xpToNext: number;
    readonly enemiesKilled: number;
    readonly itemsCollected: number;
    readonly survivalTime: number;
    readonly damageDealt: number;
    readonly damageTaken: number;
    readonly elementsDiscovered: number;
}

/**
 * Player statistics and progression manager
 */
export class PlayerStats {
    private scene: Phaser.Scene;

    // Health
    public health: number;
    public maxHealth: number;

    // Experience and Level
    public xp: number;
    public level: number;
    public xpToNext: number;

    // Statistics
    public enemiesKilled: number;
    public itemsCollected: number;
    public survivalTime: number;
    public damageDealt: number;
    public damageTaken: number;

    // Discovered elements
    private discoveredElements: Set<ElementKey>;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Health
        this.health = PLAYER_CONFIG.startingHealth;
        this.maxHealth = PLAYER_CONFIG.maxHealth;

        // Experience and Level
        this.xp = 0;
        this.level = 1;
        this.xpToNext = LEVEL_CONFIG.baseXPRequired;

        // Statistics
        this.enemiesKilled = 0;
        this.itemsCollected = 0;
        this.survivalTime = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;

        // Discovered elements
        this.discoveredElements = new Set<ElementKey>(['arcane']); // Start with arcane discovered

        this.setupEventListeners();
    }

    /**
     * Set up event listeners for player events
     */
    private setupEventListeners(): void {
        // Listen for damage events
        this.scene.events.on('playerDamaged', (amount: number) => {
            this.takeDamage(amount);
        });

        // Listen for enemy kill events
        this.scene.events.on('enemyKilled', (enemyData: IEnemyKillData) => {
            this.enemiesKilled++;
            this.addXP(enemyData.xpValue || 10);
        });

        // Listen for item collection
        this.scene.events.on('itemCollected', (itemType: string) => {
            this.itemsCollected++;
        });
    }

    /**
     * Apply damage to the player
     *
     * @param amount - Amount of damage to take
     */
    public takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
        this.damageTaken += amount;

        // Emit health change event
        this.scene.events.emit('healthChanged', {
            current: this.health,
            max: this.maxHealth
        } as IHealthChangeData);

        if (this.health <= 0) {
            this.scene.events.emit('playerDied');
        }
    }

    /**
     * Heal the player
     *
     * @param amount - Amount of health to restore
     * @returns Actual amount healed (capped by max health)
     */
    public heal(amount: number): number {
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        const actualHeal = this.health - oldHealth;

        if (actualHeal > 0) {
            // Emit health change event
            this.scene.events.emit('healthChanged', {
                current: this.health,
                max: this.maxHealth
            } as IHealthChangeData);

            // Show heal effect
            this.scene.events.emit('playerHealed', actualHeal);
        }

        return actualHeal;
    }

    /**
     * Add experience points and check for level up
     *
     * @param amount - Amount of XP to add
     */
    public addXP(amount: number): void {
        this.xp += amount;

        // Check for level up
        while (this.xp >= this.xpToNext) {
            this.levelUp();
        }

        // Emit XP change event
        this.scene.events.emit('xpChanged', {
            current: this.xp,
            toNext: this.xpToNext,
            level: this.level
        } as IXPChangeData);
    }

    /**
     * Level up the player
     */
    private levelUp(): void {
        this.xp -= this.xpToNext;
        this.level++;

        // Calculate next level requirement
        this.xpToNext = Math.floor(
            LEVEL_CONFIG.baseXPRequired * Math.pow(LEVEL_CONFIG.xpMultiplier, this.level - 1)
        );

        // Emit level up event
        this.scene.events.emit('levelUp', {
            level: this.level,
            shouldSpawnDarkEye: this.level % LEVEL_CONFIG.darkEyeFrequency === 0
        } as ILevelUpData);
    }

    /**
     * Increase maximum health
     *
     * @param amount - Amount to increase max health by (default: 1)
     */
    public increaseMaxHealth(amount: number = 1): void {
        this.maxHealth = Math.min(PLAYER_CONFIG.maxHealth, this.maxHealth + amount);
        this.health = Math.min(this.health + amount, this.maxHealth); // Also heal

        this.scene.events.emit('maxHealthChanged', {
            current: this.health,
            max: this.maxHealth
        } as IHealthChangeData);
    }

    /**
     * Mark an element as discovered
     *
     * @param element - The element to discover
     * @returns True if element was newly discovered, false if already known
     */
    public discoverElement(element: ElementKey): boolean {
        if (!this.discoveredElements.has(element)) {
            this.discoveredElements.add(element);
            this.scene.events.emit('elementDiscovered', element);
            return true;
        }
        return false;
    }

    /**
     * Check if an element has been discovered
     *
     * @param element - The element to check
     * @returns True if discovered
     */
    public hasDiscoveredElement(element: ElementKey): boolean {
        return this.discoveredElements.has(element);
    }

    /**
     * Get all discovered elements
     *
     * @returns Array of discovered element keys
     */
    public getDiscoveredElements(): ElementKey[] {
        return Array.from(this.discoveredElements);
    }

    /**
     * Update survival time
     *
     * @param deltaTime - Time elapsed since last update (in milliseconds)
     */
    public updateSurvivalTime(deltaTime: number): void {
        this.survivalTime += deltaTime;
    }

    /**
     * Record damage dealt by the player
     *
     * @param amount - Amount of damage dealt
     */
    public recordDamageDealt(amount: number): void {
        this.damageDealt += amount;
    }

    /**
     * Get complete player statistics
     *
     * @returns Player stats object
     */
    public getStats(): IPlayerStats {
        return {
            level: this.level,
            health: this.health,
            maxHealth: this.maxHealth,
            xp: this.xp,
            xpToNext: this.xpToNext,
            enemiesKilled: this.enemiesKilled,
            itemsCollected: this.itemsCollected,
            survivalTime: this.survivalTime,
            damageDealt: this.damageDealt,
            damageTaken: this.damageTaken,
            elementsDiscovered: this.discoveredElements.size
        };
    }

    /**
     * Reset all player stats to initial values
     */
    public reset(): void {
        this.health = PLAYER_CONFIG.startingHealth;
        this.maxHealth = PLAYER_CONFIG.startingHealth;
        this.xp = 0;
        this.level = 1;
        this.xpToNext = LEVEL_CONFIG.baseXPRequired;
        this.enemiesKilled = 0;
        this.itemsCollected = 0;
        this.survivalTime = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.discoveredElements.clear();
        this.discoveredElements.add('arcane' as ElementKey);
    }
}
