# Parallel World Audit

Date: 2026-06-04

These findings came from parallel read-only agents. Use this as the handoff queue for future world-promotion workers.

## Swamp

Status: promoted into deterministic feel/progression gates, now has a 30-second live gate.

Useful facts:

- Runtime IDs: `stage: 'swamp'`, `worldId: 'swampland'`, completion ID `swamp-1`.
- Opening roster: `bloboid`, `giantfly`, `mudguard`; tuned normal-density opener is about `6300ms` spawn interval and `8` max enemies.
- Current live command: `npm run smoke:swamp-live`.
- The live gate uses a stable fire-start pilot. Swamp theme identity remains covered by deterministic water/poison/mud reward and tuning assertions.

Risks to fix next:

- Amphibian health does not yet apply the same boss tuning multiplier path as default bosses.
- Amphibian boss death appears to fall through to generic Obelisk death handling instead of a dedicated Swamp completion path.
- Future Swamp live work should fast-forward into Amphibian entry and assert `boss.enemyType === 'amphibian-boss'`, `boss.isAmphibian === true`, health UI, AI timer, boss music, and at least one safe spit/tongue action.

## Snow

Status: next promotion candidate after Swamp boss-entry coverage.

Useful facts:

- Runtime IDs: `stage: 'snow'`, `worldId: 'snowland'`, completion ID `snow-1`.
- Progression: Swamp victory unlocks Snow; Snow victory unlocks Ocean.
- Roster: `snowy`, `northerner`, `spiked-slime`, `elkman`, `frost-golem`, `lightningslime`.
- Theme hooks already exist for Ice, Water, Lightning, `snowland-bgm`, `snowland-title`, and `snow-tile`.
- Boss path routes Snow to `createFrostGuardianBoss()`.

Promotion blockers:

- Snow is not in deterministic feel/progression coverage.
- Snow is not in early fusion reward bias or vertical-slice tuning, so it lacks catalyst milestones, pickup tuning, XP tuning, and boss tuning multiplier.
- Frost Guardian cooldown timing appears wrong: the cooldown is set in milliseconds but decremented by a tiny fixed amount per slow AI timer tick.
- Frost Guardian still has debug logs and spawns non-Snow phase adds.

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

- `npm run build-portable` calls missing `build-portable.js`; `build-win-portable` is the valid Windows portable path today.
- Electron packaging is too broad and likely ships docs, editor tools, backups, tests, `.old`, `.bak`, and `.map` files.
- `index.html` depends on CDN Three.js/OBJLoader before fallback, so offline first-run polish is risky.
- Release docs are stale: Node range, Phaser version, Windows target language, and icon requirements do not match `package.json`.
- Only `icon.png` exists; Windows/macOS icon coverage may warn or fall back.

Recommended release checklist:

1. `npx tsc --noEmit`, then `npm run compile`.
2. Run `smoke:prod`, `smoke:feel`, `smoke:progression`, `smoke:forest-live`, and `smoke:swamp-live`.
3. Build Windows portable first with `npm run build-win-portable`.
4. Inspect packaged contents for missing assets, source noise, tools/docs, and total size.
5. Launch the packaged app offline: fresh save, first run, first victory, reload, options, quit/relaunch.
6. Update release docs to match actual Node range, targets, icons, and build commands.
