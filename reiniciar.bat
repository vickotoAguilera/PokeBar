@echo off
cd /d "%~dp0"

echo Cerrando instancias previas de Electron...
taskkill /F /IM electron.exe >nul 2>&1
ping 127.0.0.1 -n 2 >nul

echo Iniciando limpiamente sin consolas...
if exist "PokeTokenBar.vbs" (
    start "" wscript.exe "PokeTokenBar.vbs"
    exit /b 0
)

start "" "node_modules\electron\dist\electron.exe" .
exit /b 0
