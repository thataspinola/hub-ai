import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

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
    p: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLParagraphElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <p ref={ref} {...rest}>{children}</p>
    }),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

import { PilotPrograms } from '@/components/portal-admin/PilotPrograms'

beforeEach(() => {
  localStorage.clear()
})

describe('PilotPrograms', () => {
  it('renders the heading', () => {
    render(<PilotPrograms />)
    expect(screen.getByText('Programas Piloto')).toBeInTheDocument()
  })

  it('renders add button', () => {
    render(<PilotPrograms />)
    expect(screen.getByText(/Criar Novo Segmento/)).toBeInTheDocument()
  })

  it('renders pilot program progress', () => {
    render(<PilotPrograms />)
    const items = screen.getAllByText(/Progresso/)
    expect(items.length).toBeGreaterThan(0)
  })

  it('opens modal for new pilot', () => {
    render(<PilotPrograms />)
    const btn = screen.getByText('Novo Programa')
    fireEvent.click(btn)
    expect(screen.getByText('Novo Programa Piloto')).toBeInTheDocument()
  })
})
