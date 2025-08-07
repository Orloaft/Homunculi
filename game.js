class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image('title-bg', 'magustitle.png');
    }

    create() {
        // Set background color to match the image's dark background
        this.cameras.main.setBackgroundColor('#0c0f16');
        
        // Add background image with proper aspect ratio
        const bg = this.add.image(400, 300, 'title-bg');
        
        // Calculate proper scale to fit while maintaining aspect ratio
        const imgWidth = bg.width;
        const imgHeight = bg.height;
        const scaleX = 800 / imgWidth;
        const scaleY = 600 / imgHeight;
        const scale = Math.min(scaleX, scaleY);
        
        bg.setScale(scale);
        
        const title = this.add.text(400, 200, 'WIZBIZ', {
            fontSize: '72px',
            color: '#ffdd44',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

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

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
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
                this.scene.start('GameScene');
            }
        }
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.survivalTime = data.survivalTime || 0;
        this.enemiesKilled = data.enemiesKilled || { tree: 0, slime: 0, golem: 0, elite: 0 };
        this.itemsCollected = data.itemsCollected || { jewels: 0, muffins: 0, elements: 0 };
        this.won = data.won || false;
    }

    create() {
        // Title
        const title = this.add.text(400, 80, this.won ? 'VICTORY!' : 'GAME OVER', {
            fontSize: '64px',
            color: this.won ? '#ffd700' : '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Survival time
        const totalSeconds = Math.floor(this.survivalTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeText = this.add.text(400, 150, `Survived: ${minutes}:${seconds.toString().padStart(2, '0')}`, {
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Stats background
        const statsBg = this.add.rectangle(400, 300, 600, 250, 0x000000, 0.8);
        statsBg.setStrokeStyle(2, 0xffffff);
        
        // Enemy kills
        const killsTitle = this.add.text(250, 200, 'Enemies Defeated:', {
            fontSize: '20px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        let killsText = '';
        if (this.enemiesKilled.tree > 0) killsText += `Trees: ${this.enemiesKilled.tree}\n`;
        if (this.enemiesKilled.slime > 0) killsText += `Slimes: ${this.enemiesKilled.slime}\n`;
        if (this.enemiesKilled.golem > 0) killsText += `Golems: ${this.enemiesKilled.golem}\n`;
        if (this.enemiesKilled.elite > 0) killsText += `Elites: ${this.enemiesKilled.elite}\n`;
        
        const killsList = this.add.text(250, 240, killsText || 'None', {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // Items collected
        const itemsTitle = this.add.text(550, 200, 'Items Collected:', {
            fontSize: '20px',
            color: '#44ff44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const itemsText = `Jewels: ${this.itemsCollected.jewels}\nMuffins: ${this.itemsCollected.muffins}\nElements: ${this.itemsCollected.elements}`;
        
        const itemsList = this.add.text(550, 240, itemsText, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0);
        
        // Total score
        const totalKills = this.enemiesKilled.tree + this.enemiesKilled.slime + this.enemiesKilled.golem + this.enemiesKilled.elite * 3;
        const score = totalKills * 100 + this.itemsCollected.jewels * 10 + Math.floor(totalSeconds) * 5;
        
        const scoreText = this.add.text(400, 380, `Score: ${score}`, {
            fontSize: '32px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const restartText = this.add.text(400, 450, 'Press SPACE to Try Again', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const menuText = this.add.text(400, 490, 'Press ESC for Main Menu', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
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
                // A button or Start button to retry
                if (pad.buttons[0].pressed || pad.buttons[9].pressed) {
                    this.scene.start('GameScene');
                }
                // B button or Back button for main menu
                if (pad.buttons[1].pressed || pad.buttons[8].pressed) {
                    this.scene.start('TitleScene');
                }
            }
        }
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.enemies = null;
        this.lastEnemySpawn = 0;
        this.charges = [];
        this.chargeIndicators = [];
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
        this.xpToNextLevel = 10;
        this.maxCharges = 1;
        this.chargingElement = null;
        this.chargeHoldTime = 0;
        this.chargeHoldThreshold = 500;
        this.lastFireTime = 0;
        this.fireRate = 1000; // milliseconds between automatic shots
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
    }

    preload() {
        // Load new wizard sprites with transparency
        // Note: Grey background color is approximately #808080
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
        
        this.load.spritesheet('enemy-walk', 'tree/tronchungo3/walking-sheet.png', {
            frameWidth: 48,
            frameHeight: 60
        });
        
        this.load.image('dirt-tiles', 'TopDownFantasy_Forest_v1/TopDownFantasy-Forest/Tiles/dirt.png');
        this.load.image('tree', 'foliage.png');
        
        // Load element symbols sprite sheet (3x3 grid)
        // elements.png is 819x819, so each frame is 273x273
        this.load.spritesheet('element-symbols', 'elements.png', {
            frameWidth: 273,  // 819/3 = 273
            frameHeight: 273
        });
        
        // Load second element symbols sprite sheet  
        // elements2.PNG is 1024x1024, so each frame is approximately 341x341
        this.load.spritesheet('element-symbols2', 'elements2.PNG', {
            frameWidth: 341,  // 1024/3 ≈ 341
            frameHeight: 341
        });
        
        // Load third element symbols sprite sheet
        // elements3.PNG appears to be a 3x3 grid similar to elements2
        this.load.spritesheet('element-symbols3', 'elements3.PNG', {
            frameWidth: 341,  // Assuming same size as elements2
            frameHeight: 341
        });
        
        
        // Load slime sprites
        for (let i = 0; i < 4; i++) {
            this.load.image(`slime-idle-${i}`, `Slime/Individual Sprites/slime-idle-${i}.png`);
            this.load.image(`slime-die-${i}`, `Slime/Individual Sprites/slime-die-${i}.png`);
        }
        
        // Load golem sprites - Orange (90x64 per frame)
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
        
        // Load golem sprites - Blue (90x64 per frame)
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

    create() {
        // Reset game state
        this.playerHealth = 100;
        this.charges = [];
        this.orbitingOrbs = [];
        this.lastEnemySpawn = 0;
        this.survivalTime = 0;
        this.difficultyMultiplier = 1.0;
        this.spawnRateMultiplier = 1.0;
        this.lastMinute = 0;
        this.enemiesKilled = { tree: 0, slime: 0, golem: 0, elite: 0 };
        this.itemsCollected = { jewels: 0, muffins: 0, elements: 0 };
        this.eliteEnemies = [];
        this.chests = this.physics.add.group();
        this.playerXP = 0;
        this.playerLevel = 1;
        this.xpToNextLevel = 10;
        this.maxCharges = 1;
        this.lastFireTime = 0;
        this.currentChargeIndex = 0;
        this.chargingElement = null;
        this.chargeHoldTime = 0;
        this.chargeHoldThreshold = 500;
        this.lastFireTime = 0;
        this.fireRate = 1000; // milliseconds between automatic shots
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
        this.elementsMenuOpen = false;
        this.elementsMenu = null;
        
        
        // Element configuration - 18 elements with sprite frames and colors
        this.elementConfig = {
            // First sprite sheet (elements.png)
            fire: { frame: 0, color: 0xff4444, name: 'Fire', sheet: 'element-symbols' },
            water: { frame: 1, color: 0x4444ff, name: 'Water', sheet: 'element-symbols' },
            earth: { frame: 2, color: 0x44ff44, name: 'Earth', sheet: 'element-symbols' },
            rock: { frame: 3, color: 0x8b4513, name: 'Rock', sheet: 'element-symbols' },
            air: { frame: 4, color: 0xcccccc, name: 'Air', sheet: 'element-symbols' },
            lightning: { frame: 5, color: 0xffff44, name: 'Lightning', sheet: 'element-symbols' },
            holy: { frame: 6, color: 0xffdd00, name: 'Holy', sheet: 'element-symbols' },
            arcane: { frame: 7, color: 0xff44ff, name: 'Arcane', sheet: 'element-symbols' },
            dust: { frame: 8, color: 0xcc9966, name: 'Dust', sheet: 'element-symbols' },
            
            // Second sprite sheet (elements2.PNG)
            lava: { frame: 0, color: 0xff6600, name: 'Lava', sheet: 'element-symbols2' },
            steam: { frame: 1, color: 0xaabbcc, name: 'Steam', sheet: 'element-symbols2' },
            poison: { frame: 2, color: 0x00ff00, name: 'Poison', sheet: 'element-symbols2' },
            volcano: { frame: 3, color: 0xcc3300, name: 'Volcano', sheet: 'element-symbols2' },
            ice: { frame: 4, color: 0x00ddff, name: 'Ice', sheet: 'element-symbols2' },
            meteor: { frame: 5, color: 0xff8800, name: 'Meteor', sheet: 'element-symbols2' },
            mud: { frame: 6, color: 0x664422, name: 'Mud', sheet: 'element-symbols2' },
            thunder: { frame: 7, color: 0xffff00, name: 'Thunder', sheet: 'element-symbols2' },
            crystal: { frame: 8, color: 0xffaaff, name: 'Crystal', sheet: 'element-symbols2' },
            
            // Third sprite sheet (elements3.PNG)
            death: { frame: 0, color: 0x333333, name: 'Death', sheet: 'element-symbols3' },
            time: { frame: 1, color: 0xffd700, name: 'Time', sheet: 'element-symbols3' },
            sand: { frame: 2, color: 0xf4a460, name: 'Sand', sheet: 'element-symbols3' },
            gravity: { frame: 3, color: 0x4b0082, name: 'Gravity', sheet: 'element-symbols3' },
            sun: { frame: 4, color: 0xffeb3b, name: 'Sun', sheet: 'element-symbols3' },
            smoke: { frame: 5, color: 0x696969, name: 'Smoke', sheet: 'element-symbols3' },
            wave: { frame: 6, color: 0x00bcd4, name: 'Wave', sheet: 'element-symbols3' },
            star: { frame: 7, color: 0xffffff, name: 'Star', sheet: 'element-symbols3' },
            moon: { frame: 8, color: 0xe0e0e0, name: 'Moon', sheet: 'element-symbols3' }
        };
        
        // Define primary elements (can drop from enemies)
        this.primaryElements = ['fire', 'water', 'earth', 'air', 'lightning', 'holy', 'arcane', 'rock', 'dust'];
        
        // Element descriptions for the discovery menu
        this.elementDescriptions = {
            fire: 'Creates burning projectiles that leave fire pools. Basic offensive element.',
            water: 'Spawns protective orbs that orbit around you. Defensive element.',
            earth: 'Directional earthquake that damages enemies in a line. Area control.',
            rock: 'Heavy projectiles that stun enemies on impact. Crowd control.',
            air: 'Creates wind blasts that push enemies away. Knockback element.',
            lightning: 'Homing projectiles that seek out enemies. Precision element.',
            holy: 'Healing aura that damages enemies and heals the wizard. Support magic.',
            arcane: 'Mysterious homing magic that tracks targets. Pure magical energy.',
            dust: 'Blinds and slows enemies in a large area. Debuff element.',
            lava: 'Molten projectiles that create burning pools on impact. Destructive fire.',
            steam: 'Explosive bursts that push enemies back violently. Pressure element.',
            poison: 'Applies damage over time to enemies. Lethal toxin.',
            volcano: 'Erupts with multiple lava projectiles in all directions. Explosive earth.',
            ice: 'Slows enemies and reduces their movement speed. Frost magic.',
            meteor: 'Calls down meteors from above with area damage. Celestial destruction.',
            mud: 'Creates slowing puddles that trap enemies. Terrain control.',
            thunder: 'Instant lightning strikes on random enemies. Divine punishment.',
            crystal: 'Creates solid impassable crystals that shatter after 2 seconds with area damage.',
            death: 'Dark magic that instantly destroys weakened enemies. Finisher element.',
            time: 'Slows down time for enemies in an area. Temporal manipulation.',
            sand: 'Creates sandstorms that blind and damage enemies. Desert magic.',
            gravity: 'Pulls enemies together into a crushing singularity. Force element.',
            sun: 'Radiates intense heat and light, burning all nearby enemies. Solar power.',
            smoke: 'Obscures vision and causes choking damage. Suffocation element.',
            wave: 'Powerful water surge that knocks back groups of enemies. Tidal force.',
            star: 'Calls down starlight beams from the cosmos. Celestial magic.',
            moon: 'Lunar energy that heals allies and curses enemies. Night magic.'
        };
        
        this.createForestBackground();
        
        this.wizard = this.physics.add.sprite(400, 1080, 'wizard-idle');  // Center of the taller world
        this.wizard.setScale(1.0); // New sprites are already the right size
        this.wizard.play('wizard-idle-full');
        this.wizard.once('animationcomplete', () => {
            this.wizard.play('wizard-idle-loop');
        });
        this.wizard.setCollideWorldBounds(true);
        this.wizard.setDepth(10); // Ensure wizard renders above background
        this.wizard.lastDirection = 'down'; // Set initial facing direction
        
        // Set physics body size smaller to prevent damage when close but not touching
        // Reduced from 40x60 to 20x30 for an even tighter hitbox
        this.wizard.body.setSize(20, 30);
        this.wizard.body.setOffset(30, 25); // Center the smaller hitbox
        
        // Try to minimize the grey background visibility
        // Since we can't remove it without editing the sprites, we'll work with it
        this.wizard.setAlpha(1.0);
        
        // Make camera follow the wizard
        this.cameras.main.startFollow(this.wizard, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
        this.cameras.main.roundPixels = true; // Prevent sub-pixel rendering gaps
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
        
        // Controller mapping info - create this BEFORE using it
        this.controllerInfo = this.add.text(20, 100, '', {
            fontSize: '12px',
            color: '#aaaaaa'
        });
        this.controllerInfo.setScrollFactor(0);
        this.controllerInfo.setDepth(60);
        
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
        this.trees = this.physics.add.staticGroup();
        this.jewels = this.physics.add.group();
        this.muffins = this.physics.add.group();
        this.elementOrbs = this.physics.add.group();

        this.physics.add.overlap(this.wizard, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.projectileHitEnemy, null, this);
        this.physics.add.overlap(this.wizard, this.jewels, this.collectJewel, null, this);
        this.physics.add.overlap(this.wizard, this.muffins, this.collectMuffin, null, this);
        this.physics.add.overlap(this.wizard, this.elementOrbs, this.collectElementOrb, null, this);
        this.physics.add.overlap(this.wizard, this.chests, this.openChest, null, this);
        
        // Add collisions with trees
        this.physics.add.collider(this.wizard, this.trees);
        this.physics.add.collider(this.enemies, this.trees);
        this.physics.add.collider(this.projectiles, this.trees, this.projectileHitTree, null, this);
        
        // Add enemy-to-enemy collision to prevent stacking
        this.physics.add.collider(this.enemies, this.enemies);
        
        // Spawn some trees randomly
        this.spawnTrees();

        this.createChargeUI();
        this.createSpellbookUI();
        // this.createHealthBar(); // Removed - using wizard health bar only
        this.createWizardHealthBar();
        this.createPauseMenu();
        this.createElementsMenu();
        
        
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

    createForestBackground() {
        const worldWidth = 4000;  // Much wider world - was 1280
        const worldHeight = 2160;  // 3x the original height (720 * 3)
        const tileSize = 16;
        
        // Calculate number of tiles needed
        const tilesX = Math.ceil(worldWidth / tileSize);
        const tilesY = Math.ceil(worldHeight / tileSize);
        
        // Create map data array
        const mapData = [];
        for (let y = 0; y < tilesY; y++) {
            mapData[y] = [];
            for (let x = 0; x < tilesX; x++) {
                // Randomly select tile index (0-5 for 6 tiles)
                mapData[y][x] = Phaser.Math.Between(0, 5);
            }
        }
        
        // Create tilemap from data
        const map = this.make.tilemap({
            data: mapData,
            tileWidth: tileSize,
            tileHeight: tileSize
        });
        
        // Add tileset image - dirt.png contains 2x3 tiles of 16x16 each
        const tileset = map.addTilesetImage('dirt-tiles', 'dirt-tiles', 16, 16, 0, 0);
        
        // Create layer
        const layer = map.createLayer(0, tileset, 0, 0);
        layer.setDepth(-10);
        
        // Update world bounds
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        
        // Set camera bounds to prevent seeing beyond the world
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    }

    createChargeUI() {
        // Create secondary timer display where charges label was
        this.secondaryTimer = this.add.text(350, 20, '0:00', {
            fontSize: '16px',
            color: '#ffffff'
        });
        this.secondaryTimer.setScrollFactor(0); // Fix to camera
        this.secondaryTimer.setDepth(60); // Above everything
        
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
        
        // Create 4 charge indicators using sprites
        for (let i = 0; i < 4; i++) {
            // Background slot
            const slotBg = this.add.rectangle(380 + (i * 35), 50, 30, 30, 0x333333, 0.5);
            slotBg.setStrokeStyle(1, 0x666666);
            slotBg.setScrollFactor(0);
            slotBg.setDepth(61);
            slotBg.setVisible(i < this.maxCharges);
            
            // Element sprite indicator (default to first sheet)
            const indicator = this.add.sprite(380 + (i * 35), 50, 'element-symbols', 0);
            indicator.setScrollFactor(0);
            indicator.setDepth(62);
            indicator.setVisible(false);
            indicator.setScale(0.1); // Scale down much more since frames are huge
            
            this.chargeIndicators.push({ bg: slotBg, sprite: indicator });
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
        this.levelText.setDepth(60);
        
        this.xpText = this.add.text(20, 45, `XP: ${this.playerXP}/${this.xpToNextLevel}`, {
            fontSize: '14px',
            color: '#ffffff'
        });
        this.xpText.setScrollFactor(0);
        this.xpText.setDepth(60);
    }

    updateChargeUI() {
        this.chargeIndicators.forEach((indicator, index) => {
            // Update visibility based on max charges
            indicator.bg.setVisible(index < this.maxCharges);
            
            if (index < this.charges.length) {
                const element = this.charges[index];
                const config = this.elementConfig[element];
                if (config) {
                    // Update texture if needed
                    if (indicator.sprite.texture.key !== config.sheet) {
                        indicator.sprite.setTexture(config.sheet, config.frame);
                    } else {
                        indicator.sprite.setFrame(config.frame);
                    }
                    indicator.sprite.setVisible(true);
                    indicator.sprite.setAlpha(1);
                } else {
                    indicator.sprite.setVisible(false);
                }
            } else {
                indicator.sprite.setVisible(false);
            }
        });
    }

    createSpellbookUI() {
        this.spellbookUI = this.add.container(400, 300);
        
        const background = this.add.rectangle(0, 0, 600, 400, 0x2a1810);
        background.setStrokeStyle(4, 0x8b6914);
        
        const title = this.add.text(0, -170, 'SPELLBOOK', {
            fontSize: '32px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.spellList = this.add.text(0, -100, '', {
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5, 0);
        
        const closeText = this.add.text(0, 170, 'Press ESC to close', {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        this.spellbookUI.add([background, title, this.spellList, closeText]);
        this.spellbookUI.setVisible(false);
        this.spellbookUI.setDepth(300);
        this.spellbookUI.setScrollFactor(0); // Fix to camera
    }

    createElementsMenu() {
        this.elementsMenu = this.add.container(400, 300);
        
        const background = this.add.rectangle(0, 0, 700, 500, 0x1a0f2e);
        background.setStrokeStyle(4, 0x8b6914);
        
        const title = this.add.text(0, -220, 'DISCOVERED ELEMENTS', {
            fontSize: '32px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Create scrollable content area
        this.elementsListContainer = this.add.container(0, -50);
        this.elementsListText = this.add.text(0, 0, '', {
            fontSize: '14px',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 8,
            wordWrap: { width: 650 }
        }).setOrigin(0.5, 0);
        
        this.elementsListContainer.add(this.elementsListText);
        
        const closeText = this.add.text(0, 220, 'Press TAB or SELECT to close', {
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        const instructionText = this.add.text(0, 200, 'Collect element orbs from defeated enemies to discover new elements!', {
            fontSize: '12px',
            color: '#888888'
        }).setOrigin(0.5);
        
        this.elementsMenu.add([background, title, this.elementsListContainer, closeText, instructionText]);
        this.elementsMenu.setVisible(false);
        this.elementsMenu.setDepth(300);
        this.elementsMenu.setScrollFactor(0);
    }

    createHealthBar() {
        this.healthBarBg = this.add.rectangle(100, 550, 150, 20, 0x333333);
        this.healthBarBg.setStrokeStyle(2, 0xffffff);
        this.healthBarBg.setScrollFactor(0); // Fix to camera
        this.healthBarBg.setDepth(100); // Render above all game elements
        
        this.healthBar = this.add.rectangle(25, 550, 150, 20, 0x44ff44);
        this.healthBar.setOrigin(0, 0.5);
        this.healthBar.setScrollFactor(0); // Fix to camera
        this.healthBar.setDepth(101); // Render above background
        
        const healthLabel = this.add.text(100, 525, 'HEALTH', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        healthLabel.setScrollFactor(0); // Fix to camera
        healthLabel.setDepth(101); // Render above background
        
        // Add timer display in top middle
        this.difficultyText = this.add.text(400, 20, 'Timer: 0:00', {
            fontSize: '20px',
            color: '#ffaa44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.difficultyText.setScrollFactor(0);
        this.difficultyText.setDepth(60);
        
        // Removed duplicate timer - using difficultyText only
        // this.survivalText = this.add.text(650, 45, 'Time: 0:00', {
        //     fontSize: '14px',
        //     color: '#ffffff'
        // });
        // this.survivalText.setScrollFactor(0);
        // this.survivalText.setDepth(60);
        
        this.updateHealthBar();
        
        // Spawn initial wave of enemies after a short delay to ensure animations work
        this.time.delayedCall(100, () => {
            const initialEnemies = 4;
            for (let i = 0; i < initialEnemies; i++) {
                this.spawnEnemy();
            }
        });
    }

    createWizardHealthBar() {
        // Create health bar that floats above wizard
        this.wizardHealthBarBg = this.add.rectangle(0, -50, 40, 6, 0x333333);
        this.wizardHealthBarBg.setStrokeStyle(1, 0x000000);
        this.wizardHealthBarBg.setDepth(15);
        
        this.wizardHealthBar = this.add.rectangle(-20, -50, 40, 6, 0x44ff44);
        this.wizardHealthBar.setOrigin(0, 0.5);
        this.wizardHealthBar.setDepth(16);
        
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

    update(time, delta) {
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
        
        // Update survival time (only when not paused and no menus open)
        if (this.time.timeScale > 0 && !this.isPaused && !this.spellbookOpen && !this.elementsMenuOpen && !this.chestSelectionActive) {
            this.survivalTime += delta;
        }
        
        // Update spawn rate over time (every minute)
        const currentMinute = Math.floor(this.survivalTime / 60000);
        if (currentMinute > this.lastMinute) {
            this.lastMinute = currentMinute;
            this.spawnRateMultiplier = 1 + (currentMinute * 0.5); // 50% faster each minute
            
            // Spawn elite enemy
            if (currentMinute > 0) {
                this.spawnEliteEnemy();
            }
        }
        
        // Update timer displays
        const totalSeconds = Math.floor(this.survivalTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.difficultyText) {
            this.difficultyText.setText(`Timer: ${timeString}`);
        }
        
        // Update secondary timer (no label)
        if (this.secondaryTimer) {
            this.secondaryTimer.setText(timeString);
        }
        
        // Check win condition (10 minutes)
        if (minutes >= 10) {
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
        
        if (Phaser.Input.Keyboard.JustDown(this.pKey) || 
            (startPressed && !this.gamepadButtonStates[9])) {
            this.togglePause();
        }
        
        // ESC key for spellbook
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.toggleSpellbook();
        }
        
        // TAB key or Select button (button 8) for elements menu
        let selectPressed = false;
        if (this.gamepad && this.gamepad.buttons[8]) {
            selectPressed = this.gamepad.buttons[8].pressed;
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.tabKey) ||
            (selectPressed && !this.gamepadButtonStates[8])) {
            this.toggleElementsMenu();
        }
        
        // Update gamepad button states for next frame
        if (this.gamepad) {
            this.gamepad.buttons.forEach((button, index) => {
                this.gamepadButtonStates[index] = button.pressed;
            });
        }

        if (this.spellbookOpen || this.elementsMenuOpen || this.playerHealth <= 0) {
            return;
        }
        
        // Handle chest selection controller input
        if (this.chestSelectionActive && this.chestUI) {
            this.handleChestSelectionController();
            return;
        }
        
        // Handle pause menu controller input when paused
        if (this.isPaused) {
            this.handlePauseMenuController();
            return;
        }

        const speed = 160;
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
        
        // Automatic shooting based on charges
        if (!this.lastFireTime || time > this.lastFireTime + this.fireRate) {
            if (this.charges.length > 0) {
                this.fireElementProjectile();
            } else {
                // Fire basic projectile when no charges
                this.fireBasicProjectile();
            }
            this.lastFireTime = time;
        }

        // Check if any golems are currently alive
        const golemAlive = this.enemies.children.entries.some(enemy => 
            enemy.active && enemy.enemyType === 'golem'
        );
        
        // Only spawn regular enemies if no golem is alive
        if (!golemAlive) {
            // Calculate spawn delay based on difficulty
            // Start at 6 seconds, decrease to minimum of 2 seconds at high difficulty
            const baseSpawnDelay = 6000; // 6 seconds (slower spawn)
            const minSpawnDelay = 1000; // 1 second minimum
            const spawnDelay = Math.max(minSpawnDelay, baseSpawnDelay / this.spawnRateMultiplier);
            
            if (time > this.lastEnemySpawn + spawnDelay) {
                // Spawn multiple enemies at once around the perimeter
                const enemiesToSpawn = Math.floor(2 + Math.floor(this.spawnRateMultiplier));
                for (let i = 0; i < enemiesToSpawn; i++) {
                    this.spawnEnemy();
                }
                this.lastEnemySpawn = time;
            }
        }

        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active || enemy.isDying) return;
            
            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
            
            // Teleport enemy if too far from wizard (beyond 800 pixels)
            if (distance > 800) {
                // Teleport to outside viewport
                const camera = this.cameras.main;
                const viewportWidth = camera.width;
                const viewportHeight = camera.height;
                const spawnMargin = 50;
                
                // Calculate spawn position outside current viewport
                const side = Phaser.Math.Between(0, 3);
                switch(side) {
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
                
                // Clamp to world bounds
                enemy.x = Phaser.Math.Clamp(enemy.x, 50, 3950);
                enemy.y = Phaser.Math.Clamp(enemy.y, 50, 2110);
            }
            
            // Only update velocity if not being knocked back, not stunned, and not blinded
            if (Math.abs(enemy.body.velocity.x) < 100 && Math.abs(enemy.body.velocity.y) < 100 && !enemy.stunned && !enemy.blinded) {
                // Get enemy speed based on type
                const moveSpeed = enemy.moveSpeed || (enemy.enemyType === 'tree' ? 48 : 60);
                
                // Stop moving if within attack range (40 pixels)
                const stopDistance = 40;
                
                if (distance > stopDistance) {
                    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
                    const velocityX = Math.cos(angle) * moveSpeed;
                    const velocityY = Math.sin(angle) * moveSpeed;
                    enemy.setVelocity(velocityX, velocityY);
                    
                    // Keep walk animation playing for golems
                    if (enemy.enemyType === 'golem' && !enemy.anims.isPlaying) {
                        enemy.play(`golem-${enemy.golemColor}-walk`);
                    }
                    
                    // Flip golem to face wizard
                    if (enemy.enemyType === 'golem') {
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
                    
                    // Flip golem to face wizard even when stopped
                    if (enemy.enemyType === 'golem') {
                        if (this.wizard.x < enemy.x) {
                            enemy.setFlipX(true); // Face left
                        } else {
                            enemy.setFlipX(false); // Face right
                        }
                    }
                }
            } else {
                // Gradually slow down knockback
                enemy.setVelocity(
                    enemy.body.velocity.x * 0.85,
                    enemy.body.velocity.y * 0.85
                );
            }
        });

        this.projectiles.children.entries.forEach(projectile => {
            // Use world bounds instead of fixed screen coordinates
            const bounds = this.physics.world.bounds;
            if (projectile.x < bounds.x - 50 || 
                projectile.x > bounds.x + bounds.width + 50 || 
                projectile.y < bounds.y - 50 || 
                projectile.y > bounds.y + bounds.height + 50) {
                projectile.destroy();
            }
        });
        
        // Update depths based on Y position
        this.wizard.setDepth(this.wizard.y / 10);
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active) enemy.setDepth(enemy.y / 10);
        });
        
        // Update wizard health bar position
        this.updateWizardHealthBar();
        
        // Attract jewels to wizard when close
        this.jewels.children.entries.forEach(jewel => {
            const distance = Phaser.Math.Distance.Between(jewel.x, jewel.y, this.wizard.x, this.wizard.y);
            
            if (distance < 100) {
                // Attract jewel to wizard
                const angle = Phaser.Math.Angle.Between(jewel.x, jewel.y, this.wizard.x, this.wizard.y);
                const speed = 200;
                jewel.body.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
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

        // Update water orbs to orbit around wizard
        this.waterOrbs.forEach((orb, index) => {
            if (orb.active) {
                // Store current angle if not set
                if (orb.currentAngle === undefined) {
                    orb.currentAngle = orb.startAngle;
                }
                // Increment angle continuously
                orb.currentAngle += 0.002 * delta;
                orb.x = this.wizard.x + Math.cos(orb.currentAngle) * orb.orbitRadius;
                orb.y = this.wizard.y + Math.sin(orb.currentAngle) * orb.orbitRadius;
            }
        });
        
        // Update lightning projectiles to home in on enemies
        this.projectiles.children.entries.forEach(projectile => {
            if (projectile.isHoming && projectile.active) {
                let closestEnemy = null;
                let closestDist = 999999;
                
                this.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const dist = Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closestEnemy = enemy;
                        }
                    }
                });
                
                if (closestEnemy) {
                    const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, closestEnemy.x, closestEnemy.y);
                    const speed = 250;
                    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
                }
            }
        });
        
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
        const spellDescriptions = {
            'water-water-lightning': 'C-C-X: Shield of Waves\n4 water orbs orbit for 3 seconds',
            'fire-lightning-fire': 'Z-X-Z: Explosive Bolt\nLarge projectile that explodes on impact',
            'water-lightning-water': 'C-X-C: Storm Shotgun\nFires a spread of water and lightning orbs',
            'lightning-water-earth': 'X-C-V: Magnetic Vortex\nCreates a grey orb that magnetizes enemies'
        };
        
        let spellText = '';
        this.discoveredSpells.forEach(spell => {
            spellText += spellDescriptions[spell.combo] + '\n\n';
        });
        
        if (spellText === '') {
            spellText = 'No spells discovered yet.\nExperiment with different combinations!';
        }
        
        this.spellList.setText(spellText);
    }
    
    updateElementsMenu() {
        if (!this.elementsListText) return;
        
        // Clear previous element sprites if any
        if (this.elementSprites) {
            this.elementSprites.forEach(sprite => sprite.destroy());
        }
        this.elementSprites = [];
        
        let elementsText = '';
        const sortedElements = Array.from(this.discoveredElements).sort();
        
        if (sortedElements.length === 0) {
            elementsText = 'No elements discovered yet.\nDefeat enemies to find element orbs!';
        } else {
            elementsText = `Discovered: ${sortedElements.length}/${Object.keys(this.elementConfig).length} Elements\n\n`;
            
            let yOffset = 30; // Start position for first element
            
            sortedElements.forEach((element, index) => {
                const config = this.elementConfig[element];
                const description = this.elementDescriptions[element] || 'Mysterious element with unknown properties.';
                
                // Create element sprite
                const sprite = this.add.sprite(-325, yOffset, config.sheet, config.frame);
                sprite.setScale(0.1);
                sprite.setDepth(301); // Above menu background
                sprite.setScrollFactor(0);
                this.elementsListContainer.add(sprite);
                this.elementSprites.push(sprite);
                
                // Add padding for text to account for sprite
                elementsText += `      ${config.name.toUpperCase()}\n`;
                elementsText += `      ${description}\n`;
                
                if (index < sortedElements.length - 1) {
                    elementsText += '\n';
                }
                
                // Update y position for next element (3 lines per element)
                yOffset += 56; // Adjust spacing based on font size and line spacing
            });
        }
        
        this.elementsListText.setText(elementsText);
    }

    createPauseMenu() {
        this.pauseMenu = this.add.container(400, 300);
        
        // IMPORTANT: Set the container size and make it interactive
        this.pauseMenu.setSize(700, 500);
        this.pauseMenu.setInteractive(new Phaser.Geom.Rectangle(-350, -250, 700, 500), Phaser.Geom.Rectangle.Contains);
        
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
        
        // Title
        const title = this.add.text(0, -200, 'ELEMENT MANAGEMENT', {
            fontSize: '28px',
            color: '#ffdd44',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Instructions
        const instructions = this.add.text(0, -150, 'Drag elements to rearrange • Click X to discard • Click between slots to link', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const tip = this.add.text(0, -120, 'Green links can be clicked again to unlink', {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        // Charge slot visuals
        this.pauseChargeSlots = [];
        this.linkButtons = [];
        this.draggedCharge = null;
        
        const slotStartX = -150;
        const slotSpacing = 100;
        const slotY = 0;
        
        for (let i = 0; i < 4; i++) {
            // Slot background
            const slotBg = this.add.rectangle(slotStartX + i * slotSpacing, slotY, 80, 80, 0x333333);
            slotBg.setStrokeStyle(2, 0xffffff);
            slotBg.setData('slotIndex', i);
            slotBg.setInteractive({ dropZone: true });
            
            // Charge indicator using sprite (make it draggable) - default to first sheet
            const chargeSprite = this.add.sprite(slotStartX + i * slotSpacing, slotY, 'element-symbols', 0);
            chargeSprite.setVisible(false);
            chargeSprite.setScale(0.2); // Scale down since frames are huge
            chargeSprite.setInteractive({ 
                draggable: true,
                hitArea: new Phaser.Geom.Rectangle(-16, -16, 32, 32),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
            });
            chargeSprite.setData('slotIndex', i);
            chargeSprite.setData('originalX', slotStartX + i * slotSpacing);
            chargeSprite.setData('originalY', slotY);
            
            // Slot number
            const slotNum = this.add.text(slotStartX + i * slotSpacing, slotY + 50, `Slot ${i + 1}`, {
                fontSize: '14px',
                color: '#aaaaaa'
            }).setOrigin(0.5);
            
            // Discard button
            const discardBtn = this.add.text(slotStartX + i * slotSpacing + 35, slotY - 35, 'X', {
                fontSize: '16px',
                color: '#ff4444',
                backgroundColor: '#333333',
                padding: { x: 4, y: 2 }
            }).setOrigin(0.5);
            discardBtn.setInteractive({ useHandCursor: true });
            discardBtn.setVisible(false);
            discardBtn.setData('slotIndex', i);
            
            // Need to capture i in closure
            const slotIndex = i;
            // Event handlers will be set up in togglePause when menu is shown
            
            this.pauseChargeSlots.push({ 
                bg: slotBg, 
                circle: chargeSprite, // Keeping the name for compatibility
                text: slotNum, 
                discardBtn: discardBtn,
                x: slotStartX + i * slotSpacing,
                y: slotY
            });
            
            // Link button (between slots)
            if (i < 3) {
                const linkX = slotStartX + i * slotSpacing + slotSpacing / 2;
                const linkBtn = this.add.rectangle(linkX, slotY, 30, 20, 0x555555);
                linkBtn.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle(-15, -10, 30, 20),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains
                });
                linkBtn.setStrokeStyle(1, 0xaaaaaa);
                
                const linkText = this.add.text(linkX, slotY, '-', {
                    fontSize: '16px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Event handlers will be set up in togglePause when menu is shown
                
                this.linkButtons.push({ btn: linkBtn, text: linkText, linked: false });
            }
        }
        
        // Current combo display
        this.comboDisplay = this.add.text(0, 100, '', {
            fontSize: '18px',
            color: '#44ff44',
            align: 'center'
        }).setOrigin(0.5);
        
        // Close instruction
        const closeText = this.add.text(0, 200, 'Press P or Start to resume', {
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        
        // Controller instructions
        const controllerText = this.add.text(0, 170, 'Controller: D-pad to navigate • A to select/place • B to cancel • Y for link mode', {
            fontSize: '14px',
            color: '#888888'
        }).setOrigin(0.5);
        
        this.pauseMenu.add([bg, title, instructions, tip, closeText, controllerText, this.comboDisplay]);
        
        // Add all slot elements
        this.pauseChargeSlots.forEach(slot => {
            this.pauseMenu.add([slot.bg, slot.circle, slot.text, slot.discardBtn]);
        });
        
        // Add all link buttons
        this.linkButtons.forEach(link => {
            this.pauseMenu.add([link.btn, link.text]);
        });
        
        this.pauseMenu.setVisible(false);
        this.pauseMenu.setDepth(300);
        this.pauseMenu.setScrollFactor(0);
        
        // Set up drag events - we need to remove old listeners first to avoid duplicates
        this.input.off('dragstart');
        this.input.off('drag');
        this.input.off('dragend');
        
        this.input.on('dragstart', (pointer, gameObject) => {
            // Check if this is one of our charge circles
            if (gameObject.getData('slotIndex') !== undefined && this.pauseChargeSlots.some(slot => slot.circle === gameObject)) {
                this.draggedCharge = gameObject;
                gameObject.setDepth(201); // Bring to front
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
                    if (index < this.maxCharges) {
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
                this.pauseMenuCursor.setDepth(250);
                this.pauseMenuCursor.setScrollFactor(0);
            }
            this.pauseMenuCursor.setVisible(true);
            this.updatePauseMenuCursor();
            
            // SOLUTION: Move elements out of container temporarily to ensure they work
            // Store original parents
            this.tempInteractiveElements = [];
            
            // Move charge circles out of container and make them interactive at world level
            this.pauseChargeSlots.forEach((slot, index) => {
                if (slot.circle.visible && index < this.charges.length) {
                    // Calculate world position
                    const worldX = this.pauseMenu.x + slot.circle.x;
                    const worldY = this.pauseMenu.y + slot.circle.y;
                    
                    // Create a temporary interactive zone at world coordinates
                    const hitZone = this.add.circle(worldX, worldY, 30, 0x00ff00, 0.01); // Very slight alpha so it's almost invisible
                    hitZone.setDepth(300);
                    hitZone.setScrollFactor(0);
                    
                    // IMPORTANT: Set interactive after creating, with draggable
                    hitZone.setInteractive({ 
                        draggable: true,
                        useHandCursor: true 
                    });
                    
                    hitZone.setData('slotIndex', index);
                    hitZone.setData('originalX', worldX);
                    hitZone.setData('originalY', worldY);
                    hitZone.setData('isBeingDragged', false);
                    
                    // Store reference for visual updates
                    hitZone.visualCircle = slot.circle;
                    
                    // Pointer events with proper state tracking
                    hitZone.on('pointerover', () => {
                        if (!hitZone.getData('isBeingDragged')) {
                            console.log(`Hovering charge ${index}`);
                            slot.circle.setScale(1.1);
                            hitZone.setStrokeStyle(2, 0x00ff00, 1);
                        }
                    });
                    
                    hitZone.on('pointerout', () => {
                        if (!hitZone.getData('isBeingDragged')) {
                            slot.circle.setScale(1);
                            hitZone.setStrokeStyle(0);
                        }
                    });
                    
                    // Click handling (for testing)
                    hitZone.on('pointerdown', (pointer) => {
                        console.log(`Charge ${index} clicked at ${pointer.x}, ${pointer.y}`);
                        // Visual feedback - flash the stroke
                        hitZone.setStrokeStyle(4, 0x00ff00, 1);
                        slot.circle.setScale(1.3);
                        this.time.delayedCall(200, () => {
                            if (hitZone.active) {
                                hitZone.setStrokeStyle(0);
                                slot.circle.setScale(1);
                            }
                        });
                    });
                    
                    // Drag handling
                    hitZone.on('dragstart', (pointer) => {
                        console.log(`Started dragging charge ${index}`);
                        hitZone.setData('isBeingDragged', true);
                        this.draggedChargeIndex = index;
                        slot.circle.setAlpha(0.5);
                        slot.circle.setScale(1.2);
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
                        console.log(`Stopped dragging charge ${index}`);
                        hitZone.setData('isBeingDragged', false);
                        
                        // Find which slot we're over
                        let targetIndex = -1;
                        this.pauseChargeSlots.forEach((targetSlot, idx) => {
                            if (idx < this.maxCharges) {
                                const targetWorldX = this.pauseMenu.x + targetSlot.x;
                                const targetWorldY = this.pauseMenu.y + targetSlot.y;
                                const dist = Phaser.Math.Distance.Between(hitZone.x, hitZone.y, targetWorldX, targetWorldY);
                                if (dist < 40) {
                                    targetIndex = idx;
                                }
                            }
                        });
                        
                        if (targetIndex !== -1 && targetIndex !== index) {
                            console.log(`Swapping charges ${index} and ${targetIndex}`);
                            this.swapCharges(index, targetIndex);
                            // Refresh the display
                            this.togglePause(); // Close
                            this.togglePause(); // Reopen to refresh
                        } else {
                            // Return to original position
                            hitZone.x = hitZone.getData('originalX');
                            hitZone.y = hitZone.getData('originalY');
                            slot.circle.x = slot.x;
                            slot.circle.y = slot.y;
                        }
                        
                        slot.circle.setAlpha(1);
                        slot.circle.setScale(1);
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
                            slot.discardBtn.setScale(1.1);
                        });
                        
                        discardHitZone.on('pointerout', () => {
                            discardHitZone.setStrokeStyle(0);
                            slot.discardBtn.setColor('#ff4444');
                            slot.discardBtn.setScale(1);
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
                        link.btn.setScale(1.1);
                        if (link.linked) {
                            link.btn.setFillStyle(0x66ff66);
                        } else {
                            link.btn.setFillStyle(0x777777);
                        }
                    });
                    
                    linkHitZone.on('pointerout', () => {
                        linkHitZone.setStrokeStyle(0);
                        link.btn.setScale(1);
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
            // Update charge groups based on links
            this.updateChargeGroups();
        }
    }
    
    
    toggleLink(index) {
        if (index >= 0 && index < this.linkButtons.length) {
            // Check if we have charges in both slots being linked
            const hasLeftCharge = index < this.charges.length;
            const hasRightCharge = (index + 1) < this.charges.length;
            
            // Only allow linking if both slots have charges
            if (!hasLeftCharge || !hasRightCharge) {
                // Flash the button red to indicate it can't be linked
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
        // Update charge slot displays
        for (let i = 0; i < this.maxCharges && i < 4; i++) {
            if (i < this.charges.length) {
                const element = this.charges[i];
                const config = this.elementConfig[element];
                if (config) {
                    // Update texture if needed
                    if (this.pauseChargeSlots[i].circle.texture.key !== config.sheet) {
                        this.pauseChargeSlots[i].circle.setTexture(config.sheet, config.frame);
                    } else {
                        this.pauseChargeSlots[i].circle.setFrame(config.frame);
                    }
                    this.pauseChargeSlots[i].circle.setVisible(true);
                    this.pauseChargeSlots[i].discardBtn.setVisible(true);
                    
                    // Update slot index data for dragging
                    this.pauseChargeSlots[i].circle.setData('slotIndex', i);
                    
                    // Reset position in case it was dragged
                    this.pauseChargeSlots[i].circle.x = this.pauseChargeSlots[i].x;
                    this.pauseChargeSlots[i].circle.y = this.pauseChargeSlots[i].y;
                }
            } else {
                this.pauseChargeSlots[i].circle.setVisible(false);
                this.pauseChargeSlots[i].discardBtn.setVisible(false);
            }
            
            // Update visibility based on max charges
            const isVisible = i < this.maxCharges;
            this.pauseChargeSlots[i].bg.setVisible(isVisible);
            this.pauseChargeSlots[i].text.setVisible(isVisible);
            
            // Update link button visibility and state
            if (i < 3 && this.linkButtons[i]) {
                const hasCurrentCharge = i < this.charges.length;
                const hasNextCharge = (i + 1) < this.charges.length;
                this.linkButtons[i].btn.setVisible(isVisible && i < this.maxCharges - 1 && hasCurrentCharge && hasNextCharge);
                this.linkButtons[i].text.setVisible(isVisible && i < this.maxCharges - 1 && hasCurrentCharge && hasNextCharge);
                
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
        
        for (let i = 0; i < this.charges.length; i++) {
            currentGroup.push(this.charges[i]);
            
            // Check if this slot is linked to the next
            if (i < this.linkButtons.length && this.linkButtons[i].linked && i < this.charges.length - 1) {
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
    }
    
    swapCharges(fromIndex, toIndex) {
        // Only swap if both indices are valid and within charges array
        if (fromIndex < this.charges.length && toIndex < this.charges.length) {
            // Swap the charges
            const temp = this.charges[fromIndex];
            this.charges[fromIndex] = this.charges[toIndex];
            this.charges[toIndex] = temp;
            
            // Update the charge UI in main game
            this.updateChargeUI();
            
            // Clear any links that might be affected
            // If we're moving charges, we should clear links between the affected slots
            if (fromIndex > 0 && this.linkButtons[fromIndex - 1]) {
                this.linkButtons[fromIndex - 1].linked = false;
            }
            if (fromIndex < this.linkButtons.length && this.linkButtons[fromIndex]) {
                this.linkButtons[fromIndex].linked = false;
            }
            if (toIndex > 0 && this.linkButtons[toIndex - 1]) {
                this.linkButtons[toIndex - 1].linked = false;
            }
            if (toIndex < this.linkButtons.length && this.linkButtons[toIndex]) {
                this.linkButtons[toIndex].linked = false;
            }
        } else if (fromIndex < this.charges.length && toIndex >= this.charges.length && toIndex < this.maxCharges) {
            // Moving to an empty slot
            const charge = this.charges.splice(fromIndex, 1)[0];
            
            // Pad with undefined if needed
            while (this.charges.length < toIndex) {
                this.charges.push(undefined);
            }
            this.charges[toIndex] = charge;
            
            // Remove undefined values
            this.charges = this.charges.filter(c => c !== undefined);
            
            // Clear affected links
            if (fromIndex > 0 && this.linkButtons[fromIndex - 1]) {
                this.linkButtons[fromIndex - 1].linked = false;
            }
            if (fromIndex < this.linkButtons.length && this.linkButtons[fromIndex]) {
                this.linkButtons[fromIndex].linked = false;
            }
            
            // Update the charge UI
            this.updateChargeUI();
        }
    }
    
    discardCharge(index, confirmed = false) {
        if (index < this.charges.length) {
            // If not confirmed, show confirmation dialog
            if (!confirmed) {
                this.showDiscardConfirmation(index);
                return;
            }
            
            // Remove the charge
            this.charges.splice(index, 1);
            
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
        
        const confirmText = this.add.text(400, 270, `Discard ${this.charges[index]} charge?`, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        confirmText.setDepth(301);
        confirmText.setScrollFactor(0);
        
        const yesText = this.add.text(350, 320, 'Yes (A)', {
            fontSize: '16px',
            color: '#44ff44'
        }).setOrigin(0.5);
        yesText.setDepth(301);
        yesText.setScrollFactor(0);
        
        const noText = this.add.text(450, 320, 'No (B)', {
            fontSize: '16px',
            color: '#ff4444'
        }).setOrigin(0.5);
        noText.setDepth(301);
        noText.setScrollFactor(0);
        
        // Store confirmation state
        this.discardConfirmation = {
            active: true,
            index: index,
            elements: [confirmBg, confirmText, yesText, noText]
        };
        
        // Add keyboard handlers for confirmation
        const handleKey = (event) => {
            if (!this.discardConfirmation || !this.discardConfirmation.active) return;
            
            if (event.key === 'y' || event.key === 'Y' || event.key === 'Enter') {
                // Confirm discard
                const idx = this.discardConfirmation.index;
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
                this.discardCharge(idx, true);
                this.input.keyboard.off('keydown', handleKey);
            } else if (event.key === 'n' || event.key === 'N' || event.key === 'Escape') {
                // Cancel discard
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
                this.input.keyboard.off('keydown', handleKey);
            }
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
            
            if (this.pauseMenuCursorIndex < 4) {
                // Hovering over a charge slot
                const slot = this.pauseChargeSlots[this.pauseMenuCursorIndex];
                this.pauseMenuCursor.x = this.pauseMenu.x + slot.x;
                this.pauseMenuCursor.y = this.pauseMenu.y + slot.y;
                // Reset to normal size for slots
                this.pauseMenuCursor.setSize(85, 85);
            } else {
                // Hovering over a link button
                const linkIndex = this.pauseMenuCursorIndex - 4;
                if (linkIndex < this.linkButtons.length) {
                    const link = this.linkButtons[linkIndex];
                    this.pauseMenuCursor.x = this.pauseMenu.x + link.btn.x;
                    this.pauseMenuCursor.y = this.pauseMenu.y + link.btn.y;
                    // Make cursor smaller for link buttons
                    this.pauseMenuCursor.setSize(35, 25);
                }
            }
        }
    }
    
    handlePauseMenuController() {
        if (!this.gamepad || !this.pauseMenu.visible) return;
        
        // Handle confirmation dialog if active
        if (this.discardConfirmation && this.discardConfirmation.active) {
            const aPressed = this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed;
            const bPressed = this.gamepad.buttons[1] && this.gamepad.buttons[1].pressed;
            
            if (aPressed && !this.prevPauseAPressed) {
                // Confirm discard
                const index = this.discardConfirmation.index;
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
                this.discardCharge(index, true);
            } else if (bPressed && !this.prevPauseBPressed) {
                // Cancel discard
                this.discardConfirmation.elements.forEach(el => el.destroy());
                this.discardConfirmation = null;
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
                    this.pauseMenuCursorIndex = 6; // 4 slots + 3 links - 1
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
                if (this.pauseMenuCursorIndex > 6) {
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
                if (this.pauseMenuCursorIndex < 4) {
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
        
        // B button - cancel selection or discard
        const bPressed = this.gamepad.buttons[1] && this.gamepad.buttons[1].pressed;
        if (bPressed && !this.prevPauseBPressed) {
            if (this.pauseMenuSelectedCharge !== -1) {
                // Cancel selection
                this.pauseChargeSlots[this.pauseMenuSelectedCharge].circle.setScale(1);
                this.pauseChargeSlots[this.pauseMenuSelectedCharge].circle.setAlpha(1);
                this.pauseMenuSelectedCharge = -1;
            } else if (this.pauseMenuCursorIndex < 4 && this.pauseMenuCursorIndex < this.charges.length) {
                // Discard charge at cursor
                this.discardCharge(this.pauseMenuCursorIndex);
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
    
    toggleSpellbook() {
        this.spellbookOpen = !this.spellbookOpen;
        this.spellbookUI.setVisible(this.spellbookOpen);
        this.updateSpellbookText();
        
        if (this.spellbookOpen) {
            // Pause physics and all timers
            this.physics.pause();
            this.time.timeScale = 0;
        } else {
            // Resume physics and timers
            this.physics.resume();
            this.time.timeScale = 1;
        }
    }
    
    toggleElementsMenu() {
        this.elementsMenuOpen = !this.elementsMenuOpen;
        this.elementsMenu.setVisible(this.elementsMenuOpen);
        
        if (this.elementsMenuOpen) {
            // Pause game and all timers when menu is open
            this.physics.pause();
            this.time.timeScale = 0;
            this.updateElementsMenu();
        } else {
            // Resume game and timers when menu is closed
            this.physics.resume();
            this.time.timeScale = 1;
        }
    }
    
    killEnemy(enemy) {
        if (enemy.isDying) return;
        
        enemy.isDying = true;
        const enemyX = enemy.x;
        const enemyY = enemy.y;
        
        if (enemy.enemyType === 'slime') {
            // Play slime death animation
            enemy.play('slime-die');
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
                    this.dropJewel(enemyX, enemyY);
                    
                    // 5% chance to drop muffin
                    if (Math.random() < 0.05) {
                        this.dropMuffin(enemyX, enemyY);
                    }
                }
                
                this.enemiesKilled[enemy.enemyType]++;
                enemy.destroy();
            });
        } else if (enemy.isElite) {
            // Elite enemy death - drop chest
            enemy.setVelocity(0, 0);
            this.tweens.add({
                targets: enemy,
                scale: 0,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    // Drop chest
                    this.dropChest(enemyX, enemyY);
                    this.enemiesKilled.elite++;
                    enemy.destroy();
                }
            });
        } else if (enemy.enemyType === 'golem') {
            // Mark as dying to prevent further updates
            enemy.isDying = true;
            // Play golem death animation
            enemy.play(`golem-${enemy.golemColor}-die`);
            enemy.setVelocity(0, 0); // Stop movement
            enemy.isAttacking = false; // Cancel any attack
            
            // Store if this is a level-up golem
            const isLevelUpGolem = enemy.isLevelUpGolem;
            
            // Wait for animation to complete
            enemy.once('animationcomplete', () => {
                if (!enemy || !enemy.active) return; // Safety check
                if (isLevelUpGolem) {
                    // Level-up golems always drop charge expansion
                    this.dropChargeExpansion(enemyX, enemyY);
                    
                    // Also drop some jewels as bonus
                    for (let i = 0; i < 5; i++) {
                        const offsetX = (Math.random() - 0.5) * 40;
                        const offsetY = (Math.random() - 0.5) * 40;
                        this.dropJewel(enemyX + offsetX, enemyY + offsetY);
                    }
                } else {
                    // Regular golem always drops 1 random element
                    this.dropJewel(enemyX, enemyY);
                    this.dropJewel(enemyX + 20, enemyY);
                    
                    // Always drop 1 random primary element
                    const element = this.primaryElements[Math.floor(Math.random() * this.primaryElements.length)];
                    this.dropElementOrb(enemyX, enemyY, element);
                    
                    if (Math.random() < 0.3) {
                        this.dropMuffin(enemyX, enemyY);
                    }
                }
                
                this.enemiesKilled.golem++;
                enemy.destroy();
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
                    this.dropJewel(enemyX, enemyY);
                    
                    // 5% chance to drop muffin
                    if (Math.random() < 0.05) {
                        this.dropMuffin(enemyX, enemyY);
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

    spawnEnemy() {
        // Spawn enemies just outside viewport
        const camera = this.cameras.main;
        const viewportWidth = camera.width;
        const viewportHeight = camera.height;
        const spawnMargin = 50; // How far outside viewport to spawn
        
        // Calculate spawn position outside current viewport
        const side = Phaser.Math.Between(0, 3); // 0=top, 1=right, 2=bottom, 3=left
        let x, y;
        
        switch(side) {
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
        x = Phaser.Math.Clamp(x, 50, 3950);  // Updated for wider world
        y = Phaser.Math.Clamp(y, 50, 2110);  // Updated for taller world (2160 - 50)
        
        // Randomly choose enemy type - weighted by difficulty
        let enemyType;
        const rand = Math.random();
        
        // No more golems in regular spawning - only trees and slimes
        if (rand < 0.5) {
            enemyType = 'tree';
        } else {
            enemyType = 'slime';
        }
        
        if (enemyType === 'tree') {
            const enemy = this.physics.add.sprite(x, y, 'enemy-walk', 0);
            
            const scaleFactor = 1.2;
            enemy.setScale(scaleFactor);
            enemy.health = 4;  // Fixed health
            enemy.maxHealth = enemy.health;
            enemy.enemyType = 'tree';
            enemy.play('enemy-walking');
            enemy.body.setSize(20, 30);
            enemy.body.setOffset(5, 15); // Center narrower hitbox and move down
            
            this.enemies.add(enemy);
        } else if (enemyType === 'slime') {
            // Spawn slime enemy
            const slime = this.physics.add.sprite(x, y, 'slime-idle-0');
            
            const scaleFactor = 1.5; // Slimes are a bit bigger
            slime.setScale(scaleFactor);
            slime.health = 3; // Fixed health
            slime.maxHealth = slime.health;
            slime.enemyType = 'slime';
            slime.moveSpeed = 32; // Slimes are 20% slower (was 40, now 32)
            slime.generation = 0; // Track slime generation (0 = original, 1 = first split, etc.)
            slime.play('slime-idle');
            slime.body.setSize(32, 24);
            slime.body.setOffset(0, 8); // Adjust hitbox for slime shape
            
            this.enemies.add(slime);
        }
    }
    
    spawnLevelUpGolem() {
        // Spawn a golem near the wizard
        const angle = Math.random() * Math.PI * 2;
        const distance = 200; // Fixed distance from wizard
        
        const x = this.wizard.x + Math.cos(angle) * distance;
        const y = this.wizard.y + Math.sin(angle) * distance;
        
        // Clamp to world bounds
        const spawnX = Phaser.Math.Clamp(x, 100, 3900);
        const spawnY = Phaser.Math.Clamp(y, 100, 2060);  // Updated for taller world
        
        // Randomly choose color
        const golemColor = Math.random() < 0.5 ? 'orange' : 'blue';
        
        const golem = this.physics.add.sprite(spawnX, spawnY, `golem-${golemColor}-walk`, 0);
        
        // Scale based on level, not difficulty
        const scaleFactor = 3.0 + (this.playerLevel * 0.1); // Gets slightly bigger with level
        golem.setScale(scaleFactor);
        golem.health = Math.floor(7.5 + (this.playerLevel * 3)); // 50% reduction
        golem.maxHealth = golem.health;
        golem.enemyType = 'golem';
        golem.golemColor = golemColor;
        golem.moveSpeed = 25;
        golem.isLevelUpGolem = true; // Mark as special golem that drops charge expansion
        
        // Start with walk animation
        golem.play(`golem-${golemColor}-walk`);
        
        // Adjust physics body to match visual size better
        // Golem sprite is 90x64, scaled by ~3x
        golem.body.setSize(30, 40);
        golem.body.setOffset(30, 20);
        
        this.enemies.add(golem);
        
        // Special spawn effect
        const spawnEffect = this.add.circle(spawnX, spawnY, 50, 0xffaa00, 0.8);
        spawnEffect.setDepth(10);
        this.tweens.add({
            targets: spawnEffect,
            scale: { from: 0, to: 3 },
            alpha: { from: 1, to: 0 },
            duration: 500,
            onComplete: () => spawnEffect.destroy()
        });
        
        // Announcement text
        const bossText = this.add.text(400, 200, 'GOLEM GUARDIAN APPEARS!', {
            fontSize: '32px',
            color: '#ff6666',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        bossText.setScrollFactor(0);
        bossText.setDepth(200);
        
        this.tweens.add({
            targets: bossText,
            scale: { from: 0.5, to: 1.2 },
            duration: 500,
            yoyo: true,
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                        targets: bossText,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => bossText.destroy()
                    });
                });
            }
        });
    }
    
    dropChargeExpansion(x, y) {
        if (!this.textures.exists('charge-expansion')) {
            const graphics = this.add.graphics();
            // Draw a special crystal
            graphics.fillStyle(0xaa00ff, 1);
            graphics.fillRect(5, 0, 10, 20);
            graphics.fillRect(0, 5, 20, 10);
            // Add sparkle
            graphics.fillStyle(0xffffff, 0.8);
            graphics.fillCircle(10, 10, 3);
            graphics.generateTexture('charge-expansion', 20, 20);
            graphics.destroy();
        }
        
        const expansion = this.physics.add.sprite(x, y, 'charge-expansion');
        expansion.setDepth(26);
        expansion.body.setVelocity(0, 0);
        expansion.setScale(1.5);
        
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
        
        // Create a group for charge expansions if it doesn't exist
        if (!this.chargeExpansions) {
            this.chargeExpansions = this.physics.add.group();
            this.physics.add.overlap(this.wizard, this.chargeExpansions, this.collectChargeExpansion, null, this);
        }
        
        this.chargeExpansions.add(expansion);
    }
    
    collectChargeExpansion(wizard, expansion) {
        // Increase max charges
        this.maxCharges = Math.min(this.maxCharges + 1, 4); // Cap at 4
        this.updateChargeUI();
        
        // Add a random element orb as bonus
        const elements = ['fire', 'water', 'earth', 'rock', 'air', 'lightning', 'holy', 'arcane', 'dust'];
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
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
        
        // Don't destroy enemy on contact, just damage player
        this.playerHealth -= 10;
        this.updateHealthBar();
        this.updateWizardHealthBar();
        
        // Visual feedback only - no knockback
        wizard.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            wizard.clearTint();
        });
        
        // Set invulnerability period
        this.invulnerable = true;
        this.time.delayedCall(1000, () => {
            this.invulnerable = false;
        });
        
        if (this.playerHealth <= 0) {
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

    projectileHitEnemy(projectile, enemy) {
        // Deal damage based on projectile type and charge count
        const baseDamage = projectile.isExplosive ? 4 : 2;
        const damage = baseDamage * (projectile.damage || 1);
        enemy.health -= damage;
        
        // Apply knockback (unless elite with no stagger)
        if (!enemy.noStagger) {
            const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, enemy.x, enemy.y);
            const knockbackForce = projectile.isExplosive ? 500 : 300;
            enemy.setVelocity(
                Math.cos(angle) * knockbackForce,
                Math.sin(angle) * knockbackForce
            );
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
        
        // Visual feedback - flash red and play hurt animation for golems
        enemy.setTint(0xff0000);
        
        // Play hurt animation for golems if not dying
        if (enemy.enemyType === 'golem' && enemy.health > 0 && !enemy.isDying && !enemy.isAttacking) {
            const currentAnim = enemy.anims.currentAnim;
            enemy.play(`golem-${enemy.golemColor}-hurt`);
            
            // Return to previous animation after hurt
            enemy.once('animationcomplete', () => {
                if (enemy.active && !enemy.isDying) {
                    // Always return to walk animation
                    enemy.play(`golem-${enemy.golemColor}-walk`);
                }
            });
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
        
        // Handle chain lightning
        if (projectile.chainCount && projectile.chainCount > 0) {
            // Mark this enemy as hit
            if (!projectile.hitEnemies) projectile.hitEnemies = [];
            projectile.hitEnemies.push(enemy);
            
            // Find next target
            let nearestEnemy = null;
            let minDistance = 200; // Max chain distance
            
            this.enemies.children.entries.forEach(otherEnemy => {
                if (otherEnemy.active && otherEnemy !== enemy && !projectile.hitEnemies.includes(otherEnemy)) {
                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, otherEnemy.x, otherEnemy.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestEnemy = otherEnemy;
                    }
                }
            });
            
            if (nearestEnemy) {
                // Redirect projectile to new target
                projectile.chainCount--;
                const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, nearestEnemy.x, nearestEnemy.y);
                projectile.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
                
                // Visual chain effect
                const chain = this.add.graphics();
                chain.lineStyle(2, 0x44aaff, 0.8);
                chain.moveTo(enemy.x, enemy.y);
                chain.lineTo(nearestEnemy.x, nearestEnemy.y);
                chain.strokePath();
                chain.setDepth(5);
                
                this.tweens.add({
                    targets: chain,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => chain.destroy()
                });
                
                return; // Don't destroy projectile yet
            }
        }
        
        // Handle fire projectiles that create pools
        if (projectile.createFirePool) {
            this.createFirePool(projectile.x, projectile.y, projectile.linkedCount || 1);
        }
        
        // Handle lava projectiles that leave lava pools
        if (projectile.leavesLavaPool) {
            this.createFirePool(projectile.x, projectile.y); // Reuse fire pool for lava
        }
        
        // Handle poison damage over time
        if (projectile.element === 'poison' && projectile.poisonDamage) {
            enemy.poisoned = true;
            enemy.poisonDamage = projectile.poisonDamage;
            enemy.setTint(0x00ff00);
            
            // Apply poison damage over time
            let poisonTicks = 3;
            const poisonInterval = this.time.addEvent({
                delay: 500,
                callback: () => {
                    if (enemy.active && enemy.poisoned) {
                        enemy.health -= projectile.poisonDamage / 3;
                        enemy.setTint(0x00ff00);
                        this.time.delayedCall(100, () => {
                            if (enemy.active) enemy.setTint(0x00ff00);
                        });
                        
                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        }
                        
                        poisonTicks--;
                        if (poisonTicks <= 0) {
                            enemy.poisoned = false;
                            if (enemy.active) enemy.clearTint();
                            poisonInterval.destroy();
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
        
        
        // Don't destroy water orbs on hit, they keep orbiting
        if (projectile.element === 'water' && this.waterOrbs.includes(projectile)) {
            return;
        }
        
        // Destroy projectile unless it's a piercing type
        if (!projectile.isPiercing && !projectile.chainCount) {
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
    
    dropJewel(x, y) {
        if (!this.textures.exists('jewel')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x44ffff, 1);
            graphics.fillCircle(0, 0, 5);
            graphics.lineStyle(2, 0xffffff, 1);
            graphics.strokeCircle(0, 0, 5);
            graphics.generateTexture('jewel', 12, 12);
            graphics.destroy();
        }
        
        const jewel = this.physics.add.sprite(x, y, 'jewel');
        jewel.setDepth(25);
        jewel.body.setVelocity(0, 0);
        
        // Add floating animation
        this.tweens.add({
            targets: jewel,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.jewels.add(jewel);
    }
    
    dropMuffin(x, y) {
        if (!this.textures.exists('muffin')) {
            const graphics = this.add.graphics();
            // Draw at origin (0,0) then generate texture
            graphics.fillStyle(0x8B4513, 1);
            graphics.fillCircle(7, 9, 6);
            // Muffin top (lighter brown)
            graphics.fillStyle(0xD2691E, 1);
            graphics.fillCircle(7, 5, 7);
            // Chocolate chips
            graphics.fillStyle(0x654321, 1);
            graphics.fillCircle(4, 4, 1);
            graphics.fillCircle(9, 5, 1);
            graphics.fillCircle(6, 7, 1);
            graphics.generateTexture('muffin', 14, 14);
            graphics.destroy();
        }
        
        const muffin = this.physics.add.sprite(x, y, 'muffin');
        muffin.setDepth(25);
        muffin.body.setVelocity(0, 0);
        muffin.setScale(1.5); // Make it bigger to be more visible
        
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
        // Add XP
        const xpGain = Math.ceil(2 * this.difficultyMultiplier);
        this.playerXP += xpGain;
        this.itemsCollected.jewels++;
        
        // Check for level up
        while (this.playerXP >= this.xpToNextLevel) {
            this.playerXP -= this.xpToNextLevel;
            this.playerLevel++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
            
            // Spawn a golem every 2 levels (2, 4, 6, etc.)
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
    }
    
    collectElementOrb(wizard, orb) {
        if (this.charges.length < this.maxCharges) {
            this.charges.push(orb.element);
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
            switch(element) {
                case 'fire':
                    this.fireFireProjectile(currentGroup);
                    break;
                case 'water':
                    this.createWaterOrb();
                    break;
                case 'lightning':
                    this.fireLightningProjectile();
                    break;
                case 'earth':
                    // Pass group size to determine width
                    this.createEarthquake(currentGroup.length);
                    break;
                case 'rock':
                    this.fireRockProjectile();
                    break;
                case 'air':
                    this.createAirBlast();
                    break;
                case 'holy':
                    this.createHolyLight();
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
                    this.createSteamBurst();
                    break;
                case 'poison':
                    this.firePoisonProjectile();
                    break;
                case 'volcano':
                    this.createVolcanicEruption();
                    break;
                case 'ice':
                    this.fireIceProjectile();
                    break;
                case 'meteor':
                    this.fireMeteorProjectile();
                    break;
                case 'mud':
                    this.createMudPuddle();
                    break;
                case 'thunder':
                    this.fireThunderBolt();
                    break;
                case 'crystal':
                    this.fireCrystalProjectile();
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
        
        switch(combo) {
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
            default:
                // Fallback to firing single element of first type
                const element = elements[0];
                switch(element) {
                    case 'fire':
                        this.fireFireProjectile(currentGroup);
                        break;
                    case 'water':
                        this.createWaterOrb();
                        break;
                    case 'lightning':
                        this.fireLightningBolt();
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
                switch(element) {
                    case 'fire':
                        this.fireFireProjectile(currentGroup);
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
    
    fireFireProjectile(currentGroup = ['fire']) {
        if (!this.textures.exists('fire-auto-proj')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xff4444, 1);
            graphics.fillCircle(6, 6, 6);
            graphics.generateTexture('fire-auto-proj', 12, 12);
            graphics.destroy();
        }
        
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'fire-auto-proj');
        projectile.element = 'fire';
        projectile.damage = 1;
        projectile.setDepth(5);
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 300;
        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        
        this.projectiles.add(projectile);
        
        // When projectile hits enemy, create fire pool
        projectile.createFirePool = true;
        projectile.linkedCount = currentGroup.length; // Pass linked count
    }
    
    createWaterOrb() {
        // Check if we already have active water orbs
        const activeOrbs = this.waterOrbs.filter(orb => orb && orb.active).length;
        
        // Don't create more orbs if we already have one (unless multiple water charges)
        if (activeOrbs > 0) {
            return;
        }
        
        // For single water charge, create only ONE orb that expires
        if (!this.textures.exists('water-auto-orb')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x4444ff, 1);
            graphics.fillCircle(6, 6, 6);
            graphics.generateTexture('water-auto-orb', 12, 12);
            graphics.destroy();
        }
        
        const orb = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'water-auto-orb');
        orb.element = 'water';
        orb.damage = 2;
        orb.setDepth(5);
        orb.startAngle = Math.random() * Math.PI * 2;
        orb.currentAngle = orb.startAngle; // Store current angle
        orb.orbitRadius = 60;
        orb.startTime = this.time.now;
        orb.lifespan = 5000; // Water orb lasts 5 seconds
        
        this.waterOrbs.push(orb);
        this.projectiles.add(orb);
        
        // Remove orb after lifespan
        this.time.delayedCall(orb.lifespan, () => {
            if (orb.active) {
                const index = this.waterOrbs.indexOf(orb);
                if (index > -1) {
                    this.waterOrbs.splice(index, 1);
                }
                orb.destroy();
            }
        });
    }
    
    fireLightningProjectile() {
        if (!this.textures.exists('lightning-auto-proj')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffff44, 1);
            graphics.fillCircle(6, 6, 6);
            graphics.generateTexture('lightning-auto-proj', 12, 12);
            graphics.destroy();
        }
        
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'lightning-auto-proj');
        projectile.element = 'lightning';
        projectile.damage = 2;
        projectile.setDepth(5);
        projectile.isHoming = true;
        
        this.projectiles.add(projectile);
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
    fireRockProjectile() {
        // Rock element - heavy projectile that stuns
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'element-symbols', 3);
        projectile.element = 'rock';
        projectile.damage = 3;
        projectile.setDepth(5);
        projectile.setScale(1.2);
        
        // Directional firing
        const speed = 250; // Slower than normal
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
        projectile.stunDuration = 1000; // Stun for 1 second
        
        this.projectiles.add(projectile);
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
        
        // Push enemies away
        this.enemies.children.entries.forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.wizard.x, this.wizard.y);
            if (distance < 150) {
                const angle = Phaser.Math.Angle.Between(this.wizard.x, this.wizard.y, enemy.x, enemy.y);
                const force = (150 - distance) * 5;
                enemy.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
                enemy.health -= 1;
                if (enemy.health <= 0) {
                    this.killEnemy(enemy);
                }
            }
        });
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
    
    fireArcaneProjectile() {
        // Arcane element - homing projectile
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'element-symbols', 7);
        projectile.element = 'arcane';
        projectile.damage = 2;
        projectile.setDepth(5);
        projectile.isHoming = true;
        projectile.homingSpeed = 200;
        
        // Add particle trail
        this.tweens.add({
            targets: projectile,
            scale: { from: 1, to: 0.8 },
            duration: 200,
            yoyo: true,
            repeat: -1
        });
        
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
    
    createFirePool(x, y, linkedCount = 1) {
        if (!this.textures.exists('fire-pool')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xff4444, 0.6);
            graphics.fillCircle(15, 15, 15);
            graphics.generateTexture('fire-pool', 30, 30);
            graphics.destroy();
        }
        
        const pool = this.physics.add.sprite(x, y, 'fire-pool');
        pool.setDepth(1);
        pool.body.setSize(30, 30);
        pool.startTime = this.time.now;
        pool.linkedCount = linkedCount; // Store linked fire count
        
        // Burning animation
        this.tweens.add({
            targets: pool,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0.8, to: 0.4 },
            duration: 300,
            yoyo: true,
            repeat: -1
        });
        
        this.firePools.push(pool);
        
        // Auto-explode after 3 seconds
        this.time.delayedCall(3000, () => {
            if (pool.active) {
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
        if (!this.textures.exists('meteor')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xff8844, 1);
            graphics.fillCircle(12, 12, 12);
            graphics.fillStyle(0x44ff44, 1);
            graphics.fillCircle(12, 12, 6);
            graphics.generateTexture('meteor', 24, 24);
            graphics.destroy();
        }
        
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
        
        const meteor = this.physics.add.sprite(targetX, targetY - 300, 'meteor');
        meteor.setDepth(10);
        meteor.setScale(0.5);
        
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
                
                // Damage enemies in area
                this.enemies.children.entries.forEach(enemy => {
                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, targetX, targetY);
                    if (distance < 80) {
                        enemy.health -= 5;
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
        if (!this.textures.exists('mud-trap')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x8B4513, 0.8);
            graphics.fillCircle(30, 30, 30);
            graphics.fillStyle(0x4444ff, 0.5);
            graphics.fillCircle(30, 30, 20);
            graphics.generateTexture('mud-trap', 60, 60);
            graphics.destroy();
        }
        
        const trap = this.physics.add.sprite(this.wizard.x + (this.wizard.flipX ? -50 : 50), this.wizard.y, 'mud-trap');
        trap.setDepth(1);
        trap.body.setSize(60, 60);
        
        // Bubble animation
        this.tweens.add({
            targets: trap,
            scale: { from: 0.8, to: 1.1 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        
        // Slow enemies
        const slowInterval = this.time.addEvent({
            delay: 100,
            callback: () => {
                this.enemies.children.entries.forEach(enemy => {
                    if (!enemy.active || !trap.active) return;
                    
                    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, trap.x, trap.y);
                    if (distance < 40) {
                        enemy.setVelocityX(enemy.body.velocity.x * 0.3);
                        enemy.setVelocityY(enemy.body.velocity.y * 0.3);
                        enemy.setTint(0x8B4513);
                        enemy.health -= 0.2;
                        
                        if (enemy.health <= 0) {
                            this.killEnemy(enemy);
                        }
                    }
                });
            },
            repeat: 40
        });
        
        // Remove after 4 seconds
        this.time.delayedCall(4000, () => {
            trap.destroy();
            slowInterval.destroy();
            this.enemies.children.entries.forEach(enemy => {
                if (enemy.active && enemy.tintTopLeft === 0x8B4513) {
                    enemy.clearTint();
                }
            });
        });
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
                
                switch(element) {
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
        // Lava element - leaves burning pools
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'element-symbols2', 0);
        projectile.element = 'lava';
        projectile.damage = 2;
        projectile.setDepth(5);
        projectile.setScale(1.2);
        
        const speed = 250;
        const angle = Math.random() * Math.PI * 2;
        projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        
        this.projectiles.add(projectile);
        
        // Leave lava pools on impact
        projectile.leavesLavaPool = true;
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
    
    createVolcanicEruption() {
        // Volcano element - eruption at wizard location
        const eruption = this.add.circle(this.wizard.x, this.wizard.y, 20, 0xcc3300);
        eruption.setDepth(3);
        
        // Expand and spawn lava projectiles
        this.tweens.add({
            targets: eruption,
            scale: { from: 1, to: 4 },
            alpha: { from: 1, to: 0.3 },
            duration: 1000,
            onComplete: () => eruption.destroy()
        });
        
        // Spawn multiple lava projectiles
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const lava = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'element-symbols2', 3);
            lava.setScale(0.8);
            lava.damage = 2;
            lava.setDepth(5);
            
            const speed = 200;
            lava.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            
            this.projectiles.add(lava);
            
            // Destroy after 1 second
            this.time.delayedCall(1000, () => {
                if (lava.active) lava.destroy();
            });
        }
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
    
    fireMeteorProjectile() {
        // Meteor element - falls from above on nearest enemy
        let nearestEnemy = null;
        let minDistance = Infinity;
        
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
                const distance = Phaser.Math.Distance.Between(this.wizard.x, this.wizard.y, enemy.x, enemy.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestEnemy = enemy;
                }
            }
        });
        
        if (nearestEnemy) {
            const targetX = nearestEnemy.x;
            const targetY = nearestEnemy.y;
            
            // Create meteor high above target
            const meteor = this.physics.add.sprite(targetX, targetY - 300, 'element-symbols2', 5);
            meteor.setScale(2);
            meteor.damage = 4;
            meteor.setDepth(5);
            
            // Fall animation
            this.tweens.add({
                targets: meteor,
                y: targetY,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    // Explosion effect
                    const explosion = this.add.circle(targetX, targetY, 60, 0xff8800, 0.8);
                    explosion.setDepth(4);
                    
                    this.tweens.add({
                        targets: explosion,
                        scale: { from: 0, to: 1.5 },
                        alpha: { from: 0.8, to: 0 },
                        duration: 300,
                        onComplete: () => explosion.destroy()
                    });
                    
                    // Damage all enemies in area
                    this.enemies.children.entries.forEach(enemy => {
                        if (enemy.active) {
                            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, targetX, targetY);
                            if (dist < 80) {
                                enemy.health -= 4;
                                if (enemy.health <= 0) {
                                    this.killEnemy(enemy);
                                }
                            }
                        }
                    });
                    
                    meteor.destroy();
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
    
    fireThunderBolt() {
        // Thunder element - instant strike on random enemy
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
            
            // Thunder sound effect visual
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
        // Randomly choose enemy type
        const types = ['tree', 'slime', 'golem'];
        const eliteType = types[Math.floor(Math.random() * types.length)];
        
        // Spawn outside viewport
        const camera = this.cameras.main;
        const viewportWidth = camera.width;
        const viewportHeight = camera.height;
        const spawnMargin = 100;
        
        let x, y;
        const side = Phaser.Math.Between(0, 3);
        switch(side) {
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
        
        let elite;
        if (eliteType === 'tree') {
            elite = this.physics.add.sprite(x, y, 'enemy-walk', 0);
            elite.setScale(1.8); // 50% larger
            elite.health = 12; // 300% health
            elite.enemyType = 'tree';
            elite.play('enemy-walking');
            elite.body.setSize(30, 45);
            elite.body.setOffset(7, 22);
        } else if (eliteType === 'slime') {
            elite = this.physics.add.sprite(x, y, 'slime-idle-0');
            elite.setScale(2.25); // 50% larger
            elite.health = 9; // 300% health
            elite.enemyType = 'slime';
            elite.moveSpeed = 32;
            elite.generation = 0;
            elite.play('slime-idle');
            elite.body.setSize(48, 36);
            elite.body.setOffset(0, 12);
        } else {
            const golemColor = Math.random() < 0.5 ? 'orange' : 'blue';
            elite = this.physics.add.sprite(x, y, `golem-${golemColor}-walk`, 0);
            elite.setScale(4.5); // 50% larger than base 3.0
            elite.health = 24; // ~300% of base 7.5
            elite.enemyType = 'golem';
            elite.golemColor = golemColor;
            elite.moveSpeed = 25;
            elite.play(`golem-${golemColor}-walk`);
            elite.body.setSize(45, 60);
            elite.body.setOffset(45, 30);
        }
        
        elite.isElite = true;
        elite.noStagger = true; // Cannot be staggered
        elite.setTint(0xff00ff); // Purple tint for elites
        elite.maxHealth = elite.health;
        
        this.enemies.add(elite);
        
        // Announcement
        const eliteText = this.add.text(this.wizard.x, this.wizard.y - 100, 'ELITE ENEMY SPAWNED!', {
            fontSize: '28px',
            color: '#ff00ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        eliteText.setOrigin(0.5);
        eliteText.setDepth(100);
        
        this.tweens.add({
            targets: eliteText,
            y: this.wizard.y - 150,
            alpha: 0,
            duration: 2000,
            onComplete: () => eliteText.destroy()
        });
    }
    
    dropChest(x, y) {
        if (!this.textures.exists('chest')) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0x8b4513, 1);
            graphics.fillRect(0, 5, 30, 20);
            graphics.fillStyle(0xffd700, 1);
            graphics.fillRect(12, 0, 6, 10);
            graphics.generateTexture('chest', 30, 25);
            graphics.destroy();
        }
        
        const chest = this.physics.add.sprite(x, y, 'chest');
        chest.setDepth(25);
        chest.body.setVelocity(0, 0);
        chest.setScale(1.5);
        
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
            scale: { from: 1.5, to: 1.8 },
            alpha: { from: 1, to: 0.8 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        this.chests.add(chest);
    }
    
    openChest(wizard, chest) {
        // Pause physics immediately
        this.physics.pause();
        
        // Store chest selection state
        this.chestSelectionActive = true;
        this.chestCursorIndex = 0;
        this.chestRewardType = null;
        
        // Create reward selection UI
        const selectionBg = this.add.rectangle(400, 300, 750, 450, 0x000000, 0.9);
        selectionBg.setStrokeStyle(3, 0xffd700);
        selectionBg.setScrollFactor(0);
        selectionBg.setDepth(200);
        
        const title = this.add.text(400, 120, 'Choose Your Reward!', {
            fontSize: '32px',
            color: '#ffd700',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(201);
        
        const controlHint = this.add.text(400, 480, 'Use LEFT/RIGHT to select, A/SPACE to confirm', {
            fontSize: '14px',
            color: '#aaaaaa'
        });
        controlHint.setOrigin(0.5);
        controlHint.setScrollFactor(0);
        controlHint.setDepth(201);
        
        // Create three reward type buttons
        const buttons = [];
        const rewardTypes = [
            {
                type: 'link',
                title: 'LINK SLOT',
                icon: '🔗',
                description: 'Add a link between element slots',
                color: 0x44ff44
            },
            {
                type: 'element',
                title: 'PRIMARY ELEMENT',
                icon: '⚡',
                description: 'Choose from 3 primary elements',
                color: 0x4444ff
            },
            {
                type: 'fusion',
                title: 'FUSION RITUAL',
                icon: '🔮',
                description: 'Combine 2 elements into a new one',
                color: 0xff44ff
            }
        ];
        
        for (let i = 0; i < 3; i++) {
            const xPos = 180 + i * 220;
            const reward = rewardTypes[i];
            
            const button = this.add.container(xPos, 280);
            button.setScrollFactor(0);
            button.setDepth(202);
            
            const bg = this.add.rectangle(0, 0, 200, 280, 0x333333);
            bg.setStrokeStyle(3, i === 0 ? 0xffff00 : 0xffffff);
            bg.setInteractive();
            
            // Icon representation
            const iconBg = this.add.circle(0, -80, 40, reward.color, 0.8);
            iconBg.setStrokeStyle(3, reward.color);
            
            const icon = this.add.text(0, -80, reward.icon, {
                fontSize: '48px'
            });
            icon.setOrigin(0.5);
            
            const name = this.add.text(0, -20, reward.title, {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            name.setOrigin(0.5);
            
            const description = this.add.text(0, 40, reward.description, {
                fontSize: '14px',
                color: '#cccccc',
                align: 'center',
                wordWrap: { width: 180 }
            });
            description.setOrigin(0.5);
            
            button.add([bg, iconBg, icon, name, description]);
            buttons.push({ container: button, type: reward.type, bg: bg });
            
            bg.on('pointerdown', () => {
                this.selectChestReward(reward.type, chest);
            });
            
            bg.on('pointerover', () => {
                bg.setFillStyle(0x555555);
            });
            
            bg.on('pointerout', () => {
                bg.setFillStyle(0x333333);
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
    }
    
    selectChestReward(rewardType, chest) {
        // Clear existing UI
        if (this.chestUI) {
            this.chestUI.bg.destroy();
            this.chestUI.title.destroy();
            this.chestUI.controlHint.destroy();
            this.chestUI.buttons.forEach(btn => btn.container.destroy());
        }
        
        if (rewardType === 'link') {
            this.showLinkReward();
            chest.destroy();
        } else if (rewardType === 'element') {
            this.showElementReward();
            chest.destroy();
        } else if (rewardType === 'fusion') {
            this.showFusionReward();
            chest.destroy();
        }
    }
    
    showLinkReward() {
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
    
    showElementReward() {
        // Create new UI for element selection
        const selectionBg = this.add.rectangle(400, 300, 700, 400, 0x000000, 0.9);
        selectionBg.setStrokeStyle(3, 0xffd700);
        selectionBg.setScrollFactor(0);
        selectionBg.setDepth(200);
        
        const title = this.add.text(400, 130, 'Choose a Primary Element!', {
            fontSize: '28px',
            color: '#ffd700',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(201);
        
        // Generate 3 random primary elements
        const choices = [];
        while (choices.length < 3) {
            const element = this.primaryElements[Math.floor(Math.random() * this.primaryElements.length)];
            if (!choices.includes(element)) {
                choices.push(element);
            }
        }
        
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
        fusionBg.setDepth(200);
        
        const title = this.add.text(400, 100, 'FUSION RITUAL', {
            fontSize: '32px',
            color: '#ff44ff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(201);
        
        const instruction = this.add.text(400, 140, 'Select two elements to combine', {
            fontSize: '16px',
            color: '#ffffff'
        });
        instruction.setOrigin(0.5);
        instruction.setScrollFactor(0);
        instruction.setDepth(201);
        
        // Show current elements for selection
        const elementButtons = [];
        const selectedElements = [];
        
        for (let i = 0; i < this.charges.length; i++) {
            const element = this.charges[i];
            const config = this.elementConfig[element];
            const xPos = 200 + (i % 4) * 100;
            const yPos = 220 + Math.floor(i / 4) * 100;
            
            const container = this.add.container(xPos, yPos);
            container.setScrollFactor(0);
            container.setDepth(202);
            
            const bg = this.add.circle(0, 0, 40, 0x333333);
            bg.setStrokeStyle(2, 0xffffff);
            bg.setInteractive();
            
            const sprite = this.add.sprite(0, 0, config.sheet, config.frame);
            sprite.setScale(0.2);
            
            const name = this.add.text(0, 50, config.name, {
                fontSize: '12px',
                color: '#ffffff'
            });
            name.setOrigin(0.5);
            
            container.add([bg, sprite, name]);
            elementButtons.push({ container, element, bg, selected: false });
            
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
                    bg.setStrokeStyle(2, 0xffffff);
                    
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
        
        // Cancel button
        const cancelBtn = this.add.text(400, 450, 'Cancel', {
            fontSize: '18px',
            color: '#ff6666',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        });
        cancelBtn.setOrigin(0.5);
        cancelBtn.setScrollFactor(0);
        cancelBtn.setDepth(202);
        cancelBtn.setInteractive();
        
        cancelBtn.on('pointerdown', () => {
            fusionBg.destroy();
            title.destroy();
            instruction.destroy();
            elementButtons.forEach(btn => btn.container.destroy());
            cancelBtn.destroy();
            if (this.fusionButton) this.fusionButton.destroy();
            this.closeChestUI();
        });
        
        cancelBtn.on('pointerover', () => {
            cancelBtn.setScale(1.1);
        });
        
        cancelBtn.on('pointerout', () => {
            cancelBtn.setScale(1);
        });
        
        // Store for cleanup
        this.fusionUI = {
            bg: fusionBg,
            title,
            instruction,
            buttons: elementButtons,
            cancelBtn
        };
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
        this.fusionButton.setDepth(203);
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
        // For now, create a random non-primary element
        const nonPrimaryElements = Object.keys(this.elementConfig).filter(e => !this.primaryElements.includes(e));
        const result = nonPrimaryElements[Math.floor(Math.random() * nonPrimaryElements.length)];
        
        // Remove the two elements from charges
        elements.forEach(element => {
            const index = this.charges.indexOf(element);
            if (index > -1) {
                this.charges.splice(index, 1);
            }
        });
        
        // Add the result
        this.charges.push(result);
        this.updateChargeUI();
        this.updateChargeGroups();
        
        // Add to discovered elements
        if (!this.discoveredElements.has(result)) {
            this.discoveredElements.add(result);
        }
        
        // Visual feedback
        const config = this.elementConfig[result];
        const successText = this.add.text(400, 300, `Fusion successful! Created ${config.name}!`, {
            fontSize: '28px',
            color: config.color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        successText.setOrigin(0.5);
        successText.setScrollFactor(0);
        successText.setDepth(250);
        
        // Clean up fusion UI
        if (this.fusionUI) {
            this.fusionUI.bg.destroy();
            this.fusionUI.title.destroy();
            this.fusionUI.instruction.destroy();
            this.fusionUI.buttons.forEach(btn => btn.container.destroy());
            this.fusionUI.cancelBtn.destroy();
            if (this.fusionButton) this.fusionButton.destroy();
        }
        
        this.time.delayedCall(2500, () => {
            successText.destroy();
            this.closeChestUI();
        });
    }
    
    setupElementSelection(selectionBg, title, choices) {
        const chargesFull = this.charges.length >= this.maxCharges;
        const hintText = chargesFull ? 
            'Elements full! Use LEFT/RIGHT to select, A/SPACE to replace element' : 
            'Use LEFT/RIGHT to select, A/SPACE to confirm';
        
        const controlHint = this.add.text(400, 470, hintText, {
            fontSize: '14px',
            color: '#aaaaaa'
        });
        controlHint.setOrigin(0.5);
        controlHint.setScrollFactor(0);
        controlHint.setDepth(201);
        
        // Show current charges if full
        let chargeDisplay = null;
        if (chargesFull) {
            chargeDisplay = this.add.container(400, 370);
            chargeDisplay.setScrollFactor(0);
            chargeDisplay.setDepth(201);
            
            const chargeLabel = this.add.text(0, -20, 'Current elements (select one to replace):', {
                fontSize: '12px',
                color: '#ffaa44'
            });
            chargeLabel.setOrigin(0.5);
            chargeDisplay.add(chargeLabel);
            
            // Show current charges
            const chargeButtons = [];
            for (let i = 0; i < this.charges.length; i++) {
                const charge = this.charges[i];
                const chargeConfig = this.elementConfig[charge];
                
                const xPos = -60 + i * 40;
                const chargeSprite = this.add.sprite(xPos, 0, chargeConfig.sheet, chargeConfig.frame);
                chargeSprite.setScale(0.15);
                chargeSprite.setInteractive();
                
                // Add selection ring
                const selectionRing = this.add.graphics();
                selectionRing.lineStyle(3, 0xff0000, 1);
                selectionRing.strokeCircle(xPos, 0, 25);
                selectionRing.setVisible(false);
                chargeDisplay.add(selectionRing);
                
                chargeSprite.on('pointerover', () => {
                    chargeSprite.setScale(0.2);
                    chargeSprite.setTint(0xff6666);
                });
                
                chargeSprite.on('pointerout', () => {
                    if (this.selectedChargeToReplace !== i) {
                        chargeSprite.setScale(0.15);
                        chargeSprite.clearTint();
                    }
                });
                
                chargeSprite.on('pointerdown', () => {
                    this.selectedChargeToReplace = i;
                    chargeButtons.forEach((btn, idx) => {
                        const ring = chargeDisplay.list[chargeDisplay.list.indexOf(btn) + 1];
                        if (idx === i) {
                            btn.setScale(0.2);
                            btn.setTint(0xff0000);
                            if (ring && ring.type === 'Graphics') {
                                ring.setVisible(true);
                            }
                        } else {
                            btn.setScale(0.15);
                            btn.clearTint();
                            if (ring && ring.type === 'Graphics') {
                                ring.setVisible(false);
                            }
                        }
                    });
                });
                
                chargeButtons.push(chargeSprite);
                chargeDisplay.add(chargeSprite);
            }
            
            this.chestChargeButtons = chargeButtons;
            this.chestSelectionRings = [];
            for (let i = 1; i < chargeDisplay.list.length; i += 2) {
                if (chargeDisplay.list[i] && chargeDisplay.list[i].type === 'Graphics') {
                    this.chestSelectionRings.push(chargeDisplay.list[i]);
                }
            }
        }
        
        // Create element buttons
        const buttons = [];
        for (let i = 0; i < 3; i++) {
            const xPos = 180 + i * 220;
            const element = choices[i];
            const config = this.elementConfig[element];
            
            const button = this.add.container(xPos, 280);
            button.setScrollFactor(0);
            button.setDepth(202);
            
            const bg = this.add.rectangle(0, 0, 200, 280, 0x333333);
            bg.setStrokeStyle(3, i === 0 ? 0xffff00 : 0xffffff);
            bg.setInteractive();
            
            const sprite = this.add.sprite(0, -80, config.sheet, config.frame);
            sprite.setScale(0.4);
            
            const name = this.add.text(0, -20, config.name.toUpperCase(), {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            name.setOrigin(0.5);
            
            const description = this.add.text(0, 40, this.elementDescriptions[element], {
                fontSize: '12px',
                color: '#cccccc',
                align: 'center',
                wordWrap: { width: 180 }
            });
            description.setOrigin(0.5);
            
            button.add([bg, sprite, name, description]);
            buttons.push({ container: button, element: element, bg: bg });
            
            bg.on('pointerdown', () => {
                this.selectChestElement(element, config, selectionBg, title, controlHint, buttons);
            });
            
            bg.on('pointerover', () => {
                bg.setFillStyle(0x555555);
            });
            
            bg.on('pointerout', () => {
                bg.setFillStyle(0x333333);
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
    }
    
    closeChestUI() {
        this.chestSelectionActive = false;
        this.chestUI = null;
        this.physics.resume();
    }
    
    selectChestElement(element, config, selectionBg, title, controlHint, buttons) {
        // Make sure we have config
        if (!config) {
            config = this.elementConfig[element];
        }
        
        // Check if we need to replace a charge
        if (this.charges.length >= this.maxCharges) {
            // Must have selected a charge to replace
            if (this.selectedChargeToReplace === -1) {
                // Flash the charge display to indicate selection needed
                if (this.chestUI && this.chestUI.chargeDisplay) {
                    this.tweens.add({
                        targets: this.chestUI.chargeDisplay,
                        alpha: 0.3,
                        duration: 200,
                        yoyo: true,
                        repeat: 2
                    });
                }
                return; // Don't proceed without selection
            }
            
            // Replace the selected charge
            this.charges[this.selectedChargeToReplace] = element;
            this.updateChargeUI();
            this.updateChargeGroups();
            
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
            // Add element to charges normally
            this.charges.push(element);
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
        selectionBg.destroy();
        title.destroy();
        controlHint.destroy();
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
        
        // Reset state and resume
        this.chestSelectionActive = false;
        this.chestUI = null;
        this.physics.resume();
    }
    
    handleChestSelectionController() {
        if (!this.gamepad || !this.chestUI) return;
        
        // Check for left/right navigation
        const leftPressed = this.cursors.left.isDown || (this.gamepad.leftStick.x < -0.5);
        const rightPressed = this.cursors.right.isDown || (this.gamepad.leftStick.x > 0.5);
        const upPressed = this.cursors.up.isDown || (this.gamepad.leftStick.y < -0.5);
        const downPressed = this.cursors.down.isDown || (this.gamepad.leftStick.y > 0.5);
        const confirmPressed = this.spaceKey.isDown || (this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed);
        const switchModePressed = this.gamepad.buttons[2] && this.gamepad.buttons[2].pressed; // Y button
        
        // Initialize previous states if not set
        if (!this.prevChestLeftPressed) this.prevChestLeftPressed = false;
        if (!this.prevChestRightPressed) this.prevChestRightPressed = false;
        if (!this.prevChestUpPressed) this.prevChestUpPressed = false;
        if (!this.prevChestDownPressed) this.prevChestDownPressed = false;
        if (!this.prevChestConfirmPressed) this.prevChestConfirmPressed = false;
        if (!this.prevChestSwitchPressed) this.prevChestSwitchPressed = false;
        
        // Handle main menu selection for new chest system
        if (this.chestUI.mainMenu) {
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
            
            // Confirm selection
            if (confirmPressed && !this.prevChestConfirmPressed) {
                const selectedReward = this.chestUI.buttons[this.chestCursorIndex];
                if (selectedReward && selectedReward.type) {
                    this.selectChestReward(selectedReward.type, this.chestUI.chest);
                }
            }
        } else if (this.chestUI.chargesFull && switchModePressed && !this.prevChestSwitchPressed) {
            // Handle element selection sub-menu mode switching
            this.chestChargeSelectMode = !this.chestChargeSelectMode;
            // Update hint text
            if (this.chestChargeSelectMode) {
                this.chestUI.controlHint.setText('Select a charge to replace with UP/DOWN, press Y to return');
            } else {
                this.chestUI.controlHint.setText('Use LEFT/RIGHT to select element, Y to select charge to replace');
            }
        }
        
        if (this.chestChargeSelectMode && this.chestUI.chargesFull) {
            // Charge selection mode
            if (upPressed && !this.prevChestUpPressed) {
                if (this.selectedChargeToReplace > 0) {
                    // Clear previous selection
                    if (this.chestChargeButtons) {
                        this.chestChargeButtons[this.selectedChargeToReplace].setScale(0.15);
                        this.chestChargeButtons[this.selectedChargeToReplace].clearTint();
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(false);
                        }
                    }
                    this.selectedChargeToReplace--;
                    // Highlight new selection
                    if (this.chestChargeButtons) {
                        this.chestChargeButtons[this.selectedChargeToReplace].setScale(0.2);
                        this.chestChargeButtons[this.selectedChargeToReplace].setTint(0xff0000);
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(true);
                        }
                    }
                }
            }
            
            if (downPressed && !this.prevChestDownPressed) {
                if (this.selectedChargeToReplace < this.charges.length - 1) {
                    // Clear previous selection
                    if (this.chestChargeButtons && this.selectedChargeToReplace >= 0) {
                        this.chestChargeButtons[this.selectedChargeToReplace].setScale(0.15);
                        this.chestChargeButtons[this.selectedChargeToReplace].clearTint();
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(false);
                        }
                    }
                    this.selectedChargeToReplace++;
                    // Highlight new selection
                    if (this.chestChargeButtons) {
                        this.chestChargeButtons[this.selectedChargeToReplace].setScale(0.2);
                        this.chestChargeButtons[this.selectedChargeToReplace].setTint(0xff0000);
                        if (this.chestSelectionRings && this.chestSelectionRings[this.selectedChargeToReplace]) {
                            this.chestSelectionRings[this.selectedChargeToReplace].setVisible(true);
                        }
                    }
                }
            }
        } else {
            // Element selection mode
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
        if (!this.chestUI.mainMenu && confirmPressed && !this.prevChestConfirmPressed) {
            if (this.chestUI.choices) {
                const selectedElement = this.chestUI.choices[this.chestCursorIndex];
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
        
        // Store previous states
        this.prevChestLeftPressed = leftPressed;
        this.prevChestRightPressed = rightPressed;
        this.prevChestUpPressed = upPressed;
        this.prevChestDownPressed = downPressed;
        this.prevChestConfirmPressed = confirmPressed;
        this.prevChestSwitchPressed = switchModePressed;
    }
    
    gameWon() {
        // Stop the game
        this.physics.pause();
        this.time.removeAllEvents();
        this.tweens.killAll();
        
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
        
        this.tweens.add({
            targets: victoryText,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.scene.start('GameOverScene', {
                        survivalTime: this.survivalTime,
                        enemiesKilled: this.enemiesKilled,
                        itemsCollected: this.itemsCollected,
                        won: true
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
    backgroundColor: '#2d5a27',
    pixelArt: true,
    antialias: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    input: {
        gamepad: true
    },
    scene: [TitleScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);