class PhysicsOptimizer {
    constructor(scene) {
        this.scene = scene;
        this.physicsUpdateRate = 30; // 30 FPS physics (half of render)
        this.lastPhysicsUpdate = 0;
        this.dynamicBounds = {
            x: 0,
            y: 0,
            width: 2000,
            height: 2000
        };
        this.boundsPadding = 500; // Extra space around camera
    }
    
    initialize() {
        // Configure physics world for better performance
        const physics = this.scene.physics.world;
        
        // Disable fixed bounds - we'll manage them dynamically
        physics.setBounds(false);
        
        // Reduce physics iterations for performance
        physics.positionIterations = 2; // Default is 4
        physics.velocityIterations = 2; // Default is 4
        
        // Set collision processing mode
        physics.forceX = false; // Don't force constant X velocity
        
        // Configure collision bias
        physics.OVERLAP_BIAS = 8; // Smaller bias for better performance
        
        // Set time step
        physics.timeScale = 1;
        physics.fixedStep = true;
        physics.fps = this.physicsUpdateRate;
    }
    
    update(time, delta) {
        // Update dynamic physics bounds based on camera
        this.updatePhysicsBounds();
        
        // Throttle physics updates for distant objects
        if (time - this.lastPhysicsUpdate >= 1000 / this.physicsUpdateRate) {
            this.lastPhysicsUpdate = time;
            this.updateDistantPhysics();
        }
    }
    
    updatePhysicsBounds() {
        const camera = this.scene.cameras.main;
        if (!camera) return;
        
        // Calculate bounds around camera view
        const newBounds = {
            x: camera.worldView.x - this.boundsPadding,
            y: camera.worldView.y - this.boundsPadding,
            width: camera.worldView.width + this.boundsPadding * 2,
            height: camera.worldView.height + this.boundsPadding * 2
        };
        
        // Only update if bounds changed significantly
        if (Math.abs(newBounds.x - this.dynamicBounds.x) > 100 ||
            Math.abs(newBounds.y - this.dynamicBounds.y) > 100) {
            
            this.dynamicBounds = newBounds;
            
            // Update physics world bounds
            this.scene.physics.world.setBounds(
                newBounds.x,
                newBounds.y,
                newBounds.width,
                newBounds.height,
                false, false, false, false // No collision with bounds
            );
        }
    }
    
    updateDistantPhysics() {
        // This would handle LOD physics updates for distant objects
        // Currently handled by enemy manager's dormant system
    }
    
    // Optimize collision checks between groups
    optimizeCollisions(group1, group2, callback) {
        const world = this.scene.physics.world;
        
        // Use spatial hash for efficient broad phase
        if (this.scene.spatialGrid) {
            // Get all entities from group1
            const entities1 = group1.getChildren();
            
            entities1.forEach(entity1 => {
                if (!entity1.active) return;
                
                // Get nearby entities from group2 using spatial grid
                const nearby = this.scene.spatialGrid.getNearby(
                    entity1.x, 
                    entity1.y, 
                    100 // Check radius
                );
                
                nearby.forEach(entity2 => {
                    if (group2.contains(entity2) && entity2.active) {
                        // Check actual collision
                        if (world.overlap(entity1, entity2)) {
                            callback(entity1, entity2);
                        }
                    }
                });
            });
        } else {
            // Fallback to standard collision
            this.scene.physics.add.overlap(group1, group2, callback);
        }
    }
    
    // Sleep physics for objects outside active area
    sleepBody(body) {
        if (body && body.enable) {
            body.enable = false;
            body.setVelocity(0, 0);
        }
    }
    
    // Wake physics for objects entering active area
    wakeBody(body) {
        if (body && !body.enable) {
            body.enable = true;
        }
    }
    
    // Check if position is within active physics bounds
    isInActiveBounds(x, y) {
        return x >= this.dynamicBounds.x &&
               x <= this.dynamicBounds.x + this.dynamicBounds.width &&
               y >= this.dynamicBounds.y &&
               y <= this.dynamicBounds.y + this.dynamicBounds.height;
    }
}