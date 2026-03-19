/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock heavy sub-components and the form store
// Use relative paths to avoid @/ alias resolution issue in jest.mock hoisting
// Path: __tests__/components/wizard-builder/ → ../../../ = workspace root → src/
jest.mock('../../../src/components/wizard-builder/component-library', () => ({
  ComponentLibrary: () => <div data-testid="component-library" />,
}))

jest.mock('../../../src/components/wizard-builder/step-canvas', () => ({
  StepCanvas: () => <div data-testid="step-canvas" />,
}))

jest.mock('../../../src/components/wizard-builder/properties-panel', () => ({
  PropertiesPanel: () => <div data-testid="properties-panel" />,
}))

jest.mock('../../../src/components/wizard-builder/toolbar', () => ({
  Toolbar: () => <div data-testid="toolbar" />,
}))

const mockSelectStep = jest.fn()
const mockSaveFormToStorage = jest.fn()

jest.mock('../../../src/lib/form-wizard/form-store', () => ({
  useFormStore: (selector: (s: unknown) => unknown) => {
    const state = {
      form: { steps: [{ id: 'step-1', name: 'Step 1' }] },
      selectStep: mockSelectStep,
      selectedStepId: null,
      saveFormToStorage: mockSaveFormToStorage,
    }
    return selector(state)
  },
}))

import { WizardBuilder } from '@/components/wizard-builder'

describe('WizardBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all sub-panels', () => {
    render(<WizardBuilder />)
    expect(screen.getByTestId('toolbar')).toBeInTheDocument()
    expect(screen.getByTestId('component-library')).toBeInTheDocument()
    expect(screen.getByTestId('step-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('properties-panel')).toBeInTheDocument()
  })

  it('calls selectStep on mount when no step is selected', () => {
    render(<WizardBuilder />)
    expect(mockSelectStep).toHaveBeenCalledWith('step-1')
  })

  it('calls saveFormToStorage on unmount', () => {
    const { unmount } = render(<WizardBuilder />)
    unmount()
    expect(mockSaveFormToStorage).toHaveBeenCalled()
  })

  it('calls saveFormToStorage when page is hidden', () => {
    render(<WizardBuilder />)
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    })
    document.dispatchEvent(new Event('visibilitychange'))
    expect(mockSaveFormToStorage).toHaveBeenCalled()
  })
})
