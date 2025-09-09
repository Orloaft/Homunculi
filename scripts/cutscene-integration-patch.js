// Cutscene Integration Patch for game.js
// 
// Instructions:
// 1. Copy the BossCutsceneSystem class definition below
// 2. Paste it into game.js right before the line "const config = {" (around line 36850)
// 3. Then apply the modifications shown below to the existing functions

// ============ COPY THIS CLASS INTO game.js ============

class BossCutsceneSystem {
    constructor(scene) {
        this.scene = scene;
        this.isPlaying = false;
        this.currentElements = [];
        this.skipKey = null;
    }

    playBossCutscene(bossType, onComplete) {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.onComplete = onComplete;
        
        // Save state
        this.savedState = {
            physicsRunning: !this.scene.physics.world.isPaused,
            bgMusicVolume: this.scene.bgMusic?.volume || 0.5,
            inputEnabled: this.scene.input.keyboard.enabled
        };
        
        // Pause game
        this.scene.physics.pause();
        this.scene.input.keyboard.enabled = false;
        if (this.scene.wizard?.body) this.scene.wizard.body.setVelocity(0, 0);
        if (this.scene.wizard2?.body) this.scene.wizard2.body.setVelocity(0, 0);
        
        // Fade music
        if (this.scene.bgMusic) {
            this.scene.tweens.add({
                targets: this.scene.bgMusic,
                volume: 0.2,
                duration: 500
            });
        }
        
        // Skip on SPACE
        this.skipKey = this.scene.input.keyboard.addKey('SPACE');
        this.skipKey.once('down', () => this.skipCutscene());
        
        // Show skip hint
        const skipHint = this.scene.add.text(400, 550, 'Press SPACE to skip', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        skipHint.setOrigin(0.5);
        skipHint.setScrollFactor(0);
        skipHint.setDepth(905);
        skipHint.setAlpha(0.7);
        this.currentElements.push(skipHint);
        
        // Play specific cutscene
        switch(bossType) {
            case 'obelisk':
                this.playObeliskCutscene();
                break;
            case 'nekros':
                this.playNekrosCutscene();
                break;
            case 'eyelor':
                this.playEyelorCutscene();
                break;
            case 'demonslime':
                this.playDemonSlimeCutscene();
                break;
            case 'archer':
                this.playArcherCutscene();
                break;
            default:
                this.playSimpleCutscene(bossType);
        }
    }

    playObeliskCutscene() {
        // Ancient awakening theme
        this.scene.cameras.main.shake(2000, 0.02);
        
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(900);
        this.currentElements.push(overlay);
        
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.8,
            duration: 1000
        });
        
        const title = this.scene.add.text(400, 300, 'AWAKENED OBELISK', {
            fontSize: '64px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(901);
        title.setScale(0);
        this.currentElements.push(title);
        
        const subtitle = this.scene.add.text(400, 370, 'Ancient Guardian Awakens', {
            fontSize: '24px',
            color: '#ffaaaa',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        subtitle.setScrollFactor(0);
        subtitle.setDepth(901);
        subtitle.setAlpha(0);
        this.currentElements.push(subtitle);
        
        // Animate
        this.scene.tweens.add({
            targets: title,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });
        
        this.scene.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 500,
            delay: 500
        });
        
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }

    playNekrosCutscene() {
        // Death theme with purple fog
        const fog = this.scene.add.rectangle(400, 300, 800, 600, 0x4b0082, 0);
        fog.setScrollFactor(0);
        fog.setDepth(900);
        this.currentElements.push(fog);
        
        this.scene.tweens.add({
            targets: fog,
            alpha: 0.4,
            duration: 1500
        });
        
        const title = this.scene.add.text(400, 300, 'NEKROS', {
            fontSize: '72px',
            color: '#8a2be2',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(901);
        title.setAlpha(0);
        this.currentElements.push(title);
        
        const subtitle = this.scene.add.text(400, 380, 'Death Knight Rises', {
            fontSize: '26px',
            color: '#cc99ff',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        subtitle.setScrollFactor(0);
        subtitle.setDepth(901);
        subtitle.setAlpha(0);
        this.currentElements.push(subtitle);
        
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            duration: 1000,
            delay: 500
        });
        
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }

    playEyelorCutscene() {
        // Desert eye theme
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0xffcc66, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(900);
        this.currentElements.push(overlay);
        
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.3,
            duration: 1000
        });
        
        const title = this.scene.add.text(400, 300, 'EYELOR', {
            fontSize: '64px',
            color: '#ff9900',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(901);
        title.setAlpha(0);
        this.currentElements.push(title);
        
        const subtitle = this.scene.add.text(400, 370, 'The All-Seeing Eye', {
            fontSize: '24px',
            color: '#ffcc99',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        subtitle.setScrollFactor(0);
        subtitle.setDepth(901);
        subtitle.setAlpha(0);
        this.currentElements.push(subtitle);
        
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            duration: 1000,
            delay: 500
        });
        
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }

    playDemonSlimeCutscene() {
        // Lava theme
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0xff0000, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(899);
        this.currentElements.push(overlay);
        
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.3,
            duration: 1500
        });
        
        const title = this.scene.add.text(400, 350, 'DEMON SLIME', {
            fontSize: '64px',
            color: '#ff4400',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(901);
        title.y = 600;
        this.currentElements.push(title);
        
        const subtitle = this.scene.add.text(400, 420, 'Lord of Molten Fury', {
            fontSize: '24px',
            color: '#ff8800',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        subtitle.setScrollFactor(0);
        subtitle.setDepth(901);
        subtitle.y = 670;
        this.currentElements.push(subtitle);
        
        // Rise from lava
        this.scene.tweens.add({
            targets: title,
            y: 350,
            duration: 2000,
            delay: 500,
            ease: 'Power2.easeOut'
        });
        
        this.scene.tweens.add({
            targets: subtitle,
            y: 420,
            duration: 2000,
            delay: 800,
            ease: 'Power2.easeOut'
        });
        
        this.scene.time.delayedCall(3500, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }

    playArcherCutscene() {
        // Mystical archer theme
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x9900ff, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(900);
        this.currentElements.push(overlay);
        
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.3,
            duration: 1000
        });
        
        const title = this.scene.add.text(400, 300, 'ARCANE ARCHER', {
            fontSize: '56px',
            color: '#ff00ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(902);
        title.setAlpha(0);
        this.currentElements.push(title);
        
        const subtitle = this.scene.add.text(400, 360, 'Master of the Mystical Bow', {
            fontSize: '24px',
            color: '#ff99ff',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        subtitle.setScrollFactor(0);
        subtitle.setDepth(902);
        subtitle.setAlpha(0);
        this.currentElements.push(subtitle);
        
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            duration: 1000,
            delay: 500
        });
        
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }

    playSimpleCutscene(bossType) {
        // Fallback for any boss
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        overlay.setScrollFactor(0);
        overlay.setDepth(900);
        this.currentElements.push(overlay);
        
        const title = this.scene.add.text(400, 300, 'BOSS APPROACHES', {
            fontSize: '48px',
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(901);
        this.currentElements.push(title);
        
        this.scene.tweens.add({
            targets: title,
            scale: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        this.scene.time.delayedCall(2000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }

    skipCutscene() {
        if (!this.isPlaying) return;
        this.scene.tweens.killAll();
        this.currentElements.forEach(el => el?.destroy?.());
        this.endCutscene();
    }

    endCutscene() {
        this.isPlaying = false;
        this.currentElements.forEach(el => el?.destroy?.());
        this.currentElements = [];
        
        if (this.skipKey) {
            this.skipKey.removeAllListeners();
            this.skipKey = null;
        }
        
        if (this.savedState) {
            if (this.savedState.physicsRunning) {
                this.scene.physics.resume();
            }
            this.scene.input.keyboard.enabled = this.savedState.inputEnabled;
            
            if (this.scene.bgMusic) {
                this.scene.tweens.add({
                    targets: this.scene.bgMusic,
                    volume: this.savedState.bgMusicVolume,
                    duration: 500
                });
            }
        }
        
        if (this.onComplete) {
            this.onComplete();
        }
    }
}

// ============ MODIFICATIONS TO EXISTING FUNCTIONS ============

// 1. In create() method of GameScene (around line 7000-8000), add:
//    this.bossCutsceneSystem = new BossCutsceneSystem(this);

// 2. Replace the entire startBossCutscene function (around line 32761) with:
/*
startBossCutscene() {
    // Determine boss type based on stage
    let bossType;
    if (this.stage === 'cave') {
        bossType = 'archer';
    } else if (this.stage === 'lava') {
        bossType = 'demonslime';
    } else if (this.stage === 'sand') {
        bossType = 'eyelor';
    } else if (this.stage === 'grave') {
        bossType = 'nekros';
    } else {
        bossType = 'obelisk';
    }
    
    // Play enhanced cutscene with callback to spawn boss
    this.bossCutsceneSystem.playBossCutscene(bossType, () => {
        // Spawn the boss based on stage
        if (this.stage === 'cave') {
            this.createArcherBoss();
        } else if (this.stage === 'sand') {
            this.createSandBoss();
        } else if (this.stage === 'grave') {
            this.createGraveBoss();
        } else if (this.stage === 'lava') {
            this.createDemonSlimeBoss();
        } else {
            this.createBoss(); // Default Obelisk boss
        }
        
        // Resume physics (already done by cutscene system but ensure it)
        this.physics.resume();
    });
}
*/