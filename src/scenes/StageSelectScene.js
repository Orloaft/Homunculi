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

    init() {
        // Ensure keyboard input is enabled when entering this scene
        this.input.keyboard.enabled = true;
        this.selectedStage = 0; // Reset to first stage
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
        // Skip all input if keyboard is disabled (e.g., when showing stage detail)
        if (!this.input.keyboard.enabled) {
            return;
        }
        
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
        
        // Check if this is a valid stage index
        if (index < 0 || index >= this.stages.length) {
            console.warn('Invalid stage index:', index);
            return;
        }
        
        if (index === 0 || index === 1) {
            // Show stage detail view with co-op option
            this.showStageDetail(stageMappings[index], this.stages[index]);
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
    
    showStageDetail(stageKey, stageInfo) {
        // Disable stage selection
        this.input.keyboard.enabled = false;
        
        // Create detail overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        overlay.setInteractive();
        
        // Stage name
        const title = this.add.text(400, 100, stageInfo.name.toUpperCase(), {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        // Stage description
        const description = this.add.text(400, 150, stageInfo.description, {
            fontSize: '20px',
            color: '#cccccc'
        });
        description.setOrigin(0.5);
        
        // Co-op toggle button
        const coopButton = this.add.text(400, 240, '[ ] ENABLE CO-OP', {
            fontSize: '24px',
            color: '#888888',
            backgroundColor: '#333333',
            padding: { x: 15, y: 8 }
        });
        coopButton.setOrigin(0.5);
        coopButton.setInteractive({ useHandCursor: true });
        
        // Co-op state
        this.coopEnabled = false;
        this.coopPlayers = [{
            playerIndex: 0,
            inputType: 'keyboard',
            paletteIndex: 0
        }];
        this.playerSlots = [];
        
        // Co-op area (initially hidden)
        const coopContainer = this.add.container(400, 340);
        coopContainer.setVisible(false);
        
        const coopBg = this.add.rectangle(0, 0, 600, 120, 0x222222, 1);
        coopBg.setStrokeStyle(2, 0x444444);
        
        // Player slots container
        const slotsContainer = this.add.container(0, 0);
        
        // Instructions
        const instructions = this.add.text(0, 45, 'Press button on controller to join', {
            fontSize: '16px',
            color: '#888888'
        });
        instructions.setOrigin(0.5);
        
        coopContainer.add([coopBg, slotsContainer, instructions]);
        
        // Co-op toggle functionality
        coopButton.on('pointerdown', () => {
            this.coopEnabled = !this.coopEnabled;
            
            if (this.coopEnabled) {
                coopButton.setText('[X] ENABLE CO-OP');
                coopButton.setColor('#00ff00');
                coopContainer.setVisible(true);
                
                // Create player slots
                if (this.playerSlots.length === 0) {
                    // Player 1 (keyboard) - always present
                    const p1Slot = this.createPlayerSlot(0, -150, 0, 'keyboard', true);
                    p1Slot.container.setScale(0.8);
                    slotsContainer.add(p1Slot.container);
                    this.playerSlots.push(p1Slot);
                    
                    // Player 2-4 slots (gamepads)
                    for (let i = 1; i < 4; i++) {
                        const slot = this.createPlayerSlot(i, -150 + (i * 100), 0, 'gamepad', false);
                        slot.container.setScale(0.8);
                        slotsContainer.add(slot.container);
                        this.playerSlots.push(slot);
                    }
                }
                
                // Start gamepad detection
                this.setupCoopJoining();
            } else {
                coopButton.setText('[ ] ENABLE CO-OP');
                coopButton.setColor('#888888');
                coopContainer.setVisible(false);
                
                // Stop gamepad detection
                if (this.coopCheckTimer) {
                    this.coopCheckTimer.remove();
                    this.coopCheckTimer = null;
                }
                
                // Reset to single player
                this.coopPlayers = [{
                    playerIndex: 0,
                    inputType: 'keyboard',
                    paletteIndex: 0
                }];
                
                // Reset slots
                for (let i = 1; i < this.playerSlots.length; i++) {
                    const slot = this.playerSlots[i];
                    slot.joined = false;
                    slot.bg.setFillStyle(0x222222);
                    slot.bg.setStrokeStyle(2, 0x444444);
                    slot.number.setColor('#666666');
                    slot.inputText.setText('--');
                    slot.inputText.setColor('#666666');
                    slot.palette.setVisible(false);
                }
            }
        });
        
        coopButton.on('pointerover', () => {
            coopButton.setScale(1.05);
        });
        
        coopButton.on('pointerout', () => {
            coopButton.setScale(1);
        });
        
        // Start button
        const startButton = this.add.text(400, 450, 'START GAME', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 20, y: 10 }
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });
        
        startButton.on('pointerdown', () => {
            this.startWithCoopSettings(stageKey);
        });
        
        startButton.on('pointerover', () => {
            startButton.setBackgroundColor('#666666');
        });
        
        startButton.on('pointerout', () => {
            startButton.setBackgroundColor('#444444');
        });
        
        // Cancel button
        const cancelButton = this.add.text(400, 520, 'CANCEL', {
            fontSize: '20px',
            color: '#ff4444'
        });
        cancelButton.setOrigin(0.5);
        cancelButton.setInteractive({ useHandCursor: true });
        
        cancelButton.on('pointerdown', () => {
            this.closeStageDetail();
        });
        
        // Store UI elements
        this.detailUI = {
            overlay, title, description, coopButton, coopContainer,
            startButton, cancelButton,
            slots: this.playerSlots
        };
        
        // Keyboard controls
        const spaceKey = this.input.keyboard.addKey('SPACE');
        const escKey = this.input.keyboard.addKey('ESC');
        
        spaceKey.once('down', () => {
            this.startWithCoopSettings(stageKey);
        });
        
        escKey.once('down', () => {
            this.closeStageDetail();
        });
    }
    
    createPlayerSlot(index, x, y, inputType, joined) {
        const container = this.add.container(x, y);
        
        // Slot background
        const bg = this.add.rectangle(0, 0, 80, 80, joined ? 0x444444 : 0x222222);
        bg.setStrokeStyle(2, joined ? 0x00ff00 : 0x444444);
        
        // Player number
        const number = this.add.text(0, -20, `P${index + 1}`, {
            fontSize: '20px',
            color: joined ? '#ffffff' : '#666666'
        });
        number.setOrigin(0.5);
        
        // Input type
        const inputText = this.add.text(0, 0, inputType === 'keyboard' ? 'KB' : '--', {
            fontSize: '16px',
            color: joined ? '#00ff00' : '#666666'
        });
        inputText.setOrigin(0.5);
        
        // Palette indicator
        const paletteColors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        const palette = this.add.circle(0, 25, 8, paletteColors[0]);
        palette.setVisible(joined);
        
        container.add([bg, number, inputText, palette]);
        
        return {
            container,
            bg,
            number,
            inputText,
            palette,
            joined,
            paletteIndex: 0,
            inputType
        };
    }
    
    setupCoopJoining() {
        // Only setup if co-op is enabled
        if (!this.coopEnabled) return;
        
        // Check for gamepad button presses
        this.coopCheckTimer = this.time.addEvent({
            delay: 100,
            callback: () => {
                if (!this.coopEnabled) return;
                
                const pads = this.input.gamepad.gamepads;
                
                for (let i = 0; i < pads.length; i++) {
                    const pad = pads[i];
                    if (!pad) continue;
                    
                    // Check if any button is pressed
                    for (let b = 0; b < pad.buttons.length; b++) {
                        if (pad.buttons[b].pressed) {
                            // Check if this gamepad is already assigned
                            let alreadyAssigned = false;
                            for (const player of this.coopPlayers) {
                                if (player.inputType === 'gamepad' && player.gamepadIndex === i) {
                                    alreadyAssigned = true;
                                    break;
                                }
                            }
                            
                            if (!alreadyAssigned && this.coopPlayers.length < 4) {
                                this.addCoopPlayer(i);
                            }
                        }
                    }
                }
            },
            loop: true
        });
    }
    
    addCoopPlayer(gamepadIndex) {
        const playerIndex = this.coopPlayers.length;
        const slot = this.playerSlots[playerIndex];
        
        if (!slot || slot.joined) return;
        
        // Update slot appearance
        slot.joined = true;
        slot.bg.setFillStyle(0x444444);
        slot.bg.setStrokeStyle(2, 0x00ff00);
        slot.number.setColor('#ffffff');
        slot.inputText.setText(`GP${gamepadIndex + 1}`);
        slot.inputText.setColor('#00ff00');
        slot.palette.setVisible(true);
        
        // Add to players list
        this.coopPlayers.push({
            playerIndex,
            inputType: 'gamepad',
            gamepadIndex,
            paletteIndex: playerIndex % 6
        });
        
        // Update palette color
        const paletteColors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        slot.palette.setFillStyle(paletteColors[playerIndex % 6]);
        
        // Flash effect
        this.tweens.add({
            targets: slot.container,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Sound effect
        this.sound.play('select', { volume: 0.5 });
    }
    
    startWithCoopSettings(stageKey) {
        // Stop co-op detection
        if (this.coopCheckTimer) {
            this.coopCheckTimer.remove();
        }
        
        // Store co-op data
        this.registry.set('coopData', {
            enabled: this.coopEnabled && this.coopPlayers.length > 1,
            players: this.coopPlayers
        });
        
        // Stop music before transitioning
        if (this.bgm) {
            this.bgm.stop();
        }
        
        // Start game
        this.scene.start('LoadingScene', { 
            nextScene: 'GameScene',
            data: { stage: stageKey }
        });
    }
    
    closeStageDetail() {
        // Stop co-op detection
        if (this.coopCheckTimer) {
            this.coopCheckTimer.remove();
            this.coopCheckTimer = null;
        }
        
        // Remove UI
        if (this.detailUI) {
            Object.values(this.detailUI).forEach(element => {
                if (element && element.destroy) {
                    element.destroy();
                } else if (Array.isArray(element)) {
                    element.forEach(e => {
                        if (e && e.container && e.container.destroy) {
                            e.container.destroy();
                        }
                    });
                }
            });
            this.detailUI = null;
        }
        
        // Reset co-op state
        this.coopEnabled = false;
        this.coopPlayers = [{
            playerIndex: 0,
            inputType: 'keyboard',
            paletteIndex: 0
        }];
        this.playerSlots = [];
        
        // Re-enable input
        this.input.keyboard.enabled = true;
    }
}