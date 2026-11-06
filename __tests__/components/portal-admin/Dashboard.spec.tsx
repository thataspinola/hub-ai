import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import { Dashboard } from '@/components/portal-admin/Dashboard'
import { useFeatureFlags } from '@/lib/feature-flags/client'
import { getFormsIndex } from '@/lib/form-wizard/forms-storage'

jest.mock('../../../src/lib/feature-flags/client', () => ({
  useFeatureFlags: jest.fn(),
}))

jest.mock('../../../src/lib/form-wizard/forms-storage', () => ({
  getFormsIndex: jest.fn(),
}))

const mockedUseFeatureFlags = useFeatureFlags as jest.Mock
const mockedGetFormsIndex = getFormsIndex as jest.Mock

const formEntry = (overrides: Record<string, unknown> = {}) => ({
  id: 'f1',
  name: 'Cadastro',
  slug: 'cadastro',
  updatedAt: '2026-01-01T00:00:00.000Z',
  stepsCount: 3,
  ...overrides,
})

describe('Dashboard', () => {
  beforeEach(() => {
    mockedUseFeatureFlags.mockReturnValue({
      flags: {
        a: { enabled: true },
        b: { enabled: false },
      },
      isLoading: false,
      error: null,
    })
    mockedGetFormsIndex.mockReturnValue([])
  })

  it('renders the heading and quick actions', () => {
    render(<Dashboard />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Painel administrativo' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Criar formulário/i })
    ).toHaveAttribute('href', '/form-wizard/new')
  })

  it('renders indicator cards with flag and form totals', () => {
    mockedGetFormsIndex.mockReturnValue([
      formEntry(),
      formEntry({ id: 'f2', slug: 'outro', name: 'Outro', stepsCount: 2 }),
    ])

    render(<Dashboard />)

    const indicators = screen.getByRole('region', { name: 'Indicadores' })
    expect(within(indicators).getByText('Formulários criados')).toBeInTheDocument()
    expect(within(indicators).getByText('Etapas configuradas')).toBeInTheDocument()
    expect(within(indicators).getByText('5')).toBeInTheDocument()
    expect(within(indicators).getByText('Flags disponíveis')).toBeInTheDocument()
    expect(within(indicators).getByText('Flags habilitadas')).toBeInTheDocument()
    expect(within(indicators).getAllByText('2')).toHaveLength(2)
  })

  it('shows the empty state when there are no saved forms', () => {
    render(<Dashboard />)
    expect(
      screen.getByText(/Nenhum formulário criado ainda/)
    ).toBeInTheDocument()
  })

  it('lists the most recent forms with links to them', () => {
    mockedGetFormsIndex.mockReturnValue([
      formEntry({ id: 'old', name: 'Antigo', slug: 'antigo', updatedAt: '2025-01-01T00:00:00.000Z', stepsCount: 1 }),
      formEntry({ id: 'new', name: 'Novo', slug: 'novo', updatedAt: '2026-06-01T00:00:00.000Z', stepsCount: 4 }),
    ])

    render(<Dashboard />)

    const chart = screen.getByRole('region', { name: 'Gráfico de formulários' })
    const links = within(chart).getAllByRole('link')
    expect(links[0]).toHaveTextContent('Novo')
    expect(links[0]).toHaveAttribute('href', '/form-wizard/novo')
    expect(within(chart).getByText('4 etapas')).toBeInTheDocument()
  })

  it('renders the flag distribution with enabled and disabled counts', () => {
    render(<Dashboard />)

    const chart = screen.getByRole('region', { name: 'Gráfico de feature flags' })
    expect(within(chart).getByText('Habilitadas')).toBeInTheDocument()
    expect(within(chart).getByText('Desabilitadas')).toBeInTheDocument()
    expect(within(chart).getByText('1', { selector: 'p.text-2xl.font-bold.text-sky-700' })).toBeInTheDocument()
  })

  it('shows loading placeholders while flags are loading', () => {
    mockedUseFeatureFlags.mockReturnValue({ flags: {}, isLoading: true, error: null })

    render(<Dashboard />)

    expect(screen.getAllByText('Carregando flags…')).not.toHaveLength(0)
  })

  it('shows an alert and unavailable indicators when flags fail to load', () => {
    mockedUseFeatureFlags.mockReturnValue({
      flags: {},
      isLoading: false,
      error: new Error('down'),
    })

    render(<Dashboard />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível consultar as flags.'
    )
    expect(screen.getAllByText('Indisponível')).toHaveLength(2)
    expect(screen.getByText('Erro ao carregar provedor')).toBeInTheDocument()
  })

  it('shows the no-flags message when the provider has no flags', () => {
    mockedUseFeatureFlags.mockReturnValue({ flags: {}, isLoading: false, error: null })

    render(<Dashboard />)

    expect(
      screen.getByText('Nenhuma flag disponível no provedor.')
    ).toBeInTheDocument()
  })

  it('renders the quick access modules', () => {
    render(<Dashboard />)

    const modules = screen.getByRole('region', { name: 'Módulos disponíveis' })
    expect(within(modules).getByRole('heading', { name: 'Feature Flags' })).toBeInTheDocument()
    expect(within(modules).getByRole('link', { name: /Clientes/ })).toHaveAttribute('href', '/clientes')
  })
})
