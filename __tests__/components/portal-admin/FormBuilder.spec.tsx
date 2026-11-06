import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(function MockElement1(
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLDivElement>
    ) {
      const {
        initial: _i,
        animate: _a,
        exit: _e,
        whileHover: _wh,
        whileTap: _wt,
        transition: _t,
        layout: _l,
        variants: _v,
        ...rest
      } = props

      return (
        <div ref={ref} {...rest}>
          {children}
        </div>
      )
    }),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

import { FormBuilder } from '@/components/portal-admin/FormBuilder'

describe('FormBuilder', () => {
  it('renders element categories', () => {
    render(<FormBuilder />)
    expect(screen.getByText('Elementos Básicos')).toBeInTheDocument()
    expect(screen.getByText('Elementos Avançados')).toBeInTheDocument()
  })

  it('renders element items', () => {
    render(<FormBuilder />)
    expect(screen.getByText('Entrada de Texto')).toBeInTheDocument()
    expect(screen.getByText('Menu Suspenso')).toBeInTheDocument()
    expect(screen.getByText('Caixa de Seleção')).toBeInTheDocument()
  })

  it('renders properties tab', () => {
    render(<FormBuilder />)
    expect(screen.getByText('Propriedades')).toBeInTheDocument()
  })
})
