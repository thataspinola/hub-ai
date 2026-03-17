import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, whileHover, whileTap, transition, layout, ...rest } = props
      return <div {...rest}>{children}</div>
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

import Page from '../src/app/page'

describe('Page', () => {
  it('renders the Dashboard component', () => {
    render(<Page />)
    expect(screen.getByText('Visão Geral do Aplicativo')).toBeInTheDocument()
  })
})
