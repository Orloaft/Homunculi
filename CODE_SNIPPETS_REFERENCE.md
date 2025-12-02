# Code Snippets Reference

## 1. FUSION LOGIC SNIPPETS

### Checking if Fusion is Valid
```javascript
import { getFusionResult } from '../../data/FusionRecipes.js';

const result = getFusionResult('fire', 'water');
// Returns: 'steam' or null if invalid
```

### Calculating Fusion Cost
```javascript
// Located in game.js line 18552
getFusionCost(currentTier) {
    const baseCost = 10;
    return Math.floor(baseCost * Math.pow(2, currentTier - 1));
    // Tier 1: 10, Tier 2: 20, Tier 3: 40, Tier 4: 80, etc.
}

// Usage
const cost = this.getFusionCost(2);  // Returns 20
```

### Performing a Fusion (Full Flow)
```javascript
attemptFusionInPauseMenu(sourceIndex, targetIndex, sourceElement, targetElement) {
    // 1. Get tiers
    const sourceTier = this.elementTiers.get(`${sourceElement}_${sourceIndex}`) || 1;
    const targetTier = this.elementTiers.get(`${targetElement}_${targetIndex}`) || 1;

    // 2. Try to get fusion result
    const fusionResult = this.getFusionResult(sourceElement, targetElement);
    if (!fusionResult) {
        this.showFusionError(`${sourceElement} and ${targetElement} cannot be fused!`);
        return;
    }

    // 3. Calculate cost
    const higherTier = Math.max(sourceTier, targetTier);
    const fusionCost = this.getFusionCost(higherTier);

    // 4. Check essence
    const playerEssence = parseInt(localStorage.getItem('playerEssence') || '0');
    if (playerEssence < fusionCost) {
        this.showFusionError(`Not enough essence! Need ${fusionCost} essence.`);
        return;
    }

    // 5. Perform fusion
    const newElement = fusionResult;
    const newTier = 1;

    // 6. Deduct essence
    const newEssence = playerEssence - fusionCost;
    localStorage.setItem('playerEssence', newEssence.toString());

    // 7. Update slots
    if (targetIndex < this.MAX_CHARGE_SLOTS) {
        this.chargeSlots[targetIndex] = newElement;
    } else {
        this.elementPouch[targetIndex - this.MAX_CHARGE_SLOTS] = newElement;
    }

    // 8. Update tier
    this.elementTiers.delete(`${targetElement}_${targetIndex}`);
    this.elementTiers.set(`${newElement}_${targetIndex}`, newTier);

    // 9. Clear source
    if (sourceIndex < this.MAX_CHARGE_SLOTS) {
        this.chargeSlots[sourceIndex] = null;
    } else {
        this.elementPouch[sourceIndex - this.MAX_CHARGE_SLOTS] = null;
    }
    this.elementTiers.delete(`${sourceElement}_${sourceIndex}`);

    // 10. Mark discovered
    if (!this.discoveredElements.includes(newElement)) {
        this.discoveredElements.push(newElement);
        localStorage.setItem('discoveredElements', JSON.stringify(this.discoveredElements));
    }

    // 11. Show feedback
    this.showFusionSuccess(targetIndex, newElement, newTier, fusionCost);
    this.updateChargeUI();
    this.updatePauseMenuDisplay();
}
```

---

## 2. PAUSE MENU DRAG & DROP SNIPPETS

### Drag Start Handler
```javascript
this.input.on('dragstart', (pointer, gameObject) => {
    // Check if this is one of our charge circles
    if (gameObject.getData('slotIndex') !== undefined && 
        this.pauseChargeSlots.some(slot => slot.circle === gameObject)) {
        
        this.draggedCharge = gameObject;
        gameObject.setAlpha(0.8);
        
        // Store the initial position relative to the container
        gameObject.setData('dragStartX', gameObject.x);
        gameObject.setData('dragStartY', gameObject.y);
    }
});
```

### Drag Movement Handler
```javascript
this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    if (this.draggedCharge === gameObject && this.pauseMenu.visible) {
        // Convert world coordinates to container-local coordinates
        gameObject.x = dragX - this.pauseMenu.x;
        gameObject.y = dragY - this.pauseMenu.y;
    }
});
```

### Drag End Handler (with Fusion Detection)
```javascript
this.input.on('dragend', (pointer, gameObject) => {
    if (this.draggedCharge === gameObject && this.pauseMenu.visible) {
        // Find which slot we're over
        let targetSlot = null;
        let targetIndex = -1;
        
        const currentX = gameObject.x;
        const currentY = gameObject.y;
        
        // Check distance to each slot
        this.pauseChargeSlots.forEach((slot, index) => {
            if (index < 12) {  // Check all 12 slots
                const dist = Phaser.Math.Distance.Between(
                    currentX, currentY,
                    slot.x, slot.y
                );
                if (dist < 40) {  // Distance threshold
                    targetSlot = slot;
                    targetIndex = index;
                }
            }
        });
        
        const sourceIndex = gameObject.getData('slotIndex');
        
        if (targetSlot && targetIndex !== -1 && targetIndex !== sourceIndex) {
            // Get source and target elements
            const sourceElement = sourceIndex < this.MAX_CHARGE_SLOTS ?
                this.chargeSlots[sourceIndex] :
                this.elementPouch[sourceIndex - this.MAX_CHARGE_SLOTS];
            
            const targetElement = targetIndex < this.MAX_CHARGE_SLOTS ?
                this.chargeSlots[targetIndex] :
                this.elementPouch[targetIndex - this.MAX_CHARGE_SLOTS];

            // Attempt fusion if different elements
            if (sourceElement && targetElement && sourceElement !== targetElement) {
                this.attemptFusionInPauseMenu(sourceIndex, targetIndex, sourceElement, targetElement);
            } else {
                // Otherwise swap
                this.swapCharges(sourceIndex, targetIndex);
            }
        } else {
            // Return to original position
            gameObject.x = gameObject.getData('originalX');
            gameObject.y = gameObject.getData('originalY');
        }
        
        gameObject.setAlpha(1);
        gameObject.setDepth(100);
        this.draggedCharge = null;
        
        // Update display
        this.updatePauseMenuDisplay();
    }
});
```

---

## 3. CHARGE SYSTEM SNIPPETS

### Adding a Charge
```javascript
import { ChargeSystem } from '../systems/player/ChargeSystem.js';

// In ChargeSystem.js (line 44)
addCharge(element) {
    if (this.charges.length < this.maxCharges) {
        this.charges.push(element);
        this.chargeCooldowns.push(0);
        this.updateChargeGroups();
        
        // Emit event for UI update
        this.scene.events.emit('chargesChanged', {
            charges: this.charges,
            groups: this.chargeGroups
        });
        
        return true;
    }
    return false;
}
```

### Swapping Charges
```javascript
swapCharges(index1, index2) {
    if (index1 >= 0 && index1 < this.charges.length &&
        index2 >= 0 && index2 < this.charges.length) {
        
        // Swap charges
        [this.charges[index1], this.charges[index2]] = 
        [this.charges[index2], this.charges[index1]];
        
        // Swap cooldowns
        [this.chargeCooldowns[index1], this.chargeCooldowns[index2]] = 
        [this.chargeCooldowns[index2], this.chargeCooldowns[index1]];
        
        // Update links
        const newLinkedCharges = new Set();
        for (const index of this.linkedCharges) {
            if (index === index1) newLinkedCharges.add(index2);
            else if (index === index2) newLinkedCharges.add(index1);
            else newLinkedCharges.add(index);
        }
        this.linkedCharges = newLinkedCharges;
        
        this.updateChargeGroups();
        
        // Emit event
        this.scene.events.emit('chargesSwapped', {
            index1,
            index2,
            charges: this.charges
        });
        
        return true;
    }
    return false;
}
```

### Linking Charges
```javascript
toggleLink(index) {
    if (index >= 0 && index < this.charges.length - 1) {
        if (this.linkedCharges.has(index)) {
            this.linkedCharges.delete(index);
        } else if (this.linkedCharges.size < this.linkSlots) {
            this.linkedCharges.add(index);
        } else {
            return false; // No available link slots
        }
        
        this.updateChargeGroups();
        
        // Emit event
        this.scene.events.emit('linkToggled', {
            index,
            linked: this.linkedCharges.has(index),
            groups: this.chargeGroups
        });
        
        return true;
    }
    return false;
}
```

### Updating Charge Groups
```javascript
updateChargeGroups() {
    this.chargeGroups = [];
    const processedIndices = new Set();
    
    for (let i = 0; i < this.charges.length; i++) {
        if (processedIndices.has(i)) continue;
        
        const group = [this.charges[i]];
        let currentIndex = i;
        processedIndices.add(i);
        
        // Follow the chain of links
        while (this.linkedCharges.has(currentIndex) && 
               currentIndex < this.charges.length - 1) {
            currentIndex++;
            group.push(this.charges[currentIndex]);
            processedIndices.add(currentIndex);
        }
        
        this.chargeGroups.push(group);
    }
}
```

---

## 4. ESSENCE TRACKING SNIPPETS

### Getting Current Essence
```javascript
// From localStorage
const essence = parseInt(localStorage.getItem('playerEssence') || '0');
console.log(`Current essence: ${essence}`);
```

### Setting Essence
```javascript
// Directly (careful, bypasses validation)
localStorage.setItem('playerEssence', '1000');

// Via deduction after fusion
const newEssence = currentEssence - cost;
localStorage.setItem('playerEssence', newEssence.toString());
```

### Updating Essence Display
```javascript
// In pause menu (line 18184)
const playerEssence = parseInt(localStorage.getItem('playerEssence') || '0');
this.essenceDisplayText = this.add.text(0, -170, `Essence: ${playerEssence}`, {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#ff88ff',
    fontStyle: 'bold'
}).setOrigin(0.5);
this.pauseMenu.add(this.essenceDisplayText);
```

### Essence Reward Formula
```javascript
// After level completion (line 6233)
this.essenceReward = 50 + (this.level - 1) * 25;

// Award it (line 6280)
this.currentEssence += this.essenceReward;
localStorage.setItem('playerEssence', this.currentEssence.toString());
```

---

## 5. ELEMENT CONFIGURATION SNIPPETS

### Getting Element Info
```javascript
import { ELEMENT_CONFIG } from '../../data/ElementConfig.js';

const fireConfig = ELEMENT_CONFIG['fire'];
// Returns: { 
//   frame: 0, 
//   color: '#ff4444', 
//   name: 'Fire', 
//   sheet: 'element-symbols', 
//   fireRate: 1.2 
// }
```

### Getting Element Description
```javascript
import { ELEMENT_DESCRIPTIONS } from '../../data/ElementConfig.js';

const description = ELEMENT_DESCRIPTIONS['fire'];
// Returns: "Burns enemies and leaves fire pools"
```

### All Available Elements
```javascript
// Primary elements (those you find in chests)
const PRIMARY = ['fire', 'water', 'earth', 'air', 'rock', 'poison'];

// All elements (26 total)
Object.keys(ELEMENT_CONFIG).forEach(element => {
    console.log(`${element}: ${ELEMENT_CONFIG[element].name}`);
});
```

---

## 6. COMMON DEBUGGING PATTERNS

### Check Pause Menu State
```javascript
console.log('Pause menu visible:', this.pauseMenu.visible);
console.log('Pause menu position:', {x: this.pauseMenu.x, y: this.pauseMenu.y});
console.log('Dragged charge:', this.draggedCharge);
```

### Verify Charge Slots
```javascript
console.log('Active slots:', this.chargeSlots.slice(0, this.MAX_ACTIVE_SLOTS));
console.log('Passive slots:', this.chargeSlots.slice(this.MAX_ACTIVE_SLOTS, this.MAX_CHARGE_SLOTS));
console.log('Pouch slots:', this.elementPouch);
```

### Check Essence Calculations
```javascript
const tier = 2;
const cost = this.getFusionCost(tier);
console.log(`Fusion cost for tier ${tier}: ${cost} essence`);

const playerEssence = parseInt(localStorage.getItem('playerEssence') || '0');
console.log(`Can afford? ${playerEssence >= cost}`);
```

### Verify Fusion Recipe
```javascript
import { getFusionResult } from '../../data/FusionRecipes.js';

const recipe = getFusionResult('fire', 'water');
console.log(`fire + water = ${recipe}`);  // Should be 'steam'
```

### Test Drag Target Detection
```javascript
// In dragend handler
console.log('Source index:', sourceIndex);
console.log('Target index:', targetIndex);
console.log('Target slot:', targetSlot);
console.log('Distance:', Phaser.Math.Distance.Between(currentX, currentY, slot.x, slot.y));
```

