/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Footer from '@/components/footer'

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders brand text', () => {
    render(<Footer />)
    expect(screen.getByText(/Tech Store/i)).toBeInTheDocument()
  })
})
