# Arquitetura

## Domínio

```text
Organização
  +-- Usuários
  +-- Locais
  +-- Centrais
        +-- Sensores
              +-- Leituras
        +-- Alertas
```

Um local agrupa centrais e é opcional na experiência principal. Cada central possui uma identidade de telemetria e sensores cadastrados. Leituras nunca criam sensores automaticamente: o identificador precisa pertencer à central autenticada.

## Fluxo de telemetria

```text
STM32 ou simulador
  -> POST /api/telemetry + credencial da central
  -> validação física, identidade e repetição
  -> Measurement no MongoDB
  -> atualização de Device e Alert
  -> evento SSE restrito à organização
  -> React atualiza central e histórico
```

`bootId` identifica uma inicialização do firmware e `sequence` cresce a cada pacote. O índice único com esses campos torna o reenvio seguro quando a placa não recebe a resposta HTTP.

## Backend

O backend segue o padrão legível usado no `web-almoxarifado`, com responsabilidades explícitas:

- `routes`: contrato e middlewares;
- `controllers`: adaptação HTTP;
- `services`: regras e consultas;
- `models`: persistência Mongoose;
- `database`: ciclo de vida e seed;
- `middlewares`: fronteiras de autenticação.

O serviço adiciona uma camada de negócio porque ingestão, alertas e SSE não devem ficar dentro de controllers. Toda consulta de usuário contém `organizationId`. A central consultada por ID também exige organização no mesmo filtro.

## Frontend

- `routes`: URLs e proteção visual;
- `components/layout`: cabeçalho, menu e rodapé;
- `components/ui`: peças reutilizáveis;
- `features`: telas e componentes do domínio;
- `hooks`: carregamento e SSE;
- `lib`: cliente HTTP.

A proteção de rota melhora a experiência, mas a autorização permanece na API.
