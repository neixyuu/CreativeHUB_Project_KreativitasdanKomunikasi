# Perbaiki white screen / login gagal
# Jalankan: .\perbaiki-login.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

. "$root\use-php84.ps1"

Write-Host ""
Write-Host "=== Perbaiki konfigurasi login ===" -ForegroundColor Cyan

if (-not (Test-Path "$root\.env")) {
    Copy-Item "$root\.env.example" "$root\.env"
    php artisan key:generate
}

$envPath = "$root\.env"
$content = Get-Content $envPath -Raw

if ($content -match 'APP_URL=http://localhost') {
    $content = $content -replace 'APP_URL=http://localhost', 'APP_URL=http://127.0.0.1:8000'
    Write-Host "APP_URL diubah ke http://127.0.0.1:8000" -ForegroundColor Yellow
}

if ($content -notmatch 'SESSION_DRIVER=') {
    $content += "`nSESSION_DRIVER=file`n"
} else {
    $content = $content -replace 'SESSION_DRIVER=database', 'SESSION_DRIVER=file'
}

Set-Content -Path $envPath -Value $content.TrimEnd() -NoNewline
Add-Content -Path $envPath -Value ""

if (Test-Path "$root\public\hot") {
    Remove-Item "$root\public\hot" -Force
    Write-Host "File public/hot dihapus (Vite dev tidak aktif)" -ForegroundColor Yellow
}

php artisan config:clear
php artisan route:clear
php artisan view:clear

if (-not (Test-Path "$root\database\database.sqlite")) {
    New-Item -ItemType File -Path "$root\database\database.sqlite" | Out-Null
}

php artisan migrate --force

if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm run build
} else {
    Write-Host "npm tidak di PATH - jalankan manual: npm run build" -ForegroundColor Red
}

Write-Host ""
Write-Host "Selesai. WAJIB buka:" -ForegroundColor Green
Write-Host "  http://127.0.0.1:8000/register  (buat akun dulu jika belum)" -ForegroundColor White
Write-Host "  http://127.0.0.1:8000/login" -ForegroundColor White
Write-Host ""
Write-Host "Jangan pakai localhost jika APP_URL 127.0.0.1" -ForegroundColor Yellow
