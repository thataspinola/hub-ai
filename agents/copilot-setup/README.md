# copilot-setup

Agente para configurar instruções, skills e agentes do Copilot em projetos.

## Instalação

Na raiz deste hub, execute:

```bash
python3 scripts/install.py /caminho/do/projeto
```

O instalador copia os dois agentes para `.github/agents/`, os templates para `.github/templates/` e as oito skills para `.github/skills/`. Não sobrescreve arquivos diferentes por padrão. Consulte o README principal para atualizar uma instalação.

## Uso

No executor compatível, selecione **Copilot Setup** e solicite:

- `full setup`: adapta instructions, oito skills e o code-reviewer ao projeto.
- `instructions`: gera `.github/copilot-instructions.md`.
- `skills`: adapta as oito skills disponíveis.
- `agent 'nome'`: cria um agente usando o template.

O agente identifica framework, scripts, linter e ferramentas reais antes de gerar os arquivos. Exemplos do hub são referências, não evidência sobre o projeto alvo. Revise os diffs e execute os scripts de validação disponíveis no projeto antes de commitar.

A instalação copia recursos; a adaptação e geração de instructions dependem da execução do agente. Nenhuma integração Jira ou Jenkins é instalada por este processo.
