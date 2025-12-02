/**
 * AnimationRegistry - Centralized animation creation
 *
 * All game animations should be registered here in LoadingScene.
 * This prevents duplicate creation and ensures consistency.
 */

export class AnimationRegistry {
    private static registered = new Set<string>();

    /**
     * Register all animations at once (call in LoadingScene.create())
     */
    static registerAll(scene: Phaser.Scene): void {
        this.registerPlayerAnimations(scene);
        this.registerEnemyAnimations(scene);
        this.registerProjectileAnimations(scene);
        this.registerBossAnimations(scene);
    }

    /**
     * Create animation only if it doesn't exist
     */
    private static create(
        scene: Phaser.Scene,
        key: string,
        config: Phaser.Types.Animations.Animation
    ): void {
        if (scene.anims.exists(key)) return;

        scene.anims.create({ key, ...config });
        this.registered.add(key);
    }

    /**
     * Player animations (Wizard, Orb, Grim, Blip)
     */
    private static registerPlayerAnimations(scene: Phaser.Scene): void {
        // Wizard P1 animations
        this.create(scene, 'wizard-idle-full', {
            frames: scene.anims.generateFrameNumbers('wizard-idle', { start: 0, end: 19 }),
            frameRate: 10,
            repeat: 0
        });

        this.create(scene, 'wizard-idle-loop', {
            frames: scene.anims.generateFrameNumbers('wizard-idle', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });

        this.create(scene, 'wizard-fly', {
            frames: scene.anims.generateFrameNumbers('wizard-fly', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.create(scene, 'wizard-death', {
            frames: scene.anims.generateFrameNumbers('wizard-death', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

        // Wizard P2 animations (if exists)
        if (scene.textures.exists('wizard-idle-p2')) {
            this.create(scene, 'wizard-idle-full-p2', {
                frames: scene.anims.generateFrameNumbers('wizard-idle-p2', { start: 0, end: 19 }),
                frameRate: 10,
                repeat: 0
            });

            this.create(scene, 'wizard-idle-loop-p2', {
                frames: scene.anims.generateFrameNumbers('wizard-idle-p2', { start: 0, end: 5 }),
                frameRate: 6,
                repeat: -1
            });

            this.create(scene, 'wizard-fly-p2', {
                frames: scene.anims.generateFrameNumbers('wizard-fly-p2', { start: 0, end: 1 }),
                frameRate: 10,
                repeat: -1
            });

            this.create(scene, 'wizard-death-p2', {
                frames: scene.anims.generateFrameNumbers('wizard-death-p2', { start: 0, end: 9 }),
                frameRate: 10,
                repeat: 0
            });
        }

        // Orb animations
        if (scene.textures.exists('orb-idle')) {
            this.create(scene, 'orb-idle', {
                frames: scene.anims.generateFrameNumbers('orb-idle', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            this.create(scene, 'orb-walk', {
                frames: scene.anims.generateFrameNumbers('orb-walk', { start: 0, end: 7 }),
                frameRate: 12,
                repeat: -1
            });

            this.create(scene, 'orb-spawn', {
                frames: scene.anims.generateFrameNumbers('orb-spawn', { start: 0, end: 15 }),
                frameRate: 10,
                repeat: 0
            });
        }

        // Grim animations
        if (scene.textures.exists('grim-idle')) {
            this.create(scene, 'grim-idle', {
                frames: scene.anims.generateFrameNumbers('grim-idle', { start: 0, end: 7 }),
                frameRate: 8,
                repeat: -1
            });

            this.create(scene, 'grim-walk', {
                frames: scene.anims.generateFrameNumbers('grim-walk', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

            this.create(scene, 'grim-death', {
                frames: scene.anims.generateFrameNumbers('grim-death', { start: 0, end: 11 }),
                frameRate: 10,
                repeat: 0
            });

            this.create(scene, 'grim-spawn', {
                frames: scene.anims.generateFrameNumbers('grim-spawn', { start: 0, end: 9 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }

    /**
     * Enemy animations
     */
    private static registerEnemyAnimations(scene: Phaser.Scene): void {
        // Tree enemy
        if (scene.textures.exists('enemy-walk')) {
            this.create(scene, 'enemy-walk-anim', {
                frames: scene.anims.generateFrameNumbers('enemy-walk', { start: 0, end: 2 }),
                frameRate: 6,
                repeat: -1
            });
        }

        // Slime animations
        if (scene.textures.exists('slime-idle-0')) {
            this.create(scene, 'slime-idle', {
                frames: [
                    { key: 'slime-idle-0' },
                    { key: 'slime-idle-1' },
                    { key: 'slime-idle-2' },
                    { key: 'slime-idle-3' }
                ],
                frameRate: 6,
                repeat: -1
            });

            this.create(scene, 'slime-die', {
                frames: [
                    { key: 'slime-die-0' },
                    { key: 'slime-die-1' },
                    { key: 'slime-die-2' },
                    { key: 'slime-die-3' }
                ],
                frameRate: 8,
                repeat: 0
            });
        }

        // Golem animations (orange and blue)
        ['orange', 'blue'].forEach(color => {
            if (scene.textures.exists(`golem-${color}-walk`)) {
                this.create(scene, `golem-${color}-walk`, {
                    frames: scene.anims.generateFrameNumbers(`golem-${color}-walk`, { start: 0, end: 17 }),
                    frameRate: 10,
                    repeat: -1
                });

                this.create(scene, `golem-${color}-hurt`, {
                    frames: scene.anims.generateFrameNumbers(`golem-${color}-hurt`, { start: 0, end: 11 }),
                    frameRate: 10,
                    repeat: 0
                });

                this.create(scene, `golem-${color}-die`, {
                    frames: scene.anims.generateFrameNumbers(`golem-${color}-die`, { start: 0, end: 14 }),
                    frameRate: 10,
                    repeat: 0
                });
            }
        });

        // Bat animations
        if (scene.textures.exists('bat-fly-0')) {
            this.create(scene, 'bat-flying', {
                frames: [
                    { key: 'bat-fly-0' },
                    { key: 'bat-fly-1' },
                    { key: 'bat-fly-2' },
                    { key: 'bat-fly-3' },
                    { key: 'bat-fly-4' },
                    { key: 'bat-fly-5' },
                    { key: 'bat-fly-6' }
                ],
                frameRate: 12,
                repeat: -1
            });
        }

        // Mushroom animations
        if (scene.textures.exists('mushroom-walk-0')) {
            this.create(scene, 'mushroom-walking', {
                frames: [
                    { key: 'mushroom-walk-0' },
                    { key: 'mushroom-walk-1' },
                    { key: 'mushroom-walk-2' },
                    { key: 'mushroom-walk-3' },
                    { key: 'mushroom-walk-4' },
                    { key: 'mushroom-walk-5' },
                    { key: 'mushroom-walk-6' },
                    { key: 'mushroom-walk-7' }
                ],
                frameRate: 10,
                repeat: -1
            });
        }

        // Fireworm animations
        if (scene.textures.exists('fireworm-walk-0')) {
            this.create(scene, 'fireworm-walking', {
                frames: [
                    { key: 'fireworm-walk-0' },
                    { key: 'fireworm-walk-1' },
                    { key: 'fireworm-walk-2' },
                    { key: 'fireworm-walk-3' },
                    { key: 'fireworm-walk-4' },
                    { key: 'fireworm-walk-5' },
                    { key: 'fireworm-walk-6' },
                    { key: 'fireworm-walk-7' },
                    { key: 'fireworm-walk-8' }
                ],
                frameRate: 12,
                repeat: -1
            });
        }

        // Summoner animations
        if (scene.textures.exists('summoner-idle')) {
            this.create(scene, 'summoner-idle-anim', {
                frames: scene.anims.generateFrameNumbers('summoner-idle', { start: 0, end: 11 }),
                frameRate: 8,
                repeat: -1
            });

            this.create(scene, 'summoner-cast-anim', {
                frames: scene.anims.generateFrameNumbers('summoner-cast', { start: 0, end: 14 }),
                frameRate: 12,
                repeat: 0
            });
        }

        // Soul animations
        if (scene.textures.exists('soul-idle-0')) {
            const frames = [];
            for (let i = 0; i < 16; i++) {
                frames.push({ key: `soul-idle-${i}` });
            }
            this.create(scene, 'soul-idle', {
                frames: frames,
                frameRate: 10,
                repeat: -1
            });
        }

        // Bloboid animations
        if (scene.textures.exists('bloboid-walk-0')) {
            const frames = [];
            for (let i = 0; i < 8; i++) {
                frames.push({ key: `bloboid-walk-${i}` });
            }
            this.create(scene, 'bloboid-walking', {
                frames: frames,
                frameRate: 8,
                repeat: -1
            });
        }

        // Dark Eye animations
        if (scene.textures.exists('darkeye-walk-1')) {
            const frames = [];
            for (let i = 1; i <= 8; i++) {
                frames.push({ key: `darkeye-walk-${i}` });
            }
            this.create(scene, 'darkeye-walking', {
                frames: frames,
                frameRate: 8,
                repeat: -1
            });
        }
    }

    /**
     * Projectile/spell animations
     */
    private static registerProjectileAnimations(scene: Phaser.Scene): void {
        // Fire spell
        if (scene.textures.exists('fire-spell')) {
            this.create(scene, 'fire-spell-anim', {
                frames: scene.anims.generateFrameNumbers('fire-spell', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Arcane spell
        if (scene.textures.exists('arcane-spell')) {
            this.create(scene, 'arcane-spell-anim', {
                frames: scene.anims.generateFrameNumbers('arcane-spell', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Water spell
        if (scene.textures.exists('water-spell')) {
            this.create(scene, 'water-spell-anim', {
                frames: scene.anims.generateFrameNumbers('water-spell', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        // Earth spell
        if (scene.textures.exists('earth-spell')) {
            this.create(scene, 'earth-spell-anim', {
                frames: scene.anims.generateFrameNumbers('earth-spell', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1
            });
        }
    }

    /**
     * Boss animations
     */
    private static registerBossAnimations(scene: Phaser.Scene): void {
        // Boss-specific animations can be added here
        // For now, most bosses use custom sprite handling
    }

    /**
     * Check if an animation is registered
     */
    static isRegistered(key: string): boolean {
        return this.registered.has(key);
    }

    /**
     * Get count of registered animations
     */
    static getCount(): number {
        return this.registered.size;
    }

    /**
     * Clear the registry (for testing)
     */
    static clear(): void {
        this.registered.clear();
    }
}
