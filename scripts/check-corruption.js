#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, 'hitbox-config.js');

function checkCorruption() {
    const content = fs.readFileSync(configFile, 'utf8');
    
    // Check for flip data in wrong sections
    const lines = content.split('\n');
    const corruptions = [];
    
    let currentSection = '';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Track which section we're in
        if (line.includes('flips:')) currentSection = 'flips';
        else if (line.includes('scales:')) currentSection = 'scales';
        else if (line.includes('hitboxes:')) currentSection = 'hitboxes';
        else if (line.includes('shadows:')) currentSection = 'shadows';
        
        // Check for flip data in wrong sections
        if (line.includes('flipX') && line.includes('flipY')) {
            if (currentSection !== 'flips') {
                corruptions.push({
                    line: i + 1,
                    section: currentSection,
                    content: line.trim()
                });
            }
        }
        
        // Check for missing hitbox data in hitboxes section
        if (currentSection === 'hitboxes' && (line.includes("'orb':") || line.includes("'grim':"))) {
            if (!line.includes('width') && !line.includes('//')) {
                corruptions.push({
                    line: i + 1,
                    section: currentSection,
                    content: line.trim(),
                    type: 'missing_hitbox'
                });
            }
        }
        
        // Check for missing shadow data in shadows section
        if (currentSection === 'shadows' && line.includes("'grim':")) {
            if (!line.includes('width') && !line.includes('//')) {
                corruptions.push({
                    line: i + 1,
                    section: currentSection,
                    content: line.trim(),
                    type: 'missing_shadow'
                });
            }
        }
    }
    
    return corruptions;
}

console.log('Checking for corruptions in hitbox-config.js...\n');
const corruptions = checkCorruption();

if (corruptions.length > 0) {
    console.log(`❌ Found ${corruptions.length} corruption(s):\n`);
    corruptions.forEach(c => {
        console.log(`Line ${c.line} (${c.section} section):`);
        console.log(`  ${c.content}`);
        if (c.type) console.log(`  Type: ${c.type}`);
        console.log();
    });
} else {
    console.log('✅ No corruptions found!');
}

// Also show current values
console.log('\nCurrent configurations:');
const content = fs.readFileSync(configFile, 'utf8');

// Extract flip values
const flipsMatch = content.match(/flips:\s*\{([^}]*)\}/);
if (flipsMatch) {
    const flips = flipsMatch[1];
    const grimFlip = flips.match(/'grim':\s*\{[^}]+\}/);
    const orbFlip = flips.match(/'orb':\s*\{[^}]+\}/);
    console.log('\nFlips section:');
    if (grimFlip) console.log('  ' + grimFlip[0]);
    if (orbFlip) console.log('  ' + orbFlip[0]);
}

// Check hitbox values
const hitboxLines = content.split('\n').filter(l => l.includes("'orb':") || l.includes("'grim':"));
console.log('\nAll orb/grim entries:');
hitboxLines.forEach(line => {
    const lineNum = content.split('\n').indexOf(line) + 1;
    console.log(`  Line ${lineNum}: ${line.trim()}`);
});