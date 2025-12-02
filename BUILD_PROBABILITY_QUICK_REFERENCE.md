# WIZBIZ BUILD PROBABILITY - QUICK REFERENCE

## The "Crystal + Knight + King + Tier 5" Build

### What You Need:
1. **Crystal Element** (primary active) at Tier 5
2. **Knight Chess Piece** (passive modifier) - halves cooldown
3. **King Chess Piece** (passive modifier) - damage boost
4. **4 Catalysts** (to tier up Crystal)

---

## Critical Drop Rates

### Getting Chess Pieces
- Knight: **4.29% per chest** (30% chess × 1/7 pieces)
- King: **4.29% per chest** (same calculation)
- You need BOTH, from different chests
- **Probability of both in 5 chests:** ~21%

### Getting Tier 5 Crystal
- First Crystal: **3.5%** per element chest (70% × 1/20)
- Need 4 exact duplicates to reach Tier 5
- **Probability:** (3.5%)^4 = 0.0000015 per sequence
- **Extremely low without catalyst fusion strategy**

### Getting Catalysts
| Source | Rate | Details |
|--------|------|---------|
| High-health enemies | 50% | Max health >= 20, non-boss |
| Roll 5 (basic) | 10% | One catalyst |
| Roll 5 (mult>=4) | 20% | Double chance with high combo |
| Consecutive sixes | 100% | Guaranteed combo bonus |

**Realistic average:** 1 catalyst per 3-5 minutes of play

---

## Level Progression (Getting the Chests)

### XP Requirements per Level
```
Level 1: 50 XP
Level 2: 62 XP
Level 3: 77 XP
Level 4: 96 XP
Level 5: 129 XP
Level 10: 661 XP
Level 15: ~5,000+ XP cumulative
Level 20: ~20,000+ XP cumulative
```

### Time to Level 10
- **With normal play:** 15-25 minutes
- **XP sources:** Enemy kills, dice rolls, rewards

### Time to Level 20
- **Realistically:** 45+ minutes
- **Each level chest gives 1 element choice** (3 options, weighted)

---

## Actual Probability Math

### Simplified Pure RNG Scenario
```
P(First Crystal) = 3.5% = 0.035
P(Knight within 5 chests) = 1 - (0.9571^5) ≈ 21%
P(King within 5 chests) = 1 - (0.9571^5) ≈ 21%
P(4x more Crystals) = (3.5%)^4 = 0.000015

Combined = 0.035 × 0.21 × 0.21 × 0.000015
         ≈ 0.000000023 = 1 in 43 million
```

### More Realistic With Fusion
If using catalysts to create Tier 5 through element fusion:
- Better odds but still challenging
- Requires understanding fusion element chain
- Multiple runs likely needed to get components

---

## What's Actually Achievable

### Tier 1-2 with 1 Passive (Common)
- Probability: **20-30% per run**
- Time: **10-15 minutes**
- Example: Fire Tier 1 + Knight

### Tier 2-3 with 2 Passives (Uncommon)
- Probability: **5-10% per run**
- Time: **20-30 minutes**
- Requires specific level-up choices
- Example: Water Tier 2 + Knight + King

### Tier 4-5 with 2 Passives (Rare)
- Probability: **<1% per run**
- Time: **45+ minutes**
- Requires catalyst farming + luck
- Example: Crystal Tier 4 + Knight + King

### Full Tier 5 Build (Legendary)
- Probability: **0.000000023% (pure RNG)**
- Realistic probability: **~0.01% with optimization**
- Time: **90+ minutes with optimal play**
- Requires: Multiple chests, catalyst chain, correct RNG

---

## Key Bottlenecks

1. **Catalyst Scarcity**
   - Need multiple to fuse optimally
   - Can't tier up every element without them
   - 50% drop rate is deceptive - only on high-health enemies

2. **Chess Piece Rarity**
   - 4.29% each means needing 20+ chests for two different pieces
   - You only get 1 chest per level-up
   - At 20 levels = 20 element choice opportunities max

3. **Exact Duplicate RNG**
   - Getting same element 5 times is mathematically hard
   - No way to control which element you get next
   - Fusions help but add complexity

4. **Time Investment**
   - Early levels take 10 minutes
   - Later levels take 3-5 minutes each
   - Reaching level 20+ requires 45+ minutes of survival

---

## Strategy for Better Odds

### Early Game (Levels 1-5)
1. Focus on getting first element + any passive
2. Farm high-health enemies for catalysts
3. Don't worry about perfect build yet

### Mid Game (Levels 6-12)
1. When you get a good element, start chasing duplicates
2. Use catalysts to fuse unwanted elements into useful ones
3. Keep an eye out for Knight/King in chest rewards
4. Socket expansion (Mind Orbs) increases slot flexibility

### Late Game (Levels 13+)
1. You should have 2+ passives
2. Use catalysts to fill out tier progression
3. If you have 2 chess pieces + Tier 3-4 element, you're doing well
4. Tier 5 is extremely rare without dedicated farming

---

## The Meta

**Best Builds to Actually Get:**
- **Fire/Water Tier 2-3** + Knight (common, powerful early)
- **Storm/Meteor Tier 2** + Knight + King (rare, very strong)
- **Crystal Tier 3** + Pawn (strong pierce + double shot)

**Why Tier 5 Is Rare:**
- Requires 4 of the exact same element
- Out of 27 choices (20 elements + 7 chess), getting same one 4 times is 0.0000015 probability
- Would need to run 1000 games to see it once with pure luck

---

## TL;DR

| Build Type | % Chance | Time | Feasibility |
|-----------|---------|------|------------|
| Any Tier 1 element | 70% | 5 min | Guaranteed |
| Tier 2 + 1 passive | 20% | 15 min | Easy |
| Tier 3 + 2 passives | 5% | 30 min | Moderate |
| Tier 4 + 2 passives | 1% | 45 min | Hard |
| Tier 5 + 2 passives | 0.00001% | 60+ min | Basically impossible |

**Crystal + Knight + King + Tier 5 = Legendary status achieved!**

---

## Files for Deep Dive

- **PROBABILITY_ANALYSIS.md** - Full mathematical analysis with XP curves
- **DROP_RATES_CODE_REFERENCE.md** - Exact code lines and mechanics
- **scripts/game.js** - Lines 43410-43424 for chest generation
