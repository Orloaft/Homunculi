# Roadmap Progress

Date: 2026-06-05

This is the short handoff ledger for the current Homunculi production-roadmap push. Detailed tuning and gate notes live in the linked audit docs.

## Current Production Edge

- Promoted path: Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava -> Grave -> Castle.
- Current front edge: Castle is release-backed.
- Deferred world lane: Spire and Void stay parked for a later expansion/design pass after the release-backed path reaches production quality.
- Next core-loop lane: player-build readback for equipped elements, passive picks, fusion count, and strongest spell.

## Landed Today

- Promoted Lava through deterministic feel/progression, fire-start live survival, and Demon Slime completion gates.
- Folded Lava live and boss gates into `npm run verify:release`.
- Fixed Demon Slime boss victory cleanup after its death animation.
- Added the first Stage Select alchemy grimoire readback for known elements and discovered fusions.
- Extended progression smoke to prove recipe readback survives reload and the grimoire opens/closes.
- Added post-run reward/unlock readback for cleared stage, essence banked, new world unlocks, character unlocks, and best-time updates.
- Extended progression smoke to assert Forest and Lava reward readback matches the saved unlock contract.
- Extended post-run readback again with duration, level reached, pickups, enemies defeated, world pressure, win/death outcome, new recipe text, and no-new-recipe alchemy nudges.
- Extended progression smoke to assert the richer victory and failed-attempt readback contracts.
- Promoted Grave through deterministic feel/progression, arcane-start live survival, and Nekros completion gates.
- Folded Grave live and boss gates into `npm run verify:release`.
- Fixed Nekros death cleanup so its death animation path reliably reaches victory.
- Promoted Castle through deterministic feel/progression, fire-start live survival, and King Nothing completion gates.
- Folded Castle live and boss gates into `npm run verify:release`.
- Fixed King Nothing health tuning, phase assertions, boss label, and death cleanup so the boss path reaches victory.
- Hardened the shared live harness with roster observation, off-roster failures, better scene-stop diagnostics, and stronger kiting behavior.
- Updated the promoted balance summary so the human-readable path covers Forest through Castle.

## Verified Release Stack

Latest green stack:

- `npm run smoke:feel`
- repeated named live gates during promotion tuning
- focused Lava stack: `npm run smoke:feel`, `npm run smoke:progression`, `npm run smoke:lava-live`, `npm run smoke:lava-boss`
- focused grimoire stack: `node --check scripts/game.js`, `node --check src/systems/SaveManager.js`, `npm run typecheck`, `npm run smoke:progression`
- focused post-run readback stack: `node --check scripts/game.js`, `npm run typecheck`, `npm run smoke:progression`
- focused Grave stack: `node --check scripts/game.js`, `node --check scripts/main.js`, `npm run typecheck`, `npm run smoke:feel`, `npm run smoke:progression`, `npm run smoke:grave-live`, `npm run smoke:grave-boss`
- focused Castle stack: `node --check scripts/game.js`, `node --check scripts/main.js`, `npm run typecheck`, `npm run smoke:feel`, `npm run smoke:progression`, `npm run smoke:castle-live`, `npm run smoke:castle-boss`
- full `npm run verify:release` with Castle live and Castle boss included
- `git diff --check`

Latest pushed implementation commit:

- `3de031e` - `Promote Castle into release stack`

## Next Batch

1. Add player-build readback for equipped elements, passive picks, fusion count, and strongest spell if the result screen still needs more run-story detail.
2. Keep the Castle-fronted release path green while tightening first-run/readback/package polish.
3. Continue live-harness hardening so future world promotions reuse consistent health, enemy, pickup, kill, and level-up artifacts.
4. Leave Spire/Void out of production claims until after ship-quality work lands for the promoted path.
5. Refresh docs after each promoted gate so `PRODUCTION_READINESS_WORKFLOW.md`, `PARALLEL_WORLD_AUDIT.md`, and `PROMOTED_BALANCE_SUMMARY.md` agree on the current edge.
