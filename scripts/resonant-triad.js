(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.ResonantTriad = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const VERSION = 1;
    const FEATURE_FLAG = 'buildDiversityV1';
    const PROOF_STAGES = Object.freeze(['forest', 'castle']);
    const PROOF_SPEEDS = Object.freeze(['frolic']);
    const PRIMARY_SPELLS = Object.freeze(['fire', 'water', 'earth', 'air', 'lightning', 'arcane']);
    const ENABLED_SPELLS = Object.freeze([
        'fire', 'water', 'earth', 'air', 'lightning', 'arcane',
        'lava', 'mud', 'ice', 'blast', 'thunder', 'storm', 'gravity',
        'poison', 'hex', 'holy', 'life', 'crystal', 'meteor', 'wave'
    ]);
    const DEFERRED_SPELLS = Object.freeze([
        'steam', 'sand', 'laser', 'illusion', 'volcano', 'rock', 'nature', 'metal',
        'star', 'smoke', 'vortex', 'tornado', 'dust', 'sun', 'moon', 'time'
    ]);

    const SPELLS = Object.freeze({
        fire: { tags: ['directed', 'burn', 'rapid'], fit: ['crucible'], bridge: ['covenant'], role: 'heat' },
        water: { tags: ['primer', 'wet', 'slow'], fit: ['tempest', 'bastion'], bridge: ['covenant'], role: 'primer' },
        earth: { tags: ['breaker', 'knockback', 'burst'], fit: ['bastion'], bridge: ['crucible'], role: 'breaker' },
        air: { tags: ['burst', 'knockback', 'multi'], fit: ['tempest'], bridge: ['bastion', 'crucible'], role: 'route' },
        lightning: { tags: ['chain', 'shock', 'multi'], fit: ['tempest'], bridge: ['bastion'], role: 'route' },
        arcane: { tags: ['homing', 'return', 'mark'], fit: ['covenant'], bridge: ['tempest', 'bastion'], role: 'affliction' },
        lava: { tags: ['zone', 'burn'], fit: ['crucible'], bridge: ['bastion'], role: 'heat' },
        mud: { tags: ['zone', 'slow', 'control'], fit: ['bastion'], bridge: ['crucible'], role: 'control' },
        ice: { tags: ['freeze', 'slow', 'control'], fit: ['bastion'], bridge: ['tempest'], role: 'control' },
        blast: { tags: ['burst', 'burn', 'knockback'], fit: ['crucible'], bridge: ['bastion'], role: 'heat' },
        thunder: { tags: ['multi', 'stun', 'burst'], fit: ['tempest'], bridge: ['bastion'], role: 'route' },
        storm: { tags: ['bounce', 'chain'], fit: ['tempest'], bridge: [], role: 'route' },
        gravity: { tags: ['pull', 'control'], fit: ['bastion'], bridge: ['crucible', 'tempest'], role: 'control' },
        poison: { tags: ['mine', 'affliction', 'decay'], fit: ['covenant'], bridge: ['crucible'], role: 'affliction' },
        hex: { tags: ['homing', 'pierce', 'affliction'], fit: ['covenant'], bridge: [], role: 'affliction' },
        holy: { tags: ['burst', 'bless', 'finisher'], fit: ['covenant'], bridge: ['bastion'], role: 'finisher' },
        life: { tags: ['sustain', 'recovery'], fit: ['covenant'], bridge: [], role: 'sustain' },
        crystal: { tags: ['pierce', 'split', 'breaker'], fit: ['bastion'], bridge: ['tempest'], role: 'breaker' },
        meteor: { tags: ['remote-zone', 'burst', 'burn'], fit: ['crucible'], bridge: [], role: 'heat' },
        wave: { tags: ['pierce', 'wet', 'knockback'], fit: ['tempest'], bridge: ['bastion'], role: 'route' }
    });

    const CANONICAL_RECIPES = Object.freeze({
        'earth+fire': 'lava',
        'earth+water': 'mud',
        'air+water': 'ice',
        'air+fire': 'blast',
        'air+lightning': 'thunder',
        'lightning+water': 'storm',
        'earth+lightning': 'gravity',
        'arcane+earth': 'gravity',
        'arcane+water': 'poison',
        'arcane+fire': 'hex',
        'arcane+lightning': 'holy',
        'arcane+poison': 'life',
        'earth+poison': 'life',
        'lightning+poison': 'life',
        'arcane+life': 'holy',
        'gravity+life': 'holy',
        'earth+ice': 'crystal',
        'fire+gravity': 'meteor',
        'ice+water': 'wave'
    });

    const DISCIPLINES = Object.freeze({
        crucible: {
            name: 'CRUCIBLE', verbs: 'PREPARE / IGNITE', trigger: 'Stack 5 HEAT. Detonate the pack.',
            color: 0xff7a2f, shape: 'ring', imprints: ['fire', 'lava', 'blast', 'meteor'],
            techniques: ['Backdraft', 'Stoke the Kiln']
        },
        tempest: {
            name: 'TEMPEST', verbs: 'CONNECT / DISCHARGE', trigger: 'Route through 4 targets. Wet counts twice.',
            color: 0x43d9ff, shape: 'fork', imprints: ['water', 'lightning', 'air', 'storm'],
            techniques: ['Rainwire', 'Forked Current']
        },
        bastion: {
            name: 'BASTION', verbs: 'CONTROL / SHATTER', trigger: 'Build BREAK. Spend it with a breaker.',
            color: 0xc8ced8, shape: 'crack', imprints: ['earth', 'water', 'ice', 'mud'],
            techniques: ['Fault Line', 'Cold Anvil']
        },
        covenant: {
            name: 'COVENANT', verbs: 'AFFLICT / HARVEST', trigger: 'Stack 5 DECAY. Strike RIPE to heal.',
            color: 0xc568ff, shape: 'diamond', imprints: ['arcane', 'poison', 'hex', 'fire'],
            techniques: ['Blood Ledger', 'Ashen Vow']
        }
    });

    const SIGNATURES = Object.freeze({
        crucible: Object.freeze({ threshold: 5, perTargetMs: 250, bridgePerTargetMs: 333, expiryMs: 3000, damage: 2.5, targetLockMs: 1500, radius: 72, bossDamage: 1.25, bossStagger: 10 }),
        tempest: Object.freeze({ threshold: 4, windowMs: 750, payoff: 1.8, cooldownMs: 900, bossCountMs: 350, bossPayoff: 1.2, bossStagger: 8 }),
        bastion: Object.freeze({ maxBreak: 6, slowPoints: 1, hardControlPoints: 2, sourceMs: 400, breakerAt: 4, damagePerBreak: 0.8, radius: 88, targetLockMs: 1250, bossStatusCapMs: 400, bossControlStagger: 4, bossShatterStagger: 16, bossDamagePerBreak: 0.4 }),
        covenant: Object.freeze({ threshold: 5, perSourceMs: 500, expiryMs: 5000, ripeMs: 3000, damage: 1.2, maxHealth: 0.015, heal: 0.03, healCooldownMs: 2000, healWindowMs: 10000, healWindowCap: 0.12, bossMaxHealth: 0.005, bossStagger: 12 })
    });

    const TIER_VECTOR = Object.freeze({
        cap: 3,
        damage: Object.freeze([1, 1.15, 1.30]),
        secondary: Object.freeze([1, 1.10, 1.20])
    });
    const PASSIVES = Object.freeze({
        damage: { perStack: 0.08, cap: 3, title: 'FOCUSED FORCE' },
        area: { perStack: 0.08, cap: 3, title: 'WIDE STANCE' },
        move: { perStack: 0.06, cap: 3, title: 'FLEET SOLES' },
        health: { perStack: 0.12, cap: 3, title: 'DEEP BREATH' },
        revive: { perStack: 1, cap: 1, title: 'EXIT CLAUSE' }
    });
    const REAGENTS = Object.freeze({ milestones: Object.freeze([4, 6, 10, 14, 18]), cap: 3, autoBankMs: 4000, fusionCost: 2, tierCost: 1 });
    const VFX_BUDGETS = Object.freeze({
        actors: Object.freeze({ solo: 18, twoPlayer: 10, threePlayer: 8, fourPlayer: 7, team: 28 }),
        particles: Object.freeze({ solo: 48, twoPlayer: 24, threePlayer: 16, fourPlayer: 16, team: 64 }),
        labels: Object.freeze({ solo: 12, team: 20, aggregateMs: 250 }),
        secondaryAlpha: 0.7
    });
    const BOSS_STAGGER = Object.freeze({ max: 100, interruptMs: 2000, lockMs: 6000 });
    const FLEX_COEFFICIENT = 0.9;
    const CHARACTER_PERKS = Object.freeze({
        wizard: { name: 'REFINED FORMULA', text: 'Your first different-spell Fusion each run costs 1 Reagent instead of 2.' },
        grim: { name: 'DEBT COLLECTOR', text: 'A signature payoff heals 2% max HP once every 3s; at full HP, +8% move speed for 3s.' },
        orb: { name: 'OMNIFORM', text: 'Once per run, fuse any two different spells into a previewed FIT result at Tier I.' },
        blip: { name: 'PHASE STEP', text: 'After moving 2.0s, contact readies Flex and grants 0.6s invulnerability; 12s cooldown.' }
    });
    const COPY = Object.freeze({
        unavailable: 'UNAVAILABLE — RESULT HAS NO LEGAL SLOT. Replace or discard a spell first.',
        offPlan: 'OFF-PLAN — Wave pushes Heated enemies out of Kiln ground. FLEX ONLY.',
        needReagents: count => `NEED 2 REAGENTS — You have ${count}. Nothing will be spent.`,
        resultTierThree: 'RESULT ALREADY TIER III — This fusion would create no value.',
        signatureOffline: 'SIGNATURE OFFLINE — Fusion consumes both Resonance spells. Next FIT will refill R2.',
        pouchFull: 'POUCH FULL — Choose one spell to discard. No refund.',
        legacy: 'Legacy rules: extra live slots, no Disciplines, no first-clear credit or Discipline records.',
        controllerLost: playerNumber => `P${playerNumber} CONTROLLER LOST`
    });

    function clone(value) {
        if (value instanceof Set) return new Set(Array.from(value));
        if (value instanceof Map) return new Map(Array.from(value.entries()));
        if (Array.isArray(value)) return value.map(clone);
        if (value && typeof value === 'object') {
            const result = {};
            Object.keys(value).forEach(key => { result[key] = clone(value[key]); });
            return result;
        }
        return value;
    }

    function stableStringify(value) {
        if (value === undefined) return 'null';
        if (value === null || typeof value !== 'object') return JSON.stringify(value);
        if (value instanceof Set) return stableStringify(Array.from(value).sort());
        if (value instanceof Map) return stableStringify(Object.fromEntries(Array.from(value.entries()).sort(([a], [b]) => String(a).localeCompare(String(b)))));
        if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
        return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
    }

    function hashString(input) {
        let hash = 2166136261;
        const text = String(input);
        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function createRng(seed) {
        let state = (typeof seed === 'number' ? seed : hashString(seed)) >>> 0;
        if (state === 0) state = 0x6d2b79f5;
        return {
            next() {
                state += 0x6d2b79f5;
                let value = state;
                value = Math.imul(value ^ (value >>> 15), value | 1);
                value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
                return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
            },
            int(max) { return max > 0 ? Math.floor(this.next() * max) : 0; },
            get state() { return state >>> 0; }
        };
    }

    function seededPick(values, seedParts) {
        if (!values.length) return null;
        return values[createRng(stableStringify(seedParts)).int(values.length)];
    }

    function canonicalRecipeKey(a, b) {
        return [a, b].sort().join('+');
    }

    function getCanonicalFusion(a, b) {
        const result = CANONICAL_RECIPES[canonicalRecipeKey(a, b)] || null;
        return result && ENABLED_SPELLS.includes(result) ? result : null;
    }

    function isFit(spell, discipline) {
        return Boolean(SPELLS[spell] && SPELLS[spell].fit.includes(discipline));
    }

    function isBridge(spell, discipline) {
        return Boolean(SPELLS[spell] && SPELLS[spell].bridge.includes(discipline));
    }

    function isTriadAvailable(options) {
        return Boolean(options && options.flag === true && PROOF_STAGES.includes(options.stage) &&
            PROOF_SPEEDS.includes(options.speed || 'frolic') && (options.slotMode || 'standard') === 'standard');
    }

    function createItem(spell, tier = 1) {
        if (!ENABLED_SPELLS.includes(spell)) throw new Error(`Triad spell is not enabled: ${spell}`);
        return { spell, tier: Math.max(1, Math.min(TIER_VECTOR.cap, Math.trunc(tier) || 1)) };
    }

    function createPlayerState(options = {}) {
        const playerNumber = Math.max(1, Math.min(4, Math.trunc(options.playerNumber) || 1));
        const character = CHARACTER_PERKS[options.character] ? options.character : 'wizard';
        const startElement = PRIMARY_SPELLS.includes(options.startElement) ? options.startElement : PRIMARY_SPELLS[0];
        return {
            version: VERSION,
            playerNumber,
            character,
            discipline: null,
            channels: [createItem(startElement), null, null],
            pouch: [null, null],
            reagents: 0,
            reagentEscrow: 0,
            reagentLedger: [],
            rerollsRemaining: 1,
            reweavesRemaining: 1,
            techniques: [],
            passives: { damage: 0, area: 0, move: 0, health: 0, revive: 0 },
            cooldowns: {},
            lingeringSources: {},
            recipeDiscoveries: [],
            committedTransactions: [],
            alchemistDiscountAvailable: character === 'wizard',
            omniformAvailable: character === 'orb',
            phaseStep: { movingSince: null, readyAt: 0 },
            debtCollectorReadyAt: 0,
            signature: createSignatureState(),
            previousOfferTitles: [],
            offerCursor: 0,
            decisionLog: []
        };
    }

    function createSignatureState() {
        return {
            targets: {},
            tempestWindow: { startedAt: 0, targets: {}, count: 0 },
            payoffReadyAt: 0,
            healing: [],
            bossStagger: { points: 0, lockedUntil: 0, interruptedUntil: 0 },
            triggers: 0
        };
    }

    const REFS = Object.freeze(['r1', 'r2', 'flex', 'p0', 'p1']);
    function getAt(state, ref) {
        const index = REFS.indexOf(ref);
        if (index < 0) return undefined;
        return index < 3 ? state.channels[index] : state.pouch[index - 3];
    }
    function setAt(state, ref, value) {
        const index = REFS.indexOf(ref);
        if (index < 0) throw new Error(`Unknown Triad slot: ${ref}`);
        if (index < 3) state.channels[index] = value;
        else state.pouch[index - 3] = value;
    }
    function heldEntries(state) {
        return REFS.map(ref => ({ ref, item: getAt(state, ref) })).filter(entry => entry.item);
    }
    function activeCasterCount(state) {
        return state.channels.filter(Boolean).length;
    }
    function findSpell(state, spell) {
        return heldEntries(state).find(entry => entry.item.spell === spell) || null;
    }
    function bridgeCount(state, discipline = state.discipline) {
        return state.channels.slice(0, 2).filter(item => item && !isFit(item.spell, discipline) && isBridge(item.spell, discipline)).length;
    }
    function validForRef(state, item, ref, discipline = state.discipline) {
        if (!item) return true;
        if (!ENABLED_SPELLS.includes(item.spell)) return false;
        if (ref === 'flex' || ref === 'p0' || ref === 'p1' || !discipline) return true;
        if (isFit(item.spell, discipline)) return true;
        if (!isBridge(item.spell, discipline)) return false;
        const otherRef = ref === 'r1' ? 'r2' : 'r1';
        const other = getAt(state, otherRef);
        return !(other && !isFit(other.spell, discipline) && isBridge(other.spell, discipline));
    }

    function assertInvariants(state) {
        const failures = [];
        if (!Array.isArray(state.channels) || state.channels.length !== 3) failures.push('exactly three channels required');
        if (!Array.isArray(state.pouch) || state.pouch.length !== 2) failures.push('pouch capacity must be two');
        const entries = heldEntries(state);
        const spells = entries.map(entry => entry.item.spell);
        if (new Set(spells).size !== spells.length) failures.push('spell identities must be unique');
        entries.forEach(({ ref, item }) => {
            if (!ENABLED_SPELLS.includes(item.spell)) failures.push(`${item.spell} is deferred or unknown`);
            if (!Number.isInteger(item.tier) || item.tier < 1 || item.tier > 3) failures.push(`${ref} has invalid tier`);
            if (!validForRef(state, item, ref)) failures.push(`${item.spell} is illegal in ${ref}`);
        });
        if (!Number.isInteger(state.reagents) || state.reagents < 0 || state.reagents > 3) failures.push('invalid Reagent count');
        if (activeCasterCount(state) < 1) failures.push('at least one casting spell is required');
        if (state.discipline && bridgeCount(state) > 1) failures.push('only one Resonance Bridge is legal');
        if (state.techniques.length > 2 || new Set(state.techniques).size !== state.techniques.length) failures.push('invalid technique loadout');
        return { ok: failures.length === 0, failures };
    }

    function layoutForDiscipline(state, discipline) {
        if (!DISCIPLINES[discipline]) return { ok: false, reason: 'UNKNOWN_DISCIPLINE' };
        const all = heldEntries(state).map(entry => clone(entry.item));
        const used = new Set();
        const resonance = [];
        for (let i = 0; i < all.length && resonance.length < 2; i++) {
            if (isFit(all[i].spell, discipline)) { resonance.push(all[i]); used.add(i); }
        }
        if (resonance.length < 2) {
            const bridgeIndex = all.findIndex((item, index) => !used.has(index) && isBridge(item.spell, discipline));
            if (bridgeIndex >= 0) { resonance.push(all[bridgeIndex]); used.add(bridgeIndex); }
        }
        const rest = all.filter((_item, index) => !used.has(index));
        return { ok: true, resonance, rest };
    }

    function chooseImprint(discipline, excluded, seedParts) {
        const choices = DISCIPLINES[discipline].imprints.filter(spell => ENABLED_SPELLS.includes(spell) && !excluded.has(spell));
        const fullFits = choices.filter(spell => isFit(spell, discipline));
        const primaries = fullFits.filter(spell => PRIMARY_SPELLS.includes(spell));
        return seededPick(primaries.length ? primaries : fullFits, seedParts);
    }

    function attune(state, discipline, options = {}) {
        const draft = clone(state);
        const layout = layoutForDiscipline(draft, discipline);
        if (!layout.ok) return layout;
        const resonance = layout.resonance;
        const rest = layout.rest;
        const imprints = [];
        const excluded = new Set([...resonance, ...rest].map(item => item.spell));
        while (resonance.length < 2) {
            if (resonance.length + rest.length >= 5) {
                return { ok: false, reason: 'CAPACITY_CHOICE_REQUIRED', warning: COPY.pouchFull };
            }
            const spell = chooseImprint(discipline, excluded, [options.seed || 0, draft.playerNumber, discipline, resonance.length]);
            if (!spell) return { ok: false, reason: 'NO_IMPRINT' };
            excluded.add(spell);
            resonance.push(createItem(spell));
            imprints.push(spell);
        }
        draft.discipline = discipline;
        draft.channels = [resonance[0], resonance[1], rest.shift() || null];
        draft.pouch = [rest.shift() || null, rest.shift() || null];
        if (rest.length) return { ok: false, reason: 'CAPACITY_CHOICE_REQUIRED', warning: COPY.pouchFull };
        draft.signature = createSignatureState();
        const invariant = assertInvariants(draft);
        if (!invariant.ok) return { ok: false, reason: 'INVARIANT', failures: invariant.failures };
        return { ok: true, state: draft, imprints, online: true };
    }

    function purgeSource(draft, ref, result) {
        if (draft.lingeringSources[ref]) {
            result.purgedSources.push(ref);
            delete draft.lingeringSources[ref];
        }
    }

    function economicSnapshot(state) {
        return {
            items: heldEntries(state).map(entry => ({ spell: entry.item.spell, tier: entry.item.tier })).sort((a, b) => a.spell.localeCompare(b.spell)),
            reagents: state.reagents,
            reagentEscrow: state.reagentEscrow,
            rerollsRemaining: state.rerollsRemaining,
            recipes: [...state.recipeDiscoveries].sort()
        };
    }

    function inventorySnapshot(state) {
        return {
            channels: state.channels.map(item => item ? clone(item) : null),
            pouch: state.pouch.map(item => item ? clone(item) : null),
            reagents: state.reagents,
            reagentEscrow: state.reagentEscrow,
            rerollsRemaining: state.rerollsRemaining,
            reweavesRemaining: state.reweavesRemaining,
            techniques: state.techniques.slice(),
            passives: clone(state.passives),
            alchemistDiscountAvailable: state.alchemistDiscountAvailable,
            omniformAvailable: state.omniformAvailable
        };
    }

    function resolveFusionDestination(draft, consumedRefs, resultItem, requested) {
        const candidates = [];
        if (requested) candidates.push(requested);
        consumedRefs.filter(ref => ref === 'r1' || ref === 'r2').sort().forEach(ref => candidates.push(ref));
        consumedRefs.filter(ref => ref === 'flex').forEach(ref => candidates.push(ref));
        candidates.push('flex');
        consumedRefs.filter(ref => ref === 'p0' || ref === 'p1').sort().forEach(ref => candidates.push(ref));
        candidates.push('p0', 'p1');
        for (const ref of Array.from(new Set(candidates))) {
            if ((getAt(draft, ref) === null || consumedRefs.includes(ref)) && validForRef(draft, resultItem, ref)) return ref;
        }
        return null;
    }

    function previewTransaction(state, transaction) {
        const id = String(transaction && transaction.id || '');
        if (!id) return { ok: false, reason: 'TRANSACTION_ID_REQUIRED' };
        if (state.committedTransactions.includes(id)) return { ok: true, idempotent: true, state: clone(state), transactionId: id };
        const draft = clone(state);
        const result = { ok: false, transactionId: id, state: draft, cost: 0, purgedSources: [], recipeDiscovery: null, warnings: [] };
        const type = transaction.type;
        try {
            if (type === 'acquire') {
                const spell = transaction.spell;
                if (!ENABLED_SPELLS.includes(spell)) throw new Error('SPELL_DISABLED');
                const existing = findSpell(draft, spell);
                if (existing) {
                    if (existing.item.tier >= 3) throw new Error('DUPLICATE_TIER_III');
                    existing.item.tier++;
                    result.destination = existing.ref;
                } else {
                    const item = createItem(spell, transaction.tier || 1);
                    let destination = transaction.destination;
                    if (!destination) destination = REFS.find(ref => !getAt(draft, ref) && validForRef(draft, item, ref));
                    if (!destination && transaction.replaceRef) destination = transaction.replaceRef;
                    if (!destination || !REFS.includes(destination) || !validForRef(draft, item, destination)) throw new Error('NO_LEGAL_SLOT');
                    const outgoing = getAt(draft, destination);
                    if (outgoing && !transaction.replaceRef) throw new Error('REPLACEMENT_REQUIRED');
                    if (outgoing) purgeSource(draft, destination, result);
                    setAt(draft, destination, item);
                    draft.cooldowns[destination] = 'FULL';
                    result.destination = destination;
                }
            } else if (type === 'swap') {
                const a = transaction.a;
                const b = transaction.b;
                if (!REFS.includes(a) || !REFS.includes(b) || a === b) throw new Error('INVALID_SWAP');
                const itemA = getAt(draft, a);
                const itemB = getAt(draft, b);
                setAt(draft, a, null); setAt(draft, b, null);
                if (!validForRef(draft, itemB, a) || !validForRef(draft, itemA, b)) throw new Error('ILLEGAL_DESTINATION');
                setAt(draft, a, itemB); setAt(draft, b, itemA);
                if (a.startsWith('p') || b.startsWith('p')) {
                    purgeSource(draft, a.startsWith('p') ? b : a, result);
                    const incoming = a.startsWith('p') ? b : a;
                    draft.cooldowns[incoming] = 'FULL';
                }
            } else if (type === 'discard') {
                const ref = transaction.ref;
                if (!getAt(draft, ref)) throw new Error('EMPTY_SLOT');
                if (ref === 'r1' || ref === 'r2' || ref === 'flex') {
                    if (activeCasterCount(draft) <= 1) throw new Error('ZERO_CASTER');
                    purgeSource(draft, ref, result);
                }
                setAt(draft, ref, null);
            } else if (type === 'tierUp') {
                const entry = transaction.ref ? { ref: transaction.ref, item: getAt(draft, transaction.ref) } : findSpell(draft, transaction.spell);
                if (!entry || !entry.item) throw new Error('SPELL_NOT_HELD');
                if (entry.item.tier >= 3) throw new Error('TIER_CAP');
                if (draft.reagents < 1) throw new Error('NEED_REAGENT');
                result.cost = 1;
                draft.reagents--;
                entry.item.tier++;
                result.destination = entry.ref;
            } else if (type === 'fusion' || type === 'omniform') {
                const a = transaction.a;
                const b = transaction.b;
                const itemA = getAt(draft, a);
                const itemB = getAt(draft, b);
                if (!itemA || !itemB || a === b || itemA.spell === itemB.spell) throw new Error('TWO_DIFFERENT_SPELLS_REQUIRED');
                const isOmniform = type === 'omniform';
                let fusionResult = isOmniform ? transaction.result : getCanonicalFusion(itemA.spell, itemB.spell);
                if (isOmniform) {
                    if (draft.character !== 'orb' || !draft.omniformAvailable) throw new Error('OMNIFORM_UNAVAILABLE');
                    if (!isFit(fusionResult, draft.discipline)) throw new Error('OMNIFORM_RESULT_NOT_FIT');
                }
                if (!fusionResult || !ENABLED_SPELLS.includes(fusionResult)) throw new Error('NO_CANONICAL_RECIPE');
                let cost = 2;
                if (!isOmniform && draft.character === 'wizard' && draft.alchemistDiscountAvailable) cost = 1;
                if (draft.reagents < cost) throw new Error('NEED_REAGENTS');
                const resultTier = isOmniform ? 1 : Math.min(3, Math.ceil((itemA.tier + itemB.tier) / 2));
                const existing = findSpell(draft, fusionResult);
                if (existing && existing.ref !== a && existing.ref !== b && existing.item.tier >= 3) throw new Error('RESULT_TIER_III');
                setAt(draft, a, null); setAt(draft, b, null);
                purgeSource(draft, a, result); purgeSource(draft, b, result);
                if (existing && existing.ref !== a && existing.ref !== b) {
                    existing.item.tier = Math.min(3, existing.item.tier + Math.max(1, resultTier - 1));
                    result.destination = existing.ref;
                } else {
                    const resultItem = createItem(fusionResult, resultTier);
                    const destination = resolveFusionDestination(draft, [a, b], resultItem, transaction.destination);
                    if (!destination) throw new Error('NO_LEGAL_SLOT');
                    setAt(draft, destination, resultItem);
                    draft.cooldowns[destination] = 'FULL';
                    result.destination = destination;
                }
                if (activeCasterCount(draft) < 1) throw new Error('ZERO_CASTER');
                draft.reagents -= cost;
                result.cost = cost;
                result.result = fusionResult;
                result.resultTier = resultTier;
                if (isOmniform) draft.omniformAvailable = false;
                else {
                    if (draft.character === 'wizard' && draft.alchemistDiscountAvailable) draft.alchemistDiscountAvailable = false;
                    const recipeKey = `${canonicalRecipeKey(itemA.spell, itemB.spell)}=${fusionResult}`;
                    if (!draft.recipeDiscoveries.includes(recipeKey)) {
                        draft.recipeDiscoveries.push(recipeKey);
                        result.recipeDiscovery = recipeKey;
                    }
                }
                if (!draft.channels[0] || !draft.channels[1]) result.warnings.push(COPY.signatureOffline);
            } else if (type === 'reweave') {
                if (draft.reweavesRemaining < 1) throw new Error('REWEAVE_SPENT');
                if (!DISCIPLINES[transaction.discipline] || transaction.discipline === draft.discipline) throw new Error('INVALID_DISCIPLINE');
                const before = economicSnapshot(draft);
                const layout = layoutForDiscipline(draft, transaction.discipline);
                if (!layout.ok) throw new Error('INVALID_DISCIPLINE');
                const rest = layout.rest;
                draft.discipline = transaction.discipline;
                draft.channels = [layout.resonance[0] || null, layout.resonance[1] || null, rest.shift() || null];
                draft.pouch = [rest.shift() || null, rest.shift() || null];
                if (rest.length) throw new Error('CAPACITY_CHOICE_REQUIRED');
                if (activeCasterCount(draft) < 1) throw new Error('ZERO_CASTER');
                draft.reweavesRemaining--;
                draft.signature = createSignatureState();
                result.economicIdentity = stableStringify(before) === stableStringify(economicSnapshot(draft));
                if (!result.economicIdentity) throw new Error('REWEAVE_ECONOMIC_DELTA');
            } else if (type === 'passive') {
                const key = transaction.passive;
                const def = PASSIVES[key];
                if (!def) throw new Error('UNKNOWN_PASSIVE');
                if (draft.passives[key] >= def.cap) throw new Error('PASSIVE_CAP');
                draft.passives[key]++;
            } else if (type === 'technique') {
                const technique = transaction.technique;
                if (!DISCIPLINES[draft.discipline].techniques.includes(technique)) throw new Error('WRONG_TECHNIQUE');
                if (draft.techniques.includes(technique) || draft.techniques.length >= 2) throw new Error('TECHNIQUE_CAP');
                draft.techniques.push(technique);
            } else if (type === 'mend') {
                result.healFraction = 0.35;
            } else {
                throw new Error('UNKNOWN_TRANSACTION');
            }
        } catch (error) {
            result.reason = error.message;
            result.state = clone(state);
            result.cost = 0;
            result.purgedSources = [];
            return result;
        }
        const invariant = assertInvariants(draft);
        if (!invariant.ok) return { ...result, ok: false, state: clone(state), cost: 0, reason: 'INVARIANT', failures: invariant.failures, purgedSources: [] };
        result.ok = true;
        result.state = draft;
        return result;
    }

    function commitTransaction(state, transaction) {
        if (state.committedTransactions.includes(String(transaction.id))) {
            return { ok: true, idempotent: true, state: clone(state), transactionId: String(transaction.id) };
        }
        const preview = previewTransaction(state, transaction);
        if (!preview.ok) return preview;
        preview.state.committedTransactions.push(preview.transactionId);
        preview.state.decisionLog.push({ type: 'transaction', id: preview.transactionId, action: transaction.type, cost: preview.cost, destination: preview.destination || null });
        return preview;
    }

    function preAttunementOffers(state, event) {
        const held = new Set(heldEntries(state).map(entry => entry.item.spell));
        const start = state.channels[0] ? state.channels[0].spell : 'fire';
        const pairCandidates = PRIMARY_SPELLS.filter(spell => !held.has(spell) && getCanonicalFusion(start, spell));
        const pair = seededPick(pairCandidates.length ? pairCandidates : PRIMARY_SPELLS.filter(spell => !held.has(spell)), [event.seedCursor, state.playerNumber, 'PAIR']);
        const deepenTarget = heldEntries(state).find(entry => entry.item.tier < 3);
        return [
            { category: 'PAIR', title: `PAIR • ${String(pair).toUpperCase()}`, transaction: { type: 'acquire', spell: pair } },
            deepenTarget
                ? { category: 'DEEPEN', title: `DEEPEN • ${deepenTarget.item.spell.toUpperCase()} II`, transaction: { type: 'acquire', spell: deepenTarget.item.spell } }
                : { category: 'DEEPEN', title: 'DEEPEN • FOCUSED FORCE', transaction: { type: 'passive', passive: 'damage' } },
            { category: 'SURVIVE', title: 'SURVIVE • FLEET SOLES', transaction: { type: 'passive', passive: 'move' } }
        ];
    }

    function firstLegalAcquireDestination(state, spell, preferFlex) {
        const existing = findSpell(state, spell);
        if (existing) return existing.item.tier < 3 ? { type: 'acquire', spell } : null;
        const item = createItem(spell);
        const refs = preferFlex ? ['flex', 'p0', 'p1', 'r1', 'r2'] : ['r1', 'r2', 'flex', 'p0', 'p1'];
        let destination = refs.find(ref => !getAt(state, ref) && validForRef(state, item, ref));
        if (destination) return { type: 'acquire', spell, destination };
        destination = preferFlex ? 'flex' : (isFit(spell, state.discipline) ? 'r2' : 'flex');
        if (!validForRef(state, item, destination)) destination = 'flex';
        return { type: 'acquire', spell, destination, replaceRef: destination };
    }

    function legalFusionTransactions(state) {
        const entries = heldEntries(state);
        const transactions = [];
        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                const result = getCanonicalFusion(entries[i].item.spell, entries[j].item.spell);
                if (!result) continue;
                const transaction = {
                    id: `preview:fusion:${entries[i].ref}:${entries[j].ref}:${result}`,
                    type: 'fusion',
                    a: entries[i].ref,
                    b: entries[j].ref
                };
                const preview = previewTransaction(state, transaction);
                if (preview.ok) transactions.push({ transaction: { ...transaction, id: undefined }, preview });
            }
        }
        return transactions;
    }

    function generateOffers(state, event, options = {}) {
        if (!state.discipline) return preAttunementOffers(state, event);
        const cursor = Number(event.seedCursor || 0) + Number(options.rerollOffset || 0);
        const seedParts = [options.seed || 0, cursor, state.playerNumber, stableStringify(economicSnapshot(state)), state.discipline];
        const resonance = state.channels.slice(0, 2);
        let fitSpell;
        if (resonance.some(item => !item)) {
            const held = new Set(heldEntries(state).map(entry => entry.item.spell));
            fitSpell = seededPick(ENABLED_SPELLS.filter(spell => isFit(spell, state.discipline) && !held.has(spell)), [...seedParts, 'forming']);
        }
        if (!fitSpell) {
            const upgradable = resonance.find(item => item && item.tier < 3);
            if (upgradable) fitSpell = upgradable.spell;
        }
        let fitTransaction = fitSpell ? firstLegalAcquireDestination(state, fitSpell, false) : null;
        let fitTitle = fitSpell ? `FIT • ${fitSpell.toUpperCase()} DEPTH` : null;
        if (!fitTransaction) {
            const fusions = legalFusionTransactions(state).filter(candidate => isFit(candidate.preview.result, state.discipline));
            const candidate = seededPick(fusions, [...seedParts, 'fit-fusion']);
            if (candidate) {
                fitTransaction = candidate.transaction;
                fitTitle = `FIT • ${candidate.preview.result.toUpperCase()} FUSION`;
            }
        }
        if (!fitTransaction) {
            const technique = DISCIPLINES[state.discipline].techniques.find(name => !state.techniques.includes(name));
            if (technique && state.techniques.length < 2) {
                fitTransaction = { type: 'technique', technique };
                fitTitle = `FIT • ${technique.toUpperCase()}`;
            }
        }
        if (!fitTransaction) {
            const item = heldEntries(state).find(entry => entry.item.tier < 3);
            fitTransaction = item ? { type: 'acquire', spell: item.item.spell } : { type: 'mend' };
            fitTitle = item ? `FIT • ${item.item.spell.toUpperCase()} DEPTH` : 'FIT • STEADY RHYTHM';
        }

        const bridgeCandidates = ENABLED_SPELLS.filter(spell => isBridge(spell, state.discipline));
        let bridgeSpell = seededPick(bridgeCandidates.filter(spell => !findSpell(state, spell) || findSpell(state, spell).item.tier < 3), [...seedParts, 'bridge']);
        if (!bridgeSpell) bridgeSpell = bridgeCandidates[0];
        let bridgeTransaction = firstLegalAcquireDestination(state, bridgeSpell, true);
        const bridgeFusions = legalFusionTransactions(state).filter(candidate =>
            isBridge(candidate.preview.result, state.discipline) || isFit(candidate.preview.result, state.discipline));
        const bridgeFusion = seededPick(bridgeFusions, [...seedParts, 'bridge-fusion']);
        if (bridgeFusion && createRng(stableStringify([...seedParts, 'bridge-kind'])).next() < 0.35) {
            bridgeSpell = bridgeFusion.preview.result;
            bridgeTransaction = bridgeFusion.transaction;
        }
        if (!bridgeTransaction) bridgeTransaction = { type: 'mend' };

        const wildKeys = Object.keys(PASSIVES).filter(key => state.passives[key] < PASSIVES[key].cap);
        const wildWeights = { health: 30, move: 25, area: 20, damage: 15, revive: 10 };
        const weighted = [];
        wildKeys.forEach(key => { for (let i = 0; i < wildWeights[key]; i++) weighted.push(key); });
        const wildKey = seededPick(weighted, [...seedParts, 'wild']);
        const wildTransaction = wildKey ? { type: 'passive', passive: wildKey } : { type: 'mend' };

        const offers = [
            { category: 'FIT', title: fitTitle, transaction: fitTransaction, copy: DISCIPLINES[state.discipline].trigger },
            { category: 'BRIDGE', title: `BRIDGE • ${bridgeSpell.toUpperCase()}`, transaction: bridgeTransaction, copy: 'Flex adapts at 90% output; Bridge can feed your signature.' },
            { category: 'WILD', title: wildKey ? `WILD • ${PASSIVES[wildKey].title}` : 'WILD • MEND', transaction: wildTransaction, copy: wildKey ? `Stack ${state.passives[wildKey] + 1}/${PASSIVES[wildKey].cap}` : 'Heal 35% max HP.' }
        ];
        const banned = new Set(options.excludeTitles || []);
        if (banned.size) {
            if (banned.has(offers[0].title)) {
                const technique = DISCIPLINES[state.discipline].techniques
                    .find(name => !state.techniques.includes(name) && !banned.has(`FIT • ${name.toUpperCase()}`));
                const alternate = resonance.find(item => item && item.tier < 3 && !banned.has(`FIT • ${item.spell.toUpperCase()} DEPTH`));
                if (technique && state.techniques.length < 2) {
                    offers[0] = { category: 'FIT', title: `FIT • ${technique.toUpperCase()}`, transaction: { type: 'technique', technique }, copy: DISCIPLINES[state.discipline].trigger };
                } else if (alternate) {
                    offers[0] = { category: 'FIT', title: `FIT • ${alternate.spell.toUpperCase()} DEPTH`, transaction: { type: 'acquire', spell: alternate.spell }, copy: DISCIPLINES[state.discipline].trigger };
                }
            }
            if (banned.has(offers[1].title)) {
                const alternate = bridgeCandidates.find(spell =>
                    !banned.has(`BRIDGE • ${spell.toUpperCase()}`) && firstLegalAcquireDestination(state, spell, true));
                if (alternate) offers[1] = {
                    category: 'BRIDGE', title: `BRIDGE • ${alternate.toUpperCase()}`,
                    transaction: firstLegalAcquireDestination(state, alternate, true),
                    copy: 'Flex adapts at 90% output; Bridge can feed your signature.'
                };
            }
            if (banned.has(offers[2].title)) {
                const alternate = wildKeys.find(key => !banned.has(`WILD • ${PASSIVES[key].title}`));
                if (alternate) offers[2] = {
                    category: 'WILD', title: `WILD • ${PASSIVES[alternate].title}`,
                    transaction: { type: 'passive', passive: alternate },
                    copy: `Stack ${state.passives[alternate] + 1}/${PASSIVES[alternate].cap}`
                };
            }
        }
        return offers;
    }

    function rerollOffers(state, event, currentOffers, seed) {
        if (state.rerollsRemaining < 1) return { ok: false, reason: 'REROLL_SPENT', state: clone(state) };
        const draft = clone(state);
        draft.rerollsRemaining--;
        draft.offerCursor++;
        const offers = generateOffers(draft, event, { seed, rerollOffset: draft.offerCursor, excludeTitles: currentOffers.map(offer => offer.title) });
        return { ok: true, state: draft, offers };
    }

    function createRewardQueue(playerNumbers = [1]) {
        return { events: [], nextOwnerIndex: 0, playerNumbers: [...playerNumbers].sort(), cursor: 0, bossGatePending: false };
    }

    function enqueueThreshold(queue, level, livingPlayerNumbers) {
        const draft = clone(queue);
        if (level === 4) {
            draft.events.push({ level, ownerPlayerNumber: null, seedCursor: draft.cursor++, kind: 'ATTUNEMENT' });
            return draft;
        }
        const living = draft.playerNumbers.filter(number => livingPlayerNumbers.includes(number));
        if (!living.length) return draft;
        let owner = null;
        for (let offset = 0; offset < draft.playerNumbers.length; offset++) {
            const index = (draft.nextOwnerIndex + offset) % draft.playerNumbers.length;
            const candidate = draft.playerNumbers[index];
            if (living.includes(candidate)) {
                owner = candidate;
                draft.nextOwnerIndex = (index + 1) % draft.playerNumbers.length;
                break;
            }
        }
        draft.events.push({ level, ownerPlayerNumber: owner, seedCursor: draft.cursor++, kind: level < 4 ? 'SPARK' : 'REWARD' });
        return draft;
    }

    function dequeueReward(queue) {
        const draft = clone(queue);
        return { queue: draft, event: draft.events.shift() || null };
    }

    function requestBossGate(queue) {
        const draft = clone(queue);
        draft.bossGatePending = true;
        return draft;
    }

    function canOpenBossGate(queue) {
        return queue.bossGatePending && queue.events.length === 0;
    }

    function grantMilestoneReagent(state, level, options = {}) {
        const draft = clone(state);
        if (!REAGENTS.milestones.includes(level)) return { ok: false, reason: 'NOT_MILESTONE', state: draft };
        const ledgerId = `L${level}:P${draft.playerNumber}`;
        if (draft.reagentLedger.some(entry => entry.id === ledgerId)) return { ok: true, idempotent: true, state: draft };
        const entry = { id: ledgerId, level, ownerPlayerNumber: draft.playerNumber, source: 'MILESTONE', status: options.dead ? 'ESCROW' : (options.autoBank ? 'AUTO_BANK' : 'PICKUP') };
        if (options.collectorPlayerNumber && options.collectorPlayerNumber !== draft.playerNumber) return { ok: false, reason: 'NON_OWNER', state: draft };
        if (options.dead && draft.reagents + draft.reagentEscrow < REAGENTS.cap) draft.reagentEscrow++;
        else if (options.dead) entry.status = 'CAP_WASTE';
        else if (draft.reagents < REAGENTS.cap) draft.reagents++;
        else entry.status = 'CAP_WASTE';
        draft.reagentLedger.push(entry);
        return { ok: true, state: draft, entry };
    }

    function bankEscrow(state) {
        const draft = clone(state);
        const room = Math.max(0, REAGENTS.cap - draft.reagents);
        const banked = Math.min(room, draft.reagentEscrow);
        let remainingBanked = banked;
        draft.reagents += banked;
        draft.reagentEscrow = 0;
        draft.reagentLedger.filter(entry => entry.status === 'ESCROW').forEach(entry => { entry.status = remainingBanked-- > 0 ? 'REVIVE_BANK' : 'CAP_WASTE'; });
        return draft;
    }

    function addBossStagger(signatureState, points, now) {
        const stagger = signatureState.bossStagger;
        if (now < stagger.lockedUntil) return { triggered: false, points: stagger.points };
        stagger.points = Math.min(100, stagger.points + Math.max(0, points));
        if (stagger.points >= 100) {
            stagger.points = 0;
            stagger.interruptedUntil = now + BOSS_STAGGER.interruptMs;
            stagger.lockedUntil = now + BOSS_STAGGER.lockMs;
            return { triggered: true, points: 0, interruptMs: BOSS_STAGGER.interruptMs };
        }
        return { triggered: false, points: stagger.points };
    }

    function applySignatureHit(state, hit) {
        const draft = clone(state);
        const discipline = draft.discipline;
        if (!discipline || !DISCIPLINES[discipline]) return { state: draft, triggered: false, damage: 0, healFraction: 0, stagger: 0 };
        const now = Math.max(0, Number(hit.now) || 0);
        const targetId = String(hit.targetId || 'target');
        const source = String(hit.source || 'unknown');
        const channel = hit.channel || 'r1';
        const resonance = channel === 'r1' || channel === 'r2';
        const bridge = Boolean(hit.bridge);
        if (!resonance && !bridge) return { state: draft, triggered: false, damage: 0, healFraction: 0, stagger: 0 };
        const target = draft.signature.targets[targetId] || (draft.signature.targets[targetId] = {});
        let triggered = false;
        let damage = 0;
        let healFraction = 0;
        let stagger = 0;
        let label = null;

        if (discipline === 'crucible' && (hit.tags || []).some(tag => tag === 'burn' || tag === 'zone')) {
            const config = SIGNATURES.crucible;
            if (target.heatExpiry && now > target.heatExpiry) target.heat = 0;
            const cadence = bridge ? config.bridgePerTargetMs : config.perTargetMs;
            if (target.lastHeatAt === undefined || now - target.lastHeatAt >= cadence) {
                target.heat = Math.min(config.threshold, (target.heat || 0) + 1);
                target.lastHeatAt = now;
                target.heatExpiry = now + config.expiryMs;
            }
            if (target.heat >= config.threshold && now >= (target.detonateReadyAt || 0)) {
                target.heat = 0;
                target.detonateReadyAt = now + config.targetLockMs;
                triggered = true; label = 'KILN';
                damage = (Number(hit.damage) || 0) * (hit.isBoss ? config.bossDamage : config.damage);
                if (hit.isBoss) stagger = config.bossStagger;
            }
        } else if (discipline === 'tempest') {
            const config = SIGNATURES.tempest;
            const window = draft.signature.tempestWindow;
            if (window.startedAt === undefined || now - window.startedAt > config.windowMs) {
                window.startedAt = now; window.targets = {}; window.count = 0;
            }
            if (hit.isBoss) {
                if (target.lastBossCountAt === undefined || now - target.lastBossCountAt >= config.bossCountMs) {
                    target.lastBossCountAt = now; window.count++;
                }
            } else if (!window.targets[targetId]) {
                window.targets[targetId] = true;
                window.count += hit.wet ? 2 : 1;
            }
            if (window.count >= config.threshold && now >= draft.signature.payoffReadyAt) {
                window.count = 0; window.targets = {}; draft.signature.payoffReadyAt = now + config.cooldownMs;
                triggered = true; label = 'CONDUCT';
                damage = (Number(hit.damage) || 0) * (hit.isBoss ? config.bossPayoff : config.payoff);
                if (hit.isBoss) stagger = config.bossStagger;
            }
        } else if (discipline === 'bastion') {
            const config = SIGNATURES.bastion;
            const tags = hit.tags || [];
            const controlPoints = tags.includes('freeze') || tags.includes('stun') ? 2 : tags.some(tag => tag === 'slow' || tag === 'knockback' || tag === 'control') ? 1 : 0;
            const sourceKey = `${source}:break`;
            if (controlPoints && (target[sourceKey] === undefined || now - target[sourceKey] >= config.sourceMs)) {
                target[sourceKey] = now;
                target.break = Math.min(config.maxBreak, (target.break || 0) + controlPoints);
                if (hit.isBoss) stagger += controlPoints * config.bossControlStagger;
            }
            if (tags.includes('breaker') && (target.break || 0) >= config.breakerAt && now >= (target.fractureReadyAt || 0)) {
                const consumed = target.break;
                target.break = 0; target.fractureReadyAt = now + config.targetLockMs;
                triggered = true; label = 'SHATTER';
                damage = (Number(hit.damage) || 0) * consumed * (hit.isBoss ? config.bossDamagePerBreak : config.damagePerBreak);
                if (hit.isBoss) stagger += config.bossShatterStagger;
            }
        } else if (discipline === 'covenant') {
            const config = SIGNATURES.covenant;
            if (target.decayExpiry && now > target.decayExpiry) { target.decay = 0; target.ripeUntil = 0; }
            const sourceKey = `${source}:decay`;
            const afflicting = (hit.tags || []).some(tag => tag === 'affliction' || tag === 'decay' || tag === 'mark');
            if (afflicting && (target[sourceKey] === undefined || now - target[sourceKey] >= config.perSourceMs)) {
                target[sourceKey] = now;
                target.decay = Math.min(config.threshold, (target.decay || 0) + 1);
                target.decayExpiry = now + config.expiryMs;
                if (target.decay >= config.threshold && !target.ripeUntil) target.ripeUntil = now + config.ripeMs;
            }
            if (target.ripeUntil && now <= target.ripeUntil && hit.consumeRipe) {
                target.decay = 0; target.ripeUntil = 0;
                triggered = true; label = 'HARVEST';
                damage = (Number(hit.damage) || 0) * config.damage + (Number(hit.targetMaxHealth) || 0) * (hit.isBoss ? config.bossMaxHealth : config.maxHealth);
                if (hit.isBoss) stagger = config.bossStagger;
                draft.signature.healing = draft.signature.healing.filter(entry => now - entry.at < config.healWindowMs);
                const healed = draft.signature.healing.reduce((sum, entry) => sum + entry.fraction, 0);
                if (now >= draft.signature.payoffReadyAt && healed < config.healWindowCap) {
                    healFraction = Math.min(config.heal, config.healWindowCap - healed);
                    draft.signature.healing.push({ at: now, fraction: healFraction });
                    draft.signature.payoffReadyAt = now + config.healCooldownMs;
                }
            }
        }
        let staggerResult = null;
        if (stagger > 0 && hit.isBoss) staggerResult = addBossStagger(draft.signature, stagger, now);
        if (triggered) draft.signature.triggers++;
        return { state: draft, triggered, damage, healFraction, stagger, staggerResult, label };
    }

    function applyCharacterSignaturePerk(state, payoff, now, healthFraction = 1) {
        const draft = clone(state);
        const result = { state: draft, healFraction: 0, moveBuff: 0, moveBuffMs: 0 };
        if (!payoff || draft.character !== 'grim' || now < draft.debtCollectorReadyAt) return result;
        draft.debtCollectorReadyAt = now + 3000;
        if (healthFraction < 1) result.healFraction = 0.02;
        else {
            result.moveBuff = 0.08;
            result.moveBuffMs = 3000;
        }
        return result;
    }

    function updatePhaseStep(state, input) {
        const draft = clone(state);
        const now = Math.max(0, Number(input.now) || 0);
        const moving = Boolean(input.moving);
        if (draft.character !== 'blip') return { state: draft, triggered: false };
        if (moving && draft.phaseStep.movingSince === null) draft.phaseStep.movingSince = now;
        if (!moving) draft.phaseStep.movingSince = null;
        const charged = draft.phaseStep.movingSince !== null && now - draft.phaseStep.movingSince >= 2000;
        const triggered = charged && Boolean(input.contact) && now >= draft.phaseStep.readyAt;
        if (triggered) {
            draft.phaseStep.readyAt = now + 12000;
            draft.phaseStep.movingSince = null;
            draft.cooldowns.flex = 0;
        }
        return { state: draft, triggered, invulnerabilityMs: triggered ? 600 : 0, flexReadied: triggered };
    }

    function simulationChecksum(events, vfxSetting) {
        const simulationOnly = events.map(event => ({
            at: event.at, source: event.source, target: event.target,
            damage: event.damage, status: event.status, killed: Boolean(event.killed)
        }));
        void vfxSetting;
        return hashString(stableStringify(simulationOnly)).toString(16).padStart(8, '0');
    }

    function autoPickIndex(state, offers, kind = 'REWARD') {
        if (!Array.isArray(offers) || offers.length === 0) return -1;
        if (kind === 'ATTUNEMENT') {
            let selected = 0;
            let best = -1;
            Object.keys(DISCIPLINES).forEach((discipline, index) => {
                const count = heldEntries(state).filter(entry => isFit(entry.item.spell, discipline)).length;
                if (count > best) { best = count; selected = index; }
            });
            return selected;
        }
        const forming = !state.channels[0] || !state.channels[1];
        if (forming) {
            const fit = offers.findIndex(offer => offer.category === 'FIT');
            if (fit >= 0) return fit;
        }
        const wild = offers.findIndex(offer => offer.category === 'WILD');
        if (wild >= 0) return wild;
        const bridge = offers.findIndex(offer => offer.category === 'BRIDGE');
        return bridge >= 0 ? bridge : 0;
    }

    class DecisionLog {
        constructor(meta = {}) {
            this.version = VERSION;
            this.meta = { ...meta };
            this.events = [];
            this.startedAt = Number(meta.startedAt) || 0;
        }
        record(type, payload = {}, at = 0) {
            const event = { index: this.events.length, at: Math.max(0, Number(at) || 0), type, ...clone(payload) };
            this.events.push(event);
            return event;
        }
        export() { return { version: this.version, meta: clone(this.meta), events: clone(this.events) }; }
        checksum() { return hashString(stableStringify(this.export())).toString(16).padStart(8, '0'); }
    }

    return Object.freeze({
        VERSION, FEATURE_FLAG, PROOF_STAGES, PROOF_SPEEDS, PRIMARY_SPELLS, ENABLED_SPELLS, DEFERRED_SPELLS,
        SPELLS, CANONICAL_RECIPES, DISCIPLINES, SIGNATURES, TIER_VECTOR, PASSIVES, REAGENTS, VFX_BUDGETS,
        BOSS_STAGGER, FLEX_COEFFICIENT, CHARACTER_PERKS, COPY, clone, stableStringify, hashString, createRng, seededPick,
        canonicalRecipeKey, getCanonicalFusion, isFit, isBridge, isTriadAvailable, createItem, createPlayerState,
        createSignatureState, getAt, setAt, heldEntries, activeCasterCount, findSpell, validForRef, assertInvariants,
        layoutForDiscipline, attune, economicSnapshot, inventorySnapshot, previewTransaction, commitTransaction, preAttunementOffers,
        generateOffers, rerollOffers, createRewardQueue, enqueueThreshold, dequeueReward, requestBossGate,
        canOpenBossGate, grantMilestoneReagent, bankEscrow, addBossStagger, applySignatureHit,
        legalFusionTransactions, applyCharacterSignaturePerk, updatePhaseStep, simulationChecksum, autoPickIndex, DecisionLog
    });
});
