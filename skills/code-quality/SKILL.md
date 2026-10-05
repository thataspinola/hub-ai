---
name: code-quality
description: "Qualidade de código para frontend sênior. Use para: lint errors, type errors, código limpo, boas práticas TypeScript, formatação Biome, imports. Keywords: qualidade, quality, lint, biome, typescript, type error, clean code, código limpo."
---

# Code Quality

## Modo de Resposta

**Default**: erros em lista + comando de correção. Só mostrar código corrigido quando necessário ou quando o usuário pedir.

## Quando Usar

- Corrigir erros de lint ou type errors
- Revisar qualidade de código
- Aplicar boas práticas TypeScript
- Formatar código seguindo padrões do projeto
- Organizar imports e estrutura de arquivos

## Stack de Qualidade

| Ferramenta   | Propósito                      |
| ------------ | ------------------------------ |
| Biome        | Linting e formatação           |
| TypeScript   | Tipagem estática (strict mode) |
| Path aliases | Imports organizados via `@/*`  |

Prefira os scripts do projeto para validação. Isso reduz divergência entre o que a skill sugere e o que CI ou hooks locais realmente executam.

## Configuração Biome

O projeto usa Biome com as seguintes configurações:

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "arrowParentheses": "always",
      "semicolons": "always"
    }
  }
}
```

### Regras Importantes

| Regra                       | Status | Motivo                       |
| --------------------------- | ------ | ---------------------------- |
| `recommended`               | ✅ ON  | Base de qualidade            |
| `noExplicitAny`             | ⚠️ OFF | Flexibilidade em integrações |
| `noNonNullAssertion`        | ⚠️ OFF | Contexto de stores           |
| `useExhaustiveDependencies` | ⚠️ OFF | Controle manual de deps      |

`organizeImports` está desabilitado no Biome. Não assuma que ordem de imports será corrigida automaticamente.

## TypeScript Strict

O projeto usa `strict: true` no tsconfig. Isso inclui:

- `strictNullChecks` - Null safety obrigatório
- `noImplicitAny` - Types explícitos
- `strictFunctionTypes` - Parâmetros de função seguros

### Path Aliases

```typescript
// ✅ Correto
import { Button } from "@/components";
import { useLeadStore } from "@/stores/lead";

// ❌ Evitar
import { Button } from "../../../components";
```

## Procedimento de Revisão

### 1. Verificar Erros de Lint

```bash
npm run lint
```

### 2. Aplicar Correções Automáticas

```bash
npm run lint:fix
```

### 3. Verificar Types

```bash
npm run typing:check
```

## Padrões de Código

### Naming Conventions

| Tipo                   | Convenção           | Exemplo                  |
| ---------------------- | ------------------- | ------------------------ |
| Componentes            | PascalCase          | `CardPlanDetails`        |
| Hooks                  | camelCase com `use` | `useProposal`            |
| Services               | camelCase           | `createProposal`         |
| Types/Interfaces       | PascalCase          | `LeadStore`              |
| Constantes             | UPPER_SNAKE_CASE    | `DEFAULT_ENCRYPTION_KEY` |
| Arquivos de componente | PascalCase/         | `Button/index.tsx`       |
| Arquivos de hook       | camelCase/          | `useProposal/index.ts`   |

### Estrutura de Exports

```typescript
// ✅ Named exports para componentes
export const Button = ({ ... }: ButtonProps) => { ... };

// ✅ Types em arquivo separado
// types.ts
export interface ButtonProps { ... }

// ✅ Barrel exports em index.ts
export { Button } from './Button';
export { Input } from './Input';
```

### Tratamento de Null/Undefined

```typescript
// ✅ Optional chaining
const phone = lead?.client?.cellPhone || "";

// ✅ Nullish coalescing
const value = inputValue ?? defaultValue;

// ❌ Evitar
const phone =
  lead && lead.client && lead.client.cellPhone ? lead.client.cellPhone : "";
```

## Referências

- [Padrões detalhados](./references/patterns.md)
