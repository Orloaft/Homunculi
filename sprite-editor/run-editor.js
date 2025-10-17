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
        console.log('=== SAVE REQUEST RECEIVED ===');
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
                if (config.hitboxes && config.hitboxes.orb) {
                    console.log('[ORB DEBUG] Orb hitbox received from editor:', config.hitboxes.orb);
                }
                if (config.flips && config.flips.orb) {
                    console.log('[ORB DEBUG] Orb flip received from editor:', config.flips.orb);
                }
                
                // Save sprite configuration (only if sprites data exists)
                if (config.sprites) {
                    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config.sprites, null, 2));
                }
                
                // Update hitbox-config.js if hitbox, shadow, scale, or flip data is provided
                if (config.hitboxes || config.shadows || config.scales || config.flips) {
                    updateHitboxConfig(config.hitboxes || {}, config.shadows || {}, config.scales || {}, config.flips || {});
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
                    // Also handle entries without quotes like darkbat: { width: 50, ...
                    const hitboxPattern = /['"]?([^'":\s]+)['"]?\s*:\s*\{\s*['"]*width['"]*:\s*(\d+),\s*['"]*height['"]*:\s*(\d+),\s*['"]*offsetX['"]*:\s*([\d.-]+),\s*['"]*offsetY['"]*:\s*([\d.-]+)/g;
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
                
                // Extract shadows object  
                const shadowsMatch = hitboxContent.match(/shadows:\s*\{([\s\S]*?)\n\s*\},/);
                if (shadowsMatch) {
                    const shadowsText = shadowsMatch[1];
                    // Match entries with or without quotes
                    const shadowPattern = /['"]?([^'":\s]+)['"]?\s*:\s*\{\s*['"]*width['"]*:\s*(\d+),\s*['"]*height['"]*:\s*(\d+),\s*['"]*offsetX['"]*:\s*([\d.-]+),\s*['"]*offsetY['"]*:\s*([\d.-]+),\s*['"]*alpha['"]*:\s*([\d.]+)/g;
                    let match;
                    while ((match = shadowPattern.exec(shadowsText)) !== null) {
                        const [, enemy, width, height, offsetX, offsetY, alpha] = match;
                        if (!config[enemy]) config[enemy] = {};
                        config[enemy].shadow = {
                            width: parseInt(width),
                            height: parseInt(height), 
                            offsetX: parseFloat(offsetX),
                            offsetY: parseFloat(offsetY),
                            alpha: parseFloat(alpha)
                        };
                        console.log(`Loaded shadow for ${enemy}:`, config[enemy].shadow);
                    }
                }
                
                // Extract flips object
                const flipsMatch = hitboxContent.match(/flips:\s*\{([\s\S]*?)\n\s*\},/);
                if (flipsMatch) {
                    const flipsText = flipsMatch[1];
                    // Match entries like 'grim': { flipX: true, flipY: false }
                    const flipPattern = /'([^']+)':\s*\{\s*flipX:\s*(true|false),\s*flipY:\s*(true|false)/g;
                    let match;
                    while ((match = flipPattern.exec(flipsText)) !== null) {
                        const [, enemy, flipX, flipY] = match;
                        if (!config[enemy]) config[enemy] = {};
                        config[enemy].flipX = flipX === 'true';
                        config[enemy].flipY = flipY === 'true';
                        console.log(`Loaded flip for ${enemy}: flipX=${flipX}, flipY=${flipY}`);
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
            '/frostguardian/', // Add frost guardian boss assets
            '/snowlandenemies/', // Add snowland enemy assets
            '/oceanlandenemies/', // Add oceanland enemy assets
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

// Import the clean update function
const updateHitboxConfigClean = require('./updateHitboxConfig-clean');

function updateHitboxConfig(hitboxes, shadows, scales, flips) {
    // Use the clean implementation
    return updateHitboxConfigClean(hitboxes, shadows, scales, flips);
}

// Original function (disabled)
function updateHitboxConfig_OLD(hitboxes, shadows, scales, flips) {
    console.log('updateHitboxConfig called with:', {
        hitboxCount: Object.keys(hitboxes || {}).length,
        shadowCount: Object.keys(shadows || {}).length,
        scaleCount: Object.keys(scales || {}).length,
        flipCount: Object.keys(flips || {}).length,
        scales: scales,
        flips: flips,
        hitboxes: hitboxes
    });
    
    try {
        // Read the current hitbox-config.js
        let configContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
        
        // Collect all section updates with their positions
        const sectionsToUpdate = [];
        
        // Find flips section
        if (flips && Object.keys(flips).length > 0) {
            const flipsSectionMatch = configContent.match(/(flips:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (flipsSectionMatch) {
                const sectionStart = configContent.indexOf(flipsSectionMatch[0]);
                const sectionEnd = sectionStart + flipsSectionMatch[0].length;
                let flipsContent = flipsSectionMatch[2];
                
                for (const [spriteType, flipData] of Object.entries(flips)) {
                    const escapedType = spriteType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*\\{[^}]+\\}`);
                    
                    if (existingPattern.test(flipsContent)) {
                        console.log(`Updating existing flip for ${spriteType}`);
                        flipsContent = flipsContent.replace(
                            existingPattern,
                            `\n        '${spriteType}': { flipX: ${flipData.flipX}, flipY: ${flipData.flipY} }`
                        );
                    } else {
                        console.log(`Adding new flip for ${spriteType}: flipX=${flipData.flipX}, flipY=${flipData.flipY}`);
                        if (flipsContent.trim() === '') {
                            flipsContent = `\n        '${spriteType}': { flipX: ${flipData.flipX}, flipY: ${flipData.flipY} }\n    `;
                        } else {
                            flipsContent += `,\n        '${spriteType}': { flipX: ${flipData.flipX}, flipY: ${flipData.flipY} }`;
                        }
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${flipsSectionMatch[1]}${flipsContent}${flipsSectionMatch[3]}`
                });
            }
        }
        
        // Find shadows section
        if (shadows && Object.keys(shadows).length > 0) {
            const shadowsSectionMatch = configContent.match(/(shadows:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (shadowsSectionMatch) {
                const sectionStart = configContent.indexOf(shadowsSectionMatch[0]);
                const sectionEnd = sectionStart + shadowsSectionMatch[0].length;
                let shadowsContent = shadowsSectionMatch[2];
                
                for (const [enemyType, shadow] of Object.entries(shadows)) {
                    const escapedType = enemyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*\\{[^}]+\\}`);
                    
                    if (existingPattern.test(shadowsContent)) {
                        console.log(`Updating existing shadow for ${enemyType}`);
                        shadowsContent = shadowsContent.replace(
                            existingPattern,
                            `\n        '${enemyType}': { width: ${shadow.width}, height: ${shadow.height}, offsetX: ${shadow.offsetX}, offsetY: ${shadow.offsetY}, alpha: ${shadow.alpha} }`
                        );
                    } else {
                        console.log(`Adding new shadow for ${enemyType}`);
                        shadowsContent += `,\n        '${enemyType}': { width: ${shadow.width}, height: ${shadow.height}, offsetX: ${shadow.offsetX}, offsetY: ${shadow.offsetY}, alpha: ${shadow.alpha} }`;
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${shadowsSectionMatch[1]}${shadowsContent}${shadowsSectionMatch[3]}`
                });
            }
        }
        
        // Find hitboxes section
        if (hitboxes && Object.keys(hitboxes).length > 0) {
            const hitboxesSectionMatch = configContent.match(/(hitboxes:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (hitboxesSectionMatch) {
                const sectionStart = configContent.indexOf(hitboxesSectionMatch[0]);
                const sectionEnd = sectionStart + hitboxesSectionMatch[0].length;
                let hitboxesContent = hitboxesSectionMatch[2];
                
                for (const [enemyType, hitbox] of Object.entries(hitboxes)) {
                    // Special logging for orb
                    if (enemyType === 'orb') {
                        console.log(`[ORB DEBUG] Processing orb hitbox:`, hitbox);
                        console.log(`[ORB DEBUG] Current hitboxesContent includes orb:`, hitboxesContent.includes("'orb'"));
                    }
                    
                    const escapedType = enemyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*\\{[^}]+\\}`);
                    
                    if (existingPattern.test(hitboxesContent)) {
                        console.log(`Updating existing hitbox for ${enemyType}`);
                        const hasQuotes = new RegExp(`\\n\\s*'${escapedType}'\\s*:`).test(hitboxesContent);
                        const prefix = hasQuotes ? `'${enemyType}'` : enemyType;
                        
                        const newEntry = `\n        ${prefix}: { width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} }`;
                        
                        if (enemyType === 'orb') {
                            console.log(`[ORB DEBUG] Replacing with:`, newEntry);
                        }
                        
                        hitboxesContent = hitboxesContent.replace(
                            existingPattern,
                            newEntry
                        );
                    } else {
                        console.log(`Adding new hitbox for ${enemyType}`);
                        hitboxesContent += `,\n        '${enemyType}': { width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} }`;
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${hitboxesSectionMatch[1]}${hitboxesContent}${hitboxesSectionMatch[3]}`
                });
            }
        }
        
        // Find scales section
        if (scales && Object.keys(scales).length > 0) {
            const scalesSectionMatch = configContent.match(/(scales:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (scalesSectionMatch) {
                const sectionStart = configContent.indexOf(scalesSectionMatch[0]);
                const sectionEnd = sectionStart + scalesSectionMatch[0].length;
                let scalesContent = scalesSectionMatch[2];
                
                for (const [spriteType, scale] of Object.entries(scales)) {
                    const escapedType = spriteType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*[\\d.]+`);
                    
                    if (existingPattern.test(scalesContent)) {
                        console.log(`Updating existing scale for ${spriteType} to ${scale}`);
                        scalesContent = scalesContent.replace(
                            existingPattern,
                            `\n        '${spriteType}': ${scale}`
                        );
                    } else {
                        console.log(`Adding new scale for ${spriteType}: ${scale}`);
                        scalesContent += `,\n        '${spriteType}': ${scale}`;
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${scalesSectionMatch[1]}${scalesContent}${scalesSectionMatch[3]}`
                });
            }
        }
        
        // Sort sections by start position in REVERSE order (end to beginning)
        // This ensures that when we replace sections, we don't invalidate the indices of earlier sections
        sectionsToUpdate.sort((a, b) => b.start - a.start);
        
        // Apply all updates in reverse order
        for (const section of sectionsToUpdate) {
            console.log(`Updating section at position ${section.start}-${section.end}`);
            configContent = configContent.substring(0, section.start) + section.newContent + configContent.substring(section.end);
        }
        
        // Write back the updated configuration
        fs.writeFileSync(HITBOX_CONFIG_FILE, configContent);
        console.log('✅ hitbox-config.js updated successfully');
        
        // Verification logging
        const verifyContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
        if (verifyContent.includes("'grim':")) {
            const grimLine = verifyContent.split('\n').find(line => line.includes("'grim':") && line.includes('width'));
            console.log('Verification - grim hitbox line after save:', grimLine);
        }
        if (verifyContent.includes("'orb':")) {
            const orbLine = verifyContent.split('\n').find(line => line.includes("'orb':") && line.includes('width'));
            console.log('Verification - orb hitbox line after save:', orbLine);
        }
        
        // Log what was updated
        const updates = [];
        if (scales && Object.keys(scales).length > 0) {
            updates.push(`${Object.keys(scales).length} scales`);
        }
        if (hitboxes && Object.keys(hitboxes).length > 0) {
            updates.push(`${Object.keys(hitboxes).length} hitboxes`);
        }
        if (shadows && Object.keys(shadows).length > 0) {
            updates.push(`${Object.keys(shadows).length} shadows`);
        }
        if (flips && Object.keys(flips).length > 0) {
            updates.push(`${Object.keys(flips).length} flips`);
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