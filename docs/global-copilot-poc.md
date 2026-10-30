# POC: agente Copilot global a partir do hub-ai

## Objetivo e limite

Instalar **uma vez por usuário** o agente `code-reviewer` para abrir projetos frontend diferentes no VS Code sem copiar CLI, skills ou arquivos `.github` para cada consumidor. O hub-ai permanece clonado em um local estável. A POC gera um agente pessoal que aponta para as skills do checkout central; não é uma extensão, serviço ou motor autônomo de revisão.

**Limite importante:** a descoberta de agentes pessoais e a sintaxe de chamada dependem da versão/configuração do VS Code + GitHub Copilot. O script não pode confirmar que o Copilot realmente leu as skills. A simulação automatizada valida somente os arquivos, o isolamento e a idempotência. O teste real precisa ocorrer no editor.

## Instalação (Windows Git Bash)

```bash
git clone https://github.com/thataspinola/hub-ai.git
cd hub-ai
node tools/global-review-poc.cjs --dry-run
node tools/global-review-poc.cjs
node --test __tests__/config/global-review-poc.spec.cjs
```

Destino padrão: `~/.github/agents/code-reviewer.agent.md`. Confirme no VS Code se esta é a pasta de agentes pessoais reconhecida pela versão instalada. Se o VS Code utilizar outro local, passe `--agent-dir /c/caminho/da/pasta/de/agentes`. Não altere a configuração do workspace para contornar uma falha de descoberta.

O instalador não sobrescreve um agente existente com conteúdo diferente. Para atualização, compare o arquivo instalado e faça uma migração consciente. Mantenha o checkout central no mesmo caminho; mover a pasta invalida referências absolutas. O agente apenas referencia skills do hub-ai; não distribui skills em cada projeto.

## Validação manual indispensável

1. Abra o VS Code com um projeto React **sem arquivos de reviewer** e confirme que o agente `code-reviewer` aparece na seleção de agentes do Copilot Chat.
2. Selecione o agente e peça `revisar`; solicite evidência de leitura de `AGENTS.md`, do código do projeto e das skills relevantes do checkout central.
3. Abra outro projeto Next.js, também limpo, e repita a mesma ativação. Confira que não houve criação de `.github/skills` ou instalação de CLI nos consumidores.
4. Teste um projeto com `AGENTS.md` próprio e confirme que suas regras são respeitadas.
5. Atualize uma skill do checkout central, abra uma nova sessão de chat e confira que a versão atualizada foi utilizada. Registre logs do editor, arquivos/linhas e diferenças observáveis.

**Aprovação:** mesmo agente selecionável e revisão fundamentada em dois projetos independentes, sem cópias nos consumidores, respeitando configurações locais. A simulação Node não comprova este critério.

## Escopo da próxima evolução

Esta POC valida **frontend com hub-ai**. Para um agente único que também revise backend, conectar o checkout independente `backend-code-reviewer` e testar detecção de escopo em monorepos. Não afirmar que a POC atual cobre Node/NestJS. Manter o setup por projeto como alternativa para equipes/CI e ambientes onde agentes pessoais não sejam suportados.
