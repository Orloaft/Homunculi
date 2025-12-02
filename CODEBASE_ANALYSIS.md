# Codebase Analysis: Fusion Logic, Pause Menu, Drag & Drop, and Essence System

## 1. FUSION LOGIC

### Location
- **Primary**: `/c/Users/Alex/wizbiz/scripts/game.js` (lines 18479-18547)
- **Recipes Definition**: `/c/Users/Alex/wizbiz/src/data/FusionRecipes.js`

### Key Functions

#### `FusionRecipes.js`
```javascript
// Helper function to get fusion result
export function getFusionResult(element1, element2) {
    const key1 = `${element1}+${element2}`;
    const key2 = `${element2}+${element1}`;
    return FUSION_RECIPES[key1] || FUSION_RECIPES[key2] || null;
}

// Get all possible fusion results for an element
export function getPossibleFusions(element) {
    // Returns array of { element, result } pairs
}
```

#### Fusion Recipes Map
Over 40 fusion combinations including:
- Basic: fire+water=steam, fire+earth=lava, water+air=storm
- Advanced: water+ice=crystal, fire+lightning=chaos
- Complex: order+chaos=time, radiant+void=cosmic

### Fusion Implementation in Pause Menu

#### `attemptFusionInPauseMenu(sourceIndex, targetIndex, sourceElement, targetElement)`
1. **Validates** fusion exists via `getFusionResult()`
2. **Calculates cost** based on element tier using exponential formula:
   ```javascript
   const fusionCost = Math.floor(10 * Math.pow(2, tier - 1))
   // Tier 1: 10, Tier 2: 20, Tier 3: 40, etc.
   ```
3. **Checks essence** from localStorage: `localStorage.getItem('playerEssence')`
4. **Performs fusion**:
   - Target slot receives new fused element with tier 1
   - Source slot is cleared
   - Essence deducted from player
   - Element marked as discovered
5. **Shows success animation** with burst effect and text feedback

#### Related Functions
- `getFusionCost(currentTier)` - Line 18552
- `showFusionError(message)` - Line 18566
- `showFusionSuccess(targetIndex, element, newTier, cost)` - Line 18595

---

## 2. PAUSE MENU IMPLEMENTATION

### Location
`/c/Users/Alex/wizbiz/scripts/game.js` (lines 18148-18475)

### Architecture

#### Container Structure
```javascript
this.pauseMenu = this.add.container(400, 300);
// Dynamic width: 700px (4 slots) or 800px (8 slots)
// Height: 500px
// Depth: 900 (above game)
```

#### UI Sections
1. **Header** (lines 18166-18190)
   - Title: "ELEMENT MANAGEMENT"
   - Instructions for drag/rearrange/discard/fuse
   - Essence display: Updates from localStorage

2. **Mode Toggle Button** (lines 18192-18224)
   - "Swap Mode" / "Fusion Mode"
   - Changes appearance when toggled
   - Shows essence requirement when active

3. **Slot Labels** (lines 18225-18244)
   - ACTIVE (green) - Active charge slots
   - PASSIVE (gray) - Passive slots
   - POUCH (light green) - Pouch storage slots

4. **Slot Grid** (lines 18245-18362)
   - Uses socket sprite images: `grey-socket` (normal), `grey-socket-select` (hover)
   - Scale: 0.217 (maps 368px to 80px)
   - Three rows:
     - Row 1 (Y=-100): Active slots
     - Row 2 (Y=-20): Passive slots  
     - Row 3 (Y=60): Pouch slots
   - Each slot includes:
     - Background socket image
     - Element sprite (draggable)
     - Discard button (X)
     - Tier text

5. **Info Display** (lines 18363-18398)
   - Combo display (line 18364)
   - Element description area with background
   - Close instructions
   - Controller instructions

### Slot Configuration
```javascript
this.MAX_ACTIVE_SLOTS = 4 or 8      // Configurable
this.MAX_CHARGE_SLOTS = 8           // Active + Passive
this.MAX_POUCH_SLOTS = 4            // Pouch storage
this.pauseChargeSlots = []           // Array of slot objects
this.elementPouch = Array(4).fill(null)  // Pouch storage
```

### Drag & Drop Handlers

#### Drag Start (line 18406)
```javascript
this.input.on('dragstart', (pointer, gameObject) => {
    if (gameObject.getData('slotIndex') !== undefined) {
        this.draggedCharge = gameObject;
        gameObject.setAlpha(0.8);
        // Store initial position
        gameObject.setData('dragStartX', gameObject.x);
        gameObject.setData('dragStartY', gameObject.y);
    }
});
```

#### Drag Movement (line 18417)
```javascript
this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    // Convert world coordinates to container-local
    gameObject.x = dragX - this.pauseMenu.x;
    gameObject.y = dragY - this.pauseMenu.y;
});
```

#### Drag End (line 18424)
```javascript
this.input.on('dragend', (pointer, gameObject) => {
    // Find target slot by distance (threshold: 40px)
    // If target has different element → Attempt fusion
    // Otherwise → Swap charges
    // Return to original position if invalid
});
```

---

## 3. DRAG & DROP FUNCTIONALITY FOR ELEMENT ORBS

### Charge System Integration

#### File
`/c/Users/Alex/wizbiz/src/systems/player/ChargeSystem.js`

#### Key Methods
```javascript
// Add new element to charges
addCharge(element) {
    if (this.charges.length < this.maxCharges) {
        this.charges.push(element);
        this.chargeCooldowns.push(0);
        this.updateChargeGroups();
        return true;
    }
    return false;
}

// Swap two charge positions
swapCharges(index1, index2) {
    // Swaps both charges and cooldowns
    // Updates linked status
    // Emits 'chargesSwapped' event
}

// Replace charge at specific index
replaceCharge(index, newElement) {
    this.charges[index] = newElement;
    this.updateChargeGroups();
    // Emits 'chargeReplaced' event
}

// Toggle link between adjacent charges
toggleLink(index) {
    // Links charge at index to index+1
    // Requires available link slots
}
```

### Linking System
```javascript
this.linkedCharges = new Set();  // Set of linked indices
this.linkSlots = 0;               // Available link slots
this.chargeGroups = [];           // Arrays of linked elements

// Update charge groups (follows linking chains)
updateChargeGroups() {
    // Groups consecutive linked charges together
    // Used for fusion calculation and firing
}
```

### Pause Menu Drag Coordination

The pause menu's drag/drop system coordinates with ChargeSystem:
```javascript
// In pause menu dragend handler:
if (sourceElement && targetElement && sourceElement !== targetElement) {
    this.attemptFusionInPauseMenu(sourceIndex, targetIndex, sourceElement, targetElement);
} else {
    this.swapCharges(sourceIndex, targetIndex);
}

// After operation:
this.updateChargeUI();
this.updatePauseMenuDisplay();
```

### Charge UI Management
File: `/c/Users/Alex/wizbiz/src/systems/ui/UIManager.js`

```javascript
createChargeUI() {
    // Creates 7 charge indicator slots at bottom of screen
    // Uses 'element-symbols' sprite sheet
    // Shows element color border
}

updateChargeUI(charges, groups) {
    // Shows/hides indicators based on charges
    // Displays link indicators between slots
    // Updates on 'chargesChanged' event
}
```

---

## 4. ESSENCE TRACKING AND SPENDING

### Storage
**localStorage Key**: `'playerEssence'` (also `'talentPoints'` used interchangeably)

### Essence Acquisition

#### Sources
1. **Level completion**: Variable reward based on level
   ```javascript
   this.essenceReward = 50 + (this.level - 1) * 25;
   // Level 1: 50, Level 2: 75, Level 3: 100, etc.
   ```
2. **Nexus stage**: Win condition gives essence
3. **Talent system**: Various passive bonuses affect essence gain

#### Tracking in Game
```javascript
this.currentEssence = 0;
this.essenceReward = 50;

// After level completion (lines 6279-6282)
this.currentEssence += this.essenceReward;
this.essenceText.setText(`${this.currentEssence}`);
```

### Essence Spending

#### Fusion Cost Formula
```javascript
getFusionCost(tier) {
    const baseCost = 10;
    return Math.floor(10 * Math.pow(2, tier - 1));
}
```

**Cost Scale**:
- Tier 1→2: 10 essence
- Tier 2→3: 20 essence
- Tier 3→4: 40 essence
- Tier 4→5: 80 essence
- Tier 5→6: 160 essence

#### Deduction Process (lines 18510-18512)
```javascript
const newEssence = playerEssence - fusionCost;
localStorage.setItem('playerEssence', newEssence.toString());
```

#### Error Handling (lines 18500-18503)
```javascript
if (playerEssence < fusionCost) {
    this.showFusionError(`Not enough essence! Need ${fusionCost} essence.`);
    return;
}
```

### Display Locations

1. **Pause Menu** (line 18184)
   - Updates from localStorage on pause
   - Real-time display: `Essence: ${playerEssence}`

2. **Nexus Screen** (line 7872)
   - Shows current essence at top of screen
   - Updates after talent purchases

3. **Win Screen** (lines 6295-6321)
   - Shows essence earned: `+${essenceReward} Essence Earned!`
   - Fade-out animation after 2.5 seconds

### Talent System Integration
File: `/c/Users/Alex/wizbiz/scripts/game.js` (lines 7993-8146)

```javascript
const talents = {
    'essence5%': {
        cost: 15,
        description: 'Essence Gain +5%',
        bonus: (bonuses) => bonuses.essenceGain += 0.05
    }
    // ... other talents
}

// Purchase logic (line 8053)
if (this.playerEssence >= cost) {
    this.playerEssence -= cost;
    // Apply talent
    localStorage.setItem('playerEssence', this.playerEssence.toString());
}
```

### Essence Display Updates
Three key UI elements track essence:
1. `essenceDisplayText` - Pause menu (updates on pause)
2. `essenceText` - Nexus/talent screen
3. Damage numbers and notifications show essence costs

---

## 5. KEY DATA STRUCTURES

### Element Storage
```javascript
// In game.js
this.chargeSlots = [];           // Active + Passive elements
this.elementPouch = [];           // Pouch storage
this.elementTiers = new Map();    // Key: `${element}_${index}`, Value: tier

// In ChargeSystem
this.charges = [];               // Active charges array
this.chargeCooldowns = [];       // Cooldown tracking
this.linkedCharges = new Set();  // Linked charge indices
this.chargeGroups = [];          // Grouped charges
```

### Configuration Maps
```javascript
this.elementConfig = {           // Element properties
    frame, color, name, sheet, fireRate, etc.
}

this.discoveredElements = [];    // Elements discovered (stored in localStorage)
```

### Events
```javascript
// ChargeSystem emits:
'chargesChanged'    → { charges, groups }
'chargeReplaced'    → { index, oldElement, newElement, charges, groups }
'chargeRemoved'     → { index, element, charges }
'chargesSwapped'    → { index1, index2, charges }
'linkToggled'       → { index, linked, groups }

// UIManager listens for updates
'chargesChanged', 'xpChanged', 'healthChanged', 'waveStarted'
```

---

## 6. IMPORTANT FILES REFERENCE

| File | Purpose |
|------|---------|
| `/c/Users/Alex/wizbiz/scripts/game.js` | Main game logic, pause menu, fusion implementation |
| `/c/Users/Alex/wizbiz/src/data/FusionRecipes.js` | Fusion recipe definitions |
| `/c/Users/Alex/wizbiz/src/systems/player/ChargeSystem.js` | Charge management and linking |
| `/c/Users/Alex/wizbiz/src/systems/ui/UIManager.js` | UI rendering and updates |
| `/c/Users/Alex/wizbiz/src/data/ElementConfig.js` | Element properties and descriptions |
| `/c/Users/Alex/wizbiz/src/data/GameConstants.js` | Game-wide configuration |

---

## 7. WORKFLOW EXAMPLE: FUSING TWO ELEMENTS

1. **User opens pause menu** (P or Start button)
   - Menu displays current charges and essence
   - Slots show socket graphics with element sprites

2. **User enters Fusion Mode**
   - Clicks "Swap Mode" button to toggle to "Fusion Mode"
   - Button changes color/text

3. **User drags element A to element B**
   - `dragstart` event sets `draggedCharge`
   - `drag` event updates position in real-time
   - `dragend` event triggers drop logic

4. **System processes drop**
   - Finds target slot (distance < 40px)
   - Checks both slots have different elements
   - Calls `attemptFusionInPauseMenu()`

5. **Fusion validation**
   - Checks if fusion recipe exists
   - Calculates cost from tier
   - Verifies player has enough essence

6. **Fusion execution**
   - Deducts essence from localStorage
   - Updates target slot with new element
   - Clears source slot
   - Marks element as discovered

7. **Visual feedback**
   - Burst animation at target slot
   - Success text: `"${ELEMENT_NAME} TIER 1!"`
   - Cost display: `-${COST} Essence`
   - Menu display refreshes

8. **Return to game**
   - Player closes pause menu (P or Start)
   - Charges system reflects new configuration

---

## 8. DEBUGGING NOTES

### Common Issues
- **Essence not updating**: Check localStorage key is exactly `'playerEssence'`
- **Drag not working**: Ensure pause menu depth is 900+ and has `setInteractive()`
- **Fusion failing**: Verify fusion recipe exists in FusionRecipes.js
- **Cost calculation wrong**: Check tier is correctly retrieved from `elementTiers` Map

### Console Access
```javascript
// Check current essence
localStorage.getItem('playerEssence')

// Set essence for testing
localStorage.setItem('playerEssence', '1000')

// Check discovered elements
JSON.parse(localStorage.getItem('discoveredElements'))
```

