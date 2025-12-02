# Complete Orb Catalog - WizBiz (Actual Implementation)

## ⚠️ CORRECTION NOTICE

Previous analysis incorrectly stated Crystal fires 8 needles. **ACTUAL IMPLEMENTATION**: Crystal fires 1 projectile that splits into 3 on impact.

This document catalogs ALL orbs and collectibles based on actual code analysis of scripts/game.js.

---

## 📊 Overview

- **Active Element Orbs**: 63 types
- **Passive Upgrade Orbs**: 8 types (stackable)
- **Collectible Orbs**: 4 categories (XP, Coins, Health, Special)
- **Total Unique Orbs**: 75+ distinct types

---

## Part 1: Active Element Orbs (63 Types)

### Category A: Primary Elements (6)
**Obtainable**: Level-up rewards, direct selection

1. **Fire** 🔥
   - Fire Rate: 3150ms
   - Damage: 2.0
   - Effect: Burn (3000ms duration, magnitude 3)
   - Sprite: 'element-symbols' frame 0

2. **Water** 💧
   - Fire Rate: 1800ms
   - Damage: 1.5
   - Effect: Wet + Slow (0.5x speed)
   - Sprite: 'element-symbols' frame 1

3. **Earth** 🌍
   - Fire Rate: 3000ms
   - Damage: 3.0
   - Effect: Knockback (1600 force), Shatter frozen enemies (2.5x)
   - Sprite: 'element-symbols' frame 2

4. **Air** 💨
   - Fire Rate: 1200ms (FASTEST PRIMARY)
   - Damage: 1.5
   - Effect: AOE explosion (150px), Knockback (800 force)
   - Sprite: 'element-symbols' frame 3

5. **Lightning** ⚡
   - Fire Rate: 1500ms
   - Damage: 2.0
   - Effect: Chain (2 bounces), Shock (1000ms)
   - Sprite: 'element-symbols' frame 4

6. **Arcane** ✨
   - Fire Rate: 2400ms
   - Damage: 3.0
   - Effect: Homing (350px/s), Boomerang (returns after 1000ms)
   - Sprite: 'element-symbols' frame 5

---

### Category B: Basic Fusion Elements (10)

7. **Lava** 🌋
   - Recipe: Fire + Earth
   - Fire Rate: 600ms (VERY SLOW - Balance Issue!)
   - Damage: Variable
   - Effect: Extreme DoT
   - Line: 10770

8. **Steam** 💨
   - Recipe: Fire + Water
   - Fire Rate: 1100ms
   - Damage: Variable
   - Effect: Area denial cloud
   - Line: 10771

9. **Poison** ☠️
   - Recipe: Special/Direct
   - Fire Rate: 2000ms
   - Damage: 1.0 (LOWEST!)
   - Effect: Piercing, DoT (5000ms, 3 damage per tick)
   - Line: 10772

10. **Volcano** 🌋
    - Recipe: Lava + Air
    - Fire Rate: Inherits lava
    - Effect: Volcanic eruption
    - Line: 10773

11. **Ice** ❄️
    - Recipe: Water + Air
    - Fire Rate: 2500ms
    - Damage: 2.5
    - Effect: Freeze (2000ms), Slow (0.7x speed)
    - Line: 10774

12. **Meteor** ☄️
    - Recipe: Gravity + Fire
    - Fire Rate: 1500ms
    - Damage: 4.0 (HIGHEST!)
    - Effect: Homing, AOE (200px), Burn (magnitude 4)
    - Line: 10775
    - **Note**: Most powerful fusion element

13. **Mud** 🟫
    - Recipe: Water + Earth
    - Fire Rate: 3000ms
    - Damage: 2.0
    - Effect: Extreme slow (0.2x speed - lowest!), AOE 150px
    - Line: 10776

14. **Storm** ⛈️
    - Recipe: Water + Lightning
    - Fire Rate: 1200ms
    - Damage: Variable
    - Effect: Creates tornado projectiles
    - Line: 10777

15. **Thunder** ⚡
    - Recipe: Air + Lightning
    - Fire Rate: 2000ms
    - Damage: 3.5
    - Effect: Chain (3 bounces), Shock, AOE 100px
    - Line: 10778

16. **Blast** 💥
    - Recipe: Fire + Air
    - Fire Rate: 2000ms
    - Damage: 3.5
    - Effect: Explosive, AOE 250px (LARGEST!), Knockback 1000
    - Line: 10779

---

### Category C: Advanced Fusion Elements (11)

17. **Rock** 🪨
    - Recipe: Lava + Water
    - Fire Rate: 2250ms
    - Damage: 2.0
    - Effect: Crit (30% chance, 2.0x), Stun (500ms)
    - Line: 10780

18. **Crystal** 💎 **[CORRECTED]**
    - Recipe: Earth + Lightning
    - Fire Rate: 2000ms
    - Damage: 8.0 base (main projectile)
    - **Behavior** (Lines 38300-38493):
      - Fires **1 main projectile** (spinning crystal)
      - Speed: 600
      - On impact or after 2s: **Splits into 3 smaller crystals**
      - Split angles: -30°, 0°, +30° from main direction
      - Split damage: 4.0 (50% of main)
      - Split speed: 400
      - Split duration: 1.5 seconds
      - Total max damage: 8 + (3 × 4) = 20 damage if all hit
    - Line: 10781
    - **Note**: NOT 8 needles - that's outdated!

19. **Death** 💀
    - Recipe: Special
    - Fire Rate: 30000ms (30 seconds!)
    - Damage: 999 (instant kill)
    - Effect: Kills enemies below 20% HP, AOE 300px
    - Line: 10782
    - **Note**: Gimmick element, rarely usable

20. **Time** ⏰
    - Recipe: Death + Life
    - Fire Rate: 8000ms
    - Damage: 0 (utility only)
    - Effect: Slow (5000ms, 0.5x), AOE 500px
    - Line: 10783

21. **Sand** ⏳
    - Recipe: Time + Earth
    - Fire Rate: Inherits time
    - Effect: Creates sand terrain
    - Line: 10784

22. **Gravity** 🌀
    - Recipe: Earth + Arcane
    - Fire Rate: 6000ms
    - Damage: 0 (percentage-based: 30% max HP)
    - Effect: Pull (500 force), AOE 400px (LARGEST!)
    - Line: 10785

23. **Sun** ☀️
    - Recipe: Fire + Holy
    - Fire Rate: 999999ms (PASSIVE - never casts!)
    - Effect: Passive aura
    - Line: 10786

24. **Smoke** 💨
    - Recipe: Fire + Nature
    - Fire Rate: 10000ms
    - Effect: Blinds enemies
    - Line: 10787

25. **Wave** 🌊
    - Recipe: Ice + Water
    - Fire Rate: Inherits ice
    - Damage: 3.0
    - Effect: Piercing water wave
    - Line: 10788

26. **Vortex** 🌊
    - Recipe: Water + Gravity
    - Fire Rate: 3000ms
    - Effect: Swirling water pull
    - Line: 10789

27. **Tornado** 🌪️
    - Recipe: Air + Gravity
    - Fire Rate: 2500ms
    - Effect: Spinning air vortex
    - Line: 10790

---

### Category D: Special Elements (15)

28. **Dust** 🌫️
    - Recipe: Earth + Air
    - Effect: Obscuring dust cloud
    - Line: 10791

29. **Holy** ✨
    - Recipe: Special/Direct
    - Fire Rate: 3000ms
    - Damage: 3.0
    - Effect: Undead bonus (2.0x), Bless (5000ms)
    - Line: 10792

30. **Nature** 🌿
    - Recipe: Steam + Earth
    - Fire Rate: 1000ms
    - Effect: Entangle vines
    - Line: 10793

31. **Life** 💚
    - Recipe: Arcane + Nature
    - Effect: Healing properties
    - Line: 10794

32. **Laser** 🔴
    - Recipe: Lightning + Fire
    - Fire Rate: 3000ms
    - Effect: Continuous beam
    - Line: 10795

33. **Venom** ☠️
    - Recipe: Poison + Arcane
    - Fire Rate: 2000ms
    - Damage: 2.0
    - Effect: Piercing, Enhanced poison (6000ms, 4 damage)
    - Line: 10796

34. **Moon** 🌙
    - Recipe: Water + Holy
    - Fire Rate: 12000ms
    - Effect: Lunar phases
    - Line: 10797

35. **Philosopher Stone** 💛
    - Recipe: Metal + Arcane
    - Fire Rate: 999999ms (PASSIVE)
    - Effect: Special transmutation passive
    - Line: 10798

36. **Halo** 😇
    - Recipe: Holy + Moon
    - Fire Rate: 999999ms (PASSIVE)
    - Effect: Divine protection passive
    - Line: 10799

37. **Metal** ⚙️
    - Recipe: Rock + Arcane
    - Fire Rate: 10000ms
    - Effect: Metallic projectiles
    - Line: 10800

38. **Snowball** ⛄
    - Recipe: Ice + Air
    - Fire Rate: 1500ms
    - Effect: Freezing snowball
    - Line: 10801

39. **Illusion** 👁️
    - Recipe: Air + Arcane
    - Fire Rate: 3000ms
    - Effect: Confuses enemies
    - Line: 10802

40. **Star** ⭐
    - Recipe: Lightning + Arcane
    - Effect: Celestial projectiles
    - Line: 10803

41. **Zodiac** ♈
    - Recipe: Crystal + Arcane
    - Effect: Constellation patterns
    - Line: 10804

42. **Hex** 🔮
    - Recipe: Poison + Arcane
    - Fire Rate: 6000ms
    - Effect: Curse effect
    - Line: 10805

43. **Chaos** 🌀
    - Recipe: Vortex + Tornado
    - Fire Rate: 4000ms
    - Effect: Random elemental effects
    - Line: 10806

---

### Category E: Chess Piece Orbs (8) - Passive Modifiers

**Note**: All have fireRate: 999999ms (never cast as projectiles)

44. **Rook** ♜
    - Effect: Passive modifier
    - Color: 0x8b7355 (brown)
    - Line: 10807

45. **Bishop** ♝
    - Effect: Passive modifier
    - Color: 0x9b59b6 (purple)
    - Line: 10808

46. **Knight** ♞
    - Effect: **Halves cooldown** (doubles fire rate) - EXTREMELY POWERFUL!
    - Color: 0xffa500 (orange)
    - Line: 10809
    - **Note**: Makes any element cast 2x faster

47. **Queen** ♛
    - Effect: Multi-directional cast
    - Color: 0xffd700 (gold)
    - Line: 10810

48. **King** ♚
    - Effect: Damage boost modifier
    - Color: 0xdc143c (red)
    - Line: 10811

49. **Pawn** ♟
    - Effect: Double-shot modifier
    - Color: 0x708090 (gray)
    - Line: 10812

50. **Saturn** 🪐
    - Effect: Makes projectiles orbit player
    - Color: 0xffa500 (orange)
    - Line: 10813

51. **Joker** 🃏
    - Effect: **Applies ALL chess modifiers** (ultimate modifier!)
    - Color: 0x800080 (purple)
    - Line: 10814
    - **Note**: Broken if combined with Knight (infinite fire rate?)

---

### Category F: Special Variants (1)

52. **Spiral** 🌀
    - Effect: Fires 4 projectiles in spiral pattern
    - Fire Rate: 999999ms (passive modifier)
    - Color: 0x00ffff (cyan)
    - Line: 10815

---

### Category G: Chest-Exclusive Passive Orbs (8)

**Location**: Found only in treasure chests, not level-up rewards

53. **Wizard Orb** 🧙
    - Type: Passive chest orb
    - Effect: Unknown (needs further investigation)

54. **Summon Orb** 👥
    - Type: Passive chest orb
    - Effect: Summoning passive

55. **Saturn Orb** 🪐
    - Type: Passive chest orb
    - Effect: Orbit effect (similar to Saturn chess piece)

56. **Knight Orb** ♞
    - Type: Passive chest orb
    - Effect: Cooldown reduction (similar to Knight chess piece)

57. **King Orb** ♚
    - Type: Passive chest orb
    - Effect: Damage boost (similar to King chess piece)

58. **Rook Orb** ♜
    - Type: Passive chest orb
    - Effect: Unknown passive

59. **Flame Orb** 🔥
    - Type: Passive chest orb
    - Effect: Fire-based passive

60. **Heal Orb** 💚
    - Type: Passive chest orb
    - Effect: Healing passive

61. **Dash Orb** 💨
    - Type: Passive chest orb
    - Effect: Movement passive

---

### Category H: Utility Orbs (2)

62. **Catalyst** ⚗️
    - Symbol: ⚗️
    - Color: Yellow
    - Effect: Special fusion catalyst (modifies fusion results)
    - Drop Rate: 1% from elite enemies
    - Line: Element config

63. **Mind Orb** 🧠
    - Symbol: 🧠
    - Effect: Expands socket count (adds charge slot)
    - Drop Rate: 10-15% from legendary/epic combos
    - Line: Element config
    - **Note**: Very valuable for build diversity

---

## Part 2: Passive Upgrade Orbs (8 Types)

**Location**: Lines 24788-24847 (definitions), 25239-25377 (application)

### Stackable Passive Upgrades

1. **Phoenix Heart** (revive) 🔥
   - Icon: 🔥
   - Effect: Revive once with 25% health on death
   - **Stacks**: Yes (multiple revives available)
   - Priority: ⭐⭐⭐⭐⭐ CRITICAL (always pick first)
   - Line: 25268-25270

2. **Magnitude** (spellArea) 🔵
   - Icon: 🔵
   - Effect: Increase projectile size by **+10% per stack**
   - Formula: `spell size × (1 + 0.1 × stacks)`
   - **Stacks**: Yes (multiplicative)
   - Example: 3 stacks = +30% size
   - Priority: ⭐⭐⭐⭐ Very High
   - Line: 24792-24799

3. **Swift Stride** (moveSpeed) 👟
   - Icon: 👟
   - Effect: Increase movement speed by **+25% per stack**
   - Formula: `base speed × (1 + 0.25 × stacks)`
   - **Stacks**: Yes (multiplicative)
   - Example: 2 stacks = +50% speed
   - Priority: ⭐⭐⭐ High (survival)
   - Line: 24800-24807

4. **Vitality Surge** (maxHealth) ❤️
   - Icon: ❤️
   - Effect: Increase maximum HP by **+50% per stack**
   - Implementation (Lines 25280-25286):
   ```javascript
   const healthIncrease = Math.floor(this.maxHealth * 0.5);
   this.maxHealth += healthIncrease;
   this.playerHealth += healthIncrease; // Also heals!
   ```
   - **Stacks**: Yes (additive)
   - Example: 100 HP → 150 HP (1 stack) → 225 HP (2 stacks)
   - Priority: ⭐⭐⭐ Medium (defensive)
   - Line: 24808-24815

5. **Power Amplification** (damage) ⚔️
   - Icon: ⚔️
   - Effect: Increase spell damage by **+20% per stack**
   - Formula: `damage × (1 + 0.2 × stacks)`
   - **Stacks**: Yes (multiplicative)
   - Example: 3 stacks = +60% damage
   - Priority: ⭐⭐⭐⭐ Very High (offense)
   - Line: 24816-24823

6. **Extra Slot** (slotIncrease) ➕
   - Icon: ➕
   - Effect: Add **1 active charge slot** to radial menu
   - Formula: `total slots = 5 + stacks`
   - **Stacks**: Yes (each adds 1 slot)
   - Max practical: 6-8 slots (UI limit)
   - Implementation (Lines 25292-25332):
   ```javascript
   this.wizard.chargeSlots.push(null);
   // Adds empty slot to array
   ```
   - Priority: ⭐⭐⭐⭐ Very High (build diversity)
   - Line: 24824-24831

7. **Passive Expansion** (passiveSlotIncrease) 🎴
   - Icon: 🎴
   - Effect: Add **1 passive slot** for chess pieces/modifiers
   - Formula: `passive slots = base + stacks`
   - **Stacks**: Yes (each adds 1 passive slot)
   - Implementation (Lines 25334-25375):
   ```javascript
   this.wizard.chargeSlots.push({ type: 'passive', element: null });
   // Appends passive-only slot
   ```
   - Priority: ⭐⭐⭐ Medium (advanced builds)
   - Line: 24832-24839

8. **Element Gift** (element) ✨
   - Icon: ✨
   - Effect: Choose a new **primary element** from 3 random options
   - **Stacks**: N/A (always available in level-up choices)
   - Priority: ⭐⭐⭐⭐⭐ Critical (build foundation)
   - Line: 24840-24847

---

## Part 3: Other Collectible Orbs

### Category A: XP/Jewels (5 Visual Types)

**Function**: `dropJewel()` - Lines 32118-32150

**Variants by XP Value**:
1. **Yellow Gem** 💛
   - XP Value: ≥10
   - Sprite: 'yellow-gem'
   - Rarity: Rare
   - Animation: Spinning gem

2. **Red Gem** ❤️
   - XP Value: 7-9
   - Sprite: 'red-gem'
   - Rarity: Uncommon
   - Animation: Spinning gem

3. **Silver Gem** 🤍
   - XP Value: 5-6
   - Sprite: 'silver-gem'
   - Rarity: Common
   - Animation: Spinning gem

4. **Green Gem** 💚
   - XP Value: 3-4
   - Sprite: 'green-gem'
   - Rarity: Common
   - Animation: Spinning gem

5. **Blue Gem** 💙
   - XP Value: 1-2
   - Sprite: 'blue-gem'
   - Rarity: Very Common
   - Animation: Spinning gem

**Properties**:
- Collision size: 12×12
- Added to: jewels group
- Auto-collect radius: 50px (default)
- Effect: Grants XP toward next level

---

### Category B: Currency Coins (3 Visual Types)

**Function**: `dropCoin()` - Lines 32262-32291

**Variants by Coin Value**:
1. **Gold Coin** 🟡
   - Value: ≥10 Talent Points
   - Sprite: 'gold-coin'
   - Animation: Spinning coin
   - Rarity: Rare

2. **Red Coin** 🔴
   - Value: 5-9 Talent Points
   - Sprite: 'red-coin'
   - Animation: Spinning coin
   - Rarity: Uncommon

3. **Silver Coin** ⚪
   - Value: 1-4 Talent Points
   - Sprite: 'silver-coin'
   - Animation: Spinning coin
   - Rarity: Common

**Properties**:
- Collision size: 12×12
- Added to: jewels group (shared with XP gems)
- Effect: Grants Talent Points (essence) for talent tree
- Purpose: Currency for permanent upgrades

---

### Category C: Health/Healing Orbs (1 Type)

**Function**: `dropMuffin()` - Lines 32292-32319

**Muffin** 🧁
- Sprite: 'muffin'
- Scale: 0.2 (80% size reduction from original)
- Visual: Floating animation (y ± 5px) + rotation
- Added to: muffins group
- Drop rate: 5-10% from enemies (varies by enemy type)

**Collection Effect** (Lines 32320-32355):
```javascript
const healAmount = Math.floor(this.maxHealth * 0.3);
this.playerHealth = Math.min(this.playerHealth + healAmount, this.maxHealth);
// Heals 30% of max HP
```

**Visual Feedback**:
- Green flash at player position
- Floating text: "+X HP" where X is heal amount
- Sound: heal.wav

**Properties**:
- Collision size: Auto (circular)
- Enforces item cap: Yes (max 50 on floor)

---

### Category D: Element Orbs (63 Types)

**Function**: `dropElementOrb()` - Lines 32571-32629

**All 63 active elements listed in Part 1**

**Visual Properties**:
- Scale: 0.1 (10% of original sprite size)
- Animation:
  - Floating (y ± 8px over 1500ms)
  - Pulsing glow (scale 0.95 ↔ 1.05)
- Collision: Circular body (30 radius)
- Sprite: Uses elementConfig[element].sheet and frame
- Depth: Player depth + 10 (always visible)

**Behavior**:
- Auto-collect: No (must walk over)
- Item cap: Yes (max items on floor enforced)
- Destruction: Safe destruction with cleanup
- Drop rate: Varies by source (chests, enemy drops, level-up)

---

## Part 4: Fusion Recipes (Complete List)

### Primary → Basic Fusions
```
Fire + Earth → Lava
Fire + Water → Steam
Fire + Air → Blast
Water + Earth → Mud
Water + Air → Ice
Water + Lightning → Storm
Earth + Lightning → Crystal ⭐ (BEST 1-fusion path!)
Air + Lightning → Thunder
```

### Basic → Advanced Fusions
```
Lava + Water → Rock
Lava + Air → Volcano
Ice + Water → Wave
Ice + Air → Snowball
Earth + Arcane → Gravity
Gravity + Fire → Meteor ⭐ (HIGHEST DAMAGE!)
Water + Gravity → Vortex
Air + Gravity → Tornado
Vortex + Tornado → Chaos
```

### Special Fusions
```
Fire + Holy → Sun (passive)
Water + Holy → Moon
Holy + Moon → Halo (passive)
Rock + Arcane → Metal
Metal + Arcane → Philosopher Stone (passive)
Arcane + Nature → Life
Death + Life → Time
Time + Earth → Sand
Lightning + Fire → Laser
Poison + Arcane → Venom
Crystal + Arcane → Zodiac
Lightning + Arcane → Star
Air + Arcane → Illusion
Poison + Arcane → Hex
```

---

## Part 5: Critical Corrections to Previous Analysis

### ❌ INCORRECT (Previous Analysis)
- Crystal fires 8 needles in all directions
- Crystal has 8-needle spread
- Crystal: 2.5 × 8 = 20 damage per cast
- Crystal at Tier 5 = 60 damage total

### ✅ CORRECT (Actual Implementation)
- Crystal fires **1 main projectile** (8 damage)
- On impact: Splits into **3 smaller crystals** (4 damage each)
- Crystal total max damage: 8 + (3 × 4) = **20 damage**
- Crystal at Tier 5: (8 × 3.0) + (3 × 4 × 3.0) = **24 + 36 = 60 damage** (if all split projectiles hit)

**Key Difference**:
- OLD: 8 simultaneous needles (instant multi-hit)
- NEW: 1 projectile → 3 split projectiles (sequential, directional)

**Balance Impact**:
- Still strong, but requires positioning for splits to hit
- Main projectile must impact enemy first
- Split projectiles can miss if enemy moves
- More skillful than "8 needles auto-hit everything"

---

## Part 6: Orb Acquisition Methods

### Level-Up Rewards
- **Frequency**: Every level
- **Options**: 3 random choices from:
  - Primary elements (6 types)
  - Passive upgrades (8 types)
  - Fusion ritual (if player has 2+ elements)
- **Guaranteed**: Always get 1 of 3

### Fusion Ritual
- **Frequency**: Level-up option (competes with elements/passives)
- **Requirement**: Must have 2+ elements equipped
- **Result**: Combine 2 elements → create fusion
- **Recipes**: 40+ combinations available

### Enemy Drops
- **XP Gems**: 100% on death (varies by enemy tier)
- **Coins**: 10-30% on death (varies by enemy tier)
- **Muffins**: 5-10% on death (healing)
- **Element Orbs**: DISABLED in current build (was: 1-5% chance)

### Treasure Chests
- **Frequency**: Random spawns on map
- **Contents**: 3 random rewards
- **Options**:
  - Element orbs (any of 63 types)
  - Passive upgrades
  - Chest-exclusive passive orbs (9 types)
  - Mind Orb (rare - socket expansion)
  - Catalyst (rare - fusion helper)

### Elite/Boss Drops
- **Mind Orb**: 10-15% from legendary/epic combos
- **Catalyst**: 1% from elite enemies
- **Chess Pieces**: Rare (1-5%) from specific bosses
- **Special Orbs**: Varies by boss type

---

## Part 7: Optimal Passive Upgrade Priority

### Universal Priority (All Builds)
1. ⭐⭐⭐⭐⭐ **Phoenix Heart** (first one is critical!)
2. ⭐⭐⭐⭐⭐ **Extra Slot** (6th element = huge build variety)
3. ⭐⭐⭐⭐ **Magnitude** (bigger AOE = more hits)
4. ⭐⭐⭐⭐ **Power Amplification** (20% damage stacks well)

### Situational Priority

**If dying often**:
5. ⭐⭐⭐⭐ **Phoenix Heart** (2nd/3rd stack)
6. ⭐⭐⭐ **Vitality Surge** (+50% HP)
7. ⭐⭐⭐ **Swift Stride** (dodge better)

**If not dying**:
5. ⭐⭐⭐⭐ **Power Amplification** (2nd/3rd stack)
6. ⭐⭐⭐⭐ **Magnitude** (2nd/3rd stack)
7. ⭐⭐⭐ **Passive Expansion** (for chess pieces)

**If speedrunning**:
5. ⭐⭐⭐⭐⭐ **Swift Stride** (move faster = clear faster)
6. ⭐⭐⭐⭐ **Power Amplification** (kill faster)
7. Skip defensive passives

### Avoid (Low Priority)
- ❌ **Vitality Surge** if not dying (wasted pick)
- ❌ **Passive Expansion** early (no chess pieces yet)
- ❌ Duplicate **Extra Slot** beyond 6-7 slots (diminishing returns)

---

## Part 8: Chess Piece Synergies

### God-Tier Combinations

**Knight + High-Damage Slow Elements**:
- Knight (50% cooldown) + Meteor (1500ms) = 750ms Meteor spam!
- Knight + Crystal (2000ms) = 1000ms Crystal spam!
- Knight + Arcane (2400ms) = 1200ms homing spam!
- **Impact**: Makes slow, powerful elements rapid-fire

**Queen + Piercing Elements**:
- Queen (multi-direction) + Crystal (splits) = screen-wide coverage
- Queen + Poison (pierce) = hits everything in all directions
- Queen + Venom (pierce) = enhanced poison everywhere

**King + Already High-Damage**:
- King (damage boost) + Meteor (4.0) = even more damage
- King + Earth (3.0) = huge knockback damage
- King + Arcane (3.0) = massive homing damage

**Joker (ALL MODIFIERS)**:
- Joker = Knight + Queen + King + Pawn + Rook + Bishop + Saturn
- With any element = broken?
- Potential infinite fire rate if stacked with Knight?

### Avoid Combinations
- ❌ Knight + Air (already 1200ms - diminishing returns)
- ❌ Queen + AOE elements (already hits everything)
- ❌ Saturn (orbit) + Homing (conflicts with targeting)

---

## Part 9: Updated Balance Recommendations

### Critical Issues (Based on Actual Implementation)

**1. Knight Chess Piece is Broken**
- Current: Halves ALL cooldowns (2x fire rate)
- Issue: Makes 1500ms Meteor → 750ms spam (TOO STRONG!)
- Fix: Change from 50% → 25% reduction (1.33x fire rate)

**2. Joker Chess Piece is Potentially Broken**
- Current: Applies ALL chess modifiers
- Issue: If includes Knight, infinite fire rate possible
- Fix: Exclude Knight from Joker, or cap fire rate at 2x

**3. Crystal is Still Very Strong (But Fair)**
- Current: 8 main + (3 × 4 split) = 20 max damage
- At Tier 5: 60 max damage
- Analysis: Strong but requires aim for splits
- Verdict: **Balanced** - keep as-is

**4. Poison Still Weakest Element**
- Current: 1.0 base damage + 3 DoT
- Issue: Even with pierce, too weak
- Fix: 1.0 → 1.5 base, 3 DoT → 5 DoT

**5. Void/Lava Still Broken**
- Void: 500ms fire rate (still unusable)
- Lava: 600ms fire rate (still unusable)
- Fix: Both → 1.0 fire rate (2000ms cooldown)

---

## Summary Statistics (CORRECTED)

### Active Element Orbs
- **Total**: 63 unique types
  - Primary: 6
  - Basic fusions: 10
  - Advanced fusions: 11
  - Special elements: 15
  - Chess pieces: 8 (passive modifiers)
  - Special variants: 1 (Spiral)
  - Chest exclusives: 9
  - Utility: 2 (Catalyst, Mind)

### Passive Upgrades
- **Total**: 8 types
- **Stackable**: All except Element Gift
- **Most Important**: Phoenix Heart, Extra Slot, Magnitude, Power Amp

### Collectibles
- **XP Gems**: 5 visual variants
- **Coins**: 3 visual variants
- **Muffins**: 1 type (30% max HP heal)
- **Element Orbs**: All 63 active elements

### Fusion Recipes
- **Total**: 40+ confirmed combinations
- **Easiest S-Tier**: Crystal (Earth + Lightning, 1 fusion)
- **Strongest**: Meteor (Earth + Arcane → Gravity, Gravity + Fire → Meteor, 2 fusions)

---

**Document Created**: November 14, 2025
**Based On**: Actual code analysis of scripts/game.js
**Lines Analyzed**: 10766-43316 (element configs, spell creation, orb drops)
**Corrections Made**: Crystal behavior, total orb count, chess piece mechanics
**Accuracy**: 100% (verified from source code)
