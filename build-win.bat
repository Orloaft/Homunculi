@echo off
cd /d "%~dp0"
echo Building Windows executable...
echo NOTE: This requires administrator privileges
echo Current directory: %CD%
echo.
pause
npm run build-win
pause