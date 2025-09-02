@echo off
cd /d "%~dp0"
echo.
echo === VERIFYING BUILD CONFIGURATION ===
echo.
echo Working directory: %CD%
echo.

echo Checking which version will be built...
echo.

REM Check main.js default
echo Main.js configuration:
findstr /C:"index-modular.html" main.js >nul
if %errorlevel%==0 (
    echo [OK] main.js defaults to modular version - index-modular.html
) else (
    findstr /C:"index.html" main.js >nul
    if %errorlevel%==0 (
        echo [WARNING] main.js is using original version - index.html
    ) else (
        echo [ERROR] Cannot determine which version main.js uses
    )
)

echo.
echo Checking modular files exist:

REM Check critical modular files
if exist "index-modular.html" (
    echo [OK] index-modular.html exists
) else (
    echo [ERROR] index-modular.html is missing!
)

if exist "src\main-modular.js" (
    echo [OK] src\main-modular.js exists
) else (
    echo [ERROR] src\main-modular.js is missing!
)

if exist "src\scenes\GameSceneModular.js" (
    echo [OK] src\scenes\GameSceneModular.js exists
) else (
    echo [ERROR] src\scenes\GameSceneModular.js is missing!
)

echo.
echo Checking GameSceneModular uses correct scene key:
findstr /C:"key: 'GameScene'" "src\scenes\GameSceneModular.js" >nul
if %errorlevel%==0 (
    echo [OK] GameSceneModular uses 'GameScene' key
) else (
    echo [WARNING] GameSceneModular may not be using correct key
)

echo.
echo === VERIFICATION COMPLETE ===
echo.

REM Final summary
set BUILD_READY=true
if not exist "index-modular.html" set BUILD_READY=false
if not exist "src\main-modular.js" set BUILD_READY=false
if not exist "src\scenes\GameSceneModular.js" set BUILD_READY=false

if "%BUILD_READY%"=="true" (
    echo [READY] All modular files found - Build will use the REFACTORED version
    echo.
    echo Next step: Run clean-and-build.bat to build the application
) else (
    echo [ERROR] Some modular files are missing - Cannot build
    echo Please ensure all required files are present
)

echo.
pause