export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.debugMode = false;
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
        const startButton = this.add.text(400, 450, 'START GAME', {
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
            console.log('Gamepad connected on title screen');
            
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