import { ELEMENT_CONFIG } from '../../data/ElementConfig.js';
import { COMBAT_CONFIG } from '../../data/GameConstants.js';

export class ProjectileManager {
    constructor(scene) {
        this.scene = scene;
        this.projectiles = scene.physics.add.group();
        
        // Special projectile tracking
        this.activeFlames = {};
        this.waterOrbs = [];
        this.earthZones = [];
        this.firePools = [];
        
        this.setupEventListeners();
        this.createAnimations();
    }
    
    setupEventListeners() {
        // Listen for projectile creation requests
        this.scene.events.on('fireProjectile', (data) => {
            this.fireProjectile(data.origin, data.target, data.elements);
        });
        
        // Listen for special attacks
        this.scene.events.on('createExplosion', (data) => {
            this.createExplosion(data.x, data.y, data.radius);
        });
    }
    
    createAnimations() {
        // Fire spell animation
        if (!this.scene.anims.exists('fire-spell-anim')) {
            this.scene.anims.create({
                key: 'fire-spell-anim',
                frames: this.scene.anims.generateFrameNumbers('fire-spell', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        // Arcane spell animation
        if (!this.scene.anims.exists('arcane-spell-anim')) {
            this.scene.anims.create({
                key: 'arcane-spell-anim',
                frames: this.scene.anims.generateFrameNumbers('arcane-spell', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
        
        // Water spell animation
        if (!this.scene.anims.exists('water-spell-anim')) {
            this.scene.anims.create({
                key: 'water-spell-anim',
                frames: this.scene.anims.generateFrameNumbers('water-spell', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        
        // Earth spell animation
        if (!this.scene.anims.exists('earth-spell-anim')) {
            this.scene.anims.create({
                key: 'earth-spell-anim',
                frames: this.scene.anims.generateFrameNumbers('earth-spell', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
        }
    }
    
    fireProjectile(origin, target, elements) {
        if (!elements || elements.length === 0) return;
        
        // Handle linked elements
        const primaryElement = elements[0];
        const isLinked = elements.length > 1;
        console.log('[ProjectileManager] fireProjectile called:', { primaryElement, elements, target: target ? {x: target.x, y: target.y} : null });
        
        // Fire element-specific projectile
        switch (primaryElement) {
            case 'fire':
                this.fireFireProjectile(origin, elements);
                break;
            case 'water':
                this.fireWaterProjectile(origin, target, elements);
                break;
            case 'earth':
                this.fireEarthProjectile(origin, elements);
                break;
            case 'air':
                this.fireAirProjectile(origin, elements);
                break;
            case 'arcane':
                this.fireArcaneProjectile(origin, target, elements);
                break;
            case 'rock':
                this.fireRockProjectile(origin, target, elements);
                break;
            case 'poison':
                this.firePoisonProjectile(origin, target, elements);
                break;
            case 'lightning':
                this.fireLightningProjectile(origin, target, elements);
                break;
            case 'ice':
                this.fireIceProjectile(origin, target, elements);
                break;
            default:
                // Default projectile for other elements
                this.fireBasicProjectile(origin, target, primaryElement, elements);
        }
    }
    
    fireFireProjectile(origin, group) {
        // Check if flame already exists
        if (this.activeFlames[0] && this.activeFlames[0].active) {
            return;
        }
        
        // Create flame attached to wizard
        const flame = this.scene.physics.add.sprite(origin.x, origin.y - 20, 'fire-spell');
        flame.play('fire-spell-anim');
        
        // Scale based on linked charges
        const isDoubleScale = group.length === 2 && group.every(e => e === 'fire');
        if (isDoubleScale) {
            flame.setScale(2);
        }
        
        // Set properties
        flame.element = 'fire';
        flame.damage = COMBAT_CONFIG.fireDamageOverTime / 2; // 0.5 initial damage
        flame.burnDamage = COMBAT_CONFIG.fireDamageOverTime;
        flame.burnDuration = COMBAT_CONFIG.fireBurnDuration;
        flame.linkedCount = group.length;
        flame.isStationary = true;
        flame.followTarget = origin; // Store reference to wizard
        flame.offsetY = -20; // Offset from wizard position
        
        // Set collision size
        const collisionSize = isDoubleScale ? 40 : 20;
        flame.body.setSize(collisionSize, collisionSize);
        
        // Add to projectiles
        this.projectiles.add(flame);
        this.activeFlames[0] = flame;
        
        // Auto-destroy after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            if (flame && flame.active) {
                flame.destroy();
                delete this.activeFlames[0];
            }
        });
    }
    
    fireWaterProjectile(origin, target, group) {
        const angle = Math.atan2(target.y - origin.y, target.x - origin.x);
        
        // Create water projectile
        const water = this.scene.physics.add.sprite(origin.x, origin.y, 'water-spell');
        water.play('water-spell-anim');
        
        // Set velocity
        const speed = COMBAT_CONFIG.projectileSpeed;
        water.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Set properties
        water.element = 'water';
        water.damage = 1;
        water.slowAmount = 0.5;
        water.slowDuration = 2000;
        
        // Scale for linked charges
        if (group.length > 1) {
            water.setScale(1 + (group.length - 1) * 0.3);
            water.damage = group.length;
        }
        
        this.projectiles.add(water);
        
        // Create water orb on hit
        water.createWaterOrb = true;
    }
    
    fireEarthProjectile(origin, group) {
        // Create earth barrier that follows wizard
        const size = 100 + (group.length - 1) * 30;
        const earthZone = this.scene.add.rectangle(
            origin.x, 
            origin.y, 
            size, 
            size, 
            0x8B4513, 
            0.5
        );
        
        earthZone.setStrokeStyle(3, 0x654321);
        this.scene.physics.add.existing(earthZone, true);
        
        // Properties
        earthZone.element = 'earth';
        earthZone.damage = 0.5;
        earthZone.pushForce = 200;
        earthZone.duration = 5000 + (group.length - 1) * 2000;
        earthZone.followTarget = origin; // Follow the wizard
        earthZone.size = size;
        
        this.earthZones.push(earthZone);
        
        // Auto-destroy
        this.scene.time.delayedCall(earthZone.duration, () => {
            earthZone.destroy();
            const index = this.earthZones.indexOf(earthZone);
            if (index > -1) {
                this.earthZones.splice(index, 1);
            }
        });
    }
    
    fireAirProjectile(origin, group) {
        // Create air burst effect
        const radius = 150 + (group.length - 1) * 50;
        
        // Visual effect
        const airBurst = this.scene.add.circle(origin.x, origin.y, radius, 0xaaaaff, 0.3);
        airBurst.setDepth(5);
        
        this.scene.tweens.add({
            targets: airBurst,
            scale: { from: 0, to: 1 },
            alpha: { from: 0.5, to: 0 },
            duration: 500,
            onComplete: () => airBurst.destroy()
        });
        
        // Apply knockback to nearby enemies
        const enemies = this.scene.enemyManager?.getAllEnemies() || [];
        const radiusSquared = radius * radius;
        
        enemies.forEach(enemy => {
            if (!enemy.active) return;
            
            const dx = enemy.x - origin.x;
            const dy = enemy.y - origin.y;
            const distSquared = dx * dx + dy * dy;
            
            if (distSquared < radiusSquared) {
                const dist = Math.sqrt(distSquared);
                const force = (1 - dist / radius) * 500 * group.length;
                
                enemy.setVelocity(
                    (dx / dist) * force,
                    (dy / dist) * force
                );
                
                // Small damage
                this.scene.events.emit('enemyDamaged', {
                    enemy: enemy,
                    damage: 0.5 * group.length,
                    element: 'air'
                });
            }
        });
    }
    
    fireArcaneProjectile(origin, target, group) {
        const angle = Math.atan2(target.y - origin.y, target.x - origin.x);
        
        // Create arcane projectile
        const projectile = this.scene.physics.add.sprite(origin.x, origin.y, 'arcane-spell');
        projectile.play('arcane-spell-anim');
        projectile.setScale(0.5);
        
        // Set velocity
        const speed = COMBAT_CONFIG.projectileSpeed * 1.2;
        projectile.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Set properties
        projectile.element = 'arcane';
        projectile.damage = 1;
        
        // Linked charges make it explosive
        if (group.length >= 2) {
            projectile.isExplosive = true;
            projectile.setScale(0.8);
            projectile.damage = 2;
        }
        
        this.projectiles.add(projectile);
    }
    
    fireRockProjectile(origin, target, group) {
        const angle = Math.atan2(target.y - origin.y, target.x - origin.x);
        
        // Create rock projectile (using earth sprite)
        const rock = this.scene.physics.add.sprite(origin.x, origin.y, 'earth-spell');
        rock.setTint(0x8B7355);
        rock.setScale(0.8 + group.length * 0.2);
        
        // Slower projectile
        const speed = COMBAT_CONFIG.projectileSpeed * 0.7;
        rock.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Properties
        rock.element = 'rock';
        rock.damage = 1.5 * group.length;
        rock.stunDuration = 500 + (group.length - 1) * 500;
        
        this.projectiles.add(rock);
    }
    
    firePoisonProjectile(origin, target, group) {
        console.log('[ProjectileManager] firePoisonProjectile called!');
        // Calculate position to place poison field (at target location)
        const poison = this.scene.physics.add.sprite(target.x, target.y, 'poison-spell');
        console.log('[ProjectileManager] Poison sprite created:', poison);
        
        // Stay on first frame and don't play animation
        poison.setFrame(0);
        console.log('[ProjectileManager] Set to frame 0');
        
        // Set as stationary (no velocity)
        poison.setVelocity(0, 0);
        
        // Properties
        poison.element = 'poison';
        poison.isPoisonField = true;
        poison.isStationary = true; // Mark as stationary so it won't be destroyed on hit
        poison.damage = 0; // No initial damage, only poison effect
        poison.poisonDamage = 1; // 1 damage every 2 seconds
        poison.group = group; // Store group for potential scaling
        poison.hitEnemies = new Set(); // Track enemies already poisoned by this field
        
        // Add to projectiles for collision detection
        this.projectiles.add(poison);
        
        // Remove after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            poison.destroy();
        });
    }
    
    fireLightningProjectile(origin, target, group) {
        const angle = Math.atan2(target.y - origin.y, target.x - origin.x);
        
        // Create lightning bolt
        const lightning = this.scene.add.rectangle(origin.x, origin.y, 30, 5, 0xffff44);
        lightning.rotation = angle;
        
        this.scene.physics.add.existing(lightning);
        const body = lightning.body;
        
        // Fast projectile
        const speed = COMBAT_CONFIG.projectileSpeed * 2;
        body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Properties
        lightning.element = 'lightning';
        lightning.damage = 1;
        lightning.chainCount = group.length;
        lightning.hitEnemies = [];
        
        // Visual effect
        this.scene.tweens.add({
            targets: lightning,
            alpha: { from: 1, to: 0.5 },
            yoyo: true,
            duration: 50,
            repeat: -1
        });
        
        this.projectiles.add(lightning);
    }
    
    fireIceProjectile(origin, target, group) {
        const angle = Math.atan2(target.y - origin.y, target.x - origin.x);
        
        // Create ice shard
        const ice = this.scene.physics.add.sprite(origin.x, origin.y, 'water-spell');
        ice.setTint(0xaaffff);
        ice.setScale(0.8);
        
        // Set velocity
        const speed = COMBAT_CONFIG.projectileSpeed * 0.9;
        ice.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Properties
        ice.element = 'ice';
        ice.damage = 1;
        ice.freezeDuration = 1000 + (group.length - 1) * 500;
        
        // Multi-shot for linked charges
        if (group.length > 1) {
            const spreadAngle = 0.2;
            for (let i = 1; i < Math.min(group.length, 3); i++) {
                const extraIce = this.scene.physics.add.sprite(origin.x, origin.y, 'water-spell');
                extraIce.setTint(0xaaffff);
                extraIce.setScale(0.6);
                
                const newAngle = angle + (i % 2 === 0 ? spreadAngle : -spreadAngle) * Math.ceil(i / 2);
                extraIce.setVelocity(
                    Math.cos(newAngle) * speed,
                    Math.sin(newAngle) * speed
                );
                
                extraIce.element = 'ice';
                extraIce.damage = 0.5;
                extraIce.freezeDuration = ice.freezeDuration;
                
                this.projectiles.add(extraIce);
            }
        }
        
        this.projectiles.add(ice);
    }
    
    fireBasicProjectile(origin, target, element, group) {
        const angle = Math.atan2(target.y - origin.y, target.x - origin.x);
        const config = ELEMENT_CONFIG[element];
        
        // Create projectile using element color
        const projectile = this.scene.add.circle(origin.x, origin.y, 5, 
            parseInt(config.color.replace('#', '0x')));
        
        this.scene.physics.add.existing(projectile);
        
        // Set velocity
        const speed = COMBAT_CONFIG.projectileSpeed;
        projectile.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Properties
        projectile.element = element;
        projectile.damage = group.length;
        
        this.projectiles.add(projectile);
    }
    
    createExplosion(x, y, radius = 100) {
        // Visual effect
        const explosion = this.scene.add.circle(x, y, radius, 0xff6600, 0.8);
        explosion.setDepth(10);
        
        this.scene.tweens.add({
            targets: explosion,
            scale: { from: 0, to: 1 },
            alpha: { from: 1, to: 0 },
            duration: 300,
            onComplete: () => explosion.destroy()
        });
        
        // Damage nearby enemies
        const enemies = this.scene.enemyManager?.getAllEnemies() || [];
        const radiusSquared = radius * radius;
        
        enemies.forEach(enemy => {
            if (!enemy.active) return;
            
            const dx = enemy.x - x;
            const dy = enemy.y - y;
            const distSquared = dx * dx + dy * dy;
            
            if (distSquared < radiusSquared) {
                const damage = COMBAT_CONFIG.explosiveDamage;
                
                // Knockback
                const dist = Math.sqrt(distSquared);
                const force = COMBAT_CONFIG.explosiveKnockback;
                enemy.setVelocity(
                    (dx / dist) * force,
                    (dy / dist) * force
                );
                
                this.scene.events.emit('enemyDamaged', {
                    enemy: enemy,
                    damage: damage,
                    element: 'explosive'
                });
            }
        });
    }
    
    createFirePool(x, y, linkedCount = 1) {
        const radius = 40 + (linkedCount - 1) * 20;
        
        const firePool = this.scene.add.circle(x, y, radius, 0xff4400, 0.5);
        firePool.setDepth(1);
        
        this.scene.physics.add.existing(firePool, true);
        
        // Properties
        firePool.damage = COMBAT_CONFIG.fireDamageOverTime;
        firePool.damageInterval = 500;
        firePool.lastDamageTime = 0;
        firePool.duration = 3000;
        
        this.firePools.push(firePool);
        
        // Auto-destroy and explode
        this.scene.time.delayedCall(firePool.duration, () => {
            this.createExplosion(firePool.x, firePool.y, radius);
            firePool.destroy();
            
            const index = this.firePools.indexOf(firePool);
            if (index > -1) {
                this.firePools.splice(index, 1);
            }
        });
    }
    
    createWaterOrb(x, y) {
        const orb = this.scene.physics.add.sprite(x, y, 'water-spell');
        orb.setScale(0.5);
        orb.setTint(0x4444ff);
        orb.play('water-spell-anim');
        
        // Float animation
        this.scene.tweens.add({
            targets: orb,
            y: y - 20,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Properties
        orb.healAmount = 1;
        orb.isPickup = true;
        
        this.waterOrbs.push(orb);
        
        // Auto-destroy after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            orb.destroy();
            const index = this.waterOrbs.indexOf(orb);
            if (index > -1) {
                this.waterOrbs.splice(index, 1);
            }
        });
    }
    
    update(time, delta) {
        // Update projectiles
        this.projectiles.children.entries.forEach(projectile => {
            // Update position for projectiles that follow targets
            if (projectile.followTarget && projectile.followTarget.active) {
                projectile.x = projectile.followTarget.x;
                projectile.y = projectile.followTarget.y + (projectile.offsetY || 0);
            }
            
            // Remove if out of bounds (but not stationary projectiles)
            if (!projectile.isStationary) {
                const bounds = this.scene.physics.world.bounds;
                if (projectile.x < -50 || projectile.x > bounds.width + 50 ||
                    projectile.y < -50 || projectile.y > bounds.height + 50) {
                    projectile.destroy();
                }
            }
        });
        
        // Update fire pools
        this.updateFirePools(time);
        
        // Update earth zones
        this.updateEarthZones(time);
    }
    
    updateFirePools(time) {
        const enemies = this.scene.enemyManager?.getAllEnemies() || [];
        
        this.firePools.forEach(pool => {
            if (time - pool.lastDamageTime > pool.damageInterval) {
                enemies.forEach(enemy => {
                    if (!enemy.active) return;
                    
                    const dist = Phaser.Math.Distance.Between(
                        pool.x, pool.y, enemy.x, enemy.y
                    );
                    
                    if (dist < pool.radius) {
                        this.scene.events.emit('enemyDamaged', {
                            enemy: enemy,
                            damage: pool.damage,
                            element: 'fire'
                        });
                    }
                });
                
                pool.lastDamageTime = time;
            }
        });
    }
    
    updateEarthZones(time) {
        const enemies = this.scene.enemyManager?.getAllEnemies() || [];
        
        this.earthZones.forEach(zone => {
            // Update position if following target
            if (zone.followTarget && zone.followTarget.active) {
                zone.x = zone.followTarget.x;
                zone.y = zone.followTarget.y;
                // Update physics body position
                if (zone.body) {
                    zone.body.x = zone.x - zone.size / 2;
                    zone.body.y = zone.y - zone.size / 2;
                }
            }
            
            enemies.forEach(enemy => {
                if (!enemy.active || enemy.noStagger) return;
                
                if (Phaser.Geom.Rectangle.Contains(zone.getBounds(), enemy.x, enemy.y)) {
                    // Push enemy away
                    const angle = Math.atan2(
                        enemy.y - zone.y,
                        enemy.x - zone.x
                    );
                    
                    enemy.setVelocity(
                        Math.cos(angle) * zone.pushForce,
                        Math.sin(angle) * zone.pushForce
                    );
                    
                    // Small damage
                    this.scene.events.emit('enemyDamaged', {
                        enemy: enemy,
                        damage: zone.damage,
                        element: 'earth'
                    });
                }
            });
        });
    }
    
    handleProjectileHit(projectile, enemy) {
        console.log('[ProjectileManager] handleProjectileHit:', { element: projectile.element, isPoisonField: projectile.isPoisonField });
        // Handle poison field specially
        if (projectile.isPoisonField) {
            // Check if this enemy was already poisoned by this field
            if (projectile.hitEnemies.has(enemy)) {
                return;
            }
            
            // Mark enemy as hit by this field
            projectile.hitEnemies.add(enemy);
            
            // Apply poison effect (no initial damage)
            if (!enemy.poisoned) {
                this.applyPoisonUntilDeath(enemy, projectile.poisonDamage);
            }
            return; // Don't destroy the field
        }
        
        // Calculate damage
        const baseDamage = projectile.isExplosive ? 
            COMBAT_CONFIG.explosiveDamage : COMBAT_CONFIG.baseDamage;
        const damage = baseDamage * (projectile.damage || 1);
        
        // Emit damage event (let DamageSystem handle the actual damage application)
        this.scene.events.emit('enemyDamaged', {
            enemy: enemy,
            damage: damage,
            element: projectile.element,
            projectile: projectile
        });
        
        // Apply element effects
        this.applyElementEffect(projectile, enemy);
        
        // Handle special projectile behaviors
        if (projectile.isExplosive) {
            this.createExplosion(projectile.x, projectile.y);
        }
        
        if (projectile.createFirePool) {
            this.createFirePool(projectile.x, projectile.y, projectile.linkedCount || 1);
        }
        
        if (projectile.createWaterOrb && Math.random() < 0.3) {
            this.createWaterOrb(enemy.x, enemy.y);
        }
        
        // Handle chain lightning
        if (projectile.chainCount && projectile.chainCount > 0) {
            this.handleChainLightning(projectile, enemy);
            return; // Don't destroy yet
        }
        
        // Destroy projectile (unless it's stationary or piercing)
        if (!projectile.isStationary && !projectile.isPiercing) {
            projectile.destroy();
        }
    }
    
    applyElementEffect(projectile, enemy) {
        switch (projectile.element) {
            case 'fire':
                if (projectile.burnDamage && !enemy.burning) {
                    this.applyBurn(enemy, projectile.burnDamage, projectile.burnDuration);
                }
                break;
                
            case 'water':
                if (projectile.slowAmount && !enemy.slowed) {
                    this.applySlow(enemy, projectile.slowAmount, projectile.slowDuration);
                }
                break;
                
            case 'ice':
                if (projectile.freezeDuration && !enemy.frozen) {
                    this.applyFreeze(enemy, projectile.freezeDuration);
                }
                break;
                
            case 'rock':
                if (projectile.stunDuration && !enemy.stunned) {
                    this.applyStun(enemy, projectile.stunDuration);
                }
                break;
                
            case 'poison':
                if (projectile.poisonDamage && !enemy.poisoned) {
                    this.applyPoison(enemy, projectile.poisonDamage, 
                        projectile.poisonDuration, projectile.poisonTicks);
                }
                break;
        }
    }
    
    applyBurn(enemy, damage, duration) {
        enemy.burning = true;
        enemy.setTint(0xff6600);
        
        this.scene.time.delayedCall(duration, () => {
            if (enemy && enemy.active) {
                enemy.burning = false;
                enemy.clearTint();
                
                this.scene.events.emit('enemyDamaged', {
                    enemy: enemy,
                    damage: damage,
                    element: 'fire',
                    isDot: true
                });
            }
        });
    }
    
    applySlow(enemy, amount, duration) {
        enemy.slowed = true;
        const originalSpeed = enemy.moveSpeed;
        enemy.moveSpeed *= amount;
        enemy.setTint(0x6666ff);
        
        this.scene.time.delayedCall(duration, () => {
            if (enemy && enemy.active) {
                enemy.slowed = false;
                enemy.moveSpeed = originalSpeed;
                enemy.clearTint();
            }
        });
    }
    
    applyFreeze(enemy, duration) {
        enemy.frozen = true;
        enemy.stunned = true; // Also stuns
        enemy.setTint(0xaaffff);
        
        // Stop animation
        if (enemy.anims) {
            enemy.anims.pause();
        }
        
        this.scene.time.delayedCall(duration, () => {
            if (enemy && enemy.active) {
                enemy.frozen = false;
                enemy.stunned = false;
                enemy.clearTint();
                if (enemy.anims) {
                    enemy.anims.resume();
                }
            }
        });
    }
    
    applyStun(enemy, duration) {
        enemy.stunned = true;
        enemy.setTint(0x666666);
        
        this.scene.time.delayedCall(duration, () => {
            if (enemy && enemy.active) {
                enemy.stunned = false;
                enemy.clearTint();
            }
        });
    }
    
    applyPoison(enemy, totalDamage, duration, ticks) {
        enemy.poisoned = true;
        enemy.setTint(0x00ff00);
        
        const damagePerTick = totalDamage / ticks;
        const tickInterval = duration / ticks;
        
        for (let i = 1; i <= ticks; i++) {
            this.scene.time.delayedCall(tickInterval * i, () => {
                if (enemy && enemy.active) {
                    this.scene.events.emit('enemyDamaged', {
                        enemy: enemy,
                        damage: damagePerTick,
                        element: 'poison',
                        isDot: true
                    });
                    
                    if (i === ticks) {
                        enemy.poisoned = false;
                        enemy.clearTint();
                    }
                }
            });
        }
    }
    
    applyPoisonUntilDeath(enemy, damagePerTick) {
        enemy.poisoned = true;
        enemy.setTint(0x00ff00);
        
        // Apply damage every 2 seconds until enemy dies
        const poisonTimer = this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                if (enemy && enemy.active) {
                    this.scene.events.emit('enemyDamaged', {
                        enemy: enemy,
                        damage: damagePerTick,
                        element: 'poison',
                        isDot: true
                    });
                    
                    // DamageSystem will handle death checking
                }
                } else {
                    // Enemy no longer exists, stop poison
                    poisonTimer.remove();
                }
            },
            loop: true
        });
        
        // Store timer reference on enemy for cleanup
        enemy.poisonTimer = poisonTimer;
    }
    
    handleChainLightning(projectile, hitEnemy) {
        projectile.hitEnemies.push(hitEnemy);
        
        // Find next target
        const enemies = this.scene.enemyManager?.getAllEnemies() || [];
        let nearestEnemy = null;
        let minDistance = 200;
        
        enemies.forEach(enemy => {
            if (enemy.active && !projectile.hitEnemies.includes(enemy)) {
                const dist = Phaser.Math.Distance.Between(
                    hitEnemy.x, hitEnemy.y, enemy.x, enemy.y
                );
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestEnemy = enemy;
                }
            }
        });
        
        if (nearestEnemy) {
            // Redirect projectile
            projectile.chainCount--;
            const angle = Math.atan2(
                nearestEnemy.y - projectile.y,
                nearestEnemy.x - projectile.x
            );
            const speed = COMBAT_CONFIG.projectileSpeed * 2;
            projectile.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Visual chain effect
            const chain = this.scene.add.line(
                0, 0,
                hitEnemy.x, hitEnemy.y,
                nearestEnemy.x, nearestEnemy.y,
                0xffff44, 0.8
            );
            chain.setLineWidth(3);
            
            this.scene.tweens.add({
                targets: chain,
                alpha: 0,
                duration: 200,
                onComplete: () => chain.destroy()
            });
        } else {
            // No more targets
            projectile.destroy();
        }
    }
    
    clearAll() {
        this.projectiles.clear(true, true);
        
        // Clear special projectiles
        Object.values(this.activeFlames).forEach(flame => flame.destroy());
        this.activeFlames = {};
        
        this.waterOrbs.forEach(orb => orb.destroy());
        this.waterOrbs = [];
        
        this.earthZones.forEach(zone => zone.destroy());
        this.earthZones = [];
        
        this.firePools.forEach(pool => pool.destroy());
        this.firePools = [];
    }
}