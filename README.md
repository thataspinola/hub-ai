# Hub AI — painel administrativo

Aplicação corporativa Next.js/React/TypeScript com autenticação NextAuth/Keycloak, clientes, feature flags, formulários dinâmicos e recomendações.

## Executar

Requer Node.js e npm conforme `package.json`, além de acesso aos serviços corporativos autorizados. Configure variáveis em `.env.local` a partir de `.env.example`, sem versionar credenciais.

```bash
npm ci
npm run dev
```

O basePath da aplicação é `/react-ssr-corp-hubv-painel-administrativo`. Para entrega standalone:

```bash
npm run build
npm start
```

O pós-build em `scripts/postbuild.cjs` prepara os assets do servidor standalone; `npm run test:standalone` verifica a rota e os assets localmente.

## Validar

```bash
npm run check:config
npm run lint
npm run typecheck
npm test -- --runInBand
npm run build
npm run test:e2e:list
```

Testes da aplicação usam Jest/React Testing Library e Playwright para E2E. O acesso corporativo depende da VDI autorizada. Não interpretar scripts declarados como testes já executados.

## Revisão de código

O hub-ai usa o agente pessoal independente [Code Reviewer Plug and Play](https://github.com/thataspinola/code-reviewer-plug-and-play). A instalação e atualização acontecem **no projeto do reviewer**, fora deste repositório. A rota `/code-reviewer` é apenas informativa. Consulte [o guia de uso](docs/global-reviewer.md).

## Estrutura

- `src/`: rotas, componentes, contratos, stores e serviços do painel
- `__tests__/`: testes de unidade, integração, configuração e E2E
- `scripts/`: pós-build e teste de inicialização standalone do painel
- `config/`: configuração de entrega
- `docs/architecture.md`: arquitetura e contratos
- `docs/getting-started.md`: instalação e execução
- `docs/global-reviewer.md`: uso do reviewer externo

Alterações seguem Conventional Commits e atualizam `CHANGELOG.md` quando necessário. CI/CD corporativo permanece sob GitLab/Jenkins.
