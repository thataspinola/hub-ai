---
name: code-standards
description: "Padrões e convenções de código frontend. Use para: criar componentes, hooks, services, stores, estrutura de pastas, organização de código. Keywords: padronização, convenção, estrutura, organização, componente, hook, service, store, standards."
---

# Code Standards


> Referência reutilizável: confirme stack, versões, scripts e arquivos no projeto alvo antes de aplicar. Os caminhos e exemplos abaixo não comprovam uma implementação existente.

## Modo de Resposta

**Default**: estrutura de pastas + assinatura/interface. Só gerar implementação completa quando o usuário pedir.

## Quando Usar

- Criar componentes, hooks, services ou stores
- Organizar estrutura de pastas
- Definir tipos e interfaces

## Quando NÃO Usar

- Para revisar código existente (use `code-review`)
- Para criar testes (use `unit-testing`)

## Estrutura do Projeto

```
src/
├── app/          # Rotas Next.js
├── components/   # UI reutilizável
├── hooks/        # Lógica de negócio
├── services/     # Chamadas de API
├── stores/       # Estado global (Zustand)
├── utils/        # Funções utilitárias
└── @types/       # Tipos globais
```

## Padrões por Tipo

### Componente

```
Button/
├── index.tsx
├── types.ts
└── styles.module.scss
```

**Convenções**: PascalCase, named export, restProps, `'use client'` se necessário.

### Hook

```
useProposal/
├── index.ts
└── types.ts
```

**Ordem interna**: stores → hooks → mutations/queries → memos → callbacks → return.

### Service

```
proposal/
├── index.ts
└── types.ts
```

**Retorno**: `{ ok: true, data } | { ok: false, error }`.

### Store

```
lead/
├── index.ts
├── types.ts
└── storage.ts (opcional)
```

**Middlewares**: `immer` para mutações, `persist` para dados sensíveis (com storage encriptado).

## Naming

| Tipo       | Convenção       | Exemplo          |
| ---------- | --------------- | ---------------- |
| Componente | PascalCase      | `CardPlan`       |
| Hook       | camelCase + use | `useProposal`    |
| Service    | camelCase       | `createProposal` |
| Tipo       | PascalCase      | `LeadData`       |
| Constante  | UPPER_SNAKE     | `MAX_ITEMS`      |

## Estilos

- **Novo código**: `styles.module.scss`
- **Legado**: preservar `styles.scss` + BEM se já existir

## Anti-Padrões

- Componente sem pasta própria
- Hook sem tipo de retorno explícito
- Service que faz throw direto (usar Result pattern)
- Store sem action de reset
- Misturar lógica de negócio em componente

## Referências

Para templates completos de componente, hook, service e store, consulte [patterns.md](references/patterns.md).

