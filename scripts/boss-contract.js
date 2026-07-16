(function exposeBossCombatContract(root, factory) {
    const contract = factory();
    if (typeof module === 'object' && module.exports) module.exports = contract;
    if (root) root.BossCombatContract = contract;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createBossCombatContract() {
    const DENSITY_HEALTH = Object.freeze({
        beginner: 0.1,
        sparse: 0.25,
        normal: 0.5,
        dense: 0.75,
        swarm: 1.0
    });

    function densityHealthMultiplier(value) {
        return DENSITY_HEALTH[value] || DENSITY_HEALTH.normal;
    }

    function nextCooldownAt(now, duration, speedMultiplier = 1) {
        return now + duration / Math.max(speedMultiplier || 1, 0.01);
    }

    function cooldownReady(now, readyAt = 0) {
        return now >= readyAt;
    }

    function directionalFrameRange(rowIndex, framesPerRow) {
        return { start: rowIndex * framesPerRow, end: rowIndex * framesPerRow + framesPerRow - 1 };
    }

    function applyCappedHealthDamage(health, maxHealth, damage) {
        const appliedDamage = Math.min(Math.max(0, damage), Math.ceil(maxHealth * 0.25), Math.max(0, health));
        return { health: Math.max(0, health - appliedDamage), appliedDamage };
    }

    function createEncounter(id, bosses) {
        return {
            id,
            bosses: new Set((Array.isArray(bosses) ? bosses : [bosses]).filter(Boolean)),
            lifetimeTimers: new Set(),
            actionTimers: new Set(),
            actionTweens: new Set(),
            cleanups: new Set(),
            actionGeneration: 0,
            terminal: false,
            completionStarted: false
        };
    }

    function destroyOwned(item) {
        if (!item) return;
        if (typeof item.destroy === 'function') item.destroy();
        else if (typeof item.stop === 'function') item.stop();
        else if (typeof item.remove === 'function') item.remove();
    }

    function cancelActions(encounter) {
        if (!encounter) return;
        encounter.actionGeneration++;
        encounter.actionTimers.forEach(destroyOwned);
        encounter.actionTimers.clear();
        encounter.actionTweens.forEach(destroyOwned);
        encounter.actionTweens.clear();
        encounter.cleanups.forEach(cleanup => {
            try { cleanup(); } catch (_error) { /* continue cancelling remaining owned work */ }
        });
        encounter.cleanups.clear();
    }

    function terminateEncounter(encounter) {
        if (!encounter || encounter.terminal) return false;
        encounter.terminal = true;
        cancelActions(encounter);
        encounter.lifetimeTimers.forEach(destroyOwned);
        encounter.lifetimeTimers.clear();
        return true;
    }

    function isCallbackValid(encounter, boss, generation) {
        return !!(encounter && !encounter.terminal && encounter.bosses.has(boss) && generation === encounter.actionGeneration);
    }

    function claimCompletion(encounter) {
        if (!encounter || encounter.completionStarted) return false;
        encounter.completionStarted = true;
        return true;
    }

    return Object.freeze({
        DENSITY_HEALTH,
        densityHealthMultiplier,
        nextCooldownAt,
        cooldownReady,
        directionalFrameRange,
        applyCappedHealthDamage,
        createEncounter,
        cancelActions,
        terminateEncounter,
        isCallbackValid,
        claimCompletion
    });
});
