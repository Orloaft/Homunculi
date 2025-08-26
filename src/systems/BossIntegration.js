// Boss System Integration - Helps integrate new state machine bosses with existing game code

import BossFactory from '../entities/BossFactory.js';

export class BossIntegration {
    /**
     * Replaces the old boss creation with the new state machine system
     * Call this instead of the old createObeliskBoss, createArcherBoss, etc.
     */
    static createBossForStage(scene, stage) {
        // Get boss spawn position
        const bossX = scene.wizard ? scene.wizard.x : 400;
        const bossY = scene.wizard ? (scene.wizard.y - 200) : 200;
        
        // Create boss using the factory
        const boss = BossFactory.createBoss(scene, stage, bossX, bossY);
        
        // Set up boss for the scene
        BossFactory.setupBossForScene(scene, boss);
        
        // Apply any stage-specific modifications
        this.applyStageSpecificSetup(scene, boss, stage);
        
        // Replace old AI timer with new update system
        if (scene.bossAITimer) {
            scene.bossAITimer.remove();
            scene.bossAITimer = null;
        }
        
        // Add boss update to scene update
        if (!scene.bossUpdateHandler) {
            scene.bossUpdateHandler = (time, delta) => {
                if (scene.boss && scene.boss.update && !scene.isPaused && !scene.chestOpening) {
                    scene.boss.update(time, delta);
                }
            };
            
            // Hook into scene update
            const originalUpdate = scene.update.bind(scene);
            scene.update = function(time, delta) {
                originalUpdate(time, delta);
                scene.bossUpdateHandler(time, delta);
            };
        }
        
        return boss;
    }
    
    /**
     * Apply stage-specific setup that matches the old system
     */
    static applyStageSpecificSetup(scene, boss, stage) {
        // Apply enemy density health scaling
        const enemyDensity = localStorage.getItem('enemyDensity') || 'normal';
        const densityMultipliers = {
            'sparse': 0.25,
            'normal': 0.5,
            'dense': 0.75,
            'swarm': 1.0
        };
        const healthMultiplier = densityMultipliers[enemyDensity] || 0.5;
        
        // Scale boss health
        boss.health = Math.floor(boss.maxHealth * healthMultiplier);
        boss.maxHealth = boss.health;
        
        // Update health bar if it exists
        if (boss.healthBar) {
            const healthPercent = boss.health / boss.maxHealth;
            boss.healthBar.width = (boss.healthBarBg.width - 4) * healthPercent;
        }
        
        // Apply saved scale if available
        if (scene.applySavedScale) {
            scene.applySavedScale(boss, boss.enemyType || boss.name.toLowerCase().replace(' ', '-'));
        }
        
        // Apply hitbox configuration
        if (scene.applyHitboxConfig) {
            scene.applyHitboxConfig(boss, boss.enemyType || boss.name.toLowerCase().replace(' ', '-'));
        }
    }
    
    /**
     * Creates boss health bar UI matching the old system
     */
    static createBossHealthBarUI(scene, boss) {
        // Boss health bar background
        const barWidth = 600;
        const barHeight = 30;
        
        scene.bossHealthBarBg = scene.add.rectangle(400, 550, barWidth, barHeight, 0x000000);
        scene.bossHealthBarBg.setStrokeStyle(3, this.getBossHealthBarColor(boss));
        scene.bossHealthBarBg.setScrollFactor(0);
        scene.bossHealthBarBg.setDepth(500);
        
        // Boss health bar fill
        scene.bossHealthBar = scene.add.rectangle(400, 550, barWidth - 6, barHeight - 6, this.getBossHealthBarColor(boss));
        scene.bossHealthBar.setScrollFactor(0);
        scene.bossHealthBar.setDepth(501);
        
        // Boss name
        scene.bossNameText = scene.add.text(400, 520, boss.name.toUpperCase(), {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        scene.bossNameText.setOrigin(0.5);
        scene.bossNameText.setScrollFactor(0);
        scene.bossNameText.setDepth(502);
    }
    
    static getBossHealthBarColor(boss) {
        const colorMap = {
            'Awakened Obelisk': 0xff0000,
            'Arcane Archer': 0xff00ff,
            'Demon Slime': 0xff4400,
            'Sand Guardian': 0xffaa00,
            'Nekros': 0x9400d3
        };
        
        return colorMap[boss.name] || 0xff0000;
    }
    
    /**
     * Handles boss defeat and cleanup
     */
    static handleBossDefeat(scene, boss) {
        // Stop boss music
        if (scene.bossMusic && scene.bossMusic.isPlaying) {
            scene.tweens.add({
                targets: scene.bossMusic,
                volume: 0,
                duration: 1000,
                onComplete: () => {
                    if (scene.bossMusic) {
                        scene.bossMusic.stop();
                        scene.bossMusic = null;
                    }
                }
            });
        }
        
        // Restart stage music
        if (scene.bgMusic && !scene.bgMusic.isPlaying) {
            scene.bgMusic.play();
            scene.tweens.add({
                targets: scene.bgMusic,
                volume: 0.3,
                duration: 1000
            });
        }
        
        // Clean up boss health bar
        if (scene.bossHealthBarBg) scene.bossHealthBarBg.destroy();
        if (scene.bossHealthBar) scene.bossHealthBar.destroy();
        if (scene.bossNameText) scene.bossNameText.destroy();
        
        // Clear boss reference
        scene.boss = null;
        
        // Victory handling
        scene.time.delayedCall(2000, () => {
            scene.gameWon = true;
            scene.gameEnded = true;
            scene.physics.pause();
            scene.scene.start('GameOverScene', {
                won: true,
                survivalTime: scene.survivalTime,
                enemiesKilled: scene.enemiesKilled,
                itemsCollected: scene.itemsCollected,
                stage: scene.stage
            });
        });
    }
}

export default BossIntegration;