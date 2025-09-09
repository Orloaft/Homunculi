/**
 * Sprite Configuration Manager
 * Handles adding, updating, and managing sprite configurations
 */

const fs = require('fs');
const path = require('path');

class SpriteConfigManager {
    constructor() {
        this.configPath = path.join(__dirname, '..', 'SpriteConfig.js');
        this.backupPath = path.join(__dirname, '..', 'SpriteConfig.backup.js');
        this.config = {};
        this.loadConfig();
    }

    loadConfig() {
        try {
            // Read the existing config file
            const configContent = fs.readFileSync(this.configPath, 'utf8');
            
            // Extract the config object (simple parsing)
            const configMatch = configContent.match(/const SpriteConfig = ({[\s\S]*});/);
            if (configMatch) {
                // Use eval carefully here - in production, use a proper parser
                eval(`this.config = ${configMatch[1]}`);
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = {};
        }
    }

    saveConfig() {
        try {
            // Create backup
            if (fs.existsSync(this.configPath)) {
                fs.copyFileSync(this.configPath, this.backupPath);
            }

            // Generate the new config file content
            const configContent = `// Sprite Configuration File
// This file is shared between the game and the sprite editor
// It contains all sprite definitions and animation parameters
// Last updated: ${new Date().toISOString()}

const SpriteConfig = ${JSON.stringify(this.config, null, 4)};

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpriteConfig;
}

// Export for browser environments
if (typeof window !== 'undefined') {
    window.SpriteConfig = SpriteConfig;
}
`;

            fs.writeFileSync(this.configPath, configContent);
            console.log('✅ Config saved successfully!');
            return true;
        } catch (error) {
            console.error('❌ Error saving config:', error);
            return false;
        }
    }

    addSprite(name, spriteData) {
        if (this.config[name]) {
            console.warn(`⚠️ Sprite "${name}" already exists. Use updateSprite() to modify.`);
            return false;
        }

        this.config[name] = spriteData;
        console.log(`✅ Added sprite: ${name}`);
        return this.saveConfig();
    }

    updateSprite(name, spriteData) {
        if (!this.config[name]) {
            console.warn(`⚠️ Sprite "${name}" doesn't exist. Use addSprite() to create.`);
            return false;
        }

        this.config[name] = { ...this.config[name], ...spriteData };
        console.log(`✅ Updated sprite: ${name}`);
        return this.saveConfig();
    }

    removeSprite(name) {
        if (!this.config[name]) {
            console.warn(`⚠️ Sprite "${name}" doesn't exist.`);
            return false;
        }

        delete this.config[name];
        console.log(`✅ Removed sprite: ${name}`);
        return this.saveConfig();
    }

    getSprite(name) {
        return this.config[name] || null;
    }

    listSprites() {
        return Object.keys(this.config);
    }

    importFromJSON(jsonPath) {
        try {
            const jsonContent = fs.readFileSync(jsonPath, 'utf8');
            const spriteData = JSON.parse(jsonContent);
            
            // Extract entity name from the data or filename
            const entityName = spriteData.entityName || 
                             path.basename(jsonPath, '.json').replace('-config', '');
            
            delete spriteData.entityName; // Remove if it exists
            
            return this.addSprite(entityName, spriteData);
        } catch (error) {
            console.error('❌ Error importing JSON:', error);
            return false;
        }
    }

    generateGameCode(spriteName) {
        const sprite = this.config[spriteName];
        if (!sprite) {
            console.error(`❌ Sprite "${spriteName}" not found`);
            return null;
        }

        const code = {
            preload: `
// Add to your game's preload function:
this.load.spritesheet('${sprite.texture}', '${sprite.path}', {
    frameWidth: ${sprite.frameWidth},
    frameHeight: ${sprite.frameHeight}
});`,
            create: `
// Add to your game's create function:
${Object.entries(sprite.animations).map(([name, anim]) => `
this.anims.create({
    key: '${anim.key}',
    frames: this.anims.generateFrameNumbers('${sprite.texture}', { 
        ${anim.frames ? `frames: [${anim.frames.join(', ')}]` : `start: ${anim.start}, end: ${anim.end}`}
    }),
    frameRate: ${anim.rate},
    repeat: ${anim.repeat}
});`).join('\n')}`,
            usage: `
// Example usage in your game:
const ${spriteName} = this.add.sprite(x, y, '${sprite.texture}');
${spriteName}.setScale(${sprite.defaultScale});
${spriteName}.play('${Object.values(sprite.animations)[0].key}');

// Entity properties:
// Health: ${sprite.health}
// Speed: ${sprite.moveSpeed}
// Damage: ${sprite.damage}
${sprite.isFlying ? '// This is a flying entity' : ''}`
        };

        return code;
    }

    validateSprite(spriteData) {
        const required = ['texture', 'path', 'frameWidth', 'frameHeight', 'animations'];
        const missing = required.filter(field => !spriteData[field]);
        
        if (missing.length > 0) {
            console.error(`❌ Missing required fields: ${missing.join(', ')}`);
            return false;
        }

        if (Object.keys(spriteData.animations).length === 0) {
            console.error('❌ At least one animation is required');
            return false;
        }

        return true;
    }

    exportToHTML() {
        // Generate an HTML file with all sprites for preview
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Sprite Configuration Viewer</title>
    <style>
        body { font-family: Arial; background: #1a1a1a; color: #fff; padding: 20px; }
        .sprite-card { 
            background: #2a2a2a; 
            border: 1px solid #444; 
            border-radius: 8px; 
            padding: 15px; 
            margin: 10px; 
            display: inline-block; 
            width: 300px;
            vertical-align: top;
        }
        .sprite-name { color: #00ff88; font-size: 18px; font-weight: bold; }
        .sprite-prop { margin: 5px 0; font-size: 14px; }
        .animation-info { 
            background: #333; 
            padding: 8px; 
            margin: 5px 0; 
            border-radius: 4px; 
            font-size: 12px;
        }
        h1 { color: #00ff88; }
    </style>
</head>
<body>
    <h1>Sprite Configurations (${Object.keys(this.config).length} sprites)</h1>
    ${Object.entries(this.config).map(([name, sprite]) => `
        <div class="sprite-card">
            <div class="sprite-name">${name}</div>
            <div class="sprite-prop">Texture: ${sprite.texture}</div>
            <div class="sprite-prop">Frame: ${sprite.frameWidth}x${sprite.frameHeight}</div>
            <div class="sprite-prop">Scale: ${sprite.defaultScale}</div>
            <div class="sprite-prop">Health: ${sprite.health} | Speed: ${sprite.moveSpeed} | Damage: ${sprite.damage}</div>
            ${sprite.isFlying ? '<div class="sprite-prop">🦅 Flying Entity</div>' : ''}
            <div class="sprite-prop"><strong>Animations:</strong></div>
            ${Object.entries(sprite.animations).map(([animName, anim]) => `
                <div class="animation-info">
                    ${animName}: ${anim.frames ? `frames [${anim.frames.join(',')}]` : `${anim.start}-${anim.end}`} 
                    @ ${anim.rate}fps
                </div>
            `).join('')}
        </div>
    `).join('')}
</body>
</html>`;

        const outputPath = path.join(__dirname, 'sprite-config-viewer.html');
        fs.writeFileSync(outputPath, html);
        console.log(`✅ HTML viewer generated: ${outputPath}`);
        return outputPath;
    }
}

// CLI Interface
if (require.main === module) {
    const manager = new SpriteConfigManager();
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'add':
            if (args.length < 3) {
                console.log('Usage: node sprite-config-manager.js add <name> <json-file>');
                break;
            }
            manager.importFromJSON(args[2]);
            break;

        case 'remove':
            if (args.length < 2) {
                console.log('Usage: node sprite-config-manager.js remove <name>');
                break;
            }
            manager.removeSprite(args[1]);
            break;

        case 'list':
            const sprites = manager.listSprites();
            console.log(`\n📦 Available Sprites (${sprites.length}):`);
            sprites.forEach(name => console.log(`  - ${name}`));
            break;

        case 'show':
            if (args.length < 2) {
                console.log('Usage: node sprite-config-manager.js show <name>');
                break;
            }
            const sprite = manager.getSprite(args[1]);
            if (sprite) {
                console.log(JSON.stringify(sprite, null, 2));
            } else {
                console.log(`Sprite "${args[1]}" not found`);
            }
            break;

        case 'code':
            if (args.length < 2) {
                console.log('Usage: node sprite-config-manager.js code <name>');
                break;
            }
            const code = manager.generateGameCode(args[1]);
            if (code) {
                console.log('\n=== PRELOAD ===');
                console.log(code.preload);
                console.log('\n=== CREATE ===');
                console.log(code.create);
                console.log('\n=== USAGE ===');
                console.log(code.usage);
            }
            break;

        case 'export':
            manager.exportToHTML();
            break;

        default:
            console.log(`
Sprite Configuration Manager
============================

Commands:
  add <name> <json-file>  - Add a new sprite from JSON file
  remove <name>           - Remove a sprite
  list                    - List all sprites
  show <name>            - Show sprite details
  code <name>            - Generate game code for sprite
  export                 - Export HTML viewer

Examples:
  node sprite-config-manager.js add dragon dragon-config.json
  node sprite-config-manager.js list
  node sprite-config-manager.js code dragon
            `);
    }
}

module.exports = SpriteConfigManager;