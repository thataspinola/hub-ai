# Consumir o Code Reviewer Plug and Play

O hub-ai não instala nem distribui Code Reviewers. A única dependência operacional é o agente pessoal do projeto independente [code-reviewer-plug-and-play](https://github.com/thataspinola/code-reviewer-plug-and-play).

## Instalação única no Windows/Git Bash

```bash
git clone https://github.com/thataspinola/code-reviewer-plug-and-play.git
cd code-reviewer-plug-and-play
npm run check
node tools/install.cjs --dry-run
node tools/install.cjs
```

O instalador configura `~/.github/agents/code-reviewer.agent.md` e skills pessoais `~/.copilot/skills/code-reviewer-front-*` e `code-reviewer-back-*`. Nenhum arquivo do reviewer é copiado para o hub-ai.

## Uso no painel

```bash
cd /c/projetos/hub-ai
npm run reviewer:doctor
```

Abra o hub-ai no VS Code, selecione o agente `code-reviewer` no Copilot Chat e peça para revisar a branch contra a base real, respeitando `AGENTS.md`. O mesmo agente pode ser usado em outro projeto frontend ou backend.

Para atualizar, execute `git pull --ff-only` no clone do reviewer e `node tools/install.cjs --update`. Não execute instalação global silenciosamente por scripts do hub-ai. O doctor verifica arquivos pessoais, mas a descoberta e execução real pelo Copilot ainda precisam ser homologadas no editor/VDI.
