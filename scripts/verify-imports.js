/**
 * Verify all imports work correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyImports() {
    console.log('Verifying all system imports...\n');
    
    const errors = [];
    const successes = [];
    
    // Test systems/index.js
    try {
        const systems = await import('./src/systems/index.js');
        console.log('✓ Systems index loaded');
        
        // Check expected exports
        const expectedExports = [
            'ElementSystem', 'SpellSystem', 'AudioManager', 'InputManager', 'SaveSystem',
            'CutsceneManager', 'BossStateMachine', 'BossPatterns', 'BossIntegration',
            'DamageSystem', 'ProjectileManager',
            'EnemyManager', 'WaveSystem',
            'ChargeSystem', 'PlayerController', 'PlayerStats',
            'UIManager'
        ];
        
        for (const exportName of expectedExports) {
            if (systems[exportName]) {
                successes.push(`✓ ${exportName} exported correctly`);
            } else {
                errors.push(`✗ ${exportName} not found in exports`);
            }
        }
    } catch (error) {
        errors.push(`✗ Failed to load systems/index.js: ${error.message}`);
    }
    
    // Test individual system files
    const systemFiles = [
        { path: './src/systems/combat/DamageSystem.js', exports: ['DamageSystem'] },
        { path: './src/systems/combat/ProjectileManager.js', exports: ['ProjectileManager'] },
        { path: './src/systems/enemies/EnemyManager.js', exports: ['EnemyManager'] },
        { path: './src/systems/enemies/WaveSystem.js', exports: ['WaveSystem'] },
        { path: './src/systems/player/ChargeSystem.js', exports: ['ChargeSystem'] },
        { path: './src/systems/player/PlayerController.js', exports: ['PlayerController'] },
        { path: './src/systems/player/PlayerStats.js', exports: ['PlayerStats'] },
        { path: './src/systems/ui/UIManager.js', exports: ['UIManager'] }
    ];
    
    for (const file of systemFiles) {
        try {
            const module = await import(file.path);
            for (const exportName of file.exports) {
                if (module[exportName]) {
                    successes.push(`✓ ${file.path}: ${exportName} exists`);
                } else {
                    errors.push(`✗ ${file.path}: ${exportName} not found`);
                }
            }
        } catch (error) {
            errors.push(`✗ Failed to load ${file.path}: ${error.message}`);
        }
    }
    
    // Print results
    console.log('\n=== RESULTS ===\n');
    
    if (successes.length > 0) {
        console.log('Successes:');
        successes.forEach(s => console.log('  ' + s));
    }
    
    if (errors.length > 0) {
        console.log('\nErrors:');
        errors.forEach(e => console.log('  ' + e));
    }
    
    console.log(`\nTotal: ${successes.length} passed, ${errors.length} failed`);
    
    return errors.length === 0;
}

// Run verification
verifyImports().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Verification failed:', error);
    process.exit(1);
});