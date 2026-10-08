# Padrões Detalhados de Testes

## Estrutura de Arquivos de Teste

```text
src/
├── components/
│   └── ui/
│       └── Button/
│           ├── index.tsx
│           ├── Button.spec.tsx    # Teste colocado junto
│           └── types.ts
├── hooks/
│   └── useProposal/
│       ├── index.ts
│       └── useProposal.spec.ts
└── services/
    └── proposal/
        ├── index.ts
        └── proposal.spec.ts

__tests__/                         # Testes de integração
├── setup/
│   └── global-mocks.ts
├── planos.spec.tsx
└── email-do-cliente.spec.tsx
```

## Matchers Comuns

### Jest DOM Matchers

```typescript
// Presença
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibilidade
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Estado de formulário
expect(input).toBeDisabled();
expect(input).toBeEnabled();
expect(input).toBeRequired();
expect(input).toHaveValue("texto");
expect(checkbox).toBeChecked();

// Classes e atributos
expect(element).toHaveClass("active");
expect(element).toHaveAttribute("aria-invalid", "true");
expect(element).toHaveStyle({ color: "red" });

// Texto
expect(element).toHaveTextContent(/bem-vindo/i);
expect(element).toBeEmptyDOMElement();

// Foco
expect(input).toHaveFocus();
```

### Vitest Matchers

```typescript
// Funções mock
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
expect(mockFn).toHaveBeenLastCalledWith("lastArg");

// Valores
expect(value).toBe(expected);
expect(value).toEqual({ key: "value" });
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Arrays e objetos
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toMatchObject({ key: "value" });
expect(object).toHaveProperty("nested.key");

// Erros
expect(() => throwingFn()).toThrow();
expect(() => throwingFn()).toThrow("error message");

// Async
await expect(asyncFn()).resolves.toBe("result");
await expect(asyncFn()).rejects.toThrow("error");
```

## Testando Interações

### User Events

```typescript
import userEvent from '@testing-library/user-event';

describe('Form interactions', () => {
  it('should handle text input', async () => {
    const user = userEvent.setup();
    render(<Input name="email" label="Email" />);

    const input = screen.getByLabelText(/email/i);

    // Digitar texto
    await user.type(input, 'test@example.com');
    expect(input).toHaveValue('test@example.com');

    // Limpar campo
    await user.clear(input);
    expect(input).toHaveValue('');

    // Selecionar texto
    await user.tripleClick(input); // Seleciona tudo
  });

  it('should handle click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole('button'));
    await user.dblClick(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Form />);

    // Tab entre elementos
    await user.tab();
    expect(screen.getByLabelText(/nome/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/email/i)).toHaveFocus();

    // Pressionar tecla
    await user.keyboard('{Enter}');

    // Combinação de teclas
    await user.keyboard('{Control>}a{/Control}'); // Ctrl+A
  });

  it('should handle selection', async () => {
    const user = userEvent.setup();
    render(<Select options={['A', 'B', 'C']} />);

    await user.selectOptions(
      screen.getByRole('combobox'),
      'B'
    );

    expect(screen.getByRole('combobox')).toHaveValue('B');
  });
});
```

## Testando Async

### API Calls

```typescript
describe('Data fetching', () => {
  it('should display loading then data', async () => {
    // Mock da API
    vi.mocked(fetchPlans).mockResolvedValue(mockPlans);

    render(<PlansList />);

    // Loading state
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    // Data loaded
    await waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(mockPlans[0].name)).toBeInTheDocument();
  });

  it('should display error on failure', async () => {
    vi.mocked(fetchPlans).mockRejectedValue(new Error('Network error'));

    render(<PlansList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/erro/i);
    });
  });
});
```

### Timers

```typescript
describe('Debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce search', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} debounceMs={300} />);

    await user.type(screen.getByRole('textbox'), 'test');

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
```

## Testando Services

```typescript
import { createProposal } from "./index";
import { carbonClient } from "@/lib/carbon-client";

vi.mock("@/lib/carbon-client");

describe("createProposal", () => {
  const mockRequest = {
    quotationToken: "token123",
    budgetNumber: "456",
  };

  it("should return success on valid response", async () => {
    vi.mocked(carbonClient.post).mockResolvedValue({
      data: { proposalId: "789", status: "approved" },
    });

    const result = await createProposal(mockRequest, "recaptcha-token");

    expect(result).toEqual({
      ok: true,
      data: { proposalId: "789", status: "approved" },
    });

    expect(carbonClient.post).toHaveBeenCalledWith(
      "/proposal",
      mockRequest,
      expect.objectContaining({
        headers: { "X-Recaptcha-Token": "recaptcha-token" },
      }),
    );
  });

  it("should return error on failure", async () => {
    vi.mocked(carbonClient.post).mockRejectedValue(new Error("Network error"));

    const result = await createProposal(mockRequest, "token");

    expect(result).toEqual({
      ok: false,
      error: expect.any(Error),
    });
  });
});
```

## Testando Stores

```typescript
import { renderHook, act } from "@testing-library/react";
import { useLeadStore } from "./index";

describe("useLeadStore", () => {
  beforeEach(() => {
    // Resetar store entre testes
    const { result } = renderHook(() => useLeadStore());
    act(() => {
      result.current.reset();
    });
  });

  it("should update client data", () => {
    const { result } = renderHook(() => useLeadStore());

    act(() => {
      result.current.setLead({
        client: { cpf: "12345678900", name: "Test User" },
      });
    });

    expect(result.current.lead.client.cpf).toBe("12345678900");
    expect(result.current.lead.client.name).toBe("Test User");
  });

  it("should persist data", () => {
    const { result: result1 } = renderHook(() => useLeadStore());

    act(() => {
      result1.current.setClientPhone("11999999999");
    });

    // Simular novo render (nova instância do hook)
    const { result: result2 } = renderHook(() => useLeadStore());

    expect(result2.current.lead.client.cellPhone).toBe("11999999999");
  });
});
```

## Snapshot Testing

```typescript
describe('Card snapshot', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <Card title="Plano Básico" price="R$ 150,00" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match inline snapshot', () => {
    const { container } = render(<Badge>Novo</Badge>);

    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<span class="badge">Novo</span>"`
    );
  });
});
```

## Coverage

### Executar com Coverage

```bash
# Coverage completo
npm run test -- --coverage

# Coverage de arquivo específico
npm run test -- --coverage src/components/Button
```

### Metas de Coverage

| Métrica    | Meta |
| ---------- | ---- |
| Statements | 80%  |
| Branches   | 75%  |
| Functions  | 80%  |
| Lines      | 80%  |

### Ignorar Linhas

```typescript
// istanbul ignore next
function notTestedFunction() {
  // ...
}

// istanbul ignore if
if (process.env.NODE_ENV === "development") {
  // ...
}
```

## Debugging

### Debug Output

```typescript
import { screen } from "@testing-library/react";

// Log do DOM atual
screen.debug();

// Log de elemento específico
screen.debug(screen.getByRole("button"));

// Log mais detalhado
import { prettyDOM } from "@testing-library/react";
console.log(prettyDOM(element, Infinity));
```

### Pause no Teste

```typescript
it('should debug', async () => {
  render(<Component />);

  // Pause para inspeção manual
  await new Promise(resolve => setTimeout(resolve, 30000));
});
```

## Anti-Padrões

### ❌ Evitar

```typescript
// ❌ Testar implementação, não comportamento
expect(component.state.isOpen).toBe(true);

// ❌ Usar index em queries
screen.getAllByRole("button")[2];

// ❌ Wait com tempo fixo
await new Promise((r) => setTimeout(r, 1000));

// ❌ Testar componentes internos de libs
expect(Modal.prototype.close).toHaveBeenCalled();
```

### ✅ Preferir

```typescript
// ✅ Testar comportamento visível
expect(screen.getByRole("dialog")).toBeInTheDocument();

// ✅ Usar query específica
screen.getByRole("button", { name: /submit/i });

// ✅ Usar waitFor para condições async
await waitFor(() => expect(element).toBeVisible());

// ✅ Testar resultado final para o usuário
expect(screen.getByText(/sucesso/i)).toBeInTheDocument();
```

## Mocks Específicos do Projeto

### reCAPTCHA

```typescript
vi.mock("@/lib/recaptcha", () => ({
  recaptcha: vi.fn(() => Promise.resolve("mock-token")),
}));
```

### QueryClient Wrapper

```typescript
const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const { result } = renderHook(() => useMyHook(), { wrapper: createWrapper() });
```

