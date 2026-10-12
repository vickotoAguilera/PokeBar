@echo off
title PokeTokenBar Windows - Consola de Registro
cd /d "%~dp0"

echo ========================================================
echo     PokeTokenBar Windows - Modo Consola Interactivo
echo ========================================================
echo Presiona Ctrl+C en esta ventana para cerrar el programa.
echo.

if exist "node_modules\.bin\electron.cmd" goto run_electron_cmd
goto run_npm

:run_electron_cmd
call "node_modules\.bin\electron.cmd" . --poketokenbar-app=PokeTokenBar-Windows
goto check_exit

:run_npm
call npm start -- --poketokenbar-app=PokeTokenBar-Windows
goto check_exit

:check_exit
if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo [AVISO] La aplicacion finalizo con codigo de error.
    echo Revisa el archivo app.log para mas detalles.
    echo ========================================================
    pause
)
