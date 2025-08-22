# WizBiz Electron Desktop App

This guide will help you set up and build your game as a desktop application using Electron.

## Prerequisites

1. Install Node.js (version 14 or higher) from https://nodejs.org/
2. Make sure npm is installed (comes with Node.js)

## Setup Instructions

1. Open a terminal/command prompt in the game directory (`/c/Users/Alex/wizbiz`)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create app icons:
   - For Windows: Create `icon.ico` (256x256 pixels)
   - For macOS: Create `icon.icns` (512x512 pixels)
   - For Linux: Create `icon.png` (512x512 pixels)
   
   You can use online converters or tools like:
   - https://icoconvert.com/ for .ico files
   - https://cloudconvert.com/png-to-icns for .icns files

## Running the Game

To run the game in development mode:
```bash
npm start
```

## Building Executables

### For Windows:
```bash
npm run build-win
```
This creates a `.exe` installer in the `dist` folder.

### For macOS:
```bash
npm run build-mac
```
This creates a `.dmg` file in the `dist` folder.

### For Linux:
```bash
npm run build-linux
```
This creates an `.AppImage` file in the `dist` folder.

### Build for all platforms:
```bash
npm run dist
```

## Features

- **F11**: Toggle fullscreen
- **Ctrl/Cmd + N**: Restart game
- **Ctrl/Cmd + Q**: Quit game
- **Developer Tools**: Ctrl/Cmd + Shift + I

## Customization

### Window Size
Edit `main.js` to change the default window size:
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
Edit the `createMenu()` function in `main.js` to customize the menu bar.

## Distribution

The built executables in the `dist` folder can be distributed to users:
- Windows users can run the `.exe` installer
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
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

## Next Steps

1. Create proper app icons for a professional look
2. Consider code signing for distribution (especially on macOS)
3. Set up auto-updater for easy updates
4. Add crash reporting for better debugging