import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

describe('Page', () => {
  it('renders a 🚀 Este é um template Next.js (SSR)', () => {
    render(<Page />);
    const text = screen.getByText('🚀 Este é um template Next.js (SSR)');
    expect(text).toBeInTheDocument()
  })
})
