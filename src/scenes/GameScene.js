import { GAME_CONFIG, PLAYER_CONFIG } from '../data/GameConstants.js';
import { InputManager } from '../utils/InputManager.js';
import { PlayerController } from '../systems/player/PlayerController.js';
import { PlayerStats } from '../systems/player/PlayerStats.js';
import { ChargeSystem } from '../systems/player/ChargeSystem.js';
import { EnemyManager } from '../systems/enemies/EnemyManager.js';
import { WaveSystem } from '../systems/enemies/WaveSystem.js';
import { ProjectileManager } from '../systems/combat/ProjectileManager.js';
import { DamageSystem } from '../systems/combat/DamageSystem.js';
import { UIManager } from '../systems/ui/UIManager.js';
import { PlayerFactory } from '../entities/PlayerFactory.js';
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    init(data) {
        this.debugMode = data?.debugMode || false;
        this.stage = data?.stage || 'forest'; // Default to forest stage
        this.p1Character = data?.p1Character || 'wizard';
        this.p2Character = data?.p2Character || null;
        this.coopMode = data?.coopMode || false;
        this.p2Joined = data?.p2Joined || false;
    }
    create() {
        // Fade in from black
        this.cameras.main.fadeIn(800, 0, 0, 0);
        // Create world
        this.createWorld();
        // Create wizard
        this.createWizard();
        // Initialize systems
        this.initializeSystems();
        // Setup collisions
        this.setupCollisions();
        // Setup camera
        this.setupCamera();
        // Add debug stage name display
        this.createStageDebugDisplay();
        // Start game sequence
        this.startGameSequence();
    }
    createWorld() {
        // Set world bounds
        this.physics.world.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
        // Create floor based on stage type
        const tileName = this.stage === 'cave' ? 'stone-tile' : 'grass-tile';
        this.floor = this.add.tileSprite(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight, tileName);
        this.floor.setOrigin(0, 0);
        this.floor.setDepth(-1);
        // Add stage-specific decorations
        if (this.stage === 'cave') {
            // Create invisible barriers for cave
            this.createInvisibleBarriers();
        } else {
            // Add trees for forest
            //this.createTrees();
            pass
        }
    }
    createTrees() {
        const treeCount = 50;
        for (let i = 0; i < treeCount; i++) {
            const x = Phaser.Math.Between(100, GAME_CONFIG.worldWidth - 100);
            const y = Phaser.Math.Between(100, GAME_CONFIG.worldHeight - 100);
            const tree = this.add.image(x, y, 'tree');
            tree.setScale(Phaser.Math.FloatBetween(0.8, 1.2));
            tree.setDepth(y / 10);
            tree.setAlpha(0.8);
        }
    }
    createInvisibleBarriers() {
        // Create invisible physics bodies for the world boundaries
        const thickness = 50;
        // Top barrier
        const topBarrier = this.physics.add.staticImage(GAME_CONFIG.worldWidth / 2, thickness / 2, null);
        topBarrier.setSize(GAME_CONFIG.worldWidth, thickness);
        topBarrier.setVisible(false);
        // Bottom barrier
        const bottomBarrier = this.physics.add.staticImage(GAME_CONFIG.worldWidth / 2, GAME_CONFIG.worldHeight - thickness / 2, null);
        bottomBarrier.setSize(GAME_CONFIG.worldWidth, thickness);
        bottomBarrier.setVisible(false);
        // Left barrier
        const leftBarrier = this.physics.add.staticImage(thickness / 2, GAME_CONFIG.worldHeight / 2, null);
        leftBarrier.setSize(thickness, GAME_CONFIG.worldHeight);
        leftBarrier.setVisible(false);
        // Right barrier
        const rightBarrier = this.physics.add.staticImage(GAME_CONFIG.worldWidth - thickness / 2, GAME_CONFIG.worldHeight / 2, null);
        rightBarrier.setSize(thickness, GAME_CONFIG.worldHeight);
        rightBarrier.setVisible(false);
        // Store barriers for collision setup
        this.barriers = [topBarrier, bottomBarrier, leftBarrier, rightBarrier];
    }
    createWizard() {
        // Create P1 character at center of world
        const centerX = GAME_CONFIG.worldWidth / 2;
        const centerY = GAME_CONFIG.worldHeight / 2;
        // Create P1 player
        this.wizard = PlayerFactory.createPlayer(this, centerX, centerY, this.p1Character, false);
        // Create P2 player if in co-op mode
        if (this.coopMode && this.p2Joined && this.p2Character) {
            const p2X = centerX + 100;
            const p2Y = centerY;
            this.wizard2 = PlayerFactory.createPlayer(this, p2X, p2Y, this.p2Character, true);
            // Initialize P2 controller
            this.player2Controller = new PlayerController(this, this.wizard2);
        }
        // Animations now registered centrally in LoadingScene via AnimationRegistry
    }
    initializeSystems() {
        // Core systems
        this.inputManager = new InputManager(this);
        this.playerController = new PlayerController(this, this.wizard);
        this.playerStats = new PlayerStats(this);
        this.chargeSystem = new ChargeSystem(this);
        // Combat systems
        this.projectileManager = new ProjectileManager(this);
        this.damageSystem = new DamageSystem(this);
        // Enemy systems
        this.enemyManager = new EnemyManager(this);
        this.waveSystem = new WaveSystem(this);
        // UI system
        this.uiManager = new UIManager(this);
        // Game state
        this.gameStarted = false;
        this.isPaused = false;
        // Setup event handlers
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        // Level up event
        this.events.on('levelUp', (data) => {
            this.uiManager.showLevelUp();
            // Spawn chests
            if (data.shouldSpawnDarkEye) {
                this.spawnLevelUpDarkEye();
            } else {
                this.spawnLevelUpChest();
            }
        });
        // Player death
        this.events.on('playerDied', () => {
            this.handlePlayerDeath();
        });
        // Item drops
        this.events.on('spawnDrop', (data) => {
            this.spawnDrop(data);
        });
    }
    setupCollisions() {
        // Projectiles vs Enemies
        this.physics.add.overlap(
            this.projectileManager.projectiles,
            this.enemyManager.enemies,
            (projectile, enemy) => {
                this.projectileManager.handleProjectileHit(projectile, enemy);
            }
        );
        // Enemies vs Players
        const players = [this.wizard];
        if (this.wizard2) players.push(this.wizard2);
        players.forEach(player => {
            this.physics.add.overlap(
                player,
                this.enemyManager.enemies,
                (wizard, enemy) => {
                    this.damageSystem.damagePlayer(enemy.damage || 1, enemy, player === this.wizard2);
                }
            );
            // Enemy projectiles vs Players
            this.physics.add.overlap(
                player,
                this.enemyManager.enemyProjectiles,
                (wizard, projectile) => {
                    this.damageSystem.damagePlayer(projectile.damage || 1, projectile, player === this.wizard2);
                    projectile.destroy();
                }
            );
            // Water orbs vs Players (healing)
            this.physics.add.overlap(
                player,
                this.projectileManager.waterOrbs,
                (wizard, orb) => {
                    const healed = this.playerStats.heal(orb.healAmount || 1);
                    if (healed > 0) {
                        this.uiManager.showNotification(`+${healed} HP`, 1000);
                        orb.destroy();
                    }
                }
            );
        });
        // If in cave stage, add collisions with invisible barriers
        if (this.stage === 'cave' && this.barriers) {
            this.barriers.forEach(barrier => {
                // Player collisions with barriers
                players.forEach(player => {
                    this.physics.add.collider(player, barrier);
                });
                // Enemy collision with barriers
                this.physics.add.collider(this.enemyManager.enemies, barrier);
            });
        }
    }
    setupCamera() {
        // Main camera follows wizard
        this.cameras.main.startFollow(this.wizard);
        this.cameras.main.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
        // Set zoom if needed
        this.cameras.main.setZoom(1);
    }
    createStageDebugDisplay() {
        // Create debug text showing current stage
        const debugText = this.add.text(400, 50, `Stage: ${this.stage.toUpperCase()}`, {
            fontSize: '32px',
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 6,
            fontStyle: 'bold'
        });
        debugText.setOrigin(0.5, 0); // Center horizontally
        debugText.setScrollFactor(0); // Keep it fixed on screen
        debugText.setDepth(10000); // Make sure it's on top of everything
        // Also log to console
        }
    startGameSequence() {
        // Fade in
        this.cameras.main.fadeIn(500);
        // Create countdown
        this.createCountdown();
    }
    createCountdown() {
        const countdownNumbers = ['3', '2', '1', 'GO!'];
        let index = 0;
        const showNumber = () => {
            const isGo = countdownNumbers[index] === 'GO!';
            const text = this.add.text(400, 300, countdownNumbers[index], {
                fontSize: isGo ? '96px' : '72px',
                color: isGo ? '#00ff00' : '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            });
            text.setOrigin(0.5);
            text.setScrollFactor(0);
            text.setDepth(200);
            text.setScale(0);
            // Animate
            this.tweens.add({
                targets: text,
                scale: 1,
                duration: 300,
                ease: 'Back.out',
                onComplete: () => {
                    const delay = isGo ? 800 : 500; // Show GO! a bit longer
                    this.time.delayedCall(delay, () => {
                        this.tweens.add({
                            targets: text,
                            scale: 0,
                            duration: 200,
                            onComplete: () => {
                                text.destroy();
                                index++;
                                if (index < countdownNumbers.length) {
                                    showNumber();
                                } else {
                                    // Start game directly
                                    this.startGame();
                                }
                            }
                        });
                    });
                }
            });
        };
        showNumber();
    }
    openChest(wizard, chest) {
        // This would be imported from a ChestUI system in a full implementation
        // For now, simplified version
        this.physics.pause();
        // Create simple element selection
        const elements = ['fire', 'water', 'earth'];
        const buttons = [];
        const bg = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.9);
        bg.setScrollFactor(0);
        bg.setDepth(200);
        elements.forEach((element, index) => {
            const x = 250 + index * 150;
            const y = 300;
            const button = this.add.rectangle(x, y, 120, 150, 0x333333);
            button.setInteractive({ useHandCursor: true });
            button.setScrollFactor(0);
            button.setDepth(201);
            const text = this.add.text(x, y, element.toUpperCase(), {
                fontSize: '20px',
                color: '#ffffff'
            });
            text.setOrigin(0.5);
            text.setScrollFactor(0);
            text.setDepth(202);
            button.on('pointerdown', () => {
                // Add element to charges
                this.chargeSystem.addCharge(element);
                // Clean up
                bg.destroy();
                buttons.forEach(b => b.destroy());
                // Always resume physics
                this.physics.resume();
            });
            buttons.push(button);
            buttons.push(text);
        });
    }
    startGame() {
        this.gameStarted = true;
        // Start with no charges
        // Initialize wave system
        this.waveSystem.startWave(1);
        // Enable auto-shooting
        this.chargeSystem.autoShootEnabled = true;
        // Trigger level up immediately
        this.time.delayedCall(1000, () => {
            this.events.emit('levelUp', {
                level: 1,
                shouldSpawnDarkEye: false
            });
        });
    }
    spawnLevelUpChest() {
        const x = this.wizard.x + Phaser.Math.Between(-100, 100);
        const y = this.wizard.y + Phaser.Math.Between(-100, 100);
        const chest = this.physics.add.sprite(x, y, 'chest');
        chest.setScale(1.5);
        // Add collision to open
        this.physics.add.overlap(this.wizard, chest, () => {
            this.openChest(this.wizard, chest);
            chest.destroy();
        });
    }
    spawnLevelUpDarkEye() {
        // Spawn dark eye boss
        const angle = Math.random() * Math.PI * 2;
        const distance = 300;
        const x = this.wizard.x + Math.cos(angle) * distance;
        const y = this.wizard.y + Math.sin(angle) * distance;
        this.enemyManager.spawnEnemy('darkeye', x, y);
    }
    spawnDrop(data) {
        const { type, x, y, value } = data;
        let pickup;
        switch (type) {
            case 'xp':
                pickup = this.physics.add.sprite(x, y, 'jewel-xp');
                pickup.xpValue = value || 10;
                break;
            case 'health':
                pickup = this.physics.add.sprite(x, y, 'muffin');
                pickup.healAmount = 1;
                break;
            case 'elementOrb':
                pickup = this.physics.add.sprite(x, y, 'element-orb');
                pickup.isElementOrb = true;
                break;
            case 'chargeExpansion':
                pickup = this.createChargeExpansionPickup(x, y);
                break;
        }
        if (pickup) {
            // Add float animation
            this.tweens.add({
                targets: pickup,
                y: y - 10,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            // Add collision
            this.physics.add.overlap(this.wizard, pickup, () => {
                this.collectPickup(pickup);
            });
        }
    }
    createChargeExpansionPickup(x, y) {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xaa00ff, 1);
        graphics.fillRect(5, 0, 10, 20);
        graphics.fillRect(0, 5, 20, 10);
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(10, 10, 3);
        graphics.generateTexture('charge-expansion', 20, 20);
        graphics.destroy();
        const pickup = this.physics.add.sprite(x, y, 'charge-expansion');
        pickup.isChargeExpansion = true;
        return pickup;
    }
    collectPickup(pickup) {
        if (pickup.xpValue) {
            this.playerStats.addXP(pickup.xpValue);
        } else if (pickup.healAmount) {
            const healed = this.playerStats.heal(pickup.healAmount);
            if (healed > 0) {
                this.uiManager.showNotification(`+${healed} HP`, 1000);
            }
        } else if (pickup.isElementOrb) {
            // Random element
            const elements = ['fire', 'water', 'earth', 'air', 'rock', 'poison'];
            const element = elements[Math.floor(Math.random() * elements.length)];
            if (this.chargeSystem.addCharge(element)) {
                this.uiManager.showNotification(`${element.toUpperCase()} ORB!`, 1500);
            }
        } else if (pickup.isChargeExpansion) {
            if (this.chargeSystem.expandMaxCharges()) {
                this.uiManager.showNotification('CHARGE SLOT EXPANDED!', 2000);
            }
        }
        this.events.emit('itemCollected', pickup);
        pickup.destroy();
    }
    handlePlayerDeath() {
        this.playerController.die();
        // Stop gameplay
        this.gameStarted = false;
        this.physics.pause();
        // Show game over after delay
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverScene', this.playerStats.getStats());
        });
    }
    update(time, delta) {
        if (!this.gameStarted || this.isPaused) return;
        // Update input
        this.inputManager.update();
        // Update player movement and animations
        const movement = this.inputManager.getMovement();
        const isMoving = movement.x !== 0 || movement.y !== 0;
        // Update P1
        this.playerController.update(this.inputManager);
        PlayerFactory.updatePlayerAnimation(this.wizard, isMoving, movement);
        // Update P2 if present
        if (this.wizard2 && this.player2Controller) {
            // For now, P2 uses same input (can be changed to different controller)
            this.player2Controller.update(this.inputManager);
            PlayerFactory.updatePlayerAnimation(this.wizard2, isMoving, movement);
        }
        // Update systems
        this.enemyManager.update(time, delta);
        this.waveSystem.update(time, delta);
        this.projectileManager.update(time, delta);
        this.chargeSystem.updateCooldowns(delta);
        this.playerStats.updateSurvivalTime(delta);
        // Handle auto-shooting
        if (this.chargeSystem.shouldAutoFire(time)) {
            this.autoFire();
            this.chargeSystem.updateAutoFireTime(time);
        }
        // Handle pause
        if (this.inputManager.isButtonJustPressed('pause')) {
            this.togglePause();
        }
    }
    autoFire() {
        const groups = this.chargeSystem.getChargeGroups();
        const enemies = this.enemyManager.getAllEnemies();
        if (enemies.length === 0) return;
        // Find nearest enemy
        let nearestEnemy = null;
        let minDistance = Infinity;
        enemies.forEach(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(
                    this.wizard.x, this.wizard.y,
                    enemy.x, enemy.y
                );
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestEnemy = enemy;
                }
            }
        });
        if (nearestEnemy) {
            // Fire each charge group
            groups.forEach((group, index) => {
                if (this.chargeSystem.canFire(index)) {
                    this.projectileManager.fireProjectile(
                        this.wizard,
                        nearestEnemy,
                        group
                    );
                    // Set cooldown based on element fire rates
                    const fireRate = this.chargeSystem.getGroupFireRate(group);
                    const cooldown = 2000 / fireRate;
                    this.chargeSystem.setGroupCooldown(index, cooldown);
                }
            });
        }
    }
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.physics.pause();
            this.uiManager.showNotification('PAUSED', 999999);
        } else {
            this.physics.resume();
            // Hide pause notification
        }
    }
}