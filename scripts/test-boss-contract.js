const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const contract = require('./boss-contract');

const gameSource = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');

function attackCycles(timerInterval, cooldownDuration, speedMultiplier = 1, windowMs = 15000) {
    let cycles = 0;
    let readyAt = 0;
    const interval = timerInterval / speedMultiplier;
    for (let now = 0; now < windowMs; now += interval) {
        if (contract.cooldownReady(now, readyAt)) {
            cycles++;
            readyAt = contract.nextCooldownAt(now, cooldownDuration, speedMultiplier);
        }
    }
    return cycles;
}

const healthResult = contract.applyCappedHealthDamage(200, 200, 80);
assert.deepEqual(healthResult, { health: 150, appliedDamage: 50 }, 'boss hit must cause capped real health loss');
assert.equal(contract.applyCappedHealthDamage(0, 200, 20).health, 0, 'dead health must remain terminal');

assert.ok(attackCycles(1600, 3500) >= 3, 'Amphibian must attack at least three times in 15 seconds at 1x');
for (let king = 1; king <= 3; king++) {
    assert.ok(attackCycles(1600, 2000) >= 3, `Sea King ${king} must attack at least three times in 15 seconds at 1x`);
}
assert.ok(attackCycles(1000, 3000) >= 3, 'King Nothing must attack at least three times in 15 seconds at 1x');
assert.equal(contract.cooldownReady(1000, 1500), false, 'paused/non-advancing scene time must not consume cooldown');
assert.ok(attackCycles(1600, 3500, 2) > attackCycles(1600, 3500, 1), 'hyper mode must scale cadence using elapsed scene time');

for (let row = 0; row < 4; row++) {
    assert.deepEqual(contract.directionalFrameRange(row, 12), { start: row * 12, end: row * 12 + 11 });
    assert.deepEqual(contract.directionalFrameRange(row, 9), { start: row * 9, end: row * 9 + 8 });
}
assert.match(gameSource, /start: rowIndex \* 12,[\s\S]*?end: rowIndex \* 12 \+ 11/, 'Sea King attacks must use complete 12-frame rows');
assert.match(gameSource, /start: rowIndex \* 9,[\s\S]*?end: rowIndex \* 9 \+ 8/, 'Sea King deaths must use complete 9-frame rows');
assert.match(gameSource, /king\.currentDirection = direction;[\s\S]*?attack-\$\{direction\}/, 'Sea King direction must be captured at attack start');

assert.match(gameSource, /load\.spritesheet\('king-nothing-run'/, 'King Nothing run strip must be a spritesheet');
assert.match(gameSource, /key: 'king-nothing-run'[\s\S]*?end: 7/, 'King Nothing run animation must traverse all eight frames');
assert.match(gameSource, /playKingNothingAttack\(boss, 'king-nothing-attack[123]'/, 'King Nothing attacks must transition to attack animations');
assert.match(gameSource, /boss\.play\('king-nothing-death'\)/, 'King Nothing death must transition to its death animation');
assert.match(gameSource, /visualState = 'leap-windup'[\s\S]*?visualState = 'leap-airborne'[\s\S]*?visualState = 'leap-impact'/,
    'Demon Slime leap must expose explicit visual states');

const kingBody = contract.centeredBodyConfig(160, 111, 45, 86);
assert.deepEqual(kingBody, { width: 45, height: 86, offsetX: 57.5, offsetY: 12.5 },
    'King Nothing body must be derived from and centered in one 160x111 frame');
for (const scale of [4, 3.2]) {
    const spriteCenter = { x: 160 * scale / 2, y: 111 * scale / 2 };
    const bodyCenter = {
        x: (kingBody.offsetX + kingBody.width / 2) * scale,
        y: (kingBody.offsetY + kingBody.height / 2) * scale
    };
    assert.ok(Math.hypot(bodyCenter.x - spriteCenter.x, bodyCenter.y - spriteCenter.y) < 10,
        `King Nothing body center drifted at scale ${scale}`);
}

const centeredFamilies = [
    [32, 20, 20, 16],
    [80, 35, 50, 30],
    [96, 64, 30, 42],
    [180, 180, 40, 62]
];
centeredFamilies.forEach(([frameWidth, frameHeight, bodyWidth, bodyHeight]) => {
    const body = contract.centeredBodyConfig(frameWidth, frameHeight, bodyWidth, bodyHeight);
    assert.equal(body.offsetX + body.width / 2, frameWidth / 2, 'giant body x center drifted');
    assert.equal(body.offsetY + body.height / 2, frameHeight / 2, 'giant body y center drifted');
});

assert.match(gameSource, /scheduleBossVictory\(delay = 2000\)[\s\S]*?setTimeout\(/,
    'terminal boss progression must use an unscaled wall-clock timer');
assert.match(gameSource, /scheduleWonSceneTransition\(delay = 3000\)[\s\S]*?setTimeout\(/,
    'won-scene transition must remain independent of Phaser scene time');
assert.equal((gameSource.match(/this\.scheduleBossVictory\(2000\);/g) || []).length, 2,
    'generic and Sea Kings completion paths must both use unscaled terminal scheduling');
assert.match(gameSource, /if \(this\.gameWonCalled \|\| this\._bossVictoryScheduled\) return false;/,
    'terminal scheduling must be exactly once');
assert.match(gameSource, /if \(bossDeathComplete\) return;[\s\S]*?bossDeathComplete = true;/,
    'generic boss rewards must be claimed exactly once');
assert.match(gameSource, /if \(this\.seaKingsCompletionStarted\) return;[\s\S]*?this\.seaKingsCompletionStarted = true;/,
    'Sea Kings rewards must be claimed exactly once');
assert.match(gameSource, /if \(this\.gameEnded \|\| this\.gameWonCalled\) \{[\s\S]*?return;[\s\S]*?FIRST PAUSE GAME CALLED BY/,
    'late reward callbacks must not re-pause a terminal scene');

const enemyRepairExpectations = [
    ["giantCobra.play('cobra-walking')", 'giant cobra must use the base-family animation'],
    ["giantBloboid.play('bloboid-walking')", 'giant bloboid must use the base-family animation'],
    ["sprite(x, y, 'skeleton-yellow-walk', 0)", 'giant yellow skeleton must use the base-family texture'],
    ["giantSkeleton.play('skeleton-yellow-walking')", 'giant yellow skeleton must use the base-family animation'],
    ["sprite(x, y, 'castle-knight', 0)", 'giant castle knight must use the base-family texture'],
    ["giantKnight.play('castle-knight-run')", 'giant castle knight must use the base-family animation'],
    ["sprite(x, y, 'summoner-idle', 0)", 'summoner must start with a valid texture'],
    ["summoner.play('summoner-idling')", 'summoner must start with a valid animation']
];
enemyRepairExpectations.forEach(([needle, message]) => assert.ok(gameSource.includes(needle), message));

const boss = { active: true, health: 100 };
const encounter = contract.createEncounter(1, boss);
let timerDestroyed = 0;
let tweenStopped = 0;
let hazardDestroyed = 0;
encounter.actionTimers.add({ destroy: () => timerDestroyed++ });
encounter.actionTweens.add({ stop: () => tweenStopped++ });
encounter.cleanups.add(() => hazardDestroyed++);
const capturedGeneration = encounter.actionGeneration;
assert.equal(contract.isCallbackValid(encounter, boss, capturedGeneration), true);
assert.equal(contract.claimCompletion(encounter), true, 'terminal completion must be claimable once');
assert.equal(contract.claimCompletion(encounter), false, 'terminal completion must not be claimable twice');
assert.equal(contract.terminateEncounter(encounter), true);
assert.equal(contract.terminateEncounter(encounter), false, 'terminal cancellation must be idempotent');
assert.equal(contract.isCallbackValid(encounter, boss, capturedGeneration), false, 'captured mid-attack callback must be invalid after death');
assert.deepEqual({ timerDestroyed, tweenStopped, hazardDestroyed }, { timerDestroyed: 1, tweenStopped: 1, hazardDestroyed: 1 },
    'forced mid-attack death must cancel timers, tweens, and hazards exactly once');

for (const forbidden of ['.takeDamage', 'this.playerHit']) {
    assert.equal(gameSource.includes(forbidden), false, `obsolete boss damage API remains: ${forbidden}`);
}
assert.match(gameSource, /\[this\.wizard, this\.wizard2, this\.wizard3, this\.wizard4\]/,
    'canonical boss damage path must recognize P1-P4');

console.log('[boss-contract] deterministic combat, cadence, frame, animation, and cancellation assertions passed');
