# 🎮 Sprite Sheet Importer & Animation Editor

A comprehensive tool for importing sprite sheets and creating animation configurations for the game.

## Features

- **Upload Sprite Sheets**: Import any PNG/JPG sprite sheet
- **Auto Frame Detection**: Automatically detect frame boundaries
- **Visual Frame Selection**: Click to select frames for animations
- **Animation Preview**: Real-time preview of animations
- **Export Configurations**: Generate ready-to-use configuration code
- **Integration with SpriteConfig.js**: Directly add sprites to the game

## Quick Start

### 1. Launch the Sprite Importer

```bash
# Windows
run-sprite-importer.bat

# Linux/Mac
./run-sprite-importer.sh
```

The importer will open in your browser at `http://localhost:8082/sprite-importer.html`

### 2. Import a Sprite Sheet

1. Click "Choose Sprite Sheet" and select your image file
2. The sprite sheet will be displayed with a grid overlay

### 3. Configure Frames

1. Set the **Frame Width** and **Frame Height** to match your sprite sheet
2. The grid will automatically update to show frame boundaries
3. Optionally click "Auto-Detect Frames" for automatic detection

### 4. Define Entity Properties

- **Entity Name**: Unique identifier (e.g., "dragon", "goblin")
- **Entity Type**: Choose from enemy, boss, player, projectile, etc.
- **Category**: Stage or theme (e.g., "forest", "cave")
- **Properties**: Health, speed, damage, flying capability

### 5. Create Animations

1. **Select Frames**: Click on frames in the grid
   - Single click: Select one frame
   - Shift+Click: Range selection
   - Ctrl+Click: Toggle selection
   
2. **Name the Animation**: Common names:
   - `idle`: Standing still
   - `walk`: Moving animation
   - `attack`: Attack sequence
   - `death`: Death animation
   - `hurt`: Taking damage

3. **Set Animation Properties**:
   - **Frame Rate**: Speed of animation (FPS)
   - **Repeat**: Loop forever, play once, or custom repeat count

4. Click "Add Animation" to save

### 6. Preview Animations

Switch to the "Animation Preview" tab to:
- Play/Pause/Stop animations
- Adjust playback speed
- Verify animation looks correct

### 7. Export Configuration

Three export options:

#### Option A: Copy Configuration
```javascript
{
    "texture": "dragon-sprite",
    "path": "sprites/dragon.png",
    "frameWidth": 64,
    "frameHeight": 64,
    "animations": {
        "walk": {
            "key": "dragon-walk",
            "frames": [0, 1, 2, 3],
            "rate": 10,
            "repeat": -1
        }
    }
}
```

#### Option B: Generate Game Code
Generates ready-to-paste code for your game:

```javascript
// Preload
this.load.spritesheet('dragon-sprite', 'sprites/dragon.png', {
    frameWidth: 64,
    frameHeight: 64
});

// Create animations
this.anims.create({
    key: 'dragon-walk',
    frames: this.anims.generateFrameNumbers('dragon-sprite', { 
        frames: [0, 1, 2, 3] 
    }),
    frameRate: 10,
    repeat: -1
});
```

#### Option C: Add to SpriteConfig.js
Directly integrate with the game's sprite configuration system.

## Using the Sprite Config Manager

The sprite config manager provides command-line tools for managing sprites:

```bash
cd sprite-editor

# Add a new sprite from JSON
node sprite-config-manager.js add dragon dragon-config.json

# List all sprites
node sprite-config-manager.js list

# Show sprite details
node sprite-config-manager.js show dragon

# Generate game code
node sprite-config-manager.js code dragon

# Remove a sprite
node sprite-config-manager.js remove dragon

# Export HTML viewer
node sprite-config-manager.js export
```

## File Structure

After importing, place your sprite sheet files in the appropriate directory:

```
wizbiz/
├── sprites/           # Player sprites
├── enemies/          # Enemy sprites
├── bosses/           # Boss sprites
├── projectiles/      # Projectile sprites
├── effects/          # Visual effects
└── forestlandfoes/   # Stage-specific enemies
```

## Integration with Game Code

### 1. Add to Preload
In your game scene's `preload()` method:

```javascript
// Load the sprite sheet
this.load.spritesheet('my-sprite', 'path/to/sprite.png', {
    frameWidth: 32,
    frameHeight: 32
});
```

### 2. Create Animations
In your game scene's `create()` method:

```javascript
// Create the animation
this.anims.create({
    key: 'my-sprite-walk',
    frames: this.anims.generateFrameNumbers('my-sprite', { 
        start: 0, end: 3 
    }),
    frameRate: 10,
    repeat: -1
});
```

### 3. Use in Game
Create and play the sprite:

```javascript
const sprite = this.add.sprite(x, y, 'my-sprite');
sprite.play('my-sprite-walk');
sprite.setScale(2); // Adjust scale as needed
```

## Animation Best Practices

1. **Standard Animation Names**:
   - `idle`: Default standing animation
   - `walk` or `move`: Movement animation
   - `attack`: Attack animation
   - `death`: Death sequence
   - `hurt`: Damage reaction
   - `jump`: Jumping animation
   - `fall`: Falling animation

2. **Frame Rates**:
   - Walking: 8-12 FPS
   - Attacks: 10-15 FPS
   - Idle: 4-8 FPS
   - Death: 8-12 FPS (no repeat)

3. **Sprite Sheet Organization**:
   - Keep related animations in the same sheet
   - Use consistent frame sizes
   - Leave transparent padding around sprites
   - Use power-of-2 dimensions when possible (32, 64, 128, etc.)

## Troubleshooting

### Sprite doesn't appear
- Check the file path is correct
- Verify frame dimensions match the sprite sheet
- Ensure the texture key is unique

### Animation plays too fast/slow
- Adjust the frame rate in the animation configuration
- Use the preview to test different speeds

### Frames are cut off
- Verify frame width and height are correct
- Check for padding in the sprite sheet
- Use the grid overlay to align frames properly

## Advanced Features

### Batch Import
Import multiple sprites at once:

1. Prepare a folder with sprite sheets
2. Create a JSON manifest file
3. Use the batch import script

### Custom Frame Selection
For irregular sprite sheets:

1. Use Ctrl+Click to select non-sequential frames
2. Define custom frame arrays in animations
3. Preview to verify the sequence

### Hitbox Configuration
After importing sprites, use the existing sprite editor to:
1. Define hitboxes for collision
2. Set damage zones
3. Configure physics properties

## Tips

- **Naming Convention**: Use lowercase with hyphens (e.g., "fire-demon", "ice-wizard")
- **File Organization**: Group sprites by stage or type
- **Version Control**: Keep backups of SpriteConfig.js before major changes
- **Testing**: Always preview animations before exporting
- **Documentation**: Document special animations in comments

## Support

For issues or questions:
1. Check existing sprite configurations in `SpriteConfig.js`
2. Review the enemy sprite editor at `sprite-editor/enemy-sprite-editor.html`
3. Examine working examples in the `forestlandfoes/` directory