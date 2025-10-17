# Hitbox System Guide

## Critical Findings

After extensive debugging, we discovered several important facts about how Phaser 3's physics system works with scaled sprites:

### 1. Body Position Property

**CRITICAL**: Phaser stores the actual collision position in `body.position.x` and `body.position.y`, NOT in `body.x` and `body.y`!

- `body.x` and `body.y` are **getter properties** that calculate values but don't reflect the actual collision position
- `body.position.x` and `body.position.y` are the **actual internal coordinates** used for collision detection
- The sprite editor and game must use `body.position` for accurate hitbox visualization

### 2. Body Size is Always Unscaled

**CRITICAL**: Phaser's collision system uses **UNSCALED body dimensions**, even when the sprite is scaled!

- If you set a body size to 25x30 pixels, it will be exactly 25x30 for collision
- This remains true even if the sprite is scaled to 1.4x or any other value
- The sprite may appear larger, but the collision box stays at the unscaled size

Example:
```javascript
sprite.setScale(1.4);  // Sprite displays at 140% size
body.setSize(25, 30);  // Collision box is exactly 25x30 pixels (NOT 35x42)
```

### 3. DisplayOrigin is Unscaled

`displayOriginX` and `displayOriginY` return **unscaled** values:
- They equal `originX * width` (NOT `originX * displayWidth`)
- When calculating sprite bounds, multiply by scale: `sprite.displayOriginX * scale`

### 4. Body Offset is Unscaled

`body.offset` values are stored in **unscaled sprite coordinates**:
- When you set `body.setOffset(10, 5)`, those are pixel values in the original sprite frame
- Phaser does NOT scale the offset when positioning the body
- The offset is applied directly to the unscaled coordinate system

## Correct Hitbox Visualization Formula

### In the Sprite Editor (enemy-sprite-editor.html):

```javascript
// Draw the hitbox at its actual collision position and size
const body = currentSprite.body;

// Use body.position for accurate position
// Use UNSCALED body.width and body.height for accurate size
hitboxGraphics.strokeRect(
    body.position.x,
    body.position.y,
    body.width,      // UNSCALED
    body.height      // UNSCALED
);
```

### Understanding the Coordinate System:

1. **Sprite Position**: `sprite.x, sprite.y` - where the sprite's origin point is
2. **Sprite Top-Left**: `sprite.x - (sprite.displayOriginX * scale), sprite.y - (sprite.displayOriginY * scale)`
3. **Body Position**: `body.position.x, body.position.y` - actual collision box top-left
4. **Body Size**: `body.width, body.height` - always unscaled dimensions

## How Hitbox Config Works

### Storage (hitbox-config.json):

```json
{
  "jellyfish": {
    "width": 49,      // Unscaled pixels
    "height": 56,     // Unscaled pixels
    "offsetX": 0,     // Unscaled pixels from sprite top-left
    "offsetY": 0      // Unscaled pixels from sprite top-left
  }
}
```

### Application (hitbox-config.js):

```javascript
applyHitbox: function(enemy, enemyType) {
    const config = this.hitboxes[enemyType];
    if (config) {
        // Apply unscaled values directly
        enemy.body.setSize(config.width, config.height);
        enemy.body.setOffset(config.offsetX, config.offsetY);
        return true;
    }
    return false;
}
```

## Workflow

### Adjusting Hitboxes:

1. Open sprite editor: `http://localhost:8081`
2. Select enemy from dropdown
3. Adjust hitbox using sliders (sliders show SCALED values for easier visual adjustment)
4. The green box shows where collision will actually occur (UNSCALED size)
5. Click "Save to Game" to update both `hitbox-config.js` and `hitbox-config.json`
6. Reload the game to see changes

### Slider Values vs Saved Values:

The sprite editor performs automatic conversion:
- **Sliders show**: Scaled values (easier to see relative to scaled sprite)
- **Saved values**: Unscaled values (what Phaser uses for collision)
- Conversion: `unscaled = scaled / sprite.scale`

Example for jellyfish at scale 1.4:
- Slider shows width: 70 (visual size)
- Saved width: 50 (70 / 1.4 = 50 unscaled pixels)
- Collision uses: 50 pixels exactly

## Common Issues

### Issue: Hitbox appears in different position in game vs editor
**Cause**: Using `body.x/body.y` instead of `body.position`
**Fix**: Always use `body.position.x` and `body.position.y`

### Issue: Hitbox appears larger/smaller than expected
**Cause**: Drawing body with scaled size instead of unscaled
**Fix**: Use `body.width` and `body.height` directly, don't multiply by scale

### Issue: Hitbox doesn't match between sprites at different scales
**Cause**: Inconsistent scale values in hitbox-config.js vs sprite-config.json
**Fix**: Ensure both configs have matching scale values for each sprite

## Testing Hitboxes

Enable Phaser's physics debug to see collision boxes:
1. Press the debug key in game (check key bindings)
2. Pink boxes show actual collision areas
3. Compare with sprite editor visualization
4. They should match exactly

## Files Involved

- `/scripts/hitbox-config.js` - Generated config loaded by game
- `/scripts/hitbox-config.json` - Source of truth for config data
- `/sprite-editor/sprite-config.json` - Sprite metadata including scales
- `/sprite-editor/enemy-sprite-editor.html` - Visual hitbox editor
- `/sprite-editor/run-editor.js` - Server that handles saving configs

## Key Takeaway

**The hitbox dimensions you set are ALWAYS in unscaled pixels, regardless of sprite scale. This ensures consistent, predictable collision behavior.**
