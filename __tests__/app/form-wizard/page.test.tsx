import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) { return (
    <a href={href} {...props}>{children}</a>
  ) }
})

import FormWizardListPage from '@/app/form-wizard/page'
import { saveForm } from '@/lib/form-wizard/forms-storage'
import type { Form } from '@/lib/form-wizard/types'

const testForm: Form = {
  id: 'test-1',
  name: 'My Test Form',
  slug: 'my-test-form',
  steps: [
    {
      id: 's1',
      name: 'Step 1',
      slug: 'step-1',
      order: 0,
      elements: [
        { id: 'e1', type: 'TITLE', order: 0, config: { text: 'Welcome', size: 'lg' } },
        { id: 'e2', type: 'TEXT_INPUT', order: 1, config: { label: 'Name', placeholder: 'Enter name', required: true, name: 'field_name' } },
        { id: 'e3', type: 'NAVIGATION', order: 2, config: { label: 'Next', url: '/step-2' } },
      ],
    },
    {
      id: 's2',
      name: 'Step 2',
      slug: 'step-2',
      order: 1,
      backStepSlug: 'step-1',
      elements: [],
    },
  ],
  createdAt: '2025-06-01T00:00:00.000Z',
  updatedAt: '2025-06-01T12:00:00.000Z',
}

beforeEach(() => {
  localStorage.clear()
})

describe('FormWizardListPage', () => {
  it('shows empty state when no forms exist', () => {
    render(<FormWizardListPage />)
    expect(screen.getByText('Nenhum formulário ainda')).toBeInTheDocument()
  })

  it('shows the page header', () => {
    render(<FormWizardListPage />)
    expect(screen.getByText('Form Wizard Builder')).toBeInTheDocument()
    expect(screen.getByText('Gerencie seus formulários wizard')).toBeInTheDocument()
  })

  it('renders "Novo Form" link', () => {
    render(<FormWizardListPage />)
    const links = screen.getAllByText('Novo Form')
    expect(links.length).toBeGreaterThan(0)
    const link = links[0].closest('a')
    expect(link).toHaveAttribute('href', '/form-wizard/new')
  })

  it('lists saved forms', () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    expect(screen.getByText('My Test Form')).toBeInTheDocument()
    expect(screen.getByText('/my-test-form')).toBeInTheDocument()
  })

  it('shows step count', () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    expect(screen.getByText('2 steps')).toBeInTheDocument()
  })

  it('has edit link for each form', () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    const editLink = screen.getByTitle('Editar')
    expect(editLink.closest('a')).toHaveAttribute('href', '/form-wizard/my-test-form')
  })

  it('opens delete confirmation dialog', () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    fireEvent.click(screen.getByTitle('Delete'))
    expect(screen.getByText('Excluir Formulário')).toBeInTheDocument()
  })

  it('deletes form after confirmation', async () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    fireEvent.click(screen.getByTitle('Delete'))
    fireEvent.click(screen.getByText('Excluir'))
    await waitFor(() => {
      expect(screen.getByText('Nenhum formulário ainda')).toBeInTheDocument()
    })
  })

  it('duplicates a form', () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    fireEvent.click(screen.getByTitle('Duplicate'))
    const cards = screen.getAllByText(/My Test Form/)
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('opens journey preview dialog', async () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    fireEvent.click(screen.getByTitle('Visualizar Jornada'))
    await waitFor(() => {
      expect(screen.getByText(/Jornada:/)).toBeInTheDocument()
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
    })
  })

  it('shows element details in preview', async () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    fireEvent.click(screen.getByTitle('Visualizar Jornada'))
    await waitFor(() => {
      expect(screen.getByText('Título')).toBeInTheDocument()
      expect(screen.getByText('Campo de Texto')).toBeInTheDocument()
      expect(screen.getByText('Navegação')).toBeInTheDocument()
    })
  })

  it('shows back step in preview', async () => {
    saveForm(testForm)
    render(<FormWizardListPage />)
    fireEvent.click(screen.getByTitle('Visualizar Jornada'))
    await waitFor(() => {
      expect(screen.getByText('← /step-1')).toBeInTheDocument()
    })
  })
})
