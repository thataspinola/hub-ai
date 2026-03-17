import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLDivElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <div ref={ref} {...rest}>{children}</div>
    }),
    button: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLButtonElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <button ref={ref} {...rest}>{children}</button>
    }),
    span: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLSpanElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <span ref={ref} {...rest}>{children}</span>
    }),
    tr: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLTableRowElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <tr ref={ref} {...rest}>{children}</tr>
    }),
    p: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLParagraphElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <p ref={ref} {...rest}>{children}</p>
    }),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill: _f, priority: _p, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />
  },
}))

import { FeatureFlags } from '@/components/portal-admin/FeatureFlags'

beforeEach(() => {
  localStorage.clear()
})

describe('FeatureFlags', () => {
  it('renders the heading', () => {
    render(<FeatureFlags />)
    expect(screen.getByText('Feature Flags')).toBeInTheDocument()
  })

  it('renders feature flags from default data', () => {
    render(<FeatureFlags />)
    expect(screen.getByPlaceholderText('Buscar flags por nome ou chave...')).toBeInTheDocument()
  })

  it('renders status filter dropdown', () => {
    render(<FeatureFlags />)
    expect(screen.getByText('Todos os Status')).toBeInTheDocument()
  })

  it('opens modal on add click', () => {
    render(<FeatureFlags />)
    const addBtns = screen.getAllByRole('button')
    const addBtn = addBtns.find(b => b.textContent?.includes('Criar'))
    if (addBtn) {
      fireEvent.click(addBtn)
      expect(screen.getByText('Nova Feature Flag')).toBeInTheDocument()
    }
  })

  it('filters flags by search', () => {
    render(<FeatureFlags />)
    const search = screen.getByPlaceholderText('Buscar flags por nome ou chave...')
    fireEvent.change(search, { target: { value: 'xyznonexistent' } })
    expect(screen.getByText('Nenhuma flag encontrada')).toBeInTheDocument()
  })
})
