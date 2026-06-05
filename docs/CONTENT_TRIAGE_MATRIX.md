# Content Triage Matrix

Phase 2 goal: stop treating the shipped content as one large pile. Keep the current authoritative runtime (`index.html` + `scripts/game.js`) stable, then decide which worlds deserve immediate polish, which should be promoted next, and which should stay parked until they have a clear gameplay identity.

For the current execution order, smoke gates, and done definition, see `docs/PRODUCTION_READINESS_WORKFLOW.md`.

## Production Slice Decision

Update 2026-06-05: Swamp, Snow, Ocean, and Lava have moved from promotion candidates into the release-backed path. Grave is now the next promotion lane; Castle, Spire, and Void remain parked until Grave has deterministic, live, boss, and progression coverage.

Keep now:

- Forest Land: best first-world candidate and already covered by progression and feel smokes.
- Cave Land: good second-world escalation, clear boss, character unlock, and fusion teaching role.
- Sand Land: completes the current three-world slice and unlocks Swamp plus Blip.

Promoted:

- Swamp Land: release-backed through deterministic feel/progression, 30-second live coverage, and Amphibian boss coverage.
- Snow Land: release-backed through deterministic feel/progression, 30-second live coverage, and Frost Guardian boss coverage.
- Ocean Land: release-backed through deterministic feel/progression, 30-second water-start live coverage, and Sea Kings multi-boss completion coverage.
- Lava Land: release-backed through deterministic feel/progression, 30-second fire-start live coverage, and Demon Slime completion coverage.

Promote next:

- Grave Land: follows Lava in canonical progression and has strong death/poison assets, but still needs the full promoted-world gate set before production claims widen past Lava.

Park:

- Castle Land, Spire Land, The Void. They have valuable assets and bosses, but should not pull attention away from Grave and the core-loop readback lane.

## Runtime Matrix

| World | Bucket | Enemies | Boss / Finale | Music | Unlock / Reward | Element Theme | Story Beat | Asset Status | Bug Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Forest Land | Keep now | mushroom, tree, squirrel, bumblebee, redpanda, arcane/earth slimes, summoner, giant mushroom | Awakened Obelisk | `forestland-bgm`, `boss1-bgm` | Starts unlocked; first completion unlocks Cave and Orb | Nature, Earth, Arcane | First contact with cursed wilderness and alchemy basics | Strong enough for slice; has stage title, planet icon, gate, enemies, boss | Low-medium; covered by progression and feel smokes, but live 30-second survival is not automated yet |
| Cave Land | Keep now | darkbat, kobold, brainmole, slime, soul, golem, intellect devourer, giant slime | Archer boss | `caveland-bgm`, `boss2-intro-bgm`, `boss2-loop-bgm` | Forest victory unlocks Cave; first Cave completion unlocks Sand and Grim | Earth, Crystal, darkness/echo | First escalation and fusion tutorial space | Strong; unique boss and cave roster | Medium; complex boss behavior and old cave naming still deserve focused live smoke later |
| Sand Land | Keep now | cobra, cactuse, bat, armadillo, caveghoul, soul, golem, giant cobra | Eyelor | `desertland-bgm`, `boss3-bgm` | Cave victory unlocks Sand; first Sand completion unlocks Swamp and Blip | Fire, Sand, sun/glass/time candidate | Heat and ruined desert identity, bridge into wider world | Good but still uses some `desertland` asset keys by compatibility | Medium; player-facing naming was cleaned, but legacy asset/key drift remains |
| Swamp Land | Promoted | bloboid, giantfly, mudguard, swampmerchant, torchboy, eyewalker, giant bloboid | Amphibian | `swampland-bgm`, `boss1-bgm` | Sand victory unlocks Swamp | Water, Poison, Mud | First post-slice world; rot, sickness, and corrupted wetlands | Promising; bespoke boss and stage music exist | Medium-low; covered by feel/progression, live, and boss gates |
| Snow Land | Promoted | snowy, northerner, spiked slime, elkman, frost golem, lightning slime | Frost Guardian | `snowland-bgm`, `boss3-bgm` | Swamp victory unlocks Snow | Ice, Water, Lightning | Frozen aftermath and survival pressure | Coherent enemy pack and stage music | Medium-low; covered by feel/progression, live, and boss gates |
| Ocean Land | Promoted | jellyfish, crabby, squid, shark, crablore, water slime | Sea Kings | `oceanland-bgm`, `boss3-bgm` | Snow victory unlocks Ocean | Water, Wave | Ancient sea secrets and multi-threat finale | Strong asset identity, but more complex boss surface | Medium; covered by feel/progression, water-start live, and Sea Kings completion gates |
| Lava Land | Promoted | fireslime, clubimp, axeimp, flyingdemon, fireworm, orangegolem, summoner, giant fireslime | Demon Slime | `lavaland-bgm`, `demonslime-boss-bgm` | Ocean victory unlocks Lava | Fire, Lava | Volcanic underworld escalation | Strong audio/boss identity | Medium; covered by feel/progression, live, and boss gates |
| Grave Land | Promote next | yellowskeleton, skeletonseeker, soul, skullhound, imps, giant skeleton | Nekros | `graveland-bgm`, `boss4-bgm` | Lava victory unlocks Grave | Death, Poison | Necromancy and world-ending lore | Strong dark fantasy fit | Medium-high; needs deterministic, live, boss, and progression promotion gates |
| Castle Land | Park | castle-squire, soldier, rogue, knight, bladekeeper, giant knight | King Nothing | `castleland-intro-bgm`, `castleland-bgm`, `castleboss-bgm` | Grave victory unlocks Castle | Metal, Arcane | Human ruin / fallen power center | Richest staged audio stack and enemy set | High; biggest set-piece expectations, should not be tuned before core loop is proven |
| Spire Land | Park | currently shares Forest wave patterns | Default Obelisk path unless overridden elsewhere | no clear Spire stage BGM is loaded in the active preload list | Castle victory unlocks Spire | Air, Lightning | Vertical ascent/endgame trial | Stage exists, but identity is not yet distinct in wave table | High; shared Forest waves undermine world identity |
| The Void | Park | runtime identity is thinner than other worlds in current matrix | Default Obelisk/voidkin-related fallback paths | no clear stage BGM in loaded audio list | Spire victory unlocks Void | Chaos, Arcane | Final dimension / end-state reveal | Stage select node exists; recent smoke fixed Voidkin animation fallback | High; final-world role should be designed, not merely unlocked |

## Immediate Roadmap

1. Keep the Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava release-backed path green.
2. Promote Grave next with deterministic feel/progression, named live, named boss, and release-stack coverage.
3. Keep grimoire and post-run readback healthy so players can see discovered recipes, unlocks, run outcomes, and next-run nudges.
4. Keep each promoted world tied to one memorable rule before adding new content.
5. Keep Castle, Spire, and Void out of production claims until Grave and the readback lane are stable.

## Notes From Runtime Audit

- Canonical progression is currently Forest -> Cave -> Sand -> Swamp -> Snow -> Ocean -> Lava -> Grave -> Castle -> Spire -> Void.
- Stage-select element drops already express useful identity: Forest gives Nature/Earth, Cave gives Earth/Crystal, Sand gives Fire/Sand, Swamp gives Water/Poison, Snow gives Ice/Water, Ocean gives Water/Wave, Lava gives Fire/Lava, Grave gives Death/Poison, Castle gives Metal/Arcane, Spire gives Air/Lightning, and Void gives Chaos/Arcane.
- Character unlocks currently exist only for the first slice: Forest -> Orb, Cave -> Grim, Sand -> Blip.
- The strongest near-term differentiator remains alchemy discovery. The matrix should be revised once an alchemy grimoire or permanent recipe-discovery system exists.
