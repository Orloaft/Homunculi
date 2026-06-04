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

## Forest Live Smoke

`npm run smoke:forest-live` covers the live-run gap from the production proposal. It boots the real Electron/Phaser renderer, starts Forest through the active `GameScene`, injects a starting element through the same runtime state the intro would fill, and lets the run advance for 30 seconds.

The smoke fails if the Phaser canvas is missing, a renderer script error is raised, Forest does not enter active gameplay, the wizard dies, the survival timer does not advance, or no enemy activity is observed. It uses normal enemy density so the wave system has to produce real combat activity during the check.
