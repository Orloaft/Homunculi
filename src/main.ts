/**
 * WizBiz - Main TypeScript entry point
 *
 * NOTE: This file is currently not used by the main game, which runs from scripts/game.js
 * This is here as a TypeScript reference and for future migration.
 *
 * The actual game is loaded via index.html:
 * - scripts/game.js contains all game logic and scenes
 * - TypeScript systems (SaveManager, AchievementManager) are compiled separately
 */

import { GAME_CONFIG } from './data/GameConstants';

/**
 * TypeScript Phaser configuration template
 * Currently not instantiated - main game uses scripts/game.js
 */
export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    input: {
        gamepad: true
    },
    scene: [] // Scenes are defined in scripts/game.js
};

// Export for future use
export default config;
