# Demonstração local

A tela de entrada é neutra e não revela clientes ou credenciais. Estas contas são fictícias e servem somente para testar o projeto localmente:

| Cliente fictício | E-mail | Senha |
| --- | --- | --- |
| NovaLab Electronics | `ana@novalab.example` | `demo123` |
| Circuito Verde Labs | `bruno@circuitoverde.example` | `demo123` |

Entre com uma conta, confira as centrais e alertas, saia e entre com a outra. Os equipamentos e sensores exibidos mudam conforme a organização autenticada. A NovaLab tem 10 centrais com quatro sensores cada; a Circuito Verde tem uma central com dois sensores.

## Roteiro de apresentação

1. Mantenha a placa física e `npm.cmd run dev:serial` ligados para o perfil da Ana.
2. Execute `npm.cmd run dev:alerts` em outro terminal.
3. Entre como Ana para mostrar a NUCLEO atualizando normalmente.
4. Entre como Bruno para mostrar a central simulada em atenção, valores acima dos limites e dois alertas ativos.

Cada fonte de telemetria pertence a uma organização diferente. O perfil do Bruno não recebe nenhum equipamento, leitura ou alerta da NovaLab.
