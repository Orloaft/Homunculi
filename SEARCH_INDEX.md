# Codebase Search Index

## Overview
This document provides a complete index of the codebase search results for:
1. Fusion logic
2. Pause menu implementation
3. Drag and drop functionality for element orbs
4. Essence tracking and spending

Generated documents are available in the repository root:
- `CODEBASE_ANALYSIS.md` - Detailed analysis of all systems
- `SEARCH_RESULTS_SUMMARY.md` - Quick reference and statistics
- `CODE_SNIPPETS_REFERENCE.md` - Copy-paste ready code examples
- `SEARCH_INDEX.md` - This file

---

## Quick Navigation

### By System

#### Fusion System
- **Analysis**: See `CODEBASE_ANALYSIS.md` Section 1
- **Reference**: See `SEARCH_RESULTS_SUMMARY.md` Section 1
- **Code Examples**: See `CODE_SNIPPETS_REFERENCE.md` Section 1

#### Pause Menu
- **Analysis**: See `CODEBASE_ANALYSIS.md` Section 2
- **Reference**: See `SEARCH_RESULTS_SUMMARY.md` Section 2
- **Code Examples**: See `CODE_SNIPPETS_REFERENCE.md` Section 2

#### Drag & Drop
- **Analysis**: See `CODEBASE_ANALYSIS.md` Section 3
- **Reference**: See `SEARCH_RESULTS_SUMMARY.md` Section 3
- **Code Examples**: See `CODE_SNIPPETS_REFERENCE.md` Section 2

#### Essence System
- **Analysis**: See `CODEBASE_ANALYSIS.md` Section 4
- **Reference**: See `SEARCH_RESULTS_SUMMARY.md` Section 4
- **Code Examples**: See `CODE_SNIPPETS_REFERENCE.md` Section 4

---

## File Locations Summary

### Source Files (TypeScript/ES6 Modules)

| File | Purpose | Key Classes/Functions |
|------|---------|----------------------|
| `/c/Users/Alex/wizbiz/src/systems/player/ChargeSystem.ts` | Charge management | `ChargeSystem` class |
| `/c/Users/Alex/wizbiz/src/data/FusionRecipes.js` | Fusion definitions | `getFusionResult()`, `FUSION_RECIPES` |
| `/c/Users/Alex/wizbiz/src/data/ElementConfig.js` | Element properties | `ELEMENT_CONFIG`, `ELEMENT_DESCRIPTIONS` |
| `/c/Users/Alex/wizbiz/src/systems/ui/UIManager.js` | UI system | `UIManager`, `createChargeUI()` |

### Game Engine Files (Legacy)

| File | Purpose | Key Functions |
|------|---------|----------------|
| `/c/Users/Alex/wizbiz/scripts/game.js` | Main game logic | `createPauseMenu()`, `attemptFusionInPauseMenu()` |
| `/c/Users/Alex/wizbiz/src/scenes/GameScene.js` | Scene management | `GameScene` class |

### Configuration Files

| File | Purpose |
|------|---------|
| `/c/Users/Alex/wizbiz/src/data/GameConstants.js` | Game-wide constants |

---

## Key Line Numbers Reference

### game.js (Main Monolithic File)

| Feature | Start Line | End Line | Lines |
|---------|-----------|---------|-------|
| Pause Menu Creation | 18148 | 18475 | 328 |
| Fusion Attempt | 18479 | 18547 | 69 |
| Fusion Cost Calc | 18552 | 18561 | 10 |
| Fusion Error Display | 18566 | 18590 | 25 |
| Fusion Success Display | 18595 | 18650+ | 55+ |
| Essence Display | 18184 | 18190 | 7 |
| Essence Rewards | 6233 | 6321 | 88 |
| Talent System | 7993 | 8146 | 153 |

### ChargeSystem.js

| Method | Start Line | End Line |
|--------|-----------|----------|
| `addCharge()` | 44 | 59 |
| `swapCharges()` | 112 | 145 |
| `removeCharge()` | 81 | 110 |
| `toggleLink()` | 147 | 169 |
| `updateChargeGroups()` | 185 | 205 |

### FusionRecipes.js

| Item | Start Line | End Line |
|------|-----------|----------|
| `FUSION_RECIPES` map | 2 | 44 |
| `getFusionResult()` | 47 | 51 |
| `getPossibleFusions()` | 54 | 66 |

---

## Data Structure Reference

### Essence Storage
```
localStorage['playerEssence'] → Integer (0-∞)
localStorage['talentPoints']  → Integer (synonym)
```

### Charge Slots Structure
```
game.chargeSlots[]        → Array of element names
game.elementPouch[]       → Array of element names (4 slots)
game.elementTiers (Map)   → Key: `${element}_${index}` → Value: tier (1-6+)
game.pauseChargeSlots[]   → Array of UI objects with {bg, circle, discardBtn, tierText, x, y}
```

### Charge System Structure
```
chargeSystem.charges[]        → Array of element names
chargeSystem.chargeGroups[]   → Array of charge group arrays
chargeSystem.linkedCharges    → Set of linked indices
chargeSystem.chargeCooldowns[] → Array of cooldown values
```

---

## Event System

### Events Emitted by ChargeSystem
- `chargesChanged` → {charges, groups}
- `chargeReplaced` → {index, oldElement, newElement, charges, groups}
- `chargeRemoved` → {index, element, charges}
- `chargesSwapped` → {index1, index2, charges}
- `linkToggled` → {index, linked, groups}

### Events Listened by UIManager
- `chargesChanged` → Updates charge display
- `xpChanged` → Updates XP bar
- `healthChanged` → Updates health bar
- `waveStarted` → Updates wave text
- `enemySpawned` / `enemyKilled` → Updates enemy count

---

## Constants & Configurations

### Player Config
```
startingCharges: 4      // Starting charge slots
maxCharges: 7           // Maximum charge slots
```

### Pause Menu Dimensions
```
Width: 700px (4 slots) or 800px (8 slots)
Height: 500px
Depth: 900 (z-index)
```

### Fusion Costs (Exponential)
```
Tier 1 → 10 essence
Tier 2 → 20 essence
Tier 3 → 40 essence
Tier 4 → 80 essence
Tier 5 → 160 essence
Tier 6 → 320 essence
```

### Essence Rewards
```
Level 1: 50 essence
Level 2: 75 essence
Level 3: 100 essence
Level N: 50 + (N-1) * 25
```

---

## Workflow Diagrams

### Fusion Workflow
```
User drags Element A → Element B
         ↓
Calculate Distance to slots
         ↓
If distance < 40px to target slot
         ↓
Check if target has different element
         ├─ YES → Attempt Fusion
         │        ├─ Validate recipe exists
         │        ├─ Calculate cost
         │        ├─ Check player has essence
         │        ├─ Deduct essence
         │        ├─ Update slots
         │        ├─ Update tiers
         │        ├─ Show success animation
         │        └─ Return
         │
         └─ NO → Swap elements
                  └─ Return
         ↓
Return to original position if no valid target
```

### Essence Lifecycle
```
Level Complete → Calculate Reward (50 + (level-1)*25)
    ↓
Add to localStorage['playerEssence']
    ↓
Display on Nexus/Win screen
    ↓
User opens Pause Menu
    ↓
Pause Menu reads localStorage
    ↓
Display "Essence: XXX"
    ↓
User drags elements to fuse
    ↓
Calculate cost (10 * 2^(tier-1))
    ↓
Check sufficient essence
    ├─ YES → Deduct, execute fusion
    └─ NO → Show error
    ↓
Update localStorage['playerEssence']
    ↓
Update display
```

---

## Testing Checklist

- [ ] Verify fusion recipes defined in `FUSION_RECIPES` constant
- [ ] Test drag detection (40px threshold)
- [ ] Check essence deduction after fusion
- [ ] Verify tier calculation affects cost
- [ ] Test error handling (invalid fusion, insufficient essence)
- [ ] Verify localStorage persistence
- [ ] Test pause menu visibility/interaction
- [ ] Check charge system updates after fusion
- [ ] Verify element discovery tracking
- [ ] Test swapping vs fusion logic

---

## Common Debugging Commands

```javascript
// Check current essence
localStorage.getItem('playerEssence')

// Set test essence
localStorage.setItem('playerEssence', '1000')

// Check discovered elements
JSON.parse(localStorage.getItem('discoveredElements'))

// Check charge slots
console.log(this.chargeSlots)

// Check element tiers
console.log(this.elementTiers)

// Verify pause menu state
console.log(this.pauseMenu.visible)

// Check dragged element
console.log(this.draggedCharge)
```

---

## Related Documentation

- See `CODEBASE_ANALYSIS.md` for detailed system architecture
- See `CODE_SNIPPETS_REFERENCE.md` for implementation examples
- See `SEARCH_RESULTS_SUMMARY.md` for quick reference tables

---

## Notes

- Main game logic is in `/c/Users/Alex/wizbiz/scripts/game.js` (monolithic file)
- Modern modular code is in `/c/Users/Alex/wizbiz/src/` directory
- Both systems are in active use in the project
- Essence uses localStorage for cross-session persistence
- Charge/element data is stored in game memory but may sync with localStorage

---

Last Updated: 2025-10-22
Created by: Code Analysis Tool
