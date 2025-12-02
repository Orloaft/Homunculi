// Autoplay Script for Wizbiz Game Testing
// This script automatically plays the game to identify crashes and bugs
class AutoPlayer {
    constructor() {
        this.enabled = false;
        this.actionInterval = null;
        this.currentScene = null;
        this.errorLog = [];
        this.actionLog = [];
        this.startTime = Date.now();
        // Configuration
        this.config = {
            moveInterval: 800, // How often to change movement direction (ms)
            actionInterval: 50, // How often to perform actions/update movement (ms)
            chestDecisionDelay: 1000, // Delay before selecting chest rewards
            logActions: true,
            catchErrors: true
        };
        // Movement state
        this.movement = {
            direction: 0, // 0-7 for 8 directions
            lastChange: 0
        };
        // Setup error catching
        if (this.config.catchErrors) {
            this.setupErrorHandling();
        }
        }
    setupErrorHandling() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.logError('Runtime Error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error?.stack
            });
        });
        // Catch promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
    }
    logError(type, details) {
        const error = {
            type,
            details,
            scene: this.currentScene,
            timestamp: Date.now() - this.startTime,
            lastActions: this.actionLog.slice(-5)
        };
        this.errorLog.push(error);
        console.error('🚨 AutoPlayer Error:', error);
        // Save error log to localStorage
        localStorage.setItem('autoplay_errors', JSON.stringify(this.errorLog));
    }
    logAction(action, details = {}) {
        if (!this.config.logActions) return;
        const logEntry = {
            action,
            details,
            scene: this.currentScene,
            timestamp: Date.now() - this.startTime
        };
        this.actionLog.push(logEntry);
        // Keep only last 100 actions
        if (this.actionLog.length > 100) {
            this.actionLog.shift();
        }
    }
    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.start();
        } else {
            this.stop();
        }
    }
    start() {
        // Start movement updates
        this.actionInterval = setInterval(() => {
            try {
                this.update();
            } catch (error) {
                this.logError('Update Loop Error', error);
            }
        }, this.config.actionInterval);
        // Show status
        this.showStatus();
    }
    stop() {
        if (this.actionInterval) {
            clearInterval(this.actionInterval);
            this.actionInterval = null;
        }
        // Stop wizard movement
        const game = window.game || window.phaser;
        if (game && game.scene) {
            const activeScenes = game.scene.getScenes(true);
            if (activeScenes.length > 0) {
                const scene = activeScenes[0];
                if (scene.wizard && scene.wizard.body) {
                    scene.wizard.body.setVelocity(0, 0);
                }
            }
        }
        // Hide status
        this.hideStatus();
    }
    update() {
        // Get current scene
        const game = window.game || window.phaser;
        if (!game || !game.scene) return;
        const activeScenes = game.scene.getScenes(true);
        if (activeScenes.length === 0) return;
        const scene = activeScenes[0];
        this.currentScene = scene.scene.key;
        // Perform actions based on scene
        switch (this.currentScene) {
            case 'TitleScene':
                this.handleTitleScene(scene);
                break;
            case 'StageSelectScene':
                this.handleStageSelect(scene);
                break;
            case 'GameScene':
            case 'UltraOptimizedGameScene':
                this.handleGameScene(scene);
                break;
            case 'TalentTreeScene':
                this.handleTalentTree(scene);
                break;
        }
    }
    handleTitleScene(scene) {
        // Press space to start
        this.logAction('Title: Press Start');
        this.simulateKey(scene, 'SPACE');
    }
    handleStageSelect(scene) {
        // Navigate and select stages
        if (Math.random() < 0.3) {
            const directions = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            this.logAction('StageSelect: Navigate', { direction: dir });
            this.simulateKey(scene, dir);
        } else {
            this.logAction('StageSelect: Select Stage');
            this.simulateKey(scene, 'SPACE');
        }
    }
    handleGameScene(scene) {
        // Handle different game states
        if (scene.elementSelectionActive) {
            this.handleElementSelection(scene);
        } else if (scene.chestSelectionActive) {
            this.handleChestSelection(scene);
        } else if (scene.isPaused) {
            // Unpause
            this.logAction('Game: Unpause');
            this.simulateKey(scene, 'P');
        } else if (scene.gameStarted) {
            // Normal gameplay
            this.handleGameplay(scene);
        }
    }
    handleElementSelection(scene) {
        // Wait a bit then select random element
        setTimeout(() => {
            const choice = Math.floor(Math.random() * 3);
            this.logAction('ElementSelect: Choose', { choice });
            // Navigate to choice
            for (let i = 0; i < choice; i++) {
                this.simulateKey(scene, 'RIGHT');
            }
            // Select
            setTimeout(() => {
                this.simulateKey(scene, 'SPACE');
            }, 200);
        }, this.config.chestDecisionDelay);
    }
    handleChestSelection(scene) {
        // Select random chest reward
        setTimeout(() => {
            const options = scene.chestUI?.buttons?.length || 3;
            const choice = Math.floor(Math.random() * options);
            this.logAction('ChestSelect: Choose', { choice, options });
            // Navigate to choice
            for (let i = 0; i < choice; i++) {
                this.simulateKey(scene, 'RIGHT');
            }
            // Select
            setTimeout(() => {
                this.simulateKey(scene, 'SPACE');
            }, 200);
        }, this.config.chestDecisionDelay);
    }
    handleGameplay(scene) {
        // Direct wizard movement
        if (!scene.wizard || !scene.wizard.body) return;

        const speed = scene.wizard.moveSpeed || 160;

        // Change direction periodically
        if (Date.now() - this.movement.lastChange > this.config.moveInterval) {
            this.movement.direction = Math.floor(Math.random() * 9); // 0-8, where 8 is stop
            this.movement.lastChange = Date.now();
        }

        // Apply velocity directly based on direction
        let vx = 0, vy = 0;
        const dir = this.movement.direction;

        // 8-directional movement
        if (dir === 0 || dir === 1 || dir === 2) vy = -speed; // Up
        if (dir === 6 || dir === 7 || dir === 8) vy = speed;  // Down
        if (dir === 0 || dir === 3 || dir === 6) vx = -speed; // Left
        if (dir === 2 || dir === 5 || dir === 8) vx = speed;  // Right

        // Normalize diagonal movement
        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }

        scene.wizard.body.setVelocity(vx, vy);

        // Update facing direction for spells
        if (vx !== 0 || vy !== 0) {
            scene.wizard.lastDirection = { x: vx, y: vy };
        }

        // Random actions - use charge slots occasionally (reduced frequency since update is now 50ms)
        if (Math.random() < 0.005) {
            const slot = Math.floor(Math.random() * 4);
            const keys = ['Z', 'X', 'C', 'V'];
            this.logAction('Game: Use Charge', { slot });
            this.simulateKey(scene, keys[slot]);
        }
    }
    handleTalentTree(scene) {
        // Navigate and select talents randomly
        if (Math.random() < 0.5) {
            const directions = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            this.logAction('TalentTree: Navigate', { direction: dir });
            this.simulateKey(scene, dir);
        } else if (Math.random() < 0.3) {
            this.logAction('TalentTree: Select Talent');
            this.simulateKey(scene, 'SPACE');
        } else {
            // Go back
            this.logAction('TalentTree: Exit');
            this.simulateKey(scene, 'ESCAPE');
        }
    }
    updateMovement(scene) {
        if (!scene.cursors) return;
        // Reset all keys
        this.stopMovement(scene);
        // Set new direction
        const dirs = [
            { up: true, left: true },   // 0: Up-Left
            { up: true },                // 1: Up
            { up: true, right: true },   // 2: Up-Right
            { left: true },              // 3: Left
            { },                         // 4: Stop
            { right: true },             // 5: Right
            { down: true, left: true },  // 6: Down-Left
            { down: true },              // 7: Down
            { down: true, right: true }  // 8: Down-Right
        ];
        const dir = dirs[this.movement.direction] || {};
        if (dir.up) scene.cursors.up.isDown = true;
        if (dir.down) scene.cursors.down.isDown = true;
        if (dir.left) scene.cursors.left.isDown = true;
        if (dir.right) scene.cursors.right.isDown = true;
    }
    stopMovement(scene) {
        if (!scene || !scene.cursors) return;
        scene.cursors.up.isDown = false;
        scene.cursors.down.isDown = false;
        scene.cursors.left.isDown = false;
        scene.cursors.right.isDown = false;
    }
    simulateKey(scene, key) {
        if (!scene.input || !scene.input.keyboard) return;
        const keyMap = {
            'SPACE': Phaser.Input.Keyboard.KeyCodes.SPACE,
            'ENTER': Phaser.Input.Keyboard.KeyCodes.ENTER,
            'ESCAPE': Phaser.Input.Keyboard.KeyCodes.ESC,
            'TAB': Phaser.Input.Keyboard.KeyCodes.TAB,
            'LEFT': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'RIGHT': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'UP': Phaser.Input.Keyboard.KeyCodes.UP,
            'DOWN': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'Z': Phaser.Input.Keyboard.KeyCodes.Z,
            'X': Phaser.Input.Keyboard.KeyCodes.X,
            'C': Phaser.Input.Keyboard.KeyCodes.C,
            'V': Phaser.Input.Keyboard.KeyCodes.V,
            'P': Phaser.Input.Keyboard.KeyCodes.P
        };
        const keyCode = keyMap[key] || key;
        const keyObj = scene.input.keyboard.addKey(keyCode);
        // Simulate key press
        keyObj.isDown = true;
        keyObj._justDown = true;
        // Release after short delay
        setTimeout(() => {
            keyObj.isDown = false;
            keyObj._justDown = false;
        }, 50);
    }
    showStatus() {
        // Create status display
        if (!this.statusDiv) {
            this.statusDiv = document.createElement('div');
            this.statusDiv.id = 'autoplay-status';
            this.statusDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 10px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                border: 1px solid #00ff00;
                min-width: 200px;
            `;
            document.body.appendChild(this.statusDiv);
        }
        // Update status regularly
        this.statusInterval = setInterval(() => {
            const runtime = Math.floor((Date.now() - this.startTime) / 1000);
            const errors = this.errorLog.length;
            const lastAction = this.actionLog[this.actionLog.length - 1];
            this.statusDiv.innerHTML = `
                <div>🤖 AUTOPLAY ACTIVE</div>
                <div>Runtime: ${runtime}s</div>
                <div>Scene: ${this.currentScene || 'Unknown'}</div>
                <div>Errors: ${errors}</div>
                <div>Last: ${lastAction?.action || 'None'}</div>
                <div style="margin-top: 5px; font-size: 10px;">Press F9 to stop</div>
            `;
        }, 100);
    }
    hideStatus() {
        if (this.statusDiv) {
            this.statusDiv.remove();
            this.statusDiv = null;
        }
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
    }
    generateReport() {
        const runtime = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.errorLog.length > 0) {
            this.errorLog.forEach((error, i) => {
                });
        }
        return {
            runtime,
            errors: this.errorLog,
            actions: this.actionLog
        };
    }
}
// Initialize autoplay when game loads
window.addEventListener('load', () => {
    // Wait a bit for game to initialize
    setTimeout(() => {
        window.autoPlayer = new AutoPlayer();
        // Add F9 key handler
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F9') {
                event.preventDefault();
                window.autoPlayer.toggle();
            }
        });
        }, 2000);
});
// Export for use in console
window.AutoPlayer = AutoPlayer;