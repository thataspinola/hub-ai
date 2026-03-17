import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLDivElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <div ref={ref} {...rest}>{children}</div>
    }),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill: _f, priority: _p, ...rest } = props
    return <img {...rest} />
  },
}))

import { RecEngineConfig } from '@/components/portal-admin/RecEngineConfig'

describe('RecEngineConfig', () => {
  it('renders the heading', () => {
    render(<RecEngineConfig />)
    expect(screen.getByText(/RecEngine/)).toBeInTheDocument()
  })

  it('renders logic options', () => {
    render(<RecEngineConfig />)
    expect(screen.getByText('Comprados Frequentemente Juntos')).toBeInTheDocument()
    expect(screen.getByText('Personalizado para Você')).toBeInTheDocument()
    expect(screen.getByText('Tendências Atuais')).toBeInTheDocument()
  })

  it('renders save button', () => {
    render(<RecEngineConfig />)
    expect(screen.getByText('Salvar e Implantar')).toBeInTheDocument()
  })

  it('renders logic rules section', () => {
    render(<RecEngineConfig />)
    expect(screen.getByText(/Regras de Lógica/)).toBeInTheDocument()
  })
})
