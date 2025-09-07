const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;  // Different port to avoid conflicts

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Configuration for saving
const CONFIG_FILE = path.join(__dirname, 'sprite-config.json');
const HITBOX_CONFIG_FILE = path.join(__dirname, '..', 'hitbox-config.js');

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url}`);
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Handle POST requests for saving configuration
    if (req.method === 'POST' && req.url === '/save-config') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const config = JSON.parse(body);
                
                // Save sprite configuration
                fs.writeFileSync(CONFIG_FILE, JSON.stringify(config.sprites, null, 2));
                
                // Update hitbox-config.js if hitbox or shadow data is provided
                if (config.hitboxes || config.shadows) {
                    updateHitboxConfig(config.hitboxes || {}, config.shadows || {});
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Configuration saved' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // Handle GET requests for loading configuration
    if (req.method === 'GET' && req.url === '/load-config') {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const config = fs.readFileSync(CONFIG_FILE, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(config);
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Configuration not found' }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }
    
    // Decode URL to handle spaces and special characters
    const decodedUrl = decodeURIComponent(req.url);
    
    // Default to enemy-sprite-editor.html
    let filePath;
    if (decodedUrl === '/' || decodedUrl === '/index.html') {
        // Always serve the sprite editor HTML, never the game
        filePath = path.join(__dirname, 'enemy-sprite-editor.html');
    } else if (decodedUrl === '/enemy-sprite-editor.html') {
        filePath = path.join(__dirname, 'enemy-sprite-editor.html');
    } else {
        // Check if it's a sprite asset from parent directory
        const assetPaths = [
            '/mushroom/', '/tree/', '/forestlandfoes/', '/cavelandfoes/',
            '/Golem_1/', '/kobold/', '/newenemies/', '/bateye/',
            '/fireworm/', '/scythewraith/', '/homunculicharacters/',
            '/archerboss/', '/skeleton/', '/castlelandfoes/', '/desertlandfoes/',
            '/Obelisk_demo/', '/wizmove/', '/Eyelor/', '/Nekros/',
            '/bladekeeper/', '/flyingdemon/', '/impclub/', '/impaxe/', // Add imp folders
            'Bat-IdleFly9frames.png', 'obeliskBoss.png', 'voidkin15frames.png',
            'HitboxEditor.js', 'hitbox-config.js',
            // Add tile images for backgrounds
            'grass.PNG', 'stone.png', 'desert.png', 'lava.png', 'skullfloor.png'
        ];
        
        const isAsset = assetPaths.some(path => decodedUrl.includes(path));
        
        if (isAsset) {
            // Serve from parent directory ONLY for sprite assets
            filePath = path.join(__dirname, '..', decodedUrl.substring(1));
        } else {
            // Block access to game files
            console.log(`Blocked access to non-sprite file: ${decodedUrl}`);
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('403 Forbidden - This server only serves the sprite editor', 'utf-8');
            return;
        }
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                console.log(`File not found: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found', 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function updateHitboxConfig(hitboxes, shadows) {
    try {
        // Read the current hitbox-config.js
        let configContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
        
        // Update each enemy's hitbox configuration
        for (const [enemyType, hitbox] of Object.entries(hitboxes)) {
            // Pattern to match hitbox entry in the hitboxes object
            const hitboxPattern = new RegExp(
                `(hitboxes:\\s*{[^}]*${enemyType}:\\s*{[^}]*?)width:\\s*\\d+([^}]*?)height:\\s*\\d+([^}]*?)offsetX:\\s*-?\\d+([^}]*?)offsetY:\\s*-?\\d+`,
                's'
            );
            
            const replacement = `$1width: ${hitbox.width}$2height: ${hitbox.height}$3offsetX: ${hitbox.offsetX}$4offsetY: ${hitbox.offsetY}`;
            
            if (hitboxPattern.test(configContent)) {
                configContent = configContent.replace(hitboxPattern, replacement);
            } else {
                // If enemy doesn't exist in hitboxes, add it
                const hitboxInsertPattern = /hitboxes:\s*{([^}]*)}/s;
                const hitboxMatch = configContent.match(hitboxInsertPattern);
                if (hitboxMatch) {
                    const newEntry = `,
        ${enemyType}: { width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} }`;
                    const updatedHitboxes = hitboxMatch[0].replace(/}$/, newEntry + '\n    }');
                    configContent = configContent.replace(hitboxInsertPattern, updatedHitboxes);
                }
            }
        }
        
        // Update each enemy's shadow configuration
        for (const [enemyType, shadow] of Object.entries(shadows)) {
            // Pattern to match shadow entry in the shadows object
            const shadowPattern = new RegExp(
                `(shadows:\\s*{[^}]*${enemyType}:\\s*{[^}]*?)width:\\s*\\d+([^}]*?)height:\\s*\\d+([^}]*?)offsetX:\\s*-?\\d+([^}]*?)offsetY:\\s*-?\\d+([^}]*?)alpha:\\s*[\\d.]+`,
                's'
            );
            
            const replacement = `$1width: ${shadow.width}$2height: ${shadow.height}$3offsetX: ${shadow.offsetX}$4offsetY: ${shadow.offsetY}$5alpha: ${shadow.alpha}`;
            
            if (shadowPattern.test(configContent)) {
                configContent = configContent.replace(shadowPattern, replacement);
            } else {
                // If enemy doesn't exist in shadows, add it
                const shadowInsertPattern = /shadows:\s*{([^}]*)}/s;
                const shadowMatch = configContent.match(shadowInsertPattern);
                if (shadowMatch) {
                    const newEntry = `,
        ${enemyType}: { width: ${shadow.width}, height: ${shadow.height}, offsetX: ${shadow.offsetX}, offsetY: ${shadow.offsetY}, alpha: ${shadow.alpha} }`;
                    const updatedShadows = shadowMatch[0].replace(/}$/, newEntry + '\n    }');
                    configContent = configContent.replace(shadowInsertPattern, updatedShadows);
                }
            }
        }
        
        // Write back the updated configuration
        fs.writeFileSync(HITBOX_CONFIG_FILE, configContent);
        console.log('hitbox-config.js updated successfully with hitboxes and shadows');
    } catch (error) {
        console.error('Error updating hitbox-config.js:', error);
        throw error;
    }
}

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     Enemy Sprite & Hitbox Editor Server    ║
╠════════════════════════════════════════════╣
║  Server running at:                        ║
║  http://localhost:${PORT}/                     ║
║                                            ║
║  This is the SPRITE EDITOR, not the game! ║
║                                            ║
║  Features:                                 ║
║  - Edit sprite animations                  ║
║  - Adjust hitboxes visually               ║
║  - Save changes to game configuration     ║
║                                            ║
║  Press Ctrl+C to stop the server.         ║
╚════════════════════════════════════════════╝
    `);
});