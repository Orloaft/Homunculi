# Track B Gameplay Loop Audit

Scope: active runtime only. `index.html` loads `scripts/game.js?v=210`; the TypeScript `src/` path is a partial migration and is not registered in Phaser's scene list. Runtime code was not changed for this audit.

## Current Shipped Loop

1. Boot enters `LoadingScene`, then `TitleScene`, `SaveSlotScene`/`StageSelectScene`, and finally `GameScene` (`scripts/game.js:59581`, `scripts/game.js:59645`).
2. Stage select presents 11 worlds plus Nexus and Arcade: Forest, Cave, Sand, Swamp, Snow, Ocean, Lava, Grave, Castle, Spire, Void, Nexus, Arcade (`scripts/game.js:3372`).
3. In a run, the player moves while equipped spell slots auto-cast. XP jewels drive level-ups; level-up cards offer a passive, primary element, or fusion/element upgrade depending on inventory state (`scripts/game.js:49190`, `scripts/game.js:49222`).
4. Elements are explicit data in `elementConfig`; primary enemy drops are `fire`, `water`, `earth`, `air`, `lightning`, and `arcane` (`scripts/game.js:12100`, `scripts/game.js:12151`).
5. Alchemy exists as a real fusion graph with primary, secondary, advanced, and special recipes such as `earth+fire -> lava`, `air+water -> ice`, `ice+water -> wave`, and `moon+sun -> time` (`scripts/game.js:12155`).
6. Enemy waves are stage-specific and time-based, with late waves cycling and scaling after the authored set (`scripts/game.js:17873`, `scripts/game.js:18608`).
7. Run length depends on speed mode: Frolic is 10 minutes and Vibe is 5 minutes in the UI; hidden legacy modes still exist in code (`scripts/game.js:2219`, `scripts/game.js:19481`).
8. At timer completion, boss fights only happen if the `boss_fights` talent is unlocked; otherwise the game starts the victory sequence immediately (`scripts/game.js:19499`).
9. Boss coverage is broad: Cave/Archer, Sand/Eyelor, Grave/Nekros, Lava/Demon Slime, Castle/King Nothing, Snow/Frost Guardian, Swamp/Amphibian, Ocean/Sea Kings, and default Obelisk (`scripts/game.js:53199`).
10. Game over/victory awards essence, updates save stats, and returns to stage select; Nexus spends essence in a talent tree (`scripts/game.js:8468`, `scripts/game.js:8700`).

## Production Blockers

### P0: Save progression and stage progression are out of sync

Stage select reads `SaveManager.currentSaveData.stages.unlockedWorlds` first, then falls back to legacy localStorage keys (`scripts/game.js:3344`). Victory progression only writes legacy keys in `unlockNextStage()` (`scripts/game.js:8397`) and `updateSaveData()` never appends the next world to `saveData.stages.unlockedWorlds` (`scripts/game.js:8474`). This makes the product loop fragile across save slots, resets, migration, and any future removal of legacy keys.

Recommendation: define one canonical progression table, update both `completedStages` and `unlockedWorlds` on victory, then mirror to legacy localStorage only as compatibility output.

### P0: The authored world list does not match the unlock order

Stage select includes Swamp, Snow, and Ocean (`scripts/game.js:3379`), and active gameplay has waves and bosses for them (`scripts/game.js:18267`, `scripts/game.js:18431`, `scripts/game.js:18506`, `scripts/game.js:53199`). But `unlockNextStage()` advances only Forest -> Cave -> Sand -> Lava -> Grave -> Castle -> Spire -> Void (`scripts/game.js:8397`). Swamp/Snow/Ocean are therefore production content without normal progression placement.

Recommendation: choose a launch order and use it everywhere. Suggested vertical slice order: Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava -> Grave -> Castle. Keep Spire/Void gated until their content has a clear endgame role.

### P0: Bosses are hidden behind a talent, but the story/loop expects bosses

The current win condition skips bosses unless `boss_fights` is unlocked (`scripts/game.js:19499`). That talent costs essence in Nexus (`scripts/game.js:8829` onward, especially `boss_fights` in the same tree). This means a new player can clear worlds without seeing the end-stage boss identity, even though the game is positioned around worlds and bosses.

Recommendation: make bosses part of the core vertical slice by default for at least Forest, Cave, and Sand. If boss gating remains, label it as a challenge modifier, not main progression.

### P1: Title UI has overlapping bottom-right commands

`1 PLAYER` and `OPTIONS` are both created at `(750, 560)` with right/bottom origin (`scripts/game.js:1744`, `scripts/game.js:1868`). This is a visible first-screen production polish issue and can also confuse pointer input.

Recommendation: consolidate multiplayer into the central co-op flow or move `OPTIONS` to a unique corner/row.

### P1: Runtime data is too monolithic for reliable balancing

The active game keeps scene flow, UI, elements, fusions, waves, enemy creation, bosses, save progression, and talent logic inside one 59k-line file. This is workable for salvage, but risky for production tuning because the same concepts exist in several representations: `worldId`, stage short names, localStorage keys, save stage IDs, and display names.

Recommendation: do not restart the TypeScript migration yet. First extract small data tables from `scripts/game.js` into loaded JS config modules for `STAGE_PROGRESSION`, `WORLD_DEFS`, `ELEMENTS`, `FUSIONS`, and `BOSS_BY_STAGE`. Keep behavior in `game.js` until the shipped loop is stable.

## Vertical Slice Recommendation

Target a tight 3-world production slice instead of polishing every world at once:

1. Forest: baseline survival, initial element choice, first 3 level-ups, one fusion discovery, Obelisk boss, victory unlocks Cave.
2. Cave: introduces stronger enemies, fusion ritual tutorial, Archer boss, unlocks Grim and Sand.
3. Sand: introduces terrain/theme identity, Eyelor boss, unlocks Blip and Nexus/talent spending.

Acceptance criteria:

- New save can start, choose a slot, enter Forest, level up, pick an element, fuse two elements, survive the timer, fight a boss, win, and see Cave unlocked in the same save slot.
- Returning to title and reloading the save preserves unlocked worlds, completed stage stats, essence, talents, and character unlocks without relying on legacy localStorage-only state.
- Options and title actions do not overlap.
- Bosses, fusions, and stage unlocks are verified by a smoke script or debug checklist against `scripts/game.js`, not the inactive TypeScript path.

## Notes On Existing Strengths

- The active loop already has the right bones for a Vampire Survivors-like: auto-fire, XP gems, timed waves, level-up cards, persistent meta-currency, and end-run summary.
- The alchemy/fusion identity is more than cosmetic. There is a meaningful graph, tier upgrades, duplicate auto-fusion, and late-game recipes.
- The asset library appears deep enough to support world identity. Swamp, Snow, Ocean, and multiple bosses already have runtime references.

## Lowest-Risk Next Changes

1. Add a canonical `STAGE_PROGRESSION` table near the existing stage select data, then replace hard-coded unlock order and world completion checks with that table.
2. Update `GameOverScene.updateSaveData()` to append the next world to `saveData.stages.unlockedWorlds` on victory.
3. Decide whether bosses are default or talent-gated; for the production slice, default them on.
4. Fix the title button overlap.
5. Add a lightweight smoke checklist or automated harness that covers: new save -> Forest -> forced win -> Cave unlocked -> reload save -> Cave still unlocked.

## 2026-06-04 Track B First Patch

- Added canonical runtime progression: Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava -> Grave -> Castle -> Spire -> Void.
- Victory now records the completed stage and next unlocked world in the active save slot, then mirrors legacy localStorage unlock keys for compatibility.
- Normal stages now spawn bosses by default at timer completion; arcade still skips bosses for stage rotation.
- Moved `OPTIONS` above the bottom-right player toggle so the title commands no longer overlap.

## 2026-06-04 Follow-Up Hardening

- Arcade unlock now requires every main stage completion in `saveData.stages.completedStages`, not just every world being unlocked.
- Stage-select best-time lookup now uses the canonical progression table instead of deriving IDs by stripping `land` from world IDs.
- Progress reset now clears all canonical legacy unlock/completion keys, including Swamp, Snow, Ocean, and alternate Sand/Desert keys.
- Sand first-completion character unlock now uses the active `sand` stage ID instead of the stale `desert` ID.
- Added `npm run smoke:prod`, which compiles and launches Electron in smoke mode, then exits based on renderer load/crash status.
- Hardened smoke mode to also fail on obvious renderer script errors and require a Phaser canvas before reporting success.

## 2026-06-04 Vertical Slice Tuning Pass

- Added a Forest/Cave/Sand tuning table for low-risk first-slice balancing knobs.
- Forest and Cave early wave spawn intervals are slightly relaxed for readability.
- Forest, Cave, and Sand now drop early fusion catalysts at levels 4 and 8 so fusion can happen during the first slice.
- Forest, Cave, and Sand boss health is lightly reduced for first-pass feel testing.
- Fixed remaining Sand stage key drift in stage dialogue and stage difficulty lookup.
