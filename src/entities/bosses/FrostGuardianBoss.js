// Frost Guardian Boss - Snow Land Boss with Slam Attacks

import BaseBoss from '../BaseBoss.js';
import { BossPatterns } from '../../systems/BossStateMachine.js';

export class FrostGuardianBoss extends BaseBoss {
    constructor(scene, x, y) {
        const config = {
            name: 'Frost Guardian',
            health: 7200,
            damage: 45,
            moveSpeed: 80,
            attackRange: 200
        };
        
        super(scene, x, y, 'frost-guardian-boss', config);
        
        // Frost Guardian specific properties
        this.slamRadius = 250;
        this.slamDamage = 80;
        this.iceShardSpeed = 200;
        this.iceShardDamage = 35;
        this.blizzardDuration = 4000;
        
        // Set up animations
        this.setScale(2.0);
        this.play('frost-guardian-idle');
    }
    
    initializeStates() {
        super.initializeStates();
        
        // Override moving state to use frost guardian walk animation
        this.stateMachine.addState('moving', {
            enter: () => {
                this.play('frost-guardian-walk');
            },
            update: (dt) => {
                this.moveTowardsPlayer(dt);
                
                // Face the player
                if (this.scene.wizard && this.scene.wizard.active) {
                    this.setFlipX(this.scene.wizard.x < this.x);
                }
            },
            exit: () => {
                this.setVelocity(0, 0);
            }
        });
        
        // Slam attack state with danger indicator
        this.stateMachine.addState('slamming', {
            enter: () => {
                this.setVelocity(0, 0);
                
                // Face the player before attack
                if (this.scene.wizard && this.scene.wizard.active) {
                    this.setFlipX(this.scene.wizard.x < this.x);
                }
                
                // Telegraph the attack with danger indicator
                this.createSlamWarning();
                
                // Start attack animation after warning delay
                this.scene.time.delayedCall(800, () => {
                    if (this.stateMachine && this.stateMachine.currentState === 'slamming') {
                        this.play('frost-guardian-attack');
                    }
                });
            },
            update: (dt, stateMachine) => {
                // Execute slam at animation midpoint (after warning + anim delay)
                if (stateMachine.getStateTimer() > 1.4 && !this.hasSlammed) {
                    this.executeSlam();
                    this.hasSlammed = true;
                }
            },
            exit: () => {
                this.hasSlammed = false;
                this.play('frost-guardian-idle');
            },
            duration: 2.2,
            canInterrupt: false
        });
        
        // Ice shard projectile state
        this.stateMachine.addState('ice_shards', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('frost-guardian-attack');
                this.shardCount = 0;
                
                // Face the player
                if (this.scene.wizard && this.scene.wizard.active) {
                    this.setFlipX(this.scene.wizard.x < this.x);
                }
            },
            update: (dt, stateMachine) => {
                // Fire ice shards at intervals
                const shardInterval = 0.4;
                const totalShards = 5;
                
                if (stateMachine.getStateTimer() > this.shardCount * shardInterval + 0.3) {
                    if (this.shardCount < totalShards) {
                        this.fireIceShard();
                        this.shardCount++;
                    }
                }
            },
            exit: () => {
                this.play('frost-guardian-idle');
            },
            duration: 2.5,
            canInterrupt: false
        });
        
        // Blizzard state - area denial
        this.stateMachine.addState('blizzard', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('frost-guardian-attack');
                this.setTint(0x88ccff);
                
                // Create blizzard warning
                this.createBlizzardWarning();
                
                // Start blizzard after delay
                this.scene.time.delayedCall(1000, () => {
                    this.activateBlizzard();
                });
            },
            update: (dt, stateMachine) => {
                // Continuous damage during blizzard
                if (stateMachine.getStateTimer() > 1.0 && this.blizzardActive) {
                    this.applyBlizzardDamage();
                }
            },
            exit: () => {
                this.clearTint();
                this.deactivateBlizzard();
                this.play('frost-guardian-idle');
            },
            duration: 5.0,
            canInterrupt: false
        });
    }
    
    initializeBehaviors() {
        // Phase 1: Basic slam attacks (100% - 75% health)
        this.stateMachine.addBehavior('phase1_basic', {
            condition: () => this.currentPhase === 1,
            priority: 10,
            pattern: [
                ...BossPatterns.movementPattern('moving', 2.5),
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.8),
                ...BossPatterns.movementPattern('moving', 1.5),
                ...BossPatterns.simpleAttack('ice_shards', 'idle', 2.5, 1.0)
            ]
        });
        
        // Phase 2: Add blizzard attacks (75% - 50% health)
        this.stateMachine.addBehavior('phase2_aggressive', {
            condition: () => this.currentPhase === 2,
            priority: 9,
            enter: () => {
                this.slamDamage *= 1.15; // More damage
                this.moveSpeed *= 1.1; // Faster movement
            },
            pattern: [
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.5),
                ...BossPatterns.simpleAttack('ice_shards', 'idle', 2.5, 0.3),
                ...BossPatterns.movementPattern('moving', 2),
                ...BossPatterns.simpleAttack('blizzard', 'idle', 5.0, 0.8),
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.5)
            ]
        });
        
        // Phase 3: Enraged ice fury (50% - 25% health)
        this.stateMachine.addBehavior('phase3_fury', {
            condition: () => this.currentPhase === 3,
            priority: 8,
            enter: () => {
                this.moveSpeed *= 1.2; // Even faster
                this.slamDamage *= 1.25; // More slam damage
                this.iceShardDamage *= 1.3; // Stronger projectiles
            },
            pattern: [
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.3),
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.3),
                ...BossPatterns.simpleAttack('ice_shards', 'idle', 2.5, 0.2),
                ...BossPatterns.movementPattern('moving', 1.5),
                ...BossPatterns.simpleAttack('blizzard', 'idle', 5.0, 0.5),
                ...BossPatterns.simpleAttack('ice_shards', 'idle', 2.5, 0.2)
            ]
        });
        
        // Phase 4: Final desperate assault (25% - 0% health)
        this.stateMachine.addBehavior('phase4_desperate', {
            condition: () => this.currentPhase === 4,
            priority: 7,
            enter: () => {
                this.moveSpeed *= 1.3; // Maximum speed
                this.slamRadius *= 1.2; // Larger slam radius
                
                // Warning text for final phase
                const warningText = this.scene.add.text(this.x, this.y - 150, 'FROZEN FURY!', {
                    fontSize: '36px',
                    color: '#00ccff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4
                });
                warningText.setOrigin(0.5);
                warningText.setDepth(200);
                
                this.scene.tweens.add({
                    targets: warningText,
                    y: warningText.y - 80,
                    scale: 2.0,
                    alpha: 0,
                    duration: 3000,
                    onComplete: () => warningText.destroy()
                });
            },
            pattern: [
                ...BossPatterns.simpleAttack('blizzard', 'idle', 5.0, 0.2),
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.2),
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.2),
                ...BossPatterns.simpleAttack('ice_shards', 'idle', 2.5, 0.1),
                ...BossPatterns.simpleAttack('slamming', 'idle', 2.2, 0.2),
                ...BossPatterns.simpleAttack('ice_shards', 'idle', 2.5, 0.1)
            ]
        });
    }
    
    onPhaseChange(newPhase) {
        super.onPhaseChange(newPhase);
        
        // Create ice walls on phase change
        this.createIceWalls();
    }
    
    createSlamWarning() {
        // Create warning circle for slam attack
        this.slamWarning = this.scene.add.graphics();
        this.slamWarning.lineStyle(6, 0xff4400, 0.8);
        this.slamWarning.fillStyle(0xff0000, 0.1);
        this.slamWarning.fillCircle(0, 0, this.slamRadius);
        this.slamWarning.strokeCircle(0, 0, this.slamRadius);
        this.slamWarning.x = this.x;
        this.slamWarning.y = this.y;
        this.slamWarning.setDepth(90);
        
        // Warning text
        const warningText = this.scene.add.text(this.x, this.y - 50, '⚠ SLAM INCOMING ⚠', {
            fontSize: '24px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3
        });
        warningText.setOrigin(0.5);
        warningText.setDepth(200);
        
        // Pulse animation for danger indicator
        this.scene.tweens.add({
            targets: [this.slamWarning, warningText],
            scale: { from: 0.8, to: 1.3 },
            alpha: { from: 0.6, to: 1 },
            duration: 400,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                if (this.slamWarning) {
                    this.slamWarning.destroy();
                    this.slamWarning = null;
                }
                if (warningText) {
                    warningText.destroy();
                }
            }
        });
    }
    
    executeSlam() {
        // Create slam impact effect
        const slamEffect = this.scene.add.sprite(this.x, this.y, 'ice-spell');
        slamEffect.setScale(6);
        slamEffect.setTint(0x66ccff);
        if (slamEffect.anims && this.scene.anims.exists('ice-spell-anim')) {
            slamEffect.play('ice-spell-anim');
        }
        slamEffect.once('animationcomplete', () => slamEffect.destroy());
        
        // Screen shake for impact
        this.scene.cameras.main.shake(400, 0.04);
        
        // Damage area
        const player = this.scene.wizard;
        if (player && player.active) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (distance <= this.slamRadius && player.takeDamage) {
                player.takeDamage(this.slamDamage);
                
                // Apply freeze effect
                this.applyFreezeEffect(player);
            }
        }
        
        // Create ice shards at impact
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const distance = this.slamRadius * 0.8;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            this.createIceShard(x, y, 2000); // Static ice shards
        }
    }
    
    fireIceShard() {
        const player = this.scene.wizard;
        if (!player || !player.active) return;
        
        // Calculate direction to player
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        
        // Create ice shard projectile
        const shard = this.scene.add.sprite(this.x, this.y, 'ice-spell');
        shard.setScale(1.5);
        shard.setTint(0x88aaff);
        shard.setRotation(angle);
        
        // Add physics
        this.scene.physics.add.existing(shard);
        shard.body.setSize(20, 20);
        
        // Set velocity towards player
        const velocityX = Math.cos(angle) * this.iceShardSpeed;
        const velocityY = Math.sin(angle) * this.iceShardSpeed;
        shard.body.setVelocity(velocityX, velocityY);
        
        // Damage collision
        const damageOverlap = this.scene.physics.add.overlap(shard, this.scene.wizard, () => {
            if (this.scene.wizard.takeDamage) {
                this.scene.wizard.takeDamage(this.iceShardDamage);
                this.applyFreezeEffect(this.scene.wizard);
            }
            damageOverlap.destroy();
            shard.destroy();
        });
        
        // Auto-destroy after time
        this.scene.time.delayedCall(3000, () => {
            if (shard.active) {
                damageOverlap.destroy();
                shard.destroy();
            }
        });
    }
    
    createBlizzardWarning() {
        // Screen-wide warning for blizzard
        const warningOverlay = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x0088ff,
            0.1
        );
        warningOverlay.setDepth(100);
        warningOverlay.setScrollFactor(0);
        
        const warningText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            '❄ BLIZZARD INCOMING ❄', {
            fontSize: '48px',
            color: '#00ccff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        warningText.setOrigin(0.5);
        warningText.setDepth(200);
        warningText.setScrollFactor(0);
        
        // Warning animation
        this.scene.tweens.add({
            targets: [warningOverlay, warningText],
            alpha: { from: 0.1, to: 0.4 },
            scale: { from: 0.8, to: 1.2 },
            duration: 1000,
            onComplete: () => {
                warningOverlay.destroy();
                warningText.destroy();
            }
        });
    }
    
    activateBlizzard() {
        this.blizzardActive = true;
        this.blizzardDamageTimer = 0;
        
        // Create blizzard visual effect
        this.blizzardOverlay = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xffffff,
            0.15
        );
        this.blizzardOverlay.setDepth(50);
        this.blizzardOverlay.setScrollFactor(0);
        
        // Pulsing blizzard effect
        this.scene.tweens.add({
            targets: this.blizzardOverlay,
            alpha: { from: 0.05, to: 0.25 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    applyBlizzardDamage() {
        this.blizzardDamageTimer += 16; // 60fps approximation
        
        if (this.blizzardDamageTimer >= 1000) { // Damage every second
            const player = this.scene.wizard;
            if (player && player.active && player.takeDamage) {
                player.takeDamage(15); // Blizzard DoT damage
                this.applyFreezeEffect(player);
            }
            this.blizzardDamageTimer = 0;
        }
    }
    
    deactivateBlizzard() {
        this.blizzardActive = false;
        if (this.blizzardOverlay) {
            this.blizzardOverlay.destroy();
            this.blizzardOverlay = null;
        }
    }
    
    applyFreezeEffect(target) {
        if (target.moveSpeed) {
            // Slow effect
            const originalSpeed = target.moveSpeed;
            target.moveSpeed *= 0.5;
            target.setTint(0x88ccff);
            
            // Restore after 2 seconds
            this.scene.time.delayedCall(2000, () => {
                if (target.active) {
                    target.moveSpeed = originalSpeed;
                    target.clearTint();
                }
            });
        }
    }
    
    createIceShard(x, y, duration = 8000) {
        const shard = this.scene.add.sprite(x, y, 'ice-spell');
        shard.setScale(1.2);
        shard.setTint(0xccddff);
        shard.setDepth(10);
        
        // Add physics for collision
        this.scene.physics.add.existing(shard, true); // Static body
        
        // Damage on contact
        const damageOverlap = this.scene.physics.add.overlap(shard, this.scene.wizard, () => {
            if (this.scene.wizard.takeDamage) {
                this.scene.wizard.takeDamage(20);
            }
        });
        
        // Remove after duration
        this.scene.time.delayedCall(duration, () => {
            damageOverlap.destroy();
            shard.destroy();
        });
    }
    
    createIceWalls() {
        if (this.scene.spawnSpecificEnemy) {
            // Spawn ice-themed enemies on phase change
            for (let i = 0; i < 3; i++) {
                const angle = (Math.PI * 2 / 3) * i;
                const distance = 300;
                const x = this.x + Math.cos(angle) * distance;
                const y = this.y + Math.sin(angle) * distance;
                
                // Spawn closest available ice enemies (or generic ones)
                this.scene.spawnSpecificEnemy('golem-blue', x, y);
            }
        }
    }
}

export default FrostGuardianBoss;