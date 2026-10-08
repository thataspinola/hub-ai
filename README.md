# Hub AI — painel administrativo e Code Reviewer

O `hub-ai` reúne uma aplicação administrativa em Next.js/React e recursos reutilizáveis de revisão de código com IA. O painel possui módulos de feature flags, criação de formulários e administração de recomendações. O Code Reviewer disponibiliza agentes, skills e orientações para uso no editor, com uma CLI para instalar e atualizar esses recursos em outros projetos.

A aplicação foi inicialmente gerada pelo Tech Store. Seu nome técnico é `@porto/react-ssr-corp-hubv-painel-administrativo`.

## Aplicação e recursos de revisão

| Parte | Responsabilidade |
| --- | --- |
| Painel | Interface administrativa, sessão NextAuth/Keycloak, flags, formulários e recomendações |
| Copilot Setup | Inspecionar o projeto consumidor e adaptar suas instruções, agentes e skills |
| Code Reviewer | Revisar alterações no editor conforme a stack, contratos, segurança e testes do consumidor |
| CLI | Instalar, atualizar, diagnosticar e recuperar a configuração do reviewer |
| Exemplos Node/Nest | Validar recursos backend e cenários de testes; não são serviços implantados do painel |

A CLI não executa uma revisão com IA, não chama um modelo e não publica comentários em Merge Requests. A revisão é acionada no Copilot do editor. Não é necessária integração com GitLab, Jenkins ou registry npm para distribuir esses recursos.

## Stack e pré-requisitos

| Escopo | Tecnologias e requisitos |
| --- | --- |
| Painel | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI e Zustand |
| Autenticação | NextAuth com Keycloak |
| Testes do painel | Jest e React Testing Library |
| Runtime do painel | Node `>=20.12.2`, conforme `package.json`; confirmar a versão homologada na VDI |
| Ferramentas/reviewer | Node 22+; Git para obter fontes remotas |
| Ambiente corporativo | Registry e certificado configurados em `.npmrc`, acesso aos serviços pelo ambiente autorizado/VDI |

Versões completas e ranges estão nos manifests e lockfiles de cada escopo. Não usar Python nem adicionar arquivos `.py`. Não alterar `.env`, registry ou certificados para contornar restrições de acesso.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `src/app/` | Rotas App Router, layout, sessão e páginas administrativas |
| `src/components/` | Componentes do painel, UI e builder de formulários |
| `src/lib/feature-flags/` | Providers, storage e contratos de feature flags |
| `src/lib/form-wizard/` | Store, persistência e tipos de formulários |
| `src/lib/recommendations/` | Catálogo, regras, persistência e tipos de recomendações |
| `__tests__/` | Suíte Jest da aplicação |
| `.github/` | Agentes, skills e templates ativos do editor, instructions e lock do reviewer |
| `resources/frontend/` | Fontes reutilizáveis dos recursos e perfis frontend |
| `codigo-a-ser-transcrito/` | Recursos backend Node, ferramentas compartilhadas e exemplo JavaScript |
| `examples/nest-backend/` | Exemplo independente TypeScript/Nest, com testes próprios |
| `tools/code-reviewer.cjs` | CLI de distribuição do reviewer |
| `src/data/ai-resources.json` | Catálogo gerado dos recursos de IA, consumido pela página `/code-reviewer` |
| `docs/` | Documentação do projeto, revisão, configuração e evidências |
| `config/`, `pom.xml` | Configuração e infraestrutura corporativa existentes |

React, Next.js e os exemplos TypeScript ficam fora de `codigo-a-ser-transcrito`. Os scripts JavaScript compartilhados continuam reconhecendo stacks frontend. TypeScript e Jest do painel excluem o toolkit e o exemplo Nest para manter as validações independentes.

## Configurar e executar o painel

Executar a partir da raiz, no ambiente com acesso corporativo aprovado:

```sh
npm ci
npm run dev
```

Abrir `http://localhost:3000/react-ssr-corp-hubv-painel-administrativo`.

O lockfile corporativo foi recuperado da branch HPC e deve ser preservado. A autenticação, APIs e AppConfig exigem as configurações reais do ambiente; consultar a equipe responsável para provisioná-las, sem inserir credenciais no repositório. Os nomes de variáveis e a integração existente estão em `node-env.d.ts`, `config/` e no código de sessão/providers.

| Comando na raiz | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build Next e execução do `postbuild` declarado |
| `npm start` | Servidor Node da saída standalone, após build/postbuild |
| `npm test` | Suíte Jest, com cobertura configurada em `jest.config.ts` |
| `npm run test:watch` | Testes em modo watch |
| `npm run lint` / `npm run typecheck` | ESLint e verificação TypeScript |
| `npm run check:local` | Configuração, lint, typecheck e Jest |
| `npm run test:standalone` | Smoke HTTP local da página e de um asset após build |
| `npm run test:e2e` | Jornadas Playwright em localhost, com rede externa bloqueada |

Saída standalone, `distDir` e `basePath` são definidos em `next.config.ts`; o passo de cópia dos artefatos está em `package.json`. Build e postbuild foram validados localmente. O lint usa `eslint . --max-warnings=0` com flat config. Entrega e integrações corporativas continuam exigindo validação autorizada.

## Usar o Code Reviewer neste projeto

Os recursos do perfil `nextjs` já estão instalados em `.github`. Esse perfil inclui orientações React/Next.js, qualidade, testes web, segurança e entrega. As regras específicas do painel estão em [AGENTS.md](AGENTS.md), [agent.md](agent.md) e `.github/copilot-instructions.md`.

1. Abrir o projeto no editor com Copilot e confirmar que os agentes/skills foram carregados.
2. Selecionar **Copilot Setup** para revisar/adaptar as instruções ao projeto real, quando necessário.
3. Selecionar **Web Code Reviewer** e informar o escopo: alterações locais, arquivos ou comparação entre branches/commits.
4. Revisar os achados e suas evidências, executar os testes aplicáveis e registrar pendências.

Exemplo de solicitação ao agente:

> Revise as alterações locais em relação à base indicada. Priorize erros funcionais, segurança, contratos e testes. Informe arquivo, localização, impacto e evidência de cada achado. Separe problemas confirmados das hipóteses e das validações pendentes.

O agente frontend já existente é preservado. O diagnóstico pode apontá-lo como não gerenciado; isso não autoriza excluí-lo. A presença de `.github` atende ao formato do editor e não define o provedor do pipeline.

## Instalar em outros projetos sem copiar pastas

Manter um checkout do `hub-ai` em uma única pasta de ferramentas, fora dos projetos consumidores. Não é necessário instalar dependências npm para executar a CLI.

```sh
git clone https://github.com/thataspinola/hub-ai.git /caminho/ferramentas/hub-ai
cd /caminho/ferramentas/hub-ai
node tools/code-reviewer.cjs help
```

Com o checkout limpo e a versão revisada/aprovada, registrar seu SHA completo. O comando abaixo fixa essa revisão (não segue a branch automaticamente). Substituir `/caminho/aplicacao` pelo projeto consumidor:

```sh
HUB_AI_REVIEWER_REF="$(git rev-parse HEAD)"
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --ref "$HUB_AI_REVIEWER_REF" --dry-run
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --ref "$HUB_AI_REVIEWER_REF"
node tools/code-reviewer.cjs doctor --project /caminho/aplicacao --ref "$HUB_AI_REVIEWER_REF"
```

| Comando/opção | Comportamento |
| --- | --- |
| `setup` | Instala recursos; identifica automaticamente a stack |
| `update` | Exige instalação anterior; mantém perfil/capacidades e atualiza recursos gerenciados intactos |
| `doctor` | Aponta inconsistências e pendências da instalação |
| `rollback` | Retorna à fonte anterior indicada, preservando personalizações |
| `version` | Mostra a versão local do toolkit |
| `recover` | Recupera uma transação interrompida após o processo anterior terminar |
| `--ref` | SHA completo e imutável da fonte; não aceita branch/tag |
| `--dry-run` | Mostra o plano sem escrever no projeto consumidor |
| `--source` | Usa um checkout local aprovado em vez de obter uma fonte remota |
| `--profile` | Seleciona explicitamente `react`, `nextjs`, `angular`, `vue`, `node` ou `frontend` |

Para atualizar, escolher e revisar um novo SHA, executar `update` primeiro com `--dry-run` e depois aplicar. Não há atualização automática para `main`. Os recursos obtidos ficam em cache por URL+SHA e podem ser reutilizados offline.

Modo local/offline:

```sh
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --source /caminho/ferramentas/hub-ai --dry-run
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --source /caminho/ferramentas/hub-ai
```

Nesse modo, o conteúdo local é usado inclusive se houver mudanças não commitadas; manter o checkout limpo e registrar seu SHA para reprodução. A CLI preserva código, CI e instruções específicas do consumidor. Personalizações nos recursos selecionados bloqueiam sobrescritas; usar `--overwrite` somente após revisar o preview e guardar as alterações locais. O estado fica em `.github/hub-ai-lock.json`.

TypeScript utiliza o perfil do framework; não é um perfil independente. Pacotes com frontend e backend misturados exigem escopo/perfil explícito. Depois da instalação, configurar as instruções com Copilot Setup e acionar o reviewer correspondente no editor.

## Validar as ferramentas e exemplos

As dependências destes escopos são separadas das dependências do painel. Instalar com o registry/ambiente aprovado:

```sh
npm ci --prefix codigo-a-ser-transcrito --ignore-scripts --no-audit --no-fund
npm ci --prefix examples/nest-backend --ignore-scripts --no-audit --no-fund
npm --prefix codigo-a-ser-transcrito run check
```

`check` valida os recursos e executa testes das ferramentas, do exemplo Node e do exemplo Nest, incluindo typecheck/build/smoke do Nest. Comandos adicionais:

```sh
npm --prefix examples/nest-backend run test:cov
npm --prefix codigo-a-ser-transcrito run project:inspect
npm --prefix codigo-a-ser-transcrito run catalog:export
```

O export do catálogo atualiza `src/data/ai-resources.json`. Os E2E Nest usam HTTP local e serviços/adapters controlados; não comprovam integração com AWS, Keycloak, Dynamics ou serviços corporativos reais.

## Evidências e pendências

A versão atual inclui toolkit 1.7.0, catálogo navegável, CLI version/rollback, checks de entrega e E2E controlados. Consulte [validação local](docs/local-validation.md) e [status das melhorias](docs/improvements-status.md) para a matriz de resultados e ambiente utilizado. Os testes locais não comprovam Keycloak, AppConfig, provisionamento, AWS, editor Copilot ou deploy na VDI.

## Documentação complementar

- [Validação local sem VDI](docs/local-validation.md)
- [Status das melhorias e pendências externas](docs/improvements-status.md)
- [Avaliação do reviewer](docs/reviewer-evaluation.md)

- [Contexto e correções da aplicação](docs/current-project.md)
- [Recursos de IA integrados ao painel](docs/ai-toolkit.md)
- [CLI: instalação, atualização, cache e recuperação](docs/code-reviewer-cli.md)
- [Copilot Setup](docs/copilot-setup.md)
- [Revisão do painel](docs/code-review.md)
- [Estrutura e nomenclatura](docs/structure-and-naming.md)
- [Evidências de validação](docs/validation-current.md)
- [Toolkit backend e ferramentas compartilhadas](codigo-a-ser-transcrito/README.md)
- [Exemplo Nest e sua suíte](examples/nest-backend/README.md)
