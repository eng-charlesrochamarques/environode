$ErrorActionPreference = "Stop"
$firmwareRoot = Split-Path -Parent $PSScriptRoot
$pyocd = "$firmwareRoot/.venv/Scripts/pyocd.exe"
$image = "$firmwareRoot/build/environode.hex"

if (-not (Test-Path $pyocd)) { throw "pyOCD ausente. Execute scripts/setup.ps1." }
if (-not (Test-Path $image)) { throw "Firmware ausente. Execute scripts/build.ps1." }

$env:PYTHONUTF8 = "1"
& $pyocd load $image --target stm32h753zitx --format hex
