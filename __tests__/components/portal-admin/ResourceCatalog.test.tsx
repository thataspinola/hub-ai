import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { ResourceCatalog } from '@/components/portal-admin/ResourceCatalog'

describe('ResourceCatalog', () => {
  it('shows the Next profile and filters resources without executing a review', () => {
    render(<ResourceCatalog />)
    expect(screen.getByRole('heading', { name: 'Code Reviewer' })).toBeInTheDocument()
    expect(screen.getByLabelText('Perfil')).toHaveValue('nextjs')
    expect(screen.getByRole('heading', { name: 'nextjs-patterns' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Buscar recursos'), { target: { value: 'no-matching-resource' } })
    expect(screen.getByRole('status')).toHaveTextContent('0 recursos encontrados')
  })
  it('selects Node resources and updates the install command', () => {
    render(<ResourceCatalog />)
    fireEvent.change(screen.getByLabelText('Perfil'), { target: { value: 'node' } })
    expect(screen.getByRole('heading', { name: 'Node Code Reviewer' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'nextjs-patterns' })).not.toBeInTheDocument()
    expect(screen.getByText(/node tools\/code-reviewer.cjs setup/)).toHaveTextContent('--profile node')
  })
})
