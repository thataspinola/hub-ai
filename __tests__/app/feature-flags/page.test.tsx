/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

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
})

describe('FeatureFlagAdminPage', () => {
  it('renders without crashing', () => {
    render(<FeatureFlagAdminPage />)
    expect(screen.getByText('Gerenciamento de Feature Flags')).toBeInTheDocument()
  })

  it('renders the tab navigation', () => {
    render(<FeatureFlagAdminPage />)
    expect(screen.getByText('Booleanas')).toBeInTheDocument()
  })
})
