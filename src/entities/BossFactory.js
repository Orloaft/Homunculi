// Boss Factory - Creates bosses using the new state machine system

import ObeliskBoss from './bosses/ObeliskBoss.js';
import ArcherBoss from './bosses/ArcherBoss.js';
import DemonSlimeBoss from './bosses/DemonSlimeBoss.js';
import NekrosBoss from './bosses/NekrosBoss.js';
import EyelorBoss from './bosses/EyelorBoss.js';

export class BossFactory {
    static createBoss(scene, stage, x, y) {
        let boss;
        
        switch (stage) {
            case 'forest':
                boss = new ObeliskBoss(scene, x, y);
                break;
                
            case 'cave':
                boss = new ArcherBoss(scene, x, y);
                break;
                
            case 'lava':
                boss = new DemonSlimeBoss(scene, x, y);
                break;
                
            case 'sand':
                boss = new EyelorBoss(scene, x, y);
                break;
                
            case 'grave':
                boss = new NekrosBoss(scene, x, y);
                break;
                
            default:
                boss = new ObeliskBoss(scene, x, y);
                break;
        }
        
        return boss;
    }
    
    static setupBossForScene(scene, boss) {
        // Add boss to physics and groups
        if (scene.enemies) {
            scene.enemies.add(boss);
        }
        
        // Set up collisions
        if (scene.wizard) {
            scene.physics.add.collider(boss, scene.wizard, (boss, wizard) => {
                if (wizard.takeDamage && !wizard.isInvulnerable) {
                    wizard.takeDamage(boss.damage);
                }
            });
        }
        
        // Set up boss-specific properties
        boss.scene = scene;
        
        // Create boss health bar UI
        if (scene.createBossHealthBar) {
            scene.createBossHealthBar();
        }
        
        // Store boss reference
        scene.boss = boss;
        
        // Initialize health thresholds for minion waves
        scene.bossHealthThresholds = new Set([75, 50, 25]);
        
        return boss;
    }
}

export default BossFactory;