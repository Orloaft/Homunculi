# Missing Sprite Files

The following sprite files are referenced in the code but don't exist:

## Forest Enemies
- `forestlandfoes/redpandadeath4frames.png` - Red panda death animation (commented out in game.js)

## Notes
- The game.js file has been updated to comment out the missing redpanda death sprite to prevent loading errors
- The sprite editor has been updated to not include animations for missing files
- All other sprites have been verified to use the correct paths from game.js

## Sprite Path Corrections Made
1. **Tree**: Uses `tree/tronchungo3/walking-sheet.png` (not tree/walk.png)
2. **Kobold**: Uses `kobold/kobold8frames.png` (not cavekobold/walk.png)
3. **Bloboid/Slime**: Uses `newenemies/blob/blob minion walk.png` (not bloboid/move.png)
4. **Soul**: Uses nested path `newenemies/Soul/Soul/move/Soul_move.png`
5. **Summoner**: Uses `newenemies/summoner/The Summoner idle animation-export.png` (with spaces in filename)
6. **Golem**: Uses separate orange and blue variants in `Golem_1/` folders

## Frame Dimensions for Named Sprites
All sprites with "Xframes" in the filename use 32x32 frame dimensions:
- giantflywalk4frames.png - 32x32, 4 frames
- giantflydeath6frames.png - 32x32, 6 frames
- squirrelwalk8frames.png - 32x32, 8 frames
- squirreldeath4frames.png - 32x32, 4 frames
- redpandawalk8frames.png - 32x32, 8 frames
- brainmole4frames.png - 32x32, 4 frames
- brainmoledeath7frames.png - 32x32, 7 frames
- intellectdevourer8frames.png - 32x32, 8 frames
- intellectdevourerdeath4frames.png - 32x32, 4 frames