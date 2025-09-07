import { CHARACTER_CONFIG } from '../data/CharacterConfig.js';
import { characterManager } from '../systems/CharacterManager.js';

export default class StageSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageSelectScene' });
        this.selectedStage = 0;
        this.characterSelectionMode = true;
        this.currentPlayer = 'p1';
        this.selectedCard = null;
        this.tarotCards = [];
        this.p2Joined = false;
        // Initialize gamepad tracking
        this.leftPressed = false;
        this.rightPressed = false;
        this.confirmPressed = false;
        this.backPressed = false;
        this.p2StartPressed = false;
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
                unlocked: true, // Unlocked for testing
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

    init(data) {
        console.log('StageSelectScene init called with data:', data);
        
        // Ensure keyboard input is enabled when entering this scene
        this.input.keyboard.enabled = true;
        this.selectedStage = 0; // Reset to first stage
        
        // Reset stage detail shown flag when returning to this scene
        this.stageDetailShown = false;
        
        // Force character selection mode when coming from title or when P2 joins
        const fromTitle = data?.fromTitle || !data?.fromCharacterSelect;
        this.characterSelectionMode = fromTitle || data?.showCharacterSelect;
        
        this.currentPlayer = data?.currentPlayer || 'p1';
        this.selectedCard = null;
        this.p2Joined = data?.p2Joined || false;
        
        console.log('Character selection mode:', this.characterSelectionMode);
        console.log('Current player:', this.currentPlayer);
        
        // Reset character manager if starting fresh
        if (!this.p2Joined && this.currentPlayer === 'p1') {
            characterManager.reset();
        }
    }

    create() {
        console.log('StageSelectScene create called, characterSelectionMode:', this.characterSelectionMode);
        
        // Set background color to dark space-like color
        this.cameras.main.setBackgroundColor('#0a0a1a');
        
        // Add some stars in the background
        this.createStarfield();
        
        // Create UI containers
        this.characterSelectionContainer = this.add.container(0, 0);
        this.stageSelectionContainer = this.add.container(0, 0);
        
        // Setup keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        
        // Play stage select music
        if (!this.sound.get('stageselect-bgm')) {
            this.bgm = this.sound.add('stageselect-bgm', { loop: true, volume: 0.5 });
            this.bgm.play();
        }
        
        // Start with character selection
        if (this.characterSelectionMode) {
            console.log('Showing character selection');
            try {
                this.createCharacterSelection();
                this.stageSelectionContainer.setVisible(false);
            } catch (error) {
                console.error('Error creating character selection:', error);
                // Fallback to stage selection if character selection fails
                this.characterSelectionMode = false;
                this.characterSelectionContainer.setVisible(false);
                this.createStageSelection();
            }
        } else {
            console.log('Showing stage selection');
            this.characterSelectionContainer.setVisible(false);
            this.createStageSelection();
        }
    }
    
    createCharacterSelection() {
        console.log('Creating character selection for', this.currentPlayer);
        
        // Title
        const title = this.currentPlayer === 'p1' ? 
            'PLAYER 1 - SELECT YOUR HOMUNCULUS' : 
            'PLAYER 2 - SELECT YOUR HOMUNCULUS';
            
        const titleText = this.add.text(400, 80, title, {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#4444ff',
            strokeThickness: 3
        }).setOrigin(0.5);
        titleText.setShadow(0, 0, '#6666ff', 8, true, true);
        this.characterSelectionContainer.add(titleText);
        
        // Get available characters for current player
        const availableChars = this.currentPlayer === 'p1' ? 
            characterManager.getAvailableCharacters() :
            characterManager.getAvailableForPlayer('p2');
        
        console.log('Available characters:', availableChars);
        
        // Create tarot cards
        this.tarotCards = [];
        const cardWidth = 150;
        const cardHeight = 200;
        const spacing = 50;
        const startX = 400 - ((availableChars.length - 1) * (cardWidth + spacing)) / 2;
        const cardY = 280;
        
        availableChars.forEach((charKey, index) => {
            const x = startX + index * (cardWidth + spacing);
            const config = CHARACTER_CONFIG[charKey];
            
            if (!config) {
                console.error(`Missing config for character: ${charKey}`);
                return;
            }
            
            console.log(`Creating card for ${charKey}:`, config.tarot);
            
            // Card container
            const cardContainer = this.add.container(x, cardY);
            
            try {
                // Card back (default visible)
                const cardBack = this.add.image(0, 0, config.tarot.back);
                cardBack.setScale(0.8);
            
            // Card front (hidden by default)
            const cardFront = this.add.image(0, 0, config.tarot.front);
            cardFront.setScale(0.8);
            cardFront.setVisible(false);
            
            // Character name (shown when flipped)
            const nameText = this.add.text(0, 120, config.displayName, {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            nameText.setVisible(false);
            
            // Description (shown when flipped)
            const descText = this.add.text(0, 145, config.description, {
                fontSize: '12px',
                color: '#aaaaaa',
                align: 'center',
                wordWrap: { width: 140 }
            }).setOrigin(0.5);
            descText.setVisible(false);
            
            cardContainer.add([cardBack, cardFront, nameText, descText]);
            
            // Make interactive
            cardBack.setInteractive({ useHandCursor: true });
            cardFront.setInteractive({ useHandCursor: true });
            
            // Add floating animation
            this.tweens.add({
                targets: cardContainer,
                y: cardY - 10,
                duration: 2000 + index * 200,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            // Card click handler
            const handleCardClick = () => {
                this.selectCard(index);
            };
            
            cardBack.on('pointerdown', handleCardClick);
            cardFront.on('pointerdown', handleCardClick);
            
            // Hover effects
            cardBack.on('pointerover', () => {
                cardContainer.setScale(1.05);
            });
            cardBack.on('pointerout', () => {
                if (this.selectedCard !== index) {
                    cardContainer.setScale(1);
                }
            });
            cardFront.on('pointerover', () => {
                cardContainer.setScale(1.05);
            });
            cardFront.on('pointerout', () => {
                if (this.selectedCard !== index) {
                    cardContainer.setScale(1);
                }
            });
            
            this.characterSelectionContainer.add(cardContainer);
            this.tarotCards.push({
                container: cardContainer,
                cardBack,
                cardFront,
                nameText,
                descText,
                charKey,
                index
            });
            } catch (error) {
                console.error(`Error creating card for ${charKey}:`, error);
                // Create a fallback text card if images fail
                const fallbackCard = this.add.text(0, 0, charKey.toUpperCase(), {
                    fontSize: '24px',
                    color: '#ffffff',
                    backgroundColor: '#333333',
                    padding: { x: 20, y: 40 }
                }).setOrigin(0.5);
                cardContainer.add(fallbackCard);
                this.characterSelectionContainer.add(cardContainer);
            }
        });
        
        // Select button (hidden by default)
        this.selectButton = this.add.text(400, 450, 'SELECT HOMUNCULUS', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#444488',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        this.selectButton.setVisible(false);
        this.selectButton.setInteractive({ useHandCursor: true });
        
        this.selectButton.on('pointerover', () => {
            this.selectButton.setBackgroundColor('#6666aa');
        });
        
        this.selectButton.on('pointerout', () => {
            this.selectButton.setBackgroundColor('#444488');
        });
        
        this.selectButton.on('pointerdown', () => {
            this.confirmCharacterSelection();
        });
        
        this.characterSelectionContainer.add(this.selectButton);
        
        // Instructions
        const instructText = this.add.text(400, 520, 'Use arrow keys or click to select • Press ENTER to confirm', {
            fontSize: '14px',
            color: '#aaaaaa',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        this.characterSelectionContainer.add(instructText);
        
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
        
        this.characterSelectionContainer.add(backButton);
    }
    
    selectCard(index) {
        // Flip the selected card face up
        const card = this.tarotCards[index];
        
        // If clicking the same card that's already selected, do nothing
        if (this.selectedCard === index && card.cardFront.visible) {
            return;
        }
        
        // Flip all other cards face down
        this.tarotCards.forEach((c, i) => {
            if (i !== index) {
                c.cardBack.setVisible(true);
                c.cardFront.setVisible(false);
                c.nameText.setVisible(false);
                c.descText.setVisible(false);
                c.container.setScale(1);
                // Hide glow effect if it exists
                if (c.glowEffect) {
                    c.glowEffect.setVisible(false);
                }
            }
        });
        
        // Flip selected card face up
        card.cardBack.setVisible(false);
        card.cardFront.setVisible(true);
        card.nameText.setVisible(true);
        card.descText.setVisible(true);
        card.container.setScale(1.05);
        
        // Add a golden glow effect for selected card
        if (!card.glowEffect) {
            card.glowEffect = this.add.rectangle(0, 0, 140, 190, 0xffd700, 0);
            card.glowEffect.setStrokeStyle(3, 0xffd700, 1);
            card.container.addAt(card.glowEffect, 0); // Add behind card
        }
        card.glowEffect.setVisible(true);
        
        // Add pulsing animation to the glow
        this.tweens.add({
            targets: card.glowEffect,
            alpha: { from: 0.8, to: 0.3 },
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Show select button
        this.selectButton.setVisible(true);
        
        // Store selection
        this.selectedCard = index;
    }
    
    handleCharacterSelectionInput() {
        // Ensure keyboard controls are initialized
        if (!this.cursors || !this.spaceKey || !this.enterKey) {
            return;
        }
        
        // Handle arrow keys for card navigation
        const leftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.left);
        const rightJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.right);
        const confirmJustPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey) || 
            Phaser.Input.Keyboard.JustDown(this.enterKey);
        const backJustPressed = Phaser.Input.Keyboard.JustDown(this.escKey);
        
        // Handle gamepad input - use correct pad based on current player
        const padIndex = this.currentPlayer === 'p2' ? 1 : 0;
        const pad = this.input.gamepad && this.input.gamepad.pads[padIndex] ? 
            this.input.gamepad.pads[padIndex] : null;
        const padLeft = pad && pad.leftStick.x < -0.5 && !this.leftPressed;
        const padRight = pad && pad.leftStick.x > 0.5 && !this.rightPressed;
        const padConfirm = pad && pad.buttons[0].pressed && !this.confirmPressed;
        const padBack = pad && pad.buttons[1].pressed && !this.backPressed;
        
        // Track gamepad state to prevent repeat
        if (pad) {
            this.leftPressed = pad.leftStick.x < -0.5;
            this.rightPressed = pad.leftStick.x > 0.5;
            this.confirmPressed = pad.buttons[0].pressed;
            this.backPressed = pad.buttons[1].pressed;
        }
        
        // Navigate between cards
        if ((leftJustPressed || padLeft) && this.tarotCards.length > 0) {
            if (this.selectedCard === null) {
                // Select the last card if nothing selected
                this.selectCard(this.tarotCards.length - 1);
            } else if (this.selectedCard > 0) {
                // Move to previous card
                this.selectCard(this.selectedCard - 1);
            } else {
                // Wrap to last card
                this.selectCard(this.tarotCards.length - 1);
            }
        }
        
        if ((rightJustPressed || padRight) && this.tarotCards.length > 0) {
            if (this.selectedCard === null) {
                // Select the first card if nothing selected
                this.selectCard(0);
            } else if (this.selectedCard < this.tarotCards.length - 1) {
                // Move to next card
                this.selectCard(this.selectedCard + 1);
            } else {
                // Wrap to first card
                this.selectCard(0);
            }
        }
        
        // Confirm selection
        if ((confirmJustPressed || padConfirm) && this.selectedCard !== null) {
            this.confirmCharacterSelection();
        }
        
        // Go back
        if (backJustPressed || padBack) {
            this.scene.start('TitleScene');
        }
    }
    
    confirmCharacterSelection() {
        if (this.selectedCard === null) return;
        
        const selectedChar = this.tarotCards[this.selectedCard].charKey;
        console.log(`${this.currentPlayer} selected character:`, selectedChar);
        characterManager.selectCharacter(this.currentPlayer, selectedChar);
        
        // Check if P2 needs to select
        if (this.currentPlayer === 'p1' && this.p2Joined) {
            console.log('Moving to P2 character selection');
            // Move to P2 selection
            this.currentPlayer = 'p2';
            this.selectedCard = null;
            this.characterSelectionContainer.removeAll(true);
            this.createCharacterSelection();
        } else {
            console.log('Moving to stage selection');
            // Move to stage selection
            this.characterSelectionMode = false;
            this.characterSelectionContainer.setVisible(false);
            this.stageSelectionContainer.removeAll(true);
            this.stageSelectionContainer.setVisible(true);
            this.createStageSelection();
        }
    }
    
    handleP2Join() {
        console.log('P2 joining mid-game!');
        this.p2Joined = true;
        
        // Remove P2 join button if it exists
        const p2JoinButton = this.stageSelectionContainer.getByName('p2JoinButton');
        if (p2JoinButton) {
            p2JoinButton.destroy();
        }
        
        // Switch to P2 character selection
        this.currentPlayer = 'p2';
        this.selectedCard = null;
        this.characterSelectionMode = true;
        
        // Hide stage selection and show character selection
        this.stageSelectionContainer.setVisible(false);
        this.characterSelectionContainer.removeAll(true);
        this.characterSelectionContainer.setVisible(true);
        
        // Create character selection for P2
        this.createCharacterSelection();
    }
    
    createStageSelection() {
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
        this.stageSelectionContainer.add(titleText);

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
            this.stageSelectionContainer.add(container);
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
            // Go back to character selection
            this.characterSelectionMode = true;
            this.currentPlayer = 'p1';
            this.selectedCard = null;
            characterManager.reset();
            this.stageSelectionContainer.setVisible(false);
            this.characterSelectionContainer.removeAll(true);
            this.createCharacterSelection();
            this.characterSelectionContainer.setVisible(true);
        });
        this.stageSelectionContainer.add(backButton);

        // Highlight first unlocked stage
        this.highlightStage(0);
        
        // Add instruction text
        const instructionText = this.add.text(400, 560, 'Use Arrow Keys or Click to Select', {
            fontSize: '14px',
            color: '#aaaaaa',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        this.stageSelectionContainer.add(instructionText);
        
        // Add P2 join button if not joined
        if (!this.p2Joined) {
            const p2JoinButton = this.add.text(700, 560, 'P2 JOIN (Press M)', {
                fontSize: '16px',
                color: '#ffff00',
                backgroundColor: '#444444',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);
            p2JoinButton.setName('p2JoinButton');
            p2JoinButton.setInteractive({ useHandCursor: true });
            
            p2JoinButton.on('pointerover', () => {
                p2JoinButton.setBackgroundColor('#666666');
            });
            
            p2JoinButton.on('pointerout', () => {
                p2JoinButton.setBackgroundColor('#444444');
            });
            
            p2JoinButton.on('pointerdown', () => {
                console.log('P2 joining...');
                this.p2Joined = true;
                p2JoinButton.destroy();
                
                // Go back to character selection for P2
                this.currentPlayer = 'p2';
                this.selectedCard = null;
                this.characterSelectionMode = true;
                
                // Hide stage selection and show character selection
                this.stageSelectionContainer.setVisible(false);
                this.characterSelectionContainer.removeAll(true);
                
                try {
                    this.createCharacterSelection();
                    this.characterSelectionContainer.setVisible(true);
                } catch (error) {
                    console.error('Error creating P2 character selection:', error);
                    // If error, go back to stage selection
                    this.characterSelectionMode = false;
                    this.stageSelectionContainer.setVisible(true);
                }
            });
            
            this.stageSelectionContainer.add(p2JoinButton);
        }
    }

    createStarfield() {
        // Create a starfield background
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.Between(1, 3);
            const star = this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.3, 0.8));
            
            // Add twinkling effect
            this.tweens.add({
                targets: star,
                alpha: Phaser.Math.FloatBetween(0.1, 0.3),
                duration: Phaser.Math.Between(2000, 5000),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000)
            });
        }
    }

    update() {
        // Skip all input if keyboard is disabled (e.g., when showing stage detail)
        if (!this.input.keyboard.enabled) {
            return;
        }
        
        // Check for P2 join (M key or gamepad Start button)
        if (!this.p2Joined && !this.characterSelectionMode) {
            const pad2 = this.input.gamepad ? this.input.gamepad.pad2 : null;
            const mPressed = Phaser.Input.Keyboard.JustDown(this.mKey);
            const startPressed = pad2 && pad2.buttons[9] && pad2.buttons[9].pressed && !this.p2StartPressed;
            
            if (pad2) {
                this.p2StartPressed = pad2.buttons[9] ? pad2.buttons[9].pressed : false;
            }
            
            if (mPressed || startPressed) {
                this.handleP2Join();
                return;
            }
        }
        
        // Handle character selection mode input
        if (this.characterSelectionMode) {
            this.handleCharacterSelectionInput();
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
            0: { left: 4, right: 1, up: 6, down: 2 },  // Forest
            1: { left: 0, right: 5, up: 6, down: 3 },  // Cave
            2: { left: 4, right: 3, up: 0, down: 4 },  // Desert
            3: { left: 2, right: 5, up: 1, down: 5 },  // Lava
            4: { left: 2, right: 5, up: 0, down: 7 },  // Grave
            5: { left: 4, right: 3, up: 1, down: 7 },  // Castle
            6: { left: 0, right: 1, up: 7, down: 0 },  // Spire
            7: { left: 4, right: 5, up: 6, down: 7 }   // Snow
        };
        
        const currentNav = navigationMap[this.selectedStage];
        
        // Navigate between stages
        if (leftJustPressed && currentNav.left !== undefined) {
            this.highlightStage(currentNav.left);
        }
        
        if (rightJustPressed && currentNav.right !== undefined) {
            this.highlightStage(currentNav.right);
        }
        
        if (upJustPressed && currentNav.up !== undefined) {
            this.highlightStage(currentNav.up);
        }
        
        if (downJustPressed && currentNav.down !== undefined) {
            this.highlightStage(currentNav.down);
        }
        
        // Select stage
        if (confirmJustPressed && this.stages[this.selectedStage].unlocked) {
            this.selectStage(this.selectedStage);
        }
        
        // Go back
        if (backJustPressed) {
            // Go back to character selection
            this.characterSelectionMode = true;
            this.currentPlayer = 'p1';
            this.selectedCard = null;
            characterManager.reset();
            this.stageSelectionContainer.setVisible(false);
            this.characterSelectionContainer.removeAll(true);
            this.createCharacterSelection();
            this.characterSelectionContainer.setVisible(true);
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
        
        // Allow castle stage (index 5) for testing
        if (index === 0 || index === 1 || index === 5) {
            // Show stage detail view with co-op option
            console.log('Selected stage:', stageMappings[index], 'at index:', index);
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
        const description = this.add.text(400, 160, stageInfo.description, {
            fontSize: '20px',
            color: '#cccccc'
        });
        description.setOrigin(0.5);
        
        // Single Player button
        const singlePlayerBtn = this.add.text(300, 300, 'SOLO', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#333366',
            padding: { x: 30, y: 15 }
        });
        singlePlayerBtn.setOrigin(0.5);
        singlePlayerBtn.setInteractive({ useHandCursor: true });
        
        singlePlayerBtn.on('pointerover', () => {
            singlePlayerBtn.setBackgroundColor('#4444aa');
            singlePlayerBtn.setScale(1.1);
        });
        
        singlePlayerBtn.on('pointerout', () => {
            singlePlayerBtn.setBackgroundColor('#333366');
            singlePlayerBtn.setScale(1);
        });
        
        singlePlayerBtn.on('pointerdown', () => {
            // Stop music
            if (this.bgm) {
                this.bgm.stop();
            }
            
            // Start game with selected characters
            this.scene.start('GameScene', {
                stage: stageKey,
                p1Character: characterManager.getSelectedCharacter('p1') || 'wizard',
                p2Character: characterManager.getSelectedCharacter('p2'),
                coopMode: false,
                p2Joined: false
            });
        });
        
        // Co-op button
        const coopBtn = this.add.text(500, 300, 'CO-OP', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#663333',
            padding: { x: 30, y: 15 }
        });
        coopBtn.setOrigin(0.5);
        coopBtn.setInteractive({ useHandCursor: true });
        
        coopBtn.on('pointerover', () => {
            coopBtn.setBackgroundColor('#aa4444');
            coopBtn.setScale(1.1);
        });
        
        coopBtn.on('pointerout', () => {
            coopBtn.setBackgroundColor('#663333');
            coopBtn.setScale(1);
        });
        
        coopBtn.on('pointerdown', () => {
            // Check if P2 has selected a character
            if (!this.p2Joined || !characterManager.getSelectedCharacter('p2')) {
                // Need P2 to join first
                const warningText = this.add.text(400, 400, 'Player 2 must join and select a character first!', {
                    fontSize: '20px',
                    color: '#ffff00'
                }).setOrigin(0.5);
                
                this.tweens.add({
                    targets: warningText,
                    alpha: 0,
                    duration: 2000,
                    ease: 'Power2',
                    onComplete: () => warningText.destroy()
                });
                return;
            }
            
            // Stop music
            if (this.bgm) {
                this.bgm.stop();
            }
            
            // Start game with co-op
            this.scene.start('GameScene', {
                stage: stageKey,
                p1Character: characterManager.getSelectedCharacter('p1') || 'wizard',
                p2Character: characterManager.getSelectedCharacter('p2'),
                coopMode: true,
                p2Joined: true
            });
        });
        
        // Cancel button
        const cancelBtn = this.add.text(400, 400, 'CANCEL', {
            fontSize: '24px',
            color: '#ffffff'
        });
        cancelBtn.setOrigin(0.5);
        cancelBtn.setInteractive({ useHandCursor: true });
        
        cancelBtn.on('pointerover', () => {
            cancelBtn.setColor('#ff6666');
            cancelBtn.setScale(1.1);
        });
        
        cancelBtn.on('pointerout', () => {
            cancelBtn.setColor('#ffffff');
            cancelBtn.setScale(1);
        });
        
        cancelBtn.on('pointerdown', () => {
            // Remove detail view
            overlay.destroy();
            title.destroy();
            description.destroy();
            singlePlayerBtn.destroy();
            coopBtn.destroy();
            cancelBtn.destroy();
            
            // Re-enable keyboard input
            this.input.keyboard.enabled = true;
        });
    }
}