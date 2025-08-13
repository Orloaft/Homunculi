class SpatialHashGrid {
    constructor(cellSize = 128) {
        this.cellSize = cellSize;
        this.grid = new Map();
        this.entityCells = new Map(); // Track which cells each entity is in
    }
    
    // Get cell key from world coordinates
    getCellKey(x, y) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }
    
    // Get all cell keys an entity occupies (for larger entities)
    getEntityCells(x, y, width = 0, height = 0) {
        const cells = [];
        const left = x - width / 2;
        const right = x + width / 2;
        const top = y - height / 2;
        const bottom = y + height / 2;
        
        const startX = Math.floor(left / this.cellSize);
        const endX = Math.floor(right / this.cellSize);
        const startY = Math.floor(top / this.cellSize);
        const endY = Math.floor(bottom / this.cellSize);
        
        for (let cellX = startX; cellX <= endX; cellX++) {
            for (let cellY = startY; cellY <= endY; cellY++) {
                cells.push(`${cellX},${cellY}`);
            }
        }
        
        return cells;
    }
    
    // Add entity to the grid
    add(entity, x, y, width = 0, height = 0) {
        const cells = this.getEntityCells(x, y, width, height);
        
        // Remove from old cells if entity moved
        this.remove(entity);
        
        // Add to new cells
        cells.forEach(cellKey => {
            if (!this.grid.has(cellKey)) {
                this.grid.set(cellKey, new Set());
            }
            this.grid.get(cellKey).add(entity);
        });
        
        // Track which cells this entity is in
        this.entityCells.set(entity, cells);
    }
    
    // Remove entity from the grid
    remove(entity) {
        const cells = this.entityCells.get(entity);
        if (cells) {
            cells.forEach(cellKey => {
                const cell = this.grid.get(cellKey);
                if (cell) {
                    cell.delete(entity);
                    if (cell.size === 0) {
                        this.grid.delete(cellKey);
                    }
                }
            });
            this.entityCells.delete(entity);
        }
    }
    
    // Update entity position
    update(entity, x, y, width = 0, height = 0) {
        this.add(entity, x, y, width, height);
    }
    
    // Get all entities near a point
    getNearby(x, y, radius) {
        const nearby = new Set();
        const cellRadius = Math.ceil(radius / this.cellSize);
        const centerCellX = Math.floor(x / this.cellSize);
        const centerCellY = Math.floor(y / this.cellSize);
        
        for (let dx = -cellRadius; dx <= cellRadius; dx++) {
            for (let dy = -cellRadius; dy <= cellRadius; dy++) {
                const cellKey = `${centerCellX + dx},${centerCellY + dy}`;
                const cell = this.grid.get(cellKey);
                if (cell) {
                    cell.forEach(entity => nearby.add(entity));
                }
            }
        }
        
        return Array.from(nearby);
    }
    
    // Get all entities in a rectangular area
    getInRect(x, y, width, height) {
        const entities = new Set();
        const cells = this.getEntityCells(x, y, width, height);
        
        cells.forEach(cellKey => {
            const cell = this.grid.get(cellKey);
            if (cell) {
                cell.forEach(entity => entities.add(entity));
            }
        });
        
        return Array.from(entities);
    }
    
    // Query entities within camera bounds (for frustum culling)
    getInFrustum(camera, padding = 100) {
        const left = camera.worldView.x - padding;
        const top = camera.worldView.y - padding;
        const width = camera.worldView.width + padding * 2;
        const height = camera.worldView.height + padding * 2;
        
        return this.getInRect(
            left + width / 2,
            top + height / 2,
            width,
            height
        );
    }
    
    // Clear the grid
    clear() {
        this.grid.clear();
        this.entityCells.clear();
    }
    
    // Get stats for debugging
    getStats() {
        let totalEntities = 0;
        let maxEntitiesPerCell = 0;
        let cellCount = this.grid.size;
        
        this.grid.forEach(cell => {
            totalEntities += cell.size;
            maxEntitiesPerCell = Math.max(maxEntitiesPerCell, cell.size);
        });
        
        return {
            cellCount,
            totalEntities: this.entityCells.size,
            maxEntitiesPerCell,
            avgEntitiesPerCell: cellCount > 0 ? totalEntities / cellCount : 0
        };
    }
}