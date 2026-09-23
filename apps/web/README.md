# Environode Web

Interface React/Vite organizada por responsabilidade. A tela de login é neutra. Após autenticar, a API informa o cliente da sessão e entrega apenas os dados autorizados.

## Pastas

```text
src/
  app/                 # Sessão inicial e composição da aplicação
  components/
    layout/            # Cabeçalho, menu lateral, rodapé e estrutura comum
    ui/                # Modal, estados de carregamento, indicadores e métricas
  features/
    auth/              # Entrada
    dashboard/         # Resumo e lista de centrais
    devices/           # Cartão, sensores e detalhe de uma central
    alerts/            # Lista e popup de alerta
  hooks/               # Carregamento de recursos da API
  lib/                 # Cliente HTTP
  routes/              # Definição das URLs e proteção visual das páginas
  styles/              # Base, entrada, layout, centrais e alertas
```

## Rotas

- `/entrar`: acesso único para todos os clientes.
- `/centrais`: resumo e equipamentos da conta autenticada.
- `/centrais/:deviceId`: sensores e dados de uma central.
- `/alertas`: alertas da conta autenticada; um modal mostra cada evento.

`routes/AppRoutes.jsx` impede a navegação visual sem sessão. Isso não substitui a segurança da API: todas as rotas de dados usam a organização obtida da sessão no servidor. A URL de uma central de outro cliente retorna 404.
