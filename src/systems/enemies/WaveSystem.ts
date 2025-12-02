/**
 * Wave System - Manages enemy waves and spawning
 * Handles wave progression, spawn queues, and endless mode
 */

import { WAVE_DEFINITIONS, getEndlessEnemies } from '../../data/WaveConfig';
import { ENEMY_SPAWN_CONFIG } from '../../data/GameConstants';
import type { EnemyType } from '../../data/EnemyConfig';

/**
 * Enemy spawn queue entry
 */
interface IEnemySpawn {
    type: EnemyType;
    variant?: string | null;
    delay: number;
    spawned: boolean;
}

/**
 * Wave started event data
 */
interface IWaveStartedData {
    readonly wave: number;
    readonly name: string;
    readonly duration: number;
}

/**
 * Wave completed event data
 */
interface IWaveCompletedData {
    readonly wave: number;
    readonly enemiesSpawned: number;
    readonly timeElapsed: number;
}

/**
 * Spawn position coordinates
 */
interface ISpawnPosition {
    x: number;
    y: number;
}

/**
 * Wave information
 */
interface IWaveInfo {
    number: number;
    name: string;
    duration: number;
    elapsed: number;
    spawned: number;
    isEndless: boolean;
}

/**
 * Player sprite interface for spawn positioning
 */
interface IPlayerSprite {
    x: number;
    y: number;
    active: boolean;
}

/**
 * Wave System - Manages enemy wave spawning
 */
export class WaveSystem {
    private scene: Phaser.Scene;

    // Wave state
    private currentWave: number;
    private waveStartTime: number;
    private enemySpawnQueue: IEnemySpawn[];
    private isEndless: boolean;

    // Spawn tracking
    private spawnedInWave: number;
    private totalSpawned: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Wave state
        this.currentWave = 0;
        this.waveStartTime = 0;
        this.enemySpawnQueue = [];
        this.isEndless = false;

        // Spawn tracking
        this.spawnedInWave = 0;
        this.totalSpawned = 0;

        this.setupEventListeners();
    }

    /**
     * Set up event listeners for wave control
     */
    private setupEventListeners(): void {
        // Listen for wave control events
        this.scene.events.on('startWave', (waveNumber: number) => {
            this.startWave(waveNumber);
        });

        this.scene.events.on('endWave', () => {
            this.endCurrentWave();
        });

        this.scene.events.on('startEndlessMode', () => {
            this.startEndlessMode();
        });
    }

    /**
     * Start a wave
     *
     * @param waveNumber - Wave number to start (null for next wave)
     */
    public startWave(waveNumber: number | null = null): void {
        if (waveNumber !== null) {
            this.currentWave = waveNumber;
        } else {
            this.currentWave++;
        }

        this.waveStartTime = this.scene.time.now;
        this.spawnedInWave = 0;

        // Get wave definition
        const waveIndex = Math.min(this.currentWave - 1, WAVE_DEFINITIONS.length - 1);
        const wave = WAVE_DEFINITIONS[waveIndex];

        if (!wave) return;

        if (wave.enemies === 'dynamic') {
            this.isEndless = true;
            this.generateEndlessSpawns();
        } else {
            this.isEndless = false;
            this.setupWaveSpawns(wave);
        }

        // Emit wave start event
        this.scene.events.emit('waveStarted', {
            wave: this.currentWave,
            name: wave.name,
            duration: wave.duration
        } as IWaveStartedData);
    }

    /**
     * Set up wave spawn queue
     *
     * @param wave - Wave definition
     */
    private setupWaveSpawns(wave: any): void {
        this.enemySpawnQueue = [];

        // Create spawn schedule
        wave.enemies.forEach((enemyGroup: any) => {
            for (let i = 0; i < enemyGroup.count; i++) {
                this.enemySpawnQueue.push({
                    type: enemyGroup.type,
                    variant: enemyGroup.variant,
                    delay: enemyGroup.delay * (i + 1),
                    spawned: false
                });
            }
        });

        // Sort by delay
        this.enemySpawnQueue.sort((a, b) => a.delay - b.delay);
    }

    /**
     * Generate endless mode spawns
     */
    private generateEndlessSpawns(): void {
        const elapsedTime = this.scene.time.now - this.waveStartTime;
        const playerLevel = (this.scene as any).playerStats?.level || 1;

        // Generate new spawn batch
        const enemies = getEndlessEnemies(elapsedTime, playerLevel);
        this.enemySpawnQueue = enemies.map(enemy => ({
            type: enemy.type,
            variant: enemy.variant,
            delay: enemy.delay,
            spawned: false
        }));
    }

    /**
     * Start endless mode
     */
    public startEndlessMode(): void {
        this.currentWave = WAVE_DEFINITIONS.length; // Set to endless wave
        this.isEndless = true;
        this.waveStartTime = this.scene.time.now;
        this.spawnedInWave = 0;

        this.generateEndlessSpawns();

        this.scene.events.emit('endlessModeStarted');
    }

    /**
     * Update wave system
     *
     * @param time - Current game time
     * @param _delta - Time elapsed since last update (unused)
     */
    public update(time: number, _delta: number): void {
        if (!(this.scene as any).gameStarted || this.currentWave === 0) return;

        const elapsedTime = time - this.waveStartTime;

        // Check for wave completion (non-endless)
        if (!this.isEndless) {
            const waveIndex = Math.min(this.currentWave - 1, WAVE_DEFINITIONS.length - 1);
            const wave = WAVE_DEFINITIONS[waveIndex];

            if (wave && wave.duration > 0 && elapsedTime > wave.duration) {
                this.completeWave();
                return;
            }
        }

        // Process spawn queue
        this.processSpawnQueue(elapsedTime);

        // Generate new spawns for endless mode
        if (this.isEndless && this.enemySpawnQueue.length === 0) {
            this.generateEndlessSpawns();
        }
    }

    /**
     * Process spawn queue and spawn enemies
     *
     * @param elapsedTime - Time elapsed since wave start
     */
    private processSpawnQueue(elapsedTime: number): void {
        const wizard = (this.scene as any).wizard as IPlayerSprite;
        if (!wizard || !wizard.active) return;

        // Check each enemy in queue
        for (const spawn of this.enemySpawnQueue) {
            if (!spawn.spawned && elapsedTime >= spawn.delay) {
                this.spawnWaveEnemy(spawn.type, spawn.variant);
                spawn.spawned = true;
                this.spawnedInWave++;
                this.totalSpawned++;
            }
        }

        // Remove spawned enemies from queue
        this.enemySpawnQueue = this.enemySpawnQueue.filter(spawn => !spawn.spawned);
    }

    /**
     * Spawn an enemy from the wave
     *
     * @param type - Enemy type
     * @param variant - Enemy variant
     */
    private spawnWaveEnemy(type: EnemyType, variant?: string | null): void {
        const wizard = (this.scene as any).wizard as IPlayerSprite;
        if (!wizard) return;

        // Calculate spawn position
        const spawnPos = this.calculateSpawnPosition(wizard.x, wizard.y);

        // Emit spawn event
        this.scene.events.emit('spawnEnemy', {
            type: type,
            x: spawnPos.x,
            y: spawnPos.y,
            variant: variant
        });
    }

    /**
     * Calculate spawn position around target
     *
     * @param targetX - Target X position
     * @param targetY - Target Y position
     * @returns Spawn position coordinates
     */
    private calculateSpawnPosition(targetX: number, targetY: number): ISpawnPosition {
        const minDist = ENEMY_SPAWN_CONFIG.spawnDistance;
        const maxDist = ENEMY_SPAWN_CONFIG.maxSpawnDistance;

        // Random angle
        const angle = Math.random() * Math.PI * 2;

        // Random distance between min and max
        const distance = minDist + Math.random() * (maxDist - minDist);

        // Calculate position
        let x = targetX + Math.cos(angle) * distance;
        let y = targetY + Math.sin(angle) * distance;

        // Clamp to world bounds
        const bounds = this.scene.physics.world.bounds;
        x = Math.max(100, Math.min(x, bounds.width - 100));
        y = Math.max(100, Math.min(y, bounds.height - 100));

        return { x, y };
    }

    /**
     * Complete the current wave
     */
    private completeWave(): void {
        // Emit wave complete event
        this.scene.events.emit('waveCompleted', {
            wave: this.currentWave,
            enemiesSpawned: this.spawnedInWave,
            timeElapsed: this.scene.time.now - this.waveStartTime
        } as IWaveCompletedData);

        // Auto-start next wave after delay
        this.scene.time.delayedCall(3000, () => {
            if (this.currentWave < WAVE_DEFINITIONS.length - 1) {
                this.startWave();
            } else {
                this.startEndlessMode();
            }
        });
    }

    /**
     * End the current wave
     */
    public endCurrentWave(): void {
        this.enemySpawnQueue = [];
        this.spawnedInWave = 0;
    }

    /**
     * Get current wave information
     *
     * @returns Wave information object
     */
    public getCurrentWaveInfo(): IWaveInfo {
        const waveIndex = Math.min(this.currentWave - 1, WAVE_DEFINITIONS.length - 1);
        const wave = WAVE_DEFINITIONS[waveIndex];

        return {
            number: this.currentWave,
            name: wave?.name || 'Unknown',
            duration: wave?.duration || 0,
            elapsed: this.scene.time.now - this.waveStartTime,
            spawned: this.spawnedInWave,
            isEndless: this.isEndless
        };
    }

    /**
     * Reset wave system
     */
    public reset(): void {
        this.currentWave = 0;
        this.waveStartTime = 0;
        this.enemySpawnQueue = [];
        this.isEndless = false;
        this.spawnedInWave = 0;
        this.totalSpawned = 0;
    }
}
