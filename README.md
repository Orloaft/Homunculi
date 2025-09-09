# 🧙 WizBiz - Magical Combat Game

A fast-paced magical combat game featuring homunculi wizards battling through mystical worlds.

## 📁 Project Structure

```
wizbiz/
├── assets/             # All game assets
│   ├── audio/         # Music and sound effects
│   ├── images/        # UI images and backgrounds  
│   ├── sprites/       # Player character sprites
│   ├── enemies/       # Enemy sprites by stage
│   ├── bosses/        # Boss sprites and animations
│   ├── effects/       # Spell effects and particles
│   ├── obstacles/     # Environmental obstacles
│   └── ui/            # UI elements (planets, titles, buttons)
│
├── scripts/           # All JavaScript files
│   ├── game.js       # Main game logic
│   ├── phaser.min.js # Phaser game engine
│   └── ...           # Other game scripts
│
├── src/              # Source code modules
│   ├── scenes/       # Game scenes
│   ├── systems/      # Game systems
│   ├── entities/     # Game entities
│   └── data/         # Configuration data
│
├── sprite-editor/    # Sprite editing tools
├── docs/            # Documentation
└── dist/            # Build output

```

## 🚀 Quick Start

1. **Run the game locally:**
   ```bash
   npm start
   ```
   Or open `index.html` in a browser

2. **Build for Windows:**
   ```bash
   npm run build-win
   ```

3. **Sprite Editor:**
   ```bash
   run-sprite-editor.bat
   ```

4. **Sprite Importer:**
   ```bash
   run-sprite-importer.bat
   ```

## 🎮 Game Features

- **10 Unique Worlds**: Forest, Cave, Desert, Swamp, Snow, Ocean, Lava, Grave, Castle, and Spire
- **Element Fusion System**: Combine elements to create powerful spells
- **Co-op Mode**: Play with a friend
- **Boss Battles**: Epic boss fights with unique mechanics
- **Character Selection**: Multiple homunculi characters with unique abilities

## 🛠️ Development Tools

- **Sprite Editor**: Visual editor for sprites and hitboxes
- **Sprite Importer**: Import and configure new sprite sheets
- **Hitbox Editor**: Define collision areas for sprites

## 📚 Documentation

See the `docs/` folder for detailed documentation:
- `SPRITE_EDITOR_README.md` - Sprite editor guide
- `SPRITE_IMPORTER_README.md` - Sprite importer guide
- `GRADUAL_REFACTOR_PLAN.md` - Codebase refactoring plan

## 🎨 Asset Organization

- **Images**: All standalone images in `assets/images/`
- **Audio**: All music and SFX in `assets/audio/`
- **Sprites**: Character sprites organized by type
- **Enemies**: Enemy sprites organized by stage (forestlandfoes, cavelandfoes, etc.)
- **Bosses**: Boss sprites with their attack patterns
- **Effects**: Spell effects and animations
- **UI**: Interface elements, planet sprites, title screens

## 📦 Dependencies

- Phaser 3.60.0 - Game framework
- Electron - Desktop application wrapper
- Node.js - Build tools and scripts

## 🔧 Configuration

Main configuration files:
- `scripts/SpriteConfig.js` - Sprite definitions
- `scripts/hitbox-config.js` - Hitbox configurations
- `src/data/` - Game data configurations

## 🌟 Recent Updates

- ✅ Organized project structure with `scripts/` and `assets/` folders
- ✅ Added 3 new stages: Swampland, Snowland, and Oceanland
- ✅ Created sprite importer tool for easy sprite sheet integration
- ✅ Streamlined cutscene text for better pacing
- ✅ Fixed cutscene crash issues

## 🎯 Current Status

The game is actively in development with regular updates to content and features.