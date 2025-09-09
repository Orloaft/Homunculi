# Gradual Refactor Implementation Plan

## Current Status
- Rolled back to stable commit: 8836f68 (8,187 lines)
- Created directory structure for gradual extraction
- Identified extraction candidates

## Phase 1 Strategy: Safe Extractions Only

### Week 1 Goals (NO performance-critical code)

#### 1. Configuration Extraction
**Safe to extract:**
- Game configuration object (lines 8168-8186)
- Debug mode settings
- Asset paths and definitions

**Implementation:**
1. Create `src/config/GameConfig.js` with configuration
2. Create `index-gradual.html` that loads both files
3. Test that game runs identically
4. Measure FPS to ensure no regression

#### 2. Asset Loading Helper
**Safe to extract:**
- Asset path definitions from LoadingScene
- Sprite sheet configurations

**Implementation:**
1. Create `src/systems/utilities/AssetLoader.js`
2. Keep preload() in LoadingScene but move asset definitions
3. Test loading performance

### Week 2 Goals

#### 3. Scene Transitions
**Safe to extract:**
- Scene transition logic between TitleScene and GameScene
- Victory/GameOver transition logic

**Implementation:**
1. Create `src/systems/utilities/SceneManager.js`
2. Keep scene classes intact, only extract transition helpers

### Testing Protocol
For EVERY extraction:
1. Run game before extraction - record FPS
2. Extract component
3. Run game after extraction - record FPS
4. If FPS drops >2%, revert immediately
5. Keep both versions running in parallel

### What NOT to Extract (Phase 1)
- ❌ update() methods
- ❌ Physics calculations
- ❌ Enemy spawn logic
- ❌ Collision detection
- ❌ Input handling in game loop
- ❌ Render loops

## Success Metrics
- Zero FPS regression (must maintain 60 FPS)
- Zero gameplay changes
- Ability to swap between monolithic and gradual versions

## Rollback Plan
If any extraction causes issues:
1. `git checkout game.js` to restore original
2. Document what went wrong
3. Try smaller extraction

## Next Steps
1. Start with GameConfig extraction
2. Create performance benchmark
3. Document each extraction's impact