import { PLAYER_CONFIG, LEVEL_CONFIG } from '../../data/GameConstants.js';
export class PlayerStats {
    constructor(scene) {
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
        this.discoveredElements = new Set(['arcane']); // Start with arcane discovered
        this.setupEventListeners();
    }
    setupEventListeners() {
        // Listen for damage events
        this.scene.events.on('playerDamaged', (amount) => {
            this.takeDamage(amount);
        });
        // Listen for enemy kill events
        this.scene.events.on('enemyKilled', (enemyData) => {
            this.enemiesKilled++;
            this.addXP(enemyData.xpValue || 10);
        });
        // Listen for item collection
        this.scene.events.on('itemCollected', (itemType) => {
            this.itemsCollected++;
        });
    }
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        this.damageTaken += amount;
        // Emit health change event
        this.scene.events.emit('healthChanged', {
            current: this.health,
            max: this.maxHealth
        });
        if (this.health <= 0) {
            this.scene.events.emit('playerDied');
        }
    }
    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        const actualHeal = this.health - oldHealth;
        if (actualHeal > 0) {
            // Emit health change event
            this.scene.events.emit('healthChanged', {
                current: this.health,
                max: this.maxHealth
            });
            // Show heal effect
            this.scene.events.emit('playerHealed', actualHeal);
        }
        return actualHeal;
    }
    addXP(amount) {
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
        });
    }
    levelUp() {
        this.xp -= this.xpToNext;
        this.level++;
        // Calculate next level requirement
        this.xpToNext = Math.floor(LEVEL_CONFIG.baseXPRequired * Math.pow(LEVEL_CONFIG.xpMultiplier, this.level - 1));
        // Emit level up event
        this.scene.events.emit('levelUp', {
            level: this.level,
            shouldSpawnDarkEye: this.level % LEVEL_CONFIG.darkEyeFrequency === 0
        });
        }
    increaseMaxHealth(amount = 1) {
        this.maxHealth = Math.min(PLAYER_CONFIG.maxHealth, this.maxHealth + amount);
        this.health = Math.min(this.health + amount, this.maxHealth); // Also heal
        this.scene.events.emit('maxHealthChanged', {
            current: this.health,
            max: this.maxHealth
        });
    }
    discoverElement(element) {
        if (!this.discoveredElements.has(element)) {
            this.discoveredElements.add(element);
            this.scene.events.emit('elementDiscovered', element);
            return true;
        }
        return false;
    }
    hasDiscoveredElement(element) {
        return this.discoveredElements.has(element);
    }
    getDiscoveredElements() {
        return Array.from(this.discoveredElements);
    }
    updateSurvivalTime(deltaTime) {
        this.survivalTime += deltaTime;
    }
    recordDamageDealt(amount) {
        this.damageDealt += amount;
    }
    getStats() {
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
    reset() {
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
        this.discoveredElements.add('arcane');
    }
}