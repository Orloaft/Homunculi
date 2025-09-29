/**
 * Headless Test Runner for WizBiz
 * Run with: node test-headless.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

class HeadlessTestRunner {
    constructor(options = {}) {
        this.options = {
            headless: options.headless !== false,
            port: options.port || 8080,
            testDuration: options.testDuration || 60000, // 1 minute default
            screenshotOnError: options.screenshotOnError !== false,
            verbose: options.verbose || false,
            ...options
        };
        
        this.browser = null;
        this.page = null;
        this.server = null;
        this.results = {
            startTime: null,
            endTime: null,
            errors: [],
            warnings: [],
            crashes: [],
            performance: [],
            screenshots: []
        };
    }

    /**
     * Start local server to serve game files
     */
    async startServer() {
        return new Promise((resolve) => {
            this.server = http.createServer((request, response) => {
                return handler(request, response, {
                    public: __dirname
                });
            });

            this.server.listen(this.options.port, () => {
                console.log(`Server running at http://localhost:${this.options.port}/`);
                resolve();
            });
        });
    }

    /**
     * Initialize Puppeteer browser
     */
    async initBrowser() {
        console.log('Initializing browser...');
        
        this.browser = await puppeteer.launch({
            headless: this.options.headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials'
            ],
            defaultViewport: {
                width: 1024,
                height: 768
            }
        });

        this.page = await this.browser.newPage();

        // Setup error handlers
        await this.setupErrorHandlers();
        
        // Enable console logging
        this.page.on('console', msg => {
            if (this.options.verbose) {
                console.log('Browser console:', msg.text());
            }
            
            // Track errors and warnings
            if (msg.type() === 'error') {
                this.results.errors.push({
                    type: 'console-error',
                    message: msg.text(),
                    timestamp: new Date().toISOString()
                });
            } else if (msg.type() === 'warning') {
                this.results.warnings.push({
                    type: 'console-warning',
                    message: msg.text(),
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Track page crashes
        this.page.on('error', error => {
            console.error('Page crashed:', error);
            this.results.crashes.push({
                type: 'page-crash',
                error: error.toString(),
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            this.takeScreenshot('crash');
        });

        this.page.on('pageerror', error => {
            console.error('Page error:', error);
            this.results.errors.push({
                type: 'page-error',
                message: error.toString(),
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        });
    }

    /**
     * Setup error handlers in page context
     */
    async setupErrorHandlers() {
        await this.page.evaluateOnNewDocument(() => {
            // Track unhandled errors
            window.addEventListener('error', (event) => {
                console.error('Unhandled error:', event.message, {
                    filename: event.filename,
                    line: event.lineno,
                    column: event.colno
                });
            });

            // Track unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
            });

            // Track performance
            window.gamePerformance = {
                fps: [],
                memory: [],
                entityCounts: []
            };
        });
    }

    /**
     * Run automated tests
     */
    async runTests() {
        console.log('Starting automated tests...');
        this.results.startTime = new Date().toISOString();

        try {
            // Navigate to test page
            const url = `http://localhost:${this.options.port}/test-automation.html?autostart=true`;
            console.log(`Navigating to ${url}`);
            
            await this.page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            // Wait for game to initialize
            await this.page.waitForTimeout(5000);
            
            // Take initial screenshot
            await this.takeScreenshot('initial');

            // Monitor performance
            const performanceInterval = setInterval(async () => {
                try {
                    const metrics = await this.page.metrics();
                    const performance = await this.page.evaluate(() => {
                        const gameScene = window.game?.scene?.getScene('GameScene');
                        return {
                            fps: window.game?.loop?.actualFps || 0,
                            memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0,
                            entities: gameScene?.enemies?.children?.size || 0,
                            timestamp: new Date().toISOString()
                        };
                    });
                    
                    this.results.performance.push({
                        ...performance,
                        jsHeapUsed: metrics.JSHeapUsedSize,
                        jsHeapTotal: metrics.JSHeapTotalSize
                    });

                    // Check for performance issues
                    if (performance.fps < 20) {
                        console.warn(`Low FPS detected: ${performance.fps}`);
                        await this.takeScreenshot('low-fps');
                    }
                } catch (error) {
                    console.error('Error collecting metrics:', error);
                }
            }, 1000);

            // Run test sequences
            await this.testSceneTransitions();
            await this.testGameplay();
            await this.testMemoryLeaks();
            await this.stressTest();

            // Wait for test duration
            console.log(`Running for ${this.options.testDuration}ms...`);
            await this.page.waitForTimeout(this.options.testDuration);

            clearInterval(performanceInterval);

            // Get final test results from page
            const testResults = await this.page.evaluate(() => {
                return window.testRunner ? window.testRunner.generateReport() : null;
            });

            if (testResults) {
                this.results.testReport = testResults;
            }

            // Take final screenshot
            await this.takeScreenshot('final');

        } catch (error) {
            console.error('Test execution failed:', error);
            this.results.crashes.push({
                type: 'test-failure',
                error: error.toString(),
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            await this.takeScreenshot('error');
        }

        this.results.endTime = new Date().toISOString();
    }

    /**
     * Test scene transitions
     */
    async testSceneTransitions() {
        console.log('Testing scene transitions...');
        
        const scenes = ['TitleScene', 'StageSelectScene', 'GameScene'];
        
        for (const scene of scenes) {
            try {
                await this.page.evaluate((sceneName) => {
                    if (window.game) {
                        window.game.scene.start(sceneName);
                    }
                }, scene);
                
                await this.page.waitForTimeout(2000);
                
                const isActive = await this.page.evaluate((sceneName) => {
                    return window.game?.scene?.isActive(sceneName) || false;
                }, scene);
                
                if (isActive) {
                    console.log(`✓ ${scene} loaded successfully`);
                } else {
                    console.error(`✗ ${scene} failed to load`);
                    this.results.errors.push({
                        type: 'scene-load-failure',
                        scene: scene,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.error(`Error testing ${scene}:`, error);
            }
        }
    }

    /**
     * Test gameplay mechanics
     */
    async testGameplay() {
        console.log('Testing gameplay mechanics...');
        
        try {
            // Start game
            await this.page.evaluate(() => {
                if (window.game) {
                    window.game.scene.start('GameScene', {
                        stage: 'forestland',
                        playerNumber: 1,
                        p1Character: 'wizard'
                    });
                }
            });
            
            await this.page.waitForTimeout(3000);
            
            // Simulate player input
            await this.simulateMovement();
            await this.simulateSpellCasting();
            
            // Check game state
            const gameState = await this.page.evaluate(() => {
                const scene = window.game?.scene?.getScene('GameScene');
                return {
                    hasPlayer: !!scene?.wizard,
                    playerHealth: scene?.wizard?.health || 0,
                    enemyCount: scene?.enemies?.children?.size || 0,
                    score: scene?.score || 0
                };
            });
            
            console.log('Game state:', gameState);
            
            if (!gameState.hasPlayer) {
                this.results.errors.push({
                    type: 'player-missing',
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (error) {
            console.error('Gameplay test error:', error);
        }
    }

    /**
     * Simulate player movement
     */
    async simulateMovement() {
        const movements = [
            { key: 'ArrowRight', duration: 500 },
            { key: 'ArrowDown', duration: 500 },
            { key: 'ArrowLeft', duration: 500 },
            { key: 'ArrowUp', duration: 500 }
        ];
        
        for (const move of movements) {
            await this.page.keyboard.down(move.key);
            await this.page.waitForTimeout(move.duration);
            await this.page.keyboard.up(move.key);
        }
    }

    /**
     * Simulate spell casting
     */
    async simulateSpellCasting() {
        // Press space to cast spells
        for (let i = 0; i < 5; i++) {
            await this.page.keyboard.press('Space');
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Test for memory leaks
     */
    async testMemoryLeaks() {
        console.log('Testing for memory leaks...');
        
        const initialMemory = await this.page.evaluate(() => {
            return performance.memory ? performance.memory.usedJSHeapSize : 0;
        });
        
        // Create and destroy many objects
        for (let i = 0; i < 10; i++) {
            await this.page.evaluate(() => {
                const scene = window.game?.scene?.getScene('GameScene');
                if (scene && scene.spawnEnemy) {
                    for (let j = 0; j < 20; j++) {
                        scene.spawnEnemy();
                    }
                }
            });
            
            await this.page.waitForTimeout(1000);
            
            // Clear enemies
            await this.page.evaluate(() => {
                const scene = window.game?.scene?.getScene('GameScene');
                if (scene && scene.enemies) {
                    scene.enemies.clear(true, true);
                }
            });
        }
        
        const finalMemory = await this.page.evaluate(() => {
            return performance.memory ? performance.memory.usedJSHeapSize : 0;
        });
        
        const memoryIncrease = finalMemory - initialMemory;
        const increasePercentage = (memoryIncrease / initialMemory) * 100;
        
        console.log(`Memory increase: ${(memoryIncrease / 1048576).toFixed(2)}MB (${increasePercentage.toFixed(2)}%)`);
        
        if (increasePercentage > 50) {
            this.results.warnings.push({
                type: 'potential-memory-leak',
                increase: memoryIncrease,
                percentage: increasePercentage,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Stress test with many entities
     */
    async stressTest() {
        console.log('Running stress test...');
        
        try {
            // Spawn many enemies
            await this.page.evaluate(() => {
                const scene = window.game?.scene?.getScene('GameScene');
                if (scene && scene.spawnEnemy) {
                    for (let i = 0; i < 100; i++) {
                        scene.spawnEnemy();
                    }
                }
            });
            
            await this.page.waitForTimeout(5000);
            
            // Check FPS under stress
            const stressMetrics = await this.page.evaluate(() => {
                return {
                    fps: window.game?.loop?.actualFps || 0,
                    entities: window.game?.scene?.getScene('GameScene')?.enemies?.children?.size || 0
                };
            });
            
            console.log(`Stress test - FPS: ${stressMetrics.fps}, Entities: ${stressMetrics.entities}`);
            
            if (stressMetrics.fps < 15) {
                this.results.warnings.push({
                    type: 'poor-stress-performance',
                    fps: stressMetrics.fps,
                    entities: stressMetrics.entities,
                    timestamp: new Date().toISOString()
                });
            }
            
            await this.takeScreenshot('stress-test');
            
        } catch (error) {
            console.error('Stress test error:', error);
        }
    }

    /**
     * Take screenshot
     */
    async takeScreenshot(name) {
        if (!this.options.screenshotOnError) return;
        
        try {
            const timestamp = Date.now();
            const filename = `screenshot-${name}-${timestamp}.png`;
            const filepath = path.join(__dirname, 'test-screenshots', filename);
            
            // Create directory if it doesn't exist
            const dir = path.dirname(filepath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            await this.page.screenshot({ path: filepath, fullPage: true });
            this.results.screenshots.push(filename);
            console.log(`Screenshot saved: ${filename}`);
        } catch (error) {
            console.error('Screenshot failed:', error);
        }
    }

    /**
     * Generate and save report
     */
    saveReport() {
        const reportPath = path.join(__dirname, `test-report-${Date.now()}.json`);
        
        // Calculate summary
        const duration = new Date(this.results.endTime) - new Date(this.results.startTime);
        const avgFPS = this.results.performance.length > 0
            ? this.results.performance.reduce((sum, p) => sum + p.fps, 0) / this.results.performance.length
            : 0;
        
        const report = {
            ...this.results,
            summary: {
                duration: duration,
                totalErrors: this.results.errors.length,
                totalWarnings: this.results.warnings.length,
                totalCrashes: this.results.crashes.length,
                averageFPS: avgFPS.toFixed(2),
                passed: this.results.crashes.length === 0
            }
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`Report saved: ${reportPath}`);
        
        // Print summary
        console.log('\n=== Test Summary ===');
        console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);
        console.log(`Errors: ${report.summary.totalErrors}`);
        console.log(`Warnings: ${report.summary.totalWarnings}`);
        console.log(`Crashes: ${report.summary.totalCrashes}`);
        console.log(`Average FPS: ${report.summary.averageFPS}`);
        console.log(`Status: ${report.summary.passed ? 'PASSED' : 'FAILED'}`);
        
        return report;
    }

    /**
     * Cleanup resources
     */
    async cleanup() {
        console.log('Cleaning up...');
        
        if (this.browser) {
            await this.browser.close();
        }
        
        if (this.server) {
            this.server.close();
        }
    }

    /**
     * Run complete test suite
     */
    async run() {
        try {
            await this.startServer();
            await this.initBrowser();
            await this.runTests();
            const report = this.saveReport();
            
            // Exit with appropriate code
            process.exit(report.summary.passed ? 0 : 1);
            
        } catch (error) {
            console.error('Fatal error:', error);
            process.exit(1);
        } finally {
            await this.cleanup();
        }
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    headless: !args.includes('--headed'),
    verbose: args.includes('--verbose'),
    testDuration: 30000 // 30 seconds for quick test
};

// Check for duration override
const durationIndex = args.indexOf('--duration');
if (durationIndex !== -1 && args[durationIndex + 1]) {
    options.testDuration = parseInt(args[durationIndex + 1]) * 1000;
}

// Run tests
const runner = new HeadlessTestRunner(options);
runner.run();