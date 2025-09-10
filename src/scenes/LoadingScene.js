export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
        this.nextScene = 'TitleScene'; // Default next scene
    }
    
    init(data) {
        // Allow specifying next scene when starting this scene
        this.nextScene = data?.nextScene || 'TitleScene';
        this.sceneData = data?.data || {};
    }

    preload() {
        // Set background color immediately
        this.cameras.main.setBackgroundColor('#11130d');
        
        // Load the loading screen image
        this.load.image('loading-bg', 'assets/images/art1.png');
        
        // We'll create a procedural cartridge instead of loading an image
        
        // Only load other assets if this is the first time (initial load)
        if (this.nextScene === 'TitleScene' && !this.textures.exists('title-bg')) {

            // Create loading text immediately
            const loadingTitle = this.add.text(400, 100, 'WIZBIZ', {
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            loadingTitle.setOrigin(0.5);
            loadingTitle.setDepth(10);
            
            // Create a procedural game cartridge
            const cartridgeContainer = this.add.container(400, 250);
            cartridgeContainer.setDepth(100);
            
            // Create cartridge graphics
            const graphics = this.add.graphics();
            
            // Main cartridge body (dark gray)
            graphics.fillStyle(0x2a2a2a, 1);
            graphics.fillRoundedRect(-40, -60, 80, 100, 8);
            
            // Cartridge label area (lighter gray)
            graphics.fillStyle(0x4a4a4a, 1);
            graphics.fillRoundedRect(-35, -30, 70, 50, 4);
            
            // Gold contacts at bottom
            graphics.fillStyle(0xffd700, 1);
            for (let i = 0; i < 8; i++) {
                graphics.fillRect(-32 + i * 9, 35, 6, 8);
            }
            
            // Add "WIZBIZ" text on label
            const labelText = this.add.text(0, -5, 'WIZBIZ', {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            labelText.setOrigin(0.5);
            
            // Add a magical glow effect
            const glowGraphics = this.add.graphics();
            glowGraphics.lineStyle(4, 0x00ffff, 0.3);
            glowGraphics.strokeRoundedRect(-42, -62, 84, 104, 8);
            
            // Add all elements to container
            cartridgeContainer.add([glowGraphics, graphics, labelText]);
            
            // Initial fade in
            cartridgeContainer.setAlpha(0);
            this.tweens.add({
                targets: cartridgeContainer,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
            
            // 3D-like rotation animation
            this.tweens.add({
                targets: cartridgeContainer,
                scaleX: { from: 1, to: -1 },
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                onUpdate: () => {
                    // Flip the label text when cartridge flips
                    if (cartridgeContainer.scaleX < 0) {
                        labelText.setScale(-1, 1);
                    } else {
                        labelText.setScale(1, 1);
                    }
                }
            });
            
            // Vertical spin
            this.tweens.add({
                targets: cartridgeContainer,
                rotation: Math.PI * 2,
                duration: 4000,
                repeat: -1,
                ease: 'Linear'
            });
            
            // Pulse effect
            this.tweens.add({
                targets: cartridgeContainer,
                scaleY: { from: 1, to: 1.1 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Glow pulse
            this.tweens.add({
                targets: glowGraphics,
                alpha: { from: 0.3, to: 0.8 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.spinningCartridge = cartridgeContainer;

            // Create loading UI elements

            // Create loading bar
            const progressBar = this.add.graphics();
            const progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(240, 370, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 95,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // Update loading bar
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 380, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            percentText.destroy();
            // Keep the cartridge spinning - it will be cleaned up in create()
        });

        // Load all game assets
        this.loadGameAssets();
        }
    }

    loadGameAssets() {
        // UI Assets
        this.load.image('title-bg', 'assets/images/magustitle.png');

        // Wizard sprites
        this.load.spritesheet('wizard-idle', 'assets/sprites/wizmove/newiz/wizard%20idle.png', {
            frameWidth: 80,
            frameHeight: 80
        });
        this.load.spritesheet('wizard-fly', 'assets/sprites/wizmove/newiz/wizard%20fly%20forward.png', {
            frameWidth: 80,
            frameHeight: 80
        });
        this.load.spritesheet('wizard-death', 'assets/sprites/wizmove/newiz/wizard%20death.png', {
            frameWidth: 80,
            frameHeight: 80
        });

        // Enemy sprites
        this.load.spritesheet('enemy-walk', 'assets/enemies/tree/tronchungo3/walking-sheet.png', {
            frameWidth: 48,
            frameHeight: 60
        });

        // Tiles and environment
        this.load.image('dirt-tiles', 'assets/TopDownFantasy_Forest_v1/TopDownFantasy-Forest/Tiles/dirt.png');
        this.load.image('grass-tile', 'assets/images/grass.PNG');
        this.load.image('stone-tile', 'assets/images/stone.png');
        this.load.image('tree', 'assets/images/foliage.png');

        // Element symbols sprite sheets
        this.load.spritesheet('element-symbols', 'assets/images/elements.png', {
            frameWidth: 273,
            frameHeight: 273
        });
        this.load.spritesheet('element-symbols2', 'assets/images/elements2.PNG', {
            frameWidth: 341,
            frameHeight: 341
        });
        this.load.spritesheet('element-symbols3', 'assets/images/elements3.PNG', {
            frameWidth: 341,
            frameHeight: 341
        });

        // Slime sprites
        for (let i = 0; i < 4; i++) {
            this.load.image(`slime-idle-${i}`, `assets/Slime/Individual Sprites/slime-idle-${i}.png`);
            this.load.image(`slime-die-${i}`, `assets/Slime/Individual Sprites/slime-die-${i}.png`);
        }

        // Golem sprites
        this.loadGolemSprites();

        // Other enemy sprites
        this.loadEnemySprites();

        // Spell effects
        this.loadSpellEffects();

        // Collectibles
        this.loadCollectibles();
    }

    loadGolemSprites() {
        // Orange Golem
        this.load.spritesheet('golem-orange-walk', 'assets/Golem_1/Orange/No_Swoosh_VFX/Golem_1_walk.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-orange-hurt', 'assets/Golem_1/Orange/No_Swoosh_VFX/Golem_1_hurt.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-orange-die', 'assets/Golem_1/Orange/No_Swoosh_VFX/Golem_1_die.png', {
            frameWidth: 90,
            frameHeight: 64
        });

        // Blue Golem
        this.load.spritesheet('golem-blue-walk', 'assets/Golem_1/Blue/No_Swoosh_VFX/Golem_1_walk.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-blue-hurt', 'assets/Golem_1/Blue/No_Swoosh_VFX/Golem_1_hurt.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-blue-die', 'assets/Golem_1/Blue/No_Swoosh_VFX/Golem_1_die.png', {
            frameWidth: 90,
            frameHeight: 64
        });
    }

    loadEnemySprites() {
        // Sorcerer enemy
        for (let i = 0; i < 10; i++) {
            this.load.image(`sorcerer-attack-${i}`, `assets/newenemies/sorcerer villain/sorcerer attack_Animation 1_${i}.png`);
        }

        // Bat sprites
        for (let i = 0; i < 7; i++) {
            this.load.image(`bat-fly-${i}`, `assets/newenemies/bat/bat fly_${i}.png`);
        }

        // Mushroom sprites
        for (let i = 0; i < 8; i++) {
            this.load.image(`mushroom-walk-${i}`, `assets/newenemies/mushy/mushroom walk_${i}.png`);
        }

        // Fire worm sprites
        for (let i = 0; i < 9; i++) {
            this.load.image(`fireworm-walk-${i}`, `assets/newenemies/fireworm/fire worm walk_${i}.png`);
        }

        // Summoner sprites
        this.load.spritesheet('summoner-idle', 'assets/newenemies/summoner/The%20Summoner%20idle%20animation-export.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('summoner-cast', 'assets/newenemies/summoner/The%20Summoner%20cast%20animation-export.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Lost soul sprites
        for (let i = 0; i < 16; i++) {
            this.load.image(`soul-idle-${i}`, `assets/newenemies/lostsoul/lost soul idle ${String(i).padStart(2, '0')}.png`);
        }

        // Bloboid sprites
        for (let i = 0; i < 8; i++) {
            this.load.image(`bloboid-walk-${i}`, `assets/newenemies/blob/blob minion walk ${String(i).padStart(2, '0')}.png`);
        }

        // Dark eye sprites
        for (let i = 1; i <= 8; i++) {
            this.load.image(`darkeye-walk-${i}`, `assets/newenemies/Bringer-Of-Death/Individual Sprite/Walk/Bringer-of-Death_Walk_${i}.png`);
        }
    }

    loadSpellEffects() {
        this.load.spritesheet('fire-spell', 'assets/effects/spells/fire1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('arcane-spell', 'assets/effects/spells/arcane1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('earth-spell', 'assets/effects/spells/earth1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('water-spell', 'assets/effects/spells/water1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load lightning spell
        this.load.spritesheet('lightning-spell', 'assets/effects/spells/lightning1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load individual air spell frames
        for (let i = 1; i <= 7; i++) {
            this.load.image(`air${i}`, `spells/air${i}.png`);
        }
    }

    loadCollectibles() {
        this.load.image('element-orb', 'xp.png');
        this.load.image('jewel-xp', 'jewel.png');
        this.load.image('muffin', 'healthpickup.png');
    }

    create() {
        // Set background to match the dark theme
        this.cameras.main.setBackgroundColor('#11130d');
        
        // Don't show loading image if we have a cartridge
        let loadingImage = null;
        if (!this.spinningCartridge) {
            // Only show loading image if cartridge failed to load
            loadingImage = this.add.image(400, 300, 'loading-bg');
        }
        
        // If this is a transition (not initial load), we can proceed faster
        const fadeDelay = this.nextScene === 'TitleScene' ? 4000 : 500; // Even longer delay to see cartridge

        // Create a black overlay for smooth transition
        const blackOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
        blackOverlay.setAlpha(0);

        // Wait a bit before starting fade
        this.time.delayedCall(fadeDelay, () => {
            // Fade out cartridge if it exists
            if (this.spinningCartridge) {
                // Stop all existing tweens on the cartridge
                this.tweens.killTweensOf(this.spinningCartridge);
                
                // Fancy fade out with spin
                this.tweens.add({
                    targets: this.spinningCartridge,
                    alpha: 0,
                    scaleX: 0,
                    scaleY: 0,
                    rotation: this.spinningCartridge.rotation + Math.PI * 2,
                    y: this.spinningCartridge.y - 50,
                    duration: 800,
                    ease: 'Back.easeIn',
                    onComplete: () => {
                        this.spinningCartridge.destroy();
                    }
                });
            }
            
            // First fade the loading image if it exists
            if (loadingImage) {
                this.tweens.add({
                    targets: loadingImage,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        // Then fade in the black overlay
                        this.tweens.add({
                            targets: blackOverlay,
                            alpha: 1,
                            duration: 500,
                            ease: 'Power2',
                            onComplete: () => {
                                // Start the next scene
                                this.scene.start(this.nextScene, this.sceneData);
                            }
                        });
                    }
                });
            } else {
                // No loading image, just fade to black
                this.tweens.add({
                    targets: blackOverlay,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        // Start the next scene
                        this.scene.start(this.nextScene, this.sceneData);
                    }
                });
            }
        });
    }
}