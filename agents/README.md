# Agents

Este diretório contém os agentes reutilizáveis do hub ai. Cada agente possui sua própria documentação em uma subpasta.

## Agentes disponíveis

- **[code-reviewer](code-reviewer/README.md)** - Especialista em análise e revisão de código para React/Next.js
- **[copilot-setup](copilot-setup/README.md)** - Ferramenta de bootstrap para configurar Copilot em novos projetos

## Estrutura de um agente neste projeto

Cada agente é composto por:

- `{nome}/` - Pasta do agente
- `{nome}.agent.md` - Arquivo de configuração do agente (lido pelo Copilot)
- `README.md` - Documentação para referência

## Adicionando novos agentes

Para criar um novo agente:

1. Crie uma pasta `{nome}/`
2. Crie um arquivo `{nome}.agent.md`com a configuração do agente
3. Crie um arquivo `README.md` descrevendo o agente
4. Atualize esse `README.md` com o novo agente na lista

## Notas

- Os arquivos `.agent.md` estão dentro de suas pastas para melhor organização
- O arquivo `README.md` em cada pasta é para documentaçao e referência
