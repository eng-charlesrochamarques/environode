# Contrato da API

## Telemetria

`POST /api/telemetry`

Cabeçalhos:

```http
Content-Type: application/json
X-Device-Id: dev-novalab-01
X-Device-Key: <credencial individual>
```

Corpo:

```json
{
  "bootId": "boot-20261025-01",
  "sequence": 42,
  "sampledAt": "2026-10-25T16:00:00.000Z",
  "readings": [
    { "sensorId": "sensor-novalab-01-t1", "value": 23.75 },
    { "sensorId": "sensor-novalab-01-h1", "value": 48.2 }
  ]
}
```

Resposta `202`: pacote novo persistido. Resposta `200` com `duplicate: true`: pacote já recebido. A API limita umidade a `0..100`, temperatura a `-100..200`, no máximo 32 leituras e somente sensores cadastrados na central.

## Usuário

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/devices`
- `GET /api/devices/:deviceId`
- `GET /api/devices/:deviceId/measurements?limit=100`
- `GET /api/alerts`
- `GET /api/events` (SSE)

As rotas de usuário usam cookie de sessão `HttpOnly`. `/api/events` emite `connected` e `telemetry`; o servidor publica cada evento apenas para conexões da organização proprietária.
