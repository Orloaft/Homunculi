/**
 * Frost Guardian Hitbox Test Runner
 * Tests the specific hitbox configuration issue with the Frost Guardian boss
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

class FrostGuardianHitboxTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.consoleMessages = [];
        this.frostGuardianMessages = [];
        this.results = {
            testPassed: false,
            hitboxConfigFound: false,
            expectedSize: { width: 120, height: 120 },
            expectedOffset: { x: 30, y: 30 },
            actualSize: null,
            actualOffset: null,
            debugMessages: []
        };
    }

    async initBrowser() {
        console.log('🚀 Initializing browser...');
        
        this.browser = await puppeteer.launch({
            headless: false, // We want to see it run
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security'
            ],
            defaultViewport: {
                width: 1024,
                height: 768
            }
        });

        this.page = await this.browser.newPage();

        // Capture all console messages
        this.page.on('console', msg => {
            const message = msg.text();
            this.consoleMessages.push({
                type: msg.type(),
                message: message,
                timestamp: new Date().toISOString()
            });

            // Filter for Frost Guardian related messages
            if (message.includes('[FROST GUARDIAN]') || message.includes('[HITBOX]') || 
                message.includes('frost-guardian-boss')) {
                this.frostGuardianMessages.push(message);
                console.log(`📋 ${message}`);
            }

            // Print all console messages for debugging
            console.log(`🎮 [${msg.type()}] ${message}`);
        });

        this.page.on('pageerror', error => {
            console.error('❌ Page error:', error);
        });
    }

    async navigateToGame() {
        console.log('🎯 Navigating to game...');
        
        const url = 'http://localhost:8080';
        await this.page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        console.log('⏳ Waiting for game to load...');
        await this.page.waitForTimeout(3000);
    }

    async skipToSnowStage() {
        console.log('❄️  Attempting to skip to snow stage...');
        
        try {
            // Try to start the game directly on snow stage
            await this.page.evaluate(() => {
                if (window.game && window.game.scene) {
                    // Try to start GameScene with snow stage
                    window.game.scene.start('GameScene', {
                        stage: 'snowland',
                        playerNumber: 1,
                        p1Character: 'wizard'
                    });
                    console.log('Started GameScene with snowland stage');
                }
            });

            await this.page.waitForTimeout(5000);
            
            // Check if we're in the game scene
            const inGameScene = await this.page.evaluate(() => {
                return window.game?.scene?.isActive('GameScene') || false;
            });

            if (inGameScene) {
                console.log('✅ Successfully entered GameScene');
                return true;
            }

            // If direct navigation didn't work, try through title screen
            console.log('🎮 Trying navigation through title screen...');
            
            // Click through title screen if needed
            await this.page.keyboard.press('Space');
            await this.page.waitForTimeout(2000);

            // Try to select snow stage
            await this.page.keyboard.press('ArrowDown'); // Navigate to snow if available
            await this.page.waitForTimeout(1000);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(3000);

            return true;

        } catch (error) {
            console.error('❌ Error navigating to snow stage:', error);
            return false;
        }
    }

    async waitForFrostGuardianSpawn() {
        console.log('👹 Waiting for Frost Guardian to spawn...');
        
        const maxWaitTime = 60000; // 60 seconds
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            try {
                // Check if Frost Guardian has spawned
                const frostGuardianExists = await this.page.evaluate(() => {
                    const scene = window.game?.scene?.getScene('GameScene');
                    if (!scene || !scene.enemies) return false;
                    
                    // Look for frost guardian in enemies or bosses
                    const enemies = scene.enemies.children.entries;
                    const bosses = scene.bosses?.children?.entries || [];
                    
                    for (const enemy of enemies) {
                        if (enemy.texture && enemy.texture.key && 
                            enemy.texture.key.includes('frost-guardian')) {
                            return true;
                        }
                        if (enemy.enemyType === 'frost-guardian-boss') {
                            return true;
                        }
                    }
                    
                    for (const boss of bosses) {
                        if (boss.texture && boss.texture.key && 
                            boss.texture.key.includes('frost-guardian')) {
                            return true;
                        }
                        if (boss.enemyType === 'frost-guardian-boss') {
                            return true;
                        }
                    }
                    
                    return false;
                });

                if (frostGuardianExists) {
                    console.log('✅ Frost Guardian found!');
                    await this.page.waitForTimeout(2000); // Give time for hitbox setup
                    return true;
                }

                // Try to trigger boss spawn manually if needed
                if (Date.now() - startTime > 10000) { // After 10 seconds
                    console.log('🔧 Attempting to manually spawn Frost Guardian...');
                    await this.page.evaluate(() => {
                        const scene = window.game?.scene?.getScene('GameScene');
                        if (scene && scene.spawnFrostGuardianBoss) {
                            scene.spawnFrostGuardianBoss(400, 300);
                            console.log('Manual spawn attempted');
                        }
                    });
                }

                await this.page.waitForTimeout(1000);
                console.log('⏳ Still waiting for Frost Guardian...');

            } catch (error) {
                console.error('❌ Error while waiting for Frost Guardian:', error);
            }
        }
        
        console.log('⚠️  Timeout waiting for Frost Guardian spawn');
        return false;
    }

    analyzeResults() {
        console.log('\n📊 Analyzing results...');
        
        // Find the critical debug messages
        const hitboxConfigMessages = this.frostGuardianMessages.filter(msg => 
            msg.includes('hitboxConfig loaded:') || 
            msg.includes('Available hitbox configs:') ||
            msg.includes('frost-guardian-boss config:') ||
            msg.includes('After hitbox config - Size:')
        );

        console.log('\n🔍 Frost Guardian Debug Messages:');
        this.frostGuardianMessages.forEach(msg => {
            console.log(`   ${msg}`);
            this.results.debugMessages.push(msg);
        });

        // Parse the final size and offset from the "After hitbox config" message
        const afterHitboxMsg = this.frostGuardianMessages.find(msg => 
            msg.includes('After hitbox config - Size:')
        );

        if (afterHitboxMsg) {
            // Parse: "After hitbox config - Size: 120x120, Offset: (30, 30)"
            const sizeMatch = afterHitboxMsg.match(/Size: (\d+)x(\d+)/);
            const offsetMatch = afterHitboxMsg.match(/Offset: \((\d+), (\d+)\)/);

            if (sizeMatch) {
                this.results.actualSize = {
                    width: parseInt(sizeMatch[1]),
                    height: parseInt(sizeMatch[2])
                };
            }

            if (offsetMatch) {
                this.results.actualOffset = {
                    x: parseInt(offsetMatch[1]),
                    y: parseInt(offsetMatch[2])
                };
            }
        }

        // Check if hitbox config was loaded
        const loadedMsg = this.frostGuardianMessages.find(msg => 
            msg.includes('hitboxConfig loaded: true')
        );
        this.results.hitboxConfigFound = !!loadedMsg;

        // Determine if test passed
        if (this.results.actualSize && this.results.actualOffset) {
            this.results.testPassed = 
                this.results.actualSize.width === this.results.expectedSize.width &&
                this.results.actualSize.height === this.results.expectedSize.height &&
                this.results.actualOffset.x === this.results.expectedOffset.x &&
                this.results.actualOffset.y === this.results.expectedOffset.y;
        }

        return this.results;
    }

    printResults() {
        console.log('\n' + '='.repeat(60));
        console.log('🧪 FROST GUARDIAN HITBOX TEST RESULTS');
        console.log('='.repeat(60));
        
        console.log(`\n✅ Hitbox Config Loaded: ${this.results.hitboxConfigFound ? 'YES' : 'NO'}`);
        
        console.log('\n📏 Expected vs Actual:');
        console.log(`   Size: Expected ${this.results.expectedSize.width}x${this.results.expectedSize.height}, ` +
                   `Actual ${this.results.actualSize ? 
                     `${this.results.actualSize.width}x${this.results.actualSize.height}` : 'NOT FOUND'}`);
        
        console.log(`   Offset: Expected (${this.results.expectedOffset.x}, ${this.results.expectedOffset.y}), ` +
                   `Actual ${this.results.actualOffset ? 
                     `(${this.results.actualOffset.x}, ${this.results.actualOffset.y})` : 'NOT FOUND'}`);

        console.log(`\n🎯 Test Result: ${this.results.testPassed ? '✅ PASSED' : '❌ FAILED'}`);

        if (!this.results.testPassed) {
            console.log('\n🔍 Diagnostic Information:');
            if (!this.results.hitboxConfigFound) {
                console.log('   - hitboxConfig was not loaded properly');
            }
            if (!this.results.actualSize || !this.results.actualOffset) {
                console.log('   - Unable to find size/offset information in debug output');
            }
            if (this.results.actualSize && 
                (this.results.actualSize.width !== this.results.expectedSize.width ||
                 this.results.actualSize.height !== this.results.expectedSize.height)) {
                console.log('   - Hitbox size does not match expected values');
            }
            if (this.results.actualOffset && 
                (this.results.actualOffset.x !== this.results.expectedOffset.x ||
                 this.results.actualOffset.y !== this.results.expectedOffset.y)) {
                console.log('   - Hitbox offset does not match expected values');
            }
        }

        console.log('\n📝 All Debug Messages:');
        this.results.debugMessages.forEach((msg, index) => {
            console.log(`   ${index + 1}. ${msg}`);
        });
    }

    saveResults() {
        const filename = `frost-guardian-test-${Date.now()}.json`;
        const data = {
            testResults: this.results,
            allConsoleMessages: this.consoleMessages,
            frostGuardianMessages: this.frostGuardianMessages,
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`\n💾 Results saved to: ${filename}`);
        return filename;
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up...');
        if (this.browser) {
            await this.browser.close();
        }
    }

    async run() {
        try {
            await this.initBrowser();
            await this.navigateToGame();
            
            const reachedSnowStage = await this.skipToSnowStage();
            if (!reachedSnowStage) {
                throw new Error('Could not reach snow stage');
            }

            const frostGuardianFound = await this.waitForFrostGuardianSpawn();
            if (!frostGuardianFound) {
                console.log('⚠️  Frost Guardian did not spawn, but continuing with analysis...');
            }

            // Give extra time for any remaining debug messages
            await this.page.waitForTimeout(3000);

            this.analyzeResults();
            this.printResults();
            this.saveResults();

            return this.results.testPassed;

        } catch (error) {
            console.error('❌ Test execution failed:', error);
            return false;
        } finally {
            await this.cleanup();
        }
    }
}

// Run the test
const tester = new FrostGuardianHitboxTester();
tester.run().then(passed => {
    process.exit(passed ? 0 : 1);
});