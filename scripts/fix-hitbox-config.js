#!/usr/bin/env node
// Quick script to fix the hitbox-config.js corruptions

const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, 'hitbox-config.js');
const content = fs.readFileSync(configFile, 'utf8');

// Fix the corruptions
let fixed = content
    // Fix orb in hitboxes section (line ~160)
    .replace(/(\n\s+)('orb':\s*\{\s*flipX:[^}]+\})(,?\s*\n\s+'wizard':)/, 
             "$1'orb': { width: 30, height: 30, offsetX: 17, offsetY: 17 }$3")
    // Fix grim in hitboxes section (line ~162)
    .replace(/(\n\s+'wizard':[^}]+\},?\s*\n\s+)('grim':\s*\{\s*flipX:[^}]+\})(,?\s*\n)/, 
             "$1'grim': { width: 31, height: 50, offsetX: 16, offsetY: 10 }$3")
    // Fix grim in shadows section (line ~178)
    .replace(/(\n\s+'blip':[^}]+\},?\s*\n\s+)('grim':\s*\{\s*flipX:[^}]+\})(,?\s*\n)/, 
             "$1'grim': { width: 40, height: 8, offsetX: 0, offsetY: 35, alpha: 0.3 }$3");

// Verify the fixes
const orbMatches = (fixed.match(/'orb':[^}]+\}/g) || []);
const grimMatches = (fixed.match(/'grim':[^}]+\}/g) || []);

console.log('Found orb entries:', orbMatches.length);
orbMatches.forEach((match, i) => {
    console.log(`  ${i+1}. ${match.substring(0, 50)}...`);
});

console.log('Found grim entries:', grimMatches.length);
grimMatches.forEach((match, i) => {
    console.log(`  ${i+1}. ${match.substring(0, 50)}...`);
});

// Check if all entries are correct
const hasOrbHitbox = fixed.includes("'orb': { width: 30, height: 30, offsetX: 17, offsetY: 17 }");
const hasGrimHitbox = fixed.includes("'grim': { width: 31, height: 50, offsetX: 16, offsetY: 10 }");
const hasGrimShadow = fixed.includes("'grim': { width: 40, height: 8, offsetX: 0, offsetY: 35, alpha: 0.3 }");

if (hasOrbHitbox && hasGrimHitbox && hasGrimShadow) {
    fs.writeFileSync(configFile, fixed);
    console.log('✅ Fixed all corruptions successfully');
} else {
    console.log('❌ Some fixes may not have been applied correctly');
    console.log('  Has orb hitbox:', hasOrbHitbox);
    console.log('  Has grim hitbox:', hasGrimHitbox);
    console.log('  Has grim shadow:', hasGrimShadow);
}