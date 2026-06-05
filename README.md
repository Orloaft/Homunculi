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

Requires Node.js 20-25. Node 26 is currently blocked because it can leave Electron's binary install incomplete.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the game locally:**
   ```bash
   npm start
   ```
   `npm start` compiles the TypeScript systems first, because `index.html` loads generated files from `build/`. The local Electron command also uses development-safe Linux flags so a fresh install can launch without root-owned Electron sandbox files or GPU process support.

3. **Compile without starting Electron:**
   ```bash
   npm run compile
   ```

4. **Run smoke checks:**
   ```bash
   npm run verify:smoke
   ```

5. **Build the Windows portable package:**
   ```bash
   npm run build-win-portable
   ```
   `npm run build-portable` is kept as an alias for the Windows portable target.

6. **Run the full release gate before packaging for distribution:**
   ```bash
   npm run verify:release
   ```

7. **Sprite Editor:**
   ```bash
   run-sprite-editor.bat
   ```

8. **Sprite Importer:**
   ```bash
   run-sprite-importer.bat
   ```

### Start Troubleshooting

If `npm start` fails with `Electron failed to install correctly`, check the active Node version:

```bash
node -v
```

Use Node.js 20-25, then refresh Electron's local binary install:

```bash
trash node_modules/electron
npm install
```

If `trash` is unavailable, move `node_modules/electron` aside or delete only that folder, then rerun `npm install`.

## 🎮 Game Features

- **Release-backed world path**: Forest, Cave, Sand, Swamp, Snow, Ocean, Lava, Grave, and Castle, with Spire and Void parked for later expansion work
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

- Phaser 3.90.0 - Game framework
- Electron - Desktop application wrapper
- Node.js 20-25 - Build tools and scripts

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
