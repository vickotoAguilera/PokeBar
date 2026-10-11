@echo off
cd /d "%~dp0"

:: Cerrar cualquier instancia previa colgada para recargar el codigo actualizado
taskkill /F /IM electron.exe >nul 2>&1
ping 127.0.0.1 -n 2 >nul

:: Si existe PokeTokenBar.vbs, ejecutarlo para 0 consolas visibles
if exist "PokeTokenBar.vbs" (
    start "" wscript.exe "PokeTokenBar.vbs"
    exit /b 0
)

:: Alternativa directa si no estuviese el vbs
if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" .
    exit /b 0
)

start "" /b node "node_modules\electron\cli.js" .
exit /b 0
