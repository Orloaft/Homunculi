class ChunkManager {
    constructor(scene, chunkSize = 1024) {
        this.scene = scene;
        this.chunkSize = chunkSize;
        this.activeChunks = new Map(); // Currently loaded chunks
        this.chunkPool = []; // Pool of reusable chunk objects
        this.playerChunkX = 0;
        this.playerChunkY = 0;
        this.viewDistance = 1; // Reduced for better performance - only immediate neighbors
        this.chunkUpdateThrottle = 100; // Milliseconds between chunk updates
        this.lastChunkUpdate = 0;
        // Optimization: track visible chunks separately for rendering
        this.visibleChunks = new Set();
        this.frustumPadding = 200; // Extra pixels beyond screen edge
        // Tile patterns for different biomes
        this.tilePatterns = {
            forest: {
                base: 'grass-tile',
                decorations: [], // Remove tree decorations - handled by ObstacleManager
                decorationDensity: 0
            },
            cave: {
                base: 'stone-tile',
                decorations: [], // No decorations for now
                decorationDensity: 0.1
            },
            lava: {
                base: 'lava-tile',
                decorations: [], // No decorations for now
                decorationDensity: 0.08
            },
            sand: {
                base: 'desert-tile',
                decorations: [], // Could add cacti or rocks later
                decorationDensity: 0.05
            }
        };
    }
    initialize(worldType) {
        this.worldType = worldType;
        this.pattern = this.tilePatterns[worldType];
        // Load initial chunks around player
        this.updatePlayerPosition(this.scene.wizard.x, this.scene.wizard.y);
    }
    updatePlayerPosition(x, y) {
        const newChunkX = Math.floor(x / this.chunkSize);
        const newChunkY = Math.floor(y / this.chunkSize);
        // Throttle chunk updates for performance
        const now = Date.now();
        if (now - this.lastChunkUpdate < this.chunkUpdateThrottle) {
            return;
        }
        // Only update if player moved to new chunk
        if (newChunkX !== this.playerChunkX || newChunkY !== this.playerChunkY) {
            this.playerChunkX = newChunkX;
            this.playerChunkY = newChunkY;
            this.lastChunkUpdate = now;
            this.updateActiveChunks();
        }
        // Always update visible chunks for frustum culling
        this.updateVisibleChunks();
    }
    updateActiveChunks() {
        const chunksToLoad = new Set();
        // Determine which chunks should be active
        for (let dx = -this.viewDistance; dx <= this.viewDistance; dx++) {
            for (let dy = -this.viewDistance; dy <= this.viewDistance; dy++) {
                const chunkX = this.playerChunkX + dx;
                const chunkY = this.playerChunkY + dy;
                const key = `${chunkX},${chunkY}`;
                chunksToLoad.add(key);
            }
        }
        // Unload chunks that are too far
        for (const [key, chunk] of this.activeChunks) {
            if (!chunksToLoad.has(key)) {
                this.unloadChunk(key, chunk);
            }
        }
        // Load new chunks
        for (const key of chunksToLoad) {
            if (!this.activeChunks.has(key)) {
                const [x, y] = key.split(',').map(Number);
                this.loadChunk(x, y);
            }
        }
    }
    loadChunk(chunkX, chunkY) {
        const key = `${chunkX},${chunkY}`;
        const worldX = chunkX * this.chunkSize;
        const worldY = chunkY * this.chunkSize;
        // Get or create chunk container
        const chunk = this.chunkPool.pop() || this.createChunkContainer();
        chunk.visible = true;
        // Create base tile
        const baseTile = this.scene.add.tileSprite(
            worldX, 
            worldY, 
            this.chunkSize, 
            this.chunkSize, 
            this.pattern.base
        );
        baseTile.setOrigin(0, 0);
        baseTile.setDepth(-1);
        chunk.tiles.push(baseTile);
        // Add procedural decorations
        const seed = this.hashCoords(chunkX, chunkY);
        this.addDecorations(chunk, worldX, worldY, seed);
        this.activeChunks.set(key, chunk);
    }
    unloadChunk(key, chunk) {
        // Hide and clear chunk
        chunk.visible = false;
        // Destroy all tiles and decorations
        chunk.tiles.forEach(tile => tile.destroy());
        chunk.decorations.forEach(dec => dec.destroy());
        chunk.tiles = [];
        chunk.decorations = [];
        // Return to pool
        this.activeChunks.delete(key);
        this.chunkPool.push(chunk);
    }
    createChunkContainer() {
        return {
            visible: true,
            tiles: [],
            decorations: []
        };
    }
    addDecorations(chunk, worldX, worldY, seed) {
        // Use seeded random for consistent decoration placement
        const rng = this.createSeededRandom(seed);
        const decorationCount = Math.floor(
            (this.chunkSize / 100) * (this.chunkSize / 100) * this.pattern.decorationDensity
        );
        for (let i = 0; i < decorationCount; i++) {
            const decoration = this.pattern.decorations[
                Math.floor(rng() * this.pattern.decorations.length)
            ];
            const x = worldX + rng() * this.chunkSize;
            const y = worldY + rng() * this.chunkSize;
            if (this.scene.textures.exists(decoration)) {
                const sprite = this.scene.add.image(x, y, decoration);
                sprite.setScale(0.8 + rng() * 0.4);
                sprite.setDepth(Math.floor(y / 10));
                sprite.setAlpha(0.8);
                chunk.decorations.push(sprite);
            }
        }
    }
    hashCoords(x, y) {
        // Simple hash function for consistent chunk generation
        return ((x * 73856093) ^ (y * 19349663)) & 0x7fffffff;
    }
    createSeededRandom(seed) {
        // Linear congruential generator
        let s = seed;
        return function() {
            s = (s * 1103515245 + 12345) & 0x7fffffff;
            return s / 0x7fffffff;
        };
    }
    getActiveDecorations() {
        const decorations = [];
        for (const chunk of this.activeChunks.values()) {
            decorations.push(...chunk.decorations);
        }
        return decorations;
    }
    updateVisibleChunks() {
        if (!this.scene.cameras.main) return;
        const camera = this.scene.cameras.main;
        const leftBound = camera.worldView.x - this.frustumPadding;
        const rightBound = camera.worldView.x + camera.worldView.width + this.frustumPadding;
        const topBound = camera.worldView.y - this.frustumPadding;
        const bottomBound = camera.worldView.y + camera.worldView.height + this.frustumPadding;
        this.visibleChunks.clear();
        // Check which chunks are in camera view
        for (const [key, chunk] of this.activeChunks) {
            const [chunkX, chunkY] = key.split(',').map(Number);
            const worldX = chunkX * this.chunkSize;
            const worldY = chunkY * this.chunkSize;
            // Check if chunk intersects with camera bounds
            if (worldX < rightBound && 
                worldX + this.chunkSize > leftBound &&
                worldY < bottomBound && 
                worldY + this.chunkSize > topBound) {
                this.visibleChunks.add(key);
                this.setChunkVisibility(chunk, true);
            } else {
                this.setChunkVisibility(chunk, false);
            }
        }
    }
    setChunkVisibility(chunk, visible) {
        chunk.tiles.forEach(tile => tile.setVisible(visible));
        chunk.decorations.forEach(dec => dec.setVisible(visible));
    }
    isChunkVisible(chunkX, chunkY) {
        return this.visibleChunks.has(`${chunkX},${chunkY}`);
    }
}