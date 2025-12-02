# WIZBIZ DROP RATES - COMPLETE CODE REFERENCE
## Line-by-line breakdown of all probability mechanics

---

## SECTION 1: CHEST REWARD GENERATION

### File: scripts/game.js
**Lines 43410-43424: dropCacodemonChest() - Main chest reward distribution**

```javascript
// Line 43410-43424: Determine chest contents
const roll = Math.random();
if (roll < 0.7) {
    // 70% chance for random element
    const elements = ['fire', 'water', 'lightning', 'earth', 'air', 'ice', 'arcane', 
                     'poison', 'lava', 'steam', 'mud', 'dust', 'storm', 'blast', 
                     'volcano', 'crystal', 'sand', 'wave', 'meteor', 'gravity'];
    chest.itemType = 'element';
    chest.itemData = { element: elements[Math.floor(Math.random() * elements.length)] };
} else {
    // 30% chance for chess piece
    const chessPieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king', 'joker'];
    chest.itemType = 'element'; // Chess pieces use element system
    chest.itemData = { element: chessPieces[Math.floor(Math.random() * chessPieces.length)] };
}
```

**Key findings:**
- 20 primary elements, each with (70% / 20) = 3.5% drop rate
- 7 chess pieces, each with (30% / 7) = 4.29% drop rate
- No weighting - all are equally likely within their category

---

## SECTION 2: CHESS PIECE DEFINITIONS

### Lines 10814-10823: Element configuration for chess pieces

```javascript
// Chess passive orbs from chests/upgrades
bishop: { frame: 0, color: 0x9b59b6, name: 'Bishop', sheet: 'bishop-orb', isImage: true, fireRate: 999999 },
knight: { frame: 0, color: 0xffa500, name: 'Knight', sheet: 'knight-orb', isImage: true, fireRate: 999999 },
queen: { frame: 0, color: 0xffd700, name: 'Queen', sheet: 'queen-orb', isImage: true, fireRate: 999999 },
king: { frame: 0, color: 0xdc143c, name: 'King', sheet: 'king-orb', isImage: true, fireRate: 999999 },
pawn: { frame: 0, color: 0x708090, name: 'Pawn', sheet: 'pawn-orb', isImage: true, fireRate: 999999 },
saturn: { frame: 0, color: 0xffa500, name: 'Saturn', sheet: 'saturn-orb', isImage: true, fireRate: 999999 },
joker: { frame: 0, color: 0x800080, name: 'Joker', sheet: 'joker-orb', isImage: true, fireRate: 999999 },
rook: { frame: 0, color: 0x8b7355, name: 'Rook', sheet: 'rook-orb', isImage: true, fireRate: 999999 },
```

**All chess pieces:**
- Have fireRate: 999999 (passive, don't fire directly)
- Are image-based sprites, not animated frames
- Have unique colors for identification
- Each modifies projectile behavior differently

---

## SECTION 3: CATALYST DROPS

### Lines 23580-23585: High-health enemy catalyst drop

```javascript
// Lines 23580-23585: killEnemy() - Catalyst drop from enemies
if (enemy.maxHealth && enemy.maxHealth >= 20 && !enemy.isBoss) {
    // 50% chance to drop catalyst from high-health enemies
    if (Math.random() < 0.5) {
        this.dropCatalyst(enemyX, enemyY);
    }
}
```

**Conditions:**
- Enemy must have maxHealth >= 20
- Only non-boss enemies drop catalysts this way
- 50/50 chance when conditions met

### Lines 24596-24597: Consecutive six dice roll catalyst

```javascript
// Line 24596-24597: getDiceRollRewards() - Guaranteed catalyst on big combo
this.dropCatalyst(x, y + 20); // Guaranteed on 2+ consecutive sixes
```

**Trigger:** Rolling 2+ consecutive sixes in dice system = 100% catalyst

### Lines 24633-24634: Roll 5 catalyst chance

```javascript
// Line 24633-24634: Roll 5 catalyst drop
if (Math.random() < 0.1) {
    // 10% chance to drop catalyst on roll 5
    this.dropCatalyst(x, y + 20);
}
```

**Probability:** 10% on basic roll 5

### Lines 24624-24625: Roll 5 with high multiplier

```javascript
// Line 24624-24625: High multiplier roll 5
if (Math.random() < 0.2) {
    this.dropCatalyst(x + 20, y + 20); // 20% on multiplier >= 4
}
```

**Probability:** 20% when multiplier >= 4 on roll 5

---

## SECTION 4: MIND ORB DROPS

### Lines 24696-24698: Legendary combo (7+ multiplier)

```javascript
// Line 24696-24698: Legendary combo mind orb
if (Math.random() < 0.15) {
    // 15% chance to drop mind orb on legendary combo
    this.dropElementOrb(x, y - 20, 'mind');
}
```

**Trigger:** Multiplier >= 7 (5+ of a kind with bonus multiplier)
**Rate:** 15%

### Lines 24705-24707: Epic combo (5-6 multiplier)

```javascript
// Line 24705-24707: Epic combo mind orb
if (Math.random() < 0.1) {
    // 10% chance to drop mind orb on epic combo (keep - expands active slots)
    this.dropElementOrb(x - 25, y + 20, 'mind');
}
```

**Trigger:** Multiplier = 5-6 (4+ of a kind)
**Rate:** 10%

### Lines 24618-24619: Regular roll 5 mind orb

```javascript
// Line 24618-24619: Roll 5 basic mind orb
if (Math.random() < 0.05) {
    this.dropElementOrb(x, y + 20, 'mind');
}
```

**Trigger:** Any roll 5
**Rate:** 5%

---

## SECTION 5: ELITE ENEMY DROPS

### Lines 23727-23762: Elite death handler

```javascript
// Line 23727-23762: killEnemy() - Elite enemy death
} else if (enemy.isElite) {
    // Elite enemy death - drops reward chest
    enemy.setVelocity(0, 0);
    // ... visual effects ...
    this.tweens.add({
        targets: enemy,
        alpha: 0,
        duration: 500,
        onComplete: () => {
            // Drop 3-5 jewels - XP scales with wave
            const baseXP = 2;
            const waveBonus = Math.floor(this.currentWave / 2);
            const xpValue = baseXP + waveBonus;
            for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
                // Drop XP jewels
                this.dropJewel(deathX + offsetX, deathY + offsetY, xpValue, 0.075);
            }
            // Elite enemies always drop essence coins
            const eliteCoinValue = 3 + Math.floor(this.currentWave / 3);
            for (let i = 0; i < 2; i++) {
                this.dropCoin(deathX + offsetX, deathY + offsetY, eliteCoinValue, 1.8);
            }
            // Elite enemies drop reward chest (except golems)
            if (enemyType !== 'golem') {
                this.dropRewardChest(deathX, deathY);
            }
        }
    });
}
```

**What elite enemies drop:**
- 3-5 XP jewels (2-4 XP each, scales with wave)
- 2 essence coins (3+ value, scales with wave)
- 1 reward chest (100% for non-golems, 0% for golems)

---

## SECTION 6: ELITE SLIME SPLIT MECHANICS

### Lines 23695-23704: Splitting slime chest drop

```javascript
// Lines 23695-23704: killEnemy() - Elite slime split
if (generation < 2) {
    // Drop chest if this is an elite's first split (50% chance)
    if (enemy.isElite && generation === 0 && Math.random() < 0.5) {
        this.dropChest(deathX, deathY);
    }
    // Spawn 2 smaller slimes
    const offset = 20;
    this.spawnSplitSlime(deathX - offset, deathY, generation + 1, this.difficultyMultiplier);
    this.spawnSplitSlime(deathX + offset, deathY, generation + 1, this.difficultyMultiplier);
}
```

**Mechanics:**
- Only triggers on first split (generation === 0)
- Only for elite slimes (enemy.isElite)
- 50% chance to drop regular chest
- Creates 2 smaller slimes at generation + 1

---

## SECTION 7: TIER UPGRADE SYSTEM

### Lines 32978-32985: Tier upgrade on duplicate

```javascript
// Lines 32978-32985: collectElementOrb() - Tier upgrade logic
for (let i = 0; i < maxActiveSlots; i++) {
    if (wizard.chargeSlots[i] === orb.element) {
        // Found same element - upgrade its tier
        const tierKey = `${orb.element}_${i}`;
        const currentTier = wizard.elementTiers.get(tierKey) || 1;
        if (currentTier < 5) { // Max tier is 5
            wizard.elementTiers.set(tierKey, currentTier + 1);
            slotType = 'active';
            slotIndex = i;
            placed = true;
            isTierUpgrade = true;
            break;
        }
    }
}
```

**Key points:**
- Max tier is hardcoded as 5 (Line 32978)
- Duplicates automatically trigger tier upgrade
- Each tier upgrade requires exactly 1 duplicate
- Tier key includes element name and slot index

### Lines 44114-44117: Upgrade to next tier function

```javascript
// Lines 44114-44117: upgradeElementAtSlot()
const newTier = Math.min(currentTier + 1, 5);
// Set the new tier
this.elementTiers.set(`${element}_${slotIndex}`, newTier);
// Update UI to show the new tier
this.updateChargeUI();
```

---

## SECTION 8: XP REQUIREMENTS

### Lines 10178-10179: Initial XP setup

```javascript
// Initial player stats
this.playerXP = 0;
this.xpToNextLevel = 50; // Increased from 10 for slower progression
this.nextLevelElement = null;
```

**Starting point:** 50 XP needed for level 1

### Lines 25146-25156: XP scaling by level

```javascript
// Level up XP scaling
while (this.playerXP >= this.xpToNextLevel) {
    this.playerXP -= this.xpToNextLevel;
    
    if (this.playerLevel < 3) {
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.25); // 25% for 0-2
    } else if (this.playerLevel < 7) {
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.35); // 35% for 3-6
    } else if (this.playerLevel < 12) {
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.45); // 45% for 7-11
    } else if (this.playerLevel < 20) {
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.50); // 50% for 12-19
    } else {
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.60); // 60% for 20+
    }
}
```

**Scaling multipliers:**
- Levels 1-3: x1.25 per level (25% increase)
- Levels 4-7: x1.35 per level (35% increase)
- Levels 8-12: x1.45 per level (45% increase)
- Levels 13-20: x1.50 per level (50% increase)
- Levels 21+: x1.60 per level (60% increase)

### Lines 24732-24739: Base XP by enemy type

```javascript
// Lines 24732-24739: getEnemyBaseXP()
const xpTable = {
    'slime': 2,
    'tree': 2,
    'bat': 2,
    'mushroom': 2,
    'giantfly': 2,
    'squirrel': 2,
    'redpanda': 3,
    // ... more enemy types ...
};
```

---

## SECTION 9: PASSIVE UPGRADE SELECTION

### Lines 24856-24859: Level-up upgrade selection

```javascript
// Lines 24856-24859: showPassiveUpgradeSelection()
// Always include "element" as one option, get 2 random others
const upgradeOptions = ['element'];
const otherUpgrades = this.getRandomUpgrades(2, ['element']);
upgradeOptions.push(...otherUpgrades);
```

**Mechanics:**
- Always shows "Element" as option 1 (33.3% chance minimum)
- Gets 2 random non-element upgrades
- All 3 are equally weighted for selection

### Lines 25047-25088: Weighted upgrade selection

```javascript
// Lines 25047-25088: getRandomUpgrades()
getRandomUpgrades(count, exclude = []) {
    const definitions = this.getPassiveUpgradeDefinitions();
    const allUpgrades = Object.keys(definitions).filter(key => !exclude.includes(key));
    const selected = [];

    // Create weighted list (recent picks have lower weight)
    const weights = allUpgrades.map(key => {
        const timesOffered = this.upgradeHistory.filter(h => h === key).length;
        return Math.max(1, 10 - timesOffered * 2); // Reduce weight for repeated picks
    });

    for (let i = 0; i < count; i++) {
        // Weighted random selection
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;

        for (let j = 0; j < weights.length; j++) {
            random -= weights[j];
            if (random <= 0) {
                selectedIndex = j;
                break;
            }
        }
        // ... add to selected and update weights ...
    }
    return selected;
}
```

**Weighting system:**
- Base weight: 10 for all upgrades
- Each time offered: weight -= 2
- Recent picks are less likely to appear again
- Prevents same upgrade appearing multiple times in short sequence

---

## SECTION 10: CATALYST COLLECTION & FUSION

### Lines 32674-32741: collectCatalyst()

```javascript
// Lines 32674-32741: collectCatalyst()
collectCatalyst(wizard, catalyst) {
    if (!wizard || !catalyst || !catalyst.active || !catalyst.isCatalyst || catalyst.isDestroying) {
        return;
    }
    
    catalyst.active = false;
    if (!wizard.catalystCount) {
        wizard.catalystCount = 0;
    }
    wizard.catalystCount++;
    
    // Visual effect...
    const displayText = `+CATALYST (${wizard.catalystCount})`;
    // ... show floating text ...
}
```

**Mechanics:**
- Each catalyst pickup increments catalystCount
- Stored per wizard in multiplayer
- Max catalysts on floor: 10 (Line 10139)

### Lines 45409-45411: Fusion cost

```javascript
// Lines 45409-45411: selectChestReward() - Fusion requirements
if (this.player.catalystCount > 0) {
    // Valid fusion! Consume catalyst and perform fusion
    this.player.catalystCount--;
    // ... perform fusion ...
}
```

**Fusion requirements:**
- Requires at least 1 catalyst
- Exactly 1 catalyst consumed per fusion
- No fusion possible without catalyst

---

## SECTION 11: MIND ORB SOCKET EXPANSION

### Lines 32759-32820: collectElementOrb() - Mind orb handling

```javascript
// Lines 32759-32820: Special handling for Mind Orb
if (orb.element === 'mind') {
    if (radialMenu) {
        const currentCount = radialMenu.getSocketCount();
        if (currentCount.total < 12) {
            // Increase MAX_ACTIVE_SLOTS to ensure new slot is active
            this.MAX_ACTIVE_SLOTS++;
            this.MAX_CHARGE_SLOTS++;
            this.MAX_TOTAL_SLOTS++;
            wizard.chargeSlots.push(null);
            
            // Visual feedback
            const expandText = this.add.text(wizard.x, wizard.y - 50, 'ACTIVE SOCKET EXPANDED!', {
                fontSize: '24px',
                color: '#b8860b',
                fontStyle: 'bold'
            });
        } else {
            // Max sockets reached
            const maxText = this.add.text(wizard.x, wizard.y - 50, 'MAX SOCKETS!', {
                fontSize: '18px',
                color: '#ff8800',
                fontStyle: 'bold'
            });
        }
    }
    return; // Exit early - don't add to slots
}
```

**Mechanics:**
- Max total sockets: 12 (4 active + 4 passive + 4 pouch)
- Mind orb doesn't go into slot, just expands count
- Visual feedback when max reached
- Expansion is per-player in multiplayer

---

## SECTION 12: PASSIVE UPGRADE DEFINITIONS

### Lines 24800-24847: Available passive upgrades

```javascript
// Lines 24800-24847: getPassiveUpgradeDefinitions()
const defs = {
    'speed': {
        name: 'Haste',
        description: '+10% movement speed',
        icon: '⚡',
        effect: (count) => `Movement Speed +${count * 10}%`
    },
    // ... more upgrades ...
    'element': {
        name: 'Element Gift',
        description: 'Choose a new primary element',
        icon: '✨',
        effect: () => 'Select from 3 random elements'
    }
};
```

**Note:** Full list of passive upgrades needs separate analysis - multiple types available

---

## SUMMARY TABLE

| Mechanic | Percentage | Conditions | Code Line |
|----------|-----------|-----------|----------|
| Chest Element | 70% | Any chest drop | 43412 |
| Chest Chess | 30% | Any chest drop | 43420 |
| Each chess piece | 4.29% | 30% ÷ 7 types | 43421 |
| Catalyst (HP>=20) | 50% | Non-boss enemies | 23582 |
| Catalyst (roll 5) | 10% | Basic roll 5 | 24634 |
| Catalyst (roll 5+mult4) | 20% | Multiplier>=4 | 24624 |
| Catalyst (2x6) | 100% | Consecutive sixes | 24597 |
| Mind Orb (Legend) | 15% | Combo >=7x | 24697 |
| Mind Orb (Epic) | 10% | Combo 5-6x | 24706 |
| Mind Orb (Roll 5) | 5% | Basic roll 5 | 24618 |
| Elite chest | 100% | Non-golem elite | 23762 |
| Elite slime split | 50% | First generation | 23698 |
| Max tier | 5 | Hard limit | 32978 |
| Max sockets | 12 | Total limit | 32775 |
| Max catalysts | 10 | Floor items | 10139 |

