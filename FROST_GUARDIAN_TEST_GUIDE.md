# 🧪 Frost Guardian Hitbox Test Guide

## 🎯 Test Objective
Verify that the Frost Guardian boss hitbox fixes are working correctly in the actual game.

## 📋 Expected Configuration
- **Hitbox**: 120x120 with offset (30, 30)
- **Scale**: 2.0
- **Flip**: flipX: true, flipY: false

## 🔧 Quick Configuration Test
1. Open: http://localhost:3000/frost-guardian-hitbox-test.html
2. This will automatically test the hitbox configuration
3. Look for "🎉 ALL CONFIGURATION VALUES ARE CORRECT!" message

## 🎮 Manual Game Test

### Step 1: Open Game
1. Navigate to: http://localhost:3000
2. Open Developer Tools (F12)
3. Go to Console tab
4. Keep console open throughout testing

### Step 2: Start Game
1. Click on the game canvas to start
2. Begin playing the game

### Step 3: Reach Snow Stage
The Frost Guardian appears in the snow stage (stage 4). You can:

**Option A: Play Normally**
- Progress through stages 1-3 to reach snow stage
- Each stage lasts about 60-90 seconds

**Option B: Use Debug Commands (if available)**
- In console, try: `game.scene.scenes[0].currentStage = 3`
- Wait for stage transition to snow

**Option C: Force Boss Spawn (if available)**
- In console, try: `game.scene.scenes[0].spawnSpecificBoss('frost-guardian-boss')`

### Step 4: Monitor Console Output
Look for these EXACT debug messages when Frost Guardian spawns:

```
[FROST GUARDIAN] About to apply hitbox config for frost-guardian-boss
[FROST GUARDIAN] hitboxConfig loaded: true
[FROST GUARDIAN] Available hitbox configs: [array of boss names]
[FROST GUARDIAN] frost-guardian-boss config: {width: 120, height: 120, offsetX: 30, offsetY: 30}
[HITBOX] Applied - Size: 120x120, Direct offset: (30, 30)
[FROST GUARDIAN] After hitbox config - Size: 120x120, Offset: (30, 30)
```

## ✅ Success Criteria

### Console Output ✅
- `[FROST GUARDIAN] hitboxConfig loaded: true`
- `[FROST GUARDIAN] frost-guardian-boss config:` shows correct values
- `[FROST GUARDIAN] After hitbox config - Size: 120x120, Offset: (30, 30)`

### Visual Verification ✅
- Boss appears at 2x scale (larger than default)
- Boss is flipped horizontally (facing left)
- Boss collision detection matches visual size

### Hitbox Accuracy ✅
- Player-boss collisions work properly
- Projectile-boss collisions work properly
- No "ghost" collisions outside visible sprite
- No missing collisions within visible sprite

## ❌ Failure Indicators

### Console Output ❌
- `[FROST GUARDIAN] hitboxConfig loaded: false`
- `[FROST GUARDIAN] After hitbox config - Size: 30x30` (default fallback)
- Missing debug messages entirely

### Visual Issues ❌
- Boss appears too small (default scale)
- Boss facing wrong direction (not flipped)
- Collision detection doesn't match sprite

## 🐛 Troubleshooting

### If Frost Guardian Doesn't Spawn
1. Check current stage: Look for stage indicator in game
2. Wait longer: Boss may take time to appear
3. Try restarting: Refresh page and try again

### If No Debug Messages Appear
1. Check console filters: Ensure no filters are hiding messages
2. Check for JavaScript errors: Look for red error messages
3. Verify game loaded: Check for other game-related console output

### If Configuration Is Wrong
1. Check hitbox-config.json: Verify configuration file has correct values
2. Check script loading: Ensure hitbox-config.js loaded properly
3. Check for conflicts: Look for other scripts overriding values

## 📊 Test Results Template

```
FROST GUARDIAN HITBOX TEST RESULTS
=====================================

Configuration Test:
□ hitbox-config.js loads successfully
□ frost-guardian-boss config exists
□ Hitbox: 120x120, offset: (30, 30)
□ Scale: 2.0
□ Flip: flipX: true, flipY: false

Game Test:
□ Reached snow stage successfully
□ Frost Guardian boss spawned
□ All debug messages appeared
□ Final hitbox size: 120x120, offset: (30, 30)

Visual Verification:
□ Boss appears scaled (2x size)
□ Boss is flipped horizontally
□ Collision detection matches sprite

Overall Result: ✅ PASS / ❌ FAIL

Notes:
[Add any additional observations]
```

## 🔍 Additional Debugging

If issues persist, capture these details:
1. Full console output (copy/paste all messages)
2. Screenshot of boss appearance
3. Browser and version used
4. Any JavaScript errors encountered

## 📁 Related Files
- `/scripts/hitbox-config.json` - Configuration values
- `/scripts/hitbox-config.js` - Configuration loader
- `/scripts/game.js` - Boss spawning and hitbox application
- `/src/entities/bosses/FrostGuardianBoss.js` - Boss class