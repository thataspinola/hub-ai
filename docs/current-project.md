# Contexto da aplicação atual

Referência de leitura: main 48304b7, em 2026-10-08. Reinspecionar package.json e os arquivos reais após mudanças; versões abaixo são ranges declarados, não versões instaladas certificadas.

| Aspecto | Evidência na raiz |
| --- | --- |
| Aplicação | @porto/react-ssr-corp-hubv-painel-administrativo |
| Frontend | Next ^16.2.2, React ^19, App Router e TypeScript |
| Testes | Jest ^30.3.0, React Testing Library, __tests__/ e jest.config.ts |
| UI/estado | Tailwind ^4.2.1, Radix UI, Zustand ^5.0.12 |
| Sessão | NextAuth e provider Keycloak em src/app/api/auth/[...nextauth]/auth-options.ts |
| Feature flags | Strategy localStorage/AppConfig Agent, context/hydration e polling em src/lib/feature-flags |
| Formulários | Builder, stores e tipos em src/lib/form-wizard e src/components/wizard-builder |
| Recomendações | Stores/IndexedDB/tipos e componentes administrativos em src/lib/recommendations e src/components/portal-admin |
| Entrega | Configurações em config/ e scripts de build/postbuild no package.json; não há .gitlab-ci.yml ou Jenkinsfile versionado nesta revisão |

Preservar todo o código novo. Recursos e exemplos Node/Nest são mantidos no backend-code-reviewer; não existem neste toolkit frontend. O perfil correto da aplicação atual é nextjs, com web-quality, web-testing, security, gitlab-delivery, nextjs-patterns e react-patterns.

Copilot Setup deve inventariar src/, __tests__/ e configurações da aplicação; excluir este toolkit e seus exemplos do inventário de stack. O agente frontend já versionado na raiz continua preservado. Recursos do hub recomendam usar o runner instalado (Jest nesta aplicação), sem instalar Vitest, MSW ou Playwright apenas por constarem em orientações genéricas.

## Validação e limites

`npm --prefix tooling/web-code-reviewer run project:inspect` atualiza a leitura de stack/scripts, configuração e estado do lockfile sem escrever no consumidor. `npm --prefix tooling/web-code-reviewer run check` valida as ferramentas e os recursos do toolkit/resources/frontend. `npm test` e `npm run build` na raiz pertencem à aplicação e exigem o ambiente/dependências dela.

O package-lock.json foi recuperado integralmente da branch HPC (commit 858ba6a), sem regeneração ou troca de registry. As dependências da entrada raiz coincidem com package.json. A instalação corporativa depende do registry/certificado aprovado; a suíte e o build da aplicação devem ser executados na VDI. Não inferir que scripts declarados passaram ou que o AppConfig Agent/Keycloak real funcionaram a partir de testes do toolkit.

A integração moveu os recursos frontend para resources/frontend e os ativou em .github, com AGENTS/instructions específicos. O catálogo fica em src/data/ai-resources.json e as ferramentas ficam em tooling/web-code-reviewer. Jest/TypeScript excluem o toolkit e as fixtures frontend. Rotas, interfaces, feature flags, recomendações, formulários, sessão e infraestrutura do código novo foram preservados.

## Correção após comparação com HPC-606

Em 2026-10-08, a main 1f8aaaa estava 22 commits à frente da HPC-606/local-code-review-back-and-front (858ba6a), sem commits exclusivos na HPC. A correção preserva Dashboard, PortalSidebar, SessionProviderWrapper e FeatureFlagProvider, removendo marcadores de conflito das duas entradas do App Router. O import da rota clients usa o alias @/types/cliente. O arquivo recommendations/form-store.ts mantém o caminho como compatibilidade e reexporta a implementação completa em form-wizard/form-store.ts, sem criar uma segunda persistência/store.

O lockfile foi recuperado pelo blob b38da87389b99161c015f3bff1652c89555f205d da HPC, mantendo registry e integridades corporativos. Validação local: 110 arquivos TypeScript/TSX sem erros de sintaxe; manifest e dependências da raiz do lock coincidentes; 40 testes de ferramentas, 8 Node e 18 Nest passaram, além de typecheck/build/smoke do Nest. A análise de sintaxe não substitui o typecheck/build e a suíte da aplicação Next, pendentes na VDI com dependências corporativas.

## Melhorias 1.7.0

A página /code-reviewer agora apresenta o catálogo de recursos com seleção de perfil e busca. O painel tem lint/typecheck/check:local, E2E controlados e build/postbuild local validados. O toolkit acrescenta version/rollback e casos frontend de avaliação. Consultar [status atualizado](improvements-status.md) para ambiente, resultados e limitações externas; as evidências anteriores nesta página são históricas.
