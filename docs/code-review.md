# Revisão do painel

**Caminho recomendado para novas revisões:** agente pessoal `code-reviewer` do repositório [code-reviewer-plug-and-play](https://github.com/thataspinola/code-reviewer-plug-and-play). Instalar uma vez, fora dos consumidores; consultar [o guia de adoção](global-reviewer.md). No hub-ai executar `npm run reviewer:doctor` para conferir a presença local do agente e skills. No Copilot Chat selecionar `code-reviewer` e pedir revisão do diff real contra a base escolhida.

**Compatibilidade legada:** o Web Code Reviewer em `.github/agents/web-code-reviewer.agent.md` e os recursos em `resources/frontend` continuam disponíveis para instalações existentes; não precisam ser removidos ou sobrescritos. O agente central cobre Next.js/React do painel e também backends de outros consumidores.

Preservar código, autenticação NextAuth/Keycloak, AGENTS locais, testes e CI. Não acessar sistemas corporativos fora da VDI. Relatar achados por arquivo/linha e separar testes efetivamente executados de hipóteses. O doctor não substitui a homologação no editor.
