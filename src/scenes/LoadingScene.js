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
        // Load the loading screen image
        this.load.image('loading-bg', 'art1.png');
        
        // Only load other assets if this is the first time (initial load)
        if (this.nextScene === 'TitleScene' && !this.textures.exists('title-bg')) {

            // Create loading bar
            const progressBar = this.add.graphics();
            const progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(240, 270, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
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
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Load all game assets
        this.loadGameAssets();
        }
    }

    loadGameAssets() {
        // UI Assets
        this.load.image('title-bg', 'magustitle.png');

        // Wizard sprites
        this.load.spritesheet('wizard-idle', 'wizmove/newiz/wizard idle.png', {
            frameWidth: 80,
            frameHeight: 80
        });
        this.load.spritesheet('wizard-fly', 'wizmove/newiz/wizard fly forward.png', {
            frameWidth: 80,
            frameHeight: 80
        });
        this.load.spritesheet('wizard-death', 'wizmove/newiz/wizard death.png', {
            frameWidth: 80,
            frameHeight: 80
        });

        // Enemy sprites
        this.load.spritesheet('enemy-walk', 'tree/tronchungo3/walking-sheet.png', {
            frameWidth: 48,
            frameHeight: 60
        });

        // Tiles and environment
        this.load.image('dirt-tiles', 'TopDownFantasy_Forest_v1/TopDownFantasy-Forest/Tiles/dirt.png');
        this.load.image('grass-tile', 'grass.PNG');
        this.load.image('stone-tile', 'stone.png');
        this.load.image('tree', 'foliage.png');

        // Element symbols sprite sheets
        this.load.spritesheet('element-symbols', 'elements.png', {
            frameWidth: 273,
            frameHeight: 273
        });
        this.load.spritesheet('element-symbols2', 'elements2.PNG', {
            frameWidth: 341,
            frameHeight: 341
        });
        this.load.spritesheet('element-symbols3', 'elements3.PNG', {
            frameWidth: 341,
            frameHeight: 341
        });

        // Slime sprites
        for (let i = 0; i < 4; i++) {
            this.load.image(`slime-idle-${i}`, `Slime/Individual Sprites/slime-idle-${i}.png`);
            this.load.image(`slime-die-${i}`, `Slime/Individual Sprites/slime-die-${i}.png`);
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
        this.load.spritesheet('golem-orange-walk', 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_walk.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-orange-hurt', 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_hurt.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-orange-die', 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_die.png', {
            frameWidth: 90,
            frameHeight: 64
        });

        // Blue Golem
        this.load.spritesheet('golem-blue-walk', 'Golem_1/Blue/No_Swoosh_VFX/Golem_1_walk.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-blue-hurt', 'Golem_1/Blue/No_Swoosh_VFX/Golem_1_hurt.png', {
            frameWidth: 90,
            frameHeight: 64
        });
        this.load.spritesheet('golem-blue-die', 'Golem_1/Blue/No_Swoosh_VFX/Golem_1_die.png', {
            frameWidth: 90,
            frameHeight: 64
        });
    }

    loadEnemySprites() {
        // Sorcerer enemy
        for (let i = 0; i < 10; i++) {
            this.load.image(`sorcerer-attack-${i}`, `newenemies/sorcerer villain/sorcerer attack_Animation 1_${i}.png`);
        }

        // Bat sprites
        for (let i = 0; i < 7; i++) {
            this.load.image(`bat-fly-${i}`, `newenemies/bat/bat fly_${i}.png`);
        }

        // Mushroom sprites
        for (let i = 0; i < 8; i++) {
            this.load.image(`mushroom-walk-${i}`, `newenemies/mushy/mushroom walk_${i}.png`);
        }

        // Fire worm sprites
        for (let i = 0; i < 9; i++) {
            this.load.image(`fireworm-walk-${i}`, `newenemies/fireworm/fire worm walk_${i}.png`);
        }

        // Summoner sprites
        this.load.spritesheet('summoner-idle', 'newenemies/summoner/The Summoner idle animation-export.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('summoner-cast', 'newenemies/summoner/The Summoner cast animation-export.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Lost soul sprites
        for (let i = 0; i < 16; i++) {
            this.load.image(`soul-idle-${i}`, `newenemies/lostsoul/lost soul idle ${String(i).padStart(2, '0')}.png`);
        }

        // Bloboid sprites
        for (let i = 0; i < 8; i++) {
            this.load.image(`bloboid-walk-${i}`, `newenemies/blob/blob minion walk ${String(i).padStart(2, '0')}.png`);
        }

        // Dark eye sprites
        for (let i = 1; i <= 8; i++) {
            this.load.image(`darkeye-walk-${i}`, `newenemies/Bringer-Of-Death/Individual Sprite/Walk/Bringer-of-Death_Walk_${i}.png`);
        }
    }

    loadSpellEffects() {
        this.load.spritesheet('fire-spell', 'spells/fire1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('arcane-spell', 'spells/arcane1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('earth-spell', 'spells/earth1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('water-spell', 'spells/water1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load lightning spell
        this.load.spritesheet('lightning-spell', 'spells/lightning1.png', {
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

        // Display loading complete image
        const loadingImage = this.add.image(400, 300, 'loading-bg');
        
        // If this is a transition (not initial load), we can proceed faster
        const fadeDelay = this.nextScene === 'TitleScene' ? 1000 : 500;

        // Create a black overlay for smooth transition
        const blackOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
        blackOverlay.setAlpha(0);

        // Wait a bit before starting fade
        this.time.delayedCall(fadeDelay, () => {
            // First fade the loading image
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
        });
    }
}