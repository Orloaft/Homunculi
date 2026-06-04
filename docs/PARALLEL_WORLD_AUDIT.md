# Parallel World Audit

Date: 2026-06-04

These findings came from parallel read-only agents. Use this as the handoff queue for future world-promotion workers.

## Swamp

Status: promoted into deterministic feel/progression gates, now has a 30-second live gate and deterministic Amphibian boss-entry/death gate.

Useful facts:

- Runtime IDs: `stage: 'swamp'`, `worldId: 'swampland'`, completion ID `swamp-1`.
- Opening roster: `bloboid`, `giantfly`, `mudguard`; tuned normal-density opener is about `6300ms` spawn interval and `8` max enemies.
- Current live command: `npm run smoke:swamp-live`.
- Current boss command: `npm run smoke:swamp-boss`.
- The live gate uses a stable fire-start pilot. Swamp theme identity remains covered by deterministic water/poison/mud reward and tuning assertions.

Risks to fix next:

- Fixed 2026-06-04: Amphibian health now applies the Swamp boss tuning multiplier and is covered by `smoke:swamp-boss`.
- Fixed 2026-06-04: Amphibian boss death now has a dedicated completion path instead of depending on the generic Obelisk death animation.
- Future Swamp boss work should add a safe spit/tongue action assertion once the live pilot can fast-forward into boss range without making the gate flaky.

## Snow

Status: promoted into deterministic feel/progression gates, now has a 30-second live gate and deterministic Frost Guardian boss-entry/attack/death gate.

Useful facts:

- Runtime IDs: `stage: 'snow'`, `worldId: 'snowland'`, completion ID `snow-1`.
- Progression: Swamp victory unlocks Snow; Snow victory unlocks Ocean.
- Roster: `snowy`, `northerner`, `spiked-slime`, `elkman`, `frost-golem`, `lightningslime`.
- Theme hooks already exist for Ice, Water, Lightning, `snowland-bgm`, `snowland-title`, and `snow-tile`.
- Boss path routes Snow to `createFrostGuardianBoss()`.
- Current live command: `npm run smoke:snow-live`.
- Current boss command: `npm run smoke:snow-boss`.

Promotion notes:

- Fixed 2026-06-04: Snow is in deterministic feel/progression coverage, including Swamp -> Snow -> Ocean unlock/reload assertions.
- Fixed 2026-06-04: Snow has early fusion reward bias and vertical-slice tuning for catalyst milestones, pickup tuning, XP tuning, and boss tuning.
- Fixed 2026-06-04: Frost Guardian cooldown now decrements in boss-timer time and is covered by `smoke:snow-boss`.
- Fixed 2026-06-04: Frost Guardian death uses its dedicated death path, raw hitbox logs were removed, and phase adds now use Snow-native `frost-golem`.

## Ocean

Status: high-risk promotion after Snow.

Useful facts:

- Runtime IDs: `stage: 'ocean'`, `worldId: 'oceanland'`, completion ID `ocean-1`.
- Progression: Snow victory unlocks Ocean; Ocean victory unlocks Lava.
- Wave roster: `jellyfish`, `crabby`, `squid`, `shark`, `crablore`, `waterslime`.
- Theme hooks exist for Water, Wave, and `ice+water -> wave`.
- Boss path routes Ocean to `createSeaKingsBoss()`.

Promotion blockers:

- Ocean is not in deterministic feel/progression coverage or early tuning.
- An older random Ocean spawn branch may still use generic enemies instead of the aquatic roster.
- Sea Kings use three bosses but generic boss-death handling may treat killing one king as full boss victory.
- Sea King death animation/completion handling appears incomplete.
- Ocean phase minions currently choose aquatic names but spawn `golem`.

## Release Hardening

Status: parallel lane, not on the world-promotion critical path.

Findings:

- Fixed 2026-06-04: `npm run build-portable` now aliases the valid Windows portable build path.
- Fixed 2026-06-04: Electron packaging now uses explicit runtime includes plus source-noise exclusions instead of root-wide `**/*`; source `.ase`/`.aseprite` art files are excluded from packaged builds.
- `index.html` depends on CDN Three.js/OBJLoader before fallback, so offline first-run polish is risky.
- Fixed 2026-06-04: release docs now match the package Node range, Phaser version, Windows portable target, smoke commands, and icon state.
- Verified 2026-06-04: `npm run build-win-portable` produced `dist/WizBiz 1.0.1.exe` at 263M after freeing workspace image space.
- Only `icon.png` exists; Windows/macOS icon coverage may warn or fall back.
- `npm run smoke:swamp-boss` and `npm run smoke:snow-boss` are release-green and included in `verify:release`.

Recommended release checklist:

1. Run `npm run verify:release`.
2. Build Windows portable first with `npm run build-win-portable`.
3. Inspect packaged contents for missing assets, source noise, tools/docs, and total size.
4. Launch the packaged app offline: fresh save, first run, first victory, reload, options, quit/relaunch.
