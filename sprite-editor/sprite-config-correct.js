// Correct sprite configurations based on actual game.js
const SPRITE_CONFIGS = {
    // Players
    players: {
        'wizard': {
            texture: 'wizard-idle',
            path: 'wizmove/newiz/wizard_idle.PNG',
            frameWidth: 231,
            frameHeight: 190,
            animations: {
                idle: { frames: 6, rate: 8 },
                walk: { texture: 'wizard-fly', path: 'wizmove/newiz/wizard_fly_forward.png', frames: 5, rate: 10 },
                death: { texture: 'wizard-death', path: 'wizmove/newiz/wizard_death.PNG', frames: 7, rate: 10 }
            },
            defaultScale: 0.5
        },
        'wizard-p2': {
            texture: 'wizard-idle-p2',
            path: 'wizmove/newiz/wizard_idle2.PNG',
            frameWidth: 231,
            frameHeight: 190,
            animations: {
                idle: { frames: 6, rate: 8 },
                walk: { texture: 'wizard-fly-p2', path: 'wizmove/newiz/wizard_fly_forward2.png', frames: 5, rate: 10 },
                death: { texture: 'wizard-death-p2', path: 'wizmove/newiz/wizard_death2.png', frames: 7, rate: 10 }
            },
            defaultScale: 0.5
        }
    },
    
    // Forest enemies
    forest: {
        'tree': {
            texture: 'enemy-walk',  // CORRECT texture key from game.js
            path: 'tree/tronchungo3/walking-sheet.png',
            frameWidth: 48,  // CORRECT dimensions from game.js
            frameHeight: 60,
            animations: {
                walk: { frames: 6, rate: 8 }
            },
            defaultScale: 1.5
        },
        'mushroom': {
            texture: 'mushroom-run',
            path: 'mushroom/Run.png',
            frameWidth: 150,
            frameHeight: 46,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 0.7
        },
        'giantfly': {
            texture: 'giantfly-walk',
            path: 'forestlandfoes/giantflywalk4frames.png',
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 4, rate: 8 },
                death: { texture: 'giantfly-death', path: 'forestlandfoes/giantflydeath6frames.png', frames: 6, rate: 10 }
            },
            defaultScale: 2.0
        },
        'squirrel': {
            texture: 'squirrel-walk',
            path: 'forestlandfoes/squirrelwalk8frames.png',
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 8, rate: 10 },
                death: { texture: 'squirrel-death', path: 'forestlandfoes/squirreldeath4frames.png', frames: 4, rate: 8 }
            },
            defaultScale: 2.0
        },
        'redpanda': {
            texture: 'redpanda-walk',
            path: 'forestlandfoes/redpandawalk8frames.png',
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 8, rate: 8 }
                // Death animation file doesn't exist
            },
            defaultScale: 2.0
        }
    },
    
    // Cave enemies
    cave: {
        'golem-orange': {
            texture: 'golem-orange-walk',  // CORRECT - not 'golem-walk'
            path: 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_walk.png',
            frameWidth: 192,
            frameHeight: 128,
            animations: {
                walk: { frames: 4, rate: 8 },
                death: { texture: 'golem-orange-die', path: 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_die.png', frames: 15, rate: 10 }
            },
            defaultScale: 0.8
        },
        'golem-blue': {
            texture: 'golem-blue-walk',
            path: 'Golem_1/Blue/No_Swoosh_VFX/Golem_1_walk.png',
            frameWidth: 192,
            frameHeight: 128,
            animations: {
                walk: { frames: 4, rate: 8 },
                death: { texture: 'golem-blue-die', path: 'Golem_1/Blue/No_Swoosh_VFX/Golem_1_die.png', frames: 15, rate: 10 }
            },
            defaultScale: 0.8
        },
        'kobold': {
            texture: 'kobold-walk',  // CORRECT texture key
            path: 'kobold/kobold8frames.png',  // CORRECT path
            frameWidth: 148,  // CORRECT dimensions from game.js
            frameHeight: 96,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.0
        },
        'bloboid/slime': {
            texture: 'bloboid-walk',  // CORRECT texture key
            path: 'newenemies/blob/blob minion walk.png',
            frameWidth: 80,  // CORRECT dimensions from game.js
            frameHeight: 35,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'brainmole': {
            texture: 'brainmole-walk',
            path: 'cavelandfoes/brainmole4frames.png',
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 4, rate: 8 },
                death: { texture: 'brainmole-death', path: 'cavelandfoes/brainmoledeath7frames.png', frames: 7, rate: 12 }
            },
            defaultScale: 2.0
        },
        'intellectdevourer': {
            texture: 'intellectdevourer-walk',
            path: 'cavelandfoes/intellectdevourer8frames.png',
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 8, rate: 10 },
                death: { texture: 'intellectdevourer-death', path: 'cavelandfoes/intellectdevourerdeath4frames.png', frames: 4, rate: 10 }
            },
            defaultScale: 1.8
        }
    },
    
    // Desert enemies
    desert: {
        'bat': {
            texture: 'bat-fly',
            path: 'bateye/Flight.png',
            frameWidth: 150,
            frameHeight: 150,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 0.5
        },
        'darkbat': {
            texture: 'dark-bat-fly',
            path: 'Bat-IdleFly9frames.png',
            frameWidth: 16,
            frameHeight: 16,
            animations: {
                walk: { frames: 9, rate: 10 }
            },
            defaultScale: 3.0
        },
        'flyingdemon': {
            texture: 'flying-demon',
            path: 'flyingdemon/flamedemon4frames.png',
            frameWidth: 16,
            frameHeight: 16,
            animations: {
                walk: { frames: 4, rate: 8 }
            },
            defaultScale: 3.0
        },
        'fireworm': {
            texture: 'fireworm-walk',
            path: 'fireworm/Walk.png',
            frameWidth: 90,
            frameHeight: 90,
            animations: {
                walk: { frames: 9, rate: 10 }
            },
            defaultScale: 1.2
        },
        'soul': {
            texture: 'soul-move',  // CORRECT texture key
            path: 'newenemies/Soul/Soul/move/Soul_move.png',
            frameWidth: 96,  // CORRECT dimensions from game.js
            frameHeight: 96,
            animations: {
                walk: { frames: 8, rate: 8 },
                attack: { texture: 'soul-attack', path: 'newenemies/Soul/Soul/attack/Soul_attack.png', frames: 10, rate: 10 }
            },
            defaultScale: 1.0
        },
        'summoner': {
            texture: 'summoner-idle',  // CORRECT - idle, not walk
            path: 'newenemies/summoner/The Summoner idle animation-export.png',
            frameWidth: 80,  // CORRECT dimensions from game.js
            frameHeight: 80,
            animations: {
                idle: { frames: 12, rate: 8 },
                attack: { texture: 'summoner-summon', path: 'newenemies/summoner/summon animation-export.png', frames: 14, frameWidth: 100, rate: 10 }
            },
            defaultScale: 1.0
        },
        'skeleton-yellow': {
            texture: 'skeleton-yellow-walk',
            path: 'skeleton/Skeleton_01_Yellow_Walk10frames.png',
            frameWidth: 100,
            frameHeight: 100,
            animations: {
                walk: { frames: 10, rate: 10 }
            },
            defaultScale: 1.0
        },
        'skeleton-seeker': {
            texture: 'skeleton-seeker-walk',
            path: 'skeleton/skeleton_seeker_walk.png',
            frameWidth: 100,
            frameHeight: 100,
            animations: {
                walk: { frames: 10, rate: 10 },
                spawn: { texture: 'skeleton-seeker-spawn', path: 'skeleton/skeleton_seeker_spawn.png', frames: 10, rate: 10 }
            },
            defaultScale: 1.0
        }
    },
    
    // Castle enemies
    castle: {
        'knight': {
            texture: 'castle-knight',
            path: 'castlelandfoes/knightrun8frames.png',
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'rogue': {
            texture: 'castle-rogue',
            path: 'castlelandfoes/roguerun6frames.png',
            frameWidth: 48,
            frameHeight: 48,
            animations: {
                walk: { frames: 6, rate: 10 }
            },
            defaultScale: 1.5
        },
        'soldier': {
            texture: 'castle-soldier',
            path: 'castlelandfoes/soldier6frames.png',
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                walk: { frames: 6, rate: 8 }
            },
            defaultScale: 1.5
        },
        'squire': {
            texture: 'castle-squire',
            path: 'castlelandfoes/squire8frames.png',
            frameWidth: 48,
            frameHeight: 48,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.3
        }
    },
    
    // Bosses
    bosses: {
        'archer-boss': {
            texture: 'archer-boss-walk',
            path: 'archerboss/boss2archerwalk8frames.png',
            frameWidth: 64,  // 510/8 = 63.75
            frameHeight: 54,
            animations: {
                walk: { frames: 8, rate: 10 },
                attack: { texture: 'archer-boss-shoot', path: 'archerboss/boss2archershoot7frames.png', frames: 7, frameWidth: 65, rate: 10 },
                death: { texture: 'archer-boss-death', path: 'archerboss/boss2archerdeath8frames.png', frames: 8, rate: 10 }
            },
            defaultScale: 2.0
        },
        'obelisk-boss': {
            texture: 'obelisk-boss',
            path: 'obeliskBoss.png',
            frameWidth: 100,
            frameHeight: 100,
            animations: {
                idle: { frames: 1, rate: 1 }
            },
            defaultScale: 1.5
        },
        'voidkin': {
            texture: 'voidkin',
            path: 'voidkin15frames.png',
            frameWidth: 224,  // 3360/15
            frameHeight: 240,
            animations: {
                idle: { frames: 15, rate: 10 }
            },
            defaultScale: 1.0
        },
        'nekros': {
            // Nekros uses individual images, not spritesheets
            // This is loaded differently in game.js
            texture: 'nekros-walk-1',  // First frame as placeholder
            path: 'Nekros/walk/walk_1.png',
            frameWidth: 128,  // Estimate
            frameHeight: 128,
            animations: {
                // These would need special handling for individual frame loading
                walk: { frames: 10, rate: 10 },
                attack1: { frames: 8, rate: 10 },
                attack2: { frames: 14, rate: 10 },
                death: { frames: 19, rate: 10 }
            },
            defaultScale: 1.5,
            special: 'individual-frames'  // Flag for special handling
        },
        'king-nothing': {
            // King Nothing also uses individual images
            texture: 'king-nothing-run',
            path: 'castlelandfoes/kingnothingboss/Run.png',
            frameWidth: 128,  // Estimate
            frameHeight: 128,
            animations: {
                walk: { frames: 1, rate: 1 },
                attack: { frames: 1, rate: 1 },
                death: { frames: 1, rate: 1 }
            },
            defaultScale: 2.0,
            special: 'individual-images'
        },
        'obelisk-idle': {
            texture: 'obelisk-idle',
            path: 'Obelisk_demo/Obelisk.png',
            frameWidth: 96,
            frameHeight: 96,
            animations: {
                idle: { frames: 8, rate: 8 }
            },
            defaultScale: 1.5
        }
    },
    
    // Special characters
    characters: {
        'wraith': {
            texture: 'wraith-walk',
            path: 'scythewraith/scythewraithwalk8frames.png',
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                walk: { frames: 8, rate: 10 },
                attack: { texture: 'wraith-attack', path: 'scythewraith/scythewraithattack8frames.png', frames: 8, rate: 12 },
                death: { texture: 'wraith-death', path: 'scythewraith/scythewraithdeath8frames.png', frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'orb': {
            texture: 'orb-idle',
            path: 'homunculicharacters/orbidle10framesdims640x64.png',
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                idle: { frames: 10, rate: 8 },
                walk: { texture: 'orb-walk', path: 'homunculicharacters/orbwalk8framesdims512x64.png', frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'grim': {
            texture: 'grim-idle',
            path: 'homunculicharacters/grimidle8framesx2framesdims512x128.png',
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                idle: { frames: 16, rate: 8 },
                walk: { texture: 'grim-walk', path: 'homunculicharacters/grimwalk6framesdimsdims384x64.png', frames: 6, rate: 10 },
                death: { texture: 'grim-death', path: 'homunculicharacters/grimdeath8framesx3framesdims512x192.png', frames: 24, rate: 10 }
            },
            defaultScale: 1.5
        }
    }
};

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPRITE_CONFIGS;
}