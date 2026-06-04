# Ocean Promotion Audit

Date: 2026-06-04

Scope: docs-only audit for the Ocean/Sea Kings promotion lane. Runtime evidence comes from `scripts/game.js`; workflow requirements come from `docs/PRODUCTION_READINESS_WORKFLOW.md` and `docs/PARALLEL_WORLD_AUDIT.md`.

## Status

Ocean is not ready for promotion. It has a clear aquatic content shell and a dedicated Sea Kings boss entry, but it is behind Snow in the production promotion order and still has runtime blockers that can make the boss gate report victory too early or fail to report victory at all.

Promotion should wait until:

- Snow is promoted with deterministic and live gates.
- Ocean has deterministic feel/progression coverage.
- Sea Kings have explicit multi-boss death/completion handling.
- Ocean has one named live smoke that would fail on roster drift, boss entry drift, and completion drift.

## Current World Content

Runtime IDs:

- Stage: `ocean`
- World ID: `oceanland`
- Completion ID: `ocean-1`
- Stage title asset: `oceanland-title`
- Stage select planet asset: `planet-ocean`
- Stage BGM: `oceanland-bgm`
- Boss BGM: Sea Kings use `boss3-bgm`

Progression:

- Snow victory unlocks Ocean.
- Ocean victory unlocks Lava.
- Ocean has no character unlock.

Theme and element hooks:

- Ocean stage copy exists in the stage intro conversation.
- Water and Wave are present as themed elements.
- `ice+water` fuses into `wave`.
- `waterslime` appears as the Ocean elemental slime and drops `water`.
- Wave spell/orb assets are loaded.

Enemy assets and roster:

- Ocean-specific enemies are loaded for `jellyfish`, `crabby`, `shark`, `squid`, and `crablore`.
- `waterslime` is available as the elemental drop source.
- Sea Kings boss assets are loaded for `seaking1`, `seaking2`, and `seaking3`, each with walk, attack, and death spritesheets.

Wave content:

- Wave 0: `jellyfish`, `crabby`; spawn interval `3000`, max enemies `15`.
- Wave 1: adds `squid`; spawn interval `1500`, max enemies `35`.
- Wave 2: adds `shark` and `waterslime`; spawn interval `1200`, max enemies `45`; jellyfish swarm event.
- Wave 3: adds `crablore`; spawn interval `1000`, max enemies `55`.
- Wave 4: deep-sea mix with shark circle event; spawn interval `2000`, max enemies `65`.
- Wave 5+: full Ocean roster; spawn interval `600`, max enemies `150`.

Boss content:

- Boss routing calls `createSeaKingsBoss()` for Ocean.
- Sea Kings spawn three active boss sprites in a triangle formation.
- Each king is marked `isSeaKing`, `isBoss`, has separate health, movement speed, attack damage, and cooldown.
- `this.boss` points at the first king for legacy systems.
- A shared `SEA KINGS` health bar displays combined health.
- Boss AI updates all living kings and spawns phase minions at 75%, 50%, and 25% combined health.

## Runtime Risks

- Ocean is outside the current deterministic feel/progression gate set. `smoke:feel` and progression tuning checks cover Forest, Cave, Sand, and Swamp only.
- Ocean has no vertical-slice tuning entry. It does not get early catalyst milestones, XP/pickup tuning, readable first-minute spawn interval normalization, or boss health multiplier support.
- The general random stage spawn branch still maps Ocean to generic enemies: `soul`, `slime`, `bloboid`, `darkbat`, `intellectdevourer`, and `wraith`. Wave spawning uses the aquatic roster, but any older spawn path can still break Ocean identity.
- Ocean health scaling is very steep: base difficulty `1.5` and per-wave scaling `3.0`. Without deterministic balance coverage this can regress live survivability quickly.
- Ocean wave 0 is more crowded than the promoted first-slice shape. Promoted gates currently expect a readable opener around `6000ms` to `6700ms` after density/tuning, with `7` to `8` max enemies; Ocean opens at `3000ms` and `15` max enemies before any Ocean tuning.
- Water/Wave identity is present, but early reward bias only helps Forest/Cave/Sand/Swamp. Ocean does not currently bias a single held element toward a compatible fusion setup.

## Boss And Sea Kings Blockers

- Generic boss death handling treats any `enemy.isBoss` death as a full boss death. Because each Sea King is individually marked `isBoss`, killing one king can call `handleBossDeath()` instead of waiting for all three kings.
- `handleBossDeath()` has no Sea Kings branch. A Sea King falls through to `obelisk-death`, even though Sea King death animations are loaded.
- The `handleBossDeath()` completion listener only proceeds for `nekros-death`, `archer-boss-death`, `obelisk-death`, and `eyelor-death`. If Sea Kings are switched to their real death animation without a matching completion branch, victory can stall.
- Sea Kings use a shared health bar, but `this.boss` points only to king 1. Legacy projectile and boss-specific systems that damage `this.boss` may ignore the other two kings.
- `updateSeaKingsBossAI()` returns when all kings are dead but does not itself trigger victory, cleanup, or `gameWon()`.
- Phase minions are placeholders. The method chooses `crab`, `jellyfish`, and `seahorse`, but then always calls `spawnSpecificEnemy('golem', x, y)`.
- Sea Kings do not use the vertical-slice boss health tuning path. Their health is density-scaled manually from `2000` per king, with normal density resulting in `1000` each and `3000` total.
- The live gate needs to assert all three kings are present, not just `this.boss`.

## Smoke And Live Gate Requirements

Before Ocean is promoted, add deterministic coverage that verifies:

- Ocean opening roster uses aquatic enemies only.
- Ocean first three waves include at least five distinct aquatic/water enemies.
- Opening spawn interval and max enemy count are tuned to a readable first minute.
- Ocean has catalyst support at the same early milestone shape as promoted worlds, or the audit explicitly accepts a different Ocean-specific shape.
- Ocean boss health tuning is intentional and stable.
- Early element rewards can produce Water/Wave-compatible setup.
- Snow victory unlocks Ocean and Ocean victory unlocks Lava, including save reload assertions.
- Ocean completion records `ocean-1`.

Before adding a named live gate, the live harness should be able to assert:

- Stage starts as `ocean`.
- The opening live run survives at least 25-30 seconds.
- Enemy activity includes Ocean-specific enemies, not generic fallback enemies.
- At least one XP pickup and one kill happen.
- Boss fast-forward can spawn Sea Kings.
- `scene.seaKings.length === 3`.
- Every king has `isSeaKing === true`, `isBoss === true`, active physics, and a Sea King enemy type.
- The shared boss health UI exists and reads `SEA KINGS`.
- Sea Kings boss music starts.
- At least one Sea King attack projectile is produced safely.
- Killing one king does not call `gameWon()`.
- Killing all three kings triggers rewards, cleanup, `gameWon()`, `ocean-1` completion, and Lava unlock after reload.

Current green release gates should still run before widening the production slice:

- `node --check scripts/game.js`
- `npm run compile`
- `npm run smoke:prod`
- `npm run smoke:feel`
- `npm run smoke:progression`
- `npm run smoke:live`
- `npm run smoke:forest-live`
- `npm run smoke:swamp-live`

## Recommended Start Config

Ocean is not viable for a named promotion gate yet. For exploratory live smoke only, use the shared live harness with an Ocean stage override:

```sh
HOMUNCULI_LIVE_SMOKE_STAGE=ocean HOMUNCULI_LIVE_SMOKE_ELEMENT=water HOMUNCULI_LIVE_SMOKE_ENEMY_DISTANCE=120 npm run smoke:live
```

Rationale:

- `stage=ocean` exercises the shipped Ocean stage path.
- `startElement=water` matches Ocean identity and can validate that a water start survives the opener.
- `desiredEnemyDistance=120` matches the safer Swamp-style pilot distance and is more appropriate for a denser opener than the Forest `80` distance.

If water proves flaky before Ocean tuning lands, use `startElement=fire` for harness stability while keeping Water/Wave identity in deterministic assertions. Do not promote an Ocean live gate based only on a fire-start first-30-seconds run.

Recommended promotion target after fixes:

```js
window.runHomunculiOceanLiveSmoke = async function runHomunculiOceanLiveSmoke() {
    return window.runHomunculiStageLiveSmoke({
        stage: 'ocean',
        label: 'Ocean live',
        startElement: 'water',
        desiredEnemyDistance: 120
    });
};
```

Recommended package script after the runtime gate exists:

```json
"smoke:ocean-live": "npm run compile && HOMUNCULI_OCEAN_LIVE_SMOKE=1 electron --no-sandbox --disable-gpu ."
```

The script also needs corresponding `scripts/main.js` dispatch, but this audit intentionally does not edit `scripts/main.js`.

## Minimal Promotion Sequence

1. Finish Snow promotion first: deterministic feel/progression coverage, Frost Guardian gate, and live sanity.
2. Add Ocean deterministic coverage to `smoke:feel` and `smoke:progression`, including wave identity, early tuning, save unlock/reload, and `ocean-1` completion.
3. Add an Ocean vertical-slice tuning entry or document an intentional Ocean-specific alternative for opener pacing, XP, pickup magnet, catalysts, and boss health.
4. Replace the random Ocean spawn branch with the aquatic roster or prove it is unreachable during the shipped wave loop.
5. Fix Sea Kings death semantics so one king death marks only that king dead, updates combined health, plays the correct king death animation, and keeps the fight active.
6. Add explicit all-kings-dead completion handling that drops rewards once, stops Sea Kings AI/music once, calls `gameWon()` once, and unlocks Lava through save reload.
7. Replace Sea Kings phase minion placeholders with existing Ocean enemies: `crabby`, `jellyfish`, `squid`, `shark`, `crablore`, or `waterslime`.
8. Add a boss-entry live assertion for `scene.seaKings.length === 3` and shared health UI.
9. Add a boss-completion live assertion that killing one king is not victory and killing all kings is victory.
10. Add `smoke:ocean-live` to the current green gate stack only after it is stable.

## Decision

Do not promote Ocean now. The viable next Ocean work is a small runtime hardening slice around Sea Kings multi-boss death/completion, followed by deterministic Ocean coverage. Only then should Ocean receive a named live gate and enter the production slice.
