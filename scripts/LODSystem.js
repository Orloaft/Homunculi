class LODSystem {
    constructor() {
        this.updateFrequencies = {
            near: 1,      // Every frame
            medium: 3,    // Every 3 frames
            far: 6,       // Every 6 frames
            veryFar: 12   // Every 12 frames
        };
        
        this.distances = {
            near: 400,
            medium: 800,
            far: 1200,
            veryFar: 1600
        };
        
        this.frameCounter = 0;
    }
    
    update() {
        this.frameCounter++;
    }
    
    shouldUpdate(distance, category = 'entity') {
        const lod = this.getDetailLevel(distance);
        const frequency = this.updateFrequencies[lod];
        
        // Stagger updates to distribute load
        const offset = this.getStaggerOffset(category);
        return (this.frameCounter + offset) % frequency === 0;
    }
    
    getDetailLevel(distance) {
        if (distance < this.distances.near) return 'near';
        if (distance < this.distances.medium) return 'medium';
        if (distance < this.distances.far) return 'far';
        return 'veryFar';
    }
    
    getStaggerOffset(category) {
        // Different offsets for different entity types to spread updates
        const offsets = {
            entity: 0,
            projectile: 1,
            particle: 2,
            decoration: 3
        };
        return offsets[category] || 0;
    }
    
    // Get update priority (higher = more important)
    getUpdatePriority(distance, isVisible = true, isInteracting = false) {
        let priority = 0;
        
        // Base priority from distance
        if (distance < this.distances.near) priority = 100;
        else if (distance < this.distances.medium) priority = 50;
        else if (distance < this.distances.far) priority = 20;
        else priority = 10;
        
        // Modifiers
        if (isVisible) priority *= 2;
        if (isInteracting) priority *= 3;
        
        return priority;
    }
    
    // Simplified animation update for distant objects
    updateAnimationLOD(sprite, distance) {
        const lod = this.getDetailLevel(distance);
        
        switch(lod) {
            case 'near':
                // Full animation
                if (sprite.anims && sprite.anims.isPlaying) {
                    sprite.anims.timeScale = 1;
                }
                break;
            case 'medium':
                // Reduced animation speed
                if (sprite.anims && sprite.anims.isPlaying) {
                    sprite.anims.timeScale = 0.5;
                }
                break;
            case 'far':
                // Very slow animation
                if (sprite.anims && sprite.anims.isPlaying) {
                    sprite.anims.timeScale = 0.25;
                }
                break;
            case 'veryFar':
                // Stop animation, show static frame
                if (sprite.anims && sprite.anims.isPlaying) {
                    sprite.anims.pause();
                }
                break;
        }
    }
    
    // Reduce physics complexity for distant objects
    getPhysicsLOD(distance) {
        const lod = this.getDetailLevel(distance);
        
        return {
            enablePhysics: lod !== 'veryFar',
            enableRotation: lod === 'near' || lod === 'medium',
            enableAcceleration: lod === 'near',
            collisionCheckRadius: lod === 'near' ? 100 : lod === 'medium' ? 50 : 25
        };
    }
}