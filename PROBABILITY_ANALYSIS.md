# WIZBIZ BUILD PROBABILITY ANALYSIS
## Complete Drop Rates and Progression Data

---

## 1. CHESS PIECE DROP RATES

### 1.1 Chest Reward Distribution (Lines 43410-43424)
**Where obtained:** From treasure chests that drop from elite enemies and level-up rewards

**Drop rates:**
- **70% chance** - Random primary element (20 types: fire, water, lightning, earth, air, ice, arcane, poison, lava, steam, mud, dust, storm, blast, volcano, crystal, sand, wave, meteor, gravity)
- **30% chance** - Random chess piece (7 types: pawn, knight, bishop, rook, queen, king, joker)

**Chess piece breakdown (equal distribution within 30%):**
- Each chess piece has **30% ÷ 7 ≈ 4.29%** individual drop rate

### 1.2 Specific Chess Pieces
From the code, all chess pieces are passive/modifier elements:
- **Knight** (4.29%): Halves cooldown (doubles fire rate)
- **King** (4.29%): Damage boost modifier
- **Queen** (4.29%): Multi-directional cast
- **Pawn** (4.29%): Double-shot modifier
- **Bishop** (4.29%): Special modifier
- **Rook** (4.29%): Special modifier
- **Joker** (4.29%): Applies ALL chess modifiers if any chess pieces equipped

### 1.3 Chess Piece Drop Sources
1. **Elite Enemy Death** - Drops reward chest (Line 23762)
   - Elite enemies always drop reward chest (except golems)
   - 50% chance to drop regular chest on elite slime first split (Line 23698)

2. **Level-Up Reward Chest** (From passive upgrades)
   - After acquiring 2 non-element upgrades + element choice

3. **NO direct enemy drops** - Elements only from level-ups and chests, not from basic enemy kills

---

## 2. CHEST SPAWN RATES & CONTENTS

### 2.1 Chest Spawn Conditions
**Elite Enemies (Line 23761-23762):**
- Guaranteed reward chest drop on death
- Exception: Golems do NOT drop chests

**Elite Slime First Split (Line 23698):**
- 50% chance to drop regular chest when splitting

**Level-Up (after every level):**
- Automatic level-up reward chest (always)
- Player chooses from 3 reward types including "element"

### 2.2 Reward Chest Contents Distribution
**Chest Reward Types (3 random choices, weighted):**
1. **Element** (Always included as one option) - 33.3% minimum
2. **Random Passive Upgrade** - See section 4.2
3. **Special Rewards** - Fortitude, Meditate, Link, Fusion, Upgrade, Harness, Annihilate

### 2.3 Element vs Chess Distribution from Chests
When element reward selected:
- **70%** → Primary Element (20 types)
- **30%** → Chess Piece (7 types)

---

## 3. MIND ORB & CATALYST DROP RATES

### 3.1 Mind Orb Drops (Expand Active Slots)
**Combo-based drops:**

| Combo Type | Multiplier | Chance | Source |
|-----------|-----------|--------|--------|
| Legendary | 7+ | **15%** | Line 24696-24698 |
| Epic | 5-6 | **10%** | Line 24705-24707 |
| Rare | 3-4 | 0% | Line 24716-24724 |
| Regular Roll | 5 | **5%** | Line 24617-24619 |

**Maximum socket expansion:** 12 total sockets (4 active + 4 passive + 4 pouch) (Line 32775)

### 3.2 Catalyst Drop Rates (Fusion Orbs)
**From high-health enemies:**
- **50% chance** from enemies with maxHealth >= 20 (Line 23581-23583)
- Non-boss only

**From dice rolls:**
- **Roll 5**: 10% chance (Line 24633-24634) OR 20% on multiplier >= 4 (Line 24624-24625)
- **Roll 6 (consecutive sixes)**: 100% guaranteed 1 catalyst (Line 24596-24597)

**Maximum catalysts on floor:** 10 (Line 10139 - MAX_CATALYSTS_ON_FLOOR)

### 3.3 Catalyst Requirements
- **1 catalyst required** to fuse two elements (Line 45409-45411)
- Catalyst consumed on fusion
- Only one fusion active at a time

---

## 4. LEVEL PROGRESSION SPEED

### 4.1 XP Requirements per Level
**Initial Setup (Line 10178-10179):**
- Start: 50 XP to next level
- 0/50

**XP Scaling Multipliers by Level Range:**

| Level Range | Multiplier | Formula |
|------------|-----------|---------|
| 1-3 | 25% increase | `xpToNextLevel * 1.25` |
| 4-7 | 35% increase | `xpToNextLevel * 1.35` |
| 8-12 | 45% increase | `xpToNextLevel * 1.45` |
| 13-20 | 50% increase | `xpToNextLevel * 1.50` |
| 21+ | 60% increase | `xpToNextLevel * 1.60` |

### 4.2 Actual XP Thresholds (Calculated)
```
Level 1: 50 XP (starting)
Level 2: 50 * 1.25 = 62.5 → 62 XP
Level 3: 62 * 1.25 = 77.5 → 77 XP
Level 4: 77 * 1.25 = 96.25 → 96 XP
Level 5: 96 * 1.35 = 129.6 → 129 XP
Level 6: 129 * 1.35 = 174.15 → 174 XP
Level 7: 174 * 1.35 = 234.9 → 234 XP
Level 8: 234 * 1.35 = 315.9 → 315 XP
Level 9: 315 * 1.45 = 456.75 → 456 XP
Level 10: 456 * 1.45 = 661.2 → 661 XP
Level 15: Cumulative: ~5,000+ XP
Level 20: Cumulative: ~20,000+ XP
```

### 4.3 XP Sources
**Base XP by Enemy Type (Line 24732-24739):**
- Slime/Tree/Bat/Mushroom: 2 XP
- Redpanda: 3 XP
- Higher-tier enemies: more XP
- Wave bonus: `Math.floor(currentWave / 2)` additional XP
- Difficulty multiplier: Applied to final value

**Jewel Values:**
- Scale determines size and visual representation
- XP scales with enemy difficulty and wave number

---

## 5. FUSION ELEMENT TIER PROGRESSION

### 5.1 Tier System
**Maximum Tier:** 5 (Line 32978, 44114-44115)

**Tier Upgrade Mechanics:**
- Getting a **duplicate** of an element you already have upgrades its tier
- Tier 1 → Tier 2 requires: 1 duplicate
- Tier 2 → Tier 3 requires: 1 duplicate
- Tier 3 → Tier 4 requires: 1 duplicate
- Tier 4 → Tier 5 requires: 1 duplicate

**Total duplicates for Tier 5:** 4 duplicates (getting the same element 5 times total)

### 5.2 Tier Sources
**Tier upgrades only work for:**
- Active slots (first 4 sockets) - Direct tier upgrade
- Passive slots (next 4 sockets) - Direct tier upgrade
- Element Pouch (last 4 slots) - Can be stored with tier level

**Tier data storage:** `elementTiers.set('${element}_${slotIndex}', tierLevel)` (Line 32979)

### 5.3 Tier Limits
- Each slot can only hold 1 element tier
- Fusions create NEW elements in NEW slots (can't tier up fusions in place)
- Passive elements (chess pieces) also have tiers but don't tier up via duplicates

---

## 6. PROBABILITY OF "CRYSTAL + KNIGHT + KING + TIER 5" BUILD

### 6.1 Component Requirements
1. **Crystal Element** - Primary active element, Tier 5
2. **Knight Chess Piece** - Passive slot, halves cooldown
3. **King Chess Piece** - Passive slot, damage boost
4. **Element Tier 5** - Requires 4 duplicates of Crystal

### 6.2 Probability Calculation

**Step 1: Get first Crystal**
- From chest reward: 70% × (1/20) = **3.5%** per level-up
- From elite chest loot: **3.5%**
- **Combined early game:** ~3.5% per active element source

**Step 2: Get Knight (4.29%)**
- From chest reward: 30% × (1/7) = **4.29%** per level-up chest

**Step 3: Get King (4.29%)**
- From chest reward: 30% × (1/7) = **4.29%** per level-up chest

**Step 4: Get 4 more Crystals for Tier 5**
- Need 4 duplicates: **3.5% × 4** = 14% chance each level
- Must get all 4 before level progression takes them away

### 6.3 Overall Probability Estimate

**Simplified scenario (no catalyst requirement):**
```
P(Crystal) = 3.5%
P(Knight in next 5 chest rewards) = 1 - (0.9571^5) ≈ 21% per sequence
P(King in next 5 chest rewards) = 1 - (0.9571^5) ≈ 21% per sequence
P(4x Crystal duplicates) = (3.5%)^4 = 0.0000015 = 0.00015% (extremely rare)

Combined probability = 3.5% × 21% × 21% × 0.00015%
                     ≈ 0.0000000230% or 1 in 4,347,826 attempts
```

**More realistic scenario (using catalyst + fusions):**
If fusing other elements to create Crystal Tier 5:
- Catalyst availability increases
- Fusion elements may provide better tier-up paths
- Still extremely low probability without specific farming

---

## 7. ENEMY DROP RATES (DISABLED)

**Current Status:** DISABLED (Line 24709-24715)

Original mechanics (commented out):
```javascript
// Elements now obtained through level ups only
// NOT from enemy drops anymore
```

**Why disabled:**
- Better game balance
- Forces level-up dependency
- Prevents RNG snowballing

---

## 8. BOSS/ELITE SPECIFIC DROPS

### 8.1 Elite Enemy Drops
**Guaranteed:** Reward chest (Line 23762)
- Drops on death (except golems Line 23761)
- **NOT guaranteed to contain chess pieces** (only 30% chance)

**XP Drops:** 3-5 jewels worth 2-4 XP each
**Coins:** 2 coins worth 3+ essence each

### 8.2 Boss Drops
**Special handling (Line 23588-23589):**
- Boss death triggers `handleBossDeath()`
- Boss-specific loot (not detailed in provided excerpt)
- Separate from regular chest system

### 8.3 Cacodemon Special Chest (Line 43410-43424)
Special enemy that spawns reward chest:
- **70%** → Random primary element
- **30%** → Random chess piece
- Treated as special collectible event, not regular enemy drop

---

## 9. KEY INSIGHTS FOR BUILD PROBABILITY

### 9.1 Bottleneck: Catalyst Acquisition
- **Catalyst drop rate:** 50% from high-health enemies OR 5-10% from dice rolls
- **Without catalyst:** Cannot tier up elements to max potential
- **With catalyst:** Can fuse elements for more control

### 9.2 Bottleneck: Chess Piece Acquisition
- **4.29% per chess piece type**
- **Multiple copies needed** for different passive slots (2-4 copies of each)
- **Requires many level-ups** to accumulate enough pieces

### 9.3 Bottleneck: Tier 5 Progression
- **Requires 4 exact duplicates** of one element
- **No control** over which element you get next (RNG)
- **Extremely low probability** without intentional farming/resets

### 9.4 Optimal Path to Powerful Build
1. **Level up to unlock passive slots** (4+ levels for 2 passive slots)
2. **Accumulate catalysts** (50% from high-health enemies)
3. **Fusion strategy** - Fuse common elements to create desired primary element
4. **Chess pieces** - Collect different pieces for modifier stacking
5. **Tier progression** - Patiently duplicate one element for Tier 5
6. **Level 15+** - Build really comes online, difficulty curves up significantly

### 9.5 Build Power Scaling
- **Tier 1 element:** Base damage
- **Tier 5 element:** ~150% base damage (30% scaling per tier)
- **Chess modifiers:** +damage%, +fire rate, multi-hit, etc.
- **Combined:** Tier 5 + King + Knight + optimal primary ≈ 3-5x damage multiplier

---

## 10. ACTUAL CODE PERCENTAGES SUMMARY

| Mechanic | Percentage | Code Line |
|----------|-----------|-----------|
| Chest: Element | 70% | 43412 |
| Chest: Chess Piece | 30% | 43420 |
| Each chess piece | 4.29% | 43421 |
| Mind Orb: Legendary | 15% | 24697 |
| Mind Orb: Epic | 10% | 24706 |
| Mind Orb: Roll 5 | 5% | 24618 |
| Catalyst: High HP enemy | 50% | 23582 |
| Catalyst: Roll 5 | 10% | 24634 |
| Catalyst: Roll 5 (high mult) | 20% | 24624 |
| Elite chest guaranteed | 100% | 23762 |
| Passive upgrade weight | Varies | 25055 |

---

## 11. CONCLUSION

Building "Crystal + Knight + King + Tier 5" in WizBiz:
- **NOT achievable through luck alone** in reasonable time
- **Requires:** Strategic catalyst farming + fusion optimization
- **Realistic timeline:** 30+ minutes of sustained play
- **Probability multiplier:** 0.00015% for pure RNG
- **With optimization:** Much higher but still challenging
- **Key limiting factors:** Catalyst scarcity, chess piece rarity, duplicate RNG

The game is designed to make SOME good builds common (Tier 2-3 with one passive) but truly powerful builds (full modifiers + Tier 5) require both luck AND strategy.
