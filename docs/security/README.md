# Segurança da plataforma

## Fronteiras

O navegador autentica um usuário. A API busca sua organização no banco e adiciona `organizationId` a todas as consultas. O dispositivo usa `X-Device-Id` e uma chave própria; a API obtém a organização do cadastro da central. O cliente nunca envia uma organização confiável.

## Controles implementados

| Controle | Finalidade |
| --- | --- |
| Cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção | Reduz exposição da sessão a JavaScript e requisições entre sites. |
| Verificação de `Origin` no login/logout | Proteção adicional contra CSRF. |
| Chave de dispositivo armazenada como SHA-256 | A credencial não fica em texto puro no banco. |
| Comparação em tempo constante | Reduz vazamento por diferença de tempo. |
| `bootId + sequence` e índice único | Evita duplicação em reenvios. |
| Sensores permitidos e limites físicos | Rejeita campos e valores inesperados. |
| Limites por rota e corpo JSON de 32 KB | Reduz abuso de recursos. |
| Filtro composto por organização e ID | Impede BOLA entre clientes. |
| SSE separado por organização | Telemetria não é publicada a outro cliente. |
| Segredo JWT e MongoDB externo obrigatórios em produção | Evita configurações locais inseguras. |

Os testes em `services/api/tests/platform.integration.test.js` validam essas fronteiras com duas organizações e um MongoDB real.

## Produção

Antes de cadastrar clientes reais, adicionar HTTPS no proxy, credenciais únicas geradas aleatoriamente por central, rotação/revogação, recuperação de conta, auditoria sem valores sensíveis, política de retenção e backup do MongoDB. O rate limit deve usar armazenamento compartilhado quando houver mais de uma instância da API.

Referências: [OWASP API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
