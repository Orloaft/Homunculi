/**
 * GameConfig.js - Extracted game configuration
 * This is a safe extraction that only contains static configuration
 */

// Store reference to scenes that will be defined in main game file
let gameScenes = [];

const GameConfig = {
    // Core game settings
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d5a27',
    pixelArt: true,
    antialias: false,
    
    // Physics configuration
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Will be set dynamically
        }
    },
    
    // Input configuration
    input: {
        gamepad: true
    },
    
    // Scene array will be set by main game
    scene: gameScenes,
    
    // Helper method to set scenes
    setScenes: function(scenes) {
        this.scene = scenes;
        gameScenes = scenes;
    },
    
    // Helper method to set debug mode
    setDebugMode: function(enabled) {
        this.physics.arcade.debug = enabled;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}