// Wave definitions and progression
export const WAVE_DEFINITIONS = [
    {
        name: 'Wave 1',
        duration: 30000,
        enemies: [
            { type: 'tree', count: 5, delay: 2000 },
            { type: 'slime', count: 3, delay: 3000 }
        ]
    },
    {
        name: 'Wave 2',
        duration: 45000,
        enemies: [
            { type: 'tree', count: 8, delay: 1500 },
            { type: 'slime', count: 5, delay: 2000 },
            { type: 'bat', count: 3, delay: 3000 }
        ]
    },
    {
        name: 'Wave 3',
        duration: 60000,
        enemies: [
            { type: 'mushroom', count: 6, delay: 2000 },
            { type: 'golem', count: 2, delay: 5000, variant: 'orange' },
            { type: 'bat', count: 5, delay: 1500 }
        ]
    },
    {
        name: 'Wave 4',
        duration: 75000,
        enemies: [
            { type: 'golem', count: 3, delay: 4000, variant: 'blue' },
            { type: 'fireworm', count: 4, delay: 3000 },
            { type: 'summoner', count: 2, delay: 8000 }
        ]
    },
    {
        name: 'Wave 5',
        duration: 90000,
        enemies: [
            { type: 'soul', count: 5, delay: 3000 },
            { type: 'bloboid', count: 4, delay: 4000 },
            { type: 'summoner', count: 3, delay: 7000 },
            { type: 'golem', count: 4, delay: 5000, variant: 'mixed' }
        ]
    },
    {
        name: 'Endless',
        duration: -1, // Infinite duration
        enemies: 'dynamic' // Use spawn weights
    }
];

// Get spawn delay based on wave and difficulty
export function getSpawnDelay(waveNumber, baseDelay = 2000) {
    const difficultyMultiplier = Math.max(0.5, 1 - (waveNumber - 1) * 0.1);
    return Math.floor(baseDelay * difficultyMultiplier);
}

// Get enemy count multiplier based on wave
export function getEnemyCountMultiplier(waveNumber) {
    return 1 + Math.floor((waveNumber - 1) / 3) * 0.5;
}

// Determine which enemies to spawn for endless mode
export function getEndlessEnemies(elapsedTime, playerLevel) {
    const difficulty = getEndlessDifficulty(elapsedTime);
    const spawnWeights = getSpawnWeightsForDifficulty(difficulty);
    
    return selectEnemiesFromWeights(spawnWeights, playerLevel);
}

function getEndlessDifficulty(elapsedTime) {
    const minutes = elapsedTime / 60000;
    if (minutes < 2) return 'early';
    if (minutes < 5) return 'medium';
    if (minutes < 10) return 'hard';
    return 'nightmare';
}

function getSpawnWeightsForDifficulty(difficulty) {
    const weights = {
        early: { tree: 70, slime: 30 },
        medium: { tree: 30, slime: 20, bat: 20, mushroom: 15, golem: 15 },
        hard: { tree: 10, slime: 10, bat: 15, mushroom: 15, golem: 20, fireworm: 10, summoner: 10, soul: 5, bloboid: 5 },
        nightmare: { golem: 25, fireworm: 20, summoner: 20, soul: 15, bloboid: 15, bat: 5 }
    };
    
    return weights[difficulty] || weights.medium;
}

function selectEnemiesFromWeights(weights, playerLevel) {
    const enemies = [];
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    // Generate 3-5 enemy spawns
    const spawnCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < spawnCount; i++) {
        let random = Math.random() * totalWeight;
        
        for (const [enemy, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                enemies.push({
                    type: enemy,
                    count: 1 + Math.floor(playerLevel / 5),
                    delay: 1000 + Math.random() * 2000
                });
                break;
            }
        }
    }
    
    return enemies;
}