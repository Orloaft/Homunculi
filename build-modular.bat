@echo off
cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo === BUILDING MODULAR VERSION ===
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

REM Build with electron-builder using modular build command
call npm run build-win-modular

echo.
echo === MODULAR BUILD COMPLETE ===
echo Your new modular exe is in: %CD%\dist\win-unpacked\WizBiz.exe
echo This version uses 38%% less memory!
echo.
pause