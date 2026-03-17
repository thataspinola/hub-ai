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

import { RulesConfig } from '@/components/portal-admin/RulesConfig'

describe('RulesConfig', () => {
  it('renders widget config section', () => {
    render(<RulesConfig />)
    expect(screen.getByText(/Configurações do Widget/)).toBeInTheDocument()
  })

  it('renders the script section', () => {
    render(<RulesConfig />)
    expect(screen.getByText(/Script para incorporar/)).toBeInTheDocument()
  })

  it('renders the form with Recomendacoes default', () => {
    render(<RulesConfig />)
    expect(screen.getByDisplayValue('Recomendacoes')).toBeInTheDocument()
  })
})
