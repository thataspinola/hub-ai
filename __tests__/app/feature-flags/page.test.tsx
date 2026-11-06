/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SEED_PROJECT_STORE } from '@/lib/feature-flags/crud-storage'

// Mock motion/react (used by FeatureFlagCrud)
jest.mock('motion/react', () => {
  const React = require('react');
  const createProxy = () =>
    new Proxy({}, {
      get: (_: unknown, prop: string) =>
        React.forwardRef(({ children, ...props }: { children?: React.ReactNode; [k: string]: unknown }, ref: React.Ref<HTMLElement>) => {
          const { initial, animate, exit, whileHover, whileTap, transition, layout, variants, ...rest } = props;
          return React.createElement(prop, { ref, ...rest }, children);
        }),
    });
  return {
    motion: createProxy(),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
})

import FeatureFlagAdminPage from '@/app/feature-flags/page'

beforeEach(() => {
  localStorage.clear()
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => SEED_PROJECT_STORE,
  }) as jest.Mock
})

describe('FeatureFlagAdminPage', () => {
  it('renders without crashing', () => {
    render(<FeatureFlagAdminPage />)
    expect(screen.getByText('Feature Flags')).toBeInTheDocument()
  })

  it('renders the project list', async () => {
    render(<FeatureFlagAdminPage />)
    expect(await screen.findByText('consorcio-widget')).toBeInTheDocument()
  })
})
