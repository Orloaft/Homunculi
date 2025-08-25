# Multiplayer Co-op Test Guide

## How to Enable Co-op
1. Start the game
2. Select a stage (Forest or Cave)
3. Click "Enable Co-op" button
4. Have players press any button on their gamepads to join
5. Start the game

## Debug Logging Added
The game will now log detailed information about:
- Player creation and setup
- Collision detection setup
- XP collection and shared leveling
- UI positioning
- Level up menu handling

## Test Scenarios

### 1. Player Joining (2-4 players)
- **Expected**: Each gamepad press adds a player slot
- **Check Console**: Look for "Creating X players" messages
- **Potential Issues**: 
  - Players not being detected
  - Wrong input assignments

### 2. Movement and Controls
- **Test**: Each player should move independently
- **Controls**:
  - Player 1: WASD or Arrow keys
  - Players 2-4: Gamepad left stick or D-pad
- **Potential Issues**:
  - Input lag
  - Wrong player responding to input

### 3. UI Layout
- **Expected**: Each player has their own charge slots and health bar
- **Layout**:
  - P1: Charge slots at x=20
  - P2: Charge slots at x=220
  - P3: Charge slots at x=420
  - P4: Charge slots at x=620
- **Console Warning**: Will warn if P4 UI might go off screen
- **Potential Issues**:
  - UI overlap
  - Health bars not following players

### 4. Combat and Damage
- **Test**: Each player takes damage independently
- **Expected**: Individual health bars update correctly
- **Potential Issues**:
  - Wrong player taking damage
  - Health bars not updating

### 5. Shared XP System
- **Test**: Any player collecting XP gems
- **Expected**: 
  - Console shows "Player X collected Y XP"
  - All players level up together
- **Potential Issues**:
  - XP not being shared
  - Multiple level up menus opening simultaneously

### 6. Level Up System
- **Expected**: One player at a time gets level up menu
- **Console**: Shows "Opening level up menu for player X"
- **Test**: 
  - Only controlling player can select rewards
  - Other players queued for their turn
- **Potential Issues**:
  - Menu control conflicts
  - Players stuck waiting

### 7. Item Collection
- **Test**: Multiple players collecting items simultaneously
- **Items to test**:
  - Muffins (health)
  - Element orbs
  - Butterfly jars
  - Charge expansions
- **Potential Issues**:
  - Items collected multiple times
  - Wrong player getting effects

### 8. Special Abilities
- **Test**: Butterfly protection on different players
- **Expected**: Each player has independent protection
- **Potential Issues**:
  - Protection not working
  - Effects applied to wrong player

### 9. Camera System
- **Test**: Camera follows average position of all players
- **Expected**: Smooth camera movement
- **Potential Issues**:
  - Players going off screen
  - Camera jerky movement

### 10. Performance
- **Monitor**: FPS with 4 players
- **Expected**: Stable 60 FPS
- **Potential Issues**:
  - Frame drops with many enemies
  - Slowdown with spell effects

## Console Commands to Monitor
```javascript
// Check player count
game.scene.scenes[1].players.length

// Check individual player health
game.scene.scenes[1].players[0].health
game.scene.scenes[1].players[1].health

// Check shared XP
game.scene.scenes[1].sharedXP
game.scene.scenes[1].sharedLevel

// Force level up (for testing)
game.scene.scenes[1].sharedXP = game.scene.scenes[1].sharedXPToNextLevel
```

## Known Limitations
1. Maximum 4 players supported
2. Player 1 always uses keyboard
3. Players 2-4 require gamepads
4. UI might overlap if screen is too small
5. No split-screen (shared camera)

## What to Report
If you find issues, note:
1. Number of players
2. What action caused the issue
3. Console error messages
4. Which player(s) affected
5. If it's reproducible