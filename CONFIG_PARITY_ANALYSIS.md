# Configuration Parity Analysis

## Executive Summary

The hitbox configuration system has **critical violations of the single source of truth principle**. The `hitbox-config.js` file is intended to be the authoritative source for all sprite configuration, but in practice:

1. **Only 6 out of 41+ enemies** have proper hitbox data in the config file
2. **41 locations** in game code have hardcoded fallback values
3. **25 enemies** have invalid placeholder entries in the config
4. **Multiple regex patterns** in the sprite editor server failed to parse the actual config format

## Problems Identified

### 1. Quote Mismatch in Server Regex Patterns

**Issue**: The sprite editor server uses regex patterns that only match single quotes, but the config file uses double quotes.

**Impact**:
- Scales regex FAILED to load any enemy scales
- Flips regex FAILED to load any enemy flips (FIXED)
- Caused sprite editor to show different orientations than game

**Status**:
- ✅ FIXED: Flips regex (line 162)
- ✅ FIXED: Scales regex (line 102)
- ✅ Already working: Hitboxes regex (line 120)
- ✅ Already working: Shadows regex (line 140)

### 2. Incomplete Hitbox Data

**The Real Problem**: Most enemies don't have proper hitbox configuration.

**Current State of `hitbox-config.js`**:

| Configuration Type | Status |
|-------------------|--------|
| Proper hitbox entries | **6 enemies only** (wizard, test, frost-guardian-boss, torchboy, jellyfish, crabby) |
| Invalid placeholder entries | **25 enemies** with `"": number` format |
| Missing entries | **Many enemies** not in config at all |

**Invalid Placeholder Format**:
```javascript
"golem-blue": {
    "": 10  // ❌ Invalid - should have width, height, offsetX, offsetY
}
```

**Proper Format**:
```javascript
"wizard": {
    "width": 35,
    "height": 59,
    "offsetX": 27,
    "offsetY": 13
}
```

### 3. Hardcoded Fallback Values Violate Single Source of Truth

**Current Pattern** (PROBLEMATIC):
```javascript
// Apply hitbox from config or use defaults
if (!this.applyHitboxConfig(enemy, 'tree')) {
    enemy.body.setSize(26, 39);
    enemy.body.setOffset(3, 12);
}
```

**Why This Is Wrong**:
1. Creates **two sources of truth**: config file AND game code
2. When config is incomplete, game silently uses hardcoded values
3. No indication which enemies are using config vs fallback
4. Sprite editor can't discover or edit these hardcoded values
5. Changes in sprite editor won't affect enemies using fallback values
6. **HEADACHES**: Debugging requires checking both config AND source code

**41 Instances of Fallback Hitboxes**:
```
tree, bat, mushroom, giantfly, squirrel, redpanda, fireworm, summoner, soul,
bloboid, slime, fireslime, golem (multiple colors), skeletonseeker, cobra,
cactuse, armadillo, swampmerchant, torchboy, mudguard, eyewalker, eyegoompa,
snowy, elkman, frost-golem, spiked-slime, northerner, jellyfish, crabby,
shark, squid, crablore, obelisk-boss, archer-boss, demon-slime-boss,
eyelor-boss, frost-guardian-boss, nekros-boss
```

## The Solution: TRUE Single Source of Truth

### Phase 1: Fix Incomplete Config Data ✅ (In Progress)

1. **Populate missing hitbox entries** - Add proper `width`, `height`, `offsetX`, `offsetY` for all 41 enemies
2. **Convert placeholder entries** - Replace invalid `"": number` format with proper config
3. **Add missing enemies** - Ensure every enemy in the game has an entry

### Phase 2: Remove Hardcoded Fallbacks

**Current (WRONG)**:
```javascript
if (!this.applyHitboxConfig(enemy, 'tree')) {
    enemy.body.setSize(26, 39);  // Fallback violates single source of truth
    enemy.body.setOffset(3, 12);
}
```

**Proposed (CORRECT)**:
```javascript
// Config MUST exist - no fallbacks
this.applyHitboxConfig(enemy, 'tree');

// OR with error logging if config is critical:
if (!this.applyHitboxConfig(enemy, 'tree')) {
    console.error(`CRITICAL: Missing hitbox config for 'tree'!`);
    // Use a generic default that's obviously wrong so it gets fixed
    enemy.body.setSize(10, 10);
    enemy.body.setOffset(0, 0);
}
```

**Benefits**:
1. ✅ **One source of truth** - all hitbox data in config file
2. ✅ **Sprite editor works** - can see and edit all hitbox values
3. ✅ **Parity guaranteed** - editor and game use identical values
4. ✅ **Discoverable** - all values in one file, not scattered across code
5. ✅ **No surprises** - changes in editor ALWAYS affect game

### Phase 3: Config Validation

Add validation to ensure config completeness:

```javascript
// In hitbox-config.js load() function
load: function() {
    this.loaded = true;

    // Validate all required configs exist
    const missingHitboxes = [];
    const invalidHitboxes = [];

    for (const [enemy, config] of Object.entries(this.hitboxes)) {
        if (enemy === '') continue; // Skip placeholder

        if (!config.width || !config.height ||
            config.offsetX === undefined || config.offsetY === undefined) {
            invalidHitboxes.push(enemy);
        }
    }

    if (invalidHitboxes.length > 0) {
        console.warn('⚠️ Incomplete hitbox configs:', invalidHitboxes.join(', '));
    }

    console.log('Hitbox configuration loaded');
    return true;
}
```

## Migration Strategy

### Step 1: Export Current Hardcoded Values to Config

Create a script to extract all hardcoded hitbox values and add them to the config:

```javascript
// Tool to extract: scripts/game.js → hitbox-config.json
// Find all: if (!this.applyHitboxConfig(enemy, 'NAME')) {
//            enemy.body.setSize(W, H);
//            enemy.body.setOffset(X, Y);
```

### Step 2: Update Config File

Run the extraction tool, review values, update `hitbox-config.json`:

```json
{
  "hitboxes": {
    "tree": {
      "width": 26,
      "height": 39,
      "offsetX": 3,
      "offsetY": 12
    },
    "bat": {
      "width": 60,
      "height": 40,
      "offsetX": 45,
      "offsetY": 55
    },
    // ... all 41 enemies
  }
}
```

### Step 3: Remove Fallback Code

Replace all 41 instances of:
```javascript
if (!this.applyHitboxConfig(enemy, 'type')) {
    // fallback code
}
```

With:
```javascript
this.applyHitboxConfig(enemy, 'type');
```

### Step 4: Test & Verify

1. Run game, verify all enemies appear correct
2. Open sprite editor, verify all enemies load with config
3. Make changes in editor, verify they apply to game
4. No fallbacks should ever trigger

## Current Regex Status

| Section | Line | Pattern | Status |
|---------|------|---------|--------|
| Scales | 102 | `['"]?([^'":\s]+)['"]?\s*:\s*([\d.]+)` | ✅ FIXED |
| Hitboxes | 120 | `['"]?([^'":\s]+)['"]?\s*:\s*\{...` | ✅ Working |
| Shadows | 140 | `['"]?([^'":\s]+)['"]?\s*:\s*\{...` | ✅ Working |
| Flips | 162 | `['"]?([^'":\s]+)['"]?\s*:\s*\{...` | ✅ FIXED |

All regex patterns now handle both single and double quotes.

## Files Requiring Changes

### Immediate (Regex Fixes - DONE):
- ✅ `sprite-editor/run-editor.js` - Fixed scales and flips regex

### Next Steps (Data Migration):
- 📝 `scripts/hitbox-config.json` - Add 35+ missing hitbox entries
- 📝 `scripts/hitbox-config.js` - Auto-regenerate from JSON

### Final (Code Cleanup):
- 🔧 `scripts/game.js` - Remove all 41 fallback hitbox blocks
- 🔧 `hitbox-config.js` - Add validation in load() function

## Recommendation

**PRIORITY: HIGH**

The current state creates maintenance nightmares:
1. Developer changes hitbox in sprite editor → game doesn't change (uses fallback)
2. Developer tweaks fallback in code → sprite editor doesn't show it
3. No way to know which enemies use config vs fallback without reading code
4. Every new enemy requires updating TWO places

**Action Items**:
1. ✅ Fix regex patterns (COMPLETED)
2. ⏭️ Create extraction script for hardcoded values
3. ⏭️ Populate config file with all hitbox data
4. ⏭️ Remove all fallback code
5. ⏭️ Add config validation
6. ⏭️ Test thoroughly

This will establish `hitbox-config.js` as the TRUE single source of truth.
