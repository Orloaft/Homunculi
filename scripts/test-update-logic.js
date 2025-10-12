#!/usr/bin/env node

// Test our update logic to find the bug

const testContent = `
    flips: {
        'grim': { flipX: true, flipY: false },
        'orb': { flipX: true, flipY: false }
    },
    
    hitboxes: {
        'orb': { width: 30, height: 30, offsetX: 17, offsetY: 17 },
        'grim': { width: 31, height: 50, offsetX: 16, offsetY: 10 }
    },
    
    shadows: {
        'grim': { width: 40, height: 8, offsetX: 0, offsetY: 35, alpha: 0.3 }
    }
`;

console.log('Testing section updates...\n');

// Simulate updating flips for grim to false
const flipsSectionMatch = testContent.match(/(flips:\s*\{)([\s\S]*?)(\n\s*\},)/);
if (flipsSectionMatch) {
    console.log('Found flips section:');
    console.log('  Full match:', flipsSectionMatch[0]);
    console.log('  Content:', flipsSectionMatch[2]);
    
    const sectionStart = testContent.indexOf(flipsSectionMatch[0]);
    const sectionEnd = sectionStart + flipsSectionMatch[0].length;
    console.log('  Position:', sectionStart, '-', sectionEnd);
    
    let flipsContent = flipsSectionMatch[2];
    
    // Try to update grim
    const grimPattern = /\n\s*['"]?grim['"]?\s*:\s*\{[^}]+\}/;
    if (grimPattern.test(flipsContent)) {
        console.log('  Found grim in flips section');
        flipsContent = flipsContent.replace(
            grimPattern,
            `\n        'grim': { flipX: false, flipY: false }`
        );
    }
    
    const newFlipsSection = `${flipsSectionMatch[1]}${flipsContent}${flipsSectionMatch[3]}`;
    const updated = testContent.substring(0, sectionStart) + newFlipsSection + testContent.substring(sectionEnd);
    
    console.log('\nUpdated content:');
    console.log(updated);
    
    // Check if hitboxes were affected
    const hitboxMatch = updated.match(/hitboxes:\s*\{[\s\S]*?\n\s*\},/);
    if (hitboxMatch) {
        console.log('\nHitboxes section after update:');
        console.log(hitboxMatch[0]);
    }
}