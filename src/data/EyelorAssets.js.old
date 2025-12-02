// Eyelor Boss Asset Configuration

export const EyelorAssets = {
    // Sprite sheets configuration
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
    },
    
    // Animation configurations
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
    },
    
    // Helper function to load all Eyelor assets
    loadAssets(scene) {
        // Load individual frames as a spritesheet
        // Since files are numbered, we need to load them individually first
        
        // Attack frames
        for (let i = 1; i <= 13; i++) {
            scene.load.image(`eyelor-attack-${i}`, `Eyelor/Attack/Eye Beast Attack${i}.png`);
        }
        
        // Death frames
        for (let i = 1; i <= 15; i++) {
            scene.load.image(`eyelor-death-${i}`, `Eyelor/Death/Eye Beast Death${i}.png`);
        }
        
        // Movement frames
        for (let i = 1; i <= 13; i++) {
            scene.load.image(`eyelor-move-${i}`, `Eyelor/Movement/Eye Beast Moving${i}.png`);
        }
        
        // Projectile frames
        for (let i = 1; i <= 3; i++) {
            scene.load.image(`void-ball-${i}`, `Eyelor/Void Ball Projectilep/Void Ball Projectile${i}.png`);
            scene.load.image(`projectile-destroyed-${i}`, `Eyelor/Void Ball Projectilep/Projectile Destroyed${i}.png`);
        }
    },
    
    // Create animations from loaded frames
    createAnimations(scene) {
        // Create animation from individual frames
        const createAnimFromFrames = (key, prefix, frameCount, frameRate, repeat = -1) => {
            const frames = [];
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
};

export default EyelorAssets;