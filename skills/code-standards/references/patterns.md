# Padrões de Organização Detalhados

## Convenções de Nomenclatura de Arquivos

| Tipo       | Padrão             | Exemplo                |
| ---------- | ------------------ | ---------------------- |
| Componente | PascalCase/        | `Button/index.tsx`     |
| Hook       | camelCase com use  | `useProposal/index.ts` |
| Service    | kebab-case/        | `proposal/index.ts`    |
| Store      | kebab-case/        | `lead/index.ts`        |
| Util       | kebab-case.ts      | `format-currency.ts`   |
| Type file  | types.ts           | `types.ts`             |
| Test file  | \*.spec.tsx        | `Button.spec.tsx`      |
| Style file | styles.module.scss | `styles.module.scss`   |

## Barrel Exports

### Components Index

```typescript
// src/components/index.ts
export { Button } from "./ui/Button";
export { Input } from "./ui/Input";
export { Card } from "./ui/Card";
export { Modal } from "./ui/Modal";

// Types também exportados
export type { ButtonProps } from "./ui/Button/types";
export type { InputProps } from "./ui/Input/types";
```

### Hooks Index

```typescript
// src/hooks/index.ts
export { useProposal } from "./useProposal";
export { useErrorHandler } from "./useErrorHandler";
export { useModalState } from "./useModalState";
export { useDebounce } from "./useDebounce";

// Types
export type { UseProposalReturn } from "./useProposal/types";
```

## Padrões de Props

### Composição com HTML Attributes

```typescript
// Estender atributos nativos
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  isLoading?: boolean;
}

// Usar restProps para passar atributos nativos
export const Input = ({ label, errorMessage, isLoading, ...restProps }: InputProps) => (
  <input {...restProps} />
);
```

### Children Pattern

```typescript
// Para componentes container
interface CardProps {
  title: string;
  children: React.ReactNode;
}

// Para slots específicos
interface ModalProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
```

### Render Props

```typescript
// Para lógica reutilizável
interface DataFetcherProps<T> {
  url: string;
  render: (data: T, isLoading: boolean) => React.ReactNode;
}
```

## Padrões de Estado

### Estado Local vs Global

| Cenário                          | Usar                    |
| -------------------------------- | ----------------------- |
| UI state (open/close, hover)     | `useState` local        |
| Form values                      | `useState` ou `useForm` |
| Dados compartilhados entre rotas | Zustand store           |
| Server state (API data)          | React Query             |
| URL state                        | `useSearchParams`       |

### Inicialização de Estado

```typescript
// ✅ Estado derivado com useMemo
const filteredItems = useMemo(
  () => items.filter((item) => item.active),
  [items],
);

// ✅ Lazy initialization
const [state, setState] = useState(() => computeExpensiveValue());

// ❌ Evitar computação em render
const filteredItems = items.filter((item) => item.active); // Roda todo render
```

## Padrões de Side Effects

### useEffect Guidelines

```typescript
// ✅ Cleanup de subscriptions
useEffect(() => {
  const subscription = api.subscribe(handleUpdate);
  return () => subscription.unsubscribe();
}, []);

// ✅ Ref para evitar re-runs
const hasInitialized = useRef(false);

useEffect(() => {
  if (hasInitialized.current) return;
  hasInitialized.current = true;
  initialize();
}, []);

// ✅ Abort controller para requests
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal });

  return () => controller.abort();
}, []);
```

## Padrões de Formulário

### Estrutura do useForm Hook

```typescript
// Hook interno do projeto
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  resetForm,
} = useForm({
  initialValues: { email: "", phone: "" },

  validate: (values) => {
    const errors: Partial<typeof values> = {};

    if (!isValidEmail(values.email)) {
      errors.email = "Email inválido";
    }

    return errors;
  },

  onSubmit: async (values) => {
    await submitLead(values);
  },
});
```

### Validação

```typescript
// ✅ Validação em blur
<Input
  name="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  errorMessage={touched.email ? errors.email : ''}
/>

// ✅ Máscaras
<Input
  name="phone"
  value={formatPhone(values.phone)}
  onChange={(e) =>
    setFieldValue('phone', e.target.value.replace(/\D/g, ''))
  }
/>
```

## Padrões de API

### Error Handling Centralizado

```typescript
// hooks/useErrorHandler/index.ts
export const useErrorHandler = () => {
  const showApiError = useCallback((error: unknown, context: string) => {
    const message = getErrorMessage(error);

    // Log para monitoramento
    logger.error(context, { error, message });

    // Exibir para usuário
    openErrorModal({
      title: "Erro",
      message: message,
    });
  }, []);

  return { showApiError };
};
```

### Retry Logic

```typescript
// Em React Query
const { data, error, refetch } = useQuery({
  queryKey: ["plans", quotationToken],
  queryFn: () => fetchPlans(quotationToken),
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
});
```

## Padrões de Navegação

### Step Navigation

```typescript
// hooks/useStepNavigation/index.ts
export const useStepNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const currentStepIndex = useMemo(
    () => STEPS.findIndex((step) => pathname.includes(step.path)),
    [pathname],
  );

  const nextStep = useCallback(() => {
    const next = STEPS[currentStepIndex + 1];

    if (next) router.push(next.path);
  }, [currentStepIndex, router]);

  const goToStep = useCallback(
    (stepPath: string) => {
      router.push(stepPath);
    },
    [router],
  );

  return { nextStep, goToStep, currentStepIndex };
};
```

## Padrões de GTM/Analytics

### Hook de Tracking

```typescript
// hooks/useGtm/use-data-gtm.ts
export const useDataGtmType = ({ name, userCpf }: GtmParams) => {
  const dataGtmType = useMemo(
    () => ({
      input: (fieldName: string) => ({
        "data-gtm-type": "input",
        "data-gtm-form": name,
        "data-gtm-name": fieldName,
      }),

      click: (action: string) => ({
        "data-gtm-type": "click",
        "data-gtm-clicktype": action,
        "data-gtm-name": name,
      }),

      pushEvent: (event: GtmEvent) => {
        window.dataLayer?.push(event);
      },

      alertError: (params: ErrorParams) => {
        window.dataLayer?.push({
          event: "error",
          ...params,
        });
      },
    }),
    [name, userCpf],
  );

  return { dataGtmType };
};
```

## Service com reCAPTCHA

```typescript
// Assinatura padrão para services protegidos
export async function fetchVehicle(plate: string, recaptchaToken: string) {
  return carbonClient.post(
    "/vehicle",
    { plate },
    {
      headers: {
        "X-Recaptcha-Token": recaptchaToken,
        "X-Recaptcha-Action": "fetchVehicle",
      },
    },
  );
}
```

## Hook com useQuery

```typescript
export const useVehiclePlate = (plate: string) => {
  return useQuery({
    queryKey: ["vehicle", plate],

    queryFn: async () => {
      const token = await recaptcha("fetchVehicle");
      return fetchVehicle(plate, token);
    },

    enabled: plate.length === 7,
  });
};
```
