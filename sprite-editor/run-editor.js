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
const HITBOX_CONFIG_FILE = path.join(__dirname, '..', 'scripts', 'hitbox-config.js');

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
                
                // Log received config for debugging
                console.log('=== RECEIVED CONFIG ===');
                if (config.hitboxes && config.hitboxes.blip) {
                    console.log('Blip hitbox received:', config.hitboxes.blip);
                }
                
                // Save sprite configuration
                fs.writeFileSync(CONFIG_FILE, JSON.stringify(config.sprites, null, 2));
                
                // Update hitbox-config.js if hitbox, shadow, or scale data is provided
                if (config.hitboxes || config.shadows || config.scales) {
                    updateHitboxConfig(config.hitboxes || {}, config.shadows || {}, config.scales || {});
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Configuration saved' }));
            } catch (error) {
                console.error('Error saving configuration:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // Handle GET requests for loading configuration
    if (req.method === 'GET' && req.url === '/load-config') {
        try {
            let config = {};
            
            // Load sprite config if it exists
            if (fs.existsSync(CONFIG_FILE)) {
                const spriteConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
                config = { ...spriteConfig };
            }
            
            // Also load scales and hitboxes from hitbox-config.js
            if (fs.existsSync(HITBOX_CONFIG_FILE)) {
                const hitboxContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
                
                // Extract scales object
                const scalesMatch = hitboxContent.match(/scales:\s*\{([^}]+)\}/);
                if (scalesMatch) {
                    const scalesText = scalesMatch[1];
                    const scaleLines = scalesText.match(/'([^']+)':\s*([\d.]+)/g);
                    if (scaleLines) {
                        scaleLines.forEach(line => {
                            const match = line.match(/'([^']+)':\s*([\d.]+)/);
                            if (match) {
                                const [, enemy, scale] = match;
                                if (!config[enemy]) config[enemy] = {};
                                config[enemy].scale = parseFloat(scale);
                            }
                        });
                    }
                }
                
                // Extract hitboxes object
                const hitboxesMatch = hitboxContent.match(/hitboxes:\s*\{([\s\S]*?)\n\s*\},/);
                if (hitboxesMatch) {
                    const hitboxesText = hitboxesMatch[1];
                    // Match entries like 'blip': { width: 18, height: 18, offsetX: 23, offsetY: 11 }
                    const hitboxPattern = /'([^']+)':\s*\{\s*width:\s*(\d+),\s*height:\s*(\d+),\s*offsetX:\s*([\d.-]+),\s*offsetY:\s*([\d.-]+)/g;
                    let match;
                    while ((match = hitboxPattern.exec(hitboxesText)) !== null) {
                        const [, enemy, width, height, offsetX, offsetY] = match;
                        if (!config[enemy]) config[enemy] = {};
                        config[enemy].hitbox = {
                            width: parseInt(width),
                            height: parseInt(height),
                            offsetX: parseFloat(offsetX),
                            offsetY: parseFloat(offsetY)
                        };
                        console.log(`Loaded hitbox for ${enemy}:`, config[enemy].hitbox);
                    }
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(config));
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
            'grass.PNG', 'stone.png', 'desert.png', 'lava.png', 'skullfloor.png',
            // Add orb projectiles and effects
            '/effects/', '/orbs/',
            // Add demon slime boss
            '/demonslime/', '/boss_demon_slime/',
            // Add other boss paths
            '/bosses/', '/images/'
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

function updateHitboxConfig(hitboxes, shadows, scales) {
    console.log('updateHitboxConfig called with:', {
        hitboxCount: Object.keys(hitboxes || {}).length,
        shadowCount: Object.keys(shadows || {}).length,
        scaleCount: Object.keys(scales || {}).length,
        scales: scales,
        hitboxes: hitboxes  // Add this to see the actual hitbox data
    });
    
    try {
        // Read the current hitbox-config.js
        let configContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
        
        // Update scales if provided
        if (scales && Object.keys(scales).length > 0) {
            console.log('Updating scales:', scales);
            
            for (const [spriteType, scale] of Object.entries(scales)) {
                const escapedType = spriteType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                // Look for existing scale in the scales object
                const existingPattern = new RegExp(`'${escapedType}'\\s*:\\s*[\\d.]+`);
                
                if (existingPattern.test(configContent)) {
                    // Update existing scale
                    console.log(`Updating existing scale for ${spriteType} to ${scale}`);
                    configContent = configContent.replace(
                        new RegExp(`('${escapedType}'\\s*:\\s*)[\\d.]+`, 'g'),
                        `$1${scale}`
                    );
                } else {
                    // Add new scale entry
                    console.log(`Adding new scale for ${spriteType}: ${scale}`);
                    // Find the scales section - use a more robust pattern
                    const scalesSectionPattern = /(scales:\s*\{[\s\S]*?)(\n\s*\},)/;
                    const match = configContent.match(scalesSectionPattern);
                    if (match) {
                        // Add the new entry before the closing brace
                        const newEntry = `,\n        '${spriteType}': ${scale}`;
                        configContent = configContent.replace(
                            scalesSectionPattern,
                            `$1${newEntry}$2`
                        );
                        console.log(`Added ${spriteType} to scales section`);
                    } else {
                        console.log('Could not find scales section in hitbox-config.js');
                    }
                }
            }
        }
        
        // Update each enemy's hitbox configuration
        if (hitboxes && Object.keys(hitboxes).length > 0) {
            console.log('Updating hitboxes:', hitboxes);
            
            for (const [enemyType, hitbox] of Object.entries(hitboxes)) {
                const escapedType = enemyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                // Look for existing hitbox with or without quotes
                const existingPattern = new RegExp(`['"]?${escapedType}['"]?\\s*:\\s*\\{[^}]*width`);
                
                if (existingPattern.test(configContent)) {
                    // Update existing entry
                    console.log(`Updating existing hitbox for ${enemyType}`);
                    console.log(`New values: width=${hitbox.width}, height=${hitbox.height}, offsetX=${hitbox.offsetX}, offsetY=${hitbox.offsetY}`);
                    
                    // Find the current line for logging
                    const currentMatch = configContent.match(new RegExp(`'${escapedType}'\\s*:\\s*\\{[^}]*\\}`));
                    if (currentMatch) {
                        console.log(`Current line: ${currentMatch[0]}`);
                    }
                    
                    // Match the exact format with quotes preserved
                    const replacePattern = new RegExp(`('${escapedType}'\\s*:\\s*\\{)[^}]*(\\})`, 'g');
                    const newContent = configContent.replace(
                        replacePattern,
                        `$1 width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} $2`
                    );
                    
                    // Verify the replacement worked
                    if (newContent === configContent) {
                        console.log(`WARNING: Failed to update hitbox for ${enemyType} - trying without quotes`);
                        // Try without quotes as fallback
                        configContent = configContent.replace(
                            new RegExp(`(${escapedType}\\s*:\\s*\\{)[^}]*(\\})`, 'g'),
                            `$1 width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} $2`
                        );
                    } else {
                        configContent = newContent;
                        console.log(`Successfully updated hitbox for ${enemyType} to w:${hitbox.width} h:${hitbox.height}`);
                    }
                } else {
                    // Add new entry to hitboxes section
                    console.log(`Adding new hitbox for ${enemyType}`);
                    const hitboxSectionPattern = /(hitboxes:\s*\{[\s\S]*?)([\n\s]*\},)/;
                    const match = configContent.match(hitboxSectionPattern);
                    if (match) {
                        const newEntry = `,\n        '${enemyType}': { width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} }`;
                        configContent = configContent.replace(
                            hitboxSectionPattern,
                            `$1${newEntry}$2`
                        );
                    }
                }
            }
        }
        
        // Update each enemy's shadow configuration
        for (const [enemyType, shadow] of Object.entries(shadows)) {
            // Create a safe regex pattern that properly handles the enemy type
            const escapedType = enemyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // First, try to find and update existing entry
            const shadowPattern = new RegExp(
                `(${escapedType}:\\s*\\{[^}]*?)width:\\s*\\d+`,
                'g'
            );
            
            if (shadowPattern.test(configContent)) {
                // Update existing entry - replace all values
                configContent = configContent.replace(
                    new RegExp(`(${escapedType}:\\s*\\{)[^}]*(\\})`, 'g'),
                    `$1 width: ${shadow.width}, height: ${shadow.height}, offsetX: ${shadow.offsetX}, offsetY: ${shadow.offsetY}, alpha: ${shadow.alpha} $2`
                );
            } else {
                // Add new entry to shadows section
                // Find the shadows object and add before the last closing brace
                const shadowSectionPattern = /(shadows:\s*\{[\s\S]*?)([\n\s]*\},)/;
                const match = configContent.match(shadowSectionPattern);
                if (match) {
                    const newEntry = `,\n        ${enemyType}: { width: ${shadow.width}, height: ${shadow.height}, offsetX: ${shadow.offsetX}, offsetY: ${shadow.offsetY}, alpha: ${shadow.alpha} }`;
                    configContent = configContent.replace(
                        shadowSectionPattern,
                        `$1${newEntry}$2`
                    );
                }
            }
        }
        
        // Write back the updated configuration
        fs.writeFileSync(HITBOX_CONFIG_FILE, configContent);
        console.log('✅ hitbox-config.js updated successfully');
        
        // Verify the write by reading it back
        const verifyContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
        if (verifyContent.includes("'blip':")) {
            const blipLine = verifyContent.split('\n').find(line => line.includes("'blip':") && line.includes('width'));
            console.log('Verification - blip line after save:', blipLine);
        }
        
        // Log what was updated
        const updates = [];
        if (scales && Object.keys(scales).length > 0) {
            updates.push(`${Object.keys(scales).length} scales`);
            console.log('Updated scales:', scales);
        }
        if (hitboxes && Object.keys(hitboxes).length > 0) {
            updates.push(`${Object.keys(hitboxes).length} hitboxes`);
            console.log('Updated hitboxes:', Object.keys(hitboxes));
        }
        if (shadows && Object.keys(shadows).length > 0) {
            updates.push(`${Object.keys(shadows).length} shadows`);
            console.log('Updated shadows:', Object.keys(shadows));
        }
        
        if (updates.length > 0) {
            console.log(`Summary: Updated ${updates.join(', ')}`);
        }
    } catch (error) {
        console.error('❌ Error updating hitbox-config.js:', error);
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