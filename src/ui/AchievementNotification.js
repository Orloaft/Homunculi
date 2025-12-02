/**
 * AchievementNotification - UI component for displaying achievement unlocks
 * Shows a toast-style notification when an achievement is unlocked
 */

class AchievementNotification {
    constructor(scene, achievementManager) {
        this.scene = scene;
        this.achievementManager = achievementManager;
        this.notificationQueue = [];
        this.isShowing = false;
        this.currentNotification = null;

        // Listen for achievement unlocks
        this.achievementManager.onAchievementUnlock((notification) => {
            this.queueNotification(notification.achievement);
        });
    }

    /**
     * Add an achievement to the notification queue
     */
    queueNotification(achievement) {
        // Don't queue if scene is invalid
        if (!this.scene || !this.scene.sys || this.scene.sys.isDestroyed || !this.scene.sys.isActive()) {
            console.warn('Cannot queue achievement notification - scene is not active');
            return;
        }

        this.notificationQueue.push(achievement);

        // Start showing notifications if not already showing
        if (!this.isShowing) {
            this.showNext();
        }
    }

    /**
     * Show the next achievement in the queue
     */
    showNext() {
        if (this.notificationQueue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const achievement = this.notificationQueue.shift();

        this.showNotification(achievement);
    }

    /**
     * Display an achievement notification
     */
    showNotification(achievement) {
        // Safety check: ensure scene and camera are valid
        if (!this.scene || !this.scene.cameras || !this.scene.cameras.main) {
            console.warn('Cannot show achievement notification - scene or camera not available');
            // Move to next notification
            this.showNext();
            return;
        }

        const width = 400;
        const height = 120;
        const x = this.scene.cameras.main.width - width - 20; // Right side with padding
        const startY = -height; // Start above screen
        const targetY = 20; // Final position

        // Container for the notification
        const container = this.scene.add.container(x, startY);
        container.setDepth(10000); // Always on top

        // Background
        const bg = this.scene.add.rectangle(0, 0, width, height, 0x2d2d44)
            .setOrigin(0, 0)
            .setStrokeStyle(3, 0xffd700);
        container.add(bg);

        // Trophy icon (using text emoji as placeholder - replace with actual icon)
        const icon = this.scene.add.text(20, height / 2, '🏆', {
            fontSize: '48px'
        }).setOrigin(0, 0.5);
        container.add(icon);

        // Achievement unlocked text
        const titleText = this.scene.add.text(80, 25, 'ACHIEVEMENT UNLOCKED', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0, 0);
        container.add(titleText);

        // Achievement name
        const nameText = this.scene.add.text(80, 50, achievement.displayName || achievement.name, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            wordWrap: { width: width - 100 }
        }).setOrigin(0, 0);
        container.add(nameText);

        // Achievement description
        const descText = this.scene.add.text(80, 75, achievement.displayDescription || achievement.description, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#cccccc',
            wordWrap: { width: width - 100 }
        }).setOrigin(0, 0);
        container.add(descText);

        // Reward display if any
        if (achievement.reward && achievement.reward.gold) {
            const rewardText = this.scene.add.text(width - 10, height - 10, `+${achievement.reward.gold} gold`, {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ffd700'
            }).setOrigin(1, 1);
            container.add(rewardText);
        }

        // Store current notification
        this.currentNotification = container;

        // Slide in animation
        this.scene.tweens.add({
            targets: container,
            y: targetY,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Hold for 4 seconds
                this.scene.time.delayedCall(4000, () => {
                    this.hideNotification(container);
                });
            }
        });

        // Play achievement sound if available
        if (this.scene.sound && this.scene.sound.get('achievement-unlock')) {
            this.scene.sound.play('achievement-unlock', { volume: 0.5 });
        }
    }

    /**
     * Hide and remove a notification
     */
    hideNotification(container) {
        // Safety check: ensure scene is still valid
        if (!this.scene || !this.scene.tweens) {
            // Scene is gone, just destroy the container and continue
            if (container) {
                container.destroy();
            }
            this.currentNotification = null;
            this.showNext();
            return;
        }

        // Slide out animation
        this.scene.tweens.add({
            targets: container,
            y: -150,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                container.destroy();
                this.currentNotification = null;

                // Show next notification if any
                this.showNext();
            }
        });
    }

    /**
     * Manually show all pending achievements (useful when entering achievement menu)
     */
    clearQueue() {
        this.notificationQueue = [];
        if (this.currentNotification) {
            this.hideNotification(this.currentNotification);
        }
    }

    /**
     * Clean up
     */
    destroy() {
        this.clearQueue();
        this.achievementManager = null;
        this.scene = null;
    }
}

// Make AchievementNotification globally available
if (typeof window !== 'undefined') {
    window.AchievementNotification = AchievementNotification;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementNotification;
}
