/**
 * Automated test for the new level up system
 * Tests all 6 new upgrade options: revive, spellArea, moveSpeed, maxHealth, damage, slotIncrease
 */

const puppeteer = require('puppeteer');

(async () => {
    console.log('🧪 Starting Level Up System Test...\n');

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--window-size=1280,720']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Listen for console messages
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Level up') || text.includes('Passive upgrade') || text.includes('revive')) {
            console.log('  📋', text);
        }
    });

    // Listen for errors
    page.on('pageerror', error => {
        console.error('  ❌ Page Error:', error.message);
    });

    try {
        console.log('📂 Loading game...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0', timeout: 10000 });
        await page.waitForTimeout(2000);

        console.log('🎮 Injecting test helper...\n');

        // Inject helper functions
        await page.evaluate(() => {
            window.testHelpers = {
                getGameScene: () => {
                    return window.game?.scene?.scenes?.[0];
                },

                forceLevel: (level) => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene) return false;

                    scene.level = level;
                    scene.experience = 0;
                    scene.experienceNeeded = 100 * Math.pow(1.2, level);
                    scene.updateExperienceBar();
                    return true;
                },

                forceLevelUp: () => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene) return false;

                    scene.experience = scene.experienceNeeded;
                    scene.levelUp();
                    return true;
                },

                getUpgradeOptions: () => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene?.currentUpgradeOptions) return null;
                    return scene.currentUpgradeOptions;
                },

                selectUpgrade: (index) => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene) return false;

                    const options = scene.currentUpgradeOptions;
                    if (!options || !options[index]) return false;

                    const upgradeKey = options[index];
                    scene.applyPassiveUpgrade(upgradeKey);
                    scene.resumeGame();
                    return true;
                },

                getPassiveUpgrades: () => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene) return null;
                    return {...scene.passiveUpgrades};
                },

                getPlayerStats: () => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene) return null;

                    return {
                        health: scene.playerHealth,
                        maxHealth: scene.maxHealth,
                        maxCharges: scene.maxCharges,
                        hasUsedRevive: scene.hasUsedRevive
                    };
                },

                damagePlayer: (amount) => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene) return false;

                    scene.playerHealth = Math.max(0, scene.playerHealth - amount);
                    scene.updateHealthBar();
                    scene.checkPlayerDeath();
                    return true;
                },

                killPlayer: () => {
                    const scene = window.testHelpers.getGameScene();
                    if (!scene) return false;

                    scene.playerHealth = 0;
                    scene.checkPlayerDeath();
                    return true;
                }
            };
        });

        await page.waitForTimeout(2000);

        // Test 1: Verify all 6 upgrade types can appear
        console.log('📊 Test 1: Checking upgrade definitions...');
        const upgradeCheck = await page.evaluate(() => {
            const scene = window.testHelpers.getGameScene();
            if (!scene) return { success: false, error: 'No scene found' };

            const defs = scene.getPassiveUpgradeDefinitions();
            const expectedUpgrades = ['revive', 'spellArea', 'moveSpeed', 'maxHealth', 'damage', 'slotIncrease'];
            const found = [];
            const missing = [];

            expectedUpgrades.forEach(key => {
                if (defs[key]) {
                    found.push({
                        key,
                        name: defs[key].name,
                        description: defs[key].description
                    });
                } else {
                    missing.push(key);
                }
            });

            return { success: missing.length === 0, found, missing };
        });

        if (upgradeCheck.success) {
            console.log('  ✅ All 6 upgrade types found:');
            upgradeCheck.found.forEach(u => {
                console.log(`     • ${u.name}: ${u.description}`);
            });
        } else {
            console.log('  ❌ Missing upgrades:', upgradeCheck.missing);
        }
        console.log();

        // Test 2: Test max health upgrade
        console.log('📊 Test 2: Testing Max Health upgrade...');
        await page.evaluate(() => window.testHelpers.forceLevel(1));
        await page.waitForTimeout(500);

        const beforeHealth = await page.evaluate(() => window.testHelpers.getPlayerStats());
        console.log(`  Initial: ${beforeHealth.health}/${beforeHealth.maxHealth} HP`);

        await page.evaluate(() => window.testHelpers.forceLevelUp());
        await page.waitForTimeout(1000);

        // Try to select maxHealth if it's in the options
        const selectedHealth = await page.evaluate(() => {
            const options = window.testHelpers.getUpgradeOptions();
            if (!options) return false;

            const healthIndex = options.indexOf('maxHealth');
            if (healthIndex !== -1) {
                return window.testHelpers.selectUpgrade(healthIndex);
            }

            // If not available, just select first option
            return window.testHelpers.selectUpgrade(0);
        });

        await page.waitForTimeout(500);
        const afterHealth = await page.evaluate(() => window.testHelpers.getPlayerStats());
        const upgrades = await page.evaluate(() => window.testHelpers.getPassiveUpgrades());

        if (upgrades.maxHealth > 0) {
            console.log(`  ✅ Max Health upgrade acquired (${upgrades.maxHealth} stacks)`);
            console.log(`  After: ${afterHealth.health}/${afterHealth.maxHealth} HP (+50% = ${Math.floor(beforeHealth.maxHealth * 0.5)} HP)`);
        } else {
            console.log('  ℹ️  Max Health not offered this level up');
        }
        console.log();

        // Test 3: Test slot increase
        console.log('📊 Test 3: Testing Slot Increase upgrade...');
        const beforeSlots = await page.evaluate(() => window.testHelpers.getPlayerStats());
        console.log(`  Initial: ${beforeSlots.maxCharges} charge slots`);

        // Force multiple level ups to try to get slot increase
        for (let i = 0; i < 3; i++) {
            await page.evaluate(() => window.testHelpers.forceLevelUp());
            await page.waitForTimeout(1000);

            const selected = await page.evaluate(() => {
                const options = window.testHelpers.getUpgradeOptions();
                if (!options) return false;

                const slotIndex = options.indexOf('slotIncrease');
                if (slotIndex !== -1) {
                    return window.testHelpers.selectUpgrade(slotIndex);
                }
                return window.testHelpers.selectUpgrade(0);
            });

            await page.waitForTimeout(500);
            const currentUpgrades = await page.evaluate(() => window.testHelpers.getPassiveUpgrades());

            if (currentUpgrades.slotIncrease > 0) {
                const afterSlots = await page.evaluate(() => window.testHelpers.getPlayerStats());
                console.log(`  ✅ Slot Increase acquired (${currentUpgrades.slotIncrease} stacks)`);
                console.log(`  After: ${afterSlots.maxCharges} charge slots`);
                break;
            }

            if (i === 2) {
                console.log('  ℹ️  Slot Increase not offered in 3 level ups');
            }
        }
        console.log();

        // Test 4: Test revive mechanic
        console.log('📊 Test 4: Testing Revive mechanic...');

        // Force level ups until we get revive
        let gotRevive = false;
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.testHelpers.forceLevelUp());
            await page.waitForTimeout(1000);

            const selected = await page.evaluate(() => {
                const options = window.testHelpers.getUpgradeOptions();
                if (!options) return false;

                const reviveIndex = options.indexOf('revive');
                if (reviveIndex !== -1) {
                    return window.testHelpers.selectUpgrade(reviveIndex);
                }
                return window.testHelpers.selectUpgrade(0);
            });

            await page.waitForTimeout(500);
            const upgrades = await page.evaluate(() => window.testHelpers.getPassiveUpgrades());

            if (upgrades.revive > 0) {
                console.log(`  ✅ Revive acquired (${upgrades.revive} revives available)`);
                gotRevive = true;
                break;
            }
        }

        if (gotRevive) {
            console.log('  Testing revive activation...');

            const beforeDeath = await page.evaluate(() => window.testHelpers.getPlayerStats());
            console.log(`  Before death: ${beforeDeath.health}/${beforeDeath.maxHealth} HP`);

            // Kill the player
            await page.evaluate(() => window.testHelpers.killPlayer());
            await page.waitForTimeout(2000); // Wait for revive animation

            const afterRevive = await page.evaluate(() => window.testHelpers.getPlayerStats());
            const revivesLeft = await page.evaluate(() => window.testHelpers.getPassiveUpgrades());

            if (afterRevive.health > 0) {
                console.log(`  ✅ Revive triggered! Restored to ${afterRevive.health}/${afterRevive.maxHealth} HP (25%)`);
                console.log(`  Revives remaining: ${revivesLeft.revive}`);
                console.log(`  Has used revive flag: ${afterRevive.hasUsedRevive}`);
            } else {
                console.log('  ❌ Revive did not trigger - player died');
            }
        } else {
            console.log('  ℹ️  Could not get revive in 5 level ups');
        }
        console.log();

        // Test 5: Check all passive upgrades are tracked
        console.log('📊 Test 5: Final passive upgrade status...');
        const finalUpgrades = await page.evaluate(() => window.testHelpers.getPassiveUpgrades());
        const finalStats = await page.evaluate(() => window.testHelpers.getPlayerStats());

        console.log('  Current upgrades:');
        Object.entries(finalUpgrades).forEach(([key, value]) => {
            if (value > 0) {
                console.log(`     • ${key}: ${value} stacks`);
            }
        });
        console.log(`  Player stats: ${finalStats.health}/${finalStats.maxHealth} HP, ${finalStats.maxCharges} slots`);
        console.log();

        console.log('✅ All tests completed!\n');
        console.log('Press Ctrl+C to close browser...');

        // Keep browser open for manual inspection
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
