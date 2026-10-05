# hub-ai

Repositório centralizado de agentes Copilot, skills e templates para projetos Porto Seguro.

## Objetivo

Fornecer ferramentas e recursos reutilizáveis para acelerar a criação de agentes Copilot customizados em novos projetos, promovendo consistência e qualidade através de padrões estabelecidos.

Este repositório também é um ponto de contribuição para evoluir e ampliar os agentes, skills e templates — não apenas um artefato estático.

## Estrutura

```javascript
hub-ai/
├── README.md                    # Este arquivo
├── agents/
│   ├── README.md                # Guia de como usar agentes em projetos
│   ├── code-reviewer/
│   │   ├── code-reviewer.agent.md   # Arquivo do agente
│   │   └── README.md                 # Documentação do agente
│   └── copilot-setup/
│       ├── copilot-setup.agent.md    # Arquivo do agente
│       └── README.md                 # Documentação do agente
├── skills/                      # Skills compartilhadas (referência e padrão)
└── templates/                   # Templates para geração automática
```

## Como usar em seu projeto

Execute `python3 scripts/install.py /caminho/do/projeto` a partir da raiz do hub. Requer Python 3.10 ou superior, sem dependências externas. O comando não altera arquivos diferentes já existentes: apresenta os conflitos antes de copiar. Para atualização deliberada, revise o diff e use `--overwrite`. Registre o commit do hub utilizado na atualização.

Depois, selecione Copilot Setup no executor compatível e peça `full setup`. A cópia dos recursos não gera instructions nem valida a compatibilidade do executor automaticamente.

As oito skills cobrem acessibilidade, qualidade, revisão, padrões, performance, segurança, testes e RDM. O foco atual é frontend; outros stacks exigem adaptação. Exemplos com CPF, propostas, Jira e Jenkins preservam contexto de negócio e não representam integrações instaladas.

## Validação e contribuição

Execute `python3 scripts/validate.py` antes de contribuir. O GitHub Actions executa a mesma validação de metadados, links e contrato entre agentes e templates. Revise exemplos técnicos para a stack e versão alvo; esta validação não executa o Copilot nem compila todos os exemplos.

Use Conventional Commits e descreva a validação realizada. Nunca inclua credenciais ou dados reais de clientes nos exemplos.

## Documentação dos agentes

Consulte [agents/README.md](agents/README.md) para instruções detalhadas de como usar os agentes em um novo projeto.

## Referência

- **Skills** — Consulte a pasta `skills/` para ver padrões de estrutura e comportamento
- **Agentes** — Veja a documentação individual de cada agente em sua respectiva pasta

