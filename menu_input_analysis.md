# Menu Systems Input Handling Analysis

## 1. Chest Reward Selection Menu
**Location:** Lines ~6535-7550
**Input Methods:**
- **Mouse:** ✅ Full support
  - `pointerdown` events on reward buttons (line 6635)
  - `pointerover` for hover effects (line 6639)
  - Visual feedback with color changes
- **Keyboard:** ✅ Full support via `handleChestSelectionController()`
  - Arrow keys for navigation (left/right/up/down)
  - Space key for confirmation
- **Controller:** ✅ Full support
  - D-pad and left stick for navigation
  - A button (button 0) for confirmation
  - Y button (button 2) for switching to charge selection mode
  - Special handling for element rewards with charge slot selection

## 2. Fusion Selection Menu
**Location:** Lines ~6786-7650
**Input Methods:**
- **Mouse:** ✅ Full support
  - `pointerdown` events on element buttons (line 6868)
  - `pointerover` for hover effects (line 6876)
  - Click on fusion button to confirm (line 6934)
- **Keyboard:** ✅ Full support via `handleFusionController()`
  - Arrow keys for navigation
  - Space key for selection/confirmation
- **Controller:** ✅ Full support
  - D-pad and left stick for navigation
  - A button (button 0) for selection/confirmation
  - Grid-based navigation with wrap-around

## 3. Element Selection Menu (from chest rewards)
**Location:** Integrated within chest reward system
**Input Methods:**
- **Mouse:** ✅ Same as chest rewards
- **Keyboard:** ✅ Same as chest rewards
- **Controller:** ✅ Enhanced support
  - Y button switches to charge slot selection mode
  - Up/Down to select which charge to replace
  - A button to confirm replacement

## 4. Pause Menu
**Location:** Lines ~2099-3100
**Input Methods:**
- **Mouse:** ✅ Full support
  - Interactive buttons for all options
  - Hover effects on buttons
  - Click handlers for actions
- **Keyboard:** ✅ Full support via `handlePauseMenuController()`
  - Up/Down arrows for navigation
  - Space/Enter for selection
  - ESC to toggle pause
- **Controller:** ✅ Full support
  - D-pad up/down for navigation
  - A button for selection
  - Start button to toggle pause
  - Special handling for discard confirmation dialogs

## 5. Spellbook Menu
**Location:** Lines ~1350-1400
**Input Methods:**
- **Mouse:** ❌ No direct mouse support for scrolling
- **Keyboard:** ✅ Partial support
  - ESC key to toggle open/close
  - Up/Down arrows for scrolling (lines 1388-1393)
- **Controller:** ❌ No controller support for scrolling
  - Only ESC equivalent to close

## 6. Elements Menu (TAB menu)
**Location:** Lines ~1130-3120
**Input Methods:**
- **Mouse:** ❌ No mouse interaction
  - Display only, no clickable elements
- **Keyboard:** ✅ Basic support
  - TAB key to toggle open/close (line 1364)
- **Controller:** ✅ Basic support
  - Select button (button 8) to toggle (line 1359)

## Summary of Input Support

| Menu | Mouse | Keyboard | Controller |
|------|-------|----------|------------|
| Chest Rewards | ✅ Full | ✅ Full | ✅ Full |
| Fusion Selection | ✅ Full | ✅ Full | ✅ Full |
| Element Selection | ✅ Full | ✅ Full | ✅ Full |
| Pause Menu | ✅ Full | ✅ Full | ✅ Full |
| Spellbook | ❌ No scroll | ✅ Partial | ❌ No scroll |
| Elements (TAB) | ❌ Display only | ✅ Toggle only | ✅ Toggle only |

## Key Patterns Used

1. **Interactive Elements:**
   - `setInteractive({ useHandCursor: true })` for mouse support
   - `on('pointerdown')` for click handling
   - `on('pointerover')` for hover effects

2. **Controller Handling:**
   - Dedicated controller handler functions
   - State tracking to prevent input repeat
   - Support for both analog stick and D-pad
   - Button mapping consistent across menus

3. **Navigation:**
   - Grid-based cursor systems for controller/keyboard
   - Visual cursor indicators
   - Wrap-around navigation in grids
   - Modal input handling (blocks other inputs when active)

## Recommendations

1. **Spellbook Menu:** Add mouse wheel scrolling and controller support
2. **Elements Menu:** Consider adding interactive elements for mouse users
3. **All Menus:** Add consistent ESC/B button behavior for closing