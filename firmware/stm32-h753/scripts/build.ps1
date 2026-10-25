$ErrorActionPreference = "Stop"
$firmwareRoot = Split-Path -Parent $PSScriptRoot

cmake -S $firmwareRoot -B "$firmwareRoot/build" -G Ninja `
  "-DCMAKE_TOOLCHAIN_FILE=$firmwareRoot/cmake/arm-none-eabi.cmake"
cmake --build "$firmwareRoot/build"
