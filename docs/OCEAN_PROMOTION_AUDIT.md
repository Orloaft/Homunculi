# Ocean Promotion Audit

Date: 2026-06-04

Scope: docs-only audit for the Ocean/Sea Kings promotion lane. Runtime evidence comes from `scripts/game.js`; workflow requirements come from `docs/PRODUCTION_READINESS_WORKFLOW.md` and `docs/PARALLEL_WORLD_AUDIT.md`.

## Status

Ocean is not ready for full promotion. It has a clear aquatic content shell, a dedicated Sea Kings boss entry, and the first Sea Kings boss-hardening pass is covered by `npm run smoke:ocean-boss`. Ocean now has deterministic feel/progression coverage; it still needs a stable named live gate before it should be promoted into `verify:release`.

Promotion should wait until:

- Snow is promoted with deterministic and live gates.
- Ocean has deterministic feel/progression coverage. Added 2026-06-04.
- Sea Kings have explicit multi-boss death/completion handling. Fixed 2026-06-04 and covered by `smoke:ocean-boss`.
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

- Fixed 2026-06-04: Ocean is now inside `smoke:feel` and `smoke:progression`.
- Fixed 2026-06-04: Ocean has a vertical-slice tuning entry for early catalyst milestones, XP/pickup tuning, readable first-minute spawn interval normalization, and boss health multiplier support.
- Fixed 2026-06-04: the general random stage spawn branch now maps Ocean to the aquatic roster instead of generic enemies.
- Ocean health scaling is very steep: base difficulty `1.5` and per-wave scaling `3.0`. Without deterministic balance coverage this can regress live survivability quickly.
- Fixed 2026-06-04: Ocean wave 0 now normalizes into the promoted first-slice opener envelope under deterministic smoke density and includes early `waterslime` water-orb support.
- Fixed 2026-06-04: Ocean now participates in early primary-element reward bias when the player has one held element.

## Boss And Sea Kings Blockers

- Fixed 2026-06-04: generic boss death handling now routes Sea Kings through `handleSeaKingDeath()`, so killing one king does not end the fight.
- Fixed 2026-06-04: Sea Kings now have explicit all-kings-dead completion handling that drops rewards once, removes shared UI, stops boss AI, and calls `gameWon()` once.
- Fixed 2026-06-04: Sea King death animation playback uses the king-specific death animation when possible and falls back to safe destroy if Phaser rejects the animation data.
- Sea Kings use a shared health bar, but `this.boss` points only to king 1. Legacy projectile and boss-specific systems that damage `this.boss` may ignore the other two kings.
- Fixed 2026-06-04: Ocean phase minions now spawn actual Ocean roster enemies instead of generic golems.
- Sea Kings do not use the vertical-slice boss health tuning path. Their health is density-scaled manually from `2000` per king, with normal density resulting in `1000` each and `3000` total.
- The live gate needs to assert all three kings are present, not just `this.boss`.

## Smoke And Live Gate Requirements

Before Ocean is promoted, add deterministic coverage that verifies:

- Covered by `smoke:feel`: Ocean opening roster uses aquatic enemies only.
- Covered by `smoke:feel`: Ocean first three waves include at least five distinct aquatic/water enemies.
- Covered by `smoke:feel`: opening spawn interval and max enemy count are tuned to a readable first minute.
- Covered by `smoke:feel` and `smoke:progression`: Ocean has catalyst support at the same early milestone shape as promoted worlds.
- Covered by `smoke:feel` and `smoke:progression`: Ocean boss health tuning is intentional and stable.
- Covered by `smoke:feel`: early element rewards can produce a compatible fusion setup.
- Covered by `smoke:progression`: Snow victory unlocks Ocean and Ocean victory unlocks Lava, including save reload assertions.
- Covered by `smoke:progression`: Ocean completion records `ocean-1`.

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
- Covered by `smoke:ocean-boss`: killing one king does not call `gameWon()`.
- Covered by `smoke:ocean-boss`: killing all three kings triggers boss cleanup and `gameWon()`.
- Still needed for Ocean promotion: save-level assertion that Ocean completion records `ocean-1` and Lava unlock survives reload.

Current green release gates should still run before widening the production slice:

- `node --check scripts/game.js`
- `npm run compile`
- `npm run smoke:prod`
- `npm run smoke:feel`
- `npm run smoke:progression`
- `npm run smoke:live`
- `npm run smoke:forest-live`
- `npm run smoke:swamp-live`
- `npm run smoke:snow-live`
- `npm run smoke:swamp-boss`
- `npm run smoke:snow-boss`
- `npm run smoke:ocean-boss`

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
2. Fixed 2026-06-04: add Ocean deterministic coverage to `smoke:feel` and `smoke:progression`, including wave identity, early tuning, save unlock/reload, and `ocean-1` completion.
3. Fixed 2026-06-04: add an Ocean vertical-slice tuning entry for opener pacing, XP, pickup magnet, catalysts, and boss health.
4. Fixed 2026-06-04: replace the random Ocean spawn branch with the aquatic roster.
5. Fixed 2026-06-04: Sea Kings death semantics now mark only the killed king dead, update combined health, and keep the fight active.
6. Fixed 2026-06-04: all-kings-dead completion now drops rewards once, stops Sea Kings AI/music once, and calls `gameWon()` once. Lava unlock reload coverage still belongs in Ocean progression smoke.
7. Fixed 2026-06-04: Sea Kings phase minions now use existing Ocean enemies: `crabby`, `jellyfish`, `squid`, `shark`, `crablore`, or `waterslime`.
8. Add a boss-entry live assertion for `scene.seaKings.length === 3` and shared health UI.
9. Add a boss-completion live assertion that killing one king is not victory and killing all kings is victory.
10. Add `smoke:ocean-live` to the current green gate stack only after it is stable.

## Decision

Do not promote Ocean fully yet. Sea Kings multi-boss death/completion and deterministic Ocean tuning/progression are covered; the viable next Ocean work is a stable named live gate, followed by adding that gate to the current release stack after it proves reliable.
