/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockRouterPush = jest.fn()
const mockRouterReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush, replace: mockRouterReplace }),
  useParams: () => mockParams,
}))

let mockParams: { formSlug: string } = { formSlug: 'test-form' }

const mockLoadForm = jest.fn()
const mockResetForm = jest.fn()
const mockSaveFormToStorage = jest.fn()

jest.mock('../../../src/lib/form-wizard/form-store', () => ({
  useFormStore: (selector: (s: unknown) => unknown) => {
    const state = {
      loadForm: mockLoadForm,
      resetForm: mockResetForm,
      saveFormToStorage: mockSaveFormToStorage,
      form: {
        id: 'form-1',
        slug: 'test-form',
        name: 'Test Form',
        steps: [],
      },
    }
    return selector(state)
  },
}))

const mockGetFormBySlug = jest.fn()
const mockGetFormsIndex = jest.fn().mockReturnValue([])
const mockGenerateFormSlug = jest.fn().mockReturnValue('new-form')

jest.mock('../../../src/lib/form-wizard/forms-storage', () => ({
  getFormBySlug: (...args: unknown[]) => mockGetFormBySlug(...args),
  getFormsIndex: (...args: unknown[]) => mockGetFormsIndex(...args),
  generateFormSlug: (...args: unknown[]) => mockGenerateFormSlug(...args),
}))

// Mock WizardBuilder to avoid heavy component rendering
jest.mock('../../../src/components/wizard-builder', () => ({
  WizardBuilder: () => <div data-testid="wizard-builder" />,
}))

import EditFormPage from '@/app/form-wizard/[formSlug]/page'

describe('EditFormPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockParams = { formSlug: 'test-form' }
    mockGetFormsIndex.mockReturnValue([])
  })

  it('shows loading state initially when form exists', async () => {
    mockGetFormBySlug.mockReturnValue({
      id: 'form-1',
      slug: 'test-form',
      name: 'Test Form',
      steps: [],
    })
    render(<EditFormPage />)
    // After data loads, WizardBuilder should be shown
    expect(screen.getByTestId('wizard-builder')).toBeInTheDocument()
  })

  it('shows not found state when form does not exist', () => {
    mockGetFormBySlug.mockReturnValue(null)
    render(<EditFormPage />)
    expect(screen.getByText('Form Not Found')).toBeInTheDocument()
  })

  it('navigates back to form-wizard on "Go back" click', () => {
    mockGetFormBySlug.mockReturnValue(null)
    render(<EditFormPage />)
    const goBackBtn = screen.getByText('Go back to forms list')
    goBackBtn.click()
    expect(mockRouterPush).toHaveBeenCalledWith('/form-wizard')
  })

  it('renders NewFormHandler for "new" slug with loading state', async () => {
    mockParams = { formSlug: 'new' }
    mockGetFormsIndex.mockReturnValue([])
    render(<EditFormPage />)
    // NewFormHandler shows a loading state while setting up the new form
    expect(screen.getByText('Creating new form...')).toBeInTheDocument()
  })
})
