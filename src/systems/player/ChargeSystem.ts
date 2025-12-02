/**
 * Charge system for managing elemental charges
 * Handles charge storage, linking, cooldowns, and auto-firing
 */

import { PLAYER_CONFIG } from '../../data/GameConstants';
import { ELEMENT_CONFIG, type ElementKey } from '../../data/ElementConfig';
import { getFusionResult } from '../../data/FusionRecipes';

/**
 * Charge group - array of linked elements
 */
export type ChargeGroup = ElementKey[];

/**
 * Charges changed event data
 */
export interface IChargesChangedData {
    readonly charges: ElementKey[];
    readonly groups: ChargeGroup[];
}

/**
 * Charge replaced event data
 */
export interface IChargeReplacedData {
    readonly index: number;
    readonly oldElement: ElementKey;
    readonly newElement: ElementKey;
    readonly charges: ElementKey[];
    readonly groups: ChargeGroup[];
}

/**
 * Charge removed event data
 */
export interface IChargeRemovedData {
    readonly index: number;
    readonly element: ElementKey;
    readonly charges: ElementKey[];
}

/**
 * Charges swapped event data
 */
export interface IChargesSwappedData {
    readonly index1: number;
    readonly index2: number;
    readonly charges: ElementKey[];
}

/**
 * Link toggled event data
 */
export interface ILinkToggledData {
    readonly index: number;
    readonly linked: boolean;
    readonly groups: ChargeGroup[];
}

/**
 * Charge management system
 */
export class ChargeSystem {
    private scene: Phaser.Scene;

    // Charge management
    private charges: ElementKey[];
    private maxCharges: number;
    private chargeGroups: ChargeGroup[];
    private chargeCooldowns: number[];

    // Linking system
    private linkedCharges: Set<number>;
    private linkSlots: number;

    // Auto-fire settings
    public autoShootEnabled: boolean;
    private lastAutoShootTime: number;
    private autoShootCooldown: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Charge management
        this.charges = [];
        this.maxCharges = PLAYER_CONFIG.startingCharges;
        this.chargeGroups = [];
        this.chargeCooldowns = [];

        // Linking system
        this.linkedCharges = new Set();
        this.linkSlots = 0;

        // Auto-fire settings
        this.autoShootEnabled = true;
        this.lastAutoShootTime = 0;
        this.autoShootCooldown = 2000;

        this.setupEventListeners();
    }

    /**
     * Set up event listeners for charge management
     */
    private setupEventListeners(): void {
        // Listen for element additions
        this.scene.events.on('addElement', (element: ElementKey) => {
            this.addCharge(element);
        });

        // Listen for charge expansion
        this.scene.events.on('expandCharges', () => {
            this.expandMaxCharges();
        });

        // Listen for link slot additions
        this.scene.events.on('addLinkSlot', () => {
            this.addLinkSlot();
        });
    }

    /**
     * Add a new charge
     *
     * @param element - Element to add
     * @returns True if charge was added successfully
     */
    public addCharge(element: ElementKey): boolean {
        if (this.charges.length < this.maxCharges) {
            this.charges.push(element);
            this.chargeCooldowns.push(0);
            this.updateChargeGroups();

            // Emit event for UI update
            this.scene.events.emit('chargesChanged', {
                charges: this.charges,
                groups: this.chargeGroups
            } as IChargesChangedData);

            return true;
        }
        return false;
    }

    /**
     * Replace a charge at specific index
     *
     * @param index - Index to replace
     * @param newElement - New element
     * @returns True if replaced successfully
     */
    public replaceCharge(index: number, newElement: ElementKey): boolean {
        if (index >= 0 && index < this.charges.length) {
            const oldElement = this.charges[index];
            this.charges[index] = newElement;
            this.updateChargeGroups();

            // Emit event for UI update
            this.scene.events.emit('chargeReplaced', {
                index,
                oldElement,
                newElement,
                charges: this.charges,
                groups: this.chargeGroups
            } as IChargeReplacedData);

            return true;
        }
        return false;
    }

    /**
     * Remove a charge at specific index
     *
     * @param index - Index to remove
     * @returns Removed element or null
     */
    public removeCharge(index: number): ElementKey | null {
        if (index >= 0 && index < this.charges.length) {
            const removedElement = this.charges.splice(index, 1)[0];
            this.chargeCooldowns.splice(index, 1);

            // Update links if necessary
            this.linkedCharges.delete(index);
            const newLinkedCharges = new Set<number>();
            for (const linkedIndex of this.linkedCharges) {
                if (linkedIndex > index) {
                    newLinkedCharges.add(linkedIndex - 1);
                } else {
                    newLinkedCharges.add(linkedIndex);
                }
            }
            this.linkedCharges = newLinkedCharges;

            this.updateChargeGroups();

            // Emit event
            this.scene.events.emit('chargeRemoved', {
                index,
                element: removedElement,
                charges: this.charges
            } as IChargeRemovedData);

            return removedElement;
        }
        return null;
    }

    /**
     * Swap two charges
     *
     * @param index1 - First charge index
     * @param index2 - Second charge index
     * @returns True if swapped successfully
     */
    public swapCharges(index1: number, index2: number): boolean {
        if (
            index1 >= 0 &&
            index1 < this.charges.length &&
            index2 >= 0 &&
            index2 < this.charges.length
        ) {
            // Swap charges
            [this.charges[index1], this.charges[index2]] = [this.charges[index2], this.charges[index1]];

            // Swap cooldowns
            [this.chargeCooldowns[index1], this.chargeCooldowns[index2]] = [
                this.chargeCooldowns[index2],
                this.chargeCooldowns[index1]
            ];

            // Update links
            const newLinkedCharges = new Set<number>();
            for (const index of this.linkedCharges) {
                if (index === index1) newLinkedCharges.add(index2);
                else if (index === index2) newLinkedCharges.add(index1);
                else newLinkedCharges.add(index);
            }
            this.linkedCharges = newLinkedCharges;

            this.updateChargeGroups();

            // Emit event
            this.scene.events.emit('chargesSwapped', {
                index1,
                index2,
                charges: this.charges
            } as IChargesSwappedData);

            return true;
        }
        return false;
    }

    /**
     * Toggle link at specific index
     *
     * @param index - Index to toggle link
     * @returns True if toggled successfully
     */
    public toggleLink(index: number): boolean {
        if (index >= 0 && index < this.charges.length - 1) {
            if (this.linkedCharges.has(index)) {
                this.linkedCharges.delete(index);
            } else if (this.linkedCharges.size < this.linkSlots) {
                this.linkedCharges.add(index);
            } else {
                return false; // No available link slots
            }

            this.updateChargeGroups();

            // Emit event
            this.scene.events.emit('linkToggled', {
                index,
                linked: this.linkedCharges.has(index),
                groups: this.chargeGroups
            } as ILinkToggledData);

            return true;
        }
        return false;
    }

    /**
     * Add a link slot
     */
    public addLinkSlot(): void {
        this.linkSlots++;
        this.scene.events.emit('linkSlotsChanged', this.linkSlots);
    }

    /**
     * Expand maximum charge capacity
     *
     * @returns True if expanded successfully
     */
    public expandMaxCharges(): boolean {
        if (this.maxCharges < PLAYER_CONFIG.maxCharges) {
            this.maxCharges++;
            this.scene.events.emit('maxChargesChanged', this.maxCharges);
            return true;
        }
        return false;
    }

    /**
     * Update charge groups based on links
     */
    private updateChargeGroups(): void {
        this.chargeGroups = [];
        const processedIndices = new Set<number>();

        for (let i = 0; i < this.charges.length; i++) {
            if (processedIndices.has(i)) continue;

            const group: ChargeGroup = [this.charges[i]];
            let currentIndex = i;
            processedIndices.add(i);

            // Follow the chain of links
            while (this.linkedCharges.has(currentIndex) && currentIndex < this.charges.length - 1) {
                currentIndex++;
                group.push(this.charges[currentIndex]);
                processedIndices.add(currentIndex);
            }

            this.chargeGroups.push(group);
        }
    }

    /**
     * Update cooldowns
     *
     * @param deltaTime - Time elapsed in milliseconds
     */
    public updateCooldowns(deltaTime: number): void {
        for (let i = 0; i < this.chargeCooldowns.length; i++) {
            if (this.chargeCooldowns[i] > 0) {
                this.chargeCooldowns[i] = Math.max(0, this.chargeCooldowns[i] - deltaTime);
            }
        }
    }

    /**
     * Check if a charge group can fire
     *
     * @param groupIndex - Group index to check
     * @returns True if group can fire
     */
    public canFire(groupIndex: number): boolean {
        if (groupIndex >= 0 && groupIndex < this.chargeGroups.length) {
            // Find the first charge index of this group
            let chargeIndex = 0;
            for (let i = 0; i < groupIndex; i++) {
                chargeIndex += this.chargeGroups[i].length;
            }

            return this.chargeCooldowns[chargeIndex] <= 0;
        }
        return false;
    }

    /**
     * Set cooldown for a charge group
     *
     * @param groupIndex - Group index
     * @param cooldown - Cooldown time in milliseconds
     */
    public setGroupCooldown(groupIndex: number, cooldown: number): void {
        if (groupIndex >= 0 && groupIndex < this.chargeGroups.length) {
            let chargeIndex = 0;
            for (let i = 0; i < groupIndex; i++) {
                chargeIndex += this.chargeGroups[i].length;
            }

            // Set cooldown for all charges in the group
            for (let i = 0; i < this.chargeGroups[groupIndex].length; i++) {
                this.chargeCooldowns[chargeIndex + i] = cooldown;
            }
        }
    }

    /**
     * Get fire rate for an element
     *
     * @param element - Element to check
     * @returns Fire rate multiplier
     */
    public getFireRate(element: ElementKey): number {
        const config = ELEMENT_CONFIG[element];
        return config ? config.fireRate : 1.0;
    }

    /**
     * Get average fire rate for a charge group
     *
     * @param group - Charge group
     * @returns Average fire rate
     */
    public getGroupFireRate(group: ChargeGroup): number {
        // Average fire rate of all elements in the group
        let totalRate = 0;
        for (const element of group) {
            totalRate += this.getFireRate(element);
        }
        return totalRate / group.length;
    }

    /**
     * Check if auto-fire should trigger
     *
     * @param currentTime - Current game time in milliseconds
     * @returns True if should auto-fire
     */
    public shouldAutoFire(currentTime: number): boolean {
        if (!this.autoShootEnabled || this.charges.length === 0) {
            return false;
        }

        return currentTime - this.lastAutoShootTime >= this.autoShootCooldown;
    }

    /**
     * Update the last auto-fire time
     *
     * @param currentTime - Current game time in milliseconds
     */
    public updateAutoFireTime(currentTime: number): void {
        this.lastAutoShootTime = currentTime;
    }

    /**
     * Get charge at specific index
     *
     * @param index - Charge index
     * @returns Element or null
     */
    public getChargeAtIndex(index: number): ElementKey | null {
        return this.charges[index] || null;
    }

    /**
     * Get all charge groups
     *
     * @returns Array of charge groups
     */
    public getChargeGroups(): ChargeGroup[] {
        return this.chargeGroups;
    }

    /**
     * Get all charges as array
     *
     * @returns Array of all charges
     */
    public getAllCharges(): ElementKey[] {
        return [...this.charges];
    }

    /**
     * Check if index is linked
     *
     * @param index - Index to check
     * @returns True if linked
     */
    public isLinked(index: number): boolean {
        return this.linkedCharges.has(index);
    }

    /**
     * Get all linked indices
     *
     * @returns Array of linked indices
     */
    public getLinkedIndices(): number[] {
        return Array.from(this.linkedCharges);
    }

    /**
     * Reset charge system to initial state
     */
    public reset(): void {
        this.charges = [];
        this.chargeGroups = [];
        this.chargeCooldowns = [];
        this.linkedCharges.clear();
        this.linkSlots = 0;
        this.maxCharges = PLAYER_CONFIG.startingCharges;
        this.lastAutoShootTime = 0;
    }
}
