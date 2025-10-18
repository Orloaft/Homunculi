# Save System Debug Guide

## Issue: Still going to character select instead of save slot screen

The save system is implemented, but you may need to clear browser cache to see it work.

## Quick Fix: Clear Cache

1. **Hard Refresh** (usually fixes it):
   - **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
   - **Mac**: `Cmd + Shift + R`

2. **Clear Browser Cache** (if hard refresh doesn't work):
   - **Chrome/Edge**:
     - Press `F12` to open DevTools
     - Right-click the refresh button
     - Select "Empty Cache and Hard Reload"
   - **Firefox**:
     - `Ctrl + Shift + Delete`
     - Select "Cache" and time range
     - Click "Clear Now"

3. **Check the JavaScript file version**:
   - In `index.html`, the game.js has version `?v=169`
   - Try incrementing to `?v=170` to force reload

## Verify the Flow

### Check Console Logs:

When you press SPACE at title screen, you should see:

```
[Console Output - Step by Step]

1. Title Screen → Press SPACE:
   (Nothing logged yet, just transitions)

2. SaveSlotScene should appear with:
   - "SELECT SAVE SLOT" title
   - 3 empty slots showing "NEW GAME"
   - "BACK TO TITLE" button

3. Click "NEW GAME":
   Creating new save in slot 0
   ✅ Saved to slot 0
   ✅ Initialized AchievementManager

4. Now you should see character selection
   (4 tarot cards: Wizard, Orb, Blip, Grim)
```

## Debug in Browser Console

### 1. Check if SaveSlotScene exists:

```javascript
// Open browser console (F12) and run:
console.log(typeof SaveSlotScene);
// Should output: "function"

// Check if it's registered
console.log(game.scene.keys);
// Should include "SaveSlotScene"
```

### 2. Check if SaveManager exists:

```javascript
console.log(typeof SaveManager);
// Should output: "function"
```

### 3. Check TitleScene transition:

```javascript
// Get the title scene
const titleScene = game.scene.getScene('TitleScene');
console.log(titleScene.transitionToStageSelect.toString());
// Should show code that goes to 'SaveSlotScene'
```

### 4. Manually test save slot scene:

```javascript
// Force start save slot scene
const saveManager = new SaveManager();
game.scene.start('SaveSlotScene', { saveManager: saveManager });
```

## Current Flow (After Fix)

```
Title Screen
  ↓ (Press SPACE)
SaveSlotScene ("SELECT SAVE SLOT")
  ↓ (Click "NEW GAME" or "CONTINUE")
StageSelectScene (Character Selection Mode)
  ↓ (Select Character)
StageSelectScene (Stage Selection Mode)
  ↓ (Select Stage)
GameScene (Gameplay)
  ↓ (Complete/Fail)
GameOverScene
  ↓ (Auto-save if won)
  ↓ (Check achievements)
```

## Code Locations to Verify

1. **TitleScene.transitionToStageSelect()** (game.js lines 2644-2654):
   ```javascript
   this.scene.start('SaveSlotScene', {
       saveManager: this.saveManager,
       debugMode: this.debugEnabled
   });
   ```

2. **Scene Registration** (game.js line 49502):
   ```javascript
   scene: [LoadingScene, TitleScene, SaveSlotScene, StageSelectScene, ...]
   ```

3. **SaveSlotScene.startNewGame()** (SaveSlotScene.js lines 221-225):
   ```javascript
   this.scene.start('StageSelectScene', {
       saveManager: this.saveManager,
       newGame: true,
       fromTitle: true  // This triggers character selection
   });
   ```

## If Still Not Working

### Check File Loading Order in index.html:

Lines 145-149 should be:
```html
<!-- Save and Achievement Systems -->
<script src="src/systems/SaveManager.js"></script>
<script src="src/systems/AchievementManager.js"></script>
<script src="src/scenes/SaveSlotScene.js"></script>
<script src="src/ui/AchievementNotification.js"></script>
```

These MUST come BEFORE:
```html
<script src="scripts/game.js?v=169"></script>
```

### Check for JavaScript Errors:

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Common issues:
   - "SaveManager is not defined" → File not loaded
   - "SaveSlotScene is not defined" → File not loaded
   - Scene name typo (case-sensitive!)

## Test Incrementally

### Test 1: Can you manually start SaveSlotScene?

```javascript
// In browser console:
const sm = new SaveManager();
game.scene.start('SaveSlotScene', { saveManager: sm });
```

If this works → TitleScene isn't calling it correctly
If this fails → SaveSlotScene has an error

### Test 2: Check what TitleScene is actually doing:

```javascript
// Add temporary logging to TitleScene
// In game.js line 2651, temporarily add:
console.log('DEBUG: About to start SaveSlotScene');
this.scene.start('SaveSlotScene', {
    saveManager: this.saveManager,
    debugMode: this.debugEnabled
});
```

### Test 3: Force reload game.js:

In `index.html` line 151, change:
```html
<script src="scripts/game.js?v=169"></script>
```
to:
```html
<script src="scripts/game.js?v=170"></script>
```

## Success Indicators

✅ You know it's working when:
1. Press SPACE at title → See "SELECT SAVE SLOT" screen (not character select)
2. Click "NEW GAME" → See console log "Creating new save in slot 0"
3. After character select and stage complete → See "Auto-saved" log
4. Return to save slots → See save metadata displayed

## Common Mistakes

❌ **Mistake**: Not doing hard refresh after code changes
   **Fix**: `Ctrl + Shift + R`

❌ **Mistake**: Files loaded in wrong order
   **Fix**: SaveManager.js must come before game.js

❌ **Mistake**: Scene not registered
   **Fix**: Check game.js line 49502 includes SaveSlotScene

❌ **Mistake**: Typo in scene name (case matters!)
   **Fix**: Must be exactly 'SaveSlotScene' not 'saveSlotScene'

## Emergency Bypass

If you want to test the save system works but can't get to the scene:

```javascript
// In browser console:
// Create and test save manager directly
const sm = new SaveManager();
const am = new AchievementManager(sm);

// Create a save
sm.createNewSave(0);

// Add some data
sm.updateSave({
    stages: {
        completedStages: ['forest-1']
    },
    stats: {
        totalEnemiesDefeated: 50
    }
});

// Save it
sm.autoSave();

// Check achievements
console.log(am.checkAchievements());

// View the save
console.log(sm.getAllSaveSlots());
```
