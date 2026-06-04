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
- `npm run compile`
- `npm run smoke:prod`
- `npm run smoke:feel`
- `npm run smoke:progression`
- `npm run smoke:live`
- `npm run smoke:forest-live`
- `npm run smoke:swamp-live`

Run the full gate stack before releases and before widening the production slice. For narrow content tuning, run syntax, compile, the touched smoke, and one live sanity gate.

## Work Lanes

### Lane 1: Slice Stability

Purpose: make Forest -> Cave -> Sand -> Swamp feel like a coherent first product path.

Current status:

- Forest/Cave/Sand have progression, first-pass feel tuning, early fusion support, recipe persistence, and Forest live coverage.
- Swamp is promoted into deterministic feel/progression gates, but its boss and live loop are not independently covered.

Next slices:

1. Keep the reusable live-smoke harness healthy: `smoke:live` runs a configurable stage through `HOMUNCULI_LIVE_SMOKE_STAGE` and `HOMUNCULI_LIVE_SMOKE_ELEMENT`.
2. Keep `smoke:swamp-live` focused on the first 30 seconds of Swamp until Amphibian reachability/entry safety gets its own boss-phase assertion.
3. Add a human-readable balance summary for Forest/Cave/Sand/Swamp: opener roster, first level timing, fusion setup, catalyst levels, boss health, and unlock reward.

### Lane 2: Core Loop Completeness

Purpose: make a new player understand why a run matters and what persisted afterward.

Current status:

- Save progression is canonical and mirrored to legacy keys.
- Recipe discovery persists per save.
- First-slice start hints and fusion copy are improved.

Next slices:

1. Add an in-save alchemy grimoire view or a low-risk Stage Select/Nexus summary of discovered recipes.
2. Add post-victory copy that tells the player what unlocked, what recipe or element advanced, and what to try next.
3. Verify essence, character unlocks, completed stage stats, and discovered recipes through reload in progression smoke.

### Lane 3: World Promotion Pipeline

Purpose: expand content without turning every world into an unbounded tuning project.

Promotion order:

1. Swamp: poison/mud control identity, Amphibian live gate.
2. Snow: ice/water survival pressure, Frost Guardian gate.
3. Ocean: water/wave identity, Sea Kings multi-boss gate.
4. Lava, Grave, Castle: later power-curve pass after the first six worlds are stable.
5. Spire/Void: design pass before production claims because their identity is still thin.

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

### Lane 5: Architecture Containment

Purpose: reduce risk in the 59k-line runtime without restarting the migration.

Next slices:

1. Extract data-only tables when they reduce duplication: stage progression, world metadata, tuning constants, boss-by-stage, and fusion recipes.
2. Keep behavior in `scripts/game.js` until the shipped loop is stable.
3. Add smoke coverage before extracting shared data that affects progression, rewards, or enemies.

## Immediate Queue

1. Add Swamp boss-entry assertions to the live harness once the Amphibian audit identifies the safest signal.
2. Add a balance summary doc for Forest/Cave/Sand/Swamp.
3. Promote Snow into deterministic feel/progression coverage after the parallel Snow audit lands.
4. Strengthen progression smoke for post-victory rewards and recipe/stats reload.
5. Add first grimoire/readback surface for discovered recipes.

## Done Definition

Homunculi is production-ready when:

- A fresh save can play through the committed production path without debug intervention.
- Every promoted world has deterministic feel coverage, progression coverage, and at least one live runtime gate.
- The player can understand unlocked worlds, characters, elements, recipes, essence, and next objectives from in-game UI.
- Release packaging produces a launchable build with no missing critical assets and no obvious first-screen polish issues.
- The repo has a short release checklist that can be run before every build.
