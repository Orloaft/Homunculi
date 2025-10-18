# Flip Offset Parity - PERMANENT FIX Applied

## Problem Solved

Your mushroom hitbox offset issue has been **permanently fixed** by updating the regeneration script itself.

## What Was Wrong

When you saved the mushroom's hitbox position from the sprite editor, the fix I initially applied to `hitbox-config.js` was **overwritten** because the sprite editor regenerates that entire file from scratch using `regenerate-hitbox-config.js`.

## The Permanent Solution

I updated `sprite-editor/regenerate-hitbox-config.js` (lines 115-164) to **include the flip coordinate adjustment code in the generated output**. Now every time the sprite editor saves, the fix will be included automatically.

### What Changed:

**File**: `sprite-editor/regenerate-hitbox-config.js`

The `applyHitbox()` function template now includes:

```javascript
// CRITICAL: Coordinate translation for flipped sprites
// The sprite editor uses negative scale to flip (e.g., scaleY = -0.7)
// The game uses setFlipY(true), which calculates offsets differently
// We need to translate coordinates from editor space to game space
let offsetX = config.offsetX;
let offsetY = config.offsetY;

// If sprite is vertically flipped, adjust Y offset
// Formula: offsetY_game = spriteHeight - offsetY_editor - hitboxHeight
if (enemy.flipY) {
    offsetY = enemy.height - config.offsetY - config.height;
    console.log(`[HITBOX] FlipY detected - Adjusted offsetY: ${config.offsetY} → ${offsetY}`);
}

// If sprite is horizontally flipped, adjust X offset
// Formula: offsetX_game = spriteWidth - offsetX_editor - hitboxWidth
if (enemy.flipX) {
    offsetX = enemy.width - config.offsetX - config.width;
    console.log(`[HITBOX] FlipX detected - Adjusted offsetX: ${config.offsetX} → ${offsetX}`);
}

enemy.body.setOffset(offsetX, offsetY);
```

## Current Status

✅ **Regeneration script updated** - Fix is now permanent
✅ **hitbox-config.js regenerated** - File now contains the fix
✅ **Mushroom config preserved** - Your flipY and hitbox settings are intact
✅ **Future-proof** - Any future sprite editor saves will include the fix

## Your Mushroom Config

From `hitbox-config.json` and now in `hitbox-config.js`:

```json
"mushroom": {
  "flipX": false,
  "flipY": true
}

"mushroom": {
  "width": 39,
  "height": 46,
  "offsetX": 59,
  "offsetY": 46
}
```

## Testing

When you test the mushroom in game now, you should see:

**Console Output**:
```
[HITBOX] Applying for mushroom: {width: 39, height: 46, offsetX: 59, offsetY: 46}
[HITBOX] Sprite info - Scale: 0.7, Origin: (0.5, 0.5)
[HITBOX] Sprite dimensions - Width: 128, Height: 128
[HITBOX] Flip state - flipX: false, flipY: true
[HITBOX] FlipY detected - Adjusted offsetY: 46 → 36
[HITBOX] Applied - Size: 39x46, Offset: (59, 36)
```

**Visual Result**:
- Mushroom sprite appears upside-down (flipY working)
- Hitbox is **centered on the sprite body** (no offset gap)
- Collision detection feels correct

## Why This Is Permanent

Previously, the fix was only in the generated file (`hitbox-config.js`). When the sprite editor saved, it ran `regenerate-hitbox-config.js` which overwrote the entire file without the fix.

Now the fix is **in the template** (`regenerate-hitbox-config.js`), so every regeneration includes it automatically.

## Files Modified

1. ✅ `sprite-editor/regenerate-hitbox-config.js` - Template updated with flip fix
2. ✅ `scripts/hitbox-config.js` - Regenerated with fix included

## Next Steps

1. **Test the game** - Start the game and test the mushroom enemy in Forest Land
2. **Verify console logs** - Check that the flip adjustment is being applied
3. **Test sprite editor** - Load mushroom in editor, verify parity with game
4. **Test bloboid** - This enemy has both flipX and flipY, tests both adjustments
5. **If all works**, commit the changes using the command in FLIP_OFFSET_FIX_SUMMARY.md

## Impact

**Affected Sprites**:
- `mushroom`: flipY=true - Y offset now auto-corrected
- `bloboid`: flipX=true, flipY=true - Both X and Y offsets auto-corrected

**All other sprites**: No change (non-flipped sprites bypass the adjustment logic)

---

**Status**: ✅ PERMANENT FIX APPLIED - Ready for testing
