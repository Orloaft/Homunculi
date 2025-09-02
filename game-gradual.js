// Load external utilities - safe extractions that don't affect performance
let debugManager;
try {
    // Try to load the extracted module if available
    if (typeof require !== 'undefined') {
        debugManager = require('./src/systems/utilities/DebugManager.js');
    }
} catch (e) {
    // Fallback to inline implementation if module loading fails
    debugManager = {
        debugEnabled: localStorage.getItem('debugMode') === 'true',
        isEnabled() { return this.debugEnabled; },
        setEnabled(enabled) { 
            this.debugEnabled = enabled;
            localStorage.setItem('debugMode', enabled.toString());
        },
        toggle() {
            this.debugEnabled = !this.debugEnabled;
            localStorage.setItem('debugMode', this.debugEnabled.toString());
            return this.debugEnabled;
        }
    };
}

// Original game code starts here with minimal modifications