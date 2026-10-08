import {
  getFeatureFlags,
  isEnabled,
  getFlagValue,
  getFlagAttributes,
  invalidateCache,
  setCacheTtl,
  setProvider,
} from '@/lib/feature-flags/server';
import type { FeatureFlagDataProvider, FlagValueMap } from '@/lib/feature-flags/types';

// ---------------------------------------------------------------------------
// Mock provider
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
    description: 'Modo escuro',
  },
  rate_limit: {
    enabled: true,
    variant: 100,
    unit: 'req/s',
  },
  config_object: {
    enabled: true,
    variant: { theme: 'dark', density: 'compact' },
    version: 2,
  },
  no_variant_flag: {
    enabled: true,
  },
};

function createMockProvider(): FeatureFlagDataProvider & { fetchCount: number } {
  const provider = {
    fetchCount: 0,
    async fetchFlags(): Promise<FlagValueMap> {
      provider.fetchCount++;
      return mockFlags;
    },
  };
  return provider;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Feature Flags Server Service', () => {
  let mockProvider: ReturnType<typeof createMockProvider>;

  beforeEach(() => {
    mockProvider = createMockProvider();
    setProvider(mockProvider);
    invalidateCache();
    setCacheTtl(30_000);
  });

  afterAll(() => {
    setProvider(null);
    invalidateCache();
  });

  // ── getFeatureFlags ─────────────────────────────────────

  describe('getFeatureFlags()', () => {
    it('retorna o mapa completo de flags', async () => {
      const flags = await getFeatureFlags();
      expect(flags).toEqual(mockFlags);
    });

    it('usa cache na segunda chamada (não re-invoca o provider)', async () => {
      await getFeatureFlags();
      await getFeatureFlags();
      expect(mockProvider.fetchCount).toBe(1);
    });

    it('re-invoca o provider quando o cache expira', async () => {
      setCacheTtl(0); // TTL = 0 → sempre expirado
      await getFeatureFlags();
      await getFeatureFlags();
      expect(mockProvider.fetchCount).toBe(2);
    });

    it('re-invoca o provider após invalidação manual', async () => {
      await getFeatureFlags();
      invalidateCache();
      await getFeatureFlags();
      expect(mockProvider.fetchCount).toBe(2);
    });
  });

  // ── isEnabled ───────────────────────────────────────────

  describe('isEnabled()', () => {
    it('retorna true para flag habilitada', async () => {
      expect(await isEnabled('checkout_v2')).toBe(true);
    });

    it('retorna false para flag desabilitada', async () => {
      expect(await isEnabled('dark_mode')).toBe(false);
    });

    it('retorna false para flag inexistente (fallback seguro)', async () => {
      expect(await isEnabled('nonexistent_flag')).toBe(false);
    });
  });

  // ── getFlagValue ────────────────────────────────────────

  describe('getFlagValue<T>()', () => {
    it('retorna string corretamente', async () => {
      const value = await getFlagValue<string>('checkout_v2', 'default');
      expect(value).toBe('redesign');
    });

    it('retorna number corretamente', async () => {
      const value = await getFlagValue<number>('rate_limit', 0);
      expect(value).toBe(100);
    });

    it('retorna objeto JSON corretamente', async () => {
      const value = await getFlagValue<Record<string, unknown>>('config_object', {});
      expect(value).toEqual({ theme: 'dark', density: 'compact' });
    });

    it('retorna defaultValue quando flag não existe', async () => {
      const value = await getFlagValue<string>('nonexistent', 'fallback');
      expect(value).toBe('fallback');
    });

    it('retorna defaultValue quando flag existe mas não tem variant', async () => {
      const value = await getFlagValue<string>('no_variant_flag', 'default');
      expect(value).toBe('default');
    });
  });

  // ── getFlagAttributes ───────────────────────────────────

  describe('getFlagAttributes()', () => {
    it('retorna atributos sem o campo enabled', async () => {
      const attrs = await getFlagAttributes('checkout_v2');
      expect(attrs).toEqual({
        variant: 'redesign',
        rolloutPercentage: 25,
        owner: 'Engenharia',
      });
      expect(attrs).not.toHaveProperty('enabled');
    });

    it('retorna null para flag inexistente', async () => {
      const attrs = await getFlagAttributes('nonexistent');
      expect(attrs).toBeNull();
    });

    it('retorna objeto vazio para flag sem atributos extras', async () => {
      const attrs = await getFlagAttributes('no_variant_flag');
      expect(attrs).toEqual({});
    });
  });
});
