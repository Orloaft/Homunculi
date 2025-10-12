// Base Boss Class with State Machine Integration
import BossStateMachine, { BossPatterns } from '../systems/BossStateMachine.js';
export class BaseBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.name = config.name || 'Boss';
        // Core stats
        this.maxHealth = config.health || 1000;
        this.health = this.maxHealth;
        this.damage = config.damage || 50;
        this.moveSpeed = config.moveSpeed || 100;
        this.attackRange = config.attackRange || 300;
        // Combat properties
        this.isInvulnerable = false;
        this.isActive = true;
        this.currentPhase = 1;
        this.attackCooldown = 0;
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Setup physics
        this.body.setSize(this.width * 0.8, this.height * 0.8);
        this.body.setCollideWorldBounds(true);
        // Create state machine
        this.stateMachine = new BossStateMachine(this, scene);
        // Initialize states and behaviors
        this.initializeStates();
        this.initializeBehaviors();
        // Start in idle state
        this.stateMachine.changeState('idle');
        // Create health bar
        this.createHealthBar();
        // Create shadow
        if (scene.createShadow) {
            this.shadow = scene.createShadow(this);
        }
    }
    // Override in child classes to define states
    initializeStates() {
        // Idle state - default behavior
        this.stateMachine.addState('idle', {
            enter: () => {
                this.setVelocity(0, 0);
                if (this.anims.exists(this.texture.key + '-idle')) {
                    this.play(this.texture.key + '-idle');
                }
            },
            update: (dt) => {
                // Face the player
                if (this.scene.wizard && this.scene.wizard.active) {
                    this.flipX = this.scene.wizard.x < this.x;
                }
            }
        });
        // Moving state - move towards player
        this.stateMachine.addState('moving', {
            enter: () => {
                if (this.anims.exists(this.texture.key + '-walk')) {
                    this.play(this.texture.key + '-walk');
                }
            },
            update: (dt) => {
                this.moveTowardsPlayer(dt);
            },
            exit: () => {
                this.setVelocity(0, 0);
            }
        });
        // Stunned state
        this.stateMachine.addState('stunned', {
            enter: () => {
                this.setVelocity(0, 0);
                this.setTint(0x888888);
                this.isInvulnerable = true;
            },
            update: (dt) => {
                // Visual stun effect
                this.alpha = 0.5 + Math.sin(this.stateMachine.getStateTimer() * 10) * 0.3;
            },
            exit: () => {
                this.clearTint();
                this.alpha = 1;
                this.isInvulnerable = false;
            },
            duration: 2.0,
            canInterrupt: false
        });
        // Death state
        this.stateMachine.addState('death', {
            enter: () => {
                this.isActive = false;
                this.setVelocity(0, 0);
                this.body.enable = false;
                // Try different death animation naming conventions
                const deathAnimKeys = [
                    this.texture.key + '-death',
                    this.enemyType + '-death',
                    this.name.toLowerCase().replace(' ', '-') + '-death'
                ];
                let animFound = false;
                for (const animKey of deathAnimKeys) {
                    if (this.anims && this.anims.exists && this.anims.exists(animKey)) {
                        this.play(animKey);
                        this.once('animationcomplete', () => {
                            this.onDeath();
                        });
                        animFound = true;
                        break;
                    }
                }
                if (!animFound) {
                    // No death animation, just call onDeath
                    this.onDeath();
                }
            },
            canInterrupt: false
        });
    }
    // Override in child classes to define behavior patterns
    initializeBehaviors() {
        // Default behavior - just idle
        this.stateMachine.addBehavior('default', {
            condition: () => true,
            priority: 0,
            pattern: [
                { state: 'idle', duration: 2 }
            ]
        });
    }
    update(time, delta) {
        if (!this.isActive) return;
        const dt = delta / 1000; // Convert to seconds
        // Update state machine
        this.stateMachine.update(dt);
        // Update shadow position
        if (this.shadow && this.shadow.active) {
            this.shadow.x = this.x;
            this.shadow.y = this.y + 20;
        }
        // Update health bar position
        if (this.healthBarBg) {
            this.healthBarBg.x = this.x;
            this.healthBarBg.y = this.y - this.height * 0.6 - 20;
            this.healthBar.x = this.healthBarBg.x - (this.healthBarBg.width / 2) + 2;
            this.healthBar.y = this.healthBarBg.y;
        }
        // Reduce cooldowns
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
    }
    moveTowardsPlayer(dt) {
        const player = this.scene.wizard;
        if (!player || !player.active) {
            this.setVelocity(0, 0);
            return;
        }
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        // Only move if not too close
        if (distance > this.attackRange * 0.5) {
            const speed = this.moveSpeed * (this.scene.speedMultiplier || 1);
            this.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            // Face movement direction
            this.flipX = Math.cos(angle) < 0;
        } else {
            this.setVelocity(0, 0);
        }
    }
    takeDamage(amount) {
        if (this.isInvulnerable || !this.isActive) return false;
        this.health = Math.max(0, this.health - amount);
        // Update health bar
        if (this.healthBar) {
            const healthPercent = this.health / this.maxHealth;
            this.healthBar.width = (this.healthBarBg.width - 4) * healthPercent;
        }
        // Flash red
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.clearTint();
        });
        // Check phase transitions
        const healthPercent = this.health / this.maxHealth;
        if (healthPercent <= 0.66 && this.currentPhase === 1) {
            this.currentPhase = 2;
            this.onPhaseChange(2);
        } else if (healthPercent <= 0.33 && this.currentPhase === 2) {
            this.currentPhase = 3;
            this.onPhaseChange(3);
        }
        // Check death
        if (this.health <= 0) {
            this.stateMachine.changeState('death', true);
        }
        return true;
    }
    onPhaseChange(newPhase) {
        // Override in child classes for phase transition effects
        }
    onDeath() {
        // Drop rewards
        if (this.scene.dropRewardChest) {
            this.scene.dropRewardChest(this.x, this.y);
        }
        // Emit death event
        this.scene.events.emit('boss-defeated', this);
        // Clean up
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.shadow) this.shadow.destroy();
        // Destroy after delay
        this.scene.time.delayedCall(1000, () => {
            this.destroy();
        });
    }
    createHealthBar() {
        // Background
        this.healthBarBg = this.scene.add.rectangle(
            this.x, 
            this.y - this.height * 0.6 - 20,
            100, 
            12, 
            0x000000
        );
        this.healthBarBg.setStrokeStyle(2, 0xffffff);
        this.healthBarBg.setDepth(100);
        // Health bar
        this.healthBar = this.scene.add.rectangle(
            this.healthBarBg.x - (this.healthBarBg.width / 2) + 2,
            this.healthBarBg.y,
            this.healthBarBg.width - 4,
            8,
            0xff0000
        );
        this.healthBar.setOrigin(0, 0.5);
        this.healthBar.setDepth(101);
    }
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
    getDistanceToPlayer() {
        const player = this.scene.wizard;
        if (!player || !player.active) return Infinity;
        return Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    }
}
export default BaseBoss;