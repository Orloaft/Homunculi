// Hitbox Configuration Module
// This module loads and applies hitbox data from hitboxes.json

class HitboxConfig {
    constructor() {
        this.hitboxData = {};
        this.loaded = false;
    }
    
    // Load hitbox data from JSON file
    load() {
        try {
            // In a real implementation, this would load from a server
            // For now, we'll use the data stored in localStorage
            const savedData = localStorage.getItem('hitboxData');
            if (savedData) {
                this.hitboxData = JSON.parse(savedData);
                this.loaded = true;
                console.log('Loaded hitbox configuration:', this.hitboxData);
            } else {
                // Default hitbox data
                this.hitboxData = {
                    "tree": { "width": 26, "height": 39, "offsetX": 3, "offsetY": 12 },
                    "bat": { "width": 60, "height": 40, "offsetX": 45, "offsetY": 55 },
                    "mushroom": { "width": 30, "height": 35, "offsetX": 9, "offsetY": 8 },
                    "slime": { "width": 30, "height": 20, "offsetX": 9, "offsetY": 19 },
                    "soul": { "width": 30, "height": 40, "offsetX": 8, "offsetY": 5 },
                    "summoner": { "width": 30, "height": 60, "offsetX": 8, "offsetY": 2 },
                    "bloboid": { "width": 50, "height": 40, "offsetX": 23, "offsetY": 30 },
                    "golem": { "width": 50, "height": 70, "offsetX": 15, "offsetY": 5 },
                    "sorcerer": { "width": 60, "height": 80, "offsetX": 10, "offsetY": 0 },
                    "fireslime": { "width": 30, "height": 20, "offsetX": 9, "offsetY": 19 },
                    "fireworm": { "width": 40, "height": 30, "offsetX": 12, "offsetY": 15 },
                    "clubimp": { "width": 50, "height": 60, "offsetX": 15, "offsetY": 10 },
                    "axeimp": { "width": 50, "height": 60, "offsetX": 15, "offsetY": 10 },
                    "kobold": { "width": 80, "height": 70, "offsetX": 34, "offsetY": 13 },
                    "darkbat": { "width": 50, "height": 40, "offsetX": 7, "offsetY": 12 },
                    "flyingdemon": { "width": 50, "height": 40, "offsetX": 7, "offsetY": 12 }
                };
                this.loaded = true; // Mark as loaded even with defaults
            }
        } catch (error) {
            console.error('Failed to load hitbox configuration:', error);
            this.loaded = false;
        }
    }
    
    // Apply hitbox configuration to a sprite
    applyHitbox(sprite, enemyType) {
        if (!sprite || !sprite.body) return false;
        
        const hitbox = this.hitboxData[enemyType];
        if (hitbox) {
            console.log(`Applying hitbox for ${enemyType}:`, hitbox);
            sprite.body.setSize(hitbox.width, hitbox.height);
            sprite.body.setOffset(hitbox.offsetX, hitbox.offsetY);
            return true;
        }
        
        console.log(`No hitbox config found for ${enemyType}`);
        return false;
    }
    
    // Get hitbox data for an enemy type
    getHitbox(enemyType) {
        return this.hitboxData[enemyType] || null;
    }
    
    // Update hitbox data
    updateHitbox(enemyType, width, height, offsetX, offsetY) {
        this.hitboxData[enemyType] = {
            width: Math.round(width),
            height: Math.round(height),
            offsetX: Math.round(offsetX),
            offsetY: Math.round(offsetY)
        };
        
        // Save to localStorage
        localStorage.setItem('hitboxData', JSON.stringify(this.hitboxData, null, 2));
    }
    
    // Export all hitbox data
    exportAll() {
        return JSON.stringify(this.hitboxData, null, 2);
    }
}

// Create singleton instance
const hitboxConfig = new HitboxConfig();

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = hitboxConfig;
}