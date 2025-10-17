# HITBOX CONFIGURATION CHECKLIST

Generated: 2025-10-17

This checklist tracks all sprites that need proper hitbox configuration. After investigating the jellyfish hitbox issue, we discovered the correct way to configure hitboxes and found many sprites still need proper setup.

---

## SUMMARY

- Total sprites with scale: **43**
- Sprites with PROPER hitbox config: **6** ✓
- Sprites with PLACEHOLDER config: **25** ⚠️
- Sprites MISSING hitbox config: **24** ❌
- **Total needing attention: 49 sprites**

---

## BOSSES

### With Placeholder Values (needs proper width/height/offset)

These bosses have old-style placeholder configs that need to be converted to proper hitbox format:

- [ ] **obelisk-boss** (scale: 2, placeholder: 50)
- [ ] **archer-boss** (scale: 2.25, placeholder: 40)
- [ ] **demon-slime-boss** (scale: 1.75, placeholder: 40)
- [ ] **eyelor-boss** (scale: 2, placeholder: 50)
- [ ] **nekros-boss** (scale: 1.8, placeholder: 30)

### Already Configured Properly ✓

- [x] **frost-guardian-boss** (62x61, offset: 75,33, scale: 1)

---

## ENEMIES

### With Placeholder Values (needs proper width/height/offset)

- [ ] **golem-blue** (scale: 1.5, placeholder: 10)
- [ ] **golem-orange** (scale: 1.5, placeholder: 10)
- [ ] **castle-knight** (scale: 1.4, placeholder: 100)
- [ ] **castle-rogue** (scale: 1.8, placeholder: 4)
- [ ] **castle-soldier** (scale: 1.4, placeholder: 72)
- [ ] **castle-bladekeeper** (scale: 1.1, placeholder: 89)
- [ ] **castle-squire** (scale: 1.5, placeholder: 80)
- [ ] **eyelor** (scale: NO SCALE, placeholder: 50)
- [ ] **nekros** (scale: NO SCALE, placeholder: 30)
- [ ] **voidkin** (scale: NO SCALE, placeholder: 20)
- [ ] **kingNothing** (scale: NO SCALE, placeholder: 20)
- [ ] **blip** (scale: 2.7, placeholder: 1)
- [ ] **grim** (scale: 1.3, placeholder: 15)

### Missing Hitbox Config

These enemies have scale defined but no hitbox at all:

- [ ] **tree** (scale: 1.2)
- [ ] **bat** (scale: 0.8)
- [ ] **mushroom** (scale: 0.7)
- [ ] **giantfly** (scale: 2)
- [ ] **squirrel** (scale: 2)
- [ ] **redpanda** (scale: 2)
- [ ] **slime** (scale: 1)
- [ ] **golem** (scale: 1.5)
- [ ] **kobold** (scale: 0.6)
- [ ] **brainmole** (scale: 2)
- [ ] **intellectdevourer** (scale: 1.8)
- [ ] **bloboid** (scale: 1.5)
- [ ] **cobra** (scale: 2)
- [ ] **cactuse** (scale: 4.8)
- [ ] **fireworm** (scale: 1.2)
- [ ] **summoner** (scale: 0.8)
- [ ] **fireslime** (scale: 1)
- [ ] **orangegolem** (scale: 1.5)
- [ ] **yellowskeleton** (scale: 1)
- [ ] **clubimp** (scale: 3)
- [ ] **axeimp** (scale: 3)
- [ ] **wraith** (scale: 1.5)
- [ ] **flyingdemon** (scale: 0.91)
- [ ] **darkbat** (scale: 1.2)

### Already Configured Properly ✓

- [x] **wizard** (35x59, offset: 27,13, scale: 1)
- [x] **torchboy** (5x11, offset: -22,-8, scale: 3.1)
- [x] **jellyfish** (49x56, offset: 0,0, scale: 1.4) ← Just fixed!
- [x] **crabby** (56x33, offset: 6,16, scale: 1)

---

## PROJECTILES

### With Placeholder Values (needs proper width/height/offset)

- [ ] **orb** (scale: 1, placeholder: 17)
- [ ] **archer-projectile** (scale: NO SCALE, placeholder: 8)
- [ ] **waterball-projectile** (scale: NO SCALE, placeholder: 22)
- [ ] **fireball-projectile** (scale: NO SCALE, placeholder: 22)
- [ ] **void-ball** (scale: NO SCALE, placeholder: 17)
- [ ] **lightning-orb** (scale: NO SCALE, placeholder: 22)

### Already Configured Properly ✓

- [x] **test** (50x50, offset: 10,10, scale: 1)

---

## OTHER

### With Placeholder Values

- [ ] **(empty name)** (scale: NO SCALE, placeholder: 0) ← This is likely a bug/placeholder entry

---

## WORKFLOW

### To Configure a Sprite:

1. **Open the sprite editor**: `http://localhost:8081`
2. **Select the sprite** from the dropdown
3. **Visually adjust the hitbox** using the sliders (green box shows collision area)
4. **Verify** the hitbox covers the sprite's body appropriately
5. **Save to Game** - this updates both config files
6. **Test in game** - spawn the enemy and verify collision feels right
7. **Check off** the sprite in this checklist

### Important Notes:

- **Hitbox size**: Always stored in UNSCALED pixels (see HITBOX_SYSTEM_GUIDE.md)
- **Visual vs Actual**: The green box in the editor shows the actual collision area (unscaled size)
- **Placeholder format**: Old format `"": 15` needs to be converted to `{width: X, height: Y, offsetX: X, offsetY: Y}`
- **Priority**: Fix bosses first (they're most noticeable), then common enemies, then projectiles

### Batch Testing:

After configuring multiple enemies, test them in-game:
1. Enable physics debug (shows pink collision boxes)
2. Verify pink box matches what you set in editor
3. Test actual collision by attacking/being hit
4. Adjust if needed and re-save

---

## PROGRESS TRACKING

Update this section as you complete sprites:

- **Bosses**: 1/6 complete (17%)
- **Enemies**: 4/37 complete (11%)
- **Projectiles**: 1/7 complete (14%)
- **Overall**: 6/50 complete (12%)

---

## REFERENCE

See `HITBOX_SYSTEM_GUIDE.md` for detailed information about how the hitbox system works.
