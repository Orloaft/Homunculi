# Promoted Balance Summary

Date: 2026-06-05

Scope: current promoted production path, Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava. Values come from the shipped runtime in `scripts/game.js`, with normal enemy density and the deterministic feel/progression smoke assumptions.

## Summary Table

| World | Opener Roster | Normal Opener | Tuning | Boss | Unlock Reward |
| --- | --- | --- | --- | --- | --- |
| Forest Land | `mushroom`, `tree`, `squirrel`, `bumblebee` | 6600ms spawn, 7 max enemies | boss x0.8, XP x2.0, magnet 240/520, catalysts L4 +1 and L8 +2 | Awakened Obelisk, 1080 HP | Cave Land, Orb, essence |
| Cave Land | `darkbat`, `kobold`, `brainmole` | 6300ms spawn, 7 max enemies | boss x0.85, XP x1.6, magnet 220/500, catalysts L4 +1 and L8 +2 | Archer, 5610 HP | Sand Land, Grim, essence |
| Sand Land | `cobra`, `cactuse`, `bat` | 6000ms spawn, 7 max enemies | boss x0.9, XP x1.4, magnet 220/500, catalysts L4 +1 and L8 +2 | Eyelor, 2025 HP | Swamp Land, Blip, essence |
| Swamp Land | `bloboid`, `giantfly`, `mudguard` | 6300ms spawn, 8 max enemies | boss x0.95, XP x1.3, magnet 210/480, catalysts L4 +1 and L8 +2 | Amphibian, 2850 HP | Snow Land, essence |
| Snow Land | `snowy`, `northerner`, `spiked-slime` | 6440ms spawn, 7 max enemies | boss x1.0, XP x1.2, magnet 200/470, catalysts L4 +1 and L8 +2 | Frost Guardian, 3600 HP | Ocean Land, essence |
| Ocean Land | `jellyfish`, `crabby`, `waterslime` | 6600ms spawn, 7 max enemies | boss x1.05, XP x1.2, magnet 200/470, catalysts L4 +1 and L8 +2 | Sea Kings, 3000 total HP at normal density | Lava Land, essence |
| Lava Land | `fireslime`, `clubimp`, `axeimp` | 6480ms spawn, 7 max enemies | boss x1.1, XP x1.2, magnet 195/460, catalysts L4 +1 and L8 +2 | Demon Slime, 5500 HP | Grave Land, essence |

Normal opener values are after the smoke harness sets `enemyDensityMultiplier = 0.5` and after vertical-slice spawn-interval tuning is applied.

## First-Minute Shape

- Forest teaches a broad but gentle baseline: four low-pressure creature types, no opener special event, and a high XP multiplier so the first level arrives quickly in the live smoke.
- Cave narrows the opener to three enemies and leans on Earth/Crystal setup while saving larger cave pressure for waves 1-2.
- Sand keeps the opener readable with cobra/cactuse/bat, then introduces armadillo, caveghoul, soul, and giant cobra by wave 2.
- Swamp opens with wetland control enemies, then adds swampmerchant and torchboy before the first giant bloboid.
- Snow opens with ice survival pressure and adds elkman, frost-golem, and lightningslime by wave 2.
- Ocean opens with jellyfish, crabby, and an early waterslime water source, then adds a gentler squid second wave and brings in shark by wave 2.
- Lava opens with fire slime plus imps, then introduces flying demons and fireworms before orange golems and giant fire slimes raise the pressure.

## Fusion And Catalyst Setup

All promoted worlds share the same early catalyst promise:

- Level 4 grants 1 catalyst.
- Level 8 grants 2 catalysts.
- The early primary-element reward path biases a one-element run toward at least one compatible fusion setup in Forest, Cave, Sand, Swamp, Snow, Ocean, and Lava.

The deterministic feel smoke verifies the fusion setup with a fire-held test wizard. World-theme identity is still protected by the stage rosters and enemy element drops; Stage Select now gives the player a first grimoire readback for known elements and discovered fusions, and GameOver reports world pressure plus alchemy nudges after each run.

## Progression Contract

The promoted path currently guarantees:

- Fresh save starts with Forest Land unlocked.
- Forest victory records `forest-1`, unlocks Cave Land, unlocks Orb, and awards essence.
- Cave victory records `cave-1`, unlocks Sand Land, unlocks Grim, and awards essence.
- Sand victory records `sand-1`, unlocks Swamp Land, unlocks Blip, and awards essence.
- Swamp victory records `swamp-1`, unlocks Snow Land, and awards essence.
- Snow victory records `snow-1`, unlocks Ocean Land, awards essence, records stage stats, and does not unlock a character.
- Ocean victory records `ocean-1`, unlocks Lava Land, awards essence, and records stage stats.
- Lava victory records `lava-1`, unlocks Grave Land, awards essence, and records stage stats.
- Reload checks preserve promoted unlock state through Grave Land visibility.
- Post-run reward readback names the cleared/attempted stage, essence banked, new world unlocks, character unlocks, best-time updates, duration, level reached, pickups, defeats, world pressure, win/death outcome, and recipe/nudge state.

## Coverage Notes

- `smoke:feel` protects opener roster width, opening spawn interval, opening enemy cap, first-three-wave variety, catalyst milestones, pickup tuning, boss tuning multipliers, and early fusion setup for Forest/Cave/Sand/Swamp/Snow/Ocean/Lava.
- `smoke:progression` protects save unlocks, alchemy recipe persistence, Stage Select grimoire readback, richer post-run victory/attempt readback, character rewards, essence rewards, and Snow/Ocean/Lava reload stats through Grave unlock.
- `smoke:forest-live`, `smoke:swamp-live`, `smoke:snow-live`, `smoke:ocean-live`, and `smoke:lava-live` protect short real-renderer survival for promoted live worlds. Ocean uses a water-start pilot; Ocean and Lava assert observed live enemies stay inside their stage rosters.
- `smoke:swamp-boss`, `smoke:snow-boss`, `smoke:ocean-boss`, and `smoke:lava-boss` protect deterministic boss entry and completion for the promoted post-slice bosses.

## Gaps To Close Next

- Cave and Sand do not yet have named live or boss gates, despite being part of the committed production path.
- First-level timing is live-proven for Forest and observed in the Lava live gate. Cave, Sand, Swamp, Snow, and Ocean rely on deterministic XP/pickup tuning checks, not explicit named first-level assertions.
- Grave is the next world in the promotion path and needs the same deterministic feel/progression/boss/live pass before production claims widen past Lava.
