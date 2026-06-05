# WizBiz Electron Desktop App

This guide covers the current Electron build and release workflow for Homunculi/WizBiz.

## Prerequisites

1. Install Node.js 20-25 from https://nodejs.org/. Node 26 is currently blocked because it can leave Electron's binary install incomplete.
2. Make sure npm is installed (comes with Node.js)

## Setup Instructions

1. Open a terminal/command prompt in the game directory.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Current icon state:
   - `icon.png` exists and is configured for Linux.
   - Windows and macOS release polish still need generated `icon.ico` and `icon.icns` files or explicit package config updates.

## Running the Game

To run the game in development mode:
```bash
npm start
```

## Building Executables

### Release Verification

Run the smoke gate before packaging:
```bash
npm run verify:smoke
```

Run the full release gate before a distribution build:
```bash
npm run verify:release
```

This runs TypeScript checks plus the production, feel, progression, promoted-world live, and promoted-world boss smoke checks.

### For Windows Portable:
```bash
npm run build-win-portable
```
This creates a Windows x64 portable `.exe` in the `dist` folder. `npm run build-portable` is an alias for this target.

### For Windows Configured Targets:
```bash
npm run build-win
```
The current package config only enables a portable Windows target, so this also builds the portable `.exe`.

### For macOS:
```bash
npm run build-mac
```
This creates a `.dmg` file in the `dist` folder. Treat this as secondary until the Windows portable loop is stable and macOS icon/signing needs are handled.

### For Linux:
```bash
npm run build-linux
npm run smoke:linux-package
```
This creates an `.AppImage` file in the `dist` folder and launches the latest AppImage with the packaged first-run smoke on Linux.

### Build for all platforms:
```bash
npm run dist
```

## Release Checklist

1. Confirm the active Node version is 20-25:
   ```bash
   node -v
   ```
2. Run:
   ```bash
   npm run verify:release
   ```
3. Build Windows portable first:
   ```bash
   npm run build-win-portable
   ```
4. Inspect `dist/` for total size, missing assets, source maps, docs/editor tools, backups, and other source noise.
5. Launch the packaged app offline and test a fresh save, first run, first victory, reload, options, and quit/relaunch.

On Ubuntu, validate the native packaged artifact with:
```bash
npm run build-linux
npm run smoke:linux-package
```

The Windows `.exe` can be built and inspected on Ubuntu, but its launch checklist still needs Windows or Wine.

## Features

- **F11**: Toggle fullscreen
- **Ctrl/Cmd + N**: Restart game
- **Ctrl/Cmd + Q**: Quit game
- **Developer Tools**: Ctrl/Cmd + Shift + I

## Customization

### Window Size
Edit `scripts/main.js` to change the default window size:
```javascript
width: 1200,  // Change these values
height: 800,
```

### App Name and ID
Edit `package.json` to change:
- `name`: Internal app name
- `build.appId`: Unique app identifier
- `build.productName`: Display name for the app

### Menu Items
Edit the `createMenu()` function in `scripts/main.js` to customize the menu bar.

## Distribution

The built executables in the `dist` folder can be distributed to users:
- Windows users can run the portable `.exe`
- macOS users can open the `.dmg` and drag the app to Applications
- Linux users can run the `.AppImage` file directly

## Troubleshooting

1. **White screen on startup**: Make sure all file paths in your game use relative paths, not absolute paths.

2. **Audio not playing**: Electron has stricter autoplay policies. Make sure audio is initiated after user interaction.

3. **Performance issues**: Enable hardware acceleration by adding to BrowserWindow options:
   ```javascript
   webPreferences: {
     // ... existing options
     enableWebGL: true,
     enableGPU: true
   }
   ```

4. **Build errors**: Clear the cache and reinstall:
   ```bash
   trash node_modules
   npm install
   ```
   If `trash` is unavailable, move `node_modules` aside or delete it deliberately.

## Next Steps

1. Create proper Windows/macOS app icons for a professional look
2. Consider code signing for distribution (especially on macOS)
3. Set up auto-updater for easy updates
4. Add crash reporting for better debugging
