const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SaveManager = require(path.join(ROOT, 'src/systems/SaveManager.js'));

class MockStorage {
    constructor(entries = {}) {
        this.values = new Map(Object.entries(entries));
        this.failSet = null;
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        if (this.failSet && this.failSet(key, String(value))) {
            const error = new Error('Simulated storage quota/write failure');
            error.name = 'QuotaExceededError';
            throw error;
        }
        this.values.set(key, String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }

    clear() {
        this.values.clear();
    }
}

function withStorage(entries, test) {
    const previous = global.localStorage;
    const storage = new MockStorage(entries);
    global.localStorage = storage;
    try {
        return test(storage);
    } finally {
        global.localStorage = previous;
    }
}

function makeValidSave(manager) {
    const save = manager.getEmptySaveData();
    save.player.level = 7;
    save.stages.completedStages = ['forest-1', 'cave-1'];
    save.stages.unlockedWorlds = ['forestland', 'caveland', 'sandland'];
    return save;
}

withStorage({ wizbiz_save_0: '{broken-json' }, storage => {
    const manager = new SaveManager();
    const before = storage.getItem('wizbiz_save_0');
    const slot = manager.inspectSlot(0);
    assert.strictEqual(slot.status, 'CORRUPT');
    assert.strictEqual(slot.isEmpty, false);
    assert.strictEqual(slot.rawPayload, before);
    assert.strictEqual(manager.createNewSave(0), null);
    assert.strictEqual(storage.getItem('wizbiz_save_0'), before, 'corrupt raw payload was overwritten');
});

withStorage({
    wizbiz_save_0: JSON.stringify({
        version: '0.9.0',
        player: { level: 13, gold: 88 },
        stages: { completedStages: ['forest-1'], unlockedWorlds: ['forestland', 'spireland'] },
        inventory: { spells: ['fireball', 'ice'] },
        customProgress: { retained: true }
    })
}, storage => {
    const manager = new SaveManager();
    const enumerated = manager.getAllSaveSlots();
    assert.deepStrictEqual(enumerated.map(slot => slot.status), ['VALID', 'EMPTY', 'EMPTY']);
    assert.strictEqual(enumerated[0].metadata.playerLevel, 13);
    assert.deepStrictEqual(enumerated[0].data.inventory.items, []);
    assert.deepStrictEqual(enumerated[0].data.inventory.equipment, { weapon: null, armor: null, accessory: null });
    assert.deepStrictEqual(enumerated[0].data.alchemy.discoveredRecipes, []);
    assert.strictEqual(enumerated[0].data.customProgress.retained, true);
    assert(enumerated[0].data.stages.unlockedWorlds.includes('spireland'), 'valid future-content history was discarded');
    assert(manager.loadAndSetCurrent(0), 'supported old save did not load');
    const persisted = JSON.parse(storage.getItem('wizbiz_save_0'));
    assert.strictEqual(persisted.version, '1.0.0');
    assert.strictEqual(persisted.player.level, 13);
    assert.strictEqual(new SaveManager().loadSlot(0).customProgress.retained, true, 'migration did not survive reload');
});

withStorage({
    wizbiz_save_0: JSON.stringify({ version: '9.0.0', player: {}, stages: {}, inventory: {} })
}, storage => {
    const manager = new SaveManager();
    const before = storage.getItem('wizbiz_save_0');
    assert.strictEqual(manager.inspectSlot(0).status, 'INCOMPATIBLE');
    assert.strictEqual(manager.createNewSave(0), null);
    assert.strictEqual(storage.getItem('wizbiz_save_0'), before, 'future save was overwritten');
});

withStorage({}, storage => {
    const seedManager = new SaveManager();
    const originalSave = makeValidSave(seedManager);
    assert(seedManager.saveToSlot(0, originalSave));
    const before = storage.getItem('wizbiz_save_0');
    originalSave.player.level = 99;
    storage.failSet = key => key.endsWith('_pending');
    assert.strictEqual(seedManager.saveToSlot(0, originalSave), false);
    assert.strictEqual(storage.getItem('wizbiz_save_0'), before, 'quota failure destroyed last known payload');
    assert(seedManager.getLastPersistenceError().includes('Simulated'));
});

withStorage({}, storage => {
    const manager = new SaveManager();
    const save = makeValidSave(manager);
    assert(manager.saveToSlot(0, save));
    const before = storage.getItem('wizbiz_save_0');
    save.player.level = 22;
    storage.failSet = key => key === 'wizbiz_save_0';
    assert.strictEqual(manager.saveToSlot(0, save), false);
    assert.strictEqual(storage.getItem('wizbiz_save_0'), before, 'commit failure destroyed last known payload');
    assert.strictEqual(storage.getItem('wizbiz_save_0_pending'), null, 'failed transaction was not cleaned');
});

withStorage({
    wizbiz_save_0: '{bad',
    wizbiz_save_1: JSON.stringify({ version: '7.0.0' }),
    wizbiz_save_2: JSON.stringify({ player: { level: 4 }, stages: {}, inventory: { spells: [] } })
}, storage => {
    const manager = new SaveManager();
    assert.deepStrictEqual(manager.getAllSaveSlots().map(slot => slot.status), ['CORRUPT', 'INCOMPATIBLE', 'VALID']);
    const rawCorrupt = storage.getItem('wizbiz_save_0');
    assert.strictEqual(manager.createNewSave(0), null);
    assert.strictEqual(storage.getItem('wizbiz_save_0'), rawCorrupt);
    assert.strictEqual(manager.deleteSlot(0), true, 'explicit reset failed');
    assert.strictEqual(manager.inspectSlot(0).status, 'EMPTY');
    assert(manager.createNewSave(0), 'new save did not work after explicit reset');
    assert.strictEqual(manager.inspectSlot(0).status, 'VALID');
});

withStorage({}, () => {
    const manager = new SaveManager();
    const save = manager.getEmptySaveData();
    save.stages.completedStages = [
        'forest-1', 'cave-1', 'sand-1', 'swamp-1', 'snow-1',
        'ocean-1', 'lava-1', 'grave-1', 'castle-1', 'spire-1'
    ];
    save.stages.unlockedWorlds.push('spireland');
    assert.strictEqual(manager.calculateProgress(save), 100, 'nine-world release completion should be 100%');
    save.stages.completedStages = ['spire-1'];
    assert.strictEqual(manager.calculateProgress(save), 0, 'deferred progress must not inflate release completion');
});

const gameSource = fs.readFileSync(path.join(ROOT, 'scripts/game.js'), 'utf8');
const progressionPrefix = gameSource.slice(0, gameSource.indexOf('class LoadingScene')) +
    '\nmodule.exports = { STAGE_PROGRESSION, RELEASE_STAGE_PROGRESSION, getNextStageProgressionEntry };';
const progressionSandbox = { module: { exports: {} }, localStorage: new MockStorage(), console };
vm.runInNewContext(progressionPrefix, progressionSandbox);
const progression = progressionSandbox.module.exports;
assert.strictEqual(progression.RELEASE_STAGE_PROGRESSION.length, 9);
assert.strictEqual(progression.RELEASE_STAGE_PROGRESSION[8].stage, 'castle');
assert.strictEqual(progression.getNextStageProgressionEntry('castle'), null);
assert(progression.STAGE_PROGRESSION.some(entry => entry.stage === 'spire'), 'future Spire content was deleted');
assert(!gameSource.includes("{ name: 'Spire Land', unlocked:"), 'deferred Spire is still on the normal stage map');
assert(gameSource.includes('NINE WORLDS RESTORED'));
assert(gameSource.includes("this.scene.start('LoadingScene', {\n                nextScene: 'GameScene'"), 'normal retry does not restart GameScene');
assert(gameSource.includes('retryData: this.getRetryData()'), 'loss transition does not preserve retry data');
assert(!gameSource.includes('this.playerHealth -= damage'), 'a P1 damage path still permits negative health');
assert(gameSource.includes('this.playerHealth = Math.max(0, this.playerHealth - damage)'), 'P1 clamp is missing');

const seaKingPath = path.join(ROOT, 'assets/enemies/oceanlandenemies/threekingsboss/Beholder1/Death/Beholder1_Death_bpdy.png');
assert(fs.existsSync(seaKingPath), 'Sea King 1 death sheet is missing');
const png = fs.readFileSync(seaKingPath);
assert.strictEqual(png.readUInt32BE(16), 576);
assert.strictEqual(png.readUInt32BE(20), 256);
assert(gameSource.includes('Beholder1/Death/Beholder1_Death_bpdy.png'));
assert(gameSource.includes('for (let kingNum = 1; kingNum <= 3; kingNum++)'));
assert(gameSource.includes('end: rowIndex * 9 + 8'));
assert(gameSource.includes('if (this.seaKingsCompletionStarted) return;'), 'Ocean completion lacks exactly-once guard');

const indexSource = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert(!/https?:\/\/[^"']+/.test(indexSource), 'shipped page still has a remote startup request');
assert(!indexSource.includes('THREE.'), 'removed Three.js startup path still executes');
assert(indexSource.includes('gamecartridge/Box+Cartridge-export.png'));

const saveSlotSource = fs.readFileSync(path.join(ROOT, 'src/scenes/SaveSlotScene.js'), 'utf8');
assert(saveSlotSource.includes('CORRUPT SAVE'));
assert(saveSlotSource.includes('INCOMPATIBLE SAVE'));
assert(saveSlotSource.includes('RESET OCCUPIED SLOT?'));
assert(saveSlotSource.includes('Cancel keeps it unchanged.'));

console.log('✅ Web release-blocker regression contract passed');
