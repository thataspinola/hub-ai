/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({ usePathname: () => '/' }))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock next-auth/react so the Auth component renders correctly without Keycloak
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

import Navbar from '@/components/navbar'

describe('Navbar', () => {
  it('renders nav element with banner role', () => {
    render(<Navbar />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders Clientes link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /Clientes/i })).toBeInTheDocument()
  })

  it('renders Recomendações link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /Recomendações/i })).toBeInTheDocument()
  })

  it('renders Portal Admin link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /Portal Admin/i })).toBeInTheDocument()
  })

  it('renders the Auth component', () => {
    render(<Navbar />)
    // Auth is rendered inline - Login link should appear for unauthenticated user
    expect(screen.getByText('Login corporativo')).toBeInTheDocument()
  })

  it('renders brand home link', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link')
    const logoLink = links.find(l => l.getAttribute('href') === '/')
    expect(logoLink).toBeInTheDocument()
  })
})

it('links to the existing application routes', () => {
  render(<Navbar />)
  const routes = {
    'Clientes': '/clientes',
    'Recomendações': '/recommendations',
    'Portal Admin': '/',
    'Feature Flags': '/feature-flags',
    'Formulários': '/form-wizard',
    'Code Reviewer': '/code-reviewer',
  }
  for (const [name, href] of Object.entries(routes)) {
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  }
})
