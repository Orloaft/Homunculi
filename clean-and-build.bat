@echo off
cd /d "%~dp0"
echo ========================================
echo WizBiz Clean and Build
echo ========================================
echo Current directory: %CD%
echo.

echo === STEP 1: KILL RUNNING PROCESSES ===
echo Checking for running WizBiz.exe...
tasklist /FI "IMAGENAME eq WizBiz.exe" 2>NUL | find /I /N "WizBiz.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found running WizBiz.exe - terminating...
    taskkill /F /IM WizBiz.exe 2>nul
    timeout /t 2 /nobreak >nul
    echo Process terminated
) else (
    echo No running WizBiz.exe found
)

echo Checking for running electron.exe...
tasklist /FI "IMAGENAME eq electron.exe" 2>NUL | find /I /N "electron.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found running electron.exe - terminating...
    taskkill /F /IM electron.exe 2>nul
    timeout /t 2 /nobreak >nul
    echo Process terminated
) else (
    echo No running electron.exe found
)
echo.

echo === STEP 2: CLEANING OLD BUILD ===
echo.

echo Deleting build folder (TypeScript output)...
if exist build (
    rmdir /s /q build 2>nul
    if exist build (
        echo Failed to delete build folder, retrying...
        rd /s /q build 2>nul
    )
    if exist build (
        echo Warning: Could not delete build folder completely
    ) else (
        echo Successfully deleted build folder
    )
) else (
    echo Build folder does not exist (clean state)
)
echo.

echo Deleting dist folder (Electron output)...
if exist dist (
    echo Attempting to delete dist folder...
    rmdir /s /q dist 2>nul
    timeout /t 1 /nobreak >nul

    REM Try again if it still exists
    if exist dist (
        echo First attempt failed, trying again...
        rd /s /q dist 2>nul
        timeout /t 1 /nobreak >nul
    )

    REM Try with attributes reset
    if exist dist (
        echo Resetting file attributes and retrying...
        attrib -r -s -h dist\*.* /s /d 2>nul
        rmdir /s /q dist 2>nul
        timeout /t 1 /nobreak >nul
    )

    REM Try renaming and moving outside project (works when deletion doesn't)
    if exist dist (
        echo Trying to rename and move outside project...
        move dist ..\wizbiz-dist-old-%RANDOM% >nul 2>&1
        timeout /t 1 /nobreak >nul
    )

    REM If STILL exists, we must stop - the build WILL fail
    if exist dist (
        echo.
        echo ========================================
        echo ERROR: CANNOT DELETE DIST FOLDER
        echo ========================================
        echo.
        echo Files are LOCKED! The build will fail if we continue.
        echo.
        echo Please do ONE of these:
        echo.
        echo   Option 1: Run diagnose-locks.bat to find what's locking files
        echo   Option 2: Run force-clean.bat for aggressive cleanup
        echo   Option 3: Restart your computer (easiest fix)
        echo.
        echo Then run this script again.
        echo.
        echo ========================================
        pause
        exit /b 1
    ) else (
        echo Successfully deleted dist folder
    )
) else (
    echo Dist folder does not exist (clean state)
)

echo Deleting node_modules electron cache...
rmdir /s /q node_modules\.cache 2>nul

echo.
echo === STEP 3: CLEARING ELECTRON BUILDER CACHE ===
if exist "%LOCALAPPDATA%\electron-builder\Cache" (
    echo Clearing electron-builder cache...
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache" 2>nul
    echo Cache cleared
) else (
    echo Cache already clear
)

echo.
echo === STEP 4: BUILDING APPLICATION ===
echo This will:
echo   1. Compile TypeScript (.ts) to build/ directory
echo   2. Package Electron app to dist/ directory
echo.
echo (TypeScript warnings are normal and won't stop the build)
echo.

call npm run build-win

if errorlevel 1 (
    echo.
    echo ========================================
    echo BUILD FAILED
    echo ========================================
    echo.
    echo Check the errors above for details.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Your executable is ready:
echo %CD%\dist\win-unpacked\WizBiz.exe
echo.
echo Press any key to exit...
pause >nul