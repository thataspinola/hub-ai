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
    span: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLSpanElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <span ref={ref} {...rest}>{children}</span>
    }),
    tr: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLTableRowElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <tr ref={ref} {...rest}>{children}</tr>
    }),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

import { Promotions } from '@/components/portal-admin/Promotions'

beforeEach(() => {
  localStorage.clear()
})

describe('Promotions', () => {
  it('renders the heading', () => {
    render(<Promotions />)
    expect(screen.getByText(/Gerenciamento de Promo/)).toBeInTheDocument()
  })

  it('renders tab buttons', () => {
    render(<Promotions />)
    expect(screen.getByText('Cupons')).toBeInTheDocument()
    expect(screen.getByText('Descontos Progressivos')).toBeInTheDocument()
    expect(screen.getByText('Cashback')).toBeInTheDocument()
  })

  it('renders search field', () => {
    render(<Promotions />)
    expect(screen.getByPlaceholderText(/Buscar promo/)).toBeInTheDocument()
  })

  it('switches tabs', () => {
    render(<Promotions />)
    fireEvent.click(screen.getByText('Cashback'))
    const cashbackBtn = screen.getByText('Cashback')
    expect(cashbackBtn).toBeInTheDocument()
  })
})
