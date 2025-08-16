class LoadingScene extends Phaser.Scene {
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

        // Load all game assets here
        this.load.image('title-bg', 'magustitle.png');
        this.load.image('gameover-bg', 'gameover.png');
        this.load.image('title-words', 'titlewords.PNG');

        // Load wizard sprites
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

        // Load enemy sprites
        this.load.spritesheet('enemy-walk', 'tree/tronchungo3/walking-sheet.png', {
            frameWidth: 48,
            frameHeight: 60
        });

        // Load tiles and environment
        this.load.image('dirt-tiles', 'TopDownFantasy_Forest_v1/TopDownFantasy-Forest/Tiles/dirt.png');
        // Load grass tile with a specific frame to crop out transparent areas
        // Assuming the actual grass content is in the top-left corner
        this.load.image('grass-tile', 'grass.PNG');
        this.load.image('stone-tile', 'stone.png');
        this.load.image('lava-tile', 'lava.png');
        this.load.image('tree', 'foliage.png');
        
        // Load charge slot upgrade sprite
        this.load.image('charge-slot', 'chargeslot.png');
        
        // Load level up reward icons
        this.load.image('meditate-icon', 'meditate.png');
        this.load.image('element-select-icon', 'elementsekect.png');
        this.load.image('fusion-icon', 'holdflask.png');
        
        // Load wave element symbol
        this.load.image('wave-symbol', 'wave.png');
        
        // Load sand element symbol
        this.load.image('sand-symbol', 'sand.png');
        
        // Load gravity element symbol
        this.load.image('gravity-symbol', 'gravity.png');
        
        // Load star element symbol
        this.load.image('star-symbol', 'star.png');
        
        // Load life element symbol
        this.load.image('life-symbol', 'life.png');
        
        // Load background music
        this.load.audio('bgm', 'homonculibgm.mp3');
        this.load.audio('bgm2', 'bgm2.mp3');

        // Load element symbols sprite sheets
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

        // Load slime sprites
        for (let i = 0; i < 4; i++) {
            this.load.image(`slime-idle-${i}`, `Slime/Individual Sprites/slime-idle-${i}.png`);
            this.load.image(`slime-die-${i}`, `Slime/Individual Sprites/slime-die-${i}.png`);
        }

        // Load golem sprites - Orange
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

        // Load golem sprites - Blue
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

        // Load sorcerer enemy sprites
        for (let i = 0; i < 10; i++) {
            this.load.image(`sorcerer-attack-${i}`, `newenemies/sorcerer villain/sorcerer attack_Animation 1_${i}.png`);
        }

        // Load spell effect sprites
        this.load.spritesheet('fire-spell', 'spells/fire1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('arcane-spell', 'spells/arcane1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('water-spell', 'spells/water1.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        
        this.load.spritesheet('ice-spell', 'spells/ice.PNG', {
            frameWidth: 32,
            frameHeight: 32
        });
        
        this.load.spritesheet('volcano-spell', 'spells/volcano1.PNG', {
            frameWidth: 64,
            frameHeight: 64
        });
        
        this.load.spritesheet('wave-spell', 'spells/wave.PNG', {
            frameWidth: 64,
            frameHeight: 66
        });
        
        // Old poison sprite - keeping for compatibility
        this.load.spritesheet('poison-spell-old', 'spells/poison.PNG', {
            frameWidth: 32,
            frameHeight: 32
        });
        
        // New poison sprite sheet with 9 frames
        this.load.spritesheet('poison-spell', 'spells/poison-sheet.png', {
            frameWidth: 55,
            frameHeight: 41
        });
        
        // XP gem sprite sheet with 9 frames
        this.load.spritesheet('xp-gem', 'xpgem.PNG', {
            frameWidth: 193,
            frameHeight: 233
        });
        
        // Cave obstacle assets
        this.load.image('cave-crystal', 'cave/crystal.PNG');
        this.load.image('cave-rock', 'cave/rock.PNG');
        this.load.image('cave-stala', 'cave/stala.PNG');

        this.load.spritesheet('lightning-spell', 'spells/lightning1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('earth-spell', 'spells/earth1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load individual crystal spell frames
        for (let i = 2; i <= 6; i++) {
            this.load.image(`crystal-frame-${i}`, `spells/crystalframe${i}.PNG`);
        }
        
        // Load rock spell animation (6 frames)
        this.load.spritesheet('rock-spell', 'spells/rock1(6frames).PNG', {
            frameWidth: 32,
            frameHeight: 30
        });
        
        // Load crystal bullet
        this.load.image('crystal-bullet', 'spells/crystalbullet.PNG');
        
        // Load gravity spell sprite sheet
        this.load.spritesheet('gravity-spell', 'spells/gravity1.PNG', {
            frameWidth: 64,
            frameHeight: 59
        });
        
        // Load meteor spell sprite sheet
        this.load.spritesheet('meteor-spell', 'spells/meteor1.PNG', {
            frameWidth: 32,
            frameHeight: 38
        });
        
        // Load star spell sprite sheet
        this.load.spritesheet('star-spell', 'spells/star1(6frames).PNG', {
            frameWidth: Math.floor(383 / 6), // 63 pixels per frame
            frameHeight: 46
        });
        
        // Load storm spell sprite sheet
        this.load.spritesheet('storm-spell', 'spells/thunder1-17frames.PNG', {
            frameWidth: 64, // 1088 ÷ 17 frames
            frameHeight: 68
        });

        // Load individual air spell frames
        for (let i = 1; i <= 7; i++) {
            this.load.image(`air-spell-${i}`, `spells/air${i}.png`);
        }

        // Load bat enemy sprite
        this.load.spritesheet('bat-fly', 'bateye/Flight.png', {
            frameWidth: 150,
            frameHeight: 150
        });

        // Load mushroom enemy sprite
        this.load.spritesheet('mushroom-run', 'mushroom/Run.png', {
            frameWidth: 150, // 1200 / 8 frames
            frameHeight: 46  // Actual height of the sprite
        });

        // Load fire worm enemy sprite
        this.load.spritesheet('fireworm-walk', 'fireworm/Walk.png', {
            frameWidth: 90, // 810 / 9 frames
            frameHeight: 90
        });

        // Load summoner enemy sprites
        this.load.spritesheet('summoner-idle', 'newenemies/summoner/The Summoner idle animation-export.png', {
            frameWidth: 80, // 960 / 12 frames
            frameHeight: 80
        });

        this.load.spritesheet('summoner-summon', 'newenemies/summoner/summon animation-export.png', {
            frameWidth: 100, // 1400 / 14 frames
            frameHeight: 80
        });

        // Load lost soul enemy sprites
        this.load.spritesheet('soul-move', 'newenemies/Soul/Soul/move/Soul_move.png', {
            frameWidth: 96,
            frameHeight: 96 // 768 / 8 frames
        });

        this.load.spritesheet('soul-attack', 'newenemies/Soul/Soul/attack/Soul_attack.png', {
            frameWidth: 96,
            frameHeight: 96 // 960 / 10 frames
        });

        this.load.spritesheet('soul-bullet', 'newenemies/Soul/Soul/attack/bullet.png', {
            frameWidth: 96,
            frameHeight: 96 // 384 / 4 frames
        });

        // Load bloboid enemy sprite
        this.load.spritesheet('bloboid-walk', 'newenemies/blob/blob minion walk.png', {
            frameWidth: 80, // 640 / 8 frames
            frameHeight: 35
        });

        // Load dark eye enemy sprites (individual frames)
        for (let i = 1; i <= 8; i++) {
            this.load.image(`darkeye-walk-${i}`, `newenemies/Bringer-Of-Death/Individual Sprite/Walk/Bringer-of-Death_Walk_${i}.png`);
        }

        // Load chest sprites
        this.load.spritesheet('chest-idle', 'Chests5frames.PNG', {
            frameWidth: 48,
            frameHeight: 27
        });
        
        this.load.spritesheet('chest-open', 'Chestsopen5frames.PNG', {
            frameWidth: 48,
            frameHeight: 27
        });
        
        // Load upgrade icons sprite sheet
        this.load.spritesheet('upgrade-icons', 'upgradeicons10x6.PNG', {
            frameWidth: 153,  // 1526 / 10 = 152.6, rounded to 153
            frameHeight: 171  // 1024 / 6 = 170.67, rounded to 171
        });
        
        // Load kawaii muffin sprite
        this.load.image('muffin', 'Kawaii choco muffin.png');
        }
    }

    create() {
        // Set background to match the dark theme
        this.cameras.main.setBackgroundColor('#11130d');

        // Display loading complete image
        const loadingImage = this.add.image(400, 300, 'loading-bg');
        
        // Add "Loading..." text at the bottom of the screen
        const loadingText = this.add.text(400, 550, 'Loading...', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        loadingText.setOrigin(0.5);
        
        // If this is a transition (not initial load), we can proceed faster
        const fadeDelay = this.nextScene === 'TitleScene' ? 1000 : 500;

        // Create a black overlay for smooth transition
        const blackOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
        blackOverlay.setAlpha(0);

        // Wait a bit before starting fade
        this.time.delayedCall(fadeDelay, () => {
            // First fade the loading image and text
            this.tweens.add({
                targets: [loadingImage, loadingText],
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

class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.debugEnabled = localStorage.getItem('debugMode') === 'true';
    }

    preload() {
        // Assets are already loaded in LoadingScene
    }

    create() {
        // Apply saved volume
        const savedVolume = localStorage.getItem('gameVolume');
        if (savedVolume !== null) {
            this.game.sound.volume = parseFloat(savedVolume);
        }
        
        // Set background to black first
        this.cameras.main.setBackgroundColor('#000000');
        
        // Create a black overlay that will fade out
        const blackOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
        blackOverlay.setDepth(1000);

        // Add background image with proper aspect ratio
        const bg = this.add.image(400, 300, 'title-bg');

        // Calculate proper scale to fit while maintaining aspect ratio
        const imgWidth = bg.width;
        const imgHeight = bg.height;
        const scaleX = 800 / imgWidth;
        const scaleY = 600 / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        bg.setScale(scale);
        
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

        const title = this.add.image(400, 200, 'title-words');
        title.setOrigin(0.5);
        title.setScale(0.8); // Adjust scale as needed

        const startText = this.add.text(400, 400, 'Press SPACE or A to Start', {
            fontSize: '28px',
            color: '#aaffaa'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Options button - bottom right corner
        const optionsButton = this.add.text(750, 560, 'OPTIONS', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 8 }
        }).setOrigin(1, 1);
        optionsButton.setInteractive({ useHandCursor: true });
        
        optionsButton.on('pointerover', () => {
            optionsButton.setColor('#ffd700');
        });
        
        optionsButton.on('pointerout', () => {
            optionsButton.setColor('#ffffff');
        });
        
        optionsButton.on('pointerdown', () => {
            this.showOptionsMenu();
        });
        
        // Fullscreen button - top right corner
        this.createFullscreenButton();

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('StageSelectScene');
        });

        // Enable gamepad support
        if (this.input.gamepad.total > 0) {
            this.gamepad = this.input.gamepad.getPad(0);
        }
    }

    update() {
        // Check for gamepad Start button or A button
        if (this.input.gamepad && this.input.gamepad.total > 0) {
            const pad = this.input.gamepad.getPad(0);
            if (pad && (pad.buttons[0].pressed || pad.buttons[9].pressed)) {
                this.scene.start('StageSelectScene');
            }
        }
    }
    
    showOptionsMenu() {
        // Create options menu overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
        overlay.setInteractive(); // Block clicks to elements below
        
        const menuTitle = this.add.text(400, 50, 'OPTIONS', {
            fontSize: '42px',
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Debug mode toggle
        const debugContainer = this.add.container(400, 120);
        const debugLabel = this.add.text(-200, 0, 'Debug Mode:', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        const debugCheckbox = this.add.rectangle(150, 0, 35, 35, 0x444444);
        debugCheckbox.setStrokeStyle(3, 0xffd700);
        debugCheckbox.setInteractive({ useHandCursor: true });
        
        const debugCheck = this.add.text(150, 0, '✓', {
            fontSize: '24px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        debugCheck.setVisible(this.debugEnabled);
        
        debugCheckbox.on('pointerdown', () => {
            this.debugEnabled = !this.debugEnabled;
            debugCheck.setVisible(this.debugEnabled);
            localStorage.setItem('debugMode', this.debugEnabled.toString());
        });
        
        debugContainer.add([debugLabel, debugCheckbox, debugCheck]);
        
        // Show all recipes toggle
        const recipesContainer = this.add.container(400, 160);
        const recipesLabel = this.add.text(-200, 0, 'Show All Recipes:', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        const recipesCheckbox = this.add.rectangle(150, 0, 35, 35, 0x444444);
        recipesCheckbox.setStrokeStyle(3, 0xffd700);
        recipesCheckbox.setInteractive({ useHandCursor: true });
        
        // Check if show all recipes is enabled
        const showAllRecipes = localStorage.getItem('showAllRecipes') === 'true';
        
        const recipesCheck = this.add.text(150, 0, '✓', {
            fontSize: '24px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        recipesCheck.setVisible(showAllRecipes);
        
        recipesCheckbox.on('pointerdown', () => {
            const currentState = localStorage.getItem('showAllRecipes') === 'true';
            const newState = !currentState;
            recipesCheck.setVisible(newState);
            localStorage.setItem('showAllRecipes', newState.toString());
        });
        
        recipesContainer.add([recipesLabel, recipesCheckbox, recipesCheck]);
        
        // Unlock all stages toggle
        const stagesContainer = this.add.container(400, 200);
        const stagesLabel = this.add.text(-200, 0, 'Unlock All Stages:', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        const stagesCheckbox = this.add.rectangle(150, 0, 35, 35, 0x444444);
        stagesCheckbox.setStrokeStyle(3, 0xffd700);
        stagesCheckbox.setInteractive({ useHandCursor: true });
        
        // Check if unlock all stages is enabled
        const unlockAllStages = localStorage.getItem('unlockAllStages') === 'true';
        
        const stagesCheck = this.add.text(150, 0, '✓', {
            fontSize: '24px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        stagesCheck.setVisible(unlockAllStages);
        
        stagesCheckbox.on('pointerdown', () => {
            const currentState = localStorage.getItem('unlockAllStages') === 'true';
            const newState = !currentState;
            stagesCheck.setVisible(newState);
            localStorage.setItem('unlockAllStages', newState.toString());
            
            // Clear stage unlock flags to force refresh
            if (newState) {
                localStorage.setItem('nexusVisited', 'true');
                localStorage.setItem('forestLandUnlocked', 'true');
            }
        });
        
        stagesContainer.add([stagesLabel, stagesCheckbox, stagesCheck]);
        
        // Volume control
        const volumeContainer = this.add.container(400, 240);
        const volumeLabel = this.add.text(-200, 0, 'Volume:', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Volume slider background
        const sliderBg = this.add.rectangle(50, 0, 200, 10, 0x444444);
        const currentVolume = this.game.sound.volume;
        
        // Volume slider handle
        const sliderHandle = this.add.circle(50 - 100 + (currentVolume * 200), 0, 15, 0xffd700);
        sliderHandle.setInteractive({ useHandCursor: true, draggable: true });
        
        // Volume percentage text
        const volumePercent = this.add.text(170, 0, Math.round(currentVolume * 100) + '%', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Handle dragging
        sliderHandle.on('drag', (pointer, dragX) => {
            const clampedX = Phaser.Math.Clamp(dragX, -50, 150);
            sliderHandle.x = clampedX;
            const volume = (clampedX + 50) / 200;
            this.game.sound.volume = volume;
            volumePercent.setText(Math.round(volume * 100) + '%');
            localStorage.setItem('gameVolume', volume.toString());
        });
        
        volumeContainer.add([volumeLabel, sliderBg, sliderHandle, volumePercent]);
        
        // Starting element selection
        const elementContainer = this.add.container(400, 280);
        const elementLabel = this.add.text(-200, 0, 'Start Element:', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Get all available elements from the game scene
        const allElements = ['none', 'fire', 'water', 'earth', 'rock', 'air', 'lightning', 'holy', 'arcane', 
                            'dust', 'lava', 'steam', 'poison', 'volcano', 'ice', 'meteor', 'mud', 
                            'storm', 'crystal', 'death', 'time', 'sand', 'gravity', 'sun', 'smoke', 
                            'wave', 'star', 'zodiac', 'hex', 'venom', 'moon', 'nature', 'life', 
                            'philosopherstone', 'halo'];
        const elements = allElements;
        const savedElement = localStorage.getItem('startElement') || 'none';
        let currentElementIndex = elements.indexOf(savedElement);
        
        const elementText = this.add.text(50, 0, savedElement.toUpperCase(), {
            fontSize: '18px',
            color: '#ffd700',
            backgroundColor: '#000000',
            padding: { x: 20, y: 5 }
        }).setOrigin(0.5);
        
        // Arrow buttons
        const leftArrow = this.add.text(-20, 0, '<', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        leftArrow.setInteractive({ useHandCursor: true });
        
        const rightArrow = this.add.text(140, 0, '>', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        rightArrow.setInteractive({ useHandCursor: true });
        
        leftArrow.on('pointerdown', () => {
            currentElementIndex = (currentElementIndex - 1 + elements.length) % elements.length;
            elementText.setText(elements[currentElementIndex].toUpperCase());
            localStorage.setItem('startElement', elements[currentElementIndex]);
        });
        
        rightArrow.on('pointerdown', () => {
            currentElementIndex = (currentElementIndex + 1) % elements.length;
            elementText.setText(elements[currentElementIndex].toUpperCase());
            localStorage.setItem('startElement', elements[currentElementIndex]);
        });
        
        elementContainer.add([elementLabel, elementText, leftArrow, rightArrow]);
        
        // Hyper mode toggle
        // Speed Mode Dial
        const speedContainer = this.add.container(400, 320);
        const speedLabel = this.add.text(-200, 0, 'Game Speed:', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Speed mode options
        const speedModes = ['frolic', 'vibe', 'hyper', 'warp'];
        const speedDescriptions = {
            'frolic': 'Original speed (10 min games)',
            'vibe': '1.5x speed (5 min games)',
            'hyper': '2.25x speed (3.3 min games)',
            'warp': '4.5x speed (1.7 min games)'
        };
        const speedColors = {
            'frolic': '#00ff00',
            'vibe': '#ffff00',
            'hyper': '#ff8800',
            'warp': '#ff0000'
        };
        
        const currentSpeed = localStorage.getItem('speedMode') || 'frolic';
        let currentSpeedIndex = speedModes.indexOf(currentSpeed);
        if (currentSpeedIndex === -1) currentSpeedIndex = 0;
        
        // Create dial display
        const dialBg = this.add.rectangle(150, 0, 150, 40, 0x444444);
        dialBg.setStrokeStyle(3, 0xffd700);
        
        const speedText = this.add.text(150, 0, speedModes[currentSpeedIndex].toUpperCase(), {
            fontSize: '20px',
            color: speedColors[speedModes[currentSpeedIndex]],
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Left arrow
        const speedLeftArrow = this.add.text(75, 0, '◄', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        speedLeftArrow.setInteractive({ useHandCursor: true });
        
        // Right arrow
        const speedRightArrow = this.add.text(225, 0, '►', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        speedRightArrow.setInteractive({ useHandCursor: true });
        
        const speedHint = this.add.text(0, 30, speedDescriptions[speedModes[currentSpeedIndex]], {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        // Update function
        const updateSpeedDisplay = () => {
            const mode = speedModes[currentSpeedIndex];
            speedText.setText(mode.toUpperCase());
            speedText.setColor(speedColors[mode]);
            speedHint.setText(speedDescriptions[mode]);
            localStorage.setItem('speedMode', mode);
            
            // Migrate old hyperMode setting if needed
            if (mode === 'frolic') {
                localStorage.setItem('hyperMode', 'false');
            } else {
                localStorage.setItem('hyperMode', 'true');
            }
        };
        
        speedLeftArrow.on('pointerdown', () => {
            currentSpeedIndex = (currentSpeedIndex - 1 + speedModes.length) % speedModes.length;
            updateSpeedDisplay();
        });
        
        speedRightArrow.on('pointerdown', () => {
            currentSpeedIndex = (currentSpeedIndex + 1) % speedModes.length;
            updateSpeedDisplay();
        });
        
        // Hover effects
        speedLeftArrow.on('pointerover', () => speedLeftArrow.setScale(1.2));
        speedLeftArrow.on('pointerout', () => speedLeftArrow.setScale(1));
        speedRightArrow.on('pointerover', () => speedRightArrow.setScale(1.2));
        speedRightArrow.on('pointerout', () => speedRightArrow.setScale(1));
        
        speedContainer.add([speedLabel, dialBg, speedText, speedLeftArrow, speedRightArrow, speedHint]);
        
        // BGM selector
        const bgmContainer = this.add.container(400, 380);
        const bgmLabel = this.add.text(-200, 0, 'Background Music:', {
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        const bgmOptions = ['BGM 1', 'BGM 2'];
        const savedBGM = localStorage.getItem('selectedBGM') || 'BGM 1';
        let currentBGMIndex = bgmOptions.indexOf(savedBGM);
        
        const bgmText = this.add.text(50, 0, savedBGM, {
            fontSize: '18px',
            color: '#ffd700',
            backgroundColor: '#000000',
            padding: { x: 15, y: 5 }
        }).setOrigin(0.5);
        
        // BGM Arrow buttons
        const bgmLeftArrow = this.add.text(-20, 0, '<', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        bgmLeftArrow.setInteractive({ useHandCursor: true });
        
        const bgmRightArrow = this.add.text(120, 0, '>', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        bgmRightArrow.setInteractive({ useHandCursor: true });
        
        bgmLeftArrow.on('pointerdown', () => {
            currentBGMIndex = (currentBGMIndex - 1 + bgmOptions.length) % bgmOptions.length;
            bgmText.setText(bgmOptions[currentBGMIndex]);
            localStorage.setItem('selectedBGM', bgmOptions[currentBGMIndex]);
        });
        
        bgmRightArrow.on('pointerdown', () => {
            currentBGMIndex = (currentBGMIndex + 1) % bgmOptions.length;
            bgmText.setText(bgmOptions[currentBGMIndex]);
            localStorage.setItem('selectedBGM', bgmOptions[currentBGMIndex]);
        });
        
        bgmContainer.add([bgmLabel, bgmText, bgmLeftArrow, bgmRightArrow]);
        
        // Close button
        const closeButton = this.add.text(400, 460, 'CLOSE', {
            fontSize: '28px',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 40, y: 12 },
            stroke: '#ffd700',
            strokeThickness: 2
        }).setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        closeButton.on('pointerover', () => {
            closeButton.setColor('#ffd700');
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setColor('#ffffff');
        });
        
        closeButton.on('pointerdown', () => {
            // Clean up all menu elements
            overlay.destroy();
            menuTitle.destroy();
            debugContainer.destroy();
            recipesContainer.destroy();
            stagesContainer.destroy();
            volumeContainer.destroy();
            elementContainer.destroy();
            speedContainer.destroy();
            bgmContainer.destroy();
            closeButton.destroy();
        });
        
        // Store references for cleanup
        this.optionsMenu = {
            overlay, menuTitle, debugContainer, recipesContainer, stagesContainer,
            volumeContainer, elementContainer, speedContainer, bgmContainer, closeButton
        };
    }
    
    createFullscreenButton() {
        // Create fullscreen button container
        const buttonSize = 40;
        const margin = 20;
        
        // Create button background
        const fullscreenBtn = this.add.container(800 - margin - buttonSize/2, margin + buttonSize/2);
        
        // Button background
        const btnBg = this.add.rectangle(0, 0, buttonSize, buttonSize, 0x000000, 0.7);
        btnBg.setStrokeStyle(2, 0xffffff);
        btnBg.setInteractive({ useHandCursor: true });
        
        // Create fullscreen icon using text (we'll use Unicode symbols)
        // ⛶ for enter fullscreen, ◱ for exit fullscreen
        const fullscreenIcon = this.add.text(0, 0, '⛶', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        fullscreenBtn.add([btnBg, fullscreenIcon]);
        
        // Check if we're already in fullscreen
        const updateIcon = () => {
            // Check if the icon still exists (scene might be destroyed)
            if (!fullscreenIcon || !fullscreenIcon.scene) return;
            
            if (this.scale.isFullscreen) {
                fullscreenIcon.setText('◱'); // Exit fullscreen icon
            } else {
                fullscreenIcon.setText('⛶'); // Enter fullscreen icon
            }
        };
        
        // Initial icon update
        updateIcon();
        
        // Handle hover effects
        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0x333333, 0.9);
            fullscreenIcon.setColor('#ffd700');
        });
        
        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0x000000, 0.7);
            fullscreenIcon.setColor('#ffffff');
        });
        
        // Toggle fullscreen on click
        btnBg.on('pointerdown', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
        
        // Listen for fullscreen change events
        this.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
            updateIcon();
            // Apply scaling for fullscreen
            this.scale.setGameSize(800, 600);
            this.scale.displaySize.setAspectRatio(800/600);
            this.scale.scaleMode = Phaser.Scale.FIT;
            this.scale.autoCenter = Phaser.Scale.CENTER_BOTH;
            this.scale.refresh();
        });
        
        this.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
            updateIcon();
            // Reset to normal scaling
            this.scale.setGameSize(800, 600);
            this.scale.scaleMode = Phaser.Scale.NONE;
            this.scale.autoCenter = Phaser.Scale.NO_CENTER;
            this.scale.refresh();
        });
        
        // Handle fullscreen not supported
        this.scale.on('fullscreenunsupported', () => {
            fullscreenBtn.setVisible(false);
        });
        
        // Store event handlers for cleanup
        this.fullscreenHandlers = {
            enter: () => updateIcon(),
            leave: () => updateIcon()
        };
        
        // Clean up on scene shutdown
        this.events.once('shutdown', () => {
            this.scale.off(Phaser.Scale.Events.ENTER_FULLSCREEN);
            this.scale.off(Phaser.Scale.Events.LEAVE_FULLSCREEN);
        });
    }
}

class StageSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageSelectScene' });
        this.selectedStage = 8; // Start with Nexus selected
    }

    preload() {
        // Load island sprites
        this.load.image('island-forest', 'islands/forest.png');
        this.load.image('island-cave', 'islands/cave.png');
        this.load.image('island-sand', 'islands/sandpyramid.png');
        this.load.image('island-volcano', 'islands/volcano.png');
        this.load.image('island-grave', 'islands/grave.png');
        this.load.image('island-castle', 'islands/castle.png');
        this.load.image('island-spire', 'islands/spire.png');
        this.load.image('island-crystal', 'islands/crystal.png');
    }

    create() {
        // Add input cooldown to prevent button press carryover
        this.inputCooldown = 500; // 500ms cooldown
        this.inputEnabled = false;
        this.time.delayedCall(this.inputCooldown, () => {
            this.inputEnabled = true;
        });
        
        // Initialize stages in create to get latest localStorage values
        const nexusVisited = localStorage.getItem('nexusVisited') === 'true';
        const unlockAllStages = localStorage.getItem('unlockAllStages') === 'true';
        
        console.log('StageSelectScene - nexusVisited:', nexusVisited);
        console.log('StageSelectScene - forestLandUnlocked:', localStorage.getItem('forestLandUnlocked'));
        
        this.stages = [
            { name: 'Forest Land', unlocked: nexusVisited || unlockAllStages || localStorage.getItem('forestLandUnlocked') === 'true', description: 'A mystical forest filled with danger', 
              icon: 'island-forest', color: 0x44ff44, x: 200, y: 300 },
            { name: 'Cave Land', unlocked: unlockAllStages || localStorage.getItem('caveLandUnlocked') === 'true', description: 'Dark caverns with unknown threats', 
              icon: 'island-cave', color: 0x8B4513, x: 400, y: 200 },
            { name: 'Sand Land', unlocked: unlockAllStages || localStorage.getItem('sandLandUnlocked') === 'true', description: 'Ancient pyramids in endless dunes', 
              icon: 'island-sand', color: 0xFFD700, x: 600, y: 200 },
            { name: 'Lava Land', unlocked: unlockAllStages || localStorage.getItem('lavaLandUnlocked') === 'true', description: 'Burning fields of molten rock', 
              icon: 'island-volcano', color: 0xFF4500, x: 300, y: 450 },
            { name: 'Grave Land', unlocked: unlockAllStages || localStorage.getItem('graveLandUnlocked') === 'true', description: 'Where the dead refuse to rest', 
              icon: 'island-grave', color: 0x444444, x: 500, y: 400 },
            { name: 'Castle Land', unlocked: unlockAllStages || localStorage.getItem('castleLandUnlocked') === 'true', description: 'An ancient fortress of evil', 
              icon: 'island-castle', color: 0x666666, x: 700, y: 300 },
            { name: 'Spire Land', unlocked: unlockAllStages || localStorage.getItem('spireLandUnlocked') === 'true', description: 'Tower reaching to the heavens', 
              icon: 'island-spire', color: 0x8B6914, x: 150, y: 400 },
            { name: 'The Void', unlocked: unlockAllStages || localStorage.getItem('voidLandUnlocked') === 'true', description: 'The final dimension of darkness', 
              icon: 'void', color: 0x4B0082, x: 700, y: 450 },
            { name: 'Nexus', unlocked: true, description: 'Eternal power awaits within', 
              icon: 'island-crystal', color: 0x9966ff, x: 400, y: 350, isNexus: true }
        ];
        
        // Create deep space/abyss background
        this.cameras.main.setBackgroundColor('#0a0a1a');
        
        // Add floating particles for mystical effect
        this.createAbyssParticles();
        
        // Title removed per request

        // Constellation paths will be created after node animation

        this.stageButtons = [];
        this.stageNodes = [];

        // Find nexus position for animation start
        const nexusStage = this.stages.find(s => s.isNexus);
        const nexusX = nexusStage ? nexusStage.x : 400;
        const nexusY = nexusStage ? nexusStage.y : 350;
        
        // Create floating stage nodes
        this.stages.forEach((stage, index) => {
            // Create container for the stage node
            const container = this.add.container(stage.x, stage.y);
            
            // Hide non-nexus nodes initially
            if (!stage.isNexus) {
                container.setAlpha(0);
                container.setScale(0.1);
                container.x = nexusX;
                container.y = nexusY;
            }
            
            // Create glowing effect
            const glow = this.add.graphics();
            glow.fillStyle(stage.color, 0.3);
            glow.fillCircle(0, 0, 50);
            container.add(glow);
            
            // Pulsing glow animation
            this.tweens.add({
                targets: glow,
                scale: { from: 1, to: 1.2 },
                alpha: { from: 0.3, to: 0.1 },
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Main island sprite
            let island = null;
            if (stage.icon && this.textures.exists(stage.icon)) {
                island = this.add.image(0, 0, stage.icon);
                island.setScale(stage.isNexus ? 0.4 : 0.3);
                island.setAlpha(stage.unlocked ? 1 : 0.5);
                if (!stage.unlocked) {
                    island.setTint(0x444444);
                }
                container.add(island);
            } else {
                // Fallback: colored circle with first letter
                const orb = this.add.circle(0, 0, 30, stage.color, stage.unlocked ? 0.8 : 0.3);
                orb.setStrokeStyle(3, stage.unlocked ? 0xffffff : 0x444444);
                container.add(orb);
                
                const iconText = this.add.text(0, 0, stage.name[0], {
                    fontSize: '24px',
                    color: stage.unlocked ? '#ffffff' : '#666666',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                container.add(iconText);
                island = orb;
            }
            
            // No lock icon per request
            
            // Stage name (floating below island)
            const displayName = stage.unlocked ? stage.name.toUpperCase() : '???';
            const nameText = this.add.text(0, 60, displayName, {
                fontSize: '16px',
                color: stage.unlocked ? '#ffffff' : '#666666',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            container.add(nameText);
            
            // Description text removed from container - will be created separately
            
            // Floating animation removed per request
            
            // Make interactive
            if (stage.unlocked) {
                island.setInteractive({ useHandCursor: true });
                
                const originalScale = stage.isNexus ? 0.4 : 0.3;
                
                island.on('pointerover', () => {
                    // Update selected stage when hovering
                    if (this.selectedStage !== index) {
                        this.highlightStage(index);
                    }
                });
                
                island.on('pointerout', () => {
                    // Only reset scale if this isn't the currently selected stage
                    if (this.selectedStage !== index) {
                        this.tweens.add({
                            targets: island,
                            scale: originalScale,
                            duration: 200,
                            ease: 'Power2.easeOut'
                        });
                        
                        this.tweens.add({
                            targets: glow,
                            scale: 1,
                            duration: 200,
                            ease: 'Power2.easeOut'
                        });
                        
                        this.hideStageDescription();
                    }
                });
                
                island.on('pointerdown', () => {
                    this.selectStage(index);
                });
            }
            
            this.stageButtons.push({ 
                container, 
                island, 
                glow,
                nameText, 
                stage 
            });
            
            this.stageNodes.push({ x: stage.x, y: stage.y, unlocked: stage.unlocked });
        });
        
        // Animate nodes emerging from nexus
        this.time.delayedCall(500, () => {
            this.stageButtons.forEach((button, index) => {
                if (!button.stage.isNexus) {
                    // Calculate delay based on distance from nexus
                    const distance = Phaser.Math.Distance.Between(nexusX, nexusY, button.stage.x, button.stage.y);
                    const delay = index * 150 + (distance / 5);
                    
                    // Animate to final position
                    this.tweens.add({
                        targets: button.container,
                        x: button.stage.x,
                        y: button.stage.y,
                        scale: 1,
                        alpha: 1,
                        duration: 1000,
                        delay: delay,
                        ease: 'Power2.easeOut',
                        onStart: () => {
                            // Create trail effect
                            const trail = this.add.circle(nexusX, nexusY, 5, button.stage.color, 0.8);
                            this.tweens.add({
                                targets: trail,
                                x: button.stage.x,
                                y: button.stage.y,
                                scale: 0.1,
                                alpha: 0,
                                duration: 1000,
                                ease: 'Power2.easeOut',
                                onComplete: () => trail.destroy()
                            });
                        }
                    });
                }
            });
            
            // Create constellation paths after all nodes have animated in
            const maxDelay = (this.stageButtons.length * 150) + 1500;
            this.time.delayedCall(maxDelay, () => {
                this.createConstellationPaths(true); // true for animated appearance
                
                // Check if we need to show any unlock animations
                const nexusVisited = localStorage.getItem('nexusVisited') === 'true';
                
                // Check for Forest Land unlock from Nexus visit
                const forestLandUnlocked = localStorage.getItem('forestLandUnlocked') === 'true';
                if (nexusVisited && !forestLandUnlocked && this.stages[0].unlocked) {
                    // Mark Forest Land as unlocked
                    localStorage.setItem('forestLandUnlocked', 'true');
                    
                    // Show unlock animation after paths appear
                    this.time.delayedCall(1600, () => {
                        this.showStageUnlockAnimation(0); // Forest Land is at index 0
                    });
                }
                
                // Check for any stages that were just unlocked (e.g., from victory)
                const stageKeys = ['forest', 'cave', 'sand', 'lava', 'grave', 'castle', 'spire', 'void'];
                stageKeys.forEach((key, index) => {
                    const unlockKey = `${key}LandUnlocked`;
                    const justUnlockedKey = `${key}LandJustUnlocked`;
                    
                    // If stage is unlocked but we haven't shown the animation yet
                    if (localStorage.getItem(unlockKey) === 'true' && 
                        localStorage.getItem(justUnlockedKey) !== 'true' &&
                        this.stages[index].unlocked) {
                        
                        // Mark that we've shown the animation
                        localStorage.setItem(justUnlockedKey, 'true');
                        
                        // Show unlock animation
                        this.time.delayedCall(1600 + (index * 200), () => {
                            this.showStageUnlockAnimation(index);
                        });
                    }
                });
            });
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

        // Create description text area at top of screen (initially hidden)
        this.descriptionBg = this.add.rectangle(400, 60, 600, 80, 0x000000, 0.8);
        this.descriptionBg.setStrokeStyle(2, 0xffd700);
        this.descriptionBg.setVisible(false);
        
        this.descriptionTitle = this.add.text(400, 40, '', {
            fontSize: '24px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.descriptionTitle.setVisible(false);
        
        this.descriptionText = this.add.text(400, 70, '', {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);
        this.descriptionText.setVisible(false);
        
        // Highlight Nexus initially (it's always unlocked)
        this.selectedStage = 8; // Nexus is at index 8
        this.highlightStage(8);
    }
    
    showStageDescription(stage) {
        if (!this.descriptionBg || !this.descriptionTitle || !this.descriptionText) {
            return;
        }
        
        const title = stage.unlocked ? stage.name.toUpperCase() : '???';
        const desc = stage.unlocked ? stage.description : '???';
        
        this.descriptionTitle.setText(title);
        this.descriptionText.setText(desc);
        
        this.descriptionBg.setVisible(true);
        this.descriptionTitle.setVisible(true);
        this.descriptionText.setVisible(true);
        
        // Fade in animation
        this.descriptionBg.setAlpha(0);
        this.descriptionTitle.setAlpha(0);
        this.descriptionText.setAlpha(0);
        
        this.tweens.add({
            targets: [this.descriptionBg, this.descriptionTitle, this.descriptionText],
            alpha: 1,
            duration: 200,
            ease: 'Power2.easeOut'
        });
    }
    
    hideStageDescription() {
        if (this.descriptionBg && this.descriptionTitle && this.descriptionText) {
            this.tweens.add({
                targets: [this.descriptionBg, this.descriptionTitle, this.descriptionText],
                alpha: 0,
                duration: 200,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    if (this.descriptionBg) this.descriptionBg.setVisible(false);
                    if (this.descriptionTitle) this.descriptionTitle.setVisible(false);
                    if (this.descriptionText) this.descriptionText.setVisible(false);
                }
            });
        }
    }

    createAbyssParticles() {
        // Create multiple layers of floating particles
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const size = Phaser.Math.Between(1, 3);
            
            const particle = this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.1, 0.3));
            
            // Slow floating animation
            this.tweens.add({
                targets: particle,
                y: y - Phaser.Math.Between(50, 150),
                x: x + Phaser.Math.Between(-30, 30),
                alpha: { from: particle.alpha, to: 0 },
                duration: Phaser.Math.Between(8000, 15000),
                repeat: -1,
                onRepeat: () => {
                    particle.x = Phaser.Math.Between(0, 800);
                    particle.y = Phaser.Math.Between(600, 700);
                    particle.setAlpha(Phaser.Math.FloatBetween(0.1, 0.3));
                }
            });
        }
    }
    
    createConstellationPaths(animated = false) {
        // Create connections between stages (constellation style)
        const connections = [
            [0, 1], // Forest Land to Cave Land
            [1, 2], // Cave Land to Sand Land
            [0, 3], // Forest Land to Lava Land
            [1, 3], // Cave Land to Lava Land
            [2, 3], // Sand Land to Lava Land
            [3, 4], // Lava Land to Grave Land
            [4, 5], // Grave Land to Castle Land
            [5, 7], // Castle Land to The Void
            [0, 6], // Forest Land to Spire Land
            [6, 7], // Spire Land to The Void
            [0, 8], // Forest Land to Nexus
            [1, 8], // Cave Land to Nexus
            [3, 8], // Lava Land to Nexus
            [8, 7]  // Nexus to The Void
        ];
        
        const graphics = this.add.graphics();
        if (animated) {
            graphics.setAlpha(0);
        }
        
        connections.forEach(([from, to], index) => {
            const fromStage = this.stages[from];
            const toStage = this.stages[to];
            
            // Only draw if at least one stage is unlocked
            if (fromStage.unlocked || toStage.unlocked) {
                const alpha = (fromStage.unlocked && toStage.unlocked) ? 0.3 : 0.1;
                graphics.lineStyle(2, 0x9966ff, alpha);
                
                // Create curved path
                const midX = (fromStage.x + toStage.x) / 2;
                const midY = (fromStage.y + toStage.y) / 2 - 30;
                
                // Draw curved line using quadratic curve
                const curve = new Phaser.Curves.QuadraticBezier(
                    new Phaser.Math.Vector2(fromStage.x, fromStage.y),
                    new Phaser.Math.Vector2(midX, midY),
                    new Phaser.Math.Vector2(toStage.x, toStage.y)
                );
                
                // Get points along the curve
                const points = curve.getPoints(32);
                
                // Draw the curve
                graphics.beginPath();
                graphics.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    graphics.lineTo(points[i].x, points[i].y);
                }
                graphics.strokePath();
                
                // Add energy flow animation along paths for unlocked connections
                if (fromStage.unlocked && toStage.unlocked) {
                    this.createPathEnergy(fromStage, toStage, midX, midY);
                }
            }
        });
        
        // Animate paths appearing
        if (animated) {
            this.tweens.add({
                targets: graphics,
                alpha: 1,
                duration: 1500,
                ease: 'Power2.easeIn'
            });
        }
    }
    
    createPathEnergy(fromStage, toStage, midX, midY) {
        const energy = this.add.circle(fromStage.x, fromStage.y, 3, 0xffaaff, 0.8);
        
        // Create path for energy to follow
        const path = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(fromStage.x, fromStage.y),
            new Phaser.Math.Vector2(midX, midY - 30),
            new Phaser.Math.Vector2(toStage.x, toStage.y)
        );
        
        // Animate energy along path
        this.tweens.add({
            targets: energy,
            t: 1,
            duration: 3000,
            repeat: -1,
            onUpdate: (tween) => {
                const t = tween.getValue();
                const point = path.getPoint(t);
                energy.x = point.x;
                energy.y = point.y;
            }
        });
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

        // Navigate stages - find nearest stage in direction
        if (leftJustPressed || rightJustPressed || upJustPressed || downJustPressed) {
            const currentStage = this.stages[this.selectedStage];
            let nearestIndex = this.selectedStage;
            let nearestDistance = Infinity;
            
            this.stages.forEach((stage, index) => {
                if (index === this.selectedStage || !stage.unlocked) return;
                
                const dx = stage.x - currentStage.x;
                const dy = stage.y - currentStage.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Check direction
                let validDirection = false;
                if (leftJustPressed && dx < -20) validDirection = true;
                else if (rightJustPressed && dx > 20) validDirection = true;
                else if (upJustPressed && dy < -20) validDirection = true;
                else if (downJustPressed && dy > 20) validDirection = true;
                
                if (validDirection && distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = index;
                }
            });
            
            if (nearestIndex !== this.selectedStage) {
                this.highlightStage(nearestIndex);
            }
        }

        // Select stage (only if input is enabled)
        if (confirmJustPressed && this.inputEnabled && this.stages[this.selectedStage].unlocked) {
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
            if (btn.island) {
                const originalScale = btn.stage.isNexus ? 0.4 : 0.3;
                this.tweens.add({
                    targets: btn.island,
                    scale: originalScale,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            }
            this.hideStageDescription();
            this.tweens.add({
                targets: btn.glow,
                scale: 1,
                duration: 200,
                ease: 'Power2.easeOut'
            });
        }

        // Set new highlight
        this.selectedStage = index;
        const btn = this.stageButtons[this.selectedStage];
        if (btn.stage.unlocked) {
            if (btn.island) {
                const originalScale = btn.stage.isNexus ? 0.4 : 0.3;
                this.tweens.add({
                    targets: btn.island,
                    scale: originalScale * 1.3,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            }
            this.showStageDescription(btn.stage);
            this.tweens.add({
                targets: btn.glow,
                scale: 1.5,
                duration: 200,
                ease: 'Power2.easeOut'
            });
            
            // Add selection ring effect
            const ring = this.add.circle(btn.container.x, btn.container.y, 40, 0xffffff, 0);
            ring.setStrokeStyle(3, 0xffffff, 1);
            
            this.tweens.add({
                targets: ring,
                scale: { from: 1, to: 1.5 },
                alpha: { from: 1, to: 0 },
                duration: 1000,
                onComplete: () => ring.destroy()
            });
        }
    }

    selectStage(index) {
        const stage = this.stages[index];
        
        // Check if this is the Nexus
        if (stage.isNexus) {
            // Mark nexus as visited
            localStorage.setItem('nexusVisited', 'true');
            
            // Fade to nexus
            const fadeOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
            fadeOverlay.setAlpha(0);
            fadeOverlay.setDepth(1000);

            this.tweens.add({
                targets: fadeOverlay,
                alpha: 1,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    this.scene.start('TalentTreeScene');
                }
            });
        } else if (index === 0 || index === 1 || index === 3) {
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
                    const stageMapping = {
                        0: 'forest',
                        1: 'cave',
                        2: 'sand',
                        3: 'lava',
                        4: 'grave',
                        5: 'castle',
                        6: 'spire',
                        7: 'void'
                    };
                    let stageName = stageMapping[index] || 'forest';
                    
                    // Check if performance mode is enabled
                    const performanceMode = localStorage.getItem('performanceMode') === 'true';
                    const nextScene = performanceMode ? 'UltraOptimizedGameScene' : 'GameScene';
                    
                    this.scene.start('LoadingScene', {
                        nextScene: nextScene,
                        data: { stage: stageName }
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
    
    showStageUnlockAnimation(stageIndex) {
        const stage = this.stages[stageIndex];
        const button = this.stageButtons[stageIndex];
        
        if (!button || !stage) return;
        
        // Create spotlight effect on the stage
        const spotlight = this.add.graphics();
        spotlight.fillStyle(0xffffff, 0);
        spotlight.fillCircle(stage.x, stage.y, 100);
        spotlight.setDepth(999);
        
        // Fade in spotlight
        this.tweens.add({
            targets: spotlight,
            alpha: 0.3,
            duration: 500,
            ease: 'Power2'
        });
        
        // Create unlock text
        const unlockText = this.add.text(stage.x, stage.y - 100, 'UNLOCKED!', {
            fontSize: '32px',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        unlockText.setDepth(1000);
        unlockText.setScale(0);
        
        // Animate unlock text
        this.tweens.add({
            targets: unlockText,
            scale: 1.2,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: unlockText,
                    scale: 1,
                    duration: 200
                });
            }
        });
        
        // Update the stage visuals to show it's unlocked
        if (button.island) {
            // Remove tint and increase alpha
            button.island.clearTint();
            button.island.setAlpha(1);
            
            // Update name text color
            if (button.nameText) {
                button.nameText.setText(stage.name.toUpperCase());
                button.nameText.setColor('#ffffff');
            }
            
            // Update description
            if (button.descText) {
                button.descText.setText(stage.description);
                button.descText.setColor('#aaaaff');
            }
            
            // Make it interactive
            button.island.setInteractive({ useHandCursor: true });
            
            button.island.on('pointerover', () => {
                button.island.setScale(button.island.scale * 1.2);
                button.descText.setVisible(true);
                button.glow.setScale(1.5);
            });
            
            button.island.on('pointerout', () => {
                button.island.setScale(stage.isNexus ? 0.4 : 0.3);
                button.descText.setVisible(false);
                button.glow.setScale(1);
            });
            
            button.island.on('pointerdown', () => {
                this.selectStage(stageIndex);
            });
        }
        
        // Fade out spotlight and text after delay
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: [spotlight, unlockText],
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    spotlight.destroy();
                    unlockText.destroy();
                }
            });
        });
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.survivalTime = data.survivalTime || 0;
        this.enemiesKilled = data.enemiesKilled || { tree: 0, slime: 0, golem: 0, elite: 0, bat: 0, sorcerer: 0, mushroom: 0, fireworm: 0, summoner: 0, soul: 0, bloboid: 0, darkeye: 0 };
        this.itemsCollected = data.itemsCollected || { jewels: 0, muffins: 0, elements: 0 };
        this.won = data.won || false;
        this.stage = data.stage || 'forest';
    }

    create() {
        // Dark background matching main game
        this.cameras.main.setBackgroundColor('#11130d');

        // Show gameover image if not won
        if (!this.won) {
            // Move down by 20% of screen height (was 30%)
            const gameoverImage = this.add.image(400, 150 + 120, 'gameover-bg');
            gameoverImage.setOrigin(0.5);
            // Reduce size by 50%
            gameoverImage.setScale(0.5);
        } else {
            // Victory text if won
            const title = this.add.text(400, 150 + 180, 'VICTORY!', {
                fontSize: '64px',
                color: '#ffd700',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Survival time
        const totalSeconds = Math.floor(this.survivalTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeText = this.add.text(400, 400, `Survived: ${minutes}:${seconds.toString().padStart(2, '0')}`, {
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // No stats background frame - removed

        // Enemy kills
        const killsTitle = this.add.text(250, 290, 'Enemies Defeated:', {
            fontSize: '20px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let killsText = '';
        if (this.enemiesKilled.tree > 0) killsText += `Trees: ${this.enemiesKilled.tree}\n`;
        if (this.enemiesKilled.slime > 0) killsText += `Slimes: ${this.enemiesKilled.slime}\n`;
        if (this.enemiesKilled.golem > 0) killsText += `Golems: ${this.enemiesKilled.golem}\n`;
        if (this.enemiesKilled.elite > 0) killsText += `Elites: ${this.enemiesKilled.elite}\n`;

        const killsList = this.add.text(250, 320, killsText || 'None', {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0);

        // Items collected
        const itemsTitle = this.add.text(550, 290, 'Items Collected:', {
            fontSize: '20px',
            color: '#44ff44',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const itemsText = `Jewels: ${this.itemsCollected.jewels}\nMuffins: ${this.itemsCollected.muffins}\nElements: ${this.itemsCollected.elements}`;

        const itemsList = this.add.text(550, 320, itemsText, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0);

        // Total score
        const totalKills = this.enemiesKilled.tree + this.enemiesKilled.slime + this.enemiesKilled.golem + this.enemiesKilled.elite * 3;
        const score = totalKills * 100 + this.itemsCollected.jewels * 10 + Math.floor(totalSeconds) * 5;

        const scoreText = this.add.text(400, 440, `Score: ${score}`, {
            fontSize: '32px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const buttonText = this.won ? 'Press SPACE to Return to Stage Select' : 'Press SPACE to Try Again';
        const restartText = this.add.text(400, 500, buttonText, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const menuText = this.add.text(400, 540, 'Press ESC for Main Menu', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            // If player won, unlock the next stage
            if (this.won) {
                this.unlockNextStage();
            }
            this.scene.start('StageSelectScene');
        });

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('TitleScene');
        });

        // Enable gamepad support
        if (this.input.gamepad.total > 0) {
            this.gamepad = this.input.gamepad.getPad(0);
        }
    }

    update() {
        // Check for gamepad buttons
        if (this.input.gamepad && this.input.gamepad.total > 0) {
            const pad = this.input.gamepad.getPad(0);
            if (pad) {
                // A button or Start button to retry/continue
                if (pad.buttons[0].pressed || pad.buttons[9].pressed) {
                    // If player won, unlock the next stage
                    if (this.won) {
                        this.unlockNextStage();
                    }
                    this.scene.start('StageSelectScene');
                }
                // B button or Back button for main menu
                if (pad.buttons[1].pressed || pad.buttons[8].pressed) {
                    this.scene.start('TitleScene');
                }
            }
        }
    }
    
    unlockNextStage() {
        // Define stage progression order
        const stageOrder = ['forest', 'cave', 'sand', 'lava', 'grave', 'castle', 'spire', 'void'];
        const stageNames = {
            'forest': 'Forest Land',
            'cave': 'Cave Land', 
            'sand': 'Sand Land',
            'lava': 'Lava Land',
            'grave': 'Grave Land',
            'castle': 'Castle Land',
            'spire': 'Spire Land',
            'void': 'The Void'
        };
        
        console.log('Unlocking next stage. Current stage:', this.stage);
        
        // Find current stage index
        const currentIndex = stageOrder.indexOf(this.stage);
        console.log('Current stage index:', currentIndex);
        
        // If we found the stage and it's not the last one
        if (currentIndex !== -1 && currentIndex < stageOrder.length - 1) {
            const nextStage = stageOrder[currentIndex + 1];
            const nextStageName = stageNames[nextStage];
            
            // Unlock the next stage
            localStorage.setItem(`${nextStage}LandUnlocked`, 'true');
            
            console.log(`Unlocked ${nextStageName}!`);
        } else {
            console.log('Could not unlock next stage - either stage not found or already at last stage');
        }
    }
}

class TalentTreeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TalentTreeScene' });
        this.selectedNode = null;
        this.talentPoints = parseInt(localStorage.getItem('talentPoints') || '0');
        this.talents = new Map(); // Store purchased talents
        this.connections = [];
        this.nodeButtons = [];
    }
    
    create() {
        // Set mystical background
        this.cameras.main.setBackgroundColor('#0a0618');
        
        // Add floating particles
        this.createMysticalParticles();
        
        // Title
        const title = this.add.text(400, 30, 'NEXUS OF ETERNAL POWER', {
            fontSize: '36px',
            color: '#d4af37',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Talent points display
        this.pointsText = this.add.text(400, 70, `Essence: ${this.talentPoints}`, {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Create talent tree structure
        this.createTalentTree();
        
        // Instructions
        this.add.text(400, 550, 'Click nodes to unlock • Requires connected path from center', {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        // Back button
        const backButton = this.add.text(50, 550, '< BACK', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        backButton.setInteractive({ useHandCursor: true });
        
        backButton.on('pointerover', () => backButton.setColor('#ffd700'));
        backButton.on('pointerout', () => backButton.setColor('#ffffff'));
        backButton.on('pointerdown', () => {
            this.saveTalents();
            this.scene.start('StageSelectScene');
        });
        
        // Reset button
        const resetButton = this.add.text(750, 550, 'RESET ALL', {
            fontSize: '24px',
            color: '#ff6666'
        }).setOrigin(1, 0.5);
        resetButton.setInteractive({ useHandCursor: true });
        
        resetButton.on('pointerover', () => resetButton.setColor('#ff9999'));
        resetButton.on('pointerout', () => resetButton.setColor('#ff6666'));
        resetButton.on('pointerdown', () => {
            this.resetTalents();
        });
    }
    
    createMysticalParticles() {
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const particle = this.add.circle(x, y, 2, 0x9966ff, 0.3);
            
            this.tweens.add({
                targets: particle,
                y: y - 100,
                x: x + Phaser.Math.Between(-50, 50),
                alpha: 0,
                duration: Phaser.Math.Between(5000, 8000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000),
                onRepeat: () => {
                    particle.x = Phaser.Math.Between(0, 800);
                    particle.y = 600;
                    particle.setAlpha(0.3);
                }
            });
        }
    }
    
    createTalentTree() {
        // Load saved talents
        const savedTalents = localStorage.getItem('purchasedTalents');
        if (savedTalents) {
            const talentArray = JSON.parse(savedTalents);
            talentArray.forEach(id => this.talents.set(id, true));
        }
        
        // Define talent nodes with sprite sheet icons
        // Icon mapping: 10x6 grid (0-59), row-major order
        const talentData = [
            // Center (always unlocked)
            { id: 'origin', x: 400, y: 300, name: 'Origin', desc: 'The beginning of power', cost: 0, 
              effect: null, iconFrame: 10, color: 0xffd700, unlocked: true }, // Star icon
            
            // First ring - Basic stats
            { id: 'health1', x: 400, y: 200, name: 'Vitality I', desc: '+20% Max Health', cost: 1,
              effect: { maxHealth: 1.2 }, iconFrame: 51, color: 0xff4444, requires: ['origin'] }, // Heart
            { id: 'damage1', x: 500, y: 250, name: 'Power I', desc: '+15% Damage', cost: 1,
              effect: { damage: 1.15 }, iconFrame: 22, color: 0xff8844, requires: ['origin'] }, // Sword
            { id: 'speed1', x: 500, y: 350, name: 'Swiftness I', desc: '+10% Move Speed', cost: 1,
              effect: { moveSpeed: 1.1 }, iconFrame: 11, color: 0x44ffff, requires: ['origin'] }, // Boot/Wing
            { id: 'pickup1', x: 400, y: 400, name: 'Magnetism I', desc: '+30% Pickup Range', cost: 1,
              effect: { pickupRange: 1.3 }, iconFrame: 4, color: 0x8844ff, requires: ['origin'] }, // Magnet/Leaf
            { id: 'cooldown1', x: 300, y: 350, name: 'Haste I', desc: '-10% Cooldowns', cost: 1,
              effect: { cooldown: 0.9 }, iconFrame: 41, color: 0x44ff44, requires: ['origin'] }, // Hourglass
            { id: 'regen1', x: 300, y: 250, name: 'Recovery I', desc: '+1 HP/10s', cost: 1,
              effect: { regen: 0.1 }, iconFrame: 5, color: 0x44ff88, requires: ['origin'] }, // Potion
            
            // Second ring - Advanced stats
            { id: 'health2', x: 400, y: 120, name: 'Vitality II', desc: '+40% Max Health', cost: 2,
              effect: { maxHealth: 1.4 }, iconFrame: 51, color: 0xff4444, requires: ['health1'] }, // Heart
            { id: 'damage2', x: 580, y: 200, name: 'Power II', desc: '+30% Damage', cost: 2,
              effect: { damage: 1.3 }, iconFrame: 22, color: 0xff8844, requires: ['damage1'] }, // Sword
            { id: 'multishot', x: 600, y: 300, name: 'Multi-Cast', desc: '+1 Projectile', cost: 3,
              effect: { projectiles: 1 }, iconFrame: 16, color: 0xffaa44, requires: ['damage1'] }, // Orb
            { id: 'speed2', x: 580, y: 400, name: 'Swiftness II', desc: '+20% Move Speed', cost: 2,
              effect: { moveSpeed: 1.2 }, iconFrame: 11, color: 0x44ffff, requires: ['speed1'] }, // Boot
            { id: 'dodge', x: 500, y: 450, name: 'Evasion', desc: '10% Dodge Chance', cost: 3,
              effect: { dodge: 0.1 }, iconFrame: 6, color: 0x4488ff, requires: ['speed1'] }, // Shield
            { id: 'lifesteal', x: 220, y: 300, name: 'Vampirism', desc: '5% Life Steal', cost: 3,
              effect: { lifesteal: 0.05 }, iconFrame: 29, color: 0xcc44cc, requires: ['regen1'] }, // Mask/Skull
            
            // Third ring - Specializations
            { id: 'tank', x: 300, y: 120, name: 'Fortress', desc: '+60% HP, -20% Speed', cost: 4,
              effect: { maxHealth: 1.6, moveSpeed: 0.8 }, iconFrame: 45, color: 0x888888, requires: ['health2', 'regen1'] }, // Castle
            { id: 'glass', x: 680, y: 250, name: 'Glass Cannon', desc: '+50% DMG, -30% HP', cost: 4,
              effect: { damage: 1.5, maxHealth: 0.7 }, iconFrame: 17, color: 0xff00ff, requires: ['damage2', 'multishot'] }, // Crystal
            { id: 'ninja', x: 600, y: 480, name: 'Shadow Walker', desc: '+30% Speed & Dodge', cost: 4,
              effect: { moveSpeed: 1.3, dodge: 0.3 }, iconFrame: 26, color: 0x333333, requires: ['speed2', 'dodge'] }, // Shadow/Hood
            
            // Ultimate center node
            { id: 'transcend', x: 400, y: 300, name: 'Transcendence', desc: 'Unlock true potential', cost: 10,
              effect: { all: 1.1 }, iconFrame: 24, color: 0xffffff, requires: ['health2', 'damage2', 'speed2'], 
              special: true, radius: 25 } // Sun/Ultimate
        ];
        
        // Store talent data for animation
        this.talentData = talentData;
        
        // Create center node immediately
        const centerNode = talentData.find(t => t.id === 'origin');
        this.createTalentNode(centerNode);
        
        // Animate other nodes emerging from center
        this.time.delayedCall(500, () => {
            talentData.forEach((talent, index) => {
                if (talent.id !== 'origin') {
                    // Calculate delay based on distance from center
                    const distance = Phaser.Math.Distance.Between(400, 300, talent.x, talent.y);
                    const delay = index * 100 + (distance / 3);
                    
                    this.time.delayedCall(delay, () => {
                        this.createTalentNodeAnimated(talent);
                    });
                }
            });
            
            // Draw connections after animation completes
            const maxDelay = talentData.length * 100 + 300;
            this.time.delayedCall(maxDelay, () => {
                this.drawConnections();
            });
        });
    }
    
    createTalentNodeAnimated(talent) {
        // Start at center for animation
        const container = this.add.container(400, 300);
        container.setScale(0.1);
        container.setAlpha(0);
        
        // Create the node
        this.createTalentNodeContent(talent, container);
        
        // Animate to final position
        this.tweens.add({
            targets: container,
            x: talent.x,
            y: talent.y,
            scale: 1,
            alpha: 1,
            duration: 600,
            ease: 'Power2.easeOut',
            onStart: () => {
                // Create trail effect
                const trail = this.add.circle(400, 300, 5, talent.color, 0.8);
                this.tweens.add({
                    targets: trail,
                    x: talent.x,
                    y: talent.y,
                    scale: 0.1,
                    alpha: 0,
                    duration: 600,
                    ease: 'Power2.easeOut',
                    onComplete: () => trail.destroy()
                });
            }
        });
        
        // Store reference
        this.nodeButtons.push({ container, talent, components: {} });
    }
    
    createTalentNode(talent) {
        const container = this.add.container(talent.x, talent.y);
        this.createTalentNodeContent(talent, container);
        this.nodeButtons.push({ container, talent, components: {} });
    }
    
    createTalentNodeContent(talent, container) {
        const radius = talent.radius || 35;
        
        // Check if unlocked
        const isUnlocked = talent.unlocked || this.talents.has(talent.id);
        const canUnlock = this.canUnlockTalent(talent);
        
        // Glow effect
        if (isUnlocked || canUnlock) {
            const glow = this.add.circle(0, 0, radius + 10, talent.color, 0.3);
            container.add(glow);
            
            if (!talent.special) {
                this.tweens.add({
                    targets: glow,
                    scale: { from: 1, to: 1.2 },
                    alpha: { from: 0.3, to: 0.1 },
                    duration: 2000,
                    yoyo: true,
                    repeat: -1
                });
            }
        }
        
        // Main node
        const node = this.add.circle(0, 0, radius, talent.color, isUnlocked ? 0.9 : 0.3);
        node.setStrokeStyle(3, isUnlocked ? 0xffffff : (canUnlock ? talent.color : 0x444444));
        container.add(node);
        
        // Icon using sprite
        if (talent.iconFrame !== undefined) {
            const icon = this.add.image(0, 0, 'upgrade-icons', talent.iconFrame);
            // Scale down the large icons to fit in the nodes
            icon.setScale(talent.special ? 0.15 : 0.2);
            if (!isUnlocked && !canUnlock) {
                icon.setTint(0x444444);
            }
            container.add(icon);
        }
        
        // Name
        const name = this.add.text(0, radius + 15, talent.name, {
            fontSize: '12px',
            color: isUnlocked ? '#ffffff' : (canUnlock ? '#aaaaaa' : '#666666'),
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        container.add(name);
        
        // Cost
        if (!talent.unlocked && talent.cost > 0) {
            const costText = this.add.text(0, -radius - 15, `${talent.cost}`, {
                fontSize: '14px',
                color: canUnlock && this.talentPoints >= talent.cost ? '#44ff44' : '#ff4444',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            container.add(costText);
        }
        
        // Make interactive if can unlock
        if (!isUnlocked && canUnlock) {
            node.setInteractive({ useHandCursor: true });
            
            node.on('pointerover', () => {
                node.setScale(1.1);
                this.showTalentTooltip(talent, container);
            });
            
            node.on('pointerout', () => {
                node.setScale(1);
                this.hideTooltip();
            });
            
            node.on('pointerdown', () => {
                if (this.talentPoints >= talent.cost) {
                    this.unlockTalent(talent);
                }
            });
        } else if (isUnlocked) {
            node.setInteractive({ useHandCursor: true });
            
            node.on('pointerover', () => {
                this.showTalentTooltip(talent, container);
            });
            
            node.on('pointerout', () => {
                this.hideTooltip();
            });
        }
        
        // Store node data
        talent.container = container;
        talent.node = node;
        this.nodeButtons.push(talent);
    }
    
    canUnlockTalent(talent) {
        if (!talent.requires) return true;
        
        // Check if all required talents are unlocked
        return talent.requires.every(reqId => {
            const reqTalent = this.nodeButtons.find(t => t.id === reqId);
            return reqTalent && (reqTalent.unlocked || this.talents.has(reqId));
        });
    }
    
    unlockTalent(talent) {
        this.talentPoints -= talent.cost;
        this.talents.set(talent.id, true);
        localStorage.setItem('talentPoints', this.talentPoints.toString());
        
        // Update points display
        this.pointsText.setText(`Essence: ${this.talentPoints}`);
        
        // Refresh the tree
        this.nodeButtons.forEach(btn => btn.container.destroy());
        this.nodeButtons = [];
        this.createTalentTree();
        
        // Show unlock effect
        this.showUnlockEffect(talent.x, talent.y);
    }
    
    showUnlockEffect(x, y) {
        const effect = this.add.circle(x, y, 5, 0xffffff, 1);
        
        this.tweens.add({
            targets: effect,
            scale: 10,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => effect.destroy()
        });
    }
    
    drawConnections() {
        const graphics = this.add.graphics();
        graphics.setDepth(-1);
        
        this.talentData.forEach(talent => {
            if (talent.requires) {
                talent.requires.forEach(reqId => {
                    const reqTalent = this.talentData.find(t => t.id === reqId);
                    if (reqTalent) {
                        const isUnlocked = (talent.unlocked || this.talents.has(talent.id)) && 
                                         (reqTalent.unlocked || this.talents.has(reqId));
                        
                        graphics.lineStyle(2, isUnlocked ? 0xffd700 : 0x444444, isUnlocked ? 0.8 : 0.3);
                        graphics.lineBetween(reqTalent.x, reqTalent.y, talent.x, talent.y);
                    }
                });
            }
        });
    }
    
    showTalentTooltip(talent, container) {
        if (this.tooltip) this.tooltip.destroy();
        
        const bg = this.add.rectangle(container.x, container.y - 80, 200, 60, 0x000000, 0.9);
        bg.setStrokeStyle(2, talent.color);
        
        const desc = this.add.text(container.x, container.y - 80, talent.desc, {
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 180 }
        }).setOrigin(0.5);
        
        this.tooltip = this.add.container(0, 0);
        this.tooltip.add([bg, desc]);
    }
    
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }
    
    saveTalents() {
        const talentArray = Array.from(this.talents.keys());
        localStorage.setItem('purchasedTalents', JSON.stringify(talentArray));
    }
    
    resetTalents() {
        // Refund all spent points
        let refund = 0;
        this.talentData.forEach(talent => {
            if (this.talents.has(talent.id) && talent.cost > 0) {
                refund += talent.cost;
            }
        });
        
        this.talentPoints += refund;
        this.talents.clear();
        localStorage.setItem('talentPoints', this.talentPoints.toString());
        localStorage.removeItem('purchasedTalents');
        
        // Refresh display
        this.pointsText.setText(`Essence: ${this.talentPoints}`);
        this.nodeButtons.forEach(btn => btn.container.destroy());
        this.nodeButtons = [];
        
        // Recreate nodes without animation
        this.talentData.forEach(talent => {
            this.createTalentNode(talent);
        });
        
        // Redraw connections
        this.drawConnections();
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.enemies = null;
        this.lastEnemySpawn = 0;
        this.charges = [];
        this.chargeIndicators = [];
        this.earnedLinks = 0; // Number of links earned from chests
        this.gameStarted = false; // Game starts with countdown
        this.projectiles = null;
        this.elementKeys = {};
        this.orbitingOrbs = [];
        this.discoveredSpells = [];
        this.spellbookOpen = false;
        this.spellbookUI = null;
        this.playerHealth = 100;
        this.maxHealth = 100;
        this.healthBar = null;
        this.healthBarBg = null;
        this.invulnerable = false;
        this.survivalTime = 0;
        this.difficultyMultiplier = 1.0;
        this.trees = null;
        this.jewels = null;
        this.playerXP = 0;
        this.playerLevel = 1;
        this.xpToNextLevel = 25; // Reduced by 50%
        this.maxCharges = 4; // Start with 4 charge slots
        this.chargingElement = null;
        this.chargeHoldTime = 0;
        this.chargeHoldThreshold = 500;
        this.lastFireTime = 0;
        this.fireRate = 1500 / this.speedMultiplier; // milliseconds between automatic shots (adjusted for hyper mode)
        this.chargeLastFireTimes = []; // Track last fire time for each charge slot
        this.elementFireRates = {}; // Different fire rates for each element type
        this.muffins = null;
        this.gamepad = null;
        this.elementOrbs = null;
        this.waterOrbs = [];
        this.firePools = [];
        this.earthZones = [];
        this.nextLevelElement = null;
        this.currentChargeIndex = 0;
        this.chargeGroups = [];
        this.isPaused = false;
        this.pauseMenu = null;
        this.activeFlames = []; // Track active fire spell effects
        
        // Passive element bonuses system
        this.passiveBonuses = {
            // Stat modifiers
            damageMultiplier: 1.0,
            speedMultiplier: 1.0,
            fireRateMultiplier: 1.0,
            healthRegenRate: 0,
            moveSpeedMultiplier: 1.0,
            
            // Special effects
            lifesteal: 0, // Percentage of damage dealt returned as health
            dodge: 0, // Chance to dodge attacks
            thorns: 0, // Damage reflected to attackers
            elementalResistance: {}, // Resistance to specific elements
            
            // Triggered abilities
            onKillEffects: [], // Effects that trigger when killing an enemy
            auraEffects: [] // Continuous area effects
        };
    }

    init(data) {
        // Receive stage data
        this.stage = data?.stage || 'forest';
    }

    preload() {
        // All assets are loaded in LoadingScene
    }

    create() {
        // Reset game end flags
        this.gameEnded = false;
        this.gameWonCalled = false;
        
        // Initialize speed mode and multiplier
        this.speedMode = localStorage.getItem('speedMode') || 'frolic';
        
        // Set speed multiplier based on mode
        const speedMultipliers = {
            'frolic': 1.0,    // Original speed
            'vibe': 1.5,      // Current hyper mode speed
            'hyper': 2.25,    // 50% faster than vibe (1.5 * 1.5)
            'warp': 4.5       // 100% faster than hyper (2.25 * 2)
        };
        
        this.speedMultiplier = speedMultipliers[this.speedMode] || 1.0;
        
        // Keep hyperMode for backward compatibility checks
        this.hyperMode = this.speedMode !== 'frolic';
        
        // Reset game state
        this.playerHealth = 100;
        this.gameStarted = false; // Will be set to true after countdown
        console.log('GameScene created, gameStarted set to false');
        this.charges = []; // Start with no charges
        this.chargeSlots = new Array(8).fill(null); // Initialize all 8 slots as empty
        this.slotBuffs = []; // Track buffs for each charge slot: {damageMultiplier: 1, speedMultiplier: 1, linked: false}
        this.earnedLinks = 0; // Track how many links have been earned through level ups
        this.orbitingOrbs = [];
        this.lastEnemySpawn = 0;
        this.survivalTime = 0;
        this.difficultyMultiplier = 1.0;
        this.spawnRateMultiplier = 1.0;
        this.lastEliteSpawn = 0; // Changed from lastMinute to track 30-second intervals

        // Wave-based spawning system
        this.currentWave = 0;
        this.waveStartTime = 0;
        this.enemiesInCurrentWave = 0;
        this.maxEnemiesPerWave = 10;
        this.waveSpawnInterval = 500; // ms between spawns in a wave
        this.lastWaveSpawn = 0;
        this.enemiesKilled = { tree: 0, slime: 0, golem: 0, elite: 0, bat: 0, sorcerer: 0, mushroom: 0, fireworm: 0, summoner: 0, soul: 0, bloboid: 0, darkeye: 0 };
        this.itemsCollected = { jewels: 0, muffins: 0, elements: 0 };
        this.eliteEnemies = [];
        this.chests = this.physics.add.group();
        this.playerXP = 0;
        this.playerLevel = 1;
        this.xpToNextLevel = 25; // Reduced by 50%
        this.maxCharges = 4; // Start with 4 charge slots
        this.lastFireTime = 0;
        this.currentChargeIndex = 0;
        this.chargingElement = null;
        this.chargeHoldTime = 0;
        this.chargeHoldThreshold = 500;
        this.lastFireTime = 0;
        this.fireRate = 1500 / this.speedMultiplier; // milliseconds between automatic shots (adjusted for hyper mode)
        this.muffins = null;
        this.gamepad = null;
        this.elementOrbs = null;
        this.waterOrbs = [];
        this.firePools = [];
        this.earthZones = [];
        this.nextLevelElement = null;
        this.currentChargeIndex = 0;
        this.chargeGroups = [];
        this.isPaused = false;
        this.pauseMenu = null;
        this.invulnerable = false; // Reset invulnerability flag
        this.discoveredElements = new Set(); // Track discovered elements
        
        // Initialize element pouch
        const savedPouch = localStorage.getItem('elementPouch');
        this.elementPouch = savedPouch ? JSON.parse(savedPouch) : [null, null, null, null];
        
        // Create and start background music based on user selection
        const selectedBGM = localStorage.getItem('selectedBGM') || 'BGM 1';
        const bgmKey = selectedBGM === 'BGM 1' ? 'bgm' : 'bgm2';
        
        this.bgMusic = this.sound.add(bgmKey, {
            loop: true,
            volume: 0.5
        });
        this.bgMusic.play();
        
        // Add starting element from options
        const startElement = localStorage.getItem('startElement');
        if (startElement && startElement !== 'none') {
            this.charges = [startElement];
            this.chargeSlots[0] = startElement; // Also update chargeSlots
            this.discoveredElements.add(startElement); // Add to discovered elements
            console.log('Starting with element:', startElement);
            
            // Auto-activate philosopher stone if it's the starting element
            if (startElement === 'philosopherstone') {
                // Store flag to activate later when game is ready
                console.log('Will auto-activate philosopher stone when game starts');
                this.shouldAutoActivatePhilosopherStone = true;
            }
        }

        // Initialize cooldown system
        this.spellCooldowns = new Map(); // Map to track cooldowns by spell type
        this.globalSpellCooldown = 0; // Global cooldown to prevent spell spam

        // Element configuration - 18 elements with sprite frames and colors
        this.elementConfig = {
            // First sprite sheet (elements.png)
            fire: { frame: 0, color: 0xff4444, name: 'Fire', sheet: 'element-symbols', fireRate: 3150 }, // Reduced by 30%
            water: { frame: 1, color: 0x4444ff, name: 'Water', sheet: 'element-symbols', fireRate: 1800 },
            earth: { frame: 6, color: 0x44ff44, name: 'Earth', sheet: 'element-symbols2', fireRate: 3000 },
            rock: { frame: 3, color: 0x8b4513, name: 'Rock', sheet: 'element-symbols', fireRate: 2250 },
            air: { frame: 4, color: 0xcccccc, name: 'Air', sheet: 'element-symbols', fireRate: 1200 },
            lightning: { frame: 5, color: 0xffff44, name: 'Lightning', sheet: 'element-symbols', fireRate: 1500 },
            holy: { frame: 6, color: 0xffdd00, name: 'Holy', sheet: 'element-symbols' },
            arcane: { frame: 7, color: 0xff44ff, name: 'Arcane', sheet: 'element-symbols', fireRate: 2400 },
            dust: { frame: 8, color: 0xcc9966, name: 'Dust', sheet: 'element-symbols' },

            // Second sprite sheet (elements2.PNG)
            lava: { frame: 0, color: 0xff6600, name: 'Lava', sheet: 'element-symbols2' },
            steam: { frame: 1, color: 0xaabbcc, name: 'Steam', sheet: 'element-symbols2' },
            poison: { frame: 2, color: 0x00ff00, name: 'Poison', sheet: 'element-symbols2' },
            volcano: { frame: 3, color: 0xcc3300, name: 'Volcano', sheet: 'element-symbols2' },
            ice: { frame: 4, color: 0x00ddff, name: 'Ice', sheet: 'element-symbols2', fireRate: 2500 },
            meteor: { frame: 5, color: 0xff8800, name: 'Meteor', sheet: 'element-symbols2', fireRate: 1500 },
            mud: { frame: 9, color: 0x664422, name: 'Mud', sheet: 'element-symbols3' },
            storm: { frame: 7, color: 0xffff00, name: 'Storm', sheet: 'element-symbols2' },
            crystal: { frame: 8, color: 0xffaaff, name: 'Crystal', sheet: 'element-symbols2' },

            // Third sprite sheet (elements3.PNG)
            death: { frame: 0, color: 0x333333, name: 'Death', sheet: 'element-symbols3', fireRate: 6000 },
            time: { frame: 1, color: 0xffd700, name: 'Time', sheet: 'element-symbols3' },
            sand: { frame: 0, color: 0xf4a460, name: 'Sand', sheet: 'sand-symbol', isImage: true },
            gravity: { frame: 0, color: 0x4b0082, name: 'Gravity', sheet: 'gravity-symbol', isImage: true },
            sun: { frame: 4, color: 0xffeb3b, name: 'Sun', sheet: 'element-symbols3', fireRate: 999999 },
            smoke: { frame: 5, color: 0x696969, name: 'Smoke', sheet: 'element-symbols3', fireRate: 999999 },
            wave: { frame: 0, color: 0x00bcd4, name: 'Wave', sheet: 'wave-symbol', isImage: true },
            star: { frame: 0, color: 0xffffff, name: 'Star', sheet: 'star-symbol', isImage: true },
            zodiac: { frame: 0, color: 0xffd700, name: 'Zodiac', sheet: 'star-symbol', isImage: true },
            hex: { frame: 1, color: 0x9932cc, name: 'Hex', sheet: 'element-symbols2' },
            venom: { frame: 2, color: 0x8b00ff, name: 'Venom', sheet: 'element-symbols2', fireRate: 2000 },
            moon: { frame: 8, color: 0xe0e0e0, name: 'Moon', sheet: 'element-symbols3', fireRate: 12000 },
            nature: { frame: 2, color: 0x00ff00, name: 'Nature', sheet: 'element-symbols' },
            life: { frame: 0, color: 0xff6666, name: 'Life', sheet: 'life-symbol', isImage: true },
            philosopherstone: { frame: 3, color: 0xffd700, name: 'Philosopher Stone', sheet: 'element-symbols3', fireRate: 999999 },
            halo: { frame: 2, color: 0x87ceeb, name: 'Halo', sheet: 'element-symbols3', fireRate: 999999 }
        };

        // Define primary elements (can drop from enemies)
        this.primaryElements = ['fire', 'water', 'earth', 'air', 'lightning', 'arcane', 'ice', 'poison'];
        
        // Element tier tracking - maps "element_slotIndex" to tier level
        // We use element_slotIndex as key to track tier per slot, not just per element type
        this.elementTiers = new Map();
        
        // Tier scaling configuration
        this.tierScaling = {
            damage: [1.0, 1.5, 2.0, 2.5, 3.0], // Damage multiplier per tier
            area: [1.0, 1.2, 1.4, 1.6, 1.8], // Area/size multiplier per tier
            fireRate: [1.0, 0.85, 0.7, 0.6, 0.5], // Fire rate multiplier per tier (lower = faster)
            projectileCount: [1, 1, 2, 2, 3], // Number of projectiles per tier
            duration: [1.0, 1.2, 1.4, 1.6, 1.8] // Effect duration multiplier per tier
        };

        // Element descriptions for the discovery menu
        this.elementDescriptions = {
            fire: 'Creates burning projectiles that leave fire pools. Basic offensive element.',
            water: 'Creates an expanding water wave that damages and slows enemies. Defensive element.',
            earth: 'Directional earthquake that damages enemies in a line. Area control.',
            rock: 'Heavy projectiles that stun enemies on impact. Crowd control.',
            air: 'Creates wind blasts that push enemies away. Knockback element.',
            lightning: 'Homing projectiles that seek out enemies. Precision element.',
            holy: 'Healing aura that damages enemies and heals the wizard. Support magic.',
            arcane: 'Mysterious homing magic that tracks targets. Pure magical energy.',
            dust: 'Blinds and slows enemies in a large area. Debuff element.',
            lava: 'Molten projectiles that create burning pools on impact. Destructive fire.',
            steam: 'Explosive bursts that push enemies back violently. Pressure element.',
            poison: 'Drops poison mines that trigger on contact, poisoning enemies for continuous damage.',
            volcano: 'Erupts with multiple lava projectiles in all directions. Explosive earth.',
            ice: 'Creates ice crystals that freeze enemies in place for 2 seconds. Frost magic.',
            meteor: 'Calls down meteors from above with area damage. Celestial destruction.',
            mud: 'Creates slowing puddles that trap enemies. Terrain control.',
            storm: 'Instant lightning strikes on random enemies. Divine punishment.',
            crystal: 'Fires 8 piercing crystal needles in all directions dealing heavy damage.',
            death: 'Dark magic that instantly destroys weakened enemies. Finisher element.',
            time: 'Slows down time for enemies in an area. Temporal manipulation.',
            sand: 'Summons multiple sandstorms that continuously damage and slow enemies. Desert magic.',
            gravity: 'Creates a singularity that pulls enemies in and deals 30% of their max health as damage.',
            sun: 'Radiates intense heat and light, burning all nearby enemies. Solar power.',
            smoke: 'Obscures vision and causes choking damage. Suffocation element.',
            wave: 'Powerful water surge that knocks back groups of enemies. Tidal force.',
            star: 'Calls down starlight beams from the cosmos. Celestial magic.',
            zodiac: 'Star element projectiles that bounce between enemies leaving damaging light trails.',
            hex: 'Curses nearby enemies to deal no damage for 8 seconds. Defensive curse.',
            venom: 'Shoots piercing venomous spines that penetrate enemies and apply poison. Toxic projectiles.',
            moon: 'Lunar energy that heals allies and curses enemies. Night magic.',
            nature: 'Summons whipping vines that strike enemies from the wizard. Nature\'s wrath.',
            life: 'Heals the wizard over time with regenerative energy. Restoration magic.',
            philosopherstone: 'Fusion of life and death. Grants automatic level up every 45 seconds. Ultimate alchemical achievement.',
            halo: 'Fusion of holy and water. Creates a damaging aura that continuously hurts nearby enemies. Divine protection.'
        };

        console.log('Creating background for stage:', this.stage);
        this.createStageBackground();
        console.log('Stage background created');

        console.log('Creating wizard sprite');
        this.wizard = this.physics.add.sprite(2000, 1080, 'wizard-idle');  // Center horizontally in the world
        this.wizard.setScale(1.0); // New sprites are already the right size
        console.log('Wizard sprite created successfully');
        this.wizard.setCollideWorldBounds(false);
        this.wizard.setDepth(100); // Ensure wizard renders above floor and most elements
        this.wizard.lastDirection = 'down'; // Set initial facing direction

        // Set physics body size smaller to prevent damage when close but not touching
        // Reduced from 40x60 to 20x30 for an even tighter hitbox
        this.wizard.body.setSize(20, 30);
        this.wizard.body.setOffset(30, 25); // Center the smaller hitbox

        // Try to minimize the grey background visibility
        // Since we can't remove it without editing the sprites, we'll work with it
        this.wizard.setAlpha(1.0);
        
        // Create player visibility indicators
        this.createPlayerIndicators();

        // Make camera follow the wizard
        this.cameras.main.startFollow(this.wizard, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
        this.cameras.main.roundPixels = true; // Prevent sub-pixel rendering gaps

        // Create debug directional line
        this.debugDirectionLine = this.add.graphics();
        this.debugDirectionLine.setDepth(100);
        this.debugDirectionLine.setVisible(false); // Only visible in debug mode
        this.cameras.main.setDeadzone(50, 50); // Small deadzone for smoother following

        this.cursors = this.input.keyboard.createCursorKeys();
        this.elementKeys = {
            fire: this.input.keyboard.addKey('Z'),
            lightning: this.input.keyboard.addKey('X'),
            water: this.input.keyboard.addKey('C'),
            earth: this.input.keyboard.addKey('V')
        };
        this.escKey = this.input.keyboard.addKey('ESC');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.pKey = this.input.keyboard.addKey('P');
        this.tabKey = this.input.keyboard.addKey('TAB');
        this.debugKey = this.input.keyboard.addKey('D');

        // Controller mapping info - create this BEFORE using it
        this.controllerInfo = this.add.text(20, 100, '', {
            fontSize: '12px',
            color: '#aaaaaa'
        });
        this.controllerInfo.setScrollFactor(0);
        this.controllerInfo.setDepth(560);

        // Enable gamepad support
        this.input.gamepad.once('connected', (pad) => {
            console.log('Gamepad connected:', pad.id);
            this.gamepad = pad;
            // Removed controller connected text
        });

        // Check if gamepad already connected
        if (this.input.gamepad.total > 0) {
            this.gamepad = this.input.gamepad.getPad(0);
            if (this.gamepad) {
                console.log('Gamepad already connected:', this.gamepad.id);
                // Removed controller connected text
            }
        }

        this.enemies = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        
        // Initialize obstacle manager for impassable obstacles
        this.obstacleManager = new ObstacleManager(this);
        this.obstacleManager.initialize(this.stage);
        
        // Initial obstacle spawn around starting position
        if (this.wizard) {
            this.obstacleManager.update(this.wizard.x, this.wizard.y);
        }
        
        this.jewels = this.physics.add.group();
        this.muffins = this.physics.add.group();
        this.elementOrbs = this.physics.add.group();
        this.chargeExpansions = this.physics.add.group();

        this.physics.add.overlap(this.wizard, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.projectileHitEnemy, null, this);
        this.physics.add.overlap(this.wizard, this.jewels, this.collectJewel, null, this);
        this.physics.add.overlap(this.wizard, this.muffins, this.collectMuffin, null, this);
        this.physics.add.overlap(this.wizard, this.elementOrbs, this.collectElementOrb, null, this);
        this.physics.add.overlap(this.wizard, this.chests, this.openChest, null, this);
        this.physics.add.overlap(this.wizard, this.chargeExpansions, this.collectChargeExpansion, null, this);

        // Add collisions with obstacles (only for player)
        const obstacles = this.obstacleManager.getObstaclesGroup();
        this.physics.add.collider(this.wizard, obstacles);
        // Enemies and projectiles can now pass through obstacles
        
        // Add collisions with barriers (only in cave stage, only for player)
        if (this.stage === 'cave' && this.barriers) {
            this.barriers.forEach(barrier => {
                this.physics.add.collider(this.wizard, barrier);
                // Enemies can now pass through barriers
            });
        }

        // Add enemy-to-enemy collision to prevent stacking (but allow passing through frozen enemies)
        this.physics.add.collider(this.enemies, this.enemies, null, (enemy1, enemy2) => {
            // If either enemy is frozen, allow them to pass through each other
            if (enemy1.frozen || enemy2.frozen) {
                return false; // No collision
            }
            return true; // Normal collision
        });

        // Trees are now handled in createStageBackground as decorative elements only
        // No physics trees are spawned
        
        // Cave obstacles are now handled by ObstacleManager for consistency
        // Removed spawnCaveObstacles() to prevent duplicate obstacle creation

        console.log('Creating UI elements');
        this.createChargeUI();
        console.log('Charge UI created');
        this.elementCards = []; // Initialize element cards array
        this.createSpellbookUI();
        console.log('Spellbook UI created');
        // this.createHealthBar(); // Removed - using wizard health bar only
        this.createWizardHealthBar();
        console.log('Wizard health bar created');
        this.createPauseMenu();
        console.log('Pause menu created');
        console.log('Elements menu created');
        this.createXPBar();
        console.log('XP bar created');


        // Create wizard animations
        // Full idle animation (plays once)
        this.anims.create({
            key: 'wizard-idle-full',
            frames: this.anims.generateFrameNumbers('wizard-idle', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

        // Looping idle animation (last 4 frames)
        this.anims.create({
            key: 'wizard-idle-loop',
            frames: this.anims.generateFrameNumbers('wizard-idle', { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        // Create fly animation with startup
        this.anims.create({
            key: 'wizard-fly-start',
            frames: this.anims.generateFrameNumbers('wizard-fly', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        // Create looping fly animation (last 3 frames)
        this.anims.create({
            key: 'wizard-fly-loop',
            frames: this.anims.generateFrameNumbers('wizard-fly', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'wizard-death',
            frames: this.anims.generateFrameNumbers('wizard-death', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

        // Create fire spell animation
        this.anims.create({
            key: 'fire-spell-anim',
            frames: this.anims.generateFrameNumbers('fire-spell', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: 0
        });

        // Create water spell animation using all 12 frames
        this.anims.create({
            key: 'water-spell-anim',
            frames: this.anims.generateFrameNumbers('water-spell', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: 0
        });

        // Create ice spell animation (slower)
        this.anims.create({
            key: 'ice-spell-anim',
            frames: this.anims.generateFrameNumbers('ice-spell', { start: 0, end: 5 }),
            frameRate: 6,  // Slowed down from 10 to 6
            repeat: -1
        });
        
        // Create volcano spell animation with 8 frames
        this.anims.create({
            key: 'volcano-spell-anim',
            frames: this.anims.generateFrameNumbers('volcano-spell', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        
        // Create wave spell animation with 6 frames
        this.anims.create({
            key: 'wave-spell-anim',
            frames: this.anims.generateFrameNumbers('wave-spell', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: -1
        });

        // Create poison mine animation with new 9-frame sprite
        this.anims.create({
            key: 'poison-mine-anim',
            frames: this.anims.generateFrameNumbers('poison-spell', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: 0
        });
        
        // Create XP gem animation
        this.anims.create({
            key: 'xp-gem-anim',
            frames: this.anims.generateFrameNumbers('xp-gem', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Create lightning spell animation
        this.anims.create({
            key: 'lightning-spell-anim',
            frames: this.anims.generateFrameNumbers('lightning-spell', { start: 0, end: 11 }),
            frameRate: 15,
            repeat: -1
        });

        // Create earth spell animation
        this.anims.create({
            key: 'earth-spell-anim',
            frames: this.anims.generateFrameNumbers('earth-spell', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: -1
        });

        // Create rock spell animation with 6 frames
        if (!this.anims.exists('rock-spell-anim')) {
            this.anims.create({
                key: 'rock-spell-anim',
                frames: this.anims.generateFrameNumbers('rock-spell', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        // Create crystal spell animation from individual frames
        this.anims.create({
            key: 'crystal-spell-anim',
            frames: [
                { key: 'crystal-frame-2' },
                { key: 'crystal-frame-3' },
                { key: 'crystal-frame-4' },
                { key: 'crystal-frame-5' },
                { key: 'crystal-frame-6' }
            ],
            frameRate: 10,
            repeat: 0
        });
        
        // Create gravity spell animation (18 frames)
        this.anims.create({
            key: 'gravity-spell-anim',
            frames: this.anims.generateFrameNumbers('gravity-spell', { start: 0, end: 17 }),
            frameRate: 12,
            repeat: 0
        });
        
        // Create meteor spell animation (6 frames) - looping
        this.anims.create({
            key: 'meteor-spell-anim',
            frames: this.anims.generateFrameNumbers('meteor-spell', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1  // Loop forever
        });

        // Create air spell animation from individual frames - plays backwards then forwards
        const airFrames = [];
        // Backwards (7 to 1)
        for (let i = 7; i >= 1; i--) {
            airFrames.push({ key: `air-spell-${i}` });
        }
        // Forwards (1 to 7)
        for (let i = 1; i <= 7; i++) {
            airFrames.push({ key: `air-spell-${i}` });
        }

        this.anims.create({
            key: 'air-spell-anim',
            frames: airFrames,
            frameRate: 40, // Double speed
            repeat: 0 // Play once
        });

        // Create arcane spell firing animation (first 6 frames)
        this.anims.create({
            key: 'arcane-spell-fire',
            frames: this.anims.generateFrameNumbers('arcane-spell', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: 0  // Play once and hold on last frame
        });

        // Create arcane spell impact animation (last 6 frames)
        this.anims.create({
            key: 'arcane-spell-impact',
            frames: this.anims.generateFrameNumbers('arcane-spell', { start: 6, end: 11 }),
            frameRate: 15,
            repeat: 0  // Play once
        });

        // Create enemy walking animation
        this.anims.create({
            key: 'enemy-walking',
            frames: this.anims.generateFrameNumbers('enemy-walk', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Create slime animations
        this.anims.create({
            key: 'slime-idle',
            frames: [
                { key: 'slime-idle-0' },
                { key: 'slime-idle-1' },
                { key: 'slime-idle-2' },
                { key: 'slime-idle-3' }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'slime-die',
            frames: [
                { key: 'slime-die-0' },
                { key: 'slime-die-1' },
                { key: 'slime-die-2' },
                { key: 'slime-die-3' }
            ],
            frameRate: 10,
            repeat: 0
        });

        // Create orange golem animations
        this.anims.create({
            key: 'golem-orange-walk',
            frames: this.anims.generateFrameNumbers('golem-orange-walk', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'golem-orange-hurt',
            frames: this.anims.generateFrameNumbers('golem-orange-hurt', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'golem-orange-die',
            frames: this.anims.generateFrameNumbers('golem-orange-die', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: 0
        });

        // Create blue golem animations
        this.anims.create({
            key: 'golem-blue-walk',
            frames: this.anims.generateFrameNumbers('golem-blue-walk', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'golem-blue-hurt',
            frames: this.anims.generateFrameNumbers('golem-blue-hurt', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'golem-blue-die',
            frames: this.anims.generateFrameNumbers('golem-blue-die', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: 0
        });

        // Create bat enemy animation with error handling
        try {
            if (this.textures.exists('bat-fly')) {
                const texture = this.textures.get('bat-fly');
                const frameCount = texture.frameTotal;
                console.log('Bat sprite has', frameCount, 'frames');
                
                if (frameCount >= 8) {
                    this.anims.create({
                        key: 'bat-flying',
                        frames: this.anims.generateFrameNumbers('bat-fly', { start: 0, end: 7 }),
                        frameRate: 12,
                        repeat: -1
                    });
                } else {
                    console.warn('Bat sprite has insufficient frames:', frameCount);
                    // Create a simpler animation with available frames
                    this.anims.create({
                        key: 'bat-flying',
                        frames: this.anims.generateFrameNumbers('bat-fly', { start: 0, end: frameCount - 1 }),
                        frameRate: 12,
                        repeat: -1
                    });
                }
            } else {
                console.error('Bat sprite texture not found');
            }
        } catch (error) {
            console.error('Error creating bat animation:', error);
        }

        // Mushroom animation
        this.anims.create({
            key: 'mushroom-running',
            frames: this.anims.generateFrameNumbers('mushroom-run', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Fire worm animation
        this.anims.create({
            key: 'fireworm-walking',
            frames: this.anims.generateFrameNumbers('fireworm-walk', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Summoner animations
        this.anims.create({
            key: 'summoner-idling',
            frames: this.anims.generateFrameNumbers('summoner-idle', { start: 0, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'summoner-summoning',
            frames: this.anims.generateFrameNumbers('summoner-summon', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: 0
        });

        // Lost soul animations
        this.anims.create({
            key: 'soul-moving',
            frames: this.anims.generateFrameNumbers('soul-move', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'soul-attacking',
            frames: this.anims.generateFrameNumbers('soul-attack', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: 'soul-bullet-anim',
            frames: this.anims.generateFrameNumbers('soul-bullet', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        // Bloboid animation
        this.anims.create({
            key: 'bloboid-walking',
            frames: this.anims.generateFrameNumbers('bloboid-walk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Dark eye animation
        this.anims.create({
            key: 'darkeye-walking',
            frames: [
                { key: 'darkeye-walk-1' },
                { key: 'darkeye-walk-2' },
                { key: 'darkeye-walk-3' },
                { key: 'darkeye-walk-4' },
                { key: 'darkeye-walk-5' },
                { key: 'darkeye-walk-6' },
                { key: 'darkeye-walk-7' },
                { key: 'darkeye-walk-8' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // Create sorcerer animation
        this.anims.create({
            key: 'sorcerer-attack',
            frames: [
                { key: 'sorcerer-attack-0' },
                { key: 'sorcerer-attack-1' },
                { key: 'sorcerer-attack-2' },
                { key: 'sorcerer-attack-3' },
                { key: 'sorcerer-attack-4' },
                { key: 'sorcerer-attack-5' },
                { key: 'sorcerer-attack-6' },
                { key: 'sorcerer-attack-7' },
                { key: 'sorcerer-attack-8' },
                { key: 'sorcerer-attack-9' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // Create chest animations
        this.anims.create({
            key: 'chest-idle-anim',
            frames: this.anims.generateFrameNumbers('chest-idle', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'chest-open-anim',
            frames: this.anims.generateFrameNumbers('chest-open', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0
        });

        console.log('About to call startGameSequence');

        // Initialize chargeSlots array early
        if (!this.chargeSlots) {
            this.chargeSlots = new Array(8).fill(null);
        }
        
        // Start game immediately
        if (!this.gameStarted) {
            // Only add starting element if it's not 'none'
            if (this.charges.length === 0) {
                const startElement = localStorage.getItem('startElement');
                if (startElement && startElement !== 'none') {
                    this.chargeSlots[0] = startElement;
                    this.charges = [startElement];
                }
                // If 'none' is selected, start with no charges
            } else {
                // Sync charges to chargeSlots if charges already exist
                for (let i = 0; i < this.charges.length && i < 8; i++) {
                    this.chargeSlots[i] = this.charges[i];
                }
            }
            // Don't call updateChargeUI here - UI hasn't been created yet
            this.startGame();
        }
    }

    spawnTrees() {
        const worldWidth = 4000;  // Match the wider world
        const worldHeight = 2160;  // 3x the original height (720 * 3)
        const treeSpacing = 40;

        // Create border trees
        // Top and bottom borders
        for (let x = 0; x <= worldWidth; x += treeSpacing) {
            // Top border
            let tree = this.trees.create(x, 20, 'tree');
            tree.setScale(0.8);
            tree.body.setSize(30, 30);
            tree.body.setOffset(15, 45);
            tree.setDepth(2);

            // Bottom border
            tree = this.trees.create(x, worldHeight - 20, 'tree');
            tree.setScale(0.8);
            tree.body.setSize(30, 30);
            tree.body.setOffset(15, 45);
            tree.setDepth(72);
        }

        // Left and right borders
        for (let y = 0; y <= worldHeight; y += treeSpacing) {
            // Left border
            let tree = this.trees.create(20, y, 'tree');
            tree.setScale(0.8);
            tree.body.setSize(30, 30);
            tree.body.setOffset(15, 45);
            tree.setDepth(y / 10);

            // Right border
            tree = this.trees.create(worldWidth - 20, y, 'tree');
            tree.setScale(0.8);
            tree.body.setSize(30, 30);
            tree.body.setOffset(15, 45);
            tree.setDepth(y / 10);
        }

        // Spawn some interior trees - more for the wider world
        const numInteriorTrees = Phaser.Math.Between(20, 30);
        for (let i = 0; i < numInteriorTrees; i++) {
            let x = Phaser.Math.Between(100, worldWidth - 100);
            let y = Phaser.Math.Between(100, worldHeight - 100);

            // Avoid spawning too close to wizard start position
            const distFromStart = Phaser.Math.Distance.Between(x, y, 400, 300);
            if (distFromStart < 150) {
                x = Phaser.Math.Between(100, worldWidth - 100);
                y = Phaser.Math.Between(100, worldHeight - 100);
            }

            const tree = this.trees.create(x, y, 'tree');
            tree.setScale(0.8);
            tree.body.setSize(30, 30);
            tree.body.setOffset(15, 45);
            tree.setDepth(y / 10);
        }
    }
    
    spawnCaveObstacles() {
        const worldWidth = 4000;
        const worldHeight = 2160;
        
        // Create obstacles group if it doesn't exist
        if (!this.obstacles) {
            this.obstacles = this.physics.add.staticGroup();
        }
        
        // Array of obstacle types
        const obstacleTypes = ['cave-crystal', 'cave-rock', 'cave-stala'];
        
        // Spawn obstacles around the edges with some randomness
        const edgeSpacing = 120; // More spaced out than trees
        
        // Top and bottom edges
        for (let x = 100; x < worldWidth - 100; x += edgeSpacing + Phaser.Math.Between(-20, 20)) {
            // Top edge
            if (Math.random() > 0.3) {
                const type = Phaser.Utils.Array.GetRandom(obstacleTypes);
                const obstacle = this.obstacles.create(x, Phaser.Math.Between(40, 100), type);
                obstacle.setScale(0.16 + Math.random() * 0.08); // 2x larger
                obstacle.setDepth(2);
                obstacle.refreshBody();
            }
            
            // Bottom edge
            if (Math.random() > 0.3) {
                const type = Phaser.Utils.Array.GetRandom(obstacleTypes);
                const obstacle = this.obstacles.create(x, worldHeight - Phaser.Math.Between(40, 100), type);
                obstacle.setScale(0.16 + Math.random() * 0.08); // 2x larger
                obstacle.setDepth(72);
                obstacle.refreshBody();
            }
        }
        
        // Left and right edges
        for (let y = 100; y < worldHeight - 100; y += edgeSpacing + Phaser.Math.Between(-20, 20)) {
            // Left edge
            if (Math.random() > 0.3) {
                const type = Phaser.Utils.Array.GetRandom(obstacleTypes);
                const obstacle = this.obstacles.create(Phaser.Math.Between(40, 100), y, type);
                obstacle.setScale(0.16 + Math.random() * 0.08); // 2x larger
                obstacle.setDepth(y / 10);
                obstacle.refreshBody();
            }
            
            // Right edge
            if (Math.random() > 0.3) {
                const type = Phaser.Utils.Array.GetRandom(obstacleTypes);
                const obstacle = this.obstacles.create(worldWidth - Phaser.Math.Between(40, 100), y, type);
                obstacle.setScale(0.16 + Math.random() * 0.08); // 2x larger
                obstacle.setDepth(y / 10);
                obstacle.refreshBody();
            }
        }
        
        // Spawn interior obstacles (fewer than trees)
        const numInteriorObstacles = Phaser.Math.Between(15, 25);
        for (let i = 0; i < numInteriorObstacles; i++) {
            let x = Phaser.Math.Between(200, worldWidth - 200);
            let y = Phaser.Math.Between(200, worldHeight - 200);
            
            // Avoid spawning too close to wizard start position
            const distFromStart = Phaser.Math.Distance.Between(x, y, 400, 300);
            if (distFromStart < 200) {
                continue;
            }
            
            const type = Phaser.Utils.Array.GetRandom(obstacleTypes);
            const obstacle = this.obstacles.create(x, y, type);
            obstacle.setScale(0.14 + Math.random() * 0.1); // 2x larger
            obstacle.setDepth(y / 10);
            obstacle.refreshBody();
        }
        
        // Add collisions (only for player)
        this.physics.add.collider(this.wizard, this.obstacles);
        // Enemies can now pass through obstacles
    }

    startGameSequence() {
        console.log('Starting game sequence');

        // Disable player controls initially
        this.gameStarted = false;

        // Start wizard at last frame of death animation
        this.wizard.play('wizard-death');
        this.wizard.anims.pause();
        this.wizard.anims.setCurrentFrame(this.wizard.anims.currentAnim.frames[this.wizard.anims.currentAnim.frames.length - 1]);

        console.log('Starting resurrection animation with countdown');

        // Start resurrection animation immediately
        this.startResurrectionAnimation();

        // Silent countdown continues in background
        // The game will start after the animation and delay in startResurrectionAnimation

        console.log('Game sequence setup complete');
    }

    showElementSelection() {
        console.log('showElementSelection called');

        try {
            // Initialize gamepad button states for element selection
            if (!this.gamepadButtonStates) {
                this.gamepadButtonStates = [];
            }
            // Initialize button 0 state to prevent immediate selection
            if (this.gamepad) {
                this.gamepadButtonStates[0] = this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed;
            }

            // Make sure camera is at default position
            const cam = this.cameras.main;
            cam.centerOn(400, 300);
            console.log('Camera position:', cam.scrollX, cam.scrollY);
            console.log('Camera size:', cam.width, 'x', cam.height);
            console.log('Camera zoom:', cam.zoom);
            // Create selection background - positioned in screen center
            const centerX = cam.width / 2;
            const centerY = cam.height / 2;

            console.log('Creating UI at screen center:', centerX, centerY);

            const selectionBg = this.add.rectangle(centerX, centerY, 700, 400, 0x000000);
            selectionBg.setStrokeStyle(5, 0xffd700); // Gold border
            selectionBg.setScrollFactor(0);
            selectionBg.setDepth(500); // Very high depth to ensure visibility
            selectionBg.setInteractive(); // Make background interactive to block clicks below

            console.log('Selection BG created:', selectionBg.visible, 'at depth:', selectionBg.depth);

            // Force the UI to be visible
            selectionBg.setAlpha(0.9);

            // Make sure input is enabled
            this.input.enabled = true;
            console.log('Input enabled:', this.input.enabled);

            // Add a global pointer down handler to test if input is working at all
            this.input.on('pointerdown', (pointer) => {
                console.log('Global pointer down at:', pointer.x, pointer.y);
            });


            // Title
            const title = this.add.text(centerX, centerY - 150, 'Choose Your Starting Element!', {
                fontSize: '28px',
                color: '#ffd700',
                fontStyle: 'bold'
            });
            title.setOrigin(0.5);
            title.setScrollFactor(0);
            title.setDepth(501);

            // For debugging - use fixed elements including philosopher stone
            const selectedElements = ['fire', 'water', 'earth', 'philosopherstone'];
            console.log('Using fixed elements for testing:', selectedElements);

            // Create element cards using chest UI style
            const buttons = [];

            try {
                for (let i = 0; i < selectedElements.length; i++) {
                    // Adjust spacing for 4 elements: spread them more evenly
                    const totalWidth = (selectedElements.length - 1) * 150; // 150px spacing
                    const startX = centerX - totalWidth / 2;
                    const xPos = startX + i * 150;
                    const element = selectedElements[i];

                    console.log(`Processing element ${i}: ${element}`);

                    if (!this.elementConfig) {
                        console.error('elementConfig is not defined!');
                        throw new Error('elementConfig not found');
                    }

                    const config = this.elementConfig[element];

                    if (!config) {
                        console.error(`No config found for element: ${element}`);
                        continue;
                    }

                    const button = this.add.container(xPos, centerY - 20);
                    button.setScrollFactor(0);
                    button.setDepth(502);

                    console.log(`Creating button for ${element} at position ${xPos}, 280`);

                    const bg = this.add.rectangle(0, 0, 140, 200, 0x333333);
                    bg.setStrokeStyle(3, i === 0 ? 0xffff00 : 0xffffff);
                    bg.setInteractive({ useHandCursor: true });

                    console.log(`Creating sprite with sheet: ${config.sheet}, frame: ${config.frame}`);

                    let sprite;
                    try {
                        sprite = this.add.sprite(0, -60, config.sheet, config.frame);
                        sprite.setScale(0.3);
                    } catch (spriteError) {
                        console.error('Error creating sprite:', spriteError);
                        // Create a placeholder rectangle instead
                        sprite = this.add.rectangle(0, -60, 40, 40, config.color || 0xffffff);
                    }

                    const name = this.add.text(0, -15, config.name.toUpperCase(), {
                        fontSize: '14px',
                        color: '#ffffff',
                        fontStyle: 'bold'
                    });
                    name.setOrigin(0.5);

                    const descriptionText = this.elementDescriptions[element] || 'Elemental magic';
                    const description = this.add.text(0, 20, descriptionText, {
                        fontSize: '10px',
                        color: '#cccccc',
                        align: 'center',
                        wordWrap: { width: 120 }
                    });
                    description.setOrigin(0.5);

                    button.add([bg, sprite, name, description]);

                    // Create an invisible hit zone at the button's world position
                    const hitZone = this.add.rectangle(xPos, centerY - 20, 140, 200, 0x00ff00, 0.01);
                    hitZone.setScrollFactor(0);
                    hitZone.setDepth(600);
                    hitZone.setInteractive({ useHandCursor: true });

                    // Store references
                    buttons.push({ container: button, element: element, bg: bg, hitZone: hitZone });

                    // Selection - use arrow function to preserve context
                    const selectElement = () => {
                        console.log(`Element selected: ${element}`);

                        // Add selected element to charges
                        if (!this.chargeSlots) {
                            this.chargeSlots = new Array(8).fill(null);
                        }
                        this.chargeSlots[0] = element;
                        this.charges = [element];
                        console.log('Element selected:', element);
                        console.log('ChargeSlots after selection:', [...this.chargeSlots]);
                        console.log('Charges after selection:', [...this.charges]);
                        
                        // Verify element config exists
                        if (this.elementConfig && this.elementConfig[element]) {
                            console.log('Element config found:', this.elementConfig[element]);
                        } else {
                            console.error('No element config for:', element);
                        }
                        
                        // Check if we have indicators at selection time
                        console.log('Charge indicators at selection:', this.chargeIndicators ? this.chargeIndicators.length : 'No');

                        this.updateChargeUI();
                        console.log('Charge UI updated');

                        // Clean up selection UI
                        selectionBg.destroy();
                        title.destroy();
                        controlHint.destroy();
                        buttons.forEach(btn => {
                            btn.container.destroy();
                            btn.hitZone.destroy();
                        });

                        console.log('UI cleaned up - starting game');
                        // Start the game
                        this.startGame();
                    };

                    // Add event handlers to the hit zone
                    hitZone.on('pointerdown', selectElement);

                    // Hover effects on hit zone
                    hitZone.on('pointerover', () => {
                        console.log(`Hovering over ${element}`);
                        bg.setFillStyle(0x555555);
                    });

                    hitZone.on('pointerout', () => {
                        bg.setFillStyle(0x333333);
                    });

                    // Debug - log button visibility
                    console.log(`Button ${element} visible:`, button.visible, 'BG interactive:', bg.input.enabled);
                }

            } catch (loopError) {
                console.error('Error in button creation loop:', loopError);
                console.error('Stack trace:', loopError.stack);
            }

            // Control hint
            const controlHintText = this.gamepad ?
                'Use D-Pad/Stick to select, A to confirm' :
                'Click an element or use Arrow Keys + Space';
            const controlHint = this.add.text(centerX, centerY + 170, controlHintText, {
                fontSize: '14px',
                color: '#aaaaaa'
            });
            controlHint.setOrigin(0.5);
            controlHint.setScrollFactor(0);
            controlHint.setDepth(501);

            console.log('Element selection UI created successfully');

            // Controller support for element selection
            this.elementSelectionIndex = 0;
            this.elementSelectionButtons = buttons;
            this.elementSelectionActive = true;

            // Highlight first button
            this.updateElementSelectionHighlight();

            // Store references for cleanup
            this.elementSelectionUI = {
                bg: selectionBg,
                title: title,
                controlHint: controlHint,
                buttons: buttons
            };

        } catch (error) {
            console.error('Error in showElementSelection:', error);
            // Fallback: start game with configured element or none
            const startElement = localStorage.getItem('startElement');
            if (startElement && startElement !== 'none') {
                this.charges.push(startElement);
            }
            this.updateChargeUI();
            console.log('Error fallback - starting game');
            this.startGame();
        }
    }

    updateElementSelectionHighlight() {
        // Update visual highlight for selected element
        this.elementSelectionButtons.forEach((btn, index) => {
            if (index === this.elementSelectionIndex) {
                btn.bg.setStrokeStyle(3, 0xffff00); // Yellow highlight
                btn.bg.setScale(1.05);
            } else {
                btn.bg.setStrokeStyle(3, 0xffffff); // White border
                btn.bg.setScale(1);
            }
        });
    }

    selectCurrentElement() {
        if (!this.elementSelectionActive || !this.elementSelectionButtons) return;

        const selectedButton = this.elementSelectionButtons[this.elementSelectionIndex];
        const element = selectedButton.element;

        console.log(`Element selected via controller: ${element}`);

        // Add selected element to charges
        if (!this.chargeSlots) {
            this.chargeSlots = new Array(8).fill(null);
        }
        this.chargeSlots[0] = element;
        this.charges = [element];
        this.updateChargeUI();

        // Clean up selection UI
        this.elementSelectionUI.bg.destroy();
        this.elementSelectionUI.title.destroy();
        this.elementSelectionUI.controlHint.destroy();
        this.elementSelectionUI.buttons.forEach(btn => {
            btn.container.destroy();
            if (btn.hitZone) btn.hitZone.destroy();
        });

        // Clear references
        this.elementSelectionActive = false;
        this.elementSelectionButtons = null;
        this.elementSelectionUI = null;

        console.log('UI cleaned up - starting game');
        // Start the game
        this.startGame();
    }

    startResurrectionAnimation() {
        console.log('startResurrectionAnimation called');

        try {
            // Play death animation backwards from last frame to first
            console.log('Playing wizard death animation backwards');

            // Create a reverse death animation if it doesn't exist
            if (!this.anims.exists('wizard-death-reverse')) {
                // Get the frames from the death animation
                const deathAnim = this.anims.get('wizard-death');
                const frames = deathAnim.frames.map(frame => ({
                    key: frame.textureKey,
                    frame: frame.textureFrame
                }));

                // Reverse the frames array
                frames.reverse();

                // Create the reverse animation
                this.anims.create({
                    key: 'wizard-death-reverse',
                    frames: frames,
                    frameRate: 10,
                    repeat: 0
                });
            }

            // Make sure wizard animation is not paused
            this.wizard.anims.resume();

            // Play the reverse death animation
            this.wizard.play('wizard-death-reverse');

            // After resurrection completes, play idle
            this.wizard.once('animationcomplete', () => {
                console.log('Resurrection animation complete, playing idle');
                this.wizard.play('wizard-idle-loop');
            });

            // Start game after animation plus some delay
            this.time.delayedCall(2000, () => {
                console.log('Starting game after resurrection');
                this.startGame();
            });

        } catch (error) {
            console.error('Error in startResurrectionAnimation:', error);
            // Fallback: start game directly
            this.wizard.play('wizard-idle-loop');
            this.startGame();
        }
    }

    createStageBackground() {
        const worldWidth = 4000;  // Much wider world - was 1280
        const worldHeight = 2160;  // 3x the original height (720 * 3)

        // Set a dark background color as base
        this.cameras.main.setBackgroundColor('#11130d');

        // Remove world bounds - allow infinite movement
        this.physics.world.setBounds(false);

        // Remove camera bounds - allow free camera movement
        // Camera will follow player wherever they go

        // Create floor based on stage type - will scroll infinitely
        let tileName = 'grass-tile';
        if (this.stage === 'cave') {
            tileName = 'stone-tile';
        } else if (this.stage === 'lava') {
            tileName = 'lava-tile';
        }
        
        // Create a tilesprite that covers the entire screen
        // We'll use setScrollFactor(0) to make it stay in place relative to camera
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        // Make it slightly larger than screen to avoid edges showing
        this.floor = this.add.tileSprite(
            screenWidth / 2,  // Center X
            screenHeight / 2, // Center Y
            screenWidth + 200,  // Width with padding
            screenHeight + 200, // Height with padding
            tileName
        );
        this.floor.setScrollFactor(0); // Stay fixed to camera
        this.floor.setDepth(-10); // Far behind everything else

        // Add stage-specific decorations
        // Note: Removed invisible barriers - players can now move freely in all directions
        if (this.stage === 'forest') {
            // Create trees for forest
            this.createTrees();
        }
        // Cave and lava stages have no decorations for now
        
    }

    createTrees() {
        // Add random trees around starting area
        const treeCount = 30;
        const spawnRadius = 1500; // Trees spawn within this radius of start
        
        for (let i = 0; i < treeCount; i++) {
            // Spawn trees around the wizard's starting position
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * spawnRadius;
            const x = 2000 + Math.cos(angle) * distance;
            const y = 1080 + Math.sin(angle) * distance;

            const tree = this.add.image(x, y, 'tree');
            tree.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
            tree.setDepth(Math.min(400, Math.floor(y / 10))); // Depth based on Y position, capped at 400
            tree.setAlpha(0.8);
        }
    }

    createInvisibleBarriers() {
        // Create invisible physics bodies for the world boundaries
        const thickness = 50;
        const worldWidth = 4000;
        const worldHeight = 2160;
        
        // Top barrier
        const topBarrier = this.physics.add.staticImage(worldWidth / 2, thickness / 2, null);
        topBarrier.setSize(worldWidth, thickness);
        topBarrier.setVisible(false);
        
        // Bottom barrier
        const bottomBarrier = this.physics.add.staticImage(worldWidth / 2, worldHeight - thickness / 2, null);
        bottomBarrier.setSize(worldWidth, thickness);
        bottomBarrier.setVisible(false);
        
        // Left barrier
        const leftBarrier = this.physics.add.staticImage(thickness / 2, worldHeight / 2, null);
        leftBarrier.setSize(thickness, worldHeight);
        leftBarrier.setVisible(false);
        
        // Right barrier
        const rightBarrier = this.physics.add.staticImage(worldWidth - thickness / 2, worldHeight / 2, null);
        rightBarrier.setSize(thickness, worldHeight);
        rightBarrier.setVisible(false);
        
        // Store barriers for collision setup
        this.barriers = [topBarrier, bottomBarrier, leftBarrier, rightBarrier];
    }

    createStageDebugDisplay() {
        // Create debug text showing current stage
        const debugText = this.add.text(400, 20, `Stage: ${this.stage.toUpperCase()}`, {
            fontSize: '32px',
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 6,
            fontStyle: 'bold'
        });
        debugText.setOrigin(0.5, 0); // Center horizontally
        debugText.setScrollFactor(0); // Keep it fixed on screen
        debugText.setDepth(10000); // Make sure it's on top of everything
    }

    createPlayerIndicators() {
        // Create a glowing outline effect for the wizard
        this.playerOutline = this.add.graphics();
        this.playerOutline.setDepth(9); // Just below wizard
        
        // Create player label "P1"
        this.playerLabel = this.add.text(0, -60, 'P1', {
            fontSize: '14px',
            color: '#00ff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        });
        this.playerLabel.setOrigin(0.5);
        this.playerLabel.setDepth(11); // Above wizard
        
        // Create arrow indicator that points down at the player
        this.playerArrow = this.add.triangle(0, -80, 
            0, 0,    // top point
            -8, 12,  // bottom left
            8, 12,   // bottom right
            0x00ff00
        );
        this.playerArrow.setDepth(11);
        this.playerArrow.setStrokeStyle(2, 0x000000);
        
        // Pulsing animation for the arrow
        this.tweens.add({
            targets: this.playerArrow,
            y: -75,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Option to toggle indicators with a key
        this.toggleIndicatorsKey = this.input.keyboard.addKey('I');
        this.indicatorsVisible = true;
    }

    updatePlayerIndicators() {
        if (!this.wizard.active || !this.indicatorsVisible) {
            this.playerOutline.clear();
            this.playerLabel.setVisible(false);
            this.playerArrow.setVisible(false);
            return;
        }
        
        // Update positions to follow wizard
        this.playerLabel.x = this.wizard.x;
        this.playerLabel.y = this.wizard.y - 60;
        
        this.playerArrow.x = this.wizard.x;
        // Arrow Y is animated by tween
        
        // Draw glowing outline
        this.playerOutline.clear();
        this.playerOutline.lineStyle(3, 0x00ff00, 0.8);
        
        // Draw circle outline around wizard
        this.playerOutline.strokeCircle(this.wizard.x, this.wizard.y, 35);
        
        // Add glow effect with multiple circles
        this.playerOutline.lineStyle(2, 0x00ff00, 0.4);
        this.playerOutline.strokeCircle(this.wizard.x, this.wizard.y, 38);
        this.playerOutline.lineStyle(1, 0x00ff00, 0.2);
        this.playerOutline.strokeCircle(this.wizard.x, this.wizard.y, 41);
    }

    createChargeUI() {
        // Create secondary timer display where charges label was
        this.secondaryTimer = this.add.text(350, 20, '0:00', {
            fontSize: '16px',
            color: '#ffffff'
        });
        this.secondaryTimer.setScrollFactor(0); // Fix to camera
        this.secondaryTimer.setDepth(560); // Above everything

        // Add FPS meter
        this.fpsText = this.add.text(10, 10, 'FPS: 0', {
            fontSize: '16px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(1000);

        // Removed auto-shooting text

        // Controller and keyboard guides removed for cleaner UI
        // const controllerGuide = this.add.text(600, 460, 'Controller:\nMove: Left Stick\nPause/Link: Start\nElements: Select', {
        //     fontSize: '11px',
        //     color: '#888888',
        //     align: 'left'
        // });
        // controllerGuide.setScrollFactor(0);
        // controllerGuide.setDepth(60);

        // const keyboardGuide = this.add.text(600, 520, 'Keyboard:\nMove: Arrows\nPause/Link: P\nElements: TAB\nSpells: ESC', {
        //     fontSize: '11px',
        //     color: '#888888',
        //     align: 'left'
        // });
        // keyboardGuide.setScrollFactor(0);
        // keyboardGuide.setDepth(60);

        // Initialize charge indicators array
        this.chargeIndicators = [];

        // Create 8 charge indicators using sprites (4 per row)
        for (let i = 0; i < 8; i++) {
            // Calculate position - 4 slots per row
            const row = Math.floor(i / 4);
            const col = i % 4;
            const xPos = 380 + (col * 35);
            const yPos = 50 + (row * 35); // Second row below first
            
            
            // Background slot
            const slotBg = this.add.rectangle(xPos, yPos, 32, 32, 0x333333, 0.7);
            slotBg.setStrokeStyle(2, 0x666666);
            slotBg.setScrollFactor(0);
            slotBg.setDepth(561);
            slotBg.setVisible(i < this.maxCharges);

            // Element sprite indicator - try using image instead of sprite
            const indicator = this.add.image(xPos, yPos, 'element-symbols', 0);
            indicator.setScrollFactor(0);
            indicator.setDepth(1000); // Very high depth to ensure visibility
            indicator.setVisible(false);
            indicator.setScale(0.15); // Same scale as what worked in test
            indicator.setTint(0xffffff); // Ensure no tint
            indicator.setAlpha(1); // Ensure full opacity
            

            // Tier text in corner of slot
            const tierText = this.add.text(xPos + 15, yPos - 15, '', {
                fontSize: '8px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 1
            });
            tierText.setOrigin(0.5);
            tierText.setScrollFactor(0);
            tierText.setDepth(1001);
            tierText.setVisible(false);
            
            this.chargeIndicators.push({ bg: slotBg, sprite: indicator, tierText: tierText });
        }

        // Create charge hold indicator
        this.chargeHoldIndicator = this.add.arc(this.wizard.x, this.wizard.y, 25, 0, 0, false, 0xffffff, 0.3);
        this.chargeHoldIndicator.setStrokeStyle(3, 0xffffff, 1);
        this.chargeHoldIndicator.setVisible(false);
        this.chargeHoldIndicator.setDepth(20);

        // Add level and XP display
        this.levelText = this.add.text(20, 20, `Level ${this.playerLevel}`, {
            fontSize: '20px',
            color: '#ffdd44',
            fontStyle: 'bold'
        });
        this.levelText.setScrollFactor(0);
        this.levelText.setDepth(560);

        this.xpText = this.add.text(20, 45, `XP: ${this.playerXP}/${this.xpToNextLevel}`, {
            fontSize: '14px',
            color: '#ffffff'
        });
        this.xpText.setScrollFactor(0);
        this.xpText.setDepth(560);
    }

    getTierBonusDescription(element, tier) {
        const dmg = Math.round((this.tierScaling.damage[tier - 1] - 1) * 100);
        const area = Math.round((this.tierScaling.area[tier - 1] - 1) * 100);
        const rate = Math.round((1 - this.tierScaling.fireRate[tier - 1]) * 100);
        const proj = this.tierScaling.projectileCount[tier - 1];
        
        let bonuses = [];
        if (dmg > 0) bonuses.push(`+${dmg}% damage`);
        if (area > 0) bonuses.push(`+${area}% area`);
        if (rate > 0) bonuses.push(`+${rate}% cast speed`);
        if (proj > 1) bonuses.push(`${proj}x projectiles`);
        
        return bonuses.join(', ');
    }
    
    showAllChargeSlots() {
        // Create additional charge indicators for pouch slots (indices 8-11)
        if (!this.extraChargeIndicators) {
            this.extraChargeIndicators = [];
            
            // Create 4 additional slots for pouch
            for (let i = 8; i < 12; i++) {
                const col = (i - 8) % 4;
                const xPos = 380 + (col * 35);
                const yPos = 50 + (2 * 35); // Third row
                
                // Background slot with pouch color
                const slotBg = this.add.rectangle(xPos, yPos, 32, 32, 0x2a4a2a, 0.7);
                slotBg.setStrokeStyle(2, 0x4a6a4a);
                slotBg.setScrollFactor(0);
                slotBg.setDepth(561);
                slotBg.setVisible(true);
                
                // Element sprite indicator
                const indicator = this.add.image(xPos, yPos, 'element-symbols', 0);
                indicator.setScrollFactor(0);
                indicator.setDepth(1000);
                indicator.setVisible(false);
                indicator.setScale(0.15);
                indicator.setTint(0xffffff);
                indicator.setAlpha(1);
                
                // Tier text (not used for pouch but kept for consistency)
                const tierText = this.add.text(xPos + 15, yPos - 15, '', {
                    fontSize: '8px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 1
                });
                tierText.setOrigin(0.5);
                tierText.setScrollFactor(0);
                tierText.setDepth(1001);
                tierText.setVisible(false);
                
                this.extraChargeIndicators.push({ bg: slotBg, sprite: indicator, tierText: tierText });
            }
            
            // Add label for pouch row
            this.pouchRowLabel = this.add.text(340, 50 + (2 * 35), 'Pouch:', {
                fontSize: '10px',
                color: '#4a6a4a'
            });
            this.pouchRowLabel.setOrigin(1, 0.5);
            this.pouchRowLabel.setScrollFactor(0);
            this.pouchRowLabel.setDepth(561);
        } else {
            // Just show existing extra indicators
            this.extraChargeIndicators.forEach(indicator => {
                indicator.bg.setVisible(true);
            });
            if (this.pouchRowLabel) {
                this.pouchRowLabel.setVisible(true);
            }
        }
        
        // Update all 12 indicators to show current elements
        this.updateAllChargeIndicators();
    }
    
    hideExtraChargeSlots() {
        if (this.extraChargeIndicators) {
            this.extraChargeIndicators.forEach(indicator => {
                indicator.bg.setVisible(false);
                indicator.sprite.setVisible(false);
                indicator.tierText.setVisible(false);
            });
        }
        if (this.pouchRowLabel) {
            this.pouchRowLabel.setVisible(false);
        }
    }
    
    updateAllChargeIndicators() {
        // Update regular charge indicators (0-7)
        for (let i = 0; i < 8; i++) {
            if (i < this.chargeIndicators.length) {
                const element = this.chargeSlots ? this.chargeSlots[i] : null;
                if (element) {
                    const config = this.elementConfig[element];
                    if (config) {
                        this.chargeIndicators[i].sprite.setTexture(config.sheet, config.frame);
                        this.chargeIndicators[i].sprite.setVisible(true);
                        this.chargeIndicators[i].sprite.setScale(0.1);
                        
                        // Update tier text
                        const tier = this.elementTiers.get(`${element}_${i}`) || 1;
                        if (tier > 1) {
                            this.chargeIndicators[i].tierText.setText(tier.toString());
                            this.chargeIndicators[i].tierText.setVisible(true);
                        } else {
                            this.chargeIndicators[i].tierText.setVisible(false);
                        }
                    }
                } else {
                    this.chargeIndicators[i].sprite.setVisible(false);
                    this.chargeIndicators[i].tierText.setVisible(false);
                }
            }
        }
        
        // Update pouch indicators (8-11)
        if (this.extraChargeIndicators) {
            for (let i = 0; i < 4; i++) {
                const element = this.elementPouch ? this.elementPouch[i] : null;
                if (element) {
                    const config = this.elementConfig[element];
                    if (config) {
                        this.extraChargeIndicators[i].sprite.setTexture(config.sheet, config.frame);
                        this.extraChargeIndicators[i].sprite.setVisible(true);
                        this.extraChargeIndicators[i].sprite.setScale(0.1);
                    }
                } else {
                    this.extraChargeIndicators[i].sprite.setVisible(false);
                }
            }
        }
    }
    
    highlightChargeIndicator(index, highlight) {
        if (index < 8 && this.chargeIndicators && this.chargeIndicators[index]) {
            if (highlight) {
                this.chargeIndicators[index].bg.setStrokeStyle(3, 0xffff00);
                this.chargeIndicators[index].sprite.setScale(0.15);
            } else {
                this.chargeIndicators[index].bg.setStrokeStyle(2, 0x666666);
                this.chargeIndicators[index].sprite.setScale(0.1);
            }
        } else if (index >= 8 && this.extraChargeIndicators) {
            const pouchIndex = index - 8;
            if (this.extraChargeIndicators[pouchIndex]) {
                if (highlight) {
                    this.extraChargeIndicators[pouchIndex].bg.setStrokeStyle(3, 0xffff00);
                    this.extraChargeIndicators[pouchIndex].sprite.setScale(0.15);
                } else {
                    this.extraChargeIndicators[pouchIndex].bg.setStrokeStyle(2, 0x4a6a4a);
                    this.extraChargeIndicators[pouchIndex].sprite.setScale(0.1);
                }
            }
        }
    }
    
    updateChargeUI() {
        // Clean up charge fire times array to match current charges
        this.chargeLastFireTimes = this.chargeLastFireTimes.slice(0, this.charges.length);

        // Initialize chargeSlots if needed
        if (!this.chargeSlots) {
            console.log('updateChargeUI: Creating chargeSlots array');
            this.chargeSlots = new Array(8).fill(null);
        }
        
        // Sync new elements from charges array to chargeSlots
        // Count how many elements are in chargeSlots (excluding nulls)
        const elementsInSlots = this.chargeSlots.filter(slot => slot !== null).length;
        
        // If charges has more elements than chargeSlots, we need to add the new ones
        if (this.charges.length > elementsInSlots) {
            console.log(`updateChargeUI: charges has ${this.charges.length} elements but chargeSlots only has ${elementsInSlots}, syncing new elements...`);
            
            // Find which elements from charges are not in chargeSlots
            let chargeIndex = 0;
            for (let slotIndex = 0; slotIndex < 8 && chargeIndex < this.charges.length; slotIndex++) {
                if (this.chargeSlots[slotIndex] === null) {
                    // Found empty slot, fill it with next element from charges
                    this.chargeSlots[slotIndex] = this.charges[chargeIndex];
                    console.log(`updateChargeUI: Added ${this.charges[chargeIndex]} to slot ${slotIndex}`);
                    chargeIndex++;
                } else if (this.chargeSlots[slotIndex] === this.charges[chargeIndex]) {
                    // This slot already has the correct element, move to next
                    chargeIndex++;
                }
            }
            
            console.log('updateChargeUI: After sync, chargeSlots =', [...this.chargeSlots]);
        }
        
        // Do NOT sync chargeSlots with charges array here - it breaks drag and drop!
        // chargeSlots maintains exact positions, charges is just a list

        // Check if UI has been created yet
        if (!this.chargeIndicators || this.chargeIndicators.length === 0) {
            console.log('Charge indicators not created yet, skipping UI update');
            return;
        }
        
        
        this.chargeIndicators.forEach((indicator, index) => {
            // Main UI only shows first 4 slots (active slots)
            const isActiveSlot = index < 4;
            const showInMainUI = isActiveSlot && index < this.maxCharges;
            indicator.bg.setVisible(showInMainUI);

            const element = this.chargeSlots ? this.chargeSlots[index] : null;
            
            if (index < 4) {  // Only log for the main UI slots to reduce noise
                console.log(`UpdateChargeUI - Slot ${index}: element=${element}, isActive=${isActiveSlot}, showInMainUI=${showInMainUI}`);
            }
            
            // Show the element sprite if there's an element AND this slot should be visible in main UI
            if (element && showInMainUI) {
                const config = this.elementConfig[element];
                if (config) {
                    // Check if texture exists
                    if (!this.textures.exists(config.sheet)) {
                        console.error(`Texture ${config.sheet} does not exist!`);
                        indicator.sprite.setVisible(false);
                        return; // This only returns from the forEach callback, not the whole function
                    }
                    
                    // Update texture and frame
                    try {
                        // For special single-image elements, handle differently
                        if (config.isImage) {
                            indicator.sprite.setTexture(config.sheet);
                        } else {
                            indicator.sprite.setTexture(config.sheet, config.frame);
                        }
                        indicator.sprite.setVisible(true);
                        indicator.sprite.setAlpha(1);
                        indicator.sprite.setTint(0xffffff);
                        indicator.sprite.setScale(0.15); // Increased scale to match what worked in test
                        indicator.sprite.setDepth(2000); // High depth like in test
                        
                        console.log(`Set sprite for slot ${index}: ${element}, visible=${indicator.sprite.visible}`);
                        
                        // Update tier text
                        const tier = this.elementTiers.get(`${element}_${index}`) || 1;
                        if (tier > 1) {
                            indicator.tierText.setText(tier.toString());
                            indicator.tierText.setVisible(true);
                        } else {
                            indicator.tierText.setVisible(false);
                        }
                    } catch (error) {
                        console.error(`Error setting sprite texture for slot ${index}:`, error);
                        indicator.sprite.setVisible(false);
                        indicator.tierText.setVisible(false);
                    }
                } else {
                    indicator.sprite.setVisible(false);
                    indicator.tierText.setVisible(false);
                }
            } else {
                indicator.sprite.setVisible(false);
                indicator.tierText.setVisible(false);
            }
        });
    }

    createSpellbookUI() {
        this.spellbookUI = this.add.container(400, 300);
        this.spellbookUI.setDepth(950); // Very high depth to render above everything
        this.spellbookUI.setScrollFactor(0); // Fix to camera

        // Semi-transparent black overlay background
        const overlayBg = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.85);
        overlayBg.setInteractive(); // Block clicks underneath

        // Main container frame
        const mainBg = this.add.rectangle(0, 0, 700, 500, 0x2a2a2a, 1.0); // Lighter color, full opacity
        mainBg.setStrokeStyle(3, 0xffdd44);

        // Title
        const title = this.add.text(0, -220, 'ELEMENT GUIDE', {
            fontSize: '28px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Container for element cards (no mask for now to debug)
        this.elementCardsContainer = this.add.container(0, 0);

        // Scroll position tracking
        this.spellScrollY = 0;
        this.spellMaxScrollY = 0;

        // Close button
        const closeButton = this.add.text(330, -220, 'X', {
            fontSize: '24px',
            color: '#ff6666',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerover', () => closeButton.setColor('#ff9999'));
        closeButton.on('pointerout', () => closeButton.setColor('#ff6666'));
        closeButton.on('pointerdown', () => this.toggleSpellbook());

        // Instructions
        const instructions = this.add.text(0, 220, 'Press ESC to close • Use mouse wheel or arrow keys to scroll', {
            fontSize: '14px',
            color: '#888888'
        }).setOrigin(0.5);

        this.spellbookUI.add([overlayBg, mainBg, title, this.elementCardsContainer, closeButton, instructions]);
        this.spellbookUI.setVisible(false);
    }


    createHealthBar() {
        this.healthBarBg = this.add.rectangle(100, 550, 150, 20, 0x333333);
        this.healthBarBg.setStrokeStyle(2, 0xffffff);
        this.healthBarBg.setScrollFactor(0); // Fix to camera
        this.healthBarBg.setDepth(600); // Render above all game elements

        this.healthBar = this.add.rectangle(25, 550, 150, 20, 0x44ff44);
        this.healthBar.setOrigin(0, 0.5);
        this.healthBar.setScrollFactor(0); // Fix to camera
        this.healthBar.setDepth(601); // Render above background

        const healthLabel = this.add.text(100, 525, 'HEALTH', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        healthLabel.setScrollFactor(0); // Fix to camera
        healthLabel.setDepth(601); // Render above background

        // Add timer display in top middle
        this.difficultyText = this.add.text(400, 20, 'Timer: 0:00', {
            fontSize: '20px',
            color: '#ffaa44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.difficultyText.setScrollFactor(0);
        this.difficultyText.setDepth(560);

        // Removed duplicate timer - using difficultyText only
        // this.survivalText = this.add.text(650, 45, 'Time: 0:00', {
        //     fontSize: '14px',
        //     color: '#ffffff'
        // });
        // this.survivalText.setScrollFactor(0);
        // this.survivalText.setDepth(60);

        this.updateHealthBar();


    }



    startGame() {
        console.log('Game starting - enabling controls');

        // Enable player controls
        this.gameStarted = true;

        console.log('Starting wave system');

        // Update charge UI with starting element (don't reset charges)
        this.updateChargeUI();

        // Initialize wave system
        this.waveStartTime = this.time.now;
        this.startNewWave();

        console.log('Game fully started!');

        // updateChargeUI should handle all the display updates now
        
        // Force a UI update after game starts
        this.time.delayedCall(100, () => {
            this.updateChargeUI();
            
            // Auto-activate philosopher stone if needed
            if (this.shouldAutoActivatePhilosopherStone) {
                console.log('Auto-activating philosopher stone now that game has started');
                this.createPhilosopherStone();
                this.shouldAutoActivatePhilosopherStone = false;
                
            }
        });
    }

    getWaveDefinition(waveNumber) {
        // Wave definitions inspired by Vampire Survivors
        // Each wave lasts 60 seconds, with specific enemy types and spawn patterns

        let baseWaves;
        
        if (this.stage === 'lava') {
            // Lava stage waves: fire slimes, eye bats, fire worms, summoners, orange golems
            baseWaves = [
                // Wave 0 (0:00-1:00) - Introduction
                {
                    enemies: [
                        { type: 'bat', weight: 40, count: 3 },
                        { type: 'fireslime', weight: 60, count: 2 }
                    ],
                    spawnInterval: 2000,
                    maxEnemies: 25
                },
                // Wave 1 (1:00-2:00) - Add fire worms
                {
                    enemies: [
                        { type: 'bat', weight: 30, count: 4 },
                        { type: 'fireslime', weight: 35, count: 2 },
                        { type: 'fireworm', weight: 35, count: 2 }
                    ],
                    spawnInterval: 1500,
                    maxEnemies: 35
                },
                // Wave 2 (2:00-3:00) - Add orange golems
                {
                    enemies: [
                        { type: 'bat', weight: 20, count: 4 },
                        { type: 'fireslime', weight: 25, count: 3 },
                        { type: 'fireworm', weight: 30, count: 2 },
                        { type: 'orangegolem', weight: 25, count: 1 }
                    ],
                    spawnInterval: 1200,
                    maxEnemies: 45,
                    specialEvent: { time: 30, type: 'swarm', enemy: 'fireworm', count: 10 }
                },
                // Wave 3 (3:00-4:00) - Add summoners
                {
                    enemies: [
                        { type: 'fireslime', weight: 25, count: 3 },
                        { type: 'fireworm', weight: 25, count: 3 },
                        { type: 'orangegolem', weight: 25, count: 2 },
                        { type: 'summoner', weight: 25, count: 1 }
                    ],
                    spawnInterval: 1000,
                    maxEnemies: 55
                },
                // Wave 4 (4:00-5:00) - Intense heat
                {
                    enemies: [
                        { type: 'fireslime', weight: 20, count: 4 },
                        { type: 'orangegolem', weight: 30, count: 2 },
                        { type: 'summoner', weight: 20, count: 1 },
                        { type: 'fireworm', weight: 30, count: 3 }
                    ],
                    spawnInterval: 800,
                    maxEnemies: 65,
                    specialEvent: { time: 30, type: 'circle', enemy: 'fireslime', count: 12 }
                },
                // Wave 5+ (5:00+) - Full lava roster
                {
                    enemies: [
                        { type: 'orangegolem', weight: 25, count: 2 },
                        { type: 'summoner', weight: 20, count: 2 },
                        { type: 'fireslime', weight: 20, count: 4 },
                        { type: 'fireworm', weight: 20, count: 4 },
                        { type: 'bat', weight: 15, count: 5 }
                    ],
                    spawnInterval: 600,
                    maxEnemies: 80
                }
            ];
        } else if (this.stage === 'cave') {
            // Cave stage waves: slimes, lost souls, bats, golems, dark eyes
            baseWaves = [
                // Wave 0 (0:00-1:00) - Introduction
                {
                    enemies: [
                        { type: 'bat', weight: 40, count: 3 },
                        { type: 'slime', weight: 60, count: 2 }
                    ],
                    spawnInterval: 2000,
                    maxEnemies: 25
                },
                // Wave 1 (1:00-2:00) - Add souls
                {
                    enemies: [
                        { type: 'bat', weight: 30, count: 4 },
                        { type: 'slime', weight: 40, count: 2 },
                        { type: 'soul', weight: 30, count: 2 }
                    ],
                    spawnInterval: 1500,
                    maxEnemies: 35
                },
                // Wave 2 (2:00-3:00) - Add golems
                {
                    enemies: [
                        { type: 'bat', weight: 25, count: 4 },
                        { type: 'slime', weight: 30, count: 2 },
                        { type: 'soul', weight: 25, count: 2 },
                        { type: 'golem', weight: 20, count: 1 }
                    ],
                    spawnInterval: 1200,
                    maxEnemies: 45,
                    specialEvent: { time: 30, type: 'swarm', enemy: 'bat', count: 12 }
                },
                // Wave 3 (3:00-4:00) - More golems
                {
                    enemies: [
                        { type: 'slime', weight: 25, count: 3 },
                        { type: 'soul', weight: 25, count: 2 },
                        { type: 'golem', weight: 25, count: 2 },
                        { type: 'bat', weight: 25, count: 3 }
                    ],
                    spawnInterval: 1000,
                    maxEnemies: 55
                },
                // Wave 4 (4:00-5:00) - Add dark eyes
                {
                    enemies: [
                        { type: 'soul', weight: 20, count: 3 },
                        { type: 'golem', weight: 30, count: 2 },
                        { type: 'slime', weight: 30, count: 3 },
                        { type: 'darkeye', weight: 20, count: 1 }
                    ],
                    spawnInterval: 800,
                    maxEnemies: 65,
                    specialEvent: { time: 30, type: 'circle', enemy: 'soul', count: 10 }
                },
                // Wave 5+ (5:00+) - Full cave roster
                {
                    enemies: [
                        { type: 'golem', weight: 25, count: 2 },
                        { type: 'soul', weight: 20, count: 3 },
                        { type: 'slime', weight: 20, count: 4 },
                        { type: 'darkeye', weight: 20, count: 1 },
                        { type: 'bat', weight: 15, count: 4 }
                    ],
                    spawnInterval: 600,
                    maxEnemies: 80
                }
            ];
        } else {
            // Forest stage waves: trees, mushrooms, bats, bloboids, summoners
            baseWaves = [
                // Wave 0 (0:00-1:00) - Introduction
                {
                    enemies: [
                        { type: 'bat', weight: 40, count: 3 },
                        { type: 'tree', weight: 60, count: 2 }
                    ],
                    spawnInterval: 2000,
                    maxEnemies: 25
                },
                // Wave 1 (1:00-2:00) - Add mushrooms
                {
                    enemies: [
                        { type: 'bat', weight: 30, count: 4 },
                        { type: 'tree', weight: 40, count: 2 },
                        { type: 'mushroom', weight: 30, count: 2 }
                    ],
                    spawnInterval: 1500,
                    maxEnemies: 35
                },
                // Wave 2 (2:00-3:00) - Add bloboids
                {
                    enemies: [
                        { type: 'bat', weight: 25, count: 4 },
                        { type: 'tree', weight: 30, count: 2 },
                        { type: 'mushroom', weight: 25, count: 2 },
                        { type: 'bloboid', weight: 20, count: 2 }
                    ],
                    spawnInterval: 1200,
                    maxEnemies: 45,
                    specialEvent: { time: 30, type: 'swarm', enemy: 'bat', count: 12 }
                },
                // Wave 3 (3:00-4:00) - More variety
                {
                    enemies: [
                        { type: 'tree', weight: 25, count: 3 },
                        { type: 'mushroom', weight: 25, count: 2 },
                        { type: 'bloboid', weight: 25, count: 2 },
                        { type: 'bat', weight: 25, count: 3 }
                    ],
                    spawnInterval: 1000,
                    maxEnemies: 55
                },
                // Wave 4 (4:00-5:00) - Add summoners
                {
                    enemies: [
                        { type: 'mushroom', weight: 20, count: 3 },
                        { type: 'bloboid', weight: 30, count: 3 },
                        { type: 'tree', weight: 30, count: 3 },
                        { type: 'summoner', weight: 20, count: 1 }
                    ],
                    spawnInterval: 800,
                    maxEnemies: 65,
                    specialEvent: { time: 30, type: 'circle', enemy: 'mushroom', count: 10 }
                },
                // Wave 5+ (5:00+) - Full forest roster
                {
                    enemies: [
                        { type: 'bloboid', weight: 25, count: 3 },
                        { type: 'summoner', weight: 20, count: 2 },
                        { type: 'tree', weight: 20, count: 4 },
                        { type: 'mushroom', weight: 20, count: 3 },
                        { type: 'bat', weight: 15, count: 4 }
                    ],
                    spawnInterval: 600,
                    maxEnemies: 80
                }
            ];
        }

        // After wave 5, cycle through waves with increased difficulty
        const waveIndex = Math.min(waveNumber, baseWaves.length - 1);
        const wave = { ...baseWaves[waveIndex] };

        // Increase difficulty for waves beyond the base set
        if (waveNumber >= baseWaves.length) {
            const cycleNumber = Math.floor(waveNumber / baseWaves.length);
            wave.spawnInterval = Math.max(300, wave.spawnInterval - (cycleNumber * 200));
            wave.maxEnemies = wave.maxEnemies + (cycleNumber * 10);
        }

        return wave;
    }

    startNewWave() {
        this.currentWave++;
        this.waveStartTime = this.time.now;
        this.enemiesInCurrentWave = 0;

        console.log(`Starting wave ${this.currentWave}`);

        // Show wave announcement
        const waveText = this.add.text(400, 200, `Wave ${this.currentWave}`, {
            fontSize: '48px',
            color: '#ffdd44',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        waveText.setOrigin(0.5);
        waveText.setDepth(600);

        this.tweens.add({
            targets: waveText,
            y: 250,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => waveText.destroy()
        });
    }

    createWizardHealthBar() {
        // Create health bar that floats above wizard
        this.wizardHealthBarBg = this.add.rectangle(0, -50, 40, 6, 0x333333);
        this.wizardHealthBarBg.setStrokeStyle(1, 0x000000);
        this.wizardHealthBarBg.setDepth(550); // Above enemies (25) but below UI (100+)

        this.wizardHealthBar = this.add.rectangle(-20, -50, 40, 6, 0x44ff44);
        this.wizardHealthBar.setOrigin(0, 0.5);
        this.wizardHealthBar.setDepth(551); // Above background bar

        // Add to wizard container or update position in update loop
        this.updateWizardHealthBar();
    }

    updateHealthBar() {
        // Bottom health bar removed - only updating wizard health bar
        return;
    }

    updateWizardHealthBar() {
        if (!this.wizardHealthBar || !this.wizardHealthBarBg) return;

        // Update position to follow wizard
        this.wizardHealthBarBg.x = this.wizard.x;
        this.wizardHealthBarBg.y = this.wizard.y - 50;
        this.wizardHealthBar.x = this.wizard.x - 20;
        this.wizardHealthBar.y = this.wizard.y - 50;

        // Update health display
        const healthPercent = Math.max(0, this.playerHealth / this.maxHealth);
        this.wizardHealthBar.width = 40 * healthPercent;

        if (healthPercent > 0.6) {
            this.wizardHealthBar.setFillStyle(0x44ff44);
        } else if (healthPercent > 0.3) {
            this.wizardHealthBar.setFillStyle(0xffff44);
        } else {
            this.wizardHealthBar.setFillStyle(0xff4444);
        }

        // Hide if dead
        if (healthPercent === 0) {
            this.wizardHealthBar.setVisible(false);
            this.wizardHealthBarBg.setVisible(false);
        }
    }

    createXPBar() {
        // Create XP bar at top of screen - full width
        const barWidth = 800; // Full screen width
        const barHeight = 8; // Made thinner (was 20)
        const barX = 400; // Center of screen
        const barY = barHeight / 2; // Touching top of screen

        // Background
        this.xpBarBg = this.add.rectangle(barX, barY, barWidth, barHeight, 0x333333);
        this.xpBarBg.setStrokeStyle(1, 0x000000);
        this.xpBarBg.setScrollFactor(0);
        this.xpBarBg.setDepth(600);

        // XP fill
        this.xpBarFill = this.add.rectangle(0, barY, 0, barHeight - 2, 0x4444ff);
        this.xpBarFill.setOrigin(0, 0.5);
        this.xpBarFill.setScrollFactor(0);
        this.xpBarFill.setDepth(601);

        // Level text - removed for cleaner UI
        // this.levelText = this.add.text(10, barY, `Lvl ${this.playerLevel}`, {
        //     fontSize: '12px',
        //     color: '#ffffff',
        //     fontStyle: 'bold',
        //     stroke: '#000000',
        //     strokeThickness: 1
        // });
        // this.levelText.setOrigin(0, 0.5);
        // this.levelText.setScrollFactor(0);
        // this.levelText.setDepth(102);

        // XP text
        this.xpText = this.add.text(barX, barY, `${this.playerXP} / ${this.xpToNextLevel}`, {
            fontSize: '10px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        });
        this.xpText.setOrigin(0.5, 0.5);
        this.xpText.setScrollFactor(0);
        this.xpText.setDepth(102);

        this.updateXPBar();
    }

    updateXPBar() {
        if (!this.xpBarFill || !this.xpText) return;

        // Update XP fill
        const xpPercent = this.playerXP / this.xpToNextLevel;
        const barWidth = 800; // Full screen width
        this.xpBarFill.width = (barWidth - 2) * xpPercent;

        // Update text
        this.xpText.setText(`${this.playerXP} / ${this.xpToNextLevel}`);
        if (this.levelText) {
            this.levelText.setText(`Lvl ${this.playerLevel}`);
        }
    }

    update(time, delta) {
        // Stop all updates if game has ended
        if (this.gameEnded) return;
        
        // Update gamepad reference
        if (!this.gamepad && this.input.gamepad.total > 0) {
            this.gamepad = this.input.gamepad.getPad(0);
            if (this.gamepad) {
                console.log('Gamepad connected in update:', this.gamepad.id);
                // Removed controller connected text
            }
        } else if (this.gamepad && !this.gamepad.connected) {
            this.gamepad = null;
            // Removed controller text
        }

        // Update survival time (only when not paused, no menus open, and game started)
        if (this.time.timeScale > 0 && !this.isPaused && !this.spellbookOpen && !this.chestSelectionActive && this.gameStarted) {
            this.survivalTime += delta * this.speedMultiplier;
        }
        
        // Update infinite scrolling floor
        if (this.floor) {
            // Since floor has scrollFactor(0), it stays with camera automatically
            // We need to update the tile positions in the same direction as camera movement
            const cam = this.cameras.main;
            this.floor.tilePositionX = cam.scrollX;
            this.floor.tilePositionY = cam.scrollY;
        }
        
        // Update obstacle manager to load/unload obstacles based on player position
        if (this.obstacleManager && this.wizard) {
            this.obstacleManager.update(this.wizard.x, this.wizard.y);
        }
        
        // Update hexed enemies visuals
        if (this.hexActive) {
            this.updateHexedEnemies();
        }

        // Update spawn rate over time (every minute)
        const currentMinute = Math.floor(this.survivalTime / 60000);
        // Start slower and ramp up more gradually
        this.spawnRateMultiplier = 1 + (currentMinute * 0.3); // 30% faster each minute instead of 50%

        // Spawn elite enemy every 30 seconds, but start after 1 minute
        const current30Seconds = Math.floor(this.survivalTime / 30000);
        if (current30Seconds > this.lastEliteSpawn && this.survivalTime > 60000) {
            this.lastEliteSpawn = current30Seconds;
            this.spawnEliteEnemy();
        }

        // Update timer displays
        const totalSeconds = Math.floor(this.survivalTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (this.difficultyText) {
            const speedLabel = this.speedMode !== 'frolic' ? ` (${this.speedMode.toUpperCase()})` : '';
            this.difficultyText.setText(`Timer: ${timeString}${speedLabel}`);
        }

        // Update secondary timer (no label)
        if (this.secondaryTimer) {
            this.secondaryTimer.setText(timeString);
        }

        // Update FPS meter
        if (this.fpsText) {
            const fps = Math.round(this.game.loop.actualFps);
            this.fpsText.setText(`FPS: ${fps}`);
            // Change color based on performance
            if (fps >= 55) {
                this.fpsText.setColor('#00ff00'); // Green for good
            } else if (fps >= 30) {
                this.fpsText.setColor('#ffff00'); // Yellow for okay
            } else {
                this.fpsText.setColor('#ff0000'); // Red for poor
            }
        }

        // Check win condition based on speed mode
        const winMinutesByMode = {
            'frolic': 10,     // Original 10 minutes
            'vibe': 5,        // Half time (was hyper mode)
            'hyper': 3.33,    // 10 / 3 minutes
            'warp': 1.67      // 10 / 6 minutes
        };
        
        const winMinutes = winMinutesByMode[this.speedMode] || 10;
        if (minutes >= winMinutes) {
            this.gameWon();
        }
        // Removed duplicate timer update

        // Initialize gamepad button tracking
        if (!this.gamepadButtonStates) {
            this.gamepadButtonStates = [];
        }

        // P key or Start button (button 9) for pause/charge management
        let startPressed = false;
        if (this.gamepad && this.gamepad.buttons[9]) {
            startPressed = this.gamepad.buttons[9].pressed;
        }

        // Only open pause menu if no other menus are active
        if ((Phaser.Input.Keyboard.JustDown(this.pKey) ||
            (startPressed && !this.gamepadButtonStates[9])) &&
            !this.spellbookOpen && !this.chestSelectionActive && !this.fusionUI &&
            !this.elementSelectionActive && !this.discardConfirmation && !this.discardConfirmUI) {
            this.togglePause();
        }

        // TAB or ESC key to open spellbook (consolidated menu)
        let selectPressed = false;
        if (this.gamepad && this.gamepad.buttons[8]) {
            selectPressed = this.gamepad.buttons[8].pressed;
        }

        // Handle spellbook toggle
        if ((Phaser.Input.Keyboard.JustDown(this.escKey) || 
            Phaser.Input.Keyboard.JustDown(this.tabKey) ||
            (selectPressed && !this.gamepadButtonStates[8])) &&
            !this.isPaused && !this.chestSelectionActive && !this.fusionUI) {
            this.toggleSpellbook();
        }

        // D key for debug mode toggle
        if (Phaser.Input.Keyboard.JustDown(this.debugKey) &&
            !this.isPaused && !this.spellbookOpen && !this.chestSelectionActive && !this.fusionUI) {
            // Toggle debug mode
            const debugEnabled = localStorage.getItem('debugMode') === 'true';
            const newDebugState = !debugEnabled;
            localStorage.setItem('debugMode', newDebugState.toString());

            // Update physics debug
            if (this.physics.world) {
                this.physics.world.drawDebug = newDebugState;
                if (this.physics.world.debugGraphic) {
                    this.physics.world.debugGraphic.setVisible(newDebugState);
                }
            }

            // Show feedback
            const debugText = this.add.text(400, 50, `Debug Mode: ${newDebugState ? 'ON' : 'OFF'}`, {
                fontSize: '20px',
                color: newDebugState ? '#00ff00' : '#ff0000',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            debugText.setScrollFactor(0);
            debugText.setDepth(1000);

            this.tweens.add({
                targets: debugText,
                alpha: 0,
                duration: 1500,
                onComplete: () => debugText.destroy()
            });
        }
        
        // I key to toggle player indicators
        if (this.toggleIndicatorsKey && Phaser.Input.Keyboard.JustDown(this.toggleIndicatorsKey) &&
            !this.isPaused && !this.spellbookOpen && !this.chestSelectionActive && !this.fusionUI) {
            this.indicatorsVisible = !this.indicatorsVisible;
            
            // Show feedback
            const indicatorText = this.add.text(400, 100, `Player Indicators: ${this.indicatorsVisible ? 'ON' : 'OFF'}`, {
                fontSize: '20px',
                color: this.indicatorsVisible ? '#00ff00' : '#ff0000',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            indicatorText.setScrollFactor(0);
            indicatorText.setDepth(1000);

            this.tweens.add({
                targets: indicatorText,
                alpha: 0,
                duration: 1500,
                onComplete: () => indicatorText.destroy()
            });
        }

        // Update gamepad button states for next frame
        if (this.gamepad) {
            this.gamepad.buttons.forEach((button, index) => {
                this.gamepadButtonStates[index] = button.pressed;
            });
        }

        // Handle fusion UI controller input FIRST (highest priority)
        if (this.fusionUI && this.fusionUI.active) {
            this.handleFusionController();
            return;
        }

        // Handle spellbook when it's open
        if (this.spellbookOpen) {
            const scrollSpeed = 20; // Increased for larger cards

            // Keyboard scrolling
            if (this.cursors.up.isDown) {
                this.spellScrollY = Math.max(0, this.spellScrollY - scrollSpeed);
                this.elementCardsContainer.y = -this.spellScrollY;
            } else if (this.cursors.down.isDown) {
                this.spellScrollY = Math.min(this.spellMaxScrollY, this.spellScrollY + scrollSpeed);
                this.elementCardsContainer.y = -this.spellScrollY;
            }

            // Gamepad scrolling
            if (this.gamepad) {
                const leftStickY = this.gamepad.leftStick.y;
                const dpadUp = this.gamepad.up;
                const dpadDown = this.gamepad.down;

                if (leftStickY < -0.5 || dpadUp) {
                    this.spellScrollY = Math.max(0, this.spellScrollY - scrollSpeed);
                    this.elementCardsContainer.y = -this.spellScrollY;
                } else if (leftStickY > 0.5 || dpadDown) {
                    this.spellScrollY = Math.min(this.spellMaxScrollY, this.spellScrollY + scrollSpeed);
                    this.elementCardsContainer.y = -this.spellScrollY;
                }
            }

            return;
        }


        if (this.playerHealth <= 0) {
            return;
        }

        // Handle meditate selection controller input
        if (this.meditateSelectionActive && this.meditateUI) {
            this.handleMeditateController();
            return;
        }

        // Handle chest selection controller input
        if (this.chestSelectionActive && this.chestUI) {
            this.handleChestSelectionController();
            return;
        }
        
        // Handle chest skip animation with gamepad A button
        if (this.chestSkipGamepad && this.gamepad) {
            // Check if A button (button 0) is pressed
            if (this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed && !this.gamepadButtonStates[0]) {
                // Trigger the fast forward function if it exists
                if (this.chestSkipKey && this.chestSkipKey.listeners('down').length > 0) {
                    // Emit the keyboard event to trigger the same fast forward function
                    this.chestSkipKey.emit('down');
                }
            }
        }

        // Handle pause menu controller input when paused
        if (this.isPaused) {
            this.handlePauseMenuController();
            return;
        }

        // Handle element selection controls before game starts
        if (this.elementSelectionActive && this.elementSelectionButtons) {
            // Check for left/right navigation (D-pad or left stick)
            let leftPressed = false;
            let rightPressed = false;
            let confirmPressed = false;

            if (this.gamepad) {
                // D-pad navigation
                leftPressed = this.gamepad.buttons[14] && this.gamepad.buttons[14].pressed && !this.gamepadButtonStates[14];
                rightPressed = this.gamepad.buttons[15] && this.gamepad.buttons[15].pressed && !this.gamepadButtonStates[15];

                // Left stick navigation
                if (!leftPressed && this.gamepad.leftStick.x < -0.5 && !this.leftStickPressed) {
                    leftPressed = true;
                    this.leftStickPressed = true;
                } else if (this.gamepad.leftStick.x >= -0.5) {
                    this.leftStickPressed = false;
                }

                if (!rightPressed && this.gamepad.leftStick.x > 0.5 && !this.rightStickPressed) {
                    rightPressed = true;
                    this.rightStickPressed = true;
                } else if (this.gamepad.leftStick.x <= 0.5) {
                    this.rightStickPressed = false;
                }

                // A button to confirm
                confirmPressed = this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed && !this.gamepadButtonStates[0];
            }

            // Keyboard support as well
            if (this.cursors) {
                leftPressed = leftPressed || Phaser.Input.Keyboard.JustDown(this.cursors.left);
                rightPressed = rightPressed || Phaser.Input.Keyboard.JustDown(this.cursors.right);
            }
            if (this.spaceKey) {
                confirmPressed = confirmPressed || Phaser.Input.Keyboard.JustDown(this.spaceKey);
            }

            // Navigate between elements
            if (leftPressed) {
                console.log('Element selection: Navigate left');
                this.elementSelectionIndex = Math.max(0, this.elementSelectionIndex - 1);
                this.updateElementSelectionHighlight();
            } else if (rightPressed) {
                console.log('Element selection: Navigate right');
                this.elementSelectionIndex = Math.min(this.elementSelectionButtons.length - 1, this.elementSelectionIndex + 1);
                this.updateElementSelectionHighlight();
            }

            // Select element
            if (confirmPressed) {
                console.log('Element selection: Confirm selection');
                this.selectCurrentElement();
            }
        }

        // Don't allow player movement until game has started
        if (!this.gameStarted) {
            return;
        }

        const speed = 160 * this.speedMultiplier;
        let moving = false;
        let velocityX = 0;
        let velocityY = 0;

        // Keyboard movement - check all keys independently
        let movingLeft = this.cursors.left.isDown;
        let movingRight = this.cursors.right.isDown;
        let movingUp = this.cursors.up.isDown;
        let movingDown = this.cursors.down.isDown;

        if (movingLeft && !movingRight) {
            velocityX = -speed;
            this.wizard.setFlipX(false); // Face left (no flip)
            moving = true;
        } else if (movingRight && !movingLeft) {
            velocityX = speed;
            this.wizard.setFlipX(true); // Flip sprite to face right
            moving = true;
        }

        if (movingUp && !movingDown) {
            velocityY = -speed;
            moving = true;
        } else if (movingDown && !movingUp) {
            velocityY = speed;
            moving = true;
        }

        // Controller movement (left stick) - check this first
        let usingGamepad = false;
        if (this.gamepad && this.gamepad.connected) {
            // Get left stick values
            const leftStick = this.gamepad.leftStick;
            const leftStickX = leftStick.x;
            const leftStickY = leftStick.y;
            const deadzone = 0.2;

            if (Math.abs(leftStickX) > deadzone || Math.abs(leftStickY) > deadzone) {
                velocityX = leftStickX * speed;
                velocityY = leftStickY * speed;
                moving = true;
                usingGamepad = true;

                // Update direction based on stick direction (8-directional)
                const angle = Math.atan2(leftStickY, leftStickX);
                const octant = Math.round(8 * angle / (2 * Math.PI) + 8) % 8;

                const directions = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
                const newDirection = directions[octant];

                // Update stable direction for gamepad
                this.wizard.lastDirection = newDirection;
                this.wizard.lastStableDirection = newDirection;

                // Update flip based on horizontal component
                if (leftStickX < -deadzone) {
                    this.wizard.setFlipX(false); // Face left
                } else if (leftStickX > deadzone) {
                    this.wizard.setFlipX(true); // Face right
                }
            } else {
                // When gamepad is centered, preserve the last stable direction
                usingGamepad = true; // Mark that we're using gamepad even when centered
            }
        }

        // Initialize direction tracking if needed
        if (!this.wizard.directionBuffer) {
            this.wizard.directionBuffer = [];
            this.wizard.lastStableDirection = this.wizard.lastDirection || 'down';
        }

        // Only update direction from keyboard if not using gamepad
        if (!usingGamepad && moving) {
            const prevDirection = this.wizard.lastDirection;
            let currentDirection = null;

            // Determine direction based on which keys are pressed
            if (movingUp && movingLeft) {
                currentDirection = 'up-left';
            } else if (movingUp && movingRight) {
                currentDirection = 'up-right';
            } else if (movingDown && movingLeft) {
                currentDirection = 'down-left';
            } else if (movingDown && movingRight) {
                currentDirection = 'down-right';
            } else if (movingLeft) {
                currentDirection = 'left';
            } else if (movingRight) {
                currentDirection = 'right';
            } else if (movingUp) {
                currentDirection = 'up';
            } else if (movingDown) {
                currentDirection = 'down';
            }

            // Add to buffer
            if (currentDirection) {
                this.wizard.directionBuffer.push(currentDirection);
                if (this.wizard.directionBuffer.length > 3) {
                    this.wizard.directionBuffer.shift();
                }

                // Check if direction has been stable for a few frames
                const allSame = this.wizard.directionBuffer.every(d => d === currentDirection);

                // Update direction only if:
                // 1. Direction has been stable for 3 frames OR
                // 2. We're changing to a diagonal (immediate response for diagonals)
                const isDiagonal = currentDirection.includes('-');

                if ((allSame && this.wizard.directionBuffer.length >= 2) || isDiagonal) {
                    if (currentDirection !== prevDirection) {
                        this.wizard.lastDirection = currentDirection;
                        this.wizard.lastStableDirection = currentDirection;
                        console.log(`Direction changed from ${prevDirection} to ${currentDirection}`);
                    }
                }
            }
        } else if (!moving && !usingGamepad) {
            // Clear buffer when not moving (but only for keyboard input)
            this.wizard.directionBuffer = [];
            // Keep the last stable direction
            this.wizard.lastDirection = this.wizard.lastStableDirection;
        }

        this.wizard.setVelocity(velocityX, velocityY);

        // Direction is preserved when not moving, no need to change it

        // Update debug directional line
        if (this.debugDirectionLine && this.debugDirectionLine.visible && this.debugDirectionLine.clear) {
            this.debugDirectionLine.clear();
            this.debugDirectionLine.lineStyle(2, 0xffff00, 1); // Yellow line

            const directionAngles = {
                'up': -Math.PI / 2,
                'down': Math.PI / 2,
                'left': Math.PI,
                'right': 0,
                'up-left': -3 * Math.PI / 4,
                'up-right': -Math.PI / 4,
                'down-left': 3 * Math.PI / 4,
                'down-right': Math.PI / 4
            };

            const angle = directionAngles[this.wizard.lastDirection] || 0;
            const lineLength = 100;
            const endX = this.wizard.x + Math.cos(angle) * lineLength;
            const endY = this.wizard.y + Math.sin(angle) * lineLength;

            this.debugDirectionLine.moveTo(this.wizard.x, this.wizard.y);
            this.debugDirectionLine.lineTo(endX, endY);
            this.debugDirectionLine.stroke();
        }

        // Play appropriate animation
        if (moving) {
            const currentAnim = this.wizard.anims.currentAnim?.key;
            if (currentAnim !== 'wizard-fly-start' && currentAnim !== 'wizard-fly-loop') {
                // Start with the startup animation
                this.wizard.play('wizard-fly-start');
                this.wizard.once('animationcomplete', () => {
                    // After startup, play the loop
                    if (this.wizard.body.velocity.x !== 0 || this.wizard.body.velocity.y !== 0) {
                        this.wizard.play('wizard-fly-loop');
                    }
                });
            }
        } else {
            const currentAnim = this.wizard.anims.currentAnim?.key;
            if (currentAnim !== 'wizard-idle-full' && currentAnim !== 'wizard-idle-loop') {
                // Play full idle animation once, then loop
                this.wizard.play('wizard-idle-full');
                this.wizard.once('animationcomplete', () => {
                    this.wizard.play('wizard-idle-loop');
                });
            }
        }

        // Element orbs are now collected by walking over them
        // No manual charging system

        // Always fire basic projectile regardless of charges
        if (!this.lastFireTime || time > this.lastFireTime + this.fireRate) {
            this.fireBasicProjectile();
            this.lastFireTime = time;
        }

        // Also fire element projectiles from active slots only
        if (this.chargeSlots && this.chargeSlots.length > 0) {
            // Only check first 4 slots (active slots)
            for (let slotIndex = 0; slotIndex < 4; slotIndex++) {
                const element = this.chargeSlots[slotIndex];
                if (element) {
                    const elementConfig = this.elementConfig[element];
                    const fireRate = (elementConfig.fireRate || 1000) / this.speedMultiplier; // Apply hyper mode multiplier

                    // Check if this charge can fire using the new cooldown system
                    // Use slot index for cooldown tracking
                    if (this.canCastSpell(element, slotIndex)) {
                        // Find the charge index in the charges array
                        let chargeIndex = 0;
                        for (let i = 0; i < slotIndex && i < this.chargeSlots.length; i++) {
                            if (this.chargeSlots[i] !== null) {
                                chargeIndex++;
                            }
                        }
                        
                        this.fireIndividualCharge(chargeIndex, element);
                        // Set the cooldown for this specific slot
                        this.setSpellCooldown(element, fireRate, slotIndex);
                    }
                }
            }
        }

        // Wave-based spawning system
        if (this.gameStarted) {
            // Check if it's time to start a new wave (every 60 seconds)
            const waveTime = (time - this.waveStartTime) / 1000; // Convert to seconds
            if (waveTime >= (60 / this.speedMultiplier)) {
                this.startNewWave();
            }

            // Get current wave definition
            const waveDef = this.getWaveDefinition(this.currentWave - 1);

            // Check for special events
            if (waveDef.specialEvent && Math.floor(waveTime) === waveDef.specialEvent.time) {
                if (!this.specialEventTriggered) {
                    this.triggerSpecialEvent(waveDef.specialEvent);
                    this.specialEventTriggered = true;
                }
            } else if (Math.floor(waveTime) !== waveDef.specialEvent?.time) {
                this.specialEventTriggered = false;
            }

            // Regular wave spawning
            const currentEnemyCount = this.enemies.children.entries.filter(e => e.active).length;
            if (currentEnemyCount < waveDef.maxEnemies && time > this.lastWaveSpawn + (waveDef.spawnInterval / this.speedMultiplier)) {
                this.spawnWaveEnemy(waveDef);
                this.lastWaveSpawn = time;
            }
        }

        // Safety check for enemies group
        if (!this.enemies || !this.enemies.children || !this.enemies.children.entries) return;

        this.enemies.children.entries.forEach(enemy => {
            if (!enemy || !enemy.active || enemy.isDying) return;

            // Check if wet status has expired (only if enemy is not dying)
            if (!enemy.isDying && enemy.wet && enemy.wetEndTime && this.time.now >= enemy.wetEndTime) {
                enemy.wet = false;
                // Clear tint if no other status effects
                if (!enemy.stunned && !enemy.burning && !enemy.poisoned && !enemy.frozen && !enemy.immunityOutline && !enemy.muddy) {
                    enemy.clearTint();
                }
            }
            
            // Check if muddy status has expired (only if enemy is not dying)
            if (!enemy.isDying && enemy.muddy && enemy.muddyEndTime && this.time.now >= enemy.muddyEndTime) {
                enemy.muddy = false;
                // Clear tint if no other status effects
                if (!enemy.stunned && !enemy.burning && !enemy.poisoned && !enemy.frozen && !enemy.immunityOutline && !enemy.wet) {
                    enemy.clearTint();
                }
            }

            // Visual feedback for knockback immunity
            if (enemy.knockbackImmune) {
                // Add a subtle white outline effect
                if (!enemy.immunityOutline) {
                    enemy.immunityOutline = true;
                    enemy.setTint(0xffffcc); // Light yellow tint
                }
            } else if (enemy.immunityOutline) {
                // Remove the immunity visual when no longer immune
                enemy.immunityOutline = false;
                if (!enemy.isDying && !enemy.stunned && !enemy.burning && !enemy.poisoned && !enemy.slowed && !enemy.frozen && !enemy.wet) {
                    enemy.clearTint();
                }
            }

            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);

            // Teleport enemy if too far from wizard (beyond 800 pixels) - but not if dying
            if (distance > 800 && !enemy.isDying) {
                // Teleport to outside viewport
                const camera = this.cameras.main;
                const viewportWidth = camera.width;
                const viewportHeight = camera.height;
                const spawnMargin = 50;

                // Calculate spawn position outside current viewport
                const side = Phaser.Math.Between(0, 3);
                switch (side) {
                    case 0: // Top
                        enemy.x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                        enemy.y = camera.scrollY - spawnMargin;
                        break;
                    case 1: // Right
                        enemy.x = camera.scrollX + viewportWidth + spawnMargin;
                        enemy.y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                        break;
                    case 2: // Bottom
                        enemy.x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                        enemy.y = camera.scrollY + viewportHeight + spawnMargin;
                        break;
                    case 3: // Left
                        enemy.x = camera.scrollX - spawnMargin;
                        enemy.y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                        break;
                }

                // No clamping - infinite world!
            }

            // Handle summoner behavior
            if (enemy.enemyType === 'summoner') {
                // Summoners move very slowly
                if (!enemy.stunned && !enemy.blinded && !enemy.frozen && !this.wizard.invisible) {
                    const moveSpeed = enemy.moveSpeed || 20;
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                    enemy.setVelocity(
                        Math.cos(angle) * moveSpeed,
                        Math.sin(angle) * moveSpeed
                    );
                } else if (this.wizard.invisible) {
                    // Stop moving when wizard is invisible
                    enemy.setVelocity(0, 0);
                }

                // Face the wizard (reversed for summoner)
                if (this.wizard.x < enemy.x) {
                    enemy.setFlipX(false); // Face left (no flip)
                } else {
                    enemy.setFlipX(true); // Face right (flip)
                }

                // Summon minions periodically
                if (!enemy.lastSummonTime) enemy.lastSummonTime = 0;
                if (time > enemy.lastSummonTime + enemy.summonCooldown && !enemy.isSummoning) {
                    this.summonMinions(enemy);
                    enemy.lastSummonTime = time;
                }
            }
            // Handle lost soul behavior
            else if (enemy.enemyType === 'soul') {
                const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);

                // Move towards wizard but stop at attack range
                if (distance > enemy.attackRange && !enemy.stunned && !enemy.blinded && !enemy.frozen && !this.wizard.invisible) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                    let speed = enemy.moveSpeed;

                    // Apply wet slow effect if active (check if enemy is not dying)
                    if (!enemy.isDying && enemy.wet && enemy.wetEndTime && this.time.now < enemy.wetEndTime) {
                        speed *= enemy.waterSlowFactor || 0.5;
                    }
                    
                    // Apply muddy slow effect if active (check if enemy is not dying)
                    if (!enemy.isDying && enemy.muddy && enemy.muddyEndTime && this.time.now < enemy.muddyEndTime) {
                        speed *= enemy.mudSlowFactor || 0.2;
                    }

                    enemy.setVelocity(
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    );
                } else {
                    enemy.setVelocity(0, 0);
                }

                // Face the wizard
                if (this.wizard.x < enemy.x) {
                    enemy.setFlipX(true); // Face left
                } else {
                    enemy.setFlipX(false); // Face right
                }

                // Attack when in range
                if (distance <= enemy.attackRange && !enemy.isAttacking) {
                    if (!enemy.lastAttackTime) enemy.lastAttackTime = 0;
                    if (time > enemy.lastAttackTime + enemy.attackCooldown) {
                        this.soulAttack(enemy);
                        enemy.lastAttackTime = time;
                    }
                }
            }
            // Handle darkeye behavior
            else if (enemy.enemyType === 'darkeye') {
                const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);

                // Move towards wizard but stop at attack range
                if (distance > enemy.attackRange && !enemy.stunned && !enemy.blinded && !enemy.frozen && !this.wizard.invisible) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                    let speed = enemy.moveSpeed;

                    // Apply slow effects
                    if (!enemy.isDying && enemy.wet && enemy.wetEndTime && this.time.now < enemy.wetEndTime) {
                        speed *= enemy.waterSlowFactor || 0.5;
                    }
                    if (!enemy.isDying && enemy.muddy && enemy.muddyEndTime && this.time.now < enemy.muddyEndTime) {
                        speed *= enemy.mudSlowFactor || 0.2;
                    }

                    enemy.setVelocity(
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    );
                } else {
                    enemy.setVelocity(0, 0);
                }

                // Face the wizard
                if (this.wizard.x < enemy.x) {
                    enemy.setFlipX(true);
                } else {
                    enemy.setFlipX(false);
                }

                // Attack when in range
                if (distance <= enemy.attackRange && !enemy.isAttacking) {
                    if (!enemy.lastAttackTime) enemy.lastAttackTime = 0;
                    if (time > enemy.lastAttackTime + enemy.attackCooldown) {
                        this.darkeyeAttack(enemy);
                        enemy.lastAttackTime = time;
                    }
                }
            }
            // Handle sorcerer behavior
            else if (enemy.enemyType === 'sorcerer') {
                const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);

                // Move towards wizard but stop at attack range
                if (distance > enemy.attackRange && !enemy.stunned && !enemy.blinded && !enemy.frozen && !this.wizard.invisible) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                    let speed = enemy.moveSpeed;

                    // Apply slow effects
                    if (!enemy.isDying && enemy.wet && enemy.wetEndTime && this.time.now < enemy.wetEndTime) {
                        speed *= enemy.waterSlowFactor || 0.5;
                    }
                    if (!enemy.isDying && enemy.muddy && enemy.muddyEndTime && this.time.now < enemy.muddyEndTime) {
                        speed *= enemy.mudSlowFactor || 0.2;
                    }

                    enemy.setVelocity(
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    );
                } else {
                    enemy.setVelocity(0, 0);
                }

                // Face the wizard
                if (this.wizard.x < enemy.x) {
                    enemy.setFlipX(true);
                } else {
                    enemy.setFlipX(false);
                }

                // Attack when in range
                if (distance <= enemy.attackRange && !enemy.isAttacking) {
                    if (!enemy.lastAttackTime) enemy.lastAttackTime = 0;
                    if (time > enemy.lastAttackTime + enemy.attackCooldown) {
                        this.sorcererAttack(enemy);
                        enemy.lastAttackTime = time;
                    }
                }
            }
            // Only update velocity if not being knocked back, not stunned, and not blinded
            else if (Math.abs(enemy.body.velocity.x) < 100 && Math.abs(enemy.body.velocity.y) < 100 && !enemy.stunned && !enemy.blinded && !enemy.frozen && !this.wizard.invisible) {
                // Get enemy speed based on type
                let moveSpeed = (enemy.moveSpeed || (enemy.enemyType === 'tree' ? 48 : 60)) * this.speedMultiplier;

                // Apply wet slow effect if active (check if enemy is not dying)
                if (!enemy.isDying && enemy.wet && enemy.wetEndTime && this.time.now < enemy.wetEndTime) {
                    moveSpeed *= enemy.waterSlowFactor || 0.5;
                }
                
                // Apply muddy slow effect if active (check if enemy is not dying)
                if (!enemy.isDying && enemy.muddy && enemy.muddyEndTime && this.time.now < enemy.muddyEndTime) {
                    moveSpeed *= enemy.mudSlowFactor || 0.2;
                }

                // Stop moving if within attack range (40 pixels)
                const stopDistance = 40;

                if (distance > stopDistance) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                    const velocityX = Math.cos(angle) * moveSpeed;
                    const velocityY = Math.sin(angle) * moveSpeed;
                    enemy.setVelocity(velocityX, velocityY);

                    // Keep walk animation playing for golems (if not dying)
                    if (enemy.enemyType === 'golem' && !enemy.isDying && enemy.anims) {
                        try {
                            if (!enemy.anims.isPlaying) {
                                enemy.play(`golem-${enemy.golemColor}-walk`);
                            }
                        } catch (e) {
                            console.warn('Failed to play golem walk animation in movement:', e);
                        }
                    }

                    // Flip enemies to face wizard
                    if (enemy.enemyType === 'golem' || enemy.enemyType === 'bat' || enemy.enemyType === 'fireworm' || enemy.enemyType === 'soul' || enemy.enemyType === 'bloboid' || enemy.enemyType === 'darkeye' || enemy.enemyType === 'mushroom' || enemy.enemyType === 'sorcerer') {
                        if (this.wizard.x < enemy.x) {
                            enemy.setFlipX(true); // Face left
                        } else {
                            enemy.setFlipX(false); // Face right
                        }
                    }
                } else {
                    // Stop when close enough
                    enemy.setVelocity(0, 0);

                    // Keep walk animation for golems even when stopped (they're always "walking" in place)
                    if (enemy.enemyType === 'golem' && !enemy.anims.isPlaying) {
                        enemy.play(`golem-${enemy.golemColor}-walk`);
                    }

                    // Flip enemies to face wizard even when stopped
                    if (enemy.enemyType === 'golem' || enemy.enemyType === 'bat' || enemy.enemyType === 'fireworm' || enemy.enemyType === 'bloboid' || enemy.enemyType === 'darkeye' || enemy.enemyType === 'mushroom') {
                        if (this.wizard.x < enemy.x) {
                            enemy.setFlipX(true); // Face left
                        } else {
                            enemy.setFlipX(false); // Face right
                        }
                    }
                }
            } else if (this.wizard.invisible && Math.abs(enemy.body.velocity.x) < 100 && Math.abs(enemy.body.velocity.y) < 100) {
                // Stop enemies when wizard is invisible
                enemy.setVelocity(0, 0);
            } else {
                // Gradually slow down knockback
                enemy.setVelocity(
                    enemy.body.velocity.x * 0.85,
                    enemy.body.velocity.y * 0.85
                );
            }
        });

        this.projectiles.children.entries.forEach(projectile => {
            // Update particle effects if present
            if (projectile.updateParticles) {
                projectile.updateParticles();
            }

            // Update boomerang behavior for arcane projectiles
            if (projectile.updateBoomerang) {
                projectile.updateBoomerang();
            }

            // Skip bounds check for bouncing projectiles (like star) and boomerangs
            if (projectile.isBouncing || projectile.isBoomerang) {
                return;
            }

            // Use world bounds instead of fixed screen coordinates
            const bounds = this.physics.world.bounds;
            if (projectile.x < bounds.x - 50 ||
                projectile.x > bounds.x + bounds.width + 50 ||
                projectile.y < bounds.y - 50 ||
                projectile.y > bounds.y + bounds.height + 50) {
                projectile.destroy();
            }
        });

        // Update spiral projectiles
        if (this.spiralProjectiles) {
            this.spiralProjectiles.forEach(projectile => {
                if (projectile.active && projectile.update) {
                    projectile.update(time, delta);
                }
            });
        }

        // Update star projectiles bouncing
        this.projectiles.children.entries.forEach(projectile => {
            if (projectile.active && projectile.isBouncing && projectile.starUpdate) {
                projectile.starUpdate();
            }
        });
        
        // Update moon spell position to smoothly follow wizard
        if (this.moonSpellComponents && this.moonSpellActive) {
            this.moonSpellComponents.moonRing.x = this.wizard.x;
            this.moonSpellComponents.moonRing.y = this.wizard.y;
            this.moonSpellComponents.innerGlow.x = this.wizard.x;
            this.moonSpellComponents.innerGlow.y = this.wizard.y;
            this.moonSpellComponents.particles.x = this.wizard.x;
            this.moonSpellComponents.particles.y = this.wizard.y;
        }
        
        // Update halo aura position and check if still in active slot
        if (this.haloAuraActive) {
            // Check if halo is still in an active charge slot (first 4 slots)
            let haloStillActive = false;
            for (let i = 0; i < 4; i++) {
                if (this.chargeSlots[i] === 'halo') {
                    haloStillActive = true;
                    break;
                }
            }
            
            if (!haloStillActive) {
                // Deactivate halo if no longer in active slots
                this.deactivateHaloAura();
            } else if (this.haloAura) {
                // Redraw the ring at wizard's position
                if (this.haloDrawRing) {
                    this.haloDrawRing(this.haloAura);
                }
                
                // Update inner glow position
                if (this.haloInnerGlow) {
                    this.haloInnerGlow.x = this.wizard.x;
                    this.haloInnerGlow.y = this.wizard.y;
                }
            }
        }
        
        // Auto-cast sun, moon, and halo spells when available
        if (!this.sunSpellActive && !this.sunSpellCooldown && this.charges) {
            // Check if wizard has sun element in charges
            const hasSunElement = this.charges.some(charge => charge === 'sun');
            if (hasSunElement) {
                this.createSunSpell();
            }
        }
        
        if (!this.moonSpellActive && !this.moonSpellCooldown && this.charges) {
            // Check if wizard has moon element in charges
            const hasMoonElement = this.charges.some(charge => charge === 'moon');
            if (hasMoonElement) {
                this.createMoonSpell();
            }
        }
        
        if (!this.haloAuraActive && this.chargeSlots) {
            // Check if wizard has halo element in active charge slots
            for (let i = 0; i < 4; i++) {
                if (this.chargeSlots[i] === 'halo') {
                    this.createHaloAura();
                    break;
                }
            }
        }

        // Update lightning orb tracking
        this.projectiles.children.entries.forEach(projectile => {
            if (projectile.active && projectile.currentTarget && projectile.texture && projectile.texture.key === 'lightning-spell') {
                // Check if current target is still valid
                if (!projectile.currentTarget.active) {
                    // Target died, find new target or destroy
                    if (projectile.bounceCount > 0) {
                        let nextTarget = null;
                        let nearestDistance = 250;

                        this.enemies.children.entries.forEach(enemy => {
                            if (enemy.active && !enemy.isDying && !projectile.hitEnemies.has(enemy)) {
                                const dist = Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y);
                                if (dist < nearestDistance) {
                                    nearestDistance = dist;
                                    nextTarget = enemy;
                                }
                            }
                        });

                        if (nextTarget) {
                            projectile.currentTarget = nextTarget;
                            this.setLightningOrbVelocity(projectile, nextTarget);
                        } else {
                            projectile.destroy();
                        }
                    } else {
                        projectile.destroy();
                    }
                } else {
                    // Adjust velocity to continue tracking target
                    this.setLightningOrbVelocity(projectile, projectile.currentTarget);
                }
            }
        });

        // Update depths based on Y position
        this.wizard.setDepth(Math.min(400, Math.max(10, Math.floor(this.wizard.y / 10)))); // Cap at 400 to stay below HUD
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
                // Ensure enemies are always visible above the floor (-10)
                // Add 1000 to ensure positive depths even at negative Y coordinates
                enemy.setDepth(Math.min(400, Math.max(1, Math.floor((enemy.y + 1000) / 10)))); // Cap at 400 to stay below HUD
                
                // Safety check: ensure enemy is visible
                if (!enemy.visible) {
                    enemy.setVisible(true);
                }
            }
        });

        // Update wizard health bar position
        this.updateWizardHealthBar();
        
        // Update player visibility indicators
        this.updatePlayerIndicators();
        
        // Update philosopher stone indicator position
        if (this.philosopherStoneActive && this.philosopherStoneIndicator && this.philosopherStoneGlow) {
            this.philosopherStoneIndicator.x = this.wizard.x;
            this.philosopherStoneIndicator.y = this.wizard.y - 40;
            this.philosopherStoneGlow.x = this.wizard.x;
            this.philosopherStoneGlow.y = this.wizard.y - 40;
        }

        // Water sprite stays at spawn position - no position update needed

        // Update active fire flame position to follow wizard
        if (this.activeFlames && this.activeFlames[0] && this.activeFlames[0].active) {
            const flame = this.activeFlames[0];
            const direction = this.wizard.lastDirection || 'down';

            // Calculate directional offsets (same logic as in fireFireProjectile)
            const directionAngles = {
                'up': -Math.PI / 2,
                'down': Math.PI / 2,
                'left': Math.PI,
                'right': 0,
                'up-left': -3 * Math.PI / 4,
                'up-right': -Math.PI / 4,
                'down-left': 3 * Math.PI / 4,
                'down-right': Math.PI / 4
            };

            const angle = directionAngles[direction];
            const scale = flame.scaleX; // Get current scale of flame
            const spriteSize = 32 * scale;
            const wizardHitboxRadius = 15;
            const spacing = 10;
            const distanceFromWizard = wizardHitboxRadius + spacing + (spriteSize * 0.5);

            // Update position
            flame.x = this.wizard.x + Math.cos(angle) * distanceFromWizard;
            flame.y = this.wizard.y + Math.sin(angle) * distanceFromWizard;

            // Update rotation to match current direction
            const defaultAngle = 3 * Math.PI / 4; // down-left
            flame.setRotation(angle - defaultAngle);
        }

        // XP gems are attracted to wizard when in close proximity
        this.jewels.children.entries.forEach(jewel => {
            const distance = Phaser.Math.Distance.Between(jewel.x, jewel.y, this.wizard.x, this.wizard.y);

            if (distance < 120) { // Doubled from 60 to 120 for stronger magnet range
                // Attract jewel to wizard
                const angle = Phaser.Math.Angle.Between(jewel.x, jewel.y, this.wizard.x, this.wizard.y);
                const speed = 400; // Doubled from 200 to 400 for faster attraction
                jewel.body.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
            } else {
                // Stop movement when out of range
                jewel.body.setVelocity(0, 0);
            }
        });

        // Attract muffins to wizard when close
        this.muffins.children.entries.forEach(muffin => {
            const distance = Phaser.Math.Distance.Between(muffin.x, muffin.y, this.wizard.x, this.wizard.y);

            if (distance < 100) {
                // Attract muffin to wizard
                const angle = Phaser.Math.Angle.Between(muffin.x, muffin.y, this.wizard.x, this.wizard.y);
                const speed = 200;
                muffin.body.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
            }
        });

        // Attract element orbs to wizard when close
        this.elementOrbs.children.entries.forEach(orb => {
            const distance = Phaser.Math.Distance.Between(orb.x, orb.y, this.wizard.x, this.wizard.y);

            if (distance < 100) {
                // Attract orb to wizard
                const angle = Phaser.Math.Angle.Between(orb.x, orb.y, this.wizard.x, this.wizard.y);
                const speed = 200;
                orb.body.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
            }
        });

        // Water orbs are no longer used - water spell creates AOE waves instead
        // Clean up any remaining water orbs
        this.waterOrbs.forEach((orb, index) => {
            if (orb.active) {
                orb.destroy();
            }
        });
        this.waterOrbs = [];

        // Active flames stay in their initial position and rotation
        // No longer follow the wizard to prevent rotation abuse

        // Update homing projectiles
        this.projectiles.children.entries.forEach(projectile => {
            if (projectile.isHoming && projectile.active) {
                let targetEnemy = null;

                // For arcane projectiles, use locked target
                if (projectile.homingTarget && projectile.homingTarget.active && !projectile.homingTarget.isDying) {
                    targetEnemy = projectile.homingTarget;
                } else {
                    // For other homing projectiles (like lightning), find closest
                    let closestDist = 999999;
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active && !enemy.isDying) {
                            const dist = Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y);
                            if (dist < closestDist) {
                                closestDist = dist;
                                targetEnemy = enemy;
                            }
                        }
                    });
                }

                if (targetEnemy) {
                    const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, targetEnemy.x, targetEnemy.y);
                    const speed = projectile.homingSpeed || 250;
                    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

                    // Rotate projectile to face target (for arcane)
                    if (projectile.texture.key === 'arcane-spell') {
                        projectile.setRotation(angle);
                    }
                }
            }
        });

        // Update enemy homing projectiles
        if (this.enemyProjectiles) {
            this.enemyProjectiles.children.entries.forEach(projectile => {
                if (projectile.isHoming && projectile.active) {
                    // Enemy projectiles always target the wizard
                    if (this.wizard && this.wizard.active) {
                        const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, this.wizard.x, this.wizard.y);
                        const speed = projectile.homingSpeed || 150;
                        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

                        // Rotate soul bullets to face wizard
                        if (projectile.texture.key === 'soul-bullet') {
                            projectile.setRotation(angle);
                        }
                    }
                }
            });
        }

        // Check fire pools for enemy damage
        this.firePools.forEach(pool => {
            if (pool.active) {
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const dist = Phaser.Math.Distance.Between(pool.x, pool.y, enemy.x, enemy.y);
                        if (dist < 25) {
                            // Deal damage over time (once per 500ms)
                            if (!enemy.lastFireDamage || time > enemy.lastFireDamage + 500) {
                                enemy.health -= 1;
                                enemy.lastFireDamage = time;
                                enemy.setTint(0xff6666);
                                this.time.delayedCall(200, () => {
                                    if (enemy.active) enemy.clearTint();
                                });

                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                }
                            }
                        }
                    }
                });
            }
        });

        // Check earth zones for enemy damage
        this.earthZones.forEach(zone => {
            if (zone.active) {
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, zone.x, zone.y);
                        if (dist < zone.radius) {
                            // Deal damage over time (once per 500ms)
                            if (!enemy.lastEarthDamage || time > enemy.lastEarthDamage + 500) {
                                enemy.health -= 2;
                                enemy.lastEarthDamage = time;
                                enemy.setTint(0x8B4513); // Brown tint
                                this.time.delayedCall(200, () => {
                                    if (enemy.active) enemy.clearTint();
                                });

                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                }
                            }
                        }
                    }
                });
            }
        });

        this.orbitingOrbs.forEach((orb, index) => {
            if (orb.active) {
                const angle = orb.startAngle + (time - orb.startTime) * 0.003;
                orb.x = this.wizard.x + Math.cos(angle) * 30;
                orb.y = this.wizard.y + Math.sin(angle) * 30;

                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active && Phaser.Geom.Intersects.CircleToCircle(
                        new Phaser.Geom.Circle(orb.x, orb.y, 6),
                        new Phaser.Geom.Circle(enemy.x, enemy.y, 10)
                    )) {
                        // Orbiting orbs deal 3 damage
                        enemy.health -= 3;
                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        } else {
                            // Flash red on hit
                            enemy.setTint(0xff0000);
                            this.time.delayedCall(100, () => {
                                if (enemy.active) enemy.clearTint();
                            });
                        }
                    }
                });

                if (time - orb.startTime > 3000) {
                    orb.destroy();
                    this.orbitingOrbs.splice(index, 1);
                }
            }
        });
    }

    castSpell() {
        const spellCombo = this.charges.join('-');

        if (spellCombo === 'water-water-lightning') {
            this.createOrbitingOrbs();
            this.discoverSpell('water-water-lightning', 'Shield of Waves');
        } else if (spellCombo === 'fire-lightning-fire') {
            this.fireExplodingProjectile();
            this.discoverSpell('fire-lightning-fire', 'Explosive Bolt');
        } else if (spellCombo === 'water-lightning-water') {
            this.fireShotgunBlast();
            this.discoverSpell('water-lightning-water', 'Storm Shotgun');
        } else if (spellCombo === 'lightning-water-earth') {
            this.fireMagnetizingOrb();
            this.discoverSpell('lightning-water-earth', 'Magnetic Vortex');
        } else {
            this.fireProjectile();
        }
    }

    discoverSpell(combo, name) {
        if (!this.discoveredSpells.find(spell => spell.combo === combo)) {
            this.discoveredSpells.push({ combo, name });
            this.updateSpellbookText();
        }
    }

    updateSpellbookText() {
        // Clear previous cards
        if (this.elementCards) {
            this.elementCards.forEach(card => card.destroy());
        }
        this.elementCards = [];
        
        // Define all fusion combinations
        const fusionRecipes = {
            // Basic fusions
            'lava': { elements: ['fire', 'earth'], description: 'Molten projectiles that create burning pools' },
            'steam': { elements: ['water', 'fire'], description: 'Explosive bursts that push enemies back' },
            'mud': { elements: ['water', 'earth'], description: 'Slows enemies significantly' },
            'dust': { elements: ['earth', 'air'], description: 'Blinds and slows enemies in large area' },
            'ice': { elements: ['water', 'air'], description: 'Freezes enemies solid' },
            'poison': { elements: ['water', 'dark'], description: 'Drops poison mines for continuous damage' },
            'storm': { elements: ['lightning', 'air'], description: 'Chain lightning between enemies' },
            'smoke': { elements: ['fire', 'air'], description: 'Creates obscuring smoke clouds' },
            
            // Advanced fusions
            'volcano': { elements: ['lava', 'fire'], description: 'Erupts projectiles in all directions' },
            'crystal': { elements: ['earth', 'ice'], description: 'Sharp crystals that pierce enemies' },
            'sand': { elements: ['earth', 'dust'], description: 'Sandstorm that damages over time' },
            'wave': { elements: ['water', 'water'], description: 'Massive water wave attack' },
            'meteor': { elements: ['rock', 'fire'], description: 'Calls down meteors from sky' },
            'gravity': { elements: ['earth', 'arcane'], description: 'Pulls enemies together' },
            'nature': { elements: ['earth', 'life'], description: 'Summons vines to entangle foes' },
            
            // Ultimate fusions
            'time': { elements: ['arcane', 'arcane'], description: 'Slows time in an area' },
            'death': { elements: ['dark', 'dark'], description: 'Instant kill on weak enemies' },
            'star': { elements: ['fire', 'holy'], description: 'Bouncing star projectiles' },
            'sun': { elements: ['star', 'fire'], description: 'Radiant damage aura' },
            'moon': { elements: ['star', 'water'], description: 'Protective lunar shield' },
            'life': { elements: ['holy', 'nature'], description: 'Heals and damages simultaneously' }
        };

        let yOffset = -180;
        const cardWidth = 640; // Doubled from 320
        const cardHeight = 160; // Doubled from 80
        const spacing = 20; // Doubled from 10
        
        // Create header card
        // Check if container exists
        if (!this.elementCardsContainer) {
            console.error('elementCardsContainer does not exist!');
            return;
        }
        
        
        const headerCard = this.add.container(0, yOffset);
        const headerBg = this.add.rectangle(0, 0, 650, 80, 0x3a3a3a, 1.0); // Lighter color, full opacity
        headerBg.setStrokeStyle(3, 0x666666);
        
        const sortedElements = Array.from(this.discoveredElements).sort();
        const headerText = this.add.text(0, 0, `Discovered Elements: ${sortedElements.length}/${Object.keys(this.elementConfig).length}`, {
            fontSize: '32px', // Increased from 20px
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        headerCard.add([headerBg, headerText]);
        this.elementCardsContainer.add(headerCard);
        this.elementCards.push(headerCard);
        
        yOffset += 100; // Increased spacing after header
        
        // Create fusion recipe cards in single column (since they're bigger now)
        Object.entries(fusionRecipes).forEach(([result, recipe]) => {
            const card = this.createFusionCard(0, yOffset, result, recipe, fusionRecipes);
            this.elementCardsContainer.add(card);
            this.elementCards.push(card);
            yOffset += cardHeight + spacing;
        });
        
        // Calculate scrollable area
        const totalHeight = yOffset + 180 + 100; // Add buffer
        const visibleHeight = 360;
        this.spellMaxScrollY = Math.max(0, totalHeight - visibleHeight);
        
        // Reset scroll position
        this.spellScrollY = 0;
        this.elementCardsContainer.y = 0;
    }
    
    createFusionCard(x, y, resultElement, recipe, allRecipes) {
        const card = this.add.container(x, y);
        
        // Card background
        const showAllRecipes = localStorage.getItem('showAllRecipes') === 'true';
        const isDiscovered = showAllRecipes || this.discoveredElements.has(resultElement);
        const hasIngredients = showAllRecipes || recipe.elements.every(e => this.discoveredElements.has(e));
        
        let bgColor = 0x2a2a2a; // Lighter base color
        if (isDiscovered) {
            bgColor = 0x2a4a2a; // Green tint for discovered
        } else if (hasIngredients) {
            bgColor = 0x4a4a2a; // Yellow tint for available to fuse
        }
        
        const bg = this.add.rectangle(0, 0, 620, 150, bgColor, 1.0); // Full opacity
        bg.setStrokeStyle(4, isDiscovered ? 0x44ff44 : (hasIngredients ? 0xffff44 : 0x666666));
        
        // Add background FIRST so other elements render on top
        card.add(bg);
        
        // Element icons and formula
        const element1Config = this.elementConfig[recipe.elements[0]];
        const element2Config = this.elementConfig[recipe.elements[1]];
        const resultConfig = this.elementConfig[resultElement];
        
        // Create element sprites (all positions and sizes doubled)
        if (element1Config && (showAllRecipes || this.discoveredElements.has(recipe.elements[0]))) {
            const elem1Sprite = this.add.sprite(-240, -30, element1Config.sheet, element1Config.frame);
            elem1Sprite.setScale(0.16); // Doubled from 0.08
            elem1Sprite.setAlpha(1.0); // Ensure full visibility
            card.add(elem1Sprite);
        } else {
            const unknownText1 = this.add.text(-240, -30, '?', {
                fontSize: '48px', // Doubled from 24px
                color: '#999999', // Brighter gray
                fontStyle: 'bold'
            }).setOrigin(0.5);
            card.add(unknownText1);
        }
        
        // Plus sign
        const plusText = this.add.text(-160, -30, '+', {
            fontSize: '40px', // Doubled from 20px
            color: '#ffffff'
        }).setOrigin(0.5);
        card.add(plusText);
        
        if (element2Config && (showAllRecipes || this.discoveredElements.has(recipe.elements[1]))) {
            const elem2Sprite = this.add.sprite(-80, -30, element2Config.sheet, element2Config.frame);
            elem2Sprite.setScale(0.16); // Doubled from 0.08
            elem2Sprite.setAlpha(1.0); // Ensure full visibility
            card.add(elem2Sprite);
        } else {
            const unknownText2 = this.add.text(-80, -30, '?', {
                fontSize: '48px', // Doubled from 24px
                color: '#999999', // Brighter gray
                fontStyle: 'bold'
            }).setOrigin(0.5);
            card.add(unknownText2);
        }
        
        // Equals sign
        const equalsText = this.add.text(0, -30, '=', {
            fontSize: '40px', // Doubled from 20px
            color: '#ffffff'
        }).setOrigin(0.5);
        card.add(equalsText);
        
        // Result element
        if (resultConfig && isDiscovered) {
            const resultSprite = this.add.sprite(80, -30, resultConfig.sheet, resultConfig.frame);
            resultSprite.setScale(0.16); // Doubled from 0.08
            resultSprite.setAlpha(1.0); // Ensure full visibility
            card.add(resultSprite);
            
            const nameText = this.add.text(160, -30, resultConfig.name, {
                fontSize: '32px', // Doubled from 16px
                color: '#44ff44',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);
            card.add(nameText);
        } else {
            const unknownResult = this.add.text(80, -30, '???', {
                fontSize: '40px', // Doubled from 20px
                color: hasIngredients ? '#ffff44' : '#999999', // Brighter gray
                fontStyle: 'bold'
            }).setOrigin(0.5);
            card.add(unknownResult);
        }
        
        // Description
        const descText = isDiscovered ? recipe.description : 
                         (hasIngredients ? 'Ready to fuse!' : 'Need ingredients');
        const description = this.add.text(0, 40, descText, {
            fontSize: '24px', // Doubled from 12px
            color: isDiscovered ? '#cccccc' : (hasIngredients ? '#ffff44' : '#999999'), // Brighter colors
            align: 'center',
            wordWrap: { width: 580 } // Doubled from 290
        }).setOrigin(0.5);
        
        // Add the description to the card
        card.add(description);
        
        return card;
    }


    createPauseMenu() {
        this.pauseMenu = this.add.container(400, 300);
        this.pauseMenu.setDepth(900); // High depth to render above everything

        // Set the container size but don't make the container itself interactive
        this.pauseMenu.setSize(700, 500);

        // Controller support variables
        this.pauseMenuCursorIndex = 0;
        this.pauseMenuSelectedCharge = -1;
        this.pauseMenuCursor = null;
        this.linkMode = false; // Track if we're in link mode
        this.linkCursorIndex = 0; // Which link we're hovering over in link mode

        // Background - make it interactive to block clicks to game underneath
        const bg = this.add.rectangle(0, 0, 700, 500, 0x000000, 0.9);
        bg.setStrokeStyle(3, 0xffffff);
        bg.setInteractive(); // This blocks clicks from going through
        this.pauseMenu.add(bg);

        // Title
        const title = this.add.text(0, -220, 'ELEMENT MANAGEMENT', {
            fontSize: '24px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.pauseMenu.add(title);

        // Compact instructions
        const instructions = this.add.text(0, -195, 'Drag to rearrange • X to discard • Click between to link/unlink', {
            fontSize: '12px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.pauseMenu.add(instructions);
        
        // Active/Passive labels
        const activeLabel = this.add.text(-250, -100, 'ACTIVE', {
            fontSize: '14px',
            color: '#44ff44',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.pauseMenu.add(activeLabel);
        
        const passiveLabel = this.add.text(-250, -20, 'PASSIVE', {
            fontSize: '14px',
            color: '#aaaaaa',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.pauseMenu.add(passiveLabel);
        
        const pouchLabel = this.add.text(-250, 60, 'POUCH', {
            fontSize: '14px',
            color: '#88cc88',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.pauseMenu.add(pouchLabel);

        // Charge slot visuals
        this.pauseChargeSlots = [];
        this.linkButtons = [];
        this.draggedCharge = null;

        const slotStartX = -150;
        const slotSpacing = 100;
        const slotY = 0;
        const slotRowY1 = -100;  // First row Y position (active)
        const slotRowY2 = -20;   // Second row Y position (passive)
        const slotRowY3 = 60;    // Third row Y position (pouch)
        
        // Initialize pouch if not exists
        if (!this.elementPouch) {
            const savedPouch = localStorage.getItem('elementPouch');
            this.elementPouch = savedPouch ? JSON.parse(savedPouch) : [null, null, null, null];
        }

        // Create slots for charges (8) and pouch (4)
        for (let i = 0; i < 12; i++) {
            // Slot background - arrange in 3 rows of 4
            const row = Math.floor(i / 4);
            const col = i % 4;
            const slotX = slotStartX + col * slotSpacing;
            const slotY_pos = row === 0 ? slotRowY1 : (row === 1 ? slotRowY2 : slotRowY3);
            // Different colors for active, passive, and pouch slots
            const isActiveSlot = row === 0;
            const isPouchSlot = row === 2;
            const slotColor = isPouchSlot ? 0x2a4a2a : (isActiveSlot ? 0x444444 : 0x2a2a2a);
            const strokeColor = isPouchSlot ? 0x4a6a4a : (isActiveSlot ? 0xffffff : 0x666666);
            const slotBg = this.add.rectangle(slotX, slotY_pos, 80, 80, slotColor);
            slotBg.setStrokeStyle(2, strokeColor);
            slotBg.setData('slotIndex', i);
            slotBg.setData('isActiveSlot', isActiveSlot);
            slotBg.setData('isPouchSlot', isPouchSlot);
            slotBg.setInteractive({ dropZone: true });
            this.pauseMenu.add(slotBg);
            
            // Debug mouse events
            slotBg.on('pointerover', () => {
                console.log(`Mouse over slot ${i} at x=${slotX}`);
                slotBg.setStrokeStyle(3, 0xffff00);
            });
            slotBg.on('pointerout', () => {
                slotBg.setStrokeStyle(2, strokeColor);
            });

            // Charge indicator using image (make it draggable) - default to first sheet
            const chargeSprite = this.add.image(slotX, slotY_pos, 'element-symbols', 0);
            chargeSprite.setVisible(false);
            chargeSprite.setScale(0.15); // Match main UI scale
            chargeSprite.setTint(0xffffff); // Ensure no tint
            chargeSprite.setAlpha(1); // Ensure full opacity
            this.pauseMenu.add(chargeSprite);
            chargeSprite.setInteractive({
                draggable: true,
                hitArea: new Phaser.Geom.Rectangle(-16, -16, 32, 32),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
            });
            chargeSprite.setData('slotIndex', i);
            chargeSprite.setData('originalX', slotX);
            chargeSprite.setData('originalY', slotY_pos);

            // No slot number text - removed to save space

            // Discard button
            const discardBtn = this.add.text(slotX + 35, slotY_pos - 35, 'X', {
                fontSize: '16px',
                color: '#ff4444',
                backgroundColor: '#333333',
                padding: { x: 4, y: 2 }
            }).setOrigin(0.5);
            discardBtn.setInteractive({ useHandCursor: true });
            discardBtn.setVisible(false);
            discardBtn.setData('slotIndex', i);
            this.pauseMenu.add(discardBtn);

            // Need to capture i in closure
            const slotIndex = i;
            // Event handlers will be set up in togglePause when menu is shown

            // Tier text in corner of slot
            const tierText = this.add.text(slotX + 25, slotY_pos - 25, '', {
                fontSize: '10px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 1
            });
            tierText.setOrigin(0.5);
            tierText.setVisible(false);
            this.pauseMenu.add(tierText);

            this.pauseChargeSlots.push({
                bg: slotBg,
                circle: chargeSprite, // Keeping the name for compatibility
                text: null, // No slot number text anymore
                discardBtn: discardBtn,
                tierText: tierText,
                x: slotX,
                y: slotY_pos
            });

            // Link button (between slots) - only for charge slots in the same row, not pouch
            if (i < 7 && (i % 4) < 3 && !isPouchSlot) {
                const linkX = slotX + slotSpacing / 2;
                const linkY = slotY_pos;
                const linkBtn = this.add.rectangle(linkX, linkY, 30, 20, 0x555555);
                linkBtn.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle(-15, -10, 30, 20),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains
                });
                linkBtn.setStrokeStyle(1, 0xaaaaaa);
                this.pauseMenu.add(linkBtn);

                const linkText = this.add.text(linkX, linkY, '-', {
                    fontSize: '16px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                this.pauseMenu.add(linkText);

                // Event handlers will be set up in togglePause when menu is shown

                this.linkButtons.push({ btn: linkBtn, text: linkText, linked: false });
            }
        }

        // Current combo display (moved down due to pouch row)
        this.comboDisplay = this.add.text(0, 140, '', {
            fontSize: '16px',
            color: '#44ff44',
            align: 'center'
        }).setOrigin(0.5);
        this.pauseMenu.add(this.comboDisplay);

        // Element description area (moved down)
        this.elementDescriptionBg = this.add.rectangle(0, 200, 600, 80, 0x222222, 0.8);
        this.elementDescriptionBg.setStrokeStyle(2, 0x666666);
        this.pauseMenu.add(this.elementDescriptionBg);

        this.elementDescriptionTitle = this.add.text(0, 170, '', {
            fontSize: '18px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.pauseMenu.add(this.elementDescriptionTitle);

        this.elementDescriptionText = this.add.text(0, 200, '', {
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);
        this.pauseMenu.add(this.elementDescriptionText);

        // Close instruction
        const closeText = this.add.text(0, 250, 'Press P or Start to resume', {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.pauseMenu.add(closeText);

        // Controller instructions (smaller and at bottom)
        const controllerText = this.add.text(0, 190, 'Controller: D-pad to navigate • A to select • Y for link mode', {
            fontSize: '12px',
            color: '#888888'
        }).setOrigin(0.5);
        this.pauseMenu.add(controllerText);

        // All elements have already been added to the pause menu container individually

        this.pauseMenu.setVisible(false);
        this.pauseMenu.setDepth(500);
        this.pauseMenu.setScrollFactor(0);

        // Set up drag events - we need to remove old listeners first to avoid duplicates
        this.input.off('dragstart');
        this.input.off('drag');
        this.input.off('dragend');

        this.input.on('dragstart', (pointer, gameObject) => {
            // Check if this is one of our charge circles
            if (gameObject.getData('slotIndex') !== undefined && this.pauseChargeSlots.some(slot => slot.circle === gameObject)) {
                this.draggedCharge = gameObject;
                // Don't set depth on sprites in containers - they inherit container depth
                gameObject.setAlpha(0.8);
                // Store the initial position relative to the container
                gameObject.setData('dragStartX', gameObject.x);
                gameObject.setData('dragStartY', gameObject.y);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.draggedCharge === gameObject && this.pauseMenu.visible) {
                // The drag position is in world coordinates, we need to convert to container-local coordinates
                gameObject.x = dragX - this.pauseMenu.x;
                gameObject.y = dragY - this.pauseMenu.y;
            }
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (this.draggedCharge === gameObject && this.pauseMenu.visible) {
                // Find which slot we're over
                let targetSlot = null;
                let targetIndex = -1;

                // Current position relative to container
                const currentX = gameObject.x;
                const currentY = gameObject.y;

                this.pauseChargeSlots.forEach((slot, index) => {
                    if (index < 12) { // Check all 12 slots (8 charge + 4 pouch)
                        const dist = Phaser.Math.Distance.Between(
                            currentX,
                            currentY,
                            slot.x,
                            slot.y
                        );
                        if (dist < 40) {
                            targetSlot = slot;
                            targetIndex = index;
                        }
                    }
                });

                const sourceIndex = gameObject.getData('slotIndex');

                if (targetSlot && targetIndex !== -1 && targetIndex !== sourceIndex) {
                    // Swap charges
                    this.swapCharges(sourceIndex, targetIndex);
                } else {
                    // Return to original position
                    gameObject.x = gameObject.getData('originalX');
                    gameObject.y = gameObject.getData('originalY');
                }

                gameObject.setAlpha(1);
                gameObject.setDepth(100);
                this.draggedCharge = null;

                // Update display
                this.updatePauseMenuDisplay();
            }
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseMenu.setVisible(this.isPaused);

        if (this.isPaused) {
            console.log('Pause menu opened');
            // Update pause menu display FIRST
            this.updatePauseMenuDisplay();
            // Pause physics and all timers
            this.physics.pause();
            this.time.timeScale = 0;

            // Initialize controller cursor
            this.pauseMenuCursorIndex = 0;
            this.pauseMenuSelectedCharge = -1;

            // Initialize button states
            this.prevPauseLeftPressed = false;
            this.prevPauseRightPressed = false;
            this.prevPauseAPressed = false;
            this.prevPauseBPressed = false;
            this.prevPauseYPressed = false;
            this.linkMode = false;
            this.linkCursorIndex = 0;

            // Create cursor indicator for controller
            if (!this.pauseMenuCursor) {
                this.pauseMenuCursor = this.add.rectangle(0, 0, 85, 85, 0x00ff00, 0);
                this.pauseMenuCursor.setStrokeStyle(3, 0x00ff00, 1);
                this.pauseMenuCursor.setDepth(350); // Increased from 250 to ensure it's above menu
                this.pauseMenuCursor.setScrollFactor(0);
            }
            this.pauseMenuCursor.setVisible(true);
            this.updatePauseMenuCursor();

            // SOLUTION: Move elements out of container temporarily to ensure they work
            // Store original parents
            this.tempInteractiveElements = [];

            // Move charge circles out of container and make them interactive at world level
            this.pauseChargeSlots.forEach((slot, index) => {
                if (index < 12) {  // Create hit zones for all 12 slots (8 charge + 4 pouch)
                    // Calculate world position
                    const worldX = this.pauseMenu.x + slot.circle.x;
                    const worldY = this.pauseMenu.y + slot.circle.y;

                    // Create a temporary interactive zone at world coordinates
                    const hitZone = this.add.circle(worldX, worldY, 30, 0x00ff00, 0.01); // Very slight alpha so it's almost invisible
                    hitZone.setDepth(901); // Above pause menu for interaction
                    hitZone.setScrollFactor(0);

                    // IMPORTANT: Set interactive after creating, with draggable only if slot has an element
                    let hasElement = false;
                    if (index < 8) {
                        hasElement = slot.circle.visible && this.chargeSlots && this.chargeSlots[index];
                    } else {
                        hasElement = slot.circle.visible && this.elementPouch && this.elementPouch[index - 8];
                    }
                    hitZone.setInteractive({
                        draggable: hasElement,
                        useHandCursor: hasElement
                    });

                    hitZone.setData('slotIndex', index);
                    hitZone.setData('originalX', worldX);
                    hitZone.setData('originalY', worldY);
                    hitZone.setData('isBeingDragged', false);
                    
                    // Store the actual source slot that contains this element
                    if (hasElement) {
                        hitZone.setData('sourceSlotIndex', index);
                        const element = index < 8 ? this.chargeSlots[index] : this.elementPouch[index - 8];
                        console.log(`HitZone for slot ${index} has element: ${element}`);
                    }

                    // Store reference for visual updates
                    hitZone.visualCircle = slot.circle;

                    // Pointer events with proper state tracking
                    hitZone.on('pointerover', () => {
                        if (!hitZone.getData('isBeingDragged')) {
                            console.log(`Hovering charge ${index}`);
                            // Removed scale effect
                            hitZone.setStrokeStyle(2, 0x00ff00, 1);
                            
                            // Show element description
                            let element = null;
                            if (index < 8 && this.chargeSlots && this.chargeSlots[index]) {
                                element = this.chargeSlots[index];
                            } else if (index >= 8 && this.elementPouch && this.elementPouch[index - 8]) {
                                element = this.elementPouch[index - 8];
                            }
                            
                            if (element) {
                                const config = this.elementConfig[element];
                                const isPassiveSlot = index >= 4 && index < 8;
                                const isPouchSlot = index >= 8;
                                
                                if (config) {
                                    const activeDesc = this.elementDescriptions[element];
                                    const passiveDesc = this.getPassiveDescription(element);
                                    
                                    let slotType = isPouchSlot ? ' (Pouch)' : (isPassiveSlot ? ' (Passive)' : ' (Active)');
                                    this.elementDescriptionTitle.setText(config.name + slotType);
                                    this.elementDescriptionText.setText(isPouchSlot ? activeDesc : (isPassiveSlot ? passiveDesc : activeDesc));
                                    this.elementDescriptionTitle.setVisible(true);
                                    this.elementDescriptionText.setVisible(true);
                                    this.elementDescriptionBg.setVisible(true);
                                }
                            }
                        }
                    });

                    hitZone.on('pointerout', () => {
                        if (!hitZone.getData('isBeingDragged')) {
                            // Removed scale reset
                            hitZone.setStrokeStyle(0);
                            
                            // Hide element description
                            this.elementDescriptionTitle.setText('');
                            this.elementDescriptionText.setText('');
                        }
                    });

                    // Click handling (for testing)
                    hitZone.on('pointerdown', (pointer) => {
                        console.log(`Charge ${index} clicked at ${pointer.x}, ${pointer.y}`);
                        // Visual feedback - flash the stroke
                        hitZone.setStrokeStyle(4, 0x00ff00, 1);
                        // Removed scale effect
                        this.time.delayedCall(200, () => {
                            if (hitZone.active) {
                                hitZone.setStrokeStyle(0);
                                // Removed scale reset
                            }
                        });
                    });

                    // Drag handling
                    hitZone.on('dragstart', (pointer) => {
                        console.log(`Started dragging charge ${index}`);
                        hitZone.setData('isBeingDragged', true);
                        this.draggedChargeIndex = index;
                        slot.circle.setAlpha(0.5);
                        // Removed scale effect
                        hitZone.setStrokeStyle(3, 0xffff00, 1);
                    });

                    hitZone.on('drag', (pointer, dragX, dragY) => {
                        hitZone.x = dragX;
                        hitZone.y = dragY;
                        // Move the visual charge circle too
                        slot.circle.x = dragX - this.pauseMenu.x;
                        slot.circle.y = dragY - this.pauseMenu.y;
                    });

                    hitZone.on('dragend', (pointer) => {
                        const sourceSlotIndex = hitZone.getData('sourceSlotIndex') || index;
                        console.log(`Stopped dragging charge from slot ${sourceSlotIndex}`);
                        hitZone.setData('isBeingDragged', false);

                        // Find which slot we're over (check all 12 slots)
                        let targetIndex = -1;
                        this.pauseChargeSlots.forEach((targetSlot, idx) => {
                            if (idx < 12) {  // Allow dropping in any of the 12 slots
                                const targetWorldX = this.pauseMenu.x + targetSlot.x;
                                const targetWorldY = this.pauseMenu.y + targetSlot.y;
                                const dist = Phaser.Math.Distance.Between(hitZone.x, hitZone.y, targetWorldX, targetWorldY);
                                if (dist < 40) {
                                    targetIndex = idx;
                                }
                            }
                        });

                        if (targetIndex !== -1 && targetIndex !== sourceSlotIndex) {
                            console.log(`Moving charge from slot ${sourceSlotIndex} to slot ${targetIndex}`);
                            
                            // Store the element being moved before the swap
                            const elementBeingMoved = sourceSlotIndex < 8 ? this.chargeSlots[sourceSlotIndex] : this.elementPouch[sourceSlotIndex - 8];
                            console.log(`Moving element: ${elementBeingMoved}`);
                            
                            // Perform the move based on slot types
                            if (sourceSlotIndex < 8 && targetIndex < 8) {
                                // Both are charge slots
                                this.swapCharges(sourceSlotIndex, targetIndex);
                            } else {
                                // One or both are pouch slots - use new swap function
                                this.swapBetweenChargeAndPouch(sourceSlotIndex, targetIndex);
                            }
                            
                            // Don't destroy hit zones here - swapCharges will call refreshPauseMenuInteractiveElements
                            return; // Exit early to prevent position reset
                        } else {
                            // Return to original position
                            hitZone.x = hitZone.getData('originalX');
                            hitZone.y = hitZone.getData('originalY');
                            slot.circle.x = slot.x;
                            slot.circle.y = slot.y;
                        }

                        slot.circle.setAlpha(1);
                        // Removed scale reset
                        hitZone.setStrokeStyle(0);
                        this.draggedChargeIndex = null;
                    });

                    this.tempInteractiveElements.push(hitZone);

                    // Discard button
                    if (slot.discardBtn.visible) {
                        const discardX = this.pauseMenu.x + slot.discardBtn.x;
                        const discardY = this.pauseMenu.y + slot.discardBtn.y;

                        const discardHitZone = this.add.rectangle(discardX, discardY, 30, 20, 0xff0000, 0.01);
                        discardHitZone.setDepth(300);
                        discardHitZone.setScrollFactor(0);
                        discardHitZone.setInteractive({ useHandCursor: true });

                        const slotIndex = index;
                        discardHitZone.on('pointerdown', () => {
                            console.log(`Discard ${slotIndex} clicked!`);
                            this.discardCharge(slotIndex);
                        });

                        discardHitZone.on('pointerover', () => {
                            discardHitZone.setStrokeStyle(2, 0xff0000, 1);
                            slot.discardBtn.setColor('#ff6666');
                            // Removed scale effect
                        });

                        discardHitZone.on('pointerout', () => {
                            discardHitZone.setStrokeStyle(0);
                            slot.discardBtn.setColor('#ff4444');
                            // Removed scale reset
                        });

                        this.tempInteractiveElements.push(discardHitZone);
                    }
                }
            });

            // Link buttons
            this.linkButtons.forEach((link, index) => {
                if (link.btn.visible) {
                    const linkX = this.pauseMenu.x + link.btn.x;
                    const linkY = this.pauseMenu.y + link.btn.y;

                    const linkHitZone = this.add.rectangle(linkX, linkY, 30, 20, 0x00ff00, 0.01);
                    linkHitZone.setDepth(300);
                    linkHitZone.setScrollFactor(0);
                    linkHitZone.setInteractive({ useHandCursor: true });

                    const linkIndex = index;
                    linkHitZone.on('pointerdown', () => {
                        console.log(`Link ${linkIndex} clicked!`);
                        this.toggleLink(linkIndex);
                    });

                    linkHitZone.on('pointerover', () => {
                        linkHitZone.setStrokeStyle(2, 0x00ff00, 1);
                        // Removed scale effect
                        if (link.linked) {
                            link.btn.setFillStyle(0x66ff66);
                        } else {
                            link.btn.setFillStyle(0x777777);
                        }
                    });

                    linkHitZone.on('pointerout', () => {
                        linkHitZone.setStrokeStyle(0);
                        // Removed scale reset
                        if (link.linked) {
                            link.btn.setFillStyle(0x44ff44);
                        } else {
                            link.btn.setFillStyle(0x555555);
                        }
                    });

                    this.tempInteractiveElements.push(linkHitZone);
                }
            });

        } else {
            console.log('Pause menu closed');

            // Hide controller cursor
            if (this.pauseMenuCursor) {
                this.pauseMenuCursor.setVisible(false);
            }

            // Clean up temporary interactive elements
            if (this.tempInteractiveElements) {
                this.tempInteractiveElements.forEach(element => element.destroy());
                this.tempInteractiveElements = [];
            }

            // Resume physics and timers
            this.physics.resume();
            this.time.timeScale = 1;
            // Update charge groups based on links and update passive bonuses
            this.updateChargeGroups();
        }
    }


    toggleLink(index) {
        if (index >= 0 && index < this.linkButtons.length) {
            // Check if we have charges in both slots being linked
            const hasLeftCharge = this.chargeSlots && this.chargeSlots[index] !== null;
            const hasRightCharge = this.chargeSlots && this.chargeSlots[index + 1] !== null;

            // Count currently linked buttons
            const currentLinkedCount = this.linkButtons.filter(l => l.linked).length;

            // Only allow linking if both slots have charges AND we have earned enough links
            if (!hasLeftCharge || !hasRightCharge) {
                // Flash the button red to indicate it can't be linked
                this.linkButtons[index].btn.setFillStyle(0xff4444);
                this.time.delayedCall(200, () => {
                    this.linkButtons[index].btn.setFillStyle(0x555555);
                });
                return;
            }

            // Check if trying to add a new link but haven't earned enough
            if (!this.linkButtons[index].linked && currentLinkedCount >= this.earnedLinks) {
                // Flash the button red to indicate not enough links earned
                this.linkButtons[index].btn.setFillStyle(0xff4444);
                this.time.delayedCall(200, () => {
                    this.linkButtons[index].btn.setFillStyle(0x555555);
                });
                return;
            }

            // Toggle the link state
            this.linkButtons[index].linked = !this.linkButtons[index].linked;
            this.linkButtons[index].text.setText(this.linkButtons[index].linked ? '=' : '-');
            this.linkButtons[index].btn.setFillStyle(this.linkButtons[index].linked ? 0x44ff44 : 0x555555);

            // Update the button to show it's now clickable to unlink
            if (this.linkButtons[index].linked) {
                this.linkButtons[index].btn.setStrokeStyle(2, 0x44ff44);
            } else {
                this.linkButtons[index].btn.setStrokeStyle(1, 0xaaaaaa);
            }

            this.updatePauseMenuDisplay();
        }
    }

    updatePauseMenuDisplay() {
        // Initialize chargeSlots if needed (shouldn't happen at this point)
        if (!this.chargeSlots) {
            this.chargeSlots = new Array(8).fill(null);
            // Sync from charges array if it exists
            for (let i = 0; i < this.charges.length && i < 8; i++) {
                this.chargeSlots[i] = this.charges[i];
            }
        }
        
        console.log('UpdatePauseMenuDisplay - chargeSlots:', [...this.chargeSlots]);
        console.log('UpdatePauseMenuDisplay - charges array:', this.charges);
        
        // Update charge slot displays - show all 8 charge slots + 4 pouch slots
        for (let i = 0; i < 12; i++) {
            let element;
            if (i < 8) {
                // Charge slots
                element = this.chargeSlots ? this.chargeSlots[i] : (i < this.charges.length ? this.charges[i] : null);
            } else {
                // Pouch slots (i - 8 gives us index 0-3)
                element = this.elementPouch ? this.elementPouch[i - 8] : null;
            }
            
            if (i < 4) { // Only log first 4 to reduce noise
                console.log(`Pause menu slot ${i}: element=${element}`);
            }
            
            if (element) {
                const config = this.elementConfig[element];
                if (config) {
                    // Check if texture exists
                    if (!this.textures.exists(config.sheet)) {
                        console.error(`Pause menu: Texture ${config.sheet} does not exist!`);
                        this.pauseChargeSlots[i].circle.setVisible(false);
                        return;
                    }
                    // Update texture if needed
                    if (this.pauseChargeSlots[i].circle.texture.key !== config.sheet) {
                        this.pauseChargeSlots[i].circle.setTexture(config.sheet, config.frame);
                    } else {
                        this.pauseChargeSlots[i].circle.setFrame(config.frame);
                    }
                    this.pauseChargeSlots[i].circle.setVisible(true);
                    this.pauseChargeSlots[i].circle.setTint(0xffffff);
                    this.pauseChargeSlots[i].circle.setAlpha(1);
                    this.pauseChargeSlots[i].discardBtn.setVisible(true);
                    
                    // Debug logging
                    console.log(`Pause Slot ${i}: element=${element}, frame=${config.frame}, sheet=${config.sheet}, visible=${this.pauseChargeSlots[i].circle.visible}`);

                    // Update slot index data for dragging
                    this.pauseChargeSlots[i].circle.setData('slotIndex', i);

                    // Reset position in case it was dragged
                    this.pauseChargeSlots[i].circle.x = this.pauseChargeSlots[i].x;
                    this.pauseChargeSlots[i].circle.y = this.pauseChargeSlots[i].y;
                    
                    // Update tier text
                    const tier = this.elementTiers.get(`${element}_${i}`) || 1;
                    if (tier > 1) {
                        this.pauseChargeSlots[i].tierText.setText(tier.toString());
                        this.pauseChargeSlots[i].tierText.setVisible(true);
                    } else {
                        this.pauseChargeSlots[i].tierText.setVisible(false);
                    }
                }
            } else {
                this.pauseChargeSlots[i].circle.setVisible(false);
                this.pauseChargeSlots[i].discardBtn.setVisible(false);
                this.pauseChargeSlots[i].tierText.setVisible(false);
            }

            // In pause menu, always show all 8 slots (4 active + 4 passive)
            const isVisible = true;
            this.pauseChargeSlots[i].bg.setVisible(isVisible);
            // Only update text visibility if text exists (we removed slot labels)
            if (this.pauseChargeSlots[i].text) {
                this.pauseChargeSlots[i].text.setVisible(isVisible);
            }

            // Update link button visibility and state
            if (i < this.linkButtons.length && this.linkButtons[i]) {
                const hasCurrentCharge = this.chargeSlots[i] !== null && this.chargeSlots[i] !== undefined;
                const hasNextCharge = this.chargeSlots[i + 1] !== null && this.chargeSlots[i + 1] !== undefined;
                // Only show links if they are already linked (earned from chests)
                // In pause menu, allow links between any adjacent slots (not just first 4)
                const shouldShowLink = this.linkButtons[i].linked && isVisible && i < 7 && hasCurrentCharge && hasNextCharge;
                this.linkButtons[i].btn.setVisible(shouldShowLink);
                this.linkButtons[i].text.setVisible(shouldShowLink);

                // Update link button appearance
                if (this.linkButtons[i].linked) {
                    this.linkButtons[i].btn.setFillStyle(0x44ff44);
                    this.linkButtons[i].text.setText('=');
                } else {
                    this.linkButtons[i].btn.setFillStyle(0x555555);
                    this.linkButtons[i].text.setText('-');
                }
            }
        }

        // Display current combos
        const groups = this.getChargeGroupsPreview();
        let comboText = 'Active Combos:\n';
        groups.forEach((group, index) => {
            if (group.length > 1) {
                comboText += `${group.join('-')} combo\n`;
            } else {
                comboText += `${group[0]} single\n`;
            }
        });
        this.comboDisplay.setText(comboText);
    }

    getChargeGroupsPreview() {
        const groups = [];
        let currentGroup = [];

        // Only consider first 4 slots as active slots
        for (let i = 0; i < 4; i++) {
            // Skip empty slots
            if (!this.chargeSlots || !this.chargeSlots[i]) {
                // If we had a group building, end it
                if (currentGroup.length > 0) {
                    groups.push([...currentGroup]);
                    currentGroup = [];
                }
                continue;
            }
            
            currentGroup.push(this.chargeSlots[i]);

            // Check if this slot is linked to the next (within active slots)
            if (i < 3 && this.linkButtons[i] && this.linkButtons[i].linked && this.chargeSlots[i + 1]) {
                // Continue group
            } else {
                // End current group
                if (currentGroup.length > 0) {
                    groups.push([...currentGroup]);
                    currentGroup = [];
                }
            }
        }

        return groups;
    }

    updateChargeGroups() {
        this.chargeGroups = this.getChargeGroupsPreview();
        this.currentChargeIndex = 0;
        this.updatePassiveBonuses();
    }
    
    updatePassiveBonuses() {
        // Reset all bonuses to default
        this.passiveBonuses = {
            damageMultiplier: 1.0,
            speedMultiplier: 1.0,
            fireRateMultiplier: 1.0,
            healthRegenRate: 0,
            moveSpeedMultiplier: 1.0,
            lifesteal: 0,
            dodge: 0,
            thorns: 0,
            elementalResistance: {},
            onKillEffects: [],
            auraEffects: []
        };
        
        // Get passive elements (slots 4-7)
        const passiveElements = [];
        for (let i = 4; i < 8 && i < this.charges.length; i++) {
            if (this.charges[i]) {
                passiveElements.push(this.charges[i]);
            }
        }
        
        // Apply bonuses for each passive element
        passiveElements.forEach(element => {
            this.applyPassiveElementBonus(element);
        });
        
        // Check for synergies between passive elements
        if (passiveElements.length >= 2) {
            this.checkPassiveSynergies(passiveElements);
        }
    }
    
    applyPassiveElementBonus(element) {
        switch (element) {
            case 'fire':
                // Fire passive: +20% damage, burning aura
                this.passiveBonuses.damageMultiplier *= 1.2;
                this.passiveBonuses.auraEffects.push({ type: 'burn', damage: 0.5, radius: 100 });
                break;
                
            case 'water':
                // Water passive: +2 HP/sec regen, +10% lifesteal
                this.passiveBonuses.healthRegenRate += 2;
                this.passiveBonuses.lifesteal += 0.1;
                break;
                
            case 'earth':
                // Earth passive: +30% health, damage reflection
                this.passiveBonuses.thorns += 0.25; // Reflect 25% damage
                if (this.maxHealth === 100) { // Only apply once
                    this.maxHealth = 130;
                    this.playerHealth = Math.min(this.playerHealth + 30, this.maxHealth);
                }
                break;
                
            case 'air':
                // Air passive: +20% movement speed, +15% dodge
                this.passiveBonuses.moveSpeedMultiplier *= 1.2;
                this.passiveBonuses.dodge += 0.15;
                break;
                
            case 'lightning':
                // Lightning passive: +30% fire rate, chain damage on kill
                this.passiveBonuses.fireRateMultiplier *= 1.3;
                this.passiveBonuses.onKillEffects.push({ type: 'chain', damage: 2, bounces: 2 });
                break;
                
            case 'ice':
                // Ice passive: Slow aura, +20% elemental resistance
                this.passiveBonuses.auraEffects.push({ type: 'slow', strength: 0.5, radius: 150 });
                this.passiveBonuses.elementalResistance.all = (this.passiveBonuses.elementalResistance.all || 0) + 0.2;
                break;
                
            case 'holy':
                // Holy passive: +3 HP/sec regen, damage boost at full health
                this.passiveBonuses.healthRegenRate += 3;
                if (this.playerHealth === this.maxHealth) {
                    this.passiveBonuses.damageMultiplier *= 1.3;
                }
                break;
                
            case 'dark':
                // Dark passive: +15% lifesteal, execute low health enemies
                this.passiveBonuses.lifesteal += 0.15;
                this.passiveBonuses.onKillEffects.push({ type: 'execute', threshold: 0.2 });
                break;
                
            case 'poison':
                // Poison passive: Poison aura, +10% damage per poisoned enemy
                this.passiveBonuses.auraEffects.push({ type: 'poison', damage: 1, radius: 120 });
                break;
                
            case 'arcane':
                // Arcane passive: +25% spell damage, mana shield
                this.passiveBonuses.damageMultiplier *= 1.25;
                this.passiveBonuses.elementalResistance.magic = (this.passiveBonuses.elementalResistance.magic || 0) + 0.3;
                break;
                
            // Add more elements as needed
        }
    }
    
    checkPassiveSynergies(elements) {
        const elementSet = new Set(elements);
        
        // Fire + Earth = Lava pools on kill
        if (elementSet.has('fire') && elementSet.has('earth')) {
            this.passiveBonuses.onKillEffects.push({ type: 'lava_pool', duration: 3000 });
        }
        
        // Water + Lightning = Energy shield
        if (elementSet.has('water') && elementSet.has('lightning')) {
            this.passiveBonuses.dodge += 0.1; // Additional 10% dodge
            this.passiveBonuses.auraEffects.push({ type: 'energy_shield', absorb: 0.2 });
        }
        
        // Ice + Air = Freezing winds
        if (elementSet.has('ice') && elementSet.has('air')) {
            this.passiveBonuses.auraEffects.push({ type: 'freezing_wind', freezeChance: 0.1, radius: 200 });
        }
        
        // More synergies can be added here
    }
    
    getPassiveDescription(element) {
        const passiveDescriptions = {
            fire: '+20% damage to all spells. Burning aura damages nearby enemies.',
            water: '+2 HP/sec regeneration. +10% lifesteal on all damage.',
            earth: '+30% max health. Reflects 25% of melee damage back to attackers.',
            air: '+20% movement speed. 15% chance to dodge attacks.',
            lightning: '+30% faster spell casting. Kills chain lightning to 2 nearby enemies.',
            ice: 'Slowing aura reduces enemy speed. +20% resistance to all elements.',
            holy: '+3 HP/sec regeneration. +30% damage when at full health.',
            dark: '+15% lifesteal. Instantly kill enemies below 20% health.',
            poison: 'Poison aura constantly damages nearby enemies.',
            arcane: '+25% spell damage. 30% magic damage resistance.',
            rock: '+40% max health. Immune to knockback.',
            lava: 'Leave burning pools on enemy kills. +15% fire damage.',
            steam: 'Obscuring mist gives 20% dodge. Wet enemies take +50% lightning damage.',
            mud: 'Enemies near you move 30% slower. +20% earth spell damage.',
            dust: 'Blind aura reduces enemy accuracy. +25% dodge chance.',
            crystal: 'Projectiles pierce +1 enemy. +10% critical hit chance.',
            sand: 'Sandstorm aura damages and blinds. +15% earth damage.',
            wave: 'Knockback immunity. Water spells heal 5% of damage dealt.',
            meteor: 'Meteors randomly fall near enemies. +20% fire and earth damage.',
            gravity: 'Pull enemies slowly toward you. +30% damage to slowed enemies.',
            volcano: 'Eruptions on spell cast. +25% fire damage, +10% area damage.',
            storm: 'Storm aura randomly strikes enemies. +35% lightning damage.',
            smoke: 'Smoke screen when hit (10s cooldown). +30% dodge in smoke.',
            nature: 'Regenerate 1% max HP/sec. Spawn healing flowers on kills.',
            life: '+5 HP/sec regeneration. Resurrect with 50% HP once per minute.',
            moon: 'Night aura weakens enemies. +20% damage at night (every 2 min).',
            sun: 'Solar flare damages all enemies every 30s. +40% damage during day.',
            star: 'Starfall randomly damages enemies. +15% to all elemental damage.',
            time: 'Enemies move 20% slower. Cooldowns reduced by 25%.',
            death: 'Execute enemies below 30% health. Killed enemies explode.'
        };
        
        return passiveDescriptions[element] || 'Unknown passive effect.';
    }

    swapCharges(fromIndex, toIndex) {
        console.log(`Moving charge from ${fromIndex} to ${toIndex}`);
        console.log('Current charges:', this.charges);
        console.log('Current chargeSlots before move:', [...this.chargeSlots]);
        
        // Ensure both indices are valid slot indices (0-11 for charge + pouch)
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= 12 || toIndex >= 12) {
            console.log('Invalid indices - fromIndex:', fromIndex, 'toIndex:', toIndex);
            return;
        }
        
        // Initialize arrays if they don't exist
        if (!this.chargeSlots) {
            this.chargeSlots = new Array(8).fill(null);
            // Copy existing charges to slots
            for (let i = 0; i < this.charges.length; i++) {
                this.chargeSlots[i] = this.charges[i];
            }
        }
        
        if (!this.elementPouch) {
            this.elementPouch = [null, null, null, null];
        }
        
        // Determine which arrays we're working with
        const fromIsCharge = fromIndex < 8;
        const toIsCharge = toIndex < 8;
        const fromPouchIndex = fromIndex - 8;
        const toPouchIndex = toIndex - 8;
        
        // Get the elements
        const elementToMove = fromIsCharge ? this.chargeSlots[fromIndex] : this.elementPouch[fromPouchIndex];
        
        if (!elementToMove) {
            console.log('No element to move from slot', fromIndex);
            return;
        }
        
        // Get target element
        const targetElement = toIsCharge ? this.chargeSlots[toIndex] : this.elementPouch[toPouchIndex];
        
        // Handle the swap based on the slot types
        if (fromIsCharge && toIsCharge) {
            // Charge to charge swap
            this.chargeSlots[fromIndex] = targetElement;
            this.chargeSlots[toIndex] = elementToMove;
            
            // Handle tier tracking for charge slots
            const fromElementTier = this.elementTiers.get(`${elementToMove}_${fromIndex}`) || 1;
            const toElementTier = targetElement ? (this.elementTiers.get(`${targetElement}_${toIndex}`) || 1) : 0;
            
            if (targetElement) {
                this.elementTiers.set(`${targetElement}_${fromIndex}`, toElementTier);
                this.elementTiers.set(`${elementToMove}_${toIndex}`, fromElementTier);
                this.elementTiers.delete(`${elementToMove}_${fromIndex}`);
                this.elementTiers.delete(`${targetElement}_${toIndex}`);
            } else {
                this.elementTiers.set(`${elementToMove}_${toIndex}`, fromElementTier);
                this.elementTiers.delete(`${elementToMove}_${fromIndex}`);
            }
        } else if (fromIsCharge && !toIsCharge) {
            // Charge to pouch
            this.chargeSlots[fromIndex] = targetElement;
            this.elementPouch[toPouchIndex] = elementToMove;
            
            // Clear tier for element moving to pouch
            this.elementTiers.delete(`${elementToMove}_${fromIndex}`);
        } else if (!fromIsCharge && toIsCharge) {
            // Pouch to charge
            this.elementPouch[fromPouchIndex] = targetElement;
            this.chargeSlots[toIndex] = elementToMove;
            
            // Set tier 1 for element moving from pouch
            this.elementTiers.set(`${elementToMove}_${toIndex}`, 1);
            
            if (targetElement) {
                // Clear tier for element moving to pouch
                this.elementTiers.delete(`${targetElement}_${toIndex}`);
            }
        } else {
            // Pouch to pouch
            this.elementPouch[fromPouchIndex] = targetElement;
            this.elementPouch[toPouchIndex] = elementToMove;
        }
        
        // Save pouch state
        localStorage.setItem('elementPouch', JSON.stringify(this.elementPouch));
        
        // Rebuild charges array from first 4 charge slots only
        this.charges = [];
        for (let i = 0; i < 4 && i < this.chargeSlots.length; i++) {
            if (this.chargeSlots[i] !== null) {
                this.charges.push(this.chargeSlots[i]);
            }
        }
        
        console.log('After move - slots:', [...this.chargeSlots]);
        console.log('After move - charges:', this.charges);
        
        // Update the charge UI in main game
        this.updateChargeUI();
        
        // Update pause menu display without closing/reopening
        if (this.isPaused && this.pauseMenu && this.pauseMenu.visible) {
            console.log('Updating pause menu display after swap');
            // Don't close/reopen - just update the visual state
            this.updatePauseMenuDisplay();
            
            // Refresh the interactive elements without closing menu
            this.refreshPauseMenuInteractiveElements();
        }
        
        // Clear any links that might be affected
        const affectedIndices = [fromIndex - 1, fromIndex, toIndex - 1, toIndex];
        affectedIndices.forEach(idx => {
            if (idx >= 0 && idx < this.linkButtons.length && this.linkButtons[idx]) {
                this.linkButtons[idx].linked = false;
            }
        });
        
        // Update charge groups and passive bonuses
        this.updateChargeGroups();
    }
    
    refreshPauseMenuInteractiveElements() {
        // Clean up existing interactive elements
        if (this.tempInteractiveElements) {
            this.tempInteractiveElements.forEach(element => element.destroy());
            this.tempInteractiveElements = [];
        }
        
        // Recreate interactive elements for the updated charge slots
        this.pauseChargeSlots.forEach((slot, index) => {
            if (index < 8) {  // Create hit zones for all 8 slots
                // Calculate world position
                const worldX = this.pauseMenu.x + slot.circle.x;
                const worldY = this.pauseMenu.y + slot.circle.y;

                // Create a temporary interactive zone at world coordinates
                const hitZone = this.add.circle(worldX, worldY, 30, 0x00ff00, 0.01);
                hitZone.setDepth(901);
                hitZone.setScrollFactor(0);

                // Set interactive only if slot has a charge
                const hasCharge = this.chargeSlots && this.chargeSlots[index];
                hitZone.setInteractive({
                    draggable: hasCharge,
                    useHandCursor: hasCharge
                });

                hitZone.setData('slotIndex', index);
                hitZone.setData('originalX', worldX);
                hitZone.setData('originalY', worldY);
                hitZone.setData('isBeingDragged', false);
                
                if (hasCharge) {
                    hitZone.setData('sourceSlotIndex', index);
                    console.log(`Refreshed HitZone for slot ${index} with element: ${this.chargeSlots[index]}`);
                }

                // Store reference for visual updates
                hitZone.visualCircle = slot.circle;

                // Pointer events
                hitZone.on('pointerover', () => {
                    if (!hitZone.getData('isBeingDragged')) {
                        hitZone.setStrokeStyle(2, 0x00ff00, 1);
                        
                        // Show element description
                        if (this.chargeSlots && this.chargeSlots[index]) {
                            const element = this.chargeSlots[index];
                            const config = this.elementConfig[element];
                            const isPassiveSlot = index >= 4;
                            
                            if (config) {
                                const activeDesc = this.elementDescriptions[element];
                                const passiveDesc = this.getPassiveDescription(element);
                                const tier = this.elementTiers.get(`${element}_${index}`) || 1;
                                
                                let titleText = config.name;
                                if (tier > 1) {
                                    titleText += ` (Tier ${tier})`;
                                }
                                titleText += (isPassiveSlot ? ' - Passive' : ' - Active');
                                
                                this.elementDescriptionTitle.setText(titleText);
                                
                                let descText = isPassiveSlot ? passiveDesc : activeDesc;
                                if (tier > 1) {
                                    descText += '\n' + this.getTierBonusDescription(element, tier);
                                }
                                
                                this.elementDescriptionText.setText(descText);
                                this.elementDescriptionTitle.setVisible(true);
                                this.elementDescriptionText.setVisible(true);
                                this.elementDescriptionBg.setVisible(true);
                            }
                        }
                    }
                });

                hitZone.on('pointerout', () => {
                    if (!hitZone.getData('isBeingDragged')) {
                        hitZone.setStrokeStyle(0);
                        this.elementDescriptionTitle.setText('');
                        this.elementDescriptionText.setText('');
                    }
                });

                // Drag handling
                hitZone.on('dragstart', (pointer) => {
                    console.log(`Started dragging charge ${index}`);
                    hitZone.setData('isBeingDragged', true);
                    this.draggedChargeIndex = index;
                    slot.circle.setAlpha(0.5);
                    hitZone.setStrokeStyle(3, 0xffff00, 1);
                });

                hitZone.on('drag', (pointer, dragX, dragY) => {
                    hitZone.x = dragX;
                    hitZone.y = dragY;
                    // Move the visual charge circle too
                    slot.circle.x = dragX - this.pauseMenu.x;
                    slot.circle.y = dragY - this.pauseMenu.y;
                });

                hitZone.on('dragend', (pointer) => {
                    const sourceSlotIndex = hitZone.getData('sourceSlotIndex') || index;
                    console.log(`Stopped dragging charge from slot ${sourceSlotIndex}`);
                    hitZone.setData('isBeingDragged', false);

                    // Find which slot we're over
                    let targetIndex = -1;
                    this.pauseChargeSlots.forEach((targetSlot, idx) => {
                        if (idx < 12) { // Check all 12 slots (8 charge + 4 pouch)
                            const targetWorldX = this.pauseMenu.x + targetSlot.x;
                            const targetWorldY = this.pauseMenu.y + targetSlot.y;
                            const dist = Phaser.Math.Distance.Between(hitZone.x, hitZone.y, targetWorldX, targetWorldY);
                            if (dist < 40) {
                                targetIndex = idx;
                            }
                        }
                    });

                    if (targetIndex !== -1 && targetIndex !== sourceSlotIndex) {
                        console.log(`Moving charge from slot ${sourceSlotIndex} to slot ${targetIndex}`);
                        this.swapCharges(sourceSlotIndex, targetIndex);
                    } else {
                        // Return to original position
                        hitZone.x = hitZone.getData('originalX');
                        hitZone.y = hitZone.getData('originalY');
                        slot.circle.x = slot.x;
                        slot.circle.y = slot.y;
                    }

                    slot.circle.setAlpha(1);
                    hitZone.setStrokeStyle(0);
                    this.draggedChargeIndex = null;
                });

                this.tempInteractiveElements.push(hitZone);

                // Discard button
                if (slot.discardBtn.visible) {
                    const discardX = this.pauseMenu.x + slot.discardBtn.x;
                    const discardY = this.pauseMenu.y + slot.discardBtn.y;

                    const discardHitZone = this.add.rectangle(discardX, discardY, 30, 20, 0xff0000, 0.01);
                    discardHitZone.setDepth(300);
                    discardHitZone.setScrollFactor(0);
                    discardHitZone.setInteractive({ useHandCursor: true });

                    const slotIndex = index;
                    discardHitZone.on('pointerdown', () => {
                        this.discardCharge(slotIndex);
                    });

                    this.tempInteractiveElements.push(discardHitZone);
                }
            }
        });
        
        // Recreate link button interactive zones
        this.linkButtons.forEach((link, index) => {
            if (link.btn.visible) {
                const linkX = this.pauseMenu.x + link.btn.x;
                const linkY = this.pauseMenu.y + link.btn.y;

                const linkHitZone = this.add.rectangle(linkX, linkY, 30, 20, 0x00ff00, 0.01);
                linkHitZone.setDepth(300);
                linkHitZone.setScrollFactor(0);
                linkHitZone.setInteractive({ useHandCursor: true });

                const linkIndex = index;
                linkHitZone.on('pointerdown', () => {
                    this.toggleLink(linkIndex);
                });

                this.tempInteractiveElements.push(linkHitZone);
            }
        });
    }

    showSlotUpgradeTooltip(slotIndex, x, y) {
        // Hide any existing tooltip
        this.hideSlotUpgradeTooltip();
        
        // Get slot buffs
        const slotBuff = this.slotBuffs[slotIndex] || { damageMultiplier: 1, speedMultiplier: 1, linked: false };
        
        // Create tooltip container
        this.slotTooltip = this.add.container(x + 100, y);
        this.slotTooltip.setDepth(600);
        this.slotTooltip.setScrollFactor(0);
        
        // Background
        const bg = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.9);
        bg.setStrokeStyle(2, 0xffd700);
        this.slotTooltip.add(bg);
        
        // Title
        const title = this.add.text(0, -35, `Slot ${slotIndex + 1} Upgrades`, {
            fontSize: '14px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.slotTooltip.add(title);
        
        // Damage multiplier
        const damageText = this.add.text(0, -10, `Damage: x${slotBuff.damageMultiplier.toFixed(1)}`, {
            fontSize: '12px',
            color: slotBuff.damageMultiplier > 1 ? '#44ff44' : '#ffffff'
        }).setOrigin(0.5);
        this.slotTooltip.add(damageText);
        
        // Speed multiplier
        const speedText = this.add.text(0, 10, `Speed: x${slotBuff.speedMultiplier.toFixed(1)}`, {
            fontSize: '12px',
            color: slotBuff.speedMultiplier > 1 ? '#44ff44' : '#ffffff'
        }).setOrigin(0.5);
        this.slotTooltip.add(speedText);
        
        // Linked status
        const linkedText = this.add.text(0, 30, slotBuff.linked ? 'Linked Slot' : 'No Links', {
            fontSize: '12px',
            color: slotBuff.linked ? '#ff44ff' : '#aaaaaa'
        }).setOrigin(0.5);
        this.slotTooltip.add(linkedText);
        
        // Position tooltip to avoid going off screen
        if (x + 300 > 800) {
            this.slotTooltip.x = x - 100;
        }
        if (y - 50 < 0) {
            this.slotTooltip.y = y + 100;
        }
    }
    
    hideSlotUpgradeTooltip() {
        if (this.slotTooltip) {
            this.slotTooltip.destroy();
            this.slotTooltip = null;
        }
    }

    swapBetweenChargeAndPouch(sourceIndex, targetIndex) {
        console.log(`Swapping between slots ${sourceIndex} and ${targetIndex}`);
        
        // Initialize pouch if needed
        if (!this.elementPouch) {
            const savedPouch = localStorage.getItem('elementPouch');
            this.elementPouch = savedPouch ? JSON.parse(savedPouch) : [null, null, null, null];
        }
        
        // Get source and target elements
        let sourceElement = null;
        let targetElement = null;
        
        if (sourceIndex < 8) {
            sourceElement = this.chargeSlots[sourceIndex];
        } else {
            sourceElement = this.elementPouch[sourceIndex - 8];
        }
        
        if (targetIndex < 8) {
            targetElement = this.chargeSlots[targetIndex];
        } else {
            targetElement = this.elementPouch[targetIndex - 8];
        }
        
        // Perform the swap
        if (sourceIndex < 8) {
            this.chargeSlots[sourceIndex] = targetElement;
        } else {
            this.elementPouch[sourceIndex - 8] = targetElement;
        }
        
        if (targetIndex < 8) {
            this.chargeSlots[targetIndex] = sourceElement;
        } else {
            this.elementPouch[targetIndex - 8] = sourceElement;
        }
        
        // Save pouch state
        localStorage.setItem('elementPouch', JSON.stringify(this.elementPouch));
        
        // Rebuild charges array from first 4 chargeSlots
        this.charges = [];
        for (let i = 0; i < 4 && i < this.chargeSlots.length; i++) {
            if (this.chargeSlots[i] !== null) {
                this.charges.push(this.chargeSlots[i]);
            }
        }
        
        // Update displays
        this.updateChargeUI();
        this.updateChargeGroups();
        this.updatePauseMenuDisplay();
        
        // Refresh interactive elements
        this.refreshPauseMenuInteractiveElements();
    }
    
    discardCharge(index, confirmed = false) {
        if ((index < 8 && this.chargeSlots && this.chargeSlots[index]) || 
            (index >= 8 && this.elementPouch && this.elementPouch[index - 8])) {
            // If not confirmed, show confirmation dialog
            if (!confirmed) {
                this.showDiscardConfirmation(index);
                return;
            }

            // Remove the element from the appropriate slot
            if (index < 8) {
                this.chargeSlots[index] = null;
            } else {
                this.elementPouch[index - 8] = null;
                // Save pouch state
                localStorage.setItem('elementPouch', JSON.stringify(this.elementPouch));
            }
            
            // Rebuild charges array from first 4 slots only
            this.charges = [];
            for (let i = 0; i < 4 && i < this.chargeSlots.length; i++) {
                if (this.chargeSlots[i] !== null) {
                    this.charges.push(this.chargeSlots[i]);
                }
            }

            // Clear any links affected by this removal
            if (index > 0 && this.linkButtons[index - 1]) {
                this.linkButtons[index - 1].linked = false;
            }
            if (index < this.linkButtons.length && this.linkButtons[index]) {
                this.linkButtons[index].linked = false;
            }

            // Update displays
            this.updateChargeUI();
            this.updatePauseMenuDisplay();

            // Visual feedback
            const discardEffect = this.add.text(
                this.pauseChargeSlots[index].x + this.pauseMenu.x,
                this.pauseChargeSlots[index].y + this.pauseMenu.y,
                'Discarded!',
                {
                    fontSize: '16px',
                    color: '#ff4444'
                }
            ).setOrigin(0.5);

            this.tweens.add({
                targets: discardEffect,
                y: discardEffect.y - 30,
                alpha: 0,
                duration: 500,
                onComplete: () => discardEffect.destroy()
            });
        }
    }

    showDiscardConfirmation(index) {
        // Create confirmation dialog
        const confirmBg = this.add.rectangle(400, 300, 300, 150, 0x000000, 0.9);
        confirmBg.setStrokeStyle(2, 0xffffff);
        confirmBg.setDepth(300);
        confirmBg.setScrollFactor(0);

        const elementName = (index < 8 && this.chargeSlots[index]) ? this.chargeSlots[index] : 
                           (index >= 8 && this.elementPouch[index - 8]) ? this.elementPouch[index - 8] : 
                           'element';
        const confirmText = this.add.text(400, 270, `Discard ${elementName} charge?`, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        confirmText.setDepth(301);
        confirmText.setScrollFactor(0);

        const controlText = this.gamepad ? 'Yes (A)' : 'Yes (Y/Enter)';
        const yesText = this.add.text(350, 320, controlText, {
            fontSize: '16px',
            color: '#44ff44'
        }).setOrigin(0.5);
        yesText.setDepth(301);
        yesText.setScrollFactor(0);
        yesText.setInteractive({ useHandCursor: true });

        const noControlText = this.gamepad ? 'No (B)' : 'No (N/Esc)';
        const noText = this.add.text(450, 320, noControlText, {
            fontSize: '16px',
            color: '#ff4444'
        }).setOrigin(0.5);
        noText.setDepth(301);
        noText.setScrollFactor(0);
        noText.setInteractive({ useHandCursor: true });

        // Define keyboard handler first so it can be referenced
        const handleKey = (event) => {
            if (!this.discardConfirmation || !this.discardConfirmation.active) return;

            if (event.key === 'y' || event.key === 'Y' || event.key === 'Enter') {
                // Confirm discard
                const idx = this.discardConfirmation.index;
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
                this.discardConfirmUI = null;
                this.discardCharge(idx, true);
                this.input.keyboard.off('keydown', handleKey);
            } else if (event.key === 'n' || event.key === 'N' || event.key === 'Escape') {
                // Cancel discard
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
                this.discardConfirmUI = null;
                this.input.keyboard.off('keydown', handleKey);
            }
        };

        // Add mouse hover effects
        yesText.on('pointerover', () => yesText.setScale(1.1));
        yesText.on('pointerout', () => yesText.setScale(1));
        noText.on('pointerover', () => noText.setScale(1.1));
        noText.on('pointerout', () => noText.setScale(1));

        // Add mouse click handlers
        yesText.on('pointerdown', () => {
            if (this.discardConfirmation && this.discardConfirmation.active) {
                const idx = this.discardConfirmation.index;
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
                this.discardConfirmUI = null;
                this.discardCharge(idx, true);
                this.input.keyboard.off('keydown', handleKey);
            }
        });

        noText.on('pointerdown', () => {
            if (this.discardConfirmation && this.discardConfirmation.active) {
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
                this.discardConfirmUI = null;
                this.input.keyboard.off('keydown', handleKey);
            }
        });

        // Store confirmation state
        this.discardConfirmation = {
            active: true,
            index: index,
            elements: [confirmBg, confirmText, yesText, noText]
        };

        // Also store as discardConfirmUI for controller handling compatibility
        this.discardConfirmUI = {
            active: true,
            chargeIndex: index,
            bg: confirmBg,
            text: confirmText,
            yes: yesText,
            no: noText
        };

        this.input.keyboard.on('keydown', handleKey);
    }

    updatePauseMenuCursor() {
        if (!this.pauseMenuCursor || !this.pauseMenu.visible) return;

        if (this.linkMode) {
            // In link mode, position cursor over the current link
            if (this.linkCursorIndex < this.linkButtons.length) {
                const link = this.linkButtons[this.linkCursorIndex];
                this.pauseMenuCursor.x = this.pauseMenu.x + link.btn.x;
                this.pauseMenuCursor.y = this.pauseMenu.y + link.btn.y;
                // Make cursor smaller for link buttons and change color
                this.pauseMenuCursor.setSize(35, 25);
                this.pauseMenuCursor.setStrokeStyle(3, 0xffff00, 1); // Yellow for link mode
            }
        } else {
            // Normal mode cursor positioning
            this.pauseMenuCursor.setStrokeStyle(3, 0x00ff00, 1); // Green for normal mode

            if (this.pauseMenuCursorIndex < 8) {
                // Hovering over a charge slot (now supports 8 slots)
                const slot = this.pauseChargeSlots[this.pauseMenuCursorIndex];
                if (slot && this.pauseMenuCursorIndex < this.maxCharges) {
                    this.pauseMenuCursor.x = this.pauseMenu.x + slot.x;
                    this.pauseMenuCursor.y = this.pauseMenu.y + slot.y;
                    // Reset to normal size for slots
                    this.pauseMenuCursor.setSize(85, 85);
                    
                    // Show element description for controller navigation
                    if (this.chargeSlots && this.chargeSlots[this.pauseMenuCursorIndex]) {
                        const element = this.chargeSlots[this.pauseMenuCursorIndex];
                        const config = this.elementConfig[element];
                        const isPassiveSlot = this.pauseMenuCursorIndex >= 4;
                        
                        if (config) {
                            const activeDesc = this.elementDescriptions[element];
                            const passiveDesc = this.getPassiveDescription(element);
                            
                            this.elementDescriptionTitle.setText(config.name + (isPassiveSlot ? ' (Passive)' : ' (Active)'));
                            this.elementDescriptionText.setText(isPassiveSlot ? passiveDesc : activeDesc);
                            this.elementDescriptionTitle.setVisible(true);
                            this.elementDescriptionText.setVisible(true);
                            this.elementDescriptionBg.setVisible(true);
                        }
                    } else {
                        // Clear description if no element in slot
                        this.elementDescriptionTitle.setText('');
                        this.elementDescriptionText.setText('');
                    }
                }
            } else {
                // Hovering over a link button
                const linkIndex = this.pauseMenuCursorIndex - 8;
                if (linkIndex < this.linkButtons.length) {
                    const link = this.linkButtons[linkIndex];
                    this.pauseMenuCursor.x = this.pauseMenu.x + link.btn.x;
                    this.pauseMenuCursor.y = this.pauseMenu.y + link.btn.y;
                    // Make cursor smaller for link buttons
                    this.pauseMenuCursor.setSize(35, 25);
                }
                // Clear element description when hovering over link button
                this.elementDescriptionTitle.setText('');
                this.elementDescriptionText.setText('');
            }
        }
    }

    handlePauseMenuController() {
        if (!this.gamepad || !this.pauseMenu.visible) return;

        // Handle confirmation dialog if active
        if (this.discardConfirmUI && this.discardConfirmUI.active) {
            const aPressed = this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed;
            const bPressed = this.gamepad.buttons[1] && this.gamepad.buttons[1].pressed;

            if (aPressed && !this.prevPauseAPressed) {
                // Confirm discard
                const index = this.discardConfirmUI.chargeIndex;
                this.discardConfirmUI.bg.destroy();
                this.discardConfirmUI.text.destroy();
                this.discardConfirmUI.yes.destroy();
                this.discardConfirmUI.no.destroy();
                this.discardConfirmUI = null;
                this.discardCharge(index);
            } else if (bPressed && !this.prevPauseBPressed) {
                // Cancel discard
                this.discardConfirmUI.bg.destroy();
                this.discardConfirmUI.text.destroy();
                this.discardConfirmUI.yes.destroy();
                this.discardConfirmUI.no.destroy();
                this.discardConfirmUI = null;
            }

            // Store states and return early
            this.prevPauseAPressed = aPressed;
            this.prevPauseBPressed = bPressed;
            return;
        }

        // D-pad navigation
        const leftPressed = this.gamepad.buttons[14] && this.gamepad.buttons[14].pressed;
        const rightPressed = this.gamepad.buttons[15] && this.gamepad.buttons[15].pressed;

        // Check for just pressed (not held)
        if (leftPressed && !this.prevPauseLeftPressed) {
            if (this.linkMode) {
                // Navigate between link buttons in link mode
                this.linkCursorIndex--;
                if (this.linkCursorIndex < 0) {
                    this.linkCursorIndex = this.linkButtons.length - 1;
                }
            } else {
                // Normal navigation
                this.pauseMenuCursorIndex--;
                if (this.pauseMenuCursorIndex < 0) {
                    this.pauseMenuCursorIndex = this.maxCharges + this.linkButtons.length - 1;
                }
            }
            this.updatePauseMenuCursor();
        }

        if (rightPressed && !this.prevPauseRightPressed) {
            if (this.linkMode) {
                // Navigate between link buttons in link mode
                this.linkCursorIndex++;
                if (this.linkCursorIndex >= this.linkButtons.length) {
                    this.linkCursorIndex = 0;
                }
            } else {
                // Normal navigation
                this.pauseMenuCursorIndex++;
                if (this.pauseMenuCursorIndex >= this.maxCharges + this.linkButtons.length) {
                    this.pauseMenuCursorIndex = 0;
                }
            }
            this.updatePauseMenuCursor();
        }

        // A button - select/place charge or toggle link
        const aPressed = this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed;
        if (aPressed && !this.prevPauseAPressed) {
            if (this.linkMode) {
                // Toggle link at current link cursor position
                if (this.linkCursorIndex < this.linkButtons.length) {
                    this.toggleLink(this.linkCursorIndex);
                    this.updatePauseMenuDisplay();
                }
            } else {
                // Normal charge selection/placement
                if (this.pauseMenuCursorIndex < this.maxCharges) {
                    // Charge slot
                    const slotIndex = this.pauseMenuCursorIndex;

                    if (this.pauseMenuSelectedCharge === -1) {
                        // Pick up charge if there is one
                        if (slotIndex < this.charges.length) {
                            this.pauseMenuSelectedCharge = slotIndex;
                            // Visual feedback
                            this.pauseChargeSlots[slotIndex].circle.setScale(0.25); // Adjusted for new scale
                            this.pauseChargeSlots[slotIndex].circle.setAlpha(0.5);
                        }
                    } else {
                        // Place charge
                        if (slotIndex !== this.pauseMenuSelectedCharge) {
                            this.swapCharges(this.pauseMenuSelectedCharge, slotIndex);
                        }
                        // Reset selection
                        this.pauseChargeSlots[this.pauseMenuSelectedCharge].circle.setScale(0.2);
                        this.pauseChargeSlots[this.pauseMenuSelectedCharge].circle.setAlpha(1);
                        this.pauseMenuSelectedCharge = -1;
                    }
                }
            }
        }

        // B button - cancel selection or ask to discard
        const bPressed = this.gamepad.buttons[1] && this.gamepad.buttons[1].pressed;
        if (bPressed && !this.prevPauseBPressed) {
            if (this.pauseMenuSelectedCharge !== -1) {
                // Cancel selection
                this.pauseChargeSlots[this.pauseMenuSelectedCharge].circle.setScale(1);
                this.pauseChargeSlots[this.pauseMenuSelectedCharge].circle.setAlpha(1);
                this.pauseMenuSelectedCharge = -1;
            } else if (this.pauseMenuCursorIndex < this.maxCharges && this.pauseMenuCursorIndex < this.charges.length) {
                // Show discard confirmation
                this.showDiscardConfirmation(this.pauseMenuCursorIndex);
            }
        }

        // Y button - toggle link mode
        const yPressed = this.gamepad.buttons[3] && this.gamepad.buttons[3].pressed;
        if (yPressed && !this.prevPauseYPressed) {
            this.linkMode = !this.linkMode;
            if (this.linkMode) {
                // Entering link mode - set cursor to first available link
                this.linkCursorIndex = 0;
                // Entering link mode
            } else {
                // Exiting link mode
            }
            this.updatePauseMenuCursor();
        }

        // Store previous states
        this.prevPauseLeftPressed = leftPressed;
        this.prevPauseRightPressed = rightPressed;
        this.prevPauseAPressed = aPressed;
        this.prevPauseBPressed = bPressed;
        this.prevPauseYPressed = yPressed;
    }

    showDiscardConfirmation(chargeIndex) {
        if (!this.pauseMenu || !this.pauseMenu.visible || chargeIndex >= this.charges.length) return;

        const element = this.charges[chargeIndex];
        const config = this.elementConfig[element];

        // Create confirmation dialog
        const confirmBg = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.95);
        confirmBg.setStrokeStyle(3, 0xff4444);
        confirmBg.setScrollFactor(0);
        confirmBg.setDepth(400);

        const confirmText = this.add.text(400, 250, `Discard ${config.name}?`, {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        confirmText.setOrigin(0.5);
        confirmText.setScrollFactor(0);
        confirmText.setDepth(401);

        const yesText = this.add.text(320, 320, 'Yes (Y/A)', {
            fontSize: '18px',
            color: '#44ff44'
        });
        yesText.setOrigin(0.5);
        yesText.setScrollFactor(0);
        yesText.setDepth(401);
        yesText.setInteractive({ useHandCursor: true });

        const noText = this.add.text(480, 320, 'No (N/B)', {
            fontSize: '18px',
            color: '#ff4444'
        });
        noText.setOrigin(0.5);
        noText.setScrollFactor(0);
        noText.setDepth(401);
        noText.setInteractive({ useHandCursor: true });

        // Define keyboard handler
        const handleKey = (event) => {
            if (!this.discardConfirmUI || !this.discardConfirmUI.active) return;

            if (event.key === 'y' || event.key === 'Y' || event.key === 'Enter') {
                // Confirm discard
                const idx = this.discardConfirmUI.chargeIndex;
                this.discardConfirmUI.bg.destroy();
                this.discardConfirmUI.text.destroy();
                this.discardConfirmUI.yes.destroy();
                this.discardConfirmUI.no.destroy();
                this.discardConfirmUI = null;
                this.discardCharge(idx, true);
                this.input.keyboard.off('keydown', handleKey);
            } else if (event.key === 'n' || event.key === 'N' || event.key === 'Escape') {
                // Cancel discard
                this.discardConfirmUI.bg.destroy();
                this.discardConfirmUI.text.destroy();
                this.discardConfirmUI.yes.destroy();
                this.discardConfirmUI.no.destroy();
                this.discardConfirmUI = null;
                this.input.keyboard.off('keydown', handleKey);
            }
        };

        // Add mouse hover effects
        yesText.on('pointerover', () => yesText.setScale(1.1));
        yesText.on('pointerout', () => yesText.setScale(1));
        noText.on('pointerover', () => noText.setScale(1.1));
        noText.on('pointerout', () => noText.setScale(1));

        // Add mouse click handlers
        yesText.on('pointerdown', () => {
            if (this.discardConfirmUI && this.discardConfirmUI.active) {
                const idx = this.discardConfirmUI.chargeIndex;
                this.discardConfirmUI.bg.destroy();
                this.discardConfirmUI.text.destroy();
                this.discardConfirmUI.yes.destroy();
                this.discardConfirmUI.no.destroy();
                this.discardConfirmUI = null;
                this.discardCharge(idx, true);
                this.input.keyboard.off('keydown', handleKey);
            }
        });

        noText.on('pointerdown', () => {
            if (this.discardConfirmUI && this.discardConfirmUI.active) {
                this.discardConfirmUI.bg.destroy();
                this.discardConfirmUI.text.destroy();
                this.discardConfirmUI.yes.destroy();
                this.discardConfirmUI.no.destroy();
                this.discardConfirmUI = null;
                this.input.keyboard.off('keydown', handleKey);
            }
        });

        // Add keyboard listener
        this.input.keyboard.on('keydown', handleKey);

        // Store confirmation UI
        this.discardConfirmUI = {
            bg: confirmBg,
            text: confirmText,
            yes: yesText,
            no: noText,
            chargeIndex: chargeIndex,
            active: true
        };
    }

    toggleSpellbook() {
        this.spellbookOpen = !this.spellbookOpen;
        this.spellbookUI.setVisible(this.spellbookOpen);
        
        // Disable interaction when hidden to prevent blocking other UI
        if (this.spellbookUI.input) {
            this.spellbookUI.input.enabled = this.spellbookOpen;
        }

        if (this.spellbookOpen) {
            // Update content when opening
            this.updateSpellbookText();
            // Pause physics and all timers
            this.physics.pause();
            this.time.timeScale = 0;

            // Add mouse wheel scrolling
            if (!this.spellbookWheelHandler) {
                this.spellbookWheelHandler = (event) => {
                    if (this.spellbookOpen) {
                        const scrollAmount = event.deltaY > 0 ? 60 : -60; // Increased for larger cards
                        this.spellScrollY = Math.max(0, Math.min(this.spellMaxScrollY, this.spellScrollY + scrollAmount));
                        this.elementCardsContainer.y = -this.spellScrollY;
                        event.preventDefault();
                    }
                };
                this.input.manager.canvas.addEventListener('wheel', this.spellbookWheelHandler);
            }
        } else {
            // Resume physics and timers
            this.physics.resume();
            this.time.timeScale = 1;
        }
    }


    cleanupEnemyEffects(enemy) {
        // Clean up poison timer if it exists
        if (enemy.poisonTimer) {
            enemy.poisonTimer.destroy();
            enemy.poisonTimer = null;
        }
        
        // Clean up burn timer if it exists
        if (enemy.burnTimer) {
            enemy.burnTimer.destroy();
            enemy.burnTimer = null;
        }
        
        // Clean up sun burn timer if it exists
        if (enemy.sunBurnTick) {
            enemy.sunBurnTick.destroy();
            enemy.sunBurnTick = null;
        }
        
        // Clear all status effects
        enemy.poisoned = false;
        enemy.burning = false;
        enemy.burnMagnitude = 0;
        enemy.frozen = false;
        enemy.stunned = false;
        enemy.wet = false;
        enemy.slowed = false;
        enemy.blinded = false;
        enemy.inSunAura = false;
        
        // Clear any tints
        enemy.clearTint();
        
        // Stop any playing animations to prevent currentFrame errors
        if (enemy.anims) {
            try {
                if (enemy.anims.isPlaying) {
                    enemy.anims.stop();
                }
            } catch (e) {
                // Animation system might be in invalid state
                console.warn('Failed to stop enemy animation:', e);
            }
        }
    }

    killEnemy(enemy) {
        if (enemy.isDying) return;

        enemy.isDying = true;
        const enemyX = enemy.x;
        const enemyY = enemy.y;
        
        // Clean up any active effects
        this.cleanupEnemyEffects(enemy);

        if (enemy.enemyType === 'slime') {
            // Play slime death animation
            try {
                enemy.play('slime-die');
            } catch (e) {
                console.warn('Failed to play slime death animation:', e);
            }
            enemy.setVelocity(0, 0); // Stop movement

            // Store generation for splitting
            const generation = enemy.generation || 0;

            // Wait for animation to complete
            enemy.once('animationcomplete', () => {
                // Only split if not already too small (max 2 splits)
                if (generation < 2) {
                    // Drop chest if this is an elite's first split
                    if (enemy.isElite && generation === 0) {
                        this.dropChest(enemyX, enemyY);
                    }

                    // Spawn 2 smaller slimes
                    const offset = 20;
                    this.spawnSplitSlime(enemyX - offset, enemyY, generation + 1, this.difficultyMultiplier);
                    this.spawnSplitSlime(enemyX + offset, enemyY, generation + 1, this.difficultyMultiplier);

                    // Visual effect for splitting
                    const splitEffect = this.add.circle(enemyX, enemyY, 20, 0x44ff44, 0.6);
                    splitEffect.setDepth(10);
                    this.tweens.add({
                        targets: splitEffect,
                        scale: { from: 0.5, to: 2 },
                        alpha: { from: 0.6, to: 0 },
                        duration: 300,
                        onComplete: () => splitEffect.destroy()
                    });
                } else {
                    // Final generation drops loot
                    this.dropJewel(enemyX, enemyY, 2, 0.075);

                    // 1.25% chance to drop muffin (reduced by 75%)
                    if (Math.random() < 0.0125) {
                        this.dropItemChest(enemyX, enemyY + 20, 'muffin');
                    }
                }

                this.enemiesKilled[enemy.enemyType]++;
                enemy.destroy();
            });
        } else if (enemy.isElite) {
            // Elite enemy death - no chest drop
            enemy.setVelocity(0, 0);
            this.tweens.add({
                targets: enemy,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    // Drop regular items as chests instead
                    // Drop 3-5 jewels
                    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
                        const offsetX = (Math.random() - 0.5) * 40;
                        const offsetY = (Math.random() - 0.5) * 40;
                        this.dropJewel(enemyX + offsetX, enemyY + offsetY, 2, 0.075);
                    }

                    // Elements no longer drop from enemies
                    // for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
                    //     const element = this.primaryElements[Math.floor(Math.random() * this.primaryElements.length)];
                    //     const offsetX = (Math.random() - 0.5) * 30;
                    //     const offsetY = (Math.random() - 0.5) * 30;
                    //     this.dropItemChest(enemyX + offsetX, enemyY + offsetY, 'element', { element: element });
                    // }

                    // 7.5% chance to drop muffin (reduced by 75%)
                    if (Math.random() < 0.075) {
                        this.dropItemChest(enemyX, enemyY, 'muffin');
                    }

                    this.enemiesKilled.elite++;
                    enemy.destroy();
                }
            });
        } else if (enemy.enemyType === 'golem') {
            // Mark as dying to prevent further updates
            enemy.isDying = true;
            // Play golem death animation
            try {
                enemy.play(`golem-${enemy.golemColor}-die`);
            } catch (e) {
                console.warn('Failed to play golem death animation:', e);
            }
            enemy.setVelocity(0, 0); // Stop movement
            enemy.isAttacking = false; // Cancel any attack

            // Store if this is a level-up golem
            const isLevelUpGolem = enemy.isLevelUpGolem;

            // Wait for animation to complete
            enemy.once('animationcomplete', () => {
                if (!enemy || !enemy.active) return; // Safety check
                if (isLevelUpGolem) {
                    // Level-up golems always drop charge expansion
                    this.dropItemChest(enemyX, enemyY, 'chargeExpansion');

                    // Also drop some valuable jewels as bonus
                    for (let i = 0; i < 5; i++) {
                        const offsetX = (Math.random() - 0.5) * 40;
                        const offsetY = (Math.random() - 0.5) * 40;
                        this.dropJewel(enemyX + offsetX, enemyY + offsetY, 4, 0.09); // 4 XP, medium-large size
                    }
                } else {
                    // Regular golem drops valuable gems
                    this.dropJewel(enemyX, enemyY, 4, 0.09);
                    this.dropJewel(enemyX + 20, enemyY, 4, 0.09);

                    // Elements no longer drop from enemies
                    // const element = this.primaryElements[Math.floor(Math.random() * this.primaryElements.length)];
                    // this.dropItemChest(enemyX, enemyY + 20, 'element', { element: element });

                    // 7.5% chance to drop muffin (reduced by 75%)
                    if (Math.random() < 0.075) {
                        this.dropItemChest(enemyX, enemyY - 20, 'muffin');
                    }
                }

                this.enemiesKilled.golem++;
                enemy.destroy();
            });
        } else if (enemy.enemyType === 'darkeye') {
            // Mark as dying to prevent further updates
            enemy.isDying = true;
            enemy.setVelocity(0, 0);
            
            // Clean up any effects immediately
            this.cleanupEnemyEffects(enemy);

            // Death effect - fade out with purple flash
            this.tweens.add({
                targets: enemy,
                alpha: 0,
                tint: 0x9933ff,
                duration: 500,
                onComplete: () => {
                    if (enemy.isLevelUpDarkEye) {
                        // Level-up dark eyes drop charge expansion
                        this.dropItemChest(enemyX, enemyY, 'chargeExpansion');

                        // Also drop some valuable jewels
                        for (let i = 0; i < 3; i++) {
                            const offsetX = (Math.random() - 0.5) * 40;
                            const offsetY = (Math.random() - 0.5) * 40;
                            this.dropJewel(enemyX + offsetX, enemyY + offsetY, 10, 0.12); // 10 XP, large size for level-up enemy
                        }
                    }

                    // Elements no longer drop from enemies
                    // const element = this.primaryElements[Math.floor(Math.random() * this.primaryElements.length)];
                    // this.dropItemChest(enemyX, enemyY + 20, 'element', { element: element });

                    // Drop 2-3 jewels - darkeye is a medium enemy
                    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
                        const offsetX = (Math.random() - 0.5) * 30;
                        const offsetY = (Math.random() - 0.5) * 30;
                        this.dropJewel(enemyX + offsetX, enemyY + offsetY, 3, 0.085); // 3 XP, slightly larger
                    }

                    if (!this.enemiesKilled.darkeye) this.enemiesKilled.darkeye = 0;
                    this.enemiesKilled.darkeye++;
                    enemy.destroy();
                }
            });
        } else {
            // Original tree enemy death animation - spin and fade
            this.tweens.add({
                targets: enemy,
                angle: 360,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    // Drop jewel
                    this.dropJewel(enemyX, enemyY, 2, 0.075);

                    // 1.25% chance to drop muffin (reduced by 75%)
                    if (Math.random() < 0.0125) {
                        this.dropItemChest(enemyX, enemyY + 20, 'muffin');
                    }

                    // Trees no longer drop elements

                    this.enemiesKilled[enemy.enemyType]++;
                    enemy.destroy();
                }
            });
        }
    }

    createOrbitingOrbs() {
        if (!this.textures.exists('water-orb')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x4444ff, 1);
            graphics.fillCircle(6, 6, 6);
            graphics.generateTexture('water-orb', 12, 12);
            graphics.destroy();
        }

        const currentTime = this.time.now;

        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i;
            const orb = this.add.sprite(
                this.wizard.x + Math.cos(angle) * 30,
                this.wizard.y + Math.sin(angle) * 30,
                'water-orb'
            );
            orb.startAngle = angle;
            orb.startTime = currentTime;
            orb.active = true;
            this.orbitingOrbs.push(orb);
        }
    }

    fireEnhancedProjectile(element) {
        const config = this.elementConfig[element];
        if (!config) return;

        // Create texture for this element if it doesn't exist
        const textureName = `${element}-proj`;
        if (!this.textures.exists(textureName)) {
            const graphics = this.add.graphics();
            graphics.fillStyle(config.color, 1);
            graphics.fillCircle(5, 5, 5);
            graphics.generateTexture(textureName, 10, 10);
            graphics.destroy();
        }

        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, textureName);
        projectile.element = element;
        projectile.damage = 1.5; // Enhanced damage for non-primary elements
        projectile.setDepth(5);

        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 280;
        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        this.projectiles.add(projectile);

        // Add particle trail
        const particles = this.add.particles(projectile.x, projectile.y, textureName, {
            scale: { start: 0.5, end: 0 },
            speed: { min: 20, max: 50 },
            quantity: 1,
            lifespan: 300,
            alpha: { start: 0.8, end: 0 },
            tint: config.color
        });

        projectile.particles = particles;

        // Update particle position
        projectile.updateParticles = () => {
            if (projectile.particles) {
                projectile.particles.x = projectile.x;
                projectile.particles.y = projectile.y;
            }
        };

        // Clean up particles when projectile is destroyed
        projectile.on('destroy', () => {
            if (projectile.particles) {
                projectile.particles.destroy();
            }
        });
    }

    fireBasicProjectile() {
        if (!this.textures.exists('basic-proj')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xcccccc, 1);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('basic-proj', 8, 8);
            graphics.destroy();
        }

        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'basic-proj');
        projectile.element = 'basic';
        projectile.damage = 1; // Increased from 0.5 to 1 for better balance
        projectile.body.setCollideWorldBounds(false);
        projectile.setDepth(5);

        this.projectiles.add(projectile);

        const speed = 350;
        const diagonalSpeed = speed / Math.sqrt(2); // Normalize diagonal speed

        const directions = {
            up: { x: 0, y: -speed },
            down: { x: 0, y: speed },
            left: { x: -speed, y: 0 },
            right: { x: speed, y: 0 },
            'up-left': { x: -diagonalSpeed, y: -diagonalSpeed },
            'up-right': { x: diagonalSpeed, y: -diagonalSpeed },
            'down-left': { x: -diagonalSpeed, y: diagonalSpeed },
            'down-right': { x: diagonalSpeed, y: diagonalSpeed }
        };

        const direction = this.wizard.lastDirection || 'down';
        const dir = directions[direction];
        if (!dir) {
            console.error(`Invalid direction: ${direction}`);
            const fallbackDir = directions['down'];
            projectile.setVelocity(fallbackDir.x, fallbackDir.y);
        } else {
            projectile.setVelocity(dir.x, dir.y);
        }
    }

    soulAttack(soul) {
        // Play attack animation
        soul.isAttacking = true;
        soul.setVelocity(0, 0); // Stop moving during attack
        soul.play('soul-attacking');

        // Fire projectile midway through animation
        this.time.delayedCall(400, () => {
            if (!soul || !soul.active || soul.isDying) return;

            // Create soul bullet projectile
            const angle = Phaser.Math.Angle.Between(soul.x, soul.y, this.wizard.x, this.wizard.y);
            const projectile = this.physics.add.sprite(soul.x, soul.y, 'soul-bullet');
            if (this.anims.exists('soul-bullet-anim')) {
                projectile.play('soul-bullet-anim');
            }
            projectile.setScale(0.5);
            projectile.isEnemyProjectile = true;
            projectile.damage = 5;
            projectile.setDepth(5);

            // Make it homing
            projectile.isHoming = true;
            projectile.homingSpeed = 150;
            projectile.homingTarget = this.wizard; // Target the wizard directly

            // Set initial velocity towards wizard
            projectile.setVelocity(
                Math.cos(angle) * projectile.homingSpeed,
                Math.sin(angle) * projectile.homingSpeed
            );

            // Add ghostly tint
            projectile.setTint(0x00ffff);

            // Add to enemy projectiles group
            if (!this.enemyProjectiles || !this.enemyProjectiles.children) {
                this.enemyProjectiles = this.physics.add.group();
            }
            this.enemyProjectiles.add(projectile);

            // Auto-destroy after 3 seconds
            this.time.delayedCall(3000, () => {
                if (projectile.active) {
                    projectile.destroy();
                }
            });
        });

        // Return to move animation after attack
        soul.once('animationcomplete', () => {
            if (soul && soul.active && !soul.isDying) {
                soul.isAttacking = false;
                soul.play('soul-moving');
            }
        });
    }

    darkeyeAttack(darkeye) {
        // Darkeye shoots multiple dark projectiles in a spread pattern
        darkeye.isAttacking = true;
        darkeye.setVelocity(0, 0); // Stop moving during attack
        
        // Fire multiple projectiles in a cone
        this.time.delayedCall(200, () => {
            if (!darkeye || !darkeye.active || darkeye.isDying) return;
            
            const baseAngle = Phaser.Math.Angle.Between(darkeye.x, darkeye.y, this.wizard.x, this.wizard.y);
            const spreadAngle = Math.PI / 6; // 30 degree spread
            
            // Fire 3 projectiles in a spread
            for (let i = -1; i <= 1; i++) {
                const angle = baseAngle + (i * spreadAngle / 2);
                
                // Create dark projectile
                const projectile = this.physics.add.sprite(darkeye.x, darkeye.y, 'arcane-spell');
                if (this.anims.exists('arcane-spell-anim')) {
                    projectile.play('arcane-spell-anim');
                }
                projectile.setScale(0.8);
                projectile.isEnemyProjectile = true;
                projectile.damage = 8; // High damage
                projectile.setDepth(5);
                projectile.setTint(0x9900ff); // Dark purple tint
                
                // Set velocity
                const speed = 200;
                projectile.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
                
                // Add to enemy projectiles group
                if (!this.enemyProjectiles || !this.enemyProjectiles.children) {
                    this.enemyProjectiles = this.physics.add.group();
                }
                this.enemyProjectiles.add(projectile);
                
                // Auto-destroy after 2 seconds
                this.time.delayedCall(2000, () => {
                    if (projectile.active) {
                        projectile.destroy();
                    }
                });
            }
        });
        
        // Return to normal after attack
        this.time.delayedCall(800, () => {
            if (darkeye && darkeye.active && !darkeye.isDying) {
                darkeye.isAttacking = false;
            }
        });
    }

    sorcererAttack(sorcerer) {
        // Sorcerer casts powerful arcane spells
        sorcerer.isAttacking = true;
        sorcerer.setVelocity(0, 0); // Stop moving during attack
        
        // Choose attack type randomly
        const attackType = Math.random();
        
        if (attackType < 0.5) {
            // Arcane barrage - rapid fire projectiles
            let projectileCount = 0;
            const fireProjectile = () => {
                if (!sorcerer || !sorcerer.active || sorcerer.isDying || projectileCount >= 5) return;
                
                const angle = Phaser.Math.Angle.Between(sorcerer.x, sorcerer.y, this.wizard.x, this.wizard.y);
                const randomSpread = (Math.random() - 0.5) * 0.3; // Small random spread
                
                // Create arcane projectile
                const projectile = this.physics.add.sprite(sorcerer.x, sorcerer.y, 'arcane-spell');
                if (this.anims.exists('arcane-spell-anim')) {
                    projectile.play('arcane-spell-anim');
                }
                projectile.setScale(1.0);
                projectile.isEnemyProjectile = true;
                projectile.damage = 6;
                projectile.setDepth(5);
                projectile.setTint(0xff00ff); // Magenta tint for sorcerer
                
                // Set velocity with slight spread
                const speed = 250;
                projectile.setVelocity(
                    Math.cos(angle + randomSpread) * speed,
                    Math.sin(angle + randomSpread) * speed
                );
                
                // Add to enemy projectiles group
                if (!this.enemyProjectiles || !this.enemyProjectiles.children) {
                    this.enemyProjectiles = this.physics.add.group();
                }
                this.enemyProjectiles.add(projectile);
                
                // Auto-destroy after 2 seconds
                this.time.delayedCall(2000, () => {
                    if (projectile.active) {
                        projectile.destroy();
                    }
                });
                
                projectileCount++;
                
                // Fire next projectile
                if (projectileCount < 5) {
                    this.time.delayedCall(150, fireProjectile);
                }
            };
            
            // Start firing after short delay
            this.time.delayedCall(300, fireProjectile);
            
        } else {
            // Arcane explosion - area attack around wizard
            this.time.delayedCall(500, () => {
                if (!sorcerer || !sorcerer.active || sorcerer.isDying) return;
                
                // Create warning circle at wizard position
                const warningCircle = this.add.circle(this.wizard.x, this.wizard.y, 100, 0xff00ff, 0.3);
                warningCircle.setDepth(4);
                
                // Pulse warning
                this.tweens.add({
                    targets: warningCircle,
                    scale: { from: 0.8, to: 1.2 },
                    alpha: { from: 0.3, to: 0.6 },
                    duration: 300,
                    yoyo: true,
                    repeat: 2
                });
                
                // Explosion after delay
                this.time.delayedCall(1000, () => {
                    if (!this.wizard || !this.wizard.active) return;
                    
                    // Create explosion effect
                    const explosion = this.add.circle(this.wizard.x, this.wizard.y, 10, 0xff00ff, 0.8);
                    explosion.setDepth(5);
                    
                    this.tweens.add({
                        targets: explosion,
                        scale: { from: 0.1, to: 10 },
                        alpha: { from: 0.8, to: 0 },
                        duration: 300,
                        onComplete: () => {
                            explosion.destroy();
                            warningCircle.destroy();
                        }
                    });
                    
                    // Deal damage if wizard is in range
                    const distance = Phaser.Math.Distance.Between(explosion.x, explosion.y, this.wizard.x, this.wizard.y);
                    if (distance < 100) {
                        this.damagePlayer(10);
                    }
                });
            });
        }
        
        // Return to normal after attack
        this.time.delayedCall(2000, () => {
            if (sorcerer && sorcerer.active && !sorcerer.isDying) {
                sorcerer.isAttacking = false;
            }
        });
    }

    summonMinions(summoner) {
        // Play summoning animation
        summoner.play('summoner-summoning');
        summoner.isSummoning = true;

        // Store original body offset
        const originalOffsetX = summoner.body.offset.x;
        const originalOffsetY = summoner.body.offset.y;

        // Adjust body offset for summon animation (character shifts in the sprite)
        summoner.body.setOffset(originalOffsetX, originalOffsetY);

        // Return to idle after summon animation completes
        summoner.once('animationcomplete', () => {
            summoner.play('summoner-idling');
            summoner.isSummoning = false;
            // Restore original body offset
            summoner.body.setOffset(originalOffsetX, originalOffsetY);
        });

        // Create purple summoning effect
        const summonEffect = this.add.circle(summoner.x, summoner.y, 30, 0xff44ff, 0.6);
        summonEffect.setDepth(10);

        this.tweens.add({
            targets: summonEffect,
            scale: { from: 1, to: 3 },
            alpha: { from: 0.8, to: 0 },
            duration: 500,
            onComplete: () => summonEffect.destroy()
        });

        // Summon 2-3 bat minions around the summoner
        const minionsToSummon = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < minionsToSummon; i++) {
            const angle = (Math.PI * 2 / minionsToSummon) * i;
            const distance = 60;
            const spawnX = summoner.x + Math.cos(angle) * distance;
            const spawnY = summoner.y + Math.sin(angle) * distance;

            // Spawn a bat minion
            const bat = this.physics.add.sprite(spawnX, spawnY, 'bat-fly', 0);
            bat.setScale(0.6); // Smaller than regular bats
            bat.health = 2; // Increased by 50%
            bat.maxHealth = bat.health;
            bat.enemyType = 'bat';
            // Play animation with safety check
            try {
                if (this.anims.exists('bat-flying')) {
                    bat.play('bat-flying');
                } else {
                    console.warn('bat-flying animation does not exist');
                }
            } catch (e) {
                console.warn('Failed to play bat flying animation:', e);
            }
            bat.body.setSize(60, 40);
            bat.body.setOffset(45, 55);
            bat.moveSpeed = 90; // Slightly faster than regular bats
            bat.isFlying = true;
            bat.isSummoned = true; // Mark as summoned

            // Add spawn effect for each minion
            const spawnPoof = this.add.circle(spawnX, spawnY, 20, 0xff44ff, 0.6);
            spawnPoof.setDepth(10);
            this.tweens.add({
                targets: spawnPoof,
                scale: { from: 0, to: 1.5 },
                alpha: { from: 1, to: 0 },
                duration: 300,
                onComplete: () => spawnPoof.destroy()
            });

            this.enemies.add(bat);
        }
    }

    fireSorcererProjectile(sorcerer) {
        // Safety check - ensure sorcerer is valid and active
        if (!sorcerer || !sorcerer.active || sorcerer.isDying) return;

        // Create dark purple projectile texture if not exists (larger size)
        if (!this.textures.exists('sorcerer-proj')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x6633ff, 1);
            graphics.fillCircle(12, 12, 12); // Doubled size
            graphics.fillStyle(0x9966ff, 1);
            graphics.fillCircle(12, 12, 6); // Doubled size
            graphics.generateTexture('sorcerer-proj', 24, 24); // Doubled size
            graphics.destroy();
        }

        // Calculate base angle to wizard
        const baseAngle = Phaser.Math.Angle.Between(sorcerer.x, sorcerer.y, this.wizard.x, this.wizard.y);
        const speed = 20; // 50% slower than before (was 40)

        // Create two projectiles with slight angle offset
        for (let i = 0; i < 2; i++) {
            const projectile = this.physics.add.sprite(sorcerer.x, sorcerer.y - 10, 'sorcerer-proj');
            projectile.isEnemyProjectile = true;
            projectile.damage = 10;
            projectile.body.setCollideWorldBounds(false);
            projectile.setDepth(5);
            projectile.setScale(1); // Keep normal scale since texture is already larger

            // Store spiral data
            projectile.spiralAngle = i * Math.PI; // Start 180 degrees apart
            projectile.spiralRadius = 0;
            projectile.baseAngle = baseAngle;
            projectile.centerX = sorcerer.x;
            projectile.centerY = sorcerer.y - 10;
            projectile.spiralSpeed = 0.02; // Much smaller spiral expansion

            // Initial velocity
            projectile.setVelocity(
                Math.cos(baseAngle) * speed,
                Math.sin(baseAngle) * speed
            );

            // Add purple glow effect
            this.tweens.add({
                targets: projectile,
                scale: { from: 0.8, to: 1.2 },
                alpha: { from: 1, to: 0.6 },
                duration: 400,
                yoyo: true,
                repeat: -1
            });

            // Update function for spiral movement
            projectile.update = (time, delta) => {
                if (!projectile.active) return;

                // Increase spiral angle and radius
                projectile.spiralAngle += 0.08; // Slower rotation for tighter spiral
                projectile.spiralRadius += projectile.spiralSpeed * delta;

                // Calculate spiral offset
                const spiralX = Math.cos(projectile.spiralAngle) * projectile.spiralRadius;
                const spiralY = Math.sin(projectile.spiralAngle) * projectile.spiralRadius;

                // Update center position based on base velocity
                projectile.centerX += Math.cos(projectile.baseAngle) * speed * delta / 1000;
                projectile.centerY += Math.sin(projectile.baseAngle) * speed * delta / 1000;

                // Set actual position
                projectile.x = projectile.centerX + spiralX;
                projectile.y = projectile.centerY + spiralY;

                // Rotate projectile
                projectile.rotation += 0.2;
            };

            // Add to projectiles group for collision detection
            if (!this.enemyProjectiles || !this.enemyProjectiles.children) {
                this.enemyProjectiles = this.physics.add.group();

                // Set up collision with wizard
                this.physics.add.overlap(this.wizard, this.enemyProjectiles, (wizard, projectile) => {
                    if (!this.invulnerable) {
                        this.playerHealth -= projectile.damage;
                        this.updateHealthBar();
                        this.updateWizardHealthBar();

                        // Flash red when hit
                        this.wizard.setTint(0xff0000);
                        this.time.delayedCall(100, () => {
                            this.wizard.clearTint();
                        });

                        // Brief invulnerability
                        this.invulnerable = true;
                        this.time.delayedCall(500, () => {
                            this.invulnerable = false;
                        });

                        if (this.playerHealth <= 0) {
                            // Stop background music
                            if (this.bgMusic) {
                                this.bgMusic.stop();
                            }
                            
                            // Play death animation
                            this.wizard.play('wizard-death');
                            this.wizard.setVelocity(0, 0); // Stop movement

                            // Wait for death animation to complete
                            this.wizard.once('animationcomplete', () => {
                                // Clear any pending timers before changing scene
                                this.time.removeAllEvents();
                                this.tweens.killAll();
                                this.scene.start('GameOverScene', {
                                    survivalTime: this.survivalTime,
                                    enemiesKilled: this.enemiesKilled,
                                    itemsCollected: this.itemsCollected,
                                    won: false
                                });
                            });
                        }
                    }

                    projectile.destroy();
                });
            }

            this.enemyProjectiles.add(projectile);

            // Store in a list for updating
            if (!this.spiralProjectiles) {
                this.spiralProjectiles = [];
            }
            this.spiralProjectiles.push(projectile);

            // Destroy projectile after 6 seconds
            this.time.delayedCall(6000, () => {
                if (projectile.active) {
                    const index = this.spiralProjectiles.indexOf(projectile);
                    if (index > -1) {
                        this.spiralProjectiles.splice(index, 1);
                    }
                    projectile.destroy();
                }
            });
        }
    }

    fireProjectile() {
        const elementCounts = { fire: 0, lightning: 0, water: 0, earth: 0 };
        this.charges.forEach(charge => {
            elementCounts[charge]++;
        });

        let dominantElement = 'fire';
        let maxCount = 0;
        Object.keys(elementCounts).forEach(element => {
            if (elementCounts[element] > maxCount) {
                maxCount = elementCounts[element];
                dominantElement = element;
            }
        });

        const colors = { fire: 0xff4444, lightning: 0xffff44, water: 0x4444ff, earth: 0x44ff44 };
        const chargeCount = this.charges.length;
        const projectileSize = 6 + (chargeCount - 1) * 3; // Scale size with charges

        const textureKey = dominantElement + '-proj-' + chargeCount;
        if (!this.textures.exists(textureKey)) {
            const graphics = this.add.graphics();
            graphics.fillStyle(colors[dominantElement], 1);
            graphics.fillCircle(projectileSize, projectileSize, projectileSize);
            graphics.generateTexture(textureKey, projectileSize * 2, projectileSize * 2);
            graphics.destroy();
        }

        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, textureKey);
        projectile.element = dominantElement;
        projectile.power = chargeCount;
        projectile.damage = chargeCount; // Damage scales with charge count
        projectile.body.setCollideWorldBounds(false);
        projectile.setDepth(5);

        // Check if all charges are the same element for bonus effect
        projectile.isPureElement = maxCount === chargeCount && chargeCount > 1;

        this.projectiles.add(projectile);

        const baseSpeed = 400;
        const speed = baseSpeed - (chargeCount - 1) * 50; // Slightly slower for larger projectiles
        const diagonalSpeed = speed / Math.sqrt(2); // Normalize diagonal speed

        const directions = {
            up: { x: 0, y: -speed },
            down: { x: 0, y: speed },
            left: { x: -speed, y: 0 },
            right: { x: speed, y: 0 },
            'up-left': { x: -diagonalSpeed, y: -diagonalSpeed },
            'up-right': { x: diagonalSpeed, y: -diagonalSpeed },
            'down-left': { x: -diagonalSpeed, y: diagonalSpeed },
            'down-right': { x: diagonalSpeed, y: diagonalSpeed }
        };

        const dir = directions[this.wizard.lastDirection || 'down'];
        projectile.setVelocity(dir.x, dir.y);

        // Add particle trail for pure element projectiles
        if (projectile.isPureElement) {
            this.time.addEvent({
                delay: 50,
                callback: () => {
                    if (projectile.active) {
                        const particle = this.add.circle(projectile.x, projectile.y, 3, colors[dominantElement], 0.5);
                        particle.setDepth(4);
                        this.tweens.add({
                            targets: particle,
                            scale: 0,
                            alpha: 0,
                            duration: 300,
                            onComplete: () => particle.destroy()
                        });
                    }
                },
                loop: true
            });
        }
    }

    projectileHitObstacle(projectile, obstacle) {
        // Destroy projectile when it hits an obstacle
        if (projectile.active) {
            // Create hit effect
            const hitEffect = this.add.circle(projectile.x, projectile.y, 8, 0xffffff, 0.6);
            hitEffect.setDepth(100);
            this.tweens.add({
                targets: hitEffect,
                scale: { from: 1, to: 0 },
                alpha: { from: 0.6, to: 0 },
                duration: 200,
                onComplete: () => hitEffect.destroy()
            });
            
            projectile.destroy();
        }
    }

    setEnemyDepth(enemy) {
        // Ensure enemy is always visible above floor
        // Add offset to handle negative Y coordinates
        const depth = Math.max(1, Math.floor((enemy.y + 1000) / 10));
        enemy.setDepth(depth);
    }
    
    applyHexCurse(enemy, duration) {
        // Apply hex curse to enemy for specified duration
        if (!enemy.isHexed && enemy.active && !enemy.isDying) {
            enemy.isHexed = true;
            enemy.originalDamage = enemy.damage || 1; // Store original damage
            enemy.damage = 0; // Hexed enemies deal no damage
            
            // Visual indicator - purple tint and hex symbol
            enemy.setTint(0x9932cc);
            
            // Add hex symbol above enemy
            const hexSymbol = this.add.text(enemy.x, enemy.y - 30, '⬢', {
                fontSize: '16px',
                color: '#9932cc',
                stroke: '#000000',
                strokeThickness: 2
            });
            hexSymbol.setOrigin(0.5);
            hexSymbol.setDepth(enemy.depth + 1);
            
            // Make hex symbol follow enemy
            enemy.hexSymbol = hexSymbol;
            enemy.hexFollowUpdate = () => {
                if (enemy.active && hexSymbol.active) {
                    hexSymbol.x = enemy.x;
                    hexSymbol.y = enemy.y - 30;
                    hexSymbol.setDepth(enemy.depth + 1);
                } else if (!enemy.active && hexSymbol.active) {
                    hexSymbol.destroy();
                }
            };
            
            // Add glow effect
            const hexGlow = this.add.graphics();
            hexGlow.lineStyle(2, 0x9932cc, 0.5);
            hexGlow.strokeCircle(0, 0, 20);
            hexGlow.setDepth(enemy.depth - 1);
            enemy.hexGlow = hexGlow;
            
            // Update glow position
            enemy.hexGlowUpdate = () => {
                if (enemy.active && hexGlow.active) {
                    hexGlow.x = enemy.x;
                    hexGlow.y = enemy.y;
                    hexGlow.setDepth(enemy.depth - 1);
                } else if (!enemy.active && hexGlow.active) {
                    hexGlow.destroy();
                }
            };
            
            // Set up hex removal after duration
            if (duration && duration > 0) {
                this.time.delayedCall(duration, () => {
                    this.removeHexCurse(enemy);
                });
            }
        }
    }
    
    removeHexCurse(enemy) {
        // Remove hex curse from enemy
        if (enemy && enemy.isHexed) {
            enemy.isHexed = false;
            enemy.damage = enemy.originalDamage || 1; // Restore original damage
            enemy.clearTint(); // Remove purple tint
            
            // Clean up hex visual elements
            if (enemy.hexSymbol) {
                enemy.hexSymbol.destroy();
                enemy.hexSymbol = null;
            }
            if (enemy.hexGlow) {
                enemy.hexGlow.destroy();
                enemy.hexGlow = null;
            }
            enemy.hexFollowUpdate = null;
            enemy.hexGlowUpdate = null;
        }
    }
    
    updateHexedEnemies() {
        // Update hex visuals for all hexed enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && enemy.isHexed) {
                if (enemy.hexFollowUpdate) {
                    enemy.hexFollowUpdate();
                }
                if (enemy.hexGlowUpdate) {
                    enemy.hexGlowUpdate();
                }
            }
        });
    }

    spawnEnemy() {
        // Spawn enemies just outside viewport
        const camera = this.cameras.main;
        const viewportWidth = camera.width;
        const viewportHeight = camera.height;
        const spawnMargin = 50; // How far outside viewport to spawn

        // Calculate spawn position outside current viewport
        const side = Phaser.Math.Between(0, 3); // 0=top, 1=right, 2=bottom, 3=left
        let x, y;

        switch (side) {
            case 0: // Top
                x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                y = camera.scrollY - spawnMargin;
                break;
            case 1: // Right
                x = camera.scrollX + viewportWidth + spawnMargin;
                y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                break;
            case 2: // Bottom
                x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                y = camera.scrollY + viewportHeight + spawnMargin;
                break;
            case 3: // Left
                x = camera.scrollX - spawnMargin;
                y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                break;
        }

        // No clamping - infinite world!
        // Enemies can spawn anywhere around the player

        // Randomly choose between enemy types based on stage
        const rand = Math.random();
        let enemyType;
        
        if (this.stage === 'cave') {
            // Cave enemies: slimes, lost souls, bats, golems, dark eyes, sorcerer (rare)
            if (rand < 0.25) {
                enemyType = 'slime'; // 25%
            } else if (rand < 0.45) {
                enemyType = 'soul'; // 20%
            } else if (rand < 0.65) {
                enemyType = 'bat'; // 20%
            } else if (rand < 0.82) {
                enemyType = 'golem'; // 17%
            } else if (rand < 0.95) {
                enemyType = 'darkeye'; // 13%
            } else {
                enemyType = 'sorcerer'; // 5% - rare boss enemy
            }
        } else {
            // Forest enemies: trees, mushrooms, bats, bloboids, summoners, sorcerer (rare)
            if (rand < 0.25) {
                enemyType = 'tree'; // 25%
            } else if (rand < 0.45) {
                enemyType = 'mushroom'; // 20%
            } else if (rand < 0.65) {
                enemyType = 'bat'; // 20%
            } else if (rand < 0.82) {
                enemyType = 'bloboid'; // 17%
            } else if (rand < 0.95) {
                enemyType = 'summoner'; // 13%
            } else {
                enemyType = 'sorcerer'; // 5% - rare boss enemy
            }
        }

        if (enemyType === 'tree') {
            const enemy = this.physics.add.sprite(x, y, 'enemy-walk', 0);
            const scaleFactor = 1.2;
            enemy.setScale(scaleFactor);
            enemy.health = 4; // Reduced by 60% from 9
            enemy.maxHealth = enemy.health;
            enemy.enemyType = 'tree';
            enemy.moveSpeed = 36; // Reduced by 25% from 48
            enemy.play('enemy-walking');
            enemy.body.setSize(26, 39); // Widened by 30%
            enemy.body.setOffset(3, 12); // Adjusted offset for wider hitbox
            this.setEnemyDepth(enemy); // Set initial depth
            this.enemies.add(enemy);
        } else if (enemyType === 'bat') {
            // Spawn 2 bat enemies at once
            for (let i = 0; i < 2; i++) {
                // Slightly offset each bat spawn position
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                const batX = Phaser.Math.Clamp(x + offsetX, 50, 3950);
                const batY = Phaser.Math.Clamp(y + offsetY, 50, 2110);

                const bat = this.physics.add.sprite(batX, batY, 'bat-fly', 0);
                bat.setScale(0.8); // 2x larger than 0.4
                bat.health = 2; // Increased by 50% // Bats have only 1 health
                bat.maxHealth = bat.health;
                bat.enemyType = 'bat';
                // Play animation with safety check
            try {
                if (this.anims.exists('bat-flying')) {
                    bat.play('bat-flying');
                } else {
                    console.warn('bat-flying animation does not exist');
                }
            } catch (e) {
                console.warn('Failed to play bat flying animation:', e);
            }
                bat.body.setSize(60, 40);
                bat.body.setOffset(45, 55);
                bat.moveSpeed = 80; // Bats are faster than trees
                bat.isFlying = true; // Bats can fly over obstacles
                this.setEnemyDepth(bat); // Set initial depth
                this.enemies.add(bat);
            }
        }
        if (enemyType === 'mushroom') {
            const mushroom = this.physics.add.sprite(x, y, 'mushroom-run', 0);
            mushroom.setScale(0.7); // Scale to appropriate size
            // mushroom.setFlipY(true); // Removed - no need to flip
            mushroom.health = 5; // Increased by 50% // Medium health
            mushroom.maxHealth = mushroom.health;
            mushroom.enemyType = 'mushroom';
            mushroom.moveSpeed = 50; // Medium speed
            // Play animation with safety check
            try {
                if (this.anims.exists('mushroom-running')) {
                    mushroom.play('mushroom-running');
                } else {
                    console.warn('mushroom-running animation does not exist');
                }
            } catch (e) {
                console.warn('Failed to play mushroom running animation:', e);
            }
            mushroom.body.setSize(80, 30);  // Adjusted height for smaller sprite
            mushroom.body.setOffset(35, 8);  // Adjusted offset for smaller sprite
            this.enemies.add(mushroom);
        } else if (enemyType === 'fireworm') {
            const fireworm = this.physics.add.sprite(x, y, 'fireworm-walk', 0);
            fireworm.setScale(1.2); // Scale up slightly
            fireworm.health = 3; // Increased by 50% // Low-medium health
            fireworm.maxHealth = fireworm.health;
            fireworm.enemyType = 'fireworm';
            fireworm.moveSpeed = 65; // Fast
            // Play animation with safety check
            try {
                if (this.anims.exists('fireworm-walking')) {
                    fireworm.play('fireworm-walking');
                } else {
                    console.warn('fireworm-walking animation does not exist');
                }
            } catch (e) {
                console.warn('Failed to play fireworm walking animation:', e);
            }
            fireworm.body.setSize(70, 50);
            fireworm.body.setOffset(10, 20);
            fireworm.element = 'fire'; // Fire worms have fire element
            this.enemies.add(fireworm);
        } else if (enemyType === 'summoner') {
            const summoner = this.physics.add.sprite(x, y, 'summoner-idle', 0);
            summoner.setScale(1.5); // Scale to appropriate size
            summoner.health = 12; // Increased by 50% // High health
            summoner.maxHealth = summoner.health;
            summoner.enemyType = 'summoner';
            summoner.moveSpeed = 20; // Very slow
            summoner.play('summoner-idling');
            summoner.body.setSize(40, 60);
            summoner.body.setOffset(20, 10);
            summoner.lastSummonTime = 0;
            summoner.summonCooldown = 5000; // Summon every 5 seconds
            summoner.element = 'arcane'; // Arcane element
            this.enemies.add(summoner);
        } else if (enemyType === 'soul') {
            const soul = this.physics.add.sprite(x, y, 'soul-move', 0);
            soul.setScale(0.8);
            soul.health = 6; // Increased by 50% // Medium health
            soul.maxHealth = soul.health;
            soul.enemyType = 'soul';
            soul.moveSpeed = 40; // Slow floating speed
            soul.play('soul-moving');
            soul.body.setSize(60, 60);
            soul.body.setOffset(18, 18);
            soul.isFlying = true; // Souls float
            soul.attackRange = 150; // Short attack range
            soul.attackCooldown = 2000; // Attack every 2 seconds
            soul.lastAttackTime = 0;
            soul.element = 'arcane'; // Arcane element like ghosts
            this.enemies.add(soul);
        } else if (enemyType === 'bloboid') {
            const bloboid = this.physics.add.sprite(x, y, 'bloboid-walk', 0);
            bloboid.setScale(1.5); // Scale up from small sprite
            bloboid.setFlipX(true); // Flip bloboid horizontally
            bloboid.setFlipY(true); // Reverse vertical facing
            bloboid.health = 8; // Increased by 50% // Medium-high health
            bloboid.maxHealth = bloboid.health;
            bloboid.enemyType = 'bloboid';
            bloboid.moveSpeed = 35; // Slow blob movement
            bloboid.play('bloboid-walking');
            bloboid.body.setSize(50, 30);
            bloboid.body.setOffset(15, 2);
            bloboid.element = 'earth'; // Earth element for blob
            this.enemies.add(bloboid);
        } else if (enemyType === 'slime') {
            // Create slime enemy
            const slime = this.physics.add.sprite(x, y, 'slime-idle', 0);
            slime.setScale(1.0);
            slime.health = 4; // Increased by 50%
            slime.maxHealth = slime.health;
            slime.enemyType = 'slime';
            slime.moveSpeed = 30; // Slow
            slime.play('slime-idle');
            slime.body.setSize(40, 40);
            slime.body.setOffset(10, 10);
            slime.generation = 0; // For splitting mechanic
            this.enemies.add(slime);
        } else if (enemyType === 'golem') {
            // Randomly choose golem color
            const golemColor = Math.random() < 0.5 ? 'orange' : 'blue';
            const golem = this.physics.add.sprite(x, y, `golem-${golemColor}-walk`, 0);
            golem.setScale(1.5);
            golem.health = 15; // Increased by 50% - Very high health
            golem.maxHealth = golem.health;
            golem.enemyType = 'golem';
            golem.golemColor = golemColor;
            golem.moveSpeed = 25; // Very slow but tanky
            golem.play(`golem-${golemColor}-walk`);
            golem.body.setSize(60, 50);
            golem.body.setOffset(15, 10);
            golem.element = golemColor === 'orange' ? 'fire' : 'water';
            this.enemies.add(golem);
        } else if (enemyType === 'darkeye') {
            // Create dark eye enemy
            const darkeye = this.physics.add.sprite(x, y, 'darkeye-walk', 0);
            darkeye.setScale(0.8);
            darkeye.health = 20; // Increased by 50% - Boss-level health
            darkeye.maxHealth = darkeye.health;
            darkeye.enemyType = 'darkeye';
            darkeye.moveSpeed = 45; // Medium speed
            darkeye.play('darkeye-walking');
            darkeye.body.setSize(80, 80);
            darkeye.body.setOffset(40, 30);
            darkeye.element = 'arcane'; // Powerful arcane enemy
            darkeye.attackRange = 200;
            darkeye.attackCooldown = 3000;
            darkeye.lastAttackTime = 0;
            this.enemies.add(darkeye);
        } else if (enemyType === 'sorcerer') {
            // Create sorcerer boss enemy
            const sorcerer = this.physics.add.sprite(x, y, 'sorcerer-attack-0');
            sorcerer.setScale(1.5); // Large boss size
            sorcerer.health = 30; // Very high health - boss enemy
            sorcerer.maxHealth = sorcerer.health;
            sorcerer.enemyType = 'sorcerer';
            sorcerer.moveSpeed = 30; // Slow but powerful
            sorcerer.play('sorcerer-attack');
            sorcerer.body.setSize(60, 80);
            sorcerer.body.setOffset(10, 0);
            sorcerer.element = 'arcane'; // Powerful magic user
            sorcerer.attackRange = 250; // Long range attacks
            sorcerer.attackCooldown = 2500; // Attacks frequently
            sorcerer.lastAttackTime = 0;
            sorcerer.isBoss = true; // Mark as boss enemy
            this.setEnemyDepth(sorcerer); // Set initial depth
            this.enemies.add(sorcerer);
        }
    }

    spawnWaveEnemy(waveDef) {
        // Choose enemy type based on wave definition weights
        let totalWeight = 0;
        waveDef.enemies.forEach(e => totalWeight += e.weight);

        let random = Math.random() * totalWeight;
        let selectedEnemy = null;

        for (const enemy of waveDef.enemies) {
            random -= enemy.weight;
            if (random <= 0) {
                selectedEnemy = enemy;
                break;
            }
        }

        if (selectedEnemy) {
            // Spawn the specified count of this enemy type
            for (let i = 0; i < selectedEnemy.count; i++) {
                this.spawnSpecificEnemy(selectedEnemy.type);
            }
        }
    }

    spawnSpecificEnemy(enemyType) {
        // Get spawn position outside viewport
        const camera = this.cameras.main;
        const viewportWidth = camera.width;
        const viewportHeight = camera.height;
        const spawnMargin = 50;

        // Randomly choose which side to spawn from
        const side = Phaser.Math.Between(0, 3);
        let x, y;

        switch (side) {
            case 0: // Top
                x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                y = camera.scrollY - spawnMargin;
                break;
            case 1: // Right
                x = camera.scrollX + viewportWidth + spawnMargin;
                y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                break;
            case 2: // Bottom
                x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                y = camera.scrollY + viewportHeight + spawnMargin;
                break;
            case 3: // Left
                x = camera.scrollX - spawnMargin;
                y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                break;
        }

        // Clamp to world bounds
        x = Phaser.Math.Clamp(x, 50, 3950);
        y = Phaser.Math.Clamp(y, 50, 2110);

        // Create the specific enemy type
        this.createEnemy(enemyType, x, y);
    }

    createEnemy(enemyType, x, y) {
        if (enemyType === 'tree') {
            const enemy = this.physics.add.sprite(x, y, 'enemy-walk', 0);
            const scaleFactor = 1.2;
            enemy.setScale(scaleFactor);
            enemy.health = 9; // Increased by 50%
            enemy.maxHealth = enemy.health;
            enemy.enemyType = 'tree';
            enemy.moveSpeed = 36;
            enemy.damage = 1; // Default damage
            enemy.play('enemy-walking');
            enemy.body.setSize(26, 39);
            enemy.body.setOffset(3, 12);
            this.enemies.add(enemy);
        } else if (enemyType === 'bat') {
            const bat = this.physics.add.sprite(x, y, 'bat-fly', 0);
            bat.setScale(0.8);
            bat.health = 2; // Increased by 50%
            bat.maxHealth = bat.health;
            bat.enemyType = 'bat';
            bat.body.setSize(60, 40);
            bat.body.setOffset(45, 55);
            bat.moveSpeed = 80;
            bat.isFlying = true;
            this.enemies.add(bat);
            
            // Play animation with safety check after all properties are set
            this.time.delayedCall(10, () => {
                try {
                    if (bat && bat.active && bat.anims && this.anims.exists('bat-flying')) {
                        bat.play('bat-flying');
                    } else if (!this.anims.exists('bat-flying')) {
                        console.warn('bat-flying animation does not exist');
                    }
                } catch (e) {
                    console.warn('Failed to play bat flying animation:', e);
                }
            });
        } else if (enemyType === 'mushroom') {
            const mushroom = this.physics.add.sprite(x, y, 'mushroom-run', 0);
            mushroom.setScale(0.7);
            mushroom.setFlipY(true); // Reverse vertical facing
            mushroom.health = 5; // Increased by 50%
            mushroom.maxHealth = mushroom.health;
            mushroom.enemyType = 'mushroom';
            mushroom.moveSpeed = 50;
            mushroom.body.setSize(80, 30);  // Adjusted height for smaller sprite
            mushroom.body.setOffset(35, 8);  // Adjusted offset for smaller sprite
            this.enemies.add(mushroom);
            
            // Play animation with safety check after all properties are set
            this.time.delayedCall(10, () => {
                try {
                    if (mushroom && mushroom.active && mushroom.anims && this.anims.exists('mushroom-running')) {
                        mushroom.play('mushroom-running');
                    } else if (!this.anims.exists('mushroom-running')) {
                        console.warn('mushroom-running animation does not exist');
                    }
                } catch (e) {
                    console.warn('Failed to play mushroom running animation:', e);
                }
            });
        } else if (enemyType === 'fireworm') {
            const fireworm = this.physics.add.sprite(x, y, 'fireworm-walk', 0);
            fireworm.setScale(1.2);
            fireworm.health = 3; // Increased by 50%
            fireworm.maxHealth = fireworm.health;
            fireworm.enemyType = 'fireworm';
            fireworm.moveSpeed = 65;
            fireworm.body.setSize(70, 50);
            fireworm.body.setOffset(10, 20);
            fireworm.element = 'fire';
            this.enemies.add(fireworm);
            
            // Play animation with safety check after all properties are set
            this.time.delayedCall(10, () => {
                try {
                    if (fireworm && fireworm.active && fireworm.anims && this.anims.exists('fireworm-walking')) {
                        fireworm.play('fireworm-walking');
                    } else if (!this.anims.exists('fireworm-walking')) {
                        console.warn('fireworm-walking animation does not exist');
                    }
                } catch (e) {
                    console.warn('Failed to play fireworm walking animation:', e);
                }
            });
        } else if (enemyType === 'summoner') {
            const summoner = this.physics.add.sprite(x, y, 'summoner-walk', 0);
            summoner.setScale(0.8);
            summoner.health = 12; // Increased by 50%
            summoner.maxHealth = summoner.health;
            summoner.enemyType = 'summoner';
            summoner.moveSpeed = 20;
            summoner.play('summoner-walking');
            summoner.body.setSize(80, 100);
            summoner.body.setOffset(40, 20);
            summoner.lastSummonTime = 0;
            summoner.summonCooldown = 5000;
            summoner.isSummoning = false;
            this.enemies.add(summoner);
        } else if (enemyType === 'soul') {
            const soul = this.physics.add.sprite(x, y, 'soul-move', 0);
            soul.setScale(0.8);
            soul.health = 6; // Increased by 50%
            soul.maxHealth = soul.health;
            soul.enemyType = 'soul';
            soul.moveSpeed = 40;
            soul.play('soul-moving');
            soul.body.setSize(60, 60);
            soul.body.setOffset(18, 18);
            soul.isFlying = true;
            soul.attackRange = 150;
            soul.attackCooldown = 2000;
            soul.lastAttackTime = 0;
            soul.element = 'arcane';
            this.enemies.add(soul);
        } else if (enemyType === 'bloboid') {
            const bloboid = this.physics.add.sprite(x, y, 'bloboid-walk', 0);
            bloboid.setScale(1.5);
            bloboid.setFlipX(true);
            bloboid.setFlipY(true); // Reverse vertical facing
            bloboid.health = 8; // Increased by 50%
            bloboid.maxHealth = bloboid.health;
            bloboid.enemyType = 'bloboid';
            bloboid.moveSpeed = 35;
            bloboid.play('bloboid-walking');
            bloboid.body.setSize(50, 30);
            bloboid.body.setOffset(15, 2);
            bloboid.element = 'earth';
            this.enemies.add(bloboid);
        } else if (enemyType === 'slime') {
            const slime = this.physics.add.sprite(x, y, 'slime-idle', 0);
            slime.setScale(1.0);
            slime.health = 4; // Increased by 50%
            slime.maxHealth = slime.health;
            slime.enemyType = 'slime';
            slime.moveSpeed = 30;
            slime.play('slime-idle');
            slime.body.setSize(40, 40);
            slime.body.setOffset(10, 10);
            slime.generation = 0;
            this.enemies.add(slime);
        } else if (enemyType === 'fireslime') {
            const slime = this.physics.add.sprite(x, y, 'slime-idle', 0);
            slime.setScale(1.0);
            slime.setTint(0xff4444); // Red tint for fire slime
            slime.health = 5; // Slightly more health than regular slime
            slime.maxHealth = slime.health;
            slime.enemyType = 'fireslime';
            slime.moveSpeed = 35; // Slightly faster
            slime.play('slime-idle');
            slime.body.setSize(40, 40);
            slime.body.setOffset(10, 10);
            slime.generation = 0;
            slime.burnDamage = 2; // Applies burn on contact
            slime.burnDuration = 3000; // 3 seconds
            this.enemies.add(slime);
        } else if (enemyType === 'golem') {
            const golemColor = Math.random() < 0.5 ? 'orange' : 'blue';
            const golem = this.physics.add.sprite(x, y, `golem-${golemColor}-walk`, 0);
            golem.setScale(1.5);
            golem.health = 15; // Increased by 50%
            golem.maxHealth = golem.health;
            golem.enemyType = 'golem';
            golem.golemColor = golemColor;
            golem.moveSpeed = 25;
            golem.play(`golem-${golemColor}-walk`);
            golem.body.setSize(60, 50);
            golem.body.setOffset(15, 10);
            golem.element = golemColor === 'orange' ? 'fire' : 'water';
            this.enemies.add(golem);
        } else if (enemyType === 'orangegolem') {
            // Always orange golem for lava stage
            const golem = this.physics.add.sprite(x, y, 'golem-orange-walk', 0);
            golem.setScale(1.5);
            golem.health = 18; // More health than regular golem
            golem.maxHealth = golem.health;
            golem.enemyType = 'golem';
            golem.golemColor = 'orange';
            golem.moveSpeed = 25;
            golem.play('golem-orange-walk');
            golem.body.setSize(60, 50);
            golem.body.setOffset(15, 10);
            golem.element = 'fire';
            golem.burnDamage = 3; // Applies burn on contact
            golem.burnDuration = 2000; // 2 seconds
            this.enemies.add(golem);
        } else if (enemyType === 'darkeye') {
            const darkeye = this.physics.add.sprite(x, y, 'darkeye-walk', 0);
            darkeye.setScale(0.8);
            darkeye.health = 20; // Increased by 50%
            darkeye.maxHealth = darkeye.health;
            darkeye.enemyType = 'darkeye';
            darkeye.moveSpeed = 45;
            darkeye.play('darkeye-walking');
            darkeye.body.setSize(80, 80);
            darkeye.body.setOffset(40, 30);
            darkeye.element = 'arcane';
            darkeye.attackRange = 200;
            darkeye.attackCooldown = 3000;
            darkeye.lastAttackTime = 0;
            this.enemies.add(darkeye);
        } else if (enemyType === 'sorcerer') {
            // Create sorcerer boss enemy
            const sorcerer = this.physics.add.sprite(x, y, 'sorcerer-attack-0');
            sorcerer.setScale(1.5); // Large boss size
            sorcerer.health = 30; // Very high health - boss enemy
            sorcerer.maxHealth = sorcerer.health;
            sorcerer.enemyType = 'sorcerer';
            sorcerer.moveSpeed = 30; // Slow but powerful
            sorcerer.play('sorcerer-attack');
            sorcerer.body.setSize(60, 80);
            sorcerer.body.setOffset(10, 0);
            sorcerer.element = 'arcane'; // Powerful magic user
            sorcerer.attackRange = 250; // Long range attacks
            sorcerer.attackCooldown = 2500; // Attacks frequently
            sorcerer.lastAttackTime = 0;
            sorcerer.isBoss = true; // Mark as boss enemy
            this.enemies.add(sorcerer);
        }
    }

    triggerSpecialEvent(event) {
        console.log(`Triggering special event: ${event.type}`);

        if (event.type === 'swarm') {
            // Spawn enemies from one side moving quickly across screen
            const side = Phaser.Math.Between(0, 3);
            for (let i = 0; i < event.count; i++) {
                setTimeout(() => {
                    const camera = this.cameras.main;
                    let x, y;

                    switch (side) {
                        case 0: // Top
                            x = camera.scrollX + Phaser.Math.Between(100, camera.width - 100);
                            y = camera.scrollY - 50;
                            break;
                        case 1: // Right
                            x = camera.scrollX + camera.width + 50;
                            y = camera.scrollY + Phaser.Math.Between(100, camera.height - 100);
                            break;
                        case 2: // Bottom
                            x = camera.scrollX + Phaser.Math.Between(100, camera.width - 100);
                            y = camera.scrollY + camera.height + 50;
                            break;
                        case 3: // Left
                            x = camera.scrollX - 50;
                            y = camera.scrollY + Phaser.Math.Between(100, camera.height - 100);
                            break;
                    }

                    this.createEnemy(event.enemy, x, y);
                }, i * 200); // Stagger spawns
            }
        } else if (event.type === 'circle') {
            // Spawn enemies in a circle around the player
            const radius = 300;
            for (let i = 0; i < event.count; i++) {
                const angle = (Math.PI * 2 / event.count) * i;
                const x = this.wizard.x + Math.cos(angle) * radius;
                const y = this.wizard.y + Math.sin(angle) * radius;
                this.createEnemy(event.enemy, x, y);
            }
        }
    }

    spawnLevelUpGolem() {
        // Now spawns a Dark Eye enemy instead of sorcerer
        const angle = Math.random() * Math.PI * 2;
        const distance = 250; // Slightly further than golem

        const x = this.wizard.x + Math.cos(angle) * distance;
        const y = this.wizard.y + Math.sin(angle) * distance;

        // Clamp to world bounds
        const spawnX = Phaser.Math.Clamp(x, 100, 3900);
        const spawnY = Phaser.Math.Clamp(y, 100, 2060);

        const darkEye = this.physics.add.sprite(spawnX, spawnY, 'darkeye-walk-1');

        // Scale based on level
        const scaleFactor = 1.0 + (this.playerLevel * 0.05);
        darkEye.setScale(scaleFactor);
        darkEye.setFlipX(true); // Flip horizontally
        darkEye.health = Math.floor((15 + (this.playerLevel * 3)) * 10);
        darkEye.maxHealth = darkEye.health;
        darkEye.enemyType = 'darkeye';
        darkEye.moveSpeed = 25; // Slow menacing walk
        darkEye.isLevelUpDarkEye = true; // Mark as special dark eye that drops charge expansion
        darkEye.play('darkeye-walking');
        darkEye.element = 'dark'; // Dark element

        // Ensure enemies group exists before adding
        if (!this.enemies || !this.enemies.children) {
            this.enemies = this.physics.add.group();
        }

        // Add to enemies group first before modifying physics
        this.enemies.add(darkEye);

        // Now set up physics body after it's in the group
        if (darkEye.body) {
            darkEye.body.enable = true;
            darkEye.body.immovable = false; // Allow collision responses
            darkEye.body.moves = true; // Allow physics system to track it

            // Get sprite dimensions to center hitbox properly
            const spriteWidth = darkEye.width * darkEye.scaleX;
            const spriteHeight = darkEye.height * darkEye.scaleY;

            // Set hitbox size and center it
            darkEye.body.setSize(spriteWidth * 0.7, spriteHeight * 0.9);
            darkEye.body.setOffset(
                (darkEye.width - darkEye.body.width) / 2,
                (darkEye.height - darkEye.body.height) / 2
            );
        }

        // Special spawn effect - dark purple for dark eye
        const spawnEffect = this.add.circle(spawnX, spawnY, 50, 0x9933ff, 0.8);
        spawnEffect.setDepth(10);
        this.tweens.add({
            targets: spawnEffect,
            scale: { from: 0, to: 3 },
            alpha: { from: 1, to: 0 },
            duration: 500,
            onComplete: () => spawnEffect.destroy()
        });

        // No announcement text for enemy spawns
    }

    dropChargeExpansion(x, y) {
        // Use charge-slot sprite instead of generated texture
        const expansion = this.physics.add.sprite(x, y, 'charge-slot');
        expansion.setDepth(26);
        expansion.body.setVelocity(0, 0);
        expansion.setScale(0.15); // Scale down since charge-slot sprite is larger

        // Add floating and rotating animation
        this.tweens.add({
            targets: expansion,
            y: y - 15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: expansion,
            angle: 360,
            duration: 3000,
            repeat: -1
        });

        // Add glow effect
        this.tweens.add({
            targets: expansion,
            scale: { from: 1.5, to: 2 },
            alpha: { from: 1, to: 0.7 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Add to the charge expansions group
        this.chargeExpansions.add(expansion);
        return expansion;
    }

    collectChargeExpansion(wizard, expansion) {
        // Check if player already has 8 charge slots
        if (this.maxCharges >= 8) {
            // Player has max slots, give level up instead
            this.playerXP = this.xpToNextLevel; // Set XP to max to trigger level up
            
            // Visual feedback for level up
            const levelUpText = this.add.text(wizard.x, wizard.y - 30, 'MAX SLOTS - LEVEL UP!', {
                fontSize: '24px',
                color: '#ffdd44',
                fontStyle: 'bold'
            });
            levelUpText.setOrigin(0.5);
            
            this.tweens.add({
                targets: levelUpText,
                y: wizard.y - 80,
                scale: { from: 0.8, to: 1.5 },
                alpha: { from: 1, to: 0 },
                duration: 1500,
                onComplete: () => levelUpText.destroy()
            });
            
            // Trigger level up through collectJewel logic
            this.collectJewel(wizard, { xpValue: 0, destroy: () => {} });
        } else {
            // Increase max charges
            this.maxCharges = Math.min(this.maxCharges + 1, 8); // Cap at 8
            this.updateChargeUI();

            // Add a random element orb as bonus
            const randomElement = this.primaryElements[Math.floor(Math.random() * this.primaryElements.length)];
            this.dropElementOrb(wizard.x, wizard.y - 50, randomElement);

            // Visual feedback
            const expansionText = this.add.text(wizard.x, wizard.y - 30, 'CHARGE SLOT +1', {
                fontSize: '24px',
                color: '#aa00ff',
                fontStyle: 'bold'
            });
            expansionText.setOrigin(0.5);

            this.tweens.add({
                targets: expansionText,
                y: wizard.y - 80,
                scale: { from: 0.8, to: 1.5 },
                alpha: { from: 1, to: 0 },
                duration: 1500,
                onComplete: () => expansionText.destroy()
            });
        }

        // Purple flash effect
        wizard.setTint(0xaa00ff);
        this.time.delayedCall(300, () => {
            wizard.clearTint();
        });

        expansion.destroy();
    }

    spawnSplitSlime(x, y, generation, difficultyMultiplier) {
        const slime = this.physics.add.sprite(x, y, 'slime-idle-0');

        // Each generation is smaller
        const scaleFactor = (1.5 * difficultyMultiplier) / Math.pow(1.5, generation);
        slime.setScale(scaleFactor);

        // Each generation has less health (scaled 3x)
        slime.health = Math.floor((3 * Math.pow(difficultyMultiplier, 2)) / Math.pow(2, generation));
        slime.maxHealth = slime.health;
        slime.enemyType = 'slime';
        slime.moveSpeed = 32 + (generation * 8); // Split slimes are faster but 20% slower base
        slime.generation = generation;
        slime.play('slime-idle');

        // Smaller hitbox for split slimes
        const baseSize = 32 / Math.pow(1.5, generation);
        slime.body.setSize(baseSize * difficultyMultiplier, (baseSize * 0.75) * difficultyMultiplier);
        slime.body.setOffset(0, 4);

        // Give split slimes a small initial velocity to spread them out
        const angle = Math.random() * Math.PI * 2;
        slime.setVelocity(
            Math.cos(angle) * 100,
            Math.sin(angle) * 100
        );

        this.enemies.add(slime);
    }

    hitEnemy(wizard, enemy) {
        // Check if player is invulnerable
        if (this.invulnerable) return;
        
        // Check if enemy is hexed (deals no damage)
        if (enemy.isHexed) {
            return; // Hexed enemies deal no damage
        }

        // Don't destroy enemy on contact, just damage player
        const damage = enemy.damage || 10; // Use enemy's damage value or default to 10
        this.playerHealth -= damage;
        this.updateHealthBar();
        this.updateWizardHealthBar();

        // Apply burn effect if enemy has burn damage
        if (enemy.burnDamage && !this.playerBurning) {
            this.applyPlayerBurn(enemy.burnDamage, enemy.burnDuration);
        }

        // Visual feedback only - no knockback
        wizard.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            if (!this.playerBurning) {
                wizard.clearTint();
            }
        });

        // Set invulnerability period
        this.invulnerable = true;
        this.time.delayedCall(1000, () => {
            this.invulnerable = false;
        });

        if (this.playerHealth <= 0) {
            // Stop background music
            if (this.bgMusic) {
                this.bgMusic.stop();
            }
            
            // Play death animation
            this.wizard.play('wizard-death');
            this.wizard.setVelocity(0, 0); // Stop movement

            // Wait for death animation to complete
            this.wizard.once('animationcomplete', () => {
                // Clear any pending timers before changing scene
                this.time.removeAllEvents();
                this.tweens.killAll();
                this.scene.start('GameOverScene', {
                    survivalTime: this.survivalTime,
                    enemiesKilled: this.enemiesKilled,
                    itemsCollected: this.itemsCollected,
                    won: false
                });
            });
        }
    }
    
    applyPlayerBurn(damage, duration) {
        this.playerBurning = true;
        this.wizard.setTint(0xff6600); // Orange tint for burn
        
        // Create burn damage timer
        const burnTicks = 3;
        const tickInterval = duration / burnTicks;
        let currentTick = 0;
        
        const burnTimer = this.time.addEvent({
            delay: tickInterval,
            callback: () => {
                if (this.playerHealth > 0) {
                    this.playerHealth -= damage;
                    this.updateHealthBar();
                    this.updateWizardHealthBar();
                    
                    // Flash effect
                    this.wizard.setTint(0xff0000);
                    this.time.delayedCall(100, () => {
                        if (this.playerBurning) {
                            this.wizard.setTint(0xff6600);
                        }
                    });
                    
                    currentTick++;
                    if (currentTick >= burnTicks) {
                        this.playerBurning = false;
                        this.wizard.clearTint();
                        burnTimer.destroy();
                    }
                    
                    // Check for death
                    if (this.playerHealth <= 0) {
                        // Stop background music
                        if (this.bgMusic) {
                            this.bgMusic.stop();
                        }
                        
                        this.wizard.play('wizard-death');
                        this.wizard.setVelocity(0, 0);
                        this.wizard.once('animationcomplete', () => {
                            this.time.removeAllEvents();
                            this.tweens.killAll();
                            this.scene.start('GameOverScene', {
                                survivalTime: this.survivalTime,
                                enemiesKilled: this.enemiesKilled,
                                itemsCollected: this.itemsCollected,
                                won: false
                            });
                        });
                    }
                }
            },
            loop: true
        });
    }

    showDamageNumber(x, y, damage, color = '#ffff00') {
        const damageText = this.add.text(x, y, damage.toString(), {
            fontSize: '24px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        damageText.setOrigin(0.5);
        damageText.setDepth(150);

        // Animate floating up and fading out
        this.tweens.add({
            targets: damageText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }

    projectileHitEnemy(projectile, enemy) {
        // Initialize hit tracking for piercing projectiles
        if (!projectile.hitEnemies) {
            projectile.hitEnemies = new Set();
        }

        // Check if this enemy was already hit by this projectile
        if (projectile.hitEnemies.has(enemy)) {
            return; // Skip if already hit
        }

        // Mark enemy as hit by this projectile
        projectile.hitEnemies.add(enemy);

        // Deal damage based on projectile type and charge count
        let damage;
        if (projectile.element === 'rock') {
            // Rock projectiles have their damage set directly (6 or 12)
            damage = projectile.damage;
        } else {
            const baseDamage = projectile.isExplosive ? 4 : 2;
            damage = baseDamage * (projectile.damage || 1);
        }
        
        // Double damage for lightning hitting wet enemies
        if (projectile.element === 'lightning' && enemy.wet && enemy.wetEndTime && this.time.now < enemy.wetEndTime) {
            damage *= 2;
            console.log(`Lightning hit wet enemy - damage doubled!`);
        }
        
        enemy.health -= damage;
        console.log(`Enemy hit! Type: ${enemy.enemyType}, Health: ${enemy.health}/${enemy.maxHealth}, Damage: ${damage}`);

        // Show damage number (with critical indicator for rock projectiles)
        if (projectile.element === 'rock' && projectile.isCritical) {
            this.showDamageNumber(enemy.x, enemy.y - 20, damage + '!', '#ff6666');
        } else {
            this.showDamageNumber(enemy.x, enemy.y - 20, damage);
        }

        // Apply burn effect for fire projectiles (magnitude system)
        if (projectile.element === 'fire') {
            // Check if enemy is muddy - if so, freeze them instead of burning
            if (enemy.muddy && enemy.muddyEndTime && this.time.now < enemy.muddyEndTime) {
                // Freeze enemy for 1 second
                enemy.frozen = true;
                enemy.frozenEndTime = this.time.now + 1000; // 1 second freeze
                enemy.setVelocity(0, 0); // Stop movement
                enemy.setTint(0x00ccff); // Ice blue tint
                
                // Clear muddy status
                enemy.muddy = false;
                
                // Remove freeze after 1 second
                this.time.delayedCall(1000, () => {
                    if (enemy.active) {
                        enemy.frozen = false;
                        // Only clear tint if not affected by other effects
                        if (!enemy.burning && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.wet && !enemy.muddy) {
                            enemy.clearTint();
                        }
                    }
                });
                
                // Show freeze effect text
                this.showDamageNumber(enemy.x, enemy.y - 40, 'FROZEN!', '#00ccff');
            } else {
                // Normal burn effect if not muddy
                // Initialize or increase burn magnitude
                if (!enemy.burnMagnitude) {
                    enemy.burnMagnitude = 0;
                }
                enemy.burnMagnitude += 3; // Each fire spell adds magnitude 3
                
                // Visual burn effect - red tint
                enemy.setTint(0xff0000);
                enemy.burning = true;
                
                // Clear existing burn timer if any
                if (enemy.burnTimer) {
                    enemy.burnTimer.destroy();
                }
                
                // Create burn damage timer that ticks every 0.5 seconds
                enemy.burnTimer = this.time.addEvent({
                delay: 500, // Every half second
                callback: () => {
                    if (enemy && enemy.active && enemy.burnMagnitude > 0) {
                        // Deal damage equal to current burn magnitude
                        const burnDamage = enemy.burnMagnitude;
                        enemy.health -= burnDamage;
                        this.showDamageNumber(enemy.x, enemy.y - 20, burnDamage, '#ff6600');
                        
                        // Reduce magnitude by 1
                        enemy.burnMagnitude--;
                        
                        // Check if burn ended
                        if (enemy.burnMagnitude <= 0) {
                            enemy.burning = false;
                            enemy.burnTimer.destroy();
                            enemy.burnTimer = null;
                            // Clear tint only if no other effects
                            if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.wet) {
                                enemy.clearTint();
                            }
                        }
                        
                        // Check if enemy died from burn
                        if (enemy.health <= 0 && enemy.active) {
                            this.killEnemy(enemy);
                        }
                    } else if (enemy && !enemy.active) {
                        // Clean up timer if enemy is no longer active
                        if (enemy.burnTimer) {
                            enemy.burnTimer.destroy();
                            enemy.burnTimer = null;
                        }
                    }
                },
                loop: true
            });
            } // End of else block for normal burn effect
        }

        // Apply knockback for earth projectiles
        if (projectile.knockbackForce && projectile.element === 'earth') {
            // Check if enemy is immune to knockback
            const currentTime = this.time.now;
            if (!enemy.knockbackImmuneUntil || currentTime > enemy.knockbackImmuneUntil) {
                // Apply knockback
                const angle = Math.atan2(enemy.y - projectile.y, enemy.x - projectile.x);
                enemy.setVelocity(
                    Math.cos(angle) * projectile.knockbackForce,
                    Math.sin(angle) * projectile.knockbackForce
                );

                // Set knockback immunity for 1.5 seconds
                enemy.knockbackImmuneUntil = currentTime + 1500;

                // Visual indicator of knockback immunity
                enemy.knockbackImmune = true;

                // Remove immunity after duration
                this.time.delayedCall(1500, () => {
                    if (enemy.active) {
                        enemy.knockbackImmune = false;
                    }
                });
            }
        }

        // Apply stun from rock projectile
        if (projectile.element === 'rock' && projectile.stunDuration) {
            enemy.stunned = true;
            enemy.setTint(0x666666);
            this.time.delayedCall(projectile.stunDuration, () => {
                if (enemy.active) {
                    enemy.stunned = false;
                    enemy.clearTint();
                }
            });
        }

        // Apply freeze from ice projectile
        if (projectile.freezeEnemy && projectile.freezeDuration && !enemy.frozen) {
            enemy.frozen = true;
            enemy.frozenUntil = this.time.now + projectile.freezeDuration;
            
            // Stop enemy movement
            enemy.setVelocity(0, 0);
            
            // Visual freeze effect - blue tint and stop animation
            enemy.setTint(0x88ccff);
            if (enemy.anims) {
                enemy.anims.pause();
            }
            
            // Unfreeze after duration
            this.time.delayedCall(projectile.freezeDuration, () => {
                if (enemy.active) {
                    enemy.frozen = false;
                    // Clear tint only if no other effects
                    if (!enemy.burning && !enemy.stunned && !enemy.poisoned && !enemy.slowed) {
                        enemy.clearTint();
                    }
                    if (enemy.anims) {
                        enemy.anims.resume();
                    }
                }
            });
        }
        
        // Apply burn from volcano projectile
        if (projectile.burnEnemy && projectile.burnDuration && !enemy.burning) {
            enemy.burning = true;
            enemy.burnEndTime = this.time.now + projectile.burnDuration;
            
            // Visual burn effect - orange/red tint
            enemy.setTint(0xff6600);
            
            // Create burn damage timer
            if (enemy.burnTimer) {
                enemy.burnTimer.destroy();
            }
            
            let burnTicks = 0;
            enemy.burnTimer = this.time.addEvent({
                delay: 500, // Damage every 0.5 seconds
                callback: () => {
                    if (enemy.active && enemy.burning) {
                        // Deal burn damage
                        enemy.health -= 1;
                        
                        // Flash effect
                        enemy.setTint(0xff0000);
                        this.time.delayedCall(100, () => {
                            if (enemy.active && enemy.burning) {
                                enemy.setTint(0xff6600);
                            }
                        });
                        
                        // Check if enemy died from burn
                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                            if (enemy.burnTimer) {
                                enemy.burnTimer.destroy();
                                enemy.burnTimer = null;
                            }
                        }
                        
                        burnTicks++;
                        // Stop burning after duration
                        if (burnTicks * 500 >= projectile.burnDuration) {
                            enemy.burning = false;
                            if (enemy.burnTimer) {
                                enemy.burnTimer.destroy();
                                enemy.burnTimer = null;
                            }
                            // Clear tint only if no other effects
                            if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed) {
                                enemy.clearTint();
                            }
                        }
                    }
                },
                loop: true
            });
        }

        // Visual feedback - flash red and play hurt animation for golems
        enemy.setTint(0xff0000);
        
        // Restore appropriate tint after flash
        this.time.delayedCall(100, () => {
            if (enemy.active && !enemy.isDying) {
                if (enemy.frozen) {
                    enemy.setTint(0x88ccff);
                } else if (enemy.poisoned) {
                    enemy.setTint(0x00ff00);
                } else if (enemy.burning) {
                    enemy.setTint(0xff0000);
                } else if (enemy.wet && enemy.wetEndTime && this.time.now < enemy.wetEndTime) {
                    enemy.setTint(0x4488ff);
                } else if (enemy.stunned) {
                    enemy.setTint(0x666666);
                } else {
                    enemy.clearTint();
                }
            }
        });

        // Play hurt animation for golems if not dying
        if (enemy.enemyType === 'golem' && enemy.health > 0 && !enemy.isDying && !enemy.isAttacking) {
            try {
                const currentAnim = enemy.anims.currentAnim;
                enemy.play(`golem-${enemy.golemColor}-hurt`);

                // Return to previous animation after hurt
                enemy.once('animationcomplete', () => {
                    if (enemy.active && !enemy.isDying) {
                        // Always return to walk animation
                        try {
                            enemy.play(`golem-${enemy.golemColor}-walk`);
                        } catch (e) {
                            console.warn('Failed to play golem walk animation:', e);
                        }
                    }
                });
            } catch (e) {
                console.warn('Failed to play golem hurt animation:', e);
            }
        }

        this.time.delayedCall(100, () => {
            if (enemy.active) {
                enemy.clearTint();
            }
        });

        // Destroy enemy if health depleted
        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }

        // Handle explosive projectiles
        if (projectile.isExplosive) {
            this.createExplosion(projectile.x, projectile.y);
        }

        // Handle fire projectiles that create pools
        if (projectile.createFirePool) {
            this.createFirePool(projectile.x, projectile.y, projectile.linkedCount || 1);
        }

        // Handle lava projectiles that leave lava pools
        if (projectile.leavesLavaPool) {
            this.createFirePool(projectile.x, projectile.y, 1, projectile.lavaPoolDuration, projectile.lavaPoolBurnMagnitude);
        }

        // Handle poison damage over time
        if (projectile.element === 'poison' && projectile.poisonDamage) {
            enemy.poisoned = true;
            enemy.poisonDamage = projectile.poisonDamage;
            enemy.setTint(0x00ff00);

            // Clean up any existing poison timer
            if (enemy.poisonTimer) {
                enemy.poisonTimer.destroy();
                enemy.poisonTimer = null;
            }

            // Apply poison damage over time
            let poisonTicks = 3;
            enemy.poisonTimer = this.time.addEvent({
                delay: 500,
                callback: () => {
                    if (enemy.active && !enemy.isDying && enemy.poisoned) {
                        enemy.health -= projectile.poisonDamage / 3;
                        enemy.setTint(0x00ff00);
                        this.time.delayedCall(100, () => {
                            if (enemy.active && !enemy.isDying) enemy.setTint(0x00ff00);
                        });

                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        }

                        poisonTicks--;
                        if (poisonTicks <= 0) {
                            enemy.poisoned = false;
                            if (enemy.active && !enemy.isDying) enemy.clearTint();
                            if (enemy.poisonTimer) {
                                enemy.poisonTimer.destroy();
                                enemy.poisonTimer = null;
                            }
                        }
                    }
                },
                loop: true
            });
        }

        // Handle ice slowing effect
        if (projectile.element === 'ice' && projectile.slowDuration) {
            enemy.slowed = true;
            enemy.originalSpeed = enemy.moveSpeed || 40;
            enemy.moveSpeed = enemy.originalSpeed * 0.3;
            enemy.setTint(0x00ddff);

            this.time.delayedCall(projectile.slowDuration, () => {
                if (enemy.active) {
                    enemy.slowed = false;
                    enemy.moveSpeed = enemy.originalSpeed;
                    enemy.clearTint();
                }
            });
        }

        // Apply wet effect from wave projectile
        if (projectile.appliesWet && projectile.wetDuration && !enemy.wet) {
            enemy.wet = true;
            enemy.wetEndTime = this.time.now + projectile.wetDuration;
            enemy.waterSlowFactor = 0.5; // Reduce speed by 50%
            
            // Visual effect - blue tint for wet
            enemy.setTint(0x4488ff);
            
            // Remove wet status after duration
            this.time.delayedCall(projectile.wetDuration, () => {
                if (enemy.active) {
                    enemy.wet = false;
                    // Clear tint only if no other effects
                    if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.burning) {
                        enemy.clearTint();
                    }
                }
            });
        }

        // Apply stronger knockback from wave projectile
        if (projectile.knockbackForce && projectile.element === 'wave') {
            // Check if enemy is immune to knockback
            const currentTime = this.time.now;
            if (!enemy.knockbackImmuneUntil || currentTime > enemy.knockbackImmuneUntil) {
                // Apply knockback
                const angle = Math.atan2(enemy.y - projectile.y, enemy.x - projectile.x);
                enemy.setVelocity(
                    Math.cos(angle) * projectile.knockbackForce,
                    Math.sin(angle) * projectile.knockbackForce
                );

                // Set knockback immunity for 1.5 seconds
                enemy.knockbackImmuneUntil = currentTime + 1500;

                // Visual indicator of knockback immunity
                enemy.knockbackImmune = true;

                // Remove immunity after duration
                this.time.delayedCall(1500, () => {
                    if (enemy.active) {
                        enemy.knockbackImmune = false;
                    }
                });
            }
        }


        // Water spell is now AOE, no projectiles to check

        // Don't destroy stationary flames on hit
        if (projectile.isStationary) {
            return;
        }

        // Handle arcane projectile impact animation
        if (projectile.element === 'arcane' && projectile.texture.key === 'arcane-spell') {
            // Create impact sprite at collision point
            const impact = this.add.sprite(projectile.x, projectile.y, 'arcane-spell');
            if (this.anims.exists('arcane-spell-impact')) {
                impact.play('arcane-spell-impact');
            }
            impact.setScale(projectile.scaleX);
            impact.setTint(projectile.tintTopLeft);
            impact.setDepth(projectile.depth);

            // Destroy impact sprite when animation completes
            impact.once('animationcomplete', () => {
                impact.destroy();
            });
        }

        // Handle lightning orb bouncing
        if (projectile.bounceCount !== undefined && projectile.texture && projectile.texture.key === 'lightning-spell') {
            // Find next target
            if (projectile.bounceCount > 0) {
                let nextTarget = null;
                let nearestDistance = 250;

                this.enemies.children.entries.forEach(nextEnemy => {
                    if (nextEnemy.active && !nextEnemy.isDying && !projectile.hitEnemies.has(nextEnemy)) {
                        const dist = Phaser.Math.Distance.Between(projectile.x, projectile.y, nextEnemy.x, nextEnemy.y);
                        if (dist < nearestDistance) {
                            nearestDistance = dist;
                            nextTarget = nextEnemy;
                        }
                    }
                });

                if (nextTarget) {
                    // Bounce to next enemy
                    projectile.bounceCount--;
                    projectile.currentTarget = nextTarget;
                    this.setLightningOrbVelocity(projectile, nextTarget);

                    // Visual trail effect
                    const trail = this.add.sprite(projectile.x, projectile.y, 'lightning-spell');
                    trail.setScale(0.5);
                    trail.setAlpha(0.5);
                    trail.setDepth(19);
                    this.tweens.add({
                        targets: trail,
                        alpha: 0,
                        scale: 0,
                        duration: 200,
                        onComplete: () => trail.destroy()
                    });
                } else {
                    // No more targets, destroy orb
                    projectile.destroy();
                }
            } else {
                // No more bounces, destroy orb
                projectile.destroy();
            }
            return; // Don't run normal destruction logic
        }

        // Call custom hit handler if exists
        if (projectile.onHitEnemy && typeof projectile.onHitEnemy === 'function') {
            projectile.onHitEnemy(enemy);
        }
        
        // Destroy projectile unless it's a piercing type or pass-through type
        if (!projectile.isPiercing && !projectile.passThroughEnemies) {
            projectile.destroy();
        }
    }

    createExplosion(x, y) {
        // Create explosion effect
        const explosion = this.add.circle(x, y, 40, 0xffaa44, 0.6);
        explosion.setDepth(6);

        this.tweens.add({
            targets: explosion,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 0.8, to: 0 },
            duration: 300,
            onComplete: () => explosion.destroy()
        });

        // Create lightning fragments
        if (!this.textures.exists('lightning-fragment')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffff44, 1);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('lightning-fragment', 8, 8);
            graphics.destroy();
        }

        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const fragment = this.physics.add.sprite(x, y, 'lightning-fragment');
            fragment.damage = 1;
            fragment.body.setCollideWorldBounds(false);
            fragment.setDepth(5);

            this.projectiles.add(fragment);

            const speed = 300;
            fragment.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );

            // Add glow effect
            this.tweens.add({
                targets: fragment,
                scale: { from: 1, to: 0.5 },
                alpha: { from: 1, to: 0 },
                duration: 600,
                onComplete: () => fragment.destroy()
            });
        }
    }

    fireExplodingProjectile() {
        if (!this.textures.exists('explosive-proj')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xff8844, 1);
            graphics.fillCircle(9, 9, 9);
            graphics.generateTexture('explosive-proj', 18, 18);
            graphics.destroy();
        }

        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'explosive-proj');
        projectile.isExplosive = true;
        projectile.body.setCollideWorldBounds(false);
        projectile.setDepth(5); // Ensure visibility

        this.projectiles.add(projectile);

        const speed = 300;
        const diagonalSpeed = speed / Math.sqrt(2);

        const directions = {
            up: { x: 0, y: -speed },
            down: { x: 0, y: speed },
            left: { x: -speed, y: 0 },
            right: { x: speed, y: 0 },
            'up-left': { x: -diagonalSpeed, y: -diagonalSpeed },
            'up-right': { x: diagonalSpeed, y: -diagonalSpeed },
            'down-left': { x: -diagonalSpeed, y: diagonalSpeed },
            'down-right': { x: diagonalSpeed, y: diagonalSpeed }
        };

        const dir = directions[this.wizard.lastDirection || 'down'];
        projectile.setVelocity(dir.x, dir.y);
    }

    projectileHitTree(projectile, tree) {
        // Destroy most projectiles on tree collision
        if (!projectile.isMagnetic && !projectile.isPiercing) {
            projectile.destroy();
        }
    }

    fireShotgunBlast() {
        // Ensure water and lightning textures exist
        if (!this.textures.exists('water-proj')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x4444ff, 1);
            graphics.fillCircle(6, 6, 6);
            graphics.generateTexture('water-proj', 12, 12);
            graphics.destroy();
        }

        if (!this.textures.exists('lightning-proj')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffff44, 1);
            graphics.fillCircle(6, 6, 6);
            graphics.generateTexture('lightning-proj', 12, 12);
            graphics.destroy();
        }

        const baseAngle = {
            up: -Math.PI / 2,
            down: Math.PI / 2,
            left: Math.PI,
            right: 0,
            'up-left': -3 * Math.PI / 4,
            'up-right': -Math.PI / 4,
            'down-left': 3 * Math.PI / 4,
            'down-right': Math.PI / 4
        }[this.wizard.lastDirection || 'down'];

        const spread = Math.PI / 6;
        const projectileCount = 7;

        for (let i = 0; i < projectileCount; i++) {
            const angleOffset = (i - Math.floor(projectileCount / 2)) * (spread / (projectileCount - 1));
            const angle = baseAngle + angleOffset;

            const element = i % 2 === 0 ? 'water' : 'lightning';
            const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, element + '-proj');
            projectile.setScale(0.4);
            projectile.body.setCollideWorldBounds(false);
            projectile.setDepth(5); // Ensure visibility

            this.projectiles.add(projectile);

            const speed = 350;
            projectile.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );

            this.time.delayedCall(1000, () => {
                if (projectile.active) {
                    projectile.destroy();
                }
            });
        }
    }

    dropJewel(x, y, xpValue = 2, scale = 0.075) {
        // Use animated XP gem sprite
        const jewel = this.physics.add.sprite(x, y, 'xp-gem');
        if (this.anims.exists('xp-gem-anim')) {
            jewel.play('xp-gem-anim');
        }
        jewel.setDepth(25);
        jewel.setScale(scale);
        jewel.body.setVelocity(0, 0);
        jewel.body.setSize(60, 60); // Larger collision box for proximity collection
        
        // Store XP value on the jewel
        jewel.xpValue = xpValue;
        
        // Add tint based on value
        if (xpValue >= 10) {
            jewel.setTint(0xffff00); // Gold for high value
        } else if (xpValue >= 5) {
            jewel.setTint(0x00ffff); // Cyan for medium value
        }


        this.jewels.add(jewel);
        return jewel;
    }

    dropMuffin(x, y) {
        const muffin = this.physics.add.sprite(x, y, 'muffin');
        muffin.setDepth(25);
        muffin.body.setVelocity(0, 0);
        muffin.setScale(0.2); // Reduced by 75% (25% of original size)

        // Add floating animation
        this.tweens.add({
            targets: muffin,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add rotation for visual appeal
        this.tweens.add({
            targets: muffin,
            angle: 360,
            duration: 3000,
            repeat: -1
        });

        this.muffins.add(muffin);
        return muffin;
    }

    collectMuffin(wizard, muffin) {
        // Heal 30% of max health
        const healAmount = Math.floor(this.maxHealth * 0.3);
        this.playerHealth = Math.min(this.playerHealth + healAmount, this.maxHealth);
        this.itemsCollected.muffins++;
        this.updateHealthBar();
        this.updateWizardHealthBar();

        // Visual feedback
        const healText = this.add.text(wizard.x, wizard.y - 30, `+${healAmount} HP`, {
            fontSize: '20px',
            color: '#44ff44',
            fontStyle: 'bold'
        });
        healText.setOrigin(0.5);

        this.tweens.add({
            targets: healText,
            y: wizard.y - 60,
            alpha: 0,
            duration: 1000,
            onComplete: () => healText.destroy()
        });

        // Green flash on wizard
        wizard.setTint(0x44ff44);
        this.time.delayedCall(200, () => {
            wizard.clearTint();
        });

        muffin.destroy();
    }

    collectJewel(wizard, jewel) {
        // Add XP - use jewel's stored value or default
        const baseXP = jewel.xpValue || 2;
        const xpGain = Math.ceil(baseXP * this.difficultyMultiplier);
        this.playerXP += xpGain;
        this.itemsCollected.jewels++;

        // Chance to award talent points (10% base chance, increases with difficulty)
        const talentChance = 0.10 * this.difficultyMultiplier;
        if (Math.random() < talentChance) {
            const talentGain = Math.ceil(Math.random() * 2); // 1-2 talent points
            const currentPoints = parseInt(localStorage.getItem('talentPoints') || '0');
            const newPoints = currentPoints + talentGain;
            localStorage.setItem('talentPoints', newPoints.toString());
            
            // Visual feedback for talent point gain
            const talentText = this.add.text(wizard.x, wizard.y - 30, `+${talentGain} Essence!`, {
                fontSize: '20px',
                color: '#ff00ff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            });
            talentText.setOrigin(0.5);
            talentText.setDepth(150);

            this.tweens.add({
                targets: talentText,
                y: wizard.y - 70,
                alpha: 0,
                duration: 1500,
                onComplete: () => talentText.destroy()
            });
        }

        // Update XP bar
        this.updateXPBar();

        // Check for level up
        while (this.playerXP >= this.xpToNextLevel) {
            this.playerXP -= this.xpToNextLevel;
            this.playerLevel++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.25); // 25% increase per level (reduced by 50% from 1.5)
            
            // Unlock charge slot every 10 levels
            if (this.playerLevel % 10 === 0 && this.maxCharges < 8) {
                this.maxCharges++;
                this.updateChargeUI();
                
                // Visual feedback for slot unlock
                const slotText = this.add.text(wizard.x, wizard.y - 60, 'CHARGE SLOT UNLOCKED!', {
                    fontSize: '28px',
                    color: '#ff00ff',
                    fontStyle: 'bold'
                });
                slotText.setOrigin(0.5);
                slotText.setDepth(150);
                
                this.tweens.add({
                    targets: slotText,
                    y: wizard.y - 100,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => slotText.destroy()
                });
            }

            // Show chest reward selection directly on level up
            this.openChest(wizard, null);

            // Spawn a sorcerer every 2 levels (2, 4, 6, etc.)
            if (this.playerLevel % 2 === 0) {
                this.spawnLevelUpGolem();
            }

            this.updateChargeUI();

            // Level up effect
            const levelUpText = this.add.text(wizard.x, wizard.y - 50, 'LEVEL UP!', {
                fontSize: '24px',
                color: '#ffdd44',
                fontStyle: 'bold'
            });
            levelUpText.setOrigin(0.5);

            this.tweens.add({
                targets: levelUpText,
                y: wizard.y - 100,
                alpha: 0,
                duration: 1500,
                onComplete: () => levelUpText.destroy()
            });
        }

        // Update UI
        this.levelText.setText(`Level ${this.playerLevel}`);
        this.xpText.setText(`XP: ${this.playerXP}/${this.xpToNextLevel}`);

        jewel.destroy();
    }

    dropElementOrb(x, y, element) {
        const config = this.elementConfig[element];
        if (!config) {
            console.log('Invalid element:', element);
            return; // Invalid element
        }


        // Create orb using the element sprite from the correct sheet
        const orb = this.physics.add.sprite(x, y, config.sheet, config.frame);
        orb.element = element;
        orb.setDepth(25);
        orb.body.setVelocity(0, 0);
        orb.setScale(0.1); // Double the size of dropped elements
        orb.setAlpha(1); // Ensure full opacity
        orb.setVisible(true); // Explicitly set visible
        orb.setTint(config.color); // Add color tint to make more visible


        // Add floating animation
        this.tweens.add({
            targets: orb,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add glow effect
        this.tweens.add({
            targets: orb,
            scale: { from: 0.1, to: 0.12 },
            alpha: { from: 1, to: 0.8 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.elementOrbs.add(orb);
        return orb;
    }

    collectElementOrb(wizard, orb) {
        // Initialize chargeSlots if needed
        if (!this.chargeSlots) {
            this.chargeSlots = new Array(8).fill(null);
        }
        
        // Count how many charges we have
        let chargeCount = 0;
        for (let i = 0; i < 8; i++) {
            if (this.chargeSlots[i] !== null) {
                chargeCount++;
            }
        }
        
        if (chargeCount < this.maxCharges) {
            // Find first empty slot
            let slotIndex = -1;
            for (let i = 0; i < 8; i++) {
                if (this.chargeSlots[i] === null) {
                    slotIndex = i;
                    break;
                }
            }
            
            if (slotIndex !== -1) {
                this.chargeSlots[slotIndex] = orb.element;
                
                // Set tier to 1 for newly collected elements
                this.elementTiers.set(`${orb.element}_${slotIndex}`, 1);
                
                // Rebuild charges array
                this.charges = [];
                for (let i = 0; i < 8; i++) {
                    if (this.chargeSlots[i] !== null) {
                        this.charges.push(this.chargeSlots[i]);
                    }
                }
                
                console.log('Collected element:', orb.element);
                console.log('Placed in slot:', slotIndex);
                console.log('Element tier:', 1);
                console.log('ChargeSlots after collection:', [...this.chargeSlots]);
                console.log('Charges after collection:', [...this.charges]);
            }
            
            this.updateChargeUI();
            this.itemsCollected.elements++;

            // Update charge groups immediately so new elements start firing
            this.updateChargeGroups();

            // Discover the element
            const wasNewDiscovery = !this.discoveredElements.has(orb.element);
            this.discoveredElements.add(orb.element);

            // Visual feedback
            const config = this.elementConfig[orb.element];
            let displayText = `+${config.name}`;
            if (wasNewDiscovery) {
                displayText += ' (NEW!)';
            }

            const elementText = this.add.text(wizard.x, wizard.y - 30, displayText, {
                fontSize: '18px',
                color: wasNewDiscovery ? '#ffdd44' : `#${config.color.toString(16).padStart(6, '0')}`,
                fontStyle: 'bold'
            });
            elementText.setOrigin(0.5);

            this.tweens.add({
                targets: elementText,
                y: wizard.y - 60,
                alpha: 0,
                duration: 1000,
                onComplete: () => elementText.destroy()
            });

            orb.destroy();
        }
    }

    // Cooldown system helper functions
    canCastSpell(spellType, chargeIndex = null) {
        const now = this.time.now;

        // Check global cooldown
        if (now < this.globalSpellCooldown) {
            return false;
        }

        // Check spell-specific cooldown
        const cooldownKey = chargeIndex !== null ? `${spellType}_${chargeIndex}` : spellType;
        const spellCooldown = this.spellCooldowns.get(cooldownKey) || 0;

        return now >= spellCooldown;
    }

    setSpellCooldown(spellType, cooldownMs, chargeIndex = null) {
        const now = this.time.now;
        const cooldownKey = chargeIndex !== null ? `${spellType}_${chargeIndex}` : spellType;

        // Set spell-specific cooldown
        this.spellCooldowns.set(cooldownKey, now + cooldownMs);

        // Set a small global cooldown to prevent spell spam (100ms)
        this.globalSpellCooldown = now + 100;
    }

    fireIndividualCharge(chargeIndex, element) {
        // Check if charge is linked to others (only check links within active slots)
        const linkedIndices = [chargeIndex];

        // Check for links if we have link buttons
        if (this.linkButtons) {
            // Check link to the left (only if both slots are in active range)
            if (chargeIndex > 0 && chargeIndex - 1 < 4 && this.linkButtons[chargeIndex - 1] && this.linkButtons[chargeIndex - 1].linked) {
                linkedIndices.unshift(chargeIndex - 1);
                // Set cooldown for linked charge
                const linkedElement = this.charges[chargeIndex - 1];
                if (linkedElement) {
                    const linkedConfig = this.elementConfig[linkedElement];
                    this.setSpellCooldown(linkedElement, linkedConfig.fireRate || 1000, chargeIndex - 1);
                }
            }
            // Check link to the right (only if both slots are in active range)
            if (chargeIndex < this.charges.length - 1 && chargeIndex + 1 < 4 && this.linkButtons[chargeIndex] && this.linkButtons[chargeIndex].linked) {
                linkedIndices.push(chargeIndex + 1);
                // Set cooldown for linked charge
                const linkedElement = this.charges[chargeIndex + 1];
                if (linkedElement) {
                    const linkedConfig = this.elementConfig[linkedElement];
                    this.setSpellCooldown(linkedElement, linkedConfig.fireRate || 1000, chargeIndex + 1);
                }
            }
        }

        // Get all linked elements
        const linkedElements = linkedIndices.map(i => this.charges[i]).filter(e => e !== undefined);
        
        // Get the slot index for this charge to look up its tier
        let slotIndex = -1;
        let chargeCount = 0;
        for (let i = 0; i < this.chargeSlots.length; i++) {
            if (this.chargeSlots[i] !== null) {
                if (chargeCount === chargeIndex) {
                    slotIndex = i;
                    break;
                }
                chargeCount++;
            }
        }
        
        // Get the tier for this element
        const elementTier = this.elementTiers.get(`${element}_${slotIndex}`) || 1;

        // Fire based on number of linked elements
        if (linkedElements.length === 1) {
            // Single element effect
            switch (element) {
                case 'fire':
                    // Pass all charges so fire can scale based on total fire elements
                    this.fireFireProjectile([element], this.charges, chargeIndex, elementTier);
                    break;
                case 'water':
                    // Pass all charges so water can scale based on total water elements
                    this.createWaterOrb(linkedElements, this.charges, chargeIndex, elementTier);
                    break;
                case 'lightning':
                    this.fireLightningProjectile(chargeIndex, elementTier);
                    break;
                case 'earth':
                    this.fireEarthProjectile(chargeIndex, elementTier);
                    break;
                case 'rock':
                    this.fireRockProjectile(elementTier);
                    break;
                case 'air':
                    this.createWindGust();
                    break;
                case 'ice':
                    this.createIceSpell(elementTier);
                    break;
                case 'arcane':
                    this.fireArcaneProjectile(elementTier);
                    break;
                case 'poison':
                    this.createPoisonMines();
                    break;
                case 'volcano':
                    this.createVolcanicEruption(elementTier);
                    break;
                case 'wave':
                    this.createWaveSpell(elementTier);
                    break;
                case 'sand':
                    this.createSandSpell();
                    break;
                case 'crystal':
                    this.createCrystalSpell(elementTier);
                    break;
                case 'gravity':
                    this.createGravitySpell();
                    break;
                case 'meteor':
                    this.fireMeteorProjectile(elementTier);
                    break;
                case 'moon':
                    this.createMoonSpell();
                    break;
                case 'death':
                    this.createDeathSpell();
                    break;
                case 'smoke':
                    this.createSmokeSpell();
                    break;
                case 'sun':
                    this.createSunSpell();
                    break;
                case 'star':
                    this.createStarSpell();
                    break;
                case 'zodiac':
                    this.createZodiacSpell();
                    break;
                case 'hex':
                    this.createHexSpell();
                    break;
                case 'venom':
                    this.createVenomSpell();
                    break;
                case 'time':
                    this.createTimeSpell();
                    break;
                case 'nature':
                    this.createNatureSpell();
                    break;
                case 'life':
                    this.createLifeSpell();
                    break;
                case 'storm':
                    this.createStormSpell();
                    break;
                case 'holy':
                    this.createHolySpell();
                    break;
                case 'dust':
                    this.createDustCloud();
                    break;
                case 'lava':
                    this.fireLavaProjectile();
                    break;
                case 'steam':
                    this.createSteamSpell();
                    break;
                case 'mud':
                    this.createMudTrap();
                    break;
                case 'philosopherstone':
                    // Don't fire philosopher stone as a regular spell
                    console.log('Philosopher stone in charge slot - not firing as spell');
                    break;
                default:
                    // For non-primary elements, use basic projectile with element effect
                    this.fireEnhancedProjectile(element);
                    break;
            }
        } else if (linkedElements.length === 2) {
            // Two element combo
            this.fireTwoElementCombo(linkedElements);
        } else if (linkedElements.length === 3) {
            // Three element combo
            this.fireThreeElementCombo(linkedElements);
        } else if (linkedElements.length === 4) {
            // Four element combo
            this.fireFourElementCombo(linkedElements);
        }
    }

    fireElementProjectile() {
        if (this.charges.length === 0) return;

        // Initialize charge groups if not set
        if (!this.chargeGroups || this.chargeGroups.length === 0) {
            this.updateChargeGroups();
        }

        // Get current group
        const currentGroup = this.chargeGroups[this.currentChargeIndex % this.chargeGroups.length];

        if (currentGroup.length === 1) {
            // Single element effect
            const element = currentGroup[0];
            switch (element) {
                case 'fire':
                    this.fireFireProjectile(currentGroup, this.charges);
                    break;
                case 'water':
                    this.createWaterOrb(currentGroup, this.charges);
                    break;
                case 'lightning':
                    this.fireLightningProjectile();
                    break;
                case 'earth':
                    this.fireEarthProjectile();
                    break;
                case 'rock':
                    this.fireRockProjectile();
                    break;
                case 'air':
                    this.createAirBlast();
                    break;
                case 'ice':
                    this.createIceSpell();
                    break;
                case 'holy':
                    this.createHolySpell();
                    break;
                case 'arcane':
                    this.fireArcaneProjectile();
                    break;
                case 'dust':
                    this.createDustCloud();
                    break;
                case 'lava':
                    this.fireLavaProjectile();
                    break;
                case 'steam':
                    this.createSteamSpell();
                    break;
                case 'poison':
                    this.createPoisonMines();
                    break;
                case 'volcano':
                    this.createVolcanicEruption();
                    break;
                case 'wave':
                    this.createWaveSpell();
                    break;
                case 'sand':
                    this.createSandSpell();
                    break;
                case 'meteor':
                    this.fireMeteorProjectile(elementTier);
                    break;
                case 'mud':
                    this.createMudTrap();
                    break;
                case 'storm':
                    this.fireStormBolt();
                    break;
                case 'crystal':
                    this.createCrystalSpell();
                    break;
                case 'gravity':
                    this.createGravitySpell();
                    break;
                case 'moon':
                    this.createMoonSpell();
                    break;
                case 'death':
                    this.createDeathSpell();
                    break;
                case 'smoke':
                    this.createSmokeSpell();
                    break;
                case 'sun':
                    this.createSunSpell();
                    break;
                case 'holy':
                    this.createHolySpell();
                    break;
                case 'steam':
                    this.createSteamSpell();
                    break;
            }
        } else if (currentGroup.length === 2) {
            // Two-element combos
            this.fireTwoElementCombo(currentGroup);
        } else if (currentGroup.length === 3) {
            // Three-element combos
            this.fireThreeElementCombo(currentGroup);
        } else if (currentGroup.length === 4) {
            // Four-element ultimate combo
            this.fireFourElementCombo(currentGroup);
        }

        // Move to next group
        this.currentChargeIndex = (this.currentChargeIndex + 1) % this.chargeGroups.length;
    }

    fireTwoElementCombo(elements) {
        const combo = elements.sort().join('-');

        switch (combo) {
            case 'arcane-arcane':
                // Double arcane projectiles targeting same enemy
                this.fireDoubleArcane();
                break;
            case 'fire-fire':
                // Double-sized fire spell
                this.fireFireProjectile(elements);
                break;
            case 'fire-lightning':
                // Explosive lightning bolt
                this.fireExplosiveLightning();
                break;
            case 'fire-water':
                // Steam cloud that damages and slows
                this.createSteamCloud();
                break;
            case 'fire-earth':
                // Meteor strike
                this.fireMeteor();
                break;
            case 'lightning-water':
                // Chain lightning
                this.fireChainLightning();
                break;
            case 'earth-lightning':
                // Magnetic pull
                this.createMagneticField();
                break;
            case 'earth-water':
                // Mud trap
                this.createMudTrap();
                break;
            case 'moon-star':
                // Zodiac spell - bouncing projectiles with light trails
                this.createZodiacSpell();
                break;
            case 'arcane-poison':
                // Hex element - curse enemies to deal no damage
                this.createHexSpell();
                break;
            case 'crystal-poison':
                // Venom element - piercing spines that apply poison
                this.createVenomSpell();
                break;
            case 'death-life':
                // Philosopher Stone - grants level up every 45 seconds
                this.createPhilosopherStone();
                break;
            case 'holy-water':
                // Halo - holy water aura that damages nearby enemies
                this.createHaloAura();
                break;
            default:
                // Fallback to firing single element of first type
                const element = elements[0];
                switch (element) {
                    case 'fire':
                        this.fireFireProjectile(currentGroup, this.charges);
                        break;
                    case 'water':
                        this.createWaterOrb();
                        break;
                    case 'lightning':
                        this.fireLightningProjectile();
                        break;
                    case 'earth':
                        this.fireEarthSpike();
                        break;
                    default:
                        // For new elements, use their basic attack
                        this.fireBasicElementProjectile(element);
                        break;
                }
        }
    }

    fireThreeElementCombo(elements) {
        const combo = elements.sort().join('-');

        // Create unique effects for different 3-element combinations
        if (combo.includes('fire') && combo.includes('lightning') && combo.includes('water')) {
            // Plasma storm - creates rotating plasma orbs
            this.createPlasmaStorm();
        } else if (combo.includes('fire') && combo.includes('earth') && combo.includes('water')) {
            // Lava eruption
            this.createLavaEruption();
        } else if (combo.includes('lightning') && combo.includes('earth') && combo.includes('water')) {
            // Electromagnetic pulse
            this.createEMPulse();
        } else if (combo.includes('fire') && combo.includes('lightning') && combo.includes('earth')) {
            // Meteor shower
            this.createMeteorShower();
        } else {
            // Default: enhanced triple cast
            elements.forEach(element => {
                switch (element) {
                    case 'fire':
                        this.fireFireProjectile(currentGroup, this.charges);
                        break;
                    case 'water':
                        this.createWaterOrb();
                        break;
                    case 'lightning':
                        this.fireLightningProjectile();
                        break;
                    case 'earth':
                        this.createEarthquake();
                        break;
                }
            });
        }
    }

    fireFourElementCombo(elements) {
        // Ultimate combo - elemental storm
        this.createElementalStorm();
    }

    fireFireProjectile(currentGroup = ['fire'], allCharges = null, slotIndex = 0, elementTier = 1) {
        // Remove any existing flame for this charge
        if (this.activeFlames[0]) {
            this.activeFlames[0].destroy();
            this.activeFlames[0] = null;
        }

        const direction = this.wizard.lastDirection || 'down';
        const baseScale = 2.8125; // Base scale increased by 25% (was 2.25)
        // Count total fire elements from all charges if provided, otherwise from the group
        const fireCount = allCharges
            ? allCharges.filter(e => e === 'fire').length
            : currentGroup.filter(e => e === 'fire').length;

        console.log('Fire count for scaling:', fireCount);
        console.log('Fire element tier:', elementTier);

        // Apply tier scaling to size
        const tierAreaScale = this.tierScaling.area[elementTier - 1] || 1.0;
        
        // 100% larger (2x) for each fire element, then apply tier scaling
        const scale = baseScale * fireCount * tierAreaScale;

        // Since the sprite is 32x32 and we're scaling it, calculate the actual size
        const spriteSize = 32 * scale;

        // Distance from wizard center to flame center along directional line
        // Add extra spacing from wizard hitbox (wizard hitbox is 20x30)
        const wizardHitboxRadius = 15; // Half of the larger hitbox dimension
        const spacing = 10; // Additional space between wizard and flame
        const distanceFromWizard = wizardHitboxRadius + spacing + (spriteSize * 0.5);

        // Calculate directional offsets
        const directionAngles = {
            'up': -Math.PI / 2,
            'down': Math.PI / 2,
            'left': Math.PI,
            'right': 0,
            'up-left': -3 * Math.PI / 4,
            'up-right': -Math.PI / 4,
            'down-left': 3 * Math.PI / 4,
            'down-right': Math.PI / 4
        };

        const angle = directionAngles[direction];
        const offsets = {
            [direction]: {
                x: Math.cos(angle) * distanceFromWizard,
                y: Math.sin(angle) * distanceFromWizard
            }
        };

        const offset = offsets[direction];

        // Create the fire sprite
        const flame = this.physics.add.sprite(
            this.wizard.x + offset.x,
            this.wizard.y + offset.y,
            'fire-spell'
        );

        // Set properties
        flame.setDepth(5);
        flame.setScale(scale); // Use the scale we already calculated

        // Set rotation to match direction angle
        // Default sprite orientation is down-left (3π/4 radians or 135 degrees)
        // So we need to rotate from that default to the desired direction
        const defaultAngle = 3 * Math.PI / 4; // down-left
        flame.setRotation(angle - defaultAngle);
        // Remove vertical flip to change which corner is the contact point
        flame.setFlipY(false);

        // Play animation only if it exists and not already playing
        if (this.anims.exists('fire-spell-anim') && (!flame.anims.isPlaying || flame.anims.currentAnim.key !== 'fire-spell-anim')) {
            flame.play('fire-spell-anim');
        }

        // Set physics properties
        // Scale collision box with sprite size
        const isDoubleScale = currentGroup.length === 2 && currentGroup.every(e => e === 'fire');
        const collisionSize = isDoubleScale ? 40 : 20;
        flame.body.setSize(collisionSize, collisionSize); // Collision box
        flame.element = 'fire';
        // Get slot buffs and apply damage multiplier
        const slotBuff = this.slotBuffs[slotIndex] || { damageMultiplier: 1, speedMultiplier: 1 };
        
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        flame.damage = 0.5 * slotBuff.damageMultiplier * tierDamageScale; // Apply slot and tier damage buffs
        
        flame.linkedCount = currentGroup.length;
        flame.slotIndex = slotIndex; // Store slot index for reference
        flame.isStationary = true; // Mark as stationary effect
        flame.tier = elementTier; // Store tier for visual effects

        // Add to projectiles group for collision detection
        this.projectiles.add(flame);

        // Store reference
        this.activeFlames[0] = flame;

        // Auto-destroy after animation completes, reduced duration for speed buffs
        const duration = Math.max(500, 1000 / slotBuff.speedMultiplier); // Faster speed = shorter duration
        this.time.delayedCall(duration, () => {
            if (flame && flame.active) {
                flame.destroy();
                if (this.activeFlames[0] === flame) {
                    this.activeFlames[0] = null;
                }
            }
        });
    }

    createWaterOrb(elementGroup = ['water'], allCharges = null, slotIndex = 0, elementTier = 1) {
        console.log('=== WATER SPELL START ===');

        // Absolute prevention of multiple water spells
        if (this.activeWaterSprite && this.activeWaterSprite.active) {
            console.log('BLOCKED: Water sprite already exists');
            return;
        }

        // Count total water elements from all charges if provided, otherwise from the group
        const waterCount = allCharges
            ? allCharges.filter(e => e === 'water').length
            : elementGroup.filter(e => e === 'water').length;

        console.log('Water count for scaling:', waterCount);

        // Base scale 4.5 (50% larger), 100% larger (2x) for each water element
        const scale = 4.5 * waterCount;

        // Create water spell as a physics sprite with collision detection
        const waterSprite = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'water-spell');
        this.activeWaterSprite = waterSprite;
        waterSprite.setOrigin(0.5, 0.5);
        waterSprite.setScale(scale);
        waterSprite.setDepth(20);

        // Set up physics body to match visual size
        // Base sprite is 32x32, scaled by the scale factor
        // Set hitbox radius proportional to scale
        const hitboxRadius = 15 * waterCount; // Scale hitbox with water count (50% larger)
        waterSprite.body.setCircle(hitboxRadius);
        // Center the circular hitbox on the sprite
        // For a sprite with origin 0.5, 0.5, center the physics body
        const offset = 16 - hitboxRadius; // 16 is half of 32 (sprite size)
        waterSprite.body.setOffset(offset, offset);

        // Get slot buffs and apply damage multiplier
        const slotBuff = this.slotBuffs[slotIndex] || { damageMultiplier: 1, speedMultiplier: 1 };
        
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        
        // Mark as water spell for collision detection
        waterSprite.isWaterSpell = true;
        waterSprite.damage = 3 * slotBuff.damageMultiplier * tierDamageScale; // Apply damage buff and tier scaling
        waterSprite.hitEnemies = new Set(); // Track which enemies have been hit
        waterSprite.slotIndex = slotIndex; // Store slot index

        // Play animation only if it exists
        if (this.anims.exists('water-spell-anim')) {
            waterSprite.play('water-spell-anim');
        }

        // Enable debug rendering for this sprite if debug mode is on
        if (this.physics.world.drawDebug) {
            waterSprite.body.debugShowBody = true;
            waterSprite.body.debugShowVelocity = true;
        }

        console.log('Water sprite created:', waterSprite);

        // Set up collision with enemies
        const waterOverlap = this.physics.add.overlap(
            waterSprite,
            this.enemies,
            (water, enemy) => {
                // Check if this enemy was already hit by this water spell
                if (!enemy.active || water.hitEnemies.has(enemy)) return;

                // Mark enemy as hit
                water.hitEnemies.add(enemy);

                // Apply damage
                enemy.health -= water.damage;

                // Apply wet status effect
                enemy.wet = true;
                enemy.wetEndTime = this.time.now + 6000; // Wet for 6 seconds (increased by 100%)
                enemy.waterSlowFactor = 0.5; // Reduce speed by 50%

                // Visual effect on enemy - blue tint for wet
                enemy.setTint(0x4488ff);
                
                // Remove wet status after 6 seconds
                this.time.delayedCall(6000, () => {
                    if (enemy.active) {
                        enemy.wet = false;
                        enemy.clearTint();
                    }
                });

                // Show damage number
                this.showDamageNumber(enemy.x, enemy.y - 20, water.damage);

                if (enemy.health <= 0) {
                    this.killEnemy(enemy);
                }
            }
        );

        // Destroy after animation completes
        waterSprite.on('animationcomplete', () => {
            console.log('Water animation complete, destroying');
            waterOverlap.destroy(); // Remove collision detection
            waterSprite.destroy();
            this.activeWaterSprite = null;
        });
    }

    fireLightningProjectile(slotIndex = 0, elementTier = 1) {
        // Find the closest enemy
        let closestEnemy = null;
        let closestDistance = Infinity;

        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && !enemy.isDying) {
                const distance = Phaser.Math.Distance.Between(this.wizard.x, this.wizard.y, enemy.x, enemy.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });

        // If no enemy found, don't fire
        if (!closestEnemy) return;

        // Create lightning orb projectile
        const lightningOrb = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'lightning-spell');
        // Play animation only if it exists
        if (this.anims.exists('lightning-spell-anim')) {
            lightningOrb.play('lightning-spell-anim');
        }
        lightningOrb.setScale(1.5);
        lightningOrb.setDepth(20);

        // Get slot buffs and apply them
        const slotBuff = this.slotBuffs[slotIndex] || { damageMultiplier: 1, speedMultiplier: 1 };
        
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        
        // Set up projectile properties
        lightningOrb.bounceCount = 3; // Will bounce to 3 more enemies after initial hit
        lightningOrb.hitEnemies = new Set();
        lightningOrb.currentTarget = closestEnemy;
        lightningOrb.speed = 400 * slotBuff.speedMultiplier; // Apply speed buff
        lightningOrb.damage = 1.5 * slotBuff.damageMultiplier * tierDamageScale; // Apply damage buff and tier scaling
        lightningOrb.slotIndex = slotIndex; // Store slot index

        // Add to projectiles group
        this.projectiles.add(lightningOrb);

        // Set initial velocity towards first enemy
        this.setLightningOrbVelocity(lightningOrb, closestEnemy);
    }

    setLightningOrbVelocity(orb, target) {
        if (!target || !target.active) return;

        const angle = Phaser.Math.Angle.Between(orb.x, orb.y, target.x, target.y);
        orb.setVelocity(
            Math.cos(angle) * orb.speed,
            Math.sin(angle) * orb.speed
        );
    }

    handleLightningOrbHit(orb, enemy) {
        // Don't hit the same enemy twice
        if (orb.hitEnemies.has(enemy)) return;

        // Deal damage
        enemy.health -= orb.damage;
        orb.hitEnemies.add(enemy);

        // Visual effect on enemy
        enemy.setTint(0xffff00);
        this.time.delayedCall(100, () => {
            if (enemy.active) enemy.clearTint();
        });

        // Show damage number
        this.showDamageNumber(enemy.x, enemy.y - 20, orb.damage);

        // Check if enemy died
        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }

        // Create a visual lightning trail effect
        const trail = this.add.sprite(orb.x, orb.y, 'lightning-spell');
        trail.setScale(0.5);
        trail.setAlpha(0.5);
        trail.setDepth(19);
        this.tweens.add({
            targets: trail,
            alpha: 0,
            scale: 0,
            duration: 200,
            onComplete: () => trail.destroy()
        });

        // Find next target if bounces remain
        if (orb.bounceCount > 0) {
            let nextTarget = null;
            let nearestDistance = 250; // Max chain distance

            this.enemies.children.entries.forEach(nextEnemy => {
                if (nextEnemy.active && !nextEnemy.isDying && !orb.hitEnemies.has(nextEnemy)) {
                    const dist = Phaser.Math.Distance.Between(orb.x, orb.y, nextEnemy.x, nextEnemy.y);
                    if (dist < nearestDistance) {
                        nearestDistance = dist;
                        nextTarget = nextEnemy;
                    }
                }
            });

            if (nextTarget) {
                // Bounce to next enemy
                orb.bounceCount--;
                orb.currentTarget = nextTarget;
                this.setLightningOrbVelocity(orb, nextTarget);
            } else {
                // No more targets, destroy orb
                orb.destroy();
            }
        } else {
            // No more bounces, destroy orb
            orb.destroy();
        }
    }

    createWindGust() {
        // Create air spell sprite centered on wizard, starting with first frame
        const airSpell = this.add.sprite(this.wizard.x, this.wizard.y, 'air-spell-7');
        airSpell.setScale(3);
        airSpell.setDepth(20);
        airSpell.setAlpha(0.6); // Reduce opacity by 40%
        // Play animation only if it exists
        if (this.anims.exists('air-spell-anim')) {
            airSpell.play('air-spell-anim');
        }

        // Set up the effect radius
        const effectRadius = 200; // Large area of effect

        // Store reference to wizard for position updates
        airSpell.followTarget = this.wizard;

        // Add update event to make it follow the wizard
        const updateEvent = this.time.addEvent({
            delay: 16, // ~60 FPS update rate
            callback: () => {
                if (airSpell.active && airSpell.followTarget) {
                    airSpell.x = airSpell.followTarget.x;
                    airSpell.y = airSpell.followTarget.y;
                }
            },
            loop: true
        });

        // When animation completes, destroy the sprite and stop the update
        airSpell.once('animationcomplete', () => {
            updateEvent.destroy();
            airSpell.destroy();
        });

        // Apply knockback and damage to enemies
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active || enemy.isDying) return;

            const dist = Phaser.Math.Distance.Between(
                this.wizard.x, this.wizard.y,
                enemy.x, enemy.y
            );

            if (dist < effectRadius) {
                // Low damage
                enemy.health -= 0.5;

                // Show damage number
                this.showDamageNumber(enemy.x, enemy.y - 20, 0.5);

                // Check if enemy died
                if (enemy.health <= 0) {
                    this.killEnemy(enemy);
                } else {
                    // Calculate knockback angle
                    const angle = Phaser.Math.Angle.Between(
                        this.wizard.x, this.wizard.y,
                        enemy.x, enemy.y
                    );

                    // Strong knockback force that decreases with distance
                    const knockbackForce = (1 - dist / effectRadius) * 400;

                    // Check knockback immunity
                    const currentTime = this.time.now;
                    if (!enemy.knockbackImmuneUntil || currentTime > enemy.knockbackImmuneUntil) {
                        enemy.setVelocity(
                            Math.cos(angle) * knockbackForce,
                            Math.sin(angle) * knockbackForce
                        );

                        // Set knockback immunity
                        enemy.knockbackImmuneUntil = currentTime + 1500;
                        enemy.knockbackImmune = true;

                        this.time.delayedCall(1500, () => {
                            if (enemy.active) {
                                enemy.knockbackImmune = false;
                            }
                        });
                    }
                }
            }
        });
    }

    fireEarthProjectile(slotIndex = 0, elementTier = 1) {
        // Get slot buffs and apply them
        const slotBuff = this.slotBuffs[slotIndex] || { damageMultiplier: 1, speedMultiplier: 1 };
        
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        
        // Create earth projectile that travels in a straight line
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'earth-spell');
        projectile.element = 'earth';
        projectile.damage = 3 * slotBuff.damageMultiplier * tierDamageScale; // Reduced from 4 to 3, with tier scaling
        projectile.knockbackForce = 1600; // 2x knockback force
        projectile.slotIndex = slotIndex; // Store slot index
        projectile.isPiercing = true;
        projectile.body.setCollideWorldBounds(false);
        projectile.setDepth(5);
        projectile.setScale(1.5); // Scale for earth spell
        
        // Play animation if it exists
        if (this.anims.exists('earth-spell-anim')) {
            projectile.play('earth-spell-anim');
        }

        // Add to projectiles group first
        this.projectiles.add(projectile);

        // Directional firing with speed buff applied
        const speed = 300 * slotBuff.speedMultiplier; // Apply speed buff
        const diagonalSpeed = speed / Math.sqrt(2);

        const directions = {
            up: { x: 0, y: -speed },
            down: { x: 0, y: speed },
            left: { x: -speed, y: 0 },
            right: { x: speed, y: 0 },
            'up-left': { x: -diagonalSpeed, y: -diagonalSpeed },
            'up-right': { x: diagonalSpeed, y: -diagonalSpeed },
            'down-left': { x: -diagonalSpeed, y: diagonalSpeed },
            'down-right': { x: diagonalSpeed, y: diagonalSpeed }
        };

        const direction = this.wizard.lastDirection || 'down';
        const dir = directions[direction];

        if (!dir) {
            console.error(`Invalid direction: ${direction}`);
            const fallbackDir = directions['down'];
            projectile.setVelocity(fallbackDir.x, fallbackDir.y);
        } else {
            projectile.setVelocity(dir.x, dir.y);
        }

        // Rotate projectile to match direction
        const directionAngles = {
            'up': -Math.PI / 2,
            'down': Math.PI / 2,
            'left': Math.PI,
            'right': 0,
            'up-left': -3 * Math.PI / 4,
            'up-right': -Math.PI / 4,
            'down-left': 3 * Math.PI / 4,
            'down-right': Math.PI / 4
        };

        const angle = directionAngles[direction] || 0;
        projectile.setRotation(angle);

        // Destroy after 3 seconds
        this.time.delayedCall(3000, () => {
            if (projectile.active) {
                projectile.destroy();
            }
        });
    }

    createIceSpell(elementTier = 1) {
        // Create multiple ice crystals at random positions around the wizard
        const iceCount = 5; // Number of ice crystals to spawn
        const radius = 150; // Max distance from wizard
        
        for (let i = 0; i < iceCount; i++) {
            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * (radius - 50);
            
            // Calculate position
            const x = this.wizard.x + Math.cos(angle) * distance;
            const y = this.wizard.y + Math.sin(angle) * distance;
            
            // Create ice crystal sprite
            const iceCrystal = this.physics.add.sprite(x, y, 'ice-spell');
            iceCrystal.element = 'ice';
            
            // Apply tier damage scaling
            const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
            iceCrystal.damage = 2 * tierDamageScale;
            iceCrystal.freezeDuration = 2000; // 2 seconds freeze
            iceCrystal.body.setCollideWorldBounds(false);
            iceCrystal.setDepth(5);
            iceCrystal.setScale(1.2);
            
            // Play animation
            if (this.anims.exists('ice-spell-anim')) {
                iceCrystal.play('ice-spell-anim');
            }
            
            // Make it static (doesn't move)
            iceCrystal.body.setVelocity(0, 0);
            iceCrystal.body.setImmovable(true);
            
            // Add to projectiles group for collision detection
            this.projectiles.add(iceCrystal);
            
            // Add freeze effect on hit
            iceCrystal.freezeEnemy = true;
            
            // Fade in effect
            iceCrystal.setAlpha(0);
            this.tweens.add({
                targets: iceCrystal,
                alpha: 0.8,
                duration: 300,
                ease: 'Power2'
            });
            
            // Destroy after 3 seconds
            this.time.delayedCall(3000, () => {
                if (iceCrystal.active) {
                    // Fade out before destroying
                    this.tweens.add({
                        targets: iceCrystal,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => iceCrystal.destroy()
                    });
                }
            });
            
            // Delay between spawning each crystal
            this.time.delayedCall(i * 100, () => {});
        }
    }

    createPoisonMines() {
        // Create a group to track active poison fields if not exists
        if (!this.poisonFields) {
            this.poisonFields = this.physics.add.group();
        }
        
        // Debug check
        if (!this.textures.exists('poison-spell')) {
            console.error('Poison spell texture not loaded!');
            return;
        }
        
        // Calculate position behind wizard based on last movement direction
        const direction = this.wizard.lastDirection || 'down';
        let offsetX = 0;
        let offsetY = 0;
        const baseDistance = 50; // Distance behind wizard
        
        // Determine offset based on direction
        switch (direction) {
            case 'up':
                offsetY = baseDistance;
                break;
            case 'down':
                offsetY = -baseDistance;
                break;
            case 'left':
                offsetX = baseDistance;
                break;
            case 'right':
                offsetX = -baseDistance;
                break;
            case 'up-left':
                offsetX = baseDistance / Math.sqrt(2);
                offsetY = baseDistance / Math.sqrt(2);
                break;
            case 'up-right':
                offsetX = -baseDistance / Math.sqrt(2);
                offsetY = baseDistance / Math.sqrt(2);
                break;
            case 'down-left':
                offsetX = baseDistance / Math.sqrt(2);
                offsetY = -baseDistance / Math.sqrt(2);
                break;
            case 'down-right':
                offsetX = -baseDistance / Math.sqrt(2);
                offsetY = -baseDistance / Math.sqrt(2);
                break;
        }
        
        let spawnX = this.wizard.x + offsetX;
        let spawnY = this.wizard.y + offsetY;
        
        // Check for existing mines and adjust position if needed
        const mineSpacing = 35;
        let attempts = 0;
        const maxAttempts = 8;
        
        while (attempts < maxAttempts) {
            let tooClose = false;
            
            // Check distance to all existing poison fields
            this.poisonFields.children.entries.forEach(existingField => {
                if (existingField.active) {
                    const dist = Phaser.Math.Distance.Between(spawnX, spawnY, existingField.x, existingField.y);
                    if (dist < mineSpacing) {
                        tooClose = true;
                    }
                }
            });
            
            if (!tooClose) {
                break; // Found a good spot
            }
            
            // Try adjacent positions in a circle
            const angle = (attempts * Math.PI * 2) / maxAttempts;
            spawnX = this.wizard.x + offsetX + Math.cos(angle) * mineSpacing;
            spawnY = this.wizard.y + offsetY + Math.sin(angle) * mineSpacing;
            attempts++;
        }
        
        // Create poison field at calculated position
        const field = this.physics.add.sprite(spawnX, spawnY, 'poison-spell');
        field.setFrame(0); // Stay on first frame initially
        field.setScale(0.75); // 50% smaller than default
        field.setDepth(4); // Above ground but below UI
        field.body.setImmovable(true);
        field.body.setSize(30, 30); // Adjusted trigger area for smaller size
        
        // Track if animation has played
        field.hasTriggered = false;
        
        // Add a subtle pulsing effect to show it's active
        field.pulseTween = this.tweens.add({
            targets: field,
            alpha: { from: 0.8, to: 1 },
            scale: { from: 0.75, to: 0.85 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        field.element = 'poison';
        field.hitEnemies = new Set(); // Track which enemies have been poisoned
        
        // Add to fields group
        this.poisonFields.add(field);
        
        // Setup collision with enemies
        this.physics.add.overlap(field, this.enemies, (field, enemy) => {
            if (enemy.active && !enemy.isDying && !field.hitEnemies.has(enemy)) {
                // Mark this enemy as hit by this field
                field.hitEnemies.add(enemy);
                
                // Play animation on first collision
                if (!field.hasTriggered) {
                    field.hasTriggered = true;
                    // Stop pulsing
                    if (field.pulseTween) {
                        field.pulseTween.stop();
                    }
                    field.setScale(0.75); // Reset scale
                    field.setAlpha(1); // Reset alpha
                    // Play poison animation only if it exists
                    if (this.anims.exists('poison-mine-anim')) {
                        field.play('poison-mine-anim');
                    }
                    // Destroy field after animation completes
                    field.once('animationcomplete', () => {
                        field.destroy();
                    });
                }
                
                // Apply poison to enemy if not already poisoned
                if (!enemy.poisoned) {
                    enemy.poisoned = true;
                    enemy.poisonDamage = 1; // 1 damage every 2 seconds
                    
                    // Visual poison effect - green tint
                    enemy.setTint(0x00ff00);
                    
                    // Store the timer on the enemy for cleanup
                    if (enemy.poisonTimer) {
                        enemy.poisonTimer.destroy();
                    }
                    
                    // Create poison damage timer that continues until death
                    enemy.poisonTimer = this.time.addEvent({
                        delay: 2000, // Every 2 seconds
                        callback: () => {
                            if (enemy.active && !enemy.isDying) {
                                // Deal poison damage
                                enemy.health -= enemy.poisonDamage;
                                this.showDamageNumber(enemy.x, enemy.y - 20, enemy.poisonDamage, '#00ff00');
                                
                                // Check if enemy died from poison
                                if (enemy.health <= 0) {
                                    if (enemy.poisonTimer) {
                                        enemy.poisonTimer.destroy();
                                        enemy.poisonTimer = null;
                                    }
                                    enemy.poisoned = false;
                                    this.killEnemy(enemy);
                                }
                            } else {
                                // Enemy no longer exists
                                if (enemy.poisonTimer) {
                                    enemy.poisonTimer.destroy();
                                    enemy.poisonTimer = null;
                                }
                            }
                        },
                        loop: true
                    });
                }
            }
        });
        
        // Auto-animate and destroy field after 10 seconds if untouched
        this.time.delayedCall(10000, () => {
            if (field.active && !field.hasTriggered) {
                field.hasTriggered = true;
                // Stop pulsing
                if (field.pulseTween) {
                    field.pulseTween.stop();
                }
                field.setScale(0.75); // Reset scale
                field.setAlpha(1); // Reset alpha
                // Play animation before destroying
                if (this.anims.exists('poison-mine-anim')) {
                    field.play('poison-mine-anim');
                }
                field.once('animationcomplete', () => {
                    field.destroy();
                });
            }
        });
    }

    createEarthquake(linkedCount = 1) {
        // Use the direction the wizard is facing
        const diagonalValue = 1 / Math.sqrt(2);
        const directions = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            'up-left': { x: -diagonalValue, y: -diagonalValue },
            'up-right': { x: diagonalValue, y: -diagonalValue },
            'down-left': { x: -diagonalValue, y: diagonalValue },
            'down-right': { x: diagonalValue, y: diagonalValue }
        };

        const dir = directions[this.wizard.lastDirection || 'down'];
        const dx = dir.x;
        const dy = dir.y;

        // Create shaking tiles - wider based on linked earth charges
        const baseWidth = 1;
        const width = baseWidth + (linkedCount - 1); // Each linked earth adds 1 to width

        for (let i = 0; i < 30; i++) {
            for (let w = -Math.floor(width / 2); w <= Math.floor(width / 2); w++) {
                // Create perpendicular offset for width
                const perpX = -dy * w * 20; // Perpendicular to direction
                const perpY = dx * w * 20;

                const x = this.wizard.x + (dx * i * 16) + perpX;
                const y = this.wizard.y + (dy * i * 16) + perpY;

                // Create earthquake effect
                const tile = this.add.rectangle(x, y, 16, 16, 0x8B4513, 0.5);
                tile.setDepth(1);

                // Shake animation
                this.tweens.add({
                    targets: tile,
                    x: x + Phaser.Math.Between(-2, 2),
                    y: y + Phaser.Math.Between(-2, 2),
                    duration: 100,
                    repeat: 10,
                    yoyo: true,
                    onComplete: () => tile.destroy()
                });

                // Check for enemies on this tile
                this.enemies.children.entries.forEach(enemy => {
                    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, x, y);
                    if (dist < 20) {
                        enemy.health -= 3;
                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        } else {
                            enemy.setTint(0x8B4513);
                            this.time.delayedCall(200, () => {
                                if (enemy.active) enemy.clearTint();
                            });
                        }
                    }
                });
            }
        }
    }

    fireEarthSpike() {
        // Create earth spikes in the direction the wizard is facing
        const diagonalValue = 1 / Math.sqrt(2); // Normalize diagonal movement
        const directions = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            'up-left': { x: -diagonalValue, y: -diagonalValue },
            'up-right': { x: diagonalValue, y: -diagonalValue },
            'down-left': { x: -diagonalValue, y: diagonalValue },
            'down-right': { x: diagonalValue, y: diagonalValue }
        };

        const dir = directions[this.wizard.lastDirection || 'down'];

        // Create a line of earth spikes
        for (let i = 1; i <= 8; i++) {
            const x = this.wizard.x + dir.x * i * 30;
            const y = this.wizard.y + dir.y * i * 30;

            // Delay each spike slightly for wave effect
            this.time.delayedCall(i * 50, () => {
                this.createEarthZone(x, y);

                // Create visual spike - brown earth color for earth-earth combo
                const spike = this.add.triangle(x, y + 15, 0, 15, 7, 0, 15, 15, 0x8B4513);
                spike.setDepth(4);
                spike.setOrigin(0.5, 1);

                // Animate spike emerging
                spike.setScale(0, 0);
                this.tweens.add({
                    targets: spike,
                    scaleX: 1,
                    scaleY: 1.5,
                    duration: 200,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        // Keep spike visible but fade slightly
                        this.tweens.add({
                            targets: spike,
                            alpha: 0.7,
                            duration: 500
                        });
                    }
                });

                // Remove spike after zone expires
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: spike,
                        scaleY: 0,
                        duration: 200,
                        onComplete: () => spike.destroy()
                    });
                });
            });
        }
    }

    createEarthZone(x, y) {
        // Create a damage zone that persists
        const zone = {
            x: x,
            y: y,
            radius: 20,
            active: true,
            startTime: this.time.now
        };

        this.earthZones.push(zone);

        // Remove zone after 3 seconds
        this.time.delayedCall(3000, () => {
            zone.active = false;
            const index = this.earthZones.indexOf(zone);
            if (index > -1) {
                this.earthZones.splice(index, 1);
            }
        });

        // Check for initial damage
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, x, y);
                if (dist < 20) {
                    enemy.health -= 3;
                    if (enemy.health <= 0) {
                        this.killEnemy(enemy);
                    } else {
                        enemy.setTint(0x8B4513);
                        this.time.delayedCall(200, () => {
                            if (enemy.active) enemy.clearTint();
                        });
                    }
                }
            }
        });
    }

    // New element abilities
    fireRockProjectile(elementTier = 1) {
        // Rock element - lobs multiple heavy stones in arcs
        const stoneCount = 3 + Math.floor((elementTier - 1) / 2); // 3-5 stones based on tier
        const baseAngle = Math.random() * Math.PI * 2; // Random starting direction
        const spreadAngle = Math.PI / 3; // 60 degree spread
        
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        
        for (let i = 0; i < stoneCount; i++) {
            // Calculate angle for this stone
            const angleOffset = (i - (stoneCount - 1) / 2) * (spreadAngle / (stoneCount - 1));
            const launchAngle = baseAngle + angleOffset;
            
            // Create rock projectile
            const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'rock-spell');
            projectile.setScale(0.8 + Math.random() * 0.4); // Vary sizes slightly
            projectile.setDepth(5);
            
            // Play animation but stop at frame 2 (half of 6 frames)
            projectile.play('rock-spell-anim');
            
            // Stop animation after reaching frame 2
            projectile.on('animationupdate', (anim, frame) => {
                if (frame.index >= 2) {
                    projectile.anims.pause();
                    projectile.setFrame(2); // Stay on frame 2
                    projectile.off('animationupdate'); // Remove listener
                }
            });
            
            // Base damage is 4-8, with 30% crit chance
            const isCritical = Math.random() < 0.3;
            const baseDamage = 4 + Math.random() * 4;
            projectile.damage = (isCritical ? baseDamage * 2 : baseDamage) * tierDamageScale;
            projectile.isCritical = isCritical;
            projectile.element = 'rock';
            projectile.stuns = true; // Rock projectiles can stun
            projectile.stunDuration = 500; // 0.5 second stun
            projectile.body.setCollideWorldBounds(false);
            
            // Add visual indicator for critical
            if (isCritical) {
                projectile.setTint(0xff6666);
                projectile.setScale(projectile.scale * 1.3);
            }
            
            // Add to projectiles group FIRST
            this.projectiles.add(projectile);
            
            // Apply gravity to create arc
            projectile.body.setGravityY(800); // Gravity for arc trajectory
            
            // Set initial velocity with upward component (reduced by 50%)
            const horizontalSpeed = 150 + Math.random() * 75; // Vary speeds (150-225)
            const upwardSpeed = 200 + Math.random() * 100; // Upward launch (200-300)
            projectile.setVelocity(
                Math.cos(launchAngle) * horizontalSpeed,
                Math.sin(launchAngle) * horizontalSpeed - upwardSpeed // Subtract to go up
            );
            
            // Rotate the rock as it flies
            projectile.rotationSpeed = 0.1 + Math.random() * 0.1;
            
            // Update rotation during flight
            const rotationUpdate = this.time.addEvent({
                delay: 16,
                callback: () => {
                    if (projectile.active) {
                        projectile.rotation += projectile.rotationSpeed;
                    } else {
                        rotationUpdate.destroy();
                    }
                },
                loop: true
            });
            
            // Add ground impact effect
            const groundCheck = this.time.addEvent({
                delay: 50,
                callback: () => {
                    if (projectile.active && projectile.body.velocity.y > 0 && projectile.y > this.wizard.y + 200) {
                        // Create impact effect
                        const impact = this.add.circle(projectile.x, projectile.y, 20, 0x8b4513, 0.5);
                        impact.setDepth(4);
                        
                        this.tweens.add({
                            targets: impact,
                            scale: { from: 0.5, to: 1.5 },
                            alpha: { from: 0.5, to: 0 },
                            duration: 300,
                            onComplete: () => impact.destroy()
                        });
                        
                        // Create small dust particles
                        for (let j = 0; j < 3; j++) {
                            const dust = this.add.circle(
                                projectile.x + (Math.random() - 0.5) * 20,
                                projectile.y,
                                3,
                                0x8b4513,
                                0.6
                            );
                            dust.setDepth(4);
                            
                            this.tweens.add({
                                targets: dust,
                                y: dust.y - 20 - Math.random() * 20,
                                x: dust.x + (Math.random() - 0.5) * 30,
                                alpha: 0,
                                duration: 500,
                                onComplete: () => dust.destroy()
                            });
                        }
                        
                        projectile.destroy();
                        groundCheck.destroy();
                        rotationUpdate.destroy();
                    }
                },
                loop: true
            });
            
            // Destroy after max flight time
            this.time.delayedCall(3000, () => {
                if (projectile.active) {
                    projectile.destroy();
                }
                groundCheck.destroy();
                rotationUpdate.destroy();
            });
        }
        
        // Screen shake effect when launching rocks
        this.cameras.main.shake(100, 0.005);
    }

    createAirBlast() {
        // Air element - pushback blast
        const blast = this.add.circle(this.wizard.x, this.wizard.y, 30, 0xcccccc, 0.3);
        blast.setDepth(5);

        this.tweens.add({
            targets: blast,
            scale: { from: 1, to: 5 },
            alpha: { from: 0.5, to: 0 },
            duration: 500,
            onComplete: () => blast.destroy()
        });

        // Push enemies away - optimized version
        const wizardX = this.wizard.x;
        const wizardY = this.wizard.y;
        const radiusSquared = 150 * 150; // Pre-calculate to avoid sqrt

        // Only process active enemies
        const enemies = this.enemies.children.entries;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            // Skip inactive or dying enemies
            if (!enemy || !enemy.active || enemy.isDying) continue;

            // Use squared distance to avoid expensive sqrt calculation
            const dx = enemy.x - wizardX;
            const dy = enemy.y - wizardY;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < radiusSquared) {
                const distance = Math.sqrt(distanceSquared);
                const angle = Math.atan2(dy, dx);
                const force = (150 - distance) * 5;

                // Check knockback immunity
                const currentTime = this.time.now;
                if (!enemy.knockbackImmuneUntil || currentTime > enemy.knockbackImmuneUntil) {
                    enemy.setVelocity(
                        Math.cos(angle) * force,
                        Math.sin(angle) * force
                    );

                    // Set knockback immunity
                    enemy.knockbackImmuneUntil = currentTime + 1500;
                    enemy.knockbackImmune = true;

                    this.time.delayedCall(1500, () => {
                        if (enemy.active) {
                            enemy.knockbackImmune = false;
                        }
                    });
                }

                enemy.health -= 1;
                if (enemy.health <= 0) {
                    this.killEnemy(enemy);
                }
            }
        }
    }

    createHolyLight() {
        // Holy element - healing aura + damage undead
        const aura = this.add.circle(this.wizard.x, this.wizard.y, 100, 0xffdd00, 0.2);
        aura.setDepth(4);

        // Heal wizard
        this.playerHealth = Math.min(this.playerHealth + 10, this.maxHealth);
        this.updateHealthBar();
        this.updateWizardHealthBar();

        // Pulse animation
        this.tweens.add({
            targets: aura,
            scale: { from: 0, to: 1.5 },
            alpha: { from: 0.6, to: 0 },
            duration: 1000,
            onComplete: () => aura.destroy()
        });

        // Damage nearby enemies
        this.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
            if (distance < 100) {
                enemy.health -= 2;
                enemy.setTint(0xffdd00);
                this.time.delayedCall(200, () => {
                    if (enemy.active) enemy.clearTint();
                });
                if (enemy.health <= 0) {
                    this.killEnemy(enemy);
                }
            }
        });
    }

    fireDoubleArcane() {
        // Find closest enemy for both projectiles to target
        let closestEnemy = null;
        let closestDistance = Infinity;

        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && !enemy.isDying) {
                const distance = Phaser.Math.Distance.Between(this.wizard.x, this.wizard.y, enemy.x, enemy.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });

        // If no enemy found, don't fire
        if (!closestEnemy) return;

        // Fire two arcane projectiles with slight offset
        for (let i = 0; i < 2; i++) {
            const offsetAngle = (i === 0 ? -0.2 : 0.2); // Slight angle offset
            const offsetX = Math.cos(offsetAngle) * 30;
            const offsetY = Math.sin(offsetAngle) * 30;

            // Create projectile with animated sprite
            const projectile = this.physics.add.sprite(
                this.wizard.x + offsetX,
                this.wizard.y + offsetY,
                'arcane-spell'
            );
            if (this.anims.exists('arcane-spell-fire')) {
                projectile.play('arcane-spell-fire');
            }
            projectile.element = 'arcane';
            projectile.damage = 4; // Increased damage for linked version
            projectile.setDepth(5);
            projectile.setScale(1.8); // Slightly larger

            // Lock onto same target
            projectile.isHoming = true;
            projectile.homingTarget = closestEnemy;
            projectile.homingSpeed = 350; // Faster than single

            // Calculate initial velocity toward target
            const angle = Phaser.Math.Angle.Between(
                projectile.x, projectile.y,
                closestEnemy.x, closestEnemy.y
            ) + offsetAngle;

            projectile.setVelocity(
                Math.cos(angle) * projectile.homingSpeed,
                Math.sin(angle) * projectile.homingSpeed
            );

            // Visual effect - intense purple glow
            projectile.setTint(0xff44ff);

            this.projectiles.add(projectile);

            // Auto-destroy after 5 seconds if it doesn't hit anything
            this.time.delayedCall(5000, () => {
                if (projectile.active) {
                    projectile.destroy();
                }
            });

            // Slight delay between projectiles
            if (i === 0) {
                this.time.delayedCall(100, () => { });
            }
        }
    }

    fireArcaneProjectile(elementTier = 1) {
        // Arcane element - boomerang projectile that passes through enemies
        
        // Find nearest enemy to target first (needed for spawn offset)
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && !enemy.isDying) {
                const distance = Phaser.Math.Distance.Between(this.wizard.x, this.wizard.y, enemy.x, enemy.y);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = enemy;
                }
            }
        });
        
        // Get angle to nearest enemy, or use wizard's facing direction if no enemies
        let angle;
        if (nearestEnemy) {
            angle = Phaser.Math.Angle.Between(this.wizard.x, this.wizard.y, nearestEnemy.x, nearestEnemy.y);
        } else {
            // Fallback to wizard's facing direction if no enemies found
            const directionMap = {
                'up': -Math.PI / 2,
                'down': Math.PI / 2,
                'left': Math.PI,
                'right': 0,
                'up-left': -3 * Math.PI / 4,
                'up-right': -Math.PI / 4,
                'down-left': 3 * Math.PI / 4,
                'down-right': Math.PI / 4
            };
            angle = directionMap[this.wizard.lastDirection] || 0;
        }
        
        // Spawn projectile slightly offset from wizard in the direction it will travel
        const spawnOffset = 30;
        const spawnX = this.wizard.x + Math.cos(angle) * spawnOffset;
        const spawnY = this.wizard.y + Math.sin(angle) * spawnOffset;
        
        // Create projectile with animated sprite
        const projectile = this.physics.add.sprite(spawnX, spawnY, 'arcane-spell');
        if (this.anims.exists('arcane-spell-fire')) {
            projectile.play('arcane-spell-fire');  // Play firing animation
        }

        // When animation completes, hold on frame 5
        projectile.on('animationcomplete', () => {
            projectile.setFrame(5);
        });

        projectile.element = 'arcane';
        
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        projectile.damage = 3 * tierDamageScale;
        projectile.setDepth(5);
        projectile.setScale(1.5); // Double the size from 0.75

        // Boomerang properties
        projectile.isBoomerang = true;
        projectile.passThroughEnemies = true;
        projectile.hitEnemies = new Set(); // Track enemies already hit to prevent multiple hits
        projectile.returnTime = 1000; // Time before returning (1 second)
        projectile.baseSpeed = 300;
        projectile.returnStarted = false;
        projectile.startX = this.wizard.x;
        projectile.startY = this.wizard.y;
        projectile.initialAngle = angle; // Store the initial angle

        // Set initial velocity using the angle we already calculated
        projectile.setVelocity(
            Math.cos(angle) * projectile.baseSpeed,
            Math.sin(angle) * projectile.baseSpeed
        );

        // Visual effect - purple glow with rotation
        projectile.setTint(0xff88ff);
        
        // Add rotation for boomerang effect
        projectile.rotationSpeed = 0.3;

        // Start the return timer
        this.time.delayedCall(projectile.returnTime, () => {
            if (projectile.active && !projectile.returnStarted) {
                projectile.returnStarted = true;
            }
        });

        // Update function for boomerang behavior
        projectile.updateBoomerang = () => {
            if (!projectile.active) return;
            
            // Rotate the projectile
            projectile.rotation += projectile.rotationSpeed;
            
            if (projectile.returnStarted) {
                // Calculate return trajectory to wizard
                const returnAngle = Phaser.Math.Angle.Between(
                    projectile.x, 
                    projectile.y, 
                    this.wizard.x, 
                    this.wizard.y
                );
                
                // Smoothly adjust velocity towards wizard
                const returnSpeed = projectile.baseSpeed * 1.5; // Faster on return
                projectile.setVelocity(
                    Math.cos(returnAngle) * returnSpeed,
                    Math.sin(returnAngle) * returnSpeed
                );
                
                // Check if close enough to wizard to destroy
                const distToWizard = Phaser.Math.Distance.Between(
                    projectile.x, 
                    projectile.y, 
                    this.wizard.x, 
                    this.wizard.y
                );
                
                if (distToWizard < 30) {
                    projectile.destroy();
                }
            } else {
                // Make sure projectile maintains its initial velocity until return starts
                // This prevents the projectile from stopping or slowing down
                if (!projectile.body.velocity.x && !projectile.body.velocity.y) {
                    // Re-apply velocity if it somehow got zeroed
                    projectile.setVelocity(
                        Math.cos(projectile.initialAngle) * projectile.baseSpeed,
                        Math.sin(projectile.initialAngle) * projectile.baseSpeed
                    );
                }
            }
        };

        this.projectiles.add(projectile);
    }

    createDustCloud() {
        // Dust element - blinds enemies
        const cloud = this.add.circle(this.wizard.x, this.wizard.y, 80, 0xcc9966, 0.4);
        cloud.setDepth(4);

        this.tweens.add({
            targets: cloud,
            scale: { from: 0.5, to: 2 },
            alpha: { from: 0.6, to: 0 },
            duration: 2000,
            onComplete: () => cloud.destroy()
        });

        // Blind enemies in area
        this.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
            if (distance < 120) {
                enemy.blinded = true;
                enemy.setAlpha(0.5);
                enemy.setVelocity(0, 0);

                // Remove blind after 2 seconds
                this.time.delayedCall(2000, () => {
                    if (enemy.active) {
                        enemy.blinded = false;
                        enemy.setAlpha(1);
                    }
                });
            }
        });
    }

    createFirePool(x, y, linkedCount = 1, duration = 3000, burnMagnitude = 0) {
        // Create texture for lava pool if burn magnitude is high (lava)
        const isLavaPool = burnMagnitude > 0;
        const textureName = isLavaPool ? 'lava-pool' : 'fire-pool';
        
        if (!this.textures.exists(textureName)) {
            const graphics = this.add.graphics();
            if (isLavaPool) {
                // Lava pool - orange/red gradient
                graphics.fillStyle(0xff6600, 0.8);
                graphics.fillCircle(20, 20, 20);
                graphics.fillStyle(0xff0000, 0.6);
                graphics.fillCircle(20, 20, 15);
                graphics.generateTexture(textureName, 40, 40);
            } else {
                // Fire pool
                graphics.fillStyle(0xff4444, 0.6);
                graphics.fillCircle(15, 15, 15);
                graphics.generateTexture(textureName, 30, 30);
            }
            graphics.destroy();
        }

        const pool = this.physics.add.sprite(x, y, textureName);
        pool.setDepth(1);
        pool.body.setSize(isLavaPool ? 40 : 30, isLavaPool ? 40 : 30);
        pool.startTime = this.time.now;
        pool.linkedCount = linkedCount; // Store linked fire count
        pool.burnMagnitude = burnMagnitude; // Store burn magnitude for lava
        pool.isLavaPool = isLavaPool;

        // Burning animation
        this.tweens.add({
            targets: pool,
            scale: { from: 0.8, to: isLavaPool ? 1.3 : 1.2 },
            alpha: { from: 0.8, to: 0.4 },
            duration: 300,
            yoyo: true,
            repeat: -1
        });

        this.firePools.push(pool);
        
        // Apply burn damage for lava pools
        if (isLavaPool) {
            const burnInterval = this.time.addEvent({
                delay: 500, // Every 0.5 seconds
                callback: () => {
                    if (!pool.active) {
                        burnInterval.destroy();
                        return;
                    }
                    
                    // Check for enemies in the pool
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active) {
                            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, pool.x, pool.y);
                            if (dist < 25) { // Within pool radius
                                // Apply burn magnitude
                                if (!enemy.burnMagnitude) {
                                    enemy.burnMagnitude = 0;
                                }
                                enemy.burnMagnitude = Math.max(enemy.burnMagnitude, burnMagnitude);
                                
                                // Visual burn effect
                                enemy.setTint(0xff0000);
                                enemy.burning = true;
                                
                                // Start burn timer if not already burning
                                if (!enemy.burnTimer) {
                                    enemy.burnTimer = this.time.addEvent({
                                        delay: 500,
                                        callback: () => {
                                            if (enemy && enemy.active && enemy.burnMagnitude > 0) {
                                                const burnDamage = enemy.burnMagnitude;
                                                enemy.health -= burnDamage;
                                                this.showDamageNumber(enemy.x, enemy.y - 20, burnDamage, '#ff6600');
                                                enemy.burnMagnitude--;
                                                
                                                if (enemy.burnMagnitude <= 0) {
                                                    enemy.burning = false;
                                                    enemy.burnTimer.destroy();
                                                    enemy.burnTimer = null;
                                                    if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.wet && !enemy.muddy) {
                                                        enemy.clearTint();
                                                    }
                                                }
                                                
                                                if (enemy.health <= 0 && enemy.active) {
                                                    this.killEnemy(enemy);
                                                }
                                            }
                                        },
                                        loop: true
                                    });
                                }
                            }
                        }
                    });
                },
                repeat: -1
            });
            
            // Store interval reference on pool for cleanup
            pool.burnInterval = burnInterval;
        }

        // Auto-remove/explode after duration
        this.time.delayedCall(duration, () => {
            if (pool.active) {
                // Clean up burn interval for lava pools
                if (pool.burnInterval) {
                    pool.burnInterval.destroy();
                }
                
                // Only create explosion for fire pools, not lava pools
                if (!isLavaPool) {
                    // Create explosion effect with size based on linked charges
                    const explosionRadius = 40 + (linkedCount - 1) * 20; // Base 40, +20 per extra fire
                    const explosion = this.add.circle(pool.x, pool.y, explosionRadius, 0xff6644, 0.8);
                    explosion.setDepth(4);

                    this.tweens.add({
                        targets: explosion,
                        scale: { from: 0.5, to: 1.5 },
                        alpha: { from: 0.8, to: 0 },
                        duration: 300,
                        onComplete: () => explosion.destroy()
                    });

                    // Damage enemies in explosion radius
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active) {
                            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, pool.x, pool.y);
                            if (dist < explosionRadius) {
                                enemy.health -= 3 + linkedCount; // Damage scales with linked fires
                                enemy.setTint(0xff0000);
                                this.time.delayedCall(200, () => {
                                    if (enemy.active) enemy.clearTint();
                                });

                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                }
                            }
                        }
                    });
                }

                pool.destroy();
                const index = this.firePools.indexOf(pool);
                if (index > -1) this.firePools.splice(index, 1);
            }
        });
    }

    fireMagnetizingOrb() {
        if (!this.textures.exists('magnetic-orb')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x888888, 1);
            graphics.fillCircle(8, 8, 8);
            graphics.generateTexture('magnetic-orb', 16, 16);
            graphics.destroy();
        }

        const orb = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'magnetic-orb');
        orb.isMagnetic = true;
        orb.body.setCollideWorldBounds(false);
        orb.setDepth(5);

        this.projectiles.add(orb);

        const speed = 250;
        const diagonalSpeed = speed / Math.sqrt(2);

        const directions = {
            up: { x: 0, y: -speed },
            down: { x: 0, y: speed },
            left: { x: -speed, y: 0 },
            right: { x: speed, y: 0 },
            'up-left': { x: -diagonalSpeed, y: -diagonalSpeed },
            'up-right': { x: diagonalSpeed, y: -diagonalSpeed },
            'down-left': { x: -diagonalSpeed, y: diagonalSpeed },
            'down-right': { x: diagonalSpeed, y: diagonalSpeed }
        };

        const dir = directions[this.wizard.lastDirection || 'down'];
        orb.setVelocity(dir.x, dir.y);

        // Stop the orb after 0.5 seconds and activate magnetism
        this.time.delayedCall(500, () => {
            if (orb.active) {
                orb.setVelocity(0, 0);

                // Create magnetism effect
                const magnetField = this.add.circle(orb.x, orb.y, 200, 0x888888, 0.3);
                magnetField.setDepth(4);

                // Pulsing effect
                this.tweens.add({
                    targets: magnetField,
                    scale: { from: 1, to: 1.3 },
                    alpha: { from: 0.3, to: 0.1 },
                    duration: 400,
                    yoyo: true,
                    repeat: 11
                });

                // Magnetize and slow enemies
                const magnetDuration = 6000;
                const checkInterval = 30;
                let elapsed = 0;

                const magnetInterval = this.time.addEvent({
                    delay: checkInterval,
                    callback: () => {
                        elapsed += checkInterval;

                        if (elapsed >= magnetDuration || !orb.active) {
                            magnetInterval.destroy();
                            if (magnetField.active) magnetField.destroy();
                            if (orb.active) orb.destroy();
                            return;
                        }

                        this.enemies.children.entries.forEach(enemy => {
                            if (!enemy.active) return;

                            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, orb.x, orb.y);

                            if (distance < 250) {
                                // Much stronger pull toward orb
                                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, orb.x, orb.y);
                                const pullStrength = Math.pow((250 - distance) / 250, 1.5);
                                const pullForce = pullStrength * 350;

                                // Override enemy's current velocity with magnetic pull
                                enemy.setVelocity(
                                    Math.cos(angle) * pullForce,
                                    Math.sin(angle) * pullForce
                                );

                                // Apply slow effect visual
                                enemy.setTint(0x666666);

                                // Clear tint after effect ends
                                this.time.delayedCall(magnetDuration - elapsed, () => {
                                    if (enemy.active) enemy.clearTint();
                                });
                            }
                        });
                    },
                    loop: true
                });
            }
        });
    }

    fireExplosiveLightning() {
        if (!this.textures.exists('explosive-lightning')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffaa44, 1);
            graphics.fillCircle(10, 10, 10);
            graphics.lineStyle(2, 0xffff44, 1);
            graphics.strokeCircle(10, 10, 10);
            graphics.generateTexture('explosive-lightning', 20, 20);
            graphics.destroy();
        }

        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'explosive-lightning');
        projectile.element = 'fire-lightning';
        projectile.damage = 3;
        projectile.setDepth(5);
        projectile.isHoming = true;
        projectile.explosive = true;

        this.projectiles.add(projectile);
    }

    createSteamCloud() {
        if (!this.textures.exists('steam-cloud')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xaaaaff, 0.4);
            graphics.fillCircle(40, 40, 40);
            graphics.generateTexture('steam-cloud', 80, 80);
            graphics.destroy();
        }

        const cloud = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'steam-cloud');
        cloud.setDepth(4);
        cloud.body.setSize(80, 80);
        cloud.setAlpha(0.6);

        // Steam animation
        this.tweens.add({
            targets: cloud,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 0.8, to: 0.2 },
            duration: 2000,
            onComplete: () => cloud.destroy()
        });

        // Damage enemies in cloud
        const damageInterval = this.time.addEvent({
            delay: 200,
            callback: () => {
                this.enemies.children.entries.forEach(enemy => {
                    if (!enemy.active || !cloud.active) return;

                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, cloud.x, cloud.y);
                    if (distance < 60) {
                        enemy.health -= 0.5;
                        enemy.setTint(0x8888ff);
                        enemy.setVelocityX(enemy.body.velocity.x * 0.5);
                        enemy.setVelocityY(enemy.body.velocity.y * 0.5);

                        this.time.delayedCall(200, () => {
                            if (enemy.active) enemy.clearTint();
                        });

                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        }
                    }
                });
            },
            repeat: 9
        });
    }

    fireMeteor() {
        // Single meteor for combos (fire+earth)
        // Find nearest enemy
        let nearestEnemy = null;
        let minDistance = Infinity;

        this.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(this.wizard.x, this.wizard.y, enemy.x, enemy.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        });

        const targetX = nearestEnemy ? nearestEnemy.x : this.wizard.x + Phaser.Math.Between(-200, 200);
        const targetY = nearestEnemy ? nearestEnemy.y : this.wizard.y + Phaser.Math.Between(-200, 200);

        // Create meteor high above target
        const meteor = this.physics.add.sprite(targetX, targetY - 300, 'meteor-spell');
        meteor.setDepth(10);
        meteor.setScale(1.5);
        
        // Play meteor animation
        if (this.anims.exists('meteor-spell-anim')) {
            meteor.play('meteor-spell-anim');
        }

        // Fall animation
        this.tweens.add({
            targets: meteor,
            y: targetY,
            scale: 2,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Create impact
                const impact = this.add.circle(targetX, targetY, 60, 0xff8844, 0.6);
                impact.setDepth(4);

                this.tweens.add({
                    targets: impact,
                    scale: { from: 0.5, to: 1.5 },
                    alpha: { from: 0.8, to: 0 },
                    duration: 300,
                    onComplete: () => impact.destroy()
                });
                
                // Screen shake removed for smoother gameplay

                // Damage enemies in area (increased damage to 8)
                this.enemies.children.entries.forEach(enemy => {
                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, targetX, targetY);
                    if (distance < 80) {
                        enemy.health -= 8;
                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        } else {
                            // Knockback
                            const angle = Phaser.Math.Angle.Between(targetX, targetY, enemy.x, enemy.y);
                            enemy.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
                            enemy.setTint(0xff4444);
                            this.time.delayedCall(200, () => {
                                if (enemy.active) enemy.clearTint();
                            });
                        }
                    }
                });

                meteor.destroy();
            }
        });
    }

    fireChainLightning() {
        if (!this.textures.exists('chain-lightning')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x44aaff, 1);
            graphics.fillCircle(8, 8, 8);
            graphics.lineStyle(2, 0xffff44, 1);
            graphics.strokeCircle(8, 8, 8);
            graphics.generateTexture('chain-lightning', 16, 16);
            graphics.destroy();
        }

        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'chain-lightning');
        projectile.element = 'lightning-water';
        projectile.damage = 2;
        projectile.setDepth(5);
        projectile.isHoming = true;
        projectile.chainCount = 3;
        projectile.hitEnemies = [];

        this.projectiles.add(projectile);
    }

    createMagneticField() {
        if (!this.textures.exists('magnetic-field')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffff88, 0.3);
            graphics.fillCircle(50, 50, 50);
            graphics.lineStyle(3, 0x888844, 0.8);
            graphics.strokeCircle(50, 50, 50);
            graphics.generateTexture('magnetic-field', 100, 100);
            graphics.destroy();
        }

        const field = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'magnetic-field');
        field.setDepth(3);
        field.body.setSize(100, 100);
        field.setAlpha(0.5);

        // Rotating animation
        this.tweens.add({
            targets: field,
            rotation: Math.PI * 2,
            duration: 2000,
            repeat: -1
        });

        // Slow enemies in field
        const slowInterval = this.time.addEvent({
            delay: 50,
            callback: () => {
                this.enemies.children.entries.forEach(enemy => {
                    if (!enemy.active || !field.active) return;

                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, field.x, field.y);
                    if (distance < 120) {
                        // Apply strong slow effect (80% reduction)
                        enemy.setVelocityX(enemy.body.velocity.x * 0.2);
                        enemy.setVelocityY(enemy.body.velocity.y * 0.2);
                        enemy.setTint(0xffff88);

                        // Mark as slowed
                        enemy.magneticSlowed = true;
                    } else if (enemy.magneticSlowed) {
                        // Remove slow effect when out of range
                        enemy.magneticSlowed = false;
                        if (enemy.tintTopLeft === 0xffff88) {
                            enemy.clearTint();
                        }
                    }
                });
            },
            repeat: 60
        });

        // Remove after 3 seconds
        this.time.delayedCall(3000, () => {
            field.destroy();
            slowInterval.destroy();
            this.enemies.children.entries.forEach(enemy => {
                if (enemy.active && enemy.magneticSlowed) {
                    enemy.magneticSlowed = false;
                    if (enemy.tintTopLeft === 0xffff88) {
                        enemy.clearTint();
                    }
                }
            });
        });
    }

    createMudTrap() {
        // Mud spell - shoots mud globs that create pools on impact
        console.log('=== MUD SPELL START ===');

        // Create mud glob texture if it doesn't exist
        if (!this.textures.exists('mud-glob')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x8B4513, 1);
            graphics.fillCircle(8, 8, 8);
            graphics.fillStyle(0x654321, 0.8);
            graphics.fillCircle(8, 8, 5);
            graphics.generateTexture('mud-glob', 16, 16);
            graphics.destroy();
        }

        // Create mud pool texture if it doesn't exist
        if (!this.textures.exists('mud-pool')) {
            const graphics = this.add.graphics();
            // Create a small mud pool
            graphics.fillStyle(0x8B4513, 0.6);
            graphics.fillCircle(20, 20, 20);
            graphics.fillStyle(0x654321, 0.8);
            graphics.fillCircle(20, 20, 15);
            graphics.fillStyle(0x4B3621, 0.5);
            graphics.fillCircle(20, 20, 8);
            graphics.generateTexture('mud-pool', 40, 40);
            graphics.destroy();
        }

        // Create 3-5 mud globs
        const globCount = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < globCount; i++) {
            // Random direction and distance from wizard
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100; // 50-150 pixels away
            
            // Calculate pool position
            const poolX = this.wizard.x + Math.cos(angle) * distance;
            const poolY = this.wizard.y + Math.sin(angle) * distance;
            
            // Create a projectile that flies to the target position
            const glob = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'mud-glob');
            glob.setDepth(10);
            glob.setScale(1.5);
            
            // Calculate arc trajectory
            const flightTime = 400; // 0.4 seconds flight time
            const gravity = 500;
            
            // Calculate initial velocities for parabolic trajectory
            const dx = poolX - this.wizard.x;
            const dy = poolY - this.wizard.y;
            const vx = (dx / flightTime) * 1000;
            const vy = ((dy / flightTime) * 1000) - (0.5 * gravity * flightTime / 1000);
            
            glob.setVelocity(vx, vy);
            glob.body.setGravityY(gravity);
            
            // Muddy brown effect
            this.tweens.add({
                targets: glob,
                scale: { from: 1.5, to: 2 },
                tint: { from: 0x8B4513, to: 0x654321 },
                duration: 200,
                yoyo: true,
                repeat: -1
            });
            
            // Create pool on landing
            this.time.delayedCall(flightTime, () => {
                if (glob.active) {
                    // Create mud pool at landing position
                    const mudPool = this.physics.add.sprite(glob.x, glob.y, 'mud-pool');
                    mudPool.setOrigin(0.5, 0.5);
                    mudPool.setScale(2.5); // 50% smaller than before (was 5)
                    mudPool.setDepth(1); // Below most things
                    mudPool.setAlpha(0.8);

                    // Set up physics body
                    const hitboxRadius = 40; // 50% smaller hitbox
                    mudPool.body.setCircle(hitboxRadius);
                    mudPool.body.setOffset(20 - hitboxRadius, 20 - hitboxRadius);
                    mudPool.body.setImmovable(true); // Stationary

                    // Mark as mud pool for collision detection
                    mudPool.isMudPool = true;
                    mudPool.hitEnemies = new Set();

                    // Fade in animation
                    this.tweens.add({
                        targets: mudPool,
                        alpha: { from: 0, to: 0.8 },
                        scale: { from: 0, to: 2.5 },
                        duration: 300,
                        ease: 'Power2'
                    });

                    // Apply slow effect to enemies that enter
                    const mudOverlap = this.physics.add.overlap(
                        mudPool,
                        this.enemies,
                        (pool, enemy) => {
                            if (!enemy.active) return;

                            // Apply muddy status effect continuously while in pool
                            enemy.muddy = true;
                            enemy.muddyEndTime = this.time.now + 1000; // Refresh every second
                            enemy.mudSlowFactor = 0.2; // 80% speed reduction

                            // Visual effect - brown tint for muddy
                            if (enemy.tintTopLeft !== 0x8B4513) {
                                enemy.setTint(0x8B4513);
                            }

                            // Only damage once per enemy per pool
                            if (!pool.hitEnemies.has(enemy)) {
                                pool.hitEnemies.add(enemy);
                                enemy.health -= 1;
                                this.showDamageNumber(enemy.x, enemy.y - 20, 1);
                                
                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                }
                            }
                        }
                    );

                    // Destroy pool after 6 seconds
                    this.time.delayedCall(6000, () => {
                        // Fade out animation
                        this.tweens.add({
                            targets: mudPool,
                            alpha: 0,
                            scale: 0,
                            duration: 500,
                            onComplete: () => {
                                mudOverlap.destroy();
                                mudPool.destroy();
                            }
                        });
                    });
                    
                    // Destroy the glob
                    glob.destroy();
                }
            });
        }
    }

    createPlasmaStorm() {
        // Create central plasma core
        if (!this.textures.exists('plasma-core')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xff44ff, 1);
            graphics.fillCircle(15, 15, 15);
            graphics.lineStyle(3, 0xffffff, 1);
            graphics.strokeCircle(15, 15, 15);
            graphics.generateTexture('plasma-core', 30, 30);
            graphics.destroy();
        }

        const core = this.add.sprite(this.wizard.x, this.wizard.y, 'plasma-core');
        core.setDepth(6);

        // Create rotating plasma orbs
        const orbs = [];
        for (let i = 0; i < 4; i++) {
            const orb = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'plasma-core');
            orb.setScale(0.5);
            orb.setDepth(5);
            orb.damage = 3;
            orb.startAngle = (Math.PI * 2 / 4) * i;
            orbs.push(orb);
            this.projectiles.add(orb);
        }

        // Rotation and expansion animation
        let radius = 0;
        const rotateInterval = this.time.addEvent({
            delay: 30,
            callback: () => {
                radius += 4;
                orbs.forEach((orb, index) => {
                    if (!orb.active) return;
                    const angle = orb.startAngle + this.time.now * 0.005;
                    orb.x = this.wizard.x + Math.cos(angle) * radius;
                    orb.y = this.wizard.y + Math.sin(angle) * radius;
                });

                if (radius > 200) {
                    rotateInterval.destroy();
                    core.destroy();
                    orbs.forEach(orb => {
                        if (orb.active) orb.destroy();
                    });
                }
            },
            loop: true
        });
    }

    createLavaEruption() {
        // Create eruption points
        for (let i = 0; i < 5; i++) {
            const x = this.wizard.x + Phaser.Math.Between(-150, 150);
            const y = this.wizard.y + Phaser.Math.Between(-150, 150);

            this.time.delayedCall(i * 200, () => {
                // Eruption warning
                const warning = this.add.circle(x, y, 30, 0xff4400, 0.3);
                warning.setDepth(2);

                this.tweens.add({
                    targets: warning,
                    scale: { from: 0.5, to: 1.5 },
                    alpha: { from: 0.3, to: 0.8 },
                    duration: 500,
                    yoyo: true,
                    onComplete: () => {
                        warning.destroy();

                        // Create lava pool
                        if (!this.textures.exists('lava-pool')) {
                            const graphics = this.add.graphics();
                            graphics.fillStyle(0xff4400, 0.8);
                            graphics.fillCircle(25, 25, 25);
                            graphics.fillStyle(0xffaa00, 0.6);
                            graphics.fillCircle(25, 25, 15);
                            graphics.generateTexture('lava-pool', 50, 50);
                            graphics.destroy();
                        }

                        const lava = this.physics.add.sprite(x, y, 'lava-pool');
                        lava.setDepth(2);
                        lava.body.setSize(50, 50);

                        // Damage over time
                        const damageInterval = this.time.addEvent({
                            delay: 200,
                            callback: () => {
                                this.enemies.children.entries.forEach(enemy => {
                                    if (!enemy.active || !lava.active) return;
                                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, lava.x, lava.y);
                                    if (distance < 40) {
                                        enemy.health -= 2;
                                        enemy.setTint(0xff4400);
                                        this.time.delayedCall(100, () => {
                                            if (enemy.active) enemy.clearTint();
                                        });

                                        if (enemy.health <= 0) {
                                            this.killEnemy(enemy);
                                        }
                                    }
                                });
                            },
                            repeat: 20
                        });

                        this.time.delayedCall(4000, () => {
                            lava.destroy();
                            damageInterval.destroy();
                        });
                    }
                });
            });
        }
    }

    createEMPulse() {
        // Create expanding EMP wave
        const emp = this.add.circle(this.wizard.x, this.wizard.y, 20, 0x44ffff, 0.8);
        emp.setDepth(7);

        this.tweens.add({
            targets: emp,
            scale: { from: 1, to: 15 },
            alpha: { from: 0.8, to: 0 },
            duration: 1000,
            onUpdate: () => {
                // Stun and damage enemies in range
                this.enemies.children.entries.forEach(enemy => {
                    if (!enemy.active) return;
                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                    if (distance < emp.scale * 20 && !enemy.stunned) {
                        enemy.stunned = true;
                        enemy.setVelocity(0, 0);
                        enemy.setTint(0x44ffff);
                        enemy.health -= 3;

                        // Lightning effect
                        const lightning = this.add.graphics();
                        lightning.lineStyle(2, 0x44ffff, 1);
                        lightning.moveTo(this.wizard.x, this.wizard.y);
                        lightning.lineTo(enemy.x, enemy.y);
                        lightning.strokePath();
                        lightning.setDepth(6);

                        this.tweens.add({
                            targets: lightning,
                            alpha: 0,
                            duration: 200,
                            onComplete: () => lightning.destroy()
                        });

                        this.time.delayedCall(2000, () => {
                            if (enemy.active) {
                                enemy.stunned = false;
                                enemy.clearTint();
                            }
                        });

                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        }
                    }
                });
            },
            onComplete: () => emp.destroy()
        });
    }

    createMeteorShower() {
        // Create multiple meteors over time
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 300, () => {
                this.fireMeteor();
            });
        }
    }

    createElementalStorm() {
        // Ultimate ability - combines all elements
        const storm = this.add.container(this.wizard.x, this.wizard.y);
        storm.setDepth(10);

        // Create swirling vortex
        const vortex = this.add.graphics();
        vortex.fillStyle(0xffffff, 0.1);
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            vortex.fillCircle(Math.cos(angle) * 100, Math.sin(angle) * 100, 30);
        }
        storm.add(vortex);

        // Rotation
        this.tweens.add({
            targets: storm,
            rotation: Math.PI * 4,
            duration: 3000
        });

        // Spawn elemental effects
        const elements = ['fire', 'lightning', 'water', 'earth'];
        const spawnInterval = this.time.addEvent({
            delay: 250,
            callback: () => {
                const element = elements[Math.floor(Math.random() * elements.length)];
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                const x = this.wizard.x + Math.cos(angle) * distance;
                const y = this.wizard.y + Math.sin(angle) * distance;

                switch (element) {
                    case 'fire':
                        this.createFirePool(x, y, 1);
                        break;
                    case 'lightning':
                        // Lightning strike
                        const strike = this.add.rectangle(x, y, 3, 600, 0xffff44);
                        strike.setDepth(8);
                        strike.setOrigin(0.5, 1);

                        this.tweens.add({
                            targets: strike,
                            scaleX: { from: 3, to: 0 },
                            alpha: { from: 1, to: 0 },
                            duration: 200,
                            onComplete: () => strike.destroy()
                        });

                        // Damage enemies at strike point
                        this.enemies.children.entries.forEach(enemy => {
                            if (Phaser.Math.Distance.Between(enemy.x, enemy.y, x, y) < 40) {
                                enemy.health -= 4;
                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                }
                            }
                        });
                        break;
                    case 'water':
                        // Water geyser
                        const geyser = this.add.rectangle(x, y, 20, 100, 0x4444ff, 0.6);
                        geyser.setDepth(4);
                        geyser.setOrigin(0.5, 1);

                        this.tweens.add({
                            targets: geyser,
                            scaleY: { from: 0, to: 1 },
                            duration: 300,
                            yoyo: true,
                            onComplete: () => geyser.destroy()
                        });
                        break;
                    case 'earth':
                        // Earth spike
                        const spike = this.add.triangle(x, y, 0, 30, 15, 0, 30, 30, 0x44ff44);
                        spike.setDepth(4);
                        spike.setOrigin(0.5, 1);

                        this.tweens.add({
                            targets: spike,
                            y: y - 30,
                            duration: 200,
                            yoyo: true,
                            hold: 200,
                            onComplete: () => spike.destroy()
                        });
                        break;
                }
            },
            repeat: 11
        });

        // Remove after 3 seconds
        this.time.delayedCall(3000, () => {
            storm.destroy();
            spawnInterval.destroy();
        });
    }

    // New element implementations for elements2.PNG
    fireLavaProjectile() {
        // Lava spell - spits lava pools in random directions
        console.log('=== LAVA SPELL START ===');

        // Create 2-3 lava pools
        const poolCount = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < poolCount; i++) {
            // Random direction and distance from wizard
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 150; // 50-200 pixels away
            
            // Calculate pool position
            const poolX = this.wizard.x + Math.cos(angle) * distance;
            const poolY = this.wizard.y + Math.sin(angle) * distance;
            
            // Create a projectile that flies to the target position
            if (!this.textures.exists('lava-glob')) {
                const graphics = this.add.graphics();
                graphics.fillStyle(0xff6600, 1);
                graphics.fillCircle(8, 8, 8);
                graphics.fillStyle(0xff0000, 0.8);
                graphics.fillCircle(8, 8, 5);
                graphics.generateTexture('lava-glob', 16, 16);
                graphics.destroy();
            }
            
            const glob = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'lava-glob');
            glob.setDepth(10);
            glob.setScale(1.5);
            
            // Calculate arc trajectory
            const flightTime = 500; // 0.5 seconds flight time
            const gravity = 600;
            
            // Calculate initial velocities for parabolic trajectory
            const dx = poolX - this.wizard.x;
            const dy = poolY - this.wizard.y;
            const vx = (dx / flightTime) * 1000;
            const vy = ((dy / flightTime) * 1000) - (0.5 * gravity * flightTime / 1000);
            
            glob.setVelocity(vx, vy);
            glob.body.setGravityY(gravity);
            
            // Glowing effect
            this.tweens.add({
                targets: glob,
                scale: { from: 1.5, to: 2 },
                tint: { from: 0xff6600, to: 0xff0000 },
                duration: 200,
                yoyo: true,
                repeat: -1
            });
            
            // Create pool on landing
            this.time.delayedCall(flightTime, () => {
                if (glob.active) {
                    // Create lava pool at landing position
                    this.createFirePool(glob.x, glob.y, 1, 4000, 10); // 4 seconds, magnitude 10 burn
                    
                    // Destroy the projectile
                    glob.destroy();
                }
            });
            
            // Add slight delay between projectiles
            if (i < poolCount - 1) {
                this.time.delayedCall(100 * (i + 1), () => {});
            }
        }
    }
    
    getDirectionAngle() {
        const directionAngles = {
            'up': -Math.PI / 2,
            'down': Math.PI / 2,
            'left': Math.PI,
            'right': 0,
            'up-left': -3 * Math.PI / 4,
            'up-right': -Math.PI / 4,
            'down-left': 3 * Math.PI / 4,
            'down-right': Math.PI / 4
        };
        return directionAngles[this.wizard.lastDirection] || 0;
    }

    createSteamBurst() {
        // Steam element - burst of steam that pushes enemies back
        const burst = this.add.circle(this.wizard.x, this.wizard.y, 50, 0xaabbcc, 0.6);
        burst.setDepth(4);

        this.tweens.add({
            targets: burst,
            scale: { from: 0.5, to: 3 },
            alpha: { from: 0.8, to: 0 },
            duration: 500,
            onComplete: () => burst.destroy()
        });

        // Push enemies away
        this.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
            if (distance < 150) {
                const angle = Phaser.Math.Angle.Between(this.wizard.x, this.wizard.y, enemy.x, enemy.y);
                const force = (150 - distance) * 3;
                enemy.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
                enemy.health -= 1;
                if (enemy.health <= 0) {
                    this.killEnemy(enemy);
                }
            }
        });
    }

    firePoisonProjectile() {
        // Poison element - damage over time
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'element-symbols2', 2);
        projectile.element = 'poison';
        projectile.damage = 1;
        projectile.poisonDamage = 3; // Total poison damage
        projectile.setDepth(5);
        projectile.setTint(0x00ff00);

        const speed = 300;
        const angle = Math.random() * Math.PI * 2;
        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        this.projectiles.add(projectile);
    }

    createVolcanicEruption(elementTier = 1) {
        // Create multiple volcano eruptions at random positions around the wizard
        const volcanoCount = 5; // Number of volcanoes to spawn
        const radius = 150; // Max distance from wizard
        
        for (let i = 0; i < volcanoCount; i++) {
            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * (radius - 50);
            
            // Calculate position
            const x = this.wizard.x + Math.cos(angle) * distance;
            const y = this.wizard.y + Math.sin(angle) * distance;
            
            // Create volcano sprite
            const volcano = this.physics.add.sprite(x, y, 'volcano-spell');
            volcano.element = 'volcano';
            
            // Apply tier damage scaling
            const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
            volcano.damage = 6 * tierDamageScale; // Heavy damage
            volcano.burnDuration = 3000; // 3 seconds burn
            volcano.burnEnemy = true; // Enable burn effect
            volcano.body.setCollideWorldBounds(false);
            volcano.body.setSize(48, 48); // Set collision box size
            volcano.setDepth(5);
            volcano.setScale(0.75); // Adjusted for 64x64 frames
            
            // Play animation
            if (this.anims.exists('volcano-spell-anim')) {
                volcano.play('volcano-spell-anim');
            }
            
            // Make it static (doesn't move)
            volcano.body.setVelocity(0, 0);
            volcano.body.setImmovable(true);
            
            // Add to projectiles group for collision detection
            this.projectiles.add(volcano);
            
            // Add burn effect on hit
            volcano.burnEnemy = true;
            
            // Fade in effect with fire glow
            volcano.setAlpha(0);
            volcano.setTint(0xff6600); // Orange glow
            this.tweens.add({
                targets: volcano,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
            
            // Create expanding damage area effect
            const damageArea = this.add.circle(x, y, 30, 0xff4400, 0.3);
            damageArea.setDepth(4);
            this.tweens.add({
                targets: damageArea,
                scale: { from: 1, to: 2 },
                alpha: { from: 0.3, to: 0 },
                duration: 500,
                repeat: 5,
                onComplete: () => damageArea.destroy()
            });
            
            // Destroy after 4 seconds
            this.time.delayedCall(4000, () => {
                if (volcano.active) {
                    // Fade out before destroying
                    this.tweens.add({
                        targets: volcano,
                        alpha: 0,
                        scale: 0.5,
                        duration: 300,
                        onComplete: () => volcano.destroy()
                    });
                }
            });
        }
    }

    createWaveSpell(elementTier = 1) {
        // Wave element - similar to earth but with larger push and wet effect
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'wave-spell');
        projectile.element = 'wave';
        
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        projectile.damage = 3 * tierDamageScale; // Moderate damage
        projectile.knockbackForce = 1200; // Reduced by 50% from 2400
        projectile.isPiercing = true;
        projectile.body.setCollideWorldBounds(false);
        projectile.setDepth(5);
        projectile.setScale(-1.5, 1.5); // Flip horizontally with negative X scale
        projectile.setOrigin(0.5, 0.5); // Ensure sprite is centered
        
        // Set collision box to match the sprite size
        projectile.body.setSize(64, 66); // Match actual sprite dimensions
        // Horizontally aligned at 64, move up by full height (66 -> 0)
        projectile.body.setOffset(64, 0); // Move hitbox up to align with sprite
        
        // Play animation if it exists
        if (this.anims.exists('wave-spell-anim')) {
            projectile.play('wave-spell-anim');
        }

        // Add to projectiles group
        this.projectiles.add(projectile);

        // Directional firing
        const speed = 250; // Slightly slower than earth (300)
        const diagonalSpeed = speed / Math.sqrt(2);

        const directions = {
            up: { x: 0, y: -speed },
            down: { x: 0, y: speed },
            left: { x: -speed, y: 0 },
            right: { x: speed, y: 0 },
            'up-left': { x: -diagonalSpeed, y: -diagonalSpeed },
            'up-right': { x: diagonalSpeed, y: -diagonalSpeed },
            'down-left': { x: -diagonalSpeed, y: diagonalSpeed },
            'down-right': { x: diagonalSpeed, y: diagonalSpeed }
        };

        const direction = this.wizard.lastDirection || 'down';
        const dir = directions[direction];

        if (!dir) {
            console.error(`Invalid direction: ${direction}`);
            const fallbackDir = directions['down'];
            projectile.setVelocity(fallbackDir.x, fallbackDir.y);
        } else {
            projectile.setVelocity(dir.x, dir.y);
        }

        // Rotate projectile to match direction
        const directionAngles = {
            'up': -Math.PI / 2,
            'down': Math.PI / 2,
            'left': Math.PI,
            'right': 0,
            'up-left': -3 * Math.PI / 4,
            'up-right': -Math.PI / 4,
            'down-left': 3 * Math.PI / 4,
            'down-right': Math.PI / 4
        };

        const angle = directionAngles[direction] || 0;
        projectile.setRotation(angle);

        // Add wet effect properties
        projectile.wetDuration = 3000; // 3 seconds wet effect
        projectile.appliesWet = true;

        // Create trailing water particles
        const particles = this.add.particles(projectile.x, projectile.y, 'wave-spell', {
            frame: 0,
            scale: { start: 0.5, end: 0 }, // Smaller scale for particles
            alpha: { start: 0.6, end: 0 },
            speed: 50,
            lifespan: 600,
            frequency: 50
        });
        particles.setDepth(4);

        // Make particles follow the projectile
        this.tweens.add({
            targets: particles,
            x: projectile.x,
            y: projectile.y,
            duration: 4000,
            onUpdate: (tween, target) => {
                if (projectile.active) {
                    target.x = projectile.x;
                    target.y = projectile.y;
                }
            }
        });

        // Destroy after 4 seconds
        this.time.delayedCall(4000, () => {
            if (projectile.active) {
                projectile.destroy();
            }
            particles.destroy();
        });
    }

    createSandSpell() {
        // Create multiple sand storms at random positions around the wizard (like ice spell)
        const sandCount = 5; // Number of sand storms to spawn
        const radius = 150; // Max distance from wizard
        
        for (let i = 0; i < sandCount; i++) {
            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * (radius - 50);
            
            // Calculate position
            const x = this.wizard.x + Math.cos(angle) * distance;
            const y = this.wizard.y + Math.sin(angle) * distance;
            
            // Create sand storm sprite using air spell animation
            const sandStorm = this.physics.add.sprite(x, y, 'air-spell-7');
            sandStorm.element = 'sand';
            sandStorm.setScale(1.8); // 60% smaller than original air spell (3 * 0.6)
            sandStorm.setDepth(20);
            sandStorm.setAlpha(0.6);
            sandStorm.setTint(0xf4a460); // Yellow/sand tint
            
            // Play air animation if it exists, set to loop
            if (this.anims.exists('air-spell-anim')) {
                sandStorm.play('air-spell-anim');
                // Make the animation loop for the full duration
                sandStorm.anims.setRepeat(-1); // Loop indefinitely
            }
            
            // Make it static (doesn't move)
            sandStorm.body.setVelocity(0, 0);
            sandStorm.body.setImmovable(true);
            sandStorm.body.setSize(80, 80); // Collision area
            
            // Track enemies that have been damaged by this sand storm
            sandStorm.damagedEnemies = new Set();
            sandStorm.isActive = true;
            
            // Calculate duration and damage interval
            // Air spell animation duration is roughly 1 second, we want 3x = 3 seconds
            const totalDuration = 3000; // 3 seconds
            const tickCount = 12; // 12 damage ticks
            const tickInterval = totalDuration / tickCount; // 250ms per tick
            
            // Apply continuous damage and slow while enemies are in the area
            const damageInterval = this.time.addEvent({
                delay: tickInterval, // Damage every 250ms (12 times over 3 seconds)
                callback: () => {
                    if (!sandStorm.isActive || !sandStorm.active) {
                        damageInterval.destroy();
                        return;
                    }
                    
                    this.enemies.children.entries.forEach(enemy => {
                        if (!enemy.active || enemy.isDying) return;
                        
                        const dist = Phaser.Math.Distance.Between(
                            enemy.x, enemy.y,
                            sandStorm.x, sandStorm.y
                        );
                        
                        if (dist < 60) { // Effect radius
                            // Apply damage
                            enemy.health -= 0.25;
                            
                            // Show damage number
                            this.showDamageNumber(enemy.x, enemy.y - 20, 0.25);
                            
                            // Apply slow effect
                            if (!enemy.sandSlowed) {
                                enemy.sandSlowed = true;
                                enemy.originalSpeed = enemy.moveSpeed || 40;
                                enemy.moveSpeed = enemy.originalSpeed * 0.5; // 50% slow
                                enemy.setTint(0xf4a460); // Sandy tint
                            }
                            
                            // Track that this enemy is being affected
                            sandStorm.damagedEnemies.add(enemy);
                            
                            // Check if enemy died
                            if (enemy.health <= 0) {
                                this.killEnemy(enemy);
                            }
                        } else if (sandStorm.damagedEnemies.has(enemy) && enemy.sandSlowed) {
                            // Enemy left the area, remove slow
                            enemy.sandSlowed = false;
                            enemy.moveSpeed = enemy.originalSpeed;
                            if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.burning && !enemy.wet) {
                                enemy.clearTint();
                            }
                            sandStorm.damagedEnemies.delete(enemy);
                        }
                    });
                },
                loop: true
            });
            
            // Destroy after the total duration (3 seconds)
            this.time.delayedCall(totalDuration, () => {
                sandStorm.isActive = false;
                damageInterval.destroy();
                
                // Clean up any lingering slow effects
                sandStorm.damagedEnemies.forEach(enemy => {
                    if (enemy.active && enemy.sandSlowed) {
                        enemy.sandSlowed = false;
                        enemy.moveSpeed = enemy.originalSpeed;
                        if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.burning && !enemy.wet) {
                            enemy.clearTint();
                        }
                    }
                });
                
                // Stop animation and destroy
                if (sandStorm.anims) {
                    sandStorm.anims.stop();
                }
                sandStorm.destroy();
            });
            
            // Delay between spawning each sand storm
            this.time.delayedCall(i * 100, () => {});
        }
    }

    createCrystalSpell(elementTier = 1) {
        // Create crystal burst animation centered on wizard, starting with first frame
        const crystalBurst = this.add.sprite(this.wizard.x, this.wizard.y, 'crystal-frame-2');
        crystalBurst.setScale(4); // Scale up for visibility
        crystalBurst.setDepth(20);
        
        // Play animation
        if (this.anims.exists('crystal-spell-anim')) {
            crystalBurst.play('crystal-spell-anim');
        }
        
        // Create 8 needle projectiles in all directions
        const directions = [
            { x: 0, y: -1 },        // Up
            { x: 0.707, y: -0.707 }, // Up-Right
            { x: 1, y: 0 },         // Right
            { x: 0.707, y: 0.707 },  // Down-Right
            { x: 0, y: 1 },         // Down
            { x: -0.707, y: 0.707 }, // Down-Left
            { x: -1, y: 0 },        // Left
            { x: -0.707, y: -0.707 } // Up-Left
        ];
        
        // Spawn projectiles after a short delay for visual effect
        this.time.delayedCall(300, () => {
            directions.forEach((dir, index) => {
                // Create crystal bullet projectile
                const bullet = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'crystal-bullet');
                bullet.element = 'crystal';
                
                // Apply tier damage scaling
                const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
                bullet.damage = 6 * tierDamageScale; // High damage
                bullet.isPiercing = true; // Pierce through enemies
                bullet.setDepth(15);
                bullet.setScale(2); // Scale up the bullet
                
                // Ensure physics body is enabled and movable
                bullet.body.setCollideWorldBounds(false);
                bullet.body.setImmovable(false);
                bullet.body.setAllowGravity(false); // Ensure no gravity
                bullet.body.setSize(4, 4);
                
                // Add to projectiles group BEFORE setting velocity
                this.projectiles.add(bullet);
                
                // Set velocity for long distance travel
                const speed = 800; // Very fast projectiles
                bullet.body.setVelocity(dir.x * speed, dir.y * speed);
                
                // Rotate bullet to match direction
                const angle = Math.atan2(dir.y, dir.x);
                bullet.setRotation(angle + Math.PI / 2); // Add 90 degrees since sprite points up
                
                // Add sparkle trail effect
                const trail = this.add.particles(bullet.x, bullet.y, 'crystal-bullet', {
                    scale: { start: 0.5, end: 0 },
                    alpha: { start: 0.8, end: 0 },
                    speed: 0,
                    lifespan: 200,
                    frequency: 20,
                    tint: 0xaaccff
                });
                trail.setDepth(14);
                
                // Make trail follow bullet
                const trailUpdate = this.time.addEvent({
                    delay: 16,
                    callback: () => {
                        if (bullet.active) {
                            trail.x = bullet.x;
                            trail.y = bullet.y;
                        }
                    },
                    loop: true
                });
                
                // Destroy after 3 seconds (long distance)
                this.time.delayedCall(3000, () => {
                    if (bullet.active) {
                        bullet.destroy();
                    }
                    trail.destroy();
                    trailUpdate.destroy();
                });
            });
        });
        
        // Destroy burst animation after it completes
        crystalBurst.once('animationcomplete', () => {
            crystalBurst.destroy();
        });
    }

    createGravitySpell() {
        // Create gravity singularity at wizard position
        const gravity = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'gravity-spell');
        gravity.setScale(4); // Scale up for visibility
        gravity.setDepth(20);
        
        // Play animation
        if (this.anims.exists('gravity-spell-anim')) {
            gravity.play('gravity-spell-anim');
        }
        
        // Track which enemies have been damaged
        const damagedEnemies = new Set();
        
        // Create pull effect and damage
        const pullInterval = this.time.addEvent({
            delay: 100, // Check every 100ms
            callback: () => {
                if (!gravity.active) {
                    pullInterval.destroy();
                    return;
                }
                
                const pullRadius = 200; // Large pull radius
                const damageRadius = 80; // Smaller damage radius
                
                this.enemies.children.entries.forEach(enemy => {
                    if (!enemy.active || enemy.isDying) return;
                    
                    const dist = Phaser.Math.Distance.Between(
                        enemy.x, enemy.y,
                        gravity.x, gravity.y
                    );
                    
                    // Pull enemies towards center
                    if (dist < pullRadius && dist > 20) {
                        const angle = Phaser.Math.Angle.Between(
                            enemy.x, enemy.y,
                            gravity.x, gravity.y
                        );
                        const pullForce = (pullRadius - dist) / pullRadius * 300; // Stronger pull when closer
                        
                        // Apply pull force
                        enemy.setVelocity(
                            Math.cos(angle) * pullForce,
                            Math.sin(angle) * pullForce
                        );
                    }
                    
                    // Damage enemies in center (only once)
                    if (dist < damageRadius && !damagedEnemies.has(enemy)) {
                        // Calculate 30% of max health as damage
                        const maxHealth = enemy.maxHealth || enemy.health; // Use maxHealth if available
                        const damage = Math.ceil(maxHealth * 0.3); // 30% of max health
                        
                        enemy.health -= damage;
                        damagedEnemies.add(enemy);
                        
                        // Visual effect - dark purple tint
                        enemy.setTint(0x4b0082);
                        this.time.delayedCall(500, () => {
                            if (enemy.active && !enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.burning && !enemy.wet && !enemy.sandSlowed) {
                                enemy.clearTint();
                            }
                        });
                        
                        // Show damage number
                        this.showDamageNumber(enemy.x, enemy.y - 20, damage);
                        
                        // Check if enemy died
                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        }
                    }
                });
            },
            repeat: -1
        });
        
        // Destroy after animation completes
        gravity.once('animationcomplete', () => {
            pullInterval.destroy();
            gravity.destroy();
        });
    }

    createMoonSpell() {
        // Check if moon spell is already active or on cooldown
        if (this.moonSpellActive || this.moonSpellCooldown) {
            return; // Don't create multiple moon spells or if on cooldown
        }
        
        // Mark moon spell as active (don't set cooldown yet)
        this.moonSpellActive = true;
        
        // Moon element - creates a permanent ring of light that heals player and burns enemies
        const moonRing = this.add.circle(this.wizard.x, this.wizard.y, 150, 0xe0e0e0, 0.05); // More transparent
        moonRing.setDepth(3);
        moonRing.setStrokeStyle(2, 0xffffff, 0.3); // More transparent stroke
        
        // Add inner glow
        const innerGlow = this.add.circle(this.wizard.x, this.wizard.y, 100, 0xffffff, 0.03); // More transparent
        innerGlow.setDepth(3);
        
        // Add rotating light particles (more subtle)
        const particles = this.add.particles(this.wizard.x, this.wizard.y, 'particle', {
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.3, end: 0 },
            speed: 30,
            lifespan: 1500,
            frequency: 100,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 140),
                quantity: 8
            },
            tint: 0xe0e0e0
        });
        
        // Create particle texture if it doesn't exist
        if (!this.textures.exists('particle')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }
        
        // Subtle pulsing animation
        this.tweens.add({
            targets: [moonRing, innerGlow],
            scale: { from: 1, to: 1.05 },
            alpha: { from: moonRing.alpha, to: moonRing.alpha + 0.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        // Track ring position to wizard
        const updatePosition = () => {
            if (moonRing.active) {
                moonRing.x = this.wizard.x;
                moonRing.y = this.wizard.y;
                innerGlow.x = this.wizard.x;
                innerGlow.y = this.wizard.y;
                particles.x = this.wizard.x;
                particles.y = this.wizard.y;
            }
        };
        
        // Healing and damage effect
        const healAndBurn = this.time.addEvent({
            delay: 500, // Effect every 0.5 seconds
            callback: () => {
                if (!moonRing.active) {
                    healAndBurn.destroy();
                    return;
                }
                
                // Heal player (2 HP per tick)
                if (this.wizardHealth < this.wizardMaxHealth) {
                    this.wizardHealth = Math.min(this.wizardHealth + 2, this.wizardMaxHealth);
                    this.updateWizardHealthBar();
                    
                    // Show healing effect
                    const healText = this.add.text(this.wizard.x, this.wizard.y - 30, '+2', {
                        fontSize: '20px',
                        color: '#00ff00',
                        fontStyle: 'bold'
                    });
                    healText.setOrigin(0.5);
                    
                    this.tweens.add({
                        targets: healText,
                        y: this.wizard.y - 60,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => healText.destroy()
                    });
                }
                
                // Damage enemies in range
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                        if (dist < 150) { // Within moon ring radius
                            // Apply lunar burn damage (3 damage)
                            enemy.health -= 3;
                            
                            // Visual effect - moonlight burn
                            enemy.setTint(0xe0e0ff);
                            this.time.delayedCall(200, () => {
                                if (enemy.active) enemy.clearTint();
                            });
                            
                            // Show damage
                            this.showDamageNumber(enemy.x, enemy.y - 20, 3);
                            
                            if (enemy.health <= 0) {
                                this.killEnemy(enemy);
                            }
                        }
                    }
                });
                
                // Update position
                updatePosition();
            },
            repeat: -1
        });
        
        // Store moon spell components for smooth following
        this.moonSpellComponents = {
            moonRing,
            innerGlow,
            particles
        };
        
        // Destroy moon spell after 6 seconds
        this.time.delayedCall(6000, () => {
            // Clean up all moon spell components
            moonRing.destroy();
            innerGlow.destroy();
            particles.destroy();
            healAndBurn.destroy();
            
            // Clear stored components
            this.moonSpellComponents = null;
            
            // Mark moon spell as inactive and start cooldown
            this.moonSpellActive = false;
            this.moonSpellCooldown = true;
            
            // Clear cooldown after 6 more seconds (total 12 seconds from cast)
            const cooldownDuration = this.hasteActive ? 4800 : 6000; // 20% reduction if hasted
            this.time.delayedCall(cooldownDuration, () => {
                this.moonSpellCooldown = false;
            });
        });
    }

    createSunSpell() {
        // Check if sun spell is already active or on cooldown
        if (this.sunSpellActive || this.sunSpellCooldown) {
            return; // Don't create multiple sun spells or if on cooldown
        }
        
        // Mark sun spell as active (don't set cooldown yet)
        this.sunSpellActive = true;
        
        // Sun element - creates a permanent ring of heat that burns enemies
        const sunRing = this.add.circle(this.wizard.x, this.wizard.y, 150, 0xffeb3b, 0.05); // Semi-transparent yellow
        sunRing.setDepth(3);
        sunRing.setStrokeStyle(2, 0xffa500, 0.3); // Orange stroke
        
        // Add inner heat glow
        const innerGlow = this.add.circle(this.wizard.x, this.wizard.y, 100, 0xffff00, 0.03); // Semi-transparent bright yellow
        innerGlow.setDepth(3);
        
        // Add heat wave particles
        const particles = this.add.particles(this.wizard.x, this.wizard.y, 'particle', {
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.4, end: 0 },
            speed: 40,
            lifespan: 1200,
            frequency: 80,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 140),
                quantity: 10
            },
            tint: 0xffa500
        });
        
        // Create particle texture if it doesn't exist
        if (!this.textures.exists('particle')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }
        
        // Heat wave pulsing animation
        this.tweens.add({
            targets: [sunRing, innerGlow],
            scale: { from: 1, to: 1.08 },
            alpha: { from: sunRing.alpha, to: sunRing.alpha + 0.03 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        // Store initial sun position (don't track wizard)
        const sunPosition = {
            x: this.wizard.x,
            y: this.wizard.y
        };
        
        // Burning effect - apply burn to enemies in range
        const burnEffect = this.time.addEvent({
            delay: 1000, // Effect every 1 second
            callback: () => {
                if (!sunRing.active) {
                    burnEffect.destroy();
                    return;
                }
                
                // Apply burn to enemies in range
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, sunPosition.x, sunPosition.y);
                        if (dist < 150) { // Within sun ring radius
                            // Mark enemy as in sun aura
                            enemy.inSunAura = true;
                            
                            // Initialize burn stacks if needed
                            if (enemy.burnStacks === undefined) {
                                enemy.burnStacks = 0;
                            }
                            
                            // Add 2 burn stacks
                            enemy.burnStacks += 2;
                            
                            // Cap burn stacks at a reasonable maximum (e.g., 20)
                            if (enemy.burnStacks > 20) {
                                enemy.burnStacks = 20;
                            }
                            
                            // Update visual intensity based on stacks
                            const burnIntensity = Math.min(enemy.burnStacks / 10, 1); // Max intensity at 10 stacks
                            const tintColor = Phaser.Display.Color.Interpolate.ColorWithColor(
                                { r: 255, g: 200, b: 0 },
                                { r: 255, g: 50, b: 0 },
                                1,
                                burnIntensity
                            );
                            enemy.setTint(Phaser.Display.Color.GetColor(tintColor.r, tintColor.g, tintColor.b));
                            
                            // Create burn damage ticker if not exists
                            if (!enemy.sunBurnTick && enemy.burnStacks > 0) {
                                enemy.burning = true;
                                enemy.sunBurnTick = this.time.addEvent({
                                    delay: 500, // Tick twice per second
                                    callback: () => {
                                        if (enemy.active && enemy.burnStacks > 0) {
                                            // Consume one burn stack and deal damage
                                            enemy.health -= 1;
                                            enemy.burnStacks--;
                                            
                                            // Show burn damage
                                            this.showDamageNumber(enemy.x, enemy.y - 20, 1);
                                            
                                            // Fire particle effect
                                            const fireParticle = this.add.circle(
                                                enemy.x + Phaser.Math.Between(-10, 10),
                                                enemy.y - 10,
                                                3,
                                                0xff6600,
                                                0.8
                                            );
                                            fireParticle.setDepth(5);
                                            
                                            this.tweens.add({
                                                targets: fireParticle,
                                                y: enemy.y - 30,
                                                alpha: 0,
                                                scale: 0,
                                                duration: 500,
                                                onComplete: () => fireParticle.destroy()
                                            });
                                            
                                            // Update tint based on remaining stacks
                                            if (enemy.burnStacks > 0) {
                                                const newIntensity = Math.min(enemy.burnStacks / 10, 1);
                                                const newTint = Phaser.Display.Color.Interpolate.ColorWithColor(
                                                    { r: 255, g: 200, b: 0 },
                                                    { r: 255, g: 50, b: 0 },
                                                    1,
                                                    newIntensity
                                                );
                                                enemy.setTint(Phaser.Display.Color.GetColor(newTint.r, newTint.g, newTint.b));
                                            } else {
                                                // No more stacks, stop burning
                                                enemy.burning = false;
                                                enemy.clearTint();
                                                if (enemy.sunBurnTick) {
                                                    enemy.sunBurnTick.destroy();
                                                    enemy.sunBurnTick = null;
                                                }
                                            }
                                            
                                            if (enemy.health <= 0) {
                                                this.killEnemy(enemy);
                                                if (enemy.sunBurnTick) {
                                                    enemy.sunBurnTick.destroy();
                                                }
                                            }
                                        }
                                    },
                                    repeat: -1 // Continue until out of stacks
                                });
                            }
                        } else if (enemy.inSunAura) {
                            // Enemy left the sun aura - stop adding stacks but keep burning existing ones
                            enemy.inSunAura = false;
                            // Don't clear burn or tint - let it burn out naturally
                        }
                    }
                });
            },
            repeat: -1
        });
        
        // Destroy sun spell after 6 seconds
        this.time.delayedCall(6000, () => {
            // Clean up all sun spell components
            sunRing.destroy();
            innerGlow.destroy();
            particles.destroy();
            burnEffect.destroy();
            
            // Clear burn effects from all enemies
            this.enemies.children.entries.forEach(enemy => {
                if (enemy.active) {
                    enemy.inSunAura = false;
                    // Let existing burn stacks burn out naturally
                }
            });
            
            // Mark sun spell as inactive and start cooldown
            this.sunSpellActive = false;
            this.sunSpellCooldown = true;
            
            // Clear cooldown after 6 more seconds (total 12 seconds from cast)  
            const cooldownDuration = this.hasteActive ? 4800 : 6000; // 20% reduction if hasted
            this.time.delayedCall(cooldownDuration, () => {
                this.sunSpellCooldown = false;
            });
        });
    }

    createHolySpell() {
        console.log('Holy spell activated!');
        // Holy spell - creates a single vertical beam centered on wizard
        const beamWidth = 80;
        const beamHeight = 1200; // Full screen vertical coverage
        const spellDuration = 2000; // Total duration of the spell
        const damagePerHit = 3;
        
        // Create spark texture if it doesn't exist
        if (!this.textures.exists('spark')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('spark', 8, 8);
            graphics.destroy();
        }
        
        // Create the visual beam effect centered on wizard
        const beam = this.add.rectangle(
            this.wizard.x, 
            this.wizard.y, 
            beamWidth, 
            beamHeight, 
            0xffff99, 
            0.5
        );
        beam.setDepth(5);
        
        // Add inner glow
        const innerGlow = this.add.rectangle(
            this.wizard.x,
            this.wizard.y,
            beamWidth * 0.6,
            beamHeight,
            0xffffff,
            0.6
        );
        innerGlow.setDepth(5);
        
        // Add particles for holy effect
        const beamParticles = this.add.particles(this.wizard.x, this.wizard.y, 'spark', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 2,
            frequency: 100,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(
                    -beamWidth/2, 
                    -beamHeight/2, 
                    beamWidth, 
                    beamHeight
                )
            },
            tint: [0xffff99, 0xffffff, 0xffffcc]
        });
        beamParticles.setDepth(6);
        
        // Fade in
        beam.setAlpha(0);
        innerGlow.setAlpha(0);
        
        this.tweens.add({
            targets: [beam, innerGlow],
            alpha: { from: 0, to: 0.5 },
            duration: 200,
            ease: 'Power2'
        });
        
        // Pulsing effect
        this.tweens.add({
            targets: innerGlow,
            scaleX: { from: 0.6, to: 0.8 },
            alpha: { from: 0.6, to: 0.8 },
            duration: 300,
            yoyo: true,
            repeat: 6 // Repeat for duration
        });
        
        // Deal damage to enemies hit by the beam
        const damageTimer = this.time.addEvent({
            delay: 100, // Check every 100ms
            callback: () => {
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        // Check if enemy is within the beam (same X position as wizard)
                        if (Math.abs(enemy.x - this.wizard.x) < beamWidth / 2) {
                            // Prevent damage spam - check cooldown
                            if (!enemy.holyHitTime || this.time.now - enemy.holyHitTime > 300) {
                                enemy.holyHitTime = this.time.now;
                                
                                // Apply holy damage
                                enemy.health -= damagePerHit;
                                
                                // Check if enemy should die
                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                    return; // Skip visual effects for dead enemy
                                }
                                
                                // Visual effect on hit
                                const flash = this.add.circle(enemy.x, enemy.y, 25, 0xffff99, 0.9);
                                flash.setDepth(10);
                                flash.setBlendMode('ADD');
                                this.tweens.add({
                                    targets: flash,
                                    scale: { from: 0.5, to: 2 },
                                    alpha: { from: 0.9, to: 0 },
                                    duration: 400,
                                    onComplete: () => flash.destroy()
                                });
                                
                                // Show damage number
                                this.showDamageNumber(enemy.x, enemy.y - 20, damagePerHit);
                                
                                // Vertical knockback
                                enemy.setVelocityY(Phaser.Math.Between(-200, -300));
                            }
                        }
                    }
                });
            },
            repeat: 19 // Run for 2 seconds
        });
        
        // Clean up after duration
        this.time.delayedCall(spellDuration, () => {
            // Fade out
            this.tweens.add({
                targets: [beam, innerGlow],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    beam.destroy();
                    innerGlow.destroy();
                    beamParticles.destroy();
                    damageTimer.destroy();
                }
            });
        });
    }
    
    createSteamSpell() {
        // Steam spell - creates horizontal pressured steam jets
        const steamWidth = 200; // Reduced by 75% (was 800)
        const steamHeight = 30; // Reduced by 75% (was 120)
        
        // Create steam jets on both sides
        const leftSteam = this.add.rectangle(
            this.wizard.x,
            this.wizard.y,
            steamWidth,
            steamHeight,
            0xcccccc,
            0.3
        );
        leftSteam.setOrigin(1, 0.5); // Anchor to right edge (extends left)
        leftSteam.setDepth(5);
        
        const rightSteam = this.add.rectangle(
            this.wizard.x,
            this.wizard.y,
            steamWidth,
            steamHeight,
            0xcccccc,
            0.3
        );
        rightSteam.setOrigin(0, 0.5); // Anchor to left edge (extends right)
        rightSteam.setDepth(5);
        
        // Add steam particles
        const createSteamParticles = (x, direction) => {
            return this.add.particles(x, this.wizard.y, 'spark', {
                speed: { min: 200, max: 400 },
                scale: { start: 0.8, end: 1.5 },
                alpha: { start: 0.6, end: 0 },
                lifespan: 600,
                quantity: 5,
                frequency: 50,
                emitZone: {
                    type: 'random',
                    source: new Phaser.Geom.Rectangle(-10, -steamHeight/2, 20, steamHeight)
                },
                tint: [0xaaaaaa, 0xffffff],
                blendMode: 'NORMAL',
                angle: direction === 'left' ? { min: 160, max: 200 } : { min: -20, max: 20 }
            });
        };
        
        const leftParticles = createSteamParticles(this.wizard.x - 20, 'left');
        const rightParticles = createSteamParticles(this.wizard.x + 20, 'right');
        leftParticles.setDepth(6);
        rightParticles.setDepth(6);
        
        // Expand animation
        leftSteam.setScale(0, 1);
        rightSteam.setScale(0, 1);
        
        this.tweens.add({
            targets: leftSteam,
            scaleX: 1,
            duration: 300,
            ease: 'Power2.Out'
        });
        
        this.tweens.add({
            targets: rightSteam,
            scaleX: 1,
            duration: 300,
            ease: 'Power2.Out'
        });
        
        // Steam pulsing effect
        this.tweens.add({
            targets: [leftSteam, rightSteam],
            alpha: { from: 0.3, to: 0.5 },
            scaleY: { from: 1, to: 1.2 },
            duration: 400,
            yoyo: true,
            repeat: 4
        });
        
        // Deal damage and push enemies
        const damageInterval = this.time.addEvent({
            delay: 150, // Effect every 150ms
            callback: () => {
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        // Check if enemy is within horizontal steam area
                        if (Math.abs(enemy.y - this.wizard.y) < steamHeight / 2) {
                            const isLeft = enemy.x < this.wizard.x;
                            const isRight = enemy.x > this.wizard.x;
                            
                            if ((isLeft && Math.abs(enemy.x - this.wizard.x) < steamWidth) ||
                                (isRight && Math.abs(enemy.x - this.wizard.x) < steamWidth)) {
                                
                                // Apply steam damage
                                enemy.health -= 1.5;
                                
                                // Check if enemy should die
                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                    return; // Skip other effects for dead enemy
                                }
                                
                                // Apply slow effect (steam makes enemies wet and slow)
                                enemy.wet = true;
                                enemy.wetEndTime = this.time.now + 2000;
                                if (!enemy.originalSpeed) {
                                    enemy.originalSpeed = enemy.speed || 50;
                                }
                                enemy.speed = enemy.originalSpeed * 0.5;
                                
                                // Visual effect
                                enemy.setTint(0x8888ff);
                                
                                // Push enemies away horizontally
                                const pushForce = 300;
                                const direction = enemy.x > this.wizard.x ? 1 : -1;
                                enemy.setVelocityX(direction * pushForce);
                                enemy.setVelocityY(Phaser.Math.Between(-50, 50)); // Small vertical variation
                                
                                // Steam hit effect
                                const steamHit = this.add.circle(enemy.x, enemy.y, 15, 0xcccccc, 0.6);
                                steamHit.setDepth(10);
                                this.tweens.add({
                                    targets: steamHit,
                                    scale: { from: 0.5, to: 2 },
                                    alpha: { from: 0.6, to: 0 },
                                    duration: 400,
                                    onComplete: () => steamHit.destroy()
                                });
                                
                                // Show damage
                                this.showDamageNumber(enemy.x, enemy.y - 20, 1.5);
                            }
                        }
                    }
                });
            },
            repeat: 6 // Total duration: ~1 second
        });
        
        // Clean up
        this.time.delayedCall(1200, () => {
            this.tweens.add({
                targets: [leftSteam, rightSteam],
                alpha: 0,
                scaleX: 0,
                duration: 300,
                onComplete: () => {
                    leftSteam.destroy();
                    rightSteam.destroy();
                    leftParticles.destroy();
                    rightParticles.destroy();
                    damageInterval.destroy();
                }
            });
        });
    }

    createStarSpell() {
        // Check if star spell is on cooldown
        if (this.starSpellCooldown) {
            return; // Don't cast if on cooldown
        }
        
        // Set cooldown (double the normal cooldown time)
        this.starSpellCooldown = true;
        const cooldownDuration = this.hasteActive ? 1600 : 2000; // 20% reduction if hasted
        this.time.delayedCall(cooldownDuration, () => {
            this.starSpellCooldown = false;
        });
        
        // Star element - creates 4 bouncing projectiles that fly in different directions
        const starCount = 4;
        const speed = 400;
        const damage = 2;
        
        // Create 4 star projectiles, one for each diagonal direction
        const directions = [
            { x: 1, y: 1 },     // Down-Right
            { x: -1, y: 1 },    // Down-Left
            { x: 1, y: -1 },    // Up-Right
            { x: -1, y: -1 }    // Up-Left
        ];
        
        for (let i = 0; i < starCount; i++) {
            const star = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'star-spell');
            star.setScale(0.75); // 50% smaller than 1.5
            star.setDepth(5);
            
            // Play star animation
            star.anims.create({
                key: 'star-spin',
                frames: this.anims.generateFrameNumbers('star-spell', { start: 0, end: 5 }),
                frameRate: 15,
                repeat: -1
            });
            star.play('star-spin');
            star.element = 'star';
            star.damage = damage;
            star.isBouncing = true;
            star.isPiercing = true; // Pass through enemies
            star.bounceCount = 0;
            star.maxBounces = 10; // Maximum bounces before disappearing
            
            // Enable physics body
            star.body.enable = true;
            
            // Configure physics body
            star.body.setSize(40, 40);
            star.body.setCollideWorldBounds(false);
            star.body.setImmovable(false);
            star.body.allowGravity = false;
            star.body.moves = true;
            
            // Add glowing effect
            this.tweens.add({
                targets: star,
                scale: { from: 0.75, to: 0.9 },
                alpha: { from: 1, to: 0.7 },
                duration: 300,
                yoyo: true,
                repeat: -1
            });
            
            // Add to projectiles group
            this.projectiles.add(star);
            
            // Set initial velocity AFTER adding to group
            const dir = directions[i];
            // Normalize diagonal movement (divide by sqrt(2) ≈ 0.707)
            const normalizedSpeed = speed * 0.707;
            star.body.setVelocity(dir.x * normalizedSpeed, dir.y * normalizedSpeed);
            
            // Create trail effect
            const trailInterval = this.time.addEvent({
                delay: 50,
                callback: () => {
                    if (star.active) {
                        const trail = this.add.circle(star.x, star.y, 3, 0xffffff, 0.5);
                        trail.setDepth(4);
                        this.tweens.add({
                            targets: trail,
                            scale: 0,
                            alpha: 0,
                            duration: 300,
                            onComplete: () => trail.destroy()
                        });
                    } else {
                        trailInterval.destroy();
                    }
                },
                repeat: -1
            });
            
            // Store trail interval for cleanup
            star.trailInterval = trailInterval;
            
            // Auto-destroy after 3 seconds
            this.time.delayedCall(3000, () => {
                if (star.active) {
                    // Create a small explosion effect
                    const explosion = this.add.circle(star.x, star.y, 20, 0xffffff, 0.8);
                    explosion.setDepth(6);
                    this.tweens.add({
                        targets: explosion,
                        scale: { from: 0.5, to: 1.5 },
                        alpha: { from: 0.8, to: 0 },
                        duration: 300,
                        onComplete: () => explosion.destroy()
                    });
                    
                    // Clean up trail interval
                    if (star.trailInterval) {
                        star.trailInterval.destroy();
                    }
                    
                    star.destroy();
                }
            });
            
            // Custom update function for bouncing
            star.updateBounce = () => {
                if (!star.active) return;
                
                const camera = this.cameras.main;
                const bounds = {
                    left: camera.scrollX,
                    right: camera.scrollX + camera.width,
                    top: camera.scrollY,
                    bottom: camera.scrollY + camera.height
                };
                
                // Check viewport boundaries
                let bounced = false;
                
                if (star.x <= bounds.left + 10 || star.x >= bounds.right - 10) {
                    star.setVelocityX(-star.body.velocity.x);
                    bounced = true;
                    // Keep star within bounds
                    if (star.x <= bounds.left + 10) star.x = bounds.left + 11;
                    if (star.x >= bounds.right - 10) star.x = bounds.right - 11;
                }
                
                if (star.y <= bounds.top + 10 || star.y >= bounds.bottom - 10) {
                    star.setVelocityY(-star.body.velocity.y);
                    bounced = true;
                    // Keep star within bounds
                    if (star.y <= bounds.top + 10) star.y = bounds.top + 11;
                    if (star.y >= bounds.bottom - 10) star.y = bounds.bottom - 11;
                }
                
                // Visual feedback on bounce
                if (bounced) {
                    star.bounceCount++;
                    
                    // Create bounce effect
                    const bounceEffect = this.add.circle(star.x, star.y, 15, 0xffffff, 0.6);
                    bounceEffect.setDepth(6);
                    this.tweens.add({
                        targets: bounceEffect,
                        scale: { from: 0.5, to: 1 },
                        alpha: { from: 0.6, to: 0 },
                        duration: 200,
                        onComplete: () => bounceEffect.destroy()
                    });
                    
                    // Destroy if max bounces reached
                    if (star.bounceCount >= star.maxBounces) {
                        if (star.trailInterval) {
                            star.trailInterval.destroy();
                        }
                        star.destroy();
                    }
                }
            };
            
            // Store update function reference
            star.starUpdate = star.updateBounce;
        }
    }

    createZodiacSpell() {
        // Check if zodiac spell is on cooldown
        if (this.zodiacSpellCooldown) {
            return; // Don't cast if on cooldown
        }
        
        // Set cooldown (longer than regular star spell)
        this.zodiacSpellCooldown = true;
        const cooldownDuration = this.hasteActive ? 2400 : 3000; // 20% reduction if hasted
        this.time.delayedCall(cooldownDuration, () => {
            this.zodiacSpellCooldown = false;
        });
        
        // Zodiac spell - creates 4 bouncing projectiles with light trails (reduced from 6 for performance)
        const starCount = 4;
        const speed = 350;
        const damage = 4; // Increased damage to compensate for fewer projectiles
        
        // Create 6 star projectiles in a hexagonal pattern
        for (let i = 0; i < starCount; i++) {
            const angle = (Math.PI * 2 / starCount) * i;
            const star = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'star-spell');
            star.setScale(0.9); // Slightly larger than regular stars
            star.setDepth(5);
            
            // Play star animation
            if (!this.anims.exists('zodiac-spin')) {
                this.anims.create({
                    key: 'zodiac-spin',
                    frames: this.anims.generateFrameNumbers('star-spell', { start: 0, end: 5 }),
                    frameRate: 20, // Faster spin
                    repeat: -1
                });
            }
            star.play('zodiac-spin');
            star.element = 'star';
            star.damage = damage;
            star.isBouncing = true;
            star.isPiercing = true; // Pass through enemies
            star.bounceCount = 0;
            star.maxBounces = 15; // More bounces than regular star
            star.enemiesHit = new Set(); // Track enemies hit to allow re-hitting after bounce
            star.isZodiac = true; // Mark as zodiac star
            
            // Enable physics body
            star.body.enable = true;
            star.body.setSize(40, 40);
            star.body.setCollideWorldBounds(false);
            star.body.setImmovable(false);
            star.body.allowGravity = false;
            star.body.moves = true;
            
            // Add golden glow effect
            star.setTint(0xffd700); // Golden tint
            // Removed infinite tween for performance - static glow instead
            star.setAlpha(0.9);
            
            // Add to projectiles group
            this.projectiles.add(star);
            
            // Set initial velocity in hexagonal pattern
            star.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Create light trail array with max limit
            star.lightTrail = [];
            star.maxTrailLength = 40; // Limit trail segments per star
            star.trailCheckCounter = 0; // Counter for reducing collision checks
            
            // Create persistent light trail with optimized interval
            const trailInterval = this.time.addEvent({
                delay: 80, // Reduced frequency from 30ms to 80ms
                callback: () => {
                    if (star.active) {
                        // Limit trail length
                        if (star.lightTrail.length >= star.maxTrailLength) {
                            const oldTrail = star.lightTrail.shift();
                            if (oldTrail && oldTrail.active) {
                                oldTrail.destroy();
                            }
                        }
                        
                        // Create trail segment with reduced visual complexity
                        const trail = this.add.circle(star.x, star.y, 6, 0xffd700, 0.3);
                        trail.setDepth(4);
                        trail.isActive = true;
                        trail.x = star.x;
                        trail.y = star.y;
                        
                        // Store trail
                        star.lightTrail.push(trail);
                        
                        // Simple fade without tween (less overhead)
                        trail.fadeTimer = this.time.addEvent({
                            delay: 100,
                            repeat: 15,
                            callback: () => {
                                trail.alpha -= 0.02;
                                trail.scale -= 0.03;
                                if (trail.alpha <= 0) {
                                    const index = star.lightTrail.indexOf(trail);
                                    if (index > -1) {
                                        star.lightTrail.splice(index, 1);
                                    }
                                    trail.destroy();
                                    trail.fadeTimer.destroy();
                                }
                            }
                        });
                        
                        // Check collisions only every 3rd trail segment
                        star.trailCheckCounter++;
                        if (star.trailCheckCounter % 3 === 0) {
                            // Optimized enemy collision check
                            const nearbyEnemies = [];
                            this.enemies.children.entries.forEach(enemy => {
                                if (enemy.active && !enemy.isDying) {
                                    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, trail.x, trail.y);
                                    if (dist < 100) { // Pre-filter by larger radius
                                        nearbyEnemies.push(enemy);
                                    }
                                }
                            });
                            
                            // Check only nearby enemies
                            nearbyEnemies.forEach(enemy => {
                                const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, trail.x, trail.y);
                                if (dist < 20 && trail.isActive) {
                                    // Deal damage
                                    enemy.health -= 2; // Increased damage to compensate for less frequent checks
                                    enemy.setTint(0xffd700);
                                    this.time.delayedCall(100, () => {
                                        if (enemy.active) enemy.clearTint();
                                    });
                                    
                                    if (enemy.health <= 0) {
                                        this.killEnemy(enemy);
                                    }
                                    
                                    // Deactivate trail
                                    trail.isActive = false;
                                    trail.setAlpha(0.1);
                                }
                            });
                        }
                    } else {
                        trailInterval.destroy();
                        // Clean up remaining trail segments
                        star.lightTrail.forEach(trail => {
                            if (trail.active) trail.destroy();
                        });
                    }
                },
                repeat: -1
            });
            
            // Store trail interval for cleanup
            star.trailInterval = trailInterval;
            
            // Destroy after max time
            this.time.delayedCall(8000, () => {
                if (star.active) {
                    if (star.trailInterval) star.trailInterval.destroy();
                    star.lightTrail.forEach(trail => {
                        if (trail.active) trail.destroy();
                    });
                    star.destroy();
                }
            });
            
            // Custom update function for bouncing with enemy collision
            star.updateBounce = () => {
                if (!star.active) return;
                
                const camera = this.cameras.main;
                const bounds = {
                    left: camera.scrollX,
                    right: camera.scrollX + camera.width,
                    top: camera.scrollY,
                    bottom: camera.scrollY + camera.height
                };
                
                // Check viewport boundaries
                let bounced = false;
                
                if (star.x <= bounds.left + 10 || star.x >= bounds.right - 10) {
                    star.setVelocityX(-star.body.velocity.x);
                    bounced = true;
                    if (star.x <= bounds.left + 10) star.x = bounds.left + 11;
                    if (star.x >= bounds.right - 10) star.x = bounds.right - 11;
                }
                
                if (star.y <= bounds.top + 10 || star.y >= bounds.bottom - 10) {
                    star.setVelocityY(-star.body.velocity.y);
                    bounced = true;
                    if (star.y <= bounds.top + 10) star.y = bounds.top + 11;
                    if (star.y >= bounds.bottom - 10) star.y = bounds.bottom - 11;
                }
                
                // Check collision with enemies for bouncing (optimized)
                // Only check every 2nd frame for performance
                if (!star.skipEnemyCheck) {
                    star.skipEnemyCheck = true; // Skip next frame
                    
                    // Pre-filter enemies by distance
                    const checkRadius = 150;
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active && !enemy.isDying) {
                            // Quick distance check first
                            const dx = Math.abs(enemy.x - star.x);
                            const dy = Math.abs(enemy.y - star.y);
                            
                            if (dx < checkRadius && dy < checkRadius) {
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < 30) { // Collision distance
                                    // Bounce off enemy
                                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, star.x, star.y);
                                    const currentSpeed = Math.sqrt(star.body.velocity.x ** 2 + star.body.velocity.y ** 2);
                                    star.setVelocity(
                                        Math.cos(angle) * currentSpeed,
                                        Math.sin(angle) * currentSpeed
                                    );
                                    
                                    // Clear hit list on bounce to allow re-hitting
                                    star.enemiesHit.clear();
                                    bounced = true;
                                    
                                    // Simple visual feedback without tween
                                    const flash = this.add.circle(enemy.x, enemy.y, 20, 0xffd700, 0.6);
                                    flash.setDepth(6);
                                    this.time.delayedCall(300, () => {
                                        if (flash.active) flash.destroy();
                                    });
                                }
                            }
                        }
                    });
                } else {
                    star.skipEnemyCheck = false; // Check next frame
                }
                
                // Visual feedback on bounce
                if (bounced) {
                    star.bounceCount++;
                    
                    // Simple bounce effect without tween
                    if (star.bounceCount % 3 === 0) { // Only show effect every 3rd bounce
                        const bounce = this.add.circle(star.x, star.y, 15, 0xffffff, 0.5);
                        bounce.setDepth(6);
                        bounce.setScale(1.5);
                        this.time.delayedCall(150, () => {
                            if (bounce.active) bounce.destroy();
                        });
                    }
                    
                    // Speed boost on bounce
                    const currentVelocity = star.body.velocity;
                    const speedBoost = 1.05; // 5% speed increase per bounce
                    star.setVelocity(
                        currentVelocity.x * speedBoost,
                        currentVelocity.y * speedBoost
                    );
                    
                    // Destroy if max bounces reached
                    if (star.bounceCount >= star.maxBounces) {
                        if (star.trailInterval) star.trailInterval.destroy();
                        star.lightTrail.forEach(trail => {
                            if (trail.active) trail.destroy();
                        });
                        star.destroy();
                    }
                }
            };
            
            // Set the update function
            star.starUpdate = star.updateBounce;
        }
    }

    createTimeSpell() {
        // Check if time spell is on cooldown
        if (this.timeSpellCooldown) {
            return; // Don't cast if on cooldown
        }
        
        // Set cooldown
        this.timeSpellCooldown = true;
        const cooldownDuration = this.hasteActive ? 9600 : 12000; // 20% reduction if hasted
        this.time.delayedCall(cooldownDuration, () => {
            this.timeSpellCooldown = false;
        });
        
        // Time element - creates an AOE that slows enemies and hastes the player
        const timeRadius = 150;
        const spellDuration = 6000; // 6 seconds
        
        // Store initial position (doesn't follow wizard)
        const timePosition = {
            x: this.wizard.x,
            y: this.wizard.y
        };
        
        // Create time zone visual - similar to sun but with different colors
        const timeRing = this.add.circle(timePosition.x, timePosition.y, timeRadius, 0x9966ff, 0.1); // Purple tint
        timeRing.setDepth(3);
        timeRing.setStrokeStyle(3, 0xccaaff, 0.5); // Light purple stroke
        
        // Add inner time glow
        const innerGlow = this.add.circle(timePosition.x, timePosition.y, 100, 0xccccff, 0.05);
        innerGlow.setDepth(3);
        
        // Add time distortion particles
        const particles = this.add.particles(timePosition.x, timePosition.y, 'particle', {
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: 30,
            lifespan: 2000,
            frequency: 60,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 140),
                quantity: 12
            },
            tint: 0x9966ff
        });
        
        // Create particle texture if it doesn't exist
        if (!this.textures.exists('particle')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }
        
        // Time distortion pulsing animation
        this.tweens.add({
            targets: [timeRing, innerGlow],
            scale: { from: 1, to: 1.1 },
            alpha: { from: timeRing.alpha, to: timeRing.alpha + 0.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Apply haste to player
        const originalSpeed = this.wizardSpeed || 130;
        this.wizardSpeed = originalSpeed * 1.2; // 20% faster
        this.hasteActive = true;
        this.hasteEndTime = this.time.now + spellDuration;
        
        // Visual haste effect on wizard
        const hasteGlow = this.add.circle(this.wizard.x, this.wizard.y, 30, 0x9966ff, 0.3);
        hasteGlow.setDepth(4);
        
        // Make haste glow follow wizard
        const hasteFollowInterval = this.time.addEvent({
            delay: 16, // Every frame
            callback: () => {
                if (hasteGlow.active && this.wizard.active) {
                    hasteGlow.x = this.wizard.x;
                    hasteGlow.y = this.wizard.y;
                }
            },
            repeat: -1
        });
        
        // Time effect - check enemies in range and apply slow
        const timeEffect = this.time.addEvent({
            delay: 500, // Check every 0.5 seconds
            callback: () => {
                if (!timeRing.active) {
                    timeEffect.destroy();
                    return;
                }
                
                // Check enemies in range and apply time slow
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, timePosition.x, timePosition.y);
                        if (dist < timeRadius) {
                            // Apply time slow effect
                            if (!enemy.timeSlowed) {
                                enemy.timeSlowed = true;
                                enemy.originalSpeed = enemy.moveSpeed || 40;
                                enemy.moveSpeed = enemy.originalSpeed * 0.3; // 70% slower
                                
                                // Visual effect - purple tint
                                enemy.setTint(0x9966ff);
                            }
                        } else if (enemy.timeSlowed) {
                            // Enemy left the time zone - restore speed
                            enemy.timeSlowed = false;
                            enemy.moveSpeed = enemy.originalSpeed;
                            // Clear tint only if no other effects
                            if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.burning) {
                                enemy.clearTint();
                            }
                        }
                    }
                });
            },
            repeat: -1
        });
        
        // Destroy time spell after duration
        this.time.delayedCall(spellDuration, () => {
            // Clean up all time spell components
            timeRing.destroy();
            innerGlow.destroy();
            particles.destroy();
            timeEffect.destroy();
            hasteGlow.destroy();
            hasteFollowInterval.destroy();
            
            // Remove haste from player
            this.wizardSpeed = originalSpeed;
            this.hasteActive = false;
            
            // Clear time slow from all enemies
            this.enemies.children.entries.forEach(enemy => {
                if (enemy.active && enemy.timeSlowed) {
                    enemy.timeSlowed = false;
                    enemy.moveSpeed = enemy.originalSpeed;
                    // Clear tint only if no other effects
                    if (!enemy.frozen && !enemy.stunned && !enemy.poisoned && !enemy.slowed && !enemy.burning) {
                        enemy.clearTint();
                    }
                }
            });
        });
    }

    createNatureSpell() {
        // Check if nature spell is on cooldown
        if (this.natureSpellCooldown) {
            return; // Don't cast if on cooldown
        }
        
        // Set cooldown
        this.natureSpellCooldown = true;
        const cooldownDuration = this.hasteActive ? 2400 : 3000; // 3 seconds cooldown, 20% reduction if hasted
        this.time.delayedCall(cooldownDuration, () => {
            this.natureSpellCooldown = false;
        });
        
        // Nature element - creates whipping vines that originate from wizard
        const vineCount = 8; // Number of vines
        const vineLength = 120; // Maximum reach of vines (reduced by 40% from 200)
        const vineDuration = 1500; // How long the whip animation lasts
        const damage = 4;
        
        // Create vines in a circular pattern around wizard
        for (let i = 0; i < vineCount; i++) {
            const angle = (Math.PI * 2 / vineCount) * i;
            
            // Create vine graphics
            const vine = this.add.graphics();
            vine.setDepth(5);
            
            // Vine segments for animation
            const segments = 10;
            const segmentLength = vineLength / segments;
            let vinePoints = [];
            
            // Initialize vine points at wizard position
            for (let j = 0; j <= segments; j++) {
                vinePoints.push({
                    x: this.wizard.x,
                    y: this.wizard.y
                });
            }
            
            // Track animation state
            let animPhase = 'extend';
            let animProgress = 0;
            
            // Create animation tween
            const vineAnim = this.tweens.add({
                targets: { progress: 0 },
                progress: 1,
                duration: vineDuration,
                onUpdate: (tween) => {
                    animProgress = tween.getValue();
                    
                    // Determine phase
                    if (animProgress < 0.33) {
                        animPhase = 'extend';
                    } else if (animProgress < 0.67) {
                        animPhase = 'whip';
                    } else {
                        animPhase = 'retract';
                    }
                    
                    // Clear previous drawing
                    vine.clear();
                    vine.lineStyle(4, 0x228B22, 1); // Forest green
                    vine.beginPath();
                    vine.moveTo(this.wizard.x, this.wizard.y);
                    
                    if (animPhase === 'extend') {
                        // Extend phase
                        const extendProgress = animProgress * 3;
                        for (let j = 1; j <= segments; j++) {
                            const distance = segmentLength * j * extendProgress;
                            const curveOffset = Math.sin(j * 0.5 + this.time.now * 0.01) * 20;
                            const perpAngle = angle + Math.PI / 2;
                            
                            vinePoints[j].x = this.wizard.x + Math.cos(angle) * distance + Math.cos(perpAngle) * curveOffset;
                            vinePoints[j].y = this.wizard.y + Math.sin(angle) * distance + Math.sin(perpAngle) * curveOffset;
                            
                            vine.lineTo(vinePoints[j].x, vinePoints[j].y);
                        }
                    } else if (animPhase === 'whip') {
                        // Whip phase
                        const whipProgress = (animProgress - 0.33) * 3;
                        for (let j = 1; j <= segments; j++) {
                            const distance = segmentLength * j;
                            const whipAngle = angle + Math.sin(whipProgress * Math.PI * 2) * 0.5;
                            const curveOffset = Math.sin(j * 0.5 + whipProgress * Math.PI * 4) * 30;
                            const perpAngle = whipAngle + Math.PI / 2;
                            
                            vinePoints[j].x = this.wizard.x + Math.cos(whipAngle) * distance + Math.cos(perpAngle) * curveOffset;
                            vinePoints[j].y = this.wizard.y + Math.sin(whipAngle) * distance + Math.sin(perpAngle) * curveOffset;
                            
                            vine.lineTo(vinePoints[j].x, vinePoints[j].y);
                        }
                        
                        // Check for enemy hits during whip phase
                        this.enemies.children.entries.forEach(enemy => {
                            if (enemy.active && !enemy.hitByVine) {
                                // Check if enemy is near any vine segment
                                for (let j = 1; j < segments; j++) {
                                    const dist = Phaser.Math.Distance.Between(
                                        enemy.x, enemy.y,
                                        vinePoints[j].x, vinePoints[j].y
                                    );
                                    
                                    if (dist < 30) { // Hit radius
                                        enemy.hitByVine = true;
                                        enemy.health -= damage;
                                        
                                        // Knockback effect
                                        const knockbackAngle = Phaser.Math.Angle.Between(
                                            this.wizard.x, this.wizard.y,
                                            enemy.x, enemy.y
                                        );
                                        const knockbackForce = 200;
                                        enemy.setVelocity(
                                            Math.cos(knockbackAngle) * knockbackForce,
                                            Math.sin(knockbackAngle) * knockbackForce
                                        );
                                        
                                        // Visual effect - green flash
                                        enemy.setTint(0x00FF00);
                                        this.time.delayedCall(200, () => {
                                            if (enemy.active) enemy.clearTint();
                                        });
                                        
                                        // Show damage
                                        this.showDamageNumber(enemy.x, enemy.y - 20, damage);
                                        
                                        if (enemy.health <= 0) {
                                            this.killEnemy(enemy);
                                        }
                                        
                                        break; // Only hit once per vine
                                    }
                                }
                            }
                        });
                    } else {
                        // Retract phase
                        const retractProgress = 1 - (animProgress - 0.67) * 3;
                        for (let j = 1; j <= segments; j++) {
                            const distance = segmentLength * j * retractProgress;
                            
                            vinePoints[j].x = this.wizard.x + Math.cos(angle) * distance;
                            vinePoints[j].y = this.wizard.y + Math.sin(angle) * distance;
                            
                            vine.lineTo(vinePoints[j].x, vinePoints[j].y);
                        }
                    }
                    
                    vine.strokePath();
                    
                    // Add leaves/thorns
                    for (let j = 2; j < segments; j += 2) {
                        vine.fillStyle(0x00FF00, 0.8);
                        vine.fillCircle(vinePoints[j].x, vinePoints[j].y, 3);
                    }
                },
                onComplete: () => {
                    vine.destroy();
                    
                    // Reset hit flags
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active) {
                            enemy.hitByVine = false;
                        }
                    });
                }
            });
            
            // Delay start for each vine
            if (i > 0) {
                vineAnim.pause();
                this.time.delayedCall(i * 50, () => {
                    vineAnim.resume();
                });
            }
        }
        
        // Add nature particle effect around wizard
        const natureParticles = this.add.particles(this.wizard.x, this.wizard.y, 'particle', {
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: { min: 20, max: 50 },
            lifespan: 1000,
            frequency: 50,
            quantity: 2,
            tint: [0x00FF00, 0x228B22, 0x90EE90],
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 40),
                quantity: 8
            }
        });
        
        // Destroy particles after spell duration
        this.time.delayedCall(vineDuration, () => {
            natureParticles.destroy();
        });
    }

    createLifeSpell() {
        // Check if life spell is on cooldown
        if (this.lifeSpellCooldown) {
            return; // Don't cast if on cooldown
        }
        
        // Set cooldown
        this.lifeSpellCooldown = true;
        const cooldownDuration = this.hasteActive ? 12000 : 15000; // 15 seconds cooldown, 20% reduction if hasted
        this.time.delayedCall(cooldownDuration, () => {
            this.lifeSpellCooldown = false;
        });
        
        // Life element - heals the wizard over time
        const healDuration = 8000; // 8 seconds of healing
        const healInterval = 500; // Heal every 0.5 seconds
        const healAmount = 3; // HP per tick
        
        // Visual effect - create healing aura around wizard
        const healAura = this.add.circle(this.wizard.x, this.wizard.y, 40, 0xff6666, 0.3);
        healAura.setDepth(4);
        
        // Heart particles
        const heartParticles = this.add.particles(this.wizard.x, this.wizard.y, 'life-symbol', {
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.8, end: 0 },
            speed: { min: 20, max: 40 },
            lifespan: 1500,
            frequency: 300,
            quantity: 1,
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 30),
                quantity: 1
            }
        });
        
        // Pulsing animation for aura
        this.tweens.add({
            targets: healAura,
            scale: { from: 1, to: 1.2 },
            alpha: { from: 0.3, to: 0.5 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Follow wizard
        const followInterval = this.time.addEvent({
            delay: 16, // Every frame
            callback: () => {
                if (healAura.active && this.wizard.active) {
                    healAura.x = this.wizard.x;
                    healAura.y = this.wizard.y;
                    heartParticles.x = this.wizard.x;
                    heartParticles.y = this.wizard.y;
                }
            },
            repeat: -1
        });
        
        // Healing effect
        const healingInterval = this.time.addEvent({
            delay: healInterval,
            callback: () => {
                if (!this.wizard.active || !healAura.active) {
                    healingInterval.destroy();
                    return;
                }
                
                // Heal wizard
                if (this.playerHealth < this.maxHealth) {
                    this.playerHealth = Math.min(this.playerHealth + healAmount, this.maxHealth);
                    this.updateWizardHealthBar();
                    
                    // Show healing number
                    const healText = this.add.text(this.wizard.x, this.wizard.y - 30, `+${healAmount}`, {
                        fontSize: '20px',
                        color: '#ff6666',
                        fontStyle: 'bold'
                    });
                    healText.setOrigin(0.5);
                    healText.setDepth(10);
                    
                    this.tweens.add({
                        targets: healText,
                        y: this.wizard.y - 60,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => healText.destroy()
                    });
                    
                    // Healing sparkles
                    for (let i = 0; i < 3; i++) {
                        const sparkle = this.add.circle(
                            this.wizard.x + Phaser.Math.Between(-20, 20),
                            this.wizard.y + Phaser.Math.Between(-20, 20),
                            3,
                            0xffaaaa,
                            0.8
                        );
                        sparkle.setDepth(5);
                        
                        this.tweens.add({
                            targets: sparkle,
                            y: sparkle.y - 20,
                            scale: 0,
                            alpha: 0,
                            duration: 600,
                            onComplete: () => sparkle.destroy()
                        });
                    }
                }
            },
            repeat: healDuration / healInterval - 1
        });
        
        // Clean up after duration
        this.time.delayedCall(healDuration, () => {
            healAura.destroy();
            heartParticles.destroy();
            followInterval.destroy();
            healingInterval.destroy();
        });
    }

    createHexSpell() {
        // Hex element - curse nearby enemies to deal no damage
        const hexRadius = 200; // Radius to hex enemies
        const hexDuration = 8000; // 8 seconds hex duration
        
        // Check if on cooldown
        if (this.hexSpellCooldown) {
            return;
        }
        
        // Set cooldown
        this.hexSpellCooldown = true;
        const cooldownDuration = this.hasteActive ? 12800 : 16000; // 16 second cooldown (12.8s with haste)
        this.time.delayedCall(cooldownDuration, () => {
            this.hexSpellCooldown = false;
        });
        
        // Visual activation effect
        const hexCircle = this.add.circle(this.wizard.x, this.wizard.y, 100, 0x9932cc, 0.4);
        hexCircle.setDepth(5);
        
        // Create hex symbols around the circle
        const hexSymbols = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const x = this.wizard.x + Math.cos(angle) * 80;
            const y = this.wizard.y + Math.sin(angle) * 80;
            
            const symbol = this.add.text(x, y, '⬢', {
                fontSize: '32px',
                color: '#9932cc'
            });
            symbol.setOrigin(0.5);
            symbol.setDepth(5);
            hexSymbols.push(symbol);
        }
        
        // Activation animation
        this.tweens.add({
            targets: hexCircle,
            scale: { from: 0, to: 2 },
            alpha: { from: 0.8, to: 0 },
            duration: 1000,
            ease: 'Power2'
        });
        
        // Rotate hex symbols
        hexSymbols.forEach((symbol, index) => {
            this.tweens.add({
                targets: symbol,
                angle: 360,
                scale: { from: 0.5, to: 1.5 },
                alpha: { from: 1, to: 0 },
                duration: 1000,
                delay: index * 100,
                onComplete: () => symbol.destroy()
            });
        });
        
        // Expand hex circle to show area of effect
        this.tweens.add({
            targets: hexCircle,
            scale: { from: 0, to: hexRadius / 50 }, // Scale to match radius
            alpha: { from: 0.8, to: 0 },
            duration: 1000,
            ease: 'Power2',
            onComplete: () => hexCircle.destroy()
        });
        
        // Find all active enemies that aren't already hexed
        const validEnemies = this.enemies.children.entries.filter(enemy => 
            enemy.active && !enemy.isDying && !enemy.isHexed
        );
        
        if (validEnemies.length > 0) {
            // Pick a random enemy from valid enemies
            const randomEnemy = Phaser.Math.RND.pick(validEnemies);
            
            // Apply hex to the random enemy
            this.applyHexCurse(randomEnemy, hexDuration);
            
            // Create hex projectile effect
            const dist = Phaser.Math.Distance.Between(randomEnemy.x, randomEnemy.y, this.wizard.x, this.wizard.y);
            const hexBolt = this.add.graphics();
            hexBolt.lineStyle(3, 0x9932cc, 0.8);
            hexBolt.beginPath();
            hexBolt.moveTo(this.wizard.x, this.wizard.y);
            
            // Create wavy line to enemy
            const points = 10;
            for (let i = 0; i <= points; i++) {
                const t = i / points;
                const x = this.wizard.x + (randomEnemy.x - this.wizard.x) * t;
                const y = this.wizard.y + (randomEnemy.y - this.wizard.y) * t;
                const wave = Math.sin(t * Math.PI * 4) * 10;
                const perpX = -(randomEnemy.y - this.wizard.y) / dist * wave;
                const perpY = (randomEnemy.x - this.wizard.x) / dist * wave;
                hexBolt.lineTo(x + perpX, y + perpY);
            }
            hexBolt.strokePath();
            hexBolt.setDepth(6);
            
            // Fade out hex bolt
            this.tweens.add({
                targets: hexBolt,
                alpha: 0,
                duration: 500,
                onComplete: () => hexBolt.destroy()
            });
            
            // Area of effect - hex adjacent enemies
            const aoeRadius = 80; // Small radius for adjacent enemies
            
            // Visual effect for AoE
            const aoeCircle = this.add.circle(randomEnemy.x, randomEnemy.y, aoeRadius, 0x9932cc, 0.3);
            aoeCircle.setDepth(4);
            
            this.tweens.add({
                targets: aoeCircle,
                scale: { from: 0, to: 1 },
                alpha: { from: 0.6, to: 0 },
                duration: 800,
                ease: 'Power2',
                onComplete: () => aoeCircle.destroy()
            });
            
            // Hex all enemies within AoE radius of the target
            this.enemies.children.entries.forEach(enemy => {
                if (enemy.active && !enemy.isDying && !enemy.isHexed && enemy !== randomEnemy) {
                    const distFromTarget = Phaser.Math.Distance.Between(enemy.x, enemy.y, randomEnemy.x, randomEnemy.y);
                    if (distFromTarget < aoeRadius) {
                        // Apply hex to adjacent enemy
                        this.applyHexCurse(enemy, hexDuration);
                        
                        // Small visual effect for adjacent hexes
                        const miniHex = this.add.text(enemy.x, enemy.y - 20, '⬢', {
                            fontSize: '20px',
                            color: '#9932cc'
                        });
                        miniHex.setOrigin(0.5);
                        miniHex.setDepth(5);
                        
                        this.tweens.add({
                            targets: miniHex,
                            y: enemy.y - 40,
                            alpha: 0,
                            scale: 1.5,
                            duration: 1000,
                            onComplete: () => miniHex.destroy()
                        });
                    }
                }
            });
        }
    }

    createVenomSpell() {
        // Venom element - shoots piercing spines that apply poison
        const spineCount = 5; // Number of spines to shoot
        const spread = Math.PI / 3; // 60 degree spread
        
        // Get player's facing direction
        const direction = this.wizard.lastDirection || 'down';
        
        // Map directions to angles
        const directionAngles = {
            'up': -Math.PI / 2,
            'down': Math.PI / 2,
            'left': Math.PI,
            'right': 0,
            'up-left': -3 * Math.PI / 4,
            'up-right': -Math.PI / 4,
            'down-left': 3 * Math.PI / 4,
            'down-right': Math.PI / 4
        };
        
        const targetAngle = directionAngles[direction] || 0;
        
        // Create venom spine texture if it doesn't exist
        if (!this.textures.exists('venom-spine')) {
            const graphics = this.add.graphics();
            
            // Draw a sharp spine shape (offset to positive coordinates)
            graphics.fillStyle(0x8b00ff, 1); // Purple for venom
            graphics.beginPath();
            graphics.moveTo(6, 2); // Tip (offset by +6, +14)
            graphics.lineTo(3, 14);
            graphics.lineTo(4, 26); // Base
            graphics.lineTo(8, 26);
            graphics.lineTo(9, 14);
            graphics.closePath();
            graphics.fillPath();
            
            // Add poison drip effect
            graphics.fillStyle(0x00ff00, 0.8); // Green for poison
            graphics.fillCircle(6, 4, 2);
            graphics.fillCircle(5, 7, 1.5);
            graphics.fillCircle(7, 6, 1.5);
            
            graphics.generateTexture('venom-spine', 12, 28);
            graphics.destroy();
        }
        
        // Create venomous spines
        for (let i = 0; i < spineCount; i++) {
            // Calculate angle for this spine with spread
            const angleOffset = (i - (spineCount - 1) / 2) * (spread / (spineCount - 1));
            const spineAngle = targetAngle + angleOffset;
            
            const spine = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'venom-spine');
            spine.element = 'venom';
            spine.damage = 3;
            spine.poisonDamage = 6; // Total poison damage over time
            spine.isPiercing = true; // Pierce through enemies like crystal
            spine.hitEnemies = new Set(); // Track which enemies have been hit
            spine.body.setCollideWorldBounds(false);
            spine.setDepth(5);
            spine.setScale(1.5);
            
            // Add to projectiles group first (like earth spell)
            this.projectiles.add(spine);
            
            // Set rotation to match angle
            spine.setRotation(spineAngle + Math.PI / 2);
            
            // Set velocity
            const speed = 600;
            spine.setVelocity(
                Math.cos(spineAngle) * speed,
                Math.sin(spineAngle) * speed
            );
            
            // Create a separate texture for particles if needed
            if (!this.textures.exists('venom-particle')) {
                const particleGraphics = this.add.graphics();
                particleGraphics.fillStyle(0x8b00ff, 1);
                particleGraphics.fillCircle(2, 2, 2);
                particleGraphics.generateTexture('venom-particle', 4, 4);
                particleGraphics.destroy();
            }
            
            // Add poison trail particles
            const trail = this.add.particles(spine.x, spine.y, 'venom-particle', {
                scale: { start: 0.5, end: 0 },
                alpha: { start: 0.6, end: 0 },
                tint: [0x8b00ff, 0x00ff00], // Purple and green
                speed: 0,
                lifespan: 300,
                frequency: 30
            });
            trail.setDepth(4);
            
            // Update trail position
            const trailUpdate = this.time.addEvent({
                delay: 16,
                callback: () => {
                    if (spine.active) {
                        trail.setPosition(spine.x, spine.y);
                    } else {
                        trail.destroy();
                        trailUpdate.destroy();
                    }
                },
                loop: true
            });
            
            // Add slight delay between spines for visual effect
            this.time.delayedCall(i * 50, () => {
                // Visual launch effect
                const flash = this.add.circle(this.wizard.x, this.wizard.y, 10, 0x8b00ff, 0.8);
                flash.setDepth(5);
                this.tweens.add({
                    targets: flash,
                    scale: 2,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => flash.destroy()
                });
            });
            
            // Destroy after 2 seconds
            this.time.delayedCall(2000, () => {
                if (spine.active) {
                    spine.destroy();
                }
                trail.destroy();
                trailUpdate.destroy();
            });
        }
        
        // Visual effect at wizard
        const burst = this.add.circle(this.wizard.x, this.wizard.y, 30, 0x8b00ff, 0.4);
        burst.setDepth(4);
        
        // Create venom symbols around burst
        const symbols = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const x = this.wizard.x + Math.cos(angle) * 25;
            const y = this.wizard.y + Math.sin(angle) * 25;
            
            const symbol = this.add.text(x, y, '☠', {
                fontSize: '20px',
                color: '#00ff00'
            });
            symbol.setOrigin(0.5);
            symbol.setDepth(5);
            symbols.push(symbol);
        }
        
        // Animate burst and symbols
        this.tweens.add({
            targets: burst,
            scale: { from: 0.5, to: 2 },
            alpha: { from: 0.6, to: 0 },
            duration: 500,
            onComplete: () => burst.destroy()
        });
        
        symbols.forEach((symbol, index) => {
            this.tweens.add({
                targets: symbol,
                scale: { from: 0.5, to: 1.5 },
                alpha: { from: 1, to: 0 },
                angle: 360,
                duration: 500,
                delay: index * 50,
                onComplete: () => symbol.destroy()
            });
        });
    }

    createPhilosopherStone() {
        // Philosopher Stone - fusion of life and death, grants automatic level ups
        
        // Check if philosopher stone is already active
        if (this.philosopherStoneActive) {
            console.log('Philosopher stone is already active, skipping activation');
            return;
        }
        
        // Activate philosopher stone
        this.philosopherStoneActive = true;
        console.log('Philosopher stone activated!');
        
        // Visual activation effect
        const stoneCircle = this.add.circle(this.wizard.x, this.wizard.y, 50, 0xffd700, 0.6); // Gold color
        stoneCircle.setDepth(5);
        
        // Create alchemical symbols
        const symbols = [];
        const symbolTypes = ['☉', '☽', '♄', '♃', '♂', '♀', '☿', '🜍']; // Alchemical symbols
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const radius = 60;
            const x = this.wizard.x + Math.cos(angle) * radius;
            const y = this.wizard.y + Math.sin(angle) * radius;
            
            const symbol = this.add.text(x, y, symbolTypes[i], {
                fontSize: '24px',
                color: '#ffd700'
            });
            symbol.setOrigin(0.5);
            symbol.setDepth(6);
            symbols.push(symbol);
        }
        
        // Activation animation
        this.tweens.add({
            targets: stoneCircle,
            scale: { from: 0, to: 2 },
            alpha: { from: 0.8, to: 0 },
            duration: 1500,
            ease: 'Power2',
            onComplete: () => stoneCircle.destroy()
        });
        
        // Rotate and fade symbols
        symbols.forEach((symbol, index) => {
            this.tweens.add({
                targets: symbol,
                angle: 720,
                scale: { from: 0.5, to: 2 },
                alpha: { from: 1, to: 0 },
                duration: 2000,
                delay: index * 100,
                onComplete: () => symbol.destroy()
            });
        });
        
        // Create permanent philosopher stone indicator
        const stoneIndicator = this.add.graphics();
        stoneIndicator.fillStyle(0xffd700, 0.8);
        stoneIndicator.fillCircle(0, 0, 8);
        stoneIndicator.x = this.wizard.x;
        stoneIndicator.y = this.wizard.y - 40;
        stoneIndicator.setDepth(10);
        
        // Add glow effect
        const glowCircle = this.add.circle(this.wizard.x, this.wizard.y - 40, 12, 0xffd700, 0.3);
        glowCircle.setDepth(9);
        
        // Pulsing animation for the indicator
        this.tweens.add({
            targets: [stoneIndicator, glowCircle],
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0.6, to: 1 },
            duration: 1000,
            yoyo: true,
            loop: -1
        });
        
        // Store references for position updates
        this.philosopherStoneIndicator = stoneIndicator;
        this.philosopherStoneGlow = glowCircle;
        
        // Start the level up timer
        console.log('Starting philosopher stone timer');
        this.philosopherStoneTimer = this.time.addEvent({
            delay: 45000, // 45 seconds
            callback: () => {
                console.log('Philosopher stone timer triggered!');
                console.log('philosopherStoneActive:', this.philosopherStoneActive);
                console.log('Current level:', this.playerLevel);
                
                if (this.philosopherStoneActive) {
                    // Grant level up by setting XP to trigger normal level up flow
                    console.log('Philosopher stone granting level up');
                    
                    // Set XP to exactly what's needed to level up
                    this.playerXP = this.xpToNextLevel;
                    
                    // Call collectJewel with a dummy jewel to trigger the level up logic
                    this.collectJewel(this.wizard, { 
                        xpValue: 0, 
                        destroy: () => {} 
                    });
                    
                    // Visual effect for level up
                    const levelUpBurst = this.add.circle(this.wizard.x, this.wizard.y, 100, 0xffd700, 0.5);
                    levelUpBurst.setDepth(8);
                    
                    this.tweens.add({
                        targets: levelUpBurst,
                        scale: { from: 0, to: 3 },
                        alpha: { from: 0.8, to: 0 },
                        duration: 1000,
                        onComplete: () => levelUpBurst.destroy()
                    });
                    
                    // Create level up text effect
                    const levelText = this.add.text(this.wizard.x, this.wizard.y - 80, 
                        `Level ${this.playerLevel}!`, {
                        fontSize: '32px',
                        color: '#ffd700',
                        fontStyle: 'bold',
                        stroke: '#000000',
                        strokeThickness: 4
                    });
                    levelText.setOrigin(0.5);
                    levelText.setDepth(10);
                    
                    this.tweens.add({
                        targets: levelText,
                        y: this.wizard.y - 120,
                        scale: { from: 0.5, to: 1.5 },
                        alpha: { from: 1, to: 0 },
                        duration: 2000,
                        onComplete: () => levelText.destroy()
                    });
                }
            },
            loop: true
        });
        
        console.log('Philosopher stone timer created:', this.philosopherStoneTimer);
        console.log('Timer delay:', this.philosopherStoneTimer.delay);
        console.log('Timer will repeat:', this.philosopherStoneTimer.loop);
        
        // Notification text
        const activationText = this.add.text(this.wizard.x, this.wizard.y - 60, 
            'Philosopher Stone Activated!', {
            fontSize: '28px',
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        activationText.setOrigin(0.5);
        activationText.setDepth(10);
        
        this.tweens.add({
            targets: activationText,
            y: this.wizard.y - 100,
            alpha: { from: 1, to: 0 },
            duration: 3000,
            onComplete: () => activationText.destroy()
        });
    }

    createHaloAura() {
        // Halo - fusion of holy and water, creates a damaging aura around the wizard
        
        // Check if halo aura is already active
        if (this.haloAuraActive) {
            return;
        }
        
        // Activate halo aura
        this.haloAuraActive = true;
        
        // Visual activation effect
        const activationRing = this.add.circle(this.wizard.x, this.wizard.y, 120, 0x87ceeb, 0.3); // Light blue
        activationRing.setDepth(4);
        
        this.tweens.add({
            targets: activationRing,
            scale: { from: 0, to: 2 },
            alpha: { from: 0.6, to: 0 },
            duration: 1000,
            onComplete: () => activationRing.destroy()
        });
        
        // Create the glowing ring of light
        const auraRadius = 100;
        const ringThickness = 8;
        
        // Create graphics for the ring
        const haloRing = this.add.graphics();
        haloRing.setDepth(3);
        haloRing.setBlendMode(Phaser.BlendModes.ADD);
        
        // Draw the ring
        const drawRing = (graphics, innerGlow = 1) => {
            graphics.clear();
            
            // Outer glow
            graphics.lineStyle(ringThickness + 6, 0xffffff, 0.1 * innerGlow);
            graphics.strokeCircle(this.wizard.x, this.wizard.y, auraRadius);
            
            // Middle glow
            graphics.lineStyle(ringThickness + 3, 0xffffcc, 0.2 * innerGlow);
            graphics.strokeCircle(this.wizard.x, this.wizard.y, auraRadius);
            
            // Inner bright ring
            graphics.lineStyle(ringThickness, 0xffd700, 0.4 * innerGlow);
            graphics.strokeCircle(this.wizard.x, this.wizard.y, auraRadius);
            
            // Core bright line
            graphics.lineStyle(2, 0xffffff, 0.8 * innerGlow);
            graphics.strokeCircle(this.wizard.x, this.wizard.y, auraRadius);
        };
        
        // Initial draw
        drawRing(haloRing);
        
        // Create inner glow circle for additional effect
        const innerGlow = this.add.circle(this.wizard.x, this.wizard.y, auraRadius - 10, 0xffd700, 0.05);
        innerGlow.setDepth(2);
        innerGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Pulsing effect for the ring
        let glowAmount = 1;
        const glowTween = this.tweens.add({
            targets: { glow: 1 },
            glow: { from: 0.7, to: 1.3 },
            duration: 1500,
            yoyo: true,
            loop: -1,
            onUpdate: (tween) => {
                glowAmount = tween.getValue();
                drawRing(haloRing, glowAmount);
                innerGlow.setAlpha(0.05 * glowAmount);
            }
        });
        
        // Store references
        this.haloAura = haloRing;
        this.haloInnerGlow = innerGlow;
        this.haloGlowTween = glowTween;
        this.haloDrawRing = drawRing;
        this.auraRadius = auraRadius;
        
        // Damage tick timer
        this.haloTickTimer = this.time.addEvent({
            delay: 500, // Damage every 0.5 seconds
            callback: () => {
                if (!this.haloAuraActive) {
                    return;
                }
                
                // Damage all enemies within aura radius
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active && !enemy.isDying) {
                        const dist = Phaser.Math.Distance.Between(
                            enemy.x, enemy.y, 
                            this.wizard.x, this.wizard.y
                        );
                        
                        if (dist < auraRadius) {
                            // Deal damage
                            const damage = 2; // Base damage per tick
                            enemy.health -= damage;
                            
                            // Check if enemy died
                            if (enemy.health <= 0) {
                                this.killEnemy(enemy);
                                return; // Skip further effects for dead enemy
                            }
                            
                            // Visual hit effect
                            const hitEffect = this.add.circle(enemy.x, enemy.y, 10, 0x87ceeb, 0.5);
                            hitEffect.setDepth(5);
                            
                            this.tweens.add({
                                targets: hitEffect,
                                scale: { from: 0.5, to: 1.5 },
                                alpha: 0,
                                duration: 300,
                                onComplete: () => hitEffect.destroy()
                            });
                            
                            // Apply holy water effect - slight knockback
                            const knockbackAngle = Math.atan2(
                                enemy.y - this.wizard.y,
                                enemy.x - this.wizard.x
                            );
                            const knockbackForce = 50;
                            
                            if (enemy.body) {
                                enemy.body.velocity.x += Math.cos(knockbackAngle) * knockbackForce;
                                enemy.body.velocity.y += Math.sin(knockbackAngle) * knockbackForce;
                            }
                        }
                    }
                });
            },
            loop: true
        });
        
        // Notification
        const notification = this.add.text(this.wizard.x, this.wizard.y - 80, 
            'Halo Aura Activated!', {
            fontSize: '24px',
            color: '#87ceeb',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        notification.setOrigin(0.5);
        notification.setDepth(10);
        
        this.tweens.add({
            targets: notification,
            y: this.wizard.y - 120,
            alpha: 0,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }

    deactivateHaloAura() {
        // Deactivate the halo aura
        this.haloAuraActive = false;
        
        // Destroy visual components
        if (this.haloAura) {
            this.haloAura.destroy();
            this.haloAura = null;
        }
        
        if (this.haloInnerGlow) {
            this.haloInnerGlow.destroy();
            this.haloInnerGlow = null;
        }
        
        if (this.haloGlowTween) {
            this.haloGlowTween.remove();
            this.haloGlowTween = null;
        }
        
        // Stop damage timer
        if (this.haloTickTimer) {
            this.haloTickTimer.destroy();
            this.haloTickTimer = null;
        }
        
        // Visual deactivation effect
        const deactivationRing = this.add.circle(this.wizard.x, this.wizard.y, 100, 0x87ceeb, 0.3);
        deactivationRing.setDepth(4);
        
        this.tweens.add({
            targets: deactivationRing,
            scale: { from: 1, to: 0 },
            alpha: { from: 0.3, to: 0 },
            duration: 500,
            onComplete: () => deactivationRing.destroy()
        });
    }

    createStormSpell() {
        // Storm element - shoots 3 piercing projectiles that push enemies
        const projectileCount = 3;
        
        // Get wizard direction
        const direction = this.wizard.lastDirection || 'down';
        
        // Simple direction to angle mapping
        let baseAngle = Math.PI / 2; // Default down
        if (direction === 'up') baseAngle = -Math.PI / 2;
        else if (direction === 'down') baseAngle = Math.PI / 2;
        else if (direction === 'left') baseAngle = Math.PI;
        else if (direction === 'right') baseAngle = 0;
        else if (direction === 'up-left') baseAngle = -3 * Math.PI / 4;
        else if (direction === 'up-right') baseAngle = -Math.PI / 4;
        else if (direction === 'down-left') baseAngle = 3 * Math.PI / 4;
        else if (direction === 'down-right') baseAngle = Math.PI / 4;
        
        const spreadAngle = Math.PI / 10; // 18 degrees spread
        const projectileSpeed = 400;
        const damage = 2;
        const knockbackForce = 1200;
        
        // Create animation if it doesn't exist
        if (!this.anims.exists('storm-projectile')) {
            this.anims.create({
                key: 'storm-projectile',
                frames: this.anims.generateFrameNumbers('storm-spell', { start: 0, end: 16 }),
                frameRate: 30,
                repeat: -1
            });
        }
        
        // Shoot 3 projectiles simultaneously in a fan pattern
        for (let i = 0; i < projectileCount; i++) {
            // Calculate angle for this projectile (-1, 0, 1) * spread
            const angleOffset = (i - 1) * spreadAngle;
            const projectileAngle = baseAngle + angleOffset;
            
            // Create storm projectile
            const storm = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'storm-spell', 0);
            storm.setScale(1.5);
            storm.setDepth(5);
            
            // Try to play animation
            if (this.anims.exists('storm-projectile')) {
                storm.play('storm-projectile');
            }
            
            // Set properties
            storm.element = 'storm';
            storm.damage = damage;
            storm.knockbackForce = knockbackForce;
            storm.isPiercing = true; // Pierce through enemies
            storm.hitEnemies = new Set(); // Track hit enemies to prevent multiple hits
            
            // Add to projectiles group first
            this.projectiles.add(storm);
            
            // Set velocity
            const velocityX = Math.cos(projectileAngle) * projectileSpeed;
            const velocityY = Math.sin(projectileAngle) * projectileSpeed;
            storm.setVelocity(velocityX, velocityY);
            
            // Add electric trail effect
            const trailInterval = this.time.addEvent({
                delay: 50,
                callback: () => {
                    if (storm.active) {
                        // Create electric trail
                        const trail = this.add.circle(storm.x, storm.y, 8, 0x00ffff, 0.6);
                        trail.setDepth(4);
                        this.tweens.add({
                            targets: trail,
                            scale: { from: 1, to: 0 },
                            alpha: { from: 0.6, to: 0 },
                            duration: 300,
                            onComplete: () => trail.destroy()
                        });
                    } else {
                        trailInterval.destroy();
                    }
                },
                repeat: -1
            });
            
            // Store trail for cleanup
            storm.trailInterval = trailInterval;
            
            // Auto-destroy after 2 seconds
            this.time.delayedCall(2000, () => {
                if (storm.active) {
                    if (storm.trailInterval) {
                        storm.trailInterval.destroy();
                    }
                    storm.destroy();
                }
            });
        }
    }

    createDeathSpell() {
        // Death element - creates an area that instantly kills enemies with 25% or less health
        const deathRadius = 200;
        
        // Create death zone visual
        const deathZone = this.add.circle(this.wizard.x, this.wizard.y, deathRadius, 0x000000, 0.2);
        deathZone.setDepth(2);
        deathZone.setStrokeStyle(2, 0x330033, 0.8);
        
        // Add inner death circle
        const innerCircle = this.add.circle(this.wizard.x, this.wizard.y, deathRadius * 0.6, 0x220022, 0.3);
        innerCircle.setDepth(2);
        
        // Create skull particles effect
        const skullParticles = [];
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const x = this.wizard.x + Math.cos(angle) * (deathRadius * 0.8);
            const y = this.wizard.y + Math.sin(angle) * (deathRadius * 0.8);
            
            // Create skull marker
            const skull = this.add.text(x, y, '💀', {
                fontSize: '24px'
            });
            skull.setOrigin(0.5);
            skull.setDepth(3);
            skullParticles.push(skull);
            
            // Floating animation
            this.tweens.add({
                targets: skull,
                y: y - 10,
                alpha: { from: 0.8, to: 0.3 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Dark pulse animation
        this.tweens.add({
            targets: [deathZone, innerCircle],
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: deathZone.alpha },
            duration: 500,
            ease: 'Power2'
        });
        
        // Pulsing effect
        this.tweens.add({
            targets: deathZone,
            scale: { from: 1, to: 1.05 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            delay: 500
        });
        
        // Death effect - check for low health enemies
        const deathCheck = this.time.addEvent({
            delay: 100, // Check every 0.1 seconds
            callback: () => {
                if (!deathZone.active) {
                    deathCheck.destroy();
                    return;
                }
                
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active && !enemy.deathMarked) {
                        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                        if (dist < deathRadius) {
                            // Check if enemy health is 25% or less
                            const maxHealth = enemy.maxHealth || enemy.health;
                            const healthPercent = enemy.health / maxHealth;
                            
                            if (healthPercent <= 0.25) {
                                // Mark for death
                                enemy.deathMarked = true;
                                
                                // Death animation on enemy
                                enemy.setTint(0x000000);
                                
                                // Create death effect at enemy position
                                const deathEffect = this.add.text(enemy.x, enemy.y, '☠️', {
                                    fontSize: '32px'
                                });
                                deathEffect.setOrigin(0.5);
                                deathEffect.setDepth(10);
                                
                                // Animate death effect
                                this.tweens.add({
                                    targets: deathEffect,
                                    y: enemy.y - 40,
                                    scale: { from: 0.5, to: 1.5 },
                                    alpha: { from: 1, to: 0 },
                                    duration: 800,
                                    onComplete: () => deathEffect.destroy()
                                });
                                
                                // Soul extraction effect
                                const soul = this.add.circle(enemy.x, enemy.y, 10, 0x9933ff, 0.8);
                                soul.setDepth(5);
                                
                                this.tweens.add({
                                    targets: soul,
                                    x: this.wizard.x,
                                    y: this.wizard.y,
                                    scale: { from: 1, to: 0 },
                                    duration: 600,
                                    ease: 'Power2',
                                    onComplete: () => {
                                        soul.destroy();
                                        // Kill enemy after soul extraction
                                        if (enemy.active) {
                                            this.killEnemy(enemy);
                                        }
                                    }
                                });
                            } else if (healthPercent <= 0.35) {
                                // Visual warning for enemies close to death threshold
                                if (!enemy.deathWarned) {
                                    enemy.deathWarned = true;
                                    enemy.setTint(0x660066);
                                    this.time.delayedCall(200, () => {
                                        if (enemy.active && !enemy.deathMarked) {
                                            enemy.clearTint();
                                            enemy.deathWarned = false;
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            },
            repeat: 39 // Lasts 4 seconds total (40 checks * 0.1s)
        });
        
        // Fade out and cleanup
        this.time.delayedCall(3500, () => {
            this.tweens.add({
                targets: [deathZone, innerCircle, ...skullParticles],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    deathZone.destroy();
                    innerCircle.destroy();
                    skullParticles.forEach(skull => skull.destroy());
                    deathCheck.destroy();
                }
            });
        });
    }

    createSmokeSpell() {
        // Smoke element - passive ability that grants invisibility every 30 seconds for 5 seconds
        // Check if smoke veil is already active
        if (this.smokeVeilActive) {
            return; // Don't activate if already active
        }
        
        // Check if smoke element is already equipped
        if (this.hasSmokeElement) {
            return; // Already have smoke element passive
        }
        
        // Mark that we have smoke element
        this.hasSmokeElement = true;
        
        // Create passive smoke veil timer
        this.smokeVeilTimer = this.time.addEvent({
            delay: 30000, // Every 30 seconds
            callback: () => {
                this.activateSmokeVeil();
            },
            repeat: -1 // Repeat forever
        });
        
        // Activate smoke veil immediately on first cast
        this.activateSmokeVeil();
        
        // Visual feedback for acquiring smoke element
        const smokeText = this.add.text(this.wizard.x, this.wizard.y - 50, 'Smoke Veil Acquired!', {
            fontSize: '24px',
            color: '#696969',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        smokeText.setOrigin(0.5);
        
        this.tweens.add({
            targets: smokeText,
            y: this.wizard.y - 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => smokeText.destroy()
        });
    }
    
    activateSmokeVeil() {
        // Mark wizard as invisible
        this.smokeVeilActive = true;
        this.wizard.invisible = true;
        
        // Create smoke cloud effect
        const smokeParticles = this.add.particles(this.wizard.x, this.wizard.y, 'particle', {
            scale: { start: 1, end: 2 },
            alpha: { start: 0.6, end: 0 },
            speed: { min: 20, max: 60 },
            lifespan: 1500,
            frequency: 30,
            quantity: 3,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Circle(0, 0, 30)
            },
            tint: 0x696969
        });
        
        // Make wizard semi-transparent
        this.wizard.setAlpha(0.3);
        
        // Add smoke swirl around wizard
        const smokeSwirl = this.add.graphics();
        smokeSwirl.lineStyle(3, 0x696969, 0.5);
        smokeSwirl.setDepth(this.wizard.depth + 1);
        
        // Animated smoke swirl
        const swirlAnim = this.time.addEvent({
            delay: 50,
            callback: () => {
                if (!this.smokeVeilActive) {
                    swirlAnim.destroy();
                    return;
                }
                
                smokeSwirl.clear();
                smokeSwirl.lineStyle(3, 0x696969, 0.5);
                
                const time = this.time.now / 500;
                smokeSwirl.beginPath();
                
                for (let i = 0; i < 360; i += 30) {
                    const angle = (i + time * 50) * Math.PI / 180;
                    const radius = 40 + Math.sin(time + i / 30) * 10;
                    const x = this.wizard.x + Math.cos(angle) * radius;
                    const y = this.wizard.y + Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        smokeSwirl.moveTo(x, y);
                    } else {
                        smokeSwirl.lineTo(x, y);
                    }
                }
                
                smokeSwirl.closePath();
                smokeSwirl.strokePath();
            },
            repeat: -1
        });
        
        // Update particle position to follow wizard
        const particleUpdate = this.time.addEvent({
            delay: 16,
            callback: () => {
                if (smokeParticles.active) {
                    smokeParticles.x = this.wizard.x;
                    smokeParticles.y = this.wizard.y;
                }
            },
            repeat: -1
        });
        
        // Show invisibility timer
        const timerBg = this.add.rectangle(this.wizard.x, this.wizard.y - 60, 100, 20, 0x000000, 0.7);
        timerBg.setStrokeStyle(2, 0x696969);
        const timerBar = this.add.rectangle(this.wizard.x - 48, this.wizard.y - 60, 96, 16, 0x696969);
        timerBar.setOrigin(0, 0.5);
        
        const timerText = this.add.text(this.wizard.x, this.wizard.y - 60, 'INVISIBLE', {
            fontSize: '12px',
            color: '#ffffff'
        });
        timerText.setOrigin(0.5);
        
        // Timer countdown
        this.tweens.add({
            targets: timerBar,
            scaleX: 0,
            duration: 5000,
            ease: 'Linear'
        });
        
        // Update timer position
        const timerUpdate = this.time.addEvent({
            delay: 16,
            callback: () => {
                if (timerBg.active) {
                    timerBg.x = this.wizard.x;
                    timerBg.y = this.wizard.y - 60;
                    timerBar.x = this.wizard.x - 48;
                    timerBar.y = this.wizard.y - 60;
                    timerText.x = this.wizard.x;
                    timerText.y = this.wizard.y - 60;
                }
            },
            repeat: -1
        });
        
        // End invisibility after 5 seconds
        this.time.delayedCall(5000, () => {
            // Remove invisibility
            this.smokeVeilActive = false;
            this.wizard.invisible = false;
            this.wizard.setAlpha(1);
            
            // Clean up effects
            smokeParticles.stop();
            this.time.delayedCall(1500, () => smokeParticles.destroy());
            smokeSwirl.destroy();
            swirlAnim.destroy();
            particleUpdate.destroy();
            timerUpdate.destroy();
            timerBg.destroy();
            timerBar.destroy();
            timerText.destroy();
            
            // Show cooldown timer if we still have smoke element
            if (this.hasSmokeElement) {
                // Find which charge slot has smoke element
                let smokeSlotIndex = -1;
                for (let i = 0; i < this.charges.length; i++) {
                    if (this.charges[i] === 'smoke') {
                        smokeSlotIndex = i;
                        break;
                    }
                }
                
                if (smokeSlotIndex >= 0) {
                    // Position above the smoke charge slot
                    const slotX = 380 + (smokeSlotIndex * 35);
                    const slotY = 35; // Above the charge slot at y:50
                    
                    const cooldownText = this.add.text(slotX, slotY, '30', {
                        fontSize: '12px',
                        color: '#ffffff',
                        stroke: '#000000',
                        strokeThickness: 2,
                        backgroundColor: '#696969',
                        padding: { x: 2, y: 1 }
                    });
                    cooldownText.setOrigin(0.5);
                    cooldownText.setScrollFactor(0);
                    cooldownText.setDepth(62); // Above charge UI
                    
                    // Store reference for position updates
                    this.smokeCooldownText = cooldownText;
                    
                    // Countdown display
                    let cooldown = 30;
                    const cooldownTimer = this.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            cooldown--;
                            if (cooldown > 0) {
                                cooldownText.setText(`${cooldown}`);
                                
                                // Update position if smoke element moved
                                let newSmokeIndex = -1;
                                for (let i = 0; i < this.charges.length; i++) {
                                    if (this.charges[i] === 'smoke') {
                                        newSmokeIndex = i;
                                        break;
                                    }
                                }
                                if (newSmokeIndex >= 0) {
                                    cooldownText.x = 380 + (newSmokeIndex * 35);
                                }
                            } else {
                                cooldownText.destroy();
                                cooldownTimer.destroy();
                                this.smokeCooldownText = null;
                            }
                        },
                        repeat: 29
                    });
                }
            }
        });
    }

    fireIceProjectile() {
        // Ice element - slows enemies
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'element-symbols2', 4);
        projectile.element = 'ice';
        projectile.damage = 1;
        projectile.setDepth(5);
        projectile.slowDuration = 2000; // Slow for 2 seconds

        const speed = 350;
        const angle = Math.random() * Math.PI * 2;
        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        // Add ice trail
        this.tweens.add({
            targets: projectile,
            scale: { from: 1, to: 0.8 },
            duration: 200,
            yoyo: true,
            repeat: -1
        });

        this.projectiles.add(projectile);
    }

    fireMeteorProjectile(elementTier = 1) {
        // Apply tier damage scaling
        const tierDamageScale = this.tierScaling.damage[elementTier - 1] || 1.0;
        
        // Meteor element - creates several meteors falling from the sky in a wide area
        const meteorCount = 5; // Number of meteors
        const areaRadius = 400; // Wide area coverage
        const damage = 24 * tierDamageScale; // Doubled damage with tier scaling
        const explosionRadius = 100; // Explosion radius
        
        // Create meteors at random positions around the wizard
        for (let i = 0; i < meteorCount; i++) {
            // Random angle and distance from wizard
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * areaRadius;
            
            // Calculate target position
            const targetX = this.wizard.x + Math.cos(angle) * distance;
            const targetY = this.wizard.y + Math.sin(angle) * distance;
            
            // Create meteor high above target position
            const startY = targetY - 500; // Start higher for more dramatic effect
            const meteor = this.physics.add.sprite(targetX, startY, 'meteor-spell');
            meteor.setScale(2); // Original size
            meteor.setDepth(5);
            
            // Play meteor animation
            if (this.anims.exists('meteor-spell-anim')) {
                meteor.play('meteor-spell-anim');
            }
            
            // Create shadow at target position
            const shadow = this.add.ellipse(targetX, targetY, 30, 20, 0x000000, 0.3);
            shadow.setDepth(1);
            meteor.shadow = shadow; // Store reference for cleanup
            
            // More varied staggering - some meteors fall much later
            const delay = i * 200 + Math.random() * 300; // Base delay + random additional delay
            
            // Fall animation - simplified without rotation
            this.tweens.add({
                targets: meteor,
                y: targetY,
                duration: 1000 + Math.random() * 200, // Slightly varied fall speeds
                delay: delay,
                ease: 'Power2',
                onUpdate: () => {
                    // Update shadow size based on meteor height
                    if (meteor.shadow && meteor.active) {
                        const progress = (meteor.y - startY) / (targetY - startY);
                        const shadowScale = 0.2 + (progress * 0.8); // Shadow grows as meteor falls
                        meteor.shadow.setScale(shadowScale);
                    }
                },
                onComplete: () => {
                    
                    // Damage all enemies in explosion area
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active) {
                            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, targetX, targetY);
                            if (dist < explosionRadius) {
                                // Apply damage
                                enemy.health -= damage;
                                
                                // Stronger knockback effect
                                const knockbackAngle = Math.atan2(enemy.y - targetY, enemy.x - targetX);
                                const knockbackForce = 350 * (1 - dist / explosionRadius); // Increased force
                                enemy.body.setVelocity(
                                    Math.cos(knockbackAngle) * knockbackForce,
                                    Math.sin(knockbackAngle) * knockbackForce
                                );
                                
                                // Visual feedback
                                enemy.setTint(0xff6600);
                                this.time.delayedCall(200, () => {
                                    if (enemy.active) enemy.clearTint();
                                });
                                
                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                }
                            }
                        }
                    });
                    
                    meteor.destroy();
                    // Remove shadow when meteor impacts
                    if (meteor.shadow) {
                        meteor.shadow.destroy();
                    }
                }
            });
        }
    }

    createMudPuddle() {
        // Mud element - creates slowing area
        const puddle = this.add.ellipse(this.wizard.x, this.wizard.y, 100, 60, 0x664422, 0.7);
        puddle.setDepth(1);

        // Store for collision checking
        if (!this.mudPuddles) this.mudPuddles = [];
        puddle.startTime = this.time.now;
        this.mudPuddles.push(puddle);

        // Remove after 5 seconds
        this.time.delayedCall(5000, () => {
            puddle.destroy();
            const index = this.mudPuddles.indexOf(puddle);
            if (index > -1) this.mudPuddles.splice(index, 1);
        });

        // Check for enemies in mud
        this.time.addEvent({
            delay: 100,
            callback: () => {
                if (puddle.active) {
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active) {
                            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, puddle.x, puddle.y);
                            if (dist < 50) {
                                // Slow enemy
                                enemy.setVelocity(
                                    enemy.body.velocity.x * 0.3,
                                    enemy.body.velocity.y * 0.3
                                );
                                enemy.setTint(0x664422);

                                // Clear tint when out of mud
                                this.time.delayedCall(200, () => {
                                    if (enemy.active && dist > 50) enemy.clearTint();
                                });
                            }
                        }
                    });
                }
            },
            repeat: 49
        });
    }

    fireStormBolt() {
        // Storm element - instant strike on random enemy
        const activeEnemies = this.enemies.children.entries.filter(e => e.active);
        if (activeEnemies.length > 0) {
            const target = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];

            // Lightning strike effect
            const strike = this.add.rectangle(target.x, target.y - 150, 4, 300, 0xffff00);
            strike.setOrigin(0.5, 0);
            strike.setDepth(10);
            strike.setAlpha(0.9);

            // Flash animation
            this.tweens.add({
                targets: strike,
                scaleX: { from: 1, to: 3 },
                alpha: { from: 0.9, to: 0 },
                duration: 200,
                onComplete: () => strike.destroy()
            });

            // Storm sound effect visual
            const flash = this.add.rectangle(400, 300, 800, 600, 0xffffff, 0.3);
            flash.setScrollFactor(0);
            flash.setDepth(100);
            this.tweens.add({
                targets: flash,
                alpha: 0,
                duration: 100,
                onComplete: () => flash.destroy()
            });

            // Damage target
            target.health -= 5;
            if (target.health <= 0) {
                this.killEnemy(target);
            } else {
                target.setTint(0xffff00);
                this.time.delayedCall(200, () => {
                    if (target.active) target.clearTint();
                });
            }
        }
    }

    fireCrystalProjectile() {
        // Crystal element - creates solid impassable crystal that explodes after 2 seconds
        const crystalX = this.wizard.x;
        const crystalY = this.wizard.y;

        // Create crystal sprite
        const crystal = this.physics.add.staticSprite(crystalX, crystalY, 'element-symbols2', 8);
        crystal.setScale(0.3);
        crystal.setDepth(5);
        crystal.setTint(0xffaaff);

        // Make it impassable by setting up collision
        crystal.body.setSize(60, 60); // Collision area

        // Add collision with wizard and enemies
        this.physics.add.collider(this.wizard, crystal);
        this.physics.add.collider(this.enemies, crystal);
        this.physics.add.collider(this.projectiles, crystal);

        // Sparkle effect
        this.tweens.add({
            targets: crystal,
            alpha: { from: 1, to: 0.7 },
            duration: 200,
            yoyo: true,
            repeat: -1
        });

        // Store crystal for cleanup
        if (!this.crystals) this.crystals = [];
        this.crystals.push(crystal);

        // Shatter after 2 seconds
        this.time.delayedCall(2000, () => {
            if (crystal.active) {
                // Create explosion effect
                const explosion = this.add.circle(crystalX, crystalY, 80, 0xffaaff, 0.8);
                explosion.setDepth(6);

                this.tweens.add({
                    targets: explosion,
                    scale: { from: 0.5, to: 2 },
                    alpha: { from: 0.8, to: 0 },
                    duration: 500,
                    onComplete: () => explosion.destroy()
                });

                // Damage all enemies in explosion radius
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, crystalX, crystalY);
                        if (distance < 100) {
                            enemy.health -= 4;
                            enemy.setTint(0xffaaff);
                            this.time.delayedCall(200, () => {
                                if (enemy.active) enemy.clearTint();
                            });

                            if (enemy.health <= 0) {
                                this.killEnemy(enemy);
                            }
                        }
                    }
                });

                // Remove crystal from array
                const index = this.crystals.indexOf(crystal);
                if (index > -1) this.crystals.splice(index, 1);

                // Destroy the crystal
                crystal.destroy();
            }
        });
    }

    fireBasicElementProjectile(element) {
        // Generic projectile for elements without specific implementation
        const config = this.elementConfig[element];
        if (!config) return;

        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, config.sheet, config.frame);
        projectile.element = element;
        projectile.damage = 1;
        projectile.setDepth(5);

        const speed = 300;
        const angle = Math.random() * Math.PI * 2;
        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        this.projectiles.add(projectile);
    }

    spawnEliteEnemy() {
        // Choose enemy type based on current stage
        let types = [];
        if (this.stage === 'lava') {
            types = ['fireslime', 'bat', 'fireworm', 'orangegolem'];
        } else if (this.stage === 'cave') {
            types = ['slime', 'soul', 'bat', 'golem'];
        } else { // forest stage
            types = ['tree', 'mushroom', 'bat', 'bloboid'];
        }
        const eliteType = types[Math.floor(Math.random() * types.length)];

        // Spawn outside viewport
        const camera = this.cameras.main;
        const viewportWidth = camera.width;
        const viewportHeight = camera.height;
        const spawnMargin = 100;

        let x, y;
        const side = Phaser.Math.Between(0, 3);
        switch (side) {
            case 0: // Top
                x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                y = camera.scrollY - spawnMargin;
                break;
            case 1: // Right
                x = camera.scrollX + viewportWidth + spawnMargin;
                y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                break;
            case 2: // Bottom
                x = camera.scrollX + Phaser.Math.Between(0, viewportWidth);
                y = camera.scrollY + viewportHeight + spawnMargin;
                break;
            case 3: // Left
                x = camera.scrollX - spawnMargin;
                y = camera.scrollY + Phaser.Math.Between(0, viewportHeight);
                break;
        }

        // Clamp to world bounds
        x = Phaser.Math.Clamp(x, 100, 3900);
        y = Phaser.Math.Clamp(y, 100, 2060);

        // Create the enemy first using normal spawn method
        this.createEnemy(eliteType, x, y);
        
        // Get the last added enemy (the one we just created)
        const elite = this.enemies.children.entries[this.enemies.children.entries.length - 1];
        
        // Apply elite modifications
        elite.setScale(elite.scaleX * 1.5); // 50% larger
        elite.health = Math.floor(elite.health * 2); // Double health for elites
        elite.maxHealth = elite.health;
        elite.isElite = true;
        elite.noStagger = true; // Cannot be staggered
        elite.setTint(0xff00ff); // Purple tint for elites
        
        // Adjust physics body for the new scale
        const currentWidth = elite.body.width;
        const currentHeight = elite.body.height;
        elite.body.setSize(currentWidth, currentHeight);

        // Elite enemy spawn notification removed
    }

    dropChest(x, y) {
        const chest = this.physics.add.sprite(x, y, 'chest-idle', 0);
        chest.setDepth(25);
        chest.body.setVelocity(0, 0);
        chest.setScale(1.5);
        chest.body.setSize(30, 15);
        
        // Play animation
        chest.play('chest-idle-anim');

        // Floating animation
        this.tweens.add({
            targets: chest,
            y: y - 15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Glow effect
        this.tweens.add({
            targets: chest,
            scale: { from: 1.5, to: 1.7 },
            alpha: { from: 1, to: 0.8 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.chests.add(chest);
    }

    dropItemChest(x, y, itemType, itemData = {}) {
        const chest = this.physics.add.sprite(x, y, 'chest-idle', 0);
        chest.setDepth(25);
        chest.body.setVelocity(0, 0);
        chest.setScale(1.5);
        chest.body.setSize(30, 15);
        
        // Play animation
        chest.play('chest-idle-anim');
        
        // Store the item data on the chest
        chest.itemType = itemType;
        chest.itemData = itemData;

        // Floating animation
        this.tweens.add({
            targets: chest,
            y: y - 15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Different glow effect for item chests - purple tint
        this.tweens.add({
            targets: chest,
            scale: { from: 1.5, to: 1.7 },
            alpha: { from: 1, to: 0.8 },
            tint: { from: 0xffffff, to: 0xff88ff },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.chests.add(chest);
    }

    openItemChest(wizard, chest) {
        // Store active tweens for fast-forward
        this.chestAnimTweens = [];
        this.chestAnimTimers = [];
        
        // Create full black background
        const blackBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 1);
        blackBg.setScrollFactor(0);
        blackBg.setDepth(20000);
        
        // Make chest visible above black background
        chest.setDepth(20001);
        
        // Create dramatic fade overlay (for subtle lighting effect)
        const fadeOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
        fadeOverlay.setScrollFactor(0);
        fadeOverlay.setDepth(20002);
        
        // Create spotlight effect on chest
        const spotlight = this.add.graphics();
        spotlight.fillStyle(0xffffff, 0.1);
        spotlight.fillCircle(chest.x, chest.y, 120);
        spotlight.setDepth(20003);
        spotlight.setAlpha(0);
        
        const spotlightTween = this.tweens.add({
            targets: spotlight,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
        this.chestAnimTweens.push(spotlightTween);
        
        // Add skip instruction
        const skipText = this.add.text(400, 550, 'Press SPACE or A to skip', {
            fontSize: '16px',
            color: '#888888',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        skipText.setScrollFactor(0);
        skipText.setDepth(20010);
        skipText.setAlpha(0);
        
        const skipTextTween = this.tweens.add({
            targets: skipText,
            alpha: 1,
            duration: 500,
            delay: 500
        });
        this.chestAnimTweens.push(skipTextTween);
        
        // Create item display above the chest
        const itemDisplay = this.add.container(chest.x, chest.y - 50);
        itemDisplay.setDepth(20004);
        itemDisplay.setAlpha(0);
        
        // Create item icon based on type
        let itemText = '';
        let itemColor = 0xffffff;
        let itemName = '';
        let itemDescription = '';
        
        // Determine what to display based on item type
        switch (chest.itemType) {
            case 'muffin':
                itemColor = 0xff88ff;
                itemName = 'MAGIC MUFFIN';
                itemDescription = 'Restores 30% health';
                // Create and collect the muffin after delay
                this.time.delayedCall(1000, () => {
                    const muffin = this.dropMuffin(chest.x, chest.y - 30);
                    this.time.delayedCall(500, () => {
                        this.collectMuffin(wizard, muffin);
                    });
                });
                break;
                
            case 'element':
                const elementEmojis = {
                    fire: '🔥',
                    water: '💧',
                    earth: '🌍',
                    air: '💨',
                    rock: '🪨',
                    poison: '☠️',
                    ice: '❄️',
                    lightning: '⚡'
                };
                const elementNames = {
                    fire: 'FIRE ELEMENT',
                    water: 'WATER ELEMENT',
                    earth: 'EARTH ELEMENT',
                    air: 'AIR ELEMENT',
                    rock: 'ROCK ELEMENT',
                    poison: 'POISON ELEMENT',
                    ice: 'ICE ELEMENT',
                    lightning: 'LIGHTNING ELEMENT'
                };
                itemText = elementEmojis[chest.itemData.element] || '✨';
                itemColor = 0x44ff44;
                itemName = elementNames[chest.itemData.element] || 'MYSTERY ELEMENT';
                itemDescription = 'New magical power unlocked!';
                // Create and collect the element orb after delay
                this.time.delayedCall(1000, () => {
                    const orb = this.dropElementOrb(chest.x, chest.y - 30, chest.itemData.element);
                    this.time.delayedCall(500, () => {
                        this.collectElementOrb(wizard, orb);
                    });
                });
                break;
                
            case 'chargeExpansion':
                itemText = '⚡+';
                itemColor = 0xffff00;
                itemName = 'CHARGE EXPANSION';
                itemDescription = 'Increases spell capacity!';
                this.time.delayedCall(1000, () => {
                    const expansion = this.dropChargeExpansion(chest.x, chest.y - 30);
                    this.time.delayedCall(500, () => {
                        this.collectChargeExpansion(wizard, expansion);
                    });
                });
                break;
        }
        
        // Show the item icon
        let icon = null;
        
        // Create sprite based on item type
        switch (chest.itemType) {
            case 'muffin':
                icon = this.add.sprite(0, -20, 'muffin');
                icon.setScale(0.5); // Reduced by 75% (25% of original size)
                break;
                
            case 'element':
                const config = this.elementConfig[chest.itemData.element];
                if (config) {
                    if (config.isImage) {
                        icon = this.add.sprite(0, -20, config.sheet);
                    } else {
                        icon = this.add.sprite(0, -20, config.sheet, config.frame);
                    }
                    icon.setScale(0.3); // Element sprites are larger, scale appropriately
                }
                break;
                
            case 'chargeExpansion':
                icon = this.add.sprite(0, -20, 'charge-slot');
                icon.setScale(0.6);
                break;
        }
        
        if (icon) {
            icon.setOrigin(0.5);
            
            // Item name
            const nameText = this.add.text(0, 30, itemName, {
                fontSize: '24px',
                color: `#${itemColor.toString(16).padStart(6, '0')}`,
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            
            // Item description
            const descText = this.add.text(0, 55, itemDescription, {
                fontSize: '16px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            
            itemDisplay.add([icon, nameText, descText]);
            
            // Store initial scale for animation
            const iconInitialScale = icon.scale;
            
            // Dramatic reveal animation
            icon.setScale(0);
            nameText.setScale(0);
            descText.setAlpha(0);
            
            // Setup fast-forward function
            const fastForward = () => {
                // Remove input listeners
                if (this.chestSkipKey) {
                    this.chestSkipKey.off('down');
                    this.chestSkipKey = null;
                }
                this.chestSkipGamepad = false;
                this.chestOpening = false;
                
                // Complete all tweens immediately
                this.chestAnimTweens.forEach(tween => {
                    if (tween && tween.isPlaying()) {
                        tween.complete();
                    }
                });
                
                // Clear all timers
                this.chestAnimTimers.forEach(timer => {
                    if (timer) {
                        timer.remove();
                    }
                });
                
                // Show everything immediately
                itemDisplay.setAlpha(1);
                itemDisplay.y = chest.y - 70;
                icon.setScale(iconInitialScale);
                nameText.setScale(1);
                descText.setAlpha(1);
                skipText.destroy();
                
                // Quick fade out after brief pause
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: [itemDisplay, blackBg, fadeOverlay, spotlight],
                        alpha: 0,
                        duration: 200,
                        onComplete: () => {
                            itemDisplay.destroy();
                            blackBg.destroy();
                            fadeOverlay.destroy();
                            spotlight.destroy();
                            this.physics.resume();
                            this.chestSelectionActive = false;
                            this.chestOpening = false;
                        }
                    });
                });
                
                // Destroy chest
                chest.destroy();
            };
            
            // Setup skip input
            this.chestSkipKey = this.input.keyboard.addKey('SPACE');
            this.chestSkipKey.once('down', fastForward);
            
            // Gamepad skip support
            this.chestSkipGamepad = true;
            
            // Animate item appearing with dramatic effect
            const mainTween = this.tweens.add({
                targets: itemDisplay,
                alpha: 1,
                y: chest.y - 70,
                duration: 400,
                ease: 'Power2',
                onComplete: () => {
                    // Icon burst effect
                    const iconTween = this.tweens.add({
                        targets: icon,
                        scale: iconInitialScale * 1.2,
                        duration: 400,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            const iconTween2 = this.tweens.add({
                                targets: icon,
                                scale: iconInitialScale,
                                duration: 200
                            });
                            this.chestAnimTweens.push(iconTween2);
                        }
                    });
                    this.chestAnimTweens.push(iconTween);
                    
                    // Name appear
                    const nameTimer = this.time.delayedCall(200, () => {
                        const nameTween = this.tweens.add({
                            targets: nameText,
                            scale: 1,
                            duration: 300,
                            ease: 'Back.easeOut'
                        });
                        this.chestAnimTweens.push(nameTween);
                    });
                    this.chestAnimTimers.push(nameTimer);
                    
                    // Description fade in
                    const descTimer = this.time.delayedCall(400, () => {
                        const descTween = this.tweens.add({
                            targets: descText,
                            alpha: 1,
                            duration: 300
                        });
                        this.chestAnimTweens.push(descTween);
                    });
                    this.chestAnimTimers.push(descTimer);
                    
                    // Keep display visible longer
                    const fadeTimer = this.time.delayedCall(2500, () => {
                        skipText.destroy();
                        // Fade out everything
                        const fadeTween = this.tweens.add({
                            targets: [itemDisplay, blackBg, fadeOverlay, spotlight],
                            alpha: 0,
                            duration: 500,
                            onComplete: () => {
                                itemDisplay.destroy();
                                blackBg.destroy();
                                fadeOverlay.destroy();
                                spotlight.destroy();
                                if (this.chestSkipKey) {
                                    this.chestSkipKey.off('down');
                                    this.chestSkipKey = null;
                                }
                                this.chestSkipGamepad = false;
                            }
                        });
                        this.chestAnimTweens.push(fadeTween);
                    });
                    this.chestAnimTimers.push(fadeTimer);
                }
            });
            this.chestAnimTweens.push(mainTween);
        }
        
        // Destroy chest after animation
        const chestTimer = this.time.delayedCall(600, () => {
            chest.destroy();
        });
        this.chestAnimTimers.push(chestTimer);

        // Resume physics after animation completes
        const resumeTimer = this.time.delayedCall(3200, () => {
            this.physics.resume();
            this.chestSelectionActive = false;
            this.chestOpening = false;
            if (this.chestSkipKey) {
                this.chestSkipKey.off('down');
                this.chestSkipKey = null;
            }
        });
        this.chestAnimTimers.push(resumeTimer);
    }

    grantElement(element) {
        // Add element to wizard's available elements if not already present
        if (!this.wizard.elements) {
            this.wizard.elements = [];
        }
        if (!this.wizard.elements.includes(element)) {
            this.wizard.elements.push(element);
        }
    }

    showItemMessage(message, color = 0xffffff) {
        const text = this.add.text(400, 300, message, {
            fontSize: '28px',
            color: `#${color.toString(16).padStart(6, '0')}`,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        text.setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(1000);

        // Floating animation
        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: { from: 1, to: 0 },
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    openChest(wizard, chest) {
        // Prevent opening multiple chests at once
        if (this.chestOpening) {
            return;
        }
        this.chestOpening = true;
        
        // Pause physics immediately
        this.physics.pause();

        // Handle level-up rewards (when chest is null)
        if (!chest) {
            // Show reward selection UI directly for level-ups
            this.showChestRewards(null);
            return;
        }

        // Stop the chest's floating animations
        this.tweens.killTweensOf(chest);
        
        // Play opening animation
        chest.play('chest-open-anim');
        chest.on('animationcomplete', () => {
            // Check if this is an item chest with a specific item
            if (chest.itemType) {
                this.openItemChest(wizard, chest);
                return;
            }

            // For regular chests, show the reward selection UI
            this.showChestRewards(chest);
        });
    }

    showChestRewards(chest) {
        // Store chest selection state
        this.chestSelectionActive = true;
        this.chestCursorIndex = 0;
        this.chestRewardType = null;
        console.log('Opening chest, cursor index set to:', this.chestCursorIndex);

        // Initialize gameStarted if not set (for debugging)
        if (this.gameStarted === undefined) {
            console.log('gameStarted was undefined, setting to true');
            this.gameStarted = true;
        }

        // Create reward selection UI - no background, centered on viewport
        const selectionBg = null; // No background

        // No title text - removed
        const title = null;

        // No control hint - removed  
        const controlHint = null;

        // Create three reward type buttons
        const buttons = [];
        let rewardTypes;

        if (this.initialElementSelection) {
            // For initial game start, directly show element choices
            const primaryElements = ['fire', 'water', 'earth', 'air', 'rock', 'poison'];
            const selectedElements = [];

            // Select 3 random primary elements
            while (selectedElements.length < 3) {
                const elem = primaryElements[Math.floor(Math.random() * primaryElements.length)];
                if (!selectedElements.includes(elem)) {
                    selectedElements.push(elem);
                }
            }

            // Create reward types for direct element selection
            rewardTypes = selectedElements.map((elem, index) => {
                const elementInfo = {
                    fire: { icon: '🔥', color: 0xff4444, desc: 'Burns enemies over time' },
                    water: { icon: '💧', color: 0x4444ff, desc: 'Flows and cleanses' },
                    earth: { icon: '🌍', color: 0x44ff44, desc: 'Solid and defensive' },
                    air: { icon: '💨', color: 0xaaaaff, desc: 'Swift and elusive' },
                    rock: { icon: '🪨', color: 0x888888, desc: 'Stuns and crushes' },
                    poison: { icon: '☠️', color: 0x44ff44, desc: 'Damages over time' }
                };

                return {
                    type: 'element',
                    element: elem,
                    title: elem.toUpperCase(),
                    icon: elementInfo[elem].icon,
                    description: elementInfo[elem].desc,
                    color: elementInfo[elem].color
                };
            });
        } else {
            // Normal level up rewards
            rewardTypes = [
                {
                    type: 'meditate',
                    title: 'MEDITATE',
                    icon: '🧘',
                    iconImage: 'meditate-icon',
                    description: 'Choose random slot upgrade',
                    color: 0x44ff44
                },
                {
                    type: 'element',
                    title: 'PRIMARY ELEMENT',
                    icon: '⚡',
                    iconImage: 'element-select-icon',
                    description: 'Choose from 3 primary elements',
                    color: 0x4444ff
                },
                {
                    type: 'fusion',
                    title: 'FUSION RITUAL',
                    icon: '🔮',
                    iconImage: 'fusion-icon',
                    description: 'Combine 2 elements into a new one',
                    color: 0xff44ff
                }
            ];
        }

        for (let i = 0; i < 3; i++) {
            const xPos = 180 + i * 220;
            const reward = rewardTypes[i];
            const buttonIndex = i; // Capture i in closure

            const button = this.add.container(xPos, 300); // Centered on viewport
            button.setScrollFactor(0);
            button.setDepth(922);

            // Black background for frame
            const bg = this.add.rectangle(0, 0, 200, 280, 0x000000, 0.9);
            bg.setInteractive({ useHandCursor: true });

            // No icon background circle

            // Title at the top (moved higher)
            const name = this.add.text(0, -120, reward.title, {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            name.setOrigin(0.5);

            // Use image if available, otherwise fall back to emoji (centered)
            let iconElement;
            if (reward.iconImage) {
                // Center the image
                iconElement = this.add.image(0, 0, reward.iconImage);
                iconElement.setScale(0.5); // Scale down to fit nicely
            } else {
                iconElement = this.add.text(0, 0, reward.icon, {
                    fontSize: '48px'
                });
                iconElement.setOrigin(0.5);
            }

            // Description at the bottom (moved down)
            const description = this.add.text(0, 100, reward.description, {
                fontSize: '14px',
                color: '#cccccc',
                align: 'center',
                wordWrap: { width: 180 }
            });
            description.setOrigin(0.5);

            button.add([bg, iconElement, name, description]);
            buttons.push({ container: button, type: reward.type, bg: bg, element: reward.element });

            bg.on('pointerdown', () => {
                if (this.initialElementSelection && reward.element) {
                    // For initial element selection, directly select the element
                    this.selectChestElement(reward.element, null, null, null, null, buttons);
                } else {
                    this.selectChestReward(reward.type, chest);
                }
            });

            bg.on('pointerover', () => {
                // Remove frame from previous selection
                if (this.chestUI && this.chestUI.buttons) {
                    this.chestUI.buttons.forEach(btn => btn.bg.setStrokeStyle(0));
                }
                // Update cursor index to match hover
                this.chestCursorIndex = buttonIndex;
                // Add frame to hovered button
                bg.setStrokeStyle(3, 0xffff00);
            });

            bg.on('pointerout', () => {
                // Keep the frame on the current selection
            });
        }

        // Store UI elements for controller handling
        this.chestUI = {
            bg: selectionBg,
            title: title,
            controlHint: controlHint,
            buttons: buttons,
            mainMenu: true,
            chest: chest
        };
        
        // Set initial selection frame on first button only
        if (buttons.length > 0) {
            buttons[0].bg.setStrokeStyle(3, 0xffff00);
        }
    }

    selectChestReward(rewardType, chest) {
        // Clear existing UI completely
        if (this.chestUI) {
            if (this.chestUI.bg) this.chestUI.bg.destroy();
            if (this.chestUI.title) this.chestUI.title.destroy();
            if (this.chestUI.controlHint) this.chestUI.controlHint.destroy();
            if (this.chestUI.buttons) {
                this.chestUI.buttons.forEach(btn => {
                    if (btn.container) btn.container.destroy();
                });
            }
            // Clear the chest UI reference but keep chest selection active
            this.chestUI = null;
        }

        if (rewardType === 'meditate') {
            console.log('Meditate reward selected - showing meditate UI');
            this.showMeditateReward();
            if (chest) chest.destroy();
        } else if (rewardType === 'link') {
            this.showLinkReward();
            if (chest) chest.destroy();
        } else if (rewardType === 'element') {
            this.showElementReward();
            if (chest) chest.destroy();
        } else if (rewardType === 'fusion') {
            this.showFusionReward();
            if (chest) chest.destroy();
        }
    }

    showLinkReward() {
        console.log('showLinkReward called');
        console.log('Current charges:', this.charges);
        console.log('Current linkButtons:', this.linkButtons);
        // Initialize linkButtons if not already done
        if (!this.linkButtons) {
            this.linkButtons = [];
            // Create empty link buttons for all possible positions
            for (let i = 0; i < this.maxCharges - 1; i++) {
                this.linkButtons.push({ linked: false });
            }
        }

        // Check if we can add more links
        const currentLinks = this.linkButtons ? this.linkButtons.filter(l => l.linked).length : 0;
        const maxLinks = Math.max(0, this.maxCharges - 1);

        if (currentLinks >= maxLinks) {
            // All links already active
            const message = this.add.text(400, 300, 'All links already active!', {
                fontSize: '24px',
                color: '#ff6666'
            });
            message.setOrigin(0.5);
            message.setScrollFactor(0);
            message.setDepth(210);

            this.time.delayedCall(2000, () => {
                message.destroy();
                this.closeChestUI();
            });
            return;
        }

        // Add a random link
        const availableLinks = [];
        for (let i = 0; i < this.linkButtons.length && i < this.maxCharges - 1; i++) {
            if (!this.linkButtons[i].linked && i < this.charges.length - 1 && (i + 1) < this.charges.length) {
                availableLinks.push(i);
            }
        }

        if (availableLinks.length > 0) {
            const linkIndex = availableLinks[Math.floor(Math.random() * availableLinks.length)];
            this.linkButtons[linkIndex].linked = true;
            this.earnedLinks++; // Increase earned links count

            // Visual feedback
            const message = this.add.text(400, 300, `Link added between slots ${linkIndex + 1} and ${linkIndex + 2}!`, {
                fontSize: '24px',
                color: '#44ff44',
                fontStyle: 'bold'
            });
            message.setOrigin(0.5);
            message.setScrollFactor(0);
            message.setDepth(210);

            this.time.delayedCall(2000, () => {
                message.destroy();
                this.closeChestUI();
            });

            // Update charge groups
            this.updateChargeGroups();
        } else {
            // No available links
            const message = this.add.text(400, 300, 'No valid link positions available!', {
                fontSize: '24px',
                color: '#ff6666'
            });
            message.setOrigin(0.5);
            message.setScrollFactor(0);
            message.setDepth(210);

            this.time.delayedCall(2000, () => {
                message.destroy();
                this.closeChestUI();
            });
        }
    }

    showMeditateReward() {
        console.log('showMeditateReward called - creating meditate UI');
        console.log('Current charges:', this.charges);
        console.log('Current maxCharges:', this.maxCharges);
        console.log('Current linkButtons:', this.linkButtons);
        // Create UI for slot upgrade selection
        const selectionBg = this.add.rectangle(400, 300, 700, 400, 0x000000, 0.9);
        selectionBg.setScrollFactor(0);
        selectionBg.setDepth(920);

        const title = this.add.text(400, 150, 'SELECT SLOT UPGRADE', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(921);

        // Add control hint
        const controlHint = this.add.text(400, 480, 'Use D-pad/Arrow keys to navigate, A/SPACE to select', {
            fontSize: '14px',
            color: '#aaaaaa'
        });
        controlHint.setOrigin(0.5);
        controlHint.setScrollFactor(0);
        controlHint.setDepth(921);

        // Create three upgrade type buttons
        const upgradeTypes = [
            {
                type: 'link',
                title: 'LINK SLOT',
                description: 'Add connection between slots',
                color: 0x44ff44
            },
            {
                type: 'damage',
                title: 'DAMAGE BOOST',
                description: 'Increase spell damage +25%',
                color: 0xff4444
            },
            {
                type: 'speed',
                title: 'SPEED BOOST',
                description: 'Increase spell speed +25%',
                color: 0x4444ff
            }
        ];

        const buttons = [];
        for (let i = 0; i < 3; i++) {
            const xPos = 180 + i * 220;
            const upgrade = upgradeTypes[i];

            const button = this.add.container(xPos, 300);
            button.setScrollFactor(0);
            button.setDepth(922);

            // Black background
            const bg = this.add.rectangle(0, 0, 200, 280, 0x000000, 0.9);
            bg.setInteractive({ useHandCursor: true });

            // Title at the top
            const name = this.add.text(0, -120, upgrade.title, {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            name.setOrigin(0.5);

            // Icon representation
            const iconText = this.add.text(0, 0, upgrade.type === 'link' ? '🔗' : upgrade.type === 'damage' ? '⚔️' : '💨', {
                fontSize: '48px'
            });
            iconText.setOrigin(0.5);

            // Description at the bottom
            const description = this.add.text(0, 80, upgrade.description, {
                fontSize: '14px',
                color: '#cccccc',
                align: 'center',
                wordWrap: { width: 180 }
            });
            description.setOrigin(0.5);

            button.add([bg, name, iconText, description]);
            buttons.push({ container: button, upgrade: upgrade, bg: bg });

            bg.on('pointerdown', () => {
                this.selectSlotUpgrade(upgrade.type);
            });
        }

        // Store UI elements
        this.meditateUI = {
            bg: selectionBg,
            title: title,
            controlHint: controlHint,
            buttons: buttons
        };

        // Initialize controller support
        this.meditateCursorIndex = 0;
        this.meditateSelectionActive = true;
        
        // Initialize previous button states to TRUE to prevent immediate input
        this.prevMeditateLeftPressed = true;
        this.prevMeditateRightPressed = true;
        this.prevMeditateConfirmPressed = true;

        // Reset input states after a short delay to prevent immediate selection
        this.time.delayedCall(200, () => {
            this.prevMeditateLeftPressed = false;
            this.prevMeditateRightPressed = false;
            this.prevMeditateConfirmPressed = false;
        });

        // Set initial selection highlight
        this.updateMeditateHighlight();
    }

    updateMeditateHighlight() {
        if (!this.meditateUI || !this.meditateUI.buttons) return;

        // Update visual highlight for selected upgrade
        this.meditateUI.buttons.forEach((btn, index) => {
            if (index === this.meditateCursorIndex) {
                btn.bg.setStrokeStyle(3, 0xffff00); // Yellow highlight
                btn.bg.setScale(1.05);
            } else {
                btn.bg.setStrokeStyle(2, 0xffffff); // White border
                btn.bg.setScale(1);
            }
        });
    }

    handleMeditateController() {
        if (!this.meditateSelectionActive || !this.meditateUI) return;

        // Input detection - same pattern as chest controller
        const leftPressed = this.cursors.left.isDown ||
            (this.gamepad && ((this.gamepad.leftStick.x < -0.5) || (this.gamepad.buttons[14] && this.gamepad.buttons[14].pressed)));
        const rightPressed = this.cursors.right.isDown ||
            (this.gamepad && ((this.gamepad.leftStick.x > 0.5) || (this.gamepad.buttons[15] && this.gamepad.buttons[15].pressed)));
        const confirmPressed = this.spaceKey.isDown ||
            (this.gamepad && this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed);

        // Handle navigation (edge detection for single presses)
        if (leftPressed && !this.prevMeditateLeftPressed) {
            this.meditateCursorIndex = Math.max(0, this.meditateCursorIndex - 1);
            this.updateMeditateHighlight();
        } else if (rightPressed && !this.prevMeditateRightPressed) {
            this.meditateCursorIndex = Math.min(this.meditateUI.buttons.length - 1, this.meditateCursorIndex + 1);
            this.updateMeditateHighlight();
        }

        // Handle selection
        if (confirmPressed && !this.prevMeditateConfirmPressed) {
            const selectedUpgrade = this.meditateUI.buttons[this.meditateCursorIndex].upgrade;
            this.selectSlotUpgrade(selectedUpgrade.type);
        }

        // Store button states for next frame
        this.prevMeditateLeftPressed = leftPressed;
        this.prevMeditateRightPressed = rightPressed;
        this.prevMeditateConfirmPressed = confirmPressed;
    }

    selectSlotUpgrade(upgradeType) {
        // Clean up meditate UI
        if (this.meditateUI) {
            this.meditateUI.bg.destroy();
            this.meditateUI.title.destroy();
            this.meditateUI.controlHint.destroy();
            this.meditateUI.buttons.forEach(btn => btn.container.destroy());
            this.meditateUI = null;
        }

        // Clean up controller state
        this.meditateSelectionActive = false;
        this.meditateCursorIndex = 0;

        if (upgradeType === 'link') {
            console.log('Link upgrade selected from meditate menu');
            // Add a random link (existing functionality)
            this.showLinkReward();
        } else {
            // For damage/speed upgrades, select a random slot to upgrade
            // Initialize slot buffs if needed
            while (this.slotBuffs.length < this.maxCharges) {
                this.slotBuffs.push({ damageMultiplier: 1, speedMultiplier: 1 });
            }

            // Choose a random slot to upgrade (any slot, empty or occupied)
            const slotIndex = Math.floor(Math.random() * this.maxCharges);
            
            if (upgradeType === 'damage') {
                this.slotBuffs[slotIndex].damageMultiplier += 0.25; // +25% damage
                const message = this.add.text(400, 300, `Slot ${slotIndex + 1} damage increased by 25%!`, {
                    fontSize: '24px',
                    color: '#ff4444',
                    fontStyle: 'bold'
                });
                message.setOrigin(0.5);
                message.setScrollFactor(0);
                message.setDepth(210);

                this.time.delayedCall(2000, () => {
                    message.destroy();
                    this.closeChestUI();
                });
            } else if (upgradeType === 'speed') {
                this.slotBuffs[slotIndex].speedMultiplier += 0.25; // +25% speed
                const message = this.add.text(400, 300, `Slot ${slotIndex + 1} speed increased by 25%!`, {
                    fontSize: '24px',
                    color: '#4444ff',
                    fontStyle: 'bold'
                });
                message.setOrigin(0.5);
                message.setScrollFactor(0);
                message.setDepth(210);

                this.time.delayedCall(2000, () => {
                    message.destroy();
                    this.closeChestUI();
                });
            }
        }
    }

    showElementReward() {
        // Create new UI for element selection - no background
        const selectionBg = null; // No background

        const title = null; // Remove title completely

        // Generate 3 random primary elements
        const choices = [];
        while (choices.length < 3) {
            const element = this.primaryElements[Math.floor(Math.random() * this.primaryElements.length)];
            if (!choices.includes(element)) {
                choices.push(element);
            }
        }

        // Reset controller states to prevent input carry-over
        this.prevChestConfirmPressed = true; // Prevent immediate selection

        this.setupElementSelection(selectionBg, title, choices);
    }

    showFusionReward() {
        // Check if player has at least 2 elements
        if (this.charges.length < 2) {
            const message = this.add.text(400, 300, 'Need at least 2 elements to fuse!', {
                fontSize: '24px',
                color: '#ff6666'
            });
            message.setOrigin(0.5);
            message.setScrollFactor(0);
            message.setDepth(210);

            this.time.delayedCall(2000, () => {
                message.destroy();
                this.closeChestUI();
            });
            return;
        }

        // Create fusion UI
        const fusionBg = this.add.rectangle(400, 300, 700, 450, 0x000000, 0.9);
        fusionBg.setStrokeStyle(3, 0xff44ff);
        fusionBg.setScrollFactor(0);
        fusionBg.setDepth(920);

        const title = this.add.text(400, 100, 'FUSION RITUAL', {
            fontSize: '32px',
            color: '#ff44ff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(921);

        const instruction = this.add.text(400, 140, 'Select two elements to combine', {
            fontSize: '16px',
            color: '#ffffff'
        });
        instruction.setOrigin(0.5);
        instruction.setScrollFactor(0);
        instruction.setDepth(921);

        const controlHint = this.add.text(400, 480, 'Use D-pad/Arrow keys to navigate, A/SPACE to select elements', {
            fontSize: '14px',
            color: '#aaaaaa'
        });
        controlHint.setOrigin(0.5);
        controlHint.setScrollFactor(0);
        controlHint.setDepth(921);

        // Show current elements for selection
        const elementButtons = [];
        const selectedElements = [];

        // Reset controller states to prevent input carry-over
        this.prevChestConfirmPressed = true; // Prevent immediate selection

        for (let i = 0; i < this.charges.length; i++) {
            const element = this.charges[i];
            const config = this.elementConfig[element];
            const xPos = 200 + (i % 4) * 100;
            const yPos = 220 + Math.floor(i / 4) * 100;

            const container = this.add.container(xPos, yPos);
            container.setScrollFactor(0);
            container.setDepth(922);

            const bg = this.add.circle(0, 0, 40, 0x333333);
            // Only show frame on first element initially
            if (i === 0) {
                bg.setStrokeStyle(2, 0xffff00);
            }
            bg.setInteractive();

            const sprite = this.add.sprite(0, 0, config.sheet, config.frame);
            sprite.setScale(0.2);

            const name = this.add.text(0, 50, config.name, {
                fontSize: '12px',
                color: '#ffffff'
            });
            name.setOrigin(0.5);

            container.add([bg, sprite, name]);
            elementButtons.push({ container, element, bg, selected: false, index: i });

            bg.on('pointerdown', () => {
                if (!elementButtons[i].selected && selectedElements.length < 2) {
                    // Select element
                    elementButtons[i].selected = true;
                    selectedElements.push(element);
                    bg.setFillStyle(0xff44ff, 0.5);
                    bg.setStrokeStyle(3, 0xff44ff);

                    if (selectedElements.length === 2) {
                        // Show fusion button
                        this.showFusionButton(fusionBg, title, instruction, elementButtons, selectedElements);
                    }
                } else if (elementButtons[i].selected) {
                    // Deselect element
                    elementButtons[i].selected = false;
                    const index = selectedElements.indexOf(element);
                    if (index > -1) selectedElements.splice(index, 1);
                    bg.setFillStyle(0x333333);
                    bg.setStrokeStyle(0); // Remove stroke instead of white

                    // Remove fusion button if exists
                    if (this.fusionButton) {
                        this.fusionButton.destroy();
                        this.fusionButton = null;
                    }
                }
            });

            bg.on('pointerover', () => {
                if (!elementButtons[i].selected) {
                    bg.setFillStyle(0x555555);
                }
            });

            bg.on('pointerout', () => {
                if (!elementButtons[i].selected) {
                    bg.setFillStyle(0x333333);
                }
            });
        }

        // Store for cleanup (no cancel button)
        this.fusionUI = {
            bg: fusionBg,
            title,
            instruction,
            controlHint,
            buttons: elementButtons,
            active: true,
            cursorIndex: 0,
            selectedElements: []
        };

        console.log('Fusion UI created and active:', this.fusionUI.active);
    }

    showFusionButton(fusionBg, title, instruction, elementButtons, selectedElements) {
        this.fusionButton = this.add.text(400, 380, 'FUSE!', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#ff44ff',
            padding: { x: 30, y: 15 }
        });
        this.fusionButton.setOrigin(0.5);
        this.fusionButton.setScrollFactor(0);
        this.fusionButton.setDepth(923);
        this.fusionButton.setInteractive();

        this.fusionButton.on('pointerdown', () => {
            this.performFusion(selectedElements);
        });

        this.fusionButton.on('pointerover', () => {
            this.fusionButton.setScale(1.1);
        });

        this.fusionButton.on('pointerout', () => {
            this.fusionButton.setScale(1);
        });
    }

    performFusion(elements) {
        // Create fusion cutscene
        const cutsceneBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.95);
        cutsceneBg.setScrollFactor(0);
        cutsceneBg.setDepth(1000);

        // Get element configs
        const element1Config = this.elementConfig[elements[0]];
        const element2Config = this.elementConfig[elements[1]];

        // Create sprites for the two elements
        const sprite1 = this.add.sprite(250, 300, element1Config.sheet, element1Config.frame);
        sprite1.setScale(0.5);
        sprite1.setScrollFactor(0);
        sprite1.setDepth(1001);

        const sprite2 = this.add.sprite(550, 300, element2Config.sheet, element2Config.frame);
        sprite2.setScale(0.5);
        sprite2.setScrollFactor(0);
        sprite2.setDepth(1001);

        // Clean up fusion UI first
        if (this.fusionUI) {
            this.fusionUI.active = false;
            this.fusionUI.bg.destroy();
            this.fusionUI.title.destroy();
            this.fusionUI.instruction.destroy();
            this.fusionUI.controlHint.destroy();
            this.fusionUI.buttons.forEach(btn => btn.container.destroy());
            if (this.fusionButton) this.fusionButton.destroy();
            this.fusionUI = null;
        }

        // Create fusion particles
        const particles = this.add.particles(400, 300, 'spark', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            quantity: 3
        });
        particles.setScrollFactor(0);
        particles.setDepth(1002);

        // Animate sprites moving together
        this.tweens.add({
            targets: sprite1,
            x: 400,
            duration: 1000,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: sprite2,
            x: 400,
            duration: 1000,
            ease: 'Power2'
        });

        // Rotate both sprites
        this.tweens.add({
            targets: [sprite1, sprite2],
            angle: 360,
            duration: 1000,
            ease: 'Linear'
        });

        // Get the indices of the elements being fused
        let elementIndices = [];
        for (let i = 0; i < this.charges.length; i++) {
            if (elements.includes(this.charges[i]) && elementIndices.length < 2) {
                // Find the slot index for this charge
                let slotIndex = -1;
                let chargeCount = 0;
                for (let j = 0; j < this.chargeSlots.length; j++) {
                    if (this.chargeSlots[j] !== null) {
                        if (chargeCount === i) {
                            slotIndex = j;
                            break;
                        }
                        chargeCount++;
                    }
                }
                elementIndices.push(slotIndex);
            }
        }
        
        // Determine fusion result based on element combination
        let result;
        let resultTier = 1;
        let isTierUpgrade = false;
        
        // Check if both elements are the same type
        if (elements[0] === elements[1]) {
            // Same element fusion - tier upgrade!
            result = elements[0];
            isTierUpgrade = true;
            
            // Get current tiers of both elements
            const tier1 = this.elementTiers.get(`${elements[0]}_${elementIndices[0]}`) || 1;
            const tier2 = this.elementTiers.get(`${elements[1]}_${elementIndices[1]}`) || 1;
            
            // Result tier is the sum of both tiers, capped at 5
            resultTier = Math.min(tier1 + tier2, 5);
            
            console.log(`Fusing ${elements[0]} tier ${tier1} + ${elements[1]} tier ${tier2} = ${result} tier ${resultTier}`);
        }
        // Special case: Time element with any other element produces Death
        else if (elements.includes('time')) {
            // If one element is time and the other is not time, result is death
            const otherElement = elements.find(e => e !== 'time');
            if (otherElement) {
                result = 'death';
                // Continue with normal fusion flow
            }
        }
        
        // If result wasn't set by special case, determine it normally
        if (!result) {
            // Sort elements to make order-independent
            const sortedElements = [...elements].sort();
            const fusionKey = sortedElements.join('+');
        
        // Define fusion recipes
        const fusionRecipes = {
            'earth+fire': 'volcano',
            'fire+water': 'steam',
            'earth+water': 'nature',
            'air+earth': 'sand',
            'air+water': 'ice',
            'fire+lightning': 'meteor',
            'air+fire': 'smoke',
            'lightning+water': 'storm',
            'fire+sand': 'crystal',
            'earth+ice': 'crystal',
            'arcane+fire': 'lava',
            'ice+poison': 'death',
            'moon+sun': 'time',
            'arcane+poison': 'dust',
            'earth+lightning': 'gravity',
            'fire+star': 'sun',
            'lightning+poison': 'wave',
            'gravity+lightning': 'star',
            'star+water': 'moon',
            'arcane+nature': 'life'
        };
        
            // Check if we have a recipe for this combination
            if (fusionRecipes[fusionKey]) {
                result = fusionRecipes[fusionKey];
            } else {
                // Random result for undefined combinations
                const nonPrimaryElements = Object.keys(this.elementConfig).filter(e => !this.primaryElements.includes(e));
                result = nonPrimaryElements[Math.floor(Math.random() * nonPrimaryElements.length)];
            }
        }
        
        const resultConfig = this.elementConfig[result];

        // Show "Fusing..." text during animation (without revealing result yet)
        const fusingText = this.add.text(400, 200, 'Fusing...', {
            fontSize: '24px',
            color: '#ffdd44',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        fusingText.setOrigin(0.5);
        fusingText.setScrollFactor(0);
        fusingText.setDepth(1001);
        fusingText.setAlpha(0);

        this.tweens.add({
            targets: fusingText,
            alpha: 1,
            duration: 500
        });

        // After 1 second, flash and show result
        this.time.delayedCall(1000, () => {
            // Flash effect
            const flash = this.add.rectangle(400, 300, 800, 600, 0xffffff, 0.8);
            flash.setScrollFactor(0);
            flash.setDepth(1003);

            this.tweens.add({
                targets: flash,
                alpha: 0,
                duration: 500,
                onComplete: () => flash.destroy()
            });

            // Hide original sprites and fusing text
            sprite1.setVisible(false);
            sprite2.setVisible(false);
            fusingText.destroy();

            // Show result sprite
            const resultSprite = this.add.sprite(400, 250, resultConfig.sheet, resultConfig.frame);
            resultSprite.setScale(0);
            resultSprite.setScrollFactor(0);
            resultSprite.setDepth(1001);

            // Scale up result
            this.tweens.add({
                targets: resultSprite,
                scale: 0.8,
                duration: 800,
                ease: 'Back.easeOut'
            });

            // Create the element name text with tier if applicable
            let elementName = resultConfig.name.toUpperCase();
            if (isTierUpgrade && resultTier > 1) {
                elementName = `${resultConfig.name.toUpperCase()} ${resultTier}`;
            }
            
            // Big dramatic name reveal
            const nameText = this.add.text(400, 380, elementName, {
                fontSize: '48px',
                color: resultConfig.color || '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            });
            nameText.setOrigin(0.5);
            nameText.setScrollFactor(0);
            nameText.setDepth(1002);
            nameText.setScale(0.1);
            nameText.setAlpha(0);

            // Animate name appearance with dramatic effect
            this.tweens.add({
                targets: nameText,
                scale: 1,
                alpha: 1,
                duration: 600,
                delay: 200,
                ease: 'Back.easeOut'
            });

            // Add glow effect to name
            this.tweens.add({
                targets: nameText,
                alpha: 0.8,
                duration: 400,
                yoyo: true,
                repeat: 2,
                delay: 800
            });

            // Show success text (smaller, below the name)
            let successMessage = isTierUpgrade ? 'Tier Upgrade!' : 'New Discovery!';
            
            const successText = this.add.text(400, 440, successMessage, {
                fontSize: '20px',
                color: '#ffdd44',
                fontStyle: 'italic',
                stroke: '#000000',
                strokeThickness: 3
            });
            successText.setOrigin(0.5);
            successText.setScrollFactor(0);
            successText.setDepth(1001);
            successText.setAlpha(0);
            
            // Show tier upgrade effects if applicable
            if (isTierUpgrade && resultTier > 1) {
                const bonusText = this.add.text(400, 490, this.getTierBonusDescription(result, resultTier), {
                    fontSize: '16px',
                    color: '#ffdd44',
                    fontStyle: 'italic',
                    stroke: '#000000',
                    strokeThickness: 2
                });
                bonusText.setOrigin(0.5);
                bonusText.setScrollFactor(0);
                bonusText.setDepth(1001);
                bonusText.setAlpha(0);
                
                this.tweens.add({
                    targets: bonusText,
                    alpha: 1,
                    duration: 500,
                    delay: 500
                });
                
                // Destroy bonus text with other elements
                this.time.delayedCall(3000, () => {
                    bonusText.destroy();
                });
            }

            this.tweens.add({
                targets: successText,
                alpha: 1,
                duration: 500,
                delay: 300
            });

            // Stop particles after a bit
            this.time.delayedCall(1500, () => {
                particles.stop();
            });

            // Update game state - remove the fused elements from chargeSlots
            const removedIndices = [];
            elementIndices.forEach((slotIndex, idx) => {
                if (slotIndex !== -1 && this.chargeSlots[slotIndex] === elements[idx]) {
                    // Clear tier info for the removed element
                    this.elementTiers.delete(`${elements[idx]}_${slotIndex}`);
                    // Clear the slot
                    this.chargeSlots[slotIndex] = null;
                    removedIndices.push(slotIndex);
                }
            });
            
            // Place the result in the first removed slot
            let newSlotIndex = removedIndices[0];
            if (newSlotIndex !== undefined && newSlotIndex !== -1) {
                this.chargeSlots[newSlotIndex] = result;
            } else {
                // Fallback: find first empty slot
                for (let i = 0; i < this.chargeSlots.length; i++) {
                    if (this.chargeSlots[i] === null) {
                        newSlotIndex = i;
                        this.chargeSlots[i] = result;
                        break;
                    }
                }
            }
            
            // Rebuild charges array from chargeSlots
            this.charges = [];
            for (let i = 0; i < this.chargeSlots.length; i++) {
                if (this.chargeSlots[i] !== null) {
                    this.charges.push(this.chargeSlots[i]);
                }
            }
            
            // Track the tier of the new element
            if (newSlotIndex !== -1) {
                this.elementTiers.set(`${result}_${newSlotIndex}`, resultTier);
                console.log(`Set tier for ${result} at slot ${newSlotIndex} to ${resultTier}`);
            }
            
            this.updateChargeUI();
            this.updateChargeGroups();

            if (!this.discoveredElements.has(result)) {
                this.discoveredElements.add(result);
            }

            // Clean up after 3 seconds
            this.time.delayedCall(3000, () => {
                sprite1.destroy();
                sprite2.destroy();
                resultSprite.destroy();
                nameText.destroy();
                successText.destroy();
                cutsceneBg.destroy();
                particles.destroy();
                this.closeChestUI();
            });
        });
    }

    setupElementSelection(selectionBg, title, choices) {
        const chargesFull = this.charges.length >= this.maxCharges;
        
        // Initialize pouch if not exists
        if (!this.elementPouch) {
            const savedPouch = localStorage.getItem('elementPouch');
            this.elementPouch = savedPouch ? JSON.parse(savedPouch) : [null, null, null, null];
        }
        
        let controlHint = null;
        
        // Add control hint with updated text for drag and drop
        controlHint = this.add.text(400, 540, 'LEFT/RIGHT to select • TAB/Y to toggle charge selection • Drag elements between slots', {
            fontSize: '12px',
            color: '#aaaaaa'
        });
        controlHint.setOrigin(0.5);
        controlHint.setScrollFactor(0);
        controlHint.setDepth(921);

        // Always show current charges and pouch
        let chargeDisplay = null;
        chargeDisplay = this.add.container(400, 360);
        chargeDisplay.setScrollFactor(0);
        chargeDisplay.setDepth(921);

        const chargeLabel = this.add.text(0, -50, chargesFull ? 'Current elements (select one to replace):' : 'Current elements:', {
            fontSize: '12px',
            color: '#ffaa44'
        });
        chargeLabel.setOrigin(0.5);
        chargeDisplay.add(chargeLabel);
        
        // Add row labels when showing all slots
        if (chargesFull) {
            const activeLabel = this.add.text(-100, -30, 'Active:', {
                fontSize: '10px',
                color: '#888888'
            });
            activeLabel.setOrigin(1, 0.5);
            chargeDisplay.add(activeLabel);
            
            const passiveLabel = this.add.text(-100, 10, 'Passive:', {
                fontSize: '10px',
                color: '#666666'
            });
            passiveLabel.setOrigin(1, 0.5);
            chargeDisplay.add(passiveLabel);
            
            const pouchLabel = this.add.text(-100, 50, 'Pouch:', {
                fontSize: '10px',
                color: '#4a6a4a'
            });
            pouchLabel.setOrigin(1, 0.5);
            chargeDisplay.add(pouchLabel);
        }

        // Show current charges
        const chargeButtons = [];
        // When charges are full, show all 12 slots (8 charge + 4 pouch) to allow replacement selection
        const slotsToShow = chargesFull ? 12 : 4;
        const slotColumns = 4; // Always 4 columns per row
        const slotYBase = chargesFull ? -30 : 0; // Adjust Y position if showing 3 rows
        
        for (let i = 0; i < slotsToShow; i++) {
            const row = Math.floor(i / slotColumns);
            const col = i % slotColumns;
            const xPos = -60 + col * 40;
            const yPos = slotYBase + row * 40; // Space rows 40 pixels apart
            
            // Different colors for different slot types
            let slotColor = 0x333333;
            let strokeColor = 0x666666;
            if (chargesFull) {
                if (i < 4) {
                    // Active slots - brighter
                    slotColor = 0x444444;
                    strokeColor = 0x888888;
                } else if (i < 8) {
                    // Passive slots - darker
                    slotColor = 0x2a2a2a;
                    strokeColor = 0x555555;
                } else {
                    // Pouch slots - green tint
                    slotColor = 0x2a4a2a;
                    strokeColor = 0x4a6a4a;
                }
            }
            
            const slotBg = this.add.circle(xPos, yPos, 18, slotColor, 0.5);
            slotBg.setStrokeStyle(2, strokeColor);
            chargeDisplay.add(slotBg);
            
            // Check chargeSlots array for element at this position
            let charge = null;
            if (i < 8) {
                // Charge slots
                charge = this.chargeSlots ? this.chargeSlots[i] : (i < this.charges.length ? this.charges[i] : null);
            } else {
                // Pouch slots (indices 8-11)
                charge = this.elementPouch ? this.elementPouch[i - 8] : null;
            }
            if (charge) {
                const chargeConfig = this.elementConfig[charge];
                const chargeSprite = this.add.sprite(xPos, yPos, chargeConfig.sheet, chargeConfig.frame);
                chargeSprite.setScale(0.15);
                chargeSprite.setInteractive({ draggable: true });
                chargeSprite.elementType = charge;
                chargeSprite.slotType = 'charge';
                chargeSprite.slotIndex = i;

                // Add selection ring
                const selectionRing = this.add.graphics();
                selectionRing.lineStyle(3, 0xff0000, 1);
                selectionRing.strokeCircle(xPos, yPos, 25);
                selectionRing.setVisible(false);
                chargeDisplay.add(selectionRing);

                this.setupElementDragDrop(chargeSprite, chargeDisplay, xPos, yPos);
                
                chargeSprite.on('pointerover', () => {
                    if (!this.draggedElement) {
                        chargeSprite.setScale(0.2);
                        chargeSprite.setTint(0xffaaaa);
                    }
                });

                chargeSprite.on('pointerout', () => {
                    if (!this.draggedElement && this.selectedChargeToReplace !== i) {
                        chargeSprite.setScale(0.15);
                        chargeSprite.clearTint();
                    }
                });

                chargeSprite.on('pointerdown', () => {
                    if (!this.draggedElement && chargesFull) {
                        this.selectedChargeToReplace = i;
                        chargeButtons.forEach((btn, idx) => {
                            const ring = this.chestSelectionRings[idx];
                            if (idx === i) {
                                btn.sprite.setScale(0.2);
                                btn.sprite.setTint(0xff0000);
                                if (ring) ring.setVisible(true);
                            } else {
                                btn.sprite.setScale(0.15);
                                btn.sprite.clearTint();
                                if (ring) ring.setVisible(false);
                            }
                        });
                    }
                });

                chargeButtons.push({ sprite: chargeSprite, slotBg: slotBg });
                chargeDisplay.add(chargeSprite);
            } else {
                // Add empty slot placeholder for controller navigation
                chargeButtons.push({ sprite: null, slotBg: slotBg });
            }
        }

        // Add pouch label - only show if not showing all slots
        if (!chargesFull) {
            const pouchLabel = this.add.text(0, 50, 'Inventory Pouch:', {
                fontSize: '12px',
                color: '#88cc88'
            });
            pouchLabel.setOrigin(0.5);
            chargeDisplay.add(pouchLabel);

            // Show pouch slots separately only when not showing all slots
            const pouchButtons = [];
            for (let i = 0; i < 4; i++) {
                const xPos = -60 + i * 40;
                const yPos = 80;
            const slotBg = this.add.circle(xPos, yPos, 18, 0x2a4a2a, 0.5);
            slotBg.setStrokeStyle(2, 0x4a6a4a);
            chargeDisplay.add(slotBg);
            
            if (this.elementPouch[i]) {
                const element = this.elementPouch[i];
                const elementConfig = this.elementConfig[element];
                const pouchSprite = this.add.sprite(xPos, yPos, elementConfig.sheet, elementConfig.frame);
                pouchSprite.setScale(0.15);
                pouchSprite.setInteractive({ draggable: true });
                pouchSprite.elementType = element;
                pouchSprite.slotType = 'pouch';
                pouchSprite.slotIndex = i;
                
                this.setupElementDragDrop(pouchSprite, chargeDisplay, xPos, yPos);
                
                pouchSprite.on('pointerover', () => {
                    if (!this.draggedElement) {
                        pouchSprite.setScale(0.2);
                        const descText = this.add.text(400, 440, this.elementDescriptions[element], {
                            fontSize: '12px',
                            color: '#ffffff',
                            align: 'center',
                            wordWrap: { width: 300 },
                            backgroundColor: '#000000',
                            padding: { x: 10, y: 5 }
                        });
                        descText.setOrigin(0.5);
                        descText.setScrollFactor(0);
                        descText.setDepth(925);
                        pouchSprite.descText = descText;
                    }
                });
                
                pouchSprite.on('pointerout', () => {
                    if (!this.draggedElement) {
                        pouchSprite.setScale(0.15);
                        if (pouchSprite.descText) {
                            pouchSprite.descText.destroy();
                            pouchSprite.descText = null;
                        }
                    }
                });
                
                pouchButtons.push({ sprite: pouchSprite, slotBg: slotBg });
                chargeDisplay.add(pouchSprite);
            } else {
                // Add empty slot to pouchButtons so it can be a drop target
                pouchButtons.push({ sprite: null, slotBg: slotBg });
            }
            }
            
            this.chestPouchButtons = pouchButtons;
        } else {
            // When showing all slots, pouch buttons are already included in chargeButtons
            this.chestPouchButtons = [];
        }

        this.chestChargeButtons = chargeButtons;
        this.chestSelectionRings = [];
        
        // Collect selection rings
        chargeButtons.forEach((btn, i) => {
            const ringIndex = chargeDisplay.list.indexOf(btn.sprite) + 1;
            if (chargeDisplay.list[ringIndex] && chargeDisplay.list[ringIndex].type === 'Graphics') {
                this.chestSelectionRings.push(chargeDisplay.list[ringIndex]);
            }
        });

        // Create element buttons
        const buttons = [];
        for (let i = 0; i < 3; i++) {
            const xPos = 180 + i * 220;
            const element = choices[i];
            const config = this.elementConfig[element];

            const button = this.add.container(xPos, 300); // Centered on viewport
            button.setScrollFactor(0);
            button.setDepth(922);

            // Black background like level up menu
            const bg = this.add.rectangle(0, 0, 200, 280, 0x000000, 0.9);
            bg.setInteractive();

            // Name at the top
            const name = this.add.text(0, -100, config.name.toUpperCase(), {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            name.setOrigin(0.5);

            // Sprite in the center
            const sprite = this.add.sprite(0, 0, config.sheet, config.frame);
            sprite.setScale(0.5); // Slightly larger for better visibility

            // Description at the bottom
            const description = this.add.text(0, 80, this.elementDescriptions[element], {
                fontSize: '14px',
                color: '#cccccc',
                align: 'center',
                wordWrap: { width: 180 }
            });
            description.setOrigin(0.5);

            button.add([bg, name, sprite, description]);
            buttons.push({ container: button, element: element, bg: bg, type: 'element' });

            bg.on('pointerdown', () => {
                this.selectChestElement(element, config, null, null, null, buttons);
            });

            bg.on('pointerover', () => {
                // Remove frame from all buttons
                if (this.chestUI && this.chestUI.buttons) {
                    this.chestUI.buttons.forEach(btn => btn.bg.setStrokeStyle(0));
                }
                // Update cursor index to match hover
                this.chestCursorIndex = i;
                // Add frame to hovered button
                bg.setStrokeStyle(3, 0xffff00);
            });

            bg.on('pointerout', () => {
                // Keep the frame on the current selection
            });
        }

        // Store UI elements
        this.chestUI = {
            bg: selectionBg,
            title: title,
            controlHint: controlHint,
            buttons: buttons,
            choices: choices,
            chargeDisplay: chargeDisplay,
            chargesFull: chargesFull,
            mainMenu: false
        };

        this.selectedChargeToReplace = -1;
        this.chestChargeSelectMode = false;
        this.chestCursorIndex = 0;
        
        // Set initial selection frame on first button only
        if (buttons.length > 0) {
            buttons[0].bg.setStrokeStyle(3, 0xffff00);
        }
    }
    
    setupElementDragDrop(sprite, container, originalX, originalY) {
        sprite.on('dragstart', (pointer) => {
            this.draggedElement = sprite;
            sprite.setScale(0.25);
            sprite.setDepth(930);
            // Hide description if shown
            if (sprite.descText) {
                sprite.descText.destroy();
                sprite.descText = null;
            }
        });
        
        sprite.on('drag', (pointer, dragX, dragY) => {
            // Convert from world to UI coordinates
            const cam = this.cameras.main;
            const uiX = (pointer.x - cam.scrollX) * cam.zoom + cam.scrollX;
            const uiY = (pointer.y - cam.scrollY) * cam.zoom + cam.scrollY;
            sprite.x = uiX - container.x;
            sprite.y = uiY - container.y;
        });
        
        sprite.on('dragend', (pointer) => {
            // Find drop target
            const dropTarget = this.findDropTarget(pointer, sprite);
            
            if (dropTarget && dropTarget !== sprite) {
                // Perform swap or move
                this.swapElements(sprite, dropTarget);
            } else {
                // Return to original position
                sprite.x = originalX;
                sprite.y = originalY;
            }
            
            sprite.setScale(0.15);
            sprite.setDepth(922);
            this.draggedElement = null;
        });
    }
    
    findDropTarget(pointer, draggedSprite) {
        // Convert pointer to UI coordinates
        const cam = this.cameras.main;
        const uiX = (pointer.x - cam.scrollX) * cam.zoom + cam.scrollX;
        const uiY = (pointer.y - cam.scrollY) * cam.zoom + cam.scrollY;
        
        // Check charge slots
        if (this.chestChargeButtons) {
            for (let btn of this.chestChargeButtons) {
                if (btn.sprite && btn.sprite !== draggedSprite) {
                    const bounds = btn.sprite.getBounds();
                    if (bounds.contains(uiX, uiY)) {
                        return btn.sprite;
                    }
                }
                // Check empty slot
                if (!btn.sprite && btn.slotBg) {
                    const bounds = btn.slotBg.getBounds();
                    if (bounds.contains(uiX, uiY)) {
                        btn.slotType = 'charge';
                        btn.slotIndex = this.chestChargeButtons.indexOf(btn);
                        return btn;
                    }
                }
            }
        }
        
        // Check pouch slots
        if (this.chestPouchButtons) {
            for (let btn of this.chestPouchButtons) {
                if (btn.sprite && btn.sprite !== draggedSprite) {
                    const bounds = btn.sprite.getBounds();
                    if (bounds.contains(uiX, uiY)) {
                        return btn.sprite;
                    }
                }
                // Check empty slot
                if (!btn.sprite && btn.slotBg) {
                    const bounds = btn.slotBg.getBounds();
                    if (bounds.contains(uiX, uiY)) {
                        btn.slotType = 'pouch';
                        btn.slotIndex = this.chestPouchButtons.indexOf(btn);
                        return btn;
                    }
                }
            }
        }
        
        return null;
    }
    
    swapElements(source, target) {
        const sourceElement = source.elementType;
        const sourceSlotType = source.slotType;
        const sourceSlotIndex = source.slotIndex;
        
        // Initialize chargeSlots if needed
        if (!this.chargeSlots) {
            this.chargeSlots = new Array(8).fill(null);
            // Fill from charges array
            this.charges.forEach((charge, i) => {
                if (i < 8) this.chargeSlots[i] = charge;
            });
        }
        
        if (target.elementType) {
            // Swap with existing element
            const targetElement = target.elementType;
            const targetSlotType = target.slotType;
            const targetSlotIndex = target.slotIndex;
            
            // Update arrays based on slot types
            if (sourceSlotType === 'charge' && targetSlotType === 'charge') {
                // Swapping between charge slots
                const temp = this.chargeSlots[sourceSlotIndex];
                this.chargeSlots[sourceSlotIndex] = this.chargeSlots[targetSlotIndex];
                this.chargeSlots[targetSlotIndex] = temp;
            } else if (sourceSlotType === 'charge' && targetSlotType === 'pouch') {
                // Moving from charge to pouch
                this.chargeSlots[sourceSlotIndex] = targetElement;
                this.elementPouch[targetSlotIndex] = sourceElement;
            } else if (sourceSlotType === 'pouch' && targetSlotType === 'charge') {
                // Moving from pouch to charge
                this.elementPouch[sourceSlotIndex] = targetElement;
                this.chargeSlots[targetSlotIndex] = sourceElement;
            } else if (sourceSlotType === 'pouch' && targetSlotType === 'pouch') {
                // Swapping between pouch slots
                const temp = this.elementPouch[sourceSlotIndex];
                this.elementPouch[sourceSlotIndex] = this.elementPouch[targetSlotIndex];
                this.elementPouch[targetSlotIndex] = temp;
            }
        } else {
            // Move to empty slot
            const targetSlotType = target.slotType;
            const targetSlotIndex = target.slotIndex;
            
            if (sourceSlotType === 'charge' && targetSlotType === 'charge') {
                // Moving within charge slots
                const element = this.chargeSlots[sourceSlotIndex];
                this.chargeSlots[sourceSlotIndex] = null;
                this.chargeSlots[targetSlotIndex] = element;
            } else if (sourceSlotType === 'charge' && targetSlotType === 'pouch') {
                // Moving from charge to empty pouch slot
                this.elementPouch[targetSlotIndex] = this.chargeSlots[sourceSlotIndex];
                this.chargeSlots[sourceSlotIndex] = null;
            } else if (sourceSlotType === 'pouch' && targetSlotType === 'charge') {
                // Moving from pouch to empty charge slot
                this.chargeSlots[targetSlotIndex] = this.elementPouch[sourceSlotIndex];
                this.elementPouch[sourceSlotIndex] = null;
            } else if (sourceSlotType === 'pouch' && targetSlotType === 'pouch') {
                // Moving within pouch slots
                this.elementPouch[targetSlotIndex] = this.elementPouch[sourceSlotIndex];
                this.elementPouch[sourceSlotIndex] = null;
            }
        }
        
        // Rebuild charges array from first 4 chargeSlots
        this.charges = [];
        for (let i = 0; i < 4 && i < this.chargeSlots.length; i++) {
            if (this.chargeSlots[i] !== null) {
                this.charges.push(this.chargeSlots[i]);
            }
        }
        
        // Save pouch state
        localStorage.setItem('elementPouch', JSON.stringify(this.elementPouch));
        
        // Update UI
        this.updateChargeUI();
        
        // Refresh the element selection display
        if (this.chestUI && this.chestUI.chargeDisplay) {
            this.chestUI.chargeDisplay.destroy();
            // Recreate the display by calling setupElementSelection again
            const { bg, title, choices } = this.chestUI;
            this.setupElementSelection(bg, title, choices);
        }
    }

    closeChestUI() {
        // Reset charge indicators highlighting
        if (this.chargeIndicators) {
            this.chargeIndicators.forEach((indicator) => {
                indicator.bg.setStrokeStyle(2, 0x666666);
                indicator.sprite.setScale(0.1);
            });
        }
        if (this.extraChargeIndicators) {
            this.extraChargeIndicators.forEach((indicator) => {
                indicator.bg.setStrokeStyle(2, 0x4a6a4a);
                indicator.sprite.setScale(0.1);
            });
        }

        // Hide extra charge slots if they were shown
        this.hideExtraChargeSlots();

        this.chestSelectionActive = false;
        this.chestUI = null;
        this.chestChargeSelectMode = false;
        this.selectedChargeToReplace = -1;
        this.physics.resume();
        this.chestOpening = false;
    }

    selectChestElement(element, config, selectionBg, title, controlHint, buttons) {
        // Make sure we have config
        if (!config) {
            config = this.elementConfig[element];
        }

        // Check if we need to replace a charge (check all 12 slots - 8 charge + 4 pouch)
        const totalSlotsUsed = (this.chargeSlots ? this.chargeSlots.filter(c => c !== null).length : 0) + 
                               (this.elementPouch ? this.elementPouch.filter(c => c !== null).length : 0);
        if (totalSlotsUsed >= 12) {
            // Must have selected a charge to replace
            if (this.selectedChargeToReplace === -1) {
                // Activate charge selection mode
                this.chestChargeSelectMode = true;
                this.selectedChargeToReplace = 0; // Start with first charge selected

                // Show all 12 slots in the main UI
                this.showAllChargeSlots();
                
                // Highlight the first slot
                this.highlightChargeIndicator(0, true);

                // Also highlight in the chest UI if it exists
                if (this.chestChargeButtons && this.chestChargeButtons.length > 0) {
                    this.chestChargeButtons[0].sprite.setScale(0.2);
                    this.chestChargeButtons[0].sprite.setTint(0xffff00);
                    if (this.chestSelectionRings && this.chestSelectionRings[0]) {
                        this.chestSelectionRings[0].setVisible(true);
                    }
                }

                // Update control hint
                if (this.chestUI && this.chestUI.controlHint) {
                    this.chestUI.controlHint.setText('Select a charge to replace with UP/DOWN, press TAB/Y to return');
                }

                return; // Don't proceed without selection
            }

            // Replace the selected charge or pouch element
            console.log(`Replacing slot ${this.selectedChargeToReplace} with element ${element}`);
            
            if (this.selectedChargeToReplace < 8) {
                // Replace in charge slots
                this.chargeSlots[this.selectedChargeToReplace] = element;
                console.log('Updated chargeSlots:', this.chargeSlots);
                
                // Rebuild charges array from first 4 slots
                this.charges = [];
                for (let i = 0; i < 4 && i < this.chargeSlots.length; i++) {
                    if (this.chargeSlots[i] !== null) {
                        this.charges.push(this.chargeSlots[i]);
                    }
                }
            } else {
                // Replace in pouch slots (indices 8-11 map to pouch 0-3)
                const pouchIndex = this.selectedChargeToReplace - 8;
                this.elementPouch[pouchIndex] = element;
                console.log(`Updated pouch slot ${pouchIndex}:`, this.elementPouch);
                localStorage.setItem('elementPouch', JSON.stringify(this.elementPouch));
            }

            // Reset charge indicators highlighting
            if (this.chargeIndicators) {
                this.chargeIndicators.forEach((indicator) => {
                    indicator.bg.setStrokeStyle(2, 0x666666);
                    indicator.sprite.setScale(0.1);
                });
            }
            if (this.extraChargeIndicators) {
                this.extraChargeIndicators.forEach((indicator) => {
                    indicator.bg.setStrokeStyle(2, 0x4a6a4a);
                    indicator.sprite.setScale(0.1);
                });
            }

            // Hide the extra charge slots after selection
            this.hideExtraChargeSlots();
            
            // Update the charge indicators to show the new elements
            this.updateChargeUI();
            this.updateChargeGroups();
            
            // If we replaced a pouch slot, also update the pouch indicators
            if (this.selectedChargeToReplace >= 8) {
                this.updateAllChargeIndicators();
                // Update pause menu pouch display
                if (this.pauseMenu && this.pauseMenu.visible) {
                    this.updatePauseMenuCharges();
                }
            }
            
            // Ensure charge select mode is disabled
            this.chestChargeSelectMode = false;
            
            // Add a delayed call to ensure slots stay hidden
            this.time.delayedCall(100, () => {
                this.hideExtraChargeSlots();
                // Force update of charge UI to ensure proper display
                this.updateChargeUI();
            });

            // Check for new discovery
            if (!this.discoveredElements.has(element)) {
                this.discoveredElements.add(element);

                // Show discovery notification
                const discoveryText = this.add.text(this.wizard.x, this.wizard.y - 50, `${config.name} discovered!`, {
                    fontSize: '20px',
                    color: config.color,
                    fontStyle: 'bold'
                });
                discoveryText.setOrigin(0.5);

                this.tweens.add({
                    targets: discoveryText,
                    y: this.wizard.y - 100,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => discoveryText.destroy()
                });
            }
        } else {
            // Add element to first available slot
            let added = false;
            
            // Try to add to chargeSlots first
            for (let i = 0; i < 8; i++) {
                if (!this.chargeSlots[i]) {
                    this.chargeSlots[i] = element;
                    added = true;
                    break;
                }
            }
            
            // If no charge slot available, try pouch
            if (!added) {
                for (let i = 0; i < 4; i++) {
                    if (!this.elementPouch[i]) {
                        this.elementPouch[i] = element;
                        localStorage.setItem('elementPouch', JSON.stringify(this.elementPouch));
                        added = true;
                        break;
                    }
                }
            }
            
            // Rebuild charges array from first 4 slots
            this.charges = [];
            for (let i = 0; i < 4 && i < this.chargeSlots.length; i++) {
                if (this.chargeSlots[i] !== null) {
                    this.charges.push(this.chargeSlots[i]);
                }
            }
            
            this.updateChargeUI();
            this.updateChargeGroups();

            // Add to discovered elements
            if (!this.discoveredElements.has(element)) {
                this.discoveredElements.add(element);

                // Show discovery notification
                const discoveryText = this.add.text(this.wizard.x, this.wizard.y - 50, `${config.name} discovered!`, {
                    fontSize: '20px',
                    color: config.color,
                    fontStyle: 'bold'
                });
                discoveryText.setOrigin(0.5);

                this.tweens.add({
                    targets: discoveryText,
                    y: this.wizard.y - 100,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => discoveryText.destroy()
                });
            }
        }

        // Clean up UI
        if (selectionBg) selectionBg.destroy();
        if (title) title.destroy();
        if (controlHint) controlHint.destroy();
        buttons.forEach(btn => btn.container.destroy());
        if (this.chestUI && this.chestUI.chargeDisplay) {
            this.chestUI.chargeDisplay.destroy();
        }

        // Clean up charge buttons references
        if (this.chestChargeButtons) {
            this.chestChargeButtons = null;
        }
        if (this.chestSelectionRings) {
            this.chestSelectionRings = null;
        }
        this.selectedChargeToReplace = -1;
        this.chestChargeSelectMode = false;

        // Make sure extra charge slots are hidden
        this.hideExtraChargeSlots();

        // Reset state and resume
        this.chestSelectionActive = false;
        this.chestUI = null;

        // If this was initial element selection, start the game
        if (this.initialElementSelection) {
            this.initialElementSelection = false;
            this.startGame();
        } else {
            this.physics.resume();
            // Hide extra slots when resuming physics
            this.hideExtraChargeSlots();
        }
        this.chestOpening = false;
        
        // Final safeguard to ensure extra slots are hidden and mode is reset
        this.chestChargeSelectMode = false;
        this.selectedChargeToReplace = -1;
        this.time.delayedCall(50, () => {
            this.hideExtraChargeSlots();
        });
    }

    handleChestSelectionController() {
        if (!this.chestUI) return;

        // Check for left/right navigation (including D-pad)
        const leftPressed = this.cursors.left.isDown ||
            (this.gamepad && ((this.gamepad.leftStick.x < -0.5) || (this.gamepad.buttons[14] && this.gamepad.buttons[14].pressed)));
        const rightPressed = this.cursors.right.isDown ||
            (this.gamepad && ((this.gamepad.leftStick.x > 0.5) || (this.gamepad.buttons[15] && this.gamepad.buttons[15].pressed)));
        const upPressed = this.cursors.up.isDown ||
            (this.gamepad && ((this.gamepad.leftStick.y < -0.5) || (this.gamepad.buttons[12] && this.gamepad.buttons[12].pressed)));
        const downPressed = this.cursors.down.isDown ||
            (this.gamepad && ((this.gamepad.leftStick.y > 0.5) || (this.gamepad.buttons[13] && this.gamepad.buttons[13].pressed)));
        const confirmPressed = this.spaceKey.isDown ||
            (this.gamepad && this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed);
        const switchModePressed = (this.gamepad && this.gamepad.buttons[2] && this.gamepad.buttons[2].pressed) || // Y button
            this.tabKey.isDown; // Tab key for keyboard

        // Initialize previous states if not set
        if (!this.prevChestLeftPressed) this.prevChestLeftPressed = false;
        if (!this.prevChestRightPressed) this.prevChestRightPressed = false;
        if (!this.prevChestUpPressed) this.prevChestUpPressed = false;
        if (!this.prevChestDownPressed) this.prevChestDownPressed = false;
        if (!this.prevChestConfirmPressed) this.prevChestConfirmPressed = false;
        if (!this.prevChestSwitchPressed) this.prevChestSwitchPressed = false;
        if (!this.prevChestTabPressed) this.prevChestTabPressed = false;

        // Handle main menu selection for new chest system
        if (this.chestUI && this.chestUI.mainMenu) {
            // Navigate left
            if (leftPressed && !this.prevChestLeftPressed) {
                console.log('Left pressed, current index:', this.chestCursorIndex);
                if (this.chestCursorIndex > 0) {
                    // Remove border from current selection
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(0);
                    this.chestCursorIndex--;
                    // Add border to new selection
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(3, 0xffff00);
                    console.log('Moved LEFT to chest option', this.chestCursorIndex);
                } else {
                    console.log('Already at leftmost option');
                }
            }

            // Navigate right
            if (rightPressed && !this.prevChestRightPressed) {
                console.log('Right pressed, current index:', this.chestCursorIndex);
                if (this.chestCursorIndex < 2) {
                    // Remove border from current selection
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(0);
                    this.chestCursorIndex++;
                    console.log('Incremented cursor to:', this.chestCursorIndex);
                    // Add border to new selection
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(3, 0xffff00);
                    console.log('Updated visual for index:', this.chestCursorIndex);
                } else {
                    console.log('Already at rightmost option');
                }
            }

            // Confirm selection
            if (confirmPressed && !this.prevChestConfirmPressed) {
                console.log('Confirm pressed! Current cursor index:', this.chestCursorIndex);
                console.log('Available buttons:', this.chestUI.buttons.length);
                console.log('Button types:', this.chestUI.buttons.map(b => b.type));

                const selectedReward = this.chestUI.buttons[this.chestCursorIndex];
                console.log('Selected reward object:', selectedReward);

                if (selectedReward && selectedReward.type) {
                    console.log('Selecting reward type:', selectedReward.type);
                    if (this.initialElementSelection && selectedReward.element) {
                        // For initial element selection, directly select the element
                        this.selectChestElement(selectedReward.element, null, this.chestUI.bg, this.chestUI.title, this.chestUI.controlHint, this.chestUI.buttons);
                    } else {
                        this.selectChestReward(selectedReward.type, this.chestUI.chest);
                    }
                } else {
                    console.log('No reward type found for button at index', this.chestCursorIndex);
                }
            }
        } else if (this.chestUI && this.chestUI.chargesFull && switchModePressed && 
            !this.prevChestSwitchPressed && !this.prevChestTabPressed) {
            // Handle element selection sub-menu mode switching
            this.chestChargeSelectMode = !this.chestChargeSelectMode;
            // Update hint text
            if (this.chestChargeSelectMode) {
                this.chestUI.controlHint.setText('Select a charge to replace with UP/DOWN, press TAB/Y to return');
                // Show all 12 slots when entering charge select mode
                this.showAllChargeSlots();
                this.highlightChargeIndicator(this.selectedChargeToReplace, true);
            } else {
                this.chestUI.controlHint.setText('Use LEFT/RIGHT to select element, TAB/Y to select charge to replace');
                // Hide extra slots when exiting charge select mode
                this.hideExtraChargeSlots();
                // Reset highlights
                if (this.chargeIndicators) {
                    this.chargeIndicators.forEach((indicator) => {
                        indicator.bg.setStrokeStyle(2, 0x666666);
                        indicator.sprite.setScale(0.1);
                    });
                }
            }
        }

        if (this.chestChargeSelectMode && this.chestUI && this.chestUI.chargesFull) {
            // Charge selection mode
            if (upPressed && !this.prevChestUpPressed) {
                if (this.selectedChargeToReplace > 0) {
                    // Clear previous selection
                    this.highlightChargeIndicator(this.selectedChargeToReplace, false);
                    if (this.chestChargeButtons && this.chestChargeButtons[this.selectedChargeToReplace] && this.chestChargeButtons[this.selectedChargeToReplace].sprite) {
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.setScale(0.15);
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.clearTint();
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(false);
                        }
                    }
                    this.selectedChargeToReplace--;
                    // Highlight new selection
                    this.highlightChargeIndicator(this.selectedChargeToReplace, true);
                    if (this.chestChargeButtons && this.chestChargeButtons[this.selectedChargeToReplace] && this.chestChargeButtons[this.selectedChargeToReplace].sprite) {
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.setScale(0.2);
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.setTint(0xffff00);
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(true);
                        }
                    }
                }
            }

            if (downPressed && !this.prevChestDownPressed) {
                // When charges are full, allow navigation through all 12 slots (8 charge + 4 pouch)
                const maxSlots = this.charges.length >= this.maxCharges ? 11 : this.charges.length - 1;
                if (this.selectedChargeToReplace < maxSlots) {
                    // Clear previous selection
                    this.highlightChargeIndicator(this.selectedChargeToReplace, false);
                    if (this.chestChargeButtons && this.selectedChargeToReplace >= 0 && this.chestChargeButtons[this.selectedChargeToReplace] && this.chestChargeButtons[this.selectedChargeToReplace].sprite) {
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.setScale(0.15);
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.clearTint();
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(false);
                        }
                    }
                    this.selectedChargeToReplace++;
                    // Highlight new selection
                    this.highlightChargeIndicator(this.selectedChargeToReplace, true);
                    if (this.chestChargeButtons && this.chestChargeButtons[this.selectedChargeToReplace] && this.chestChargeButtons[this.selectedChargeToReplace].sprite) {
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.setScale(0.2);
                        this.chestChargeButtons[this.selectedChargeToReplace].sprite.setTint(0xffff00);
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(true);
                        }
                    }
                }
            }
        } else if (this.chestUI && !this.chestUI.mainMenu) {
            // Element selection mode (only when not in main menu)
            // Navigate left
            if (leftPressed && !this.prevChestLeftPressed) {
                if (this.chestCursorIndex > 0) {
                    // Update border colors
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(3, 0xffffff);
                    this.chestCursorIndex--;
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(3, 0xffff00);
                }
            }

            // Navigate right
            if (rightPressed && !this.prevChestRightPressed) {
                if (this.chestCursorIndex < 2) {
                    // Update border colors
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(3, 0xffffff);
                    this.chestCursorIndex++;
                    this.chestUI.buttons[this.chestCursorIndex].bg.setStrokeStyle(3, 0xffff00);
                }
            }
        }

        // Confirm selection for element sub-menu
        if (this.chestUI && !this.chestUI.mainMenu && confirmPressed && !this.prevChestConfirmPressed) {
            if (this.chestUI.choices) {
                const selectedElement = this.chestUI.choices[this.chestCursorIndex];
                if (this.initialElementSelection) {
                    // For initial element selection, directly select the element (like mouse handler)
                    this.selectChestElement(selectedElement, null, this.chestUI.bg, this.chestUI.title, this.chestUI.controlHint, this.chestUI.buttons);
                } else {
                    const config = this.elementConfig[selectedElement];
                    this.selectChestElement(
                        selectedElement,
                        config,
                        this.chestUI.bg,
                        this.chestUI.title,
                        this.chestUI.controlHint,
                        this.chestUI.buttons
                    );
                }
            }
        }

        // Store previous states
        this.prevChestLeftPressed = leftPressed;
        this.prevChestRightPressed = rightPressed;
        this.prevChestUpPressed = upPressed;
        this.prevChestDownPressed = downPressed;
        this.prevChestConfirmPressed = confirmPressed;
        this.prevChestSwitchPressed = (this.gamepad && this.gamepad.buttons[2] && this.gamepad.buttons[2].pressed);
        this.prevChestTabPressed = this.tabKey.isDown;
    }

    handleFusionController() {
        if (!this.fusionUI) return;

        console.log('handleFusionController called');

        const leftPressed = this.cursors.left.isDown || (this.gamepad && ((this.gamepad.leftStick.x < -0.5) || (this.gamepad.buttons[14] && this.gamepad.buttons[14].pressed)));
        const rightPressed = this.cursors.right.isDown || (this.gamepad && ((this.gamepad.leftStick.x > 0.5) || (this.gamepad.buttons[15] && this.gamepad.buttons[15].pressed)));
        const upPressed = this.cursors.up.isDown || (this.gamepad && ((this.gamepad.leftStick.y < -0.5) || (this.gamepad.buttons[12] && this.gamepad.buttons[12].pressed)));
        const downPressed = this.cursors.down.isDown || (this.gamepad && ((this.gamepad.leftStick.y > 0.5) || (this.gamepad.buttons[13] && this.gamepad.buttons[13].pressed)));
        const confirmPressed = this.spaceKey.isDown || (this.gamepad && this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed);

        // Initialize previous states if not set
        if (!this.prevFusionLeftPressed) this.prevFusionLeftPressed = false;
        if (!this.prevFusionRightPressed) this.prevFusionRightPressed = false;
        if (!this.prevFusionUpPressed) this.prevFusionUpPressed = false;
        if (!this.prevFusionDownPressed) this.prevFusionDownPressed = false;
        if (!this.prevFusionConfirmPressed) this.prevFusionConfirmPressed = false;

        const totalButtons = this.fusionUI.buttons.length;
        const buttonsPerRow = 4;
        const currentRow = Math.floor(this.fusionUI.cursorIndex / buttonsPerRow);
        const currentCol = this.fusionUI.cursorIndex % buttonsPerRow;

        // Navigate left
        if (leftPressed && !this.prevFusionLeftPressed) {
            if (currentCol > 0 || (currentRow > 0 && this.fusionUI.cursorIndex > 0)) {
                // Clear current highlight
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, this.fusionUI.buttons[this.fusionUI.cursorIndex].selected ? 0xff44ff : 0xffffff);
                this.fusionUI.cursorIndex--;
                // Highlight new position
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, 0xffff00);
                console.log('Fusion: Moved left to index', this.fusionUI.cursorIndex);
            }
        }

        // Navigate right
        if (rightPressed && !this.prevFusionRightPressed) {
            if (this.fusionUI.cursorIndex < totalButtons - 1) {
                // Clear current highlight
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, this.fusionUI.buttons[this.fusionUI.cursorIndex].selected ? 0xff44ff : 0xffffff);
                this.fusionUI.cursorIndex++;
                // Highlight new position
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, 0xffff00);
                console.log('Fusion: Moved right to index', this.fusionUI.cursorIndex);
            }
        }

        // Navigate up
        if (upPressed && !this.prevFusionUpPressed) {
            if (currentRow > 0) {
                // Clear current highlight
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, this.fusionUI.buttons[this.fusionUI.cursorIndex].selected ? 0xff44ff : 0xffffff);
                this.fusionUI.cursorIndex -= buttonsPerRow;
                // Highlight new position
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, 0xffff00);
            }
        }

        // Navigate down
        if (downPressed && !this.prevFusionDownPressed) {
            const nextIndex = this.fusionUI.cursorIndex + buttonsPerRow;
            if (nextIndex < totalButtons) {
                // Clear current highlight
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, this.fusionUI.buttons[this.fusionUI.cursorIndex].selected ? 0xff44ff : 0xffffff);
                this.fusionUI.cursorIndex = nextIndex;
                // Highlight new position
                this.fusionUI.buttons[this.fusionUI.cursorIndex].bg.setStrokeStyle(2, 0xffff00);
            }
        }

        // Select/deselect element
        if (confirmPressed && !this.prevFusionConfirmPressed) {
            const button = this.fusionUI.buttons[this.fusionUI.cursorIndex];

            if (!button.selected && this.fusionUI.selectedElements.length < 2) {
                // Select element
                button.selected = true;
                this.fusionUI.selectedElements.push(button.element);
                button.bg.setFillStyle(0xff44ff, 0.5);
                button.bg.setStrokeStyle(3, 0xff44ff);

                if (this.fusionUI.selectedElements.length === 2) {
                    // Show fusion button
                    this.showFusionButton(this.fusionUI.bg, this.fusionUI.title, this.fusionUI.instruction, this.fusionUI.buttons, this.fusionUI.selectedElements);
                }
            } else if (button.selected) {
                // Deselect element
                button.selected = false;
                const index = this.fusionUI.selectedElements.indexOf(button.element);
                if (index > -1) this.fusionUI.selectedElements.splice(index, 1);
                button.bg.setFillStyle(0x333333);
                button.bg.setStrokeStyle(2, this.fusionUI.cursorIndex === button.index ? 0xffff00 : 0xffffff);

                // Remove fusion button if exists
                if (this.fusionButton) {
                    this.fusionButton.destroy();
                    this.fusionButton = null;
                }
            }
        }

        // Handle fusion button confirmation
        if (this.fusionButton && confirmPressed && !this.prevFusionConfirmPressed && this.fusionUI.selectedElements.length === 2) {
            this.performFusion(this.fusionUI.selectedElements);
        }

        // Store previous states
        this.prevFusionLeftPressed = leftPressed;
        this.prevFusionRightPressed = rightPressed;
        this.prevFusionUpPressed = upPressed;
        this.prevFusionDownPressed = downPressed;
        this.prevFusionConfirmPressed = confirmPressed;
    }

    closeFusionUI() {
        if (this.fusionUI) {
            this.fusionUI.active = false;
            this.fusionUI.bg.destroy();
            this.fusionUI.title.destroy();
            this.fusionUI.instruction.destroy();
            this.fusionUI.controlHint.destroy();
            this.fusionUI.buttons.forEach(btn => btn.container.destroy());
            if (this.fusionButton) {
                this.fusionButton.destroy();
                this.fusionButton = null;
            }
            this.fusionUI = null;
        }
        this.closeChestUI();
    }

    gameWon() {
        // Prevent multiple calls
        if (this.gameWonCalled) return;
        this.gameWonCalled = true;
        
        // Stop background music
        if (this.bgMusic) {
            this.bgMusic.stop();
        }
        
        // Stop the game
        this.physics.pause();
        
        // Disable automatic spell casting
        if (this.autoFireTimer) {
            this.autoFireTimer.remove();
            this.autoFireTimer = null;
        }
        
        // Flag to stop update loop processing
        this.gameEnded = true;

        // Victory effect
        const victoryText = this.add.text(400, 200, 'VICTORY!', {
            fontSize: '72px',
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });
        victoryText.setOrigin(0.5);
        victoryText.setScrollFactor(0);
        victoryText.setDepth(300);

        // Create the tween for victory text
        this.tweens.add({
            targets: victoryText,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // Use a simple timer for the scene transition
                this.time.delayedCall(2000, () => {
                    this.scene.start('GameOverScene', {
                        survivalTime: this.survivalTime,
                        enemiesKilled: this.enemiesKilled,
                        itemsCollected: this.itemsCollected,
                        won: true,
                        stage: this.stage
                    });
                });
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#11130d',
    pixelArt: true,
    antialias: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: localStorage.getItem('debugMode') === 'true'
        }
    },
    input: {
        gamepad: true
    },
    scene: [LoadingScene, TitleScene, StageSelectScene, TalentTreeScene, GameScene, GameOverScene, UltraOptimizedGameScene]
};

const game = new Phaser.Game(config);