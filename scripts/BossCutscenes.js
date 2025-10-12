// Enhanced Boss Cutscene System for WizBiz
// Can be integrated into game.js
class BossCutsceneSystem {
    constructor(scene) {
        this.scene = scene;
        this.isPlaying = false;
        this.currentElements = [];
        this.skipKey = null;
    }
    // Main entry point for boss cutscenes
    playBossCutscene(bossType, onComplete) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.onComplete = onComplete;
        // Save game state
        this.savedState = {
            physicsRunning: !this.scene.physics.world.isPaused,
            bgMusicVolume: this.scene.bgMusic?.volume || 0.5,
            inputEnabled: this.scene.input.keyboard.enabled
        };
        // Prepare for cutscene
        this.scene.physics.pause();
        this.scene.input.keyboard.enabled = false;
        // Stop player movement
        if (this.scene.wizard?.body) {
            this.scene.wizard.body.setVelocity(0, 0);
        }
        if (this.scene.wizard2?.body) {
            this.scene.wizard2.body.setVelocity(0, 0);
        }
        // Fade music
        if (this.scene.bgMusic) {
            this.scene.tweens.add({
                targets: this.scene.bgMusic,
                volume: 0.2,
                duration: 500
            });
        }
        // Setup skip functionality
        this.skipKey = this.scene.input.keyboard.addKey('SPACE');
        this.skipKey.once('down', () => this.skipCutscene());
        // Play specific boss cutscene
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
            case 'kingnothingboss':
                this.playKingNothingCutscene();
                break;
            default:
                this.playGenericBossCutscene(bossType);
        }
    }
    // Obelisk Boss Cutscene - Ancient Awakening
    playObeliskCutscene() {
        // Screen shake as obelisk awakens
        this.scene.cameras.main.shake(2000, 0.02);
        // Dark overlay
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(900);
        this.currentElements.push(overlay);
        // Fade in overlay
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.8,
            duration: 1000
        });
        // Ancient text appears
        const ancientText = this.scene.add.text(400, 200, 'THE ANCIENT SEAL HAS BEEN BROKEN', {
            fontSize: '32px',
            color: '#ff6666',
            fontFamily: 'serif',
            stroke: '#000000',
            strokeThickness: 4
        });
        ancientText.setOrigin(0.5);
        ancientText.setScrollFactor(0);
        ancientText.setDepth(901);
        ancientText.setAlpha(0);
        this.currentElements.push(ancientText);
        // Boss title
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
        // Subtitle
        const subtitle = this.scene.add.text(400, 370, 'Guardian of Forbidden Knowledge', {
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
        // Red lightning effects
        const createLightning = () => {
            const lightning = this.scene.add.rectangle(
                Phaser.Math.Between(100, 700),
                0,
                Phaser.Math.Between(2, 5),
                600,
                0xff0000,
                0.8
            );
            lightning.setScrollFactor(0);
            lightning.setDepth(902);
            this.currentElements.push(lightning);
            this.scene.tweens.add({
                targets: lightning,
                alpha: 0,
                duration: 200,
                onComplete: () => lightning.destroy()
            });
        };
        // Sequence the cutscene
        const timeline = this.scene.tweens.createTimeline();
        // Ancient text fades in
        timeline.add({
            targets: ancientText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
        // Lightning flashes
        timeline.add({
            targets: {},
            duration: 500,
            onStart: () => {
                createLightning();
                this.scene.time.delayedCall(100, createLightning);
                this.scene.time.delayedCall(200, createLightning);
            }
        });
        // Title scales in dramatically
        timeline.add({
            targets: title,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut',
            onStart: () => {
                // Sound effect if available
                if (this.scene.sound.get('boss-roar')) {
                    this.scene.sound.play('boss-roar');
                }
            }
        });
        // Subtitle fades in
        timeline.add({
            targets: subtitle,
            alpha: 1,
            duration: 500
        });
        // Hold for dramatic effect
        timeline.add({
            targets: {},
            duration: 2000
        });
        // Fade out everything
        timeline.add({
            targets: this.currentElements,
            alpha: 0,
            duration: 1000,
            onComplete: () => this.endCutscene()
        });
        timeline.play();
    }
    // Nekros Boss Cutscene - Death Approaches
    playNekrosCutscene() {
        // Purple fog effect
        const fog = this.scene.add.rectangle(400, 300, 800, 600, 0x4b0082, 0);
        fog.setScrollFactor(0);
        fog.setDepth(900);
        this.currentElements.push(fog);
        // Death whispers text
        const whispers = [
            "Death... comes for all...",
            "Your souls... will be mine...",
            "Join the eternal legion..."
        ];
        let whisperIndex = 0;
        const whisperText = this.scene.add.text(400, 200, '', {
            fontSize: '24px',
            color: '#9966ff',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 3
        });
        whisperText.setOrigin(0.5);
        whisperText.setScrollFactor(0);
        whisperText.setDepth(901);
        whisperText.setAlpha(0);
        this.currentElements.push(whisperText);
        // Boss title
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
        // Subtitle
        const subtitle = this.scene.add.text(400, 380, 'Death Knight of the Forsaken', {
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
        // Soul particles
        const createSoul = () => {
            const soul = this.scene.add.circle(
                Phaser.Math.Between(100, 700),
                600,
                Phaser.Math.Between(5, 15),
                0x9966ff,
                0.6
            );
            soul.setScrollFactor(0);
            soul.setDepth(899);
            this.currentElements.push(soul);
            this.scene.tweens.add({
                targets: soul,
                y: -50,
                alpha: 0,
                duration: 4000,
                ease: 'Sine.easeInOut',
                onComplete: () => soul.destroy()
            });
        };
        // Create soul effect repeatedly
        const soulTimer = this.scene.time.addEvent({
            delay: 300,
            callback: createSoul,
            repeat: 15
        });
        // Cutscene sequence
        this.scene.tweens.add({
            targets: fog,
            alpha: 0.4,
            duration: 1500,
            ease: 'Power2'
        });
        // Cycle through whispers
        const whisperTimer = this.scene.time.addEvent({
            delay: 1500,
            callback: () => {
                if (whisperIndex < whispers.length) {
                    whisperText.setText(whispers[whisperIndex]);
                    whisperIndex++;
                    this.scene.tweens.add({
                        targets: whisperText,
                        alpha: 1,
                        duration: 500,
                        yoyo: true,
                        hold: 1000
                    });
                }
            },
            repeat: whispers.length - 1
        });
        // Show title after whispers
        this.scene.time.delayedCall(6000, () => {
            this.scene.tweens.add({
                targets: title,
                alpha: 1,
                scale: { from: 0.8, to: 1 },
                duration: 1000,
                ease: 'Power2'
            });
            this.scene.tweens.add({
                targets: subtitle,
                alpha: 1,
                duration: 1000,
                delay: 500
            });
        });
        // End cutscene
        this.scene.time.delayedCall(9000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }
    // Eyelor Boss Cutscene - The All-Seeing
    playEyelorCutscene() {
        // Sandy overlay
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0xffcc66, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(900);
        this.currentElements.push(overlay);
        // Eye opening effect
        const eyeLid = this.scene.add.ellipse(400, 300, 400, 0, 0x000000);
        eyeLid.setScrollFactor(0);
        eyeLid.setDepth(902);
        this.currentElements.push(eyeLid);
        // Iris
        const iris = this.scene.add.circle(400, 300, 80, 0xff6600);
        iris.setScrollFactor(0);
        iris.setDepth(901);
        iris.setScale(0);
        this.currentElements.push(iris);
        // Pupil
        const pupil = this.scene.add.circle(400, 300, 30, 0x000000);
        pupil.setScrollFactor(0);
        pupil.setDepth(901);
        pupil.setScale(0);
        this.currentElements.push(pupil);
        // Title
        const title = this.scene.add.text(400, 450, 'EYELOR', {
            fontSize: '64px',
            color: '#ff9900',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(903);
        title.setAlpha(0);
        this.currentElements.push(title);
        // Subtitle
        const subtitle = this.scene.add.text(400, 510, 'The Desert\'s Watchful Gaze', {
            fontSize: '24px',
            color: '#ffcc99',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        subtitle.setScrollFactor(0);
        subtitle.setDepth(903);
        subtitle.setAlpha(0);
        this.currentElements.push(subtitle);
        // Sequence
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.3,
            duration: 1000
        });
        // Eye opens
        this.scene.tweens.add({
            targets: eyeLid,
            scaleY: { from: 0, to: 1 },
            duration: 2000,
            delay: 500,
            ease: 'Power2'
        });
        // Iris appears
        this.scene.tweens.add({
            targets: iris,
            scale: 1,
            duration: 800,
            delay: 1500,
            ease: 'Back.easeOut'
        });
        // Pupil appears
        this.scene.tweens.add({
            targets: pupil,
            scale: 1,
            duration: 500,
            delay: 2000
        });
        // Eye looks around
        this.scene.tweens.add({
            targets: [iris, pupil],
            x: [400, 350, 450, 400],
            duration: 2000,
            delay: 2500,
            ease: 'Sine.easeInOut'
        });
        // Title and subtitle
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            duration: 1000,
            delay: 3500
        });
        // End
        this.scene.time.delayedCall(6000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }
    // Demon Slime Boss Cutscene - Infernal Emergence
    playDemonSlimeCutscene() {
        // Lava bubbles
        const createLavaBubble = () => {
            const x = Phaser.Math.Between(100, 700);
            const bubble = this.scene.add.circle(x, 600, Phaser.Math.Between(10, 30), 0xff4400, 0.8);
            bubble.setScrollFactor(0);
            bubble.setDepth(900);
            this.currentElements.push(bubble);
            this.scene.tweens.add({
                targets: bubble,
                y: Phaser.Math.Between(200, 400),
                scale: { from: 1, to: 0 },
                alpha: { from: 0.8, to: 0 },
                duration: Phaser.Math.Between(1500, 3000),
                ease: 'Power2',
                onComplete: () => bubble.destroy()
            });
        };
        // Create multiple bubbles
        for (let i = 0; i < 20; i++) {
            this.scene.time.delayedCall(i * 200, createLavaBubble);
        }
        // Red overlay
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0xff0000, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(899);
        this.currentElements.push(overlay);
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.3,
            duration: 1500
        });
        // Title emerges from lava
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
        this.currentElements.push(subtitle);
        // Emerge from bottom
        title.y = 600;
        subtitle.y = 670;
        this.scene.tweens.add({
            targets: title,
            y: 350,
            duration: 2000,
            delay: 1000,
            ease: 'Power2.easeOut'
        });
        this.scene.tweens.add({
            targets: subtitle,
            y: 420,
            duration: 2000,
            delay: 1500,
            ease: 'Power2.easeOut'
        });
        // Screen shake for impact
        this.scene.time.delayedCall(3000, () => {
            this.scene.cameras.main.shake(500, 0.03);
        });
        // End
        this.scene.time.delayedCall(5000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }
    // Archer Boss Cutscene
    playArcherCutscene() {
        // Purple mystical overlay
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x9900ff, 0);
        overlay.setScrollFactor(0);
        overlay.setDepth(900);
        this.currentElements.push(overlay);
        this.scene.tweens.add({
            targets: overlay,
            alpha: 0.3,
            duration: 1000
        });
        // Arrow volley effect
        const createArrow = (startX) => {
            const arrow = this.scene.add.rectangle(startX, -20, 3, 30, 0xff00ff);
            arrow.setScrollFactor(0);
            arrow.setDepth(901);
            arrow.rotation = Math.PI / 2;
            this.currentElements.push(arrow);
            this.scene.tweens.add({
                targets: arrow,
                y: 620,
                duration: 800,
                ease: 'Power2.easeIn',
                onComplete: () => arrow.destroy()
            });
        };
        // Rain of arrows
        for (let i = 0; i < 10; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                createArrow(Phaser.Math.Between(100, 700));
            });
        }
        // Title
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
        // Fade in text
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            duration: 1000,
            delay: 1500
        });
        // End
        this.scene.time.delayedCall(4000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }
    // King Nothing Boss Cutscene - The Hollow Crown
    playKingNothingCutscene() {
        // Dark void effect
        const void1 = this.scene.add.circle(400, 300, 0, 0x000000);
        void1.setScrollFactor(0);
        void1.setDepth(900);
        this.currentElements.push(void1);
        // Expand the void
        this.scene.tweens.add({
            targets: void1,
            radius: 400,
            alpha: 0.9,
            duration: 2000,
            ease: 'Power2'
        });
        // Crown floating down
        const crown = this.scene.add.text(400, -50, '👑', {
            fontSize: '64px'
        });
        crown.setOrigin(0.5);
        crown.setScrollFactor(0);
        crown.setDepth(901);
        this.currentElements.push(crown);
        this.scene.tweens.add({
            targets: crown,
            y: 200,
            duration: 2000,
            ease: 'Bounce.easeOut'
        });
        // Title appears from shadows
        const title = this.scene.add.text(400, 300, 'KING NOTHING', {
            fontSize: '64px',
            color: '#666666',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(901);
        title.setAlpha(0);
        this.currentElements.push(title);
        const subtitle = this.scene.add.text(400, 370, 'Ruler of the Void', {
            fontSize: '24px',
            color: '#999999',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        subtitle.setScrollFactor(0);
        subtitle.setDepth(901);
        subtitle.setAlpha(0);
        this.currentElements.push(subtitle);
        // Fade in text
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            duration: 1000,
            delay: 2000
        });
        // Crown disappears into void
        this.scene.tweens.add({
            targets: crown,
            alpha: 0,
            scale: 0,
            duration: 1000,
            delay: 3000,
            ease: 'Power2.easeIn'
        });
        // End
        this.scene.time.delayedCall(5000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }
    // Generic boss cutscene for any other boss
    playGenericBossCutscene(bossType) {
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
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: this.currentElements,
                alpha: 0,
                duration: 1000,
                onComplete: () => this.endCutscene()
            });
        });
    }
    // Skip the current cutscene
    skipCutscene() {
        if (!this.isPlaying) return;
        // Stop all tweens
        this.scene.tweens.killAll();
        // Clean up immediately
        this.currentElements.forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        this.endCutscene();
    }
    // End cutscene and restore game state
    endCutscene() {
        this.isPlaying = false;
        // Clean up elements
        this.currentElements.forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        this.currentElements = [];
        // Remove skip handler
        if (this.skipKey) {
            this.skipKey.removeAllListeners();
            this.skipKey = null;
        }
        // Restore game state
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
        // Call completion callback
        if (this.onComplete) {
            this.onComplete();
        }
    }
}
// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BossCutsceneSystem;
}