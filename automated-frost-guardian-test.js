const puppeteer = require('puppeteer');

async function testFrostGuardianHitbox() {
    console.log('🧪 Starting Automated Frost Guardian Hitbox Test...');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Set to true for headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Capture all console messages
        const consoleMessages = [];
        page.on('console', msg => {
            const message = msg.text();
            consoleMessages.push(message);
            
            // Log FROST GUARDIAN and HITBOX messages immediately
            if (message.includes('[FROST GUARDIAN]') || 
                message.includes('[HITBOX]') || 
                message.includes('frost-guardian-boss')) {
                console.log(`📋 CAPTURED: ${message}`);
            }
        });
        
        // Navigate to the game
        console.log('🌐 Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        
        // Wait for game to load
        await page.waitForTimeout(3000);
        
        console.log('🎮 Attempting to start game and reach snow stage...');
        
        // Click to start game (if needed)
        try {
            await page.click('canvas', { timeout: 2000 });
        } catch (e) {
            console.log('No initial click needed');
        }
        
        // Wait for game initialization
        await page.waitForTimeout(2000);
        
        // Look for ways to get to snow stage quickly
        // This might involve pressing keys or triggering debug commands
        
        // First, let's try to skip to later stages or spawn boss directly
        await page.evaluate(() => {
            // Try to access game instance and skip to snow stage
            if (window.game && window.game.scene && window.game.scene.scenes) {
                const gameScene = window.game.scene.scenes.find(s => s.scene && s.scene.key === 'GameScene');
                if (gameScene && gameScene.currentStage !== undefined) {
                    console.log('🎯 Found GameScene, current stage:', gameScene.currentStage);
                    // Try to advance to snow stage (stage 4)
                    gameScene.currentStage = 3; // Will advance to 4 on next stage transition
                    console.log('🏔️ Set stage to advance to snow stage');
                }
            }
        });
        
        // Wait and let the game run for a while to trigger stage changes
        console.log('⏳ Waiting for game progression...');
        await page.waitForTimeout(5000);
        
        // Try to manually trigger snow stage
        await page.evaluate(() => {
            if (window.game && window.game.scene) {
                const scenes = window.game.scene.scenes;
                for (let scene of scenes) {
                    if (scene.scene && scene.scene.key === 'GameScene') {
                        // Force stage 4 (snow)
                        scene.currentStage = 4;
                        scene.stageBackgroundColor = 0x87ceeb; // Snow stage color
                        console.log('🏔️ Manually set to snow stage');
                        
                        // Try to spawn frost guardian directly
                        if (scene.spawnSpecificBoss) {
                            console.log('👹 Attempting to spawn Frost Guardian...');
                            scene.spawnSpecificBoss('frost-guardian-boss');
                        } else if (scene.addBossToScene) {
                            // Alternative boss spawning method
                            scene.addBossToScene();
                        }
                        break;
                    }
                }
            }
        });
        
        // Wait for boss to spawn and debug output
        console.log('👹 Waiting for Frost Guardian to spawn...');
        await page.waitForTimeout(8000);
        
        // Check current console messages
        console.log('\n📊 ANALYZING CAPTURED CONSOLE OUTPUT...\n');
        
        const frostGuardianMessages = consoleMessages.filter(msg => 
            msg.includes('[FROST GUARDIAN]') || 
            msg.includes('[HITBOX]') || 
            msg.includes('frost-guardian-boss')
        );
        
        if (frostGuardianMessages.length === 0) {
            console.log('❌ No Frost Guardian debug messages found!');
            console.log('🔍 Checking if boss spawned by looking for any boss-related messages...');
            
            const bossMessages = consoleMessages.filter(msg => 
                msg.toLowerCase().includes('boss') ||
                msg.includes('frost') ||
                msg.includes('guardian')
            );
            
            if (bossMessages.length > 0) {
                console.log('🎯 Found these boss-related messages:');
                bossMessages.forEach(msg => console.log(`   📋 ${msg}`));
            } else {
                console.log('🔍 No boss-related messages found. Game may not have reached boss stage.');
            }
        } else {
            console.log('✅ Found Frost Guardian debug messages:');
            frostGuardianMessages.forEach(msg => console.log(`   📋 ${msg}`));
        }
        
        // Analyze the results
        console.log('\n🧪 FROST GUARDIAN HITBOX TEST RESULTS');
        console.log('=====================================');
        
        const configLoadedMsg = frostGuardianMessages.find(msg => msg.includes('hitboxConfig loaded:'));
        const hitboxConfigMsg = frostGuardianMessages.find(msg => msg.includes('frost-guardian-boss config:'));
        const finalSizeMsg = frostGuardianMessages.find(msg => msg.includes('After hitbox config - Size:'));
        const hitboxAppliedMsg = frostGuardianMessages.find(msg => msg.includes('[HITBOX] Applied'));
        
        let passed = 0;
        let failed = 0;
        
        console.log('\n📋 Expected Debug Messages:');
        
        if (configLoadedMsg) {
            console.log(`✅ Config Loaded: ${configLoadedMsg}`);
            passed++;
        } else {
            console.log('❌ Config Loaded message not found');
            failed++;
        }
        
        if (hitboxConfigMsg) {
            console.log(`✅ Hitbox Config: ${hitboxConfigMsg}`);
            passed++;
        } else {
            console.log('❌ Hitbox config details not found');
            failed++;
        }
        
        if (hitboxAppliedMsg) {
            console.log(`✅ Hitbox Applied: ${hitboxAppliedMsg}`);
            if (hitboxAppliedMsg.includes('120x120') && hitboxAppliedMsg.includes('(30, 30)')) {
                console.log('✅ Correct hitbox size and offset detected!');
                passed++;
            } else {
                console.log('❌ Incorrect hitbox size/offset in applied message');
                failed++;
            }
        } else {
            console.log('❌ Hitbox applied message not found');
            failed++;
        }
        
        if (finalSizeMsg) {
            console.log(`✅ Final Size: ${finalSizeMsg}`);
            if (finalSizeMsg.includes('120x120') && finalSizeMsg.includes('(30, 30)')) {
                console.log('✅ Final hitbox configuration is CORRECT!');
                passed++;
            } else {
                console.log('❌ Final hitbox configuration is incorrect');
                failed++;
            }
        } else {
            console.log('❌ Final size message not found');
            failed++;
        }
        
        console.log('\n📊 SUMMARY:');
        console.log(`   ✅ Passed: ${passed}`);
        console.log(`   ❌ Failed: ${failed}`);
        
        if (passed >= 3) {
            console.log('\n🎉 FROST GUARDIAN HITBOX FIX APPEARS TO BE WORKING!');
        } else if (frostGuardianMessages.length === 0) {
            console.log('\n⚠️  Could not test - Frost Guardian did not spawn');
            console.log('    Manual testing required by navigating to snow stage');
        } else {
            console.log('\n❌ HITBOX FIX HAS ISSUES - Check debug output above');
        }
        
        // Also capture any errors
        const errorMessages = consoleMessages.filter(msg => 
            msg.toLowerCase().includes('error') || 
            msg.toLowerCase().includes('warning') ||
            msg.toLowerCase().includes('undefined')
        );
        
        if (errorMessages.length > 0) {
            console.log('\n⚠️  Errors/Warnings detected:');
            errorMessages.slice(0, 10).forEach(msg => console.log(`   🚨 ${msg}`));
        }
        
        return {
            passed,
            failed,
            messages: frostGuardianMessages,
            allMessages: consoleMessages
        };
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        return { error: error.message };
    } finally {
        await browser.close();
    }
}

// Check if puppeteer is available, if not provide alternative
async function runTest() {
    try {
        await testFrostGuardianHitbox();
    } catch (error) {
        if (error.message.includes('puppeteer')) {
            console.log('\n🤖 Puppeteer not available. Here\'s how to manually test:');
            console.log('=====================================');
            console.log('1. Open http://localhost:3000 in your browser');
            console.log('2. Open Developer Tools (F12) and go to Console tab');
            console.log('3. Start the game and progress to the snow stage');
            console.log('4. Look for these specific debug messages:');
            console.log('   - [FROST GUARDIAN] hitboxConfig loaded: true');
            console.log('   - [FROST GUARDIAN] frost-guardian-boss config: {width: 120, height: 120, offsetX: 30, offsetY: 30}');
            console.log('   - [HITBOX] Applied - Size: 120x120, Direct offset: (30, 30)');
            console.log('   - [FROST GUARDIAN] After hitbox config - Size: 120x120, Offset: (30, 30)');
            console.log('\n✅ SUCCESS: If you see Size: 120x120, Offset: (30, 30)');
            console.log('❌ FAILURE: If you see Size: 30x30 (default fallback)');
        } else {
            throw error;
        }
    }
}

if (require.main === module) {
    runTest();
}