@echo off
REM Buka terminal dev dengan PHP 8.4 + Composer + Node di PATH
set "PATH=C:\php84;C:\ProgramData\ComposerSetup\bin;C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo PHP:
php -v
echo.
echo Folder proyek: %CD%
echo Contoh: php artisan serve   atau   npm run build
cmd /k
