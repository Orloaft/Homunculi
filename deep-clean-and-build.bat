@echo off
cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo === DEEP CLEANING ===
echo.

echo Deleting dist folder...
rmdir /s /q dist 2>nul

echo Deleting node_modules...
rmdir /s /q node_modules 2>nul

echo Clearing electron-builder cache...
rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache" 2>nul

echo Clearing npm cache...
call npm cache clean --force

echo.
echo === REINSTALLING DEPENDENCIES ===
echo.
call npm install

echo.
echo === STARTING FRESH BUILD ===
echo.

call npm run build-win

echo.
echo === BUILD COMPLETE ===
echo Check above for any errors
echo Your new exe should be in: %CD%\dist\win-unpacked\WizBiz.exe
echo.
pause
