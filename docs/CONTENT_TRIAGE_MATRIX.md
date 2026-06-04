# Content Triage Matrix

Phase 2 goal: stop treating the shipped content as one large pile. Keep the current authoritative runtime (`index.html` + `scripts/game.js`) stable, then decide which worlds deserve immediate polish, which should be promoted next, and which should stay parked until they have a clear gameplay identity.

For the current execution order, smoke gates, and done definition, see `docs/PRODUCTION_READINESS_WORKFLOW.md`.

## Production Slice Decision

Keep now:

- Forest Land: best first-world candidate and already covered by progression and feel smokes.
- Cave Land: good second-world escalation, clear boss, character unlock, and fusion teaching role.
- Sand Land: completes the current three-world slice and unlocks Swamp plus Blip.

Promote next:

- Swamp Land: already follows Sand in canonical progression and now has first-pass tuning/smoke coverage for its readable opener, poison/mud discovery hint, and early fusion support.
- Snow Land: coherent ice/water theme and boss, but should wait until Swamp has a tested identity.
- Ocean Land: strong asset identity and multi-boss finale, but likely higher risk than Swamp/Snow.

Park:

- Lava Land, Grave Land, Castle Land, Spire Land, The Void. They have valuable assets and bosses, but should not pull attention away from the first three worlds plus the next promoted world.

## Runtime Matrix

| World | Bucket | Enemies | Boss / Finale | Music | Unlock / Reward | Element Theme | Story Beat | Asset Status | Bug Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Forest Land | Keep now | mushroom, tree, squirrel, bumblebee, redpanda, arcane/earth slimes, summoner, giant mushroom | Awakened Obelisk | `forestland-bgm`, `boss1-bgm` | Starts unlocked; first completion unlocks Cave and Orb | Nature, Earth, Arcane | First contact with cursed wilderness and alchemy basics | Strong enough for slice; has stage title, planet icon, gate, enemies, boss | Low-medium; covered by progression and feel smokes, but live 30-second survival is not automated yet |
| Cave Land | Keep now | darkbat, kobold, brainmole, slime, soul, golem, intellect devourer, giant slime | Archer boss | `caveland-bgm`, `boss2-intro-bgm`, `boss2-loop-bgm` | Forest victory unlocks Cave; first Cave completion unlocks Sand and Grim | Earth, Crystal, darkness/echo | First escalation and fusion tutorial space | Strong; unique boss and cave roster | Medium; complex boss behavior and old cave naming still deserve focused live smoke later |
| Sand Land | Keep now | cobra, cactuse, bat, armadillo, caveghoul, soul, golem, giant cobra | Eyelor | `desertland-bgm`, `boss3-bgm` | Cave victory unlocks Sand; first Sand completion unlocks Swamp and Blip | Fire, Sand, sun/glass/time candidate | Heat and ruined desert identity, bridge into wider world | Good but still uses some `desertland` asset keys by compatibility | Medium; player-facing naming was cleaned, but legacy asset/key drift remains |
| Swamp Land | Promote next | bloboid, giantfly, mudguard, swampmerchant, torchboy, eyewalker, giant bloboid | Amphibian | `swampland-bgm`, `boss1-bgm` | Sand victory unlocks Swamp | Water, Poison, Mud | First post-slice world; rot, sickness, and corrupted wetlands | Promising; bespoke boss and stage music exist | Medium; opening wave and tuning constants are now covered by feel/progression smoke, but Amphibian still needs a focused live gate |
| Snow Land | Promote later | snowy, northerner, spiked slime, elkman, frost golem, lightning slime | Frost Guardian | `snowland-bgm`, `boss3-bgm` | Swamp victory unlocks Snow | Ice, Water, Lightning | Frozen aftermath and survival pressure | Coherent enemy pack and stage music | Medium; wave pacing has odd interval jumps and needs feel pass before promotion |
| Ocean Land | Promote later | jellyfish, crabby, squid, shark, crablore, water slime | Sea Kings | `oceanland-bgm`, `boss3-bgm` | Snow victory unlocks Ocean | Water, Wave | Ancient sea secrets and multi-threat finale | Strong asset identity, but more complex boss surface | High; multi-boss finale and aquatic roster need targeted smoke before polish |
| Lava Land | Park | fireslime, clubimp, axeimp, flyingdemon, fireworm, orangegolem, summoner, giant fireslime | Demon Slime | `lavaland-bgm`, `demonslime-boss-bgm` | Ocean victory unlocks Lava | Fire, Lava | Volcanic underworld escalation | Strong audio/boss identity | Medium-high; later power curve should be rebalanced after first promoted world |
| Grave Land | Park / candidate alternative slice | yellowskeleton, skeletonseeker, soul, skullhound, imps, giant skeleton | Nekros | `graveland-bgm`, `boss4-bgm` | Lava victory unlocks Grave | Death, Poison | Necromancy and world-ending lore | Strong dark fantasy fit | Medium; thematically strong enough to revisit if Forest is not the final first-world choice |
| Castle Land | Park | castle-squire, soldier, rogue, knight, bladekeeper, giant knight | King Nothing | `castleland-intro-bgm`, `castleland-bgm`, `castleboss-bgm` | Grave victory unlocks Castle | Metal, Arcane | Human ruin / fallen power center | Richest staged audio stack and enemy set | High; biggest set-piece expectations, should not be tuned before core loop is proven |
| Spire Land | Park | currently shares Forest wave patterns | Default Obelisk path unless overridden elsewhere | no clear Spire stage BGM is loaded in the active preload list | Castle victory unlocks Spire | Air, Lightning | Vertical ascent/endgame trial | Stage exists, but identity is not yet distinct in wave table | High; shared Forest waves undermine world identity |
| The Void | Park | runtime identity is thinner than other worlds in current matrix | Default Obelisk/voidkin-related fallback paths | no clear stage BGM in loaded audio list | Spire victory unlocks Void | Chaos, Arcane | Final dimension / end-state reveal | Stage select node exists; recent smoke fixed Voidkin animation fallback | High; final-world role should be designed, not merely unlocked |

## Immediate Roadmap

1. Finish the Forest/Cave/Sand slice before widening scope.
2. Keep `npm run smoke:forest-live` healthy as the short live-run gate: it starts Forest through the active runtime, injects a starting element, and verifies 30 seconds of active gameplay with enemy activity.
3. Promote Swamp only after Forest/Cave/Sand has a human-readable balance summary and the live-run smoke is stable.
4. Give each promoted world one memorable rule before adding new content. For Swamp, the obvious candidate is poison/mud pressure with the Amphibian as the first "area control" boss.
5. Keep Spire and Void out of production claims until their wave tables, music, boss identity, and story role are made distinct.

## Notes From Runtime Audit

- Canonical progression is currently Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava -> Grave -> Castle -> Spire -> Void.
- Stage-select element drops already express useful identity: Forest gives Nature/Earth, Cave gives Earth/Crystal, Sand gives Fire/Sand, Swamp gives Water/Poison, Snow gives Ice/Water, Ocean gives Water/Wave, Lava gives Fire/Lava, Grave gives Death/Poison, Castle gives Metal/Arcane, Spire gives Air/Lightning, and Void gives Chaos/Arcane.
- Character unlocks currently exist only for the first slice: Forest -> Orb, Cave -> Grim, Sand -> Blip.
- The strongest near-term differentiator remains alchemy discovery. The matrix should be revised once an alchemy grimoire or permanent recipe-discovery system exists.
