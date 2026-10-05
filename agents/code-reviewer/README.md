# code-reviewer

Agente especialista em revisão de código para aplicações React/Next.js com TypeScript.

## Propósito

O `code-reviewer` é um agente de revisão de código que analisa solicitações de pull e arquivos de código, identificando problemas relacionados a:

- **Qualidade de código** - lint, types, clean code
- **Padrões** - estrutura de pastas, convenções de nomenclatura
- **Segurança** - validação, headers, criptografia
- **Performance** - memorização, re-renders, caching
- **Acessibilidade** - ARIA, semântica, WCAG
- **Testes** - cobertura, mocks, patterns

## Como usar

Usar este agente quando precisar revisar o código, analisar merge requests ou identificar problemas de qualidade e segurança.

Execução (passos rápidos):

- **Pré-requisitos:** estar no repositório alvo, ter `git` instalado e um executor de agentes (por exemplo, GitHub Copilot Chat ou outro runner que suporte agentes do projeto).
- **Carregar o agente:** abra o seu executor de agentes e escolha o agente `Code Reviewer` (ou aponte para `.github/agents/code-reviewer.agent.md`).
- **Fornecer alvo:** informe ao agente o que revisar - arquivo, pasta, branch or PR. Exemplos de prompts:
  - "Revise o arquivo src/components/Button.tsx"
  - "Analise a branch feature/x em relação ao main"
  - "Revise o MR !123"
- **Resultado:** o agente analisa os diffs e arquivos relevantes e gera `CODE_REVIEW.md` na raiz do projeto com o relatório completo.

## Recursos

Este agente utiliza as **skills** disponíveis no projeto para análise detalhada em cada aspecto. Consulte a documentação de skills para entender cada uma delas.

## Saída

O agente gera um arquivo `CODE_REVIEW.md` na raiz do projeto com o resultado da análise.

