# Buat / reset database SQLite CreativeHUB
# Jalankan: .\buat-database.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

. "$root\use-php84.ps1"

Write-Host ""
Write-Host "=== Setup Database CreativeHUB ===" -ForegroundColor Cyan

if (-not (Test-Path "$root\.env")) {
    Write-Host "Membuat .env dari .env.example ..." -ForegroundColor Yellow
    Copy-Item "$root\.env.example" "$root\.env"
    php artisan key:generate
}

if (-not (Test-Path "$root\vendor\autoload.php")) {
    Write-Host "ERROR: Jalankan dulu: composer install" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$root\database")) {
    New-Item -ItemType Directory -Path "$root\database" | Out-Null
}

$dbFile = "$root\database\database.sqlite"
Write-Host "Database: SQLite" -ForegroundColor Green
Write-Host $dbFile
Write-Host "Membuat tabel (migrate:fresh) ..." -ForegroundColor Yellow

php artisan migrate:fresh --force

php artisan storage:link 2>$null

Write-Host ""
Write-Host "Database siap. Tidak ada akun demo." -ForegroundColor Green
Write-Host "Langkah berikutnya:" -ForegroundColor Cyan
Write-Host "  npm run build"
Write-Host "  .\serve.ps1"
Write-Host "  Daftar akun di halaman register"
