export default class StageSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageSelectScene' });
        this.selectedStage = 0;
        this.stages = [
            { 
                name: 'Forestland', 
                planetKey: 'planet-forest',
                unlocked: true, 
                description: 'A mystical forest filled with danger',
                scale: 0.8,
                rotation: 0.001
            },
            { 
                name: 'Caveland', 
                planetKey: 'planet-cave',
                unlocked: true, 
                description: 'Dark caverns with unknown threats',
                scale: 0.75,
                rotation: -0.0015
            },
            { 
                name: 'Desertland', 
                planetKey: 'planet-sand',
                unlocked: false, 
                description: 'Endless dunes and scorching heat',
                scale: 0.85,
                rotation: 0.0012
            },
            { 
                name: 'Lavaland', 
                planetKey: 'planet-lava',
                unlocked: false, 
                description: 'Molten depths of fire and brimstone',
                scale: 0.9,
                rotation: -0.001
            },
            { 
                name: 'Graveland', 
                planetKey: 'planet-grave',
                unlocked: false, 
                description: 'Where the undead roam',
                scale: 0.8,
                rotation: 0.0008
            },
            { 
                name: 'Castleland', 
                planetKey: 'planet-castle',
                unlocked: false, 
                description: 'An ancient fortress of evil',
                scale: 0.95,
                rotation: -0.0011
            },
            { 
                name: 'Spireland', 
                planetKey: 'planet-spire',
                unlocked: false, 
                description: 'Floating sanctuary in the clouds',
                scale: 0.85,
                rotation: 0.0013
            },
            { 
                name: 'Snowland', 
                planetKey: 'planet-snow',
                unlocked: false, 
                description: 'Frozen wastelands of eternal winter',
                scale: 0.8,
                rotation: -0.0009
            }
        ];
        this.planetContainers = [];
    }

    create() {
        // Set background color to dark space-like color
        this.cameras.main.setBackgroundColor('#0a0a1a');
        
        // Add some stars in the background
        this.createStarfield();

        // Title with glow effect
        const titleText = this.add.text(400, 50, 'SELECT WORLD', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#4444ff',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Add glow effect to title
        titleText.setShadow(0, 0, '#6666ff', 10, true, true);

        // Create planet layout in a circular/scattered pattern
        const centerX = 400;
        const centerY = 300;
        const positions = [
            { x: centerX - 200, y: centerY - 100 }, // Forest
            { x: centerX + 200, y: centerY - 100 }, // Cave
            { x: centerX - 250, y: centerY + 50 },  // Desert
            { x: centerX + 250, y: centerY + 50 },  // Lava
            { x: centerX - 100, y: centerY + 150 }, // Grave
            { x: centerX + 100, y: centerY + 150 }, // Castle
            { x: centerX, y: centerY - 50 },        // Spire
            { x: centerX, y: centerY + 100 }        // Snow
        ];

        this.stageButtons = [];
        this.planetContainers = [];

        this.stages.forEach((stage, index) => {
            const pos = positions[index] || { x: centerX, y: centerY };
            
            // Stage container
            const container = this.add.container(pos.x, pos.y);
            
            // Planet sprite
            const planet = this.add.sprite(0, 0, stage.planetKey);
            planet.setScale(stage.scale);
            
            // Add floating animation
            this.tweens.add({
                targets: planet,
                y: planet.y + 10,
                duration: 2000 + index * 200,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            // Add rotation
            this.tweens.add({
                targets: planet,
                rotation: planet.rotation + Math.PI * 2,
                duration: 60000 / Math.abs(stage.rotation),
                repeat: -1
            });
            
            // Apply grayscale effect to locked planets
            if (!stage.unlocked) {
                planet.setTint(0x444444);
            }
            
            container.add(planet);
            
            // Add glow effect for unlocked planets
            if (stage.unlocked) {
                const glow = this.add.sprite(0, 0, stage.planetKey);
                glow.setScale(stage.scale * 1.1);
                glow.setAlpha(0.3);
                glow.setBlendMode(Phaser.BlendModes.ADD);
                container.add(glow);
                container.sendToBack(glow);
            }
            
            // Stage name label with background
            const labelBg = this.add.rectangle(0, 60, 120, 30, 0x000000, 0.7);
            labelBg.setStrokeStyle(2, stage.unlocked ? 0xffffff : 0x666666, 0.8);
            container.add(labelBg);
            
            const nameText = this.add.text(0, 60, stage.name, {
                fontSize: '16px',
                color: stage.unlocked ? '#ffffff' : '#666666',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            container.add(nameText);
            
            // Lock icon for locked stages
            if (!stage.unlocked) {
                const lockIcon = this.add.text(0, 0, '🔒', {
                    fontSize: '32px'
                }).setOrigin(0.5);
                container.add(lockIcon);
            }
            
            // Description popup (hidden by default)
            const descBg = this.add.rectangle(0, -80, 200, 60, 0x000000, 0.9);
            descBg.setStrokeStyle(2, 0xffffff, 0.8);
            descBg.setVisible(false);
            container.add(descBg);
            
            const descText = this.add.text(0, -80, stage.description, {
                fontSize: '12px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 180 }
            }).setOrigin(0.5);
            descText.setVisible(false);
            container.add(descText);
            
            // Make interactive
            planet.setInteractive({ useHandCursor: stage.unlocked });
            
            if (stage.unlocked) {
                planet.on('pointerover', () => {
                    this.highlightStage(index);
                    descBg.setVisible(true);
                    descText.setVisible(true);
                });
                
                planet.on('pointerout', () => {
                    if (this.selectedStage !== index) {
                        this.unhighlightStage(index);
                    }
                    descBg.setVisible(false);
                    descText.setVisible(false);
                });
                
                planet.on('pointerdown', () => {
                    this.selectStage(index);
                });
            }
            
            this.stageButtons.push({ 
                container, 
                planet, 
                nameText, 
                descText,
                descBg,
                labelBg,
                stage,
                index 
            });
            this.planetContainers.push(container);
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
        
        // Play stage select music
        if (!this.sound.get('stageselect-bgm')) {
            this.bgm = this.sound.add('stageselect-bgm', { loop: true, volume: 0.5 });
            this.bgm.play();
        }
        
        // Add instruction text
        const instructionText = this.add.text(400, 560, 'Use Arrow Keys or Click to Select', {
            fontSize: '14px',
            color: '#aaaaaa',
            fontStyle: 'italic'
        }).setOrigin(0.5);
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

        // Custom navigation for scattered planet layout
        // Define navigation connections between planets
        const navigationMap = {
            0: { right: 6, down: 2 },         // Forest -> Spire (right), Desert (down)
            1: { left: 6, down: 3 },          // Cave -> Spire (left), Lava (down)
            2: { up: 0, right: 4, down: 7 },  // Desert -> Forest (up), Grave (right), Snow (down)
            3: { up: 1, left: 5, down: 7 },   // Lava -> Cave (up), Castle (left), Snow (down)
            4: { left: 2, right: 7, up: 6 },  // Grave -> Desert (left), Snow (right), Spire (up)
            5: { right: 3, left: 7, up: 6 },  // Castle -> Lava (right), Snow (left), Spire (up)
            6: { left: 0, right: 1, down: 7 }, // Spire -> Forest (left), Cave (right), Snow (down)
            7: { up: 2, left: 4, right: 5 }   // Snow -> Desert (up), Grave (left), Castle (right)
        };
        
        const currentNav = navigationMap[this.selectedStage];
        let nextStage = this.selectedStage;
        
        if (leftJustPressed && currentNav.left !== undefined) {
            nextStage = currentNav.left;
        } else if (rightJustPressed && currentNav.right !== undefined) {
            nextStage = currentNav.right;
        } else if (upJustPressed && currentNav.up !== undefined) {
            nextStage = currentNav.up;
        } else if (downJustPressed && currentNav.down !== undefined) {
            nextStage = currentNav.down;
        }
        
        // Only highlight if we're moving to an unlocked stage or adjacent to current
        if (nextStage !== this.selectedStage) {
            this.highlightStage(nextStage);
        }

        // Select stage
        if (confirmJustPressed && this.stages[this.selectedStage].unlocked) {
            this.selectStage(this.selectedStage);
        }

        // Go back
        if (backJustPressed) {
            // Stop music before going back
            if (this.bgm) {
                this.bgm.stop();
            }
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

    createStarfield() {
        // Create a starfield background
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff);
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 0.8));
            
            // Add twinkling effect to some stars
            if (Math.random() > 0.7) {
                this.tweens.add({
                    targets: star,
                    alpha: 0.3,
                    duration: Phaser.Math.Between(1000, 3000),
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }
    
    highlightStage(index) {
        const btn = this.stageButtons[index];
        
        // Clear previous highlight
        if (this.selectedStage !== index && this.stageButtons[this.selectedStage]) {
            this.unhighlightStage(this.selectedStage);
        }
        
        this.selectedStage = index;
        
        // For locked stages, show lock feedback
        if (!btn.stage.unlocked) {
            // Shake the planet to indicate it's locked
            this.tweens.add({
                targets: btn.planet,
                x: btn.planet.x - 5,
                duration: 50,
                yoyo: true,
                repeat: 3,
                ease: 'Linear'
            });
            return;
        }
        
        // Scale up planet
        this.tweens.add({
            targets: btn.planet,
            scaleX: btn.stage.scale * 1.2,
            scaleY: btn.stage.scale * 1.2,
            duration: 200,
            ease: 'Back.easeOut'
        });
        
        // Brighten label
        btn.labelBg.setStrokeStyle(3, 0xffd700, 1);
        btn.nameText.setColor('#ffd700');
        
        // Add selection ring effect
        if (!btn.selectionRing) {
            btn.selectionRing = this.add.circle(0, 0, 50, 0xffd700, 0);
            btn.selectionRing.setStrokeStyle(3, 0xffd700, 1);
            btn.container.add(btn.selectionRing);
            btn.container.sendToBack(btn.selectionRing);
        }
        
        // Animate selection ring
        this.tweens.add({
            targets: btn.selectionRing,
            scaleX: btn.stage.scale * 1.5,
            scaleY: btn.stage.scale * 1.5,
            alpha: 0.5,
            duration: 300,
            ease: 'Power2'
        });
    }
    
    unhighlightStage(index) {
        const btn = this.stageButtons[index];
        if (!btn.stage.unlocked) return;
        
        // Scale back to normal
        this.tweens.add({
            targets: btn.planet,
            scaleX: btn.stage.scale,
            scaleY: btn.stage.scale,
            duration: 200,
            ease: 'Back.easeIn'
        });
        
        // Reset label
        btn.labelBg.setStrokeStyle(2, 0xffffff, 0.8);
        btn.nameText.setColor('#ffffff');
        
        // Hide selection ring
        if (btn.selectionRing) {
            this.tweens.add({
                targets: btn.selectionRing,
                scaleX: 1,
                scaleY: 1,
                alpha: 0,
                duration: 200,
                ease: 'Power2'
            });
        }
    }

    selectStage(index) {
        const stageMappings = {
            0: 'forest',
            1: 'cave',
            2: 'desert',
            3: 'lava',
            4: 'grave',
            5: 'castle',
            6: 'spire',
            7: 'snow'
        };
        
        if (index === 0 || index === 1) {
            // Zoom into the selected planet
            const btn = this.stageButtons[index];
            
            // First, zoom the planet
            this.tweens.add({
                targets: btn.planet,
                scaleX: 3,
                scaleY: 3,
                duration: 800,
                ease: 'Power2.easeIn'
            });
            
            // Fade out other planets
            this.stageButtons.forEach((otherBtn, i) => {
                if (i !== index) {
                    this.tweens.add({
                        targets: otherBtn.container,
                        alpha: 0,
                        duration: 500,
                        ease: 'Power2'
                    });
                }
            });
            
            // Fade to white then black
            const whiteOverlay = this.add.rectangle(400, 300, 800, 600, 0xffffff);
            whiteOverlay.setAlpha(0);
            whiteOverlay.setDepth(1000);
            
            this.tweens.add({
                targets: whiteOverlay,
                alpha: 1,
                duration: 600,
                delay: 200,
                ease: 'Power2',
                onComplete: () => {
                    // Stop music before transitioning
                    if (this.bgm) {
                        this.bgm.stop();
                    }
                    // Start loading scene which will transition to the game
                    this.scene.start('LoadingScene', { 
                        nextScene: 'GameScene',
                        data: { stage: stageMappings[index] }
                    });
                }
            });
        } else {
            // Show coming soon message for other stages
            const message = this.add.text(400, 300, 'WORLD LOCKED', {
                fontSize: '48px',
                color: '#ff6666',
                fontStyle: 'bold',
                stroke: '#330000',
                strokeThickness: 4
            }).setOrigin(0.5);
            message.setShadow(0, 0, '#ff0000', 10, true, true);
            
            this.tweens.add({
                targets: message,
                alpha: 0,
                duration: 1500,
                ease: 'Power2'
            });
        }
    }
}