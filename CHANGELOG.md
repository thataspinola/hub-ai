# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

## [Unreleased]

### Corrigido

- **recommendations:** `addCampaign` não retorna mais antecipadamente quando a campanha ainda não existe.
- **recommendations:** `addSlot`, `updateSlot` e `removeSlot` gravam em `context_slot.slots`, e não na raiz de `context_slot`.
- **form-wizard:** `isFormResponses` valida `currentStepSlug` (o nome correto da propriedade).
- **form-wizard:** falha ao salvar o formulário exibe a mensagem `Unable to save form; browser storage is unavailable or full`.

### Testes

- Testes atualizados para a interface atual (textos em português, seletores, placeholders e mocks de `FeatureFlagProvider`, `useFeatureFlags` e `getFormsIndex`).
- Cobertura ampliada para autenticação, navbar, dashboard, página inicial, formulários e CRUD de feature flags.
- Mock de `motion/react` em `FeatureFlagCrud.spec.tsx` passou a reutilizar componentes por tag, evitando remontagem do formulário a cada render.

## 2026-11-23 — App Skeleton

- Integra o skeleton Carbon como pacote Node isolado, com handler Lambda HTTP e runner localhost.
- Corrige exports incompletos, erro de validação ausente, validação de CPF, schema e trace ID; reduz exposição de dados nos logs.
- Preserva arquivos com marcadores em templates fora do runtime.
- Adiciona lint, lockfile, testes unitários/HTTP e gate de cobertura de 90% próprios; verify:all valida painel e pacote.
- Mantém rotas, contratos, dependências e configuração corporativa do painel.
- Corrige o import defineConfig do Playwright para restaurar a descoberta dos E2E; execução em navegadores permanece pendente.
