// Electron-specific fixes for the game

// Add this to your index.html before loading game.js:
// <script src="electron-fixes.js"></script>

// Prevent WebGL context loss in Electron
if (window.require && window.process && window.process.type === 'renderer') {
    console.log('Running in Electron - applying fixes...');
    
    // Force garbage collection if available
    if (window.gc) {
        setInterval(() => {
            if (window.gc) {
                window.gc();
            }
        }, 30000); // Every 30 seconds
    }
    
    // Handle WebGL context loss
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('webglcontextlost', (event) => {
                console.log('WebGL context lost - preventing default behavior');
                event.preventDefault();
                
                // Try to restore context after a short delay
                setTimeout(() => {
                    console.log('Attempting to restore WebGL context...');
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    if (gl && gl.getExtension('WEBGL_lose_context')) {
                        const loseContext = gl.getExtension('WEBGL_lose_context');
                        if (loseContext) {
                            loseContext.restoreContext();
                        }
                    }
                }, 1000);
            });
            
            canvas.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored successfully');
            });
        }
    });
}