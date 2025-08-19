import { COMBAT_CONFIG } from '../../data/GameConstants.js';

export class DamageSystem {
    constructor(scene) {
        this.scene = scene;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Listen for damage events
        this.scene.events.on('enemyDamaged', (data) => {
            this.handleEnemyDamage(data.enemy, data.damage, data.element, data.isDot);
        });
        
        // Listen for projectile hits
        this.scene.events.on('projectileHit', (data) => {
            this.handleProjectileHit(data.projectile, data.enemy);
        });
    }
    
    handleEnemyDamage(enemy, damage, element, isDot = false) {
        if (!enemy || !enemy.active || enemy.isDying) return;
        
        // Apply elemental resistances/weaknesses
        const finalDamage = this.calculateElementalDamage(damage, element, enemy);
        
        // Apply damage
        enemy.health -= finalDamage;
        
        // Show damage number
        this.showDamageNumber(enemy.x, enemy.y - 20, finalDamage, element, isDot);
        
        // Visual feedback
        if (!isDot) {
            this.applyHitEffect(enemy, element);
        }
        
        // Play hurt animation if applicable
        if (enemy.enemyType === 'golem' && enemy.health > 0 && !enemy.isDying) {
            this.playGolemHurtAnimation(enemy);
        }
        
        // Track damage dealt
        this.scene.playerStats?.recordDamageDealt(finalDamage);
        
        // Check for death
        if (enemy.health <= 0) {
            this.handleEnemyDeath(enemy);
        }
    }
    
    calculateElementalDamage(baseDamage, attackElement, enemy) {
        let multiplier = 1;
        
        // Elemental interactions
        if (attackElement && enemy.element) {
            // Fire vs Ice: 2x damage
            if (attackElement === 'fire' && enemy.element === 'ice') {
                multiplier = 2;
            }
            // Ice vs Fire: 2x damage
            else if (attackElement === 'ice' && enemy.element === 'fire') {
                multiplier = 2;
            }
            // Water vs Fire: 1.5x damage
            else if (attackElement === 'water' && enemy.element === 'fire') {
                multiplier = 1.5;
            }
            // Earth vs Lightning: 0.5x damage (resistance)
            else if (attackElement === 'earth' && enemy.element === 'lightning') {
                multiplier = 0.5;
            }
            // Light vs Dark: 2x damage
            else if (attackElement === 'light' && enemy.element === 'dark') {
                multiplier = 2;
            }
            // Dark vs Light: 2x damage
            else if (attackElement === 'dark' && enemy.element === 'light') {
                multiplier = 2;
            }
        }
        
        // Apply vulnerability multiplier (e.g., boss takes 200% damage during laser attack)
        if (enemy.vulnerabilityMultiplier) {
            multiplier *= enemy.vulnerabilityMultiplier;
        }
        
        return baseDamage * multiplier;
    }
    
    applyHitEffect(enemy, element) {
        // Flash color based on element
        let tintColor = 0xff0000; // Default red
        
        const elementColors = {
            fire: 0xff6600,
            water: 0x0066ff,
            earth: 0x663300,
            air: 0xccccff,
            ice: 0x66ffff,
            lightning: 0xffff66,
            poison: 0x00ff00,
            arcane: 0xff00ff,
            light: 0xffffcc,
            dark: 0x660066
        };
        
        if (element && elementColors[element]) {
            tintColor = elementColors[element];
        }
        
        enemy.setTint(tintColor);
        
        // Clear tint after short delay
        this.scene.time.delayedCall(100, () => {
            if (enemy.active && !enemy.burning && !enemy.frozen && 
                !enemy.poisoned && !enemy.stunned) {
                enemy.clearTint();
            }
        });
    }
    
    playGolemHurtAnimation(enemy) {
        const currentAnim = enemy.anims.currentAnim;
        enemy.play(`golem-${enemy.golemColor}-hurt`);
        
        enemy.once('animationcomplete', () => {
            if (enemy.active && !enemy.isDying) {
                enemy.play(`golem-${enemy.golemColor}-walk`);
            }
        });
    }
    
    handleEnemyDeath(enemy) {
        if (enemy.isDying) return;
        
        enemy.isDying = true;
        enemy.setVelocity(0, 0);
        
        // Play death animation if available
        if (enemy.enemyType === 'golem') {
            enemy.play(`golem-${enemy.golemColor}-die`);
            enemy.once('animationcomplete', () => {
                this.completeEnemyDeath(enemy);
            });
        } else if (enemy.enemyType === 'slime') {
            enemy.play('slime-die');
            enemy.once('animationcomplete', () => {
                this.completeEnemyDeath(enemy);
            });
        } else {
            // No death animation, die immediately
            this.completeEnemyDeath(enemy);
        }
    }
    
    completeEnemyDeath(enemy) {
        // Clean up any active poison timer
        if (enemy.poisonTimer) {
            enemy.poisonTimer.remove();
            enemy.poisonTimer = null;
        }
        
        // Emit death event
        this.scene.events.emit('enemyKilled', enemy);
        
        // Destroy enemy
        enemy.destroy();
    }
    
    showDamageNumber(x, y, damage, element, isDot) {
        // Round damage for display
        const displayDamage = Math.round(damage);
        
        // Choose color based on element or damage type
        let color = '#ffff00'; // Default yellow
        
        if (isDot) {
            color = '#ff9900'; // Orange for DoT
        } else if (element) {
            const elementColors = {
                fire: '#ff6600',
                water: '#0099ff',
                earth: '#996633',
                air: '#ccccff',
                ice: '#66ffff',
                lightning: '#ffff66',
                poison: '#00ff00',
                arcane: '#ff00ff',
                light: '#ffffcc',
                dark: '#990099'
            };
            color = elementColors[element] || color;
        }
        
        const damageText = this.scene.add.text(x, y, displayDamage.toString(), {
            fontSize: isDot ? '20px' : '24px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        
        damageText.setOrigin(0.5);
        damageText.setDepth(150);
        
        // Animate
        this.scene.tweens.add({
            targets: damageText,
            y: y - 50,
            alpha: 0,
            scale: isDot ? 0.8 : 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    
    handleProjectileHit(projectile, enemy) {
        // Delegate to projectile manager
        this.scene.projectileManager?.handleProjectileHit(projectile, enemy);
    }
    
    // Apply damage to player
    damagePlayer(amount, source) {
        if (!this.scene.wizard || !this.scene.wizard.active) return;
        
        // Apply damage through player controller
        this.scene.playerController?.takeDamage(amount);
        
        // Visual feedback
        this.scene.wizard.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (this.scene.wizard.active) {
                this.scene.wizard.clearTint();
            }
        });
        
        // Knockback from source
        if (source && source.x !== undefined && source.y !== undefined) {
            const angle = Math.atan2(
                this.scene.wizard.y - source.y,
                this.scene.wizard.x - source.x
            );
            
            const knockback = 300;
            this.scene.wizard.setVelocity(
                Math.cos(angle) * knockback,
                Math.sin(angle) * knockback
            );
        }
    }
}