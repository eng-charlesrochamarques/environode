# Integração STM32H753

A demonstração usa a porta virtual do ST-LINK da `NUCLEO-H753ZI`. O firmware escreve as amostras no `USART3`; o bridge executado no computador faz o POST autenticado para a plataforma.

## Fluxo validado

```text
STM32H753 -> USART3/COM5 -> bridge Node.js -> API -> MongoDB -> SSE -> React
```

Em 25/10/2026, o firmware foi compilado com Arm GNU Toolchain 14.2.1, gravado pelo ST-LINK V3 com pyOCD 0.46.0 e validado na placa física. As quatro leituras chegaram ao MongoDB e foram consultadas novamente pela API.

## Formato serial

- `115200 8N1`;
- ASCII compatível com UTF-8;
- um objeto JSON por linha;
- quatro leituras por pacote;
- valores representados internamente em milésimos para evitar ponto flutuante no núcleo.

Exemplo emitido:

```json
{"readings":[{"sensorId":"sensor-novalab-01-t1","value":22.400}]}
```

O módulo [telemetry_protocol.c](../../firmware/stm32-h753/App/telemetry_protocol.c) não depende da HAL. O bridge cria uma identidade nova a cada sessão e numera os pacotes antes do envio, permitindo deduplicação na API.

## Operação local

Depois de gravar a placa:

```powershell
npm.cmd run start:api
npm.cmd run dev:web
$env:SERIAL_PORT="COM5"
npm.cmd run dev:serial
```

Não execute `dev:simulator` e `dev:serial` ao mesmo tempo quando quiser avaliar somente os dados da placa.
