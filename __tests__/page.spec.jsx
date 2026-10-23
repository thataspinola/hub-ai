import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Mock motion/react
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial: _initial, animate: _animate, exit: _exit, whileHover: _whileHover, whileTap: _whileTap, transition: _transition, layout: _layout, ...rest } = props
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
