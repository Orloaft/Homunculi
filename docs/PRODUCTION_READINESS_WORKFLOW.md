# Production Readiness Workflow

Goal: turn Homunculi into a production-ready game by protecting one playable slice, then widening scope only when the current slice has reliable automated coverage.

Authoritative runtime: `index.html` + `scripts/game.js`. The TypeScript `src/` tree is useful architecture reference, but it is not the shipped Phaser scene path yet.

Parallel world/release audit notes live in `docs/PARALLEL_WORLD_AUDIT.md`.

## Operating Rules

1. Keep `overhaul` green and shippable after every slice.
2. Prefer small commits that each improve either player-facing feel, progression reliability, automation, or release packaging.
3. Promote worlds in canonical order only after the previous world has a live or deterministic gate.
4. Do not polish parked worlds until the current production slice has clear identity, progression, boss access, and smoke coverage.
5. When a smoke catches drift, tighten the smoke first if the failure reveals a bad assertion; otherwise fix the game.

## Current Green Gates

- `node --check scripts/game.js`
- `npm run typecheck`
- `npm run compile`
- `npm run smoke:prod`
- `npm run smoke:feel`
- `npm run smoke:progression`
- `npm run smoke:live`
- `npm run smoke:forest-live`
- `npm run smoke:swamp-live`
- `npm run smoke:snow-live`
- `npm run smoke:ocean-live`
- `npm run smoke:lava-live`
- `npm run smoke:swamp-boss`
- `npm run smoke:snow-boss`
- `npm run smoke:ocean-boss`
- `npm run smoke:lava-boss`
- `npm run verify:release`

Run the full gate stack before releases and before widening the production slice. For narrow content tuning, run syntax, compile, the touched smoke, and one live sanity gate.

## Work Lanes

### Lane 1: Slice Stability

Purpose: make Forest -> Cave -> Sand -> Swamp feel like a coherent first product path.

Current status:

- Forest/Cave/Sand have progression, first-pass feel tuning, early fusion support, recipe persistence, and Forest live coverage.
- Swamp is promoted into deterministic feel/progression gates, 30-second live coverage, and deterministic Amphibian boss-entry/death coverage.
- Snow is promoted into deterministic feel/progression gates, 30-second live coverage, and deterministic Frost Guardian boss-entry/attack/death coverage.
- Ocean is promoted into deterministic feel/progression gates, 30-second water-start live coverage, and deterministic Sea Kings multi-boss completion coverage.
- Lava is promoted into deterministic feel/progression gates, 30-second fire-start live coverage, and deterministic Demon Slime entry/phase-add/death coverage.

Next slices:

1. Keep the reusable live-smoke harness healthy: `smoke:live` enables the shared live harness through `HOMUNCULI_STAGE_LIVE_SMOKE=1` and can be configured with `HOMUNCULI_LIVE_SMOKE_STAGE` and `HOMUNCULI_LIVE_SMOKE_ELEMENT`.
2. Keep named live gates focused on the first 30 seconds of their worlds, and keep named boss gates focused on deterministic boss entry and completion.
3. Use `docs/PROMOTED_BALANCE_SUMMARY.md` as the human-readable balance snapshot for Forest/Cave/Sand/Swamp/Snow/Ocean/Lava when promoting Grave or changing first-slice tuning.
4. Keep `smoke:lava-live` fire-start coverage and `smoke:lava-boss` Demon Slime coverage inside `verify:release` while Lava remains the front edge of promotion.

### Lane 2: Core Loop Completeness

Purpose: make a new player understand why a run matters and what persisted afterward.

Current status:

- Save progression is canonical and mirrored to legacy keys.
- Recipe discovery persists per save.
- Stage Select now has a first alchemy grimoire readback for known elements and discovered fusions.
- GameOver now has post-run readback for essence banked, stage cleared/attempted, new world unlocks, character unlocks, and best-time updates.
- GameOver also reports run duration, level reached, pickups, defeats, world pressure, win/death outcome, and new recipe or alchemy nudge.
- First-slice start hints and fusion copy are improved.

Next slices:

1. Add a focused renderer smoke for the visual GameOver panel if the readback layout changes again.
2. Add player-build readback next: equipped elements, passive picks, fusion count, and strongest spell.
3. Keep essence, character unlocks, completed stage stats, discovered recipes, reward readback, and grimoire readback covered in progression smoke.

### Lane 3: World Promotion Pipeline

Purpose: expand content without turning every world into an unbounded tuning project.

Promotion order:

1. Swamp: poison/mud control identity, Amphibian live gate.
2. Snow: ice/water survival pressure, Frost Guardian gate.
3. Ocean: water/wave identity, Sea Kings multi-boss gate.
4. Lava: fire/lava escalation, Demon Slime gate.
5. Grave: next promotion lane after Lava.
6. Castle: later power-curve pass after Grave is stable.
7. Spire/Void: design pass before production claims because their identity is still thin.

Promotion checklist:

- Distinct opening roster.
- Readable first minute.
- Early element/fusion setup matching the world theme.
- Catalyst support.
- Boss access by default.
- Save unlock and reload assertion.
- One smoke gate that would fail if the world silently regressed.

### Lane 4: Release Hardening

Purpose: make the game buildable, launchable, and supportable outside the dev machine.

Next slices:

1. Run `npm run smoke:prod` regularly and add it to the release checklist.
2. Audit `electron-builder` output for package size, included source noise, and missing assets.
3. Add a clean-save/manual-release checklist covering new save, first run, first victory, reload, options, and quit/relaunch.
4. Decide release targets: Windows portable first, then Linux AppImage/macOS only after the Windows loop is stable.

Release checklist:

1. `npm run verify:release`
2. `npm run build-win-portable`
3. Inspect `dist/` for package size, missing assets, source maps, docs/editor tools, backup files, and other source noise.
4. Launch the packaged app offline and test a fresh save, first run, first victory, reload, options, and quit/relaunch.

Latest packaging proof:

- 2026-06-04: `npm run build-win-portable` produced `dist/WizBiz 1.0.1.exe` at 263M.

### Lane 5: Architecture Containment

Purpose: reduce risk in the 59k-line runtime without restarting the migration.

Next slices:

1. Extract data-only tables when they reduce duplication: stage progression, world metadata, tuning constants, boss-by-stage, and fusion recipes.
2. Keep behavior in `scripts/game.js` until the shipped loop is stable.
3. Add smoke coverage before extracting shared data that affects progression, rewards, or enemies.

## Immediate Queue

1. Run full `npm run verify:release` after the richer post-run readback update.
2. Design Grave promotion around death/poison identity, live coverage, and a Nekros boss gate.
3. Add player-build readback after Grave planning if GameOver still needs more run-story detail.

## Done Definition

Homunculi is production-ready when:

- A fresh save can play through the committed production path without debug intervention.
- Every promoted world has deterministic feel coverage, progression coverage, and at least one live runtime gate.
- The player can understand unlocked worlds, characters, elements, recipes, essence, and next objectives from in-game UI.
- Release packaging produces a launchable build with no missing critical assets and no obvious first-screen polish issues.
- The repo has a short release checklist that can be run before every build.
