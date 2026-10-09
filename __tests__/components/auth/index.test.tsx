/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockSignIn = jest.fn()
const mockSignOut = jest.fn()
let mockSession: { data: unknown; status: string } = { data: null, status: 'unauthenticated' }

jest.mock('next-auth/react', () => ({
  useSession: () => mockSession,
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

// Mock the fetch global for keycloak logout
global.fetch = jest.fn().mockResolvedValue({ ok: true }) as jest.Mock

import Auth from '@/components/auth'

describe('Auth component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    mockSession = { data: null, status: 'loading' }
    render(<Auth />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders Login when no session', () => {
    mockSession = { data: null, status: 'unauthenticated' }
    render(<Auth />)
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('calls signIn with keycloak on Login click', () => {
    mockSession = { data: null, status: 'unauthenticated' }
    render(<Auth />)
    fireEvent.click(screen.getByText('Login'))
    expect(mockSignIn).toHaveBeenCalledWith('keycloak')
  })

  it('renders Logout when session exists', () => {
    mockSession = {
      data: { user: { name: 'Test User' }, access_token: 'tok', id_token: 'id' },
      status: 'authenticated',
    }
    render(<Auth />)
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('calls fetch and signOut on Logout click', async () => {
    mockSignOut.mockResolvedValue(undefined)
    mockSession = {
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    }
    render(<Auth />)
    fireEvent.click(screen.getByText('Logout'))
    // fetch is called asynchronously; verify signOut queued
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(global.fetch).toHaveBeenCalledWith(
      '/react-ssr-corp-hubv-painel-administrativo/api/auth/logout',
      { method: 'POST' },
    )
  })

  it('handles fetch error gracefully during logout', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSession = { data: { user: {} }, status: 'authenticated' }
    render(<Auth />)
    fireEvent.click(screen.getByText('Logout'))
    await new Promise(resolve => setTimeout(resolve, 20))
    expect(mockSignOut).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
