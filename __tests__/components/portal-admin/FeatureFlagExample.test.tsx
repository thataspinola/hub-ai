/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// ---------------------------------------------------------------------------
// Mock feature flag hooks — use relative path to avoid @/ alias resolution issue
// ---------------------------------------------------------------------------

const mockUseFeatureFlags = jest.fn()
const mockUseIsEnabled = jest.fn()
const mockUseFlagValue = jest.fn()
const mockUseFlagAttributes = jest.fn()

jest.mock('../../../src/lib/feature-flags/client', () => ({
  useFeatureFlags: () => mockUseFeatureFlags(),
  useIsEnabled: (name: string) => mockUseIsEnabled(name),
  useFlagValue: (name: string, def: unknown) => mockUseFlagValue(name, def),
  useFlagAttributes: (name: string) => mockUseFlagAttributes(name),
}))

import { FeatureFlagExample } from '@/components/portal-admin/FeatureFlagExample'

describe('FeatureFlagExample', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseFeatureFlags.mockReturnValue({ isLoading: false, error: null })
    mockUseIsEnabled.mockReturnValue(false)
    mockUseFlagValue.mockReturnValue('disabled')
    mockUseFlagAttributes.mockReturnValue(null)
  })

  it('renders loading state', () => {
    mockUseFeatureFlags.mockReturnValue({ isLoading: true, error: null })
    render(<FeatureFlagExample />)
    expect(screen.getByText(/carregando feature flags/i)).toBeInTheDocument()
  })

  it('renders main heading when loaded', () => {
    render(<FeatureFlagExample />)
    expect(screen.getByText(/Feature Flags — Exemplo de Uso/i)).toBeInTheDocument()
  })

  it('renders boolean flag section', () => {
    render(<FeatureFlagExample />)
    expect(screen.getByText(/Flag Booleana/i)).toBeInTheDocument()
    expect(screen.getByText(/Desabilitada/i)).toBeInTheDocument()
  })

  it('shows enabled message when boolean flag is true', () => {
    mockUseIsEnabled.mockReturnValue(true)
    render(<FeatureFlagExample />)
    expect(screen.getByText(/Habilitada/i)).toBeInTheDocument()
    expect(screen.getByText(/checkout V2 está ativo/i)).toBeInTheDocument()
  })

  it('renders multivariant flag section', () => {
    mockUseFlagValue.mockImplementation((name: string, def: unknown) => {
      if (name === 'ui_dark_mode') return 'dark'
      if (name === 'new_checkout_v2') return 80
      return def
    })
    render(<FeatureFlagExample />)
    expect(screen.getByText(/Flag Multivariante/i)).toBeInTheDocument()
    expect(screen.getByText('"dark"')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
  })

  it('renders attributes section with attributes present', () => {
    mockUseFlagAttributes.mockReturnValue({ model: 'v3', threshold: 0.8 })
    render(<FeatureFlagExample />)
    expect(screen.getByText(/Atributos da Flag/i)).toBeInTheDocument()
    expect(screen.getByText(/"model"/i)).toBeInTheDocument()
  })

  it('renders "Flag não encontrada" when attributes is null', () => {
    mockUseFlagAttributes.mockReturnValue(null)
    render(<FeatureFlagExample />)
    expect(screen.getByText(/Flag não encontrada/i)).toBeInTheDocument()
  })

  it('renders error message when there is an error', () => {
    mockUseFeatureFlags.mockReturnValue({
      isLoading: false,
      error: new Error('fetch failed'),
    })
    render(<FeatureFlagExample />)
    expect(screen.getByText(/fetch failed/i)).toBeInTheDocument()
  })
})
