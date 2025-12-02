/**
 * AchievementManager - Handles achievement tracking and unlocking
 * Follows best practices for achievement systems:
 * - Event-driven architecture
 * - Progress tracking
 * - Notification system
 * - Multiple achievement types
 */

/**
 * Achievement type categories
 */
type AchievementType = 'story' | 'combat' | 'collection' | 'mastery' | 'secret';

/**
 * Achievement reward structure
 */
interface IAchievementReward {
    gold?: number;
    items?: string[];
}

/**
 * Achievement progress tracking
 */
interface IAchievementProgress {
    current: (save: ISaveData) => number;
    target: number;
}

/**
 * Progress result
 */
interface IProgressResult {
    current: number;
    target: number;
    percentage: number;
}

/**
 * Achievement definition
 */
interface IAchievement {
    id: string;
    name: string;
    description: string;
    displayName?: string;
    displayDescription?: string;
    icon: string;
    type: AchievementType;
    condition: (save: ISaveData) => boolean;
    progress?: IAchievementProgress;
    reward?: IAchievementReward;
    hidden?: boolean;
}

/**
 * Achievement with unlock status
 */
interface IAchievementWithStatus {
    id: string;
    name: string;
    description: string;
    displayName?: string;
    displayDescription?: string;
    icon: string;
    type: AchievementType;
    condition: (save: ISaveData) => boolean;
    progress: IProgressResult | null;
    reward?: IAchievementReward;
    hidden?: boolean;
    unlocked: boolean;
    unlockedAt: number | null;
}

/**
 * Achievement notification
 */
interface IAchievementNotification {
    type: 'achievement';
    achievement: IAchievement;
    timestamp: number;
}

/**
 * Completion statistics
 */
interface ICompletionStats {
    unlocked: number;
    total: number;
    percentage: number;
    byType: {
        story: number;
        combat: number;
        collection: number;
        mastery: number;
        secret: number;
    };
}

/**
 * Save data interface (minimal structure needed for achievements)
 */
interface ISaveData {
    stages: {
        completedStages: string[];
        unlockedWorlds: string[];
        stageStats: Record<string, { bestTime: number }>;
    };
    stats: {
        totalEnemiesDefeated: number;
        totalBossesDefeated: number;
        totalGoldCollected: number;
        totalDeaths: number;
        totalDamageDealt: number;
        totalDamageTaken: number;
        spellsCast: Record<string, number>;
    };
    inventory: {
        spells: string[];
    };
    achievements: {
        unlocked: string[];
        progress: Record<string, any>;
        unlockedAt?: Record<string, number>;
    };
    playTime: number;
    player: {
        gold: number;
    };
}

/**
 * Save manager interface
 */
interface ISaveManager {
    getCurrentSave(): ISaveData | null;
    currentSaveData: ISaveData;
    updateSave(data: any): void;
}

/**
 * Achievement Manager - Manages all game achievements
 */
class AchievementManager {
    private saveManager: ISaveManager;
    private achievements: Record<string, IAchievement>;
    private listeners: Array<(notification: IAchievementNotification) => void>;
    private notificationQueue: IAchievementNotification[];

    constructor(saveManager: ISaveManager) {
        this.saveManager = saveManager;
        this.achievements = this.defineAchievements();
        this.listeners = [];
        this.notificationQueue = [];
    }

    /**
     * Define all achievements in the game
     * Each achievement has:
     * - id: Unique identifier
     * - name: Display name
     * - description: What the player needs to do
     * - icon: Icon identifier
     * - type: Type of achievement (story, combat, collection, mastery, secret)
     * - condition: Function that checks if unlocked
     * - progress: Optional progress tracking
     * - reward: Optional reward (gold, items, etc.)
     * - hidden: Whether achievement is hidden until unlocked
     */
    private defineAchievements(): Record<string, IAchievement> {
        return {
            // ===== STORY ACHIEVEMENTS =====
            'first-steps': {
                id: 'first-steps',
                name: 'First Steps',
                description: 'Complete the first stage',
                icon: 'achievement_first_steps',
                type: 'story',
                condition: (save) => save.stages.completedStages.includes('forestland-1'),
                reward: { gold: 100 }
            },

            'world-traveler': {
                id: 'world-traveler',
                name: 'World Traveler',
                description: 'Unlock all worlds',
                icon: 'achievement_worlds',
                type: 'story',
                condition: (save) => save.stages.unlockedWorlds.length >= 5,
                progress: {
                    current: (save) => save.stages.unlockedWorlds.length,
                    target: 5
                }
            },

            'true-wizard': {
                id: 'true-wizard',
                name: 'True Wizard',
                description: 'Complete all stages',
                icon: 'achievement_complete',
                type: 'story',
                condition: (save) => save.stages.completedStages.length >= 50,
                progress: {
                    current: (save) => save.stages.completedStages.length,
                    target: 50
                }
            },

            // ===== COMBAT ACHIEVEMENTS =====
            'monster-hunter': {
                id: 'monster-hunter',
                name: 'Monster Hunter',
                description: 'Defeat 100 enemies',
                icon: 'achievement_hunter',
                type: 'combat',
                condition: (save) => save.stats.totalEnemiesDefeated >= 100,
                progress: {
                    current: (save) => save.stats.totalEnemiesDefeated,
                    target: 100
                },
                reward: { gold: 500 }
            },

            'monster-slayer': {
                id: 'monster-slayer',
                name: 'Monster Slayer',
                description: 'Defeat 1000 enemies',
                icon: 'achievement_slayer',
                type: 'combat',
                condition: (save) => save.stats.totalEnemiesDefeated >= 1000,
                progress: {
                    current: (save) => save.stats.totalEnemiesDefeated,
                    target: 1000
                },
                reward: { gold: 2000 }
            },

            'boss-crusher': {
                id: 'boss-crusher',
                name: 'Boss Crusher',
                description: 'Defeat 10 bosses',
                icon: 'achievement_boss',
                type: 'combat',
                condition: (save) => save.stats.totalBossesDefeated >= 10,
                progress: {
                    current: (save) => save.stats.totalBossesDefeated,
                    target: 10
                }
            },

            'untouchable': {
                id: 'untouchable',
                name: 'Untouchable',
                description: 'Complete a stage without taking damage',
                icon: 'achievement_untouchable',
                type: 'combat',
                condition: (save) => save.achievements.progress['untouchable'] === true,
                hidden: false
            },

            'speed-runner': {
                id: 'speed-runner',
                name: 'Speed Runner',
                description: 'Complete any stage in under 2 minutes',
                icon: 'achievement_speed',
                type: 'combat',
                condition: (save) => {
                    return Object.values(save.stages.stageStats).some(stat => stat.bestTime < 120000);
                }
            },

            // ===== COLLECTION ACHIEVEMENTS =====
            'spell-collector': {
                id: 'spell-collector',
                name: 'Spell Collector',
                description: 'Unlock all spells',
                icon: 'achievement_spells',
                type: 'collection',
                condition: (save) => save.inventory.spells.length >= 10,
                progress: {
                    current: (save) => save.inventory.spells.length,
                    target: 10
                }
            },

            'treasure-hunter': {
                id: 'treasure-hunter',
                name: 'Treasure Hunter',
                description: 'Collect 10,000 gold',
                icon: 'achievement_gold',
                type: 'collection',
                condition: (save) => save.stats.totalGoldCollected >= 10000,
                progress: {
                    current: (save) => save.stats.totalGoldCollected,
                    target: 10000
                }
            },

            // ===== MASTERY ACHIEVEMENTS =====
            'pyromancer': {
                id: 'pyromancer',
                name: 'Pyromancer',
                description: 'Cast Fireball 500 times',
                icon: 'achievement_fire',
                type: 'mastery',
                condition: (save) => (save.stats.spellsCast['fireball'] || 0) >= 500,
                progress: {
                    current: (save) => save.stats.spellsCast['fireball'] || 0,
                    target: 500
                }
            },

            'storm-caller': {
                id: 'storm-caller',
                name: 'Storm Caller',
                description: 'Cast Lightning 500 times',
                icon: 'achievement_lightning',
                type: 'mastery',
                condition: (save) => (save.stats.spellsCast['lightning'] || 0) >= 500,
                progress: {
                    current: (save) => save.stats.spellsCast['lightning'] || 0,
                    target: 500
                }
            },

            'survivalist': {
                id: 'survivalist',
                name: 'Survivalist',
                description: 'Play for 10 hours',
                icon: 'achievement_time',
                type: 'mastery',
                condition: (save) => save.playTime >= 36000000, // 10 hours in ms
                progress: {
                    current: (save) => Math.floor(save.playTime / 3600000), // hours
                    target: 10
                }
            },

            // ===== SECRET ACHIEVEMENTS =====
            'persistent': {
                id: 'persistent',
                name: '???',
                description: 'Die 100 times',
                displayName: 'Persistent',
                displayDescription: 'Die 100 times (Don\'t give up!)',
                icon: 'achievement_persist',
                type: 'secret',
                hidden: true,
                condition: (save) => save.stats.totalDeaths >= 100,
                progress: {
                    current: (save) => save.stats.totalDeaths,
                    target: 100
                }
            },

            'glass-cannon': {
                id: 'glass-cannon',
                name: '???',
                description: 'A hidden achievement',
                displayName: 'Glass Cannon',
                displayDescription: 'Deal 1,000,000 damage while taking less than 100 total damage',
                icon: 'achievement_secret',
                type: 'secret',
                hidden: true,
                condition: (save) => {
                    return save.stats.totalDamageDealt >= 1000000 &&
                           save.stats.totalDamageTaken < 100;
                }
            }
        };
    }

    /**
     * Check if an achievement is unlocked
     *
     * @param achievementId - Achievement identifier
     * @returns True if unlocked
     */
    public isUnlocked(achievementId: string): boolean {
        const save = this.saveManager.getCurrentSave();
        if (!save) return false;

        return save.achievements.unlocked.includes(achievementId);
    }

    /**
     * Get achievement progress
     *
     * @param achievementId - Achievement identifier
     * @returns Progress data or null
     */
    public getProgress(achievementId: string): IProgressResult | null {
        const achievement = this.achievements[achievementId];
        if (!achievement || !achievement.progress) return null;

        const save = this.saveManager.getCurrentSave();
        if (!save) return null;

        const current = achievement.progress.current(save);
        const target = achievement.progress.target;

        return {
            current,
            target,
            percentage: Math.min(100, Math.floor((current / target) * 100))
        };
    }

    /**
     * Check all achievements and unlock any that meet conditions
     * Returns array of newly unlocked achievements
     *
     * @returns Array of newly unlocked achievements
     */
    public checkAchievements(): IAchievement[] {
        const save = this.saveManager.getCurrentSave();
        if (!save) return [];

        const newlyUnlocked: IAchievement[] = [];

        for (const [id, achievement] of Object.entries(this.achievements)) {
            // Skip if already unlocked
            if (this.isUnlocked(id)) continue;

            // Check condition
            if (achievement.condition(save)) {
                this.unlockAchievement(id);
                newlyUnlocked.push(achievement);
            }
        }

        return newlyUnlocked;
    }

    /**
     * Manually unlock an achievement
     *
     * @param achievementId - Achievement identifier
     * @returns True if unlocked successfully
     */
    public unlockAchievement(achievementId: string): boolean {
        const achievement = this.achievements[achievementId];
        if (!achievement) {
            console.warn(`Achievement ${achievementId} not found`);
            return false;
        }

        if (this.isUnlocked(achievementId)) {
            console.log(`Achievement ${achievementId} already unlocked`);
            return false;
        }

        // Add to unlocked list
        this.saveManager.updateSave({
            achievements: {
                unlocked: [...this.saveManager.currentSaveData.achievements.unlocked, achievementId]
            }
        });

        // Grant reward if any
        if (achievement.reward) {
            this.grantReward(achievement.reward);
        }

        // Notify listeners
        this.notifyUnlock(achievement);

        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
        return true;
    }

    /**
     * Update achievement progress (for custom tracking)
     *
     * @param achievementId - Achievement identifier
     * @param progress - Progress value
     */
    public updateProgress(achievementId: string, progress: any): void {
        this.saveManager.updateSave({
            achievements: {
                progress: {
                    [achievementId]: progress
                }
            }
        });

        // Check if this update unlocks the achievement
        this.checkAchievements();
    }

    /**
     * Grant achievement reward
     *
     * @param reward - Reward to grant
     */
    private grantReward(reward: IAchievementReward): void {
        if (reward.gold) {
            this.saveManager.updateSave({
                player: {
                    gold: this.saveManager.currentSaveData.player.gold + reward.gold
                }
            });
            console.log(`💰 Awarded ${reward.gold} gold`);
        }

        if (reward.items) {
            // Add items to inventory
            reward.items.forEach(item => {
                // Implementation depends on inventory system
                console.log(`📦 Awarded item: ${item}`);
            });
        }
    }

    /**
     * Notify listeners of achievement unlock
     *
     * @param achievement - Unlocked achievement
     */
    private notifyUnlock(achievement: IAchievement): void {
        const notification: IAchievementNotification = {
            type: 'achievement',
            achievement: achievement,
            timestamp: Date.now()
        };

        this.notificationQueue.push(notification);
        this.listeners.forEach(callback => callback(notification));
    }

    /**
     * Register a listener for achievement unlocks
     *
     * @param callback - Callback function
     */
    public onAchievementUnlock(callback: (notification: IAchievementNotification) => void): void {
        this.listeners.push(callback);
    }

    /**
     * Get all achievements with their status
     *
     * @returns Array of achievements with unlock status
     */
    public getAllAchievements(): IAchievementWithStatus[] {
        const save = this.saveManager.getCurrentSave();

        return Object.values(this.achievements).map(achievement => {
            const unlocked = this.isUnlocked(achievement.id);
            const progress = this.getProgress(achievement.id);

            // For hidden achievements, mask name/description until unlocked
            const displayData = (achievement.hidden && !unlocked) ? {
                name: achievement.name, // '???'
                description: achievement.description // 'A hidden achievement'
            } : {
                name: achievement.displayName || achievement.name,
                description: achievement.displayDescription || achievement.description
            };

            return {
                ...achievement,
                ...displayData,
                unlocked,
                progress,
                unlockedAt: unlocked ? save?.achievements?.unlockedAt?.[achievement.id] || null : null
            };
        });
    }

    /**
     * Get achievements by type
     *
     * @param type - Achievement type
     * @returns Array of achievements of the specified type
     */
    public getAchievementsByType(type: AchievementType): IAchievementWithStatus[] {
        return this.getAllAchievements().filter(a => a.type === type);
    }

    /**
     * Get completion statistics
     *
     * @returns Completion statistics
     */
    public getCompletionStats(): ICompletionStats {
        const allAchievements = this.getAllAchievements();
        const unlocked = allAchievements.filter(a => a.unlocked).length;
        const total = allAchievements.length;
        const percentage = Math.floor((unlocked / total) * 100);

        return {
            unlocked,
            total,
            percentage,
            byType: {
                story: this.getAchievementsByType('story').filter(a => a.unlocked).length,
                combat: this.getAchievementsByType('combat').filter(a => a.unlocked).length,
                collection: this.getAchievementsByType('collection').filter(a => a.unlocked).length,
                mastery: this.getAchievementsByType('mastery').filter(a => a.unlocked).length,
                secret: this.getAchievementsByType('secret').filter(a => a.unlocked).length
            }
        };
    }

    /**
     * Get next pending achievement queue for display
     *
     * @returns Array of pending notifications
     */
    public getNotificationQueue(): IAchievementNotification[] {
        return this.notificationQueue;
    }

    /**
     * Clear notification queue
     */
    public clearNotifications(): void {
        this.notificationQueue = [];
    }
}

// Make AchievementManager globally available for browser script loading
if (typeof window !== 'undefined') {
    (window as any).AchievementManager = AchievementManager;
    console.log('✅ AchievementManager loaded and globally exported');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementManager;
}
