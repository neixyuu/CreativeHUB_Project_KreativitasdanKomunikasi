# Build frontend (Vite + Wayfinder butuh PHP 8.4 di PATH)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
. "$PSScriptRoot\use-php84.ps1"
npm run build
