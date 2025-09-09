class InfiniteGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InfiniteGameScene' });
    }
    
    init(data) {
        this.stage = data.stage || 'forest';
        console.log('Initializing infinite world:', this.stage);
    }
    
    preload() {
        // Preload is handled by LoadingScene
    }
    
    create() {
        // Disable antialiasing for better performance
        this.game.config.antialias = false;
        
        // Initialize core systems
        this.initializeWorld();
        this.createWizard();
        this.initializeManagers();
        this.setupPhysics();
        this.setupCamera();
        this.initializeUI();
        
        // Start the game
        this.startGame();
    }
    
    initializeWorld() {
        // Create chunk manager for infinite world
        this.chunkManager = new ChunkManager(this, 1024);
        this.chunkManager.initialize(this.stage);
        
        // No world bounds - infinite world!
        this.physics.world.setBounds(
            -10000, -10000, 20000, 20000, false, false, false, false
        );
    }
    
    createWizard() {
        // Create wizard at world center
        this.wizard = this.physics.add.sprite(0, 0, 'wizard-idle');
        this.wizard.setDepth(50);
        this.wizard.play('wizard-idle-loop');
        
        // Setup wizard physics
        this.wizard.body.setSize(30, 30);
        this.wizard.body.setOffset(25, 35);
        
        // Wizard properties
        this.wizard.speed = 160;
        this.wizard.health = 10;
        this.wizard.maxHealth = 10;
        this.wizard.lastDirection = 'down';
    }
    
    initializeManagers() {
        // Optimized enemy manager
        this.enemyManager = new OptimizedEnemyManager(this);
        
        // Projectile groups
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        
        // Pickup groups
        this.jewels = this.physics.add.group();
        this.elementOrbs = this.physics.add.group();
        this.pickupPool = [];
        
        // Game state
        this.score = 0;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 10;
        
        // Element system
        this.charges = [];
        this.maxCharges = 3;
        this.chargeGroups = [];
        this.currentChargeIndex = 0;
        
        // Load starting element
        const startElement = localStorage.getItem('startElement');
        if (startElement && startElement !== 'none') {
            this.charges = [startElement];
        }
        
        // Copy element config from main game
        this.elementConfig = {
            fire: { frame: 0, color: 0xff4444, name: 'Fire', sheet: 'element-symbols', fireRate: 3150 },
            water: { frame: 1, color: 0x4444ff, name: 'Water', sheet: 'element-symbols', fireRate: 1800 },
            earth: { frame: 6, color: 0x44ff44, name: 'Earth', sheet: 'element-symbols2', fireRate: 3000 },
            rock: { frame: 3, color: 0x8b4513, name: 'Rock', sheet: 'element-symbols', fireRate: 2250 },
            air: { frame: 4, color: 0xcccccc, name: 'Air', sheet: 'element-symbols', fireRate: 1200 },
            lightning: { frame: 5, color: 0xffff44, name: 'Lightning', sheet: 'element-symbols', fireRate: 1500 },
            ice: { frame: 4, color: 0x00ddff, name: 'Ice', sheet: 'element-symbols2', fireRate: 2500 },
            poison: { frame: 2, color: 0x00ff00, name: 'Poison', sheet: 'element-symbols2' },
            holy: { frame: 6, color: 0xffdd00, name: 'Holy', sheet: 'element-symbols' },
            arcane: { frame: 7, color: 0xff44ff, name: 'Arcane', sheet: 'element-symbols', fireRate: 2400 }
        };
        
        this.primaryElements = ['fire', 'water', 'earth', 'air', 'lightning', 'arcane', 'ice', 'poison'];
    }
    
    setupPhysics() {
        // Collisions
        this.physics.add.overlap(
            this.wizard, 
            this.enemyManager.enemies, 
            this.handleWizardEnemyCollision, 
            null, 
            this
        );
        
        this.physics.add.overlap(
            this.projectiles, 
            this.enemyManager.enemies, 
            this.handleProjectileEnemyCollision, 
            null, 
            this
        );
        
        this.physics.add.overlap(
            this.wizard, 
            this.jewels, 
            this.collectJewel, 
            null, 
            this
        );
        
        this.physics.add.overlap(
            this.wizard, 
            this.elementOrbs, 
            this.collectElementOrb, 
            null, 
            this
        );
    }
    
    setupCamera() {
        // Camera follows wizard with smooth lerp
        this.cameras.main.startFollow(this.wizard, true, 0.08, 0.08);
        
        // No camera bounds for infinite world
        this.cameras.main.setBounds(undefined);
    }
    
    initializeUI() {
        // Health bar
        this.healthBar = this.add.rectangle(100, 50, 200, 20, 0xff0000);
        this.healthBar.setScrollFactor(0);
        this.healthBar.setDepth(100);
        
        this.healthBarBg = this.add.rectangle(100, 50, 200, 20, 0x000000);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarBg.setDepth(99);
        this.healthBarBg.setStrokeStyle(2, 0xffffff);
        
        // Score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(100);
        
        // Level display
        this.levelText = this.add.text(16, 80, 'Level: 1', {
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.levelText.setScrollFactor(0);
        this.levelText.setDepth(100);
        
        // Charge display
        this.chargeDisplay = this.add.container(400, 550);
        this.chargeDisplay.setScrollFactor(0);
        this.chargeDisplay.setDepth(100);
        this.updateChargeUI();
    }
    
    startGame() {
        // Auto-fire timer
        this.lastFireTime = 0;
        this.fireRate = 1000;
        
        // Spawn timer
        this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: () => this.enemyManager.spawnWave(this.wizard.x, this.wizard.y),
            loop: true
        });
        
        // Difficulty timer
        this.difficultyTimer = this.time.addEvent({
            delay: 30000,
            callback: () => this.enemyManager.increaseDifficulty(),
            loop: true
        });
        
        // Background music
        if (!this.sound.get('bgm')) {
            this.bgMusic = this.sound.add('bgm', { loop: true, volume: 0.3 });
            this.bgMusic.play();
        }
    }
    
    update(time, delta) {
        // Update world chunks based on player position
        this.chunkManager.updatePlayerPosition(this.wizard.x, this.wizard.y);
        
        // Update wizard movement
        this.updateWizardMovement();
        
        // Update enemy manager
        this.enemyManager.update(time, delta);
        
        // Auto-fire projectiles
        if (time - this.lastFireTime > this.fireRate && this.charges.length > 0) {
            this.autoFire();
            this.lastFireTime = time;
        }
        
        // Update projectiles
        this.updateProjectiles();
        
        // Clean up off-screen pickups
        this.cullPickups();
    }
    
    updateWizardMovement() {
        const cursors = this.input.keyboard.createCursorKeys();
        const wasd = this.input.keyboard.addKeys('W,A,S,D');
        
        let velocityX = 0;
        let velocityY = 0;
        
        // Keyboard input
        if (cursors.left.isDown || wasd.A.isDown) {
            velocityX = -this.wizard.speed;
            this.wizard.lastDirection = 'left';
        } else if (cursors.right.isDown || wasd.D.isDown) {
            velocityX = this.wizard.speed;
            this.wizard.lastDirection = 'right';
        }
        
        if (cursors.up.isDown || wasd.W.isDown) {
            velocityY = -this.wizard.speed;
            this.wizard.lastDirection = 'up';
        } else if (cursors.down.isDown || wasd.S.isDown) {
            velocityY = this.wizard.speed;
            this.wizard.lastDirection = 'down';
        }
        
        // Apply velocity
        this.wizard.setVelocity(velocityX, velocityY);
        
        // Update animation
        if (velocityX !== 0 || velocityY !== 0) {
            if (!this.wizard.anims.isPlaying || this.wizard.anims.currentAnim.key !== 'wizard-fly-loop') {
                this.wizard.play('wizard-fly-loop');
            }
        } else {
            if (!this.wizard.anims.isPlaying || this.wizard.anims.currentAnim.key !== 'wizard-idle-loop') {
                this.wizard.play('wizard-idle-loop');
            }
        }
    }
    
    autoFire() {
        if (this.charges.length === 0) return;
        
        const enemies = this.enemyManager.getAllActiveEnemies();
        if (enemies.length === 0) return;
        
        // Find nearest enemy
        let nearestEnemy = null;
        let minDistance = Infinity;
        
        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(
                this.wizard.x, this.wizard.y, enemy.x, enemy.y
            );
            if (dist < minDistance) {
                minDistance = dist;
                nearestEnemy = enemy;
            }
        });
        
        if (nearestEnemy && minDistance < 800) {
            // Fire current charge at enemy
            const element = this.charges[this.currentChargeIndex];
            this.fireProjectile(element, nearestEnemy);
            
            // Cycle to next charge
            this.currentChargeIndex = (this.currentChargeIndex + 1) % this.charges.length;
        }
    }
    
    fireProjectile(element, target) {
        const projectile = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'element-symbols', 0);
        projectile.setScale(0.5);
        projectile.setDepth(20);
        projectile.element = element;
        projectile.damage = 1;
        
        // Set projectile appearance
        const config = this.elementConfig[element];
        if (config) {
            projectile.setTint(config.color);
        }
        
        // Calculate velocity
        const angle = Phaser.Math.Angle.Between(
            this.wizard.x, this.wizard.y, target.x, target.y
        );
        const speed = 300;
        
        projectile.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        this.projectiles.add(projectile);
    }
    
    updateProjectiles() {
        this.projectiles.children.entries.forEach(projectile => {
            // Remove if too far from player
            const dist = Phaser.Math.Distance.Between(
                projectile.x, projectile.y, this.wizard.x, this.wizard.y
            );
            
            if (dist > 1000) {
                projectile.destroy();
            }
        });
    }
    
    cullPickups() {
        const cullDistance = 1500;
        
        [this.jewels, this.elementOrbs].forEach(group => {
            group.children.entries.forEach(pickup => {
                const dist = Phaser.Math.Distance.Between(
                    pickup.x, pickup.y, this.wizard.x, this.wizard.y
                );
                
                if (dist > cullDistance) {
                    this.recyclePickup(pickup);
                }
            });
        });
    }
    
    handleWizardEnemyCollision(wizard, enemy) {
        // Damage wizard
        this.wizard.health--;
        this.updateHealthBar();
        
        // Flash effect
        wizard.setTint(0xff0000);
        this.time.delayedCall(100, () => wizard.clearTint());
        
        // Game over check
        if (this.wizard.health <= 0) {
            this.gameOver();
        }
    }
    
    handleProjectileEnemyCollision(projectile, enemy) {
        // Damage enemy
        enemy.health -= projectile.damage;
        
        // Destroy projectile
        projectile.destroy();
        
        // Check if enemy died
        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }
    }
    
    killEnemy(enemy) {
        // Drop loot
        this.dropLoot(enemy.x, enemy.y, enemy.enemyType);
        
        // Add score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        // Add experience
        this.addExperience(5);
        
        // Recycle enemy
        this.enemyManager.recycleEnemy(enemy);
    }
    
    dropLoot(x, y, enemyType) {
        // Always drop experience jewel
        const jewel = this.getOrCreatePickup('jewel');
        jewel.setPosition(x, y);
        jewel.setActive(true);
        jewel.setVisible(true);
        this.jewels.add(jewel);
        
        // Chance to drop element orb
        if (Math.random() < 0.1) {
            const orb = this.getOrCreatePickup('element');
            orb.setPosition(x + 20, y);
            orb.setActive(true);
            orb.setVisible(true);
            orb.element = this.primaryElements[
                Math.floor(Math.random() * this.primaryElements.length)
            ];
            this.elementOrbs.add(orb);
        }
    }
    
    getOrCreatePickup(type) {
        // Try to get from pool
        for (let pickup of this.pickupPool) {
            if (!pickup.active && pickup.pickupType === type) {
                return pickup;
            }
        }
        
        // Create new pickup
        let pickup;
        if (type === 'jewel') {
            pickup = this.physics.add.sprite(0, 0, 'xp-gem');
            pickup.play('xp-gem-anim');
            pickup.setScale(0.15);
        } else {
            pickup = this.physics.add.sprite(0, 0, 'element-symbols', 0);
            pickup.setScale(0.3);
        }
        
        pickup.pickupType = type;
        this.pickupPool.push(pickup);
        return pickup;
    }
    
    recyclePickup(pickup) {
        pickup.setActive(false);
        pickup.setVisible(false);
        
        if (pickup.pickupType === 'jewel') {
            this.jewels.remove(pickup);
        } else {
            this.elementOrbs.remove(pickup);
        }
    }
    
    collectJewel(wizard, jewel) {
        this.addExperience(1);
        this.recyclePickup(jewel);
        
        // Float text
        const text = this.add.text(jewel.x, jewel.y, '+1 XP', {
            fontSize: '16px',
            color: '#ffff00'
        });
        
        this.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }
    
    collectElementOrb(wizard, orb) {
        if (this.charges.length < this.maxCharges) {
            this.charges.push(orb.element);
            this.updateChargeUI();
            
            // Float text
            const text = this.add.text(orb.x, orb.y, '+' + orb.element, {
                fontSize: '18px',
                color: this.elementConfig[orb.element].color
            });
            
            this.tweens.add({
                targets: text,
                y: text.y - 30,
                alpha: 0,
                duration: 1000,
                onComplete: () => text.destroy()
            });
        }
        
        this.recyclePickup(orb);
    }
    
    addExperience(amount) {
        this.experience += amount;
        
        if (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience = 0;
        this.experienceToNext = this.level * 10;
        
        this.levelText.setText('Level: ' + this.level);
        
        // Flash effect
        const flash = this.add.rectangle(400, 300, 800, 600, 0xffff00, 0.3);
        flash.setScrollFactor(0);
        flash.setDepth(150);
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
        
        // Heal wizard
        this.wizard.health = Math.min(this.wizard.health + 2, this.wizard.maxHealth);
        this.updateHealthBar();
        
        // Show level up choices (simplified)
        this.showLevelUpChoice();
    }
    
    showLevelUpChoice() {
        // Pause game
        this.physics.pause();
        
        // Create UI
        const bg = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.9);
        bg.setScrollFactor(0);
        bg.setDepth(200);
        
        const title = this.add.text(400, 150, 'LEVEL UP!', {
            fontSize: '36px',
            color: '#ffff00'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(201);
        
        // Simple choices
        const choices = [
            { text: '+1 Max Charge', action: () => this.maxCharges++ },
            { text: '+25% Fire Rate', action: () => this.fireRate *= 0.75 },
            { text: '+2 Health', action: () => {
                this.wizard.maxHealth += 2;
                this.wizard.health += 2;
            }}
        ];
        
        choices.forEach((choice, index) => {
            const button = this.add.rectangle(400, 250 + index * 60, 400, 50, 0x444444);
            button.setInteractive();
            button.setScrollFactor(0);
            button.setDepth(201);
            
            const text = this.add.text(400, 250 + index * 60, choice.text, {
                fontSize: '20px',
                color: '#ffffff'
            });
            text.setOrigin(0.5);
            text.setScrollFactor(0);
            text.setDepth(202);
            
            button.on('pointerdown', () => {
                choice.action();
                bg.destroy();
                title.destroy();
                button.destroy();
                text.destroy();
                this.physics.resume();
                this.updateChargeUI();
                this.updateHealthBar();
            });
        });
    }
    
    updateHealthBar() {
        const healthPercent = this.wizard.health / this.wizard.maxHealth;
        this.healthBar.width = 200 * healthPercent;
    }
    
    updateChargeUI() {
        this.chargeDisplay.removeAll(true);
        
        this.charges.forEach((charge, index) => {
            const config = this.elementConfig[charge];
            const x = index * 50 - (this.charges.length - 1) * 25;
            
            const bg = this.add.rectangle(x, 0, 40, 40, 0x333333);
            bg.setStrokeStyle(2, 0xffffff);
            
            const icon = this.add.rectangle(x, 0, 30, 30, config.color);
            
            this.chargeDisplay.add([bg, icon]);
        });
    }
    
    gameOver() {
        this.physics.pause();
        
        const gameOverText = this.add.text(400, 300, 'GAME OVER', {
            fontSize: '64px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setScrollFactor(0);
        gameOverText.setDepth(300);
        
        this.time.delayedCall(3000, () => {
            this.scene.start('TitleScene');
        });
    }
}