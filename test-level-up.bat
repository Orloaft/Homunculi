@echo off
cd /d "%~dp0"
echo.
echo === TESTING GAME IN BROWSER (to verify level up changes) ===
echo.
echo Starting local server on http://localhost:8080
echo.
echo Open your browser to: http://localhost:8080
echo Press CTRL+SHIFT+R in browser to do a hard refresh (clear cache)
echo.
echo Press CTRL+C to stop the server when done
echo.
python -m http.server 8080
