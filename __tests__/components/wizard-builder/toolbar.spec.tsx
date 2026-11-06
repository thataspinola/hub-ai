/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockSetFormName = jest.fn()
const mockSetFormSlug = jest.fn()
const mockGetValidationErrors = jest.fn().mockReturnValue([])
const mockExportForm = jest.fn().mockReturnValue('{"id": "form-1"}')
const mockImportForm = jest.fn().mockReturnValue(true)
const mockResetForm = jest.fn()
const mockSaveFormToStorage = jest.fn()

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href}>{children}</a>,
}))

// Mock form-store with relative path
jest.mock('../../../src/lib/form-wizard/form-store', () => ({
  useFormStore: (selector: (s: unknown) => unknown) => {
    const state = {
      form: { id: 'f1', name: 'My Form', slug: 'my-form', steps: [] },
      setFormName: mockSetFormName,
      setFormSlug: mockSetFormSlug,
      getValidationErrors: mockGetValidationErrors,
      exportForm: mockExportForm,
      importForm: mockImportForm,
      resetForm: mockResetForm,
      saveFormToStorage: mockSaveFormToStorage,
    }

    return selector(state)
  },
  validateSlug: jest.fn().mockReturnValue({ valid: true }),
}))

// Mock forms-storage
jest.mock('../../../src/lib/form-wizard/forms-storage', () => ({
  getFormsIndex: jest.fn().mockReturnValue([]),
}))

// Mock URL methods
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn().mockReturnValue('blob:url'),
})

Object.defineProperty(URL, 'revokeObjectURL', { value: jest.fn() })

import { Toolbar } from '@/components/wizard-builder/toolbar'

describe('Toolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetValidationErrors.mockReturnValue([])
    mockImportForm.mockReturnValue(true)
  })

  it('renders the form name input', () => {
    render(<Toolbar />)
    expect(screen.getByPlaceholderText('Form name')).toBeInTheDocument()
  })

  it('renders the slug input', () => {
    render(<Toolbar />)
    expect(screen.getByPlaceholderText('form-slug')).toBeInTheDocument()
  })

  it('renders Valid badge when form is valid', () => {
    render(<Toolbar />)
    expect(screen.getByText('Valid')).toBeInTheDocument()
  })

  it('renders issues badge when form has errors', () => {
    mockGetValidationErrors.mockReturnValue([
      { message: 'Error 1' },
      { message: 'Error 2' },
    ])

    render(<Toolbar />)
    expect(screen.getByText(/2 issues/i)).toBeInTheDocument()
  })

  it('renders Save button', () => {
    render(<Toolbar />)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('calls saveFormToStorage when Save is clicked', () => {
    render(<Toolbar />)
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(mockSaveFormToStorage).toHaveBeenCalled()
  })

  it('calls exportForm when Export button is clicked', () => {
    // Create a temp anchor mock
    const mockClick = jest.fn()

    jest.spyOn(document, 'createElement').mockImplementationOnce(() => {
      const el = document.createElement('a')
      el.click = mockClick
      return el
    })

    render(<Toolbar />)
    const exportBtn = screen.getByRole('button', { name: /export/i })
    fireEvent.click(exportBtn)
    expect(mockExportForm).toHaveBeenCalled()
  })

  it('renders back link to form-wizard', () => {
    render(<Toolbar />)
    const backLink = screen.getByRole('link')
    expect(backLink).toHaveAttribute('href', '/form-wizard')
  })

  it('updates form name on input change', () => {
    render(<Toolbar />)
    const nameInput = screen.getByPlaceholderText('Form name')
    fireEvent.change(nameInput, { target: { value: 'New Form Name' } })
    expect(mockSetFormName).toHaveBeenCalledWith('New Form Name')
  })

  it('updates form slug on input change', () => {
    render(<Toolbar />)
    const slugInput = screen.getByPlaceholderText('form-slug')
    fireEvent.change(slugInput, { target: { value: 'new-slug' } })
    expect(mockSetFormSlug).toHaveBeenCalledWith('new-slug')
  })

  it('strips invalid characters from slug', () => {
    render(<Toolbar />)
    const slugInput = screen.getByPlaceholderText('form-slug')
    fireEvent.change(slugInput, { target: { value: 'My Slug!@#' } })
    // Strips non [a-z0-9-] chars: spaces and special chars are removed, not replaced
    expect(mockSetFormSlug).toHaveBeenCalledWith('myslug')
  })

  it('renders Export and Reset buttons', () => {
    render(<Toolbar />)
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('opens import dialog when Import button is clicked', () => {
    render(<Toolbar />)
    // Find the trigger button (text "Import", initially only one before dialog opens)
    const importBtns = screen.getAllByRole('button', { name: /^import$/i })
    fireEvent.click(importBtns[0])
    // Dialog should appear with a textarea
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
