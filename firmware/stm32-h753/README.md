# Firmware Environode para STM32H753

Firmware mínimo de demonstração para a `NUCLEO-H753ZI`. Ele simula dois sensores de temperatura e dois de umidade, formata uma linha JSON sem alocação dinâmica e a envia pela porta virtual do ST-LINK a cada dois segundos.

## Organização

```text
App/                     serialização do contrato de telemetria
Core/Src/main.c          inicialização e laço da simulação
cmake/                   configuração do compilador ARM
scripts/setup.ps1        dependências locais e pacote de gravação
scripts/build.ps1        compilação e geração de ELF/HEX/BIN
scripts/flash.ps1        gravação pelo ST-LINK
STM32H753ZITX_FLASH.ld   mapa de memória do microcontrolador
```

As dependências baixadas ficam em `.vendor/` e `.venv/`, sempre fora do Git. Os cabeçalhos vêm dos repositórios oficiais `STMicroelectronics/cmsis-device-h7` e `ARM-software/CMSIS_5`.

## Preparar, compilar e gravar

Execute no diretório `firmware/stm32-h753`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\flash.ps1
```

Requisitos já presentes nesta máquina: CMake, Ninja e Arm GNU Toolchain. A preparação instala `pyOCD` somente no ambiente virtual do firmware.

## Comunicação

- periférico: `USART3`;
- pinos: `PD8` TX e `PD9` RX;
- formato: `115200 8N1`;
- transporte: um objeto JSON ASCII por linha;
- intervalo: 2 segundos.

O firmware não guarda segredo de dispositivo. O bridge local recebe o JSON, acrescenta `bootId` e `sequence`, autentica-se com a credencial individual e envia o pacote à API. No produto final, a estratégia de conectividade e o armazenamento seguro de credenciais serão definidos junto com o hardware.
