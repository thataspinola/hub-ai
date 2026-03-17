import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Mock motion/react to avoid animation issues in tests
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, ...rest } = props
      return <div {...rest}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

import { Dashboard } from '@/components/portal-admin/Dashboard'

describe('Dashboard', () => {
  it('renders the heading', () => {
    render(<Dashboard />)
    expect(screen.getByText('Visão Geral do Aplicativo')).toBeInTheDocument()
  })

  it('renders metric cards', () => {
    render(<Dashboard />)
    expect(screen.getByText('Flags Ativas')).toBeInTheDocument()
    expect(screen.getByText('Programas Piloto')).toBeInTheDocument()
    expect(screen.getByText('Conversão de Promo')).toBeInTheDocument()
    expect(screen.getByText('Saúde do Sistema')).toBeInTheDocument()
  })

  it('renders feature flags section', () => {
    render(<Dashboard />)
    expect(screen.getByText('Flags de Recursos Críticos')).toBeInTheDocument()
  })

  it('renders Nova Flag button', () => {
    render(<Dashboard />)
    expect(screen.getByText('Nova Flag')).toBeInTheDocument()
  })
})
