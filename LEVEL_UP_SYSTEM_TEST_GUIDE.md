# Level Up System Test Guide

## Overview
The level up system has been completely overhauled with 6 new passive upgrades. This guide will help you manually test all the new features.

## New Passive Upgrades

### 1. Phoenix Heart (Revive)
- **Description**: Revive once with 25% health on death
- **Icon**: 🔥
- **How to test**:
  1. Acquire the Phoenix Heart upgrade
  2. Take damage until you die (set health to 0)
  3. You should see "🔥 PHOENIX REVIVE! 🔥" message
  4. Health should restore to 25% of max
  5. Character should flash orange and be invulnerable for 2 seconds
  6. Revive counter should decrease by 1
  7. You can only revive once per life (hasUsedRevive flag)

### 2. Magnitude (Spell Area)
- **Description**: Increase projectile size by 10%
- **Icon**: 🔵
- **How to test**:
  1. Note the current size of your spell projectiles
  2. Acquire Magnitude upgrade
  3. Projectiles should appear 10% larger
  4. Stack multiple times to see cumulative effect
  5. **Note**: This requires wiring to projectile creation code (may not be active yet)

### 3. Swift Stride (Move Speed)
- **Description**: Increase movement speed by 25%
- **Icon**: 👟
- **How to test**:
  1. Move around and note your movement speed
  2. Acquire Swift Stride upgrade
  3. You should move 25% faster
  4. Stack multiple times to see cumulative effect
  5. **Note**: This requires wiring to movement code (may not be active yet)

### 4. Vitality Surge (Max Health)
- **Description**: Increase maximum HP by 50%
- **Icon**: ❤️
- **How to test**:
  1. Note your current max HP (check HP bar)
  2. Acquire Vitality Surge upgrade
  3. Max HP should increase by 50%
  4. Current HP should also increase by the same amount (instant heal)
  5. HP bar should update to show new max

### 5. Power Amplification (Damage)
- **Description**: Increase spell damage by 20%
- **Icon**: ⚔️
- **How to test**:
  1. Note how much damage your spells deal to enemies
  2. Acquire Power Amplification upgrade
  3. Spells should deal 20% more damage
  4. Stack multiple times to see cumulative effect
  5. **Note**: This requires wiring to damage calculation code (may not be active yet)

### 6. Extra Slot (Slot Increase)
- **Description**: Add 1 charge slot to radial menu
- **Icon**: ➕
- **How to test**:
  1. Note your current number of charge slots in the radial menu
  2. Acquire Extra Slot upgrade
  3. You should see message "+1 Charge Slot! (X total)"
  4. Radial menu should update with one additional slot
  5. You can now hold one more charge

## Test Checklist

### Basic Functionality
- [ ] Level up triggers passive upgrade selection UI
- [ ] UI shows 3 random upgrade options
- [ ] Each option shows icon, name, and description
- [ ] Can select an upgrade with mouse/keyboard
- [ ] Selection properly applies the upgrade
- [ ] Game resumes after selection

### Upgrade Tracking
- [ ] passiveUpgrades object correctly tracks stacks
- [ ] Can acquire multiple stacks of same upgrade
- [ ] Upgrade effects show correct stack counts
- [ ] All 6 upgrade types can appear in selections

### Revive Mechanic
- [ ] Revive upgrade can be acquired
- [ ] Death triggers revive when available
- [ ] Revive restores 25% health
- [ ] Visual effects appear (text, flash, tint)
- [ ] 2-second invulnerability period after revive
- [ ] Revive counter decrements after use
- [ ] hasUsedRevive flag prevents multiple revives in same life
- [ ] Player dies normally when no revives available

### Max Health Upgrade
- [ ] Max HP increases by 50% of current max
- [ ] Current HP increases by same amount (instant heal)
- [ ] HP bar updates correctly
- [ ] Multiple stacks compound correctly

### Slot Increase Upgrade
- [ ] maxCharges increases by 1
- [ ] Notification appears with count
- [ ] Radial menu UI updates to show new slot
- [ ] Can use the additional slot

### Integration Tests
- [ ] All upgrades persist through game session
- [ ] Upgrades work correctly with existing game systems
- [ ] No console errors when acquiring upgrades
- [ ] No crashes during gameplay with upgrades active

## Known Implementation Status

### Fully Implemented ✅
- Revive mechanic (Phoenix Heart) - Complete with visuals and logic
- Max Health increase (Vitality Surge) - Complete with instant heal
- Slot Increase (Extra Slot) - Complete with UI update

### Needs Wiring 🔧
The following upgrades are tracked but need to be wired to gameplay systems:

1. **Spell Area (Magnitude)**: Need to apply `passiveUpgrades.spellArea` multiplier when creating projectiles
   - Look for projectile creation code
   - Apply scale multiplier: `scale * (1 + passiveUpgrades.spellArea * 0.1)`

2. **Move Speed (Swift Stride)**: Need to apply `passiveUpgrades.moveSpeed` multiplier to player movement
   - Look for movement velocity calculation in update loop
   - Apply speed multiplier: `velocity * (1 + passiveUpgrades.moveSpeed * 0.25)`

3. **Damage (Power Amplification)**: Need to apply `passiveUpgrades.damage` multiplier to damage calculations
   - Look for damage dealing code in collision handlers
   - Apply damage multiplier: `damage * (1 + passiveUpgrades.damage * 0.2)`

## Quick Test Commands (Developer Console)

Open browser console (F12) while game is running:

```javascript
// Get game scene
const scene = game.scene.scenes[0];

// Force level up
scene.experience = scene.experienceNeeded;
scene.levelUp();

// Check current upgrades
console.log(scene.passiveUpgrades);

// Check player stats
console.log({
  health: scene.playerHealth,
  maxHealth: scene.maxHealth,
  maxCharges: scene.maxCharges,
  hasUsedRevive: scene.hasUsedRevive
});

// Force acquire specific upgrade (for testing)
scene.applyPassiveUpgrade('revive');
scene.applyPassiveUpgrade('maxHealth');
scene.applyPassiveUpgrade('slotIncrease');

// Test revive (kill player)
scene.playerHealth = 0;
scene.checkPlayerDeath();
```

## Expected Results

All upgrade acquisitions should:
1. Update the `passiveUpgrades` object
2. Show appropriate visual feedback
3. Apply the effect immediately (where applicable)
4. Work correctly with multiple stacks
5. Persist through the game session

## Notes

- Old upgrade system (21 upgrades) has been completely removed
- New system is cleaner with 6 focused, impactful upgrades
- Some upgrades require additional wiring to gameplay systems
- Revive, Max Health, and Slot Increase are fully functional
