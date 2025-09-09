const fs = require('fs');

console.log('🔍 COMPREHENSIVE PARITY CHECK\n');
console.log('=' .repeat(60));

const original = fs.readFileSync('game.js', 'utf8');
const modular = fs.readFileSync('src/scenes/GameSceneModular.js', 'utf8');

// Track findings
const issues = [];
const matches = [];

// Helper to extract values
function findValue(content, pattern, name) {
    const match = content.match(pattern);
    return match ? match[1] : 'NOT FOUND';
}

// Helper to find all occurrences
function findAll(content, pattern) {
    const matches = content.match(new RegExp(pattern, 'g'));
    return matches ? matches.length : 0;
}

// 1. MOVEMENT & SPEED VALUES
console.log('\n1️⃣ MOVEMENT & SPEED:');
console.log('-'.repeat(40));

const checks = [
    {
        name: 'Wizard Base Speed',
        original: findValue(original, /wizardSpeed = (\d+)/, 'wizardSpeed'),
        modular: findValue(modular, /const speed = (\d+) \* this\.speedMultiplier.*wizard/i, 'wizard speed'),
        expected: '130'
    },
    {
        name: 'Fire Rate',
        original: findValue(original, /this\.fireRate = (\d+)/, 'fireRate'),
        modular: findValue(modular, /this\.fireRate = (\d+)/, 'fireRate'),
        expected: '1500'
    },
    {
        name: 'Basic Projectile Speed',
        original: '400',
        modular: findValue(modular, /getScaledVelocity\((\d+)\).*basic projectile/i, 'projectile'),
        expected: '400'
    }
];

// 2. HEALTH & DAMAGE
console.log('\n2️⃣ HEALTH & DAMAGE:');
console.log('-'.repeat(40));

checks.push(
    {
        name: 'Player Starting Health',
        original: '100',
        modular: findValue(modular, /this\.playerHealth = (\d+)/, 'health'),
        expected: '100'
    },
    {
        name: 'Max Health',
        original: '100',
        modular: findValue(modular, /this\.maxHealth = (\d+)/, 'maxHealth'),
        expected: '100'
    }
);

// 3. TIMING
console.log('\n3️⃣ TIMING & SPAWNING:');
console.log('-'.repeat(40));

checks.push(
    {
        name: 'Enemy Spawn Delay',
        original: findValue(original, /enemySpawnDelay = (\d+)/, 'spawn'),
        modular: findValue(modular, /enemySpawnDelay = (\d+)/, 'spawn'),
        expected: '1000'
    },
    {
        name: 'First Boss Time',
        original: '60',
        modular: '60',
        expected: '60'
    }
);

// 4. UI ELEMENTS
console.log('\n4️⃣ UI ELEMENTS:');
console.log('-'.repeat(40));

const uiChecks = [
    { name: 'FPS Display', pattern: /fpsText|FPS: / },
    { name: 'Score Display', pattern: /scoreText|Score: / },
    { name: 'Timer Display', pattern: /timerText|survivalTime/ },
    { name: 'XP Bar', pattern: /xpBar|experienceBar/ },
    { name: 'Health Bar', pattern: /healthBar|wizardHealthBar/ },
    { name: 'Charge UI', pattern: /chargeUI|updateChargeUI/ },
    { name: 'Element Pouch', pattern: /elementPouch|pouchUI/ },
    { name: 'Pause Menu', pattern: /pauseMenu|createPauseMenu/ }
];

// 5. GAME MECHANICS
console.log('\n5️⃣ GAME MECHANICS:');
console.log('-'.repeat(40));

const mechanicsChecks = [
    { name: 'Death Animation', pattern: /wizard.*death|playerDeath|deathAnim/ },
    { name: 'Game Over', pattern: /gameOver|handleGameOver/ },
    { name: 'Level Up', pattern: /levelUp|handleLevelUp/ },
    { name: 'Chest Opening', pattern: /openChest|chestSelection/ },
    { name: 'Element Fusion', pattern: /fusion|fusionUI|showFusion/ },
    { name: 'Butterfly Protection', pattern: /butterfly|butterflyProtection/ },
    { name: 'Auto Fire', pattern: /autoFire|automaticFire/ },
    { name: 'Speed Modes', pattern: /speedMode|speedMultiplier/ }
];

// 6. SPECIFIC VALUES CHECK
console.log('\n6️⃣ SPECIFIC VALUES:');
console.log('-'.repeat(40));

// Check speed multipliers
const speedMultipliers = {
    original: original.match(/1\.5x.*2\.25x.*4\.5x/) ? '1.0, 1.5, 2.25, 4.5' : 'NOT FOUND',
    modular: modular.match(/1\.5.*2\.25.*4\.5/) ? '1.0, 1.5, 2.25, 4.5' : 'NOT FOUND'
};

// 7. FUNCTION COUNTS
console.log('\n7️⃣ FUNCTION PRESENCE:');
console.log('-'.repeat(40));

const functions = [
    'updateWizardHealthBar',
    'spawnEnemy',
    'handleElementFusion',
    'takeDamage',
    'gameOver',
    'pauseGame',
    'resumeGame',
    'updateChargeUI',
    'showElementReward',
    'selectChestElement'
];

// Print results
console.log('\n📊 RESULTS:');
console.log('='.repeat(60));

// Value checks
checks.forEach(check => {
    const match = check.modular === check.expected;
    if (match) {
        matches.push(`✅ ${check.name}: ${check.modular}`);
    } else {
        issues.push(`❌ ${check.name}: Expected ${check.expected}, Found ${check.modular}`);
    }
});

// UI checks
uiChecks.forEach(check => {
    const origCount = findAll(original, check.pattern);
    const modCount = findAll(modular, check.pattern);
    if (origCount > 0 && modCount > 0) {
        matches.push(`✅ ${check.name}: Present`);
    } else if (origCount > 0 && modCount === 0) {
        issues.push(`❌ ${check.name}: Missing in modular`);
    }
});

// Mechanics checks
mechanicsChecks.forEach(check => {
    const origCount = findAll(original, check.pattern);
    const modCount = findAll(modular, check.pattern);
    if (modCount > 0) {
        matches.push(`✅ ${check.name}: Implemented`);
    } else if (origCount > 0) {
        issues.push(`❌ ${check.name}: Not found`);
    }
});

// Function checks
functions.forEach(func => {
    if (modular.includes(func)) {
        matches.push(`✅ Function: ${func}`);
    } else {
        issues.push(`⚠️ Function missing: ${func}`);
    }
});

// Special checks
if (speedMultipliers.original === speedMultipliers.modular) {
    matches.push(`✅ Speed Multipliers: ${speedMultipliers.modular}`);
} else {
    issues.push(`❌ Speed Multipliers: ${speedMultipliers.modular}`);
}

// Print summary
console.log(`\n✅ MATCHES: ${matches.length}`);
matches.slice(0, 10).forEach(m => console.log(`  ${m}`));
if (matches.length > 10) console.log(`  ... and ${matches.length - 10} more`);

console.log(`\n❌ ISSUES: ${issues.length}`);
issues.forEach(i => console.log(`  ${i}`));

// Detailed analysis
console.log('\n🔬 DETAILED ANALYSIS:');
console.log('-'.repeat(40));

// Check for duplicate element handling
const hasDuplicateCheck = modular.includes('Check for duplicate element');
console.log(`Duplicate Element Auto-Fusion: ${hasDuplicateCheck ? '✅ FIXED' : '❌ MISSING'}`);

// Check boss spawning
const bossSpawnPattern = /if.*survivalTime.*>=.*60/;
const hasBossSpawn = bossSpawnPattern.test(modular);
console.log(`Boss Spawn Logic: ${hasBossSpawn ? '✅ Present' : '❌ Missing'}`);

// Check element descriptions
const hasElementDesc = modular.includes('elementDescriptions');
console.log(`Element Descriptions: ${hasElementDesc ? '✅ Present' : '❌ Missing'}`);

// Final verdict
console.log('\n' + '='.repeat(60));
if (issues.length === 0) {
    console.log('🎉 PERFECT PARITY ACHIEVED!');
} else if (issues.length < 5) {
    console.log(`⚠️ MINOR ISSUES: ${issues.length} parity issues found`);
} else {
    console.log(`❗ SIGNIFICANT DIVERGENCE: ${issues.length} parity issues need fixing`);
}

console.log('\nRecommendation: Focus on fixing the issues listed above.');
process.exit(issues.length > 0 ? 1 : 0);