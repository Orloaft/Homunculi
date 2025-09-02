@echo off
echo === WIZBIZ MODULAR BUILD SCRIPT ===
echo.
echo This script builds the refactored modular version of WizBiz
echo.

cd /d "%~dp0"
echo Working directory: %CD%
echo.

echo Step 1: Cleaning old build files...
rmdir /s /q dist 2>nul
rmdir /s /q node_modules\.cache 2>nul
del /q *.log 2>nul
echo.

echo Step 2: Verifying modular architecture files...
if not exist "index-modular.html" (
    echo ERROR: index-modular.html not found!
    pause
    exit /b 1
)
if not exist "src\main-modular.js" (
    echo ERROR: src\main-modular.js not found!
    pause
    exit /b 1
)
if not exist "src\scenes\GameSceneModular.js" (
    echo ERROR: src\scenes\GameSceneModular.js not found!
    pause
    exit /b 1
)
echo All modular files found!
echo.

echo Step 3: Building Windows executable...
echo Using modular architecture (index-modular.html)
echo.

:: Build without the USE_MODULAR flag since main.js defaults to modular now
call npm run build-win

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo === BUILD COMPLETE ===
echo.
echo Your modular WizBiz executable is ready at:
echo   %CD%\dist\win-unpacked\WizBiz.exe
echo.
echo The build uses:
echo   - index-modular.html (entry point)
echo   - src/main-modular.js (game initialization)
echo   - src/scenes/GameSceneModular.js (refactored game scene)
echo.
echo You can now run the game to test all the implemented features!
echo.
pause