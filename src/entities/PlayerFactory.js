import { CHARACTER_CONFIG } from '../data/CharacterConfig.js';

export class PlayerFactory {
    static createPlayer(scene, x, y, characterKey, isP2 = false) {
        const config = CHARACTER_CONFIG[characterKey];
        if (!config) {
            console.error(`Unknown character key: ${characterKey}`);
            characterKey = 'wizard';
        }
        
        // Create player sprite based on character type
        let player;
        
        switch (characterKey) {
            case 'orb':
                player = scene.physics.add.sprite(x, y, config.sprites.idle);
                this.setupOrbAnimations(scene, config, isP2);
                player.play('orb-idle');
                break;
                
            case 'grim':
                player = scene.physics.add.sprite(x, y, config.sprites.idle);
                this.setupGrimAnimations(scene, config, isP2);
                player.play('grim-idle');
                break;
                
            case 'wizard':
            default:
                const spriteKey = isP2 ? config.sprites.idleP2 : config.sprites.idle;
                player = scene.physics.add.sprite(x, y, spriteKey);
                this.setupWizardAnimations(scene, config, isP2);
                player.play(isP2 ? 'wizard-idle-loop-p2' : 'wizard-idle-loop');
                break;
        }
        
        // Set common properties
        player.characterKey = characterKey;
        player.isP2 = isP2;
        player.setDepth(50);
        player.setCollideWorldBounds(true);
        
        // Apply physics configuration
        player.body.setSize(config.physics.bodySize.width, config.physics.bodySize.height);
        player.body.setOffset(config.physics.bodyOffset.x, config.physics.bodyOffset.y);
        
        // Add character stats
        player.stats = {
            baseSpeed: config.stats.baseSpeed,
            baseHealth: config.stats.baseHealth,
            health: config.stats.baseHealth,
            maxHealth: config.stats.baseHealth
        };
        
        return player;
    }
    
    static setupWizardAnimations(scene, config, isP2) {
        const suffix = isP2 ? '-p2' : '';
        
        // Check if animations already exist
        if (scene.anims.exists(`wizard-idle-full${suffix}`)) return;
        
        // Idle animation
        scene.anims.create({
            key: `wizard-idle-full${suffix}`,
            frames: scene.anims.generateFrameNumbers(isP2 ? config.sprites.idleP2 : config.sprites.idle, 
                config.animations.idle.idleFullFrames),
            frameRate: 10,
            repeat: 0
        });
        
        scene.anims.create({
            key: `wizard-idle-loop${suffix}`,
            frames: scene.anims.generateFrameNumbers(isP2 ? config.sprites.idleP2 : config.sprites.idle, 
                config.animations.idle.idleLoopFrames),
            frameRate: 6,
            repeat: -1
        });
        
        // Flying animation
        scene.anims.create({
            key: `wizard-fly${suffix}`,
            frames: scene.anims.generateFrameNumbers(isP2 ? config.sprites.flyP2 : config.sprites.fly, 
                config.animations.idle.flyFrames),
            frameRate: 10,
            repeat: -1
        });
        
        // Death animation
        scene.anims.create({
            key: `wizard-death${suffix}`,
            frames: scene.anims.generateFrameNumbers(isP2 ? config.sprites.deathP2 : config.sprites.death, 
                config.animations.idle.deathFrames),
            frameRate: 10,
            repeat: 0
        });
    }
    
    static setupOrbAnimations(scene, config, isP2) {
        // Check if animations already exist
        if (scene.anims.exists('orb-idle')) return;
        
        // Idle animation
        scene.anims.create({
            key: 'orb-idle',
            frames: scene.anims.generateFrameNumbers(config.sprites.idle, 
                config.animations.idle.idleFrames),
            frameRate: 10,
            repeat: -1
        });
        
        // Walk/move animation
        scene.anims.create({
            key: 'orb-walk',
            frames: scene.anims.generateFrameNumbers(config.sprites.walk, 
                config.animations.idle.walkFrames),
            frameRate: 12,
            repeat: -1
        });
        
        // Spawn animation
        scene.anims.create({
            key: 'orb-spawn',
            frames: scene.anims.generateFrameNumbers(config.sprites.spawn, 
                config.animations.idle.spawnFrames),
            frameRate: 10,
            repeat: 0
        });
    }
    
    static setupGrimAnimations(scene, config, isP2) {
        // Check if animations already exist
        if (scene.anims.exists('grim-idle')) return;
        
        // Idle animation
        scene.anims.create({
            key: 'grim-idle',
            frames: scene.anims.generateFrameNumbers(config.sprites.idle, 
                config.animations.idle.idleFrames),
            frameRate: 8,
            repeat: -1
        });
        
        // Walk animation
        scene.anims.create({
            key: 'grim-walk',
            frames: scene.anims.generateFrameNumbers(config.sprites.walk, 
                config.animations.idle.walkFrames),
            frameRate: 10,
            repeat: -1
        });
        
        // Death animation
        scene.anims.create({
            key: 'grim-death',
            frames: scene.anims.generateFrameNumbers(config.sprites.death, 
                config.animations.idle.deathFrames),
            frameRate: 10,
            repeat: 0
        });
        
        // Spawn animation
        scene.anims.create({
            key: 'grim-spawn',
            frames: scene.anims.generateFrameNumbers(config.sprites.spawn, 
                config.animations.idle.spawnFrames),
            frameRate: 10,
            repeat: 0
        });
    }
    
    static updatePlayerAnimation(player, isMoving, moveDirection) {
        const characterKey = player.characterKey;
        const isP2 = player.isP2;
        
        switch (characterKey) {
            case 'orb':
                if (isMoving) {
                    if (player.anims.currentAnim?.key !== 'orb-walk') {
                        player.play('orb-walk');
                    }
                } else {
                    if (player.anims.currentAnim?.key !== 'orb-idle') {
                        player.play('orb-idle');
                    }
                }
                break;
                
            case 'grim':
                if (isMoving) {
                    if (player.anims.currentAnim?.key !== 'grim-walk') {
                        player.play('grim-walk');
                    }
                } else {
                    if (player.anims.currentAnim?.key !== 'grim-idle') {
                        player.play('grim-idle');
                    }
                }
                // Flip sprite based on direction
                if (moveDirection) {
                    player.setFlipX(moveDirection.x < 0);
                }
                break;
                
            case 'wizard':
            default:
                const suffix = isP2 ? '-p2' : '';
                if (isMoving) {
                    if (player.anims.currentAnim?.key !== `wizard-fly${suffix}`) {
                        player.play(`wizard-fly${suffix}`);
                    }
                } else {
                    if (player.anims.currentAnim?.key !== `wizard-idle-loop${suffix}`) {
                        player.play(`wizard-idle-loop${suffix}`);
                    }
                }
                break;
        }
    }
    
    static playDeathAnimation(player) {
        const characterKey = player.characterKey;
        const isP2 = player.isP2;
        
        switch (characterKey) {
            case 'orb':
                // Orb doesn't have a death animation, use fade out
                player.scene.tweens.add({
                    targets: player,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power2'
                });
                break;
                
            case 'grim':
                player.play('grim-death');
                break;
                
            case 'wizard':
            default:
                const suffix = isP2 ? '-p2' : '';
                player.play(`wizard-death${suffix}`);
                break;
        }
    }
}