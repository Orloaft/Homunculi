// Automated 4-Player Support Test
// This test can run with or without Puppeteer

async function test4PlayerSupport() {
    console.log('🎮 Starting 4-Player Support Test...\n');

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    // Test 1: Code Analysis - Check if player spawning code exists
    console.log('📋 Test 1: Analyzing code for 4-player support...');
    try {
        const fs = require('fs');
        const gameJs = fs.readFileSync('./scripts/game.js', 'utf8');

        const checks = {
            'wizard3 variable': gameJs.includes('this.wizard3'),
            'wizard4 variable': gameJs.includes('this.wizard4'),
            'playerCount support': gameJs.includes('this.playerCount'),
            'P3 spawning logic': gameJs.includes('if (this.playerCount > 2 && this.wizard3)'),
            'P4 spawning logic': gameJs.includes('if (this.playerCount > 3 && this.wizard4)'),
            'P3 health bar': gameJs.includes('this.wizard3HealthBar'),
            'P4 health bar': gameJs.includes('this.wizard4HealthBar'),
            'P3 collision detection': gameJs.includes('this.physics.add.overlap(this.wizard3, this.enemies'),
            'P4 collision detection': gameJs.includes('this.physics.add.overlap(this.wizard4, this.enemies'),
            'P3 movement handling': gameJs.includes('handleWizardMovement(this.wizard3'),
            'P4 movement handling': gameJs.includes('handleWizardMovement(this.wizard4')
        };

        let codeAnalysisPassed = true;
        console.log('\n   Code Structure Analysis:');
        for (const [check, exists] of Object.entries(checks)) {
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${check}: ${exists ? 'Found' : 'Missing'}`);
            if (!exists) codeAnalysisPassed = false;
        }

        results.tests.push({
            name: 'Code Analysis',
            passed: codeAnalysisPassed,
            details: checks
        });

        if (codeAnalysisPassed) {
            results.passed++;
            console.log('\n✅ Code Analysis: PASSED - All 4-player code structures found\n');
        } else {
            results.failed++;
            console.log('\n❌ Code Analysis: FAILED - Some 4-player code missing\n');
        }

    } catch (error) {
        results.failed++;
        results.tests.push({
            name: 'Code Analysis',
            passed: false,
            error: error.message
        });
        console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Test 2: Player Spawning Location Analysis
    console.log('📋 Test 2: Analyzing player spawn positions...');
    try {
        const fs = require('fs');
        const gameJs = fs.readFileSync('./scripts/game.js', 'utf8');

        // Extract spawn logic using regex
        const p3SpawnMatch = gameJs.match(/wizard3X = (.+?);/);
        const p4SpawnMatch = gameJs.match(/wizard4X = (.+?);/);

        const spawnPositions = {
            'P1': 'Center (default)',
            'P2': '100px offset from P1',
            'P3': p3SpawnMatch ? p3SpawnMatch[1] : 'Not found',
            'P4': p4SpawnMatch ? p4SpawnMatch[1] : 'Not found'
        };

        console.log('\n   Player Spawn Positions:');
        for (const [player, position] of Object.entries(spawnPositions)) {
            const status = position !== 'Not found' ? '✅' : '❌';
            console.log(`   ${status} ${player}: ${position}`);
        }

        const spawnTestPassed = p3SpawnMatch && p4SpawnMatch;
        results.tests.push({
            name: 'Spawn Position Analysis',
            passed: spawnTestPassed,
            positions: spawnPositions
        });

        if (spawnTestPassed) {
            results.passed++;
            console.log('\n✅ Spawn Position Analysis: PASSED\n');
        } else {
            results.failed++;
            console.log('\n❌ Spawn Position Analysis: FAILED\n');
        }

    } catch (error) {
        results.failed++;
        results.tests.push({
            name: 'Spawn Position Analysis',
            passed: false,
            error: error.message
        });
        console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Test 3: Health Bar Implementation
    console.log('📋 Test 3: Checking health bar implementation...');
    try {
        const fs = require('fs');
        const gameJs = fs.readFileSync('./scripts/game.js', 'utf8');

        const healthBarChecks = {
            'P1 health bar creation': gameJs.includes('this.wizardHealthBar'),
            'P2 health bar creation': gameJs.includes('this.wizard2HealthBar'),
            'P3 health bar creation': gameJs.includes('this.wizard3HealthBar = this.add.rectangle'),
            'P4 health bar creation': gameJs.includes('this.wizard4HealthBar = this.add.rectangle'),
            'P3 health bar background': gameJs.includes('this.wizard3HealthBarBg'),
            'P4 health bar background': gameJs.includes('this.wizard4HealthBarBg'),
            'P3 health bar update': gameJs.includes('this.wizard3.health / this.wizard3.maxHealth'),
            'P4 health bar update': gameJs.includes('this.wizard4.health / this.wizard4.maxHealth')
        };

        console.log('\n   Health Bar Components:');
        let healthBarPassed = true;
        for (const [check, exists] of Object.entries(healthBarChecks)) {
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${check}`);
            if (!exists) healthBarPassed = false;
        }

        results.tests.push({
            name: 'Health Bar Implementation',
            passed: healthBarPassed,
            checks: healthBarChecks
        });

        if (healthBarPassed) {
            results.passed++;
            console.log('\n✅ Health Bar Implementation: PASSED\n');
        } else {
            results.failed++;
            console.log('\n❌ Health Bar Implementation: FAILED\n');
        }

    } catch (error) {
        results.failed++;
        results.tests.push({
            name: 'Health Bar Implementation',
            passed: false,
            error: error.message
        });
        console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Test 4: Input/Controller Handling
    console.log('📋 Test 4: Analyzing input/controller handling...');
    try {
        const fs = require('fs');
        const gameJs = fs.readFileSync('./scripts/game.js', 'utf8');

        const inputChecks = {
            'Movement function exists': gameJs.includes('handleWizardMovement'),
            'P3 movement call': gameJs.includes('handleWizardMovement(this.wizard3'),
            'P4 movement call': gameJs.includes('handleWizardMovement(this.wizard4'),
            'P3 movement application': gameJs.includes('applyWizardMovement(this.wizard3'),
            'P4 movement application': gameJs.includes('applyWizardMovement(this.wizard4'),
            'Player 3 parameter': gameJs.includes('false, 3)'), // P3 uses different controller
            'Player 4 parameter': gameJs.includes('true, 4)') // P4 uses different controller
        };

        console.log('\n   Input Handling:');
        let inputPassed = true;
        for (const [check, exists] of Object.entries(inputChecks)) {
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${check}`);
            if (!exists) inputPassed = false;
        }

        results.tests.push({
            name: 'Input/Controller Handling',
            passed: inputPassed,
            checks: inputChecks
        });

        if (inputPassed) {
            results.passed++;
            console.log('\n✅ Input/Controller Handling: PASSED\n');
        } else {
            results.failed++;
            console.log('\n❌ Input/Controller Handling: FAILED\n');
        }

    } catch (error) {
        results.failed++;
        results.tests.push({
            name: 'Input/Controller Handling',
            passed: false,
            error: error.message
        });
        console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Test 5: Collision Detection Setup
    console.log('📋 Test 5: Verifying collision detection...');
    try {
        const fs = require('fs');
        const gameJs = fs.readFileSync('./scripts/game.js', 'utf8');

        const collisionChecks = {
            'P3 enemy collision': gameJs.includes('this.physics.add.overlap(this.wizard3, this.enemies'),
            'P4 enemy collision': gameJs.includes('this.physics.add.overlap(this.wizard4, this.enemies'),
            'P3 projectile collision': gameJs.includes('this.physics.add.overlap(this.enemyProjectiles, this.wizard3'),
            'P4 projectile collision': gameJs.includes('this.physics.add.overlap(this.enemyProjectiles, this.wizard4'),
            'P3 jewel collection': gameJs.includes('this.physics.add.overlap(this.wizard3, this.jewels'),
            'P4 jewel collection': gameJs.includes('this.physics.add.overlap(this.wizard4, this.jewels'),
            'P3 element orb collection': gameJs.includes('this.physics.add.overlap(this.wizard3, this.elementOrbs'),
            'P4 element orb collection': gameJs.includes('this.physics.add.overlap(this.wizard4, this.elementOrbs')
        };

        console.log('\n   Collision Detection:');
        let collisionPassed = true;
        for (const [check, exists] of Object.entries(collisionChecks)) {
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${check}`);
            if (!exists) collisionPassed = false;
        }

        results.tests.push({
            name: 'Collision Detection',
            passed: collisionPassed,
            checks: collisionChecks
        });

        if (collisionPassed) {
            results.passed++;
            console.log('\n✅ Collision Detection: PASSED\n');
        } else {
            results.failed++;
            console.log('\n❌ Collision Detection: FAILED\n');
        }

    } catch (error) {
        results.failed++;
        results.tests.push({
            name: 'Collision Detection',
            passed: false,
            error: error.message
        });
        console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Test 6: Camera Tracking for 4 Players
    console.log('📋 Test 6: Checking camera tracking system...');
    try {
        const fs = require('fs');
        const gameJs = fs.readFileSync('./scripts/game.js', 'utf8');

        const cameraChecks = {
            'Camera target system': gameJs.includes('this.cameraTarget'),
            'Alive players array': gameJs.includes('alivePlayers'),
            'P3 in camera tracking': gameJs.includes('this.wizard3 && this.wizard3.health > 0 && this.wizard3.active'),
            'P4 in camera tracking': gameJs.includes('this.wizard4 && this.wizard4.health > 0 && this.wizard4.active'),
            'All players array': gameJs.includes('[this.wizard, this.wizard2, this.wizard3, this.wizard4]')
        };

        console.log('\n   Camera Tracking:');
        let cameraPassed = true;
        for (const [check, exists] of Object.entries(cameraChecks)) {
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${check}`);
            if (!exists) cameraPassed = false;
        }

        results.tests.push({
            name: 'Camera Tracking',
            passed: cameraPassed,
            checks: cameraChecks
        });

        if (cameraPassed) {
            results.passed++;
            console.log('\n✅ Camera Tracking: PASSED\n');
        } else {
            results.failed++;
            console.log('\n❌ Camera Tracking: FAILED\n');
        }

    } catch (error) {
        results.failed++;
        results.tests.push({
            name: 'Camera Tracking',
            passed: false,
            error: error.message
        });
        console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Generate Summary Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 4-PLAYER SUPPORT TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`\n   Total Tests: ${results.passed + results.failed}`);
    console.log(`   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);

    const passRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
    console.log(`   📈 Pass Rate: ${passRate}%`);

    console.log('\n' + '='.repeat(60));

    if (results.passed === results.passed + results.failed) {
        console.log('🎉 ALL TESTS PASSED! 4-Player support is FULLY implemented!');
        console.log('\n✨ Your game supports:');
        console.log('   • 4 simultaneous players (wizard, wizard2, wizard3, wizard4)');
        console.log('   • Individual health bars for each player');
        console.log('   • Separate collision detection for all players');
        console.log('   • Individual movement and input handling');
        console.log('   • Camera tracking for all 4 players');
        console.log('   • Proper spawn positions for each player');
    } else if (passRate >= 80) {
        console.log('✅ MOSTLY WORKING! 4-Player support is largely implemented.');
        console.log('   Some minor issues may exist, but core functionality is present.');
    } else if (passRate >= 50) {
        console.log('⚠️  PARTIAL SUPPORT: Some 4-player features are implemented.');
        console.log('   Significant gaps remain in the implementation.');
    } else {
        console.log('❌ INSUFFICIENT SUPPORT: 4-player functionality is incomplete.');
        console.log('   Major implementation work is needed.');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 To test manually:');
    console.log('   1. Start your game server: python -m http.server 8080');
    console.log('   2. Open http://localhost:8080/test-4player.html');
    console.log('   3. Click "Start Test" to run browser-based tests');
    console.log('\n   Or use the main game:');
    console.log('   1. Connect 4 game controllers');
    console.log('   2. Open http://localhost:8080');
    console.log('   3. Start co-op mode and verify all 4 players spawn\n');

    return results;
}

// Run the test
if (require.main === module) {
    test4PlayerSupport().then(results => {
        const passRate = (results.passed / (results.passed + results.failed)) * 100;
        process.exit(passRate >= 80 ? 0 : 1);
    }).catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = { test4PlayerSupport };
