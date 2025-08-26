// Base Boss Class
class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture);
        
        this.scene = scene;
        this.config = config;
        
        // Core stats
        this.maxHealth = config.health || 1000;
        this.health = this.maxHealth;
        this.damage = config.damage || 50;
        this.speed = config.speed || 50;
        
        // State machine
        this.currentState = null;
        this.states = new Map();
        this.stateTimer = 0;
        
        // Behavior system
        this.behaviors = [];
        this.behaviorIndex = 0;
        this.behaviorTimer = 0;
        
        // Combat flags
        this.isInvulnerable = false;
        this.isActive = true;
        
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.initializeStates();
        this.initializeBehaviors();
        this.changeState('idle');
    }
    
    initializeStates() {
        // Override in child classes
        this.addState('idle', {
            enter: () => {
                this.body.setVelocity(0);
            },
            update: (dt) => {
                // Default idle behavior
            },
            exit: () => {}
        });
    }
    
    initializeBehaviors() {
        // Override in child classes to define boss patterns
    }
    
    addState(name, stateConfig) {
        this.states.set(name, {
            enter: stateConfig.enter || (() => {}),
            update: stateConfig.update || ((dt) => {}),
            exit: stateConfig.exit || (() => {}),
            duration: stateConfig.duration || -1 // -1 = infinite
        });
    }
    
    changeState(newState) {
        if (this.currentState && this.states.has(this.currentState)) {
            this.states.get(this.currentState).exit.call(this);
        }
        
        this.currentState = newState;
        this.stateTimer = 0;
        
        if (this.states.has(newState)) {
            this.states.get(newState).enter.call(this);
        }
    }
    
    addBehavior(behavior) {
        this.behaviors.push(behavior);
    }
    
    update(time, delta) {
        if (!this.isActive) return;
        
        const dt = delta / 1000; // Convert to seconds
        
        // Update current state
        if (this.currentState && this.states.has(this.currentState)) {
            const state = this.states.get(this.currentState);
            state.update.call(this, dt);
            
            this.stateTimer += dt;
            
            // Auto-transition if duration is set
            if (state.duration > 0 && this.stateTimer >= state.duration) {
                this.onStateComplete();
            }
        }
        
        // Update behavior system
        this.updateBehaviors(dt);
    }
    
    updateBehaviors(dt) {
        if (this.behaviors.length === 0) return;
        
        const currentBehavior = this.behaviors[this.behaviorIndex];
        if (!currentBehavior) return;
        
        // Execute current behavior
        const shouldContinue = currentBehavior.update.call(this, dt);
        
        // Check if behavior should end
        this.behaviorTimer += dt;
        if (!shouldContinue || 
            (currentBehavior.duration > 0 && this.behaviorTimer >= currentBehavior.duration)) {
            this.nextBehavior();
        }
    }
    
    nextBehavior() {
        if (this.behaviors.length === 0) return;
        
        // Call exit on current behavior
        const currentBehavior = this.behaviors[this.behaviorIndex];
        if (currentBehavior.exit) {
            currentBehavior.exit.call(this);
        }
        
        // Move to next behavior
        this.behaviorIndex = (this.behaviorIndex + 1) % this.behaviors.length;
        this.behaviorTimer = 0;
        
        // Call enter on new behavior
        const newBehavior = this.behaviors[this.behaviorIndex];
        if (newBehavior.enter) {
            newBehavior.enter.call(this);
        }
    }
    
    onStateComplete() {
        // Override in child classes or behaviors
    }
    
    takeDamage(amount) {
        if (this.isInvulnerable) return false;
        
        this.health = Math.max(0, this.health - amount);
        
        if (this.health <= 0) {
            this.die();
        }
        
        return true;
    }
    
    die() {
        this.isActive = false;
        this.changeState('death');
        // Emit death event, drop loot, etc.
        this.scene.events.emit('boss-defeated', this);
    }
    
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
}

// Example Boss Implementation
class FireDemon extends Boss {
    constructor(scene, x, y) {
        const config = {
            health: 2000,
            damage: 75,
            speed: 80
        };
        
        super(scene, x, y, 'fire-demon', config);
    }
    
    initializeStates() {
        super.initializeStates();
        
        this.addState('charging', {
            enter: () => {
                this.tint = 0xff4444;
                this.isInvulnerable = true;
            },
            update: (dt) => {
                // Visual charging effect
                this.alpha = 0.5 + Math.sin(this.stateTimer * 10) * 0.3;
            },
            exit: () => {
                this.tint = 0xffffff;
                this.alpha = 1;
                this.isInvulnerable = false;
            },
            duration: 2.0
        });
        
        this.addState('attacking', {
            enter: () => {
                this.body.setVelocity(0);
            },
            update: (dt) => {
                // Attack logic handled by behaviors
            },
            duration: 3.0
        });
        
        this.addState('moving', {
            enter: () => {
                this.targetPlayer();
            },
            update: (dt) => {
                this.moveTowardsPlayer(dt);
            },
            duration: 4.0
        });
    }
    
    initializeBehaviors() {
        // Phase 1: Above 70% health
        this.addBehavior({
            name: 'fireball-barrage',
            duration: 5.0,
            enter: () => {
                this.changeState('charging');
                this.fireballCount = 0;
            },
            update: (dt) => {
                if (this.currentState === 'charging') return true;
                
                if (this.currentState !== 'attacking') {
                    this.changeState('attacking');
                }
                
                // Fire 3 fireballs with timing
                if (this.stateTimer > 0.5 && this.fireballCount < 3) {
                    if (Math.floor(this.stateTimer * 2) > this.fireballCount) {
                        this.fireFireball();
                        this.fireballCount++;
                    }
                }
                
                return this.getHealthPercentage() > 0.7;
            }
        });
        
        this.addBehavior({
            name: 'chase-player',
            duration: 4.0,
            enter: () => {
                this.changeState('moving');
            },
            update: (dt) => {
                return this.getHealthPercentage() > 0.7;
            }
        });
        
        // Phase 2: 30-70% health
        this.addBehavior({
            name: 'flame-wave',
            duration: 6.0,
            enter: () => {
                this.changeState('charging');
            },
            update: (dt) => {
                if (this.currentState === 'charging') return true;
                
                if (this.currentState !== 'attacking') {
                    this.changeState('attacking');
                }
                
                // Create circular flame wave
                if (this.stateTimer > 1.0 && !this.waveCreated) {
                    this.createFlameWave();
                    this.waveCreated = true;
                }
                
                const hp = this.getHealthPercentage();
                return hp > 0.3 && hp <= 0.7;
            },
            exit: () => {
                this.waveCreated = false;
            }
        });
        
        // Phase 3: Below 30% health (enraged)
        this.addBehavior({
            name: 'meteor-rain',
            duration: 8.0,
            enter: () => {
                this.changeState('charging');
                this.meteorTimer = 0;
            },
            update: (dt) => {
                if (this.currentState === 'charging') return true;
                
                if (this.currentState !== 'attacking') {
                    this.changeState('attacking');
                }
                
                // Spawn meteors every 0.5 seconds
                this.meteorTimer += dt;
                if (this.meteorTimer >= 0.5) {
                    this.spawnMeteor();
                    this.meteorTimer = 0;
                }
                
                return this.getHealthPercentage() <= 0.3;
            }
        });
    }
    
    onStateComplete() {
        // Default transition back to behavior control
        if (this.currentState === 'charging') {
            this.changeState('attacking');
        } else if (this.currentState === 'attacking') {
            this.changeState('idle');
        }
    }
    
    targetPlayer() {
        const player = this.scene.player;
        this.targetX = player.x;
        this.targetY = player.y;
    }
    
    moveTowardsPlayer(dt) {
        const player = this.scene.player;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        
        this.body.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
    }
    
    fireFireball() {
        const player = this.scene.player;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        
        // Create fireball projectile
        const fireball = this.scene.add.sprite(this.x, this.y, 'fireball');
        this.scene.physics.add.existing(fireball);
        
        const speed = 200;
        fireball.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Add collision with player
        this.scene.physics.add.overlap(fireball, player, () => {
            player.takeDamage(this.damage);
            fireball.destroy();
        });
        
        // Auto-destroy after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            if (fireball.active) fireball.destroy();
        });
    }
    
    createFlameWave() {
        const numFlames = 16;
        for (let i = 0; i < numFlames; i++) {
            const angle = (i / numFlames) * Math.PI * 2;
            const flame = this.scene.add.sprite(this.x, this.y, 'flame');
            this.scene.physics.add.existing(flame);
            
            const speed = 150;
            flame.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Collision and cleanup logic...
        }
    }
    
    spawnMeteor() {
        const player = this.scene.player;
        const offsetX = Phaser.Math.Between(-100, 100);
        const offsetY = Phaser.Math.Between(-100, 100);
        
        const meteor = this.scene.add.sprite(
            player.x + offsetX,
            player.y + offsetY - 500,
            'meteor'
        );
        
        this.scene.physics.add.existing(meteor);
        meteor.body.setVelocity(0, 400);
        
        // Add warning indicator, collision, etc...
    }
}

// Usage in your game scene:
// const boss = new FireDemon(this, 400, 300);
// this.bosses.add(boss);