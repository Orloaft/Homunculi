// Arcane Archer Boss - Cave Land Boss with Predictable Patterns

import BaseBoss from '../BaseBoss.js';
import { BossPatterns } from '../../systems/BossStateMachine.js';

export class ArcherBoss extends BaseBoss {
    constructor(scene, x, y) {
        const config = {
            name: 'Arcane Archer',
            health: 6600,
            damage: 35,
            moveSpeed: 100,
            attackRange: 500
        };
        
        super(scene, x, y, 'archer-boss', config);
        
        // Archer-specific properties
        this.shootCooldown = 0;
        this.rollDistance = 200;
        this.rollSpeed = 400;
        this.arrowSpeed = 300;
        this.volleyCount = 3; // Arrows per volley
        
        // Set up animations
        this.setScale(1.5);
        this.play('archer-boss-walk');
    }
    
    initializeStates() {
        super.initializeStates();
        
        // Shooting state - fires arrows at player
        this.stateMachine.addState('shooting', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('archer-boss-shoot');
                
                // Face the player
                if (this.scene.wizard) {
                    this.flipX = this.scene.wizard.x < this.x;
                }
            },
            update: (dt, stateMachine) => {
                // Fire arrows at specific animation frames
                if (stateMachine.getStateTimer() > 0.3 && !this.hasFiredArrows) {
                    this.fireArrowVolley();
                    this.hasFiredArrows = true;
                }
            },
            exit: () => {
                this.hasFiredArrows = false;
                this.play('archer-boss-walk');
            },
            duration: 1.0
        });
        
        // Multi-shot state - fires spread of arrows
        this.stateMachine.addState('multi_shot', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('archer-boss-shoot');
                
                // Visual indicator
                this.setTint(0xffff00);
            },
            update: (dt, stateMachine) => {
                if (stateMachine.getStateTimer() > 0.4 && !this.hasFiredSpread) {
                    this.fireArrowSpread();
                    this.hasFiredSpread = true;
                }
            },
            exit: () => {
                this.hasFiredSpread = false;
                this.clearTint();
                this.play('archer-boss-walk');
            },
            duration: 1.2
        });
        
        // Roll state - quick dodge maneuver
        this.stateMachine.addState('rolling', {
            enter: () => {
                this.play('archer-boss-roll');
                this.isInvulnerable = true;
                
                // Calculate roll direction (away from player)
                const player = this.scene.wizard;
                if (player) {
                    const angle = Phaser.Math.Angle.Between(player.x, player.y, this.x, this.y);
                    this.rollVelocityX = Math.cos(angle) * this.rollSpeed;
                    this.rollVelocityY = Math.sin(angle) * this.rollSpeed;
                    this.setVelocity(this.rollVelocityX, this.rollVelocityY);
                }
            },
            update: (dt) => {
                // Maintain roll velocity
                if (this.rollVelocityX && this.rollVelocityY) {
                    this.setVelocity(this.rollVelocityX, this.rollVelocityY);
                }
            },
            exit: () => {
                this.setVelocity(0, 0);
                this.isInvulnerable = false;
                this.play('archer-boss-walk');
            },
            duration: 0.6,
            canInterrupt: false
        });
        
        // Barrage state - rapid fire mode (phase 3)
        this.stateMachine.addState('arrow_barrage', {
            enter: () => {
                this.setVelocity(0, 0);
                this.barrageCount = 0;
                this.setTint(0xff0000);
                
                // Warning effect
                const warningText = this.scene.add.text(this.x, this.y - 80, 'ARROW BARRAGE!', {
                    fontSize: '24px',
                    color: '#ff0000',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4
                });
                warningText.setOrigin(0.5);
                warningText.setDepth(200);
                
                this.scene.tweens.add({
                    targets: warningText,
                    y: warningText.y - 30,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => warningText.destroy()
                });
            },
            update: (dt, stateMachine) => {
                // Fire arrows rapidly
                if (stateMachine.getStateTimer() > this.barrageCount * 0.3 + 0.5) {
                    this.fireBarrageArrow();
                    this.barrageCount++;
                }
            },
            exit: () => {
                this.clearTint();
                this.play('archer-boss-walk');
            },
            duration: 3.0,
            canInterrupt: false
        });
    }
    
    initializeBehaviors() {
        // Phase 1: Basic attack patterns (100% - 66% health)
        this.stateMachine.addBehavior('phase1_ranged', {
            condition: () => this.currentPhase === 1 && this.getDistanceToPlayer() > 200,
            priority: 10,
            pattern: [
                ...BossPatterns.simpleAttack('shooting', 'idle', 1, 0.5),
                ...BossPatterns.movementPattern('moving', 2),
                ...BossPatterns.simpleAttack('shooting', 'idle', 1, 0.5),
                { state: 'rolling', duration: 0.6 },
                ...BossPatterns.movementPattern('moving', 1.5)
            ]
        });
        
        this.stateMachine.addBehavior('phase1_close', {
            condition: () => this.currentPhase === 1 && this.getDistanceToPlayer() <= 200,
            priority: 11,
            pattern: [
                { state: 'rolling', duration: 0.6 },
                ...BossPatterns.simpleAttack('multi_shot', 'idle', 1.2, 0.3),
                ...BossPatterns.movementPattern('moving', 2)
            ]
        });
        
        // Phase 2: Add multi-shot attacks (66% - 33% health)
        this.stateMachine.addBehavior('phase2_aggressive', {
            condition: () => this.currentPhase === 2,
            priority: 9,
            enter: () => {
                this.volleyCount = 5; // More arrows per volley
            },
            pattern: [
                ...BossPatterns.simpleAttack('multi_shot', 'idle', 1.2, 0.3),
                ...BossPatterns.simpleAttack('shooting', 'idle', 1, 0.3),
                { state: 'rolling', duration: 0.6 },
                ...BossPatterns.movementPattern('moving', 1.5),
                ...BossPatterns.simpleAttack('shooting', 'idle', 1, 0.3),
                { state: 'rolling', duration: 0.6 }
            ]
        });
        
        // Phase 3: Arrow barrage and aggressive patterns (33% - 0% health)
        this.stateMachine.addBehavior('phase3_barrage', {
            condition: () => this.currentPhase === 3,
            priority: 8,
            enter: () => {
                this.volleyCount = 7; // Maximum arrows
                this.moveSpeed *= 1.3; // Faster movement
            },
            pattern: [
                { state: 'arrow_barrage', duration: 3 },
                ...BossPatterns.movementPattern('moving', 1),
                ...BossPatterns.simpleAttack('multi_shot', 'idle', 1.2, 0.2),
                { state: 'rolling', duration: 0.6 },
                ...BossPatterns.simpleAttack('shooting', 'idle', 0.8, 0.2),
                ...BossPatterns.simpleAttack('shooting', 'idle', 0.8, 0.2),
                { state: 'rolling', duration: 0.6 }
            ]
        });
    }
    
    onPhaseChange(newPhase) {
        super.onPhaseChange(newPhase);
        
        // Phase-specific changes
        if (newPhase === 2) {
            // Summon archer minions
            this.summonArcherMinions(2);
        } else if (newPhase === 3) {
            // Enrage effect
            this.scene.cameras.main.shake(500, 0.02);
            this.summonArcherMinions(3);
        }
    }
    
    fireArrowVolley() {
        const player = this.scene.wizard;
        if (!player || !player.active) return;
        
        const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        
        for (let i = 0; i < this.volleyCount; i++) {
            // Slight random spread
            const angleVariation = (Math.random() - 0.5) * 0.2;
            const angle = baseAngle + angleVariation;
            
            // Delay between arrows
            this.scene.time.delayedCall(i * 100, () => {
                this.createArrowProjectile(angle);
            });
        }
    }
    
    fireArrowSpread() {
        const player = this.scene.wizard;
        if (!player || !player.active) return;
        
        const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        const spreadAngle = Math.PI / 4; // 45 degree spread
        const arrowCount = 5 + (this.currentPhase - 1) * 2; // More arrows in later phases
        
        for (let i = 0; i < arrowCount; i++) {
            const angle = baseAngle - spreadAngle/2 + (spreadAngle * i / (arrowCount - 1));
            this.createArrowProjectile(angle);
        }
    }
    
    fireBarrageArrow() {
        const player = this.scene.wizard;
        if (!player || !player.active) return;
        
        // Predict player movement
        const predictTime = 0.5; // Predict 0.5 seconds ahead
        let targetX = player.x;
        let targetY = player.y;
        
        if (player.body) {
            targetX += player.body.velocity.x * predictTime;
            targetY += player.body.velocity.y * predictTime;
        }
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        this.createArrowProjectile(angle, this.arrowSpeed * 1.5); // Faster arrows
    }
    
    createArrowProjectile(angle, speed = null) {
        const arrow = this.scene.physics.add.sprite(this.x, this.y, 'archer-arrow');
        arrow.setScale(1.5);
        arrow.rotation = angle;
        
        const projectileSpeed = speed || this.arrowSpeed;
        const adjustedSpeed = projectileSpeed * (this.scene.speedMultiplier || 1);
        
        arrow.setVelocity(
            Math.cos(angle) * adjustedSpeed,
            Math.sin(angle) * adjustedSpeed
        );
        
        arrow.damage = this.damage;
        arrow.fromBoss = true;
        
        if (this.scene.enemyProjectiles) {
            this.scene.enemyProjectiles.add(arrow);
        }
        
        // Auto-destroy after 4 seconds
        this.scene.time.delayedCall(4000, () => {
            if (arrow.active) arrow.destroy();
        });
    }
    
    summonArcherMinions(count) {
        const angleStep = (Math.PI * 2) / count;
        
        for (let i = 0; i < count; i++) {
            const angle = angleStep * i;
            const distance = 200;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            if (this.scene.spawnSpecificEnemy) {
                this.scene.spawnSpecificEnemy('skeleton-yellow', x, y);
            }
        }
    }
}

export default ArcherBoss;