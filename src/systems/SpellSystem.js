import { spellRegistry } from './SpellRegistry.js';

export class SpellSystem {
    constructor(scene) {
        this.scene = scene;
        this.registry = spellRegistry;
        
        // Migrate existing spell tracking
        this.discoveredSpells = scene.discoveredSpells || [];
        
        // Sync with registry
        this.discoveredSpells.forEach(spell => {
            this.registry.discoverSpell(spell.combo, spell.name);
        });
    }

    // Main spell casting method - maintains exact parity with original
    castSpell(wizard) {
        const charges = wizard.charges || this.scene.charges;
        const spellCombo = charges.join('-');
        
        // Check for registered special spell
        const specialSpell = this.registry.getSpell(spellCombo);
        
        if (specialSpell) {
            // Call the original handler method on the scene
            if (this.scene[specialSpell.handler]) {
                this.scene[specialSpell.handler]();
                this.discoverSpell(spellCombo, specialSpell.name);
            }
        } else {
            // Fire standard projectile
            this.fireProjectile(wizard);
        }
    }

    // Fire standard projectile with proper animations
    fireProjectile(wizard) {
        const charges = wizard.charges || this.scene.charges;
        const props = this.registry.calculateProjectileProperties(charges);
        
        // Check if we should use sprite animation or generated texture
        let projectile;
        const hasAnimation = this.scene.anims.exists(props.animation);
        
        if (hasAnimation && props.sprite && this.scene.textures.exists(props.sprite)) {
            // Use sprite animation (maintaining parity)
            projectile = this.scene.physics.add.sprite(wizard.x, wizard.y, props.sprite);
            projectile.play(props.animation);
            projectile.setScale(props.scale);
        } else {
            // Fallback to generated texture (original behavior)
            const textureKey = props.element + '-proj-' + props.chargeCount;
            if (!this.scene.textures.exists(textureKey)) {
                this.generateProjectileTexture(textureKey, props);
            }
            projectile = this.scene.physics.add.sprite(wizard.x, wizard.y, textureKey);
        }

        // Set projectile properties (maintaining exact parity)
        projectile.element = props.element;
        projectile.power = props.chargeCount;
        projectile.damage = props.damage;
        projectile.isPureElement = props.isPure;
        projectile.body.setCollideWorldBounds(false);
        projectile.setDepth(5);

        // Add to projectiles group
        this.scene.projectiles.add(projectile);

        // Set velocity based on wizard direction
        const speed = props.speed * (this.scene.speedMultiplier || 1);
        const diagonalSpeed = speed / Math.sqrt(2);
        
        const directions = {
            up: { x: 0, y: -speed },
            down: { x: 0, y: speed },
            left: { x: -speed, y: 0 },
            right: { x: speed, y: 0 },
            'up-left': { x: -diagonalSpeed, y: -diagonalSpeed },
            'up-right': { x: diagonalSpeed, y: -diagonalSpeed },
            'down-left': { x: -diagonalSpeed, y: diagonalSpeed },
            'down-right': { x: diagonalSpeed, y: diagonalSpeed }
        };

        const dir = directions[wizard.lastDirection || 'down'];
        projectile.setVelocity(dir.x, dir.y);

        // Add particle trail for pure element projectiles (maintaining parity)
        if (projectile.isPureElement) {
            this.addPureElementTrail(projectile, props);
        }

        // Apply special effects if any
        if (props.effect) {
            projectile.specialEffect = props.effect;
        }

        return projectile;
    }

    // Generate texture for projectiles without sprites (maintaining parity)
    generateProjectileTexture(textureKey, props) {
        const size = 6 + (props.chargeCount - 1) * 3;
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(props.color, 1);
        graphics.fillCircle(size, size, size);
        graphics.generateTexture(textureKey, size * 2, size * 2);
        graphics.destroy();
    }

    // Add particle trail effect (maintaining parity)
    addPureElementTrail(projectile, props) {
        this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                if (projectile.active) {
                    const particle = this.scene.add.circle(
                        projectile.x, 
                        projectile.y, 
                        3, 
                        props.color, 
                        0.5
                    );
                    particle.setDepth(4);
                    this.scene.tweens.add({
                        targets: particle,
                        scale: 0,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => particle.destroy()
                    });
                }
            },
            loop: true
        });
    }

    // Special spell implementations (wrappers for original methods)
    fireExplodingProjectile() {
        // Calls original scene method
        if (this.scene.fireExplodingProjectile) {
            this.scene.fireExplodingProjectile();
        }
    }

    fireShotgunBlast() {
        // Calls original scene method
        if (this.scene.fireShotgunBlast) {
            this.scene.fireShotgunBlast();
        }
    }

    fireMagnetizingOrb() {
        // Calls original scene method
        if (this.scene.fireMagnetizingOrb) {
            this.scene.fireMagnetizingOrb();
        }
    }

    createOrbitingOrbs() {
        // Calls original scene method
        if (this.scene.createOrbitingOrbs) {
            this.scene.createOrbitingOrbs();
        }
    }

    // Discover spell (maintaining parity)
    discoverSpell(combo, name) {
        const isNew = this.registry.discoverSpell(combo, name);
        if (isNew) {
            // Update scene's discovered spells
            if (!this.scene.discoveredSpells) {
                this.scene.discoveredSpells = [];
            }
            this.scene.discoveredSpells.push({ combo, name });
            
            // Update spellbook if it exists
            if (this.scene.updateSpellbookText) {
                this.scene.updateSpellbookText();
            }
        }
    }

    // Get element config for other systems
    getElementConfig(element) {
        return this.registry.getElementConfig(element);
    }

    // Check for fusion
    checkFusion(elements) {
        return this.registry.checkFusion(elements);
    }

    // Enhanced fire methods for individual elements (maintaining parity)
    fireElementProjectile(element, wizard) {
        const config = this.registry.getElementConfig(element);
        
        // Check which implementation to use based on element
        switch(element) {
            case 'fire':
                if (this.scene.fireFlamethrower) {
                    this.scene.fireFlamethrower();
                    return;
                }
                break;
            case 'water':
                if (this.scene.fireWaterStream) {
                    this.scene.fireWaterStream();
                    return;
                }
                break;
            case 'lightning':
                if (this.scene.fireLightningOrb) {
                    this.scene.fireLightningOrb();
                    return;
                }
                break;
            case 'earth':
                if (this.scene.fireEarthProjectile) {
                    this.scene.fireEarthProjectile();
                    return;
                }
                break;
        }

        // Fallback to standard projectile
        const tempCharges = wizard.charges;
        wizard.charges = [element];
        this.fireProjectile(wizard);
        wizard.charges = tempCharges;
    }
}