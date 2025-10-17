/**
 * Hitbox Configuration Verification Test
 * Directly tests the hitbox-config.js to verify Frost Guardian settings
 */

// Load the hitbox configuration
let hitboxConfig;

try {
    console.log('🔍 Loading hitbox configuration...');
    
    // Since this is a browser script, we need to simulate the browser environment
    global.window = {};
    global.console = console;
    
    // Load the hitbox-config.js file
    const fs = require('fs');
    const path = require('path');
    const hitboxConfigPath = path.join(__dirname, 'scripts', 'hitbox-config.js');
    let hitboxConfigCode = fs.readFileSync(hitboxConfigPath, 'utf8');
    
    // Remove the variable declaration to avoid redeclaration error
    hitboxConfigCode = hitboxConfigCode.replace(/var hitboxConfig = {/, 'hitboxConfig = {');
    
    // Execute the code in our context
    eval(hitboxConfigCode);
    
    // The hitboxConfig should now be available
    hitboxConfig = global.hitboxConfig || (global.window && global.window.hitboxConfig);
    
    if (!hitboxConfig) {
        throw new Error('hitboxConfig not found after loading');
    }
    
    console.log('✅ Hitbox configuration loaded successfully');
    
} catch (error) {
    console.error('❌ Failed to load hitbox configuration:', error);
    process.exit(1);
}

// Test function
function testFrostGuardianHitbox() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 FROST GUARDIAN HITBOX CONFIGURATION TEST');
    console.log('='.repeat(60));
    
    const results = {
        configLoaded: false,
        frostGuardianConfigExists: false,
        hitboxCorrect: false,
        scaleCorrect: false,
        flipCorrect: false,
        expectedValues: {
            hitbox: { width: 120, height: 120, offsetX: 30, offsetY: 30 },
            scale: 2,
            flipX: true
        },
        actualValues: {
            hitbox: null,
            scale: null,
            flipX: null
        },
        issues: []
    };
    
    // Test 1: Check if configuration is loaded
    console.log('\n1️⃣  Testing configuration loading...');
    if (hitboxConfig && typeof hitboxConfig === 'object') {
        results.configLoaded = true;
        console.log('   ✅ hitboxConfig object exists');
        
        // Load the configuration
        const loaded = hitboxConfig.load();
        console.log(`   ${loaded ? '✅' : '❌'} load() method returned: ${loaded}`);
    } else {
        console.log('   ❌ hitboxConfig object not found');
        results.issues.push('hitboxConfig object not found');
    }
    
    // Test 2: Check Frost Guardian hitbox configuration
    console.log('\n2️⃣  Testing Frost Guardian hitbox configuration...');
    const frostGuardianHitbox = hitboxConfig.hitboxes['frost-guardian-boss'];
    
    if (frostGuardianHitbox) {
        results.frostGuardianConfigExists = true;
        results.actualValues.hitbox = frostGuardianHitbox;
        console.log('   ✅ frost-guardian-boss config exists');
        console.log('   📋 Config:', JSON.stringify(frostGuardianHitbox, null, 2));
        
        // Verify values
        const expected = results.expectedValues.hitbox;
        const actual = frostGuardianHitbox;
        
        if (actual.width === expected.width && 
            actual.height === expected.height &&
            actual.offsetX === expected.offsetX && 
            actual.offsetY === expected.offsetY) {
            results.hitboxCorrect = true;
            console.log('   ✅ Hitbox values are correct');
        } else {
            console.log('   ❌ Hitbox values are incorrect');
            console.log(`      Expected: width=${expected.width}, height=${expected.height}, offsetX=${expected.offsetX}, offsetY=${expected.offsetY}`);
            console.log(`      Actual:   width=${actual.width}, height=${actual.height}, offsetX=${actual.offsetX}, offsetY=${actual.offsetY}`);
            results.issues.push('Hitbox values do not match expected values');
        }
    } else {
        console.log('   ❌ frost-guardian-boss config not found');
        console.log('   🔍 Available configs:', Object.keys(hitboxConfig.hitboxes || {}));
        results.issues.push('frost-guardian-boss config not found');
    }
    
    // Test 3: Check scale configuration
    console.log('\n3️⃣  Testing Frost Guardian scale configuration...');
    const frostGuardianScale = hitboxConfig.scales['frost-guardian-boss'];
    
    if (frostGuardianScale !== undefined) {
        results.actualValues.scale = frostGuardianScale;
        console.log(`   📋 Scale: ${frostGuardianScale}`);
        
        if (frostGuardianScale === results.expectedValues.scale) {
            results.scaleCorrect = true;
            console.log('   ✅ Scale value is correct');
        } else {
            console.log(`   ❌ Scale value is incorrect. Expected: ${results.expectedValues.scale}, Actual: ${frostGuardianScale}`);
            results.issues.push(`Scale value incorrect: expected ${results.expectedValues.scale}, got ${frostGuardianScale}`);
        }
    } else {
        console.log('   ❌ frost-guardian-boss scale not found');
        console.log('   🔍 Available scales:', Object.keys(hitboxConfig.scales || {}));
        results.issues.push('frost-guardian-boss scale not found');
    }
    
    // Test 4: Check flip configuration
    console.log('\n4️⃣  Testing Frost Guardian flip configuration...');
    const frostGuardianFlip = hitboxConfig.flips['frost-guardian-boss'];
    
    if (frostGuardianFlip) {
        results.actualValues.flipX = frostGuardianFlip.flipX;
        console.log(`   📋 Flip config:`, JSON.stringify(frostGuardianFlip, null, 2));
        
        if (frostGuardianFlip.flipX === results.expectedValues.flipX) {
            results.flipCorrect = true;
            console.log('   ✅ Flip X value is correct');
        } else {
            console.log(`   ❌ Flip X value is incorrect. Expected: ${results.expectedValues.flipX}, Actual: ${frostGuardianFlip.flipX}`);
            results.issues.push(`FlipX value incorrect: expected ${results.expectedValues.flipX}, got ${frostGuardianFlip.flipX}`);
        }
    } else {
        console.log('   ❌ frost-guardian-boss flip config not found');
        console.log('   🔍 Available flips:', Object.keys(hitboxConfig.flips || {}));
        results.issues.push('frost-guardian-boss flip config not found');
    }
    
    // Test 5: Test the applyHitbox function
    console.log('\n5️⃣  Testing applyHitbox function...');
    if (typeof hitboxConfig.applyHitbox === 'function') {
        console.log('   ✅ applyHitbox function exists');
        
        // Mock enemy object to test the function
        const mockEnemy = {
            body: {
                setSize: function(w, h) { this.width = w; this.height = h; },
                setOffset: function(x, y) { this.offset = { x, y }; },
                width: 0,
                height: 0,
                offset: { x: 0, y: 0 }
            },
            scaleX: 2,
            originX: 0.5,
            originY: 0.5,
            width: 100,
            height: 100,
            displayWidth: 200,
            displayHeight: 200
        };
        
        const result = hitboxConfig.applyHitbox(mockEnemy, 'frost-guardian-boss');
        console.log(`   📋 applyHitbox returned: ${result}`);
        
        if (result) {
            console.log('   ✅ applyHitbox function worked');
            console.log(`   📋 Applied size: ${mockEnemy.body.width}x${mockEnemy.body.height}`);
            console.log(`   📋 Applied offset: (${mockEnemy.body.offset.x}, ${mockEnemy.body.offset.y})`);
            
            // Check if the applied values are correct
            if (mockEnemy.body.width === 120 && mockEnemy.body.height === 120 &&
                mockEnemy.body.offset.x === 30 && mockEnemy.body.offset.y === 30) {
                console.log('   ✅ Applied values are correct');
            } else {
                console.log('   ⚠️  Applied values differ from expected');
                results.issues.push('applyHitbox applied incorrect values');
            }
        } else {
            console.log('   ❌ applyHitbox function returned false');
            results.issues.push('applyHitbox function returned false');
        }
    } else {
        console.log('   ❌ applyHitbox function not found');
        results.issues.push('applyHitbox function not found');
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    const allTestsPassed = results.configLoaded && 
                          results.frostGuardianConfigExists && 
                          results.hitboxCorrect && 
                          results.scaleCorrect && 
                          results.flipCorrect &&
                          results.issues.length === 0;
    
    console.log(`\n🎯 Overall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    if (!allTestsPassed) {
        console.log('\n🚨 Issues Found:');
        results.issues.forEach((issue, index) => {
            console.log(`   ${index + 1}. ${issue}`);
        });
    }
    
    console.log('\n📋 Configuration Status:');
    console.log(`   Config Loaded: ${results.configLoaded ? '✅' : '❌'}`);
    console.log(`   Frost Guardian Config Exists: ${results.frostGuardianConfigExists ? '✅' : '❌'}`);
    console.log(`   Hitbox Values Correct: ${results.hitboxCorrect ? '✅' : '❌'}`);
    console.log(`   Scale Value Correct: ${results.scaleCorrect ? '✅' : '❌'}`);
    console.log(`   Flip Value Correct: ${results.flipCorrect ? '✅' : '❌'}`);
    
    return allTestsPassed;
}

// Run the test
const passed = testFrostGuardianHitbox();
console.log(`\n🎭 Test ${passed ? 'PASSED' : 'FAILED'}`);

// If configuration is correct, provide guidance for runtime testing
if (passed) {
    console.log('\n📖 NEXT STEPS FOR RUNTIME TESTING:');
    console.log('   Since the configuration appears correct, the issue might be:');
    console.log('   1. Timing: hitboxConfig.load() not called before boss creation');
    console.log('   2. Order: Boss setScale() called after hitbox configuration');
    console.log('   3. Override: Some other code overriding the hitbox after setup');
    console.log('');
    console.log('   To test runtime behavior:');
    console.log('   1. Open browser and navigate to http://localhost:8080');
    console.log('   2. Open Developer Tools (F12) and go to Console tab');
    console.log('   3. Navigate to the snow stage');
    console.log('   4. Look for these debug messages:');
    console.log('      - [FROST GUARDIAN] hitboxConfig loaded: true/false');
    console.log('      - [FROST GUARDIAN] Available hitbox configs: [...]');
    console.log('      - [FROST GUARDIAN] After hitbox config - Size: 120x120, Offset: (30, 30)');
    console.log('');
    console.log('   If you see "Size: 30x30, Offset: (0, 0)" instead, the config is being overridden.');
}

process.exit(passed ? 0 : 1);