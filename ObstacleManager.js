class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = this.scene.physics.add.staticGroup();
        this.activeObstacles = new Map(); // Track obstacles by grid position
        this.obstaclePool = [];
        this.gridSize = 300; // Reduced from 400 for better coverage
        this.viewDistance = 1500; // Increased view distance to load more cells
        this.lastPlayerGridX = null;
        this.lastPlayerGridY = null;
        
        // Define patterns for each stage - VERY SPARSE (90% reduction)
        this.patterns = {
            forest: [
                // Single tree
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ],
                // Single tree corner
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 1, 0, 0]
                ],
                // Two trees sparse
                [
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 1]
                ],
                // Single tree top
                [
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern for more spacing
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Single tree center
                [
                    [0, 0, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            ],
            cave: [
                // Single rock
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Rock pair diagonal
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 1],
                    [0, 0, 0, 0],
                    [1, 0, 0, 0]
                ],
                // Single rock corner
                [
                    [1, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern for spacing
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Single rock center
                [
                    [0, 0, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            ],
            lava: [
                // Single lava rock
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ],
                // Lava rock bottom
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 1, 0]
                ],
                // Two rocks sparse
                [
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 1]
                ],
                // Empty pattern for spacing
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Single rock top right
                [
                    [0, 0, 0, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            ]
        };
        
        // Obstacle types for each stage
        this.obstacleTypes = {
            forest: 'tree',
            cave: 'rock',
            lava: 'lava-rock'
        };
    }
    
    initialize(stage) {
        this.stage = stage;
        this.currentPatterns = this.patterns[stage] || this.patterns.forest;
        this.obstacleType = this.obstacleTypes[stage] || 'tree';
        
        console.log(`ObstacleManager initialized for stage: ${stage}`);
        console.log(`Pattern count: ${this.currentPatterns.length}`);
        console.log(`Obstacle type: ${this.obstacleType}`);
        
        // Clear any existing obstacles
        this.clear();
        
    }
    
    update(playerX, playerY) {
        // Always update active obstacles to ensure continuous spawning
        this.updateActiveObstacles(playerX, playerY);
    }
    
    updateActiveObstacles(playerX, playerY) {
        const loadRadius = Math.ceil(this.viewDistance / this.gridSize) + 1; // Add extra cell for buffer
        const gridX = Math.floor(playerX / this.gridSize);
        const gridY = Math.floor(playerY / this.gridSize);
        
        // Track which grid cells should be active
        const activeCells = new Set();
        
        // Calculate which cells should have obstacles
        for (let dx = -loadRadius; dx <= loadRadius; dx++) {
            for (let dy = -loadRadius; dy <= loadRadius; dy++) {
                const cellX = gridX + dx;
                const cellY = gridY + dy;
                const cellKey = `${cellX},${cellY}`;
                
                // Check if within view distance
                const cellCenterX = (cellX + 0.5) * this.gridSize;
                const cellCenterY = (cellY + 0.5) * this.gridSize;
                const distance = Phaser.Math.Distance.Between(
                    playerX, playerY, cellCenterX, cellCenterY
                );
                
                if (distance <= this.viewDistance) {
                    activeCells.add(cellKey);
                    
                    // Create obstacles if not already present
                    if (!this.activeObstacles.has(cellKey)) {
                        this.createObstaclesInCell(cellX, cellY);
                    }
                }
            }
        }
        
        // Remove obstacles that are too far
        for (const [cellKey, obstacles] of this.activeObstacles.entries()) {
            if (!activeCells.has(cellKey)) {
                this.removeObstaclesInCell(cellKey, obstacles);
            }
        }
    }
    
    createObstaclesInCell(cellX, cellY) {
        const obstacles = [];
        
        // Debug first cell creation for non-forest stages
        if (this.stage !== 'forest' && !this.debuggedFirstCell) {
            console.log(`Creating obstacles in cell ${cellX},${cellY} for stage ${this.stage}`);
            this.debuggedFirstCell = true;
        }
        
        // Use a deterministic pattern based on cell position
        const patternIndex = Math.abs((cellX * 7 + cellY * 13)) % this.currentPatterns.length;
        const pattern = this.currentPatterns[patternIndex];
        
        const cellSize = this.gridSize / pattern.length;
        const baseX = cellX * this.gridSize;
        const baseY = cellY * this.gridSize;
        
        // Debug pattern for non-forest
        if (this.stage !== 'forest' && !this.debuggedPattern) {
            console.log(`Pattern for ${this.stage} (index ${patternIndex}):`);
            pattern.forEach(row => console.log(row.join(' ')));
            this.debuggedPattern = true;
        }
        
        // Create obstacles based on pattern
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    const x = baseX + (col + 0.5) * cellSize;
                    const y = baseY + (row + 0.5) * cellSize;
                    
                    // Add some variation to position
                    const offsetX = this.seededRandom(cellX, cellY, row, col) * 20 - 10;
                    const offsetY = this.seededRandom(cellX, cellY, row + 100, col) * 20 - 10;
                    
                    const obstacle = this.createObstacle(x + offsetX, y + offsetY);
                    if (obstacle) {
                        obstacles.push(obstacle);
                        // Debug first obstacle creation for non-forest
                        if (this.stage !== 'forest' && !this.debuggedFirstObstacle) {
                            console.log(`Created ${this.stage} obstacle at ${x + offsetX}, ${y + offsetY}`);
                            this.debuggedFirstObstacle = true;
                        }
                    }
                }
            }
        }
        
        this.activeObstacles.set(`${cellX},${cellY}`, obstacles);
        
        // Debug obstacle count for non-forest
        if (this.stage !== 'forest' && obstacles.length > 0 && !this.debuggedObstacleCount) {
            console.log(`Cell ${cellX},${cellY} created ${obstacles.length} obstacles for ${this.stage}`);
            console.log(`Total obstacles in group: ${this.obstacles.children.size}`);
            this.debuggedObstacleCount = true;
        }
    }
    
    createObstacle(x, y) {
        let texture;
        let scale;
        
        // Select texture based on stage
        if (this.stage === 'forest') {
            texture = 'tree';
            scale = 0.8;
        } else if (this.stage === 'cave') {
            // Randomly choose between cave textures
            const caveTextures = ['cave-rock', 'cave-crystal', 'cave-stala'];
            const randomIndex = Math.floor(this.seededRandom(x, y, 1, 1) * caveTextures.length);
            texture = caveTextures[randomIndex];
            scale = 0.125; // Scaled down by 75% (25% of 0.5)
        } else if (this.stage === 'lava') {
            // Use cave rock with red tint for lava
            texture = 'cave-rock';
            scale = 0.4;
        }
        
        // Check if texture exists
        if (!this.scene.textures.exists(texture)) {
            console.error(`Texture '${texture}' does not exist for stage ${this.stage}!`);
            return null;
        }
        
        // Create obstacle using the static group's create method
        const obstacle = this.obstacles.create(x, y, texture);
        obstacle.setScale(scale);
        
        // Apply tint for lava rocks
        if (this.stage === 'lava') {
            obstacle.setTint(0xFF4500); // Orange-red for lava rocks
        }
        
        // Configure physics body based on stage
        if (this.stage === 'forest') {
            obstacle.body.setSize(30, 30);
            obstacle.body.setOffset(15, 45);
        } else if (this.stage === 'cave') {
            // Use smaller collision box for scaled down cave obstacles
            obstacle.body.setSize(15, 15);
            obstacle.body.setOffset(7, 15);
        } else if (this.stage === 'lava') {
            obstacle.body.setSize(35, 35);
            obstacle.body.setOffset(22, 42);
        }
        
        // Refresh the physics body after scaling
        obstacle.refreshBody();
        
        // Set depth based on Y position - ensure it's always positive and above floor tiles
        // Add offset to handle negative Y coordinates, but cap at 400 to stay below UI
        const depth = Math.min(400, Math.max(10, Math.floor(y / 10) + 200)); // Ensure minimum depth of 10
        obstacle.setDepth(depth);
        
        // Debug visibility for non-forest
        if (this.stage !== 'forest' && !this.debuggedVisibility) {
            console.log(`Obstacle visibility - visible: ${obstacle.visible}, alpha: ${obstacle.alpha}, depth: ${depth}`);
            console.log(`Obstacle position: ${obstacle.x}, ${obstacle.y}, scale: ${obstacle.scaleX}`);
            this.debuggedVisibility = true;
        }
        
        return obstacle;
    }
    
    removeObstaclesInCell(cellKey, obstacles) {
        obstacles.forEach(obstacle => {
            // Properly destroy obstacles instead of pooling
            obstacle.destroy();
        });
        
        this.activeObstacles.delete(cellKey);
    }
    
    seededRandom(x, y, salt1 = 0, salt2 = 0) {
        // Simple deterministic random based on position
        const hash = ((x + salt1) * 73856093) ^ ((y + salt2) * 19349663);
        return (hash & 0x7fffffff) / 0x7fffffff;
    }
    
    getObstaclesGroup() {
        return this.obstacles;
    }
    
    clear() {
        // Remove all active obstacles
        for (const [cellKey, obstacles] of this.activeObstacles.entries()) {
            this.removeObstaclesInCell(cellKey, obstacles);
        }
        this.activeObstacles.clear();
        this.lastPlayerGridX = null;
        this.lastPlayerGridY = null;
    }
}