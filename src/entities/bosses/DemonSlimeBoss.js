// Demon Slime Boss - Lava Land Boss with Cleave Attacks

import BaseBoss from '../BaseBoss.js';
import { BossPatterns } from '../../systems/BossStateMachine.js';

export class DemonSlimeBoss extends BaseBoss {
    constructor(scene, x, y) {
        const config = {
            name: 'Demon Slime',
            health: 5000,
            damage: 40,
            moveSpeed: 60,
            attackRange: 150
        };
        
        super(scene, x, y, 'demon-slime-boss', config);
        
        // Demon Slime specific properties
        this.cleaveRadius = 200;
        this.cleaveDamage = 60;
        this.lavaPoolDuration = 5000;
        this.lavaPoolDamage = 20;
        
        // Set up animations
        this.setScale(1.75);
        this.setFlipX(true); // Face correct direction
        this.play('demon-slime-idle');
    }
    
    initializeStates() {
        super.initializeStates();
        
        // Override moving state to use demon slime walk animation
        this.stateMachine.addState('moving', {
            enter: () => {
                this.play('demon-slime-walk');
            },
            update: (dt) => {
                this.moveTowardsPlayer(dt);
                
                // Face the player (reversed because sprite is flipped)
                if (this.scene.wizard && this.scene.wizard.active) {
                    this.setFlipX(this.scene.wizard.x > this.x);
                }
            },
            exit: () => {
                this.setVelocity(0, 0);
            }
        });
        
        // Cleave attack state
        this.stateMachine.addState('cleaving', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('demon-slime-cleave');
                
                // Telegraph the attack
                this.createCleaveWarning();
            },
            update: (dt, stateMachine) => {
                // Execute cleave at animation midpoint
                if (stateMachine.getStateTimer() > 0.8 && !this.hasCleaved) {
                    this.executeCleave();
                    this.hasCleaved = true;
                }
            },
            exit: () => {
                this.hasCleaved = false;
                this.play('demon-slime-idle');
            },
            duration: 1.5,
            canInterrupt: false
        });
        
        // Lava pool state
        this.stateMachine.addState('lava_pool', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('demon-slime-cleave'); // Use cleave animation
                this.setTint(0xff4400);
            },
            update: (dt, stateMachine) => {
                if (stateMachine.getStateTimer() > 0.5 && !this.hasCreatedPools) {
                    this.createLavaPools();
                    this.hasCreatedPools = true;
                }
            },
            exit: () => {
                this.hasCreatedPools = false;
                this.clearTint();
                this.play('demon-slime-idle');
            },
            duration: 1.2
        });
        
        // Enrage state - continuous cleaving
        this.stateMachine.addState('enraged_cleave', {
            enter: () => {
                this.setVelocity(0, 0);
                this.setTint(0xff0000);
                this.enrageCleaveCount = 0;
                
                // Warning text
                const warningText = this.scene.add.text(this.x, this.y - 100, 'ENRAGED!', {
                    fontSize: '32px',
                    color: '#ff0000',
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
                // Multiple cleaves
                const cleaveInterval = 0.8;
                if (stateMachine.getStateTimer() > this.enrageCleaveCount * cleaveInterval + 0.5) {
                    this.play('demon-slime-cleave');
                    this.executeCleave(true); // Mini cleave
                    this.enrageCleaveCount++;
                }
            },
            exit: () => {
                this.clearTint();
                this.play('demon-slime-idle');
            },
            duration: 4.0,
            canInterrupt: false
        });
        
        // Jump attack state (phase 2+)
        this.stateMachine.addState('jump_attack', {
            enter: () => {
                this.setVelocity(0, 0);
                this.isInvulnerable = true;
                this.alpha = 0.5;
                
                // Create shadow at target location
                const player = this.scene.wizard;
                if (player) {
                    this.jumpTargetX = player.x;
                    this.jumpTargetY = player.y;
                    this.createJumpShadow();
                }
            },
            update: (dt, stateMachine) => {
                // Jump up phase
                if (stateMachine.getStateTimer() < 0.5) {
                    this.y -= 4;
                    this.setScale(this.scale - 0.01);
                }
                // Jump down phase
                else if (stateMachine.getStateTimer() > 1.0 && stateMachine.getStateTimer() < 1.5) {
                    this.x = Phaser.Math.Linear(this.x, this.jumpTargetX, 0.2);
                    this.y = Phaser.Math.Linear(this.y, this.jumpTargetY, 0.2);
                    this.setScale(this.scale + 0.02);
                }
                // Impact
                else if (stateMachine.getStateTimer() > 1.5 && !this.hasImpacted) {
                    this.executeJumpImpact();
                    this.hasImpacted = true;
                }
            },
            exit: () => {
                this.isInvulnerable = false;
                this.alpha = 1;
                this.setScale(1.75);
                this.hasImpacted = false;
            },
            duration: 2.0,
            canInterrupt: false
        });
    }
    
    initializeBehaviors() {
        // Phase 1: Basic cleave attacks (100% - 66% health)
        this.stateMachine.addBehavior('phase1_basic', {
            condition: () => this.currentPhase === 1,
            priority: 10,
            pattern: [
                ...BossPatterns.movementPattern('moving', 2),
                ...BossPatterns.simpleAttack('cleaving', 'idle', 1.5, 0.5),
                ...BossPatterns.movementPattern('moving', 2),
                ...BossPatterns.simpleAttack('lava_pool', 'idle', 1.2, 1)
            ]
        });
        
        // Phase 2: Add jump attacks (66% - 33% health)
        this.stateMachine.addBehavior('phase2_aggressive', {
            condition: () => this.currentPhase === 2,
            priority: 9,
            enter: () => {
                this.cleaveDamage *= 1.2; // More damage
            },
            pattern: [
                ...BossPatterns.simpleAttack('jump_attack', 'idle', 2, 0.5),
                ...BossPatterns.simpleAttack('cleaving', 'idle', 1.5, 0.3),
                ...BossPatterns.movementPattern('moving', 1.5),
                ...BossPatterns.simpleAttack('lava_pool', 'idle', 1.2, 0.5),
                ...BossPatterns.simpleAttack('cleaving', 'idle', 1.5, 0.3)
            ]
        });
        
        // Phase 3: Enraged mode (33% - 0% health)
        this.stateMachine.addBehavior('phase3_enraged', {
            condition: () => this.currentPhase === 3,
            priority: 8,
            enter: () => {
                this.moveSpeed *= 1.4; // Faster movement
                this.cleaveDamage *= 1.3; // Even more damage
            },
            pattern: [
                { state: 'enraged_cleave', duration: 4 },
                ...BossPatterns.movementPattern('moving', 1),
                ...BossPatterns.simpleAttack('jump_attack', 'idle', 2, 0.3),
                ...BossPatterns.simpleAttack('lava_pool', 'idle', 1.2, 0.3),
                ...BossPatterns.simpleAttack('cleaving', 'idle', 1.5, 0.2),
                ...BossPatterns.simpleAttack('cleaving', 'idle', 1.5, 0.2)
            ]
        });
    }
    
    onPhaseChange(newPhase) {
        super.onPhaseChange(newPhase);
        
        // Spawn lava wave on phase change
        this.spawnLavaWave();
    }
    
    createCleaveWarning() {
        // Create warning circle
        this.cleaveWarning = this.scene.add.graphics();
        this.cleaveWarning.lineStyle(4, 0xff0000, 0.5);
        this.cleaveWarning.strokeCircle(0, 0, this.cleaveRadius);
        this.cleaveWarning.x = this.x;
        this.cleaveWarning.y = this.y;
        this.cleaveWarning.setDepth(90);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: this.cleaveWarning,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0.5, to: 1 },
            duration: 800,
            yoyo: true,
            onComplete: () => {
                if (this.cleaveWarning) {
                    this.cleaveWarning.destroy();
                    this.cleaveWarning = null;
                }
            }
        });
    }
    
    executeCleave(isMini = false) {
        // Create cleave effect
        const cleaveEffect = this.scene.add.sprite(this.x, this.y, 'fire-spell');
        cleaveEffect.setScale(isMini ? 3 : 5);
        cleaveEffect.setTint(0xff4400);
        cleaveEffect.play('fire-spell-anim');
        cleaveEffect.once('animationcomplete', () => cleaveEffect.destroy());
        
        // Damage area
        const radius = isMini ? this.cleaveRadius * 0.7 : this.cleaveRadius;
        const damage = isMini ? this.cleaveDamage * 0.5 : this.cleaveDamage;
        
        // Check if player is in range
        const player = this.scene.wizard;
        if (player && player.active) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (distance <= radius && player.takeDamage) {
                player.takeDamage(damage);
            }
        }
        
        // Camera shake
        this.scene.cameras.main.shake(200, isMini ? 0.01 : 0.02);
    }
    
    createLavaPools() {
        const poolCount = 3 + this.currentPhase;
        
        for (let i = 0; i < poolCount; i++) {
            const angle = (Math.PI * 2 / poolCount) * i;
            const distance = 150;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            this.createLavaPool(x, y);
        }
    }
    
    createLavaPool(x, y) {
        // Create lava pool sprite
        const pool = this.scene.add.sprite(x, y, 'fire-spell');
        pool.setScale(2);
        pool.setTint(0xff2200);
        pool.setAlpha(0.7);
        pool.setDepth(1);
        pool.play('fire-spell-anim');
        
        // Add physics for damage
        this.scene.physics.add.existing(pool);
        pool.body.setCircle(30);
        
        // Damage overlap
        const damageOverlap = this.scene.physics.add.overlap(pool, this.scene.wizard, () => {
            if (this.scene.wizard.takeDamage) {
                this.scene.wizard.takeDamage(this.lavaPoolDamage);
            }
        });
        
        // Remove after duration
        this.scene.time.delayedCall(this.lavaPoolDuration, () => {
            damageOverlap.destroy();
            pool.destroy();
        });
    }
    
    createJumpShadow() {
        this.jumpShadow = this.scene.add.ellipse(
            this.jumpTargetX, 
            this.jumpTargetY, 
            100, 60, 
            0x000000, 0.5
        );
        this.jumpShadow.setDepth(0);
        
        // Warning animation
        this.scene.tweens.add({
            targets: this.jumpShadow,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 0.3, to: 0.8 },
            duration: 1500,
            ease: 'Power2'
        });
    }
    
    executeJumpImpact() {
        if (this.jumpShadow) {
            this.jumpShadow.destroy();
        }
        
        // Impact effect
        const impact = this.scene.add.sprite(this.x, this.y, 'fire-spell');
        impact.setScale(4);
        impact.setTint(0xff6600);
        impact.play('fire-spell-anim');
        impact.once('animationcomplete', () => impact.destroy());
        
        // Damage in area
        const player = this.scene.wizard;
        if (player && player.active) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (distance <= 150 && player.takeDamage) {
                player.takeDamage(this.cleaveDamage);
            }
        }
        
        // Create lava pools at impact
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i;
            const distance = 80;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            this.createLavaPool(x, y);
        }
        
        // Screen shake
        this.scene.cameras.main.shake(300, 0.03);
    }
    
    spawnLavaWave() {
        if (this.scene.spawnSpecificEnemy) {
            // Spawn fire worms
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * 2 / 4) * i;
                const distance = 200;
                const x = this.x + Math.cos(angle) * distance;
                const y = this.y + Math.sin(angle) * distance;
                this.scene.spawnSpecificEnemy('fireworm', x, y);
            }
            
            // Spawn some slimes too
            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 250;
                const x = this.x + Math.cos(angle) * distance;
                const y = this.y + Math.sin(angle) * distance;
                this.scene.spawnSpecificEnemy('slime', x, y);
            }
        }
    }
}

export default DemonSlimeBoss;