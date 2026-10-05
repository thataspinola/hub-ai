# Copilot Setup

Um único [Copilot Setup](../resources/agents/copilot-setup.agent.md) atende frontend Angular/React/Next.js/Vue e backend Node/NestJS. O agente detecta stack, aplicação, runner, adapter e scripts; usa somente recursos instalados e aplicáveis ao escopo.

```sh
node scripts/install.js /caminho/do/projeto --profile node
# Ou: --profile angular, react, nextjs, vue; frontend é o perfil legado.
```

Selecionar **Copilot Setup** no executor e pedir `full setup`, `instructions`, `AGENTS`, `skills` ou `agent <nome>`. Full setup adapta instructions, AGENTS necessários e recursos do perfil; não há número fixo de skills. Em monorepo misto, indicar a aplicação e preservar regras por escopo.

O instalador copia agentes, skills e templates e registra versão/hashes no lock. A adaptação exige executar o agente no projeto. Não sobrescrever customizações sem revisar o diff. Não tratar exemplos do hub como arquivos existentes no alvo nem prometer execução no editor sem evidências.

Ver [estrutura, nomes e migração](structure-and-naming.md) e [atualização](updating.md). Nenhuma integração Jira/Jenkins ou deploy é instalada pelo setup.
