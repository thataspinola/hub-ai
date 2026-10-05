# hub-ai

Agentes, skills e templates reutilizáveis para Copilot em projetos Porto Seguro hospedados no **GitLab**, com Jenkins quando previsto no processo de entrega. Versão dos recursos: **1.4.0**. O hub orienta tarefas; geração de instructions e adaptação de regras dependem do executor e da leitura do projeto alvo.

## Instalar e revisar

Requer Node.js 22+. O instalador e o diagnóstico usam apenas módulos nativos. Para validar o hub, execute `npm ci`. Não adicionar arquivos `.py` nem dependências de Python: ferramentas devem usar Node.js, shell ou outro runtime aprovado. A validação bloqueia arquivos `.py` e uso de Python no CI.

```bash
node scripts/install.js /caminho/do/projeto --profile node --dry-run
node scripts/install.js /caminho/do/projeto --profile node
node scripts/doctor.js /caminho/do/projeto
```

Selecionar **Copilot Setup** e pedir `full setup`. O diagnóstico aponta instructions ainda não geradas, arquivos faltantes, mudanças locais, recursos antigos, links e placeholders. Ele não modifica arquivos nem certifica comportamento do executor.

| Perfil | Recursos |
| --- | --- |
| [Angular](profiles/angular/profile.json) | Copilot Setup/Reviewer, Angular e testes web |
| [React](profiles/react/profile.json) | Copilot Setup/Reviewer, React SPA e testes web |
| [Next.js](profiles/nextjs/profile.json) | Copilot Setup/Reviewer, router e fronteiras servidor/cliente |
| [Vue](profiles/vue/profile.json) | Copilot Setup/Reviewer, reatividade e contratos Vue |
| [Frontend legado](profiles/frontend/profile.json) | Compatibilidade com instalações anteriores; escolher perfil específico em novos projetos |
| [Node](profiles/node/README.md) | Copilot Setup, Node Code Reviewer, base backend e capacidades opcionais |

O alias legado frontend continua como padrão por compatibilidade; indicar --profile node, angular, react, nextjs ou vue em novos projetos. Em Node, todas as capacidades são instaladas por padrão para preservar uso anterior. Escolher apenas a base com `--capabilities base` ou adicionar capacidades com `--capabilities security,events,e2e,delivery`. Agents devem consultar somente recursos instalados. CPF, Dynamics, propostas e consentimento são exemplos opcionais de domínio; não integram automaticamente novos projetos.

## Atualizar e migrar

O instalador registra versão, commit quando disponível, perfil, capacidades e SHA-256 dos arquivos em `.github/hub-ai-lock.json`. Não incluir secrets nesse arquivo. Fixar o checkout em um commit revisado para distribuir uma versão reproduzível; VERSION identifica a versão dos recursos, mas não substitui o commit.

```bash
node scripts/install.js /caminho/do/projeto --profile node --dry-run --overwrite --migrate
node scripts/install.js /caminho/do/projeto --profile node --overwrite --migrate
```

--overwrite substitui conflitos dos recursos selecionados: revisar o diff antes. --migrate remove apenas recursos anteriormente gerenciados e localmente inalterados. Recursos antigos modificados bloqueiam a migração; preservar/adaptar o conteúdo antes de tentar novamente. Sem --migrate, recursos antigos são mantidos e o diagnóstico os sinaliza. Recursos instalados pelo instalador antigo, sem lock, não podem ser identificados como gerenciados: revisar manualmente, não presumir propriedade.

Instructions e AGENTS.md locais não são sobrescritos pelo instalador. Ver [guia de atualização](docs/updating.md), [compatibilidade](docs/compatibility.md) e [changelog](CHANGELOG.md).

## Validar e contribuir

```bash
npm ci
npm ci --prefix examples/nest-backend --ignore-scripts --no-audit --no-fund
npm run check
npm --prefix examples/nest-backend run test:cov
```

A pipeline GitLab em `.gitlab-ci.yml` executa essas verificações e os scripts automated/E2E local do [exemplo Node](examples/node-backend/README.md). Os testes cobrem instalação, migração, recuperação, metadados e comportamento de exemplos selecionados; não compilam todos os blocos de documentação nem validam produção.

A [avaliação de reviewers](evaluations/README.md) oferece um cenário com defeitos conhecidos e métricas adjudicadas. Usar Conventional Commits, revisar exemplos, não inserir dados reais/credenciais e atualizar testes, catálogo e versão quando o contrato de distribuição mudar.

## GitLab

Consulte [GitLab e Jenkins](docs/gitlab.md). Não há workflow GitHub Actions ativo. A pasta `.github` é apenas convenção de customização do editor Copilot, não requisito de hospedagem. O instalador não substitui o CI nem o Jenkins dos consumidores.

Exemplo React: `node scripts/install.js /caminho/do/projeto --profile react`. Angular, Vue e Next.js usam angular, vue e nextjs. Em monorepos mistos, escolher o perfil por aplicação em diretórios distintos e preservar AGENTS.md por escopo; não alternar perfis na mesma raiz esperando composição automática.

## Node com NestJS

O perfil Node inclui orientações específicas para módulos/DI, DTOs, pipes, guards e lifecycle NestJS. O [exemplo NestJS](examples/nest-backend/README.md) valida testes unitários, integração e E2E HTTP local com TypeScript, Jest e Supertest, além de build e cobertura. Preservar framework/runner/adapter reais de cada consumidor.

## Organização

Recursos reutilizáveis ficam em `resources/agents`, `resources/skills` e `resources/templates`; `profiles` seleciona os recursos por stack. Ferramentas ficam em `scripts`, testes em `tests/tooling` e exemplos têm `src`/`tests`. Todos os perfis usam o mesmo Copilot Setup. Ver [estrutura, nomenclatura e migração](docs/structure-and-naming.md).
