/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockSignIn = jest.fn()
const mockSignOut = jest.fn()
let mockSession: { data: unknown; status: string } = {
  data: null,
  status: 'unauthenticated',
}

jest.mock('next-auth/react', () => ({
  useSession: () => mockSession,
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

// Mock the fetch global for keycloak logout
global.fetch = jest.fn().mockResolvedValue({ ok: true }) as jest.Mock

import Auth from '@/components/auth'

describe('Auth component', () => {
  const originalEnv = process.env
  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders loading state', () => {
    mockSession = { data: null, status: 'loading' }
    render(<Auth />)
    expect(screen.getByText('Verificando sessão…')).toBeInTheDocument()
  })

  it('renders corporate login when no session', () => {
    mockSession = { data: null, status: 'unauthenticated' }
    render(<Auth />)
    expect(
      screen.getByRole('button', { name: 'Login corporativo' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull()
  })

  it('calls signIn with keycloak on corporate login click', () => {
    mockSession = { data: null, status: 'unauthenticated' }
    render(<Auth />)
    fireEvent.click(screen.getByText('Login corporativo'))
    expect(mockSignIn).toHaveBeenCalledWith('keycloak')
  })

  it('shows the demo login only in development with the demo flag', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'development',
      NEXT_PUBLIC_HUB_AI_LOCAL_DEMO_AUTH: 'true',
    }
    mockSession = { data: null, status: 'unauthenticated' }
    render(<Auth />)
    fireEvent.click(screen.getByText('Entrar como demo'))
    expect(mockSignIn).toHaveBeenCalledWith('local-demo')
  })

  it('hides the demo login outside development', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      NEXT_PUBLIC_HUB_AI_LOCAL_DEMO_AUTH: 'true',
    }
    mockSession = { data: null, status: 'unauthenticated' }
    render(<Auth />)
    expect(screen.queryByText('Entrar como demo')).toBeNull()
  })

  it('renders the user name and logout button when a session exists', () => {
    mockSession = {
      data: {
        user: { name: 'Test User' },
        access_token: 'tok',
        id_token: 'id',
      },
      status: 'authenticated',
    }

    render(<Auth />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('falls back to a generic name when the session has no user name', () => {
    mockSession = { data: { user: {} }, status: 'authenticated' }
    render(<Auth />)
    expect(screen.getByText('Usuário')).toBeInTheDocument()
  })

  it('treats a session with an error as unauthenticated', () => {
    mockSession = {
      data: { error: 'RefreshAccessTokenError' },
      status: 'authenticated',
    }
    render(<Auth />)
    expect(
      screen.getByRole('button', { name: 'Login corporativo' })
    ).toBeInTheDocument()
  })

  it('marks demo sessions and skips the provider logout request', async () => {
    mockSignOut.mockResolvedValue(undefined)
    mockSession = {
      data: { user: { name: 'Demo' }, local_demo: true },
      status: 'authenticated',
    }

    render(<Auth />)
    expect(screen.getByText('Demo · Demo')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
    await flushPromises()

    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockSignOut).toHaveBeenCalledWith({
      callbackUrl: '/react-ssr-corp-hubv-painel-administrativo',
    })
  })

  it('calls the logout endpoint and signOut on logout click', async () => {
    mockSignOut.mockResolvedValue(undefined)

    mockSession = {
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    }

    render(<Auth />)
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
    await flushPromises()

    expect(global.fetch).toHaveBeenCalledWith(
      '/react-ssr-corp-hubv-painel-administrativo/api/auth/logout',
      { method: 'POST' }
    )
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('shows a warning when the provider logout responds with an error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })
    mockSignOut.mockResolvedValue(undefined)
    mockSession = { data: { user: {} }, status: 'authenticated' }

    render(<Auth />)
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
    await flushPromises()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'O logout no provedor falhou; encerrando a sessão local.'
    )
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('shows an error alert when logout fails unexpectedly', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'))
    mockSession = { data: { user: {} }, status: 'authenticated' }

    render(<Auth />)
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
    await flushPromises()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível encerrar a sessão. Tente novamente.'
    )
    expect(mockSignOut).not.toHaveBeenCalled()
  })
})

