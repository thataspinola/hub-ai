# copilot-setup

Agente para criar e atualizar documentação do Copilot em projetos.

## Propósito

O `copilot-setup` é um agente de autoinicialização que configura automaticamente a documentação e personalizações do GitHub Copilot em um projeto novo ou existente.

Suas responsabilidades incluem:

- **Analisar** a estrutura do projeto e stack tecnólogico
- **Criar/Atualizar** arquivos em `.github./` seguindo padrões estabelecidos
- **Gerar** skills e agentes adaptados ao projeto

## Como usar

Este agente deve ser importado para seu projeto junto com a pasta `templates/`. Ele gera ou atualiza arquivos de configuração do Copilot e agentes/skills do projeto.

seu projeto/
|- .github/
| |- agents/
| | |- copilot-setup.agent.md
| |- template/

Execução (passos rápidos):

- **Pré-requisitos:** ter a pasta `templates/` disponível no mesmo nível do agente e um executor de agentes (por exemplo, GitHub Copilot Chat ou runner compatível).
- **Carregar o agente:** abra o executor de agentes e selecione `Copilot Setup` (ou aponte para `agents/copilot-setup/copilot-setup.agent.md`).
- **Comandos/prompt sugeridos:**
  - "Configuração completa" - cria `copilot-instructions.md`, 7 skills padrão e o agente `code-reviewer`.
  - "Apenas skills" - gera somente as skills padrão.
  - "Criar skill `nome`" - gera uma skill específica baseada no template.
- **Verificação:** após execução, verifique a pasta `.github/` no repositório para os arquivos gerados (`copilot-instructions.md`, `agents\`, `skills/`, `templates/`).

## Fluxo de trabalho

1. Analisa `package.json` e configurações do projeto
2. Detecta framework, test runner, linter e outras ferramentas
3. Substitui templates com dados do projeto
4. Gera arquivos na pasta `.github/`

## Saída

Após execução, o projeto terá uma pasta `.github/` com:

- **copilot-instructions.md**
- `agents`(com agentes configurados)
- `skills/` (com as 7 skills padrão)
- `templates/` (referêcia dos templates usados)
