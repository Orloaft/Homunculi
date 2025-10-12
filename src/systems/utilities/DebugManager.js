/**
 * DebugManager - Handles debug mode state and persistence
 * This is a safe extraction that doesn't affect game loop performance
 */
class DebugManager {
    constructor() {
        this.debugEnabled = this.loadDebugState();
    }
    /**
     * Load debug state from localStorage
     */
    loadDebugState() {
        try {
            return localStorage.getItem('debugMode') === 'true';
        } catch (e) {
            return false;
        }
    }
    /**
     * Save debug state to localStorage
     */
    saveDebugState(enabled) {
        try {
            localStorage.setItem('debugMode', enabled.toString());
            this.debugEnabled = enabled;
        } catch (e) {
            }
    }
    /**
     * Toggle debug mode
     */
    toggle() {
        this.saveDebugState(!this.debugEnabled);
        return this.debugEnabled;
    }
    /**
     * Get current debug state
     */
    isEnabled() {
        return this.debugEnabled;
    }
    /**
     * Set debug state
     */
    setEnabled(enabled) {
        this.saveDebugState(enabled);
    }
}
// Export as singleton
const debugManager = new DebugManager();
// For compatibility with existing code
if (typeof module !== 'undefined' && module.exports) {
    module.exports = debugManager;
}