# API Environode

## Organização

| Pasta | Responsabilidade |
| --- | --- |
| `controllers` | Traduz requisições e respostas HTTP. |
| `routes` | Define URLs, autenticação e limites. |
| `services` | Contém regras de negócio e consultas multiempresa. |
| `models` | Define os documentos MongoDB e índices. |
| `middlewares` | Autentica usuário, dispositivo e origem. |
| `database` | Abre o banco e cria dados fictícios quando vazio. |
| `shared/errors` | Padroniza erros públicos. |

Controllers não escolhem a organização a partir do navegador. Eles usam `req.user.organizationId`, preenchido após validar a sessão. Dispositivos usam uma autenticação separada e a organização vem do cadastro da central.

## Banco

`DATABASE_MODE=embedded` executa MongoDB local persistente em `services/api/.data`. `DATABASE_MODE=external` usa `MONGODB_URI` e é obrigatório em produção.

## Testes

`npm.cmd run test:api` executa integração com MongoDB real em processo. Os testes cobrem isolamento, persistência após reconexão, idempotência, autenticação do dispositivo, validação e SSE.
