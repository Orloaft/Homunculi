// This is a completely rewritten updateHitboxConfig function that fixes the corruption issue
// by processing all sections in reverse order to maintain index validity

function updateHitboxConfig(hitboxes, shadows, scales, flips) {
    console.log('updateHitboxConfig called with:', {
        hitboxCount: Object.keys(hitboxes || {}).length,
        shadowCount: Object.keys(shadows || {}).length,
        scaleCount: Object.keys(scales || {}).length,
        flipCount: Object.keys(flips || {}).length,
        scales: scales,
        flips: flips,
        hitboxes: hitboxes
    });
    
    try {
        // Read the current hitbox-config.js
        let configContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
        
        // Collect all section updates with their positions
        const sectionsToUpdate = [];
        
        // Find flips section
        if (flips && Object.keys(flips).length > 0) {
            const flipsSectionMatch = configContent.match(/(flips:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (flipsSectionMatch) {
                const sectionStart = configContent.indexOf(flipsSectionMatch[0]);
                const sectionEnd = sectionStart + flipsSectionMatch[0].length;
                let flipsContent = flipsSectionMatch[2];
                
                for (const [spriteType, flipData] of Object.entries(flips)) {
                    const escapedType = spriteType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*\\{[^}]+\\}`);
                    
                    if (existingPattern.test(flipsContent)) {
                        console.log(`Updating existing flip for ${spriteType}`);
                        flipsContent = flipsContent.replace(
                            existingPattern,
                            `\n        '${spriteType}': { flipX: ${flipData.flipX}, flipY: ${flipData.flipY} }`
                        );
                    } else {
                        console.log(`Adding new flip for ${spriteType}: flipX=${flipData.flipX}, flipY=${flipData.flipY}`);
                        if (flipsContent.trim() === '') {
                            flipsContent = `\n        '${spriteType}': { flipX: ${flipData.flipX}, flipY: ${flipData.flipY} }\n    `;
                        } else {
                            flipsContent += `,\n        '${spriteType}': { flipX: ${flipData.flipX}, flipY: ${flipData.flipY} }`;
                        }
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${flipsSectionMatch[1]}${flipsContent}${flipsSectionMatch[3]}`
                });
            }
        }
        
        // Find shadows section
        if (shadows && Object.keys(shadows).length > 0) {
            const shadowsSectionMatch = configContent.match(/(shadows:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (shadowsSectionMatch) {
                const sectionStart = configContent.indexOf(shadowsSectionMatch[0]);
                const sectionEnd = sectionStart + shadowsSectionMatch[0].length;
                let shadowsContent = shadowsSectionMatch[2];
                
                for (const [enemyType, shadow] of Object.entries(shadows)) {
                    const escapedType = enemyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*\\{[^}]+\\}`);
                    
                    if (existingPattern.test(shadowsContent)) {
                        console.log(`Updating existing shadow for ${enemyType}`);
                        shadowsContent = shadowsContent.replace(
                            existingPattern,
                            `\n        '${enemyType}': { width: ${shadow.width}, height: ${shadow.height}, offsetX: ${shadow.offsetX}, offsetY: ${shadow.offsetY}, alpha: ${shadow.alpha} }`
                        );
                    } else {
                        console.log(`Adding new shadow for ${enemyType}`);
                        shadowsContent += `,\n        '${enemyType}': { width: ${shadow.width}, height: ${shadow.height}, offsetX: ${shadow.offsetX}, offsetY: ${shadow.offsetY}, alpha: ${shadow.alpha} }`;
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${shadowsSectionMatch[1]}${shadowsContent}${shadowsSectionMatch[3]}`
                });
            }
        }
        
        // Find hitboxes section
        if (hitboxes && Object.keys(hitboxes).length > 0) {
            const hitboxesSectionMatch = configContent.match(/(hitboxes:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (hitboxesSectionMatch) {
                const sectionStart = configContent.indexOf(hitboxesSectionMatch[0]);
                const sectionEnd = sectionStart + hitboxesSectionMatch[0].length;
                let hitboxesContent = hitboxesSectionMatch[2];
                
                for (const [enemyType, hitbox] of Object.entries(hitboxes)) {
                    const escapedType = enemyType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*\\{[^}]+\\}`);
                    
                    if (existingPattern.test(hitboxesContent)) {
                        console.log(`Updating existing hitbox for ${enemyType}`);
                        const hasQuotes = new RegExp(`\\n\\s*'${escapedType}'\\s*:`).test(hitboxesContent);
                        const prefix = hasQuotes ? `'${enemyType}'` : enemyType;
                        
                        hitboxesContent = hitboxesContent.replace(
                            existingPattern,
                            `\n        ${prefix}: { width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} }`
                        );
                    } else {
                        console.log(`Adding new hitbox for ${enemyType}`);
                        hitboxesContent += `,\n        '${enemyType}': { width: ${hitbox.width}, height: ${hitbox.height}, offsetX: ${hitbox.offsetX}, offsetY: ${hitbox.offsetY} }`;
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${hitboxesSectionMatch[1]}${hitboxesContent}${hitboxesSectionMatch[3]}`
                });
            }
        }
        
        // Find scales section
        if (scales && Object.keys(scales).length > 0) {
            const scalesSectionMatch = configContent.match(/(scales:\s*\{)([\s\S]*?)(\n\s*\},)/);
            if (scalesSectionMatch) {
                const sectionStart = configContent.indexOf(scalesSectionMatch[0]);
                const sectionEnd = sectionStart + scalesSectionMatch[0].length;
                let scalesContent = scalesSectionMatch[2];
                
                for (const [spriteType, scale] of Object.entries(scales)) {
                    const escapedType = spriteType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const existingPattern = new RegExp(`\\n\\s*['"]?${escapedType}['"]?\\s*:\\s*[\\d.]+`);
                    
                    if (existingPattern.test(scalesContent)) {
                        console.log(`Updating existing scale for ${spriteType} to ${scale}`);
                        scalesContent = scalesContent.replace(
                            existingPattern,
                            `\n        '${spriteType}': ${scale}`
                        );
                    } else {
                        console.log(`Adding new scale for ${spriteType}: ${scale}`);
                        scalesContent += `,\n        '${spriteType}': ${scale}`;
                    }
                }
                
                sectionsToUpdate.push({
                    start: sectionStart,
                    end: sectionEnd,
                    newContent: `${scalesSectionMatch[1]}${scalesContent}${scalesSectionMatch[3]}`
                });
            }
        }
        
        // Sort sections by start position in REVERSE order (end to beginning)
        // This ensures that when we replace sections, we don't invalidate the indices of earlier sections
        sectionsToUpdate.sort((a, b) => b.start - a.start);
        
        // Apply all updates in reverse order
        for (const section of sectionsToUpdate) {
            console.log(`Updating section at position ${section.start}-${section.end}`);
            configContent = configContent.substring(0, section.start) + section.newContent + configContent.substring(section.end);
        }
        
        // Write back the updated configuration
        fs.writeFileSync(HITBOX_CONFIG_FILE, configContent);
        console.log('✅ hitbox-config.js updated successfully');
        
        // Verification logging
        const verifyContent = fs.readFileSync(HITBOX_CONFIG_FILE, 'utf8');
        if (verifyContent.includes("'grim':")) {
            const grimLine = verifyContent.split('\n').find(line => line.includes("'grim':") && line.includes('width'));
            console.log('Verification - grim hitbox line after save:', grimLine);
        }
        if (verifyContent.includes("'orb':")) {
            const orbLine = verifyContent.split('\n').find(line => line.includes("'orb':") && line.includes('width'));
            console.log('Verification - orb hitbox line after save:', orbLine);
        }
        
        // Log what was updated
        const updates = [];
        if (scales && Object.keys(scales).length > 0) {
            updates.push(`${Object.keys(scales).length} scales`);
        }
        if (hitboxes && Object.keys(hitboxes).length > 0) {
            updates.push(`${Object.keys(hitboxes).length} hitboxes`);
        }
        if (shadows && Object.keys(shadows).length > 0) {
            updates.push(`${Object.keys(shadows).length} shadows`);
        }
        if (flips && Object.keys(flips).length > 0) {
            updates.push(`${Object.keys(flips).length} flips`);
        }
        
        if (updates.length > 0) {
            console.log(`Summary: Updated ${updates.join(', ')}`);
        }
    } catch (error) {
        console.error('❌ Error updating hitbox-config.js:', error);
        throw error;
    }
}