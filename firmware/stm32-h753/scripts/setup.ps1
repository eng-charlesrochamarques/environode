$ErrorActionPreference = "Stop"
$firmwareRoot = Split-Path -Parent $PSScriptRoot
$vendorRoot = "$firmwareRoot/.vendor"
$venvPython = "$firmwareRoot/.venv/Scripts/python.exe"
$pyocd = "$firmwareRoot/.venv/Scripts/pyocd.exe"
$deviceRevision = "81db1ec"
$cmsisRevision = "55b1983"

if (-not (Test-Path $venvPython)) {
  python -m venv "$firmwareRoot/.venv"
}

& $venvPython -m pip install -r "$firmwareRoot/requirements-tools.txt"
$env:PYTHONUTF8 = "1"
& $pyocd pack install stm32h753zitx

New-Item -ItemType Directory -Path $vendorRoot -Force | Out-Null

$deviceRoot = "$vendorRoot/cmsis-device-h7"
if (-not (Test-Path "$deviceRoot/.git")) {
  git clone --depth 1 --filter=blob:none --sparse `
    https://github.com/STMicroelectronics/cmsis-device-h7.git $deviceRoot
}
git -C $deviceRoot fetch --depth 1 origin $deviceRevision
git -C $deviceRoot checkout --detach $deviceRevision
git -C $deviceRoot sparse-checkout set Include Source/Templates

$cmsisRoot = "$vendorRoot/CMSIS_5"
if (-not (Test-Path "$cmsisRoot/.git")) {
  git clone --depth 1 --filter=blob:none --sparse `
    https://github.com/ARM-software/CMSIS_5.git $cmsisRoot
}
git -C $cmsisRoot fetch --depth 1 origin $cmsisRevision
git -C $cmsisRoot checkout --detach $cmsisRevision
git -C $cmsisRoot sparse-checkout set CMSIS/Core/Include

Write-Host "Ferramentas do firmware prontas."
