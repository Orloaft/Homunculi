export default class StageSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageSelectScene' });
        this.selectedStage = 0;
        this.stages = [
            { name: 'Forest', unlocked: true, description: 'A mystical forest filled with danger' },
            { name: 'Cave', unlocked: false, description: 'Dark caverns with unknown threats' },
            { name: 'Castle', unlocked: false, description: 'An ancient fortress of evil' },
            { name: 'Volcano', unlocked: false, description: 'Molten depths of fire and brimstone' },
            { name: 'Sky Temple', unlocked: false, description: 'Floating sanctuary in the clouds' },
            { name: 'Void Realm', unlocked: false, description: 'The final dimension of darkness' }
        ];
    }

    create() {
        // Set background color
        this.cameras.main.setBackgroundColor('#11130d');

        // Title
        this.add.text(400, 50, 'SELECT STAGE', {
            fontSize: '48px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Stage grid
        const startX = 150;
        const startY = 150;
        const stageWidth = 200;
        const stageHeight = 150;
        const padding = 50;
        const cols = 3;

        this.stageButtons = [];

        this.stages.forEach((stage, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = startX + col * (stageWidth + padding);
            const y = startY + row * (stageHeight + padding);

            // Stage container
            const container = this.add.container(x, y);

            // Stage background
            const bgColor = stage.unlocked ? 0x2d4a2b : 0x333333;
            const bg = this.add.rectangle(0, 0, stageWidth, stageHeight, bgColor);
            bg.setStrokeStyle(3, stage.unlocked ? 0xffd700 : 0x666666);
            container.add(bg);

            // Stage name
            const nameText = this.add.text(0, -40, stage.name, {
                fontSize: '24px',
                color: stage.unlocked ? '#ffffff' : '#666666',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            container.add(nameText);

            // Lock icon for locked stages
            if (!stage.unlocked) {
                const lockText = this.add.text(0, 10, '🔒', {
                    fontSize: '48px'
                }).setOrigin(0.5);
                container.add(lockText);
            } else if (index === 0) {
                // Show "PLAY" for the first unlocked stage
                const playText = this.add.text(0, 10, 'PLAY', {
                    fontSize: '32px',
                    color: '#00ff00',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                container.add(playText);
            }

            // Description (shown when selected)
            const descText = this.add.text(0, 60, stage.description, {
                fontSize: '14px',
                color: stage.unlocked ? '#cccccc' : '#666666',
                align: 'center',
                wordWrap: { width: stageWidth - 20 }
            }).setOrigin(0.5);
            descText.setVisible(false);
            container.add(descText);

            // Make interactive if unlocked
            if (stage.unlocked) {
                bg.setInteractive({ useHandCursor: true });
                
                bg.on('pointerover', () => {
                    if (stage.unlocked) {
                        bg.setFillStyle(0x3d5a3b);
                        descText.setVisible(true);
                    }
                });

                bg.on('pointerout', () => {
                    if (stage.unlocked) {
                        bg.setFillStyle(0x2d4a2b);
                        descText.setVisible(false);
                    }
                });

                bg.on('pointerdown', () => {
                    if (stage.unlocked) {
                        this.selectStage(index);
                    }
                });
            }

            this.stageButtons.push({ container, bg, nameText, descText, stage });
        });

        // Back button
        const backButton = this.add.text(50, 550, '< BACK', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        backButton.setInteractive({ useHandCursor: true });
        
        backButton.on('pointerover', () => {
            backButton.setColor('#ffd700');
        });

        backButton.on('pointerout', () => {
            backButton.setColor('#ffffff');
        });

        backButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });

        // Keyboard/gamepad controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Highlight first unlocked stage
        this.highlightStage(0);
    }

    update() {
        // Handle gamepad
        const pad = this.input.gamepad ? this.input.gamepad.pad1 : null;
        
        // Handle navigation
        const leftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.left) || 
            (pad && pad.leftStick.x < -0.5 && !this.leftPressed);
        const rightJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.right) || 
            (pad && pad.rightStick.x > 0.5 && !this.rightPressed);
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
            (pad && pad.leftStick.y < -0.5 && !this.upPressed);
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down) || 
            (pad && pad.leftStick.y > 0.5 && !this.downPressed);
        const confirmJustPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey) || 
            Phaser.Input.Keyboard.JustDown(this.enterKey) ||
            (pad && pad.buttons[0].pressed && !this.confirmPressed);
        const backJustPressed = Phaser.Input.Keyboard.JustDown(this.escKey) ||
            (pad && pad.buttons[1].pressed && !this.backPressed);

        // Navigate stages
        const cols = 3;
        const currentRow = Math.floor(this.selectedStage / cols);
        const currentCol = this.selectedStage % cols;

        if (leftJustPressed && currentCol > 0) {
            this.highlightStage(this.selectedStage - 1);
        } else if (rightJustPressed && currentCol < cols - 1 && this.selectedStage < this.stages.length - 1) {
            this.highlightStage(this.selectedStage + 1);
        } else if (upJustPressed && currentRow > 0) {
            this.highlightStage(this.selectedStage - cols);
        } else if (downJustPressed && this.selectedStage + cols < this.stages.length) {
            this.highlightStage(this.selectedStage + cols);
        }

        // Select stage
        if (confirmJustPressed && this.stages[this.selectedStage].unlocked) {
            this.selectStage(this.selectedStage);
        }

        // Go back
        if (backJustPressed) {
            this.scene.start('TitleScene');
        }

        // Store button states
        this.leftPressed = pad && pad.leftStick.x < -0.5;
        this.rightPressed = pad && pad.rightStick.x > 0.5;
        this.upPressed = pad && pad.leftStick.y < -0.5;
        this.downPressed = pad && pad.leftStick.y > 0.5;
        this.confirmPressed = pad && pad.buttons[0].pressed;
        this.backPressed = pad && pad.buttons[1].pressed;
    }

    highlightStage(index) {
        // Clear previous highlight
        if (this.stageButtons[this.selectedStage]) {
            const btn = this.stageButtons[this.selectedStage];
            btn.bg.setFillStyle(btn.stage.unlocked ? 0x2d4a2b : 0x333333);
            btn.descText.setVisible(false);
        }

        // Set new highlight
        this.selectedStage = index;
        const btn = this.stageButtons[this.selectedStage];
        if (btn.stage.unlocked) {
            btn.bg.setFillStyle(0x3d5a3b);
            btn.descText.setVisible(true);
        }
    }

    selectStage(index) {
        if (index === 0) {
            // Fade to black before starting game
            const fadeOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
            fadeOverlay.setAlpha(0);
            fadeOverlay.setDepth(1000);
            
            this.tweens.add({
                targets: fadeOverlay,
                alpha: 1,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    // Start loading scene which will transition to the game
                    this.scene.start('LoadingScene', { 
                        nextScene: 'GameScene',
                        data: {}
                    });
                }
            });
        } else {
            // Show coming soon message for other stages
            const message = this.add.text(400, 300, 'COMING SOON!', {
                fontSize: '48px',
                color: '#ffd700',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.tweens.add({
                targets: message,
                alpha: 0,
                duration: 1500,
                ease: 'Power2'
            });
        }
    }
}