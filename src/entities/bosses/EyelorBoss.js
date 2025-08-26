// Eyelor Boss - Desert/Sand Land Boss with Eye Beam Attacks

import BaseBoss from '../BaseBoss.js';
import { BossPatterns } from '../../systems/BossStateMachine.js';

export class EyelorBoss extends BaseBoss {
    constructor(scene, x, y) {
        const config = {
            name: 'Eyelor',
            health: 4500,
            damage: 40,
            moveSpeed: 70,
            attackRange: 600
        };
        
        super(scene, x, y, 'eyelor-boss', config);
        
        // Set enemy type for compatibility
        this.enemyType = 'eyelor-boss';
        
        // Eyelor specific properties
        this.projectileSpeed = 200;
        this.projectileBurstCount = 3;
        this.beamChargeTime = 1.5;
        this.sandstormRadius = 400;
        this.visionConeAngle = Math.PI / 3; // 60 degree vision cone
        
        // Set up animations
        this.setScale(2.0);
        this.play('eyelor-move');
    }
    
    initializeStates() {
        super.initializeStates();
        
        // Override moving state with Eyelor animation
        this.stateMachine.addState('moving', {
            enter: () => {
                this.play('eyelor-move');
            },
            update: (dt) => {
                this.moveTowardsPlayer(dt);
                
                // Always face the player (eye follows)
                if (this.scene.wizard && this.scene.wizard.active) {
                    this.flipX = this.scene.wizard.x < this.x;
                }
            },
            exit: () => {
                this.setVelocity(0, 0);
            }
        });
        
        // Eye beam charge state
        this.stateMachine.addState('beam_charge', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('eyelor-attack');
                this.setTint(0xffff00);
                
                // Create targeting laser
                this.createTargetingLaser();
            },
            update: (dt, stateMachine) => {
                // Track player with laser
                this.updateTargetingLaser();
                
                // Pulsing effect
                const timer = stateMachine.getStateTimer();
                this.alpha = 0.8 + Math.sin(timer * 10) * 0.2;
            },
            exit: () => {
                this.clearTint();
                this.alpha = 1;
                this.removeTargetingLaser();
            },
            duration: 1.5,
            canInterrupt: false
        });
        
        // Eye beam attack state
        this.stateMachine.addState('eye_beam', {
            enter: () => {
                this.fireEyeBeam();
            },
            update: (dt) => {
                // Beam follows during attack
                this.updateEyeBeam();
            },
            exit: () => {
                this.cleanupEyeBeam();
                this.play('eyelor-move');
            },
            duration: 2.0,
            canInterrupt: false
        });
        
        // Projectile burst state
        this.stateMachine.addState('projectile_burst', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('eyelor-attack');
                this.burstCount = 0;
            },
            update: (dt, stateMachine) => {
                // Fire projectiles in bursts
                if (stateMachine.getStateTimer() > this.burstCount * 0.3 + 0.2) {
                    this.fireProjectileBurst();
                    this.burstCount++;
                }
            },
            exit: () => {
                this.play('eyelor-move');
            }
        });
        
        // Sandstorm state - area denial attack
        this.stateMachine.addState('sandstorm', {
            enter: () => {
                this.setVelocity(0, 0);
                this.setTint(0xffaa00);
                
                // Warning text
                const warningText = this.scene.add.text(this.x, this.y - 100, 'SANDSTORM!', {
                    fontSize: '32px',
                    color: '#ffaa00',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4
                });
                warningText.setOrigin(0.5);
                warningText.setDepth(200);
                
                this.scene.tweens.add({
                    targets: warningText,
                    y: warningText.y - 50,
                    scale: 1.5,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => warningText.destroy()
                });
            },
            update: (dt, stateMachine) => {
                if (stateMachine.getStateTimer() > 0.5 && !this.sandstormActive) {
                    this.createSandstorm();
                    this.sandstormActive = true;
                }
            },
            exit: () => {
                this.clearTint();
                this.removeSandstorm();
                this.sandstormActive = false;
            },
            duration: 4.0
        });
        
        // All-seeing eye state (phase 3) - rapid fire in all directions
        this.stateMachine.addState('all_seeing', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('eyelor-attack');
                this.setTint(0xff0000);
                this.setScale(2.5); // Grow larger
                this.allSeeingCount = 0;
                
                // Dramatic effect
                this.scene.cameras.main.shake(500, 0.02);
            },
            update: (dt, stateMachine) => {
                // Spin and fire projectiles
                this.rotation += dt * 2;
                
                if (stateMachine.getStateTimer() > this.allSeeingCount * 0.1 + 0.3) {
                    this.fireRadialProjectiles();
                    this.allSeeingCount++;
                }
            },
            exit: () => {
                this.clearTint();
                this.rotation = 0;
                this.setScale(2.0);
                this.play('eyelor-move');
            },
            duration: 3.0,
            canInterrupt: false
        });
    }
    
    initializeBehaviors() {
        // Phase 1: Basic attacks (100% - 66% health)
        this.stateMachine.addBehavior('phase1_observer', {
            condition: () => this.currentPhase === 1,
            priority: 10,
            pattern: [
                ...BossPatterns.movementPattern('moving', 2),
                ...BossPatterns.simpleAttack('projectile_burst', 'idle', 2, 0.5),
                ...BossPatterns.movementPattern('moving', 2),
                ...BossPatterns.chargeAttack('beam_charge', 'eye_beam', 'idle', 1.5, 2, 1)
            ]
        });
        
        // Phase 2: Add sandstorm attacks (66% - 33% health)
        this.stateMachine.addBehavior('phase2_desert_lord', {
            condition: () => this.currentPhase === 2,
            priority: 9,
            enter: () => {
                this.projectileSpeed *= 1.3; // Faster projectiles
                this.projectileBurstCount = 5; // More projectiles
            },
            pattern: [
                ...BossPatterns.simpleAttack('sandstorm', 'idle', 4, 0.5),
                ...BossPatterns.simpleAttack('projectile_burst', 'idle', 2, 0.3),
                ...BossPatterns.movementPattern('moving', 1.5),
                ...BossPatterns.chargeAttack('beam_charge', 'eye_beam', 'idle', 1.2, 2, 0.5),
                ...BossPatterns.simpleAttack('projectile_burst', 'idle', 1.5, 0.3)
            ]
        });
        
        // Phase 3: All-seeing eye mode (33% - 0% health)
        this.stateMachine.addBehavior('phase3_all_seeing', {
            condition: () => this.currentPhase === 3,
            priority: 8,
            enter: () => {
                this.projectileSpeed *= 1.5; // Even faster
                this.projectileBurstCount = 7; // Maximum projectiles
                this.moveSpeed *= 1.2; // Faster movement
            },
            pattern: [
                { state: 'all_seeing', duration: 3 },
                ...BossPatterns.movementPattern('moving', 1),
                ...BossPatterns.chargeAttack('beam_charge', 'eye_beam', 'idle', 0.8, 2.5, 0.3),
                ...BossPatterns.simpleAttack('projectile_burst', 'idle', 1.5, 0.2),
                ...BossPatterns.simpleAttack('sandstorm', 'idle', 3, 0.3),
                ...BossPatterns.simpleAttack('projectile_burst', 'idle', 1.5, 0.2)
            ]
        });
    }
    
    onPhaseChange(newPhase) {
        super.onPhaseChange(newPhase);
        
        // Spawn sand elementals
        if (newPhase === 2) {
            this.spawnSandElementals(3);
        } else if (newPhase === 3) {
            // Open the eye fully
            const eyeOpenText = this.scene.add.text(this.x, this.y - 120, 'THE EYE OPENS!', {
                fontSize: '36px',
                color: '#ff0000',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            });
            eyeOpenText.setOrigin(0.5);
            eyeOpenText.setDepth(200);
            
            this.scene.tweens.add({
                targets: eyeOpenText,
                y: eyeOpenText.y - 50,
                scale: 2,
                alpha: 0,
                duration: 3000,
                onComplete: () => eyeOpenText.destroy()
            });
            
            this.spawnSandElementals(5);
        }
    }
    
    createTargetingLaser() {
        this.targetingLaser = this.scene.add.rectangle(
            this.x, this.y,
            1000, 10,
            0xff0000, 0.3
        );
        this.targetingLaser.setOrigin(0, 0.5);
        this.targetingLaser.setDepth(90);
        
        // Pulsing effect
        this.scene.tweens.add({
            targets: this.targetingLaser,
            alpha: { from: 0.3, to: 0.6 },
            scaleY: { from: 1, to: 2 },
            duration: 200,
            yoyo: true,
            repeat: -1
        });
    }
    
    updateTargetingLaser() {
        if (!this.targetingLaser || !this.scene.wizard) return;
        
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.scene.wizard.x, this.scene.wizard.y
        );
        
        this.targetingLaser.x = this.x;
        this.targetingLaser.y = this.y;
        this.targetingLaser.rotation = angle;
    }
    
    removeTargetingLaser() {
        if (this.targetingLaser) {
            this.targetingLaser.destroy();
            this.targetingLaser = null;
        }
    }
    
    fireEyeBeam() {
        const player = this.scene.wizard;
        if (!player) return;
        
        // Calculate angle to player
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        
        // Create massive eye beam
        this.eyeBeam = this.scene.add.sprite(this.x, this.y, 'void-ball-projectile');
        this.eyeBeam.setOrigin(0, 0.5);
        this.eyeBeam.setScale(3, 5);
        this.eyeBeam.rotation = angle;
        this.eyeBeam.setDepth(95);
        this.eyeBeam.setTint(0xff00ff);
        
        // Beam physics
        this.scene.physics.add.existing(this.eyeBeam);
        this.eyeBeam.body.setSize(1000, 80);
        this.eyeBeam.body.setOffset(0, -40);
        this.eyeBeam.body.enable = true;
        
        // Start beam animation
        if (this.scene.anims.exists('void-ball-anim')) {
            this.eyeBeam.play('void-ball-anim');
        }
        
        // Damage overlap
        this.beamOverlap = this.scene.physics.add.overlap(
            this.eyeBeam,
            this.scene.wizard,
            () => {
                if (this.scene.wizard.takeDamage) {
                    this.scene.wizard.takeDamage(this.damage * 1.5);
                }
            }
        );
    }
    
    updateEyeBeam() {
        if (!this.eyeBeam || !this.scene.wizard) return;
        
        // Slowly track player
        const currentAngle = this.eyeBeam.rotation;
        const targetAngle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.scene.wizard.x, this.scene.wizard.y
        );
        
        // Smooth rotation
        const turnSpeed = 0.02;
        this.eyeBeam.rotation = Phaser.Math.Angle.RotateTo(
            currentAngle, targetAngle, turnSpeed
        );
        
        // Update position
        this.eyeBeam.x = this.x;
        this.eyeBeam.y = this.y;
    }
    
    cleanupEyeBeam() {
        if (this.eyeBeam) {
            // Fade out effect
            this.scene.tweens.add({
                targets: this.eyeBeam,
                alpha: 0,
                scale: { x: 3, y: 0 },
                duration: 300,
                onComplete: () => {
                    this.eyeBeam.destroy();
                    this.eyeBeam = null;
                }
            });
        }
        
        if (this.beamOverlap) {
            this.beamOverlap.destroy();
            this.beamOverlap = null;
        }
    }
    
    fireProjectileBurst() {
        const player = this.scene.wizard;
        if (!player) return;
        
        const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        const spreadAngle = Math.PI / 6; // 30 degree spread
        
        for (let i = 0; i < this.projectileBurstCount; i++) {
            const angleOffset = (i - (this.projectileBurstCount - 1) / 2) * 
                              (spreadAngle / (this.projectileBurstCount - 1));
            const angle = baseAngle + angleOffset;
            
            this.createEyeProjectile(angle, i * 50); // Stagger projectiles
        }
    }
    
    createEyeProjectile(angle, delay = 0) {
        this.scene.time.delayedCall(delay, () => {
            const projectile = this.scene.physics.add.sprite(
                this.x, this.y, 'void-ball-projectile'
            );
            projectile.setScale(1.5);
            
            // Play projectile animation
            if (this.scene.anims.exists('void-ball-anim')) {
                projectile.play('void-ball-anim');
            }
            
            const speed = this.projectileSpeed * (this.scene.speedMultiplier || 1);
            projectile.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            projectile.damage = this.damage;
            projectile.fromBoss = true;
            
            if (this.scene.enemyProjectiles) {
                this.scene.enemyProjectiles.add(projectile);
            }
            
            // Auto-destroy after 5 seconds
            this.scene.time.delayedCall(5000, () => {
                if (projectile.active) {
                    // Play destroy animation
                    projectile.setVelocity(0, 0);
                    projectile.play('projectile-destroyed-anim');
                    projectile.once('animationcomplete', () => {
                        projectile.destroy();
                    });
                }
            });
        });
    }
    
    fireRadialProjectiles() {
        const projectileCount = 8;
        const angleStep = (Math.PI * 2) / projectileCount;
        
        for (let i = 0; i < projectileCount; i++) {
            const angle = angleStep * i + this.rotation;
            this.createEyeProjectile(angle);
        }
    }
    
    createSandstorm() {
        this.sandstormParticles = [];
        
        // Create swirling sand particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i;
            const distance = Math.random() * this.sandstormRadius;
            
            const particle = this.scene.add.circle(
                this.x + Math.cos(angle) * distance,
                this.y + Math.sin(angle) * distance,
                8, 0xffaa00, 0.6
            );
            particle.setDepth(100);
            
            // Store particle data
            this.sandstormParticles.push({
                sprite: particle,
                angle: angle,
                distance: distance,
                speed: 2 + Math.random() * 2
            });
        }
        
        // Damage zone
        this.sandstormZone = this.scene.add.circle(
            this.x, this.y, this.sandstormRadius,
            0xffaa00, 0.1
        );
        this.sandstormZone.setDepth(1);
        
        // Update sandstorm
        this.sandstormTimer = this.scene.time.addEvent({
            delay: 50,
            callback: () => this.updateSandstorm(),
            loop: true
        });
    }
    
    updateSandstorm() {
        if (!this.sandstormParticles) return;
        
        // Move particles in spiral
        this.sandstormParticles.forEach(particle => {
            particle.angle += particle.speed * 0.05;
            particle.distance = Math.sin(particle.angle * 2) * this.sandstormRadius * 0.8 + 100;
            
            particle.sprite.x = this.x + Math.cos(particle.angle) * particle.distance;
            particle.sprite.y = this.y + Math.sin(particle.angle) * particle.distance;
        });
        
        // Check for player damage
        const player = this.scene.wizard;
        if (player && player.active) {
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y, player.x, player.y
            );
            
            if (distance <= this.sandstormRadius && player.takeDamage) {
                // Continuous damage
                if (!this.lastSandstormDamage || 
                    this.scene.time.now - this.lastSandstormDamage > 500) {
                    player.takeDamage(15);
                    this.lastSandstormDamage = this.scene.time.now;
                }
            }
        }
    }
    
    removeSandstorm() {
        if (this.sandstormParticles) {
            this.sandstormParticles.forEach(particle => {
                particle.sprite.destroy();
            });
            this.sandstormParticles = null;
        }
        
        if (this.sandstormZone) {
            this.sandstormZone.destroy();
            this.sandstormZone = null;
        }
        
        if (this.sandstormTimer) {
            this.sandstormTimer.remove();
            this.sandstormTimer = null;
        }
    }
    
    spawnSandElementals(count) {
        const angleStep = (Math.PI * 2) / count;
        
        for (let i = 0; i < count; i++) {
            const angle = angleStep * i;
            const distance = 200;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            if (this.scene.spawnSpecificEnemy) {
                // Spawn mummies or sand-themed enemies
                this.scene.spawnSpecificEnemy('mummy', x, y);
            }
        }
    }
}

export default EyelorBoss;