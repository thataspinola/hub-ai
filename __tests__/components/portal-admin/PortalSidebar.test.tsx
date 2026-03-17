import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { PortalSidebar } from '@/components/portal-admin/PortalSidebar'

describe('PortalSidebar', () => {
  it('renders the app title', () => {
    render(<PortalSidebar />)
    expect(screen.getByText('PortalAdm')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(<PortalSidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Feature Flags')).toBeInTheDocument()
    expect(screen.getByText('Pilotos')).toBeInTheDocument()
    expect(screen.getByText('Promoções')).toBeInTheDocument()
    expect(screen.getByText('RecEngine')).toBeInTheDocument()
    expect(screen.getByText('Form Wizard')).toBeInTheDocument()
    expect(screen.getByText('Regras')).toBeInTheDocument()
  })

  it('renders nav links with correct hrefs', () => {
    render(<PortalSidebar />)
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('href', '/')
    const formWizardLink = screen.getByText('Form Wizard').closest('a')
    expect(formWizardLink).toHaveAttribute('href', '/form-wizard')
  })

  it('renders user info section', () => {
    render(<PortalSidebar />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Administrador do Sistema')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(<PortalSidebar />)
    expect(screen.getByText('Sair do Sistema')).toBeInTheDocument()
  })

  it('highlights the active route', () => {
    render(<PortalSidebar />)
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink?.className).toContain('indigo')
  })
})
