/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}))

import SessionProviderWrapper from '@/components/session-provider-wrapper'

describe('SessionProviderWrapper', () => {
  it('renders children inside the session provider', () => {
    render(
      <SessionProviderWrapper>
        <span>child content</span>
      </SessionProviderWrapper>,
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('wraps content in the session provider element', () => {
    render(
      <SessionProviderWrapper>
        <span>test</span>
      </SessionProviderWrapper>,
    )
    expect(screen.getByTestId('session-provider')).toBeInTheDocument()
  })
})
