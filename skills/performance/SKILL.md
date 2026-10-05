---
name: performance
description: "Otimização de performance frontend. Use para useMemo, useCallback, React Query caching, lazy loading, code splitting, re-renders, bundle size. Keywords: performance, otimização, lento, slow, re-render, memoização, memo, cache, lazy, bundle."
---

# Performance


> Referência reutilizável: confirme stack, versões, scripts e arquivos no projeto alvo antes de aplicar. Os caminhos e exemplos abaixo não comprovam uma implementação existente.

## Modo de Resposta

**Default**: diagnóstico em bullets + 1 exemplo de otimização. Só gerar análise completa ou refatoração extensa quando o usuário pedir.

## Quando Usar

- Investigar re-renders desnecessários
- Implementar memoização de valores/callbacks
- Configurar caching com React Query
- Otimizar carregamento de componentes
- Reduzir bundle size
- Melhorar métricas Core Web Vitals

## Padrões de Referência

### Memoização com useMemo

```typescript
// src/steps/VehiclePlate/index.tsx
const plateInput = useMemo(
  () => lead?.productDetails?.plate || "",
  [lead?.productDetails?.plate],
);

const normalizedPlate = useMemo(
  () => plateInput.replace(/\D/g, ""),
  [plateInput],
);

const isStepValid = useMemo(
  () => normalizedPlate.length >= 7,
  [normalizedPlate],
);
```

### Callbacks Estáveis com useCallback

```typescript
// Hook useProposal
const executeProposal = useCallback(
  async (portoCardDiscount: boolean) => {
    if (!contractData) return;

    try {
      startCartIntegration(params.budgetNumber);
      // ... logic
    } catch (error) {
      showApiError(error, "proposalError");
    }
  },
  [contractData, params.budgetNumber, startCartIntegration, showApiError],
);
```

### React Query Caching

```typescript
// lib/react-query.ts
export const STALE_TIME_60MIN = 1000 * 60 * 60; // 60 minutos
export const GC_TIME_60MIN = 1000 * 60 * 60;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_60MIN,
      gcTime: GC_TIME_60MIN,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
```

## Quando Memoizar

### ✅ Usar useMemo

```typescript
// 1. Cálculos custosos
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items],
);

// 2. Objetos passados como props
const config = useMemo(() => ({ theme: "dark", locale: "pt-BR" }), []);

// 3. Valores derivados de estado
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items],
);

// 4. Referências estáveis para contexto
const contextValue = useMemo(() => ({ user, setUser }), [user]);
```

### ❌ Não Usar useMemo

```typescript
// 1. Valores primitivos simples
const isValid = value.length > 0; // Barato, não precisa de memo

// 2. Operações já otimizadas
const id = `input-${name}`; // Template string é rápida

// 3. Quando dependencies mudam sempre
const timestamp = useMemo(() => Date.now(), [value]); // Recalcula toda vez
```

### ✅ Usar useCallback

```typescript
// 1. Callbacks passados para componentes memoizados
const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
}, []);

// 2. Callbacks usados em useEffect dependencies
const fetchData = useCallback(async () => {
  const result = await api.get("/data");
  setData(result);
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);

// 3. Event handlers em listas
const handleItemClick = useCallback((id: string) => {
  setSelectedId(id);
}, []);
```

## Zustand Performance

### useShallow para Seletores

```typescript
// ✅ Com useShallow - evita re-render quando outros campos mudam
const { lead, setLead } = useLeadStore(
  useShallow((state) => ({
    lead: state.lead,
    setLead: state.setLead,
  })),
);

// ✅ Seletor único - já é otimizado
const cpf = useLeadStore((state) => state.lead.client.cpf);

// ❌ Sem seletor - re-render em qualquer mudança
const state = useLeadStore();
```

### Seletores Específicos

```typescript
// ✅ Selecionar apenas o necessário
const clientName = useLeadStore((state) => state.lead.client.name);
const clientPhone = useLeadStore((state) => state.lead.client.cellPhone);

// Ou agrupar com useShallow
const client = useLeadStore(useShallow((state) => state.lead.client));
```

## Code Splitting

### Dynamic Imports

```typescript
// Componentes carregados sob demanda
import dynamic from 'next/dynamic';

// Modal carregado apenas quando necessário
const Modal = dynamic(() => import('@/components/ui/Modal'), {
  loading: () => <Skeleton />,
  ssr: false, // Não renderizar no servidor
});

// Componente pesado com loading customizado
const Chart = dynamic(
  () => import('@/components/Chart'),
  {
    loading: () => <div className="chart-skeleton" />,
  }
);
```

### Route-based Splitting

```typescript
// Next.js App Router já faz splitting por rota automaticamente
// Cada pasta em app/ é um chunk separado

// Para carregar dados apenas na rota:
// app/planos/page.tsx
export default async function PlanosPage() {
  // Este código só carrega na rota /planos
  const plans = await fetchPlans();
  return <PlansList plans={plans} />;
}
```

## Lazy Loading de Imagens

```typescript
import Image from 'next/image';

// ✅ Next.js Image com lazy loading automático
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority={false} // Lazy por padrão
  placeholder="blur"
  blurDataURL={blurHash}
/>

// Para imagens above-the-fold
<Image
  src="/logo.png"
  alt="Porto Seguro"
  width={200}
  height={50}
  priority={true} // Carrega imediatamente
/>
```

## Debounce e Throttle

### useDebounce Hook

```typescript
// hooks/useDebounce/index.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Uso em busca
const SearchInput = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchApi(debouncedQuery);
    }
  }, [debouncedQuery]);
};
```

### Throttle para Eventos Frequentes

```typescript
const useThrottle = <T>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(
        () => {
          lastUpdated.current = Date.now();
          setThrottledValue(value);
        },
        interval - (now - lastUpdated.current),
      );

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
};
```

## Evitar Re-renders

### React.memo para Componentes

```typescript
// Componente que não precisa re-render frequente
export const Card = memo(({ title, description }: CardProps) => (
  <div className="card">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
));

// Com comparação customizada
export const ExpensiveList = memo(
  ({ items }: ListProps) => (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  ),
  (prevProps, nextProps) => {
    // Re-render apenas se IDs mudarem
    return prevProps.items.map(i => i.id).join() ===
      nextProps.items.map(i => i.id).join();
  }
);
```

### useRef para Valores que Não Trigam Re-render

```typescript
// Tracking de estado sem re-render
const hasShownErrorRef = useRef(false);

useEffect(() => {
  if (error && !hasShownErrorRef.current) {
    hasShownErrorRef.current = true;
    showErrorModal(error);
  }
}, [error]);

// Guardar valor anterior
const previousValueRef = useRef(value);

useEffect(() => {
  if (previousValueRef.current !== value) {
    // Value changed
    previousValueRef.current = value;
  }
});
```

## Referências

- [Padrões detalhados de performance](./references/patterns.md)

