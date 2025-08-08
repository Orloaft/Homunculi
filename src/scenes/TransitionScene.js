export default class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    init(data) {
        this.nextScene = data.nextScene || 'TitleScene';
        this.transitionData = data.data || {};
    }

    create() {
        // Set background to match the dark theme
        this.cameras.main.setBackgroundColor('#11130d');
        
        // Display loading complete image (same as LoadingScene)
        const loadingImage = this.add.image(400, 300, 'loading-bg');
        loadingImage.setDisplaySize(800, 600); // Ensure it fills the screen
        
        // Create a black overlay for smooth transition
        const blackOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000);
        blackOverlay.setAlpha(0);
        
        // First fade the loading image (matching LoadingScene timing)
        this.tweens.add({
            targets: loadingImage,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Then fade in the black overlay
                this.tweens.add({
                    targets: blackOverlay,
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        // Start the next scene
                        this.scene.start(this.nextScene, this.transitionData);
                    }
                });
            }
        });
    }
}