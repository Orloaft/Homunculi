/**
 * Eyelor Boss Asset Configuration
 * Defines sprite sheets, animations, and asset loading for the Eyelor boss
 */

/**
 * Sprite sheet configuration
 */
export interface ISpriteSheetConfig {
    readonly path: string;
    readonly frameWidth: number;
    readonly frameHeight: number;
    readonly frameCount: number;
}

/**
 * Animation frame range
 */
export interface IAnimationFrames {
    readonly start: number;
    readonly end: number;
}

/**
 * Animation configuration
 */
export interface IAnimationConfig {
    readonly key: string;
    readonly frames: IAnimationFrames;
    readonly frameRate: number;
    readonly repeat: number;
}

/**
 * Eyelor boss asset keys
 */
export type EyelorSpriteKey =
    | 'eyelor-attack'
    | 'eyelor-death'
    | 'eyelor-move'
    | 'void-ball-projectile'
    | 'projectile-destroyed';

export type EyelorAnimationKey =
    | 'eyelor-move'
    | 'eyelor-attack'
    | 'eyelor-death'
    | 'void-ball-anim'
    | 'projectile-destroyed-anim';

/**
 * Eyelor boss asset configuration object
 */
export const EyelorAssets = {
    /**
     * Sprite sheet configurations
     */
    spriteSheets: {
        'eyelor-attack': {
            path: 'Eyelor/Attack/Eye Beast Attack',
            frameWidth: 128,
            frameHeight: 128,
            frameCount: 13
        },
        'eyelor-death': {
            path: 'Eyelor/Death/Eye Beast Death',
            frameWidth: 128,
            frameHeight: 128,
            frameCount: 15
        },
        'eyelor-move': {
            path: 'Eyelor/Movement/Eye Beast Moving',
            frameWidth: 128,
            frameHeight: 128,
            frameCount: 13
        },
        'void-ball-projectile': {
            path: 'Eyelor/Void Ball Projectilep/Void Ball Projectile',
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 3
        },
        'projectile-destroyed': {
            path: 'Eyelor/Void Ball Projectilep/Projectile Destroyed',
            frameWidth: 32,
            frameHeight: 32,
            frameCount: 3
        }
    } as const satisfies Record<EyelorSpriteKey, ISpriteSheetConfig>,

    /**
     * Animation configurations
     */
    animations: {
        'eyelor-move': {
            key: 'eyelor-move',
            frames: { start: 0, end: 12 },
            frameRate: 10,
            repeat: -1
        },
        'eyelor-attack': {
            key: 'eyelor-attack',
            frames: { start: 0, end: 12 },
            frameRate: 12,
            repeat: 0
        },
        'eyelor-death': {
            key: 'eyelor-death',
            frames: { start: 0, end: 14 },
            frameRate: 10,
            repeat: 0
        },
        'void-ball-anim': {
            key: 'void-ball-anim',
            frames: { start: 0, end: 2 },
            frameRate: 10,
            repeat: -1
        },
        'projectile-destroyed-anim': {
            key: 'projectile-destroyed-anim',
            frames: { start: 0, end: 2 },
            frameRate: 12,
            repeat: 0
        }
    } as const satisfies Record<EyelorAnimationKey, IAnimationConfig>,

    /**
     * Load all Eyelor assets into a Phaser scene
     * Loads individual frames for all animations
     *
     * @param scene - The Phaser scene to load assets into
     */
    loadAssets(scene: Phaser.Scene): void {
        // Attack frames (1-13)
        for (let i = 1; i <= 13; i++) {
            scene.load.image(`eyelor-attack-${i}`, `Eyelor/Attack/Eye Beast Attack${i}.png`);
        }

        // Death frames (1-15)
        for (let i = 1; i <= 15; i++) {
            scene.load.image(`eyelor-death-${i}`, `Eyelor/Death/Eye Beast Death${i}.png`);
        }

        // Movement frames (1-13)
        for (let i = 1; i <= 13; i++) {
            scene.load.image(`eyelor-move-${i}`, `Eyelor/Movement/Eye Beast Moving${i}.png`);
        }

        // Projectile frames (1-3)
        for (let i = 1; i <= 3; i++) {
            scene.load.image(`void-ball-${i}`, `Eyelor/Void Ball Projectilep/Void Ball Projectile${i}.png`);
            scene.load.image(`projectile-destroyed-${i}`, `Eyelor/Void Ball Projectilep/Projectile Destroyed${i}.png`);
        }
    },

    /**
     * Create all Eyelor animations from loaded frames
     *
     * @param scene - The Phaser scene to create animations in
     */
    createAnimations(scene: Phaser.Scene): void {
        /**
         * Helper to create animation from individual frame images
         */
        const createAnimFromFrames = (
            key: string,
            prefix: string,
            frameCount: number,
            frameRate: number,
            repeat: number = -1
        ): void => {
            const frames: Phaser.Types.Animations.AnimationFrame[] = [];

            for (let i = 1; i <= frameCount; i++) {
                frames.push({ key: `${prefix}-${i}` });
            }

            if (!scene.anims.exists(key)) {
                scene.anims.create({
                    key: key,
                    frames: frames,
                    frameRate: frameRate,
                    repeat: repeat
                });
            }
        };

        // Create all Eyelor animations
        createAnimFromFrames('eyelor-move', 'eyelor-move', 13, 10, -1);
        createAnimFromFrames('eyelor-attack', 'eyelor-attack', 13, 12, 0);
        createAnimFromFrames('eyelor-death', 'eyelor-death', 15, 10, 0);
        createAnimFromFrames('void-ball-anim', 'void-ball', 3, 10, -1);
        createAnimFromFrames('projectile-destroyed-anim', 'projectile-destroyed', 3, 12, 0);
    }
} as const;

export default EyelorAssets;

/**
 * Helper to get sprite sheet config
 */
export function getSpriteSheetConfig(key: EyelorSpriteKey): ISpriteSheetConfig {
    return EyelorAssets.spriteSheets[key];
}

/**
 * Helper to get animation config
 */
export function getAnimationConfig(key: EyelorAnimationKey): IAnimationConfig {
    return EyelorAssets.animations[key];
}

/**
 * Check if an animation key exists
 */
export function hasAnimation(key: string): key is EyelorAnimationKey {
    return key in EyelorAssets.animations;
}

/**
 * Get all animation keys
 */
export function getAllAnimationKeys(): EyelorAnimationKey[] {
    return Object.keys(EyelorAssets.animations) as EyelorAnimationKey[];
}
