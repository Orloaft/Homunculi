/**
 * SaveManager - Handles all save/load operations for the game
 * Uses localStorage for persistent storage across sessions
 * Supports multiple save slots with auto-save functionality
 */

class SaveManager {
    constructor() {
        this.MAX_SAVE_SLOTS = 3;
        this.SAVE_KEY_PREFIX = 'wizbiz_save_';
        this.TRANSACTION_KEY_SUFFIX = '_pending';
        this.CURRENT_SAVE_VERSION = '1.0.0';
        this.RELEASE_STAGE_COUNT = 9;
        this.SLOT_STATUS = Object.freeze({
            EMPTY: 'EMPTY',
            VALID: 'VALID',
            CORRUPT: 'CORRUPT',
            INCOMPATIBLE: 'INCOMPATIBLE'
        });
        this.currentSlot = null;
        this.currentSaveData = null;
        this.lastPersistenceError = null;
    }

    /**
     * Get the structure of a new save file
     */
    getEmptySaveData() {
        return {
            version: this.CURRENT_SAVE_VERSION,
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

            // Optional, non-power Resonant Triad discovery. Run loadouts never persist here.
            discovery: {
                disciplines: {}
            },

            triad: {
                attunementSeen: false,
                fusionCostSeen: false,
                flexSeen: false,
                reweaveSeen: false
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
                spellsCast: {}, // { 'fireball': 123, 'lightning': 45 }
                disciplineRuns: {}
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
            slots.push(this.inspectSlot(i));
        }
        return slots;
    }

    /**
     * Get user-friendly metadata from save data
     */
    getSaveMetadata(saveData) {
        if (!saveData) return null;

        const normalized = this.normalizeSaveData(saveData);

        const playTimeHours = Math.floor(normalized.playTime / 3600000);
        const playTimeMinutes = Math.floor((normalized.playTime % 3600000) / 60000);

        return {
            playerLevel: normalized.player.level,
            currentStage: normalized.stages.currentStage || 'New Game',
            completedStages: normalized.stages.completedStages.length,
            lastSaved: new Date(normalized.lastSaved).toLocaleString(),
            playTime: `${playTimeHours}h ${playTimeMinutes}m`,
            progress: this.calculateProgress(normalized)
        };
    }

    /**
     * Calculate overall game completion percentage
     */
    calculateProgress(saveData) {
        const releaseStageIds = new Set([
            'forest-1', 'cave-1', 'sand-1', 'swamp-1', 'snow-1',
            'ocean-1', 'lava-1', 'grave-1', 'castle-1'
        ]);
        const completedStages = new Set(this.normalizeSaveData(saveData).stages.completedStages);
        const releaseStagesCompleted = Array.from(releaseStageIds)
            .filter(stageId => completedStages.has(stageId)).length;
        return Math.floor((releaseStagesCompleted / this.RELEASE_STAGE_COUNT) * 100);
    }

    isPlainObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    cloneValue(value) {
        if (Array.isArray(value)) return value.map(item => this.cloneValue(item));
        if (this.isPlainObject(value)) {
            const clone = {};
            Object.keys(value).forEach(key => { clone[key] = this.cloneValue(value[key]); });
            return clone;
        }
        return value;
    }

    normalizeValue(value, defaultValue) {
        if (Array.isArray(defaultValue)) {
            return Array.isArray(value) ? this.cloneValue(value) : this.cloneValue(defaultValue);
        }
        if (this.isPlainObject(defaultValue)) {
            const source = this.isPlainObject(value) ? value : {};
            const normalized = this.cloneValue(source);
            Object.keys(defaultValue).forEach(key => {
                normalized[key] = this.normalizeValue(source[key], defaultValue[key]);
            });
            return normalized;
        }
        if (defaultValue === null) {
            return value === undefined ? null : this.cloneValue(value);
        }
        if (typeof defaultValue === 'number') {
            return typeof value === 'number' && Number.isFinite(value) ? value : defaultValue;
        }
        if (typeof defaultValue === 'string') {
            return typeof value === 'string' ? value : defaultValue;
        }
        if (typeof defaultValue === 'boolean') {
            return typeof value === 'boolean' ? value : defaultValue;
        }
        return value === undefined ? defaultValue : this.cloneValue(value);
    }

    normalizeSaveData(saveData) {
        if (!this.isPlainObject(saveData)) {
            throw new Error('Save root must be an object');
        }
        const normalized = this.normalizeValue(saveData, this.getEmptySaveData());
        normalized.version = this.CURRENT_SAVE_VERSION;
        normalized.stages.completedStages = Array.from(new Set(normalized.stages.completedStages
            .filter(stageId => typeof stageId === 'string')));
        normalized.stages.unlockedWorlds = Array.from(new Set(normalized.stages.unlockedWorlds
            .filter(worldId => typeof worldId === 'string')));
        if (!normalized.stages.unlockedWorlds.includes('forestland')) {
            normalized.stages.unlockedWorlds.unshift('forestland');
        }
        normalized.characters.unlocked = Array.from(new Set(normalized.characters.unlocked
            .filter(character => typeof character === 'string')));
        if (!normalized.characters.unlocked.includes('wizard')) {
            normalized.characters.unlocked.unshift('wizard');
        }
        return normalized;
    }

    compareVersions(left, right) {
        const parse = version => {
            if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) return null;
            return version.split('.').map(Number);
        };
        const a = parse(left);
        const b = parse(right);
        if (!a || !b) return null;
        for (let i = 0; i < 3; i++) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    inspectSlot(slotNumber) {
        const key = this.SAVE_KEY_PREFIX + slotNumber;
        let rawPayload;
        try {
            rawPayload = localStorage.getItem(key);
        } catch (error) {
            return {
                slotNumber,
                status: this.SLOT_STATUS.CORRUPT,
                isEmpty: false,
                data: null,
                metadata: null,
                rawPayload: null,
                reason: `Storage read failed: ${error.message || error}`
            };
        }

        if (rawPayload === null) {
            return {
                slotNumber,
                status: this.SLOT_STATUS.EMPTY,
                isEmpty: true,
                data: null,
                metadata: null,
                rawPayload: null,
                reason: null
            };
        }

        let parsed;
        try {
            parsed = JSON.parse(rawPayload);
        } catch (error) {
            return {
                slotNumber,
                status: this.SLOT_STATUS.CORRUPT,
                isEmpty: false,
                data: null,
                metadata: null,
                rawPayload,
                reason: 'Malformed JSON'
            };
        }

        if (!this.isPlainObject(parsed)) {
            return {
                slotNumber,
                status: this.SLOT_STATUS.CORRUPT,
                isEmpty: false,
                data: null,
                metadata: null,
                rawPayload,
                reason: 'Save root is not an object'
            };
        }

        if (parsed.version !== undefined) {
            const comparison = this.compareVersions(parsed.version, this.CURRENT_SAVE_VERSION);
            if (comparison === null || comparison > 0) {
                return {
                    slotNumber,
                    status: this.SLOT_STATUS.INCOMPATIBLE,
                    isEmpty: false,
                    data: null,
                    metadata: null,
                    rawPayload,
                    reason: comparison === null
                        ? `Unsupported save version: ${String(parsed.version)}`
                        : `Save version ${parsed.version} is newer than ${this.CURRENT_SAVE_VERSION}`
                };
            }
        }

        try {
            const data = this.normalizeSaveData(parsed);
            return {
                slotNumber,
                status: this.SLOT_STATUS.VALID,
                isEmpty: false,
                data,
                metadata: this.getSaveMetadata(data),
                rawPayload,
                wasMigrated: JSON.stringify(data) !== rawPayload,
                reason: null
            };
        } catch (error) {
            return {
                slotNumber,
                status: this.SLOT_STATUS.CORRUPT,
                isEmpty: false,
                data: null,
                metadata: null,
                rawPayload,
                reason: error.message || String(error)
            };
        }
    }

    /**
     * Load save data from a specific slot
     * @param {number} slotNumber - Slot index (0-2)
     * @returns {Object|null} Save data or null if slot is empty
     */
    loadSlot(slotNumber) {
        const slot = this.inspectSlot(slotNumber);
        if (slot.status !== this.SLOT_STATUS.VALID) return null;
        return slot.data;
    }

    /**
     * Save data to a specific slot
     * @param {number} slotNumber - Slot index (0-2)
     * @param {Object} saveData - Data to save
     * @returns {boolean} Success status
     */
    saveToSlot(slotNumber, saveData) {
        const key = this.SAVE_KEY_PREFIX + slotNumber;
        const transactionKey = key + this.TRANSACTION_KEY_SUFFIX;
        let previousPayload = null;
        try {
            if (!Number.isInteger(slotNumber) || slotNumber < 0 || slotNumber >= this.MAX_SAVE_SLOTS) {
                throw new Error(`Invalid save slot: ${slotNumber}`);
            }
            if (!this.isPlainObject(saveData)) throw new Error('Save data must be an object');

            const occupiedState = this.inspectSlot(slotNumber);
            if (occupiedState.status === this.SLOT_STATUS.CORRUPT ||
                occupiedState.status === this.SLOT_STATUS.INCOMPATIBLE) {
                throw new Error(`Refusing to overwrite ${occupiedState.status.toLowerCase()} slot without explicit reset`);
            }

            previousPayload = localStorage.getItem(key);
            const normalized = this.normalizeSaveData(saveData);
            normalized.lastSaved = Date.now();
            const jsonData = JSON.stringify(normalized);

            // Check if we have space (localStorage has ~5-10MB limit)
            if (jsonData.length > 1000000) { // ~1MB warning
                console.warn('Save data is very large:', jsonData.length, 'bytes');
            }

            // Stage and verify before replacing the last known-good payload.
            localStorage.setItem(transactionKey, jsonData);
            if (localStorage.getItem(transactionKey) !== jsonData) {
                throw new Error('Staged save verification failed');
            }
            localStorage.setItem(key, jsonData);
            if (localStorage.getItem(key) !== jsonData) {
                throw new Error('Committed save verification failed');
            }
            localStorage.removeItem(transactionKey);
            saveData.lastSaved = normalized.lastSaved;
            this.lastPersistenceError = null;
            console.log(`✅ Saved to slot ${slotNumber}`);
            return true;
        } catch (error) {
            try {
                const currentPayload = localStorage.getItem(key);
                if (previousPayload !== null && currentPayload !== previousPayload) {
                    localStorage.setItem(key, previousPayload);
                } else if (previousPayload === null && currentPayload !== null) {
                    localStorage.removeItem(key);
                }
                localStorage.removeItem(transactionKey);
            } catch (cleanupError) {
                console.error('Could not clean save transaction:', cleanupError);
            }
            this.lastPersistenceError = error.message || String(error);
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
            localStorage.removeItem(key + this.TRANSACTION_KEY_SUFFIX);
            if (this.currentSlot === slotNumber) {
                this.currentSlot = null;
                this.currentSaveData = null;
            }
            this.lastPersistenceError = null;
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
        if (this.inspectSlot(slotNumber).status !== this.SLOT_STATUS.EMPTY) {
            this.lastPersistenceError = 'Slot is occupied and must be explicitly reset before starting a new game';
            return null;
        }
        const newSave = this.getEmptySaveData();
        if (!this.saveToSlot(slotNumber, newSave)) return null;
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
        const slot = this.inspectSlot(slotNumber);
        const saveData = slot.status === this.SLOT_STATUS.VALID ? slot.data : null;
        if (saveData) {
            this.currentSlot = slotNumber;
            this.currentSaveData = saveData;
            if (slot.wasMigrated && !this.saveToSlot(slotNumber, saveData)) {
                console.warn(`Loaded slot ${slotNumber}, but normalized migration could not be persisted`);
            }
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
     * Return a stable, UI-friendly snapshot of the active save's alchemy memory.
     */
    getAlchemyReadback() {
        if (!this.currentSaveData) {
            return {
                knownElements: [],
                discoveredRecipes: []
            };
        }

        this.migrateSaveData(this.currentSaveData);

        return {
            knownElements: Array.from(new Set(this.currentSaveData.alchemy.knownElements || [])).sort(),
            discoveredRecipes: (this.currentSaveData.alchemy.discoveredRecipes || [])
                .slice()
                .sort((a, b) => (a.discoveredAt || 0) - (b.discoveredAt || 0))
                .map(recipe => ({
                    key: recipe.key,
                    inputs: Array.isArray(recipe.inputs) ? recipe.inputs.slice().sort() : [],
                    result: recipe.result,
                    discoveredAt: recipe.discoveredAt || null
                }))
        };
    }

    /**
     * Persist additive Resonant Triad discovery through the existing transactional save path.
     * This records knowledge/stat attribution only and never stores run power or inventory.
     */
    recordTriadDiscovery(discipline, update = {}) {
        const allowed = ['crucible', 'tempest', 'bastion', 'covenant'];
        if (!this.currentSaveData || !allowed.includes(discipline)) return false;
        this.migrateSaveData(this.currentSaveData);
        const records = this.currentSaveData.discovery.disciplines;
        const current = this.isPlainObject(records[discipline]) ? records[discipline] : {};
        const next = {
            attuned: Boolean(current.attuned || update.attuned),
            signatureTriggered: Boolean(current.signatureTriggered || update.signatureTriggered),
            wins: Math.max(0, Number(current.wins) || 0) + (update.win ? 1 : 0),
            firstWinAt: current.firstWinAt || (update.win ? (update.at || Date.now()) : null),
            bestMetric: Math.max(Number(current.bestMetric) || 0, Number(update.bestMetric) || 0)
        };
        records[discipline] = next;
        const runRecords = this.currentSaveData.stats.disciplineRuns;
        const run = this.isPlainObject(runRecords[discipline]) ? runRecords[discipline] : { runs: 0, wins: 0 };
        if (update.runComplete) run.runs = Math.max(0, Number(run.runs) || 0) + 1;
        if (update.win) run.wins = Math.max(0, Number(run.wins) || 0) + 1;
        runRecords[discipline] = run;
        return this.autoSave();
    }

    getTriadReadback() {
        if (!this.currentSaveData) return { disciplines: {}, runs: {}, tutorial: {} };
        const normalized = this.normalizeSaveData(this.currentSaveData);
        return {
            disciplines: this.cloneValue(normalized.discovery.disciplines),
            runs: this.cloneValue(normalized.stats.disciplineRuns),
            tutorial: this.cloneValue(normalized.triad)
        };
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
        const normalized = this.normalizeSaveData(saveData);
        Object.keys(saveData).forEach(key => { delete saveData[key]; });
        Object.assign(saveData, normalized);
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

            return this.saveToSlot(slotNumber, this.normalizeSaveData(saveData));
        } catch (error) {
            console.error('Error importing save:', error);
            return false;
        }
    }

    /**
     * Validate save data structure
     */
    validateSaveData(data) {
        if (!this.isPlainObject(data)) return false;
        if (data.version !== undefined) {
            const comparison = this.compareVersions(data.version, this.CURRENT_SAVE_VERSION);
            if (comparison === null || comparison > 0) return false;
        }
        try {
            this.normalizeSaveData(data);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get current save data (read-only)
     */
    getCurrentSave() {
        return this.currentSaveData ? this.cloneValue(this.currentSaveData) : null;
    }

    getLastPersistenceError() {
        return this.lastPersistenceError;
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
