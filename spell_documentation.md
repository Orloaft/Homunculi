# Wizbiz Spell Documentation

## Overview
This document details all spell implementations in the Wizbiz game, including primary elements, fusion elements, damage values, cooldowns, and special effects.

## Primary Elements

### Fire
- **Active Damage**: 0.5 damage/tick (continuous)
- **Cooldown**: 3150ms (reduced by 30% from base)
- **Projectile Count**: 1 flame that follows wizard
- **Additional Effects**: 
  - Creates burning flame in front of wizard
  - Scales 2x per additional fire element
  - Leaves burning pools on ground
- **Passive Effects**: +20% damage to all spells, burning aura damages nearby enemies

### Water
- **Active Damage**: 3 damage
- **Cooldown**: 1800ms
- **Projectile Count**: 1 expanding wave
- **Additional Effects**: 
  - Slows enemies by 50% for 6 seconds
  - Applies "wet" status effect
  - Scales 2x per additional water element
- **Passive Effects**: +2 HP/sec regeneration, +10% lifesteal on all damage

### Earth  
- **Active Damage**: 3 damage
- **Cooldown**: 3000ms
- **Projectile Count**: 1 earthquake line
- **Additional Effects**:
  - Piercing projectile travels in straight line
  - Knockback force of 1600
  - Directional based on wizard facing
- **Passive Effects**: +30% max health, reflects 25% of melee damage back to attackers

### Air
- **Active Damage**: 1 damage
- **Cooldown**: 1200ms
- **Projectile Count**: Wind gust area
- **Additional Effects**:
  - Pushes enemies away
  - Creates wind blast area effect
- **Passive Effects**: +20% movement speed, 15% chance to dodge attacks

### Lightning
- **Active Damage**: 1.5 damage
- **Cooldown**: 1500ms
- **Projectile Count**: 1 homing orb
- **Additional Effects**:
  - Auto-targets nearest enemy
  - Bounces to 3 additional enemies after hit
  - Cannot hit same enemy twice
- **Passive Effects**: +30% faster spell casting, kills chain lightning to 2 nearby enemies

### Ice
- **Active Damage**: 2 damage
- **Cooldown**: 2500ms
- **Projectile Count**: 5 ice crystals
- **Additional Effects**:
  - Freezes enemies for 2 seconds
  - Crystals spawn randomly around wizard
  - Crystals last for 3 seconds
- **Passive Effects**: Slowing aura reduces enemy speed, +20% resistance to all elements

### Arcane
- **Active Damage**: 2 damage
- **Cooldown**: 2400ms
- **Projectile Count**: 1 homing projectile
- **Additional Effects**:
  - Pure magical energy
  - Seeks out targets
- **Passive Effects**: +25% spell damage, 30% magic damage resistance

### Poison
- **Active Damage**: 1 damage/second (DoT)
- **Cooldown**: Not specified
- **Projectile Count**: 3 poison mines
- **Additional Effects**:
  - Drops mines that trigger on contact
  - Poison lasts 5 seconds
  - Mines have 50-pixel trigger radius
- **Passive Effects**: Poison aura constantly damages nearby enemies

## Fusion Elements

### Lava (Fire + Earth)
- **Active Damage**: 2 damage + burning DoT
- **Additional Effects**: Creates lava pools on impact that burn enemies
- **Passive Effects**: Leave burning pools on enemy kills, +15% fire damage

### Steam (Water + Fire)  
- **Active Damage**: 2 damage
- **Additional Effects**: Explosive burst with knockback
- **Passive Effects**: Obscuring mist gives 20% dodge, wet enemies take +50% lightning damage

### Mud (Water + Earth)
- **Active Damage**: 0.5 damage/second in pools
- **Additional Effects**: 
  - Shoots 3-5 mud globs in arc
  - Creates slowing mud pools on impact
  - Pools slow by 70% for 2 seconds
- **Passive Effects**: Enemies near you move 30% slower, +20% earth spell damage

### Storm (Lightning + Air)
- **Active Damage**: 8 damage per strike
- **Additional Effects**: Instant lightning strikes on random enemies
- **Passive Effects**: Storm aura randomly strikes enemies, +35% lightning damage

### Crystal (Earth + Ice)
- **Active Damage**: 4 damage per needle
- **Projectile Count**: 8 piercing needles
- **Additional Effects**:
  - Fires in all 8 directions
  - Needles pierce through 2 enemies
- **Passive Effects**: Projectiles pierce +1 enemy, +10% critical hit chance

### Volcano (Lava + Fire)
- **Active Damage**: 3 damage per projectile
- **Projectile Count**: 8 lava balls
- **Additional Effects**: Erupts projectiles in all directions
- **Passive Effects**: Eruptions on spell cast, +25% fire damage, +10% area damage

### Meteor (Rock + Fire)
- **Active Damage**: 5 damage + area damage
- **Cooldown**: 1500ms
- **Additional Effects**: Calls down meteors from sky with explosion on impact
- **Passive Effects**: Meteors randomly fall near enemies, +20% fire and earth damage

### Wave (Water + Water)
- **Active Damage**: 5 damage
- **Additional Effects**: Massive tidal wave with knockback
- **Passive Effects**: Knockback immunity, water spells heal 5% of damage dealt

### Sand (Earth + Dust)
- **Active Damage**: 0.5 damage/tick
- **Additional Effects**: Creates multiple sandstorms that move and damage
- **Passive Effects**: Sandstorm aura damages and blinds, +15% earth damage

### Gravity (Earth + Arcane)
- **Active Damage**: 30% of enemy max HP
- **Additional Effects**:
  - Creates singularity that pulls enemies
  - 200-pixel pull radius
  - Lasts 1.8 seconds
- **Passive Effects**: Pull enemies slowly toward you, +30% damage to slowed enemies

## Ultimate Fusions

### Death (Dark + Dark)
- **Active Damage**: Instant kill on enemies below 25% HP
- **Cooldown**: 6000ms
- **Additional Effects**: Death mark spreads to nearby enemies
- **Passive Effects**: Execute enemies below 30% health, killed enemies explode

### Time (Arcane + Arcane)
- **Active Damage**: None (utility spell)
- **Additional Effects**:
  - Slows enemies by 70% in area
  - Grants wizard 40% movement speed boost
  - Lasts 8 seconds
- **Passive Effects**: Enemies move 20% slower, cooldowns reduced by 25%

### Sun (Star + Fire)
- **Active Damage**: 1 damage/tick in aura
- **Cooldown**: 999999ms (essentially once per game)
- **Additional Effects**: Radiating damage aura around wizard
- **Passive Effects**: Solar flare damages all enemies every 30s, +40% damage during day

### Moon (Star + Water)
- **Active Damage**: 5 healing to wizard
- **Cooldown**: 12000ms
- **Additional Effects**: Heals wizard and curses nearby enemies
- **Passive Effects**: Night aura weakens enemies, +20% damage at night

### Star (Fire + Holy)
- **Active Damage**: 3 damage per star
- **Additional Effects**: Bouncing projectiles between enemies
- **Passive Effects**: Starfall randomly damages enemies, +15% to all elemental damage

### Zodiac (Moon + Star)
- **Active Damage**: 3 damage + trail damage
- **Additional Effects**: Star projectiles bounce leaving light trails
- **Passive Effects**: Same as Star element

### Life (Holy + Nature)
- **Active Damage**: None (healing spell)
- **Additional Effects**: Heals wizard over time
- **Passive Effects**: +5 HP/sec regeneration, resurrect with 50% HP once per minute

### Philosopher Stone (Life + Death)
- **Active Effects**: Grants automatic level up every 45 seconds
- **Cooldown**: 999999ms (passive effect)
- **Passive Effects**: Ultimate alchemical achievement

### Halo (Holy + Water)
- **Active Damage**: 0.5 damage/tick to nearby enemies
- **Cooldown**: 999999ms
- **Additional Effects**: Continuous damage aura
- **Passive Effects**: Divine protection aura

### Metal (Rock + Lightning)
- **Active Effects**: Creates reflective shield
- **Cooldown**: 999999ms
- **Passive Effects**: Reflects 50% of damage back to attackers

## Additional Fusion Elements

### Venom (Crystal + Poison)
- **Active Damage**: 2 damage + poison
- **Cooldown**: 2000ms
- **Projectile Count**: 3 piercing spines
- **Additional Effects**: Piercing projectiles apply poison

### Hex (Arcane + Poison)
- **Active Effects**: Curses enemies to deal no damage for 8 seconds
- **Additional Effects**: Area curse effect

### Nature (Earth + Life)
- **Active Damage**: 4 damage per vine
- **Projectile Count**: 8 whipping vines
- **Additional Effects**: Vines originate from wizard and strike outward

### Smoke (Fire + Air)
- **Active Effects**: Creates obscuring smoke clouds
- **Cooldown**: 999999ms
- **Additional Effects**: Reduces enemy visibility and accuracy

### Dust (Earth + Air)
- **Active Effects**: Blinds and slows enemies in large area
- **Additional Effects**: Area debuff effect

## Spell Mechanics

### Tier System
- Elements can have tiers 1-5
- Damage multipliers per tier: [1.0, 1.5, 2.0, 2.5, 3.0]
- Area multipliers per tier: [1.0, 1.2, 1.4, 1.6, 1.8]
- Fire rate multipliers per tier: [1.0, 0.85, 0.7, 0.6, 0.5]
- Projectile count per tier: [1, 1, 2, 2, 3]
- Duration multipliers per tier: [1.0, 1.2, 1.4, 1.6, 1.8]

### Slot System
- 8 total spell slots (4 active, 4 passive)
- Slots can be linked for combo spells
- Each slot can have buffs that affect damage and speed
- Elements in passive slots (5-8) provide passive bonuses

### Element Discovery
- Primary elements drop from enemies
- Fusion elements discovered by combining specific elements
- Some fusions require discovering intermediate elements first