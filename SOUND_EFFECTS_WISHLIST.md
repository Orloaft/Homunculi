# Sound Effects Wishlist

This document lists all sound effects needed for the game, organized by priority.

## Format Requirements
- **File format**: .wav, .ogg, or .mp3 (prefer .wav for quality, .ogg for size)
- **Sample rate**: 44100 Hz or 48000 Hz
- **Bit depth**: 16-bit minimum
- **Channels**: Mono or Stereo

---

## PHASE 1: CRITICAL SOUNDS (Highest Impact)

These sounds will have the most immediate impact on player experience.

### Combat Feedback
- [ ] `enemy-death.wav` - Short enemy death sound (70-100ms)
  - Style: Satisfying pop/crunch/splat
  - Reference: Vampire Survivors enemy death pop
  - Volume: Medium (will be dynamically adjusted by pooling)

- [ ] `player-hurt.wav` - Player takes damage (100-150ms)
  - Style: Sharp "oof" or damage impact
  - Must be distinct and noticeable over other sounds
  - Volume: Medium-high

- [ ] `boss-death.wav` - Boss defeated (500ms-1s)
  - Style: Epic explosion/breakdown sound
  - Bigger and more satisfying than regular enemy death
  - Volume: High

### Core Spell Sounds (Most Used)
- [ ] `fire-cast.wav` - Fire spell casting (100-200ms)
  - Style: Whoosh with fire crackle
  - Should feel powerful but not overwhelming

- [ ] `ice-cast.wav` - Ice spell casting (100-200ms)
  - Style: Crystalline chime/whoosh
  - Distinct from fire (higher pitch, cleaner)

- [ ] `lightning-cast.wav` - Lightning spell casting (80-150ms)
  - Style: Electric crackle/zap
  - Sharp and quick

---

## PHASE 2: SPELL EXPANSION

### More Element Casts
- [ ] `earth-cast.wav` - Earth/rock spell
  - Style: Deep rumble/thud

- [ ] `dark-cast.wav` - Dark magic spell
  - Style: Ominous whoosh/shadow sound

- [ ] `holy-cast.wav` - Holy/light magic
  - Style: Angelic chime/pure tone

- [ ] `wave-cast.wav` - Water/wave spell
  - Style: Water rushing sound

- [ ] `venom-cast.wav` - Poison/venom spell
  - Style: Toxic spray/sizzle

### Impact Sounds
- [ ] `fire-impact.wav` - Fire projectile hits enemy (50-80ms)
  - Style: Brief burn/sizzle

- [ ] `ice-impact.wav` - Ice projectile hits enemy (50-80ms)
  - Style: Ice crack/shatter (short version)

- [ ] `lightning-strike.wav` - Lightning hits enemy (50-100ms)
  - Style: Sharp electric zap

- [ ] `earth-impact.wav` - Earth/rock hits enemy (50-80ms)
  - Style: Stone thud

- [ ] `dark-impact.wav` - Dark magic hits enemy (50-80ms)
  - Style: Dark energy impact

- [ ] `holy-impact.wav` - Holy magic hits enemy (50-80ms)
  - Style: Divine damage sound (bright, pure)

---

## PHASE 3: SPECIAL SPELLS

### Ultimate/Rare Spells
- [ ] `sun-spell.wav` - Sun spell activation (300-500ms)
  - Style: Powerful, warm, radiant

- [ ] `moon-spell.wav` - Moon spell activation (300-500ms)
  - Style: Mystical, ethereal, calming

- [ ] `star-spell.wav` - Star projectile (100-200ms)
  - Style: Twinkling/magical

- [ ] `time-spell.wav` - Time manipulation (300-500ms)
  - Style: Clock ticking, time warp, ethereal

- [ ] `death-spell.wav` - Death element (300-500ms)
  - Style: Ominous, powerful, dark energy

- [ ] `nature-spell.wav` - Nature magic (300-500ms)
  - Style: Leaves rustling, growth sounds

- [ ] `life-spell.wav` - Life/healing spell (300-500ms)
  - Style: Restorative, warm, hopeful chime

- [ ] `chaos-spell.wav` - Chaos magic (200-400ms)
  - Style: Chaotic, unpredictable, glitchy

- [ ] `zodiac-spell.wav` - Zodiac constellation (300-500ms)
  - Style: Celestial, mystical

### Advanced Element Spells
- [ ] `tornado-cast.wav` - Tornado spell (200-400ms)
  - Style: Wind spinning/whistling

- [ ] `vortex-spell.wav` - Water vortex (200-400ms)
  - Style: Whirlpool spinning

- [ ] `storm-spell.wav` - Storm magic (300-500ms)
  - Style: Wind + distant thunder

- [ ] `laser-spell.wav` - Laser beam (sustained 300-700ms)
  - Style: Sustained electric/energy beam hum

- [ ] `blast-spell.wav` - Explosive blast (200-400ms)
  - Style: Loud explosion/boom

- [ ] `gravity-spell.wav` - Gravity well (300-500ms)
  - Style: Deep hum/gravitational pull

- [ ] `crystal-cast.wav` - Crystal magic (100-200ms)
  - Style: Crystal resonance/formation

- [ ] `sand-cast.wav` - Sand spell (100-200ms)
  - Style: Sand particles swirling

- [ ] `steam-spell.wav` - Steam clouds (100-200ms)
  - Style: Steam hissing

- [ ] `hex-cast.wav` - Hex/curse spell (200-300ms)
  - Style: Eerie whisper/curse sound

- [ ] `thunder-spell.wav` - Thunder from sky (300-500ms)
  - Style: Thunder strike (bigger than lightning)

---

## PHASE 4: POLISH & FEEDBACK

### Status Effects (Subtle)
- [ ] `burn-tick.wav` - Burning damage over time (very subtle, 30-50ms)
  - Style: Very quiet fire crackle
  - Volume: Low (0.15-0.25)

- [ ] `poison-tick.wav` - Poison damage over time (very subtle, 30-50ms)
  - Style: Quiet toxic bubble/sizzle
  - Volume: Low (0.15-0.25)

- [ ] `freeze-proc.wav` - Enemy gets frozen (100-200ms)
  - Style: Ice forming/crystallizing

### Pickups & Drops
- [ ] `coin-pickup.wav` - Coin collection (50-100ms)
  - Style: Pleasant coin clink
  - Higher pitch than XP pickup

- [ ] `gem-burst.wav` - Multiple gems collected at once (200-300ms)
  - Style: Cascading chimes/sparkles

- [ ] `orb-collect.wav` - Element orb pickup (100-200ms)
  - Style: Magical absorb sound

- [ ] `muffin-pickup.wav` - Health pickup (100-150ms)
  - Style: Soft, pleasant healing sound

- [ ] `rare-drop.wav` - Rare item appears (200-300ms)
  - Style: Special chime/fanfare

### UI/Menu
- [ ] `menu-select.wav` - Menu option highlight (30-50ms)
  - Style: Soft click/beep

- [ ] `menu-confirm.wav` - Confirm selection (80-120ms)
  - Style: Positive confirmation sound

- [ ] `menu-back.wav` - Back/cancel (80-120ms)
  - Style: Negative/back sound

- [ ] `power-up.wav` - Upgrade purchased (200-300ms)
  - Style: Power-up jingle

- [ ] `spell-unlock.wav` - New spell unlocked (300-500ms)
  - Style: Achievement fanfare

- [ ] `fusion-unlock.wav` - Element fusion discovered (300-500ms)
  - Style: Magical discovery sound

### Projectile/Orbs
- [ ] `orb-shoot.wav` - Basic orb projectile firing (50-100ms)
  - Style: Magical projectile launch

- [ ] `summon-cast.wav` - Summoning spell (300-500ms)
  - Style: Portal opening/summoning circle

### Progression
- [ ] `wave-start.wav` - New wave begins (200-300ms)
  - Style: Alert/ready sound

- [ ] `victory-jingle.wav` - Wave completed (500ms-1s)
  - Style: Short victory fanfare

- [ ] `achievement.wav` - Achievement unlocked (300-500ms)
  - Style: Special achievement sound

---

## PHASE 5: OPTIONAL ENHANCEMENTS

### Enemy Variety
- [ ] `enemy-hit.wav` - Subtle enemy hit (20-40ms)
  - Style: Very subtle impact (low volume)
  - Note: May skip this if too noisy

- [ ] `boss-hit.wav` - Boss taking damage (80-120ms)
  - Style: Heavier impact than regular enemy

- [ ] `elite-death.wav` - Elite enemy death (150-250ms)
  - Style: Bigger than regular enemy, smaller than boss

### Advanced Sounds
- [ ] `shield-hit.wav` - Damage blocked by shield (80-120ms)
  - Style: Metallic deflection

- [ ] `countdown-tick.wav` - Wave countdown tick (50-80ms)
  - Style: Clock tick or beep

- [ ] `boss-warning.wav` - Boss approaching (500ms-1s)
  - Style: Dramatic warning sound

- [ ] `charge-expansion.wav` - Charge slot upgrade (200-300ms)
  - Style: Power up sound

- [ ] `magnetizing-orb.wav` - Magnet effect (sustained 200-400ms)
  - Style: Magnetic pull sound

---

## Sound Pool Configuration

These sounds are already configured in the sound pooling system:

| Sound | Max Concurrent | Notes |
|-------|----------------|-------|
| enemy-death | 8 | Dynamic volume scaling |
| enemy-hit | 5 | Very subtle |
| fire-impact | 6 | Medium priority |
| ice-impact | 6 | Medium priority |
| lightning-strike | 6 | Medium priority |
| earth-impact | 6 | Medium priority |
| dark-impact | 6 | Medium priority |
| holy-impact | 6 | Medium priority |
| fire-cast | 4 | Spell casts |
| ice-cast | 4 | Spell casts |
| lightning-cast | 4 | Spell casts |
| spell-cast-generic | 8 | Fallback for other spells |

---

## Priority Summary

**Start with these 10 sounds for maximum impact:**
1. enemy-death.wav
2. player-hurt.wav
3. fire-cast.wav
4. ice-cast.wav
5. lightning-cast.wav
6. fire-impact.wav
7. ice-impact.wav
8. lightning-strike.wav
9. boss-death.wav
10. power-up.wav

**Then add these 10 for spell variety:**
11. earth-cast.wav
12. dark-cast.wav
13. holy-cast.wav
14. wave-cast.wav
15. venom-cast.wav
16. earth-impact.wav
17. dark-impact.wav
18. holy-impact.wav
19. menu-select.wav
20. menu-confirm.wav

**Phase 3+ is polish and special spells (30+ more sounds)**

---

## Integration Notes

Once you provide the sound files:
1. Place them in the `sfx/` directory
2. I will add the `load.audio()` calls in the preload function
3. I will integrate the sounds into spell casting functions
4. The sound pooling system is already implemented and ready to use

All sounds will automatically benefit from:
- Pitch variation (0.9-1.1x) to prevent repetition
- Volume pooling to prevent audio chaos
- Dynamic volume scaling for enemy deaths
- Automatic cleanup to prevent memory leaks
