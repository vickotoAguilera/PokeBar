@echo off
cd /d "%~dp0"

echo Cerrando solo la instancia propia de PokeTokenBar...
set "PID_FILE=%APPDATA%\poketokenbar-windows\poketokenbar.pid"
set "APP_PID="
if exist "%PID_FILE%" set /p APP_PID=<"%PID_FILE%"
if defined APP_PID (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$targetPid = [int]$env:APP_PID; $process = Get-CimInstance Win32_Process -Filter ('ProcessId = ' + $targetPid) -ErrorAction SilentlyContinue; if ($process -and $process.Name -ieq 'electron.exe' -and $process.CommandLine -match '--poketokenbar-app=PokeTokenBar-Windows') { Stop-Process -Id $targetPid -Force }" >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo Iniciando limpiamente sin consolas...
if exist "PokeTokenBar.vbs" (
    start "" wscript.exe "PokeTokenBar.vbs"
    exit /b 0
)

start "" "node_modules\electron\dist\electron.exe" . --poketokenbar-app=PokeTokenBar-Windows
exit /b 0
