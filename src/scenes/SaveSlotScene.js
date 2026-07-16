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
        this.selectedButtonIndex = 0;
        this.buttonList = []; // Stores all selectable buttons in order
    }

    init(data) {
        // Get SaveManager instance passed from title screen
        this.saveManager = data.saveManager;
        if (!this.saveManager) {
            console.error('SaveManager not provided to SaveSlotScene!');
        }
    }

    create() {
        // Reset state
        this.buttonList = [];
        this.selectedButtonIndex = 0;
        this.modalActive = false;
        this.modalData = null;

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
            .on('pointerover', () => {
                this.selectedButtonIndex = this.buttonList.findIndex(b => b === backButton);
                this.updateButtonSelection();
            })
            .on('pointerout', () => {
                // Keep selection visible
            })
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.scene.start('TitleScene');
            });

        // Store back button data
        backButton.buttonData = {
            type: 'back',
            action: () => this.scene.start('TitleScene'),
            defaultColor: '#cccccc',
            hoverColor: '#ffffff'
        };
        this.buttonList.push(backButton);

        // Set initial selection
        this.updateButtonSelection();

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('TitleScene');
        });
    }

    update() {
        // Handle modal navigation if modal is active
        if (this.modalActive && this.modalData) {
            this.handleModalNavigation();
            return;
        }

        // Handle keyboard navigation
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.selectedButtonIndex = (this.selectedButtonIndex - 1 + this.buttonList.length) % this.buttonList.length;
            this.updateButtonSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.selectedButtonIndex = (this.selectedButtonIndex + 1) % this.buttonList.length;
            this.updateButtonSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.selectCurrentButton();
        }

        // Handle controller navigation
        const gamepads = this.input.gamepad ? this.input.gamepad.gamepads : [];
        for (let i = 0; i < gamepads.length; i++) {
            const pad = gamepads[i];
            if (!pad) continue;

            // D-pad up
            const upPressed = pad.buttons[12] && pad.buttons[12].pressed;
            if (upPressed && !this.prevUpPressed) {
                this.selectedButtonIndex = (this.selectedButtonIndex - 1 + this.buttonList.length) % this.buttonList.length;
                this.updateButtonSelection();
            }
            this.prevUpPressed = upPressed;

            // D-pad down
            const downPressed = pad.buttons[13] && pad.buttons[13].pressed;
            if (downPressed && !this.prevDownPressed) {
                this.selectedButtonIndex = (this.selectedButtonIndex + 1) % this.buttonList.length;
                this.updateButtonSelection();
            }
            this.prevDownPressed = downPressed;

            // Left stick vertical
            if (pad.leftStick.y < -0.5 && !this.upStickPressed) {
                this.selectedButtonIndex = (this.selectedButtonIndex - 1 + this.buttonList.length) % this.buttonList.length;
                this.updateButtonSelection();
                this.upStickPressed = true;
            } else if (pad.leftStick.y > 0.5 && !this.downStickPressed) {
                this.selectedButtonIndex = (this.selectedButtonIndex + 1) % this.buttonList.length;
                this.updateButtonSelection();
                this.downStickPressed = true;
            }

            // Reset stick pressed state when stick returns to center
            if (Math.abs(pad.leftStick.y) < 0.3) {
                this.upStickPressed = false;
                this.downStickPressed = false;
            }

            // A button to select
            const aPressed = pad.buttons[0] && pad.buttons[0].pressed;
            if (aPressed && !this.prevAPressed) {
                this.selectCurrentButton();
            }
            this.prevAPressed = aPressed;

            // B button to go back
            const bPressed = pad.buttons[1] && pad.buttons[1].pressed;
            if (bPressed && !this.prevBPressed) {
                this.scene.start('TitleScene');
            }
            this.prevBPressed = bPressed;

            // Only process first active gamepad
            break;
        }
    }

    handleModalNavigation() {
        // Keyboard navigation for modal (left/right)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.modalSelection = (this.modalSelection - 1 + 2) % 2;
            this.modalData.updateSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.modalSelection = (this.modalSelection + 1) % 2;
            this.modalData.updateSelection();
        } else if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.selectModalButton();
        } else if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            // ESC cancels delete
            this.modalData.cleanup();
        }

        // Controller navigation for modal
        const gamepads = this.input.gamepad ? this.input.gamepad.gamepads : [];
        for (let i = 0; i < gamepads.length; i++) {
            const pad = gamepads[i];
            if (!pad) continue;

            // D-pad left
            const leftPressed = pad.buttons[14] && pad.buttons[14].pressed;
            if (leftPressed && !this.prevModalLeftPressed) {
                this.modalSelection = (this.modalSelection - 1 + 2) % 2;
                this.modalData.updateSelection();
            }
            this.prevModalLeftPressed = leftPressed;

            // D-pad right
            const rightPressed = pad.buttons[15] && pad.buttons[15].pressed;
            if (rightPressed && !this.prevModalRightPressed) {
                this.modalSelection = (this.modalSelection + 1) % 2;
                this.modalData.updateSelection();
            }
            this.prevModalRightPressed = rightPressed;

            // Left stick horizontal
            if (pad.leftStick.x < -0.5 && !this.modalLeftStickPressed) {
                this.modalSelection = (this.modalSelection - 1 + 2) % 2;
                this.modalData.updateSelection();
                this.modalLeftStickPressed = true;
            } else if (pad.leftStick.x > 0.5 && !this.modalRightStickPressed) {
                this.modalSelection = (this.modalSelection + 1) % 2;
                this.modalData.updateSelection();
                this.modalRightStickPressed = true;
            }

            // Reset stick pressed state when stick returns to center
            if (Math.abs(pad.leftStick.x) < 0.3) {
                this.modalLeftStickPressed = false;
                this.modalRightStickPressed = false;
            }

            // A button to select
            const aPressed = pad.buttons[0] && pad.buttons[0].pressed;
            if (aPressed && !this.prevModalAPressed) {
                this.selectModalButton();
            }
            this.prevModalAPressed = aPressed;

            // B button to cancel
            const bPressed = pad.buttons[1] && pad.buttons[1].pressed;
            if (bPressed && !this.prevModalBPressed) {
                this.modalData.cleanup();
            }
            this.prevModalBPressed = bPressed;

            // Only process first active gamepad
            break;
        }
    }

    selectModalButton() {
        if (!this.modalData) return;

        // Play sound only if it exists in cache
        if (this.sound.get('menu-click')) {
            this.sound.play('menu-click', { volume: 0.5 });
        }

        if (this.modalSelection === 0) {
            // Delete confirmed
            this.deleteSlot(this.modalData.slotNumber);
            this.modalData.cleanup();
            this.scene.restart();
        } else {
            // Cancel
            this.modalData.cleanup();
        }
    }

    updateButtonSelection() {
        // Update visual selection for all buttons
        if (!this.buttonList || this.buttonList.length === 0) return;

        this.buttonList.forEach((button, index) => {
            if (!button || !button.active || !button.buttonData) return;

            try {
                if (index === this.selectedButtonIndex) {
                    button.setColor(button.buttonData.hoverColor);
                    button.setScale(1.1);
                } else {
                    button.setColor(button.buttonData.defaultColor);
                    button.setScale(1);
                }
            } catch (e) {
                // Button might be destroyed, skip it
            }
        });
    }

    selectCurrentButton() {
        const selectedButton = this.buttonList[this.selectedButtonIndex];
        if (selectedButton && selectedButton.buttonData) {
            // Play sound only if it exists in cache
            if (this.sound.get('menu-click')) {
                this.sound.play('menu-click', { volume: 0.5 });
            }
            selectedButton.buttonData.action();
        }
    }

    /**
     * Create UI for a single save slot
     */
    createSlotUI(slot, centerX, y) {
        const isEmpty = slot.isEmpty;
        const isDamaged = slot.status === 'CORRUPT' || slot.status === 'INCOMPATIBLE';
        const slotNumber = slot.slotNumber + 1; // Display as 1-3 instead of 0-2

        // Slot container background
        const containerColor = isDamaged ? 0x42222c : (isEmpty ? 0x2d2d44 : 0x3a3a5a);
        const borderColor = isDamaged ? 0xef4444 : (isEmpty ? 0x4a4a6a : 0x6a6a8a);
        const container = this.add.rectangle(centerX, y, 800, 120, containerColor)
            .setStrokeStyle(2, borderColor);

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
        } else if (isDamaged) {
            this.createDamagedSaveDisplay(slot, centerX, y);
            this.createResetButton(slot, centerX + 285, y);
        } else {
            // Existing save - show metadata and buttons
            this.createSaveInfoDisplay(slot, centerX, y);
            this.createContinueButton(slot.slotNumber, centerX + 200, y);
            this.createDeleteButton(slot.slotNumber, centerX + 320, y);
        }
    }

    createDamagedSaveDisplay(slot, centerX, y) {
        const incompatible = slot.status === 'INCOMPATIBLE';
        this.add.text(centerX - 270, y - 18,
            incompatible ? 'INCOMPATIBLE SAVE' : 'CORRUPT SAVE', {
                fontSize: '23px',
                fontFamily: 'Arial',
                color: incompatible ? '#fbbf24' : '#f87171',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);
        this.add.text(centerX - 270, y + 18,
            incompatible
                ? 'Created by a newer or unsupported game version'
                : 'Save data is damaged and cannot be loaded', {
                fontSize: '15px',
                fontFamily: 'Arial',
                color: '#f3f4f6'
            }).setOrigin(0, 0.5);
    }

    createResetButton(slot, x, y) {
        const button = this.add.text(x, y, 'RESET SLOT', {
            fontSize: '19px',
            fontFamily: 'Arial',
            color: '#ef4444',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.selectedButtonIndex = this.buttonList.findIndex(b => b === button);
                this.updateButtonSelection();
            })
            .on('pointerdown', () => this.confirmDelete(slot.slotNumber, slot.status));

        button.buttonData = {
            type: 'reset',
            slotNumber: slot.slotNumber,
            action: () => this.confirmDelete(slot.slotNumber, slot.status),
            defaultColor: '#ef4444',
            hoverColor: '#f87171'
        };
        this.buttonList.push(button);
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
            .on('pointerover', () => {
                this.selectedButtonIndex = this.buttonList.findIndex(b => b === button);
                this.updateButtonSelection();
            })
            .on('pointerout', () => {
                // Keep selection visible
            })
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.startNewGame(slotNumber);
            });

        // Store button data
        button.buttonData = {
            type: 'newGame',
            slotNumber: slotNumber,
            action: () => this.startNewGame(slotNumber),
            defaultColor: '#4ade80',
            hoverColor: '#86efac'
        };
        this.buttonList.push(button);
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
            .on('pointerover', () => {
                this.selectedButtonIndex = this.buttonList.findIndex(b => b === button);
                this.updateButtonSelection();
            })
            .on('pointerout', () => {
                // Keep selection visible
            })
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.continueGame(slotNumber);
            });

        // Store button data
        button.buttonData = {
            type: 'continue',
            slotNumber: slotNumber,
            action: () => this.continueGame(slotNumber),
            defaultColor: '#4ade80',
            hoverColor: '#86efac'
        };
        this.buttonList.push(button);
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
            .on('pointerover', () => {
                this.selectedButtonIndex = this.buttonList.findIndex(b => b === button);
                this.updateButtonSelection();
            })
            .on('pointerout', () => {
                // Keep selection visible
            })
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.confirmDelete(slotNumber);
            });

        // Store button data
        button.buttonData = {
            type: 'delete',
            slotNumber: slotNumber,
            action: () => this.confirmDelete(slotNumber),
            defaultColor: '#ef4444',
            hoverColor: '#f87171'
        };
        this.buttonList.push(button);
    }

    /**
     * Start a new game in the selected slot
     */
    startNewGame(slotNumber) {
        console.log(`Creating new save in slot ${slotNumber}`);

        // Create new save
        const newSave = this.saveManager.createNewSave(slotNumber);
        if (!newSave) {
            this.showPersistenceError(this.saveManager.getLastPersistenceError() || 'Could not create save');
            return;
        }

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

        // Existing saves should return to Stage Select. A cleared currentStage only means
        // the player was between runs, not that they should repeat first-pick onboarding.
        const hasRunProgress = Boolean(
            saveData.stages &&
            (
                saveData.stages.currentStage ||
                (Array.isArray(saveData.stages.completedStages) && saveData.stages.completedStages.length > 0) ||
                (Array.isArray(saveData.stages.unlockedWorlds) && saveData.stages.unlockedWorlds.length > 1)
            )
        );
        if (hasRunProgress) {
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
    confirmDelete(slotNumber, slotStatus = 'VALID') {
        // Disable main navigation while modal is open
        this.modalActive = true;
        this.modalSelection = 1; // 0 = Delete, 1 = Cancel (default to safer option)

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
        const resettingDamagedSlot = slotStatus === 'CORRUPT' || slotStatus === 'INCOMPATIBLE';
        const warningTitle = this.add.text(centerX, centerY - 60,
            resettingDamagedSlot ? 'RESET OCCUPIED SLOT?' : 'DELETE SAVE FILE?', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ef4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const warningText = this.add.text(centerX, centerY - 10,
            resettingDamagedSlot
                ? 'The original raw save will be permanently deleted.\nCancel keeps it unchanged.'
                : 'This action cannot be undone!', {
            fontSize: resettingDamagedSlot ? '17px' : '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Confirm button
        const confirmButton = this.add.text(centerX - 80, centerY + 60,
            resettingDamagedSlot ? 'RESET' : 'DELETE', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ef4444',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.modalSelection = 0;
                updateModalSelection();
            })
            .on('pointerout', () => {
                // Keep selection visible
            })
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                this.deleteSlot(slotNumber);
                // Close modal and refresh
                cleanup();
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
            .on('pointerover', () => {
                this.modalSelection = 1;
                updateModalSelection();
            })
            .on('pointerout', () => {
                // Keep selection visible
            })
            .on('pointerdown', () => {
                // Play sound only if it exists in cache
                if (this.sound.get('menu-click')) {
                    this.sound.play('menu-click', { volume: 0.5 });
                }
                cleanup();
            });

        const modalButtons = [confirmButton, cancelButton];

        const updateModalSelection = () => {
            modalButtons.forEach((button, index) => {
                if (index === this.modalSelection) {
                    button.setColor(index === 0 ? '#f87171' : '#ffffff');
                    button.setScale(1.1);
                } else {
                    button.setColor(index === 0 ? '#ef4444' : '#d1d5db');
                    button.setScale(1);
                }
            });
        };

        const cleanup = () => {
            this.modalActive = false;
            overlay.destroy();
            modal.destroy();
            warningTitle.destroy();
            warningText.destroy();
            confirmButton.destroy();
            cancelButton.destroy();
        };

        // Store modal state for update loop
        this.modalData = {
            slotNumber: slotNumber,
            buttons: modalButtons,
            updateSelection: updateModalSelection,
            cleanup: cleanup
        };

        // Set initial selection
        updateModalSelection();
    }

    /**
     * Delete a save slot
     */
    deleteSlot(slotNumber) {
        console.log(`Deleting save slot ${slotNumber}`);
        this.saveManager.deleteSlot(slotNumber);
    }

    showPersistenceError(message) {
        const centerX = this.cameras.main.width / 2;
        const errorText = this.add.text(centerX, this.cameras.main.height - 100,
            `SAVE FAILED: ${message}`, {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#fecaca',
                backgroundColor: '#7f1d1d',
                padding: { x: 14, y: 8 },
                align: 'center',
                wordWrap: { width: 700 }
            }).setOrigin(0.5).setDepth(2000);
        this.time.delayedCall(6000, () => {
            if (errorText && errorText.active) errorText.destroy();
        });
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
