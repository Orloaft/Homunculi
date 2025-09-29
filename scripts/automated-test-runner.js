/**
 * WizBiz Automated Test Runner
 * Comprehensive testing framework for crash detection and game validation
 */

class AutomatedTestRunner {
    constructor() {
        this.game = null;
        this.testResults = [];
        this.errors = [];
        this.warnings = [];
        this.startTime = null;
        this.isRunning = false;
        this.currentTest = null;
        this.metrics = {
            fps: [],
            memory: [],
            entityCounts: [],
            sceneTransitions: 0,
            spellsCast: 0,
            enemiesKilled: 0,
            bossesSpawned: 0
        };
        
        // Test configuration
        this.config = {
            verbose: true,
            headless: false,
            timeoutMs: 60000,
            performanceThresholds: {
                minFPS: 30,
                maxMemoryMB: 500,
                maxEntities: 1000,
                maxLoadTimeMs: 5000
            }
        };

        this.setupErrorHandlers();
        this.initializeGame();
    }

    /**
     * Setup global error handlers to catch crashes
     */
    setupErrorHandlers() {
        // Catch uncaught errors
        window.addEventListener('error', (event) => {
            this.logError(`Uncaught error: ${event.message}`, {
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });
            event.preventDefault();
        });

        // Catch promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError(`Unhandled promise rejection: ${event.reason}`, {
                promise: event.promise,
                reason: event.reason
            });
            event.preventDefault();
        });

        // Override console.error to capture all errors
        const originalError = console.error;
        console.error = (...args) => {
            this.logError('Console error', args);
            originalError.apply(console, args);
        };

        // Monitor Phaser errors
        if (window.Phaser) {
            const originalPhaserError = Phaser.Events.EventEmitter.prototype.emit;
            Phaser.Events.EventEmitter.prototype.emit = function(event, ...args) {
                if (event === 'error' || event.includes('error')) {
                    testRunner.logError(`Phaser error event: ${event}`, args);
                }
                return originalPhaserError.apply(this, [event, ...args]);
            };
        }
    }

    /**
     * Initialize the game with test configuration
     */
    initializeGame() {
        const testConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [LoadingScene, TitleScene, StageSelectScene, GameScene, GameOverScene, TalentTreeScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            callbacks: {
                preBoot: () => this.log('Game pre-boot'),
                postBoot: () => {
                    this.log('Game initialized successfully');
                    this.hookIntoGame();
                }
            }
        };

        try {
            this.game = new Phaser.Game(testConfig);
        } catch (error) {
            this.logError('Failed to initialize game', error);
        }
    }

    /**
     * Hook into game systems for monitoring
     */
    hookIntoGame() {
        if (!this.game) return;

        // Monitor scene transitions
        this.game.scene.scenes.forEach(scene => {
            scene.events.on('start', () => {
                this.log(`Scene started: ${scene.scene.key}`, 'info');
                this.metrics.sceneTransitions++;
            });

            scene.events.on('shutdown', () => {
                this.log(`Scene shutdown: ${scene.scene.key}`, 'info');
            });

            // Hook into update loop for metrics
            const originalUpdate = scene.update;
            if (originalUpdate) {
                scene.update = function(...args) {
                    testRunner.collectMetrics(this);
                    return originalUpdate.apply(this, args);
                };
            }
        });

        // Start performance monitoring
        this.startPerformanceMonitoring();
    }

    /**
     * Collect performance metrics
     */
    collectMetrics(scene) {
        if (!this.isRunning || !scene.game) return;

        // FPS
        const fps = Math.round(scene.game.loop.actualFps);
        this.metrics.fps.push(fps);
        document.getElementById('fps-value').textContent = fps;

        // Memory usage
        if (performance.memory) {
            const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
            this.metrics.memory.push(memoryMB);
            document.getElementById('memory-value').textContent = memoryMB;
        }

        // Entity count
        if (scene.enemies) {
            const entityCount = scene.enemies.children ? scene.enemies.children.size : 0;
            this.metrics.entityCounts.push(entityCount);
            document.getElementById('entity-count').textContent = entityCount;
        }

        // Check performance thresholds
        if (fps < this.config.performanceThresholds.minFPS) {
            this.logWarning(`Low FPS detected: ${fps}`);
        }
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        setInterval(() => {
            if (this.isRunning) {
                const elapsed = Math.round((Date.now() - this.startTime) / 1000);
                document.getElementById('test-time').textContent = `${elapsed}s`;
            }
        }, 1000);
    }

    /**
     * Run full test suite
     */
    async startFullTest() {
        this.log('Starting full test suite', 'info');
        this.isRunning = true;
        this.startTime = Date.now();
        this.errors = [];
        this.warnings = [];
        
        document.getElementById('test-status').textContent = 'Running...';

        try {
            // Test sequence
            await this.testSceneTransitions();
            await this.wait(2000);
            await this.testGameplay();
            await this.wait(2000);
            await this.testElementSystem();
            await this.wait(2000);
            await this.testBossSystem();
            await this.wait(2000);
            await this.testPerformance();
            
            this.log('Full test suite completed', 'success');
        } catch (error) {
            this.logError('Test suite failed', error);
        } finally {
            this.stopTests();
        }
    }

    /**
     * Test scene transitions
     */
    async testSceneTransitions() {
        this.log('Testing scene transitions...', 'info');
        this.currentTest = 'Scene Transitions';

        const scenes = ['TitleScene', 'StageSelectScene', 'GameScene'];
        
        for (const sceneName of scenes) {
            try {
                this.log(`Transitioning to ${sceneName}`);
                const scene = this.game.scene.getScene(sceneName);
                
                if (scene) {
                    this.game.scene.start(sceneName);
                    await this.wait(3000); // Wait for scene to load
                    
                    if (this.game.scene.isActive(sceneName)) {
                        this.log(`✓ ${sceneName} loaded successfully`, 'success');
                    } else {
                        this.logError(`${sceneName} failed to activate`);
                    }
                } else {
                    this.logError(`Scene ${sceneName} not found`);
                }
            } catch (error) {
                this.logError(`Failed to transition to ${sceneName}`, error);
            }
        }
    }

    /**
     * Test gameplay mechanics
     */
    async testGameplay() {
        this.log('Testing gameplay mechanics...', 'info');
        this.currentTest = 'Gameplay';

        try {
            // Start game scene
            this.game.scene.start('GameScene', {
                stage: 'forestland',
                playerNumber: 1,
                p1Character: 'wizard'
            });
            
            await this.wait(3000);
            
            const gameScene = this.game.scene.getScene('GameScene');
            if (!gameScene || !gameScene.wizard) {
                this.logError('Game scene or wizard not initialized');
                return;
            }

            // Test player movement
            this.log('Testing player movement');
            const startX = gameScene.wizard.x;
            const startY = gameScene.wizard.y;
            
            // Simulate movement
            gameScene.wizard.x += 100;
            gameScene.wizard.y += 100;
            await this.wait(500);
            
            if (gameScene.wizard.x !== startX || gameScene.wizard.y !== startY) {
                this.log('✓ Player movement working', 'success');
            }

            // Test spell casting
            this.log('Testing spell system');
            if (gameScene.spellSystem) {
                try {
                    gameScene.spellSystem.castSpell(gameScene.wizard);
                    this.metrics.spellsCast++;
                    this.log('✓ Spell cast successfully', 'success');
                } catch (error) {
                    this.logError('Spell casting failed', error);
                }
            }

            // Test enemy spawning
            this.log('Testing enemy spawning');
            if (gameScene.spawnEnemy) {
                try {
                    for (let i = 0; i < 5; i++) {
                        gameScene.spawnEnemy();
                        await this.wait(100);
                    }
                    const enemyCount = gameScene.enemies.children.size;
                    if (enemyCount > 0) {
                        this.log(`✓ Spawned ${enemyCount} enemies`, 'success');
                    }
                } catch (error) {
                    this.logError('Enemy spawning failed', error);
                }
            }

            // Test collision detection
            this.log('Testing collision detection');
            if (gameScene.physics && gameScene.enemies.children.size > 0) {
                const enemy = gameScene.enemies.children.entries[0];
                enemy.x = gameScene.wizard.x;
                enemy.y = gameScene.wizard.y;
                await this.wait(500);
                this.log('✓ Collision test completed', 'success');
            }

        } catch (error) {
            this.logError('Gameplay test failed', error);
        }
    }

    /**
     * Test element fusion system
     */
    async testElementSystem() {
        this.log('Testing element system...', 'info');
        this.currentTest = 'Element System';

        const gameScene = this.game.scene.getScene('GameScene');
        if (!gameScene) {
            this.logError('Game scene not available');
            return;
        }

        // Test element combinations
        const testCombinations = [
            ['fire', 'water', 'steam'],
            ['fire', 'earth', 'lava'],
            ['water', 'air', 'ice'],
            ['lightning', 'water', 'storm']
        ];

        for (const [elem1, elem2, expected] of testCombinations) {
            try {
                if (gameScene.elements && gameScene.elements[elem1] && gameScene.elements[elem2]) {
                    const fusion = gameScene.getFusionResult(elem1, elem2);
                    if (fusion === expected) {
                        this.log(`✓ ${elem1} + ${elem2} = ${expected}`, 'success');
                    } else {
                        this.logWarning(`Fusion mismatch: ${elem1} + ${elem2} = ${fusion} (expected ${expected})`);
                    }
                }
            } catch (error) {
                this.logError(`Failed to test fusion ${elem1} + ${elem2}`, error);
            }
        }
    }

    /**
     * Test boss system
     */
    async testBossSystem() {
        this.log('Testing boss system...', 'info');
        this.currentTest = 'Boss System';

        const gameScene = this.game.scene.getScene('GameScene');
        if (!gameScene) return;

        try {
            // Spawn a boss
            if (gameScene.spawnBoss) {
                gameScene.survivalTime = 120; // Trigger boss spawn time
                gameScene.spawnBoss('obelisk');
                await this.wait(2000);
                
                if (gameScene.boss) {
                    this.log('✓ Boss spawned successfully', 'success');
                    this.metrics.bossesSpawned++;
                    
                    // Test boss AI
                    if (gameScene.updateBossAI) {
                        gameScene.updateBossAI();
                        this.log('✓ Boss AI update successful', 'success');
                    }
                }
            }
        } catch (error) {
            this.logError('Boss system test failed', error);
        }
    }

    /**
     * Performance stress test
     */
    async testPerformance() {
        this.log('Running performance stress test...', 'info');
        this.currentTest = 'Performance';

        const gameScene = this.game.scene.getScene('GameScene');
        if (!gameScene) return;

        try {
            // Spawn many enemies
            this.log('Spawning 100 enemies for stress test');
            for (let i = 0; i < 100; i++) {
                if (gameScene.spawnEnemy) {
                    gameScene.spawnEnemy();
                }
                if (i % 10 === 0) await this.wait(100);
            }

            await this.wait(5000);

            // Check performance
            const avgFPS = this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length;
            const maxMemory = Math.max(...this.metrics.memory);
            const maxEntities = Math.max(...this.metrics.entityCounts);

            this.log(`Average FPS: ${avgFPS.toFixed(2)}`, avgFPS > 30 ? 'success' : 'warning');
            this.log(`Max Memory: ${maxMemory}MB`, maxMemory < 500 ? 'success' : 'warning');
            this.log(`Max Entities: ${maxEntities}`, maxEntities < 1000 ? 'success' : 'warning');

        } catch (error) {
            this.logError('Performance test failed', error);
        }
    }

    /**
     * Stop all tests
     */
    stopTests() {
        this.isRunning = false;
        document.getElementById('test-status').textContent = 'Stopped';
        this.log('Tests stopped', 'info');
        this.generateReport();
    }

    /**
     * Generate test report
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            errors: this.errors.length,
            warnings: this.warnings.length,
            metrics: {
                avgFPS: this.metrics.fps.length ? (this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length).toFixed(2) : 0,
                maxMemory: this.metrics.memory.length ? Math.max(...this.metrics.memory) : 0,
                maxEntities: this.metrics.entityCounts.length ? Math.max(...this.metrics.entityCounts) : 0,
                sceneTransitions: this.metrics.sceneTransitions,
                spellsCast: this.metrics.spellsCast,
                enemiesKilled: this.metrics.enemiesKilled,
                bossesSpawned: this.metrics.bossesSpawned
            },
            errors: this.errors,
            warnings: this.warnings,
            testResults: this.testResults
        };

        this.log('Test Report Generated', 'success');
        console.log('Full Report:', report);
        return report;
    }

    /**
     * Export test report to file
     */
    exportReport() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.log('Report exported', 'success');
    }

    /**
     * Utility: Wait for specified milliseconds
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Logging utilities
     */
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        
        const logDiv = document.getElementById('test-log');
        const entry = document.createElement('div');
        entry.className = type;
        entry.textContent = logEntry;
        logDiv.appendChild(entry);
        logDiv.scrollTop = logDiv.scrollHeight;

        this.testResults.push({ timestamp, message, type });
        
        if (this.config.verbose) {
            console.log(logEntry);
        }
    }

    logError(message, details = null) {
        this.errors.push({ message, details, timestamp: new Date().toISOString() });
        this.log(`ERROR: ${message}`, 'error');
        document.getElementById('error-count').textContent = this.errors.length;
        
        if (details) {
            console.error(details);
        }
    }

    logWarning(message, details = null) {
        this.warnings.push({ message, details, timestamp: new Date().toISOString() });
        this.log(`WARNING: ${message}`, 'warning');
        
        if (details) {
            console.warn(details);
        }
    }
}

// Initialize test runner
const testRunner = new AutomatedTestRunner();

// Expose to global scope for console access
window.testRunner = testRunner;

// Auto-start tests if query parameter present
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('autostart') === 'true') {
    setTimeout(() => testRunner.startFullTest(), 3000);
}