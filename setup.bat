@echo off
REM Change to the directory where this script is located
cd /d "%~dp0"

echo ========================================
echo WizBiz Setup Script
echo ========================================
echo.
echo Working directory: %CD%
echo.

echo Checking for required files...

REM Download Phaser if not present
if not exist phaser.min.js (
    echo Downloading Phaser 3.80.1...
    curl -o phaser.min.js https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js
    if errorlevel 1 (
        echo.
        echo Failed to download with curl, trying PowerShell...
        powershell -Command "Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js' -OutFile 'phaser.min.js'"
    )
    if exist phaser.min.js (
        echo Phaser downloaded successfully!
    ) else (
        echo ERROR: Could not download Phaser!
        echo Please download manually from:
        echo https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js
        exit /b 1
    )
) else (
    echo Phaser.min.js already exists.
)

echo.
echo Checking npm dependencies...
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo Warning: npm install had issues
    )
) else (
    echo Dependencies already installed.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now run:
echo   build.bat        - Build the Electron app
echo   npm run electron - Run in Electron (dev mode)
echo   npm start        - Run in browser (http://localhost:8080)
echo.
pause