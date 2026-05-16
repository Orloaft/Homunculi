# XP System Comparison: Your Game vs Vampire Survivors

## Vampire Survivors XP System

### Enemy XP Drops
- **Blue gems**: 1-2 XP
- **Green gems**: 3-9 XP
- **Red gems**: 10+ XP (variable)
- Most basic enemies drop blue gems (1-2 XP)

### Level Up Requirements
**Early game (Levels 1-20):**
- Level 1→2: 5 XP
- Level 2→3: 15 XP (+10)
- Level 3→4: 25 XP (+10)
- Increases by +10 XP per level until level 20
- **Level 20**: Extra 600 XP penalty + 100% Growth boost

**Mid game (Levels 21-40):**
- Increases by +13 XP per level
- **Level 40**: Extra 2400 XP penalty + 100% Growth boost

**Late game (Levels 41+):**
- Increases by +16 XP per level

### Special Mechanics
- **400 gem cap**: Once 400 gems on ground, XP accumulates into one red gem
- **Growth stat**: Increases XP gained from gems
- **Curse**: More enemies = more XP drops

---

## Your Game's XP System

### Enemy XP Drops (Base Values)
```
'slime': 2 XP
'tree': 2 XP
'bat': 2 XP
'mushroom': 2 XP
'giantfly': 2 XP
'squirrel': 2 XP
'redpanda': 3 XP
'brainmole': 3 XP
'snowy': 3 XP
'golem': 4 XP
'elkman': 4 XP
'intellectdevourer': 5 XP
'cacodemon': 5 XP
'frost-golem': 6 XP
'spiked-slime': 3 XP
```

**Plus wave bonus:** `waveBonus = Math.floor(currentWave / 2)`
**Total XP per enemy:** `baseXP + waveBonus`

**Elite enemies:** 1.5x XP multiplier
**Boss enemies:** Drop significantly more XP based on max health

### Jewel Splitting System
XP is split into multiple jewels:
```javascript
jewelCount = Math.min(8, Math.max(1, Math.floor(xpValue / 15)))
xpPerJewel = Math.floor(xpValue / jewelCount)
```

So a 30 XP drop = 2 jewels of 15 XP each
A 60 XP drop = 4 jewels of 15 XP each

### Level Up Requirements
**Starting:** 25 XP to reach level 2

**Exponential scaling:**
- **Levels 1-3:** 1.25x multiplier (25% increase)
  - Level 2: 31 XP
  - Level 3: 39 XP

- **Levels 4-7:** 1.35x multiplier (35% increase)
  - Level 4: 53 XP
  - Level 5: 72 XP
  - Level 6: 97 XP
  - Level 7: 131 XP

- **Levels 8-12:** 1.45x multiplier (45% increase)
  - Level 8: 190 XP
  - Level 9: 276 XP
  - Level 10: 400 XP
  - Level 11: 580 XP
  - Level 12: 841 XP

- **Levels 13-20:** 1.50x multiplier (50% increase)
  - Level 13: 1,262 XP
  - Level 14: 1,893 XP
  - Level 15: 2,840 XP
  - Level 16: 4,260 XP
  - Level 17: 6,390 XP
  - Level 18: 9,585 XP
  - Level 19: 14,378 XP
  - Level 20: 21,567 XP

- **Levels 21+:** 1.60x multiplier (60% increase)
  - Level 21: 34,507 XP
  - Level 22: 55,211 XP
  - And so on...

### Special Mechanics
- **500 jewel cap**: Jewels persist indefinitely (no timeout)
- **No Growth stat**: Fixed XP values
- **Wave scaling**: Enemy XP increases with waves

---

## Key Differences

### 1. **Starting Level Requirements**
- **VS**: 5 XP to level 2
- **Your Game**: 25 XP to level 2
- **Verdict**: Your game is **5x slower** at first level

### 2. **Early Game Scaling (Levels 2-10)**
- **VS**: Linear +10 XP per level (5→15→25→35...)
- **Your Game**: Exponential 1.25-1.45x multiplier (25→31→39→53→72...)
- **VS Level 10**: Approximately 505 total XP needed
- **Your Game Level 10**: Approximately 1,300 total XP needed
- **Verdict**: Your game is **~2.5x slower** in early game

### 3. **Mid-Late Game Scaling (Levels 10-20)**
- **VS**: Still relatively gentle (+10 per level)
- **Your Game**: Aggressive 1.45-1.50x multiplier
- **VS Level 20**: Approximately 2,605 total XP needed
- **Your Game Level 20**: Approximately 38,000+ total XP needed
- **Verdict**: Your game is **~15x slower** by level 20

### 4. **Enemy XP Values**
- **VS**: Most enemies drop 1-2 XP
- **Your Game**: Most enemies drop 2-6 XP (with wave bonus)
- **Verdict**: Your enemies drop **2-3x more XP individually**

### 5. **XP Gem Density**
- **VS**: One gem per kill typically
- **Your Game**: Split into multiple jewels (up to 8)
- **Verdict**: Your game has **more pickups** but same total value

---

## Analysis

### What This Means:

**Early Game (Levels 1-5):**
- Your game is significantly slower
- Players need to kill ~2-3x more enemies to level up
- First level up takes much longer (psychological impact)

**Mid Game (Levels 5-15):**
- Gap widens dramatically
- Your exponential curve becomes very steep
- Players level up much less frequently

**Late Game (Levels 15+):**
- Your game has extreme XP requirements
- VS actually maintains more consistent leveling pace
- Your players will plateau harder

### Issues:

1. **First impression**: 5 XP vs 25 XP is a big psychological difference
2. **Exponential vs Linear**: VS uses mostly linear scaling with small bumps
3. **Your multipliers are too aggressive**: 1.45-1.60x per level compounds quickly
4. **Level 20 comparison**: 2,605 XP (VS) vs 38,000+ XP (yours) is massive

### Why Vampire Survivors Feels Better:

1. **Quick first level**: 5 XP = instant gratification
2. **Gentle early curve**: Linear +10 keeps early game rewarding
3. **Strategic spike points**: Big jumps at levels 20 and 40 with Growth boost
4. **Consistent pace**: Players level regularly throughout 30-minute run
5. **Growth stat**: Gives players agency to speed up XP gain

---

## Recommendations

### Option 1: Match Vampire Survivors More Closely
```
Level 1→2: 5 XP (instead of 25)
Levels 2-20: +10 XP per level (linear)
Levels 21-40: +13 XP per level
Levels 41+: +16 XP per level
```

### Option 2: Moderate Your Current System
```
Level 1→2: 10 XP (instead of 25)
Levels 1-3: 1.15x multiplier (instead of 1.25x)
Levels 4-7: 1.20x multiplier (instead of 1.35x)
Levels 8-12: 1.25x multiplier (instead of 1.45x)
Levels 13-20: 1.30x multiplier (instead of 1.50x)
Levels 21+: 1.35x multiplier (instead of 1.60x)
```

### Option 3: Hybrid Approach
```
Level 1→2: 5 XP (quick first level)
Levels 2-10: +10 XP per level (linear for early game)
Levels 11-20: 1.20x multiplier (gentle exponential)
Levels 21+: 1.30x multiplier (steeper but not extreme)
```

---

## Current Impact on Gameplay

Based on typical enemy counts in horde games:

**Vampire Survivors:**
- Kill ~50 enemies → Level 2-3
- Kill ~500 enemies → Level 10
- Kill ~2,000 enemies → Level 20

**Your Game (estimated):**
- Kill ~12 enemies → Level 2
- Kill ~650 enemies → Level 10 (assuming 2 XP per enemy)
- Kill ~19,000 enemies → Level 20

The math shows your players need to kill significantly more enemies per level in mid-late game, which could make progression feel slow and grindy.

---

## Testing Suggestion

Try playing your game for a 30-minute run and track:
- How many enemies you kill
- How many levels you gain
- How often you level up

Compare to a VS 30-minute run (typically reaches level 40-80 depending on character/stage).

If you're leveling up less than once per minute on average, the curve is probably too steep.
