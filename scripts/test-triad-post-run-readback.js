const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(ROOT, 'scripts/game.js'), 'utf8');
const start = source.indexOf('class GameOverScene extends Phaser.Scene');
const end = source.indexOf('class TalentTreeScene extends Phaser.Scene');
assert(start >= 0 && end > start, 'GameOverScene source boundary missing');

const sandbox = { module: { exports: {} }, Phaser: { Scene: class {} } };
vm.runInNewContext(`${source.slice(start, end)}\nmodule.exports = GameOverScene;`, sandbox);
const GameOverScene = sandbox.module.exports;
const scene = new GameOverScene();

const twoPlayerSummary = {
    resonantTriad: true,
    triadPlayers: [
        {
            playerNumber: 2, discipline: 'tempest', signaturesTriggered: 3, signatureMetric: 7, reagents: 1,
            recipeDiscoveries: ['air+water=ice']
        },
        {
            playerNumber: 1, discipline: 'crucible', signaturesTriggered: 4, signatureMetric: 9, reagents: 2,
            recipeDiscoveries: ['earth+fire=lava']
        }
    ],
    triadDecisionLog: {
        events: [
            { type: 'attunement', ownerPlayerNumber: 1 },
            { type: 'choice_commit', ownerPlayerNumber: 1, action: 'fusion' },
            { type: 'attunement', ownerPlayerNumber: 2 },
            { type: 'choice_commit', ownerPlayerNumber: 2, action: 'acquire' }
        ]
    }
};

const triadLines = scene.getTriadPostRunReadbackLines(twoPlayerSummary);
assert.strictEqual(triadLines[0], 'RESONANT TRIAD ATTRIBUTION');
assert(triadLines.includes('P1 Crucible | Signatures: 4 | Metric: 9 | Reagents: 2'));
assert(triadLines.includes('  Trail: attuned -> fused | Discovery: Earth + Fire -> Lava'));
assert(triadLines.includes('P2 Tempest | Signatures: 3 | Metric: 7 | Reagents: 1'));
assert(triadLines.includes('  Trail: attuned -> acquired | Discovery: Air + Water -> Ice'));

const incompleteLines = scene.getTriadPostRunReadbackLines({
    resonantTriad: true,
    triadPlayers: [{ playerNumber: 1, discipline: 'bastion', signaturesTriggered: 'bad', signatureMetric: null }],
    triadDecisionLog: { events: [{ type: 'choice_failure', ownerPlayerNumber: 1 }] }
});
assert(incompleteLines.includes('P1 Bastion | Signatures: 0 | Metric: 0 | Reagents: 0'));
assert(incompleteLines.includes('  Trail: no recorded choices | Discovery: none recorded'));
assert.strictEqual(scene.getTriadPostRunReadbackLines({ resonantTriad: false, triadPlayers: twoPlayerSummary.triadPlayers }).length, 0);
assert.strictEqual(scene.getTriadPostRunReadbackLines({ resonantTriad: true, triadPlayers: [{ playerNumber: 1 }] }).length, 0);

scene.runRewardReadback = {
    essenceAwarded: 8, essenceTotal: 20, outcomeLabel: 'Victory', durationText: '10:00', levelReached: 12,
    enemiesKilled: 184, itemsCollected: 42, equippedElements: ['fire'], buildSummary: { ...twoPlayerSummary, passivePicks: [] },
    fusionCount: 2, fusionsUsed: ['lava'], carryLine: 'lava cast volume', stageIdentity: 'Forest creature pressure',
    stageRoster: ['mushroom'], won: true, progressionSuppressed: false, firstCompletion: false, stageName: 'Forest Land',
    unlockedWorldName: null, unlockedCharacterName: null, bestTimeImproved: false, newRecipeText: null,
    alchemyNudge: 'Try pairing Fire with Earth.'
};
assert(scene.getRunRewardReadbackLines().includes('RESONANT TRIAD ATTRIBUTION'));
scene.runRewardReadback.buildSummary = { resonantTriad: false, triadPlayers: twoPlayerSummary.triadPlayers, passivePicks: [] };
assert(!scene.getRunRewardReadbackLines().includes('RESONANT TRIAD ATTRIBUTION'));

console.log('Triad post-run readback assertions passed');
