# Spell System Analysis - Shared Properties

**Objective:** Identify all shared properties between spells for game balance adjustments and talent tree buff application.

**Date:** 2025-10-16

---

## Executive Summary

Your spell system uses a **decentralized property assignment** approach where spell properties are assigned at projectile creation time throughout multiple fire functions. This analysis identifies all shared properties that can be systematically adjusted for balance and talent tree modifications.

---

## Core Spell Properties

### 1. **Damage Properties**

#### Base Damage
- **Property:** `projectile.damage`
- **Type:** Number
- **Location:** Assigned in individual fire functions (e.g., game.js:27031, 27681, 28243)
- **Current Values:**
  - Basic: 1.0
  - Fire: 2.0 (base) + 0.5 per additional fire in group
  - Lightning: 2.0
  - Earth: 3.0
  - Ice: 2.5
  - Rock: Variable (critical system)
  - Arcane: 3-4
  - Holy: 3.0
  - Poison: 1.0 (+ poison damage over time)
  - Wave: 3.0

- **Modifiers Applied:**
  ```javascript
  damage * slotBuff.damageMultiplier * tierDamageScale * kingMultiplier
  ```

#### Damage Multipliers
- **slotBuff.damageMultiplier** (game.js:7989)
  - Applied per spell slot
  - Can be increased by talent tree

- **tierDamageScale**
  - Scales with element tier level
  - Higher tiers = more damage

- **kingMultiplier**
  - Chess piece modifier (King piece in passive slot)

- **passiveBonuses.damageMultiplier** (game.js:17555, 17590, 17604)
  - Global damage multiplier from talent tree/passives
  - Various bonuses: 1.2x, 1.25x, 1.3x

#### Special Damage Properties
- `projectile.isCritical` - Rock spell critical hits (2x damage)
- `projectile.poisonDamage` - Poison damage over time (game.js:30857)
- `projectile.burnMagnitude` - Fire spell burn intensity (game.js:27032)
- `projectile.shatterMultiplier` - Earth damage vs frozen enemies (game.js:28245)

---

### 2. **Speed Properties**

#### Projectile Speed
- **Property:** Velocity (via `setVelocity()`)
- **Type:** Number (pixels/second)
- **Location:** Set in fire functions
- **Current Base Values:**
  - Basic: 350
  - Fire: 380
  - Lightning: 400
  - Earth: Based on direction
  - Ice: Direction-based
  - Rock: 300-400
  - Arcane: 300 (boomerang)
  - Water: Various
  - Poison: Based on spines
  - Holy: Direction-based

- **Modifiers Applied:**
  ```javascript
  speed * slotBuff.speedMultiplier * this.speedMultiplier
  ```

#### Speed Multipliers
- **slotBuff.speedMultiplier** (game.js:7990)
  - Per-slot speed modifier

- **this.speedMultiplier** (game.js:8282)
  - Global game speed mode (frolic: 1.0, vibe: 1.5, hyper: 2.0, warp: 3.0)

- **this.passiveBonuses.moveSpeedMultiplier** (game.js:7993)
  - Player movement speed (could apply to projectiles)

#### Homing Speed
- **Property:** `projectile.homingSpeed`
- **Values:**
  - Soul bullet: 150
  - Arcane: 350
  - Fire-Lightning fusion: varies
- **Location:** game.js:19866, 29523, 42424

---

### 3. **Cooldown/Fire Rate Properties**

#### Element Fire Rates
- **Property:** `elementConfig[element].fireRate`
- **Location:** game.js:8429-8479
- **Type:** Milliseconds between shots
- **Current Values:**

| Element | Fire Rate (ms) | Cooldown |
|---------|---------------|----------|
| Fire | 3150 | 3.15s |
| Water | 1800 | 1.8s |
| Earth | 3000 | 3.0s |
| Rock | 2250 | 2.25s |
| Air | 1200 | 1.2s |
| Lightning | 1500 | 1.5s |
| Arcane | 2400 | 2.4s |
| Ice | 2500 | 2.5s |
| Meteor | 1500 | 1.5s |
| Mud | 3000 | 3.0s |
| Thunder | 2000 | 2.0s |
| Crystal | 2000 | 2.0s |
| Death | 30000 | 30s |
| Gravity | 6000 | 6s |
| Sun | 999999 | Passive |
| Smoke | 10000 | 10s |
| Blast | 2000 | 2.0s |
| Vortex | 3000 | 3.0s |
| Tornado | 2500 | 2.5s |
| Metal | 10000 | 10s |
| Knight | 999999 | Passive (halves cooldown) |

#### Cooldown Modifiers
- **Talent Tree Cooldown Reduction** (game.js:7652)
  - "Arcane Shroud": -10% all cooldowns (0.9 multiplier)

- **fireRateMultiplier** (game.js:7991)
  - Per-buff fire rate modifier

- **Knight Chess Piece**
  - Passive element that halves cooldown (doubles fire rate)

#### Global Cooldowns
- **this.globalSpellCooldown** (game.js:8425)
  - Prevents spell spam

- **this.spellCooldowns** (game.js:8424)
  - Map tracking cooldowns by spell type

---

### 4. **Behavior Properties**

#### Piercing
- **Property:** `projectile.isPiercing`
- **Type:** Boolean
- **Effect:** Projectile passes through enemies
- **Examples:**
  - Wave spell: true (game.js:31220)
  - Venom spell: true (game.js:35021)
  - Crystal needles (implicit)

- **Hit Tracking:** `projectile.hitEnemies` (Set) - Tracks hit enemies for piercing projectiles

#### Pass-Through
- **Property:** `projectile.passThroughEnemies`
- **Type:** Boolean
- **Effect:** Similar to piercing, doesn't destroy on hit
- **Example:** Arcane boomerang (game.js:29678)

#### Homing
- **Property:** `projectile.isHoming`
- **Type:** Boolean
- **Associated Properties:**
  - `projectile.homingTarget` - Enemy to track
  - `projectile.homingSpeed` - Homing movement speed
- **Examples:**
  - Arcane (game.js:29521)
  - Boss projectiles (game.js:42423)

#### Bouncing/Chaining
- **Property:** `projectile.bounceCount` or `projectile.chainCount`
- **Type:** Number
- **Effect:** Projectile chains to additional enemies
- **Examples:**
  - Lightning: 2 bounces (game.js:27689)
  - Chain lightning: 3 chains (game.js:30155)
  - Arcane linking (game.js:25297)

- **Associated:** `projectile.currentTarget` - Next target to bounce to

#### Boomerang
- **Property:** `projectile.isBoomerang`
- **Type:** Boolean
- **Associated Properties:**
  - `projectile.returnTime` - Time before returning
  - `projectile.returnStarted` - Boolean flag
  - `projectile.startX`, `projectile.startY` - Return coordinates
  - `projectile.sourceWizard` - Wizard who fired it
- **Example:** Arcane spell (game.js:29677-29686)

---

### 5. **Area of Effect (AOE) Properties**

#### Direct AOE Size
- No direct property found - AOE appears to be implicit based on sprite/hitbox size and explosion effects

#### Explosion Properties
- **Property:** `projectile.isExplosive`
- **Type:** Boolean
- **Location:** game.js:25534
- **Effect:** Creates explosion on impact

#### Talent Tree AOE Modifiers
- **"Expanding Shadow I"** (game.js:7655)
  - Effect: `{ aoeSize: 1.1 }` (+10% AOE)
  - Tier 3, 2 ranks available

- **"Expanding Shadow II"** (game.js:7657)
  - Effect: `{ aoeSize: 1.2 }` (+20% AOE)
  - Tier 3

---

### 6. **Status Effect Properties**

#### Burn (Fire)
- **Property:** `projectile.burnMagnitude`
- **Type:** Number
- **Value:** 3 (game.js:27032)
- **Effect:** Applies burn damage over time

#### Freeze (Ice)
- **Property:** `projectile.freezeDuration`
- **Type:** Number (milliseconds)
- **Value:** 2000ms (game.js:28366)
- **Effect:** Freezes enemy in place

#### Slow (Ice, Water)
- **Property:** `projectile.slowDuration`
- **Type:** Number (milliseconds)
- **Effect:** Reduces enemy movement speed

#### Wet (Water)
- **Property:** `projectile.appliesWet`
- **Type:** Boolean
- **Associated:** `projectile.wetDuration` (3000ms)
- **Location:** game.js:31271-31272
- **Effect:** Makes enemies vulnerable to lightning (bonus damage)

#### Poison
- **Property:** `projectile.element === 'poison'` and `projectile.poisonDamage`
- **Type:** Number
- **Value:** 3 (game.js:30857)
- **Effect:** Deals damage over time

#### Stun (Rock)
- **Property:** `projectile.stunDuration`
- **Type:** Number (milliseconds)
- **Value:** 500ms (game.js:29355)
- **Associated:** `projectile.stuns` (boolean)
- **Effect:** Stuns enemy briefly

---

### 7. **Knockback Properties**

#### Knockback Force
- **Property:** `projectile.knockbackForce`
- **Type:** Number
- **Current Values:**
  - Earth: 1600 (game.js:28244)
  - Wave: 1200 (game.js:31219)
- **Effect:** Pushes enemies away on hit

---

### 8. **Targeting Properties**

#### Player Tracking
- **Property:** `projectile.firedByPlayer`
- **Type:** Number (1-4)
- **Location:** game.js:19605, 19692
- **Effect:** Tracks which player fired the projectile

#### Enemy Tracking
- **Property:** `projectile.isEnemyProjectile`
- **Type:** Boolean
- **Location:** game.js:19857, 42426
- **Effect:** Marks projectile as fired by enemy

#### Boss Tracking
- **Property:** `projectile.fromBoss`
- **Type:** Boolean
- **Location:** game.js:42434, 42580
- **Effect:** Marks projectile as fired by boss

---

### 9. **Lifecycle Properties**

#### Lifespan/Duration
- **Property:** `projectile.destroyTimer`
- **Type:** Phaser Timer
- **Typical Values:** 3000-5000ms
- **Location:** game.js:19878, 42437, 42583
- **Effect:** Auto-destroys projectile after duration

#### Creation Time
- **Property:** `projectile.creationTime`
- **Type:** Number (timestamp)
- **Location:** game.js:19856
- **Effect:** Tracks when projectile was created

#### Destruction Flag
- **Property:** `projectile.isDestroying`
- **Type:** Boolean
- **Location:** game.js:9174, 22521, 22710
- **Effect:** Prevents multiple destroy calls

---

### 10. **Visual Properties**

#### Scale
- Set via `projectile.setScale()`
- Varies by element and tier
- Example: Fire scales with count (game.js:27036)

#### Rotation
- **Property:** `projectile.rotationSpeed`
- **Type:** Number (radians per frame)
- **Location:** game.js:29374, 29695
- **Effect:** Visual spinning effect

#### Depth/Layer
- Set via `projectile.setDepth()`
- Typically: 5 for player projectiles
- Controls rendering order

#### Particles
- **Property:** `projectile.particles`
- **Type:** Phaser Particle Emitter
- **Location:** game.js:19574
- **Effect:** Visual trail effect

---

### 11. **Chess Modifier System**

Chess pieces in passive slots modify spell behavior:

#### Rook
- Fires projectiles in cardinal directions (N, S, E, W)
- 4 projectiles total

#### Bishop
- Fires projectiles diagonally (NE, SE, SW, NW)
- 4 projectiles total

#### Queen
- Combines Rook + Bishop
- 8 projectiles total

#### Knight
- Halves cooldown (doubles fire rate)
- fireRate reduction

#### Pawn
- Unknown modifier (not fully defined)

#### Joker
- **Special:** Applies ALL chess modifiers from passive slots
- Location: game.js:26805-26915

---

### 12. **Slot-Based Buffs**

Each charge slot can have individual buffs:

```javascript
{
    damageMultiplier: 1.0,
    speedMultiplier: 1.0,
    fireRateMultiplier: 1.0
}
```

These are applied when firing projectiles from that slot.

---

## Centralized Buff Application Points

### Where to Apply Talent Tree Buffs

#### 1. **Global Damage Buff**
- **Property:** `this.passiveBonuses.damageMultiplier`
- **Location:** game.js:7989, 17555, 17590, 17604
- **Applied:** Multiplied into final damage calculation

#### 2. **Cooldown Reduction**
- **Property:** Talent effect `{ cooldown: 0.9 }`
- **Application:** Multiply element fireRate by cooldown value
- **Location:** game.js:7652

#### 3. **AOE Size Increase**
- **Property:** Talent effect `{ aoeSize: 1.1 }`
- **Application:** Scale explosion radius, hitbox sizes
- **Location:** game.js:7655, 7657

#### 4. **Speed Buff**
- **Property:** `slotBuff.speedMultiplier`
- **Application:** Multiply projectile velocity
- **Already Applied:** game.js:27042

#### 5. **Fire Rate Buff**
- **Property:** `slotBuff.fireRateMultiplier`
- **Location:** game.js:7991
- **Application:** Divide element fireRate by multiplier (higher = faster)

---

## Recommendations for Centralization

### 1. **Create a Spell Configuration Object**

Instead of hardcoding values in fire functions, create a central configuration:

```javascript
this.spellConfig = {
    fire: {
        baseDamage: 2.0,
        baseSpeed: 380,
        cooldown: 3150,
        burnDuration: 3000,
        burnMagnitude: 3,
        piercing: false,
        aoeRadius: 0
    },
    lightning: {
        baseDamage: 2.0,
        baseSpeed: 400,
        cooldown: 1500,
        chainCount: 2,
        piercing: false,
        aoeRadius: 0
    },
    // ... etc for all elements
};
```

### 2. **Create a Spell Factory Function**

Centralize projectile creation:

```javascript
createSpellProjectile(element, wizard, direction, slotIndex) {
    const config = this.spellConfig[element];
    const projectile = this.physics.add.sprite(wizard.x, wizard.y, config.texture);

    // Apply base properties
    projectile.element = element;
    projectile.damage = this.calculateSpellDamage(config, slotIndex);
    projectile.speed = this.calculateSpellSpeed(config, slotIndex);

    // Apply status effects
    if (config.burnDuration) projectile.burnMagnitude = config.burnMagnitude;
    if (config.freezeDuration) projectile.freezeDuration = config.freezeDuration;

    // Apply talent tree bonuses
    this.applyTalentBonuses(projectile, element, slotIndex);

    return projectile;
}
```

### 3. **Centralized Buff Application**

```javascript
applyTalentBonuses(projectile, element, slotIndex) {
    const config = this.spellConfig[element];

    // Get slot buffs
    const slotBuff = this.getSlotBuff(slotIndex);

    // Get talent tree bonuses
    const talentBonuses = this.getTalentBonuses(element);

    // Apply damage bonuses
    projectile.damage *= slotBuff.damageMultiplier;
    projectile.damage *= this.passiveBonuses.damageMultiplier;
    projectile.damage *= (talentBonuses.damageBonus || 1.0);

    // Apply speed bonuses
    const finalSpeed = config.baseSpeed * slotBuff.speedMultiplier * this.speedMultiplier;

    // Apply AOE bonuses
    if (talentBonuses.aoeSize) {
        projectile.setScale(projectile.scale * talentBonuses.aoeSize);
    }

    // Apply cooldown reduction (handled elsewhere in fire timing)

    return projectile;
}
```

### 4. **Cooldown Manager**

```javascript
canCastSpell(element, slotIndex) {
    const config = this.spellConfig[element];
    const lastCast = this.lastCastTimes[slotIndex] || 0;
    const cooldown = this.calculateCooldown(config.cooldown, element, slotIndex);

    return (this.time.now - lastCast) >= cooldown;
}

calculateCooldown(baseCooldown, element, slotIndex) {
    // Apply talent tree cooldown reduction
    let cooldown = baseCooldown;

    // Arcane Shroud talent (-10% cooldown)
    if (this.hasTalent('arcane')) {
        cooldown *= 0.9;
    }

    // Knight chess piece (halves cooldown)
    if (this.hasKnightModifier(slotIndex)) {
        cooldown *= 0.5;
    }

    // Fire rate multiplier from buffs
    const slotBuff = this.getSlotBuff(slotIndex);
    cooldown /= slotBuff.fireRateMultiplier;

    return cooldown;
}
```

---

## Balance Adjustment Examples

With centralized configuration, you can make sweeping changes:

### Example 1: Increase All Spell Damage by 20%
```javascript
Object.keys(this.spellConfig).forEach(element => {
    this.spellConfig[element].baseDamage *= 1.2;
});
```

### Example 2: Reduce All Cooldowns by 15%
```javascript
Object.keys(this.spellConfig).forEach(element => {
    this.spellConfig[element].cooldown *= 0.85;
});
```

### Example 3: Apply Talent Tree Fire Damage Bonus
```javascript
if (this.hasTalent('fireMastery')) {
    this.spellConfig.fire.baseDamage *= 1.5;
    this.spellConfig.meteor.baseDamage *= 1.5;
    this.spellConfig.volcano.baseDamage *= 1.5;
}
```

---

## Summary: Properties to Centralize

| Property | Current Implementation | Recommended |
|----------|----------------------|-------------|
| **baseDamage** | Hardcoded in fire functions | Spell config object |
| **baseSpeed** | Hardcoded in fire functions | Spell config object |
| **cooldown/fireRate** | elementConfig | Keep but reference from spell config |
| **piercing** | Set per projectile | Spell config object |
| **aoeRadius** | Implicit | Spell config object (explicit) |
| **statusEffects** | Set per projectile | Spell config object |
| **chainCount/bounceCount** | Set per projectile | Spell config object |
| **damageMultipliers** | Multiple sources | Centralized calculation function |
| **speedMultipliers** | Multiple sources | Centralized calculation function |
| **cooldownMultipliers** | Multiple sources | Centralized calculation function |

---

## File Locations Reference

- **Main Game Logic:** `/c/Users/Alex/wizbiz/scripts/game.js`
- **Element Fire Functions:** Lines 19556-36690 (various fire functions)
- **Element Config:** Lines 8427-8479
- **Talent Tree:** Lines 7650-7657
- **Passive Bonuses:** Lines 7989-7993, 17555-17604
- **Cooldown System:** Lines 8423-8425
- **Chess Modifiers:** Lines 26805-26915

---

**Next Steps:**
1. Create centralized `SpellConfig` object
2. Create `SpellFactory` class/methods
3. Refactor fire functions to use SpellFactory
4. Implement talent tree buff application through centralized system
5. Add balance adjustment interface for easy tweaking

This centralization will make it much easier to apply talent tree bonuses and balance the game globally!
