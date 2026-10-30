# Comece aqui — Hub AI

O hub-ai é um painel administrativo Next.js/React. Requer Node.js, Git, dependências e acesso aos serviços corporativos autorizados.

```bash
git clone https://github.com/thataspinola/hub-ai.git
cd hub-ai
cp .env.example .env.local
npm ci
npm run dev
```

Configure as variáveis permitidas de NextAuth/Keycloak em `.env.local`; não versione segredos. A aplicação usa o prefixo `/react-ssr-corp-hubv-painel-administrativo`.

Valide com `npm run check:config`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand` e `npm run build`. E2E exige ambiente e browsers preparados.

Para revisar o código, siga [o guia de integração com Code Reviewer Plug and Play](global-reviewer.md). Nenhum reviewer é distribuído ou instalado por este projeto.
