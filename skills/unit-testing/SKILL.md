---
name: unit-testing
description: "Testes unitários para aplicações React/Next.js. Use para: criar testes, Vitest, testing-library, mocking, cobertura de testes, TDD. Keywords: teste, test, spec, vitest, mock, coverage, testing-library, unit, unitário."
---

# Unit Testing


> Referência reutilizável: confirme stack, versões, scripts e arquivos no projeto alvo antes de aplicar. Os caminhos e exemplos abaixo não comprovam uma implementação existente.

## Modo de Resposta

**Default**: estrutura do teste em bullets + 1 exemplo mínimo. Só mostrar múltiplos casos ou mocks complexos quando o usuário pedir.

## Quando Usar

- Criar testes para componentes, hooks ou services
- Configurar mocks
- Debugar testes falhando
- Aumentar cobertura

## Quando NÃO Usar

- Para revisar código existente (use `code-review`)
- Para criar componentes (use `code-standards`)

## Stack

| Ferramenta                  | Uso         |
| --------------------------- | ----------- |
| Vitest                      | Test runner |
| @testing-library/react      | Render      |
| @testing-library/user-event | Interações  |
| vi.mock                     | Mocking     |

## Fluxo em 5 Passos

1. **Estrutura**: `describe` → `beforeEach` → `it`
2. **Render**: com providers se necessário (QueryClient, etc.)
3. **Interact**: `userEvent.setup()` + ações
4. **Assert**: queries acessíveis + matchers
5. **Cleanup**: `vi.clearAllMocks()` no `beforeEach`

## Template Mínimo

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('<Component />', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should [comportamento esperado]', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText(/resultado/i)).toBeInTheDocument();
  });
});
```

## Mocking Rápido

```typescript
// Store
vi.mock("@/stores/lead", () => ({
  useLeadStore: vi.fn(() => ({ lead: mockData, setLead: vi.fn() })),
}));

// Service
vi.mock("@/services/proposal", () => ({
  createProposal: vi.fn(() => Promise.resolve({ ok: true, data: {} })),
}));

// Hook
vi.mocked(useModalState).mockReturnValue({
  isOpen: false,
  openModal: vi.fn(),
  closeModal: vi.fn(),
});
```

## Queries (Prioridade)

1. `getByRole` — preferir sempre
2. `getByLabelText` — para inputs
3. `getByText` — para conteúdo visível
4. `getByTestId` — último recurso

## Anti-Padrões

- Testar implementação, não comportamento
- Usar índices em `getAllBy`
- `await new Promise(r => setTimeout(r, X))` — use `waitFor`
- Esquecer `vi.clearAllMocks()` no `beforeEach`

## Helpers de Referência

```typescript
// __tests__/setup/global-mocks.ts
export const mockUseDataGtmType = () => ({ dataGtmType: { ... } });
export const mockUseLeadStore = (overrides = {}) => ({ lead: { ... }, ...overrides });
```

## Referências

Para padrões detalhados de mocking, hooks, forms e coverage, consulte [patterns.md](./references/patterns.md).

