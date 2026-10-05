# Changelog

## 1.1.0 — 2026-10-05

- Unificar perfis via manifestos; oferecer capacidades Node opcionais sem mudar o padrão de instalação anterior.
- Adicionar versão/hashes, dry-run, migração conservadora, diagnóstico e recuperação transacional.
- Impedir escrita através de hard links e recusar destinos inválidos antes de alterar arquivos.
- Validar YAML, nomes e contratos de recursos; adicionar regressões de instalação/validação.
- Revisar exemplos de segurança e comentário de performance.
- Adicionar backend CommonJS executável com tests automated e E2E local, e avaliação adjudicada de reviewer.

## Base anterior

Commits 49d3f6c e anteriores distribuíam recursos sem lock/versionamento: atualização não identifica automaticamente a propriedade dos arquivos antigos. Revisar esses arquivos manualmente.
