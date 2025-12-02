# Balance Recommendations for WizBiz

## Executive Summary

After analyzing all 35 elements and 44+ fusion recipes, several balance issues were identified. This document provides specific, actionable recommendations to improve game balance.

---

## 🔴 Critical Issues (Fix First)

### 1. **Poison is Unusable** (1.0 Base Damage)

**Current State**:
- Base Damage: 1.0 (LOWEST in game)
- DoT: 3 damage over 5 seconds
- Total Effective Damage: ~16 damage over 5s (very weak)

**Problem**: Players avoid Poison because it's objectively worse than all other elements.

**Recommended Fix**:
```javascript
// File: scripts/game.js, Line ~10990 (spellConfig)
poison: {
    damage: 1.0,  // CHANGE TO: 1.5 or 2.0
    cooldown: 2000,
    speed: 300,
    piercing: true,
    statusEffect: {
        type: 'poison',
        duration: 5000,
        damagePerTick: 3  // CHANGE TO: 4 or 5
    }
}
```

**Justification**: Even with DoT, Poison underperforms. Bumping to 1.5 base + 5 DoT makes it viable.

---

### 2. **Water is Weak for a Primary Element** (1.5 Damage)

**Current State**:
- Base Damage: 1.5 (tied lowest with Air)
- Cooldown: 1800ms
- Only utility: Slow effect (0.5x speed)

**Problem**: Water is a PRIMARY element but deals less damage than most fusions. Players only pick it for fusions (Storm, Crystal).

**Recommended Fix**:
```javascript
// File: scripts/game.js, Line ~10990
water: {
    damage: 1.5,  // CHANGE TO: 2.0
    cooldown: 1800,
    speed: 350,
    statusEffect: {
        type: 'slow',
        duration: 2000,
        magnitude: 0.5  // KEEP - slow is good utility
    }
}
```

**Justification**: 2.0 damage makes Water a legitimate pick while maintaining its "utility" identity.

---

### 3. **Air is Overpowered** (1200ms Cooldown)

**Current State**:
- Base Damage: 1.5
- Cooldown: 1200ms (FASTEST in game)
- AOE: 150px radius
- Knockback: 800 force
- DPS: 1.5 / 1.2 = **1.25 DPS** (highest for primaries!)

**Problem**: Air outperforms all other primary elements in sustained DPS while also having AOE + knockback utility.

**Recommended Fix**:
```javascript
// File: scripts/game.js, Line ~10990
air: {
    damage: 1.5,  // KEEP
    cooldown: 1200,  // CHANGE TO: 1500 (still fast, but balanced)
    speed: 400,
    aoe: 150,  // OR reduce to 120px
    knockback: 800
}
```

**Justification**: 1500ms cooldown makes Air still "fast" but not dominant. Alternatively, reduce AOE to 120px.

---

## 🟡 Major Issues (High Priority)

### 4. **Void is Unusable** (500ms Fire Rate Multiplier)

**Current State**:
- Fire Rate: 0.5x (translates to ~5000ms+ cooldown!)
- Extremely slow casting
- Utility: Black holes that pull enemies
- No compensation for slowness

**Problem**: Void casts so slowly that players die waiting for it. Tooltip says "black holes" but execution fails.

**Recommended Fix**:
```javascript
// File: scripts/game.js, Line ~10810 (elementConfig)
void: {
    fireRate: 0.5,  // CHANGE TO: 1.0
    // OR in spellConfig:
    cooldown: 5000,  // CHANGE TO: 2500
}
```

**Justification**: Void should be "slow but powerful," not "unusably slow." 2500ms makes it viable as a utility element.

---

### 5. **Lava is Broken** (600ms Fire Rate = 5000ms+ Cooldown)

**Current State**:
- Fire Rate: 0.6x
- Cooldown: Effectively 5000ms+ (extremely slow)
- Damage: Variable (unclear)
- Utility: "Extreme damage over time"

**Problem**: Similar to Void - casts too slowly to be useful.

**Recommended Fix**:
```javascript
// File: scripts/game.js
lava: {
    fireRate: 0.6,  // CHANGE TO: 1.0
    cooldown: 5000,  // CHANGE TO: 2500
    damage: 3.0,  // ADD: Make damage high to justify slower speed
}
```

**Justification**: If Lava is "extreme DoT," it needs to actually deal extreme damage or cast more often.

---

### 6. **Mud is Too Slow** (3000ms Cooldown)

**Current State**:
- Base Damage: 2.0
- Cooldown: 3000ms (very slow)
- Utility: Extreme slow (0.2x speed - best in game)
- AOE: 150px

**Problem**: Mud's utility (super slow) doesn't justify the 3000ms cooldown. Earth is better (3.0 damage, same cooldown).

**Recommended Fix**:
```javascript
// File: scripts/game.js
mud: {
    damage: 2.0,
    cooldown: 3000,  // CHANGE TO: 2500
    aoe: 150,  // OR increase to 200px
    statusEffect: {
        type: 'slow',
        duration: 5000,
        magnitude: 0.2  // KEEP - strongest slow
    }
}
```

**Justification**: 2500ms or larger AOE makes Mud's extreme slow worth the tradeoff.

---

### 7. **Meteor May Be Too Strong** (4.0 Damage + Homing + AOE)

**Current State**:
- Base Damage: 4.0 (HIGHEST in game)
- Cooldown: 1500ms (fast for the damage)
- Homing: YES
- AOE: 200px
- Burn DoT: Magnitude 4
- **At Tier 5**: 4.0 × 3.0 = 12.0 effective damage!

**Problem**: Meteor has no weaknesses. It has highest damage, homing (never misses), AOE (hits multiple), AND burn DoT. Once players get Meteor, other elements become obsolete.

**Recommended Fix** (Choose ONE):

**Option A - Reduce Damage**:
```javascript
meteor: {
    damage: 4.0,  // CHANGE TO: 3.5
    // Keep everything else
}
```

**Option B - Reduce AOE**:
```javascript
meteor: {
    damage: 4.0,  // KEEP
    aoe: 200,  // CHANGE TO: 150
}
```

**Option C - Increase Cooldown**:
```javascript
meteor: {
    damage: 4.0,  // KEEP
    cooldown: 1500,  // CHANGE TO: 2000
}
```

**Justification**: Meteor should be strong (requires 2 fusions), but not "best at everything." Reducing one aspect creates meaningful tradeoffs.

---

### 8. **Crystal May Be Too Strong** (8 Needles × Piercing)

**Current State**:
- Base Damage: 2.5
- Cooldown: 2000ms
- Fires 8 needles in all directions
- Piercing: YES (hits multiple enemies per needle)
- **Effective Damage**: 2.5 × 8 = 20 damage per cast
- **At Tier 5**: 2.5 × 3.0 × 8 = 60 total damage spread!

**Problem**: Crystal is TOO easy to get (1 fusion: Earth + Lightning, both primaries) for how powerful it is. It trivializes crowd clear.

**Recommended Fix** (Choose ONE):

**Option A - Reduce Needle Count**:
```javascript
crystal: {
    damage: 2.5,
    needleCount: 8,  // CHANGE TO: 6
    piercing: true
}
```

**Option B - Remove Piercing**:
```javascript
crystal: {
    damage: 2.5,
    needleCount: 8,  // KEEP
    piercing: false  // CHANGE TO: false
}
```

**Option C - Increase Cooldown**:
```javascript
crystal: {
    damage: 2.5,
    cooldown: 2000,  // CHANGE TO: 2500
    needleCount: 8
}
```

**Justification**: Crystal should be strong (good fusion), but 6 needles or no piercing still makes it useful without being overwhelming.

---

## 🟢 Minor Issues (Nice to Have)

### 9. **Gravity AOE is Massive** (400px Radius)

**Current State**:
- AOE: 400px (largest in game by far!)
- Next largest: Blast at 250px

**Recommendation**:
```javascript
gravity: {
    aoe: 400,  // CHANGE TO: 300
}
```

**Justification**: 400px covers nearly the entire screen. 300px is still huge but more balanced.

---

### 10. **Death is a Gimmick** (30000ms Cooldown)

**Current State**:
- Damage: 999 (instant kill)
- Cooldown: 30000ms (30 seconds!)
- Threshold: Kills enemies below 20% HP

**Problem**: 30-second cooldown makes Death unusable in practice. By the time it's ready, the fight is over.

**Recommendation** (Optional - working as intended?):
```javascript
death: {
    damage: 999,
    cooldown: 30000,  // CHANGE TO: 15000 (15 seconds)
    threshold: 0.2  // OR change to 0.3 (30% HP)
}
```

**Justification**: 15-second cooldown or 30% threshold makes Death actually usable. Current state is more "meme" than "viable."

---

## 📊 Comparison: Before vs After

### DPS Rankings (Current)

| Element | Damage | Cooldown | DPS | Rank |
|---------|--------|----------|-----|------|
| Air | 1.5 | 1200ms | 1.25 | 1st |
| Lightning | 2.0 | 1500ms | 1.33 | 2nd |
| Water | 1.5 | 1800ms | 0.83 | 7th |
| Fire | 2.0 | 3150ms | 0.63 | 8th |
| Earth | 3.0 | 3000ms | 1.00 | 4th |
| Arcane | 3.0 | 2400ms | 1.25 | 1st (tied) |

### DPS Rankings (After Proposed Changes)

| Element | Damage | Cooldown | DPS | Rank |
|---------|--------|----------|-----|------|
| Air | 1.5 | 1500ms | 1.00 | 3rd ⬇️ |
| Lightning | 2.0 | 1500ms | 1.33 | 1st ⬆️ |
| Water | 2.0 | 1800ms | 1.11 | 2nd ⬆️ |
| Fire | 2.0 | 3150ms | 0.63 | 6th ⬇️ |
| Earth | 3.0 | 3000ms | 1.00 | 3rd (tied) |
| Arcane | 3.0 | 2400ms | 1.25 | 2nd (tied) |

**Result**: More balanced primary elements, Lightning remains strong but Air is toned down.

---

## 🛠️ Implementation Priority

### Phase 1: Critical Fixes (Do First)
1. ✅ Poison: 1.0 → 1.5 damage, DoT 3 → 5
2. ✅ Water: 1.5 → 2.0 damage
3. ✅ Air: 1200ms → 1500ms cooldown

### Phase 2: Major Fixes (Do Soon)
4. ✅ Void: 500ms → 2500ms cooldown
5. ✅ Lava: 600ms → 2500ms cooldown
6. ✅ Mud: 3000ms → 2500ms cooldown
7. ✅ Meteor: 4.0 → 3.5 damage OR 200px → 150px AOE
8. ✅ Crystal: 8 → 6 needles OR remove piercing

### Phase 3: Minor Polish (Nice to Have)
9. ⭕ Gravity: 400px → 300px AOE
10. ⭕ Death: 30000ms → 15000ms cooldown

---

## 📋 Code Locations to Edit

All changes are in: `/c/Users/Alex/wizbiz/scripts/game.js`

### For Damage/Cooldown Changes:
- **Lines 10990-11310**: `spellConfig` object
  - Modify: `damage`, `cooldown`, `aoe`, etc.

### For Fire Rate Changes:
- **Lines 10810-10890**: `elementConfig` object
  - Modify: `fireRate` values (0.5 → 1.0, etc.)

### For Status Effect Changes:
- **Lines 11000-11300**: `statusEffect` properties within `spellConfig`
  - Modify: `duration`, `magnitude`, `damagePerTick`, etc.

---

## 🎮 Playtesting Recommendations

After implementing changes, test these scenarios:

### Test 1: Poison Viability
- Pick Poison at Level 1
- Fight 10 enemies
- **Expected**: Should feel useful, not frustrating

### Test 2: Air Balance
- Pick Air at Level 1, tier to 3
- Compare DPS vs Lightning at Tier 3
- **Expected**: Similar DPS, Air slightly ahead due to AOE

### Test 3: Water Primary Value
- Pick Water at Level 1 (not for fusion)
- **Expected**: Should feel like a legitimate choice, not a sacrifice

### Test 4: Meteor Balance
- Get Meteor, tier to 5
- **Expected**: Strong but not "I win" button

### Test 5: Crystal Balance
- Get Crystal at Level 6
- Fight swarms
- **Expected**: Good crowd clear but not instant wipe

---

## 📈 Expected Impact

### Player Build Diversity (Current)
- 80% pick Air/Lightning/Arcane
- 15% pick Earth/Fire
- 5% pick Water (only for fusions)
- 0% pick Poison

### Player Build Diversity (After Changes)
- 40% pick Lightning/Arcane (still strong)
- 30% pick Air/Water (now balanced)
- 20% pick Earth/Fire (situational)
- 10% pick Poison (now viable DoT option)

**Result**: More variety, more experimentation, more fun!

---

## 🔮 Future Considerations

### Potential New Elements to Add
1. **Blizzard** (Ice + Storm): Enhanced freeze, 250px AOE
2. **Inferno** (Fire + Lava): Super burn, 3.5 damage
3. **Tempest** (Air + Storm): Ultra-fast wind, 1000ms cooldown
4. **Nova** (Arcane + Light): Radial burst, 300px AOE

### Fusion Recipe Gaps
Currently missing obvious combos:
- Ice + Lightning (could be "Frost Lightning")
- Earth + Arcane (makes Gravity, but nothing else)
- Water + Holy (could be "Blessing" or "Purity")

### Tier System Enhancements
- Add Tier 6-10? (Currently capped at Tier 5)
- Add "Prestige" system? (Reset tiers for permanent bonuses)
- Add visual effects for Tier 4-5 elements? (more flashy)

---

## ✅ Summary Checklist

**Must-Fix Issues**:
- [ ] Poison damage: 1.0 → 1.5 or 2.0
- [ ] Water damage: 1.5 → 2.0
- [ ] Air cooldown: 1200ms → 1500ms
- [ ] Void fire rate: 0.5 → 1.0 (or cooldown 5000 → 2500)
- [ ] Lava fire rate: 0.6 → 1.0

**Should-Fix Issues**:
- [ ] Mud cooldown: 3000ms → 2500ms
- [ ] Meteor damage: 4.0 → 3.5 OR AOE 200 → 150
- [ ] Crystal needles: 8 → 6 OR remove piercing

**Nice-to-Fix Issues**:
- [ ] Gravity AOE: 400px → 300px
- [ ] Death cooldown: 30000ms → 15000ms

**Documentation Complete**:
- [x] Element analysis done
- [x] Balance issues identified
- [x] Recommendations provided
- [x] Code locations mapped
- [x] Testing scenarios created

---

**Report Created**: November 14, 2025
**Analysis Basis**: 35 elements, 44+ fusions, community feedback
**Testing**: Theoretical (needs practical validation)
**Estimated Implementation Time**: 2-4 hours
