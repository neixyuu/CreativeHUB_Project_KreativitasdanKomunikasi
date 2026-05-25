# Menjalankan server development dengan PHP 8.4
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
. "$PSScriptRoot\use-php84.ps1"
php artisan serve
