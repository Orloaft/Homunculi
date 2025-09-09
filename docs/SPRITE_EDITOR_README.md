# Sprite & Hitbox Editor

A visual tool for editing enemy sprites and hitboxes in the game.

## Features

- **Visual Sprite Editor**: See and adjust sprite animations in real-time
- **Hitbox Editor**: Visually adjust collision boxes for each enemy
- **Animation Control**: Play, pause, and adjust animation speeds
- **Save to Game**: Changes are saved directly to the game configuration
- **Load from Game**: Load existing configurations for modification

## How to Run

### Windows:
```bash
# From the main game directory
run-sprite-editor.bat
```

### Linux/Mac:
```bash
# From the main game directory
./run-sprite-editor.sh
```

### Manual:
```bash
cd sprite-editor
node run-editor.js
```

Then open http://localhost:8081/ in your browser.

## Usage

1. **Select Enemy**: Use the dropdown to choose an enemy to edit
2. **Adjust Settings**: 
   - Use sliders to modify scale, animation speed
   - Toggle hitbox visibility
   - Switch between animations
3. **Edit Hitbox**: 
   - Enable "Edit Hitbox" mode
   - Drag the corners to resize
   - Drag the center to reposition
4. **Save Changes**: 
   - Click "Save to Game" to apply changes
   - Changes are written to:
     - `sprite-config.json` (sprite settings)
     - `../HitboxConfig.js` (hitbox settings)

## Configuration Files

- **SpriteConfig.js**: Main sprite configuration shared with the game
- **HitboxConfig.js**: Hitbox dimensions and offsets
- **sprite-config.json**: Saved editor configurations

## Important Notes

- The editor runs on port 8081 (different from the game)
- Changes require a game reload to take effect
- Sprite dimensions must match the actual image files
- Frame counts are embedded in filenames (e.g., "walk8frames.png")