/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  FeatureFlagProvider,
  useFeatureFlags,
  useIsEnabled,
  useFlagValue,
  useFlagAttributes,
} from '@/lib/feature-flags/client';
import type { FeatureFlagDataProvider, FlagValueMap } from '@/lib/feature-flags/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockFlags: FlagValueMap = {
  checkout_v2: {
    enabled: true,
    variant: 'redesign',
    rolloutPercentage: 25,
    owner: 'Engenharia',
  },
  dark_mode: {
    enabled: false,
    variant: 'disabled',
  },
  rate_limit: {
    enabled: true,
    variant: 100,
  },
};

function createMockProvider(
  flags: FlagValueMap = mockFlags,
): FeatureFlagDataProvider & { fetchCount: number } {
  const provider = {
    fetchCount: 0,
    async fetchFlags(): Promise<FlagValueMap> {
      provider.fetchCount++;
      return flags;
    },
  };
  return provider;
}

function createFailingProvider(error: Error): FeatureFlagDataProvider {
  return {
    async fetchFlags(): Promise<FlagValueMap> {
      throw error;
    },
  };
}

/** Componente de teste que exibe dados dos hooks. */
function TestConsumer() {
  const { isLoading, error, flags } = useFeatureFlags();
  const checkoutEnabled = useIsEnabled('checkout_v2');
  const darkModeVariant = useFlagValue<string>('dark_mode', 'default');
  const rateLimit = useFlagValue<number>('rate_limit', 0);
  const nonexistentValue = useFlagValue<string>('nonexistent', 'fallback');
  const checkoutAttrs = useFlagAttributes('checkout_v2');
  const nonexistentAttrs = useFlagAttributes('nonexistent');

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="error">{error?.message ?? 'none'}</span>
      <span data-testid="flag-count">{Object.keys(flags).length}</span>
      <span data-testid="checkout-enabled">{String(checkoutEnabled)}</span>
      <span data-testid="dark-mode-variant">{darkModeVariant}</span>
      <span data-testid="rate-limit">{rateLimit}</span>
      <span data-testid="nonexistent-value">{nonexistentValue}</span>
      <span data-testid="checkout-attrs">
        {checkoutAttrs ? JSON.stringify(checkoutAttrs) : 'null'}
      </span>
      <span data-testid="nonexistent-attrs">
        {nonexistentAttrs ? JSON.stringify(nonexistentAttrs) : 'null'}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('FeatureFlagProvider & Hooks (Client-Side)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Provider ────────────────────────────────────────────

  describe('FeatureFlagProvider', () => {
    it('renderiza children', async () => {
      const provider = createMockProvider();

      await act(async () => {
        render(
          <FeatureFlagProvider provider={provider} pollingInterval={0}>
            <span>child</span>
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByText('child')).toBeInTheDocument();
    });

    it('carrega flags no mount e atualiza estado', async () => {
      const provider = createMockProvider();

      await act(async () => {
        render(
          <FeatureFlagProvider provider={provider} pollingInterval={0}>
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('flag-count')).toHaveTextContent('3');
    });

    it('aceita initialFlags e não faz fetch', async () => {
      const provider = createMockProvider();

      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={provider}
            pollingInterval={0}
            initialFlags={mockFlags}
          >
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(provider.fetchCount).toBe(0);
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('flag-count')).toHaveTextContent('3');
    });
  });

  // ── useIsEnabled ────────────────────────────────────────

  describe('useIsEnabled()', () => {
    it('retorna true para flag habilitada', async () => {
      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={createMockProvider()}
            pollingInterval={0}
          >
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('checkout-enabled')).toHaveTextContent('true');
    });

    it('retorna false para flag inexistente', async () => {
      function InlineConsumer() {
        const enabled = useIsEnabled('nonexistent');
        return <span data-testid="result">{String(enabled)}</span>;
      }

      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={createMockProvider()}
            pollingInterval={0}
          >
            <InlineConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('result')).toHaveTextContent('false');
    });
  });

  // ── useFlagValue ────────────────────────────────────────

  describe('useFlagValue<T>()', () => {
    it('retorna valor string da flag', async () => {
      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={createMockProvider()}
            pollingInterval={0}
          >
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('dark-mode-variant')).toHaveTextContent('disabled');
    });

    it('retorna valor number da flag', async () => {
      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={createMockProvider()}
            pollingInterval={0}
          >
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('rate-limit')).toHaveTextContent('100');
    });

    it('retorna defaultValue quando flag não existe', async () => {
      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={createMockProvider()}
            pollingInterval={0}
          >
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('nonexistent-value')).toHaveTextContent('fallback');
    });
  });

  // ── useFlagAttributes ───────────────────────────────────

  describe('useFlagAttributes()', () => {
    it('retorna atributos sem o campo enabled', async () => {
      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={createMockProvider()}
            pollingInterval={0}
          >
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      const attrs = JSON.parse(
        screen.getByTestId('checkout-attrs').textContent!,
      );
      expect(attrs).toEqual({
        variant: 'redesign',
        rolloutPercentage: 25,
        owner: 'Engenharia',
      });
      expect(attrs).not.toHaveProperty('enabled');
    });

    it('retorna null para flag inexistente', async () => {
      await act(async () => {
        render(
          <FeatureFlagProvider
            provider={createMockProvider()}
            pollingInterval={0}
          >
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('nonexistent-attrs')).toHaveTextContent('null');
    });
  });

  // ── Estado de erro ──────────────────────────────────────

  describe('Estado de erro', () => {
    it('expõe error quando fetch falha', async () => {
      const failingProvider = createFailingProvider(new Error('Network error'));

      await act(async () => {
        render(
          <FeatureFlagProvider provider={failingProvider} pollingInterval={0}>
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('mantém último estado válido quando polling falha', async () => {
      let callCount = 0;
      const flakyProvider: FeatureFlagDataProvider = {
        async fetchFlags() {
          callCount++;
          if (callCount === 1) return mockFlags;
          throw new Error('Transient error');
        },
      };

      await act(async () => {
        render(
          <FeatureFlagProvider provider={flakyProvider} pollingInterval={1000}>
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      // Após o fetch inicial, flags estão disponíveis
      expect(screen.getByTestId('flag-count')).toHaveTextContent('3');
      expect(screen.getByTestId('error')).toHaveTextContent('none');

      // Avança o timer para disparar o polling
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Após o polling falhar, flags são mantidas, mas error é atualizado
      expect(screen.getByTestId('flag-count')).toHaveTextContent('3');
      expect(screen.getByTestId('error')).toHaveTextContent('Transient error');
    });
  });

  // ── Polling ─────────────────────────────────────────────

  describe('Polling', () => {
    it('re-fetches após o intervalo de polling', async () => {
      const updatedFlags: FlagValueMap = {
        ...mockFlags,
        new_flag: { enabled: true, variant: 'new' },
      };

      let callCount = 0;
      const dynamicProvider: FeatureFlagDataProvider = {
        async fetchFlags() {
          callCount++;
          if (callCount === 1) return mockFlags;
          return updatedFlags;
        },
      };

      await act(async () => {
        render(
          <FeatureFlagProvider provider={dynamicProvider} pollingInterval={5000}>
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      expect(screen.getByTestId('flag-count')).toHaveTextContent('3');

      // Avança o timer para disparar o polling
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      expect(screen.getByTestId('flag-count')).toHaveTextContent('4');
      expect(callCount).toBe(2);
    });

    it('não faz polling quando pollingInterval é 0', async () => {
      const provider = createMockProvider();

      await act(async () => {
        render(
          <FeatureFlagProvider provider={provider} pollingInterval={0}>
            <TestConsumer />
          </FeatureFlagProvider>,
        );
      });

      await act(async () => {
        jest.advanceTimersByTime(60_000); // Avança 1 minuto
      });

      // Apenas o fetch inicial (1 chamada)
      expect(provider.fetchCount).toBe(1);
    });
  });

  // ── Hook sem Provider ───────────────────────────────────

  describe('Hook sem Provider', () => {
    it('lança erro quando usado fora do FeatureFlagProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      function Orphan() {
        useFeatureFlags();
        return null;
      }

      expect(() => render(<Orphan />)).toThrow(
        'useFeatureFlags deve ser usado dentro de <FeatureFlagProvider>',
      );

      consoleSpy.mockRestore();
    });
  });
});
