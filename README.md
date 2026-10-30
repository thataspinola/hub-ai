# Hub AI — painel administrativo

Aplicação corporativa Next.js 16, React 19 e TypeScript para painel administrativo, clientes, feature flags, formulários dinâmicos e recomendações. O repositório **não distribui nem instala Code Reviewers**. Revisões de código usam exclusivamente o agente pessoal independente [code-reviewer-plug-and-play](https://github.com/thataspinola/code-reviewer-plug-and-play).

## Pré-requisitos

Node.js conforme `package.json`, npm, Git e acesso corporativo autorizado (VDI quando necessário). Configurar `.env.local` a partir de `.env.example` com os valores permitidos de NextAuth/Keycloak e demais integrações. Não versionar segredos nem substituir certificados/registry corporativos.

```bash
npm ci
npm run dev
```

A aplicação utiliza o prefixo `/react-ssr-corp-hubv-painel-administrativo`. Para gerar e executar o artefato standalone:

```bash
npm run build
npm start
```

Sem credenciais e serviços reais, autenticação e integrações corporativas podem não funcionar localmente.

## Qualidade e testes

```bash
npm run check:config
npm run lint
npm run typecheck
npm test -- --runInBand
npm run build
npm run test:e2e:list
```

Os testes de unidade e integração existentes utilizam Jest e React Testing Library; E2E usa Playwright. Execução real de E2E requer browsers e ambiente preparados. `npm run verify` reúne checks locais e verificação de documentação; `npm run reviewer:doctor` apenas confere a instalação pessoal do agente, sem alterar o projeto.

## Code Reviewer Plug and Play

Instale o reviewer uma única vez no perfil pessoal, seguindo [o guia de consumo](docs/global-reviewer.md). No Copilot Chat do VS Code, selecione `code-reviewer` e solicite revisão. A rota `/code-reviewer` deste painel é apenas um link informativo para o projeto independente; não hospeda catálogo, skills, CLI ou motor de revisão.

## Organização e documentação

- `src/app`: rotas e APIs do painel, autenticação, clientes, flags, formulários e recomendações
- `src/components`: componentes do painel
- `src/lib`: regras, provedores, stores e persistência
- `__tests__`: testes do aplicativo e configuração
- `tools`: automação documental, pós-build, smoke e verificação pessoal do reviewer
- `docs`: arquitetura, operação, validação, automação e integração com o reviewer externo

Consulte [arquitetura](docs/architecture.md), [guia inicial](docs/getting-started.md), [automação](docs/automation.md) e [referência gerada](docs/generated/reference.md). Alterações devem seguir Conventional Commits e atualizar `CHANGELOG.md`. CI/CD corporativo GitLab/Jenkins e serviços AWS só devem ser validados na VDI autorizada.
