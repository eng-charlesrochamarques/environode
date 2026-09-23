# Arquitetura

## Modelo de dominio

```
Cliente (organizacao)
  +-- Usuario com acesso a este cliente
  +-- Central 01 (equipamento fisico)
  |     +-- Sensor de temperatura A -> leituras
  |     +-- Sensor de umidade A     -> leituras
  |     +-- Sensor de temperatura B -> leituras
  |     +-- Sensor de umidade B     -> leituras
  +-- Central 02 ... Central 10
  +-- Local de instalacao (opcional)
```

`Site` significa local fisico: laboratorio, sala, deposito ou unidade. Ele ajuda a agrupar centrais, mas nao e necessario para exibir os equipamentos do cliente. A tela inicial mostra diretamente as centrais. Cada central tem identidade, estado de conexao e uma lista de sensores. Cada sensor tem tipo, unidade e suas proprias leituras com horario.

## Responsabilidades

| Pasta | Responsabilidade |
| --- | --- |
| `apps/web` | Interface, login e visualizacao das centrais. Nao decide autorizacao. |
| `services/api` | Autenticacao, autorizacao por cliente e entrega dos dados. |
| `tools/device-simulator` | Futuramente enviara leituras ficticias para testar a plataforma. |
| `firmware/stm32-h753` | Futuramente conectara o equipamento fisico. |
| `docs` | Decisoes, contratos e limites da demonstracao. |

Hoje os dados de exemplo ficam em `services/api/src/db/seed.js`. Quando houver banco de dados, as consultas devem filtrar pela organizacao do usuario autenticado. A telemetria real sera recebida pela API, vinculada a um sensor cadastrado e disponibilizada para a interface. A interface podera entao receber atualizacoes por polling, SSE ou WebSocket. A escolha depende da frequencia de leitura e do numero de clientes conectados; nao ha transporte em tempo real implementado nesta fase.

No frontend, `routes/` associa cada URL a uma tela; `components/layout/` reúne cabeçalho, menu e rodapé; `components/ui/` reúne peças usadas em mais de uma tela; `features/` contém o comportamento próprio de cada área. O login é único e não inclui um cliente na URL. O servidor identifica o cliente pela sessão autenticada, inclusive ao consultar `/api/devices/:deviceId`.
