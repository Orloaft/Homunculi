# Roadmap Progress

Date: 2026-06-05

This is the short handoff ledger for the current Homunculi production-roadmap push. Detailed tuning and gate notes live in the linked audit docs.

## Current Production Edge

- Promoted path: Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava -> Grave.
- Current front edge: Grave is release-backed.
- Next world lane: Castle.
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
- Hardened the shared live harness with roster observation, off-roster failures, better scene-stop diagnostics, and stronger kiting behavior.
- Updated the promoted balance summary so the human-readable path covers Forest through Grave.

## Verified Release Stack

Latest green stack:

- `npm run smoke:feel`
- repeated named live gates during promotion tuning
- focused Lava stack: `npm run smoke:feel`, `npm run smoke:progression`, `npm run smoke:lava-live`, `npm run smoke:lava-boss`
- focused grimoire stack: `node --check scripts/game.js`, `node --check src/systems/SaveManager.js`, `npm run typecheck`, `npm run smoke:progression`
- focused post-run readback stack: `node --check scripts/game.js`, `npm run typecheck`, `npm run smoke:progression`
- focused Grave stack: `node --check scripts/game.js`, `node --check scripts/main.js`, `npm run typecheck`, `npm run smoke:feel`, `npm run smoke:progression`, `npm run smoke:grave-live`, `npm run smoke:grave-boss`
- full `npm run verify:release` with Lava live and Lava boss included
- `git diff --check`

Latest pushed implementation commit:

- `7addd90` - `Enrich post-run readback`

## Next Batch

1. Add player-build readback for equipped elements, passive picks, fusion count, and strongest spell if the result screen still needs more run-story detail.
2. Promote Castle next only after deciding its fallen-fortress identity and adding named live plus King Nothing boss gates.
3. Continue live-harness hardening so future world promotions reuse consistent health, enemy, pickup, kill, and level-up artifacts.
4. Refresh docs after each promoted gate so `PRODUCTION_READINESS_WORKFLOW.md`, `PARALLEL_WORLD_AUDIT.md`, and `PROMOTED_BALANCE_SUMMARY.md` agree on the current edge.
