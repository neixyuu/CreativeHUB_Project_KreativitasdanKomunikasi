# Aktifkan PHP 8.4 + Composer + Node.js untuk development (jalankan di setiap terminal baru)
$php84 = "C:\php84"
$composerBin = "C:\ProgramData\ComposerSetup\bin"
$nodejs = "C:\Program Files\nodejs"

if (-not (Test-Path "$php84\php.exe")) {
    Write-Host "PHP 8.4 tidak ditemukan di $php84" -ForegroundColor Red
    Write-Host "Ekstrak PHP 8.4 VS17 x64 NTS ke C:\php84 lalu jalankan lagi." -ForegroundColor Yellow
    exit 1
}

$prefix = "$php84;"
if (Test-Path $composerBin) {
    $prefix += "$composerBin;"
}
if (Test-Path $nodejs) {
    $prefix += "$nodejs;"
}
$env:Path = $prefix + $env:Path

Write-Host "PHP:" -ForegroundColor Green
php -v
Write-Host ""
Write-Host "Perintah php yang dipakai:" -ForegroundColor Cyan
(Get-Command php).Source

if (Test-Path $nodejs) {
    Write-Host ""
    Write-Host "Node:" -ForegroundColor Green
    node -v
    Write-Host ""
    Write-Host "Siap. Contoh:" -ForegroundColor Cyan
    Write-Host "  php artisan serve"
    Write-Host "  npm run build"
} else {
    Write-Host ""
    Write-Host "Node.js tidak ditemukan. Install dari https://nodejs.org" -ForegroundColor Yellow
}
