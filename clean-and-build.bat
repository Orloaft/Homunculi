@echo off
cd /d "%~dp0"
echo Current directory: %CD%
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
echo === STARTING FRESH BUILD ===
echo This will include all your latest code changes
echo.

call npm run build-win

echo.
echo === BUILD COMPLETE ===
echo Your new exe is in: %CD%\dist\win-unpacked\WizBiz.exe
echo.
pause