# Resonant Triad post-run attribution correction

The former `forest-post-run-summary-narrow.png` remains archived under
`/home/orlovboros/artifacts/managers/homunculi/resonant-triad-implementation/`.
It was an ordinary Game Over capture and did not demonstrate Triad attribution.

This correction renders results only for valid `resonantTriad` summaries with
valid `triadPlayers`. Each player line uses the existing player discipline,
signature trigger/metric, reagent count, exported decision-log trail, and
canonical recipe discoveries. Non-Triad and Legacy Mayhem summaries do not
receive the Triad block.

`HOMUNCULI_TRIAD_SMOKE` now captures only this replacement proof set. It waits
for Phaser's Title scene, starts the real `GameOverScene` with representative
two-player Triad summary data, waits for visible rendered attribution text, and
asserts that GameOver—not a BattleScene modal—is active.

## Visual verdict

Self-inspected desktop and 640-wide captures show P1 Crucible and P2 Tempest,
their signature counts and metrics, choice trails, and recipe discoveries in a
single bounded GameOver results panel. No attribution text overlaps another UI
surface in either capture.

## Verification

- Passed with Node 24.12.0: syntax checks, `test:triad-post-run`,
  `test:resonant-triad`, `test:web-release-blockers`, `typecheck`, `compile`,
  `audit:package`, and `smoke:resonant-triad`.
- `verify:smoke` ran through its boss scenarios and failed at the pre-existing
  Lava boss cleanup/title timing smoke. The post-run code is not exercised by
  that path; an isolated Lava retry also failed in its title-asset wait.

See `resonant-triad-post-run-fix.artifacts.json` for checksums and byte sizes.
