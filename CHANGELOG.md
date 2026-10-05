# Changelog

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
