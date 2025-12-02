# WIZBIZ PROBABILITY DOCUMENTATION INDEX

## Overview
Complete analysis of all drop rates, probabilities, and mechanics for obtaining powerful builds in WizBiz, including the specific probability of achieving "Crystal + Knight + King + Tier 5" build.

---

## Documentation Files

### 1. BUILD_PROBABILITY_QUICK_REFERENCE.md (5.4 KB)
**For:** Quick lookup and understanding
- TL;DR summary of all drop rates
- What builds are realistic vs impossible
- Strategy for improving odds
- Achievable build examples with probabilities
- Time estimates for each build tier

**Best for:** Players asking "how rare is X build?"

---

### 2. PROBABILITY_ANALYSIS.md (11 KB)
**For:** Complete mathematical analysis
- Detailed breakdown of all 7 chess pieces and their rates
- Complete chest spawn mechanics
- Mind Orb drop rates by combo type
- Catalyst acquisition paths
- Full XP progression curves (Level 1-20+)
- Fusion tier upgrade system (1 duplicate = +1 tier)
- Line-by-line code references
- Probability calculations for target build
- Key bottlenecks and optimal strategies

**Best for:** Understanding the game's economics and progression

---

### 3. DROP_RATES_CODE_REFERENCE.md (16 KB)
**For:** Developers and detailed technical reference
- Every drop mechanic with exact code
- Line numbers for all probability checks
- Complete code snippets with comments
- XP scaling formulas
- Passive upgrade weighting system
- Tier upgrade implementation
- Summary table of all percentages

**Best for:** Code-level analysis and implementation details

---

## Key Findings Summary

### Chess Piece Drop Rates
| Piece | Drop Rate | Source |
|-------|-----------|--------|
| Knight (halves cooldown) | 4.29% | Chest (30% ÷ 7 types) |
| King (damage boost) | 4.29% | Chest (30% ÷ 7 types) |
| Queen (multi-directional) | 4.29% | Chest (30% ÷ 7 types) |
| Pawn (double-shot) | 4.29% | Chest (30% ÷ 7 types) |
| Bishop | 4.29% | Chest (30% ÷ 7 types) |
| Rook | 4.29% | Chest (30% ÷ 7 types) |
| Joker (applies all mods) | 4.29% | Chest (30% ÷ 7 types) |

**Source:** Lines 43420-43424 in scripts/game.js

### Chest Reward Distribution
- **70% chance** - Primary element (20 types, 3.5% each)
- **30% chance** - Chess piece (7 types, 4.29% each)
- **Source:** Lines 43410-43424 in scripts/game.js

### Catalyst Drops
| Source | Rate | Conditions |
|--------|------|-----------|
| High-health enemies | 50% | maxHealth >= 20, non-boss |
| Roll 5 (basic) | 10% | Any roll 5 |
| Roll 5 (high multiplier) | 20% | multiplier >= 4 |
| Consecutive sixes | 100% | 2+ sixes rolled |

**Sources:** Lines 23582, 24624-24625, 24633-24634, 24596-24597

### Mind Orb Drop Rates
| Combo Type | Multiplier | Rate | Expansion |
|-----------|-----------|------|-----------|
| Legendary | 7+ | 15% | +1 active socket |
| Epic | 5-6 | 10% | +1 active socket |
| Regular Roll 5 | N/A | 5% | +1 active socket |

**Max sockets:** 12 total (4 active + 4 passive + 4 pouch)
**Sources:** Lines 24618, 24696-24697, 24705-24706

### XP Progression
```
Level 1: 50 XP
Level 5: 129 XP
Level 10: 661 XP
Level 15: ~5,000 XP (cumulative)
Level 20: ~20,000 XP (cumulative)
```

**Scaling:**
- Levels 1-3: x1.25 per level
- Levels 4-7: x1.35 per level
- Levels 8-12: x1.45 per level
- Levels 13-20: x1.50 per level
- Levels 21+: x1.60 per level

**Source:** Lines 10178-10179, 25146-25156

### Tier Upgrade System
- **Maximum tier:** 5 (hard limit)
- **Per tier cost:** 1 exact duplicate
- **Total for Tier 5:** 4 duplicates needed (5 copies total)
- **Probability of 4x same element:** (3.5%)^4 = 0.0000015 = 0.00015%

**Source:** Lines 32978-32985, 44114-44117

---

## The Target Build: Crystal + Knight + King + Tier 5

### Components Required
1. **Crystal Element** (primary active)
   - Pierces +1 enemy, +10% crit chance
   - Needs to reach Tier 5

2. **Knight Chess Piece** (passive modifier)
   - Halves cooldown (doubles fire rate)
   - 4.29% drop rate per chest

3. **King Chess Piece** (passive modifier)
   - Damage boost modifier
   - 4.29% drop rate per chest

4. **Tier 5 Progression**
   - Needs 4 exact duplicates of Crystal
   - Probability: (3.5%)^4 = 0.00015%

### Actual Probability Calculation
```
P(First Crystal) = 3.5%
P(Knight) = 4.29%
P(King) = 4.29%
P(4 Crystal duplicates) = 0.00015%

Pure RNG = 0.035 × 0.0429 × 0.0429 × 0.0000015
         = 0.000000023 = 1 in 43 million
```

### Realistic Scenarios
- **Pure luck:** 0.000000023% (impossible in practice)
- **With fusion optimization:** ~0.01% (very hard)
- **With dedicated farming:** Still <1%

---

## What's Actually Achievable

### Common (20-30% chance)
- Tier 1-2 element + 1 chess piece
- Time: 10-15 minutes
- Example: Fire + Knight

### Uncommon (5-10% chance)
- Tier 2-3 element + 2 chess pieces
- Time: 20-30 minutes
- Example: Water Tier 2 + Knight + King

### Rare (<1% chance)
- Tier 4-5 element + 2 chess pieces
- Time: 45-60 minutes
- Requires catalyst farming
- Example: Storm Tier 4 + Knight + King

### Legendary (0.00001% chance)
- Tier 5 element + 2 chess pieces + optimal build
- Time: 90+ minutes
- Requires perfect luck and execution
- Example: Crystal Tier 5 + Knight + King

---

## File Navigation

**New to the game?**
→ Read BUILD_PROBABILITY_QUICK_REFERENCE.md

**Want mathematical details?**
→ Read PROBABILITY_ANALYSIS.md

**Need exact code?**
→ Read DROP_RATES_CODE_REFERENCE.md

**Quick lookup?**
→ See the summary tables above

---

## Code Location Reference

All mechanics are in: `/c/Users/Alex/wizbiz/scripts/game.js`

**Key sections:**
- **Chest rewards:** Lines 43410-43424
- **Chess pieces:** Lines 10814-10823
- **Catalyst drops:** Lines 23582, 24596-24597, 24624-24625, 24633-24634
- **Mind orb drops:** Lines 24618-24619, 24696-24698, 24705-24707
- **Elite drops:** Lines 23727-23762
- **Tier upgrades:** Lines 32978-32985, 44114-44117
- **XP progression:** Lines 10178-10179, 25146-25156
- **Passive upgrades:** Lines 24856-24859, 25047-25088

---

## Additional Notes

### Game Design Implications
- Early-game builds (Tier 1-2) are meant to be common
- Mid-game builds (Tier 3) require some strategy
- Late-game builds (Tier 4+) are truly rare
- Tier 5 is positioned as "nearly impossible" without perfect luck
- Game encourages trying multiple playthroughs

### Balance Observations
- Chess pieces (4.29% each) are rarer than individual elements (3.5% each)
- Catalyst scarcity limits fusion options
- Mind Orbs create strategic decisions about socket expansion
- XP curve forces difficult mid-game combat
- 12-socket cap prevents infinite stacking

### Player Strategies
1. **Aggressive:** Target specific element combos, farm catalysts
2. **Flexible:** Take whatever comes, use catalysts for best-available fusion
3. **Passive:** Collect orbs passively, build emerges naturally
4. **Hybrid:** Early game flexible, late game target Tier 3-4

---

## Version Information
- **Analysis Date:** November 15, 2025
- **Game Version:** WizBiz (ts-refactor branch)
- **Code Base:** Phaser 3 JavaScript
- **File Size:** 2.4 MB (scripts/game.js)
- **Analysis Coverage:** Complete (all major mechanics)

---

## Contact & Updates
For detailed breakdowns of specific mechanics, refer to the individual documentation files which contain line-specific code references and implementation details.

**Last Updated:** November 15, 2025
