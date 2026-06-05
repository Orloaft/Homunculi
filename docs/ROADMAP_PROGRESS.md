# Roadmap Progress

Date: 2026-06-05

This is the short handoff ledger for the current Homunculi production-roadmap push. Detailed tuning and gate notes live in the linked audit docs.

## Current Production Edge

- Promoted path: Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava.
- Current front edge: Lava is release-backed.
- Next world lane: Grave.
- Next core-loop lane: richer post-run readback for level timing, pickups, biome, roster, and survival outcome.

## Landed Today

- Promoted Lava through deterministic feel/progression, fire-start live survival, and Demon Slime completion gates.
- Folded Lava live and boss gates into `npm run verify:release`.
- Fixed Demon Slime boss victory cleanup after its death animation.
- Added the first Stage Select alchemy grimoire readback for known elements and discovered fusions.
- Extended progression smoke to prove recipe readback survives reload and the grimoire opens/closes.
- Added post-run reward/unlock readback for cleared stage, essence banked, new world unlocks, character unlocks, and best-time updates.
- Extended progression smoke to assert Forest and Lava reward readback matches the saved unlock contract.
- Hardened the shared live harness with roster observation, off-roster failures, better scene-stop diagnostics, and stronger kiting behavior.
- Updated the promoted balance summary so the human-readable path covers Forest through Lava.

## Verified Release Stack

Latest green stack:

- `npm run smoke:feel`
- repeated named live gates during promotion tuning
- focused Lava stack: `npm run smoke:feel`, `npm run smoke:progression`, `npm run smoke:lava-live`, `npm run smoke:lava-boss`
- focused grimoire stack: `node --check scripts/game.js`, `node --check src/systems/SaveManager.js`, `npm run typecheck`, `npm run smoke:progression`
- focused post-run readback stack: `node --check scripts/game.js`, `npm run typecheck`, `npm run smoke:progression`
- full `npm run verify:release` with Lava live and Lava boss included
- `git diff --check`

Latest pushed implementation commit:

- pending current Lava promotion changes

## Next Batch

1. Extend post-run readback with pickups, level timing, biome, roster, death/survival outcome, and "try next" alchemy nudges.
2. Promote Grave next only after deciding its death/poison identity and adding named live plus Nekros boss gates.
3. Continue live-harness hardening so future world promotions reuse consistent health, enemy, pickup, kill, and level-up artifacts.
4. Refresh docs after each promoted gate so `PRODUCTION_READINESS_WORKFLOW.md`, `PARALLEL_WORLD_AUDIT.md`, and `PROMOTED_BALANCE_SUMMARY.md` agree on the current edge.
