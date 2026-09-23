# Seguranca da plataforma

## Fronteiras de confianca

O navegador representa um usuario e nunca escolhe qual cliente consultar. A API identifica o usuario pela sessao e obtem `organizationId` do cadastro no servidor. Toda consulta de centrais, sensores, leituras e alertas deve aplicar esse identificador. Quando chegar a persistencia, ele precisa estar no filtro do banco de dados, inclusive nas consultas por ID.

```
Navegador do cliente -> API autenticada -> dados da organizacao do usuario
                                         -> central -> sensor -> leitura
```

O teste `services/api/tests/tenant-isolation.test.js` entra com duas contas e verifica que uma nao recebe dados da outra. Essa e a defesa contra acesso indevido a objetos (BOLA), um risco importante para APIs multiempresa.

## Controles implementados na demonstracao

| Controle | Por que existe |
| --- | --- |
| Cookie de sessao `HttpOnly`, `SameSite=Strict`, `Secure` em producao | Evita expor o token ao JavaScript e limita o envio entre sites. HTTPS e obrigatorio em producao. |
| Verificacao de `Origin` em alteracoes da API | Reduz requisicoes forjadas a partir de outro site. Novas rotas de escrita precisam manter esta regra. |
| Filtro por `organizationId` no servidor | A conta de um cliente nao pode escolher ou receber dados de outro cliente. |
| Limite de 5 tentativas de login por minuto | Dificulta tentativas repetidas de senha. |
| Mensagem unica para email ou senha invalidos | Nao confirma se uma conta existe. |
| Segredo JWT exigido em producao | Impede iniciar com o segredo local conhecido. |
| Helmet, CORS restrito e limite de corpo JSON | Reduz exposicao a configuracoes inseguras e requisicoes excessivas. |

O status visual da central e demonstrativo. Nao deve ser calculado no navegador: quando houver telemetria real, a API deve calcular `online`, `warning` ou `offline` a partir do ultimo contato e das regras de alerta.

## Antes de usar clientes reais

Esta versao usa contas e senha de demonstracao fixas, dados em memoria e sem revogacao central de sessoes. Nao e apropriada para publicacao com clientes reais. As proximas etapas de seguranca sao: banco persistente com filtro obrigatorio por organizacao, provisionamento de contas, senhas individuais e recuperacao segura, revogacao de sessoes, HTTPS, logs de auditoria sem dados sensiveis, protecao de credenciais dos dispositivos, politica de retencao de leituras e testes de autorizacao para cada rota nova. Para trafego distribuido, o limite de login deve usar armazenamento compartilhado.

Referencias: [OWASP API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
