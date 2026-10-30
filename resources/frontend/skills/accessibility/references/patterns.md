# Padrões Detalhados de Acessibilidade

## WCAG 2.1 Checklist

### Perceptível (1.x)

| Critério                       | Nível | Implementação                 |
| ------------------------------ | ----- | ----------------------------- |
| 1.1.1. Texto alternativo       | A     | Todas imagens com `alt`       |
| 1.3.1. Informações e relações  | A     | Labels associados a inputs    |
| 1.3.2. Sequência significativa | A     | Ordem do DOM faz sentido      |
| 1,4.1. Uso de cor              | A     | Não usar só cor para informar |
| 1.4.3. Contraste mínimo        | AA    | 4.5:1 para texto normal       |
| 1.4.4. Redimensionar texto     | AA    | Funciona até 200% zoom        |

### Operável (2.x)

| Critério                       | Nível | Implementação                     |
| ------------------------------ | ----- | --------------------------------- |
| 2.1.1. Teclado                 | A     | Tudo acessível por teclado        |
| 2.1.2. Sem bloqueio de teclado | A     | Focus pode sair de qualquer lugar |
| 2.4.1. Ignorar blocos          | A     | Skip links                        |
| 2.4.2. Página com título       | A     | `<title>` descritivo              |
| 2.4.4. Finalidade do link      | A     | Texto do link indica destino      |
| 2.4.6. Cabeçalhos e rótulos    | AA    | Headings descritivos              |
| 2.4.7. Foco visível            | AA    | `:focus-visible` estilizado       |

### Compreensível (3.x)

| Critério                     | Nível | Implementação                     |
| ---------------------------- | ----- | --------------------------------- |
| 3.1.1. Idioma da página      | A     | `<html lang="pt-BR">`             |
| 3.2.1. Em foco               | A     | Foco não muda contexto            |
| 3.2.2. Em entrada            | A     | Input não submete automaticamente |
| 3.3.1. Identificação de erro | A     | Erros identificados em texto      |
| 3.3.2. Rótulos ou instruções | A     | Labels em todos os campos         |

### Robusto (4.x)

| Critério                   | Nível | Implementação          |
| -------------------------- | ----- | ---------------------- |
| 4.1.1. Análise             | A     | HTML válido            |
| 4.1.2. Nome, função, valor | A     | ARIA quando necessário |

## Textos Alternativos

### Imagens Informativas

```typescript
// ✅ Imagem com informação
<img src="/icons/success.svg" alt="Operação concluída com sucesso" />

// ✅ Imagem decorativa
<img src="/decorative-pattern.svg" alt="" role="presentation" />

// ✅ Imagem complexa (gráfico)
<figure>
  <img src="/chat.png" alt="Gráfico de vendas" aria-describedby="chart-description" />
  <figcaption id="chart-description">Vendas aumentaram 20% no Q4, passando de R$ 100K par R$ 120K;</figcaption>
</figure>
```

### Ícones

```typescript
// ✅ Ícone decorativo (já tem texto adjacente)
<button>
  <Icon name="search" aria-hidden="true" />
  Buscar
</button>

// ✅ Ícuone como único conteúdo
<button aria-label="Buscar">
  <Icon name="search" aria-hidden="true" />
</button>

// ✅ Ícone com significado
<span>
  Status:
  <Icon name="check" aria-hidden="true" />
  <span className="sr-only">Aprovado</span>
</span>
```

## Hierarquia de Headings

```typescript
// ✅ Estrutura correta
<main>
  <h1>Cotação de Seguro Auto</h1>

  <section>
    <h2>Dados do Veículo</h2>
    <h3>Informações Básicas</h3>
    <h3>Características</h3>
  </section>

  <section>
    <h2>Dados do Condutor</h2>
    <h3>Condutor Principal</h3>
    <h3>Condutores Adicionais</h3>
  </section>
</main>

// ❌ Pular níveis
<h1>Título</h1>
<h2>Subtítulo</h2>

// ❌ Múltiplos h1
<h1>Título</h1>
<h1>Subtítulo</h1>
```

## Anúncios de Status

### Live Regions

```typescript
// Mensagem de sucesso após ação
export const succesMessage = ({ message }: { message: string }) => (
  <div role="status" aria-live="polite" aria-atomic="true">{message}</div>
)

// Mensagem de erro urgente
export const ErrorAlert = ({ error }: { error: string }) => (
  <div role="alert" aria-live="assertive">{error}</div>
)

// Contador de resultados
export const SearchResults = ({ count }: { count: number }) => (
  <div aria-live="polite">{count} resultados encontrados</div>
)
```

### Progress Indicators

```typescript
// Progress bar acessível
export const ProgressBar = ({
  current,
  total,
  label
}: ProgressBarProps) => (
  <div
    role="progressbar"
    aria-valuenow={current}
    aria-valuemin={0}
    aria-valuemax={total}
    aria-label={label}
    aria-valuetext={`${Math.round((current / total) * 100)}% completo`}
  >
    <div
      className="progress-fill"
      style=({ width: `${(current / total) * 100}%` })
    >
    </div>
  </div>
)

// Step indicador
export const StepIndicador = ({ currentStep, totalSteps }: StepProps) => (
  <nav aria-label="Progresso do formulário">
    <p className="sr-only">
      Passo {currentStep} de {totalSteps}
    </p>
    <ol>
      { Array.from({ length: totalSteps}, (_, i) => (
        <li
          key={i}
          aria-current={i + 1 === currentStep ? 'step' : undefined}
        >
          Passo { i + 1 }
        </li>
      )) }
    </ol>
  </nav>
)
```

## Tabelas Acessíveis

```typescript
export const DataTable = ({ data, columns }: TableProps) => (
  <table>
    <caption>Lista de planos disponíveis</caption>
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.key} scope="row">
            {row[col.key]}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={col.key}>
          {columns.map((col, index) => (
            index === 0 ? (
              <th key={col.key} scope="row">
                {row[col.key]}
              </th>
            ) : (
              <th key={col.key}>
                {row[col.key]}
              </th>
            )
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
```

## Contraste de Cores

### Cores do Projeto com Contraste

```scss
// Verificar contraste mínimo:
// - Texto normal: 4.5:1
// - Texto grande (18px+ bold ou 24px+)
// - UI components: 3:1

// ✅ Bom contraste
$color-text-primary: #1a1a1a; // Em fundo branco: ~16:1
$color-text-secondary: #595959; // Em fundo branco: ~7:1
$color-brand-900: #004080; // Em fundo branco: ~7.5:1

// ⚠️ Verificar
$color-placeholder: #999999; // Em fundo branco: ~3.5:1 (ok para UI, não para texto informativo)
```

### Indicadores de Estado

```bash
// ❌ Apenas cor
<span className={isValid ? 'green' : 'red'}>
  {message}
</span>

// ❎ Cor + Ícone + Texto
<span className={isValid ? 'success' : 'red'}>
  <Icon name={isValid ? 'check' : 'alert'} aria-hidden="true">
  {isValid ? 'Válido' : 'Inválido'}: {message}
</span>
```

## Testes de Acessibilidade

### Ferramentas Recomendadas

```bash
# axe-core para testes automatizados
npm install --save-dev @axe-core/react

# Jest-axe para testes unitários
npm install --save-dev jest-axe
```

### Teste Automatizado

```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  it('Input should have no accessibility violations', async () => {
    const { container } = render(
      <Input
        name="email"
        label="Email"
        errorMessage="Email inválido"
      />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Checklist Manual

- [ ] Navegar apenas com teclado (Tab, Shift+Tab, Enter, Escape, setas)
- [ ] Testar com NVDA/VoiceOver/JAWS
- [ ] Verificar zoom até 200%
- [ ] Testar com cores invertidas
- [ ] Verificar em modo de alto contraste
- [ ] Desativar CSS e verificar estrutura
- [ ] Verificar com extensão axe DevTools
