import { PLAYER_CONFIG } from '../../data/GameConstants.js';
import { ELEMENT_CONFIG } from '../../data/ElementConfig.js';
import { getFusionResult } from '../../data/FusionRecipes.js';

export class ChargeSystem {
    constructor(scene) {
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
    
    setupEventListeners() {
        // Listen for element additions
        this.scene.events.on('addElement', (element) => {
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
    
    addCharge(element) {
        if (this.charges.length < this.maxCharges) {
            this.charges.push(element);
            this.chargeCooldowns.push(0);
            this.updateChargeGroups();
            
            // Emit event for UI update
            this.scene.events.emit('chargesChanged', {
                charges: this.charges,
                groups: this.chargeGroups
            });
            
            return true;
        }
        return false;
    }
    
    replaceCharge(index, newElement) {
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
            });
            
            return true;
        }
        return false;
    }
    
    removeCharge(index) {
        if (index >= 0 && index < this.charges.length) {
            const removedElement = this.charges.splice(index, 1)[0];
            this.chargeCooldowns.splice(index, 1);
            
            // Update links if necessary
            this.linkedCharges.delete(index);
            const newLinkedCharges = new Set();
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
            });
            
            return removedElement;
        }
        return null;
    }
    
    swapCharges(index1, index2) {
        if (index1 >= 0 && index1 < this.charges.length &&
            index2 >= 0 && index2 < this.charges.length) {
            
            // Swap charges
            [this.charges[index1], this.charges[index2]] = 
            [this.charges[index2], this.charges[index1]];
            
            // Swap cooldowns
            [this.chargeCooldowns[index1], this.chargeCooldowns[index2]] = 
            [this.chargeCooldowns[index2], this.chargeCooldowns[index1]];
            
            // Update links
            const newLinkedCharges = new Set();
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
            });
            
            return true;
        }
        return false;
    }
    
    toggleLink(index) {
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
            });
            
            return true;
        }
        return false;
    }
    
    addLinkSlot() {
        this.linkSlots++;
        this.scene.events.emit('linkSlotsChanged', this.linkSlots);
    }
    
    expandMaxCharges() {
        if (this.maxCharges < PLAYER_CONFIG.maxCharges) {
            this.maxCharges++;
            this.scene.events.emit('maxChargesChanged', this.maxCharges);
            return true;
        }
        return false;
    }
    
    updateChargeGroups() {
        this.chargeGroups = [];
        const processedIndices = new Set();
        
        for (let i = 0; i < this.charges.length; i++) {
            if (processedIndices.has(i)) continue;
            
            const group = [this.charges[i]];
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
    
    updateCooldowns(deltaTime) {
        for (let i = 0; i < this.chargeCooldowns.length; i++) {
            if (this.chargeCooldowns[i] > 0) {
                this.chargeCooldowns[i] = Math.max(0, this.chargeCooldowns[i] - deltaTime);
            }
        }
    }
    
    canFire(groupIndex) {
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
    
    setGroupCooldown(groupIndex, cooldown) {
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
    
    getFireRate(element) {
        const config = ELEMENT_CONFIG[element];
        return config ? config.fireRate : 1.0;
    }
    
    getGroupFireRate(group) {
        // Average fire rate of all elements in the group
        let totalRate = 0;
        for (const element of group) {
            totalRate += this.getFireRate(element);
        }
        return totalRate / group.length;
    }
    
    shouldAutoFire(currentTime) {
        if (!this.autoShootEnabled || this.charges.length === 0) {
            return false;
        }
        
        return currentTime - this.lastAutoShootTime >= this.autoShootCooldown;
    }
    
    updateAutoFireTime(currentTime) {
        this.lastAutoShootTime = currentTime;
    }
    
    getChargeAtIndex(index) {
        return this.charges[index] || null;
    }
    
    getChargeGroups() {
        return this.chargeGroups;
    }
    
    getAllCharges() {
        return [...this.charges];
    }
    
    isLinked(index) {
        return this.linkedCharges.has(index);
    }
    
    getLinkedIndices() {
        return Array.from(this.linkedCharges);
    }
    
    reset() {
        this.charges = [];
        this.chargeGroups = [];
        this.chargeCooldowns = [];
        this.linkedCharges.clear();
        this.linkSlots = 0;
        this.maxCharges = PLAYER_CONFIG.startingCharges;
        this.lastAutoShootTime = 0;
    }
}