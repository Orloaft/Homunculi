# Track A Gameplay Feel Smoke

Track A added `npm run smoke:feel` as a low-risk automated probe for the Forest/Cave/Sand first slice.

The smoke boots the real Electron/Phaser renderer, then calls `window.runHomunculiFeelSmoke()` from `scripts/game.js`. It does not start a live match or tune content. Instead, it instantiates `GameScene` in renderer context and checks deterministic pacing data that should correlate with first-play readability:

- Forest, Cave, and Sand each have a distinct opening enemy roster.
- Opening waves stay readable: 3-4 enemy types, no giant enemies, no special events, normalized weights, a slow spawn interval, and a low enemy cap at normal density.
- Waves 1 and 2 increase pressure through shorter spawn intervals and higher enemy caps.
- The first three waves contain at least five enemy types per stage.
- Early catalyst milestones remain present at levels 4 and 8.
- First-slice boss health multipliers remain in the tuned confidence envelope.

This complements `npm run smoke:progression`, which verifies save progression and exact vertical-slice constants. `smoke:feel` intentionally uses ranges and invariants rather than exact values so Track B can keep tuning content without changing the test for every small balance adjustment.
