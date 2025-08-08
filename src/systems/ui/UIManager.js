import { UI_CONFIG } from '../../data/GameConstants.js';
import { ELEMENT_CONFIG } from '../../data/ElementConfig.js';

export class UIManager {
    constructor(scene) {
        this.scene = scene;
        
        // UI Components
        this.healthBar = null;
        this.xpBar = null;
        this.chargeIndicators = [];
        this.waveText = null;
        this.enemyCounter = null;
        
        this.createUI();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Health updates
        this.scene.events.on('healthChanged', (data) => {
            this.updateHealthBar(data.current, data.max);
        });
        
        // XP updates
        this.scene.events.on('xpChanged', (data) => {
            this.updateXPBar(data.current, data.toNext, data.level);
        });
        
        // Charge updates
        this.scene.events.on('chargesChanged', (data) => {
            this.updateChargeUI(data.charges, data.groups);
        });
        
        // Wave updates
        this.scene.events.on('waveStarted', (data) => {
            this.updateWaveText(data.wave, data.name);
        });
        
        // Enemy count updates
        this.scene.events.on('enemyKilled', () => {
            this.updateEnemyCounter();
        });
        
        this.scene.events.on('enemySpawned', () => {
            this.updateEnemyCounter();
        });
    }
    
    createUI() {
        // Create health bar
        this.createHealthBar();
        
        // Create XP bar
        this.createXPBar();
        
        // Create charge UI
        this.createChargeUI();
        
        // Create wave text
        this.createWaveText();
        
        // Create enemy counter
        this.createEnemyCounter();
        
        // Create FPS display (if debug mode)
        if (this.scene.debugMode) {
            this.createDebugUI();
        }
    }
    
    createHealthBar() {
        const x = 50;
        const y = 30;
        const width = 200;
        const height = 20;
        
        // Background
        const bgBar = this.scene.add.rectangle(x, y, width, height, 0x000000);
        bgBar.setOrigin(0, 0.5);
        bgBar.setStrokeStyle(2, 0xffffff);
        bgBar.setScrollFactor(0);
        bgBar.setDepth(100);
        
        // Health fill
        const healthFill = this.scene.add.rectangle(x, y, width, height, 0xff0000);
        healthFill.setOrigin(0, 0.5);
        healthFill.setScrollFactor(0);
        healthFill.setDepth(101);
        
        // Health text
        const healthText = this.scene.add.text(x + width / 2, y, '3/3', {
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        healthText.setOrigin(0.5);
        healthText.setScrollFactor(0);
        healthText.setDepth(102);
        
        this.healthBar = {
            bg: bgBar,
            fill: healthFill,
            text: healthText,
            maxWidth: width
        };
    }
    
    createXPBar() {
        const x = 50;
        const y = 60;
        const width = 200;
        const height = 15;
        
        // Background
        const bgBar = this.scene.add.rectangle(x, y, width, height, 0x000000);
        bgBar.setOrigin(0, 0.5);
        bgBar.setStrokeStyle(2, 0x0000ff);
        bgBar.setScrollFactor(0);
        bgBar.setDepth(100);
        
        // XP fill
        const xpFill = this.scene.add.rectangle(x, y, 0, height, 0x0099ff);
        xpFill.setOrigin(0, 0.5);
        xpFill.setScrollFactor(0);
        xpFill.setDepth(101);
        
        // Level text
        const levelText = this.scene.add.text(x - 5, y, 'Lv1', {
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        levelText.setOrigin(1, 0.5);
        levelText.setScrollFactor(0);
        levelText.setDepth(102);
        
        this.xpBar = {
            bg: bgBar,
            fill: xpFill,
            levelText: levelText,
            maxWidth: width
        };
    }
    
    createChargeUI() {
        const startX = UI_CONFIG.chargeUIStartX;
        const startY = UI_CONFIG.chargeUIStartY;
        const spacing = UI_CONFIG.chargeSpacing;
        
        // Create charge slots
        for (let i = 0; i < 7; i++) {
            const x = startX + i * spacing;
            const y = startY;
            
            // Background circle
            const bg = this.scene.add.circle(x, y, 18, 0x222222);
            bg.setStrokeStyle(2, 0x222222);
            bg.setScrollFactor(0);
            bg.setDepth(100);
            bg.setVisible(false);
            
            // Element sprite
            const sprite = this.scene.add.sprite(x, y, 'element-symbols', 0);
            sprite.setScale(0.1);
            sprite.setScrollFactor(0);
            sprite.setDepth(101);
            sprite.setVisible(false);
            
            // Link indicator
            const link = this.scene.add.rectangle(x + spacing / 2, y, spacing - 10, 4, 0xffd700);
            link.setScrollFactor(0);
            link.setDepth(99);
            link.setVisible(false);
            
            this.chargeIndicators.push({
                bg: bg,
                sprite: sprite,
                link: link,
                cooldownBar: null
            });
        }
    }
    
    createWaveText() {
        this.waveText = this.scene.add.text(400, 30, 'Wave 1', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.waveText.setOrigin(0.5);
        this.waveText.setScrollFactor(0);
        this.waveText.setDepth(100);
    }
    
    createEnemyCounter() {
        this.enemyCounter = this.scene.add.text(750, 30, 'Enemies: 0', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.enemyCounter.setOrigin(1, 0.5);
        this.enemyCounter.setScrollFactor(0);
        this.enemyCounter.setDepth(100);
    }
    
    createDebugUI() {
        // FPS counter
        this.fpsText = this.scene.add.text(10, 580, 'FPS: 0', {
            fontSize: '14px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        });
        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(200);
        
        // Update FPS every frame
        this.scene.events.on('update', () => {
            this.fpsText.setText(`FPS: ${Math.round(this.scene.game.loop.actualFps)}`);
        });
    }
    
    updateHealthBar(current, max) {
        if (!this.healthBar) return;
        
        const percentage = current / max;
        const width = this.healthBar.maxWidth * percentage;
        
        this.healthBar.fill.width = width;
        this.healthBar.text.setText(`${current}/${max}`);
        
        // Change color based on health percentage
        if (percentage > 0.6) {
            this.healthBar.fill.setFillStyle(0x00ff00);
        } else if (percentage > 0.3) {
            this.healthBar.fill.setFillStyle(0xffff00);
        } else {
            this.healthBar.fill.setFillStyle(0xff0000);
        }
    }
    
    updateXPBar(current, toNext, level) {
        if (!this.xpBar) return;
        
        const percentage = current / toNext;
        const width = this.xpBar.maxWidth * percentage;
        
        this.xpBar.fill.width = width;
        this.xpBar.levelText.setText(`Lv${level}`);
    }
    
    updateChargeUI(charges, groups) {
        // Hide all indicators first
        this.chargeIndicators.forEach(indicator => {
            indicator.bg.setVisible(false);
            indicator.sprite.setVisible(false);
            indicator.link.setVisible(false);
        });
        
        // Show active charges
        charges.forEach((element, index) => {
            if (index < this.chargeIndicators.length) {
                const indicator = this.chargeIndicators[index];
                const config = ELEMENT_CONFIG[element];
                
                if (config) {
                    indicator.bg.setVisible(true);
                    indicator.sprite.setVisible(true);
                    indicator.sprite.setTexture(config.sheet, config.frame);
                    indicator.bg.setStrokeStyle(2, parseInt(config.color.replace('#', '0x')));
                }
            }
        });
        
        // Show links
        let chargeIndex = 0;
        groups.forEach(group => {
            for (let i = 0; i < group.length - 1; i++) {
                if (chargeIndex + i < this.chargeIndicators.length - 1) {
                    this.chargeIndicators[chargeIndex + i].link.setVisible(true);
                }
            }
            chargeIndex += group.length;
        });
    }
    
    updateWaveText(waveNumber, waveName) {
        if (!this.waveText) return;
        
        this.waveText.setText(`Wave ${waveNumber}: ${waveName}`);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: this.waveText,
            scale: 1.2,
            duration: 300,
            yoyo: true,
            ease: 'Power2'
        });
    }
    
    updateEnemyCounter() {
        if (!this.enemyCounter) return;
        
        const count = this.scene.enemyManager?.getEnemyCount() || 0;
        this.enemyCounter.setText(`Enemies: ${count}`);
    }
    
    showDamageNumber(x, y, damage, color = '#ffff00') {
        const damageText = this.scene.add.text(x, y, damage.toString(), {
            fontSize: '24px',
            color: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        damageText.setOrigin(0.5);
        damageText.setDepth(150);
        
        // Animate
        this.scene.tweens.add({
            targets: damageText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    
    showNotification(text, duration = 2000) {
        const notification = this.scene.add.text(400, 200, text, {
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        notification.setOrigin(0.5);
        notification.setScrollFactor(0);
        notification.setDepth(200);
        
        // Fade in
        notification.setAlpha(0);
        this.scene.tweens.add({
            targets: notification,
            alpha: 1,
            duration: 300
        });
        
        // Fade out after duration
        this.scene.time.delayedCall(duration, () => {
            this.scene.tweens.add({
                targets: notification,
                alpha: 0,
                duration: 300,
                onComplete: () => notification.destroy()
            });
        });
    }
    
    showLevelUp() {
        const levelUpText = this.scene.add.text(400, 150, 'LEVEL UP!', {
            fontSize: '48px',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });
        levelUpText.setOrigin(0.5);
        levelUpText.setScrollFactor(0);
        levelUpText.setDepth(200);
        levelUpText.setScale(0);
        
        // Animate
        this.scene.tweens.add({
            targets: levelUpText,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => {
                this.scene.time.delayedCall(1000, () => {
                    this.scene.tweens.add({
                        targets: levelUpText,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => levelUpText.destroy()
                    });
                });
            }
        });
    }
}