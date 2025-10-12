// Proper implementation of updateHitboxConfig using structured parsing
// instead of regex replacements

const fs = require('fs');
const path = require('path');

const HITBOX_CONFIG_FILE = path.join(__dirname, '../scripts/hitbox-config.js');

/**
 * Parse the hitbox config file into a structured object
 * @returns {Object} Parsed configuration with sections
 */
function parseHitboxConfig() {
    const content = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
    
    // Extract each section using proper boundaries
    const sections = {
        beforeContent: '',
        flips: {},
        scales: {},
        hitboxes: {},
        shadows: {},
        afterContent: ''
    };
    
    // Find the start of the hitboxConfig object
    const configStart = content.indexOf('var hitboxConfig = {');
    if (configStart === -1) {
        throw new Error('Could not find hitboxConfig object in file');
    }
    
    sections.beforeContent = content.substring(0, configStart);
    
    // Parse each section by finding its boundaries
    const parseSection = (sectionName, startMarker, endMarker) => {
        const startIdx = content.indexOf(startMarker);
        if (startIdx === -1) return null;
        
        let braceCount = 0;
        let inString = false;
        let stringChar = '';
        let endIdx = startIdx + startMarker.length;
        
        // Find the matching closing brace
        for (let i = endIdx; i < content.length; i++) {
            const char = content[i];
            const prevChar = i > 0 ? content[i-1] : '';
            
            // Handle string literals
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
            }
            
            if (!inString) {
                if (char === '{') braceCount++;
                if (char === '}') {
                    if (braceCount === 0) {
                        endIdx = i + 1;
                        // Check for comma after closing brace
                        if (content[i + 1] === ',') endIdx++;
                        break;
                    }
                    braceCount--;
                }
            }
        }
        
        return {
            fullText: content.substring(startIdx, endIdx),
            content: content.substring(startIdx + startMarker.length, endIdx - 2) // Exclude closing brace and comma
        };
    };
    
    // Parse each section
    const flipsSection = parseSection('flips', 'flips: {', '},');
    const scalesSection = parseSection('scales', 'scales: {', '},');
    const hitboxesSection = parseSection('hitboxes', 'hitboxes: {', '},');
    const shadowsSection = parseSection('shadows', 'shadows: {', '},');
    
    // Parse entries from each section
    const parseEntries = (sectionContent) => {
        if (!sectionContent) return {};
        
        const entries = {};
        const lines = sectionContent.split('\n');
        let currentEntry = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed === '') continue;
            
            currentEntry += line + '\n';
            
            // Check if we have a complete entry (ends with } or },)
            if (trimmed.endsWith('},') || trimmed.endsWith('}')) {
                // Extract the key and value
                const match = currentEntry.match(/['"]?(\w+)['"]?\s*:\s*(\{[^}]+\})/);
                if (match) {
                    const key = match[1];
                    const value = match[2];
                    try {
                        // Parse the value as JSON (fix single quotes first)
                        const jsonValue = value.replace(/'/g, '"');
                        entries[key] = JSON.parse(jsonValue);
                    } catch (e) {
                        // If JSON parsing fails, store as string
                        entries[key] = value;
                    }
                }
                currentEntry = '';
            }
        }
        
        return entries;
    };
    
    // Parse entries from each section
    if (flipsSection) {
        sections.flips = parseEntries(flipsSection.content);
    }
    if (scalesSection) {
        // Scales are simple number values
        const scaleLines = scalesSection.content.split('\n');
        for (const line of scaleLines) {
            const match = line.match(/['"]?(\w+)['"]?\s*:\s*([\d.]+)/);
            if (match) {
                sections.scales[match[1]] = parseFloat(match[2]);
            }
        }
    }
    if (hitboxesSection) {
        sections.hitboxes = parseEntries(hitboxesSection.content);
    }
    if (shadowsSection) {
        sections.shadows = parseEntries(shadowsSection.content);
    }
    
    // Get the content after all sections
    const lastSection = shadowsSection || hitboxesSection || scalesSection || flipsSection;
    if (lastSection) {
        const lastIdx = content.indexOf(lastSection.fullText) + lastSection.fullText.length;
        sections.afterContent = content.substring(lastIdx);
    }
    
    // Store section positions for reconstruction
    sections.positions = {
        flips: flipsSection ? content.indexOf(flipsSection.fullText) : -1,
        scales: scalesSection ? content.indexOf(scalesSection.fullText) : -1,
        hitboxes: hitboxesSection ? content.indexOf(hitboxesSection.fullText) : -1,
        shadows: shadowsSection ? content.indexOf(shadowsSection.fullText) : -1
    };
    
    return sections;
}

/**
 * Rebuild the config file from structured data
 * @param {Object} sections - The parsed sections with updates
 * @returns {string} The rebuilt config file content
 */
function rebuildConfig(sections) {
    let result = sections.beforeContent;
    result += 'var hitboxConfig = {\n';
    result += '    loaded: false,\n';
    result += '    \n';
    result += '    // Load configuration (called when game starts)\n';
    result += '    load: function() {\n';
    result += '        this.loaded = true;\n';
    result += '        console.log(\'Hitbox configuration loaded\');\n';
    result += '        console.log(\'Available scales:\', this.scales);\n';
    result += '        console.log(\'Available hitboxes:\', Object.keys(this.hitboxes));\n';
    result += '        return true;\n';
    result += '    },\n';
    result += '    \n';
    
    // Build flips section
    result += '    // Flip configurations - used for initial sprite orientation\n';
    result += '    flips: {\n';
    const flipEntries = Object.entries(sections.flips);
    flipEntries.forEach(([key, value], index) => {
        if (key === 'grim') {
            result += '        // Grim naturally faces left, needs initial flip\n';
        }
        if (typeof value === 'object') {
            result += `        '${key}': { flipX: ${value.flipX || false}, flipY: ${value.flipY || false} }`;
        } else {
            result += `        '${key}': ${value}`;
        }
        if (index < flipEntries.length - 1) result += ',';
        result += '\n';
    });
    result += '    },\n';
    result += '    \n';
    
    // Build scales section
    result += '    // Scale configurations for sprites\n';
    result += '    scales: {\n';
    
    // Group scales by category for comments
    const playerScales = ['wizard', 'orb', 'grim', 'blip'];
    const forestScales = ['tree', 'bat', 'mushroom', 'giantfly', 'squirrel', 'redpanda'];
    
    result += '        // Player characters\n';
    playerScales.forEach(key => {
        if (sections.scales[key] !== undefined) {
            result += `        '${key}': ${sections.scales[key]},\n`;
        }
    });
    
    result += '        \n';
    result += '        // Forest enemies\n';
    forestScales.forEach(key => {
        if (sections.scales[key] !== undefined) {
            result += `        '${key}': ${sections.scales[key]},\n`;
        }
    });
    
    // Add all other scales
    Object.entries(sections.scales).forEach(([key, value]) => {
        if (!playerScales.includes(key) && !forestScales.includes(key)) {
            result += `        '${key}': ${value},\n`;
        }
    });
    
    // Remove trailing comma and newline
    result = result.replace(/,\n$/, '\n');
    result += '    },\n';
    result += '    \n';
    
    // Build hitboxes section
    result += '    // Hitbox configurations for each enemy type\n';
    result += '    hitboxes: {\n';
    
    // Add comments for sections
    result += '        // Player characters - aligned with sprite centers\n';
    const playerHitboxes = ['wizard', 'orb', 'grim', 'blip'];
    playerHitboxes.forEach(key => {
        if (sections.hitboxes[key]) {
            const hb = sections.hitboxes[key];
            result += `        '${key}': { width: ${hb.width}, height: ${hb.height}, offsetX: ${hb.offsetX}, offsetY: ${hb.offsetY} },\n`;
        }
    });
    
    // Add all other hitboxes
    Object.entries(sections.hitboxes).forEach(([key, value]) => {
        if (!playerHitboxes.includes(key) && typeof value === 'object') {
            result += `        '${key}': { width: ${value.width}, height: ${value.height}, offsetX: ${value.offsetX}, offsetY: ${value.offsetY} },\n`;
        }
    });
    
    // Remove trailing comma
    result = result.replace(/,\n$/, '\n');
    result += '    },\n';
    result += '    \n';
    
    // Build shadows section
    result += '    // Shadow configurations for each enemy type\n';
    result += '    shadows: {\n';
    
    // Default shadow first
    if (sections.shadows.default) {
        const s = sections.shadows.default;
        result += '        // Default shadow settings\n';
        result += `        'default': { width: ${s.width}, height: ${s.height}, offsetX: ${s.offsetX}, offsetY: ${s.offsetY}, alpha: ${s.alpha} },\n`;
    }
    
    // Player shadows
    const playerShadows = ['wizard', 'orb', 'grim', 'blip'];
    playerShadows.forEach(key => {
        if (sections.shadows[key]) {
            const s = sections.shadows[key];
            result += `        '${key}': { width: ${s.width}, height: ${s.height}, offsetX: ${s.offsetX}, offsetY: ${s.offsetY}, alpha: ${s.alpha || 0.5} },\n`;
        }
    });
    
    // All other shadows
    Object.entries(sections.shadows).forEach(([key, value]) => {
        if (key !== 'default' && !playerShadows.includes(key) && typeof value === 'object') {
            result += `        '${key}': { width: ${value.width}, height: ${value.height}, offsetX: ${value.offsetX}, offsetY: ${value.offsetY}`;
            if (value.alpha !== undefined) result += `, alpha: ${value.alpha}`;
            result += ' },\n';
        }
    });
    
    // Remove trailing comma
    result = result.replace(/,\n$/, '\n');
    result += '    },\n';
    
    // Add the rest of the methods
    result += sections.afterContent;
    
    return result;
}

/**
 * Update hitbox configuration with new values
 * @param {Object} hitboxes - Hitbox updates
 * @param {Object} shadows - Shadow updates
 * @param {Object} scales - Scale updates
 * @param {Object} flips - Flip updates
 */
function updateHitboxConfig(hitboxes, shadows, scales, flips) {
    console.log('updateHitboxConfig called with:', {
        hitboxCount: Object.keys(hitboxes || {}).length,
        shadowCount: Object.keys(shadows || {}).length,
        scaleCount: Object.keys(scales || {}).length,
        flipCount: Object.keys(flips || {}).length
    });
    
    try {
        // Parse the current configuration
        const sections = parseHitboxConfig();
        
        // Apply updates to each section
        // IMPORTANT: Only update the specific section, never cross-contaminate
        
        // Update flips
        if (flips && Object.keys(flips).length > 0) {
            console.log('Updating flips:', flips);
            Object.assign(sections.flips, flips);
        }
        
        // Update scales
        if (scales && Object.keys(scales).length > 0) {
            console.log('Updating scales:', scales);
            Object.assign(sections.scales, scales);
        }
        
        // Update hitboxes
        if (hitboxes && Object.keys(hitboxes).length > 0) {
            console.log('Updating hitboxes:', hitboxes);
            Object.assign(sections.hitboxes, hitboxes);
        }
        
        // Update shadows
        if (shadows && Object.keys(shadows).length > 0) {
            console.log('Updating shadows:', shadows);
            Object.assign(sections.shadows, shadows);
        }
        
        // Rebuild the configuration file
        const newContent = rebuildConfig(sections);
        
        // Write the updated configuration
        fs.writeFileSync(HITBOX_CONFIG_FILE, newContent);
        console.log('✅ hitbox-config.js updated successfully');
        
        // Verification
        console.log('Verification - Updated sections:');
        if (flips && flips.grim !== undefined) {
            console.log(`  grim flip: flipX=${sections.flips.grim.flipX}`);
        }
        if (hitboxes && hitboxes.grim !== undefined) {
            console.log(`  grim hitbox: ${JSON.stringify(sections.hitboxes.grim)}`);
        }
        if (hitboxes && hitboxes.orb !== undefined) {
            console.log(`  orb hitbox: ${JSON.stringify(sections.hitboxes.orb)}`);
        }
        
    } catch (error) {
        console.error('❌ Error updating hitbox-config.js:', error);
        throw error;
    }
}

// Export for use in run-editor.js
module.exports = updateHitboxConfig;

// Test if run directly
if (require.main === module) {
    console.log('Testing updateHitboxConfig...');
    
    // Test with just flip updates (this is what causes corruption with regex approach)
    updateHitboxConfig(
        {}, // no hitbox updates
        {}, // no shadow updates
        {}, // no scale updates
        { 
            'grim': { flipX: false, flipY: false },
            'orb': { flipX: true, flipY: false }
        }
    );
    
    console.log('\nTest complete! Check hitbox-config.js for corruption.');
}