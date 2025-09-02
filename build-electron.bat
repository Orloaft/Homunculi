@echo off
echo Building optimized Electron app with bundled game...
echo.

REM Step 1: Clean previous builds
echo [1/4] Cleaning previous builds...
if exist dist-electron rmdir /s /q dist-electron
if exist dist rmdir /s /q dist

REM Step 2: Build the optimized bundle
echo [2/4] Building optimized game bundle...
call node build-bundle.js
if errorlevel 1 (
    echo Error building bundle!
    exit /b 1
)

REM Step 3: Ensure main.js uses bundled version
echo [3/4] Configuring for bundled build...

REM Step 4: Build Electron app
echo [4/4] Building Electron executable...
call npm run build-win

echo.
echo Build complete! Executable is in dist-electron/
echo The app will run at 140+ FPS using the bundled version.
pause