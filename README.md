# Environode

Plataforma IoT multiempresa para monitoramento de temperatura e umidade. Cada cliente acessa somente suas centrais, sensores, leituras e alertas.

## Estado atual

- Login neutro com sessão em cookie protegido.
- Isolamento por organização aplicado pela API e coberto por testes.
- MongoDB persistente: incorporado em desenvolvimento ou externo em produção.
- Ingestão HTTP autenticada para dispositivos.
- Idempotência por `deviceId + bootId + sequence`.
- Atualização da interface em tempo real por Server-Sent Events (SSE).
- Histórico por central e alertas determinísticos por limite.
- Simulador Node.js e bridge serial para STM32.

## Pastas

```text
apps/web/                  React, rotas, componentes e telas
services/api/src/
  config/                  ambiente
  controllers/             entrada e saída HTTP
  database/                conexão e carga inicial
  middlewares/             autenticação de usuário/dispositivo
  models/                  schemas Mongoose
  routes/                  contratos HTTP
  services/                regras de plataforma, telemetria e SSE
  shared/errors/           erros HTTP
firmware/stm32-h753/       firmware C, CMake, build e gravação ST-LINK
tools/device-simulator/    simulador e bridge serial
docs/                      arquitetura, API, firmware e segurança
```

## Executar

```powershell
npm.cmd install
npm.cmd run dev:api
npm.cmd run dev:web
npm.cmd run dev:simulator
```

Abra `http://localhost:5173`. As credenciais fictícias ficam em [docs/demo/README.md](docs/demo/README.md).

No desenvolvimento, a API baixa uma cópia local do MongoDB na primeira execução e mantém banco e binário em `services/api/.data/`, fora do Git. Para usar MongoDB externo, configure `DATABASE_MODE=external` e `MONGODB_URI`.

Para encaminhar JSON da STM32 pela porta virtual:

```powershell
$env:SERIAL_PORT="COM5"
npm.cmd run dev:serial
```

O firmware de simulação da `NUCLEO-H753ZI`, incluindo os comandos de preparação, compilação e gravação, está em [firmware/stm32-h753/README.md](firmware/stm32-h753/README.md).

## Verificação

```powershell
npm.cmd run test:api
npm.cmd run build:web
npm.cmd audit
```

O contrato de telemetria está em [docs/api/README.md](docs/api/README.md) e as decisões de segurança em [docs/security/README.md](docs/security/README.md).
