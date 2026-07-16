class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = this.scene.physics.add.staticGroup();
        this.activeObstacles = new Map(); // Track obstacles by grid position
        this.obstaclePool = [];
        this.gridSize = 600; // Increased from 300 to make obstacles more sparse
        this.viewDistance = 1500; // Increased view distance to load more cells
        this.lastPlayerGridX = null;
        this.lastPlayerGridY = null;
        // Define patterns for each stage - ULTRA SPARSE (97.5% reduction total)
        this.patterns = {
            forest: [
                // Single tree (rare)
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 1
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 2
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 3
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 4
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Single tree corner (very rare)
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 1]
                ]
            ],
            cave: [
                // Single rock (rare)
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 1
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 2
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 3
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 4
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            ],
            lava: [
                // Single lava rock (rare)
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 1
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 2
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 3
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 4
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            ],
            sand: [
                // Single cactus (rare)
                [
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Two cacti diagonal
                [
                    [1, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 1],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 1
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 2
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Single cactus corner
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 1, 0]
                ]
            ],
            grave: [
                // Single tombstone center
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Two tombstones row
                [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 1
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Corner tombstone
                [
                    [0, 0, 0, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 2
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            ],
            castle: [
                // Single bookshelf corner
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 1],
                    [0, 0, 0, 0]
                ],
                // Two crates diagonal
                [
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 1, 0]
                ],
                // Empty pattern 1
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Weapon rack and table
                [
                    [0, 0, 0, 0],
                    [1, 0, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 2
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Single table center
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]
                ]
            ],
            snow: [
                // Single ice block (rare)
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Snow tree corner
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 2, 0]
                ],
                // Empty pattern 1
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Ice block and tree diagonal
                [
                    [1, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 2],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 2
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Snow tree center
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 2, 0, 0],
                    [0, 0, 0, 0]
                ],
                // Empty pattern 3
                [
                    [0, 0, 0, 0],
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
            lava: 'lava-rock',
            sand: 'cactus',
            grave: 'tombstone',
            castle: 'castle', // Castle uses mixed obstacles
            spire: 'forest', // Spire starts with forest obstacles
            snow: 'snow' // Snow uses mixed ice blocks and snow trees
        };
    }
    initialize(stage) {
        this.stage = stage;
        // For spire, use forest patterns initially (will change with biomes)
        const patternStage = stage === 'spire' ? 'forest' : stage;
        this.currentPatterns = this.patterns[patternStage] || this.patterns.forest;
        this.obstacleType = this.obstacleTypes[stage] || 'tree';
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
            pattern.forEach(row => this.debuggedPattern = true);
        }
        // Create obstacles based on pattern
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] !== 0) {
                    const x = baseX + (col + 0.5) * cellSize;
                    const y = baseY + (row + 0.5) * cellSize;
                    // Add some variation to position
                    const offsetX = this.seededRandom(cellX, cellY, row, col) * 20 - 10;
                    const offsetY = this.seededRandom(cellX, cellY, row + 100, col) * 20 - 10;
                    const obstacle = this.createObstacle(x + offsetX, y + offsetY, pattern[row][col]);
                    if (obstacle) {
                        obstacles.push(obstacle);
                        // Debug first obstacle creation for non-forest
                        if (this.stage !== 'forest' && !this.debuggedFirstObstacle) {
                            this.debuggedFirstObstacle = true;
                        }
                    }
                }
            }
        }
        this.activeObstacles.set(`${cellX},${cellY}`, obstacles);
        // Debug obstacle count for non-forest
        if (this.stage !== 'forest' && obstacles.length > 0 && !this.debuggedObstacleCount) {
            this.debuggedObstacleCount = true;
        }
    }
    createObstacle(x, y, patternValue = 1) {
        let texture;
        let scale;
        // Select texture based on stage
        if (this.stage === 'forest' || this.stage === 'spire') {
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
        } else if (this.stage === 'sand') {
            texture = 'cactus';
            scale = 0.125; // Scaled down by 75% (25% of 0.5)
        } else if (this.stage === 'swamp') {
            // Randomly choose between swamp obstacles
            const swampTextures = ['swamprock', 'swampstump'];
            const randomIndex = Math.floor(this.seededRandom(x, y, 1, 1) * swampTextures.length);
            texture = swampTextures[randomIndex];
            scale = texture === 'swamprock' ? 0.5 : 0.6; // Different scales for each
        } else if (this.stage === 'grave') {
            texture = 'tombstone';
            scale = 0.105; // Scaled down another 30% from 0.15
        } else if (this.stage === 'castle') {
            // Castle stage uses multiple obstacle types with weights (scaled up 200%)
            const castleObstacles = [
                { texture: 'castle-bookshelf', weight: 25, scale: 1.0 },
                { texture: 'castle-crate', weight: 40, scale: 0.8 },
                { texture: 'castle-table', weight: 20, scale: 0.9 },
                { texture: 'castle-weapon-rack', weight: 15, scale: 1.0 }
            ];
            // Calculate total weight
            const totalWeight = castleObstacles.reduce((sum, obs) => sum + obs.weight, 0);
            // Choose random obstacle based on weights
            const random = this.seededRandom(x, y, 1, 1) * totalWeight;
            let cumulativeWeight = 0;
            for (const obs of castleObstacles) {
                cumulativeWeight += obs.weight;
                if (random < cumulativeWeight) {
                    texture = obs.texture;
                    scale = obs.scale;
                    break;
                }
            }
        } else if (this.stage === 'snow') {
            // Snow stage uses pattern values: 1 = ice block, 2 = snow tree
            if (patternValue === 1) {
                texture = 'snow-ice-block';
                scale = 0.4;
            } else if (patternValue === 2) {
                texture = 'snow-tree';
                scale = 0.7;
            } else {
                // Default to ice block
                texture = 'snow-ice-block';
                scale = 0.4;
            }
        }
        // Stages without an obstacle art family (for example Ocean) intentionally
        // leave generated cells empty instead of requesting an undefined texture.
        if (!texture) {
            return null;
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
        if (this.stage === 'forest' || this.stage === 'spire') {
            obstacle.body.setSize(30, 30);
            obstacle.body.setOffset(15, 45);
        } else if (this.stage === 'cave') {
            // Use smaller collision box for scaled down cave obstacles
            obstacle.body.setSize(15, 15);
            obstacle.body.setOffset(7, 15);
        } else if (this.stage === 'lava') {
            obstacle.body.setSize(35, 35);
            obstacle.body.setOffset(22, 42);
        } else if (this.stage === 'sand') {
            // Cactus has narrow collision box (scaled down)
            obstacle.body.setSize(10, 15);
            obstacle.body.setOffset(5, 10);
        } else if (this.stage === 'grave') {
            // Tombstone collision box (scaled down further)
            obstacle.body.setSize(7, 8);
            obstacle.body.setOffset(3, 6);
        } else if (this.stage === 'castle') {
            // Castle obstacle collision boxes (scaled up 200%)
            if (texture === 'castle-bookshelf') {
                obstacle.body.setSize(60, 50);
                obstacle.body.setOffset(30, 40);
            } else if (texture === 'castle-crate') {
                obstacle.body.setSize(50, 50);
                obstacle.body.setOffset(24, 24);
            } else if (texture === 'castle-table') {
                obstacle.body.setSize(70, 40);
                obstacle.body.setOffset(34, 30);
            } else if (texture === 'castle-weapon-rack') {
                obstacle.body.setSize(60, 50);
                obstacle.body.setOffset(30, 40);
            }
        } else if (this.stage === 'snow') {
            // Snow obstacle collision boxes
            if (texture === 'snow-ice-block') {
                obstacle.body.setSize(30, 30);
                obstacle.body.setOffset(15, 15);
            } else if (texture === 'snow-tree') {
                obstacle.body.setSize(25, 25);
                obstacle.body.setOffset(12, 35);
            }
        }
        // Refresh the physics body after scaling
        obstacle.refreshBody();
        // Set depth based on Y position - ensure it's always positive and above floor tiles
        // Add offset to handle negative Y coordinates, but cap at 400 to stay below UI
        const depth = Math.min(400, Math.max(10, Math.floor(y / 10) + 200)); // Ensure minimum depth of 10
        obstacle.setDepth(depth);
        // Debug visibility for non-forest
        if (this.stage !== 'forest' && !this.debuggedVisibility) {
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
