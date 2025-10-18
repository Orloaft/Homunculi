/**
 * SaveSlotScene - UI for managing save slots
 * Allows player to view, select, create, and delete save slots
 */

class SaveSlotScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SaveSlotScene' });
        this.saveManager = null;
        this.selectedSlot = null;
        this.slotButtons = [];
    }

    init(data) {
        // Get SaveManager instance passed from title screen
        this.saveManager = data.saveManager;
        if (!this.saveManager) {
            console.error('SaveManager not provided to SaveSlotScene!');
        }
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x1a1a2e)
            .setOrigin(0, 0);

        // Title
        this.add.text(centerX, 80, 'SELECT SAVE SLOT', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Get all save slots
        const slots = this.saveManager.getAllSaveSlots();

        // Create slot UI elements
        const slotY = 180;
        const slotSpacing = 140;

        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            const y = slotY + (i * slotSpacing);

            this.createSlotUI(slot, centerX, y);
        }

        // Back button
        const backButton = this.add.text(centerX, this.cameras.main.height - 60, 'BACK TO TITLE', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#cccccc',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setColor('#ffffff'))
            .on('pointerout', () => backButton.setColor('#cccccc'))
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.scene.start('TitleScene');
            });

        // Keyboard controls
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('TitleScene');
        });
    }

    /**
     * Create UI for a single save slot
     */
    createSlotUI(slot, centerX, y) {
        const isEmpty = slot.isEmpty;
        const slotNumber = slot.slotNumber + 1; // Display as 1-3 instead of 0-2

        // Slot container background
        const container = this.add.rectangle(centerX, y, 800, 120, isEmpty ? 0x2d2d44 : 0x3a3a5a)
            .setStrokeStyle(2, isEmpty ? 0x4a4a6a : 0x6a6a8a);

        // Slot number
        this.add.text(centerX - 380, y, `SLOT ${slotNumber}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        if (isEmpty) {
            // Empty slot - show "New Game" button
            this.createNewGameButton(slot.slotNumber, centerX, y);
        } else {
            // Existing save - show metadata and buttons
            this.createSaveInfoDisplay(slot, centerX, y);
            this.createContinueButton(slot.slotNumber, centerX + 200, y);
            this.createDeleteButton(slot.slotNumber, centerX + 320, y);
        }
    }

    /**
     * Create "New Game" button for empty slot
     */
    createNewGameButton(slotNumber, centerX, y) {
        const button = this.add.text(centerX, y, 'NEW GAME', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#4ade80',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setColor('#86efac'))
            .on('pointerout', () => button.setColor('#4ade80'))
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.startNewGame(slotNumber);
            });
    }

    /**
     * Display save file metadata
     */
    createSaveInfoDisplay(slot, centerX, y) {
        const metadata = slot.metadata;

        // Player level
        this.add.text(centerX - 280, y - 20, `Level ${metadata.playerLevel}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#fbbf24'
        }).setOrigin(0, 0.5);

        // Current stage or progress
        this.add.text(centerX - 280, y + 10, metadata.currentStage, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#d1d5db'
        }).setOrigin(0, 0.5);

        // Completion percentage
        this.add.text(centerX - 80, y - 20, `${metadata.progress}% Complete`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#60a5fa'
        }).setOrigin(0, 0.5);

        // Play time
        this.add.text(centerX - 80, y + 10, `${metadata.playTime}`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#d1d5db'
        }).setOrigin(0, 0.5);

        // Last saved
        this.add.text(centerX - 280, y + 35, `Last saved: ${metadata.lastSaved}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#9ca3af'
        }).setOrigin(0, 0.5);
    }

    /**
     * Create "Continue" button for existing save
     */
    createContinueButton(slotNumber, x, y) {
        const button = this.add.text(x, y, 'CONTINUE', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#4ade80',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setColor('#86efac'))
            .on('pointerout', () => button.setColor('#4ade80'))
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.continueGame(slotNumber);
            });
    }

    /**
     * Create "Delete" button for existing save
     */
    createDeleteButton(slotNumber, x, y) {
        const button = this.add.text(x, y, 'DELETE', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ef4444',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setColor('#f87171'))
            .on('pointerout', () => button.setColor('#ef4444'))
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.confirmDelete(slotNumber);
            });
    }

    /**
     * Start a new game in the selected slot
     */
    startNewGame(slotNumber) {
        console.log(`Creating new save in slot ${slotNumber}`);

        // Create new save
        const newSave = this.saveManager.createNewSave(slotNumber);

        // Initialize AchievementManager with the SaveManager
        const achievementManager = new AchievementManager(this.saveManager);

        // Store both managers in the registry for other scenes
        this.registry.set('saveManager', this.saveManager);
        this.registry.set('achievementManager', achievementManager);

        console.log('✅ Initialized AchievementManager');

        // Start the game with character selection
        this.scene.start('StageSelectScene', {
            saveManager: this.saveManager,
            newGame: true,
            fromTitle: true  // This triggers character selection mode
        });
    }

    /**
     * Continue existing game from selected slot
     */
    continueGame(slotNumber) {
        console.log(`Loading save from slot ${slotNumber}`);

        // Load the save
        const saveData = this.saveManager.loadAndSetCurrent(slotNumber);

        if (!saveData) {
            console.error('Failed to load save data!');
            return;
        }

        // Initialize AchievementManager with the SaveManager
        const achievementManager = new AchievementManager(this.saveManager);

        // Store both managers in the registry for other scenes
        this.registry.set('saveManager', this.saveManager);
        this.registry.set('achievementManager', achievementManager);

        console.log('✅ Loaded save and initialized AchievementManager');

        // Determine where to start based on save data
        if (saveData.stages.currentStage) {
            // Resume from stage select (skip character selection)
            this.scene.start('StageSelectScene', {
                saveManager: this.saveManager,
                resuming: true,
                fromCharacterSelect: true  // Skip character selection for continue
            });
        } else {
            // Fresh save, start from beginning with character selection
            this.scene.start('StageSelectScene', {
                saveManager: this.saveManager,
                newGame: true,
                fromTitle: true  // This triggers character selection mode
            });
        }
    }

    /**
     * Confirm deletion with a modal dialog
     */
    confirmDelete(slotNumber) {
        // Create modal overlay
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7)
            .setOrigin(0, 0)
            .setInteractive();

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Modal background
        const modal = this.add.rectangle(centerX, centerY, 500, 250, 0x2d2d44)
            .setStrokeStyle(3, 0xef4444);

        // Warning text
        this.add.text(centerX, centerY - 60, 'DELETE SAVE FILE?', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ef4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 10, 'This action cannot be undone!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Confirm button
        const confirmButton = this.add.text(centerX - 80, centerY + 60, 'DELETE', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ef4444',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => confirmButton.setColor('#f87171'))
            .on('pointerout', () => confirmButton.setColor('#ef4444'))
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.deleteSlot(slotNumber);
                // Close modal and refresh
                overlay.destroy();
                modal.destroy();
                confirmButton.destroy();
                cancelButton.destroy();
                this.scene.restart();
            });

        // Cancel button
        const cancelButton = this.add.text(centerX + 80, centerY + 60, 'CANCEL', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#d1d5db',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => cancelButton.setColor('#ffffff'))
            .on('pointerout', () => cancelButton.setColor('#d1d5db'))
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                overlay.destroy();
                modal.destroy();
                confirmButton.destroy();
                cancelButton.destroy();
            });
    }

    /**
     * Delete a save slot
     */
    deleteSlot(slotNumber) {
        console.log(`Deleting save slot ${slotNumber}`);
        this.saveManager.deleteSlot(slotNumber);
    }
}

// Make SaveSlotScene globally available
if (typeof window !== 'undefined') {
    window.SaveSlotScene = SaveSlotScene;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSlotScene;
}
