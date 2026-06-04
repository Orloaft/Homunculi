# Roadmap Progress

Date: 2026-06-04

This is the short handoff ledger for the current Homunculi production-roadmap push. Detailed tuning and gate notes live in the linked audit docs.

## Current Production Edge

- Promoted path: Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean.
- Current front edge: Ocean is release-backed.
- Next world lane: Lava.
- Next core-loop lane: grimoire/readback UI for discovered recipes, run rewards, unlocks, and persisted progress.

## Landed Today

- Promoted Snow through deterministic feel/progression, live survival, and Frost Guardian boss gates.
- Promoted Ocean through deterministic feel/progression, water-start live survival, and Sea Kings completion gates.
- Folded Ocean live and boss gates into `npm run verify:release`.
- Hardened the shared live harness with roster observation, off-roster failures, better scene-stop diagnostics, and stronger kiting behavior.
- Updated the promoted balance summary so the human-readable path covers Forest through Ocean.

## Verified Release Stack

Latest green stack:

- `npm run smoke:feel`
- repeated named live gates during promotion tuning
- full `npm run verify:release` with Ocean live and Ocean boss included
- `git diff --check`

Latest pushed implementation commit:

- `abba065` - `Promote Ocean into release gates`

## Next Batch

1. Promote Lava live: add `smoke:lava-live`, assert Lava roster/biome identity, and stabilize the first-minute ramp if needed.
2. Promote Lava boss: add or wire a named Demon Slime smoke gate, then fold Lava live plus boss into `verify:release` once repeatable.
3. Build the first grimoire/readback surface for discovered recipes, earned XP, pickups, level timing, biome, roster, and death/survival outcome.
4. Continue live-harness hardening so future world promotions reuse consistent health, enemy, pickup, kill, and level-up artifacts.
5. Refresh docs after each promoted gate so `PRODUCTION_READINESS_WORKFLOW.md`, `PARALLEL_WORLD_AUDIT.md`, and `PROMOTED_BALANCE_SUMMARY.md` agree on the current edge.
