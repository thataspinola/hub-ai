# Hub AI — painel administrativo e Code Reviewer

O `hub-ai` reúne uma aplicação administrativa em Next.js/React e recursos reutilizáveis de revisão de código com IA. O painel possui módulos de feature flags, criação de formulários e administração de recomendações. O Code Reviewer disponibiliza agentes, skills e orientações para uso no editor, com uma CLI para instalar e atualizar esses recursos em outros projetos.

A aplicação foi inicialmente gerada pelo Tech Store. Seu nome técnico é `@porto/react-ssr-corp-hubv-painel-administrativo`.

## Aplicação e recursos de revisão

| Parte         | Responsabilidade                                                                           |
| ------------- | ------------------------------------------------------------------------------------------ |
| Painel        | Interface administrativa, sessão NextAuth/Keycloak, flags, formulários e recomendações     |
| Copilot Setup | Inspecionar o projeto consumidor e adaptar suas instruções, agentes e skills               |
| Code Reviewer | Revisar alterações no editor conforme a stack, contratos, segurança e testes do consumidor |
| CLI           | Instalar, atualizar, diagnosticar e recuperar a configuração do reviewer                   |

A CLI não executa uma revisão com IA, não chama um modelo e não publica comentários em Merge Requests. A revisão é acionada no Copilot do editor. Não é necessária integração com GitLab, Jenkins ou registry npm para distribuir esses recursos.

## Stack e pré-requisitos

| Escopo               | Tecnologias e requisitos                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Painel               | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI e Zustand                              |
| Autenticação         | NextAuth com Keycloak                                                                             |
| Testes do painel     | Jest e React Testing Library                                                                      |
| Runtime do painel    | Node `>=20.12.2`, conforme `package.json`; confirmar a versão homologada na VDI                   |
| Ferramentas/reviewer | Node 22+; Git para obter fontes remotas                                                           |
| Ambiente corporativo | Registry e certificado configurados em `.npmrc`, acesso aos serviços pelo ambiente autorizado/VDI |

Versões completas e ranges estão nos manifests e lockfiles de cada escopo. Não usar Python nem adicionar arquivos `.py`. Não alterar `.env`, registry ou certificados para contornar restrições de acesso.

## Estrutura

| Caminho                      | Conteúdo                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `src/app/`                   | Rotas App Router, layout, sessão e páginas administrativas                    |
| `src/components/`            | Componentes do painel, UI e builder de formulários                            |
| `src/lib/feature-flags/`     | Providers, storage e contratos de feature flags                               |
| `src/lib/form-wizard/`       | Store, persistência e tipos de formulários                                    |
| `src/lib/recommendations/`   | Catálogo, regras, persistência e tipos de recomendações                       |
| `__tests__/`                 | Suíte Jest da aplicação                                                       |
| `.github/`                   | Agentes, skills e templates ativos do editor, instructions e lock do reviewer |
| `resources/frontend/`        | Fontes reutilizáveis dos recursos e perfis frontend                           |
| `tooling/web-code-reviewer/` | Instalação, diagnóstico, validação e avaliação frontend                       |
| `tools/code-reviewer.cjs`    | CLI de distribuição do reviewer                                               |
| `src/data/ai-resources.json` | Catálogo gerado dos recursos de IA, consumido pela página `/code-reviewer`    |
| `docs/`                      | Documentação do projeto, revisão, configuração e evidências                   |
| `config/`                    | Configuração e infraestrutura corporativa existentes                          |

Os recursos frontend ficam em resources/frontend; ferramentas JavaScript ficam em tooling/web-code-reviewer. TypeScript/Jest do painel excluem ferramentas e fixtures. Backend Node/Nest fica no projeto backend-code-reviewer.

### Nomenclatura e limites dos escopos

Recursos novos usam kebab-case: `papel.agent.md`, `escopo-documento.template.md` e `nome/SKILL.md`. Os nomes convencionais `README.md`, `CHANGELOG.md`, `VERSION`, `AGENTS.md` e `SKILL.md` são mantidos. Esse padrão não exige renomear componentes, rotas, testes ou agentes existentes.

O painel, o toolkit e o exemplo Nest têm manifests e dependências próprios. As fontes frontend pertencem a `resources/frontend/`; cenários sintéticos de avaliação não devem ser importados ou implantados pela aplicação.

## Configurar e executar o painel

Executar a partir da raiz, no ambiente com acesso corporativo aprovado:

```sh
npm ci
npm run dev
```

Abrir `http://localhost:3000/react-ssr-corp-hubv-painel-administrativo`.

O lockfile corporativo foi recuperado da branch HPC e deve ser preservado. A autenticação, APIs e AppConfig exigem as configurações reais do ambiente; consultar a equipe responsável para provisioná-las, sem inserir credenciais no repositório. Os nomes de variáveis e a integração existente estão em `node-env.d.ts`, `config/` e no código de sessão/providers.

| Comando na raiz                      | Finalidade                                                   |
| ------------------------------------ | ------------------------------------------------------------ |
| `npm run dev`                        | Servidor de desenvolvimento                                  |
| `npm run build`                      | Build Next e execução do `postbuild` declarado               |
| `npm start`                          | Servidor Node da saída standalone, após build/postbuild      |
| `npm test`                           | Suíte Jest, com cobertura configurada em `jest.config.ts`    |
| `npm run test:watch`                 | Testes em modo watch                                         |
| `npm run lint` / `npm run typecheck` | ESLint e verificação TypeScript                              |
| `npm run check:local`                | Configuração, lint, typecheck e Jest                         |
| `npm run test:standalone`            | Smoke HTTP local da página e de um asset após build          |
| `npm run test:e2e`                   | Jornadas Playwright em localhost, com rede externa bloqueada |

Saída standalone, `distDir` e `basePath` são definidos em `next.config.ts`; o passo de cópia dos artefatos está em `package.json`. Build e postbuild foram validados localmente. O lint usa `eslint . --max-warnings=0` com flat config. Entrega e integrações corporativas continuam exigindo validação autorizada.

### Build e configuração de entrega

O `build` produz `dist/react-ssr-corp-hubv-painel-administrativo/`. O `postbuild` em `tools/postbuild.cjs` copia `static` e `public` para a saída standalone; `npm start` executa seu `standalone/server.js`. Depois do build, `npm run test:standalone` verifica por HTTP local uma página e um asset.

Os pares `config/values_dev`, `values_hml` e `values_prd` nas extensões `.yaml`/`.yml` têm conteúdo equivalente, verificado pelos checks. Preservam o namespace `corp-hubv`, o basePath do painel e `ingress.enabled`. O processo corporativo deve injetar `NEXTAUTH_SECRET` e `KEYCLOAK_CLIENT_SECRET`; os manifests não contêm valores dessas credenciais. Se credenciais históricas foram utilizadas, sua rotação cabe aos responsáveis no ambiente autorizado; remover o valor atual não apaga o histórico Git.

### Testes E2E locais

Após instalar as dependências no ambiente aprovado:

```sh
npm run test:e2e:install
npm run test:e2e:list
npm run test:e2e
```

Playwright inicia uma instância nova em `127.0.0.1:3100`, com o basePath real. Cada teste usa contexto limpo, bloqueia service workers e requisições a outros hosts/portas e intercepta a sessão como anônima. Não há bypass de autenticação no código da aplicação. As quatro jornadas cobrem catálogo/perfis do reviewer, flags, criação/persistência de formulário e recomendações.

A execução padrão inclui quatro projetos, com as mesmas jornadas:

| Projeto | Navegador/motor | Comando individual |
| --- | --- | --- |
| webkit | WebKit do Playwright, perfil Desktop Safari | npm run test:e2e:webkit |
| firefox | Firefox compatível distribuído pelo Playwright | npm run test:e2e:firefox |
| chrome | Google Chrome instalado, canal chrome | npm run test:e2e:chrome |
| edge | Microsoft Edge instalado, canal msedge | npm run test:e2e:edge |

WebKit não roda dentro dos outros navegadores. Chrome e Edge usam seus próprios canais Chromium; Firefox usa seu motor. Playwright não automatiza o aplicativo Safari instalado: o projeto webkit testa seu motor compatível, sem certificar Safari real. Se a homologação exigir Safari real, será necessária uma execução separada em ambiente Apple com ferramenta compatível.

npm run test:e2e:install instala apenas WebKit e Firefox compatíveis com a versão fixada do Playwright. Chrome e Edge devem estar instalados e aprovados no ambiente; quando necessário, provisioná-los pelo processo autorizado. O comando npx playwright install chrome msedge altera instalações de navegadores e não faz parte da preparação automática deste projeto. Em Linux, dependências de sistema podem exigir npx playwright install-deps webkit firefox pelo processo autorizado. A variável HUB_AI_E2E_CHROMIUM_PATH não é utilizada.

Não versionar caminhos da máquina ou credenciais em `.env`, nem apontar esses casos locais para um ambiente real. As jornadas controladas não validam autorização ou integrações corporativas.

## Usar o Code Reviewer neste projeto

Os recursos do perfil `nextjs` já estão instalados em `.github`. Esse perfil inclui orientações React/Next.js, qualidade, testes web, segurança e entrega. As regras específicas do painel estão em [AGENTS.md](AGENTS.md), [agent.md](agent.md) e `.github/copilot-instructions.md`.

1. Abrir o projeto no editor com Copilot e confirmar que os agentes/skills foram carregados.
2. Selecionar **Copilot Setup** para revisar/adaptar as instruções ao projeto real, quando necessário.
3. Selecionar **Web Code Reviewer** e informar o escopo: alterações locais, arquivos ou comparação entre branches/commits.
4. Revisar os achados e suas evidências, executar os testes aplicáveis e registrar pendências.

No **Copilot Setup**, solicitar `full setup`, `instructions`, `AGENTS`, `skills` ou `agent <nome>`. O agente deve inspecionar o código e os testes reais antes de escrever regras, excluir toolkit/exemplos do inventário da aplicação e preservar customizações. Neste painel, usar Jest/React Testing Library; orientações genéricas não autorizam instalar outros runners ou pipelines automaticamente.

O **Web Code Reviewer** considera diff/base reais, arquivos completos, fronteiras server/client, contratos, segurança e testes existentes. O relatório padrão é `web-code-review.md`, salvo caminho solicitado pelo usuário.

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

| Comando/opção | Comportamento                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------- |
| `setup`       | Instala recursos; identifica automaticamente a stack                                          |
| `update`      | Exige instalação anterior; mantém perfil/capacidades e atualiza recursos gerenciados intactos |
| `doctor`      | Aponta inconsistências e pendências da instalação                                             |
| `rollback`    | Retorna à fonte anterior indicada, preservando personalizações                                |
| `version`     | Mostra a versão local do toolkit                                                              |
| `recover`     | Recupera uma transação interrompida após o processo anterior terminar                         |
| `--ref`       | SHA completo e imutável da fonte; não aceita branch/tag                                       |
| `--dry-run`   | Mostra o plano sem escrever no projeto consumidor                                             |
| `--source`    | Usa um checkout local aprovado em vez de obter uma fonte remota                               |
| `--profile`   | Seleciona explicitamente `react`, `nextjs`, `angular`, `vue` ou `frontend`                    |

### Perfis e seleção do agente

| Projeto consumidor                   | Perfil     | Reviewer               |
| ------------------------------------ | ---------- | ---------------------- |
| Next.js, incluindo componentes React | `nextjs`   | Web Code Reviewer      |
| React                                | `react`    | Web Code Reviewer      |
| Angular                              | `angular`  | Web Code Reviewer      |
| Vue                                  | `vue`      | Web Code Reviewer      |
| Frontend legado                      | `frontend` | Frontend Code Reviewer |

A detecção automática prioriza Next.js sobre React. TypeScript acompanha o framework. Em monorepos, apontar `--project` para o pacote consumidor e selecionar o perfil explicitamente quando necessário. `--capabilities base` instala o conjunto base; outros conjuntos usam nomes do manifesto separados por vírgulas.

### Atualizar, voltar uma versão e recuperar

Escolher um novo SHA completo e revisado. Substituir os valores abaixo pelos SHAs reais:

```sh
HUB_AI_NEW_REF=SHA_COMPLETO_DA_NOVA_VERSAO
node tools/code-reviewer.cjs update --project /caminho/aplicacao --ref "$HUB_AI_NEW_REF" --dry-run
node tools/code-reviewer.cjs update --project /caminho/aplicacao --ref "$HUB_AI_NEW_REF"
node tools/code-reviewer.cjs doctor --project /caminho/aplicacao --ref "$HUB_AI_NEW_REF"
node tools/code-reviewer.cjs version
```

Não há atualização automática para `main`. `update` mantém perfil/capacidades e verifica checksums: conflitos bloqueiam a operação antes de sobrescrever personalizações. A migração remove apenas recursos gerenciados antigos que continuem intactos. Código, CI, `AGENTS.md` e instructions específicos são preservados.

Para voltar a uma fonte anterior compatível, usar a CLI atual e revisar o plano:

```sh
HUB_AI_PREVIOUS_REF=SHA_COMPLETO_DA_VERSAO_ANTERIOR
node tools/code-reviewer.cjs rollback --project /caminho/aplicacao --ref "$HUB_AI_PREVIOUS_REF" --dry-run
node tools/code-reviewer.cjs rollback --project /caminho/aplicacao --ref "$HUB_AI_PREVIOUS_REF"
```

O rollback exige estado de instalação e uma fonte compatível (1.6+), aplica as proteções de atualização e não restaura o Git do consumidor. Perfis/capacidades ausentes na fonte escolhida causam falha antes das escritas.

Em uma transação interrompida, inspecionar o diagnóstico e confirmar que o processo anterior terminou antes de recuperar:

```sh
node tools/code-reviewer.cjs recover --project /caminho/aplicacao --ref "$HUB_AI_NEW_REF"
node tools/code-reviewer.cjs doctor --project /caminho/aplicacao --ref "$HUB_AI_NEW_REF"
```

### Cache e uso offline

Fontes remotas ficam em `~/.cache/hub-ai-code-reviewer`, separadas por URL+SHA; `--cache /caminho/cache` muda o local. Uma revisão já obtida pode ser reutilizada offline. Cache alterado é recusado: usar uma pasta nova e obter novamente a fonte aprovada. `--repo` permite uma origem alternativa confiável com SHA fixo; a fonte contém código executável. Usar a autenticação Git existente, sem tokens na URL.

Modo local/offline:

```sh
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --source /caminho/ferramentas/hub-ai --dry-run
node tools/code-reviewer.cjs setup --project /caminho/aplicacao --source /caminho/ferramentas/hub-ai
```

Nesse modo, o conteúdo local é usado inclusive se houver mudanças não commitadas; manter o checkout limpo e registrar seu SHA para reprodução. A CLI preserva código, CI e instruções específicas do consumidor. Personalizações nos recursos selecionados bloqueiam sobrescritas; usar `--overwrite` somente após revisar o preview e guardar as alterações locais. O estado fica em `.github/hub-ai-lock.json`.

TypeScript utiliza o perfil do framework; não é um perfil independente. Pacotes com frontend e backend misturados exigem escopo/perfil explícito. Depois da instalação, configurar as instruções com Copilot Setup e acionar o reviewer correspondente no editor.

## Validar as ferramentas

As dependências destes escopos são separadas das dependências do painel. Instalar com o registry/ambiente aprovado:

```sh
npm ci --prefix tooling/web-code-reviewer --ignore-scripts --no-audit --no-fund
npm --prefix tooling/web-code-reviewer run check
```

`check` valida recursos frontend e executa os testes das ferramentas. A aplicação usa check:local, build, test:standalone e test:e2e separadamente. Comandos adicionais:

```sh
npm --prefix tooling/web-code-reviewer run project:inspect
npm --prefix tooling/web-code-reviewer run catalog:export
```

O export do catálogo atualiza `src/data/ai-resources.json`. Os testes locais não comprovam integração com Keycloak, AppConfig ou serviços corporativos.

## Avaliar a qualidade do reviewer

Os casos frontend ficam em `resources/frontend/evaluations/review/` e `clean/`. São fixtures sintéticas, separadas da aplicação.

1. Fixar o SHA dos recursos e registrar editor, modelo e data.
2. Apresentar cada caso separadamente ao reviewer, com o mesmo prompt, sem mostrar rubrica, erros esperados ou relatórios anteriores.
3. Salvar o relatório bruto, sem editar achados, em `tooling/web-code-reviewer/evaluations/results/`.
4. Um **avaliador humano** relaciona achados ao código, identifica falsos positivos e preenche a adjudicação.
5. Executar a pontuação e registrar também os problemas omitidos.

```sh
node tools/evaluate-reviewer.cjs list
node tools/evaluate-reviewer.cjs score /caminho/adjudicacao.json
```

Exemplo de estrutura; preencher com a avaliação real:

```json
{
  "scenario": "frontend-review",
  "matched_expected": [],
  "false_positives": 0,
  "adjudicator": "NOME_DO_AVALIADOR",
  "raw_report": "evaluations/results/frontend-review.raw.md"
}
```

Os cenários `frontend-review`, `frontend-clean` usam a rubrica em `tooling/web-code-reviewer/evaluations/rubric.json`. O script exige relatório bruto existente dentro do toolkit e rejeita IDs desconhecidos. Recall mede os problemas esperados encontrados; precision considera os acertos e falsos positivos; omissões registram problemas esperados não encontrados. Métricas sem denominador são `null`, inclusive em um caso limpo sem achados.

Testar o cálculo das métricas não certifica a qualidade semântica do modelo. A nova avaliação frontend no editor está pendente; avaliações backend pertencem ao backend-code-reviewer.

## Evidências e pendências

Resultados históricos locais da versão 1.8.0, em Node 24.19.0/Linux, registrados em 2026-10-09:

| Validação                                 | Resultado                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| Jest do painel                            | 384 testes, 41 suítes passaram                                                          |
| Configuração e postbuild                  | 2 testes passaram                                                                       |
| ESLint e typecheck do painel              | Passaram, sem warnings no lint                                                          |
| Build e postbuild do painel               | Passaram                                                                                |
| Smoke standalone                          | Página e asset responderam por HTTP local                                               |
| E2E Playwright                            | Reexecução bloqueada: Chromium não disponível; 4 jornadas passaram na execução anterior |
| Ferramentas do toolkit                    | 43 testes passaram                                                                      |
| Exemplo Node                              | 8 testes passaram                                                                       |
| Exemplo Nest                              | 18 testes; typecheck/build/smoke passaram                                               |
| Audit público de dependências de produção | Histórico anterior: nenhuma vulnerabilidade reportada; não repetido nesta rodada        |

A validação usou dependências públicas isoladas, preservando registry/certificado corporativos. O download padrão do Chromium falhou nesse ambiente; na execução anterior, os E2E passaram com Chromium 153 alternativo. Na reexecução atual esse executável não está disponível, portanto os quatro casos não puderam iniciar. A combinação validada de lint foi ESLint 9.39.4 com eslint-config-next 16.2.2; ESLint 10 apresentou incompatibilidade com plugins. Atualizar essas dependências em conjunto e validar antes de adotar.

Continuam pendentes, fora deste ambiente:

- Descoberta/execução efetiva dos agentes no editor e avaliação semântica com relatório bruto/adjudicação humana.
- Instalação pelo mirror corporativo, certificado e disponibilidade do WebKit e suas dependências aprovadas.
- Keycloak, AppConfig, APIs, AWS, credenciais e autorização reais.
- Provisionamento, compatibilidade do chart/pipeline e deploy pelo processo corporativo existente.
- Rotação de eventuais credenciais históricas utilizadas, pelos responsáveis.

Mocks, testes locais e audit não certificam integrações ou produção. Não foi realizado acesso à VDI. Os documentos de contexto/validação anteriores mantêm evidências históricas; para resultados atuais, usar esta matriz e o [status das melhorias](docs/improvements-status.md).

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
- [Ferramentas do Web Code Reviewer](tooling/web-code-reviewer/README.md)

## Autenticação, flags e persistência

Em produção, páginas administrativas e APIs exigem autenticação; o catálogo `/code-reviewer`, assets e endpoints de autenticação permanecem públicos. Desenvolvimento mantém o fluxo local; `HUB_AI_REQUIRE_AUTH=true` habilita a proteção também nesse ambiente. `NEXTAUTH_SECRET` é obrigatório para a proteção. `HUB_AI_ADMIN_ROLE`, quando definido, exige a role configurada, extraída das claims realm_access/resource_access do perfil Keycloak. Sem essa configuração, acesso administrativo exige sessão válida; homologar o contrato de roles antes de disponibilizar dados restritos.

O refresh usa o issuer/client ID/client secret existentes, renova antes do vencimento e mantém refresh token no servidor. Falha elimina acesso utilizável e pede novo login. Chamadas concorrentes são agrupadas por processo; a rotação em múltiplas instâncias exige validação específica. Logout usa POST, valida Origin, limita timeout e reporta falha do provedor; a sessão local é encerrada mesmo quando o provedor falha.

`FEATURE_FLAGS_PROVIDER` aceita `localStorage` (padrão) ou `appconfig`. Para AppConfig, configurar `APPCONFIG_APPLICATION_ID`, `APPCONFIG_ENVIRONMENT_ID` e `APPCONFIG_CONFIGURATION_PROFILE_ID`; `APPCONFIG_AGENT_ENDPOINT` é opcional. Somente o servidor acessa o agent; o browser usa `/api/feature-flags` no basePath, com autenticação administrativa e sem cache HTTP. Configuração inválida ou resposta malformada é recusada. Nenhum arquivo de credenciais foi alterado.

Formulários/importações e dados persistidos passam por validação estrutural. Falhas de armazenamento aparecem na interface; o índice não sobrescreve conteúdo corrompido e uma falha de gravação tenta restaurar o documento anterior. IndexedDB confirma sucesso apenas após o commit da transação e trata abortos. localStorage não oferece transações entre chaves: preservar backup e validar quotas/recuperação no ambiente real.

Os toolkits reconhecem seus estados separados e impedem sobrescrita de recursos do outro. O Setup backend usa nome próprio. Journals de recuperação não podem apontar para código da aplicação.

## Divisão atual dos projetos (2.0.0)

O hub-ai mantém o painel e a revisão frontend. Perfil Node, skills/agente backend, exemplos Node/Nest e avaliações backend foram retirados deste checkout. APIs/BFFs, Node vanilla, NestJS, Lambda e eventos são cobertos pelo [backend-code-reviewer](https://github.com/thataspinola/backend-code-reviewer).

A antiga pasta codigo-a-ser-transcrito foi eliminada; ferramentas necessárias ficam em tooling/web-code-reviewer. Instalações frontend mantêm os mesmos destinos e estado. Instalações backend antigas são recusadas sem alteração automática. Consultar [migração](docs/reviewer-migration.md) e [estrutura](docs/structure-and-naming.md). Use uma revisão 2.0.0 aprovada para novos setups; os números 1.8.0 acima são históricos.

## Limpeza de escopo — 2026-10-13 (2.0.0)

Removidos perfil/agente/skills/templates backend, exemplos Node/Nest e avaliações Node. Ferramentas necessárias movidas para tooling/web-code-reviewer; codigo-a-ser-transcrito eliminada. Catálogo frontend e Setup instalado atualizados. README e guias de uso/migração dos dois projetos revisados.

Validação atual: 42 testes do toolkit frontend, 384 testes/41 suítes Jest do painel, configuração/lint/typecheck, build/postbuild e smoke standalone passaram. Doctor mantém apenas o aviso do agente frontend_engineering_expert externo preservado. E2E/editor/integrações reais não foram reexecutados nesta limpeza. Números e exemplos Node/Nest anteriores são históricos; validação backend pertence ao projeto independente.


## E2E com WebKit — 2026-10-21

Playwright agora usa webkit/Desktop Safari. Configuração carregada e quatro jornadas listadas; execução pendente porque faltam bibliotecas de sistema neste ambiente. Ver [validação local](docs/local-validation.md). Os resultados Chromium anteriores são históricos.

## Matriz E2E — 2026-10-21

A configuração passou a WebKit/Safari, Firefox, Google Chrome e Microsoft Edge. Foram descobertos 16 casos; a execução E2E completa permanece pendente do ambiente com dependências/navegadores aprovados. Ver comandos e limites na seção E2E e em docs/local-validation.md.
