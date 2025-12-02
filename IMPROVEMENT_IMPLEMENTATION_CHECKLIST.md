# Implementation Checklist - Fusion & Radial Improvements

## 📋 Phase 1: Quick Wins (1-2 Weeks) ⚡

### Week 1: Radial Menu UI Overhaul

- [ ] **Add Tier Display to Radial Menu**
  - File: `scripts/game.js` (radial menu rendering ~line 35000+)
  - Show Roman numerals (I-V) on each element slot
  - Code: Add `.text(tierLevel, x, y)` to each slot
  - Time: 2 hours

- [ ] **Add Cooldown Visual Bars**
  - File: `scripts/game.js` (radial menu update loop)
  - Show progress bar under each element
  - Color: Green (ready) → Red (cooldown)
  - Code: Track `lastCastTime` per element, draw bar
  - Time: 3 hours

- [ ] **Add Damage Numbers to Slots**
  - File: `scripts/game.js` (radial menu rendering)
  - Calculate: `baseDamage × tierMultiplier × resonanceBonus`
  - Display below element icon
  - Time: 2 hours

- [ ] **Create Element Info Panel**
  - File: `scripts/game.js` (UI rendering section)
  - Position: Bottom center of screen
  - Content: Element name, damage, cooldown, effects, resonances
  - Update on: Hover or selection change
  - Time: 4 hours

**Total Week 1**: 11 hours

---

### Week 2: Controls & Balance

- [ ] **Implement Quick-Swap Hotkeys (Keyboard)**
  - File: `scripts/game.js` (input handling ~line 17000+)
  - Keys 1-6: Activate slots 1-6
  - Q/E: Cycle through active elements
  - R: "Panic button" (activate highest tier)
  - Code: `this.input.keyboard.on('keydown-ONE', ...)`
  - Time: 3 hours

- [ ] **Implement Quick-Swap (Gamepad)**
  - File: `scripts/game.js` (gamepad handling)
  - D-pad: Quick-activate slots
  - LT + D-pad: Swap slots
  - Right stick click: Cycle
  - Time: 2 hours

- [ ] **Balance Fix: Poison Damage**
  - File: `scripts/game.js` (spellConfig ~line 10990)
  - Change: `poison.damage: 1.0` → `1.5`
  - Change: `poison.statusEffect.damagePerTick: 3` → `5`
  - Time: 5 minutes

- [ ] **Balance Fix: Water Damage**
  - File: `scripts/game.js` (spellConfig)
  - Change: `water.damage: 1.5` → `2.0`
  - Time: 5 minutes

- [ ] **Balance Fix: Air Cooldown**
  - File: `scripts/game.js` (spellConfig)
  - Change: `air.cooldown: 1200` → `1500`
  - Time: 5 minutes

- [ ] **Balance Fix: Void Fire Rate**
  - File: `scripts/game.js` (elementConfig ~line 10810)
  - Change: `void.fireRate: 0.5` → `1.0`
  - OR spellConfig: `void.cooldown: 5000` → `2500`
  - Time: 5 minutes

- [ ] **Balance Fix: Lava Fire Rate**
  - File: `scripts/game.js` (elementConfig)
  - Change: `lava.fireRate: 0.6` → `1.0`
  - Time: 5 minutes

- [ ] **Balance Fix: Mud Cooldown**
  - File: `scripts/game.js` (spellConfig)
  - Change: `mud.cooldown: 3000` → `2500`
  - Time: 5 minutes

**Total Week 2**: 6 hours

**✅ PHASE 1 TOTAL: 17 hours**

---

## 📋 Phase 2: Strategic Depth (2-4 Weeks) 🎯

### Week 3-4: Resonance System

- [ ] **Create ResonanceManager Class**
  - File: NEW - `src/systems/ResonanceManager.js`
  - Constructor: Initialize resonance definitions
  - Methods: `checkResonances()`, `getActiveResonances()`, `applyBonuses()`
  - Time: 4 hours

- [ ] **Define 2-Element Resonances (10 combos)**
  - File: `src/systems/ResonanceManager.js`
  - Examples:
    - Fire + Water = "Balanced Elements" (+10% both)
    - Lightning + Earth = "Grounding" (+1 chain, +stun duration)
    - Ice + Fire = "Opposing Forces" (shatter/melt combos)
  - Time: 3 hours

- [ ] **Define 3-Element Trinity Bonuses (5 combos)**
  - File: `src/systems/ResonanceManager.js`
  - Examples:
    - Fire + Water + Air = "Primordial Trinity" (+15% all)
    - Lightning + Fire + Ice = "Chaos Triangle" (+20% crit)
  - Time: 2 hours

- [ ] **Define Element Set Bonuses**
  - File: `src/systems/ResonanceManager.js`
  - Examples:
    - 4 Fire elements = "Inferno Master" (+25% fire dmg)
    - 4 Ice elements = "Frozen Domain" (+freeze duration)
  - Time: 2 hours

- [ ] **Integrate Resonance Checks in Update Loop**
  - File: `scripts/game.js` (update function ~line 17500)
  - Check active elements each frame
  - Apply bonuses to damage calculations
  - Time: 3 hours

- [ ] **Add Resonance UI Panel**
  - File: `scripts/game.js` (UI rendering)
  - Position: Right side of screen
  - Show: Active resonances, bonuses, visual connections
  - Time: 4 hours

**Total Week 3-4**: 18 hours

---

### Week 5-6: New Fusions & Fusion Tiers

- [ ] **Add 20 New Fusion Recipes**
  - File: `src/data/FusionRecipes.js`
  - New recipes:
    - Ice + Lightning → Frostbolt
    - Earth + Holy → Consecrated Ground
    - Water + Arcane → Mystic Tide
    - Air + Arcane → Force Blast
    - Lava + Lightning → Magma Bomb
    - Storm + Ice → Blizzard
    - Chaos + Arcane → Entropy
    - (13 more...)
  - Time: 6 hours (design + config)

- [ ] **Create Element Variants System**
  - File: `scripts/game.js` (fusion logic)
  - Allow multiple recipes → different variants
  - Example: Water + Air = Aqua Storm vs Air + Lightning = Thunder Storm
  - Time: 5 hours

- [ ] **Implement Fusion Tier Inheritance**
  - File: `scripts/game.js` (fusion creation ~line 44990)
  - Calculate: `fusionTier = Math.floor((parent1Tier + parent2Tier) / 2)`
  - Cap at Tier 3 for fusions
  - Apply tier bonuses to fusion result
  - Time: 4 hours

- [ ] **Add Fusion Preview UI**
  - File: `scripts/game.js` (fusion selection UI)
  - Show: Parent tiers → Result tier
  - Show: Bonuses from high-tier parents
  - Example: "Fire V + Water V → Steam III (+20% dmg, -15% cooldown)"
  - Time: 5 hours

- [ ] **Create New Spell Configs for New Fusions**
  - File: `scripts/game.js` (spellConfig section)
  - Add damage, cooldown, effects for 20 new elements
  - Time: 4 hours

**Total Week 5-6**: 24 hours

---

### Week 7-8: Combo System

- [ ] **Create ComboTracker Class**
  - File: NEW - `src/systems/ComboTracker.js`
  - Track: Last 4 casts, timestamps
  - Methods: `recordCast()`, `checkCombo()`, `triggerComboEffect()`
  - Time: 3 hours

- [ ] **Define 2-Hit Combo Effects (8 combos)**
  - File: `src/systems/ComboTracker.js`
  - Examples:
    - Fire → Lightning = "Ignition Spark" (+50% lightning dmg)
    - Water → Ice = "Deep Freeze" (2x freeze duration)
    - Earth → Air = "Sandstorm" (AOE slow + blind)
  - Time: 3 hours

- [ ] **Define 3-Hit Combo Effects (5 combos)**
  - File: `src/systems/ComboTracker.js`
  - Examples:
    - Fire → Water → Lightning = "Elemental Cascade" (+100% dmg, all effects)
    - Ice → Earth → Lightning = "Glacial Shatter" (explode frozen enemies)
  - Time: 2 hours

- [ ] **Define 4-Hit+ Mega Combo**
  - File: `src/systems/ComboTracker.js`
  - Any 4 different elements = "Chaos Convergence" (random mega-effect)
  - Time: 1 hour

- [ ] **Integrate Combo System in Cast Logic**
  - File: `scripts/game.js` (spell casting ~line 24000+)
  - Call `comboTracker.recordCast(element)` on each cast
  - Check and trigger combos
  - Time: 3 hours

- [ ] **Add Combo UI Tracker**
  - File: `scripts/game.js` (UI rendering)
  - Position: Top-right corner
  - Show: Current combo (2-hit, 3-hit), timer bar, bonus text
  - Time: 4 hours

- [ ] **Add Combo Visual Effects**
  - File: `scripts/game.js` (particle effects)
  - Unique effects for each combo type
  - Screen flash, particle burst, sound effects
  - Time: 5 hours

**Total Week 7-8**: 21 hours

**✅ PHASE 2 TOTAL: 63 hours**

---

## 📋 Phase 3: Long-Term Systems (4-8 Weeks) 🏗️

### Week 9-10: Loadout System

- [ ] **Create LoadoutManager Class**
  - File: NEW - `src/systems/LoadoutManager.js`
  - Structure: 5 loadout slots, each stores 6 elements + tiers
  - Methods: `saveLoadout()`, `loadLoadout()`, `deleteLoadout()`, `exportCode()`, `importCode()`
  - Time: 6 hours

- [ ] **Create Loadout UI Screen**
  - File: NEW - `src/ui/LoadoutScreen.js`
  - List all loadouts with previews
  - Buttons: Equip, Edit, Delete, Share
  - Time: 8 hours

- [ ] **Implement Export/Import Codes**
  - File: `src/systems/LoadoutManager.js`
  - Generate: Short alphanumeric code (MTR5-ARC5-LTN4...)
  - Parse: Code → Loadout data
  - Time: 4 hours

- [ ] **Add "Save Current Build" Button**
  - File: `scripts/game.js` (radial menu or pause menu)
  - Quick-save current elements to loadout slot
  - Time: 2 hours

- [ ] **Add DPS Calculator to Loadout Manager**
  - File: `src/systems/LoadoutManager.js`
  - Calculate: Total DPS, avg cooldown, survivability score
  - Display in loadout list
  - Time: 4 hours

**Total Week 9-10**: 24 hours

---

### Week 11-12: Fusion Mastery System

- [ ] **Create MasterySystem Class**
  - File: NEW - `src/systems/MasterySystem.js`
  - Track: Usage count per fusion element
  - Methods: `incrementUsage()`, `checkLevelUp()`, `applyMasteryBonus()`
  - Time: 5 hours

- [ ] **Define Mastery Levels (1-5)**
  - File: `src/systems/MasterySystem.js`
  - Level 1: 1 use (unlock)
  - Level 2: 50 uses (+5% dmg)
  - Level 3: 150 uses (+10% dmg, -5% cooldown)
  - Level 4: 300 uses (+15% dmg, -10% cooldown)
  - Level 5: 500 uses (unique bonus per element)
  - Time: 2 hours

- [ ] **Define Unique Mastery 5 Bonuses (35 elements)**
  - File: `src/systems/MasterySystem.js`
  - Examples:
    - Crystal: 8 → 10 needles
    - Meteor: 1 → 3 meteors per cast
    - Storm: 1 → 2 tornados
  - Time: 6 hours (design all 35)

- [ ] **Integrate Mastery Tracking**
  - File: `scripts/game.js` (spell casting)
  - Increment usage counter on each cast
  - Save to persistent storage (localStorage)
  - Time: 3 hours

- [ ] **Add Mastery UI Display**
  - File: `scripts/game.js` (element info panel)
  - Show: Current level, progress bar, next bonus
  - Time: 4 hours

- [ ] **Add Mastery Level-Up Notifications**
  - File: `src/systems/MasterySystem.js`
  - Pop-up: "Crystal Mastery Level 5! Unlocked: 10 Needles!"
  - Time: 2 hours

**Total Week 11-12**: 22 hours

---

### Week 13-14: Build Calculator Tool

- [ ] **Create Standalone HTML Calculator**
  - File: NEW - `tools/BuildCalculator.html`
  - Framework: Vanilla JS or React (if familiar)
  - Layout: Element dropdowns, tier selectors, stat display
  - Time: 8 hours

- [ ] **Import Element Data**
  - File: `tools/BuildCalculator.html`
  - Load: Element configs, damage values, cooldowns from game data
  - Parse: JSON export of game configs
  - Time: 3 hours

- [ ] **Implement DPS Calculator Logic**
  - File: `tools/BuildCalculator.html`
  - Calculate: `(damage × tierMultiplier) / (cooldown / 1000)` for each element
  - Sum total DPS
  - Time: 3 hours

- [ ] **Add Resonance Detection**
  - File: `tools/BuildCalculator.html`
  - Check selected elements against resonance rules
  - Display active bonuses
  - Time: 3 hours

- [ ] **Generate Fusion Path**
  - File: `tools/BuildCalculator.html`
  - Algorithm: Determine level-by-level path to achieve build
  - Output: "Level 1: Pick Lightning, Level 5: Fuse Earth + Lightning..."
  - Time: 5 hours

- [ ] **Add Export to Loadout Code**
  - File: `tools/BuildCalculator.html`
  - Generate same code format as in-game loadout system
  - Copy to clipboard
  - Time: 2 hours

**Total Week 13-14**: 24 hours

---

### Week 15-16: Mission System & Adaptive Difficulty

- [ ] **Create MissionSystem Class**
  - File: NEW - `src/systems/MissionSystem.js`
  - Structure: Daily missions (3), weekly missions (2)
  - Methods: `checkMissionCompletion()`, `claimReward()`, `refreshDailies()`
  - Time: 5 hours

- [ ] **Define Mission Templates (20 missions)**
  - File: `src/systems/MissionSystem.js`
  - Examples:
    - "Fire and Ice": Use Fire + Ice elements
    - "Trinity Challenge": Maintain trinity bonus
    - "Pacifist Run": Only DoT damage
    - "Speedrunner": Complete in <3 min
    - "Fusion Master": Only fusion elements
  - Time: 4 hours

- [ ] **Add Mission UI Screen**
  - File: NEW - `src/ui/MissionBoard.js`
  - Display: Available missions, progress, rewards
  - Buttons: Start Mission, Claim Reward
  - Time: 6 hours

- [ ] **Integrate Mission Tracking**
  - File: `scripts/game.js` (update loop + event hooks)
  - Check mission conditions each frame
  - Trigger completion when met
  - Time: 4 hours

- [ ] **Create Mission Rewards**
  - File: `src/systems/MissionSystem.js`
  - Types: Mastery XP, catalysts, cosmetics, titles
  - Time: 3 hours

- [ ] **Implement Build Power Rating Calculator**
  - File: NEW - `src/systems/AdaptiveDifficulty.js`
  - Formula: `tierSum + resonanceCount × 10 + masteryLevels × 5 + DPS`
  - Range: 0-100
  - Time: 3 hours

- [ ] **Add Difficulty Scaling Logic**
  - File: `scripts/game.js` (enemy spawning ~line 18000+)
  - Modify: Enemy count, health, damage based on power rating
  - Brackets: 0-20, 21-40, 41-60, 61-80, 81-100
  - Time: 4 hours

- [ ] **Add Difficulty Notification UI**
  - File: `scripts/game.js` (UI notifications)
  - Show on game start: "Build Power: 72/100 (Expert Difficulty)"
  - List scaling modifiers and rewards
  - Time: 3 hours

**Total Week 15-16**: 32 hours

**✅ PHASE 3 TOTAL: 102 hours**

---

## 📊 Total Time Estimates

| Phase | Features | Time | Priority |
|-------|----------|------|----------|
| Phase 1 | UI + Balance | 17 hours | ⭐⭐⭐ Critical |
| Phase 2 | Resonance + Combos | 63 hours | ⭐⭐ High |
| Phase 3 | Long-term Systems | 102 hours | ⭐ Medium |
| **TOTAL** | **All Features** | **182 hours** | **(~4.5 weeks full-time)** |

---

## 🎯 Prioritized Task List (If Limited Time)

### Tier 1: Must-Do (Immediate Impact)
1. ✅ Balance fixes (30 mins) - scripts/game.js
2. ✅ Radial menu UI improvements (11 hours) - scripts/game.js
3. ✅ Quick-swap hotkeys (5 hours) - scripts/game.js

**Total: 16.5 hours** → Most player satisfaction for least effort

---

### Tier 2: Should-Do (High Value)
4. ✅ Resonance system (18 hours) - NEW ResonanceManager.js
5. ✅ New fusion recipes (6 hours) - src/data/FusionRecipes.js
6. ✅ Fusion tier inheritance (9 hours) - scripts/game.js

**Total: 33 hours** → Major strategic depth

---

### Tier 3: Nice-to-Do (Content)
7. ✅ Combo system (21 hours) - NEW ComboTracker.js
8. ✅ Loadout system (24 hours) - NEW LoadoutManager.js

**Total: 45 hours** → Significant QoL

---

### Tier 4: Optional (Polish)
9. ⭕ Mastery system (22 hours) - NEW MasterySystem.js
10. ⭕ Build calculator (24 hours) - NEW BuildCalculator.html
11. ⭕ Missions + adaptive difficulty (32 hours) - NEW MissionSystem.js

**Total: 78 hours** → Long-term engagement

---

## 🔄 Testing Checklist

After implementing each phase, test:

### Phase 1 Testing
- [ ] All tier numbers display correctly in radial menu
- [ ] Cooldown bars update smoothly
- [ ] Damage numbers match actual in-game damage
- [ ] Element info panel shows on hover/selection
- [ ] Number keys 1-6 activate correct slots
- [ ] Q/E cycling works
- [ ] Poison now deals reasonable damage
- [ ] Water feels like a legitimate primary element
- [ ] Air is no longer overpowered

### Phase 2 Testing
- [ ] 2-element resonances trigger correctly
- [ ] Trinity bonuses apply when 3+ elements equipped
- [ ] Set bonuses work with 4+ same-type elements
- [ ] Resonance UI panel shows active bonuses
- [ ] New fusion recipes create correct elements
- [ ] Fusion variants offer meaningful choices
- [ ] High-tier parents create higher-tier fusions
- [ ] Fusion preview shows accurate bonuses
- [ ] 2-hit combos trigger within time window
- [ ] 3-hit combos work with correct sequence
- [ ] Combo UI tracker displays correctly
- [ ] Combo effects apply damage bonuses

### Phase 3 Testing
- [ ] Loadouts save/load correctly
- [ ] Export codes can be re-imported
- [ ] DPS calculations are accurate
- [ ] Mastery levels up at correct thresholds
- [ ] Mastery bonuses apply to damage/cooldown
- [ ] Level 5 mastery bonuses work (10 needles, etc.)
- [ ] Build calculator matches in-game stats
- [ ] Fusion path algorithm generates correct steps
- [ ] Daily missions refresh at midnight
- [ ] Mission completion triggers correctly
- [ ] Mission rewards are granted
- [ ] Build power rating calculates accurately
- [ ] Enemy scaling matches power brackets
- [ ] Difficulty notification appears on game start

---

## 📝 Documentation Updates Needed

After implementation, update:

- [ ] **README.md** - Add new features to feature list
- [ ] **CHANGELOG.md** - Document all changes
- [ ] **User Guide** - Explain resonances, combos, loadouts, missions
- [ ] **Developer Guide** - Document new classes, APIs
- [ ] **Balance Sheet** - Update element stats with changes

---

## 🎉 Definition of Done

Feature is complete when:
1. ✅ Code implemented and tested
2. ✅ No console errors
3. ✅ Visual polish complete (not placeholder graphics)
4. ✅ Performance tested (60 FPS maintained)
5. ✅ Playtested by at least 2 people
6. ✅ Bugs reported and fixed
7. ✅ Documentation updated
8. ✅ Committed to git with clear message

---

**Checklist Version**: 1.0
**Last Updated**: November 14, 2025
**Estimated Completion**: Phase 1 (2 weeks), Phase 2 (6 weeks), Phase 3 (12 weeks)
**Start Date**: [To be filled]
**Target Date**: [To be filled]
