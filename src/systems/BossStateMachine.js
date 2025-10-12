// Boss State Machine System for Predictable Boss Behavior
class BossState {
    constructor(name, config) {
        this.name = name;
        this.enter = config.enter || (() => {});
        this.update = config.update || ((dt) => {});
        this.exit = config.exit || (() => {});
        this.duration = config.duration || -1; // -1 = infinite
        this.canInterrupt = config.canInterrupt !== false; // Default true
    }
}
class BossBehavior {
    constructor(name, config) {
        this.name = name;
        this.condition = config.condition || (() => true);
        this.priority = config.priority || 0;
        this.pattern = config.pattern || [];
        this.currentPatternIndex = 0;
        this.enter = config.enter || (() => {});
        this.exit = config.exit || (() => {});
    }
    getNextState() {
        if (this.pattern.length === 0) return null;
        const state = this.pattern[this.currentPatternIndex];
        this.currentPatternIndex = (this.currentPatternIndex + 1) % this.pattern.length;
        return state;
    }
    reset() {
        this.currentPatternIndex = 0;
    }
}
export class BossStateMachine {
    constructor(boss, scene) {
        this.boss = boss;
        this.scene = scene;
        // State management
        this.states = new Map();
        this.currentState = null;
        this.stateTimer = 0;
        this.previousState = null;
        // Behavior management
        this.behaviors = [];
        this.currentBehavior = null;
        // Debug mode
        this.debug = false;
    }
    addState(name, config) {
        this.states.set(name, new BossState(name, config));
    }
    addBehavior(name, config) {
        this.behaviors.push(new BossBehavior(name, config));
        // Sort by priority (higher priority first)
        this.behaviors.sort((a, b) => b.priority - a.priority);
    }
    changeState(stateName, force = false) {
        // Check if current state can be interrupted
        if (this.currentState && !force) {
            const currentStateObj = this.states.get(this.currentState);
            if (currentStateObj && !currentStateObj.canInterrupt) {
                return false;
            }
        }
        // Exit current state
        if (this.currentState && this.states.has(this.currentState)) {
            const state = this.states.get(this.currentState);
            state.exit.call(this.boss);
            this.previousState = this.currentState;
        }
        // Enter new state
        this.currentState = stateName;
        this.stateTimer = 0;
        if (this.states.has(stateName)) {
            const state = this.states.get(stateName);
            state.enter.call(this.boss);
            if (this.debug) {
                }
            return true;
        }
        return false;
    }
    update(dt) {
        if (!this.boss.isActive || this.boss.health <= 0) return;
        // Update behavior selection
        this.updateBehavior(dt);
        // Update current state
        if (this.currentState && this.states.has(this.currentState)) {
            const state = this.states.get(this.currentState);
            state.update.call(this.boss, dt, this);
            this.stateTimer += dt;
            // Check for automatic state duration transitions
            if (state.duration > 0 && this.stateTimer >= state.duration) {
                this.onStateComplete();
            }
        }
    }
    updateBehavior(dt) {
        // Find the highest priority behavior whose condition is met
        let selectedBehavior = null;
        for (const behavior of this.behaviors) {
            if (behavior.condition.call(this.boss)) {
                selectedBehavior = behavior;
                break;
            }
        }
        // Switch behavior if needed
        if (selectedBehavior !== this.currentBehavior) {
            if (this.currentBehavior) {
                this.currentBehavior.exit.call(this.boss);
                this.currentBehavior.reset();
            }
            this.currentBehavior = selectedBehavior;
            if (this.currentBehavior) {
                this.currentBehavior.enter.call(this.boss);
                if (this.debug) {
                    }
            }
        }
    }
    onStateComplete() {
        // Get next state from current behavior
        if (this.currentBehavior) {
            const nextState = this.currentBehavior.getNextState();
            if (nextState) {
                this.changeState(nextState);
            } else {
                // Default to idle if no next state defined
                this.changeState('idle');
            }
        } else {
            this.changeState('idle');
        }
    }
    getCurrentStateName() {
        return this.currentState;
    }
    isInState(stateName) {
        return this.currentState === stateName;
    }
    getStateTimer() {
        return this.stateTimer;
    }
}
// Helper functions for common boss patterns
export const BossPatterns = {
    // Creates a simple attack pattern
    simpleAttack: (attackState, cooldownState, attackDuration = 2, cooldownDuration = 1) => {
        return [
            { state: attackState, duration: attackDuration },
            { state: cooldownState, duration: cooldownDuration }
        ];
    },
    // Creates a charge-then-attack pattern
    chargeAttack: (chargeState, attackState, cooldownState, chargeDuration = 1.5, attackDuration = 1, cooldownDuration = 1) => {
        return [
            { state: chargeState, duration: chargeDuration },
            { state: attackState, duration: attackDuration },
            { state: cooldownState, duration: cooldownDuration }
        ];
    },
    // Creates a movement pattern
    movementPattern: (moveState, duration = 3) => {
        return [
            { state: moveState, duration: duration }
        ];
    },
    // Creates a defensive pattern
    defensivePattern: (shieldState, counterState, shieldDuration = 2, counterDuration = 1) => {
        return [
            { state: shieldState, duration: shieldDuration },
            { state: counterState, duration: counterDuration }
        ];
    }
};
export default BossStateMachine;