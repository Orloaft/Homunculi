@echo off
echo.
echo ====================================
echo   Sprite Sheet Importer
echo ====================================
echo.

cd sprite-editor

echo Starting Sprite Importer...
echo.
echo The importer will open in your browser at:
echo http://localhost:8082/sprite-importer.html
echo.
echo Press Ctrl+C to stop the server
echo.

start http://localhost:8082/sprite-importer.html

python -m http.server 8082 2>nul || python3 -m http.server 8082 2>nul || npx http-server -p 8082

pause