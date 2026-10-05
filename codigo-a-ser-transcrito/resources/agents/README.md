# Agentes reutilizáveis

Um arquivo `.agent.md` por papel, diretamente nesta pasta. Documentação de uso fica em docs/, sem subpastas duplicando o agente.

| Agente | Aplicação |
| --- | --- |
| [Copilot Setup](copilot-setup.agent.md) | Todos os perfis: frontend e backend Node/NestJS |
| [Node Code Reviewer](node-code-reviewer.agent.md) | Backend Node/NestJS |
| [Web Code Reviewer](web-code-reviewer.agent.md) | Angular, React, Next.js e Vue |
| [Code Reviewer legado](frontend-code-reviewer.agent.md) | Perfil frontend legado |

Ver [estrutura e nomes](../../docs/structure-and-naming.md), [uso do setup](../../docs/copilot-setup.md) e [perfil Node](../../profiles/node/README.md). Novos agentes devem ter nome kebab-case com sufixo `.agent.md`, frontmatter válido e ser selecionados nos manifests pertinentes.
