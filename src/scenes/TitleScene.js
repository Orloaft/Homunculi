export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.debugMode = false;
        this.controllerDetectionActive = false;
        this.detectedPlayers = [];
        this.maxPlayers = 4;
        this.detectionOverlay = null;
        this.playerStatusTexts = [];
    }
    create() {
        // Set background to black first
        this.cameras.main.setBackgroundColor('#000000');
        // Create a black overlay that will fade out
        const blackOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
        blackOverlay.setDepth(1000);
        // Add title background
        const bg = this.add.image(400, 300, 'title-bg');
        bg.setDisplaySize(800, 600);
        // Fade out the black overlay to reveal the scene
        this.tweens.add({
            targets: blackOverlay,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                blackOverlay.destroy();
            }
        });
        // Create start button
        const startButton = this.add.text(400, 400, 'START GAME', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });
        // Add hover effect
        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
            startButton.setColor('#ffff00');
        });
        startButton.on('pointerout', () => {
            startButton.setScale(1);
            startButton.setColor('#ffffff');
        });
        // Start game on click
        startButton.on('pointerdown', () => {
            this.startGame();
        });

        // Create co-op button
        const coopButton = this.add.text(400, 480, 'CO-OP (2-4 Players)', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#003300',
            padding: { x: 20, y: 10 }
        });
        coopButton.setOrigin(0.5);
        coopButton.setInteractive({ useHandCursor: true });
        // Add hover effect
        coopButton.on('pointerover', () => {
            coopButton.setScale(1.1);
            coopButton.setColor('#00ff00');
        });
        coopButton.on('pointerout', () => {
            coopButton.setScale(1);
            coopButton.setColor('#ffffff');
        });
        // Start controller detection on click
        coopButton.on('pointerdown', () => {
            this.startControllerDetection();
        });
        // Add debug mode toggle
        const debugText = this.add.text(10, 10, 'Debug Mode: OFF', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        });
        debugText.setInteractive({ useHandCursor: true });
        debugText.on('pointerdown', () => {
            this.debugMode = !this.debugMode;
            debugText.setText(`Debug Mode: ${this.debugMode ? 'ON' : 'OFF'}`);
            debugText.setColor(this.debugMode ? '#00ff00' : '#ffffff');
            // Enable/disable physics debug
            if (this.debugMode) {
                this.game.config.physics.arcade.debug = true;
            } else {
                this.game.config.physics.arcade.debug = false;
            }
        });
        // Add version info
        const version = this.add.text(790, 10, 'v1.0.0', {
            fontSize: '14px',
            color: '#888888'
        });
        version.setOrigin(1, 0);
        // Keyboard shortcut to start
        this.input.keyboard.on('keydown-SPACE', () => {
            this.startGame();
        });
        // Controller support
        this.input.gamepad.once('connected', (pad) => {
            // Check for A button to start
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    if (pad.buttons[0].pressed) {
                        this.startGame();
                    }
                },
                loop: true
            });
        });
        // Add some floating animation to the title after fade-in completes
        this.time.delayedCall(1500, () => {
            this.tweens.add({
                targets: bg,
                y: 310,
                duration: 3000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    startControllerDetection() {
        this.controllerDetectionActive = true;
        this.detectedPlayers = [];
        
        // Create dark overlay
        this.detectionOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.detectionOverlay.setDepth(100);
        
        // Title
        const title = this.add.text(400, 150, 'Controller Detection', {
            fontSize: '32px',
            color: '#ffffff'
        });
        title.setOrigin(0.5);
        title.setDepth(101);
        
        // Instructions
        const instructions = this.add.text(400, 200, 'Press any button on your controller to join (2-4 players)', {
            fontSize: '18px',
            color: '#cccccc'
        });
        instructions.setOrigin(0.5);
        instructions.setDepth(101);
        
        // Player status displays
        this.playerStatusTexts = [];
        for (let i = 0; i < this.maxPlayers; i++) {
            const playerText = this.add.text(200 + (i * 100), 300, `Player ${i + 1}\nWaiting...`, {
                fontSize: '16px',
                color: '#666666',
                align: 'center'
            });
            playerText.setOrigin(0.5);
            playerText.setDepth(101);
            this.playerStatusTexts.push(playerText);
        }
        
        // Start button (disabled initially)
        this.startCoopButton = this.add.text(400, 450, 'START (Need at least 2 players)', {
            fontSize: '20px',
            color: '#666666',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        });
        this.startCoopButton.setOrigin(0.5);
        this.startCoopButton.setDepth(101);
        
        // Cancel button
        const cancelButton = this.add.text(400, 500, 'Cancel', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#663333',
            padding: { x: 15, y: 8 }
        });
        cancelButton.setOrigin(0.5);
        cancelButton.setDepth(101);
        cancelButton.setInteractive({ useHandCursor: true });
        cancelButton.on('pointerdown', () => {
            this.cancelControllerDetection();
        });
        
        // Store UI elements for cleanup
        this.detectionUI = [title, instructions, cancelButton, this.startCoopButton, ...this.playerStatusTexts];
        
        // Start listening for controllers
        this.setupControllerListening();
    }
    
    setupControllerListening() {
        // Listen for any gamepad input
        this.input.gamepad.on('down', (pad, button, value) => {
            if (!this.controllerDetectionActive) return;
            
            // Check if this controller is already registered
            const existingPlayer = this.detectedPlayers.find(p => p.padIndex === pad.index);
            if (existingPlayer) return;
            
            // Add new player
            if (this.detectedPlayers.length < this.maxPlayers) {
                const playerNum = this.detectedPlayers.length;
                this.detectedPlayers.push({
                    padIndex: pad.index,
                    playerNumber: playerNum + 1,
                    gamepad: pad
                });
                
                // Update UI
                this.playerStatusTexts[playerNum].setText(`Player ${playerNum + 1}\nController ${pad.index}\nReady!`);
                this.playerStatusTexts[playerNum].setColor('#00ff00');
                
                // Check if we can start
                this.updateStartButton();
            }
        });
        
        // Also listen for keyboard (player 1 can use keyboard)
        this.input.keyboard.on('keydown', (event) => {
            if (!this.controllerDetectionActive) return;
            
            // Check if keyboard player already exists
            const keyboardPlayer = this.detectedPlayers.find(p => p.padIndex === -1);
            if (keyboardPlayer) return;
            
            // Add keyboard player
            if (this.detectedPlayers.length < this.maxPlayers) {
                const playerNum = this.detectedPlayers.length;
                this.detectedPlayers.push({
                    padIndex: -1, // -1 indicates keyboard
                    playerNumber: playerNum + 1,
                    gamepad: null
                });
                
                // Update UI
                this.playerStatusTexts[playerNum].setText(`Player ${playerNum + 1}\nKeyboard\nReady!`);
                this.playerStatusTexts[playerNum].setColor('#00ff00');
                
                // Check if we can start
                this.updateStartButton();
            }
        });
    }
    
    updateStartButton() {
        if (this.detectedPlayers.length >= 2) {
            this.startCoopButton.setText(`START (${this.detectedPlayers.length} players)`);
            this.startCoopButton.setColor('#ffffff');
            this.startCoopButton.setStyle({ backgroundColor: '#006600' });
            this.startCoopButton.setInteractive({ useHandCursor: true });
            this.startCoopButton.on('pointerdown', () => {
                this.startCoopGame();
            });
        }
    }
    
    cancelControllerDetection() {
        this.controllerDetectionActive = false;
        this.detectedPlayers = [];
        
        // Clean up UI
        if (this.detectionOverlay) {
            this.detectionOverlay.destroy();
        }
        this.detectionUI.forEach(element => element.destroy());
        this.detectionUI = [];
        this.playerStatusTexts = [];
    }
    
    startCoopGame() {
        // Store multiplayer data in registry for other scenes
        this.registry.set('multiplayerMode', true);
        this.registry.set('playerCount', this.detectedPlayers.length);
        this.registry.set('playerControllers', this.detectedPlayers);
        
        // Fade out and start character selection
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('StageSelectScene', { 
                debugMode: this.debugMode,
                fromTitle: true,
                showCharacterSelect: true,
                multiplayerMode: true,
                playerCount: this.detectedPlayers.length,
                playerControllers: this.detectedPlayers
            });
        });
    }

    startGame() {
        // Fade out
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Go to stage select screen with character selection
            this.scene.start('StageSelectScene', { 
                debugMode: this.debugMode,
                fromTitle: true,
                showCharacterSelect: true,
                currentPlayer: 'p1'
            });
        });
    }
}