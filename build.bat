@echo off
REM Change to the directory where this script is located
cd /d "%~dp0"

echo ========================================
echo Building WizBiz - Electron App
echo ========================================
echo.
echo Working directory: %CD%
echo.

REM Clean previous builds
echo Cleaning previous builds...
if exist dist-electron rmdir /s /q dist-electron
if exist dist rmdir /s /q dist
echo.

REM Check required files
echo Checking required files...
if not exist game.js (
    echo ERROR: game.js not found!
    exit /b 1
)
echo Found game.js (complete version with bosses and all features)
if not exist index.html (
    echo ERROR: index.html not found!
    exit /b 1
)
if not exist main.js (
    echo ERROR: main.js not found!
    exit /b 1
)
if not exist package.json (
    echo ERROR: package.json not found!
    exit /b 1
)
echo All required files found.
echo.

REM Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error installing dependencies!
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)
echo.

REM Build Electron app
echo Building Electron executable...
call npm run build-win
if errorlevel 1 (
    echo.
    echo Build failed! Trying alternative method...
    call npx electron-builder --win
    if errorlevel 1 (
        echo.
        echo ERROR: Build failed!
        echo Please ensure you have Node.js and npm installed.
        echo Try running: npm install -g electron-builder
        exit /b 1
    )
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo Executable location: dist-electron\
echo.
echo To run the app directly without building:
echo   npm run electron
echo.
pause