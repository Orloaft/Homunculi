export class SpellRegistry {
    constructor() {
        // Define all spell combinations and their handlers
        this.spells = {
            // Special combination spells
            'water-water-lightning': {
                name: 'Shield of Waves',
                handler: 'createOrbitingOrbs',
                description: 'Creates protective water orbs that orbit around you',
                discovered: false
            },
            'fire-lightning-fire': {
                name: 'Explosive Bolt',
                handler: 'fireExplodingProjectile',
                description: 'Fires an explosive projectile that detonates on impact',
                discovered: false
            },
            'water-lightning-water': {
                name: 'Storm Shotgun',
                handler: 'fireShotgunBlast', 
                description: 'Fires a spread of water and lightning projectiles',
                discovered: false
            },
            'lightning-water-earth': {
                name: 'Magnetic Vortex',
                handler: 'fireMagnetizingOrb',
                description: 'Creates a magnetic orb that pulls enemies',
                discovered: false
            }
        };

        // Element configurations for standard projectiles
        this.elementConfig = {
            fire: {
                animation: 'fire-spell-anim',
                sprite: 'fire-spell',
                color: 0xff4444,
                scale: 1.0,
                damage: 1,
                speed: 400
            },
            lightning: {
                animation: 'lightning-spell-anim', 
                sprite: 'lightning-spell',
                color: 0xffff44,
                scale: 1.5,
                damage: 1,
                speed: 450
            },
            water: {
                animation: 'water-spell-anim',
                sprite: 'water-spell', 
                color: 0x4444ff,
                scale: 1.0,
                damage: 1,
                speed: 400
            },
            earth: {
                animation: 'earth-spell-anim',
                sprite: 'earth-spell',
                color: 0x44ff44,
                scale: 1.5,
                damage: 1.5,
                speed: 350
            },
            arcane: {
                animation: 'arcane-spell-anim',
                sprite: 'arcane-spell',
                color: 0xff44ff,
                scale: 1.0,
                damage: 1.2,
                speed: 400
            },
            ice: {
                animation: 'ice-spell-anim',
                sprite: 'ice-spell',
                color: 0x44ffff,
                scale: 1.0,
                damage: 1,
                speed: 350,
                effect: 'freeze'
            }
        };

        // Fusion element configurations
        this.fusionConfig = {
            'lava': {
                elements: ['fire', 'earth'],
                animation: 'volcano-spell-anim',
                sprite: 'volcano-spell',
                color: 0xff6600,
                description: 'Molten projectiles that create burning pools',
                damage: 2,
                speed: 300
            },
            'steam': {
                elements: ['water', 'fire'],
                animation: 'steam-spell-anim',
                sprite: 'wave-spell', // Using wave as placeholder for steam
                color: 0xccccff,
                description: 'Explosive bursts that push enemies back',
                damage: 1.5,
                speed: 400,
                effect: 'knockback'
            },
            'mud': {
                elements: ['water', 'earth'],
                animation: 'mud-spell-anim',
                sprite: 'earth-spell', // Using earth with tint
                color: 0x8b4513,
                description: 'Slows enemies significantly',
                damage: 1,
                speed: 350,
                effect: 'slow'
            },
            'dust': {
                elements: ['earth', 'air'],
                animation: 'dust-spell-anim',
                sprite: 'air-spell-1', // Using air sprite
                color: 0xd2b48c,
                description: 'Blinds and slows enemies in large area',
                damage: 0.8,
                speed: 400,
                effect: 'blind'
            },
            'ice': {
                elements: ['water', 'air'],
                animation: 'ice-spell-anim',
                sprite: 'ice-spell',
                color: 0x44ffff,
                description: 'Freezes enemies solid',
                damage: 1.2,
                speed: 350,
                effect: 'freeze'
            },
            'poison': {
                elements: ['water', 'arcane'],
                animation: 'poison-spell-anim',
                sprite: 'poison-spell',
                color: 0x00ff00,
                description: 'Drops poison mines for continuous damage',
                damage: 0.5,
                speed: 300,
                effect: 'poison'
            },
            'storm': {
                elements: ['lightning', 'air'],
                animation: 'storm-spell-anim',
                sprite: 'storm-spell',
                color: 0x9999ff,
                description: 'Chain lightning between enemies',
                damage: 1.5,
                speed: 500,
                effect: 'chain'
            },
            'smoke': {
                elements: ['fire', 'air'],
                animation: 'smoke-spell-anim',
                sprite: 'fire-spell', // Using fire with alpha
                color: 0x666666,
                description: 'Creates obscuring smoke clouds',
                damage: 0.5,
                speed: 300,
                effect: 'blind'
            }
        };

        this.discoveredSpells = [];
    }

    // Check if a combination is a registered spell
    getSpell(combo) {
        return this.spells[combo] || null;
    }

    // Check for fusion elements
    checkFusion(elements) {
        // Sort elements to check combinations
        const sorted = [...elements].sort();
        const comboKey = sorted.join('-');
        
        // Check each fusion config
        for (const [fusionName, config] of Object.entries(this.fusionConfig)) {
            const fusionElements = [...config.elements].sort();
            if (fusionElements.join('-') === comboKey) {
                return fusionName;
            }
        }
        return null;
    }

    // Get element configuration
    getElementConfig(element) {
        return this.elementConfig[element] || this.elementConfig.fire;
    }

    // Get fusion configuration
    getFusionConfig(fusionName) {
        return this.fusionConfig[fusionName] || null;
    }

    // Discover a spell
    discoverSpell(combo, name) {
        if (!this.discoveredSpells.find(spell => spell.combo === combo)) {
            this.discoveredSpells.push({ combo, name });
            if (this.spells[combo]) {
                this.spells[combo].discovered = true;
            }
            return true; // New discovery
        }
        return false; // Already discovered
    }

    // Get all discovered spells
    getDiscoveredSpells() {
        return this.discoveredSpells;
    }

    // Check if spell is discovered
    isDiscovered(combo) {
        return this.spells[combo]?.discovered || false;
    }

    // Get dominant element from charge array
    getDominantElement(charges) {
        const elementCounts = {};
        charges.forEach(charge => {
            elementCounts[charge] = (elementCounts[charge] || 0) + 1;
        });

        let dominantElement = 'fire';
        let maxCount = 0;
        
        Object.keys(elementCounts).forEach(element => {
            if (elementCounts[element] > maxCount) {
                maxCount = elementCounts[element];
                dominantElement = element;
            }
        });

        return {
            element: dominantElement,
            count: maxCount,
            isPure: maxCount === charges.length && charges.length > 1,
            elementCounts
        };
    }

    // Calculate projectile properties based on charges
    calculateProjectileProperties(charges) {
        const dominant = this.getDominantElement(charges);
        const config = this.getElementConfig(dominant.element);
        const chargeCount = charges.length;
        
        // Check for fusion first
        const fusion = this.checkFusion(charges);
        if (fusion) {
            const fusionConfig = this.getFusionConfig(fusion);
            return {
                ...fusionConfig,
                chargeCount,
                isFusion: true,
                fusionType: fusion
            };
        }
        
        // Calculate scaled properties
        const baseSpeed = config.speed;
        const speed = baseSpeed - (chargeCount - 1) * 50; // Slower with more charges
        const damage = config.damage * chargeCount; // Damage scales with charges
        const scale = config.scale + (chargeCount - 1) * 0.1; // Slightly larger with more charges
        
        return {
            element: dominant.element,
            isPure: dominant.isPure,
            animation: config.animation,
            sprite: config.sprite,
            color: config.color,
            scale,
            damage,
            speed,
            chargeCount,
            effect: config.effect
        };
    }
}

// Export singleton instance
export const spellRegistry = new SpellRegistry();