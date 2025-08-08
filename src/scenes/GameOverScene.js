export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        // Receive game stats
        this.survivalTime = data.survivalTime || 0;
        this.enemiesKilled = data.enemiesKilled || 0;
        this.itemsCollected = data.itemsCollected || 0;
        this.playerLevel = data.level || 1;
        this.elementsDiscovered = data.elementsDiscovered || 1;
        this.damageDealt = data.damageDealt || 0;
        this.won = data.won || false;
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x000000);

        // Title
        const titleText = this.won ? 'VICTORY!' : 'GAME OVER';
        const titleColor = this.won ? '#00ff00' : '#ff0000';
        
        const title = this.add.text(400, 100, titleText, {
            fontSize: '48px',
            color: titleColor,
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // Stats container
        const statsContainer = this.add.container(400, 300);
        
        // Calculate score
        const timeBonus = Math.floor(this.survivalTime / 1000) * 10;
        const killBonus = this.enemiesKilled * 100;
        const itemBonus = this.itemsCollected * 50;
        const levelBonus = this.playerLevel * 500;
        const elementBonus = this.elementsDiscovered * 200;
        const totalScore = timeBonus + killBonus + itemBonus + levelBonus + elementBonus;

        // Display stats
        const stats = [
            { label: 'Survival Time', value: `${Math.floor(this.survivalTime / 1000)}s`, score: timeBonus },
            { label: 'Enemies Killed', value: this.enemiesKilled, score: killBonus },
            { label: 'Items Collected', value: this.itemsCollected, score: itemBonus },
            { label: 'Level Reached', value: this.playerLevel, score: levelBonus },
            { label: 'Elements Found', value: this.elementsDiscovered, score: elementBonus },
            { label: 'Damage Dealt', value: Math.floor(this.damageDealt), score: 0 }
        ];

        let yOffset = -150;
        stats.forEach((stat, index) => {
            // Label
            const label = this.add.text(-200, yOffset, stat.label + ':', {
                fontSize: '20px',
                color: '#ffffff'
            });
            label.setOrigin(0, 0.5);
            
            // Value
            const value = this.add.text(0, yOffset, stat.value.toString(), {
                fontSize: '20px',
                color: '#ffff00'
            });
            value.setOrigin(0.5, 0.5);
            
            // Score
            if (stat.score > 0) {
                const score = this.add.text(200, yOffset, `+${stat.score}`, {
                    fontSize: '20px',
                    color: '#00ff00'
                });
                score.setOrigin(1, 0.5);
                statsContainer.add([label, value, score]);
            } else {
                statsContainer.add([label, value]);
            }
            
            yOffset += 30;
        });

        // Total score
        const totalLabel = this.add.text(-200, yOffset + 20, 'TOTAL SCORE:', {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        totalLabel.setOrigin(0, 0.5);

        const totalValue = this.add.text(200, yOffset + 20, totalScore.toString(), {
            fontSize: '28px',
            color: '#ffff00',
            fontStyle: 'bold'
        });
        totalValue.setOrigin(1, 0.5);

        statsContainer.add([totalLabel, totalValue]);

        // Buttons
        const buttonY = 500;
        
        // Retry button
        const retryButton = this.add.text(300, buttonY, 'RETRY', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        });
        retryButton.setOrigin(0.5);
        retryButton.setInteractive({ useHandCursor: true });

        retryButton.on('pointerover', () => {
            retryButton.setScale(1.1);
            retryButton.setBackgroundColor('#555555');
        });

        retryButton.on('pointerout', () => {
            retryButton.setScale(1);
            retryButton.setBackgroundColor('#333333');
        });

        retryButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Main menu button
        const menuButton = this.add.text(500, buttonY, 'MAIN MENU', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });

        menuButton.on('pointerover', () => {
            menuButton.setScale(1.1);
            menuButton.setBackgroundColor('#555555');
        });

        menuButton.on('pointerout', () => {
            menuButton.setScale(1);
            menuButton.setBackgroundColor('#333333');
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });

        // Keyboard shortcuts
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('TitleScene');
        });

        // Animate score counting
        this.animateScore(totalValue, totalScore);
    }

    animateScore(textObject, targetScore) {
        const duration = 2000;
        const startScore = 0;
        
        this.tweens.add({
            targets: { score: startScore },
            score: targetScore,
            duration: duration,
            ease: 'Power2',
            onUpdate: (tween) => {
                const currentScore = Math.floor(tween.getValue());
                textObject.setText(currentScore.toString());
            }
        });
    }
}