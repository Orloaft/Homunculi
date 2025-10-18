/**
 * Extract Hardcoded Hitbox Values from game.js
 *
 * This script scans game.js for all hardcoded fallback hitbox values
 * and generates a complete hitbox configuration that can be merged
 * into hitbox-config.json
 *
 * Usage: node scripts/extract-hardcoded-hitboxes.js
 */

const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'game.js');
const OUTPUT_FILE = path.join(__dirname, 'extracted-hitboxes.json');

console.log('🔍 Scanning game.js for hardcoded hitbox values...\n');

// Read game.js
const gameContent = fs.readFileSync(GAME_FILE, 'utf8');

// Pattern to match: if (!this.applyHitboxConfig(enemy, 'NAME')) {
//                     enemy.body.setSize(W, H);
//                     enemy.body.setOffset(X, Y);
//                   }

const extractedHitboxes = {};
let matchCount = 0;

// Split into lines for better analysis
const lines = gameContent.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for applyHitboxConfig calls
    const configMatch = line.match(/if\s*\(!.*applyHitboxConfig\([^,]+,\s*['"]([^'"]+)['"]\)/);

    if (configMatch) {
        const enemyType = configMatch[1];
        matchCount++;

        // Look ahead for setSize and setOffset in the next 5 lines
        let width = null, height = null, offsetX = null, offsetY = null;

        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
            const nextLine = lines[j];

            // Match: enemy.body.setSize(W, H);
            const sizeMatch = nextLine.match(/\.body\.setSize\((\d+),\s*(\d+)\)/);
            if (sizeMatch) {
                width = parseInt(sizeMatch[1]);
                height = parseInt(sizeMatch[2]);
            }

            // Match: enemy.body.setOffset(X, Y);
            const offsetMatch = nextLine.match(/\.body\.setOffset\(([\d.-]+),\s*([\d.-]+)\)/);
            if (offsetMatch) {
                offsetX = parseFloat(offsetMatch[1]);
                offsetY = parseFloat(offsetMatch[2]);
            }

            // Stop if we hit the closing brace
            if (nextLine.match(/^\s*\}/)) {
                break;
            }
        }

        if (width !== null && height !== null && offsetX !== null && offsetY !== null) {
            extractedHitboxes[enemyType] = {
                width,
                height,
                offsetX,
                offsetY
            };
            console.log(`✅ ${enemyType.padEnd(25)} → ${width}x${height} offset(${offsetX}, ${offsetY})`);
        } else if (width !== null && height !== null) {
            // Only setSize, no setOffset
            extractedHitboxes[enemyType] = {
                width,
                height,
                offsetX: 0,
                offsetY: 0
            };
            console.log(`⚠️  ${enemyType.padEnd(25)} → ${width}x${height} offset(0, 0) [NO OFFSET FOUND]`);
        } else {
            console.log(`❌ ${enemyType.padEnd(25)} → Could not extract hitbox values`);
        }
    }
}

console.log(`\n📊 Summary:`);
console.log(`   Total applyHitboxConfig fallbacks found: ${matchCount}`);
console.log(`   Successfully extracted: ${Object.keys(extractedHitboxes).length}`);
console.log(`   Failed to extract: ${matchCount - Object.keys(extractedHitboxes).length}`);

// Load existing hitbox-config.json
const CONFIG_JSON_FILE = path.join(__dirname, 'hitbox-config.json');
let existingConfig = { hitboxes: {} };

if (fs.existsSync(CONFIG_JSON_FILE)) {
    existingConfig = JSON.parse(fs.readFileSync(CONFIG_JSON_FILE, 'utf8'));
    console.log(`\n📁 Loaded existing hitbox-config.json`);
}

// Merge extracted hitboxes with existing config
// IMPORTANT: Keep existing proper configs, only add missing ones
let addedCount = 0;
let skippedCount = 0;
let updatedInvalidCount = 0;

for (const [enemyType, hitbox] of Object.entries(extractedHitboxes)) {
    const existing = existingConfig.hitboxes[enemyType];

    if (!existing) {
        // Enemy not in config - ADD IT
        existingConfig.hitboxes[enemyType] = hitbox;
        addedCount++;
    } else if (existing[""] !== undefined) {
        // Enemy has invalid placeholder format - REPLACE IT
        existingConfig.hitboxes[enemyType] = hitbox;
        updatedInvalidCount++;
    } else if (existing.width && existing.height &&
               existing.offsetX !== undefined && existing.offsetY !== undefined) {
        // Enemy already has proper config - SKIP
        skippedCount++;
    } else {
        // Edge case - has some config but incomplete - UPDATE IT
        existingConfig.hitboxes[enemyType] = hitbox;
        updatedInvalidCount++;
    }
}

console.log(`\n🔄 Merge Results:`);
console.log(`   Added new entries: ${addedCount}`);
console.log(`   Updated invalid placeholders: ${updatedInvalidCount}`);
console.log(`   Kept existing proper configs: ${skippedCount}`);

// Remove empty placeholder entries
const cleanedHitboxes = {};
for (const [key, value] of Object.entries(existingConfig.hitboxes)) {
    if (key !== '' && value[""] === undefined) {
        cleanedHitboxes[key] = value;
    }
}

existingConfig.hitboxes = cleanedHitboxes;

// Write the merged configuration
const outputConfig = {
    flips: existingConfig.flips || {},
    scales: existingConfig.scales || {},
    hitboxes: existingConfig.hitboxes,
    shadows: existingConfig.shadows || {}
};

fs.writeFileSync(CONFIG_JSON_FILE, JSON.stringify(outputConfig, null, 2));
console.log(`\n✅ Updated ${CONFIG_JSON_FILE}`);

// Also write extracted data to a separate file for review
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(extractedHitboxes, null, 2));
console.log(`✅ Extracted data saved to ${OUTPUT_FILE}`);

console.log(`\n📝 Next Steps:`);
console.log(`   1. Review the updated hitbox-config.json`);
console.log(`   2. Run the game and verify all enemies appear correctly`);
console.log(`   3. Run: node sprite-editor/regenerate-hitbox-config.js`);
console.log(`   4. Remove fallback code from game.js (see remove-fallback-hitboxes.js)`);
