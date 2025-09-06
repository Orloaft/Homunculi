# Sprite Editor Tools

This folder contains tools for editing and testing enemy sprites, animations, and hitboxes.

## Files

### Main Tools
- **enemy-sprite-editor.html** - Full-featured sprite editor with animation preview and hitbox adjustment
- **enemy-sprite-editor-simple.html** - Simplified hitbox editor (works without sprite files)
- **test-enemy-animations.html** - Test suite for enemy animations
- **test-spell-system.html** - Test suite for spell system

### Server Files
- **serve-editor.js** - Node.js server to serve files (required for sprite loading)
- **run-sprite-editor.bat** - Batch file to easily start the server

## How to Use

### Method 1: Using the Server (Recommended)
1. Run the server:
   ```
   node serve-editor.js
   ```
   Or double-click `run-sprite-editor.bat`

2. Open your browser and go to:
   ```
   http://localhost:8080/
   ```

### Method 2: Simple Editor (No Server Required)
Open `enemy-sprite-editor-simple.html` directly in your browser. This version doesn't show actual sprites but lets you configure hitboxes visually.

## Features

### Enemy Sprite Editor
- Live animation preview (walk, death, attack)
- Visual hitbox overlay on sprites
- Adjustable sprite scale (0.1x to 5x)
- Hitbox width, height, and offset controls
- Animation speed adjustment
- Grid overlay option
- Dark/light background toggle
- Export configuration as JSON
- Save/load configurations

### Test Suites
- Test all enemy animations
- Verify sprite loading
- Test spell system animations

## Configuration Export

The editor exports configuration in this format:
```json
{
  "hitboxes": {
    "enemyName": {
      "width": 30,
      "height": 30,
      "offsetX": 0,
      "offsetY": 0
    }
  },
  "scales": {
    "enemyName": 1.5
  }
}
```

This can be used directly in the main game.js file for enemy configuration.