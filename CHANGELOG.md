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

## 2026-11-23 — Geração de backend pelo CLI

- Documenta o fluxo backend create/doctor do code-reviewer-plug-and-play, com geração offline em destino novo/vazio.
- Define app-skeleton como referência e separa seus comandos de validação da distribuição central do CLI.
- Preserva o painel, instalador pessoal, contratos e projetos já gerados.

## 2026-11-23 — Limpeza de contextos

- Remove duplicação do runtime/testes Carbon no painel após conferir os 39 arquivos do manifesto do CLI.
- Preserva guias/modelos originais na referência backend do CLI e move o npmrc original, sem alteração, para config/backend/npmrc.reference.
- Retira comandos/exclusões do pacote removido; documenta substituições no guia de migração.
- Corrige hooks com caminhos inexistentes; preserva Conventional Commits e diário gerado sem sobrescrever notas manuais.
- Mantém código funcional, contratos, autenticação e configuração ativa do painel.
