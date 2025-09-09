// Sprite configurations with VERIFIED paths that actually exist
const SPRITE_CONFIGS = {
    // Players
    players: {
        'wizard': {
            texture: 'wizard-idle',
            path: 'assets/sprites/wizmove/newiz/wizard_idle.PNG',
            frameWidth: 231,
            frameHeight: 190,
            animations: {
                idle: { frames: 6, rate: 8 },
                walk: { texture: 'wizard-fly', path: 'assets/sprites/wizmove/newiz/wizard_fly_forward.png', frames: 5, rate: 10 },
                death: { texture: 'wizard-death', path: 'assets/sprites/wizmove/newiz/wizard_death.PNG', frames: 7, rate: 10 }
            },
            defaultScale: 0.5
        },
        'wizard-p2': {
            texture: 'wizard-idle-p2',
            path: 'assets/sprites/wizmove/newiz/wizard_idle2.PNG',
            frameWidth: 231,
            frameHeight: 190,
            animations: {
                idle: { frames: 6, rate: 8 },
                walk: { texture: 'wizard-fly-p2', path: 'assets/sprites/wizmove/newiz/wizard_fly_forward2.png', frames: 5, rate: 10 },
                death: { texture: 'wizard-death-p2', path: 'assets/sprites/wizmove/newiz/wizard_death2.png', frames: 7, rate: 10 }
            },
            defaultScale: 0.5
        }
    },
    
    // Forest enemies (VERIFIED PATHS)
    forest: {
        'tree': {
            texture: 'enemy-walk',  // Uses 'enemy-walk' texture key per game.js
            path: 'assets/enemies/tree/tronchungo3/walking-sheet.png',  // VERIFIED: exists
            frameWidth: 48,
            frameHeight: 60,
            animations: {
                walk: { frames: 6, rate: 8 }
            },
            defaultScale: 1.5
        },
        'mushroom': {
            texture: 'mushroom-run',
            path: 'assets/enemies/mushroom/Run.png',  // VERIFIED: exists
            frameWidth: 150,
            frameHeight: 46,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 0.7
        },
        'giantfly': {
            texture: 'giantfly-walk',
            path: 'assets/enemies/forestlandfoes/giantflywalk4frames.png',  // VERIFIED: exists
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 4, rate: 8 },
                death: { texture: 'giantfly-death', path: 'assets/enemies/forestlandfoes/giantflydeath6frames.png', frames: 6, rate: 10 }
            },
            defaultScale: 2.0
        },
        'squirrel': {
            texture: 'squirrel-walk',
            path: 'assets/enemies/forestlandfoes/squirrelwalk8frames.png',  // VERIFIED: exists
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 8, rate: 10 },
                death: { texture: 'squirrel-death', path: 'assets/enemies/forestlandfoes/squirreldeath4frames.png', frames: 4, rate: 8 }
            },
            defaultScale: 2.0
        },
        'redpanda': {
            texture: 'redpanda-walk',
            path: 'assets/enemies/forestlandfoes/redpandawalk8frames.png',  // VERIFIED: exists
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 8, rate: 8 }
                // Death animation file doesn't exist - redpandadeath4frames.png missing
            },
            defaultScale: 2.0
        }
    },
    
    // Cave enemies (VERIFIED PATHS)
    cave: {
        'golem-orange': {
            texture: 'golem-orange-walk',
            path: 'Golem_1/Orange/No_Swoosh_VFX/Golem_1_walk.png',  // VERIFIED: exists
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
            path: 'Golem_1/Blue/No_Swoosh_VFX/Golem_1_walk.png',  // VERIFIED: exists
            frameWidth: 192,
            frameHeight: 128,
            animations: {
                walk: { frames: 4, rate: 8 },
                death: { texture: 'golem-blue-die', path: 'Golem_1/Blue/No_Swoosh_VFX/Golem_1_die.png', frames: 15, rate: 10 }
            },
            defaultScale: 0.8
        },
        'kobold': {
            texture: 'kobold-walk',
            path: 'assets/enemies/kobold/kobold8frames.png',  // VERIFIED: exists
            frameWidth: 148,
            frameHeight: 96,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.0
        },
        'bloboid': {
            texture: 'bloboid-walk',
            path: 'newenemies/blob/blob minion walk.png',  // VERIFIED: exists
            frameWidth: 80,
            frameHeight: 35,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'brainmole': {
            texture: 'brainmole-walk',
            path: 'assets/enemies/cavelandfoes/brainmole4frames.png',  // VERIFIED: exists
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 4, rate: 8 },
                death: { texture: 'brainmole-death', path: 'assets/enemies/cavelandfoes/brainmoledeath7frames.png', frames: 7, rate: 12 }
            },
            defaultScale: 2.0
        },
        'intellectdevourer': {
            texture: 'intellectdevourer-walk',
            path: 'assets/enemies/cavelandfoes/intellectdevourer8frames.png',  // VERIFIED: exists
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                walk: { frames: 8, rate: 10 },
                death: { texture: 'intellectdevourer-death', path: 'assets/enemies/cavelandfoes/intellectdevourerdeath4frames.png', frames: 4, rate: 10 }
            },
            defaultScale: 1.8
        }
    },
    
    // Desert enemies (VERIFIED PATHS)
    desert: {
        'bat': {
            texture: 'bat-fly',
            path: 'bateye/Flight.png',  // VERIFIED: exists
            frameWidth: 150,
            frameHeight: 150,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 0.5
        },
        'darkbat': {
            texture: 'dark-bat-fly',
            path: 'Bat-IdleFly9frames.png',  // VERIFIED: exists in root
            frameWidth: 16,
            frameHeight: 16,
            animations: {
                walk: { frames: 9, rate: 10 }
            },
            defaultScale: 3.0
        },
        'flyingdemon': {
            texture: 'flying-demon',
            path: 'assets/bosses/flyingdemon/flamedemon4frames.png',  // VERIFIED: exists
            frameWidth: 16,
            frameHeight: 16,
            animations: {
                walk: { frames: 4, rate: 8 }
            },
            defaultScale: 3.0
        },
        'fireworm': {
            texture: 'fireworm-walk',
            path: 'fireworm/Walk.png',  // VERIFIED: exists
            frameWidth: 90,
            frameHeight: 90,
            animations: {
                walk: { frames: 9, rate: 10 }
            },
            defaultScale: 1.2
        },
        'soul': {
            texture: 'soul-move',
            path: 'newenemies/Soul/Soul/move/Soul_move.png',  // VERIFIED: exists
            frameWidth: 96,
            frameHeight: 96,
            animations: {
                walk: { frames: 8, rate: 8 },
                attack: { texture: 'soul-attack', path: 'newenemies/Soul/Soul/attack/Soul_attack.png', frames: 10, rate: 10 }
            },
            defaultScale: 1.0
        },
        'summoner': {
            texture: 'summoner-idle',
            path: 'newenemies/summoner/The Summoner idle animation-export.png',  // VERIFIED: exists
            frameWidth: 80,
            frameHeight: 80,
            animations: {
                idle: { frames: 12, rate: 8 },
                attack: { texture: 'summoner-summon', path: 'newenemies/summoner/summon animation-export.png', frames: 14, frameWidth: 100, rate: 10 }
            },
            defaultScale: 1.0
        },
        'skeleton-yellow': {
            texture: 'skeleton-yellow-walk',
            path: 'assets/enemies/skeleton/Skeleton_01_Yellow_Walk10frames.png',  // VERIFIED: exists
            frameWidth: 100,
            frameHeight: 100,
            animations: {
                walk: { frames: 10, rate: 10 }
            },
            defaultScale: 1.0
        },
        'skeleton-seeker': {
            texture: 'skeleton-seeker-walk',
            path: 'assets/enemies/skeleton/skeleton_seeker_walk.png',  // VERIFIED: exists
            frameWidth: 100,
            frameHeight: 100,
            animations: {
                walk: { frames: 10, rate: 10 },
                spawn: { texture: 'skeleton-seeker-spawn', path: 'assets/enemies/skeleton/skeleton_seeker_spawn.png', frames: 10, rate: 10 }
            },
            defaultScale: 1.0
        }
    },
    
    // Castle enemies (VERIFIED PATHS)
    castle: {
        'knight': {
            texture: 'castle-knight',
            path: 'assets/enemies/castlelandfoes/knightrun8frames.png',  // VERIFIED: exists
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'rogue': {
            texture: 'castle-rogue',
            path: 'assets/enemies/castlelandfoes/roguerun6frames.png',  // VERIFIED: exists
            frameWidth: 48,
            frameHeight: 48,
            animations: {
                walk: { frames: 6, rate: 10 }
            },
            defaultScale: 1.5
        },
        'soldier': {
            texture: 'castle-soldier',
            path: 'assets/enemies/castlelandfoes/soldier6frames.png',  // VERIFIED: exists
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                walk: { frames: 6, rate: 8 }
            },
            defaultScale: 1.5
        },
        'squire': {
            texture: 'castle-squire',
            path: 'assets/enemies/castlelandfoes/squire8frames.png',  // VERIFIED: exists
            frameWidth: 48,
            frameHeight: 48,
            animations: {
                walk: { frames: 8, rate: 10 }
            },
            defaultScale: 1.3
        }
    },
    
    // Bosses (VERIFIED PATHS)
    bosses: {
        'archer-boss': {
            texture: 'archer-boss-walk',
            path: 'assets/bosses/archerboss/boss2archerwalk8frames.png',  // VERIFIED: exists
            frameWidth: 64,
            frameHeight: 54,
            animations: {
                walk: { frames: 8, rate: 10 },
                attack: { texture: 'archer-boss-shoot', path: 'assets/bosses/archerboss/boss2archershoot7frames.png', frames: 7, frameWidth: 65, rate: 10 },
                death: { texture: 'archer-boss-death', path: 'assets/bosses/archerboss/boss2archerdeath8frames.png', frames: 8, rate: 10 }
            },
            defaultScale: 2.0
        },
        'obelisk-boss': {
            texture: 'obelisk-boss',
            path: 'obeliskBoss.png',  // VERIFIED: exists in root
            frameWidth: 100,
            frameHeight: 100,
            animations: {
                idle: { frames: 1, rate: 1 }
            },
            defaultScale: 1.5
        },
        'voidkin': {
            texture: 'voidkin',
            path: 'voidkin15frames.png',  // VERIFIED: exists in root
            frameWidth: 224,
            frameHeight: 240,
            animations: {
                idle: { frames: 15, rate: 10 }
            },
            defaultScale: 1.0
        },
        'obelisk-idle': {
            texture: 'obelisk-idle',
            path: 'Obelisk_demo/Obelisk.png',  // VERIFIED: exists
            frameWidth: 96,
            frameHeight: 96,
            animations: {
                idle: { frames: 8, rate: 8 }
            },
            defaultScale: 1.5
        }
    },
    
    // Special characters (VERIFIED PATHS)
    characters: {
        'wraith': {
            texture: 'wraith-walk',
            path: 'assets/bosses/scythewraith/scythewraithwalk8frames.png',  // VERIFIED: exists
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                walk: { frames: 8, rate: 10 },
                attack: { texture: 'wraith-attack', path: 'assets/bosses/scythewraith/scythewraithattack8frames.png', frames: 8, rate: 12 },
                death: { texture: 'wraith-death', path: 'assets/bosses/scythewraith/scythewraithdeath8frames.png', frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'orb': {
            texture: 'orb-idle',
            path: 'assets/sprites/homunculicharacters/orbidle10framesdims640x64.png',  // VERIFIED: exists
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                idle: { frames: 10, rate: 8 },
                walk: { texture: 'orb-walk', path: 'assets/sprites/homunculicharacters/orbwalk8framesdims512x64.png', frames: 8, rate: 10 }
            },
            defaultScale: 1.5
        },
        'grim': {
            texture: 'grim-idle',
            path: 'assets/sprites/homunculicharacters/grimidle8framesx2framesdims512x128.png',  // VERIFIED: exists
            frameWidth: 64,
            frameHeight: 64,
            animations: {
                idle: { frames: 16, rate: 8 },
                walk: { texture: 'grim-walk', path: 'assets/sprites/homunculicharacters/grimwalk6framesdimsdims384x64.png', frames: 6, rate: 10 },
                death: { texture: 'grim-death', path: 'assets/sprites/homunculicharacters/grimdeath8framesx3framesdims512x192.png', frames: 24, rate: 10 }
            },
            defaultScale: 1.5
        }
    }
};

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPRITE_CONFIGS;
}