# Compatibilidade verificada

| Componente | Evidência | Limite |
| --- | --- | --- |
| Python 3.12/Linux | Suítes locais de instalação, diagnóstico, recuperação e validação | Windows/macOS e Python 3.10 ainda não executados |
| Node 24/Linux | Exemplo executável local e suites automated/E2E | Não comprova Lambda |
| Node 22/Linux | Matriz configurada na CI | Conferir resultado da execução do commit |
| GitHub Copilot | Arquivos de configuração e templates preparados | Descoberta, tools e execução no Copilot ainda pendentes |
| Reviewer por agente nesta sessão | Cenário sintético avaliado com recursos do hub | Não certifica Copilot nem todos os modelos |

O projeto não fixa uma versão de Copilot como “compatível” sem executar um teste nela. Ao validar um executor, registrar versão/extensão, ambiente, recursos detectados, setup gerado, revisão executada, comandos e saída sanitizada. Conferir nomes de ferramentas reconhecidos pelo executor e adaptar o frontmatter ao seu contrato quando necessário.

PyYAML é dependência apenas de validação/desenvolvimento. Installer/doctor usam biblioteca padrão. Escolher runtime do projeto consumidor a partir do código, engines, documentação e pipeline; não copiar a versão do exemplo como requisito corporativo universal.
