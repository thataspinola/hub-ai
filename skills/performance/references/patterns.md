# Padrões Detalhados de Performance

## Configuração Next.js

### next.config.ts Otimizado

```typescript
// next.config.ts do projeto
const nextConfig: NextConfig = {
  output: "standalone", // Bundle mínimo para deploy
  compress: true, // Compressão gzip habilitada
  reactStrictMode: true,

  // Remove console em produção
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Otimização de imagens
  images: {
    remotePatterns: [{ hostname: "*.portoseguro.com.br" }],
    formats: ["image/avif", "image/webp"],
  },

  // Headers de cache
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

## React Query Patterns

### Query com Retry Inteligente

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["plans", quotationToken],
  queryFn: () => fetchPlans(quotationToken),

  // Retry com backoff exponencial
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

  // Não refetch automático
  refetchOnWindowFocus: false,
  refetchOnMount: false,

  // Cache por 1 hora
  staleTime: 1000 * 60 * 60,
  gcTime: 1000 * 60 * 60,

  // Habilitar apenas com token válido
  enabled: Boolean(quotationToken),
});
```

### Prefetching

```typescript
// Prefetch na hover do botão
const prefetchPlans = () => {
  queryClient.prefetchQuery({
    queryKey: ['plans', quotationToken],
    queryFn: () => fetchPlans(quotationToken),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

<button
  onMouseEnter={prefetchPlans}
  onClick={goToPlans}
>
  Ver Planos
</button>
```

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateLead,

  // Update imediato antes da resposta
  onMutate: async (newLead) => {
    await queryClient.cancelQueries({ queryKey: ["lead"] });

    const previousLead = queryClient.getQueryData(["lead"]);

    queryClient.setQueryData(["lead"], newLead);

    return { previousLead };
  },

  // Rollback em caso de erro
  onError: (err, newLead, context) => {
    queryClient.setQueryData(["lead"], context?.previousLead);
  },

  // Invalidar cache em sucesso
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["lead"] });
  },
});
```

## Virtualização de Listas

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualList = ({ items }: { items: Item[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Altura estimada de cada item
    overscan: 5, // Itens extras fora da viewport
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ItemComponent item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Bundle Analysis

### Verificar Tamanho do Bundle

```bash
# Instalar analyzer
npm install --save-dev @next/bundle-analyzer

# Adicionar ao next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Executar análise
ANALYZE=true npm run build
```

### Otimizações Comuns

```typescript
// ❌ Import completo de lodash
import _ from "lodash";
_.debounce(fn, 300);

// ✅ Import específico
import debounce from "lodash/debounce";
debounce(fn, 300);

// ✅ Ou usar lodash-es com tree shaking
import { debounce } from "lodash-es";

// ❌ Import de biblioteca inteira
import * as Icons from "@/components/icons";

// ✅ Import específico
import { IconSearch } from "@/components/icons/IconSearch";
```

## Web Vitals

### Métricas Alvo

| Métrica                        | Bom     | Precisa Melhorar | Ruim    |
| ------------------------------ | ------- | ---------------- | ------- |
| LCP (Largest Contentful Paint) | ≤ 2.5s  | ≤ 4s             | > 4s    |
| FID (First Input Delay)        | ≤ 100ms | ≤ 300ms          | > 300ms |
| CLS (Cumulative Layout Shift)  | ≤ 0.1   | ≤ 0.25           | > 0.25  |
| TTFB (Time to First Byte)      | ≤ 800ms | ≤ 1.8s           | > 1.8s  |

### Monitoramento

```typescript
// app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Enviar para analytics
  if (metric.label === "web-vital") {
    window.dataLayer?.push({
      event: "web-vital",
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
    });
  }
}
```

### Otimizar LCP

```typescript
// 1. Priorizar imagem hero
<Image src="/hero.jpg" priority />

// 2. Preload de fontes críticas
<link
  rel="preload"
  href="/fonts/main.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>

// 3. Prefetch de rota provável
import Link from 'next/link';
<Link href="/planos" prefetch={true}>Ver Planos</Link>
```

### Evitar CLS

```typescript
// ✅ Dimensões definidas em imagens
<Image src="/banner.jpg" width={1200} height={400} />

// ✅ Skeleton com dimensões fixas
<div className="skeleton" style={{ width: 200, height: 50 }} />

// ✅ Espaço reservado para conteúdo dinâmico
<div style={{ minHeight: 300 }}>
  {isLoading ? <Skeleton /> : <Content />}
</div>

// ❌ Evitar injeção de conteúdo acima
{showBanner && <Banner />} // Empurra conteúdo para baixo
<MainContent />

// ✅ Espaço reservado para banner
<div style={{ minHeight: showBanner ? 100 : 0 }}>
  {showBanner && <Banner />}
</div>
<MainContent />
```

## Profiling no React DevTools

### Identificar Re-renders

1. Abrir React DevTools > Profiler
2. Habilitar "Record why each component rendered"
3. Gravar interação
4. Analisar "Why did this render?"

### Causas Comuns de Re-render

```typescript
// ❌ Objeto criado em render
<Child config={{ theme: 'dark' }} />

// ✅ Objeto memoizado
const config = useMemo(() => ({ theme: 'dark' }), []);
<Child config={config} />

// ❌ Função criada em render
<Button onClick={() => handleClick(id)} />

// ✅ Função memoizada
const handleItemClick = useCallback(() => handleClick(id), [id]);
<Button onClick={handleItemClick} />

// ❌ Spread de props com objeto
<Input {...formProps} /> // formProps muda a cada render

// ✅ Props específicas
<Input
  value={formProps.value}
  onChange={formProps.onChange}
/>
```

## useShallow para Stores

```typescript
import { useShallow } from "zustand/shallow";

// ✅ Evita re-render quando outros campos mudam
const { lead, setLead } = useLeadStore(
  useShallow((state) => ({ lead: state.lead, setLead: state.setLead })),
);

// ❌ Re-render em qualquer mudança do store
const store = useLeadStore();
```

## Checklist de Performance

### Antes de Deploy

- [ ] Bundle size analisado e otimizado
- [ ] Imagens otimizadas com next/image
- [ ] Code splitting por rota
- [ ] Lazy loading de componentes pesados
- [ ] React Query com caching configurado
- [ ] Memoização aplicada onde necessário
- [ ] Sem re-renders desnecessários identificados
- [ ] Web Vitals dentro das metas
- [ ] Fontes com display: swap
- [ ] Assets críticos com preload
