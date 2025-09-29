/**
 * SpellSystem Unit Tests
 */

import { SpellSystem } from '@/systems/SpellSystem';
import { EventBus } from '@/core/EventBus';
import { Entity } from '@/entities/Entity';
import { ElementType, Vector2 } from '@/types/game.types';

// Mock Entity class
class MockEntity extends Entity {
  init(): void {}
  update(deltaTime: number): void {}
  render(): void {}
  onDestroy(): void {}
  clone(): Entity {
    return new MockEntity(
      { type: 'mock', position: { ...this.position } },
      this.eventBus
    );
  }
}

describe('SpellSystem', () => {
  let spellSystem: SpellSystem;
  let eventBus: EventBus;
  let mockCaster: MockEntity;

  beforeEach(() => {
    eventBus = new EventBus();
    spellSystem = new SpellSystem(eventBus);
    mockCaster = new MockEntity(
      {
        id: 'player1',
        type: 'player',
        position: { x: 100, y: 100 }
      },
      eventBus
    );
  });

  describe('Element Registration', () => {
    it('should have all primary elements registered', () => {
      expect(spellSystem.getElement(ElementType.FIRE)).toBeDefined();
      expect(spellSystem.getElement(ElementType.WATER)).toBeDefined();
      expect(spellSystem.getElement(ElementType.EARTH)).toBeDefined();
      expect(spellSystem.getElement(ElementType.AIR)).toBeDefined();
      expect(spellSystem.getElement(ElementType.LIGHTNING)).toBeDefined();
      expect(spellSystem.getElement(ElementType.ARCANE)).toBeDefined();
    });

    it('should have correct properties for fire element', () => {
      const fire = spellSystem.getElement(ElementType.FIRE);
      expect(fire).toMatchObject({
        type: ElementType.FIRE,
        name: 'Fire',
        damage: 10,
        fireRate: 1.0,
        tier: 1
      });
    });

    it('should register fusion elements', () => {
      expect(spellSystem.getElement(ElementType.STEAM)).toBeDefined();
      expect(spellSystem.getElement(ElementType.LAVA)).toBeDefined();
    });
  });

  describe('Element Fusion', () => {
    it('should return correct fusion for fire + water', () => {
      const result = spellSystem.getFusionResult(ElementType.FIRE, ElementType.WATER);
      expect(result).toBe(ElementType.STEAM);
    });

    it('should return correct fusion for fire + earth', () => {
      const result = spellSystem.getFusionResult(ElementType.FIRE, ElementType.EARTH);
      expect(result).toBe(ElementType.LAVA);
    });

    it('should work with reversed element order', () => {
      const result = spellSystem.getFusionResult(ElementType.WATER, ElementType.FIRE);
      expect(result).toBe(ElementType.STEAM);
    });

    it('should return null for non-fusable elements', () => {
      const result = spellSystem.getFusionResult(ElementType.FIRE, ElementType.FIRE);
      expect(result).toBeNull();
    });
  });

  describe('Spell Casting', () => {
    it('should cast a spell successfully', () => {
      const target: Vector2 = { x: 200, y: 200 };
      const spell = spellSystem.castSpell(mockCaster, ElementType.FIRE, target);

      expect(spell).toBeDefined();
      expect(spell?.element).toBe(ElementType.FIRE);
      expect(spell?.damage).toBeGreaterThan(0);
      expect(spell?.caster).toBe(mockCaster);
    });

    it('should not cast passive elements', () => {
      const spell = spellSystem.castSpell(mockCaster, ElementType.ROOK);
      expect(spell).toBeNull();
    });

    it('should enforce cooldowns', () => {
      const target: Vector2 = { x: 200, y: 200 };
      
      // First cast should succeed
      const spell1 = spellSystem.castSpell(mockCaster, ElementType.FIRE, target);
      expect(spell1).toBeDefined();

      // Immediate second cast should fail due to cooldown
      const spell2 = spellSystem.castSpell(mockCaster, ElementType.FIRE, target);
      expect(spell2).toBeNull();
    });

    it('should emit spell:cast event', () => {
      const eventSpy = jest.fn();
      eventBus.on('spell:cast', eventSpy);

      const target: Vector2 = { x: 200, y: 200 };
      spellSystem.castSpell(mockCaster, ElementType.FIRE, target);

      expect(eventSpy).toHaveBeenCalledWith({
        element: ElementType.FIRE,
        position: mockCaster.position
      });
    });

    it('should calculate direction correctly', () => {
      const target: Vector2 = { x: 200, y: 100 }; // Right from caster
      const spell = spellSystem.castSpell(mockCaster, ElementType.FIRE, target);

      expect(spell?.direction.x).toBeCloseTo(1, 1);
      expect(spell?.direction.y).toBeCloseTo(0, 1);
    });
  });

  describe('Damage Calculation', () => {
    it('should apply damage bonus from caster', () => {
      mockCaster.addComponent('damageBonus', 0.5); // 50% bonus
      
      const spell = spellSystem.castSpell(mockCaster, ElementType.FIRE);
      const baseFireDamage = 10;
      
      expect(spell?.damage).toBe(Math.round(baseFireDamage * 1.5));
    });

    it('should apply element mastery bonus', () => {
      const masteryMap = new Map<ElementType, number>();
      masteryMap.set(ElementType.FIRE, 3); // Level 3 mastery
      mockCaster.addComponent('elementMastery', masteryMap);
      
      const spell = spellSystem.castSpell(mockCaster, ElementType.FIRE);
      const baseFireDamage = 10;
      
      expect(spell?.damage).toBe(Math.round(baseFireDamage * 1.3)); // 30% bonus
    });
  });

  describe('Element Queries', () => {
    it('should get all elements', () => {
      const allElements = spellSystem.getAllElements();
      expect(allElements.length).toBeGreaterThan(0);
      expect(allElements.some(e => e.type === ElementType.FIRE)).toBe(true);
    });

    it('should get elements by tier', () => {
      const tier1Elements = spellSystem.getElementsByTier(1);
      const tier2Elements = spellSystem.getElementsByTier(2);

      expect(tier1Elements.some(e => e.type === ElementType.FIRE)).toBe(true);
      expect(tier2Elements.some(e => e.type === ElementType.STEAM)).toBe(true);
    });
  });

  describe('Unlock System', () => {
    it('should check if element is directly unlocked', () => {
      const unlockedElements = new Set([ElementType.FIRE, ElementType.WATER]);
      
      expect(spellSystem.isElementUnlocked(ElementType.FIRE, unlockedElements)).toBe(true);
      expect(spellSystem.isElementUnlocked(ElementType.EARTH, unlockedElements)).toBe(false);
    });

    it('should check if fusion element is unlocked via components', () => {
      const unlockedElements = new Set([ElementType.FIRE, ElementType.WATER]);
      
      // Steam should be unlocked because both fire and water are unlocked
      expect(spellSystem.isElementUnlocked(ElementType.STEAM, unlockedElements)).toBe(true);
      
      // Lava should not be unlocked because earth is not unlocked
      expect(spellSystem.isElementUnlocked(ElementType.LAVA, unlockedElements)).toBe(false);
    });
  });

  describe('System Management', () => {
    it('should clear all cooldowns', () => {
      const target: Vector2 = { x: 200, y: 200 };
      
      // Cast a spell to create a cooldown
      spellSystem.castSpell(mockCaster, ElementType.FIRE, target);
      
      // Clear cooldowns
      spellSystem.clearCooldowns();
      
      // Should be able to cast immediately
      const spell = spellSystem.castSpell(mockCaster, ElementType.FIRE, target);
      expect(spell).toBeDefined();
    });

    it('should reset the system', () => {
      const target: Vector2 = { x: 200, y: 200 };
      
      // Cast spells
      spellSystem.castSpell(mockCaster, ElementType.FIRE, target);
      spellSystem.castSpell(mockCaster, ElementType.WATER, target);
      
      // Reset
      spellSystem.reset();
      
      // Should be able to cast all spells immediately
      const fireSpell = spellSystem.castSpell(mockCaster, ElementType.FIRE, target);
      const waterSpell = spellSystem.castSpell(mockCaster, ElementType.WATER, target);
      
      expect(fireSpell).toBeDefined();
      expect(waterSpell).toBeDefined();
    });
  });
});