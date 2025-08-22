@echo off
echo Backing up current build...
if exist dist\win-unpacked\WizBiz.exe (
    echo Creating backup with timestamp...
    set datetime=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%
    set datetime=%datetime: =0%
    mkdir "dist-backup-%datetime%" 2>nul
    xcopy /E /I /Q dist "dist-backup-%datetime%"
    echo Backup created in dist-backup-%datetime%
) else (
    echo No existing build found to backup
)
echo.
echo Starting new build...
npm run build-win
pause