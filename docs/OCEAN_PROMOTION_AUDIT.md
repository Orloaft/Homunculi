# Ocean Promotion Audit

Date: 2026-06-04

Scope: docs-only audit for the Ocean/Sea Kings promotion lane. Runtime evidence comes from `scripts/game.js`; workflow requirements come from `docs/PRODUCTION_READINESS_WORKFLOW.md` and `docs/PARALLEL_WORLD_AUDIT.md`.

## Status

Ocean is promoted through the current release stack. It has deterministic feel/progression coverage, a named 30-second water-start live gate, and deterministic Sea Kings multi-boss completion coverage.

Promotion should wait until:

- Snow is promoted with deterministic and live gates.
- Ocean has deterministic feel/progression coverage. Added 2026-06-04.
- Sea Kings have explicit multi-boss death/completion handling. Fixed 2026-06-04 and covered by `smoke:ocean-boss`.
- Ocean has one named live smoke that fails on opener roster drift or water-start survivability drift. Sea Kings entry and completion drift are covered by `smoke:ocean-boss`.

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
- Wave 1: adds `squid`; spawn interval `2000`, max enemies `28`.
- Wave 2: adds `shark` and `waterslime`; spawn interval `1500`, max enemies `40`; jellyfish swarm event.
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
- Ocean health scaling is very steep: base difficulty `1.5` and per-wave scaling `3.0`. Deterministic coverage plus `smoke:ocean-live` now protect first-30-seconds survivability from silent drift.
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

Covered by `smoke:ocean-live`, the live harness asserts:

- Stage starts as `ocean`.
- The opening live run survives at least 25-30 seconds.
- Enemy activity includes Ocean-specific enemies, not generic fallback enemies.
- At least one XP pickup and one kill happen.

Covered by `smoke:ocean-boss`, the deterministic boss harness asserts:

- Boss fast-forward can spawn Sea Kings.
- `scene.seaKings.length === 3`.
- Every king has `isSeaKing === true`, `isBoss === true`, active physics, and a Sea King enemy type.
- The shared boss health UI exists and reads `SEA KINGS`.
- Covered by `smoke:ocean-boss`: killing one king does not call `gameWon()`.
- Covered by `smoke:ocean-boss`: killing all three kings triggers boss cleanup and `gameWon()`.
- Covered by `smoke:progression`: Ocean completion records `ocean-1` and Lava unlock survives reload.

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
- `npm run smoke:ocean-live`
- `npm run smoke:swamp-boss`
- `npm run smoke:snow-boss`
- `npm run smoke:ocean-boss`

## Recommended Start Config

Ocean has a named promotion gate:

```sh
npm run smoke:ocean-live
```

Rationale:

- `stage=ocean` exercises the shipped Ocean stage path.
- `startElement=water` matches Ocean identity and validates that a water start survives the opener.
- `desiredEnemyDistance=160` gives the water-start pilot room to kite Ocean's faster opener while still requiring real kills and XP pickups.
- The live harness now backs away when an enemy breaches its desired spacing, so the automated pilot kites instead of standing in contact damage.

## Minimal Promotion Sequence

1. Finish Snow promotion first: deterministic feel/progression coverage, Frost Guardian gate, and live sanity.
2. Fixed 2026-06-04: add Ocean deterministic coverage to `smoke:feel` and `smoke:progression`, including wave identity, early tuning, save unlock/reload, and `ocean-1` completion.
3. Fixed 2026-06-04: add an Ocean vertical-slice tuning entry for opener pacing, XP, pickup magnet, catalysts, and boss health.
4. Fixed 2026-06-04: replace the random Ocean spawn branch with the aquatic roster.
5. Fixed 2026-06-04: Sea Kings death semantics now mark only the killed king dead, update combined health, and keep the fight active.
6. Fixed 2026-06-04: all-kings-dead completion now drops rewards once, stops Sea Kings AI/music once, and calls `gameWon()` once. Lava unlock reload coverage still belongs in Ocean progression smoke.
7. Fixed 2026-06-04: Sea Kings phase minions now use existing Ocean enemies: `crabby`, `jellyfish`, `squid`, `shark`, `crablore`, or `waterslime`.
8. Fixed 2026-06-04: add `smoke:ocean-live` with a water-start live pilot and aquatic-roster assertion.
9. Fixed 2026-06-04: add `smoke:ocean-live` and `smoke:ocean-boss` to `verify:release`.

## Decision

Ocean is promoted through the current gate stack. The next world-promotion lane is Lava, while the next core-loop lane remains player-facing recipe/readback UI.
