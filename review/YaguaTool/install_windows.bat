@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul
title YaguaTool 3.0.1 - After Effects 2024/2025
set "YAGUA_SOURCE=%~dp0"
set "YAGUA_EXTDIR=%APPDATA%\Adobe\CEP\extensions"
set "YAGUA_DEST=%YAGUA_EXTDIR%\YaguaTool"
set "YAGUA_STAGE=%YAGUA_EXTDIR%\YaguaTool.__installing__"
set "YAGUA_BACKUP=%USERPROFILE%\Documents\YaguaTool_Backups\install-%RANDOM%-%RANDOM%"
echo YaguaTool 3.0.1 - Cierra After Effects antes de continuar.
if not exist "%YAGUA_SOURCE%CSXS\manifest.xml" goto failure
if not exist "%YAGUA_SOURCE%jsx\yagua-host.jsx" goto failure
if not exist "%YAGUA_EXTDIR%" mkdir "%YAGUA_EXTDIR%"
if not exist "%YAGUA_BACKUP%" mkdir "%YAGUA_BACKUP%"
if errorlevel 1 goto failure
if exist "%YAGUA_STAGE%" rmdir /S /Q "%YAGUA_STAGE%"
robocopy "%YAGUA_SOURCE%" "%YAGUA_STAGE%" /E /R:2 /W:1 /NP /NFL /NDL >"%TEMP%\YaguaTool_install.log" 2>&1
if errorlevel 8 goto failure
if not exist "%YAGUA_STAGE%\motion-lab\reference-player.js" goto failure
if not exist "%YAGUA_STAGE%\js\ae-bridge.js" goto failure
if not exist "%YAGUA_STAGE%\jsx\yagua-host.jsx" goto failure
if not exist "%YAGUA_STAGE%\library\Fluido_Original_AE2024.aep" goto failure
if exist "%YAGUA_DEST%" (
 move "%YAGUA_DEST%" "%YAGUA_BACKUP%\YaguaTool" >nul
 if errorlevel 1 goto restore
)
if exist "%YAGUA_EXTDIR%\Yaguanimix" (
 move "%YAGUA_EXTDIR%\Yaguanimix" "%YAGUA_BACKUP%\Yaguanimix" >nul
 if errorlevel 1 goto restore
)
move "%YAGUA_STAGE%" "%YAGUA_DEST%" >nul
if errorlevel 1 goto restore
for %%V in (11 12 13) do reg add "HKCU\Software\Adobe\CSXS.%%V" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
echo INSTALADO: "%YAGUA_DEST%"
echo RESPALDO: "%YAGUA_BACKUP%"
echo Reinicia AE y abre Ventana ^> Extensiones ^> YaguaTool.
echo Instala assets\fonts\GeistLab760.ttf para las composiciones nativas de Motion Lab.
pause
exit /b 0
:restore
if not exist "%YAGUA_DEST%" if exist "%YAGUA_BACKUP%\YaguaTool" move "%YAGUA_BACKUP%\YaguaTool" "%YAGUA_DEST%" >nul
if not exist "%YAGUA_EXTDIR%\Yaguanimix" if exist "%YAGUA_BACKUP%\Yaguanimix" move "%YAGUA_BACKUP%\Yaguanimix" "%YAGUA_EXTDIR%\Yaguanimix" >nul
:failure
echo ERROR. Se conserva la copia anterior o su respaldo. Consulta "%TEMP%\YaguaTool_install.log".
pause
exit /b 1
