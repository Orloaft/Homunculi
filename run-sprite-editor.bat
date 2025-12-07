@echo off
echo Starting Sprite Editor Server...
echo.

REM Kill any existing Node process on port 8081
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do (
    echo Stopping existing server on port 8081...
    taskkill /F /PID %%a 2>nul
)

REM Get the directory where this batch file is located
set SCRIPT_DIR=%~dp0

REM Start the sprite editor server from the script directory
cd /d "%SCRIPT_DIR%sprite-editor"
node run-editor.js

REM If node fails, provide instructions
if errorlevel 1 (
    echo.
    echo Node.js server failed. Make sure Node.js is installed.
    echo You can also run: python -m http.server 8081
    echo from the sprite-editor directory as an alternative.
    pause
)