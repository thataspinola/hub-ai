/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Switch } from '@/components/ui/switch'

describe('Switch', () => {
  it('renders without crashing', () => {
    render(<Switch />)
    const el = document.querySelector('[data-slot="switch"]')
    expect(el).toBeInTheDocument()
  })

  it('renders unchecked by default', () => {
    render(<Switch />)
    const el = document.querySelector('[data-slot="switch"]')
    expect(el).toHaveAttribute('data-state', 'unchecked')
  })

  it('renders checked when defaultChecked is true', () => {
    render(<Switch defaultChecked />)
    const el = document.querySelector('[data-slot="switch"]')
    expect(el).toHaveAttribute('data-state', 'checked')
  })

  it('applies custom className', () => {
    render(<Switch className="my-custom-class" />)
    const el = document.querySelector('[data-slot="switch"]')
    expect(el).toHaveClass('my-custom-class')
  })

  it('renders disabled state', () => {
    render(<Switch disabled />)
    const el = document.querySelector('[data-slot="switch"]')
    expect(el).toBeDisabled()
  })

  it('renders the thumb element', () => {
    render(<Switch />)
    const thumb = document.querySelector('[data-slot="switch-thumb"]')
    expect(thumb).toBeInTheDocument()
  })
})
