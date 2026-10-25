cmake_minimum_required(VERSION 3.22)
project(environode_stm32h753 C ASM)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMSIS_DEVICE "${CMAKE_CURRENT_SOURCE_DIR}/.vendor/cmsis-device-h7")
set(CMSIS_CORE "${CMAKE_CURRENT_SOURCE_DIR}/.vendor/CMSIS_5/CMSIS/Core")
set(LINKER_SCRIPT "${CMAKE_CURRENT_SOURCE_DIR}/STM32H753ZITX_FLASH.ld")

if(NOT EXISTS "${CMSIS_DEVICE}/Include/stm32h753xx.h" OR NOT EXISTS "${CMSIS_CORE}/Include/core_cm7.h")
  message(FATAL_ERROR "Dependencias CMSIS ausentes. Execute scripts/setup.ps1 antes de compilar.")
endif()

add_executable(environode.elf
  Core/Src/main.c
  App/telemetry_protocol.c
  ${CMSIS_DEVICE}/Source/Templates/system_stm32h7xx_singlecore.c
  ${CMSIS_DEVICE}/Source/Templates/gcc/startup_stm32h753xx.s
)

target_include_directories(environode.elf PRIVATE
  App
  ${CMSIS_DEVICE}/Include
  ${CMSIS_CORE}/Include
)

target_compile_definitions(environode.elf PRIVATE STM32H753xx USE_PWR_LDO_SUPPLY)

set(MCU_FLAGS -mcpu=cortex-m7 -mthumb -mfpu=fpv5-d16 -mfloat-abi=hard)

target_compile_options(environode.elf PRIVATE
  ${MCU_FLAGS}
  -ffunction-sections
  -fdata-sections
  -Wall
  -Wextra
  -Werror
  $<$<COMPILE_LANGUAGE:C>:-Og>
  $<$<COMPILE_LANGUAGE:C>:-g3>
)

target_link_options(environode.elf PRIVATE
  ${MCU_FLAGS}
  -T${LINKER_SCRIPT}
  --specs=nano.specs
  --specs=nosys.specs
  -Wl,--gc-sections
  -Wl,-Map=${CMAKE_CURRENT_BINARY_DIR}/environode.map
)

target_link_libraries(environode.elf PRIVATE m)

add_custom_command(TARGET environode.elf POST_BUILD
  COMMAND ${CMAKE_OBJCOPY} -O ihex $<TARGET_FILE:environode.elf> ${CMAKE_CURRENT_BINARY_DIR}/environode.hex
  COMMAND ${CMAKE_OBJCOPY} -O binary $<TARGET_FILE:environode.elf> ${CMAKE_CURRENT_BINARY_DIR}/environode.bin
  COMMAND ${CMAKE_SIZE} $<TARGET_FILE:environode.elf>
  COMMENT "Gerando HEX/BIN e exibindo o uso de memoria"
)
