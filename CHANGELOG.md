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
