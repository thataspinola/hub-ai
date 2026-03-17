import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLDivElement>) => {
      const { initial: _i, animate: _a, exit: _e, whileHover: _wh, whileTap: _wt, transition: _t, layout: _l, variants: _v, ...rest } = props
      return <div ref={ref} {...rest}>{children}</div>
    }),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

import { CampaignRules } from '@/components/portal-admin/CampaignRules'

describe('CampaignRules', () => {
  it('renders heading', () => {
    render(<CampaignRules />)
    expect(screen.getByText('Campanhas de Recomendacao')).toBeInTheDocument()
  })

  it('renders add campaign button', () => {
    render(<CampaignRules />)
    expect(screen.getByText(/Nova Campanha/)).toBeInTheDocument()
  })
})
