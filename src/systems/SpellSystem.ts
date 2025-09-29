/**
 * Spell System - Handles spell casting and element fusion
 */

import { ElementType, ElementConfig, SpellCast, Vector2 } from '@/types/game.types';
import { EventBus } from '@/core/EventBus';
import { Entity } from '@/entities/Entity';

interface FusionRule {
  elements: [ElementType, ElementType];
  result: ElementType;
}

export class SpellSystem {
  private elements: Map<ElementType, ElementConfig> = new Map();
  private fusionRules: FusionRule[] = [];
  private activeSpells: SpellCast[] = [];
  private cooldowns: Map<string, number> = new Map();
  private eventBus: EventBus;
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.initializeElements();
    this.initializeFusionRules();
  }
  
  /**
   * Initialize element configurations
   */
  private initializeElements(): void {
    // Primary elements
    this.registerElement({
      type: ElementType.FIRE,
      name: 'Fire',
      damage: 10,
      fireRate: 1.0,
      projectileSpeed: 300,
      projectileSize: 16,
      piercing: false,
      area: false,
      tier: 1,
      color: 0xff4444,
      description: 'Basic fire spell that burns enemies'
    });
    
    this.registerElement({
      type: ElementType.WATER,
      name: 'Water',
      damage: 8,
      fireRate: 1.2,
      projectileSpeed: 250,
      projectileSize: 20,
      piercing: false,
      area: false,
      effects: [{
        type: 'slow',
        duration: 2000,
        value: 0.5,
        chance: 0.3
      }],
      tier: 1,
      color: 0x4444ff,
      description: 'Water spell that can slow enemies'
    });
    
    this.registerElement({
      type: ElementType.EARTH,
      name: 'Earth',
      damage: 15,
      fireRate: 0.8,
      projectileSpeed: 200,
      projectileSize: 24,
      piercing: false,
      area: true,
      areaRadius: 50,
      tier: 1,
      color: 0x8b4513,
      description: 'Heavy earth spell with area damage'
    });
    
    this.registerElement({
      type: ElementType.AIR,
      name: 'Air',
      damage: 6,
      fireRate: 2.0,
      projectileSpeed: 400,
      projectileSize: 12,
      piercing: true,
      area: false,
      tier: 1,
      color: 0xcccccc,
      description: 'Fast air spell that pierces enemies'
    });
    
    this.registerElement({
      type: ElementType.LIGHTNING,
      name: 'Lightning',
      damage: 12,
      fireRate: 1.5,
      projectileSpeed: 500,
      projectileSize: 14,
      piercing: false,
      area: false,
      chain: 3,
      tier: 1,
      color: 0xffff00,
      description: 'Lightning that chains between enemies'
    });
    
    this.registerElement({
      type: ElementType.ARCANE,
      name: 'Arcane',
      damage: 9,
      fireRate: 1.0,
      projectileSpeed: 350,
      projectileSize: 18,
      piercing: false,
      area: false,
      tier: 1,
      color: 0xff00ff,
      description: 'Pure magical energy'
    });
    
    // Tier 2 Fusions
    this.registerElement({
      type: ElementType.STEAM,
      name: 'Steam',
      damage: 14,
      fireRate: 1.3,
      projectileSpeed: 280,
      projectileSize: 22,
      piercing: false,
      area: true,
      areaRadius: 40,
      effects: [{
        type: 'burn',
        duration: 3000,
        value: 2,
        chance: 0.5
      }],
      tier: 2,
      fusion: [ElementType.FIRE, ElementType.WATER],
      color: 0xaaaaaa,
      description: 'Scalding steam that burns and spreads'
    });
    
    this.registerElement({
      type: ElementType.LAVA,
      name: 'Lava',
      damage: 20,
      fireRate: 0.6,
      projectileSpeed: 150,
      projectileSize: 30,
      piercing: false,
      area: true,
      areaRadius: 60,
      effects: [{
        type: 'burn',
        duration: 5000,
        value: 3,
        chance: 0.8
      }],
      tier: 2,
      fusion: [ElementType.FIRE, ElementType.EARTH],
      color: 0xff6600,
      description: 'Molten lava with heavy damage and burn'
    });
    
    // Special elements
    this.registerElement({
      type: ElementType.CHAOS,
      name: 'Chaos',
      damage: 25,
      fireRate: 0.8,
      projectileSpeed: 300,
      projectileSize: 25,
      piercing: true,
      area: true,
      areaRadius: 100,
      tier: 4,
      color: 0x800080,
      description: 'Unpredictable chaos magic'
    });
    
    // Chess pieces (passive elements)
    this.registerElement({
      type: ElementType.ROOK,
      name: 'Rook',
      damage: 0,
      fireRate: 0,
      projectileSpeed: 0,
      projectileSize: 0,
      piercing: false,
      area: false,
      passive: true,
      tier: 1,
      color: 0x666666,
      description: '+20% projectile size and damage'
    });
  }
  
  /**
   * Initialize fusion rules
   */
  private initializeFusionRules(): void {
    // Primary fusions
    this.addFusionRule(ElementType.FIRE, ElementType.WATER, ElementType.STEAM);
    this.addFusionRule(ElementType.FIRE, ElementType.EARTH, ElementType.LAVA);
    this.addFusionRule(ElementType.FIRE, ElementType.AIR, ElementType.SMOKE);
    this.addFusionRule(ElementType.WATER, ElementType.EARTH, ElementType.MUD);
    this.addFusionRule(ElementType.WATER, ElementType.AIR, ElementType.ICE);
    this.addFusionRule(ElementType.WATER, ElementType.LIGHTNING, ElementType.STORM);
    this.addFusionRule(ElementType.EARTH, ElementType.AIR, ElementType.SAND);
    this.addFusionRule(ElementType.EARTH, ElementType.LIGHTNING, ElementType.CRYSTAL);
    this.addFusionRule(ElementType.AIR, ElementType.LIGHTNING, ElementType.TEMPEST);
    
    // Advanced fusions
    this.addFusionRule(ElementType.LAVA, ElementType.AIR, ElementType.VOLCANO);
    this.addFusionRule(ElementType.LAVA, ElementType.EARTH, ElementType.METEOR);
    this.addFusionRule(ElementType.ICE, ElementType.LIGHTNING, ElementType.CRYSTAL);
    this.addFusionRule(ElementType.STORM, ElementType.AIR, ElementType.TORNADO);
    this.addFusionRule(ElementType.WATER, ElementType.WATER, ElementType.WAVE);
  }
  
  /**
   * Register an element configuration
   */
  registerElement(config: ElementConfig): void {
    this.elements.set(config.type, config);
  }
  
  /**
   * Add a fusion rule
   */
  addFusionRule(element1: ElementType, element2: ElementType, result: ElementType): void {
    this.fusionRules.push({
      elements: [element1, element2],
      result
    });
  }
  
  /**
   * Get fusion result for two elements
   */
  getFusionResult(element1: ElementType, element2: ElementType): ElementType | null {
    for (const rule of this.fusionRules) {
      const [a, b] = rule.elements;
      if ((a === element1 && b === element2) || (a === element2 && b === element1)) {
        return rule.result;
      }
    }
    return null;
  }
  
  /**
   * Cast a spell
   */
  castSpell(
    caster: Entity,
    element: ElementType,
    target?: Vector2
  ): SpellCast | null {
    // Check if element exists
    const elementConfig = this.elements.get(element);
    if (!elementConfig) {
      console.warn(`Unknown element: ${element}`);
      return null;
    }
    
    // Check if passive element
    if (elementConfig.passive) {
      console.log(`${element} is a passive element`);
      return null;
    }
    
    // Check cooldown
    const cooldownKey = `${caster.id}-${element}`;
    const lastCast = this.cooldowns.get(cooldownKey) || 0;
    const now = Date.now();
    const cooldownTime = (1000 / elementConfig.fireRate);
    
    if (now - lastCast < cooldownTime) {
      return null; // Still on cooldown
    }
    
    // Calculate direction
    const direction = target ? 
      this.calculateDirection(caster.position, target) :
      { x: 1, y: 0 }; // Default direction
    
    // Create spell cast
    const spellCast: SpellCast = {
      element,
      position: { ...caster.position },
      direction,
      damage: this.calculateDamage(elementConfig, caster),
      caster,
      timestamp: now
    };
    
    // Update cooldown
    this.cooldowns.set(cooldownKey, now);
    
    // Add to active spells
    this.activeSpells.push(spellCast);
    
    // Emit event
    this.eventBus.emit('spell:cast', {
      element: element,
      position: spellCast.position
    });
    
    return spellCast;
  }
  
  /**
   * Calculate spell damage with modifiers
   */
  private calculateDamage(config: ElementConfig, caster: Entity): number {
    let damage = config.damage;
    
    // Apply caster modifiers
    const damageBonus = caster.getComponent<number>('damageBonus');
    if (damageBonus) {
      damage *= (1 + damageBonus);
    }
    
    // Apply element mastery
    const mastery = caster.getComponent<Map<ElementType, number>>('elementMastery');
    if (mastery && mastery.has(config.type)) {
      const masteryLevel = mastery.get(config.type)!;
      damage *= (1 + masteryLevel * 0.1); // 10% per mastery level
    }
    
    return Math.round(damage);
  }
  
  /**
   * Calculate direction vector
   */
  private calculateDirection(from: Vector2, to: Vector2): Vector2 {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) {
      return { x: 1, y: 0 };
    }
    
    return {
      x: dx / distance,
      y: dy / distance
    };
  }
  
  /**
   * Update spell system
   */
  update(deltaTime: number): void {
    // Update active spells
    const now = Date.now();
    this.activeSpells = this.activeSpells.filter(spell => {
      // Remove old spells (after 5 seconds)
      return now - spell.timestamp < 5000;
    });
  }
  
  /**
   * Get element configuration
   */
  getElement(type: ElementType): ElementConfig | undefined {
    return this.elements.get(type);
  }
  
  /**
   * Get all elements
   */
  getAllElements(): ElementConfig[] {
    return Array.from(this.elements.values());
  }
  
  /**
   * Get elements by tier
   */
  getElementsByTier(tier: number): ElementConfig[] {
    return Array.from(this.elements.values()).filter(e => e.tier === tier);
  }
  
  /**
   * Check if element is unlocked (placeholder for unlock system)
   */
  isElementUnlocked(element: ElementType, unlockedElements: Set<ElementType>): boolean {
    // Check if directly unlocked
    if (unlockedElements.has(element)) {
      return true;
    }
    
    // Check if it's a fusion and both components are unlocked
    const config = this.elements.get(element);
    if (config?.fusion) {
      const [elem1, elem2] = config.fusion;
      return unlockedElements.has(elem1) && unlockedElements.has(elem2);
    }
    
    return false;
  }
  
  /**
   * Clear all cooldowns
   */
  clearCooldowns(): void {
    this.cooldowns.clear();
  }
  
  /**
   * Reset spell system
   */
  reset(): void {
    this.activeSpells = [];
    this.cooldowns.clear();
  }
}

export default SpellSystem;