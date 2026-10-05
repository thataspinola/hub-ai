---
name: accessibility
description: 'Acessibilidade para aplicações web. Use para: ARIA attributes, semântica HTML, formulários acessíveis, navegação por teclado,, screen readers, WCAG compliance. Keywords: acessibilidade, accessibilitym a11y, aria, wcag, screen reader, keyboard navigation, semantic html, forms, inclusive design.'
---

# Acessibilidade


> Referência reutilizável: confirme stack, versões, scripts e arquivos no projeto alvo antes de aplicar. Os caminhos e exemplos abaixo não comprovam uma implementação existente.

## Modo de Responsta

**Default**: checklist de problemas encontrados + 1 correção de exemplo. Só gerar implementação completa quando o usuário pedir.

### Quando Usar

- Criar formulários acessíveis
- Implementar navegação por teclado
- Adicionar atributos ARIA
- Garantir compatibilidade com screen readers
- Revisar componentes para WCAG compliance

## Padrões de Referência

### Input Acessível

Use esta padrão como referência ao criar ou revisar inputs. Não assuma que um componente existente já implementa todos os vínculos ARIA corretamente: valide sempre se `label`, `htmlFor`, `aria-describedby`, `id` da mensagem e anúncio de erro estão realmente conectados no DOM.

```typescript
// src/components/ui/Input/index.tsx
<input
  id={name} // ID para label
  aria-invalid={isError} // Estado de erro
  aria-describedby={isError ? `${name}-error` : undefined} // Mensagem de erro
  aria-busy={isLoading} // Estado de carregamento
/>

{label && (
  <label htmlFor={name} className="input__label">
    {label}
  </label>
)}

{isError && (
  <span id={`${name}-error`} className="input__error" role="alert">
    {errorMessage}
  </span>
)}
```

### Checklist de Validação Rápida

- [ ] `label` aponta para o mesmo `id` do input
- [ ] `aria-describedby` referencia um elemento que existe
- [ ] Erro visível também é anunciado para tecnologias assistivas (ex: `role="alert"`)
- [ ] Estados dinâmicos (`loading`, `expanded`, `invalid`) estão expostos via ARIA

## ARIA Essenciais

| Atributo           | Uso                              | Exemplo                                                 |
| ------------------ | -------------------------------- | ------------------------------------------------------- |
| `aria-label`       | Label invisível                  | `<button aria-label="Fechar modal">X</button>`          |
| `aria-labelledby`  | Referência a um elemento visível | `<div aria-labelledby="title-id">Título</div>`          |
| `aria-describedby` | Descrição adicional              | `<input aria-describedby="hint-id" />`                  |
| `aria-invalid`     | Campo com erro                   | `<input aria-invalid="true" />`                         |
| `aria-required`    | Campo obrigatório                | `<input aria-required="true" />`                        |
| `aria-disabled`    | Elemento desabilitado            | `<button aria-disabled="true" />`                       |
| `aria-busy`        | Carregando                       | `<div aria-busy="true">Carregando...</div>`             |
| `aria-live`        | Região dinâmica                  | `<div aria-live="polite">Mensagem de atualização</div>` |
| `aria-expanded`    | Expandido/colapsado              | `<button aria-expanded="true">Mostrar mais</button>`    |
| `aria-hidden`      | Oculto do screen reader          | `<div aria-hidden="true">Conteúdo oculto</div>`         |

### Roles

| Role          | Uso                       | Exemplo                                                                                   |
| ------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| `alert`       | Mensagem de erro/sucesso  | `<div role="alert">Erro ao salvar</div>`                                                  |
| `alertdialog` | Dialogs que requerem ação | `<div role="alertdialog">Confirmação</div>`                                               |
| `dialog`      | Janela modal              | `<div role="dialog">Modal</div>`                                                          |
| `navigation`  | Áreas de navegação        | `<nav role="navigation">Menu</nav>`                                                       |
| `main`        | Conteúdo principal        | `<main role="main">Conteúdo</main>`                                                       |
| `search`      | Formulário de busca       | `<form role="search">Buscar</form>`                                                       |
| `status`      | Atualizações de status    | `<div role="status">Carregando...</div>`                                                  |
| `progressbar` | Indicador de progresso    | `<div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>` |

## Formulários Acessíveis

### Estrutura Completa

```typescript
interface AccessibleInputProps {
  name: string
  label: string
  errorMessage?: string
  helperText?: string
  required?: boolean
}

export const AcessibleInput = ({
  name,
  label,
  errorMessage,
  helperText,
  required = false,
  ...props
}: AccessibleInputProps) => {
  const hasError = Boolean(errorMessage)
  const helperId = helperText && !hasError ? `${name}-helper` : undefined
  const errorId = hasError ? `${name}-error` : undefined

  // Combina ID's para aria-describedby
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (obrigatório)</span>}
      </label>

      <input
        id={name}
        name={name}
        aria-invalid={hasError}
        aria-describedby={
          describedBy
        }
        aria-required={required}
        {...props}
      />

      {helperText && !hasError && (
        <span id={`${name}-helper`} className="input__helper">
          {helperText}
        </span>
      )}

      {hasError && (
        <span id={`${name}-error`} className="input__error" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
```

### Grupo de Radio/Checkbox

```typescript
export const RadioGroup = ({
  legend,
  name,
  options,
  value,
  onChange,
  errorMessage,
}: RadioGroupProps) => {
  const hasError = Boolean(errorMessage)

  return (
    <fieldset aria-describedby={hasError ? `${name}-error` : undefined}>
      <legend>{legend}</legend>

      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            aria-invalid={hasError}
          />
          {option.label}
        </label>
      ))}

      {hasError && (
        <span id={`${name}-error`} className="input__error" role="alert">
          {errorMessage}
        </span>
      )}
    </fieldset>
  )
}
```

## Navegação por Teclado

### Focus Management

```typescript
//Hook para focus trap em modals
export const useFocusTrap = (isOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const focusableElements =
      containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus no primeiro elemento
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return containerRef
}
```

### Skip Links

```typescript
// Componente de skip link
export const SkipLink = () => (
  <a href="#main-content" className="skip-link">
    Pular para o conteúdo principal
    // CSS: position, absolute, top: -100px, focus: top: 0
  </a>
)

// No layout
<SkipLink />
<Header />
<main id="main-content" tabIndex={-1}>
  {/* Conteúdo principal */}
  {children}
</main>
```

## Modal Acessível

```typescript
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  const containerRef = useFocusTrap(isOpen)
  const titleId = useId()

  // Escape para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevenir scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} ref={containerRef}>
      <h2 id={titleId}>{title}</h2>
      <button onClick={onClose} aria-label="Fechar modal">
        X
      </button>
      {children}
    </div>
  )
}
```

## Loading States

```typescript
// Indicador de loading acessível
export const LoadingSpinner = ({ label = 'Carregando...' }: { label?: string }) => (
  <div role="status" aria-live="polite">
    <span className="spinner" aria-hidden="true"></span>
    <span className="sr-only">{label}</span>
  </div>
)

// Skeleton com aria
export const Skeleton = () => (
  <div className="skeleton" aria-busy="true" aria-label="Carregando conteúdo" aria-hidden="true"></div>
)
```

### CSS para Acessibilidade

```scss
// Classe para conteúdo visível apenas para screen readers
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Focus visible para navegação por teclado
:focus-visible {
  outline: 2px solid var(--color-brand-insurance-900);
  outline-offset: 2px;
}

// Respeitar preferências de redução de movimento
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

// Alto contraste para usuários com deficiência visual
@media (prefers-contrast: high) {
  .btn {
    border: 2px solid currentColor;
  }
}
```

## Referências

- [Padrões detalhados de acessibilidade](references/patterns.md)

