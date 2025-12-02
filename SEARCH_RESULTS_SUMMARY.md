# Search Results Summary

## Files Found

### 1. Fusion Logic Files
- **Main Implementation**: `/c/Users/Alex/wizbiz/scripts/game.js` (lines 18479-18561)
  - Function: `attemptFusionInPauseMenu()` 
  - Function: `getFusionCost()`
  - Function: `showFusionError()`
  - Function: `showFusionSuccess()`

- **Fusion Recipes**: `/c/Users/Alex/wizbiz/src/data/FusionRecipes.js`
  - Constants: `FUSION_RECIPES` (40+ combinations)
  - Functions: `getFusionResult()`, `getPossibleFusions()`

### 2. Pause Menu Implementation
- **File**: `/c/Users/Alex/wizbiz/scripts/game.js` (lines 18148-18475)
  - Function: `createPauseMenu()`
  - Configuration: `this.pauseChargeSlots[]`, `this.elementPouch[]`
  - Drag/Drop Handlers: `dragstart`, `drag`, `dragend` events

### 3. Charge/Slot Management
- **File**: `/c/Users/Alex/wizbiz/src/systems/player/ChargeSystem.js`
  - Class: `ChargeSystem`
  - Methods: `addCharge()`, `swapCharges()`, `removeCharge()`, `toggleLink()`
  - Linking System: `linkedCharges` Set, `chargeGroups` Array

### 4. Essence System
- **Storage**: `localStorage.getItem('playerEssence')`
- **Acquisition**: Level rewards (50 + (level-1) * 25)
- **Spending**: Fusion costs (10 * 2^(tier-1))
- **Display**: Pause menu (line 18184), Nexus screen (line 7872)
- **Talents**: `/c/Users/Alex/wizbiz/scripts/game.js` (lines 7993-8146)

### 5. Element Configuration
- **File**: `/c/Users/Alex/wizbiz/src/data/ElementConfig.js`
  - Map: `ELEMENT_CONFIG` (26 elements with properties)
  - Array: `PRIMARY_ELEMENTS` (6 basic elements)
  - Map: `ELEMENT_DESCRIPTIONS` (flavor text)

### 6. UI Management
- **File**: `/c/Users/Alex/wizbiz/src/systems/ui/UIManager.js`
  - Class: `UIManager`
  - Methods: `createChargeUI()`, `updateChargeUI()`
  - Display Elements: Health bar, XP bar, charge indicators

---

## Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Fusion Recipes | 40+ | Various element combinations |
| Elements | 26 | Distributed across 3 sprite sheets |
| Pause Menu Slots | 12 | 8 charge + 4 pouch |
| Essence Cost Tiers | 6 | From 10 to 160 essence |
| ChargeSystem Methods | 15+ | Full charge management API |

---

## Quick Reference: Function Locations

| Function | File | Line |
|----------|------|------|
| `getFusionResult()` | FusionRecipes.js | 47-51 |
| `getPossibleFusions()` | FusionRecipes.js | 54-66 |
| `attemptFusionInPauseMenu()` | game.js | 18479 |
| `getFusionCost()` | game.js | 18552 |
| `createPauseMenu()` | game.js | 18148 |
| `addCharge()` | ChargeSystem.js | 44-59 |
| `swapCharges()` | ChargeSystem.js | 112-145 |
| `updateChargeGroups()` | ChargeSystem.js | 185-205 |
| `toggleLink()` | ChargeSystem.js | 147-169 |

---

## Essence System Flow

```
Level Complete
     ↓
Calculate Reward: 50 + (level-1) * 25
     ↓
Add to localStorage['playerEssence']
     ↓
Display on Nexus/Win screen
     ↓
Player opens Pause Menu → Check essence
     ↓
Player attempts fusion
     ↓
Calculate cost: 10 * 2^(tier-1)
     ↓
Verify sufficient essence
     ↓
Deduct from localStorage
     ↓
Execute fusion, show feedback
```

---

## Drag & Drop Flow

```
Pause Menu Opens
     ↓
User clicks element sprite
     ↓
dragstart event → set draggedCharge
     ↓
drag event → update position (world → container coords)
     ↓
dragend event
     ↓
Calculate distance to all slots (threshold: 40px)
     ↓
Check if target has different element
     ├─ YES → Attempt fusion
     │        ├─ Validate recipe exists
     │        ├─ Calculate cost
     │        ├─ Check essence
     │        ├─ Execute fusion or show error
     │        └─ Update display
     │
     └─ NO → Swap positions
              └─ Update display
```

---

## Storage Keys Used

| Key | Type | Usage |
|-----|------|-------|
| `playerEssence` | Integer | Current essence amount |
| `talentPoints` | Integer | Used interchangeably with playerEssence |
| `discoveredElements` | JSON Array | Elements unlocked |
| N/A | Game variables | `this.chargeSlots[]`, `this.elementPouch[]` |

---

## Element Tier System

**Map Key Format**: `${element}_${slotIndex}`
**Value**: Tier number (1-6+)

Used for:
- Calculating fusion costs (higher tier = more expensive)
- Tracking element level progression
- Display purposes (UI shows tier)

---

## Related Systems (Not Analyzed but Connected)

- Projectile Manager: Fires charge groups at enemies
- Enemy Manager: Takes damage from projectiles
- Player Stats: Tracks XP and levels
- Wave System: Triggers level-ups and essence rewards
- Save Manager: May persist essence data

