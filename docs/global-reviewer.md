# Code Reviewer Plug and Play no hub-ai

O **hub-ai** é um consumidor do reviewer central [code-reviewer-plug-and-play](https://github.com/thataspinola/code-reviewer-plug-and-play), que reúne as skills originais de frontend e backend. O painel continua sendo uma aplicação Next.js independente: sua autenticação, código, testes, CI/CD GitLab/Jenkins e agentes locais existentes permanecem intactos.

## Instalar uma única vez no perfil pessoal

No Windows/Git Bash, com Node.js 22+ e VS Code/Copilot habilitado:

```bash
git clone https://github.com/thataspinola/code-reviewer-plug-and-play.git
cd code-reviewer-plug-and-play
npm run check
node tools/install.cjs --dry-run
node tools/install.cjs
```

O instalador grava `~/.github/agents/code-reviewer.agent.md` e skills pessoais `~/.copilot/skills/code-reviewer-front-*` e `code-reviewer-back-*`. Não copia arquivos para o hub-ai nem para outros consumidores.

## Verificar no hub-ai

```bash
cd /c/projetos/hub-ai
npm run reviewer:doctor
npm run check:config
```

O doctor verifica somente a presença do agente gerenciado e de pelo menos uma skill pessoal de cada domínio. Ele **não comprova** que o Copilot carregou as skills. Se o Copilot usar diretórios personalizados, informe os mesmos `--agent-dir` e `--skill-dir` usados no instalador, por exemplo: `node tools/check-global-reviewer.cjs --agent-dir ... --skill-dir ...`.

No VS Code, abra o hub-ai e selecione **code-reviewer** no Copilot Chat; solicite: `Revise as alterações desta branch em relação à main, aplique as skills Next.js/React e de segurança, e respeite AGENTS.md. Informe achados com arquivo e linha, evidência, impacto, severidade e testes realmente executados.`

Em um projeto backend como `porto_connectivity`, use o mesmo agente pessoal, sem copiar ferramentas. O agente deve identificar pacotes CommonJS Lambda, eventos e instruções locais.

## Atualizar sem duplicar

```bash
cd /c/projetos/code-reviewer-plug-and-play
git pull --ff-only
npm run check
node tools/install.cjs --dry-run --update
node tools/install.cjs --update
```

O hub-ai **não executa a instalação global automaticamente**, para não alterar o perfil do desenvolvedor ou sobrescrever customizações. O `--update` preserva agentes/skills não gerenciados. Se houver um agente antigo não gerenciado com o mesmo nome, o instalador interrompe a operação; faça backup e resolva o conflito conscientemente.

## Coexistência com o toolkit legado

Os recursos em `resources/frontend`, `tooling/web-code-reviewer`, `.github/agents/web-code-reviewer.agent.md` e `tools/code-reviewer.cjs` permanecem para compatibilidade de instalações antigas e funções locais do painel. **Para novas revisões, o caminho recomendado é o agente pessoal `code-reviewer`.** Não execute a CLI legada para instalar em cada consumidor, a menos que precise manter uma instalação anterior. O agente pessoal não substitui automaticamente o Copilot Setup local.

## Critérios de homologação

- `npm run reviewer:doctor` e `npm run check:config` passam no ambiente autorizado.
- Copilot lista `code-reviewer` no seletor de agentes e consegue acessar skills pessoais.
- Uma revisão Next.js do hub-ai e outra backend do connectivity citam arquivos reais, usam regras locais e não alteram consumidores.
- Não foram instaladas dependências, SDKs de telemetria ou acessos AWS/GitLab fora da VDI.
- `npm run verify` valida os checks próprios do painel quando dependências estiverem instaladas.

A verificação no editor/VDI ainda é necessária; CI de Node e doctor local não comprovam integração ponta a ponta.
