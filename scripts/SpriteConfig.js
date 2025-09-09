// Sprite Configuration File
// This file is shared between the game and the sprite editor
// It contains all sprite definitions and animation parameters

const SpriteConfig = {
    // Forest Land Enemies
    giantfly: {
        texture: 'giantfly-walk',
        path: 'assets/enemies/forestlandfoes/giantflywalk4frames.png',
        frameWidth: 32,
        frameHeight: 29,  // Actual height from file (128x29 / 4 frames)
        animations: {
            walk: { 
                key: 'giantfly-walking',
                start: 0, 
                end: 3, 
                rate: 8,
                repeat: -1
            },
            death: { 
                key: 'giantfly-dying',
                texture: 'giantfly-death',
                path: 'assets/enemies/forestlandfoes/giantflydeath6frames.png',
                frameWidth: 32,
                frameHeight: 30,  // Actual height (192x30 / 6 frames)
                start: 0, 
                end: 5, 
                rate: 10,
                repeat: 0
            }
        },
        defaultScale: 2.0,
        health: 4,
        moveSpeed: 70,
        damage: 15,
        isFlying: true
    },
    
    squirrel: {
        texture: 'squirrel-walk',
        path: 'assets/enemies/forestlandfoes/squirrelwalk8frames.png',
        frameWidth: 32,
        frameHeight: 21,  // Actual height (256x21 / 8 frames)
        animations: {
            walk: { 
                key: 'squirrel-walking',
                start: 0, 
                end: 7, 
                rate: 10,
                repeat: -1
            },
            death: { 
                key: 'squirrel-dying',
                texture: 'squirrel-death',
                path: 'assets/enemies/forestlandfoes/squirreldeath4frames.png',
                frameWidth: 32,
                frameHeight: 16,  // Actual height (128x16 / 4 frames)
                start: 0, 
                end: 3, 
                rate: 8,
                repeat: 0
            }
        },
        defaultScale: 1.8,
        health: 3,
        moveSpeed: 50,
        damage: 10
    },
    
    redpanda: {
        texture: 'redpanda-walk',
        path: 'assets/enemies/forestlandfoes/redpandawalk8frames.png',
        frameWidth: 32,
        frameHeight: 18,  // Actual height (256x18 / 8 frames)
        animations: {
            walk: { 
                key: 'redpanda-walking',
                start: 0, 
                end: 7, 
                rate: 8,
                repeat: -1
            },
            death: {
                key: 'redpanda-dying',
                texture: 'redpanda-death',
                path: 'assets/enemies/forestlandfoes/redpandadeath8frames.png',
                frameWidth: 32,
                frameHeight: 18,  // Actual height (256x18 / 8 frames)
                start: 0, 
                end: 7, 
                rate: 10,
                repeat: 0
            }
        },
        defaultScale: 2.2,
        health: 6,
        moveSpeed: 45,
        damage: 12
    },
    
    // Mushroom enemy
    mushroom: {
        texture: 'mushroom-run',
        path: 'assets/enemies/mushroom/Run.png',
        frameWidth: 150,  // 1200 / 8 frames
        frameHeight: 46,
        animations: {
            walk: {
                key: 'mushroom-running',
                start: 0,
                end: 7,
                rate: 10,
                repeat: -1
            }
        },
        defaultScale: 0.7,
        flipY: true,
        health: 5,
        moveSpeed: 59,
        damage: 10
    },
    
    // Tree enemy
    tree: {
        texture: 'tree-walk',
        path: 'assets/enemies/tree/walk.png',
        frameWidth: 128,  // 768 / 6 frames
        frameHeight: 128,
        animations: {
            walk: {
                key: 'tree-walking',
                start: 0,
                end: 5,
                rate: 8,
                repeat: -1
            },
            death: {
                key: 'tree-dying',
                texture: 'tree-death',
                path: 'assets/enemies/tree/death.png',
                frameWidth: 128,
                frameHeight: 128,
                start: 0,
                end: 5,
                rate: 10,
                repeat: 0
            }
        },
        defaultScale: 1.5,
        health: 12,
        moveSpeed: 30,
        damage: 15
    },
    
    // Bat enemy
    bat: {
        texture: 'bat-fly',
        path: 'Bat-IdleFly9frames.png',
        frameWidth: 20,  // 180 / 9 frames
        frameHeight: 20,
        animations: {
            walk: {
                key: 'bat-flying',
                start: 0,
                end: 8,
                rate: 10,
                repeat: -1
            }
        },
        defaultScale: 3.5,
        health: 3,
        moveSpeed: 92,
        damage: 8,
        isFlying: true
    },
    
    // Cave enemies
    kobold: {
        texture: 'kobold-walk',
        path: 'assets/enemies/kobold/Walk.png',
        frameWidth: 115,  // 345 / 3 frames
        frameHeight: 111,
        animations: {
            walk: {
                key: 'kobold-walking',
                start: 0,
                end: 2,
                rate: 6,
                repeat: -1
            },
            death: {
                key: 'kobold-dying',
                texture: 'kobold-death',
                path: 'assets/enemies/kobold/Death.png',
                frameWidth: 115,
                frameHeight: 111,
                start: 0,
                end: 2,
                rate: 8,
                repeat: 0
            }
        },
        defaultScale: 0.8,
        health: 8,
        moveSpeed: 40,
        damage: 12
    },
    
    golem: {
        texture: 'golem-orange-walk',
        path: 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_walk.png',
        frameWidth: 64,  // 768 / 12 frames
        frameHeight: 64,
        animations: {
            walk: {
                key: 'golem-walking',
                start: 0,
                end: 11,
                rate: 10,
                repeat: -1
            },
            death: {
                key: 'golem-dying',
                texture: 'golem-orange-die',
                path: 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_die.png',
                frameWidth: 64,
                frameHeight: 64,
                start: 0,
                end: 11,
                rate: 10,
                repeat: 0
            }
        },
        defaultScale: 2.0,
        health: 15,
        moveSpeed: 25,
        damage: 18
    }
};

// Export for use in both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpriteConfig;
}