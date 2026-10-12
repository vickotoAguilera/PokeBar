@echo off
cd /d "%~dp0"

:: Electron mantiene una unica instancia; no terminar procesos Electron ajenos.

:: Si existe PokeTokenBar.vbs, ejecutarlo para 0 consolas visibles
if exist "PokeTokenBar.vbs" (
    start "" wscript.exe "PokeTokenBar.vbs"
    exit /b 0
)

:: Alternativa directa si no estuviese el vbs
if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" . --poketokenbar-app=PokeTokenBar-Windows
    exit /b 0
)

start "" /b node "node_modules\electron\cli.js" . --poketokenbar-app=PokeTokenBar-Windows
exit /b 0
