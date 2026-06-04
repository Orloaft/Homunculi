# Snow Promotion Audit

Date: 2026-06-04

Scope: read-only audit of the shipped runtime path in `index.html` and `scripts/game.js`, plus the promotion workflow in `docs/PRODUCTION_READINESS_WORKFLOW.md` and the parallel findings in `docs/PARALLEL_WORLD_AUDIT.md`.

## Promotion Target

Snow should become the next promoted world after Swamp boss-entry coverage is stable. The production lane goal is a readable ice/water survival slice with a Frost Guardian boss gate, not a broad Snow polish pass.

Canonical identifiers:

- Runtime stage: `snow`
- Stage-select world ID: `snowland`
- Display name: `Snow Land`
- Completion ID: `snow-1`
- Legacy unlock keys mirrored by runtime: `snowLandUnlocked`, `snowlandLandUnlocked`
- Progression order: Swamp victory unlocks Snow; Snow victory unlocks Ocean.

## Current Content And State

Snow already has most content hooks needed for promotion:

- Stage metadata exists in `STAGE_PROGRESSION`.
- Stage select maps `Snow Land` to `snow`.
- Snow uses `snow-tile`, `snowland-title`, `planet-snow`, `snowland-gate`, `snow-ice-block`, and `snow-tree`.
- Stage music routes to `snowland-bgm`.
- Boss cutscene routes Snow to `frostguardian`, then `createFrostGuardianBoss()`.
- Save completion/unlock flow records `snow-1` and unlocks `oceanland` through the canonical stage progression table.
- Snow wave content exists for `snowy`, `northerner`, `spiked-slime`, `elkman`, `frost-golem`, and `lightningslime`.
- Enemy implementations exist for all Snow roster entries. `frost-golem` applies ice/slow flavor, `spiked-slime` has thorn damage, and `lightningslime` drops `lightning`.
- Theme elements exist through primary/fusion paths: `air+water -> ice`, `ice+water -> wave`, `lightning+water -> storm`, plus `snowball` spell assets/config.

Current wave shape:

- Wave 0: `snowy` and `northerner`, `3000ms`, `15` max enemies.
- Wave 1: adds `spiked-slime`, `2000ms`, `35` max enemies.
- Wave 2: adds `elkman`, `1200ms`, `45` max enemies, spiked-slime swarm.
- Wave 3: adds `frost-golem` and `lightningslime`, `1200ms`, `55` max enemies.
- Wave 4: heavier frozen roster, `2000ms`, `65` max enemies, frost-golem circle.
- Wave 5+: full roster, `600ms`, `150` max enemies.

This is coherent content, but it is not promoted content yet. The first minute is much denser and faster than the promoted slice conventions, and Snow is not included in the deterministic smoke coverage that protects Forest, Cave, Sand, and Swamp.

## Promotion Blockers

1. Snow is excluded from `runHomunculiFeelSmoke()`.

   The current feel smoke only checks `forest`, `cave`, `sand`, and `swamp`. Snow therefore has no deterministic assertion for opening roster width, opening spawn interval, enemy cap, pressure ramp, catalyst milestones, boss tuning, or early fusion setup.

2. Snow is excluded from `runHomunculiProgressionSmoke()`.

   Progression smoke currently verifies Forest -> Cave -> Sand -> Swamp unlock only. It does not simulate Swamp victory unlocking Snow, Snow victory recording `snow-1`, Snow victory unlocking Ocean, or reload/stage-select persistence for Snow/Ocean.

3. Snow is excluded from vertical-slice tuning.

   `getVerticalSliceTuning()` has entries only for Forest, Cave, Sand, and Swamp. Snow currently falls back to:

   - `bossHealthMultiplier: 1`
   - `pickupMagnetRadius: 120`
   - `pickupMagnetSpeed: 400`
   - `xpDropMultiplier: 1`
   - no early catalyst drops at levels 4 and 8
   - no early fire-compatible reward bias, because `getPrimaryElementRewardChoices()` only biases `forest`, `cave`, `sand`, and `swamp`

4. Snow opener does not match promoted readability constraints.

   Promoted worlds currently expect a distinct 3-4 enemy opening roster, `6000-6700ms` opening spawn interval after density/tuning, `7-8` opening max enemies after normal density, no opening special event, and no giant opener. Snow starts with only 2 enemy types and a `3000ms` raw spawn interval with `15` max enemies, which becomes much more aggressive than the first-slice standard under the feel-smoke assumptions.

5. Frost Guardian death path is unsafe.

   `createFrostGuardianBoss()` creates a dedicated `frost-guardian-death` animation, but `handleBossDeath()` has no Frost Guardian branch. It falls through to `obelisk-death`, and the completion listener only proceeds for `nekros-death`, `archer-boss-death`, `obelisk-death`, or `eyelor-death`. If `obelisk-death` is not valid for the Frost Guardian sprite or does not complete as expected, Snow victory can hang before `gameWon()`.

6. Frost Guardian cooldown timing is wrong.

   Frost Guardian AI runs on a timer with `delay: 1800 / speedMultiplier`. When it attacks, it sets `attackCooldown = 3000 / speedMultiplier`, then decrements by only `16` per AI tick. At normal speed, that means roughly 188 AI ticks, or about 5.6 minutes, before another slam. The boss effectively gets one attack per fight unless other code changes the cooldown.

7. Frost Guardian has production-noisy console logs.

   The boss creation path logs hitbox setup details directly through `console.log()`. This is not fatal for promotion, but it should be removed or routed through the disabled debug logger before a live boss gate.

8. Frost Guardian phase adds are not Snow roster adds.

   `createIceWave()` spawns `golem-blue` on phase thresholds. That is ice-adjacent, but it is outside the Snow roster documented for promotion and outside the Snow enemy pack. The gate should either accept this intentionally or change phase adds to Snow-native `frost-golem`, `snowy`, or `spiked-slime`.

## Smoke And Live Gate Requirements

Promotion should add deterministic gates before adding a named live gate. Exact requirements:

### Deterministic Feel Gate

Extend `runHomunculiFeelSmoke()` to include `snow`.

Required assertions:

- Snow opening roster is distinct from Forest/Cave/Sand/Swamp.
- Opening roster has 3-4 unique non-giant enemy types.
- Opening roster should include the Snow identity mix: at minimum `snowy`, `northerner`, and `spiked-slime`.
- Opening wave has no special event.
- Opening spawn interval after normal density and tuning is within `6000-6700ms`.
- Opening max enemy count after normal density is `7-8`.
- First three waves increase pressure: wave 1 spawn interval below wave 0, wave 2 below wave 1, wave 1 enemy cap above wave 0, wave 2 above wave 1.
- First three waves include at least five Snow-specific enemy/source types across `snowy`, `northerner`, `spiked-slime`, `elkman`, `frost-golem`, and `lightningslime`.
- Level 4 catalyst support is at least `1`; level 8 catalyst support is at least `2`.
- Boss tuning multiplier is in the promoted range, probably `1.0` for Snow if Swamp stays `0.95`.
- Early element rewards include a start-element-compatible fusion setup.

### Deterministic Progression Gate

Extend `runHomunculiProgressionSmoke()` past Sand.

Required assertions:

- Sand victory unlocks `swampland`.
- Swamp victory records `swamp-1` and unlocks `snowland`.
- Reload after Swamp victory shows `Snow Land` unlocked in Stage Select.
- Snow victory records `snow-1` and unlocks `oceanland`.
- Reload after Snow victory shows `Ocean Land` unlocked in Stage Select.
- Snow victory preserves standard post-victory rewards and stats: essence increases, `stageStats['snow-1'].attempts` increments, `stageStats['snow-1'].bestTime` is set, and no character unlock is expected.

### Generic Live Gate

Before adding a named command, run the existing configurable live gate:

```sh
HOMUNCULI_LIVE_SMOKE_STAGE=snow HOMUNCULI_LIVE_SMOKE_ELEMENT=fire HOMUNCULI_LIVE_SMOKE_ENEMY_DISTANCE=120 npm run smoke:live
```

Required result:

- GameScene starts with `stage === 'snow'`.
- Wizard survives at least 25 seconds of live gameplay.
- Survival time advances.
- Snow enemies spawn or are killed.
- At least one enemy kill is observed.
- At least one XP gem is collected.
- Player reaches level 1.
- No renderer errors, early game over, or missing enemy group.

### Named Snow Live Gate

After the generic gate is stable, add `npm run smoke:snow-live` as a wrapper, analogous to Forest/Swamp.

Recommended live config:

- `stage: 'snow'`
- `label: 'Snow live'`
- `startElement: 'fire'`
- `desiredEnemyDistance: 120`

Use `fire` even though Snow's theme is ice/water because the current named live pilots use reliable fire-start survival while deterministic smokes cover world-theme reward identity.

### Frost Guardian Boss Gate

Add this only after the Frost Guardian death/cooldown fixes land.

Required assertions:

- Fast-forward or deterministic setup reaches boss entry without waiting for a full manual run.
- Boss object exists with `enemyType === 'frost-guardian-boss'`.
- Boss has `isFrostGuardian === true`.
- Boss music starts and stage music stops/fades.
- Frost Guardian health bar, health bar background, and name text exist.
- AI timer exists and is running.
- A safe attack occurs within a bounded window, ideally under 8 seconds at normal speed.
- The attack creates an ice slam warning and eventually clears `isAttacking`.
- Phase threshold add spawn is Snow-approved and does not crash.
- Forced boss death plays `frost-guardian-death` or an explicitly accepted Frost Guardian completion fallback.
- `gameWon()` is reached after boss death.
- Save flow can record `snow-1` and unlock `oceanland`.

## Frost Guardian Cooldown And Death Risks

Cooldown risk:

- Current code mixes millisecond cooldown values with a timer-tick decrement.
- The boss AI timer ticks roughly every `1800ms`; decrementing `attackCooldown` by `16` each tick makes a nominal `3000ms` cooldown last about `337.5s`.
- This makes boss behavior too quiet for a live boss gate and masks slam/freeze regressions.
- Minimal fix: track cooldown against `this.time.now`, or decrement by the AI timer delta instead of a hard-coded frame delta.

Death risk:

- Frost Guardian has a dedicated `frost-guardian-death` animation but `handleBossDeath()` does not use it.
- The generic branch plays `obelisk-death`, which is not Frost Guardian content.
- The completion callback filters accepted animation keys and does not include `frost-guardian-death`.
- Minimal fix: add a Frost Guardian branch that stops `bossAITimer`, marks the boss dead, plays `frost-guardian-death`, and lets the completion callback accept `frost-guardian-death`.

Phase add risk:

- `createIceWave()` spawns `golem-blue`, which is not part of the Snow roster and may weaken the promoted-world identity.
- Minimal acceptable options: document `golem-blue` as an intentional Frost Guardian-only summon, or replace it with `frost-golem`/`spiked-slime` for Snow-native consistency.

Console risk:

- Frost Guardian hitbox logs use raw `console.log()`.
- Minimal fix: remove them or route through `debugLog`.

## Suggested Snow Start And Stage Config

Suggested smoke/live start:

- `startElement: 'fire'`
- `desiredEnemyDistance: 120`
- `enemyDensity: normal`

Rationale: Fire is already the reliable live pilot element and is thematically appropriate as counter-pressure into ice enemies. Deterministic checks should still verify that Snow can build toward ice/water/lightning identity.

Suggested vertical-slice tuning:

```js
snow: {
    bossHealthMultiplier: 1.0,
    waveSpawnIntervalMultiplier: 1.15,
    pickupMagnetRadius: 200,
    pickupMagnetSpeed: 470,
    xpDropMultiplier: 1.2,
    earlyCatalystMilestones: { 4: 1, 8: 2 }
}
```

Suggested opener shape before adding Snow to feel smoke:

- Wave 0 roster: `snowy`, `northerner`, `spiked-slime`
- Raw `spawnInterval`: about `6300ms` if density math remains unchanged, or a raw/tuning combination that produces `6000-6700ms` under the feel-smoke path.
- Raw `maxEnemies`: about `15` if normal density remains `0.5`, producing `7` after density.
- Counts: no enemy count above `2`.
- No special event.

Suggested early identity progression:

- Wave 1 adds pressure but remains readable.
- Wave 2 introduces `elkman`.
- Wave 3 introduces `frost-golem` and `lightningslime`.
- Early reward bias should include at least one fire-compatible fusion option when starting from fire, while Snow drops/sources should make `ice`, `water`, `lightning`, `wave`, or `storm` reachable over time.

## Minimal Next Implementation Sequence

1. Finish Swamp boss-entry coverage first, per the production workflow.
2. Add Snow vertical-slice tuning and early reward-bias inclusion. Keep values conservative and aligned with the promoted slice.
3. Retune Snow wave 0-2 to satisfy the deterministic feel-smoke assertions while preserving Snow identity.
4. Extend `runHomunculiFeelSmoke()` to include Snow and assert Snow-specific roster/tuning/catalyst/boss expectations.
5. Extend `runHomunculiProgressionSmoke()` through Swamp and Snow reload assertions.
6. Fix Frost Guardian cooldown timing.
7. Fix Frost Guardian death handling and remove or reroute raw debug logs.
8. Decide whether Frost Guardian phase adds intentionally use `golem-blue`; otherwise switch them to Snow-native adds.
9. Run the generic Snow live command with `HOMUNCULI_LIVE_SMOKE_STAGE=snow`, `HOMUNCULI_LIVE_SMOKE_ELEMENT=fire`, and `HOMUNCULI_LIVE_SMOKE_ENEMY_DISTANCE=120`.
10. Add `smoke:snow-live` only after the generic Snow live command passes reliably.
11. Add the Frost Guardian boss gate after the boss path has reliable cooldown, attack, death, and completion behavior.
12. Update `docs/PRODUCTION_READINESS_WORKFLOW.md` current gates only after the named Snow gates exist and pass.

## Promotion Exit Criteria

Snow can be marked promoted when:

- Deterministic feel smoke includes Snow and passes.
- Deterministic progression smoke verifies Swamp -> Snow -> Ocean, including reload.
- Generic Snow live smoke passes with fire start.
- Named `smoke:snow-live` exists and passes.
- Frost Guardian boss gate verifies entry, health UI, AI, at least one attack, safe phase behavior, death, and `gameWon()`.
- No raw Frost Guardian debug logs remain in promoted runtime.
- Snow documentation and workflow docs list the new gate only after it exists.
