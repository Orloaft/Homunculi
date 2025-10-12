#!/usr/bin/env node
// Permanently fix the corruption issue

const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, 'hitbox-config.js');

// First, fix the current corruptions
const content = fs.readFileSync(configFile, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    // Fix orb in hitboxes section (around line 160)
    if (i >= 155 && i <= 165 && lines[i].includes("'orb':") && lines[i].includes('flipX')) {
        lines[i] = "        'orb': { width: 30, height: 30, offsetX: 17, offsetY: 17 },";
        console.log(`Fixed corruption at line ${i+1}: orb hitbox`);
    }
    
    // Fix grim in hitboxes section (around line 162)
    if (i >= 155 && i <= 165 && lines[i].includes("'grim':") && lines[i].includes('flipX')) {
        lines[i] = "        'grim': { width: 31, height: 50, offsetX: 16, offsetY: 10 },";
        console.log(`Fixed corruption at line ${i+1}: grim hitbox`);
    }
    
    // Fix grim in shadows section (around line 178)
    if (i >= 175 && i <= 185 && lines[i].includes("'grim':") && lines[i].includes('flipX')) {
        lines[i] = "        'grim': { width: 40, height: 8, offsetX: 0, offsetY: 35, alpha: 0.3 },";
        console.log(`Fixed corruption at line ${i+1}: grim shadow`);
    }
}

const fixed = lines.join('\n');
fs.writeFileSync(configFile, fixed);
console.log('\n✅ Fixed all corruptions');

// Verify the fix
const verifyContent = fs.readFileSync(configFile, 'utf8');
const verifyLines = verifyContent.split('\n');

console.log('\nVerification:');
for (let i = 0; i < verifyLines.length; i++) {
    if (verifyLines[i].includes("'orb':") || verifyLines[i].includes("'grim':")) {
        if (verifyLines[i].includes('flipX') && i > 30) {  // Skip the flips section
            console.log(`❌ Still corrupted at line ${i+1}: ${verifyLines[i].trim()}`);
        }
    }
}

console.log('\nAll orb/grim entries:');
for (let i = 0; i < verifyLines.length; i++) {
    if (verifyLines[i].includes("'orb':") || verifyLines[i].includes("'grim':")) {
        const section = i < 30 ? 'flips' : 
                       i < 100 ? 'scales' : 
                       i < 170 ? 'hitboxes' : 
                       i < 250 ? 'shadows' : 'unknown';
        console.log(`  Line ${i+1} (${section}): ${verifyLines[i].trim().substring(0, 60)}...`);
    }
}