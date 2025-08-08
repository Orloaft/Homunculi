import LoadingScene from './scenes/LoadingScene.js';
import TitleScene from './scenes/TitleScene.js';
import StageSelectScene from './scenes/StageSelectScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import { GAME_CONFIG } from './data/GameConstants.js';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    input: {
        gamepad: true
    },
    scene: [LoadingScene, TitleScene, StageSelectScene, GameScene, GameOverScene]
};

// Create the game
const game = new Phaser.Game(config);

// Make game instance globally available for debugging
window.game = game;