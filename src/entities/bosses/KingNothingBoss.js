// King Nothing Boss - Castle Land Final Boss
// A powerful void-themed boss with multiple phases and devastating attacks

class KingNothingBoss {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // Create the boss sprite
        this.sprite = scene.physics.add.sprite(x, y, 'king-nothing-run', 0);
        this.sprite.setScale(3);
        this.sprite.setDepth(10);
        
        // Boss properties
        this.maxHealth = 8000;
        this.health = this.maxHealth;
        this.phase = 1;
        this.isDead = false;
        this.isInvulnerable = false;
        this.attackCooldown = 0;
        
        // Movement properties
        this.moveSpeed = 50;
        this.floatAmplitude = 20;
        this.floatSpeed = 0.001;
        this.floatTimer = 0;
        
        // Attack patterns
        this.currentAttack = null;
        this.attackTimer = 0;
        this.voidZones = [];
        this.voidProjectiles = [];
        
        // Setup animations
        this.setupAnimations();
        
        // Setup physics
        this.sprite.body.setSize(60, 80);
        this.sprite.body.setOffset(20, 20);
        
        // Boss specific properties
        this.sprite.boss = this;
        this.sprite.enemyType = 'king-nothing-boss';
        this.sprite.isBoss = true;
        this.sprite.health = this.health;
        this.sprite.maxHealth = this.maxHealth;
        
        // Play run animation as idle
        this.sprite.play('king-nothing-run');
        
        // Create crown that floats above (use a circle as placeholder if sprite not loaded)
        if (scene.textures.exists('king-crown')) {
            this.crown = scene.add.sprite(x, y - 60, 'king-crown');
            this.crown.setScale(2);
        } else {
            // Create a purple circle as crown placeholder
            this.crown = scene.add.circle(x, y - 60, 15, 0x9900ff);
        }
        this.crown.setDepth(11);
        
        // Phase transition effects
        this.phaseTransitioning = false;
    }
    
    setupAnimations() {
        const scene = this.scene;
        
        // Create animations if they don't exist
        if (!scene.anims.exists('king-nothing-run')) {
            scene.anims.create({
                key: 'king-nothing-run',
                frames: scene.anims.generateFrameNumbers('king-nothing-run', { start: 0, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
        }
        
        if (!scene.anims.exists('king-nothing-attack1')) {
            // Use static frames for attack since we have individual images
            scene.anims.create({
                key: 'king-nothing-attack1',
                frames: [{ key: 'king-nothing-attack1' }],
                frameRate: 1,
                repeat: 0
            });
        }
        
        if (!scene.anims.exists('king-nothing-attack2')) {
            scene.anims.create({
                key: 'king-nothing-attack2',
                frames: [{ key: 'king-nothing-attack2' }],
                frameRate: 1,
                repeat: 0
            });
        }
        
        if (!scene.anims.exists('king-nothing-attack3')) {
            scene.anims.create({
                key: 'king-nothing-attack3',
                frames: [{ key: 'king-nothing-attack3' }],
                frameRate: 1,
                repeat: 0
            });
        }
        
        if (!scene.anims.exists('king-nothing-death')) {
            scene.anims.create({
                key: 'king-nothing-death',
                frames: scene.anims.generateFrameNumbers('king-nothing-death', { start: 0, end: 9 }),
                frameRate: 8,
                repeat: 0
            });
        }
    }
    
    update(time, delta) {
        if (this.isDead) return;
        
        // Update crown position
        if (this.crown) {
            this.crown.x = this.sprite.x;
            this.crown.y = this.sprite.y - 60 + Math.sin(time * 0.002) * 5;
            this.crown.rotation = Math.sin(time * 0.001) * 0.1;
        }
        
        // Floating movement
        this.floatTimer += delta;
        const floatOffset = Math.sin(this.floatTimer * this.floatSpeed) * this.floatAmplitude;
        this.sprite.y = this.y + floatOffset;
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
        
        // Check phase transitions
        this.checkPhaseTransition();
        
        // Execute attacks based on phase
        if (!this.phaseTransitioning && this.attackCooldown <= 0) {
            this.executePhaseAttack();
        }
        
        // Update ongoing attacks
        this.updateOngoingAttacks(time, delta);
    }
    
    checkPhaseTransition() {
        const healthPercent = this.health / this.maxHealth;
        
        // Phase 2 at 66% health
        if (this.phase === 1 && healthPercent <= 0.66) {
            this.transitionToPhase(2);
        }
        // Phase 3 at 33% health
        else if (this.phase === 2 && healthPercent <= 0.33) {
            this.transitionToPhase(3);
        }
    }
    
    transitionToPhase(newPhase) {
        this.phaseTransitioning = true;
        this.phase = newPhase;
        
        // Visual effect for phase transition
        this.scene.cameras.main.shake(500, 0.02);
        
        // Create void explosion effect
        this.createVoidExplosion();
        
        // Temporary invulnerability
        this.isInvulnerable = true;
        this.sprite.setTint(0x9900ff);
        
        // Phase-specific changes
        if (newPhase === 2) {
            this.moveSpeed = 75;
            this.floatSpeed = 0.0015;
            
            // Announce phase 2
            this.showPhaseText('PHASE II - THE VOID AWAKENS');
        } else if (newPhase === 3) {
            this.moveSpeed = 100;
            this.floatSpeed = 0.002;
            
            // Announce phase 3
            this.showPhaseText('PHASE III - EMBRACE NOTHINGNESS');
        }
        
        // End transition after delay
        this.scene.time.delayedCall(2000, () => {
            this.phaseTransitioning = false;
            this.isInvulnerable = false;
            this.sprite.clearTint();
            this.attackCooldown = 0;
        });
    }
    
    showPhaseText(text) {
        const phaseText = this.scene.add.text(400, 200, text, {
            fontSize: '32px',
            color: '#9900ff',
            stroke: '#000000',
            strokeThickness: 4
        });
        phaseText.setOrigin(0.5);
        phaseText.setScrollFactor(0);
        phaseText.setDepth(100);
        
        this.scene.tweens.add({
            targets: phaseText,
            alpha: 0,
            duration: 2000,
            delay: 1000,
            onComplete: () => phaseText.destroy()
        });
    }
    
    executePhaseAttack() {
        const player = this.scene.wizard;
        if (!player || !player.active) return;
        
        // Choose attack based on phase
        if (this.phase === 1) {
            this.executePhase1Attack();
        } else if (this.phase === 2) {
            this.executePhase2Attack();
        } else if (this.phase === 3) {
            this.executePhase3Attack();
        }
    }
    
    executePhase1Attack() {
        const attackChoice = Phaser.Math.Between(1, 3);
        
        switch(attackChoice) {
            case 1:
                this.voidProjectileBarrage();
                break;
            case 2:
                this.voidBeam();
                break;
            case 3:
                this.summonVoidMinions();
                break;
        }
        
        this.attackCooldown = 3000;
    }
    
    executePhase2Attack() {
        const attackChoice = Phaser.Math.Between(1, 4);
        
        switch(attackChoice) {
            case 1:
                this.voidProjectileBarrage();
                break;
            case 2:
                this.voidBeam();
                break;
            case 3:
                this.createVoidZones();
                break;
            case 4:
                this.voidPulse();
                break;
        }
        
        this.attackCooldown = 2500;
    }
    
    executePhase3Attack() {
        const attackChoice = Phaser.Math.Between(1, 5);
        
        switch(attackChoice) {
            case 1:
                this.voidProjectileBarrage();
                this.voidPulse(); // Combo attack
                break;
            case 2:
                this.voidBeam();
                break;
            case 3:
                this.createVoidZones();
                break;
            case 4:
                this.voidStorm();
                break;
            case 5:
                this.ultimateVoidAttack();
                break;
        }
        
        this.attackCooldown = 2000;
    }
    
    voidProjectileBarrage() {
        // Randomly choose one of the three attack animations
        const attackNum = Phaser.Math.Between(1, 3);
        this.sprite.play(`king-nothing-attack${attackNum}`);
        
        // Fire multiple void projectiles in a spread pattern
        const projectileCount = 5 + (this.phase - 1) * 2;
        const angleStep = Math.PI / (projectileCount + 1);
        
        for (let i = 0; i < projectileCount; i++) {
            const angle = -Math.PI/2 - angleStep * (projectileCount/2) + angleStep * (i + 1);
            
            this.scene.time.delayedCall(i * 100, () => {
                this.fireVoidProjectile(angle);
            });
        }
    }
    
    fireVoidProjectile(angle) {
        // Use a purple circle as void projectile
        const projectile = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            10,
            0x9900ff
        );
        this.scene.physics.add.existing(projectile);
        
        projectile.setScale(2);
        projectile.setDepth(9);
        
        const speed = 200 + (this.phase - 1) * 50;
        projectile.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        projectile.damage = 25 + (this.phase - 1) * 10;
        projectile.fromBoss = true;
        
        // Add to enemy projectiles group
        if (this.scene.enemyProjectiles) {
            this.scene.enemyProjectiles.add(projectile);
        }
        
        // Auto-destroy after 5 seconds
        this.scene.time.delayedCall(5000, () => {
            if (projectile.active) projectile.destroy();
        });
    }
    
    voidBeam() {
        // Use attack2 for casting
        this.sprite.play('king-nothing-attack2');
        
        const player = this.scene.wizard;
        if (!player) return;
        
        // Telegraph the attack
        const telegraph = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y,
            20,
            800,
            0x9900ff,
            0.3
        );
        
        // Calculate angle to player
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.x, player.y
        );
        telegraph.rotation = angle + Math.PI/2;
        
        // Fire the beam after delay
        this.scene.time.delayedCall(1000, () => {
            telegraph.destroy();
            
            // Create actual beam
            const beam = this.scene.add.rectangle(
                this.sprite.x,
                this.sprite.y,
                40,
                800,
                0x9900ff
            );
            beam.rotation = angle + Math.PI/2;
            
            // Add physics to beam
            this.scene.physics.add.existing(beam);
            beam.body.setSize(40, 800);
            beam.damage = 40 + (this.phase - 1) * 15;
            beam.fromBoss = true;
            
            // Check collision with player
            this.scene.physics.add.overlap(beam, player, (beam, player) => {
                if (this.scene.playerHit) {
                    this.scene.playerHit(beam.damage);
                }
            });
            
            // Destroy beam after short duration
            this.scene.time.delayedCall(200, () => {
                beam.destroy();
            });
        });
    }
    
    createVoidZones() {
        const zoneCount = 3 + (this.phase - 2);
        
        for (let i = 0; i < zoneCount; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            
            // Telegraph zone
            const telegraph = this.scene.add.circle(x, y, 60, 0x9900ff, 0.2);
            
            this.scene.time.delayedCall(1000, () => {
                telegraph.destroy();
                
                // Create actual void zone
                const voidZone = this.scene.add.circle(x, y, 60, 0x9900ff, 0.5);
                this.scene.physics.add.existing(voidZone);
                voidZone.body.setCircle(60);
                voidZone.damage = 15;
                voidZone.fromBoss = true;
                
                this.voidZones.push(voidZone);
                
                // Pulse effect
                this.scene.tweens.add({
                    targets: voidZone,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    alpha: 0.7,
                    duration: 500,
                    yoyo: true,
                    repeat: 10,
                    onComplete: () => {
                        voidZone.destroy();
                        const index = this.voidZones.indexOf(voidZone);
                        if (index > -1) this.voidZones.splice(index, 1);
                    }
                });
                
                // Damage overlap
                if (this.scene.wizard) {
                    const damageTimer = this.scene.time.addEvent({
                        delay: 500,
                        callback: () => {
                            if (!voidZone.active) {
                                damageTimer.remove();
                                return;
                            }
                            
                            const distance = Phaser.Math.Distance.Between(
                                voidZone.x, voidZone.y,
                                this.scene.wizard.x, this.scene.wizard.y
                            );
                            
                            if (distance < 60 && this.scene.playerHit) {
                                this.scene.playerHit(voidZone.damage);
                            }
                        },
                        loop: true
                    });
                }
            });
        }
    }
    
    voidPulse() {
        // Use attack3 for pulse
        this.sprite.play('king-nothing-attack3');
        
        // Create expanding void pulse
        const pulse = this.scene.add.circle(this.sprite.x, this.sprite.y, 10, 0x9900ff, 0.8);
        pulse.setDepth(8);
        
        this.scene.tweens.add({
            targets: pulse,
            scaleX: 40,
            scaleY: 40,
            alpha: 0,
            duration: 1500,
            onUpdate: () => {
                // Check collision with player
                if (this.scene.wizard) {
                    const distance = Phaser.Math.Distance.Between(
                        pulse.x, pulse.y,
                        this.scene.wizard.x, this.scene.wizard.y
                    );
                    
                    const pulseRadius = pulse.scaleX * 10;
                    if (distance < pulseRadius && distance > pulseRadius - 20) {
                        if (this.scene.playerHit && !pulse.hasHit) {
                            this.scene.playerHit(30 + (this.phase - 1) * 10);
                            pulse.hasHit = true;
                        }
                    }
                }
            },
            onComplete: () => pulse.destroy()
        });
    }
    
    voidStorm() {
        // Use attack2 for storm casting
        this.sprite.play('king-nothing-attack2');
        
        // Create multiple void projectiles falling from above
        const stormDuration = 5000;
        const projectileInterval = 200;
        
        const stormTimer = this.scene.time.addEvent({
            delay: projectileInterval,
            callback: () => {
                const x = Phaser.Math.Between(50, 750);
                // Use purple circle for void projectiles
                const projectile = this.scene.add.circle(x, -50, 8, 0x9900ff);
                this.scene.physics.add.existing(projectile);
                projectile.setVelocityY(300);
                projectile.damage = 20;
                projectile.fromBoss = true;
                
                if (this.scene.enemyProjectiles) {
                    this.scene.enemyProjectiles.add(projectile);
                }
                
                // Auto-destroy when off screen
                this.scene.time.delayedCall(3000, () => {
                    if (projectile.active) projectile.destroy();
                });
            },
            repeat: stormDuration / projectileInterval
        });
    }
    
    ultimateVoidAttack() {
        // Only in phase 3
        if (this.phase !== 3) return;
        
        // Use all attack animations in sequence for ultimate
        this.sprite.play('king-nothing-attack3');
        
        // Screen goes dark
        const darkness = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0);
        darkness.setScrollFactor(0);
        darkness.setDepth(50);
        
        this.scene.tweens.add({
            targets: darkness,
            alpha: 0.8,
            duration: 1000
        });
        
        // Warning text
        const warningText = this.scene.add.text(400, 300, 'THE VOID CONSUMES ALL', {
            fontSize: '48px',
            color: '#9900ff',
            stroke: '#000000',
            strokeThickness: 6
        });
        warningText.setOrigin(0.5);
        warningText.setScrollFactor(0);
        warningText.setDepth(51);
        
        // Create void singularity at player position after delay
        this.scene.time.delayedCall(2000, () => {
            warningText.destroy();
            
            if (this.scene.wizard) {
                const singularity = this.scene.add.circle(
                    this.scene.wizard.x,
                    this.scene.wizard.y,
                    10,
                    0x9900ff
                );
                singularity.setDepth(52);
                
                // Expand and deal damage
                this.scene.tweens.add({
                    targets: singularity,
                    scaleX: 20,
                    scaleY: 20,
                    duration: 500,
                    onComplete: () => {
                        // Check if player is in range
                        const distance = Phaser.Math.Distance.Between(
                            singularity.x, singularity.y,
                            this.scene.wizard.x, this.scene.wizard.y
                        );
                        
                        if (distance < 200 && this.scene.playerHit) {
                            this.scene.playerHit(60);
                        }
                        
                        // Collapse
                        this.scene.tweens.add({
                            targets: singularity,
                            scaleX: 0,
                            scaleY: 0,
                            duration: 300,
                            onComplete: () => {
                                singularity.destroy();
                                darkness.destroy();
                            }
                        });
                    }
                });
            }
        });
    }
    
    summonVoidMinions() {
        const minionCount = 2 + this.phase;
        
        for (let i = 0; i < minionCount; i++) {
            const angle = (Math.PI * 2 / minionCount) * i;
            const x = this.sprite.x + Math.cos(angle) * 100;
            const y = this.sprite.y + Math.sin(angle) * 100;
            
            // Create void portal effect
            const portal = this.scene.add.circle(x, y, 30, 0x9900ff, 0.5);
            
            this.scene.time.delayedCall(500, () => {
                portal.destroy();
                
                // Spawn castle enemy as void minion
                if (this.scene.createEnemy) {
                    // Use castle-squire as void minion
                    this.scene.createEnemy('castle-squire', x, y);
                    
                    // Find the created enemy and modify it
                    const enemies = this.scene.enemies.getChildren();
                    const minion = enemies[enemies.length - 1];
                    if (minion) {
                        minion.setTint(0x9900ff);
                        minion.health = 50 * this.phase;
                        minion.damage = 15;
                        minion.moveSpeed = 100;
                    }
                }
            });
        }
    }
    
    createVoidExplosion() {
        // Create multiple void particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i;
            const speed = Phaser.Math.Between(100, 300);
            
            const particle = this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                Phaser.Math.Between(5, 15),
                0x9900ff
            );
            
            this.scene.physics.add.existing(particle);
            particle.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                duration: 1000,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    updateOngoingAttacks(time, delta) {
        // Update void zones damage tick
        // Handled in createVoidZones method
    }
    
    takeDamage(amount) {
        if (this.isDead || this.isInvulnerable) return;
        
        this.health -= amount;
        this.sprite.health = this.health;
        
        // Flash red
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (!this.isInvulnerable) {
                this.sprite.clearTint();
            }
        });
        
        // Update health bar if it exists
        if (this.scene.bossHealthBar) {
            const healthPercent = this.health / this.maxHealth;
            this.scene.bossHealthBar.clear();
            this.scene.bossHealthBar.fillStyle(0xff0000, 1);
            this.scene.bossHealthBar.fillRect(200, 30, 400 * healthPercent, 20);
        }
        
        // Check death
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        if (this.isDead) return;
        this.isDead = true;
        
        // Play death animation
        this.sprite.play('king-nothing-death');
        
        // Crown falls
        if (this.crown) {
            this.scene.tweens.add({
                targets: this.crown,
                y: this.sprite.y + 100,
                rotation: Math.PI * 4,
                duration: 2000,
                ease: 'Power2'
            });
        }
        
        // Clear all void zones
        this.voidZones.forEach(zone => zone.destroy());
        this.voidZones = [];
        
        // Death explosion effect
        this.scene.time.delayedCall(1000, () => {
            this.createVoidExplosion();
        });
        
        // Destroy after animation
        this.sprite.on('animationcomplete-king-nothing-death', () => {
            // Drop rewards
            this.dropRewards();
            
            // Destroy boss
            if (this.crown) this.crown.destroy();
            this.sprite.destroy();
            
            // Boss defeated
            if (this.scene.onBossDefeated) {
                this.scene.onBossDefeated('king-nothing');
            }
        });
    }
    
    dropRewards() {
        // Drop dark element orbs (similar to void)
        for (let i = 0; i < 5; i++) {
            if (this.scene.elementOrbs && this.scene.textures.exists('darkOrb')) {
                const orb = this.scene.physics.add.sprite(
                    this.sprite.x + Phaser.Math.Between(-50, 50),
                    this.sprite.y + Phaser.Math.Between(-50, 50),
                    'darkOrb'
                );
                orb.setScale(1.5);
                orb.orbType = 'dark';
                orb.element = 'dark';
                
                this.scene.elementOrbs.add(orb);
            }
        }
        
        // Drop special crown item as purple circle
        const crown = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            20,
            0x9900ff
        );
        this.scene.physics.add.existing(crown);
        crown.itemType = 'crown';
        
        // Add floating effect to crown
        this.scene.tweens.add({
            targets: crown,
            y: crown.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KingNothingBoss;
}