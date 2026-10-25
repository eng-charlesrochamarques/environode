# Simulador de dispositivo

O comando `dev:simulator` gera telemetria inteiramente no computador. Para usar a placa física, execute o bridge serial:

```powershell
$env:SERIAL_PORT="COM5"
npm.cmd run dev:serial
```

Quando o firmware omite metadados de transporte, o bridge cria um `bootId` por sessão e uma `sequence` crescente antes de autenticar o pacote na API.

Envia telemetria autenticada para a API usando o mesmo contrato destinado à STM32.

```powershell
npm.cmd run dev:simulator
```

Variáveis opcionais: `API_URL`, `DEVICE_ID`, `DEVICE_KEY`, `BOOT_ID` e `TELEMETRY_INTERVAL_MS`. Os valores padrão usam a central `dev-novalab-01` e a credencial fictícia local descrita em `.env.example`.

