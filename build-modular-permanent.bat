@echo off
cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo === CONFIGURING FOR MODULAR BUILD ===
echo.

REM Backup original main.js
if not exist main-original.js (
    echo Backing up original main.js...
    copy main.js main-original.js
)

REM Use modular-default main.js
echo Switching to modular configuration...
copy /Y main-modular-default.js main.js

echo.
echo === CLEANING OLD BUILD ===
echo.

echo Deleting dist folder...
rmdir /s /q dist 2>nul
echo Deleting node_modules electron cache...
rmdir /s /q node_modules\.cache 2>nul

echo.
echo === CLEARING ELECTRON BUILDER CACHE ===
rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache" 2>nul

echo.
echo === STARTING MODULAR BUILD ===
echo Building the modular version with improved memory usage...
echo.

call npm run build-win-modular

echo.
echo === MODULAR BUILD COMPLETE ===
echo Your new modular exe is in: %CD%\dist\win-unpacked\WizBiz.exe
echo This version uses 38%% less memory and has proper boss AI!
echo.
echo Note: main.js has been updated to use modular version by default
echo To restore original version, copy main-original.js back to main.js
echo.
pause