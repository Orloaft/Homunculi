const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

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

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url}`);
    
    // Decode URL to handle spaces and special characters
    const decodedUrl = decodeURIComponent(req.url);
    
    // Default to index.html
    let filePath = '.' + decodedUrl;
    if (filePath === './') {
        filePath = './enemy-sprite-editor.html';
    }
    
    // Check if requesting sprite assets from parent directory
    if (filePath.includes('/mushroom/') || 
        filePath.includes('/tree/') || 
        filePath.includes('/forestlandfoes/') ||
        filePath.includes('/cavelandfoes/') ||
        filePath.includes('/Golem_1/') ||
        filePath.includes('/kobold/') ||
        filePath.includes('/newenemies/') ||
        filePath.includes('/bateye/') ||
        filePath.includes('/fireworm/') ||
        filePath.includes('/scythewraith/') ||
        filePath.includes('/homunculicharacters/') ||
        filePath.includes('/archerboss/') ||
        filePath.includes('/skeleton/') ||
        filePath.includes('/castlelandfoes/') ||
        filePath.includes('Bat-IdleFly9frames.png') ||
        filePath.includes('obeliskBoss.png') ||
        filePath.includes('voidkin15frames.png') ||
        filePath.includes('/Obelisk_demo/') ||
        filePath.includes('/wizmove/') ||
        filePath.includes('/Eyelor/') ||
        filePath.includes('/Nekros/') ||
        filePath.includes('HitboxEditor.js') ||
        filePath.includes('HitboxConfig.js')) {
        // Serve from parent directory
        filePath = '..' + decodedUrl;
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
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     Enemy Sprite & Hitbox Editor Server    ║
╠════════════════════════════════════════════╣
║  Server running at:                        ║
║  http://localhost:${PORT}/                     ║
║                                            ║
║  Open this URL in your browser to use     ║
║  the sprite editor with proper loading.   ║
║                                            ║
║  Press Ctrl+C to stop the server.         ║
╚════════════════════════════════════════════╝
    `);
});