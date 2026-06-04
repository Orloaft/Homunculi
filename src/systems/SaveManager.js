/**
 * SaveManager - Handles all save/load operations for the game
 * Uses localStorage for persistent storage across sessions
 * Supports multiple save slots with auto-save functionality
 */

class SaveManager {
    constructor() {
        this.MAX_SAVE_SLOTS = 3;
        this.SAVE_KEY_PREFIX = 'wizbiz_save_';
        this.currentSlot = null;
        this.currentSaveData = null;
    }

    /**
     * Get the structure of a new save file
     */
    getEmptySaveData() {
        return {
            version: '1.0.0',
            createdAt: Date.now(),
            lastSaved: Date.now(),
            playTime: 0, // Total play time in milliseconds

            // Player progress
            player: {
                level: 1,
                experience: 0,
                health: 100,
                maxHealth: 100,
                mana: 100,
                maxMana: 100,
                gold: 0,
                element: 'neutral' // Current equipped element
            },

            // Stage progression
            stages: {
                currentStage: null, // e.g., 'forestland-1'
                completedStages: [], // Array of completed stage IDs
                stageStats: {}, // { 'forestland-1': { attempts: 3, bestTime: 12345, deaths: 2 } }
                unlockedWorlds: ['forestland'] // Worlds the player has access to
            },

            // Inventory and equipment
            inventory: {
                spells: ['fireball'], // Unlocked spells
                items: [], // { id: 'health-potion', quantity: 5 }
                equipment: {
                    weapon: null,
                    armor: null,
                    accessory: null
                }
            },

            // Alchemy grimoire
            alchemy: {
                knownElements: ['fire'],
                discoveredRecipes: [] // { inputs: ['fire', 'earth'], result: 'lava', discoveredAt: 1700000000000 }
            },

            // Character unlocks
            characters: {
                unlocked: ['wizard'] // Only wizard (Veiled Custodian/Alchemist) unlocked by default
            },

            // Upgrades and abilities
            upgrades: {
                healthUpgrades: 0,
                manaUpgrades: 0,
                damageUpgrades: 0,
                speedUpgrades: 0,
                abilities: [] // Unlocked special abilities
            },

            // Talent system
            talents: {
                essence: 0, // Talent points for spending in nexus
                unlockedTalents: [] // Array of unlocked talent node IDs
            },

            // Settings (per-save)
            settings: {
                difficulty: 'normal' // easy, normal, hard
            },

            // Achievements tracking (per-save)
            achievements: {
                unlocked: [], // Array of achievement IDs
                progress: {} // { 'achievement-id': currentProgress }
            },

            // Statistics
            stats: {
                totalEnemiesDefeated: 0,
                totalBossesDefeated: 0,
                totalDeaths: 0,
                totalGoldCollected: 0,
                totalDamageTaken: 0,
                totalDamageDealt: 0,
                favoriteSpell: null,
                spellsCast: {} // { 'fireball': 123, 'lightning': 45 }
            }
        };
    }

    /**
     * Get all save slots with their metadata
     * @returns {Array} Array of save slot objects
     */
    getAllSaveSlots() {
        const slots = [];
        for (let i = 0; i < this.MAX_SAVE_SLOTS; i++) {
            const slotData = this.loadSlot(i);
            slots.push({
                slotNumber: i,
                isEmpty: !slotData,
                data: slotData,
                metadata: slotData ? this.getSaveMetadata(slotData) : null
            });
        }
        return slots;
    }

    /**
     * Get user-friendly metadata from save data
     */
    getSaveMetadata(saveData) {
        if (!saveData) return null;

        const playTimeHours = Math.floor(saveData.playTime / 3600000);
        const playTimeMinutes = Math.floor((saveData.playTime % 3600000) / 60000);

        return {
            playerLevel: saveData.player.level,
            currentStage: saveData.stages.currentStage || 'New Game',
            completedStages: saveData.stages.completedStages.length,
            lastSaved: new Date(saveData.lastSaved).toLocaleString(),
            playTime: `${playTimeHours}h ${playTimeMinutes}m`,
            progress: this.calculateProgress(saveData)
        };
    }

    /**
     * Calculate overall game completion percentage
     */
    calculateProgress(saveData) {
        // This can be customized based on what counts as "completion"
        const totalStages = 50; // Update with actual total
        const completedStages = saveData.stages.completedStages.length;
        return Math.floor((completedStages / totalStages) * 100);
    }

    /**
     * Load save data from a specific slot
     * @param {number} slotNumber - Slot index (0-2)
     * @returns {Object|null} Save data or null if slot is empty
     */
    loadSlot(slotNumber) {
        try {
            const key = this.SAVE_KEY_PREFIX + slotNumber;
            const data = localStorage.getItem(key);
            if (!data) return null;

            const saveData = JSON.parse(data);

            // Version migration if needed
            return this.migrateSaveData(saveData);
        } catch (error) {
            console.error(`Error loading slot ${slotNumber}:`, error);
            return null;
        }
    }

    /**
     * Save data to a specific slot
     * @param {number} slotNumber - Slot index (0-2)
     * @param {Object} saveData - Data to save
     * @returns {boolean} Success status
     */
    saveToSlot(slotNumber, saveData) {
        try {
            // Update last saved timestamp
            saveData.lastSaved = Date.now();

            const key = this.SAVE_KEY_PREFIX + slotNumber;
            const jsonData = JSON.stringify(saveData);

            // Check if we have space (localStorage has ~5-10MB limit)
            if (jsonData.length > 1000000) { // ~1MB warning
                console.warn('Save data is very large:', jsonData.length, 'bytes');
            }

            localStorage.setItem(key, jsonData);
            console.log(`✅ Saved to slot ${slotNumber}`);
            return true;
        } catch (error) {
            console.error(`❌ Error saving to slot ${slotNumber}:`, error);
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded!');
            }
            return false;
        }
    }

    /**
     * Delete a save slot
     * @param {number} slotNumber - Slot index to delete
     */
    deleteSlot(slotNumber) {
        try {
            const key = this.SAVE_KEY_PREFIX + slotNumber;
            localStorage.removeItem(key);
            console.log(`🗑️ Deleted slot ${slotNumber}`);
            return true;
        } catch (error) {
            console.error(`Error deleting slot ${slotNumber}:`, error);
            return false;
        }
    }

    /**
     * Create a new save in a specific slot
     * @param {number} slotNumber - Slot index
     * @returns {Object} New save data
     */
    createNewSave(slotNumber) {
        const newSave = this.getEmptySaveData();
        this.saveToSlot(slotNumber, newSave);
        this.currentSlot = slotNumber;
        this.currentSaveData = newSave;
        return newSave;
    }

    /**
     * Load a save and set it as current
     * @param {number} slotNumber - Slot index
     * @returns {Object|null} Loaded save data
     */
    loadAndSetCurrent(slotNumber) {
        const saveData = this.loadSlot(slotNumber);
        if (saveData) {
            this.currentSlot = slotNumber;
            this.currentSaveData = saveData;
            console.log(`📂 Loaded save from slot ${slotNumber}`);
        }
        return saveData;
    }

    /**
     * Auto-save current game state
     * Should be called after completing a stage
     */
    autoSave() {
        if (this.currentSlot === null || !this.currentSaveData) {
            console.warn('Cannot auto-save: No active save slot');
            return false;
        }

        return this.saveToSlot(this.currentSlot, this.currentSaveData);
    }

    /**
     * Permanently record an alchemy recipe on the active save.
     */
    recordAlchemyRecipe(inputA, inputB, result) {
        if (!this.currentSaveData || !inputA || !inputB || !result) {
            return false;
        }

        this.migrateSaveData(this.currentSaveData);
        const inputs = [inputA, inputB].sort();
        const recipeKey = `${inputs.join('+')}=${result}`;
        const recipes = this.currentSaveData.alchemy.discoveredRecipes;

        if (recipes.some(recipe => recipe.key === recipeKey)) {
            return false;
        }

        this.currentSaveData.alchemy.knownElements = Array.from(new Set([
            ...this.currentSaveData.alchemy.knownElements,
            inputA,
            inputB,
            result
        ])).sort();
        recipes.push({
            key: recipeKey,
            inputs,
            result,
            discoveredAt: Date.now()
        });

        return true;
    }

    /**
     * Update current save data
     * @param {Object} updates - Partial save data to merge
     */
    updateSave(updates) {
        if (!this.currentSaveData) {
            console.warn('No current save data to update');
            return;
        }

        // Deep merge updates into current save
        this.deepMerge(this.currentSaveData, updates);
    }

    /**
     * Deep merge utility
     */
    deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    /**
     * Handle save data version migration
     */
    migrateSaveData(saveData) {
        // Example: Migrate from old versions to new versions
        if (!saveData.version) {
            // Very old save, migrate to v1.0.0
            saveData.version = '1.0.0';
            // Add any missing fields
        }

        if (!saveData.alchemy) {
            saveData.alchemy = {};
        }
        if (!Array.isArray(saveData.alchemy.knownElements)) {
            saveData.alchemy.knownElements = ['fire'];
        }
        if (!Array.isArray(saveData.alchemy.discoveredRecipes)) {
            saveData.alchemy.discoveredRecipes = [];
        }

        // Add more migration logic as game evolves
        return saveData;
    }

    /**
     * Export save data as JSON file (for backup)
     */
    exportSave(slotNumber) {
        const saveData = this.loadSlot(slotNumber);
        if (!saveData) {
            console.error('No save data to export');
            return;
        }

        const dataStr = JSON.stringify(saveData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wizbiz_save_slot${slotNumber}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import save data from JSON file
     */
    async importSave(file, slotNumber) {
        try {
            const text = await file.text();
            const saveData = JSON.parse(text);

            // Validate save data structure
            if (!this.validateSaveData(saveData)) {
                throw new Error('Invalid save data format');
            }

            this.saveToSlot(slotNumber, saveData);
            return true;
        } catch (error) {
            console.error('Error importing save:', error);
            return false;
        }
    }

    /**
     * Validate save data structure
     */
    validateSaveData(data) {
        // Basic validation - can be expanded
        return data &&
               typeof data.version === 'string' &&
               data.player &&
               data.stages &&
               data.inventory;
    }

    /**
     * Get current save data (read-only)
     */
    getCurrentSave() {
        return this.currentSaveData ? { ...this.currentSaveData } : null;
    }

    /**
     * Get current slot number
     */
    getCurrentSlot() {
        return this.currentSlot;
    }

    /**
     * Track play time (call this periodically in update loop)
     */
    updatePlayTime(deltaTime) {
        if (this.currentSaveData) {
            this.currentSaveData.playTime += deltaTime;
        }
    }
}

// Make SaveManager globally available
if (typeof window !== 'undefined') {
    window.SaveManager = SaveManager;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveManager;
}
