# Save/Load System - Testing Guide

## Quick Test Flow

### 1. First Time Launch

**Expected Flow**:
```
Title Screen → (Press SPACE) → Save Slot Selection → (Select Empty Slot) → Character Select → Stage Select → Gameplay
```

**What to Test**:
- ✅ Press SPACE or click "Press SPACE or A to Start"
- ✅ Should see "SELECT SAVE SLOT" screen with 3 empty slots
- ✅ Each slot shows "NEW GAME" button

### 2. Create New Save

**Steps**:
1. Click "NEW GAME" on Slot 1
2. Select a character (Wizard, Orb, Blip, or Grim)
3. Select a stage (Forest Land)
4. Play and complete the stage

**Expected Results**:
- Console log: `Creating new save in slot 0`
- Console log: `✅ Saved to slot 0`
- Console log: `✅ Initialized AchievementManager`

**After Stage Completion**:
- Console log: `[GameOverScene] Updated save data: {...}`
- Console log: `✅ Auto-saved after stage completion`
- If achievement unlocked: `🏆 Unlocked 1 achievement(s)!`

### 3. Return to Title and Check Save

**Steps**:
1. From Game Over screen, press ESC to return to title
2. Press SPACE again to go to save slot screen

**Expected Results**:
- Slot 1 should now show:
  - Level (e.g., "Level 1")
  - Current stage (e.g., "forest-1")
  - Completion % (e.g., "2% Complete")
  - Play time (e.g., "0h 2m")
  - Last saved timestamp
  - "CONTINUE" button
  - "DELETE" button

### 4. Continue Existing Save

**Steps**:
1. Click "CONTINUE" on an existing save slot

**Expected Results**:
- Console log: `Loading save from slot X`
- Console log: `✅ Loaded save and initialized AchievementManager`
- Should go to Character Select then Stage Select
- (TODO: Stage progression should be restored - currently placeholder)

### 5. Delete Save

**Steps**:
1. Click "DELETE" on an existing save slot
2. Confirmation modal appears: "DELETE SAVE FILE?" with warning
3. Click "DELETE" to confirm (or "CANCEL" to abort)

**Expected Results**:
- If confirmed: Slot becomes empty again, shows "NEW GAME"
- Console log: `🗑️ Deleted slot X`
- If cancelled: Modal closes, save remains

### 6. Multiple Saves

**Steps**:
1. Create saves in all 3 slots
2. Play different amounts on each

**Expected Results**:
- Each slot maintains separate progress
- Different levels, stages, play times
- Can switch between saves

## Achievement Testing

### Test "First Steps" Achievement

**Steps**:
1. Create new save
2. Complete first stage (Forest Land)

**Expected Results**:
- Console log: `🏆 Achievement Unlocked: First Steps`
- Console log: `💰 Awarded 100 gold`
- Visual notification appears in top-right corner
- Shows trophy icon, achievement name, description
- Slides in, shows for 4 seconds, slides out

### Check Achievement Progress

**In Browser Console**:
```javascript
// Get achievement manager from registry
const achievementManager = game.scene.scenes[0].registry.get('achievementManager');

// Check all achievements
console.log(achievementManager.getAllAchievements());

// Check completion stats
console.log(achievementManager.getCompletionStats());

// Check specific achievement progress
console.log(achievementManager.getProgress('monster-hunter'));
// Returns: { current: 15, target: 100, percentage: 15 }
```

## LocalStorage Inspection

### View Save Data in Browser Console:

```javascript
// View save slot 0
const slot0 = localStorage.getItem('wizbiz_save_0');
console.log(JSON.parse(slot0));

// View all save slots
for (let i = 0; i < 3; i++) {
    const save = localStorage.getItem(`wizbiz_save_${i}`);
    if (save) {
        console.log(`Slot ${i}:`, JSON.parse(save));
    } else {
        console.log(`Slot ${i}: Empty`);
    }
}

// Clear all saves (for testing)
localStorage.removeItem('wizbiz_save_0');
localStorage.removeItem('wizbiz_save_1');
localStorage.removeItem('wizbiz_save_2');
```

### Expected Save Data Structure:

```json
{
  "version": "1.0.0",
  "createdAt": 1234567890,
  "lastSaved": 1234567890,
  "playTime": 0,
  "player": {
    "level": 1,
    "experience": 0,
    "health": 100,
    "maxHealth": 100,
    "mana": 100,
    "maxMana": 100,
    "gold": 100,
    "element": "neutral"
  },
  "stages": {
    "currentStage": null,
    "completedStages": ["forest-1"],
    "stageStats": {
      "forest-1": {
        "attempts": 1,
        "bestTime": 120000,
        "deaths": 0
      }
    },
    "unlockedWorlds": ["forestland"]
  },
  "inventory": {
    "spells": ["fireball"],
    "items": [],
    "equipment": {
      "weapon": null,
      "armor": null,
      "accessory": null
    }
  },
  "upgrades": {
    "healthUpgrades": 0,
    "manaUpgrades": 0,
    "damageUpgrades": 0,
    "speedUpgrades": 0,
    "abilities": []
  },
  "achievements": {
    "unlocked": ["first-steps"],
    "progress": {}
  },
  "stats": {
    "totalEnemiesDefeated": 15,
    "totalBossesDefeated": 0,
    "totalDeaths": 0,
    "totalGoldCollected": 50,
    "totalDamageTaken": 0,
    "totalDamageDealt": 500,
    "favoriteSpell": null,
    "spellsCast": {}
  }
}
```

## Common Issues & Troubleshooting

### Issue: "SaveManager is not defined"
**Solution**: Check that `src/systems/SaveManager.js` is loaded in `index.html` before `game.js`

### Issue: SaveSlotScene doesn't appear
**Solution**:
1. Check browser console for errors
2. Verify SaveSlotScene is in the scene list in game.js (line 49387)
3. Check that TitleScene.transitionToStageSelect() goes to 'SaveSlotScene'

### Issue: No auto-save after completing stage
**Solution**:
1. Check that saveManager is in registry: `game.scene.scenes[0].registry.get('saveManager')`
2. Verify GameOverScene.init() receives `won: true`
3. Check browser console for save logs

### Issue: Achievements not unlocking
**Solution**:
1. Verify achievementManager is initialized: `game.scene.scenes[0].registry.get('achievementManager')`
2. Check achievement conditions in AchievementManager.js
3. Look for console logs showing achievement checks

### Issue: Save data too large
**Solution**:
- Check console for "Save data is very large" warning
- Review what's being stored in save data
- Consider compressing or reducing stored data

## Feature Checklist

After implementing the system, verify:

- [ ] Title screen → Save slot screen works
- [ ] Can create new save in empty slot
- [ ] Save metadata displays correctly
- [ ] Can continue existing save
- [ ] Delete confirmation works
- [ ] Auto-save triggers on stage complete
- [ ] Achievement "First Steps" unlocks
- [ ] Achievement notification appears
- [ ] Multiple save slots work independently
- [ ] localStorage persists across browser refresh
- [ ] Back button returns to title

## Next Steps (Future Enhancements)

1. **Stage Progression Restore**: Implement `loadFromSave()` in StageSelectScene to:
   - Show unlocked stages visually
   - Restore player level, gold, spells
   - Position on current stage

2. **Achievement Menu**: Create dedicated scene showing:
   - All achievements with unlock status
   - Progress bars
   - Filter by type
   - Completion percentage

3. **More Stat Tracking**: Hook up gameplay events to track:
   - Spell casts (for mastery achievements)
   - Damage dealt/taken (for glass cannon)
   - No-damage runs (for untouchable)
   - Play time updates

4. **Export/Import UI**: Add buttons in save slot scene to:
   - Export save as JSON file
   - Import save from JSON file
   - Backup all 3 saves

5. **Cloud Saves**: Optional backend integration for cloud backup
