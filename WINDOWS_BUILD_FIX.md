# Windows Build Error Fix

You're encountering a symbolic link error because Windows requires special privileges to create symlinks.

## Quick Solutions:

### Option 1: Run as Administrator
1. Run `build-win.bat` as Administrator (right-click → Run as administrator)
2. Or open Command Prompt as Administrator and run `npm run build-win`

### Option 2: Clean Cache and Build
Run `clean-build.bat` to clear the cache and try again

### Option 3: Build Portable Version (No install required)
```bash
npm run build-win-portable
```
This creates a portable .exe that doesn't need installation

### Option 4: Enable Developer Mode (Permanent fix)
1. Open Windows Settings (Win + I)
2. Go to "Update & Security" → "For developers"
3. Enable "Developer mode"
4. Restart your computer
5. Try building again with `npm run build-win`

## If Still Having Issues:

1. **Manually clear the cache:**
   ```bash
   rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache"
   ```

2. **Try building without code signing:**
   The package.json has been updated to disable code signing

3. **Use WSL (Windows Subsystem for Linux):**
   If you have WSL installed, you can build from there

## What the Build Creates:

- **NSIS Installer**: `dist\WizBiz Setup 1.0.0.exe` - Standard Windows installer
- **Portable EXE**: `dist\WizBiz 1.0.0.exe` - Standalone executable, no install needed

Both versions will use the zodiac.png icon and include all your game files.