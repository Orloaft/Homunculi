class OptimizedEnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = this.scene.physics.add.group();
        this.enemyPool = new Map(); // Pools for each enemy type
        this.activeEnemies = new Set();
        this.dormantEnemies = new Set(); // Enemies too far to update
        this.visibleEnemies = new Set(); // Enemies in camera view
        
        // Spatial indexing for efficient queries
        this.spatialGrid = null; // Will be initialized when scene starts
        
        // Optimization settings
        this.updateRadius = 1000; // Update enemies within this radius
        this.spawnRadius = 800; // Spawn enemies at this distance from camera edge
        this.cullRadius = 1200; // Remove enemies beyond this radius
        this.maxActiveEnemies = 150; // Increased for better gameplay
        this.renderDistance = 900; // Only render enemies within this distance
        
        // Spawn settings
        this.spawnRate = 1000; // ms between spawn waves
        this.lastSpawnTime = 0;
        this.waveSize = 5;
        this.difficulty = 1;
    }
    
    initialize(spatialGrid) {
        this.spatialGrid = spatialGrid;
    }
    
    update(time, delta) {
        const playerX = this.scene.wizard.x;
        const playerY = this.scene.wizard.y;
        
        // Update frustum culling first
        this.updateVisibleEnemies();
        
        // Update active enemies
        this.updateActiveEnemies(playerX, playerY, delta);
        
        // Check for enemies to activate/deactivate
        this.manageDormantEnemies(playerX, playerY);
        
        // Update spatial grid positions
        this.updateSpatialGrid();
        
        // Spawn new enemies at screen edges
        if (time - this.lastSpawnTime > this.spawnRate) {
            this.spawnWave(playerX, playerY);
            this.lastSpawnTime = time;
        }
    }
    
    updateActiveEnemies(playerX, playerY, delta) {
        for (const enemy of this.activeEnemies) {
            if (!enemy.active) {
                this.activeEnemies.delete(enemy);
                continue;
            }
            
            const distance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y, playerX, playerY
            );
            
            // Cull if too far
            if (distance > this.cullRadius) {
                this.recycleEnemy(enemy);
                continue;
            }
            
            // Deactivate if outside update radius
            if (distance > this.updateRadius) {
                this.deactivateEnemy(enemy);
                continue;
            }
            
            // Update enemy AI
            this.updateEnemyBehavior(enemy, playerX, playerY, delta);
        }
    }
    
    manageDormantEnemies(playerX, playerY) {
        for (const enemy of this.dormantEnemies) {
            const distance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y, playerX, playerY
            );
            
            if (distance < this.updateRadius) {
                this.activateEnemy(enemy);
            } else if (distance > this.cullRadius) {
                this.recycleEnemy(enemy);
            }
        }
    }
    
    updateVisibleEnemies() {
        const camera = this.scene.cameras.main;
        if (!camera) return;
        
        // Clear previous visible set
        this.visibleEnemies.clear();
        
        // Use spatial grid to get enemies in camera view
        if (this.spatialGrid) {
            const visibleEntities = this.spatialGrid.getInFrustum(camera, 100);
            visibleEntities.forEach(enemy => {
                if (this.activeEnemies.has(enemy)) {
                    this.visibleEnemies.add(enemy);
                    enemy.setVisible(true);
                }
            });
        }
        
        // Hide non-visible enemies
        for (const enemy of this.activeEnemies) {
            if (!this.visibleEnemies.has(enemy)) {
                enemy.setVisible(false);
            }
        }
    }
    
    updateSpatialGrid() {
        if (!this.spatialGrid) return;
        
        // Update positions of all active enemies in spatial grid
        for (const enemy of this.activeEnemies) {
            if (enemy.active) {
                this.spatialGrid.update(enemy, enemy.x, enemy.y, 50, 50);
            }
        }
    }
    
    spawnWave(playerX, playerY) {
        // Don't spawn if too many active enemies
        if (this.activeEnemies.size >= this.maxActiveEnemies) return;
        
        const camera = this.scene.cameras.main;
        if (!camera) return;
        
        // Calculate spawn positions at screen edges relative to camera
        const spawnPoints = this.calculateSpawnPoints(
            camera.worldView.x + camera.width / 2,
            camera.worldView.y + camera.height / 2,
            camera.width,
            camera.height
        );
        
        // Spawn enemies
        const enemyTypes = this.getEnemyTypesForDifficulty();
        const actualWaveSize = Math.min(
            this.waveSize, 
            this.maxActiveEnemies - this.activeEnemies.size
        );
        
        for (let i = 0; i < actualWaveSize; i++) {
            const spawnPoint = spawnPoints[i % spawnPoints.length];
            const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            this.spawnEnemy(enemyType, spawnPoint.x, spawnPoint.y);
        }
    }
    
    calculateSpawnPoints(centerX, centerY, width, height) {
        const points = [];
        const margin = this.spawnRadius; // Spawn at configured distance
        const spacing = 100;
        
        // Top edge
        for (let x = -width/2; x < width/2; x += spacing) {
            points.push({
                x: centerX + x,
                y: centerY - height/2 - margin
            });
        }
        
        // Bottom edge
        for (let x = -width/2; x < width/2; x += spacing) {
            points.push({
                x: centerX + x,
                y: centerY + height/2 + margin
            });
        }
        
        // Left edge
        for (let y = -height/2; y < height/2; y += spacing) {
            points.push({
                x: centerX - width/2 - margin,
                y: centerY + y
            });
        }
        
        // Right edge
        for (let y = -height/2; y < height/2; y += spacing) {
            points.push({
                x: centerX + width/2 + margin,
                y: centerY + y
            });
        }
        
        // Shuffle points
        for (let i = points.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [points[i], points[j]] = [points[j], points[i]];
        }
        
        return points;
    }
    
    spawnEnemy(type, x, y) {
        const enemy = this.getFromPool(type) || this.createEnemy(type);
        
        enemy.setPosition(x, y);
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.body.enable = true;
        
        // Initialize enemy properties
        enemy.enemyType = type;
        enemy.health = this.getEnemyHealth(type);
        enemy.maxHealth = enemy.health;
        enemy.speed = this.getEnemySpeed(type);
        enemy.damage = this.getEnemyDamage(type);
        
        this.enemies.add(enemy);
        this.activeEnemies.add(enemy);
        
        // Add to spatial grid
        if (this.spatialGrid) {
            this.spatialGrid.add(enemy, x, y, 50, 50);
        }
        
        // Play spawn animation if exists
        if (enemy.anims && enemy.anims.currentAnim) {
            enemy.play(enemy.anims.currentAnim.key);
        }
    }
    
    createEnemy(type) {
        let enemy;
        
        switch(type) {
            case 'slime':
                enemy = this.scene.physics.add.sprite(0, 0, 'slime-idle-0');
                enemy.setScale(1.5);
                break;
            case 'tree':
                enemy = this.scene.physics.add.sprite(0, 0, 'enemy-walk');
                enemy.play('enemy-walk');
                break;
            case 'golem':
                enemy = this.scene.physics.add.sprite(0, 0, 'golem-orange-walk');
                break;
            default:
                enemy = this.scene.physics.add.sprite(0, 0, 'enemy-walk');
        }
        
        enemy.setDepth(10);
        return enemy;
    }
    
    getFromPool(type) {
        if (!this.enemyPool.has(type)) {
            this.enemyPool.set(type, []);
        }
        return this.enemyPool.get(type).pop();
    }
    
    recycleEnemy(enemy) {
        enemy.setActive(false);
        enemy.setVisible(false);
        enemy.body.enable = false;
        
        this.activeEnemies.delete(enemy);
        this.dormantEnemies.delete(enemy);
        this.visibleEnemies.delete(enemy);
        this.enemies.remove(enemy);
        
        // Remove from spatial grid
        if (this.spatialGrid) {
            this.spatialGrid.remove(enemy);
        }
        
        // Add to pool
        if (!this.enemyPool.has(enemy.enemyType)) {
            this.enemyPool.set(enemy.enemyType, []);
        }
        this.enemyPool.get(enemy.enemyType).push(enemy);
    }
    
    deactivateEnemy(enemy) {
        enemy.body.enable = false;
        enemy.setVelocity(0, 0);
        this.activeEnemies.delete(enemy);
        this.dormantEnemies.add(enemy);
    }
    
    activateEnemy(enemy) {
        enemy.body.enable = true;
        this.dormantEnemies.delete(enemy);
        this.activeEnemies.add(enemy);
    }
    
    updateEnemyBehavior(enemy, playerX, playerY, delta) {
        // Simple movement towards player
        const angle = Phaser.Math.Angle.Between(
            enemy.x, enemy.y, playerX, playerY
        );
        
        const speed = enemy.speed || 50;
        enemy.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Update animation facing
        if (enemy.body.velocity.x < 0) {
            enemy.setFlipX(true);
        } else if (enemy.body.velocity.x > 0) {
            enemy.setFlipX(false);
        }
    }
    
    getEnemyTypesForDifficulty() {
        if (this.difficulty < 3) {
            return ['tree', 'slime'];
        } else if (this.difficulty < 6) {
            return ['tree', 'slime', 'golem'];
        } else {
            return ['slime', 'golem', 'darkeye'];
        }
    }
    
    getEnemyHealth(type) {
        const baseHealth = {
            tree: 3,
            slime: 5,
            golem: 15,
            darkeye: 10
        };
        return (baseHealth[type] || 5) * this.difficulty;
    }
    
    getEnemySpeed(type) {
        const baseSpeed = {
            tree: 40,
            slime: 30,
            golem: 25,
            darkeye: 60
        };
        return baseSpeed[type] || 40;
    }
    
    getEnemyDamage(type) {
        const baseDamage = {
            tree: 1,
            slime: 1,
            golem: 2,
            darkeye: 1
        };
        return baseDamage[type] || 1;
    }
    
    increaseDifficulty() {
        this.difficulty++;
        this.waveSize = Math.min(this.waveSize + 1, 15);
        this.spawnRate = Math.max(this.spawnRate - 50, 500);
    }
    
    getAllActiveEnemies() {
        return Array.from(this.activeEnemies);
    }
    
    getVisibleEnemies() {
        return Array.from(this.visibleEnemies);
    }
    
    getNearbyEnemies(x, y, radius) {
        if (this.spatialGrid) {
            return this.spatialGrid.getNearby(x, y, radius)
                .filter(enemy => this.activeEnemies.has(enemy));
        }
        // Fallback to distance check
        return this.getAllActiveEnemies().filter(enemy => {
            const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            return distance <= radius;
        });
    }
}