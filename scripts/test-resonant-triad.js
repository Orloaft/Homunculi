'use strict';

const assert = require('node:assert/strict');
const Triad = require('./resonant-triad.js');
const SaveManager = require('../src/systems/SaveManager.js');

function transaction(state, tx, id) {
    const result = Triad.commitTransaction(state, { ...tx, id });
    assert.equal(result.ok, true, `${tx.type} failed: ${result.reason || result.failures}`);
    return result;
}

function attunedState(options = {}) {
    let state = Triad.createPlayerState({
        playerNumber: options.playerNumber || 1,
        character: options.character || 'wizard',
        startElement: options.startElement || 'fire'
    });
    const result = Triad.attune(state, options.discipline || 'crucible', { seed: options.seed || 17 });
    assert.equal(result.ok, true, `attunement failed: ${result.reason}`);
    state = result.state;
    state.reagents = options.reagents === undefined ? 3 : options.reagents;
    return state;
}

function signatureSequence(discipline, hits) {
    let state = attunedState({ discipline, startElement: discipline === 'covenant' ? 'arcane' : 'fire' });
    let result;
    hits.forEach(hit => {
        result = Triad.applySignatureHit(state, hit);
        state = result.state;
    });
    return result;
}

function installStorage() {
    const values = new Map();
    global.localStorage = {
        getItem: key => values.has(key) ? values.get(key) : null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: key => values.delete(key),
        clear: () => values.clear()
    };
    return values;
}

function run() {
    assert.equal(process.versions.node.split('.')[0] >= 20 && process.versions.node.split('.')[0] < 26, true, 'Node 20-25 required');
    assert.equal(Triad.ENABLED_SPELLS.length, 20);
    assert.equal(Triad.DEFERRED_SPELLS.length, 16);
    assert.equal(new Set([...Triad.ENABLED_SPELLS, ...Triad.DEFERRED_SPELLS]).size, 36);
    assert.equal(Triad.getCanonicalFusion('fire', 'earth'), 'lava');
    assert.equal(Triad.getCanonicalFusion('fire', 'water'), null, 'deferred Steam leaked into Triad');

    assert.equal(Triad.isTriadAvailable({ flag: true, stage: 'forest', speed: 'frolic', slotMode: 'standard' }), true);
    assert.equal(Triad.isTriadAvailable({ flag: true, stage: 'castle', speed: 'frolic', slotMode: 'standard' }), true);
    assert.equal(Triad.isTriadAvailable({ flag: false, stage: 'forest', speed: 'frolic', slotMode: 'standard' }), false);
    assert.equal(Triad.isTriadAvailable({ flag: true, stage: 'cave', speed: 'frolic', slotMode: 'standard' }), false);
    assert.equal(Triad.isTriadAvailable({ flag: true, stage: 'forest', speed: 'hyper', slotMode: 'standard' }), false);
    assert.equal(Triad.isTriadAvailable({ flag: true, stage: 'forest', speed: 'frolic', slotMode: 'extended' }), false);

    for (const character of Object.keys(Triad.CHARACTER_PERKS)) {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            for (const level of [0, 10, 20]) {
                const state = Triad.createPlayerState({ playerNumber, character, startElement: 'air' });
                assert.equal(state.channels.length, 3, `${character} P${playerNumber} L${level}`);
                assert.equal(state.pouch.length, 2);
                assert.equal(Triad.activeCasterCount(state), 1);
                assert.equal(Triad.assertInvariants(state).ok, true);
            }
        }
    }

    for (const startElement of Triad.PRIMARY_SPELLS) {
        for (const discipline of Object.keys(Triad.DISCIPLINES)) {
            const state = Triad.createPlayerState({ startElement });
            const before = Triad.stableStringify(Triad.economicSnapshot(state));
            const result = Triad.attune(state, discipline, { seed: 991 });
            assert.equal(result.ok, true, `${startElement} -> ${discipline}`);
            assert.ok(result.imprints.length <= 2);
            assert.equal(result.state.channels.slice(0, 2).every(Boolean), true);
            assert.equal(Triad.assertInvariants(result.state).ok, true);
            assert.equal(Triad.stableStringify(Triad.economicSnapshot(state)), before, 'attune mutated input');
        }
    }

    let queue = Triad.createRewardQueue([1, 2, 3, 4]);
    for (let level = 1; level <= 8; level++) queue = Triad.enqueueThreshold(queue, level, level === 6 ? [1, 3, 4] : [1, 2, 3, 4]);
    assert.deepEqual(queue.events.map(event => event.level), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.equal(queue.events.filter(event => event.kind === 'ATTUNEMENT').length, 1);
    assert.equal(queue.events.find(event => event.level === 6).ownerPlayerNumber, 1, 'dead P2 was not skipped deterministically');
    const ownersBefore = queue.events.map(event => event.ownerPlayerNumber);
    queue = Triad.requestBossGate(queue);
    assert.equal(Triad.canOpenBossGate(queue), false);
    while (queue.events.length) queue = Triad.dequeueReward(queue).queue;
    assert.equal(Triad.canOpenBossGate(queue), true);
    assert.ok(ownersBefore.includes(4), 'P4 never received ownership');

    const deterministic = attunedState({ discipline: 'tempest', startElement: 'water' });
    for (let seed = 0; seed < 10000; seed++) {
        const event = { level: 5 + (seed % 16), ownerPlayerNumber: 1, seedCursor: seed, kind: 'REWARD' };
        const one = Triad.generateOffers(deterministic, event, { seed });
        const two = Triad.generateOffers(deterministic, event, { seed });
        assert.equal(Triad.stableStringify(one), Triad.stableStringify(two));
        assert.deepEqual(one.map(offer => offer.category), ['FIT', 'BRIDGE', 'WILD']);
        one.forEach((offer, index) => {
            const preview = Triad.previewTransaction(deterministic, { ...offer.transaction, id: `offer:${seed}:${index}` });
            assert.equal(preview.ok, true, `${seed} ${offer.category}: ${preview.reason}`);
        });
    }
    const current = Triad.generateOffers(deterministic, { level: 5, seedCursor: 2 }, { seed: 77 });
    const rerolled = Triad.rerollOffers(deterministic, { level: 5, seedCursor: 2 }, current, 77);
    assert.equal(rerolled.ok, true);
    assert.equal(rerolled.state.rerollsRemaining, 0);
    assert.equal(rerolled.offers.some(offer => current.map(card => card.title).includes(offer.title)), false);
    assert.equal(Triad.autoPickIndex({ ...deterministic, channels: [deterministic.channels[0], null, deterministic.channels[2]] }, current), 0);

    let state = Triad.createPlayerState({ character: 'wizard', startElement: 'fire' });
    state.reagents = 3;
    state = transaction(state, { type: 'acquire', spell: 'earth', destination: 'r2' }, 'acquire-earth').state;
    const original = Triad.stableStringify(state);
    const cancelledPreview = Triad.previewTransaction(state, { id: 'cancelled', type: 'fusion', a: 'r1', b: 'r2' });
    assert.equal(cancelledPreview.ok, true);
    assert.equal(Triad.stableStringify(state), original, 'preview mutated state');
    const fused = transaction(state, { type: 'fusion', a: 'r1', b: 'r2' }, 'fusion-1');
    assert.equal(fused.cost, 1, 'Alchemist first-fusion discount missing');
    assert.equal(fused.result, 'lava');
    assert.equal(fused.state.reagents, 2);
    assert.equal(fused.state.alchemistDiscountAvailable, false);
    assert.equal(Triad.findSpell(fused.state, 'lava').item.tier, 1);
    assert.equal(fused.state.recipeDiscoveries.length, 1);
    const replay = Triad.commitTransaction(fused.state, { id: 'fusion-1', type: 'fusion', a: 'r1', b: 'r2' });
    assert.equal(replay.idempotent, true);
    assert.equal(replay.state.reagents, 2);

    let math = Triad.createPlayerState({ startElement: 'fire' });
    math.reagents = 3;
    math = transaction(math, { type: 'acquire', spell: 'earth', tier: 2, destination: 'r2' }, 'math-earth').state;
    math = transaction(math, { type: 'acquire', spell: 'fire' }, 'math-fire-tier').state;
    const ceilFusion = transaction(math, { type: 'fusion', a: 'r1', b: 'r2' }, 'ceil-fusion');
    assert.equal(ceilFusion.resultTier, 2, 'ceil-average fusion tier changed');
    const zeroCaster = Triad.previewTransaction(Triad.createPlayerState(), { id: 'discard-only', type: 'discard', ref: 'r1' });
    assert.equal(zeroCaster.ok, false);
    assert.equal(zeroCaster.reason, 'ZERO_CASTER');
    const insufficient = Triad.previewTransaction({ ...math, reagents: 0 }, { id: 'no-money', type: 'tierUp', ref: 'r1' });
    assert.equal(insufficient.ok, false);
    assert.equal(insufficient.cost, 0);

    let reweave = attunedState({ discipline: 'crucible', startElement: 'fire' });
    const inventoryBefore = Triad.inventorySnapshot(reweave);
    const changed = transaction(reweave, { type: 'reweave', discipline: 'covenant' }, 'reweave');
    const inventoryAfter = Triad.inventorySnapshot(changed.state);
    assert.deepEqual(inventoryAfter.channels.concat(inventoryAfter.pouch).filter(Boolean).sort((a, b) => a.spell.localeCompare(b.spell)),
        inventoryBefore.channels.concat(inventoryBefore.pouch).filter(Boolean).sort((a, b) => a.spell.localeCompare(b.spell)));
    assert.equal(changed.state.reagents, reweave.reagents);
    assert.equal(changed.state.reweavesRemaining, 0);

    let reagentState = Triad.createPlayerState({ playerNumber: 2 });
    let nonOwner = Triad.grantMilestoneReagent(reagentState, 4, { collectorPlayerNumber: 1 });
    assert.equal(nonOwner.ok, false);
    for (const level of Triad.REAGENTS.milestones) {
        const grant = Triad.grantMilestoneReagent(reagentState, level, { autoBank: true });
        assert.equal(grant.ok, true);
        reagentState = grant.state;
    }
    assert.equal(reagentState.reagents, 3);
    assert.equal(reagentState.reagentLedger.filter(entry => entry.status === 'CAP_WASTE').length, 2);
    let escrow = Triad.createPlayerState({ playerNumber: 3 });
    escrow = Triad.grantMilestoneReagent(escrow, 4, { dead: true }).state;
    escrow = Triad.grantMilestoneReagent(escrow, 6, { dead: true }).state;
    assert.equal(escrow.reagentEscrow, 2);
    escrow = Triad.bankEscrow(escrow);
    assert.equal(escrow.reagents, 2);
    assert.equal(escrow.reagentEscrow, 0);

    const kiln = signatureSequence('crucible', [0, 250, 500, 750, 1000].map(now => ({ now, targetId: 't', source: 'fire', channel: 'r1', tags: ['burn'], damage: 10 })));
    assert.equal(kiln.triggered, true); assert.equal(kiln.damage, 25);
    const conduction = signatureSequence('tempest', [1, 2, 3, 4].map((target, index) => ({ now: index * 100, targetId: target, source: 'storm', channel: 'r1', tags: ['chain'], damage: 10 })));
    assert.equal(conduction.triggered, true); assert.equal(conduction.damage, 18);
    const shatterHits = [0, 400, 800, 1200].map(now => ({ now, targetId: 't', source: 'water', channel: 'r1', tags: ['slow'], damage: 10 }));
    shatterHits.push({ now: 1300, targetId: 't', source: 'earth', channel: 'r2', tags: ['breaker'], damage: 10 });
    const shatter = signatureSequence('bastion', shatterHits);
    assert.equal(shatter.triggered, true); assert.equal(shatter.damage, 32);
    const harvestHits = [0, 500, 1000, 1500, 2000].map(now => ({ now, targetId: 't', source: 'poison', channel: 'r1', tags: ['affliction'], damage: 10, targetMaxHealth: 1000 }));
    harvestHits.push({ now: 2100, targetId: 't', source: 'arcane', channel: 'r2', tags: ['mark'], damage: 10, targetMaxHealth: 1000, consumeRipe: true });
    const harvest = signatureSequence('covenant', harvestHits);
    assert.equal(harvest.triggered, true); assert.equal(harvest.damage, 27); assert.equal(harvest.healFraction, 0.03);

    const bossState = Triad.createSignatureState();
    const bossTrigger = Triad.addBossStagger(bossState, 100, 1000);
    assert.equal(bossTrigger.triggered, true); assert.equal(bossTrigger.interruptMs, 2000);
    assert.equal(Triad.addBossStagger(bossState, 100, 2000).triggered, false, 'boss retriggered during lock');
    assert.equal(Triad.addBossStagger(bossState, 100, 7000).triggered, true);

    const sim = [{ at: 1, source: 'r1', target: 'e1', damage: 3, status: 'wet', killed: false }];
    assert.equal(Triad.simulationChecksum(sim, 'low'), Triad.simulationChecksum(sim, 'high'));
    let grim = Triad.createPlayerState({ character: 'grim' });
    const debt = Triad.applyCharacterSignaturePerk(grim, true, 1000, 0.5);
    assert.equal(debt.healFraction, 0.02);
    assert.equal(Triad.applyCharacterSignaturePerk(debt.state, true, 2000, 0.5).healFraction, 0);
    let blip = Triad.createPlayerState({ character: 'blip' });
    blip = Triad.updatePhaseStep(blip, { now: 1000, moving: true }).state;
    const phase = Triad.updatePhaseStep(blip, { now: 3000, moving: true, contact: true });
    assert.equal(phase.triggered, true); assert.equal(phase.invulnerabilityMs, 600); assert.equal(phase.flexReadied, true);

    const values = installStorage();
    const manager = new SaveManager();
    const legacy = manager.getEmptySaveData();
    delete legacy.discovery; delete legacy.triad; delete legacy.stats.disciplineRuns;
    const legacyMeaning = {
        stages: Triad.clone(legacy.stages), characters: Triad.clone(legacy.characters),
        talents: Triad.clone(legacy.talents), alchemy: Triad.clone(legacy.alchemy)
    };
    const normalized = manager.normalizeSaveData(legacy);
    assert.deepEqual({ stages: normalized.stages, characters: normalized.characters, talents: normalized.talents, alchemy: normalized.alchemy }, legacyMeaning);
    assert.deepEqual(normalized.discovery.disciplines, {});
    assert.deepEqual(normalized.stats.disciplineRuns, {});
    assert.equal(manager.createNewSave(0) !== null, true);
    manager.currentSaveData = manager.normalizeSaveData(manager.currentSaveData);
    assert.equal(manager.recordTriadDiscovery('crucible', { attuned: true, signatureTriggered: true, win: true, runComplete: true, at: 42, bestMetric: 7 }), true);
    const readback = manager.getTriadReadback();
    assert.equal(readback.disciplines.crucible.wins, 1);
    assert.equal(readback.runs.crucible.runs, 1);
    const stored = JSON.parse(values.get('wizbiz_save_0'));
    assert.deepEqual(stored.alchemy, normalized.alchemy);

    const retryA = Triad.createPlayerState({ startElement: 'fire' });
    const retryB = Triad.createPlayerState({ startElement: 'water' });
    assert.equal(retryB.discipline, null); assert.equal(retryB.reagents, 0); assert.equal(retryB.rerollsRemaining, 1);
    assert.notEqual(Triad.stableStringify(retryA.channels), Triad.stableStringify(retryB.channels));

    console.log(JSON.stringify({
        ok: true,
        offerSets: 10000,
        characters: Object.keys(Triad.CHARACTER_PERKS).length,
        players: 4,
        starts: Triad.PRIMARY_SPELLS.length,
        disciplines: Object.keys(Triad.DISCIPLINES).length,
        enabledSpells: Triad.ENABLED_SPELLS.length,
        deferredSpells: Triad.DEFERRED_SPELLS.length
    }));
}

run();
