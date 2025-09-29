@echo off
echo ========================================
echo WizBiz Automated Test Suite
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Install test dependencies if needed
npm list puppeteer >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing test dependencies...
    npm install --save-dev puppeteer serve-handler http-server
)

echo.
echo Select test mode:
echo 1. Quick test (30 seconds, headless)
echo 2. Full test (5 minutes, headless)
echo 3. Visual test (30 seconds, with browser)
echo 4. Stress test (10 minutes, headless)
echo 5. Open browser test interface
echo.

set /p choice=Enter your choice (1-5): 

if %choice%==1 (
    echo Running quick test...
    node test-headless.js
) else if %choice%==2 (
    echo Running full test suite...
    node test-headless.js --duration 300
) else if %choice%==3 (
    echo Running visual test...
    node test-headless.js --headed --verbose
) else if %choice%==4 (
    echo Running stress test...
    node test-headless.js --duration 600 --verbose
) else if %choice%==5 (
    echo Opening browser test interface...
    start test-automation.html
) else (
    echo Invalid choice
    pause
    exit /b 1
)

echo.
echo Test complete! Check test-report-*.json for details
pause