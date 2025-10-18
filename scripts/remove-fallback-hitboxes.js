/**
 * Remove Hardcoded Fallback Hitbox Values from game.js
 *
 * This script removes all fallback code blocks that violate single source of truth.
 *
 * BEFORE running this script:
 * 1. Run extract-hardcoded-hitboxes.js to populate the config
 * 2. Test the game to ensure all hitboxes work correctly
 * 3. BACKUP game.js (this script modifies it!)
 *
 * Usage: node scripts/remove-fallback-hitboxes.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const GAME_FILE = path.join(__dirname, 'game.js');
const BACKUP_FILE = path.join(__dirname, 'game.js.backup');

// Check for dry-run flag
const dryRun = process.argv.includes('--dry-run');

if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
} else {
    console.log('⚠️  WARNING: This will modify game.js!\n');
}

console.log('🔍 Scanning game.js for fallback hitbox code...\n');

// Read game.js
let gameContent = fs.readFileSync(GAME_FILE, 'utf8');

// Create backup before modifying
if (!dryRun) {
    fs.writeFileSync(BACKUP_FILE, gameContent);
    console.log(`💾 Backup created: ${BACKUP_FILE}\n`);
}

const lines = gameContent.split('\n');
const modifiedLines = [];
let removalCount = 0;
let inFallbackBlock = false;
let fallbackStartLine = -1;
let currentEnemyType = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line starts a fallback block
    const configMatch = line.match(/if\s*\(!.*applyHitboxConfig\([^,]+,\s*['"]([^'"]+)['"]\)\)\s*\{/);

    if (configMatch && !inFallbackBlock) {
        // Found the start of a fallback block
        inFallbackBlock = true;
        fallbackStartLine = i;
        currentEnemyType = configMatch[1];

        // Replace the entire if block with just the config call
        const indent = line.match(/^(\s*)/)[1];

        // Extract the applyHitboxConfig call
        const configCall = line.match(/(this\.applyHitboxConfig\([^)]+\))/);
        if (configCall) {
            modifiedLines.push(`${indent}// Apply hitbox from config`);
            modifiedLines.push(`${indent}${configCall[1]};`);
            console.log(`✂️  Line ${i + 1}: Removing fallback for '${currentEnemyType}'`);
        } else {
            // Fallback: keep the line if we can't parse it
            modifiedLines.push(line);
        }

        continue;
    }

    // If we're in a fallback block, skip lines until we find the closing brace
    if (inFallbackBlock) {
        // Check if this is the closing brace for the if statement
        // Look for a brace at the same or less indentation level as the if statement
        const indentMatch = line.match(/^(\s*)\}/);

        if (indentMatch) {
            const braceIndent = indentMatch[1].length;
            const ifIndent = lines[fallbackStartLine].match(/^(\s*)/)[1].length;

            if (braceIndent === ifIndent) {
                // This is the closing brace for our if block
                inFallbackBlock = false;
                removalCount++;
                // Skip this closing brace (don't add to modifiedLines)
                continue;
            }
        }

        // We're inside the fallback block - skip this line
        continue;
    }

    // Not in a fallback block - keep the line
    modifiedLines.push(line);
}

console.log(`\n📊 Summary:`);
console.log(`   Fallback blocks removed: ${removalCount}`);

// Write the modified content
const newContent = modifiedLines.join('\n');

if (!dryRun) {
    fs.writeFileSync(GAME_FILE, newContent);
    console.log(`\n✅ Modified game.js`);
    console.log(`   Original backed up to: ${BACKUP_FILE}`);
    console.log(`\n📝 Next Steps:`);
    console.log(`   1. Test the game thoroughly`);
    console.log(`   2. Verify all enemies have correct hitboxes`);
    console.log(`   3. If issues occur, restore from backup:`);
    console.log(`      cp ${BACKUP_FILE} ${GAME_FILE}`);
} else {
    console.log(`\n📝 Dry run complete. Run without --dry-run to apply changes.`);

    // Show a preview of changes
    console.log(`\n📋 Preview of changes (first 5 removals):`);
    let previewCount = 0;
    for (let i = 0; i < lines.length && previewCount < 5; i++) {
        const line = lines[i];
        const configMatch = line.match(/if\s*\(!.*applyHitboxConfig\([^,]+,\s*['"]([^'"]+)['"]\)/);
        if (configMatch) {
            console.log(`\n   Line ${i + 1} (${configMatch[1]}):`);
            console.log(`   ${lines[i]}`);

            // Show the fallback code that would be removed
            for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                console.log(`   ${lines[j]}`);
                if (lines[j].match(/^\s*\}/)) break;
            }
            previewCount++;
        }
    }
}

console.log('');
