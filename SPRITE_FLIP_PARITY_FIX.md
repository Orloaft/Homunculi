# Sprite Flip Configuration Parity Fix

## Problem Identified

The sprite editor and game were showing different sprite orientations despite using the same config file.

**User Report**: "mushroom was upside down in editor, but in the game it was not upside down"

## Root Cause

The sprite editor server (`run-editor.js`) was using a regex pattern that only matched flip entries with **single quotes**:

```javascript
const flipPattern = /'([^']+)':\s*\{\s*flipX:\s*(true|false),\s*flipY:\s*(true|false)/g;
```

But the `hitbox-config.js` file actually uses **double quotes** (JSON style):

```javascript
"mushroom": {
    "flipX": false,
    "flipY": false
},
```

This caused:
1. **Editor**: Server failed to parse flip config → defaulted to `flipX: false, flipY: false` → showed sprites in default orientation
2. **Game**: Correctly read flip config from the JavaScript file → applied flips as configured

## The Fix

Updated the regex pattern in `/c/Users/Alex/wizbiz/sprite-editor/run-editor.js` (line 162) to handle both single quotes, double quotes, and quoted property names:

```javascript
// OLD (only matched single quotes):
const flipPattern = /'([^']+)':\s*\{\s*flipX:\s*(true|false),\s*flipY:\s*(true|false)/g;

// NEW (matches both single and double quotes):
const flipPattern = /['"]?([^'":\s]+)['"]?\s*:\s*\{\s*['"]?flipX['"]?\s*:\s*(true|false),\s*['"]?flipY['"]?\s*:\s*(true|false)/g;
```

## Flip Method Differences

The editor and game use different methods to flip sprites, but both achieve the same visual result:

**Sprite Editor** (`enemy-sprite-editor.html` lines 1448-1449):
```javascript
currentSprite.setScale(
    flipX ? -scale : scale,
    flipY ? -scale : scale
);
```
Uses negative scale values to flip.

**Game** (`hitbox-config.js` lines 313-314):
```javascript
if (flip.flipX) sprite.setFlipX(true);
if (flip.flipY) sprite.setFlipY(true);
```
Uses Phaser's built-in flip methods.

Both methods produce identical visual results when given the same flip configuration values.

## Mushroom Config Correction

The mushroom sprite PNG file is right-side-up (cap on top, feet on bottom). For the game to display it correctly, the config should be:

```json
"mushroom": {
  "flipX": false,
  "flipY": false
}
```

This was corrected in:
- `scripts/hitbox-config.json` (line 29)
- `scripts/hitbox-config.js` (line 50) - auto-updated

## Testing the Fix

1. **Restart the sprite editor server** to load the updated regex:
   ```bash
   cd sprite-editor
   node run-editor.js
   ```

2. **Open the sprite editor** at `http://localhost:8081`

3. **Load mushroom sprite** - it should now appear right-side-up (same as in-game)

4. **Verify other sprites** - all sprites should now match their in-game orientation

## Impact

This fix ensures parity between the sprite editor and the game. Any flip configuration changes made in the editor will now be reflected exactly in the game, and vice versa.

## Related Files Modified

1. `/c/Users/Alex/wizbiz/sprite-editor/run-editor.js` - Updated flip regex pattern
2. `/c/Users/Alex/wizbiz/scripts/hitbox-config.json` - Corrected mushroom flipY value
3. `/c/Users/Alex/wizbiz/scripts/hitbox-config.js` - Auto-updated from JSON

## Prevention

Going forward:
- The regex now handles both quote styles, preventing this issue from recurring
- Consider standardizing on either single or double quotes throughout the config file for consistency
- The sprite editor will now correctly load flip values regardless of quote style used
