// Collision Map Loader for Phaser Games
// This module loads and applies collision maps created with the collision map editor

class CollisionMapLoader {
    constructor(scene) {
        this.scene = scene;
        this.collisionBodies = [];
    }

    // Load collision map from JSON
    async loadCollisionMap(jsonPath) {
        try {
            const response = await fetch(jsonPath);
            const data = await response.json();
            this.createCollisionBodies(data);
            return data;
        } catch (error) {
            console.error('Error loading collision map:', error);
            return null;
        }
    }

    // Create collision bodies from map data
    createCollisionBodies(mapData) {
        if (!mapData || !mapData.shapes) return;

        mapData.shapes.forEach(shape => {
            switch (shape.type) {
                case 'rect':
                    this.createRectangleCollider(shape);
                    break;
                case 'circle':
                    this.createCircleCollider(shape);
                    break;
                case 'polygon':
                    this.createPolygonCollider(shape);
                    break;
            }
        });
    }

    // Create rectangle collider using Arcade Physics
    createRectangleCollider(shape) {
        // For Arcade Physics
        if (this.scene.physics.world.isPaused === undefined) {
            // Using Matter Physics
            const rect = this.scene.matter.add.rectangle(
                shape.x + shape.width/2,
                shape.y + shape.height/2,
                shape.width,
                shape.height,
                {
                    isStatic: true,
                    restitution: shape.bounce || 0.5,
                    friction: shape.friction || 0.1,
                    label: shape.name
                }
            );
            this.collisionBodies.push(rect);
        } else {
            // Using Arcade Physics
            const rect = this.scene.physics.add.staticImage(
                shape.x + shape.width/2,
                shape.y + shape.height/2,
                null
            );
            rect.body.setSize(shape.width, shape.height);
            rect.setVisible(false);
            rect.name = shape.name;
            this.collisionBodies.push(rect);
        }
    }

    // Create circle collider
    createCircleCollider(shape) {
        if (this.scene.physics.world.isPaused === undefined) {
            // Using Matter Physics
            const circle = this.scene.matter.add.circle(
                shape.x,
                shape.y,
                shape.radius,
                {
                    isStatic: true,
                    restitution: shape.bounce || 0.5,
                    friction: shape.friction || 0.1,
                    label: shape.name
                }
            );
            this.collisionBodies.push(circle);
        } else {
            // Using Arcade Physics (approximated with square)
            const circle = this.scene.physics.add.staticImage(
                shape.x,
                shape.y,
                null
            );
            circle.body.setCircle(shape.radius);
            circle.setVisible(false);
            circle.name = shape.name;
            this.collisionBodies.push(circle);
        }
    }

    // Create polygon collider (Matter Physics only)
    createPolygonCollider(shape) {
        if (this.scene.matter) {
            // Convert vertices to Matter format
            const vertices = shape.vertices.map(v => ({ x: v.x, y: v.y }));
            
            const polygon = this.scene.matter.add.fromVertices(
                shape.x,
                shape.y,
                vertices,
                {
                    isStatic: true,
                    restitution: shape.bounce || 0.5,
                    friction: shape.friction || 0.1,
                    label: shape.name
                }
            );
            this.collisionBodies.push(polygon);
        } else {
            console.warn('Polygon colliders require Matter Physics');
        }
    }

    // Enable collision with a game object
    enableCollision(gameObject, options = {}) {
        const { 
            onCollide,
            bounce = true,
            overlap = false
        } = options;

        this.collisionBodies.forEach(body => {
            if (this.scene.physics.world.isPaused === undefined) {
                // Matter Physics collision
                if (onCollide) {
                    this.scene.matter.world.on('collisionstart', (event) => {
                        event.pairs.forEach(pair => {
                            if ((pair.bodyA === body && pair.bodyB === gameObject.body) ||
                                (pair.bodyB === body && pair.bodyA === gameObject.body)) {
                                onCollide(gameObject, body);
                            }
                        });
                    });
                }
            } else {
                // Arcade Physics collision
                if (overlap) {
                    this.scene.physics.add.overlap(gameObject, body, onCollide);
                } else {
                    this.scene.physics.add.collider(gameObject, body, onCollide);
                }
            }
        });
    }

    // Visual debug mode - show collision shapes
    showDebug(show = true) {
        if (!this.debugGraphics) {
            this.debugGraphics = this.scene.add.graphics();
        }

        this.debugGraphics.clear();
        
        if (!show) return;

        this.debugGraphics.lineStyle(2, 0x00ff00, 0.5);
        this.debugGraphics.fillStyle(0x00ff00, 0.1);

        this.collisionBodies.forEach(body => {
            if (body.body) {
                // Arcade Physics body
                const bounds = body.body.getBounds();
                this.debugGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
                this.debugGraphics.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            } else if (body.vertices) {
                // Matter Physics body
                this.debugGraphics.beginPath();
                this.debugGraphics.moveTo(body.vertices[0].x, body.vertices[0].y);
                body.vertices.forEach((vertex, i) => {
                    if (i > 0) {
                        this.debugGraphics.lineTo(vertex.x, vertex.y);
                    }
                });
                this.debugGraphics.closePath();
                this.debugGraphics.strokePath();
                this.debugGraphics.fillPath();
            }
        });
    }

    // Clean up collision bodies
    destroy() {
        this.collisionBodies.forEach(body => {
            if (body.destroy) {
                body.destroy();
            }
        });
        this.collisionBodies = [];
        
        if (this.debugGraphics) {
            this.debugGraphics.destroy();
        }
    }
}

// Example usage in a Phaser scene:
/*
class PinballScene extends Phaser.Scene {
    create() {
        // Load background
        this.add.image(0, 0, 'pinball-table').setOrigin(0, 0);
        
        // Load collision map
        this.collisionLoader = new CollisionMapLoader(this);
        this.collisionLoader.loadCollisionMap('assets/levels/pinball-collision.json').then(data => {
            // Create pinball
            this.ball = this.physics.add.image(400, 300, 'ball');
            this.ball.setCircle(10);
            this.ball.setBounce(0.8);
            
            // Enable collision with all mapped surfaces
            this.collisionLoader.enableCollision(this.ball, {
                onCollide: (ball, surface) => {
                    // Handle special surfaces (bumpers, targets, etc)
                    if (surface.label === 'bumper') {
                        this.addScore(100);
                        this.playBumperSound();
                    }
                },
                bounce: true
            });
            
            // Show debug overlay (press D to toggle)
            this.input.keyboard.on('keydown-D', () => {
                this.debugMode = !this.debugMode;
                this.collisionLoader.showDebug(this.debugMode);
            });
        });
    }
}
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollisionMapLoader;
}