/**
 * Character (player) definitions and properties
 * Defines all playable characters with sprites, animations, physics, and stats
 */

export type CharacterType = 'wizard' | 'orb' | 'grim';

export interface ICharacterSprites {
    readonly idle: string;
    readonly idleP2?: string;
    readonly fly?: string;
    readonly flyP2?: string;
    readonly walk?: string;
    readonly walkP2?: string;
    readonly death?: string;
    readonly deathP2?: string;
    readonly spawn?: string;
    readonly spawnP2?: string;
}

export interface IAnimationFrames {
    readonly start: number;
    readonly end: number;
}

export interface ICharacterAnimations {
    readonly idle: {
        readonly frameWidth: number;
        readonly frameHeight: number;
        readonly idleFullFrames?: IAnimationFrames;
        readonly idleLoopFrames?: IAnimationFrames;
        readonly idleFrames?: IAnimationFrames;
        readonly flyFrames?: IAnimationFrames;
        readonly walkFrames?: IAnimationFrames;
        readonly deathFrames?: IAnimationFrames;
        readonly spawnFrames?: IAnimationFrames;
    };
}

export interface IPhysicsConfig {
    readonly bodySize: {
        readonly width: number;
        readonly height: number;
    };
    readonly bodyOffset: {
        readonly x: number;
        readonly y: number;
    };
}

export interface ICharacterStats {
    readonly baseSpeed: number;
    readonly baseHealth: number;
}

export interface ITarotCards {
    readonly front: string;
    readonly back: string;
}

export interface ICharacterData {
    readonly name: string;
    readonly displayName: string;
    readonly description: string;
    readonly sprites: ICharacterSprites;
    readonly animations: ICharacterAnimations;
    readonly physics: IPhysicsConfig;
    readonly stats: ICharacterStats;
    readonly tarot: ITarotCards;
}

export const CHARACTER_CONFIG: Readonly<Record<CharacterType, ICharacterData>> = {
    wizard: {
        name: 'Wizard',
        displayName: 'The Alchemist',
        description: 'Master of elemental fusion and arcane arts',
        sprites: {
            idle: 'wizard-idle',
            fly: 'wizard-fly',
            death: 'wizard-death',
            idleP2: 'wizard-idle-p2',
            flyP2: 'wizard-fly-p2',
            deathP2: 'wizard-death-p2'
        },
        animations: {
            idle: {
                frameWidth: 80,
                frameHeight: 80,
                idleFullFrames: { start: 0, end: 19 },
                idleLoopFrames: { start: 0, end: 5 },
                flyFrames: { start: 0, end: 1 },
                deathFrames: { start: 0, end: 9 }
            }
        },
        physics: {
            bodySize: { width: 30, height: 30 },
            bodyOffset: { x: 25, y: 35 }
        },
        stats: {
            baseSpeed: 200,
            baseHealth: 100
        },
        tarot: {
            front: 'wiztarot',
            back: 'wiztarotback'
        }
    },
    orb: {
        name: 'Orb',
        displayName: 'The Mystic Sphere',
        description: 'Ancient floating consciousness of pure energy',
        sprites: {
            idle: 'orb-idle',
            walk: 'orb-walk',
            spawn: 'orb-spawn',
            idleP2: 'orb-idle-p2',
            walkP2: 'orb-walk-p2',
            spawnP2: 'orb-spawn-p2'
        },
        animations: {
            idle: {
                frameWidth: 64,
                frameHeight: 64,
                idleFrames: { start: 0, end: 9 },
                walkFrames: { start: 0, end: 7 },
                spawnFrames: { start: 0, end: 7 }
            }
        },
        physics: {
            bodySize: { width: 40, height: 40 },
            bodyOffset: { x: 12, y: 12 }
        },
        stats: {
            baseSpeed: 220,
            baseHealth: 80
        },
        tarot: {
            front: 'ordtarot',
            back: 'orbtarotback'
        }
    },
    grim: {
        name: 'Grim',
        displayName: 'The Death Knight',
        description: 'Harbinger of doom wielding dark powers',
        sprites: {
            idle: 'grim-idle',
            walk: 'grim-walk',
            death: 'grim-death',
            spawn: 'grim-spawn',
            idleP2: 'grim-idle-p2',
            walkP2: 'grim-walk-p2',
            deathP2: 'grim-death-p2',
            spawnP2: 'grim-spawn-p2'
        },
        animations: {
            idle: {
                frameWidth: 64,
                frameHeight: 64,
                idleFrames: { start: 0, end: 15 },
                walkFrames: { start: 0, end: 5 },
                deathFrames: { start: 0, end: 23 },
                spawnFrames: { start: 0, end: 23 }
            }
        },
        physics: {
            bodySize: { width: 35, height: 40 },
            bodyOffset: { x: 14, y: 20 }
        },
        stats: {
            baseSpeed: 180,
            baseHealth: 120
        },
        tarot: {
            front: 'grimtarot',
            back: 'grimtarotback'
        }
    }
} as const;

export type CharacterConfig = typeof CHARACTER_CONFIG;

/**
 * Helper to get character data safely
 */
export function getCharacterData(character: CharacterType): ICharacterData {
    return CHARACTER_CONFIG[character];
}

/**
 * Helper to get character sprites
 */
export function getCharacterSprites(character: CharacterType): ICharacterSprites {
    return CHARACTER_CONFIG[character].sprites;
}

/**
 * Helper to get character stats
 */
export function getCharacterStats(character: CharacterType): ICharacterStats {
    return CHARACTER_CONFIG[character].stats;
}

/**
 * Helper to get physics configuration
 */
export function getPhysicsConfig(character: CharacterType): IPhysicsConfig {
    return CHARACTER_CONFIG[character].physics;
}
