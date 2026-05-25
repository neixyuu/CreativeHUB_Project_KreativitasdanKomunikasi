# Jalankan dari folder proyek: .\setup-dev.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

. "$root\use-php84.ps1"

if (-not (Test-Path "$root\.env")) {
    Copy-Item "$root\.env.example" "$root\.env"
    php artisan key:generate
}

if (-not (Test-Path "$root\database\database.sqlite")) {
    New-Item -ItemType File -Path "$root\database\database.sqlite" | Out-Null
}

php artisan migrate --force
php artisan storage:link 2>$null

if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm install
    npm run build
    Write-Host "`nFrontend build selesai." -ForegroundColor Green
} else {
    Write-Host "`nNode/npm tidak di PATH. Jalankan: npm install && npm run build" -ForegroundColor Yellow
}

Write-Host "`nMemperbaiki akun yang belum lengkap (profil / verifikasi)..." -ForegroundColor Cyan
php artisan users:repair 2>$null

Write-Host "`nSelesai. Jalankan: .\serve.ps1" -ForegroundColor Cyan
Write-Host "Buat akun baru di /register (belum ada data demo di database)." -ForegroundColor Cyan
