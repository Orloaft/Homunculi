// Nekros Boss - Grave Land Death Knight with Flight Mechanics

import BaseBoss from '../BaseBoss.js';
import { BossPatterns } from '../../systems/BossStateMachine.js';

export class NekrosBoss extends BaseBoss {
    constructor(scene, x, y) {
        const config = {
            name: 'Nekros',
            health: 5000,
            damage: 45,
            moveSpeed: 90,
            attackRange: 600
        };
        
        super(scene, x, y, 'nekros-boss', config);
        
        // Nekros specific properties
        this.projectileSpeed = 250;
        this.bombardmentRadius = 300;
        this.soulDrainRange = 200;
        this.soulDrainDamage = 30;
        this.summonCount = 0;
        
        // Set up animations
        this.setScale(1.5);
        this.play('nekros-walk');
    }
    
    initializeStates() {
        super.initializeStates();
        
        // Walking state - vulnerable
        this.stateMachine.addState('walking', {
            enter: () => {
                this.play('nekros-walk');
                this.isInvulnerable = false;
                this.clearTint();
            },
            update: (dt) => {
                this.moveTowardsPlayer(dt);
            },
            exit: () => {
                this.setVelocity(0, 0);
            }
        });
        
        // Flying state - invulnerable bombardment mode
        this.stateMachine.addState('flying', {
            enter: () => {
                this.play('nekros-fly');
                this.isInvulnerable = true;
                this.setTint(0x9400d3);
                this.alpha = 0.8;
                
                // Rise up effect
                this.scene.tweens.add({
                    targets: this,
                    y: this.y - 50,
                    duration: 500,
                    ease: 'Power2'
                });
                
                // Visual indicator
                const flyText = this.scene.add.text(this.x, this.y - 100, 'TAKING FLIGHT!', {
                    fontSize: '24px',
                    color: '#9400d3',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4
                });
                flyText.setOrigin(0.5);
                flyText.setDepth(200);
                
                this.scene.tweens.add({
                    targets: flyText,
                    y: flyText.y - 30,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => flyText.destroy()
                });
            },
            update: (dt) => {
                // Float movement
                this.floatMovement(dt);
            },
            exit: () => {
                this.isInvulnerable = false;
                this.clearTint();
                this.alpha = 1;
                
                // Land effect
                this.scene.tweens.add({
                    targets: this,
                    y: this.y + 50,
                    duration: 500,
                    ease: 'Power2'
                });
            },
            canInterrupt: false
        });
        
        // Projectile attack state
        this.stateMachine.addState('projectile_attack', {
            enter: () => {
                this.setVelocity(0, 0);
                this.projectileCount = 0;
            },
            update: (dt, stateMachine) => {
                // Fire projectiles at intervals
                if (stateMachine.getStateTimer() > this.projectileCount * 0.3 + 0.2) {
                    this.fireProjectile();
                    this.projectileCount++;
                }
            },
            exit: () => {
                // Continue current animation
            }
        });
        
        // Bombardment state - aerial attack
        this.stateMachine.addState('bombardment', {
            enter: () => {
                this.bombardmentCount = 0;
                
                // Warning areas
                this.createBombardmentWarnings();
            },
            update: (dt, stateMachine) => {
                // Drop projectiles
                if (stateMachine.getStateTimer() > this.bombardmentCount * 0.4 + 0.5) {
                    this.dropBombardment();
                    this.bombardmentCount++;
                }
            },
            exit: () => {
                this.clearBombardmentWarnings();
            }
        });
        
        // Soul drain state - life steal attack
        this.stateMachine.addState('soul_drain', {
            enter: () => {
                this.setVelocity(0, 0);
                this.play('nekros-walk'); // Use walk animation
                this.setTint(0x00ff00);
                
                // Create drain effect
                this.createSoulDrainEffect();
            },
            update: (dt) => {
                this.performSoulDrain(dt);
            },
            exit: () => {
                this.clearTint();
                this.removeSoulDrainEffect();
            },
            duration: 3.0
        });
        
        // Summon undead state
        this.stateMachine.addState('summon_undead', {
            enter: () => {
                this.setVelocity(0, 0);
                this.setTint(0x800080);
                
                // Summon effect
                const summonCircle = this.scene.add.graphics();
                summonCircle.lineStyle(4, 0x800080, 1);
                summonCircle.strokeCircle(this.x, this.y, 100);
                summonCircle.setDepth(90);
                
                this.scene.tweens.add({
                    targets: summonCircle,
                    scale: { from: 0, to: 2 },
                    alpha: { from: 1, to: 0 },
                    duration: 1000,
                    onComplete: () => summonCircle.destroy()
                });
            },
            update: (dt, stateMachine) => {
                if (stateMachine.getStateTimer() > 0.8 && !this.hasSummoned) {
                    this.summonUndead();
                    this.hasSummoned = true;
                }
            },
            exit: () => {
                this.clearTint();
                this.hasSummoned = false;
            },
            duration: 1.5
        });
    }
    
    initializeBehaviors() {
        // Phase 1: Ground combat with periodic flight (100% - 66% health)
        this.stateMachine.addBehavior('phase1_ground', {
            condition: () => this.currentPhase === 1,
            priority: 10,
            pattern: [
                ...BossPatterns.movementPattern('walking', 3),
                ...BossPatterns.simpleAttack('projectile_attack', 'walking', 1.5, 0.5),
                ...BossPatterns.movementPattern('walking', 2),
                ...BossPatterns.simpleAttack('summon_undead', 'idle', 1.5, 1),
                { state: 'flying', duration: 2 },
                ...BossPatterns.simpleAttack('bombardment', 'flying', 2, 0.5),
                { state: 'walking', duration: 0.5 } // Land
            ]
        });
        
        // Phase 2: More flight time and soul drain (66% - 33% health)
        this.stateMachine.addBehavior('phase2_aerial', {
            condition: () => this.currentPhase === 2,
            priority: 9,
            enter: () => {
                this.projectileSpeed *= 1.2; // Faster projectiles
            },
            pattern: [
                ...BossPatterns.movementPattern('walking', 2),
                ...BossPatterns.simpleAttack('soul_drain', 'idle', 3, 0.5),
                ...BossPatterns.simpleAttack('projectile_attack', 'walking', 1.5, 0.3),
                { state: 'flying', duration: 3 },
                ...BossPatterns.simpleAttack('bombardment', 'flying', 2.5, 0.3),
                ...BossPatterns.simpleAttack('projectile_attack', 'flying', 1.5, 0.3),
                { state: 'walking', duration: 0.5 },
                ...BossPatterns.simpleAttack('summon_undead', 'idle', 1.5, 0.5)
            ]
        });
        
        // Phase 3: Aggressive aerial assault (33% - 0% health)
        this.stateMachine.addBehavior('phase3_death_knight', {
            condition: () => this.currentPhase === 3,
            priority: 8,
            enter: () => {
                this.moveSpeed *= 1.3; // Faster movement
                this.summonCount = 5; // More summons
            },
            pattern: [
                ...BossPatterns.simpleAttack('summon_undead', 'idle', 1.5, 0.2),
                { state: 'flying', duration: 4 },
                ...BossPatterns.simpleAttack('bombardment', 'flying', 3, 0.2),
                ...BossPatterns.simpleAttack('projectile_attack', 'flying', 1.5, 0.2),
                ...BossPatterns.simpleAttack('bombardment', 'flying', 2, 0.2),
                { state: 'walking', duration: 0.5 },
                ...BossPatterns.simpleAttack('soul_drain', 'idle', 3, 0.3),
                ...BossPatterns.movementPattern('walking', 1)
            ]
        });
    }
    
    onPhaseChange(newPhase) {
        super.onPhaseChange(newPhase);
        
        // Summon more undead on phase change
        this.summonUndeadWave();
    }
    
    floatMovement(dt) {
        // Hover around the battlefield
        const time = this.scene.time.now / 1000;
        const baseX = this.scene.wizard ? this.scene.wizard.x : 400;
        const baseY = this.scene.wizard ? this.scene.wizard.y : 300;
        
        const offsetX = Math.sin(time * 2) * 150;
        const offsetY = Math.cos(time * 1.5) * 100;
        
        const targetX = baseX + offsetX;
        const targetY = baseY + offsetY - 100; // Stay above ground
        
        // Smooth movement
        this.x = Phaser.Math.Linear(this.x, targetX, 0.05);
        this.y = Phaser.Math.Linear(this.y, targetY, 0.05);
    }
    
    fireProjectile() {
        const player = this.scene.wizard;
        if (!player || !player.active) return;
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        
        // Create death projectile
        const projectile = this.scene.physics.add.sprite(this.x, this.y, 'death-spell');
        projectile.setScale(1.5);
        projectile.setTint(0x9400d3);
        
        if (this.scene.anims.exists('death-spell-anim')) {
            projectile.play('death-spell-anim');
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
        
        // Auto-destroy after 4 seconds
        this.scene.time.delayedCall(4000, () => {
            if (projectile.active) projectile.destroy();
        });
    }
    
    createBombardmentWarnings() {
        this.bombardmentWarnings = [];
        const player = this.scene.wizard;
        if (!player) return;
        
        // Create warning circles around player
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            const distance = Math.random() * this.bombardmentRadius;
            const x = player.x + Math.cos(angle) * distance;
            const y = player.y + Math.sin(angle) * distance;
            
            const warning = this.scene.add.graphics();
            warning.lineStyle(3, 0xff0000, 0.5);
            warning.strokeCircle(0, 0, 50);
            warning.x = x;
            warning.y = y;
            warning.setDepth(90);
            
            this.bombardmentWarnings.push({ graphic: warning, x: x, y: y });
            
            // Pulse animation
            this.scene.tweens.add({
                targets: warning,
                alpha: { from: 0.3, to: 1 },
                scale: { from: 0.8, to: 1.2 },
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    dropBombardment() {
        if (!this.bombardmentWarnings || this.bombardmentCount >= this.bombardmentWarnings.length) return;
        
        const target = this.bombardmentWarnings[this.bombardmentCount];
        
        // Create falling projectile
        const projectile = this.scene.physics.add.sprite(target.x, target.y - 400, 'death-spell');
        projectile.setScale(2);
        projectile.setTint(0x9400d3);
        
        // Fall animation
        this.scene.tweens.add({
            targets: projectile,
            y: target.y,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // Explosion effect
                this.createExplosion(projectile.x, projectile.y, this.damage, 100);
                projectile.destroy();
            }
        });
    }
    
    clearBombardmentWarnings() {
        if (this.bombardmentWarnings) {
            this.bombardmentWarnings.forEach(warning => {
                if (warning.graphic) warning.graphic.destroy();
            });
            this.bombardmentWarnings = [];
        }
    }
    
    createSoulDrainEffect() {
        this.soulDrainCircle = this.scene.add.graphics();
        this.soulDrainCircle.lineStyle(4, 0x00ff00, 0.5);
        this.soulDrainCircle.strokeCircle(0, 0, this.soulDrainRange);
        this.soulDrainCircle.x = this.x;
        this.soulDrainCircle.y = this.y;
        this.soulDrainCircle.setDepth(90);
        
        // Pulsing effect
        this.scene.tweens.add({
            targets: this.soulDrainCircle,
            scale: { from: 0.9, to: 1.1 },
            alpha: { from: 0.3, to: 0.8 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    performSoulDrain(dt) {
        if (!this.soulDrainCircle) return;
        
        // Update circle position
        this.soulDrainCircle.x = this.x;
        this.soulDrainCircle.y = this.y;
        
        // Check if player is in range
        const player = this.scene.wizard;
        if (player && player.active) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (distance <= this.soulDrainRange) {
                // Damage player and heal self
                const damage = this.soulDrainDamage * dt;
                if (player.takeDamage) {
                    player.takeDamage(Math.floor(damage));
                }
                
                // Heal boss
                this.health = Math.min(this.maxHealth, this.health + damage * 0.5);
                if (this.healthBar) {
                    const healthPercent = this.health / this.maxHealth;
                    this.healthBar.width = (this.healthBarBg.width - 4) * healthPercent;
                }
                
                // Visual effect - soul particles
                if (Math.random() < 0.3) {
                    const soul = this.scene.add.circle(player.x, player.y, 4, 0x00ff00);
                    soul.setDepth(100);
                    
                    this.scene.tweens.add({
                        targets: soul,
                        x: this.x,
                        y: this.y,
                        scale: 0,
                        duration: 500,
                        onComplete: () => soul.destroy()
                    });
                }
            }
        }
    }
    
    removeSoulDrainEffect() {
        if (this.soulDrainCircle) {
            this.soulDrainCircle.destroy();
            this.soulDrainCircle = null;
        }
    }
    
    summonUndead() {
        const summonTypes = ['skeleton', 'skeleton-yellow', 'sorcerer'];
        const count = this.summonCount || 3;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const distance = 150;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            // Random undead type
            const type = summonTypes[Math.floor(Math.random() * summonTypes.length)];
            
            if (this.scene.spawnSpecificEnemy) {
                this.scene.spawnSpecificEnemy(type, x, y);
            }
        }
    }
    
    summonUndeadWave() {
        // Larger wave for phase transitions
        const positions = [
            { x: this.x - 200, y: this.y },
            { x: this.x + 200, y: this.y },
            { x: this.x, y: this.y - 200 },
            { x: this.x, y: this.y + 200 }
        ];
        
        positions.forEach(pos => {
            if (this.scene.spawnSpecificEnemy) {
                this.scene.spawnSpecificEnemy('skeleton', pos.x, pos.y);
            }
        });
    }
    
    createExplosion(x, y, damage, radius) {
        // Visual explosion
        const explosion = this.scene.add.sprite(x, y, 'death-spell');
        explosion.setScale(3);
        explosion.setTint(0x9400d3);
        if (this.scene.anims.exists('death-spell-anim')) {
            explosion.play('death-spell-anim');
        }
        explosion.once('animationcomplete', () => explosion.destroy());
        
        // Damage check
        const player = this.scene.wizard;
        if (player && player.active) {
            const distance = Phaser.Math.Distance.Between(x, y, player.x, player.y);
            if (distance <= radius && player.takeDamage) {
                player.takeDamage(damage);
            }
        }
        
        // Screen shake
        this.scene.cameras.main.shake(200, 0.01);
    }
}

export default NekrosBoss;