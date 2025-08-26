// Obelisk Boss - Forest Land Boss with Predictable Patterns

import BaseBoss from '../BaseBoss.js';
import { BossPatterns } from '../../systems/BossStateMachine.js';

export class ObeliskBoss extends BaseBoss {
    constructor(scene, x, y) {
        const config = {
            name: 'Awakened Obelisk',
            health: 3000,
            damage: 30,
            moveSpeed: 80,
            attackRange: 400
        };
        
        super(scene, x, y, 'obelisk-boss', config);
        
        // Obelisk-specific properties
        this.laserChargeTime = 1.5;
        this.laserDuration = 2.0;
        this.projectileSpeed = 200;
        this.shieldDuration = 3.0;
        
        // Set up animations
        this.setScale(1.5);
        this.play('obelisk-idle');
    }
    
    initializeStates() {
        super.initializeStates();
        
        // Charging state - telegraph attacks
        this.stateMachine.addState('charging', {
            enter: () => {
                this.setVelocity(0, 0);
                this.setTint(0xffff00);
                this.isInvulnerable = true;
                
                // Visual charging effect
                this.chargingEffect = this.scene.add.sprite(this.x, this.y, 'obelisk-effects');
                this.chargingEffect.play('obelisk-object-activate');
                this.chargingEffect.setScale(1.5);
                this.chargingEffect.setDepth(this.depth - 1);
            },
            update: (dt, stateMachine) => {
                // Pulsing effect
                const timer = stateMachine.getStateTimer();
                this.alpha = 0.7 + Math.sin(timer * 8) * 0.3;
                
                // Update charging effect position
                if (this.chargingEffect) {
                    this.chargingEffect.x = this.x;
                    this.chargingEffect.y = this.y;
                }
            },
            exit: () => {
                this.clearTint();
                this.alpha = 1;
                this.isInvulnerable = false;
                
                if (this.chargingEffect) {
                    this.chargingEffect.destroy();
                    this.chargingEffect = null;
                }
            }
        });
        
        // Laser attack state
        this.stateMachine.addState('laser_attack', {
            enter: () => {
                this.play('obelisk-laser-cast');
                this.createLaserBeam();
            },
            update: (dt) => {
                this.updateLaserBeam();
            },
            exit: () => {
                this.cleanupLaserBeam();
                this.play('obelisk-idle');
            },
            canInterrupt: false
        });
        
        // Projectile attack state
        this.stateMachine.addState('projectile_attack', {
            enter: () => {
                this.play('obelisk-shoot');
                this.fireProjectilePattern();
            },
            update: (dt) => {
                // Could add continuous projectile spawning here
            },
            exit: () => {
                this.play('obelisk-idle');
            }
        });
        
        // Shield state
        this.stateMachine.addState('shield_cast', {
            enter: () => {
                this.play('obelisk-shield-cast');
                this.createShield();
            },
            update: (dt) => {
                // Shield follows boss
                if (this.shield) {
                    this.shield.x = this.x;
                    this.shield.y = this.y;
                }
            },
            exit: () => {
                this.removeShield();
                this.play('obelisk-idle');
            }
        });
        
        // Enraged state (phase 3)
        this.stateMachine.addState('enraged', {
            enter: () => {
                this.setTint(0xff0000);
                
                // Visual effect
                const rageText = this.scene.add.text(this.x, this.y - 100, 'ENRAGED!', {
                    fontSize: '32px',
                    color: '#ff0000',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4
                });
                rageText.setOrigin(0.5);
                rageText.setDepth(200);
                
                this.scene.tweens.add({
                    targets: rageText,
                    y: rageText.y - 50,
                    scale: 1.5,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => rageText.destroy()
                });
            },
            duration: 1.0
        });
    }
    
    initializeBehaviors() {
        // Phase 1: Basic patterns (100% - 66% health)
        this.stateMachine.addBehavior('phase1_movement', {
            condition: () => this.currentPhase === 1 && this.getDistanceToPlayer() > 300,
            priority: 10,
            pattern: BossPatterns.movementPattern('moving', 3)
        });
        
        this.stateMachine.addBehavior('phase1_attacks', {
            condition: () => this.currentPhase === 1 && this.getDistanceToPlayer() <= 300,
            priority: 9,
            pattern: [
                ...BossPatterns.chargeAttack('charging', 'projectile_attack', 'idle', 1, 1.5, 1),
                ...BossPatterns.chargeAttack('charging', 'laser_attack', 'idle', 1.5, 2, 1.5),
                ...BossPatterns.movementPattern('moving', 2)
            ]
        });
        
        // Phase 2: Add shields (66% - 33% health)
        this.stateMachine.addBehavior('phase2_defensive', {
            condition: () => this.currentPhase === 2,
            priority: 8,
            pattern: [
                ...BossPatterns.defensivePattern('shield_cast', 'projectile_attack', 3, 1.5),
                ...BossPatterns.chargeAttack('charging', 'laser_attack', 'idle', 1.5, 2, 1),
                ...BossPatterns.movementPattern('moving', 2),
                ...BossPatterns.simpleAttack('projectile_attack', 'idle', 1.5, 0.5)
            ]
        });
        
        // Phase 3: Enraged patterns (33% - 0% health)
        this.stateMachine.addBehavior('phase3_enraged', {
            condition: () => this.currentPhase === 3,
            priority: 7,
            enter: () => {
                this.moveSpeed *= 1.5; // Faster movement
            },
            pattern: [
                { state: 'enraged', duration: 1 },
                ...BossPatterns.simpleAttack('projectile_attack', 'idle', 1, 0.3),
                ...BossPatterns.chargeAttack('charging', 'laser_attack', 'idle', 1, 2.5, 0.5),
                ...BossPatterns.defensivePattern('shield_cast', 'projectile_attack', 2, 1),
                ...BossPatterns.movementPattern('moving', 1.5),
                ...BossPatterns.simpleAttack('projectile_attack', 'idle', 1, 0.3)
            ]
        });
    }
    
    onPhaseChange(newPhase) {
        super.onPhaseChange(newPhase);
        
        // Phase transition effects
        const phaseText = this.scene.add.text(this.x, this.y - 100, `PHASE ${newPhase}`, {
            fontSize: '36px',
            color: newPhase === 3 ? '#ff0000' : '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        phaseText.setOrigin(0.5);
        phaseText.setDepth(200);
        
        this.scene.tweens.add({
            targets: phaseText,
            y: phaseText.y - 50,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            onComplete: () => phaseText.destroy()
        });
        
        // Spawn minions on phase change
        if (this.scene.spawnBossHealthThresholdWave) {
            this.scene.spawnBossHealthThresholdWave(newPhase === 2 ? 66 : 33);
        }
    }
    
    fireProjectilePattern() {
        const projectileCount = 3 + this.currentPhase;
        const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.wizard.x, this.scene.wizard.y);
        const spreadAngle = Math.PI / 6; // 30 degree spread
        
        for (let i = 0; i < projectileCount; i++) {
            const angleOffset = (i - (projectileCount - 1) / 2) * (spreadAngle / (projectileCount - 1));
            const angle = baseAngle + angleOffset;
            
            const projectile = this.scene.physics.add.sprite(this.x, this.y, 'fire-spell', 0);
            projectile.setScale(1.5);
            projectile.play('fire-spell-anim');
            
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
            
            // Auto-destroy after 3 seconds
            this.scene.time.delayedCall(3000, () => {
                if (projectile.active) projectile.destroy();
            });
        }
    }
    
    createLaserBeam() {
        // Create laser warning line first
        this.laserWarning = this.scene.add.rectangle(
            this.x,
            this.y,
            1000,
            20,
            0xff0000,
            0.3
        );
        this.laserWarning.setOrigin(0, 0.5);
        this.laserWarning.setDepth(90);
        
        // Calculate angle to player
        const targetAngle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.scene.wizard.x, this.scene.wizard.y
        );
        this.laserWarning.rotation = targetAngle;
        
        // Flash warning
        this.scene.tweens.add({
            targets: this.laserWarning,
            alpha: { from: 0.3, to: 0.6 },
            duration: 200,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                // Create actual laser
                this.createActualLaser(targetAngle);
            }
        });
    }
    
    createActualLaser(angle) {
        if (this.laserWarning) {
            this.laserWarning.destroy();
        }
        
        // Create laser beam
        this.laserBeam = this.scene.add.sprite(this.x, this.y, 'boss-laser');
        this.laserBeam.setOrigin(0, 0.5);
        this.laserBeam.setScale(1, 2);
        this.laserBeam.rotation = angle;
        this.laserBeam.setDepth(95);
        this.laserBeam.play('boss-laser-anim');
        
        // Create physics body for laser
        this.scene.physics.add.existing(this.laserBeam);
        this.laserBeam.body.setSize(1000, 40);
        this.laserBeam.body.setOffset(0, -20);
        this.laserBeam.body.enable = true;
        
        // Damage player on overlap
        this.laserOverlap = this.scene.physics.add.overlap(
            this.laserBeam,
            this.scene.wizard,
            () => {
                if (this.scene.wizard.takeDamage) {
                    this.scene.wizard.takeDamage(this.damage * 2);
                }
            }
        );
    }
    
    updateLaserBeam() {
        if (this.laserBeam) {
            this.laserBeam.x = this.x;
            this.laserBeam.y = this.y;
        }
    }
    
    cleanupLaserBeam() {
        if (this.laserWarning) {
            this.laserWarning.destroy();
            this.laserWarning = null;
        }
        
        if (this.laserBeam) {
            this.laserBeam.destroy();
            this.laserBeam = null;
        }
        
        if (this.laserOverlap) {
            this.laserOverlap.destroy();
            this.laserOverlap = null;
        }
    }
    
    createShield() {
        this.shield = this.scene.add.sprite(this.x, this.y, 'shield-spell');
        this.shield.setScale(2);
        this.shield.setAlpha(0.7);
        this.shield.setDepth(this.depth + 1);
        
        // Make boss invulnerable while shielded
        this.isInvulnerable = true;
        
        // Spawn shield minions
        this.spawnShieldMinions();
    }
    
    removeShield() {
        if (this.shield) {
            this.shield.destroy();
            this.shield = null;
        }
        this.isInvulnerable = false;
    }
    
    spawnShieldMinions() {
        const minionCount = 2 + this.currentPhase;
        const angleStep = (Math.PI * 2) / minionCount;
        
        for (let i = 0; i < minionCount; i++) {
            const angle = angleStep * i;
            const distance = 150;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            if (this.scene.spawnSpecificEnemy) {
                this.scene.spawnSpecificEnemy('sorcerer', x, y);
            }
        }
    }
}

export default ObeliskBoss;