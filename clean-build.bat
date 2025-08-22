@echo off
echo Cleaning electron-builder cache...
rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache" 2>nul
echo.
echo Starting fresh build...
npm run build-win
pause