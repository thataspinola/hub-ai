# Changelog

## 2026-10-30 — hub-ai apenas como consumidor do reviewer externo

- Removidos os recursos internos de distribuição e avaliação dos antigos frontend/backend code-reviewers: toolkit, skills, perfis, templates, locks, agentes locais de revisão e CLIs.
- Substituído o catálogo embarcado pela página informativa que aponta para o `code-reviewer-plug-and-play`, preservando a rota do painel.
- Atualizados testes da página, scripts de verificação, instruções Copilot, README, AGENTS e guias de uso; referência documental regenerada.
- Mantidos autenticação, APIs, formulários, feature flags, recomendações e integração corporativa do painel.
- O `reviewer:doctor` permanece apenas como diagnóstico pessoal sem instalar nada no projeto.
- Validação de lint, Jest, typecheck, build, E2E e VDI deve ser comprovada por execução; não presumir aprovação.


## 2026-10-30 — auditoria de redundâncias e qualidade

- Adicionado `npm run audit:repo` e testes de inventário de scripts, referências e skills duplicadas.
- Integrado audit aos checks locais e documentada a classificação de recursos legados preservados por compatibilidade.
- Sem remoções destrutivas de autenticação, painel, Copilot Setup ou toolkit legado; pendências de homologação registradas.

## 2026-10-30 — adoção do Code Reviewer Plug and Play

- Integrado o fluxo de instalação única de skills frontend/backend e agente pessoal do projeto `code-reviewer-plug-and-play`.
- Adicionado `npm run reviewer:doctor` e testes de configuração para verificar presença sem modificar projetos consumidores.
- Atualizados README, AGENTS e guias de revisão, instalação e migração, preservando toolkit e agentes legados.
- Validação real no Copilot/VDI continua pendente; testes automatizados não substituem essa homologação.


## 2026-10-27 — separação de responsabilidades

- Editores separados por domínio e hook de comportamento para o CRUD de flags.
- Store de recomendações composto por ações e contratos de persistência/preview.
- Fila de gravações por instância, falha de sincronização explícita e criação idempotente de campanhas.
- Contratos públicos preservados e arquitetura documentada.

## 2026-10-23 — integração dos ajustes da main

- Alinhamento dos caminhos de testes, catálogo e basePath dos E2E.
- Correções de recuperação, propriedade de recursos, detecção de escopo e rollback legado.
- Documentação e configuração instalada do editor atualizadas mantendo o código recebido.

## 1.4.0

- Recursos centralizados em resources/agents, resources/skills e resources/templates; perfis selecionam recursos sem duplicá-los.
- Copilot Setup único para Angular, React, Next.js, Vue e backend Node/NestJS.
- Templates com sufixo .template.md, testes em **tests**/ e nomes kebab-case; acessibility corrigido para accessibility.
- Migração conservadora de nomes antigos e validação automática de nomenclatura e setup compartilhado.

## 1.3.0

- Orientações NestJS instaláveis no perfil Node para unitários, integração e E2E HTTP.
- Exemplo TypeScript/Nest com TestingModule, DI, DTOs/pipes, guards, teardown, build e cobertura.
- Matriz GitLab CI em Node 22/24 para o exemplo Nest sem Python nem serviços corporativos.

## 1.2.1

- Migração completa das ferramentas, testes e GitLab CI para Node.js 22+.
- Instalação, diagnóstico, recuperação e avaliação sem runtime adicional.
- Validação impede arquivos de runtime não permitido e seu uso na pipeline.

## 1.2.0 — 2026-10-05

- Adicionar perfis Angular, React, Next.js e Vue com agentes e regras específicas; preservar Node e o alias frontend legado.
- Compartilhar skills de qualidade/testes web e entrega GitLab/Jenkins.
- Trocar workflow GitHub Actions por .gitlab-ci.yml de validação, sem deploy nem alteração do pipeline dos consumidores.
- Testar instalação isolada de cada framework. Validação no editor e execução de builds reais desses frameworks ainda pendentes.

## 1.1.0 — 2026-10-05

- Unificar perfis via manifestos; oferecer capacidades Node opcionais sem mudar o padrão de instalação anterior.
- Adicionar versão/hashes, dry-run, migração conservadora, diagnóstico e recuperação transacional.
- Impedir escrita através de hard links e recusar destinos inválidos antes de alterar arquivos.
- Validar YAML, nomes e contratos de recursos; adicionar regressões de instalação/validação.
- Revisar exemplos de segurança e comentário de performance.
- Adicionar backend CommonJS executável com tests automated e E2E local, e avaliação adjudicada de reviewer.

## Base anterior

Commits 49d3f6c e anteriores distribuíam recursos sem lock/versionamento: atualização não identifica automaticamente a propriedade dos arquivos antigos. Revisar esses arquivos manualmente.

## Automação de manutenção — 2026-10-28

- Referência de comandos/guias gerada e verificação de atualização.
- Diário Git regenerável, Conventional Commits, planejamento de versão e hooks locais opcionais.
- Comando verify e testes de regressão das automações; instruções de integração com GitLab/Jenkins.
