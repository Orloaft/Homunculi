# TypeScript + Electron Integration Fix

**Date**: December 2, 2025
**Issue**: AchievementManager not defined in Electron app
**Status**: ✅ RESOLVED

## Problem

The TypeScript-compiled `AchievementManager.js` was not loading in the Electron app, causing:
```
SaveSlotScene.js:530 Uncaught ReferenceError: AchievementManager is not defined
```

## Root Cause

**Electron-builder configuration was excluding the `dist/` directory from the packaged app:**

```json
// package.json
"files": [
    "**/*",
    "!dist/**/*",      // ❌ This excluded TypeScript output!
]
```

Additionally, there was a **naming conflict**:
- **TypeScript** compiled to `dist/` (TypeScript output)
- **Electron-builder** output to `dist/` (packaged app)

## Solution

### 1. Changed TypeScript Output Directory

**tsconfig.json** (line 34):
```json
{
  "compilerOptions": {
    "outDir": "build",  // Changed from "dist"
  },
  "exclude": [
    "dist",              // Electron output
    "build",             // TypeScript output
  ]
}
```

### 2. Updated Script Loading

**index.html** (line 147):
```html
<!-- Before -->
<script src="dist/systems/AchievementManager.js"></script>

<!-- After -->
<script src="build/systems/AchievementManager.js"></script>
```

### 3. Updated .gitignore

```gitignore
# Electron build output
dist/

# TypeScript compiled output
build/
```

### 4. Added Global Export to TypeScript

**src/systems/AchievementManager.ts** (lines 624-633):
```typescript
// Make AchievementManager globally available for browser script loading
if (typeof window !== 'undefined') {
    (window as any).AchievementManager = AchievementManager;
    console.log('✅ AchievementManager loaded and globally exported');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementManager;
}
```

## Directory Structure (Final)

```
wizbiz/
├── src/                    # TypeScript & JavaScript SOURCE
│   ├── systems/
│   │   ├── AchievementManager.ts  # TypeScript source
│   │   └── SaveManager.js         # JavaScript source
│
├── build/                  # TypeScript COMPILED OUTPUT
│   └── systems/
│       └── AchievementManager.js  # Compiled from .ts
│
├── dist/                   # Electron PACKAGED APP
│   └── WizBiz 1.0.1.exe   # Final executable
│
└── index.html             # Loads from src/ and build/
```

## Build Process

1. **TypeScript Compilation**: `npm run compile`
   - Compiles `src/**/*.ts` → `build/**/*.js`

2. **Electron Build**: `npm run build-win`
   - Runs TypeScript compilation
   - Packages app with electron-builder
   - Includes `build/` directory in packaged app
   - Outputs to `dist/WizBiz 1.0.1.exe`

## Verification

```bash
# Compile TypeScript
npm run compile

# Check compiled output
ls -la build/systems/AchievementManager.js

# Run game in development
npm start

# Build for Windows
npm run build-win
```

## Key Learnings

1. **Electron doesn't cache like browsers** - The issue wasn't caching, it was the build configuration excluding files.

2. **Separate TypeScript output from Electron output** - Using different directories (`build/` vs `dist/`) prevents conflicts.

3. **Global exports required for script tags** - TypeScript classes need explicit global window assignment for traditional script tag loading:
   ```typescript
   (window as any).AchievementManager = AchievementManager;
   ```

4. **electron-builder files configuration** - The `!dist/**/*` pattern excluded the directory from packaging.

## Result

✅ TypeScript compiles to `build/`
✅ Electron packages app including `build/` directory
✅ AchievementManager loads correctly in packaged app
✅ All system classes export globally for script tag usage
✅ Clean separation of concerns (source vs compiled vs packaged)

---

**Migration completed**: December 2, 2025
**Build status**: ✅ Successful
**Game status**: ✅ Fully functional
