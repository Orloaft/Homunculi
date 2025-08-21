// Simple Node.js server for saving/loading hitbox data
// Run with: node hitbox-server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const HITBOX_FILE = path.join(__dirname, 'hitboxes.json');

// Create server
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Save hitboxes
    if (req.url === '/api/save-hitboxes' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(HITBOX_FILE, JSON.stringify(data, null, 2));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Hitboxes saved' }));
                
                console.log('Hitboxes saved to', HITBOX_FILE);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    }
    
    // Load hitboxes
    else if (req.url === '/api/load-hitboxes' && req.method === 'GET') {
        try {
            if (fs.existsSync(HITBOX_FILE)) {
                const data = fs.readFileSync(HITBOX_FILE, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Hitbox file not found' }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    
    // Unknown endpoint
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Hitbox server running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('  POST /api/save-hitboxes - Save hitbox data');
    console.log('  GET  /api/load-hitboxes - Load hitbox data');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});