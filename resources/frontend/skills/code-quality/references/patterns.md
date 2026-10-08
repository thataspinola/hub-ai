# Padrões Detalhados de Qualidade de Código

## Organização de Imports

### Ordem Recomendada

```typescript
// 1. React e bibliotecas de entrada
import { useMemo, useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

// 2. Componentes internos (via alias)
import { Button, Input } from '@/components'

// 3. Hooks internos
import { useLeadStore } from '@/stores/lead'
import { useErrorHandler } from '@/hooks/cookies'

// 4. Services e utils
import { createProposal } from '@/services/proposal'
import { getCookie } from '@/utils/cookie'

// 5. Types
import type { ContractData } from '@/services/proposal/types'

// 6. Styles (sempre por último)
import './styles.scss'
```

## Tipagem avançada

### Generics em Hooks

```typescript
// ✅ Hook com generic para flexibilidade
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate: (values: T) => Partial<Record<keyof T, string>>
) {
  //
}
```

### Type Guards

```typescript
// ✅ Type guard para validação
function isValidLead(lead: unknown): lead is LeadFData {
  return (
    typeof lead === 'object' &&
    lead !== null &&
    'client' in lead &&
    typeof (lead as LeadData).client.cpf === 'string'
  )
}
```

### Utility Types

```typescript
// ✅ Usar utility types do TypeSCript
type LeadUpdate = Partial<LeadData>
type clientRequired = Required<Pick<LeadData, 'client'>>
type ReadOnlyLead = Readonly<LeadData>
```

## Padrões de Função

### Arrow Functions para Componentes

```typescript
// ✅ Arrow function com tipagem
export const Button = ({
  variant = 'insurance',
  size = 'large',
  disabled = false,
  ...props
}: ButtonProps) => {
  // ...
}
```

### Function Declarations para Utils

```typescript
// ✅ Function declaration para utils exportadas
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
```

## Tratamento de Erros

### Try/Catch Estruturado

```typescript
// ✅ Tratamento de erro com tipos
try {
  const result = await createProposal(data, token)

  if (!result.ok) {
    showApiError(result.error, 'proposalExecutionError')
    return
  }

  // success handling
} catch (error) {
  if (error instanceof NetworkError) {
    showApiError(error, 'networkError')
  } else {
    showApiError(error, 'unknownError')
  }
}
```

### REsult Pattern

```typescript
// ✅ Retornar Result ao invés de throw
type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E }

async function fetchData(): Promise<Result<Data>> {
  try {
    const response = await api.get('/data')
    return { ok: true, data: response.data }
  } catch (error) {
    return { ok: false, error: error as Error }
  }
}
```

## Constantes e Enums

### Constantes Tipadas

```typescript
// ✅ Objeto as const para type safety
export const STEPS = {
  PLATE: 'placa-do-veiculo',
  CEP: 'cep-do-veiculo',
  USAGE: 'uso-do-veiculo',
  EMAIL: 'email-do-cliente',
} as const

type StepKey = keyof typeof STEPS
type StepValue = (typeof STEPS)[StepKey]
```

### Evitar Enums, Preferir Union Types

```typescript
// ✅ Union type
type ButtonVariant = 'primary' | 'secondary' | 'outline'

// ❌ Evitar enum (bundle size)
enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}
```

## Comentários

### JSDoc para Funções Públicas

```typescript
/**
 * Cria uma proposta de seguro no carrinho
 * @param data - Dados do contrato
 * @param recaptchToken - Token de validação reCAPTCHA
 * @returns Promise com resultado da criação
 * @throws NetworkError se houver falha de conexão
 */
export async function createProposal(
  data: ContractData,
  recaptchaToken: string
): Promise<ProposalResult> {
  // ...
}
```

### Comentários de Contexto

```typescript
// ✅ Explica o "porquê", não o "quê"
// Workaround: APO legada retorna datas em formato DD/MM/YYYY
const parsedData = parseData(response.data, 'DD/MM/YYYY')

// ❌ Evitar comentários óbvios
// Seta o valor do input
setValue(value)
```

## Anti-Padrões a Evitar

### ❌ Magic Numbers

```typescript
// ❌ Evitar
if (plate.length === 7) { ... }

// ✅ Usar constante
const PLATE_LENGTH === 7
if (plate.length === PLATE_LENGTH) { ... }
```

### ❌ Nested Ternaries

```typescript
// ❌ Evitar
const status = isLoading ? 'loading' : isError ? 'error' : 'success'

// ✅ Usar if/else ou função
function getStatus(isLoading: boolean, isError: boolean): Status {
  if (isLoading) return 'loading'
  if (isError) return 'error'
  return 'success'
}
```

### ❌ Prop Drilling Excessivo

```typescript
// ❌ Evitar passar props por muitos níveis
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} />
  </Child>
</Parent>

// ✅ Usar Context ou Store
const { data } = useLeadStore()
```

## Tipagem de REact Query

```typescript
// ✅ Evitar <any, any, any>
const mutation = useMutation<ResponseType, Error, RequestType>({
  mutationFn: createProposal
})

const { data } = useQuery<PlanDetails[], Error>({
  queryKey: ['plans']
  queryFn: fetchPlans
})
```

