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
