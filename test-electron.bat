@echo off
cd /d "%~dp0"
echo === TESTING GAME WITH LATEST CODE ===
echo This runs the game directly without building an exe
echo Current directory: %CD%
echo.
npm start
pause