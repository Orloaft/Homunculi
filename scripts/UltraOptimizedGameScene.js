class UltraOptimizedGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UltraOptimizedGameScene' });
    }
    
    init(data) {
        this.stage = data.stage || 'forest';
        console.log('Initializing ultra-optimized infinite world:', this.stage);
    }
    
    create() {
        try {
            // Disable antialiasing for better performance
            this.game.config.antialias = false;
            this.game.config.pixelArt = true;
            
            // Initialize performance systems first
            this.initializeOptimizations();
            
            // Initialize core game systems
            this.initializeWorld();
            this.createWizard();
            this.initializeManagers();
            this.setupPhysics();
            this.setupCamera();
            this.initializeUI();
            
            // Start the game
            this.startGame();
            
            console.log('Ultra-optimized scene created successfully!');
        } catch (error) {
            console.error('Error creating ultra-optimized scene:', error);
            console.error('Stack trace:', error.stack);
            // Fallback to regular game scene
            this.scene.start('GameScene', { stage: this.stage });
        }
    }
    
    initializeOptimizations() {
        // Spatial indexing for collision detection
        this.spatialGrid = new SpatialHashGrid(128);
        
        // Physics optimizer
        this.physicsOptimizer = new PhysicsOptimizer(this);
        this.physicsOptimizer.initialize();
        
        // Level of Detail system
        this.lodSystem = new LODSystem();
        
        // Performance monitoring
        this.performanceStats = {
            updateTime: 0,
            renderTime: 0,
            activeEntities: 0,
            visibleEntities: 0
        };
    }
    
    initializeWorld() {
        // Enhanced chunk manager with frustum culling
        this.chunkManager = new ChunkManager(this, 1024);
        this.chunkManager.initialize(this.stage);
        
        // Start with minimal physics bounds (will expand dynamically)
        this.physics.world.setBounds(0, 0, 1, 1, false, false, false, false);
    }
    
    createWizard() {
        // Create wizard animations if not already created
        if (!this.anims.exists('wizard-idle-loop')) {
            this.anims.create({
                key: 'wizard-idle-loop',
                frames: this.anims.generateFrameNumbers('wizard-idle', { start: 0, end: 5 }),
                frameRate: 8,
                repeat: -1
            });
        }
        
        if (!this.anims.exists('wizard-walk-loop')) {
            this.anims.create({
                key: 'wizard-walk-loop',
                frames: this.anims.generateFrameNumbers('wizard-fly', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
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
        
        // Add wizard to spatial grid
        this.spatialGrid.add(this.wizard, 0, 0, 60, 60);
    }
    
    initializeManagers() {
        // Obstacle manager for impassable obstacles
        this.obstacleManager = new ObstacleManager(this);
        this.obstacleManager.initialize(this.stage);
        
        // Optimized enemy manager with spatial indexing
        this.enemyManager = new OptimizedEnemyManager(this);
        this.enemyManager.initialize(this.spatialGrid);
        
        // Projectile groups with pooling
        this.projectiles = this.physics.add.group({
            maxSize: 300,
            runChildUpdate: false
        });
        this.enemyProjectiles = this.physics.add.group({
            maxSize: 100,
            runChildUpdate: false
        });
        
        // Pickup groups with aggressive pooling
        this.jewels = this.physics.add.group({ maxSize: 50 });
        this.elementOrbs = this.physics.add.group({ maxSize: 20 });
        this.pickupPool = [];
        
        // Initialize projectile pools
        this.projectilePools = new Map();
        
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
            dark: { frame: 7, color: 0x8844ff, name: 'Dark', sheet: 'element-symbols' },
            blood: { frame: 5, color: 0xcc0000, name: 'Blood', sheet: 'element-symbols2' },
            gravity: { frame: 3, color: 0x4B0082, name: 'Gravity', sheet: 'element-symbols2', fireRate: 2400 },
            meteor: { frame: 7, color: 0xFF4500, name: 'Meteor', sheet: 'element-symbols2', fireRate: 4000 },
            crystal: { frame: 1, color: 0xFF69B4, name: 'Crystal', sheet: 'element-symbols2', fireRate: 2000 }
        };
        
        // Input controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.keys = this.input.keyboard.addKeys('J,K,L,I,TAB,ESC,SPACE');
        
        // Auto-fire settings
        this.autoFire = true;
        this.lastFireTime = 0;
        
        // Time tracking
        this.time = this.scene.systems.time;
    }
    
    setupPhysics() {
        // Set up optimized collision detection using spatial grid
        this.physics.add.overlap(
            this.wizard,
            this.enemyManager.enemies,
            this.hitByEnemy,
            null,
            this
        );
        
        // Add collisions with obstacles (only for player)
        const obstacles = this.obstacleManager.getObstaclesGroup();
        this.physics.add.collider(this.wizard, obstacles);
        // Enemies can now pass through obstacles
        
        // Note: Projectile collisions will be handled manually with spatial grid
    }
    
    setupCamera() {
        // Camera setup
        this.cameras.main.startFollow(this.wizard);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setZoom(1);
        
        // Set deadzone for smoother camera movement
        this.cameras.main.setDeadzone(100, 100);
    }
    
    initializeUI() {
        // Create UI elements (simplified for performance)
        this.createHealthBar();
        this.createScoreText();
        this.createExperienceBar();
        this.createChargeDisplay();
    }
    
    update(time, delta) {
        const updateStart = performance.now();
        
        // Update LOD system
        this.lodSystem.update();
        
        // Update optimized physics bounds
        this.physicsOptimizer.update(time, delta);
        
        // Update world chunks based on player position
        this.chunkManager.updatePlayerPosition(this.wizard.x, this.wizard.y);
        
        // Update obstacles based on player position
        this.obstacleManager.update(this.wizard.x, this.wizard.y);
        
        // Handle player input and movement
        this.updatePlayer(delta);
        
        // Update spatial grid for wizard
        this.spatialGrid.update(this.wizard, this.wizard.x, this.wizard.y, 60, 60);
        
        // Update enemy manager
        this.enemyManager.update(time, delta);
        
        // Update projectiles with LOD
        this.updateProjectiles(delta);
        
        // Handle optimized collisions
        this.handleOptimizedCollisions();
        
        // Update pickups
        this.updatePickups();
        
        // Auto-fire handling
        if (this.autoFire && time - this.lastFireTime > this.getFireRate()) {
            this.fireProjectile();
            this.lastFireTime = time;
        }
        
        // Update UI
        this.updateUI();
        
        // Track performance
        this.performanceStats.updateTime = performance.now() - updateStart;
        this.performanceStats.activeEntities = this.enemyManager.activeEnemies.size;
        this.performanceStats.visibleEntities = this.enemyManager.visibleEnemies.size;
    }
    
    updatePlayer(delta) {
        let moveX = 0;
        let moveY = 0;
        
        // Movement input
        if (this.cursors.left.isDown || this.wasd.A.isDown) moveX = -1;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) moveX = 1;
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) moveY = -1;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) moveY = 1;
        
        // Apply movement
        const speed = this.wizard.speed;
        this.wizard.setVelocity(moveX * speed, moveY * speed);
        
        // Update animation
        if (moveX !== 0 || moveY !== 0) {
            this.wizard.play('wizard-walk-loop', true);
            if (moveX < 0) this.wizard.lastDirection = 'left';
            else if (moveX > 0) this.wizard.lastDirection = 'right';
            else if (moveY < 0) this.wizard.lastDirection = 'up';
            else if (moveY > 0) this.wizard.lastDirection = 'down';
        } else {
            this.wizard.play('wizard-idle-loop', true);
        }
        
        // Set wizard facing
        this.wizard.setFlipX(this.wizard.lastDirection === 'left');
    }
    
    updateProjectiles(delta) {
        const playerX = this.wizard.x;
        const playerY = this.wizard.y;
        const cullDistance = 1000;
        
        // Update player projectiles
        this.projectiles.children.entries.forEach(projectile => {
            if (!projectile.active) return;
            
            const distance = Phaser.Math.Distance.Between(
                projectile.x, projectile.y, playerX, playerY
            );
            
            // Cull distant projectiles
            if (distance > cullDistance) {
                this.recycleProjectile(projectile);
                return;
            }
            
            // LOD update for projectiles
            if (this.lodSystem.shouldUpdate(distance, 'projectile')) {
                // Update projectile logic (animations, particles, etc)
                if (projectile.update) {
                    projectile.update(delta);
                }
            }
            
            // Update spatial grid position
            this.spatialGrid.update(projectile, projectile.x, projectile.y, 20, 20);
        });
        
        // Similar for enemy projectiles
        this.enemyProjectiles.children.entries.forEach(projectile => {
            if (!projectile.active) return;
            
            const distance = Phaser.Math.Distance.Between(
                projectile.x, projectile.y, playerX, playerY
            );
            
            if (distance > cullDistance) {
                projectile.destroy();
            }
        });
    }
    
    handleOptimizedCollisions() {
        // Use spatial grid for efficient collision detection
        
        // Projectile vs Enemy collisions
        this.projectiles.children.entries.forEach(projectile => {
            if (!projectile.active) return;
            
            // Get nearby enemies using spatial grid
            const nearbyEnemies = this.spatialGrid.getNearby(
                projectile.x, projectile.y, 50
            );
            
            nearbyEnemies.forEach(enemy => {
                if (this.enemyManager.activeEnemies.has(enemy) && enemy.active) {
                    // Check actual collision
                    if (Phaser.Geom.Intersects.RectangleToRectangle(
                        projectile.getBounds(),
                        enemy.getBounds()
                    )) {
                        this.hitEnemy(projectile, enemy);
                    }
                }
            });
            
            // Projectiles can now pass through obstacles
        });
        
        // Pickup collisions with wizard
        const nearbyPickups = this.spatialGrid.getNearby(
            this.wizard.x, this.wizard.y, 100
        );
        
        nearbyPickups.forEach(pickup => {
            if ((this.jewels.contains(pickup) || this.elementOrbs.contains(pickup)) && 
                pickup.active) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(
                    this.wizard.getBounds(),
                    pickup.getBounds()
                )) {
                    this.collectPickup(pickup);
                }
            }
        });
    }
    
    updatePickups() {
        const magnetRange = 150;
        const magnetSpeed = 200;
        
        // Only update visible pickups
        const allPickups = [...this.jewels.children.entries, ...this.elementOrbs.children.entries];
        
        allPickups.forEach(pickup => {
            if (!pickup.active) return;
            
            const distance = Phaser.Math.Distance.Between(
                pickup.x, pickup.y, this.wizard.x, this.wizard.y
            );
            
            // Magnet effect
            if (distance < magnetRange) {
                const angle = Phaser.Math.Angle.Between(
                    pickup.x, pickup.y, this.wizard.x, this.wizard.y
                );
                pickup.setVelocity(
                    Math.cos(angle) * magnetSpeed,
                    Math.sin(angle) * magnetSpeed
                );
            }
            
            // Update spatial grid
            this.spatialGrid.update(pickup, pickup.x, pickup.y, 20, 20);
            
            // Cull distant pickups
            if (distance > 1500) {
                this.recyclePickup(pickup);
            }
        });
    }
    
    // Game methods (simplified versions from original)
    fireProjectile() {
        if (this.charges.length === 0) return;
        
        const element = this.charges[this.currentChargeIndex];
        const projectile = this.getProjectileFromPool(element);
        
        if (!projectile) return;
        
        // Find nearest enemy using spatial grid
        const nearbyEnemies = this.spatialGrid.getNearby(
            this.wizard.x, this.wizard.y, 400
        );
        
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        nearbyEnemies.forEach(enemy => {
            if (this.enemyManager.activeEnemies.has(enemy)) {
                const distance = Phaser.Math.Distance.Between(
                    this.wizard.x, this.wizard.y, enemy.x, enemy.y
                );
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = enemy;
                }
            }
        });
        
        // Set projectile properties and trajectory
        projectile.setPosition(this.wizard.x, this.wizard.y);
        projectile.setActive(true);
        projectile.setVisible(true);
        projectile.element = element;
        
        if (nearestEnemy) {
            const angle = Phaser.Math.Angle.Between(
                this.wizard.x, this.wizard.y, nearestEnemy.x, nearestEnemy.y
            );
            projectile.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
        } else {
            // Fire in last direction
            const directionAngles = {
                up: -Math.PI / 2,
                down: Math.PI / 2,
                left: Math.PI,
                right: 0
            };
            const angle = directionAngles[this.wizard.lastDirection] || 0;
            projectile.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
        }
        
        // Add to spatial grid
        this.spatialGrid.add(projectile, projectile.x, projectile.y, 20, 20);
        
        // Cycle charges
        this.currentChargeIndex = (this.currentChargeIndex + 1) % this.charges.length;
    }
    
    getProjectileFromPool(element) {
        if (!this.projectilePools.has(element)) {
            this.projectilePools.set(element, []);
        }
        
        const pool = this.projectilePools.get(element);
        let projectile = pool.pop();
        
        if (!projectile) {
            const config = this.elementConfig[element];
            projectile = this.projectiles.create(0, 0, config.sheet, config.frame);
            projectile.setScale(0.5);
            projectile.body.setSize(16, 16);
        }
        
        return projectile;
    }
    
    recycleProjectile(projectile) {
        projectile.setActive(false);
        projectile.setVisible(false);
        projectile.setVelocity(0, 0);
        
        // Remove from spatial grid
        this.spatialGrid.remove(projectile);
        
        // Add back to pool
        if (!this.projectilePools.has(projectile.element)) {
            this.projectilePools.set(projectile.element, []);
        }
        this.projectilePools.get(projectile.element).push(projectile);
    }
    
    recyclePickup(pickup) {
        pickup.setActive(false);
        pickup.setVisible(false);
        pickup.setVelocity(0, 0);
        
        // Remove from spatial grid
        this.spatialGrid.remove(pickup);
        
        // Add to pool
        this.pickupPool.push(pickup);
    }
    
    // Collision handlers
    projectileHitObstacle(projectile, obstacle) {
        // Create hit effect and destroy projectile
        const hitEffect = this.add.circle(projectile.x, projectile.y, 8, 0xffffff, 0.6);
        hitEffect.setDepth(100);
        this.tweens.add({
            targets: hitEffect,
            scale: { from: 1, to: 0 },
            alpha: { from: 0.6, to: 0 },
            duration: 200,
            onComplete: () => hitEffect.destroy()
        });
        
        this.recycleProjectile(projectile);
    }
    
    // Simplified collision handlers
    hitEnemy(projectile, enemy) {
        // Damage enemy
        enemy.health -= 1;
        
        // Create hit effect
        this.createHitEffect(enemy.x, enemy.y, projectile.element);
        
        // Check if enemy died
        if (enemy.health <= 0) {
            this.enemyKilled(enemy);
        }
        
        // Recycle projectile
        this.recycleProjectile(projectile);
    }
    
    enemyKilled(enemy) {
        // Drop pickups
        this.dropPickup(enemy.x, enemy.y);
        
        // Award score
        this.score += 10;
        
        // Recycle enemy
        this.enemyManager.recycleEnemy(enemy);
    }
    
    dropPickup(x, y) {
        const pickup = this.pickupPool.pop() || this.jewels.create(x, y, 'jewel');
        pickup.setPosition(x, y);
        pickup.setActive(true);
        pickup.setVisible(true);
        pickup.setScale(0.5);
        
        // Add to spatial grid
        this.spatialGrid.add(pickup, x, y, 20, 20);
    }
    
    collectPickup(pickup) {
        // Award experience
        this.experience += 1;
        
        // Check level up
        if (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
        
        // Recycle pickup
        this.recyclePickup(pickup);
    }
    
    levelUp() {
        this.level++;
        this.experience = 0;
        this.experienceToNext = this.level * 10;
        
        // Increase difficulty
        this.enemyManager.increaseDifficulty();
        
        // Show level up effect
        this.showLevelUpEffect();
    }
    
    hitByEnemy(wizard, enemy) {
        if (this.wizard.invulnerable) return;
        
        // Damage wizard
        this.wizard.health -= enemy.damage || 1;
        
        // Invulnerability frames
        this.wizard.invulnerable = true;
        this.time.delayedCall(1000, () => {
            this.wizard.invulnerable = false;
        });
        
        // Flash effect
        this.tweens.add({
            targets: this.wizard,
            alpha: { from: 0.5, to: 1 },
            duration: 100,
            repeat: 5
        });
        
        // Check game over
        if (this.wizard.health <= 0) {
            this.gameOver();
        }
    }
    
    // UI methods (simplified)
    createHealthBar() {
        this.healthBar = this.add.rectangle(100, 50, 200, 20, 0x00ff00);
        this.healthBar.setScrollFactor(0);
        this.healthBar.setDepth(100);
    }
    
    createScoreText() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            color: '#ffffff'
        });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(100);
    }
    
    createExperienceBar() {
        this.expBar = this.add.rectangle(400, 580, 300, 10, 0x4444ff);
        this.expBar.setScrollFactor(0);
        this.expBar.setDepth(100);
    }
    
    createChargeDisplay() {
        this.chargeDisplay = this.add.container(700, 50);
        this.chargeDisplay.setScrollFactor(0);
        this.chargeDisplay.setDepth(100);
    }
    
    updateUI() {
        // Update health bar
        const healthPercent = this.wizard.health / this.wizard.maxHealth;
        this.healthBar.setScale(healthPercent, 1);
        
        // Update score
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Update experience bar
        const expPercent = this.experience / this.experienceToNext;
        this.expBar.setScale(expPercent, 1);
    }
    
    // Effect methods
    createHitEffect(x, y, element) {
        const color = this.elementConfig[element]?.color || 0xffffff;
        const effect = this.add.circle(x, y, 10, color, 0.8);
        
        this.tweens.add({
            targets: effect,
            scale: { from: 1, to: 2 },
            alpha: { from: 0.8, to: 0 },
            duration: 300,
            onComplete: () => effect.destroy()
        });
    }
    
    showLevelUpEffect() {
        const text = this.add.text(400, 300, `LEVEL ${this.level}!`, {
            fontSize: '48px',
            color: '#ffff00'
        });
        text.setOrigin(0.5);
        text.setScrollFactor(0);
        
        this.tweens.add({
            targets: text,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }
    
    getFireRate() {
        if (this.charges.length === 0) return 1000;
        const element = this.charges[this.currentChargeIndex];
        return this.elementConfig[element]?.fireRate || 1000;
    }
    
    startGame() {
        console.log('Ultra-optimized infinite game started!');
        
        // Start spawning enemies
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.enemyManager.spawnWave(this.wizard.x, this.wizard.y);
            },
            loop: true
        });
    }
    
    gameOver() {
        console.log('Game Over! Score:', this.score);
        
        // Clean up
        this.spatialGrid.clear();
        
        // Return to menu or restart
        this.scene.start('GameOverScene', {
            score: this.score,
            level: this.level
        });
    }
}